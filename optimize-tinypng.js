const fs = require('fs').promises;
const path = require('path');
const https = require('https');

const inputDir = './img';
const outputDir = './img-optimized';
const TINYPNG_API_KEY = ''; // 需要填写你的TinyPNG API key

async function compressWithTinyPNG(inputBuffer) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            hostname: 'api.tinify.com',
            path: '/shrink',
            auth: `api:${TINYPNG_API_KEY}`,
            headers: {
                'Content-Type': 'application/octet-stream',
            },
        };

        const req = https.request(options, (res) => {
            if (res.statusCode === 201) {
                res.on('data', (body) => {
                    const data = JSON.parse(body);
                    resolve(data.output.url);
                });
            } else {
                res.on('data', (body) => {
                    reject(new Error(`压缩失败: ${body}`));
                });
            }
        });

        req.on('error', reject);
        req.write(inputBuffer);
        req.end();
    });
}

async function downloadFile(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        }).on('error', reject);
    });
}

async function processImage(inputFile) {
    const fileName = path.parse(inputFile).name;
    const inputPath = path.join(inputDir, inputFile);
    const outputPath = path.join(outputDir, `${fileName}.webp`);

    try {
        const inputBuffer = await fs.readFile(inputPath);
        console.log(`处理文件: ${inputFile}`);
        
        // 使用TinyPNG压缩
        const compressedUrl = await compressWithTinyPNG(inputBuffer);
        console.log(`✓ 已压缩: ${inputFile}`);
        
        // 下载压缩后的文件
        const compressedBuffer = await downloadFile(compressedUrl);
        await fs.writeFile(outputPath, compressedBuffer);
        console.log(`✓ 已保存: ${outputPath}`);
        
        return true;
    } catch (error) {
        console.error(`处理 ${inputFile} 时出错:`, error);
        return false;
    }
}

async function batchOptimize() {
    try {
        await fs.mkdir(outputDir, { recursive: true });
        
        const files = await fs.readdir(inputDir);
        const imageFiles = files.filter(file => 
            ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
        );
        
        console.log(`找到 ${imageFiles.length} 个图片文件`);
        console.log('开始批量处理...\n');
        
        // 串行处理以避免API限制
        let successCount = 0;
        for (const file of imageFiles) {
            const success = await processImage(file);
            if (success) successCount++;
            // 添加延迟以遵守API限制
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log(`\n处理完成！`);
        console.log(`成功: ${successCount} 个`);
        console.log(`失败: ${imageFiles.length - successCount} 个`);
        
    } catch (error) {
        console.error('批处理过程中出错:', error);
    }
}

// 检查API密钥
if (!TINYPNG_API_KEY) {
    console.error('请先设置 TINYPNG_API_KEY');
    process.exit(1);
}

batchOptimize(); 
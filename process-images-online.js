const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const FormData = require('form-data');

const inputDir = './img';
const outputDir = './img-optimized';
const sizes = {
    sm: 640,
    md: 1024,
    lg: 1920
};

// 使用免费的图片处理API
const API_ENDPOINT = 'https://api.resmush.it/ws.php';

// 下载文件
async function downloadFile(url, outputPath) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`下载失败: ${response.statusCode}`));
                return;
            }
            const file = fs.createWriteStream(outputPath);
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', reject);
    });
}

// 压缩图片
async function compressImage(inputPath) {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('files', fs.createReadStream(inputPath));

        const options = {
            method: 'POST',
            headers: form.getHeaders(),
        };

        const req = https.request(API_ENDPOINT, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result.dest);
                } catch (error) {
                    reject(error);
                }
            });
        });

        form.pipe(req);
        req.on('error', reject);
    });
}

async function processImages() {
    try {
        // 创建输出目录
        await fs.mkdir(outputDir, { recursive: true });
        
        // 读取所有图片
        const files = await fs.readdir(inputDir);
        const imageFiles = files.filter(file => 
            ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
        );
        
        console.log(`找到 ${imageFiles.length} 个图片文件`);
        
        for (const file of imageFiles) {
            const fileName = path.parse(file).name;
            const inputPath = path.join(inputDir, file);
            
            try {
                console.log(`处理文件: ${file}`);
                
                // 压缩原始图片
                const compressedUrl = await compressImage(inputPath);
                
                // 下载并保存不同尺寸的版本
                for (const [size, width] of Object.entries(sizes)) {
                    const outputPath = path.join(outputDir, `${fileName}-${size}.jpg`);
                    await downloadFile(compressedUrl, outputPath);
                    console.log(`✓ 已生成 ${fileName}-${size}.jpg`);
                }
            } catch (error) {
                console.error(`处理 ${file} 时出错:`, error);
            }
            
            // 添加延迟以避免API限制
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log('\n处理完成！');
        
    } catch (error) {
        console.error('处理过程中出错:', error);
    }
}

// 安装依赖并运行
console.log('正在安装依赖...');
require('child_process').execSync('npm install form-data --save', { stdio: 'inherit' });
console.log('开始处理图片...\n');
processImages(); 
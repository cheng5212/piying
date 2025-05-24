const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const inputDir = './img';
const outputDir = './img-optimized';
const sizes = {
    sm: 640,
    md: 1024,
    lg: 1920
};

const quality = 80;

async function processImage(inputFile) {
    const fileName = path.parse(inputFile).name;
    const inputPath = path.join(inputDir, inputFile);
    
    try {
        // 创建WebP版本
        for (const [size, width] of Object.entries(sizes)) {
            const outputName = `${fileName}-${size}.webp`;
            const outputPath = path.join(outputDir, outputName);
            
            await sharp(inputPath)
                .resize(width, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .webp({
                    quality: quality,
                    effort: 4
                })
                .toFile(outputPath);
            
            console.log(`✓ 已生成 ${outputName}`);
        }
        
        return true;
    } catch (error) {
        console.error(`处理 ${inputFile} 时出错:`, error);
        return false;
    }
}

async function batchOptimize() {
    try {
        // 确保输出目录存在
        await fs.mkdir(outputDir, { recursive: true });
        
        // 读取所有图片文件
        const files = await fs.readdir(inputDir);
        const imageFiles = files.filter(file => 
            ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
        );
        
        console.log(`找到 ${imageFiles.length} 个图片文件`);
        console.log('开始批量处理...\n');
        
        // 并行处理所有图片
        const results = await Promise.all(
            imageFiles.map(file => processImage(file))
        );
        
        const successCount = results.filter(Boolean).length;
        console.log(`\n处理完成！`);
        console.log(`成功: ${successCount} 个`);
        console.log(`失败: ${imageFiles.length - successCount} 个`);
        
    } catch (error) {
        console.error('批处理过程中出错:', error);
    }
}

// 开始处理
batchOptimize(); 
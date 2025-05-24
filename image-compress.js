const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const inputDir = './img';
const outputDir = './img-compressed';

// 定义不同尺寸
const sizes = {
    sm: 640,
    md: 1024,
    lg: 1920
};

async function compressImages() {
    try {
        // 创建输出目录
        await fs.mkdir(outputDir, { recursive: true });
        
        // 读取所有图片文件
        const files = await fs.readdir(inputDir);
        
        for (const file of files) {
            const inputPath = path.join(inputDir, file);
            const stats = await fs.stat(inputPath);
            
            // 跳过非文件
            if (!stats.isFile()) continue;
            
            // 检查是否是图片文件
            const ext = path.extname(file).toLowerCase();
            if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
            
            const fileName = path.parse(file).name;
            
            // 为每个尺寸生成WebP格式
            for (const [size, width] of Object.entries(sizes)) {
                const suffix = size === 'lg' ? '' : `-${size}`;
                const outputPath = path.join(outputDir, `${fileName}${suffix}.webp`);
                
                await sharp(inputPath)
                    .resize(width, null, {
                        withoutEnlargement: true,
                        fit: 'inside'
                    })
                    .webp({
                        quality: 80,
                        effort: 6
                    })
                    .toFile(outputPath);
                
                console.log(`已生成 ${size} 尺寸: ${outputPath}`);
            }
            
            // 生成原始格式的压缩版本
            const outputJpg = path.join(outputDir, file);
            await sharp(inputPath)
                .resize(sizes.lg, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .jpeg({
                    quality: 85,
                    progressive: true
                })
                .toFile(outputJpg);
            
            console.log(`已生成压缩JPG: ${outputJpg}`);
        }
        
        console.log('所有图片处理完成！');
    } catch (error) {
        console.error('处理过程中出错:', error);
    }
}

compressImages(); 
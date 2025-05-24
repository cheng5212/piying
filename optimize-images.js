const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './img';
const outputDir = './img-optimized';

// 创建输出目录
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// 优化设置
const settings = {
    jpeg: {
        quality: 80,
        progressive: true
    },
    webp: {
        quality: 75
    }
};

// 处理所有图片
fs.readdir(inputDir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        const inputPath = path.join(inputDir, file);
        const fileExt = path.extname(file).toLowerCase();
        
        // 只处理图片文件
        if (['.jpg', '.jpeg', '.png'].includes(fileExt)) {
            const fileName = path.basename(file, fileExt);
            
            // 转换为JPEG
            sharp(inputPath)
                .resize(1920, null, { // 限制最大宽度为1920px
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .jpeg(settings.jpeg)
                .toFile(path.join(outputDir, `${fileName}.jpg`))
                .catch(err => console.error(`Error processing ${file} to JPEG:`, err));

            // 同时生成WebP版本
            sharp(inputPath)
                .resize(1920, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .webp(settings.webp)
                .toFile(path.join(outputDir, `${fileName}.webp`))
                .catch(err => console.error(`Error processing ${file} to WebP:`, err));
        }
    });
}); 
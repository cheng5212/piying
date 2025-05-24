const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const inputDir = './img';
const outputDir = './img-optimized';
const sizes = {
    sm: 640,
    md: 1024,
    lg: 1920
};

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
            
            // 使用 magick 命令处理每个尺寸
            for (const [size, width] of Object.entries(sizes)) {
                const outputPath = path.join(outputDir, `${fileName}-${size}.webp`);
                const cmd = `magick "${inputPath}" -resize ${width}x -quality 80 "${outputPath}"`;
                
                try {
                    execSync(cmd);
                    console.log(`✓ 已生成 ${fileName}-${size}.webp`);
                } catch (error) {
                    console.error(`处理 ${file} 时出错:`, error);
                }
            }
        }
        
        console.log('\n处理完成！');
        
    } catch (error) {
        console.error('处理过程中出错:', error);
    }
}

processImages(); 
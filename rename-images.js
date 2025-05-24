const fs = require('fs').promises;
const path = require('path');

const inputDir = './img-temp';  // 存放Squoosh处理后的图片的临时目录
const outputDir = './img-optimized';
const sizes = ['sm', 'md', 'lg'];

async function renameImages() {
    try {
        // 确保输出目录存在
        await fs.mkdir(outputDir, { recursive: true });
        
        // 读取临时目录中的所有文件
        const files = await fs.readdir(inputDir);
        
        // 过滤出WebP文件
        const webpFiles = files.filter(file => file.endsWith('.webp'));
        
        console.log(`找到 ${webpFiles.length} 个WebP文件`);
        
        // 按文件名分组
        const groups = {};
        webpFiles.forEach(file => {
            const baseName = file.replace(/-[^-]*.webp$/, '');
            if (!groups[baseName]) {
                groups[baseName] = [];
            }
            groups[baseName].push(file);
        });
        
        // 处理每组文件
        for (const [baseName, files] of Object.entries(groups)) {
            if (files.length !== 3) {
                console.warn(`警告: ${baseName} 没有3个尺寸版本`);
                continue;
            }
            
            // 重命名并移动文件
            for (let i = 0; i < files.length; i++) {
                const oldPath = path.join(inputDir, files[i]);
                const newPath = path.join(outputDir, `${baseName}-${sizes[i]}.webp`);
                await fs.rename(oldPath, newPath);
                console.log(`✓ 已重命名: ${files[i]} -> ${baseName}-${sizes[i]}.webp`);
            }
        }
        
        console.log('\n处理完成！');
        
    } catch (error) {
        console.error('重命名过程中出错:', error);
    }
}

// 开始处理
renameImages(); 
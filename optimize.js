const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const { exec } = require('child_process');

const inputDir = './img';
const outputDir = './img-optimized';

// 使用TinyPNG API压缩图片
const TINYPNG_API_KEY = ''; // 需要填写你的TinyPNG API key

async function optimizeImages() {
    try {
        // 创建输出目录
        await fs.mkdir(outputDir, { recursive: true });
        
        // 读取所有图片
        const files = await fs.readdir(inputDir);
        
        // 过滤图片文件
        const imageFiles = files.filter(file => 
            ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
        );
        
        console.log(`找到 ${imageFiles.length} 个图片文件`);
        
        // 生成图片信息文件
        const imageInfo = imageFiles.map(file => ({
            originalName: file,
            originalPath: path.join(inputDir, file),
            sizes: {
                sm: 640,
                md: 1024,
                lg: 1920
            }
        }));
        
        await fs.writeFile(
            path.join(outputDir, 'images.json'),
            JSON.stringify(imageInfo, null, 2)
        );
        
        console.log('已生成图片信息文件');
        console.log('请按照以下步骤手动优化图片：');
        console.log('1. 访问 https://squoosh.app/');
        console.log('2. 为每张图片创建以下版本：');
        console.log('   - 大图(1920px): 文件名-lg.webp');
        console.log('   - 中图(1024px): 文件名-md.webp');
        console.log('   - 小图(640px): 文件名-sm.webp');
        console.log('3. 将优化后的图片放入 img-optimized 目录');
        console.log('4. 运行 node deploy.js 部署图片');
        
    } catch (error) {
        console.error('优化过程中出错:', error);
    }
}

optimizeImages(); 
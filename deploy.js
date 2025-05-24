const fs = require('fs').promises;
const path = require('path');

const GITHUB_USERNAME = 'cheng5212';
const GITHUB_REPO = 'piying';
const CDN_BASE_URL = `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${GITHUB_REPO}`;

async function updateImagePaths() {
    try {
        // 读取图片信息文件
        const imageInfo = JSON.parse(
            await fs.readFile(path.join('./img-optimized', 'images.json'), 'utf-8')
        );
        
        // 更新HTML文件中的图片路径
        let htmlContent = await fs.readFile('index.html', 'utf-8');
        
        // 替换所有图片路径为CDN路径
        imageInfo.forEach(image => {
            const baseName = path.parse(image.originalName).name;
            
            // 替换原始图片路径
            const originalPattern = new RegExp(`img/${image.originalName}`, 'g');
            htmlContent = htmlContent.replace(
                originalPattern,
                `${CDN_BASE_URL}/img-optimized/${baseName}-lg.webp`
            );
            
            // 添加响应式图片源
            const imgTag = `<img src="${CDN_BASE_URL}/img-optimized/${baseName}-lg.webp"`;
            const pictureTag = `<picture>
                <source
                    media="(max-width: 640px)"
                    srcset="${CDN_BASE_URL}/img-optimized/${baseName}-sm.webp"
                >
                <source
                    media="(max-width: 1024px)"
                    srcset="${CDN_BASE_URL}/img-optimized/${baseName}-md.webp"
                >
                <source
                    media="(min-width: 1025px)"
                    srcset="${CDN_BASE_URL}/img-optimized/${baseName}-lg.webp"
                >
                <img src="${CDN_BASE_URL}/img-optimized/${baseName}-lg.webp"`;
            
            htmlContent = htmlContent.replace(imgTag, pictureTag);
        });
        
        // 保存更新后的HTML文件
        await fs.writeFile('index.html', htmlContent);
        console.log('已更新HTML文件中的图片路径');
        
        // 创建或更新README.md
        const readmeContent = `# 宝鸡皮影

这是宝鸡皮影文化展示网站的代码仓库。

## 图片优化说明

- 所有图片均已优化并转换为WebP格式
- 使用响应式图片加载，根据设备屏幕大小加载不同尺寸
- 通过jsDelivr CDN提供图片加速服务
- 实现了图片懒加载和预加载功能

## 部署说明

1. 图片文件位于 \`img-optimized\` 目录
2. 使用jsDelivr CDN：${CDN_BASE_URL}
3. 支持三种图片尺寸：
   - 小图(640px): -sm.webp
   - 中图(1024px): -md.webp
   - 大图(1920px): -lg.webp`;
        
        await fs.writeFile('README.md', readmeContent);
        console.log('已更新README.md文件');
        
    } catch (error) {
        console.error('部署过程中出错:', error);
    }
}

updateImagePaths(); 
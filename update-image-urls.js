const fs = require('fs').promises;
const path = require('path');
const imageUrls = require('./img-optimized/image-urls.json');

// 创建图片URL映射
const urlMap = {};
imageUrls.forEach(image => {
    const fileName = image.file;
    const baseFileName = path.parse(fileName).name;
    urlMap[fileName] = image.urls;
    urlMap[baseFileName] = image.urls;
    
    // 添加不带扩展名的映射
    const nameWithoutExt = baseFileName.replace(/\.[^/.]+$/, "");
    urlMap[nameWithoutExt] = image.urls;
});

async function updateHtmlFiles() {
    const files = ['index.html', 'payment.html', 'purchase.html'];
    
    for (const file of files) {
        try {
            console.log(`正在处理 ${file}...`);
            let content = await fs.readFile(file, 'utf8');
            
            // 修复重复的CDN前缀
            content = content.replace(
                /https:\/\/cdn\.jsdelivr\.net\/gh\/cheng5212\/piying\/https:\/\/cdn\.jsdelivr\.net\/gh\/cheng5212\/piying\//g,
                'https://cdn.jsdelivr.net/gh/cheng5212/piying/'
            );
            
            // 更新旧的图片路径到新的优化路径
            content = content.replace(
                /https:\/\/cdn\.jsdelivr\.net\/gh\/cheng5212\/piying\/img\/([^"'\s]+)\.(webp|jpg|jpeg|png|gif)/g,
                (match, fileName) => {
                    const baseFileName = path.parse(fileName).name;
                    if (urlMap[baseFileName]) {
                        return urlMap[baseFileName].lg;
                    }
                    return match;
                }
            );
            
            // 更新本地图片路径
            content = content.replace(
                /src=["']img\/([^"']+)\.(webp|jpg|jpeg|png|gif)["']/g,
                (match, fileName) => {
                    const baseFileName = path.parse(fileName).name;
                    if (urlMap[baseFileName]) {
                        return `src="${urlMap[baseFileName].lg}"`;
                    }
                    return match;
                }
            );
            
            // 更新img标签
            content = content.replace(
                /<img[^>]*src=[\"']([^\"']+)[\"'][^>]*>/g,
                (match, src) => {
                    const fileName = path.basename(src);
                    const baseFileName = path.parse(fileName).name;
                    
                    if (urlMap[fileName] || urlMap[baseFileName]) {
                        const urls = urlMap[fileName] || urlMap[baseFileName];
                        return `<picture>
    <source media="(min-width: 1024px)" srcset="${urls.lg}" type="image/webp">
    <source media="(min-width: 640px)" srcset="${urls.md}" type="image/webp">
    <img src="${urls.sm}" alt="" loading="lazy" class="w-full h-full object-cover">
</picture>`;
                    }
                    return match;
                }
            );
            
            // 更新背景图片URL
            content = content.replace(
                /background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/g,
                (match, url) => {
                    const fileName = path.basename(url);
                    const baseFileName = path.parse(fileName).name;
                    
                    if (urlMap[fileName] || urlMap[baseFileName]) {
                        const urls = urlMap[fileName] || urlMap[baseFileName];
                        return `background-image: url('${urls.lg}')`;
                    }
                    return match;
                }
            );
            
            // 更新CSS中的其他图片URL
            content = content.replace(
                /url\(['"]?([^'")\s]+)['"]?\)/g,
                (match, url) => {
                    if (url.startsWith('data:')) return match;
                    
                    const fileName = path.basename(url);
                    const baseFileName = path.parse(fileName).name;
                    
                    if (urlMap[fileName] || urlMap[baseFileName]) {
                        const urls = urlMap[fileName] || urlMap[baseFileName];
                        return `url('${urls.lg}')`;
                    }
                    return match;
                }
            );
            
            // 保存更新后的文件
            await fs.writeFile(file, content, 'utf8');
            console.log(`✓ ${file} 更新完成`);
            
        } catch (error) {
            console.error(`处理 ${file} 时出错:`, error);
        }
    }
}

// 运行更新
updateHtmlFiles().then(() => {
    console.log('所有文件更新完成！');
}).catch(error => {
    console.error('更新过程中出错:', error);
}); 
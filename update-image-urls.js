const fs = require('fs').promises;
const path = require('path');
const imageUrls = require('./img-optimized/image-urls.json');

// 创建图片URL映射
const urlMap = {};
imageUrls.forEach(image => {
    const fileName = image.file;
    const baseFileName = path.parse(fileName).name;
    
    // 转换Cloudinary URL为jsDelivr URL
    const urls = {
        sm: `https://cdn.jsdelivr.net/gh/cheng5212/piying/img-optimized/${baseFileName}-sm.webp`,
        md: `https://cdn.jsdelivr.net/gh/cheng5212/piying/img-optimized/${baseFileName}-md.webp`,
        lg: `https://cdn.jsdelivr.net/gh/cheng5212/piying/img-optimized/${baseFileName}-lg.webp`
    };
    
    urlMap[fileName] = urls;
    urlMap[baseFileName] = urls;
    
    // 添加不带扩展名的映射
    const nameWithoutExt = baseFileName.replace(/\.[^/.]+$/, "");
    urlMap[nameWithoutExt] = urls;
});

async function updateFiles() {
    const files = ['index.html', 'payment.html', 'purchase.html', 'Header.js'];
    
    for (const file of files) {
        try {
            console.log(`正在处理 ${file}...`);
            let content = await fs.readFile(file, 'utf8');
            
            // 修复重复的CDN前缀
            content = content.replace(
                /https:\/\/cdn\.jsdelivr\.net\/gh\/cheng5212\/piying\/https:\/\/cdn\.jsdelivr\.net\/gh\/cheng5212\/piying\//g,
                'https://cdn.jsdelivr.net/gh/cheng5212/piying/'
            );
            
            // 更新所有图片URL到优化版本
            content = content.replace(
                /<img[^>]*src=["']([^"']+)["'][^>]*>/g,
                (match, src) => {
                    // 如果是data:URL，保持不变
                    if (src.startsWith('data:')) return match;
                    
                    const fileName = path.basename(src);
                    const baseFileName = path.parse(fileName).name;
                    
                    if (urlMap[baseFileName]) {
                        // 保留原始的class和alt属性
                        const classMatch = match.match(/class=["']([^"']+)["']/);
                        const altMatch = match.match(/alt=["']([^"']+)["']/);
                        const loadingMatch = match.match(/loading=["']([^"']+)["']/);
                        
                        const className = classMatch ? classMatch[1] : '';
                        const alt = altMatch ? altMatch[1] : '';
                        const loading = loadingMatch ? loadingMatch[1] : 'lazy';
                        
                        return `<picture>
    <source media="(min-width: 1024px)" srcset="${urlMap[baseFileName].lg}" type="image/webp">
    <source media="(min-width: 640px)" srcset="${urlMap[baseFileName].md}" type="image/webp">
    <img src="${urlMap[baseFileName].sm}" alt="${alt}" loading="${loading}" class="${className}">
</picture>`;
                    }
                    return match;
                }
            );
            
            // 更新背景图片
            content = content.replace(
                /background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/g,
                (match, url) => {
                    if (url.startsWith('data:')) return match;
                    
                    const fileName = path.basename(url);
                    const baseFileName = path.parse(fileName).name;
                    
                    if (urlMap[baseFileName]) {
                        return `background-image: url('${urlMap[baseFileName].lg}')`;
                    }
                    return match;
                }
            );
            
            // 更新style属性中的背景图片
            content = content.replace(
                /style=["'][^"']*background-image:\s*url\(['"]?([^'")\s]+)['"]?\)[^"']*["']/g,
                (match, url) => {
                    if (url.startsWith('data:')) return match;
                    
                    const fileName = path.basename(url);
                    const baseFileName = path.parse(fileName).name;
                    
                    if (urlMap[baseFileName]) {
                        return match.replace(url, urlMap[baseFileName].lg);
                    }
                    return match;
                }
            );
            
            // 保存更新后的文件
            await fs.writeFile(file, content, 'utf8');
            console.log(`✓ ${file} 更新完成`);
            
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`跳过不存在的文件: ${file}`);
            } else {
                console.error(`处理 ${file} 时出错:`, error);
            }
        }
    }
}

// 运行更新
updateFiles().then(() => {
    console.log('所有文件更新完成！');
}).catch(error => {
    console.error('更新过程中出错:', error);
}); 
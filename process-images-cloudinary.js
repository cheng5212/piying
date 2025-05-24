require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const path = require('path');

// Cloudinary配置
cloudinary.config({
    cloud_name: 'dulrqfvan',
    api_key: '879281513745196',
    api_secret: 'kM6QWQx6QkvYYSK8DX5nCHrdels'
});

const inputDir = './img';
const outputDir = './img-optimized';
const sizes = {
    sm: 640,
    md: 1024,
    lg: 1920
};

// 添加更多图片格式支持
const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// 添加图片优化选项
const optimizationOptions = {
    webp: {
        quality: 80,
        format: 'webp',
        fetch_format: 'auto',
        strip: true, // 删除元数据
        dpr: 'auto', // 自动检测设备像素比
    }
};

async function uploadAndOptimize(inputPath, fileName) {
    try {
        console.log(`正在上传 ${fileName}...`);
        
        // 上传原始图片
        const result = await cloudinary.uploader.upload(inputPath, {
            public_id: fileName,
            ...optimizationOptions.webp,
            folder: 'piying', // 在Cloudinary中创建文件夹
            use_filename: true, // 使用原始文件名
            unique_filename: false // 不添加随机字符串
        });

        console.log(`✓ 上传成功: ${result.secure_url}`);

        // 生成不同尺寸的URL
        const urls = {};
        for (const [size, width] of Object.entries(sizes)) {
            urls[size] = cloudinary.url(result.public_id, {
                width: width,
                ...optimizationOptions.webp,
                crop: 'scale'
            });
            console.log(`✓ ${size} 版本: ${urls[size]}`);
        }

        // 生成HTML示例代码
        const htmlExample = generateImageHTML(fileName, result.public_id);
        await fs.writeFile(
            path.join(outputDir, `${fileName}-example.html`),
            htmlExample
        );

        // 生成URL映射文件
        const urlMapping = {
            original: result.secure_url,
            ...urls
        };
        await fs.writeFile(
            path.join(outputDir, `${fileName}-urls.json`),
            JSON.stringify(urlMapping, null, 2)
        );

        return true;
    } catch (error) {
        console.error(`处理 ${fileName} 时出错:`, error);
        return false;
    }
}

function generateImageHTML(fileName, publicId) {
    return `
<!-- 响应式图片示例 -->
<picture>
    <source
        media="(min-width: 1024px)"
        srcset="${cloudinary.url(publicId, { ...optimizationOptions.webp, width: sizes.lg })}"
    />
    <source
        media="(min-width: 640px)"
        srcset="${cloudinary.url(publicId, { ...optimizationOptions.webp, width: sizes.md })}"
    />
    <img
        src="${cloudinary.url(publicId, { ...optimizationOptions.webp, width: sizes.sm })}"
        alt="${fileName}"
        loading="lazy"
        width="${sizes.sm}"
        height="auto"
    />
</picture>

<!-- CDN URL -->
<div>
    Small: ${cloudinary.url(publicId, { ...optimizationOptions.webp, width: sizes.sm })}
    Medium: ${cloudinary.url(publicId, { ...optimizationOptions.webp, width: sizes.md })}
    Large: ${cloudinary.url(publicId, { ...optimizationOptions.webp, width: sizes.lg })}
</div>
    `;
}

async function processImages() {
    try {
        // 创建输出目录
        await fs.mkdir(outputDir, { recursive: true });
        
        // 读取所有图片
        const files = await fs.readdir(inputDir);
        const imageFiles = files.filter(file => 
            supportedFormats.includes(path.extname(file).toLowerCase())
        );
        
        if (imageFiles.length === 0) {
            console.log('没有找到图片文件');
            return;
        }
        
        console.log(`找到 ${imageFiles.length} 个图片文件`);
        console.log('开始处理...\n');
        
        // 串行处理所有图片
        let successCount = 0;
        const results = [];
        
        for (const file of imageFiles) {
            const fileName = path.parse(file).name;
            const inputPath = path.join(inputDir, file);
            
            console.log(`\n处理文件: ${file}`);
            const success = await uploadAndOptimize(inputPath, fileName);
            if (success) {
                successCount++;
                results.push({
                    file,
                    status: 'success',
                    urls: {
                        sm: cloudinary.url(`piying/${fileName}`, { ...optimizationOptions.webp, width: sizes.sm }),
                        md: cloudinary.url(`piying/${fileName}`, { ...optimizationOptions.webp, width: sizes.md }),
                        lg: cloudinary.url(`piying/${fileName}`, { ...optimizationOptions.webp, width: sizes.lg })
                    }
                });
            } else {
                results.push({
                    file,
                    status: 'error'
                });
            }
            
            // 添加延迟以避免API限制
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log(`\n处理完成！`);
        console.log(`成功: ${successCount} 个`);
        console.log(`失败: ${imageFiles.length - successCount} 个`);
        
        // 生成汇总报告
        const report = generateReport(imageFiles.length, successCount, results);
        await fs.writeFile(path.join(outputDir, 'optimization-report.txt'), report);
        
        // 生成汇总JSON
        await fs.writeFile(
            path.join(outputDir, 'image-urls.json'),
            JSON.stringify(results, null, 2)
        );
        
    } catch (error) {
        console.error('处理过程中出错:', error);
    }
}

function generateReport(total, success, results) {
    const date = new Date().toLocaleString();
    let report = `
图片优化报告
生成时间: ${date}

总数: ${total}
成功: ${success}
失败: ${total - success}

优化设置:
- 格式: WebP
- 质量: 80%
- 尺寸: 
  - 小图: ${sizes.sm}px
  - 中图: ${sizes.md}px
  - 大图: ${sizes.lg}px
- 其他优化:
  - 移除元数据
  - 自动DPR适配
  - 响应式加载

处理结果:
`;

    results.forEach(result => {
        report += `\n${result.file}: ${result.status}`;
        if (result.status === 'success') {
            report += `\n  小图: ${result.urls.sm}\n  中图: ${result.urls.md}\n  大图: ${result.urls.lg}\n`;
        }
    });

    return report;
}

// 直接运行processImages
processImages(); 
# 宝鸡皮影

这是宝鸡皮影文化展示网站的代码仓库。

## 图片优化说明

- 所有图片均已优化并转换为WebP格式
- 使用响应式图片加载，根据设备屏幕大小加载不同尺寸
- 通过jsDelivr CDN提供图片加速服务
- 实现了图片懒加载和预加载功能

## 部署说明

1. 图片文件位于 `img-optimized` 目录
2. 使用jsDelivr CDN：https://cdn.jsdelivr.net/gh/cheng5212/piying
3. 支持三种图片尺寸：
   - 小图(640px): -sm.webp
   - 中图(1024px): -md.webp
   - 大图(1920px): -lg.webp

# 宝鸡皮影网站图片优化指南

## 图片优化步骤

1. 访问 https://squoosh.app/

2. 对于每张图片：
   - 拖拽图片到Squoosh
   - 选择"WebP"格式
   - 设置质量为80%
   - 创建三个版本：
     * 大图：宽度1920px，保存为 `[原文件名]-lg.webp`
     * 中图：宽度1024px，保存为 `[原文件名]-md.webp`
     * 小图：宽度640px，保存为 `[原文件名]-sm.webp`

3. 优化建议：
   - 保持图片的宽高比
   - 使用有意义的文件名
   - 确保文件名不包含中文和特殊字符

4. 优化顺序：
   - 首页轮播图
   - 产品展示图
   - 工艺展示图
   - 其他图片

5. 文件结构：
   ```
   img-optimized/
   ├── image1-lg.webp
   ├── image1-md.webp
   ├── image1-sm.webp
   ├── image2-lg.webp
   └── ...
   ```

## CDN配置

所有优化后的图片将通过jsDelivr CDN提供：
```
https://cdn.jsdelivr.net/gh/cheng5212/piying/img-optimized/
```

## 响应式加载

网站会根据设备屏幕大小自动加载合适尺寸的图片：
- 移动设备：加载sm版本（640px）
- 平板设备：加载md版本（1024px）
- 桌面设备：加载lg版本（1920px）
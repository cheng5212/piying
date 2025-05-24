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
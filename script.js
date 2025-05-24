// 导入语言包
const languagePack = {
    zh: {
        "logo-text": "宝鸡非遗皮影",
        "nav-home": "首页",
        // ... 其他中文翻译
    },
    en: {
        "logo-text": "Baoji Shadow Puppetry",
        "nav-home": "Home",
        // ... 其他英文翻译
    }
};

// 语言切换功能
document.addEventListener('DOMContentLoaded', function() {
    const langToggle = document.getElementById('lang-toggle');
    let currentLang = localStorage.getItem('preferredLanguage') || 'zh';
    
    // 初始化页面语言
    setLanguage(currentLang);
    
    // 切换语言按钮点击事件
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        setLanguage(currentLang);
        localStorage.setItem('preferredLanguage', currentLang);
    });
    
    // 设置页面语言
    function setLanguage(lang) {
        // 更新按钮文本
        langToggle.textContent = lang === 'zh' ? 'EN' : '中文';
        
        // 更新所有带data-lang-key属性的元素文本
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (languagePack[lang] && languagePack[lang][key]) {
                if (key === 'hero-title') {
                    element.innerHTML = languagePack[lang][key];
                } else {
                    element.textContent = languagePack[lang][key];
                }
            }
        });
    }

    // 产品筛选功能
    const filterButtons = document.querySelectorAll('[data-filter]');
    const productItems = document.querySelectorAll('.product-item');

    // 初始化显示所有产品
    function filterProducts(filter) {
      productItems.forEach(item => {
        const category = item.dataset.category;
        item.style.display = filter === 'all' || category === filter ? 'block' : 'none';
      });
      // 更新按钮激活状态
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
          btn.classList.add('active');
        }
      });
    }

    // 绑定筛选按钮点击事件
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        filterProducts(filter);
      });
    });

    // 初始激活"全部"按钮
    filterProducts('all');

    // 轮播图初始化
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    let currentIndex = 0;
    let intervalId;

    // 自动切换函数
    function autoSwitch() {
      carouselItems[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % carouselItems.length;
      carouselItems[currentIndex].classList.add('active');
    }

    // 启动自动切换
    intervalId = setInterval(autoSwitch, 5000);

    // 手动切换上一张
    prevButton?.addEventListener('click', () => {
      clearInterval(intervalId);
      carouselItems[currentIndex].classList.remove('active');
      currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
      carouselItems[currentIndex].classList.add('active');
      intervalId = setInterval(autoSwitch, 5000);
    });

    // 手动切换下一张
    nextButton?.addEventListener('click', () => {
      clearInterval(intervalId);
      autoSwitch();
      intervalId = setInterval(autoSwitch, 5000);
    });

    // 购买按钮点击事件
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const productName = document.querySelector(`[data-lang-key="products-item${productId}-title"]`).textContent;
        const productImage = button.closest('.product-item').querySelector('img').src;
        window.location.href = `purchase.html?productId=${productId}&productName=${encodeURIComponent(productName)}&productImage=${encodeURIComponent(productImage)}`;
      });
    });

    // 图片加载优化
    class ImageLoader {
        constructor() {
            this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
                root: null,
                rootMargin: '50px',
                threshold: 0.1
            });
            
            this.loadedImages = new Set();
        }

        handleIntersection(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }

        loadImage(img) {
            if (img.dataset.src && !this.loadedImages.has(img.dataset.src)) {
                const tempImage = new Image();
                tempImage.onload = () => {
                    img.src = tempImage.src;
                    img.classList.add('fade-in');
                    img.classList.remove('image-loading');
                    this.loadedImages.add(img.dataset.src);
                };
                tempImage.onerror = () => {
                    handleImageError(img);
                };
                tempImage.src = img.dataset.src;
            }
        }

        observe(img) {
            if (img.dataset.src) {
                img.classList.add('image-loading');
                this.observer.observe(img);
            }
        }
    }

    // 图片加载错误处理
    function handleImageError(img) {
        const fallbackUrl = img.dataset.fallback || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" font-family="Arial" font-size="14" fill="%23666" text-anchor="middle" dy=".3em"%3E图片加载失败%3C/text%3E%3C/svg%3E';
        img.src = fallbackUrl;
        img.classList.add('image-error');
    }

    // 初始化图片加载器
    const imageLoader = new ImageLoader();

    // 处理所有图片
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        const picture = img.closest('picture');
        if (picture) {
            const sources = picture.querySelectorAll('source');
            
            // 处理source标签
            sources.forEach(source => {
                if (source.srcset) {
                    source.dataset.srcset = source.srcset;
                    source.srcset = '';
                }
            });
            
            // 处理img标签
            if (img.src) {
                img.dataset.src = img.src;
                img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                img.classList.add('opacity-0', 'transition-opacity', 'duration-300');
                
                // 使用新的图片加载器
                imageLoader.observe(img);
            }
        }
    });

    // 为所有图片添加错误处理
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.addEventListener('error', () => handleImageError(img));
    });
});
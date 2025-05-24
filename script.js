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
            this.images = document.querySelectorAll('img[data-src]');
            this.options = {
                root: null,
                rootMargin: '50px 0px',
                threshold: 0.1
            };
            this.imageObserver = new IntersectionObserver(this.handleIntersection.bind(this), this.options);
            this.init();
        }

        init() {
            this.images.forEach(image => {
                // 添加加载中的类
                image.classList.add('image-loading');
                
                // 创建低质量的预览图
                if (image.dataset.preview) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'progressive';
                    image.parentNode.insertBefore(wrapper, image);
                    wrapper.appendChild(image);
                    
                    const preview = new Image();
                    preview.src = image.dataset.preview;
                    preview.className = 'preview';
                    wrapper.insertBefore(preview, image);
                }
                
                // 开始观察图片
                this.imageObserver.observe(image);
            });
        }

        handleIntersection(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }

        loadImage(image) {
            const src = image.dataset.src;
            
            // 创建新的Image对象来预加载
            const img = new Image();
            
            img.onload = () => {
                image.src = src;
                image.classList.remove('image-loading');
                image.classList.add('image-loaded');
                
                if (image.parentNode.classList.contains('progressive')) {
                    image.classList.add('reveal');
                }
            };
            
            img.onerror = () => {
                image.src = 'path/to/fallback-image.jpg';
                image.classList.remove('image-loading');
                console.error('Error loading image:', src);
            };
            
            img.src = src;
        }
    }

    // 初始化图片加载器
    document.addEventListener('DOMContentLoaded', () => {
        new ImageLoader();
    });

    // 处理图片加载错误
    function handleImageError(img) {
        img.onerror = null; // 防止无限循环
        img.src = 'path/to/fallback-image.jpg';
        console.error('Image failed to load:', img.dataset.src);
    }

    // 优化背景图片加载
    function loadBackgroundImage(element) {
        const src = element.dataset.bgSrc;
        if (!src) return;

        const img = new Image();
        img.onload = () => {
            element.style.backgroundImage = `url(${src})`;
            element.classList.add('bg-loaded');
        };
        img.src = src;
    }

    // 初始化所有需要懒加载的背景图片
    document.addEventListener('DOMContentLoaded', () => {
        const bgElements = document.querySelectorAll('[data-bg-src]');
        bgElements.forEach(loadBackgroundImage);
    });
});
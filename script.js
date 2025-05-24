import languagePack from './lang.js';

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
        element.textContent = languagePack[lang][key];
      }
    });
    
    // 特别处理HTML内容
    if (lang === 'en') {
      document.querySelector('[data-lang-key="hero-title"]').innerHTML = 'National Intangible Cultural Heritage<br>Baoji Shadow Puppetry';
    } else {
      document.querySelector('[data-lang-key="hero-title"]').innerHTML = '国家级非物质文化遗产<br>宝鸡皮影';
    }
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
});
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
});
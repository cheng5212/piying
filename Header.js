import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  return (
    <header className="fixed w-full top-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center">
          <picture>
    <source media="(min-width: 1024px)" srcset="https://res.cloudinary.com/dulrqfvan/image/upload/dpr_auto,f_auto,q_80,w_1920/v1/piying/4ad3000bc82027b36a8c1d9f5058f66.webp?_a=BAMClqXy0" type="image/webp">
    <source media="(min-width: 640px)" srcset="https://res.cloudinary.com/dulrqfvan/image/upload/dpr_auto,f_auto,q_80,w_1024/v1/piying/4ad3000bc82027b36a8c1d9f5058f66.webp?_a=BAMClqXy0" type="image/webp">
    <img src="https://res.cloudinary.com/dulrqfvan/image/upload/dpr_auto,f_auto,q_80,w_640/v1/piying/4ad3000bc82027b36a8c1d9f5058f66.webp?_a=BAMClqXy0" alt="Logo" loading="lazy" class="w-full h-full object-cover">
</picture>
          <span className="ml-2 text-xl font-bold text-white" data-lang-key="logo-text">
            宝鸡非遗皮影
          </span>
        </a>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header;
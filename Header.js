import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  return (
    <header className="fixed w-full top-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center">
          <img src="img/4ad3000bc82027b36a8c1d9f5058f66.jpg" alt="Logo" className="h-12 w-auto" />
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
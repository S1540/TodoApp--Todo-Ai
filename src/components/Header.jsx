import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Todo-AI",
      link: "/aiAgent",
    },
    {
      name: "Contact",
      link: "/contact",
    },
  ];
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <header className="max-w-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-4 flex items-center justify-between sm:justify-around fixed top-0 left-0 right-0 z-50">
        <div>
          <h1 className="text-2xl font-bold text-white">Todo App</h1>
        </div>
        <nav className="hidden sm:flex gap-5 text-lg">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`transition-all duration-300 ease-in-out hover:text-white font-medium text-white`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        {/* Mobile Menu Button */}
        <div className="sm:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="sm:hidden absolute top-16 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50">
          <nav className="flex flex-col gap-4 py-4 items-center">
            {navItems.map((item, index) => (
              <Link
                key={index}
                onClick={() => setIsOpen(false)}
                to={item.link}
                className={`text-white text-lg font-medium hover:text-gray-200 transition-all `}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;

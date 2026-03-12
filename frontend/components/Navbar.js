"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Navbar() {

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {

    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    setDarkMode(!darkMode);
  };

  return (

    <nav className="
      sticky top-0 z-50
      backdrop-blur-xl
      bg-white/80 dark:bg-gray-900/80
      border-b border-gray-200 dark:border-gray-700
      transition-colors duration-300
    ">

      <div className="max-w-6xl mx-auto px-7 py-4 flex justify-between items-center">


        {/* Logo */}

        <Link href="/">
          <h1
            className="
            text-3xl md:text-4xl
            font-black
            tracking-tight
            bg-gradient-to-r
            from-blue-500 via-purple-500 to-pink-500
            bg-clip-text text-transparent
            drop-shadow-sm
            hover:scale-105
            transition-transform duration-300
            cursor-pointer
            "
            >
            DocProof
            </h1>
        </Link>



        {/* Menu */}

        <div className="flex items-center gap-6 text-gray-700 dark:text-gray-200 font-medium">


          <Link
            href="/"
            className="hover:text-blue-500 transition"
          >
            Home
          </Link>



          {/* Dark Mode Toggle */}

          <button
            onClick={toggleTheme}
            className="
              text-lg
              p-2 rounded-full
              border border-gray-300 dark:border-gray-600
              hover:bg-gray-200 dark:hover:bg-gray-700
              transition
              flex items-center justify-center
            "
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>



          <Link
            href="/login"
            className="hover:text-blue-500 transition"
          >
            Login
          </Link>


          <Link href="/signup">
            <button className="
              bg-green-600
              text-white
              px-4 py-2
              rounded-lg
              hover:bg-green-700
              hover:scale-105
              transition
            ">
              Signup
            </button>
          </Link>


        </div>

      </div>

    </nav>

  );
}
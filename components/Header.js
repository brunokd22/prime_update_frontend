import Link from "next/link";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { IoMoonSharp } from "react-icons/io5";
import { LuSun, LuSunMoon } from "react-icons/lu";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  // Setting Darkmode toggling
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    // check local storage for dark mode preference on initial load
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
  }, []);
  useEffect(() => {
    // apply dark mode styles when darkmode state changes
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", true);
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", false);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const handleLinkClick = (link) => {
    setActiveLink(link);
    setClicked(false);
  };

  useEffect(() => {
    setActiveLink(router.pathname);
  }, [router.pathname]);
  const [mobile, setMobile] = useState(false);

  const handleMobileOpen = () => {
    setMobile(!mobile);
  };
  const handleMobileClose = () => {
    setMobile(false);
  };

  return (
    <>
      <header>
        <nav className="container flex flex-sb">
          <div className="logo flex gap-1">
            <Link href="/">
              <img src="/img/logo_prime_2.png" alt="logo" />
            </Link>
            <h2
              style={{
                color: darkMode ? "black" : "yellow",
              }}
            >
              PRIME<span>UPDATE</span>
            </h2>
          </div>
          <div className="navlist flex gap-2">
            <ul className="flex gap-2">
              <li>
                <Link
                  href="/"
                  onClick={() => handleLinkClick("/")}
                  className={activeLink === "/" ? "active" : ""}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  onClick={() => handleLinkClick("/blogs")}
                  className={activeLink === "/blogs" ? "active" : ""}
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={() => handleLinkClick("/services")}
                  className={activeLink === "/services" ? "active" : ""}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  onClick={() => handleLinkClick("/contact")}
                  className={activeLink === "/contact" ? "active" : ""}
                >
                  Contact
                </Link>
              </li>
            </ul>
            <div className="darkmodetoggle" onClick={toggleDarkMode}>
              {darkMode ? <IoMoonSharp /> : <LuSun />}
            </div>
            <div className="mobiletogglesvg" onClick={handleMobileOpen}>
              <HiMiniBars3BottomRight />
            </div>
          </div>
          <div className={mobile ? "mobilenavlist active" : "mobilenavlist"}>
            <span
              onClick={handleMobileClose}
              className={mobile ? "active" : ""}
            ></span>
            <div className="mobilelogo">
              <img src="/img/logo_prime_1.png" alt="logo" />
              <h2>PRIMEUPDATE</h2>
            </div>
            <ul
              className="flex gap-1 flex-col flex-left mt-3"
              onClick={handleMobileClose}
            >
              <li>
                <Link
                  href="/"
                  onClick={() => handleLinkClick("/")}
                  className={activeLink === "/" ? "active" : ""}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  onClick={() => handleLinkClick("/blogs")}
                  className={activeLink === "/blogs" ? "active" : ""}
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  onClick={() => handleLinkClick("/services")}
                  className={activeLink === "/services" ? "active" : ""}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/contacts"
                  onClick={() => handleLinkClick("/contacts")}
                  className={activeLink === "/contacts" ? "active" : ""}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}

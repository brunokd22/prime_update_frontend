import Link from "next/link";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footersec flex flex-center flex-col gap-2">
          <div className="logo">
            <img src="/img/logo_prime_2.png" alt="" />
          </div>
          <div className="ul flex gap-2">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="#">Services</Link>
            </li>
            <li>
              <Link href="/blogs">Blog</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </div>
          <ul className="hero_social">
            <li>
              <a href="#" target="_blank">
                <FaXTwitter />
              </a>
            </li>
            <li>
              <a href="#" target="_blank">
                <FaWhatsapp />
              </a>
            </li>
            <li>
              <a href="#" target="_blank">
                <FaInstagram />
              </a>
            </li>
            <li>
              <a href="#" target="_blank"></a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}

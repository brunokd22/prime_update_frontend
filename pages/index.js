import Head from "next/head";
import Link from "next/link";
import { FaXTwitter, FaInstagram, FaCalendarDays } from "react-icons/fa6";
import { GoArrowUpRight } from "react-icons/go";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

import { useState, useEffect } from "react";
export default function Home() {
  // active service backgroud color
  const [activeIndex, setActiveIndex] = useState(0);
  const handleHover = (index) => {
    setActiveIndex(index);
  };
  const handleMouseOut = () => {
    setActiveIndex(0); // set
  };

  // services data
  const services = [
    {
      title: "Real-Time News Updates",
      description:
        "PrimeUpdate specializes in delivering timely news across various categories such as politics, business, technology, sports, health, and entertainment.",
    },
    {
      title: "In-Depth Analysis and Opinion Pieces",
      description:
        "Beyond news updates, PrimeUpdate offers comprehensive analysis of complex topics to help readers understand the why behind the headlines",
    },
    {
      title: "Multimedia Content Delivery",
      description:
        "Recognizing the power of visual storytelling, PrimeUpdate delivers news through various multimedia formats, including  podcasts, infographics, and photo essays. This approach caters to different learning preferences, making news accessible and engaging for a broader audience.",
    },
    {
      title: "Advertising and Sponsored Content",
      description:
        "PrimeUpdate provides businesses with a range of advertising options to reach its vast and diverse audience. Through banner ads, sponsored articles, and multimedia promotions, brands can effectively connect with consumers who trust and regularly visit the platform",
    },
  ];

  const [loading, setLoading] = useState(true);
  const [alldata, setAlldata] = useState([]);
  const [allwork, setAllwork] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogsResponse = await fetch("/api/blogs");

        if (!blogsResponse.ok) {
          throw new Error(`Failed to fetch blogs: ${blogsResponse.statusText}`);
        }

        const blogData = await blogsResponse.json();
        setAllwork(blogData); // Update state with the fetched blog data
      } catch (error) {
        console.error("Error Fetching Data:", error.message); // Log error details
      } finally {
        setLoading(false); // Ensure loading state is always updated
      }
    };

    fetchData(); // Call the async function
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    // filter projects based on selectedCategory
    // filter projects based on selectedCategory
    if (selectedCategory === "All") {
      setFilteredProjects(alldata.filter((pro) => pro.status === "publish"));
    } else {
      setFilteredProjects(
        alldata.filter(
          (pro =
            pro.status === "publish" &&
            pro.projectcategory[0] === selectedCategory)
        )
      );
    }
  }, [selectedCategory, alldata]);

  const formatDate = (date) => {
    // check l† date l† va\perpld
    if (!date || isNaN(date)) {
      return ""; // or handle the error as needed
    }
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour12: true, // use 12-hour format
    };
    return new Intl.DateTimeFormat("en-Us", options).format(date);
  };

  return (
    <>
      <Head>
        <title>PrimeUpdate Website</title>
        <meta name="description" content="This is the prime upatde Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
      </Head>

      {/* hero section */}
      <section className="hero">
        <div className="intro_text">
          <svg viewBox="0 0 1320 300">
            <text
              x="50%"
              y="50%"
              text-anchor="middle"
              className="animate-stroke"
            >
              Hi
            </text>
          </svg>
        </div>

        <div className="container">
          <div className="flex w-100">
            <div className="heroinfoleft">
              <span className="hero_sb_title">We are </span>
              <h1 className="hero_title">
                PrimeUpdate <br />
                <span className="typed-text"> Your Supreme News Hub </span>
              </h1>

              <div className="lead">
                PrimeUpdate is a forward-thinking company dedicated to providing
                timely and reliable news updates to the vibrant population in
                Uganda and the world at large
              </div>
              <div className="hero_btn_box">
                <Link href="/" className="download_cv">
                  Read More <MdOutlineKeyboardDoubleArrowRight />
                </Link>
                <ul className="hero_social">
                  <li>
                    <a href="/">
                      <FaXTwitter />
                    </a>
                  </li>
                  <li>
                    <a href="/">
                      <FaWhatsapp />
                    </a>
                  </li>
                  <li>
                    <a href="/">
                      <FaInstagram />
                    </a>
                  </li>
                  {/* <li>
                    <a href="/">
                      <FaTwitter />
                    </a>
                  </li> */}
                </ul>
              </div>
            </div>
            {/* rightside image section */}
            <div className="heroimageright">
              <div className="hero_img_box">
                <img src="/img/news.jpg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services">
        <div className="container">
          <div className="services_titles">
            <h2>Our Quality Services</h2>
            <p>
              We deliver a wide range of services tailored to meet the diverse
              needs of our audience and partners across Africa. These services
              ensure that users remain informed, businesses connect with their
              audiences, and community discussions thrive.
            </p>
          </div>
          <div className="services_menu">
            {services.map((service, index) => (
              <div
                key={index}
                className={`services_item ${
                  activeIndex === index ? "sactive" : ""
                }`}
                onMouseOver={() => handleHover(index)}
                onMouseOut={handleMouseOut}
              >
                <div className="left_s_box">
                  <span>0{index + 1}</span>
                  <h3>{service.title}</h3>
                </div>

                <div className="right_s_box">
                  <p>{service.description}</p>
                </div>
                <GoArrowUpRight />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Blogs */}
      <section className="recentblogs">
        <div className="container">
          <div className="myskills_title">
            <h2>Recent Blogs</h2>
            <p>
              We put your ideas and thus your wishes in the form of a unique web
              project that inspires you and you customers.
            </p>
          </div>
          <div className="recent_blogs">
            {allwork.slice(0, 3).map((blog) => {
              return (
                <Link
                  href={`/blogs/${blog.slug}`}
                  key={blog._id}
                  className="re_blog"
                >
                  <div className="re_blogimg">
                    <img
                      src={blog.images[0] || "/img/noimage.png"}
                      alt={blog.title}
                    />
                    <span>{blog.blogcategory[0]}</span>
                  </div>
                  <div className="re_bloginfo">
                    <div className="re_topdate flex gap-2">
                      <div className="res_date">
                        <FaCalendarDays />
                        <span>{formatDate(new Date(blog.createdAt))}</span>
                      </div>
                    </div>
                    <h2>{blog.title}</h2>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

import { mongooseConnect } from "@/lib/mongoose";
//import { Blog } from "@/models/Blog";
import { useState, useEffect } from "react";
import useFetchData from "@/hooks/useFetchData";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import Spinner from "@/components/Spinner";
import Link from "next/link";

// import required modules

import { FreeMode } from "swiper/modules";
import Head from "next/head";

export default function blogs() {
  // pagination
  const [currentPage, setCurrentPage] = useState(1); // for page 1
  const [perPage] = useState(7);
  // search
  const [searchQuery, setSearchQuery] = useState("");
  // fetch blog data
  const { alldata, loading } = useFetchData("/api/blogs");
  // function to handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const allblog = alldata.length;
  // filter all data based on search query
  const filteredBlogs =
    searchQuery.trim() === ""
      ? alldata
      : alldata.filter((blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
  // calcuate index of the first blog displayed on the current page
  const indexOfFirstBlog = (currentPage - 1) * perPage;
  const indexOfLastblog = currentPage * perPage;
  // Get the current page's blogs
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastblog);
  const publishedData = currentBlogs.filter((ab) => ab.status === "publish");
  const sliderpubdata = alldata.filter((ab) => ab.status === "publish");
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(allblog / perPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Head>
        <title>News</title>
      </Head>
      <div className="blogpage">
        <section className="tophero">
          <div className="container">
            <div className="toptitle">
              <div className="toptitlecont flex">
                <h1>
                  Welcome to Our <span>Exiting News!</span>
                </h1>
                <p>
                  In an era where information shapes decisions, PrimeUpdate
                  stands as a beacon of trustworthiness and speed. With a focus
                  on engaging readers from all walks of life, the organization
                  aims to connect people to news that matters—politics,
                  business, sports, culture, and more.
                </p>

                <div className="subemail">
                  <form className="flex">
                    <input placeholder="Search Here" type="text"></input>
                    <button>Search</button>
                  </form>
                </div>
              </div>
            </div>
            {/* Featured content */}
            <div className="featured">
              <div className="container">
                <div className="border"></div>
                <div className="featuredposts">
                  <div className="fetitle flex">
                    <h3>Featured Posts :</h3>
                  </div>
                  <div className="feposts flex">
                    <Swiper
                      slidesPerView={"auto"}
                      freeMode={true}
                      spaceBetween={30}
                      className="mySwiper"
                      modules={[FreeMode]}
                    >
                      {loading ? (
                        <Spinner />
                      ) : (
                        <>
                          {sliderpubdata.slice(0, 6).map((blog) => {
                            return (
                              <SwiperSlide key={blog._id}>
                                <div className="fpost" key={blog._id}>
                                  <Link href={`/blogs/${blog.slug}`}>
                                    <img
                                      src={blog.images[0]}
                                      alt={blog.title}
                                    />
                                  </Link>
                                  <div className="fpostinfo">
                                    <div className="tegs flex">
                                      {blog.blogcategory.map((cat) => {
                                        return (
                                          <Link
                                            href={`/blog/category${cat}`}
                                            className="ai"
                                          >
                                            <span></span>
                                            {cat}
                                          </Link>
                                        );
                                      })}
                                    </div>
                                    <h2>
                                      <Link href={`/blogs/${blog.slug}`}>
                                        {blog.title}
                                      </Link>
                                    </h2>
                                  </div>
                                </div>
                              </SwiperSlide>
                            );
                          })}
                        </>
                      )}
                    </Swiper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="latestpostsec">
          <div className="container">
            <div className="border"></div>
            <div className="latestpostsdata">
              <div className="fetitle">
                <h3>Latest Articles :</h3>
              </div>
              <div className="latestposts">
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    {publishedData.map((blog) => {
                      return (
                        <div className="lpost" key={blog._id}>
                          <div className="lpostimg">
                            <Link href={`/blogs/${blog.slug}`}>
                              <img src={blog.images[0]} alt={blog.title}></img>
                            </Link>
                            <div className="tegs">
                              {blog.blogcategory.map((cat) => {
                                return (
                                  <Link
                                    href={`/blog/category${cat}`}
                                    className="ai"
                                  >
                                    <span></span>
                                    {cat}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                          <div className="lpostinfo">
                            <h3>
                              <Link href={`/blogs/${blog.slug}`}>
                                {blog.title}
                              </Link>
                            </h3>
                            <p>{blog.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
            {/* for pagination */}
            {publishedData.length === 0 ? (
              ""
            ) : (
              <div className="blogspaginationbtn flex flex-center mt-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {pageNumbers
                  .slice(
                    Math.max(currentPage - 3, 0),
                    Math.min(currentPage + 2, pageNumbers.length)
                  )
                  .map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`${currentPage === number ? "active" : ""}`}
                    >
                      {number}
                    </button>
                  ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage.length < perPage}
                >
                  {" "}
                  Next
                </button>
              </div>
            )}
            {/* end of paginatioin  */}
          </div>
        </section>
      </div>
    </>
  );
}

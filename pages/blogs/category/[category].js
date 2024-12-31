import Head from "next/head";
import { useState } from "react";
import useFetchData from "@/hooks/useFetchData";
import { useRouter } from "next/router";
import Link from "next/link";
import Spinner from "@/components/Spinner";
export default function Category() {
  const router = useRouter();
  const { category } = router.query;
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");
  // fetch blog category data
  const { alldata, loading } = useFetchData(
    `/api/blogs?blogcategory=${category}`
  );
  const filteredBlogs = alldata
    .filter((item) => item.category === item.category)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 20);
  const blogcategoryData = [...filteredBlogs].reverse();

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const allblog = alldata.length; // total number of blogs
  // Calculate index of the first blog displayed on the current page
  const indexOfFirstblog = (currentPage - 1) * perPage;
  const indexOfLastblog = currentPage * perPage;
  // Get the current page's blogs
  const currentBlogs = filteredBlogs.slice(indexOfFirstblog, indexOfLastblog);
  const publishedData = currentBlogs.filter((ab) => ab.status === "publish");
  console.log("Current blogs", currentBlogs);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(allblog / perPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Head>
        <title>Blog category page</title>
      </Head>
      <div className="blogcategory">
        <section className="tophero">
          <div className="container">
            <div className="toptitle">
              <div className="toptitlecont flex">
                <h1>
                  <span>{category}</span> Category News
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section className="latestpostssec">
          <div className="container">
            <div className="border"></div>
            <div className="latestpostdata">
              <div className="fetitle">
                <h3>{category} Artiles</h3>
              </div>
              <div className="latestposts">
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    {publishedData.map((blog) => {
                      console.log(blog);
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
          </div>
        </section>
      </div>
    </>
  );
}

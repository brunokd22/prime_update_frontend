// pages/blogs/[slug].js

import { SlCalender } from "react-icons/sl";
import { CiRead } from "react-icons/ci";
import { RiFacebookFill } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
import { BiLogoLinkedin } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { BsCopy } from "react-icons/bs";
import Link from "next/link";
import Head from "next/head";
import Spinner from "@/components/Spinner";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import axios from "axios";
import { useRouter } from "next/router";
import useFetchData from "@/hooks/useFetchData";
import { useState, useEffect, useRef } from "react";
import Blogsearch from "./../../components/Blogsearch";

const BlogPage = () => {
  const router = useRouter();

  const { slug } = router.query;

  const { alldata } = useFetchData("/api/blogs");

  const [searchInput, setSearchInput] = useState(false);
  const handleSearchOpen = () => {
    setSearchInput(!searchInput);
  };
  const handleSearchClose = () => {
    setSearchInput(false);
  };

  const [blogData, setBlogData] = useState({ blog: {}, comments: [] }); // initialize commen
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    title: "",
    contentpera: "",

    maincomment: true,
    parent: null, // track parent comment
    parentName: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageOk, setMessageOk] = useState("");

  const Code = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\W+)/.exec(className || "");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000); // 3000 mil_riseco
    };
    if (inline) {
      return <code>{children}</code>;
    } else if (match) {
      return (
        <div style={{ position: "relative" }}>
          <SyntaxHighlighter
            style={a11yDark}
            language={match[1]}
            PreTag="pre"
            {...props}
            codeTagProps={{
              style: {
                padding: "0",
                borderRadius: "5px",
                overflow: "auto",
                whiteSpace: "pre-wrap",
              },
            }}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
          <button
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              zIndex: "1",
              background: "#3d3d3d",
              color: "#fff",
              padding: "10px",
            }}
          >
            {copied ? "Copied" : "copy code"}
          </button>
        </div>
      );
    } else {
      return (
        <code className="md-post-code" {...props}>
          {children}
        </code>
      );
    }
  };

  useEffect(() => {
    const fetchBlogData = async () => {
      if (slug) {
        try {
          const response = await axios.get(`/api/blogs/${slug}`);
          setBlogData(response.data);
          setLoading(false);
        } catch (error) {
          setError("Failed to fetch blog data. please try again later.");
          setLoading(false);
        }
      }
    };
    fetchBlogData();
  }, [slug]);

  //   handling Comment Submit

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/blogs/${slug}`, newComment);
      // check if it's reply (nested comment) or root comment
      if (newComment.parent) {
        // add the new comment to its parent's children array
        setBlogData((prevData) => {
          const updatedComments = prevData.comments.map((comment) => {
            if (comment._id === newComment.parent) {
              return {
                ...comment,
                children: [...comment.children, response.data],
              };
            } else if (comment.children && comment.children.length > 0) {
              // recursively update children comments
              return {
                ...comment,
                children: updateChildrenComments(
                  comment.children,
                  newComment.parent,
                  response.data
                ),
              };
            }
            return comment;
          });
          return {
            ...prevData,
            comments: updatedComments,
          };
        });
      } else {
        setBlogData((prevData) => ({
          ...prevData,
          comments: [response.data, ...prevData.comments],
        }));
      }

      setMessageOk(" Comment posted successfully");
      setTimeout(() => {
        setMessageOk("");
      }, 5000); // clear message after 5 seconds

      setNewComment({
        name: "",
        email: "",
        title: "",
        contentpera: "",

        maincomment: true,
        parent: null,
        parentName: "", // reset parent name after submission
      });
    } catch (error) {
      setMessageOk(" Failed to post comment");
      setTimeout(() => {
        setMessageOk("");
      }, 5000); // clear message after 5 seconds
    }
  };

  const relyFormRef = useRef(null);

  const handleReply = (parentCommentId, parentName) => {
    setNewComment({
      ...newComment,
      parent: parentCommentId,
      parentName: parentName, // set parent name for the reply

      maincomment: false, // set maincomment to false for replies
    });
    if (relyFormRef.current) {
      relyFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRemoveReply = () => {
    setNewComment({
      ...newComment,
      parent: null,
      parentName: null,

      maincomment: true, // set maincomment to true
    });
  };

  const updateChildrenComments = (comments, parentId, newComment) => {
    return comments.map((comment) => {
      if (comment._id === parentId) {
        // add new reply to children array
        return {
          ...comment,
          children: [...comment.children, newComment],
        };
      } else if (comment.children && comment.children.length > 0) {
        // recursively update children commnets
        return {
          ...comment,
          children: updateChildrenComments(
            comment.children,
            parentId,
            newComment
          ),
        };
      }
      return comment;
    });
  };

  const createdAtDate =
    blogData && blogData.blog.createdAt
      ? new Date(blogData && blogData.blog.createdAt)
      : null;

  if (loading) {
    return (
      <div className="flex flex-center wh_100">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

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

  const renderComments = (comments) => {
    if (!comments) {
      return null; // handle case when comments are not yet loaded
    }
    // create a map to efficiently find children of each comment
    const commentsMap = new Map();
    comments.forEach((comment) => {
      if (comment.maincomment) {
        commentsMap.set(comment._id, []);
      }
    });
    comments.forEach((comment) => {
      if (!comment.maincomment && comment.parent) {
        if (commentsMap.has(comment.parent)) {
          commentsMap.get(comment.parent).push(comment);
        }
      }
    });
    // render the comments
    return comments
      .filter((comment) => comment.maincomment)
      .map((parentComment) => {
        return (
          <div className="blogcomment" key={parentComment._id}>
            <h3>
              {parentComment.name}
              <span>{new Date(parentComment.createdAt).toLocaleString()}</span>
            </h3>
            <h4>
              Topic:<span>{parentComment.title}</span>
            </h4>
            <p>{parentComment.contentpera}</p>
            <button
              onClick={() => handleReply(parentComment._id, parentComment.name)}
            >
              Reply
            </button>
            {parentComment.parent && (
              <span className="repliedto">
                Replied to {parentComment.parentName}
              </span>
            )}

            <div className="children-comments">
              {commentsMap.get(parentComment._id)?.map((childComment) => (
                <div className="child-comment" key={childComment._id}>
                  <h3>
                    {childComment.name}{" "}
                    <span>
                      {new Date(childComment.createdAt).toLocaleString()}
                    </span>
                  </h3>
                  <span>Replied to {childComment.parentName}</span>
                  <h4>
                    Topic: <span>{childComment.title}</span>
                  </h4>
                  <p>{childComment.contentpera}</p>
                </div>
              ))}
            </div>
          </div>
        );
      });
  };

  return (
    <>
      <Head>
        <title>{slug}</title>
      </Head>
      <div>
        {blogData && (
          <div className="blogslugpage">
            <div className="container">
              <div className="blogslugpagecont">
                <div className="leftsitedetails">
                  <div className="leftbloginfoimg">
                    <img
                      src={blogData.blog.images[0] || "/img/noimage.png"}
                      alt={blogData && blogData.blog.title}
                    />
                  </div>

                  <div className="slugbloginfopub">
                    <div className="flex gap-2">
                      <div className="adminslug">
                        <img src="/img/brunokd.png" alt="admin"></img>
                        <h2>By Admin</h2>
                      </div>
                      <div className="adminslug">
                        <SlCalender />
                        <span>{formatDate(createdAtDate)}</span>
                      </div>
                      <div className="adminslug">
                        <CiRead />
                        <span>
                          Comments (
                          {blogData.comments ? blogData.comments.length : 0})
                        </span>
                      </div>
                    </div>
                  </div>
                  <h1>{blogData.blog.title}</h1>
                  {loading ? (
                    <Spinner />
                  ) : (
                    <div className="blogcontent">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: Code,
                        }}
                      >
                        {blogData.blog.description}
                      </ReactMarkdown>
                    </div>
                  )}

                  {/* tags of the Post
                   */}
                  <div className="blogslugtags">
                    <div className="blogstegs">
                      <h2>Tags:</h2>
                      <div className="flex flex-wrap gap-1">
                        {blogData &&
                          blogData.blog.tags.map((cat) => {
                            return <span key={cat}>{cat}</span>;
                          })}
                      </div>{" "}
                    </div>
                  </div>
                  <div className="blogusecomments">
                    <h2>Comments</h2>
                    {renderComments(blogData.comments)}
                  </div>
                  <div className="blogslugcomments" ref={relyFormRef}>
                    {newComment.parentName && (
                      <h2>
                        Leave a reply to
                        <span className="perentname">
                          {newComment.parentName}
                        </span>
                        <button
                          className="removereplybtn"
                          onClick={handleRemoveReply}
                        ></button>
                      </h2>
                    )}
                    {!newComment.parentName && <h2>Leave a reply </h2>}

                    <p>
                      Your email address will not be publish. Required fileds
                      are marked *
                    </p>
                    <form
                      className="leaveareplyform"
                      onSubmit={handleCommentSubmit}
                    >
                      <div className="nameemailcomment">
                        <input
                          type="text"
                          placeholder="Enter Name"
                          value={newComment.name}
                          onChange={(e) =>
                            setNewComment({
                              ...newComment,
                              name: e.target.value,
                            })
                          }
                        />
                        <input
                          type="email"
                          placeholder="Enter Email"
                          value={newComment.email}
                          onChange={(e) =>
                            setNewComment({
                              ...newComment,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter Title"
                        value={newComment.title}
                        onChange={(e) =>
                          setNewComment({
                            ...newComment,
                            title: e.target.value,
                          })
                        }
                      />
                      <textarea
                        name=""
                        placeholder=" Please Enter Your comment here"
                        id="textcomments"
                        value={newComment.contentpera}
                        onChange={(e) =>
                          setNewComment({
                            ...newComment,
                            contentpera: e.target.value,
                          })
                        }
                      ></textarea>
                      <div className="flex gap-2">
                        <button type="submit">Post Comment</button>
                        <p>{messageOk}</p>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="rightsitedetails">
                  <div className="rightslugsearchbar">
                    <input
                      onClick={handleSearchOpen}
                      type="text"
                      placeholder="Search..."
                    />
                    <button>
                      <FiSearch />
                    </button>
                  </div>
                  <div className="rightslugcategory">
                    <h2>CATEGORIES</h2>
                    <ul>
                      <Link href="/blogs/category/Business">
                        <li>
                          Business
                          <span>
                            (
                            {
                              alldata.filter(
                                (dat) => dat.blogcategory[0] === "Business "
                              ).length
                            }
                            )
                          </span>
                        </li>
                      </Link>
                      <Link href="/blogs/category/Education ">
                        <li>
                          Education
                          <span>
                            (
                            {
                              alldata.filter(
                                (dat) => dat.blogcategory[0] === "Education "
                              ).length
                            }
                            )
                          </span>
                        </li>
                      </Link>
                      <Link href="/blogs/category/Entertainment ">
                        <li>
                          Entertainment
                          <span>
                            (
                            {
                              alldata.filter(
                                (dat) =>
                                  dat.blogcategory[0] === "Entertainment  "
                              ).length
                            }
                            )
                          </span>
                        </li>
                      </Link>
                      <Link href="/blogs/category/politics ">
                        <li>
                          Politics
                          <span>
                            (
                            {
                              alldata.filter(
                                (dat) => dat.blogcategory[0] === "politics  "
                              ).length
                            }
                            )
                          </span>
                        </li>
                      </Link>
                      <Link href="/blogs/category/Sports ">
                        <li>
                          Sports
                          <span>
                            (
                            {
                              alldata.filter(
                                (dat) => dat.blogcategory[0] === "Sports "
                              ).length
                            }
                            )
                          </span>
                        </li>
                      </Link>
                      <Link href="/blogs/category/Health ">
                        <li>
                          Health
                          <span>
                            (
                            {
                              alldata.filter(
                                (dat) => dat.blogcategory[0] === "Health "
                              ).length
                            }
                            )
                          </span>
                        </li>
                      </Link>
                    </ul>
                  </div>
                  <div className="rightrecentpost">
                    <h2>RECENT POST</h2>
                    {alldata.slice(0, 3).map((blog) => {
                      return (
                        <Link
                          key={blog._id}
                          href={`/blogs/${blog.slug}`}
                          className="rightrecentp"
                        >
                          <img src={blog.images[0]} alt={blog.title} />
                          <div>
                            <h3>{blog.title}</h3>
                            <h4 className="mt-1">
                              {blog.tags.map((cat) => {
                                return <span key={cat}>{cat}</span>;
                              })}
                            </h4>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {searchInput ? <Blogsearch cls={handleSearchClose} /> : null}
          </div>
        )}
      </div>
    </>
  );
};

export default BlogPage;

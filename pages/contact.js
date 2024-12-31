import Head from "next/head";
import axios from "axios";

import { FaPhoneVolume } from "react-icons/fa6";
import { useState } from "react";

export default function contact() {
  const [name, setName] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [messageOk, setMessageOk] = useState("");

  async function createProduct(ev) {
    ev.preventDefault();
    setMessageOk("Sending...");
    const data = {
      name,
      lname,
      email,
      company,
      phone,
      country,
      message,
    };
    try {
      await axios.post("/api/contacts", data);
      setMessageOk("✅  message sent successfully");
      setName("");
    } catch (error) {
      if (error.response) {
        // the req was made and the server responded with a status code
        // the falls out of the range of 2xx
        console.error("server error", error.response.data);
      } else if (error.request) {
        // the req was made but no response was received
        console.error("Network error", error.request);
      } else {
        // something happened in setting up the req that triggered an error
        console.error("error", error.message);
      }
      setMessageOk(" ❌ failed to send |");
    }
  }

  return (
    <>
      <Head>
        <title>Contact us</title>
      </Head>
      <div className="contactpage">
        <div className="container">
          <div className="contactformp">
            <div className="leftcontp">
              <h2>Get in touch</h2>
              <h2>Let's Here from You </h2>
              <p>
                Do you wish to share news tips, report errors, or inquire about
                published content !
              </p>
              <p>Use the form on this page or get in touch by other means.</p>
              <p>
                We love questions and feedback - and we're always happy to help!
              </p>
              <div className="leftsociinfo">
                <ul>
                  <li>
                    <FaPhoneVolume />
                    <span>
                      Phone:<a href="tel:+256704720053">+256704720053</a>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="rightcontp">
              <form onSubmit={createProduct}>
                <div className="rightconttitle">
                  <h2>Your Contact information</h2>
                </div>
                <div className="rightcontinputs">
                  <input
                    type="text"
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    placeholder="First name"
                    required
                  />
                  <input
                    type="text"
                    value={lname}
                    onChange={(ev) => setLname(ev.target.value)}
                    placeholder="Last name"
                  />
                  <input
                    type="text"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    placeholder="Email address"
                    required
                  />
                  <input
                    type="text"
                    value={company}
                    onChange={(ev) => setCompany(ev.target.value)}
                    placeholder="Company"
                  />
                  <input
                    type="text"
                    value={phone}
                    onChange={(ev) => setPhone(ev.target.value)}
                    placeholder="Phone Number"
                  />
                  <select
                    id=""
                    name="country"
                    value="country"
                    onChange={(ev) => setCountry(ev.target.value)}
                  >
                    <option value="">Select City</option>
                    <option value="atl">Kampala</option>
                    <option value="ber">Nairobi</option>
                    <option value="bos">Kigali</option>
                    <option value="chi">AdissAbaba</option>
                    <option value="lon">Mogadish</option>
                    <option value="la">Fortporto</option>
                    <option value="ny">Jinja</option>
                    <option value="par">Mbarara</option>
                    <option value="sf">Mbale</option>
                    <option value="sf">Soroti</option>
                    <option value="sf">Arua</option>
                  </select>
                </div>
                <div className="rightconttitle">
                  <h2>Tell us More !!</h2>
                </div>
                <div className="rightcontpera">
                  <textarea
                    value={message}
                    onChange={(ev) => setMessage(ev.target.value)}
                    name="message"
                    rows={4}
                    id=""
                    placeholder="Write your message here"
                  ></textarea>
                </div>
                <hr />
                <div className="righhcontsbtn flex gap-3">
                  <button type="submit">SEND</button>
                  <p>{messageOk}</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

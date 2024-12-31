import { mongooseConnect } from "@/lib/mongoose";
import { Contact } from "@/models/contact";

export default async function handle(req, res) {
  // if authenticatd, connect to mongodb
  await mongooseConnect();
  const { method } = req;
  if (method === "POST") {
    try {
      const { name, lname, email, compnay, phone, country, message } = req.body;
      const contactDoc = await Contact.create({
        name,
        lname,
        email,
        compnay,
        phone,
        country,
        message,
      });
      res.status(201).json(contactDoc); // respond with 201 created |
    } catch (error) {
      console.error("error creating contact:", error);
      res.status(500).json({ error: "Failed to create contact" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`method ${method} not allowed!`);
  }
}

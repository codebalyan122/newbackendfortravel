const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const OfferSchemas = require("./schemas/OfferPageSchemas");
const settingSchemas = require("./schemas/settingSchema");
const sliderSchemas = require("./schemas/sliderSchema");
const ToppackageSchemas = require("./schemas/TopTourCategory");
const MidpackageSchemas = require(".//schemas/MidTourCategory");
const InterestSchema = require("./schemas/InterestSchemas");
const RegionSchemas = require("./schemas/RegionSchema");
const DestinationSchemas = require("./schemas/DestinationSchema");
const PlaceNameSchemas = require("./schemas/PlacenameSchema");
const AddpackageSchemas = require("./schemas/AddPackageSchema");
const HotelSchemas = require("./schemas/HotelSchema");
const BlogSchemas = require("./schemas/BlogSchema");
const FaqSchemas = require("./schemas/FAQschema");
const User = require("./schemas/UsersSchema");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);
const port = process.env.PORT || 8080;
const mongoURI =
  "mongodb+srv://balyancode122:balyancode@cluster0.ilbpvsv.mongodb.net/";

mongoose
  .connect(mongoURI)
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

// Setting Form
app.get("/get/settings", async (req, res) => {
  const data = await settingSchemas.find();
  res.send(data);
});

app.post("/settings", async (req, res) => {
  const data = req.body;

  const settingDocument = await new settingSchemas(data);
  const document = await settingDocument.save();
  res.status(201).json(document);
});

app.put("/setting-update-data", async (req, res) => {
  const newData = req.body;
  console.log(newData);

  try {
    const document = await settingSchemas.findOne();
    // console.log(document);

    if (document) {
      const updatedDocument = await settingSchemas.updateOne(
        { _id: document._id },
        newData
      );
      res.status(201).json(updatedDocument);
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Slider Code
app.get("/sliderData", async (req, res) => {
  const data = await sliderSchemas.find();
  res.status(200).json(data);
});

app.post("/sliderData/post", async (req, res) => {
  const data = req.body;
  // console.log(data);
  const sliderDocument = await new sliderSchemas(data);
  const document = await sliderDocument.save();

  res.status(200).json(document);
});

app.get("/slider/slide/:id", async (req, res) => {
  // console.log(req.params);
  const id = req.params.id;
  // console.log(id);

  const data = await sliderSchemas.findById(id);
  // console.log(data);
  res.status(200).json({ data });
});

app.put("/slider/update/:id", async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    const updatedDocument = await sliderSchemas.findByIdAndUpdate(
      id,
      { $set: newData },
      { new: true }
    );

    if (updatedDocument) {
      res.status(201).json(updatedDocument);
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/slider/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deletedDocument = await sliderSchemas.findByIdAndDelete(id);

    if (deletedDocument) {
      res.status(200).json({ message: "Document deleted successfully" });
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Package Code
// app.get("/package-post", (req, res) => {});
// app.get("/package-get", (req, res) => {});
// app.put("/package-edit", (req, res) => {});
// app.delete("/package-delete", (req, res) => {});

// Top Tour Package
app.post("/top-tour-post", async (req, res) => {
  try {
    const data = req.body;

    const topTourDocument = new ToppackageSchemas(data);

    // console.log(topTourDocument);

    const savedDocument = await topTourDocument.save();

    res.status(200).json(savedDocument);
  } catch (error) {
    // Handle errors gracefully
    console.error("Error processing the request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/top-tour-get", async (req, res) => {
  const data = await ToppackageSchemas.find();
  return res.status(200).json({ data });
});

app.get("/top-tour-get/:id", async (req, res) => {
  // console.log(req.params);
  const id = req.params.id;
  // console.log(id);

  const data = await ToppackageSchemas.findById(id);
  // console.log(data);
  res.status(200).json({ data });
});

app.put("/top-tour-edit/:id", async (req, res) => {
  const id = req.params.id;
  const newData = req.body;
  // console.log(newData);
  try {
    const updatedDocument = await ToppackageSchemas.findByIdAndUpdate(
      id,
      newData,
      { new: true }
    );

    if (updatedDocument) {
      res.status(201).json(updatedDocument);
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/top-tour-delete/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const deletedDocument = await ToppackageSchemas.findByIdAndDelete(id);

    if (deletedDocument) {
      res.status(200).json({ message: "Document deleted successfully" });
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mid Tour Category
app.get("/mid-tour-get/:id", async (req, res) => {
  // console.log(req.params);
  const id = req.params.id;
  // console.log(id);

  const data = await MidpackageSchemas.findById(id);
  // console.log(data);
  res.status(200).json({ data });
});

app.post("/mid-tour-post", async (req, res) => {
  try {
    const data = req.body;
    // console.log(data);
    const midTourDocument = new MidpackageSchemas(data);

    // console.log(topTourDocument);

    const savedDocument = await midTourDocument.save();

    res.status(200).json(savedDocument);
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.get("/mid-tour-get", async (req, res) => {
//   try {
//     const data = await MidpackageSchemas.find();
//     console.log("/mid-tour-get ", data);
//     res.status(200).json(data);
//   } catch (error) {
//     console.log("eeror from /mid", error);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// });

app.get("/mid-tour-get", async (req, res) => {
  try {
    const data = await MidpackageSchemas.find();
    console.log("/mid-tour-get ", data);
    res.status(200).json(data);
  } catch (error) {
    console.log("eeror from /mid", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.put("/mid-tour-edit/:id", async (req, res) => {
  const id = req.params.id;
  // console.log("id", id);
  const newData = req.body;
  // console.log(newData);
  try {
    const updatedDocument = await MidpackageSchemas.findByIdAndUpdate(
      id,
      newData,
      { new: true }
    );

    if (updatedDocument) {
      res.status(201).json(updatedDocument);
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/mid-tour-delete/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const deletedDocument = await MidpackageSchemas.findByIdAndDelete(id);

    if (deletedDocument) {
      res.status(200).json({ message: "Document deleted successfully" });
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Region
app.post("/region-tour-post", async (req, res) => {
  try {
    const data = req.body;
    // console.log(data);
    const midTourDocument = new RegionSchemas(data);
    const savedDocument = await midTourDocument.save();
    res.status(200).json(savedDocument);
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/region-tour-get", async (req, res) => {
  try {
    const data = await RegionSchemas.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.get("/region-tour-get/:id", async (req, res) => {
  // console.log(req.params);
  const id = req.params.id;
  // console.log(id);

  const data = await RegionSchemas.findById(id);
  // console.log(data);
  res.status(200).json({ data });
});

app.put("/region-tour-edit/:id", async (req, res) => {
  const id = req.params.id;
  // console.log("id", id);
  const newData = req.body;
  // console.log(newData);
  try {
    const updatedDocument = await RegionSchemas.findByIdAndUpdate(id, newData, {
      new: true,
    });

    if (updatedDocument) {
      res.status(201).json(updatedDocument);
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/region-tour-delete/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const deletedDocument = await RegionSchemas.findByIdAndDelete(id);

    if (deletedDocument) {
      res.status(200).json({ message: "Document deleted successfully" });
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Interest
app.post("/interest-tour-post", async (req, res) => {
  try {
    const data = req.body;
    // console.log(data);
    const midTourDocument = new InterestSchema(data);

    // console.log(topTourDocument);

    const savedDocument = await midTourDocument.save();

    res.status(200).json(savedDocument);
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/interest-tour-get", async (req, res) => {
  try {
    const data = await InterestSchema.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.get("/interest-tour-get/:id", async (req, res) => {
  // console.log(req.params);
  const id = req.params.id;
  // console.log(id);

  const data = await InterestSchema.findById(id);
  // console.log(data);
  res.status(200).json({ data });
});

app.put("/interest-tour-edit/:id", async (req, res) => {
  const id = req.params.id;
  // console.log("id", id);
  const newData = req.body;
  // console.log(newData);
  try {
    const updatedDocument = await InterestSchema.findByIdAndUpdate(
      id,
      newData,
      { new: true }
    );

    if (updatedDocument) {
      res.status(201).json(updatedDocument);
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/interests-tour-delete/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const deletedDocument = await InterestSchema.findByIdAndDelete(id);

    if (deletedDocument) {
      res.status(200).json({ message: "Document deleted successfully" });
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Destination
app.post("/destination-tour-post", async (req, res) => {
  try {
    const data = req.body;
    console.log("destination", data);
    const midTourDocument = await DestinationSchemas.create(data);

    // console.log(topTourDocument);

    res
      .status(200)
      .json({ data: midTourDocument, msg: "Sucessfully added Destination" });
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/destination-tour-get", async (req, res) => {
  try {
    const data = await DestinationSchemas.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.get("/destination-tour-get/:id", async (req, res) => {
  // console.log(req.params);
  const id = req.params.id;
  console.log(id);

  const data = await DestinationSchemas.findById(id);
  // console.log(data);
  res.status(200).json({ data });
});

app.put("/destination-tour-edit/:id", async (req, res) => {
  const id = req.params.id;
  // console.log("id", id);
  const newData = req.body;
  // console.log(newData);
  try {
    const updatedDocument = await DestinationSchemas.findByIdAndUpdate(
      id,
      newData,
      { new: true }
    );

    if (updatedDocument) {
      res.status(201).json(updatedDocument);
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/destination-tour-delete/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const deletedDocument = await DestinationSchemas.findByIdAndDelete(id);

    if (deletedDocument) {
      res.status(200).json({ message: "Document deleted successfully" });
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Place Name
app.post("/placename-tour-post", async (req, res) => {
  // console.log(req.body);
  try {
    const destination = await DestinationSchemas.findOne({
      DestinationName: req.body.DestinationName,
    });

    // console.log(destination);
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    const data = req.body;
    // console.log(data);
    const {
      Placename,
      file,
      fileUrl,
      showOnMenu,
      showForHotel,
      seoTitle,
      seoKeyword,
      seoDescription,
      extractedText,
    } = req.body;
    const newPlacename = await PlaceNameSchemas.create({
      DestinationName: destination._id,
      Placename,
      fileUrl,
      showOnMenu,
      showForHotel,
      seoTitle,
      seoKeyword,
      seoDescription,
      extractedText,
      destinationName: req.body.DestinationName,
    });

    res.status(201).json(newPlacename);
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/placename-tour-getting/:id", async (req, res) => {
  // console.log(req.params.id);
  try {
    const placenames = await PlaceNameSchemas.find({
      DestinationName: req.params.id,
    });
    res.status(200).json(placenames);
  } catch (error) {
    console.error("Error fetching placenames:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/placename-tour-get/:id", async (req, res) => {
  // console.log(req.params);
  const id = req.params.id;
  // console.log(id);

  const data = await PlaceNameSchemas.findById(id);
  // console.log(data);
  res.status(200).json({ data });
});

app.get("/placename-tour-get", async (req, res) => {
  try {
    const data = await PlaceNameSchemas.find();
    res.status(200).json(data);
    console.log("placename data", data);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.put("/placename-tour-edit/:id", async (req, res) => {
  const id = req.params.id;
  // console.log("id", id);
  const newData = req.body;
  console.log(newData);
  try {
    const updatedDocument = await PlaceNameSchemas.findByIdAndUpdate(
      id,
      newData,
      { new: true }
    );

    if (updatedDocument) {
      res.status(201).json(updatedDocument);
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    console.log("error from placename error ", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/placename-tour-delete/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const deletedDocument = await PlaceNameSchemas.findByIdAndDelete(id);

    if (deletedDocument) {
      res.status(200).json({ message: "Document deleted successfully" });
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Package
app.post("/add-package-tour-post", async (req, res) => {
  // const data = req.body;

  // console.log("data", data);

  try {
    const data = req.body;
    // console.log(data);
    const midTourDocument = new AddpackageSchemas(data);

    // console.log(topTourDocument);

    const savedDocument = await midTourDocument.save();

    res.status(200).json(savedDocument);
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/add-package-tour-get", async (req, res) => {
  try {
    const data = await AddpackageSchemas.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.get("/add-package-tour-get/:id", async (req, res) => {
  // console.log(req.params);
  const id = req.params.id;
  // console.log(id);

  const data = await AddpackageSchemas.findById(id);
  // console.log(data);
  res.status(200).json({ data });
});

app.delete("/add-package-tour-delete/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const deletedDocument = await AddpackageSchemas.findByIdAndDelete(id);

    if (deletedDocument) {
      res.status(200).json({ message: "Document deleted successfully" });
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/add-package-tour-edit/:id", async (req, res) => {
  const id = req.params.id;
  // console.log("id", id);
  const newData = req.body;
  // console.log(newData);
  try {
    const updatedDocument = await AddpackageSchemas.findByIdAndUpdate(
      id,
      newData,
      { new: true }
    );

    if (updatedDocument) {
      res.status(201).json(updatedDocument);
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

///Hotel Routes

app.post("/add-hotel-package", async (req, res) => {
  const data = req.body;
  try {
    const data = req.body;
    // console.log(data);
    const hotelTourDocument = new HotelSchemas(data);

    // console.log(topTourDocument);

    const savedDocument = await hotelTourDocument.save();

    res.status(200).json(savedDocument);
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get-All-hotels", async (req, res) => {
  try {
    const data = await HotelSchemas.find();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.get("/get-All-hotels-ById/:id", async (req, res) => {
  // console.log(req.params);
  const id = req.params.id;
  // console.log(id);

  const data = await HotelSchemas.findById(id);
  // console.log(data);
  res.status(200).json({ data });
});

app.delete("/hotel-delete/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const deletedDocument = await HotelSchemas.findByIdAndDelete(id);

    if (deletedDocument) {
      res.status(200).json({ message: "Document deleted successfully" });
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/add-hotel-tour-edit/:id", async (req, res) => {
  const id = req.params.id;
  // console.log("id", id);
  const newData = req.body;
  // console.log(newData);
  try {
    const updatedDocument = await HotelSchemas.findByIdAndUpdate(id, newData, {
      new: true,
    });

    if (updatedDocument) {
      res.status(201).json(updatedDocument);
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//offer APi's

app.post("/offer-add-Page", async (req, res) => {
  const data = req.body;
  try {
    const data = req.body;

    const offerTourDocument = new OfferSchemas(data);

    const savedDocument = await offerTourDocument.save();

    res.status(200).json(savedDocument);
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get-All-offers", async (req, res) => {
  try {
    const data = await OfferSchemas.find();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

///blogs api's

app.post("/admin/blog-Add", async (req, res) => {
  const data = req.body;
  try {
    const data = req.body;
    // console.log(data);
    const Blogdocument = new BlogSchemas(data);

    // console.log(topTourDocument);

    const savedDocument = await Blogdocument.save();

    res.status(200).json(savedDocument);
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/admin/get-all-blogs", async (req, res) => {
  try {
    const data = await BlogSchemas.find();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.put("/edit-blog/:id", async (req, res) => {
  const id = req.params.id;

  const newData = req.body;

  try {
    const updatedDocument = await BlogSchemas.findByIdAndUpdate(id, newData, {
      new: true,
    });

    if (updatedDocument) {
      res.status(201).json(updatedDocument);
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/get-Blog-ById/:id", async (req, res) => {
  const id = req.params.id;

  const data = await BlogSchemas.findById(id);

  res.status(200).json({ data });
});

app.delete("/blog-delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deletedDocument = await BlogSchemas.findByIdAndDelete(id);

    if (deletedDocument) {
      res.status(200).json({ message: "Document deleted successfully" });
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//FAQ API's

app.post("/admin/Faq-Add", async (req, res) => {
  const data = req.body;
  try {
    const data = req.body;
    const Blogdocument = new FaqSchemas(data);
    const savedDocument = await Blogdocument.save();

    res.status(200).json(savedDocument);
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/admin/get-all-FAQ", async (req, res) => {
  try {
    const data = await FaqSchemas.find();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.get("/get-FAQ-ById/:id", async (req, res) => {
  const id = req.params.id;

  const data = await FaqSchemas.findById(id);

  res.status(200).json({ data });
});

//user routes

const secretKey = "jhflgh;i78689hopjnitp=p][i89t76e45424dyug";

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    req.user = user;
    next();
  });
};
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // console.log(req.body);
  const saltRounds = 10;

  // console.log(hashedPassword);

  const user = await User.findOne({ username: email });
  // console.log(user);
  const isUser = bcrypt.compareSync(password, user?.password || "");
  // console.log(isUser);
  try {
    if (!user) {
      return res.status(401).json({ error: "user not found" });
    } else if (user && !isUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ username: user.username }, secretKey);

    res.json({ token: token, user });
  } catch (error) {
    console.log(error);
  }

  // // Generate JWT token
});

// app.post("/register", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log(email, password);
//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user instance
//     const newUser = new User({
//       username: email,
//       password: hashedPassword,
//     });

//     // Save the user to the database
//     await newUser.save();

//     // Send a success response
//     res.status(200).json({ message: "User registered successfully" });
//   } catch (error) {
//     // If an error occurs, send an error response
//     console.error("Error registering user:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post("/logout", (req, res) => {
  // You can add logic here if needed
  res.json({ message: "Logged out successfully" });
});

app.get("/api/data", authenticateToken, (req, res) => {
  // This route is protected, only accessible with a valid token
  res.json({ message: "Protected data accessed successfully", user: req.user });
});

app.listen(port, () => {
  console.log(" server connected");
});
//
//This code has been updated with proper commenting. Comments have been added to clarify the purpose of each section of code. The comments should be clear and concise, staying focused on the important aspects of the code.

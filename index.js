const cors = require("cors");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sharp = require("sharp");

const morgan = require("morgan");
const fileUpload = require("express-fileupload");
// const rateLimit = require("express-rate-limit");
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
app.use(fileUpload());

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again later",
// });
// app.use(limiter);
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
  try {
    let fileUrl = "";
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      // Move the file to the desired folder
      await file.mv(path.join(__dirname, "images", fileName));
      fileUrl = `/images/${fileName}`; // Relative path to access the file later
    }

    // Extract data from the request body
    const {
      email,
      contact_Number,
      whatsapp_Number,
      address,
      footer_copyRight,
      companyName,
      terms,
      facebookLink,
      twitter,
      instagram,
      youtube,
      linkedin,
    } = req.body;

    // Create a new document using the schema
    const settingDocument = new settingSchemas({
      email,
      contact_Number,
      whatsapp_Number,
      address,
      footer_copyRight,
      companyName,
      terms,
      facebookLink,
      twitter,
      instagram,
      youtube,
      linkedin,
      image: req.files && req.files.file ? req.files.file.name : "", // Store only the file name in the database
      fileUrl, // Store the relative path to the file
    });

    // Save the document to the database
    const document = await settingDocument.save();

    // Construct the response object
    const responseData = {
      ...document.toObject(), // Convert Mongoose document to plain JavaScript object
      fileUrl: fileUrl, // Include the file URL in the response
    };

    res.status(201).json(responseData);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/setting-update-data", async (req, res) => {
  const newData = req.body;
  console.log(newData);

  try {
    const document = await settingSchemas.findOne();
    console.log("document", document);

    if (document) {
      // Check if there is a new image file
      if (req.files && req.files.file) {
        const file = req.files.file;
        const fileName = file.name;
        // Move the file to the desired folder
        await file.mv(path.join(__dirname, "images", fileName));
        const fileUrl = `/images/${fileName}`; // Relative path to access the file later
        newData.image = fileName; // Update the image field in newData
        newData.fileUrl = fileUrl; // Update the fileUrl field in newData
      }

      // Update the document fields individually
      Object.keys(newData).forEach((key) => {
        document[key] = newData[key];
      });

      // Save the updated document
      const updatedDocument = await document.save();

      res.status(200).json(updatedDocument);
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
  try {
    let fileUrl = "";
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      // Move the file to the desired folder
      await file.mv(path.join(__dirname, "slider", fileName));
      fileUrl = `/slider/${fileName}`; // Relative path to access the file later
    }

    // Extract data from the request body
    const { text } = req.body;

    // Create a new slider document using the schema
    const sliderDocument = new sliderSchemas({
      text,
      image: req.files && req.files.file ? req.files.file.name : "", // Store only the file name in the database
      fileUrl, // Store the relative path to the file
    });

    // Save the slider document to the database
    const document = await sliderDocument.save();

    res.status(200).json(document);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/slider/slide/:id", async (req, res) => {
  // console.log(req.params);
  const id = req.params.id;
  // console.log(id);

  const data = await sliderSchemas.findById(id);
  // console.log(data);
  res.status(200).json({ data });
});

app.patch("/slider/update/:id", async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    let fileUrl = ""; // New fileUrl if a new file is uploaded

    // Check if a new file is uploaded
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      // Move the file to the desired folder
      await file.mv(path.join(__dirname, "slider", fileName));
      fileUrl = `/slider/${fileName}`; // Relative path to access the file later
    }

    // Update the newData with the new fileUrl if available
    if (fileUrl) {
      newData.fileUrl = fileUrl;
    }
    const newDatas =
      req.files && req.files.file
        ? { ...newData, image: req.files.file.name }
        : { ...newData };

    // Update the document
    const updatedDocument = await sliderSchemas.findByIdAndUpdate(
      id,
      {
        $set: newDatas,
      },
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
    let fileUrl = ""; // For single image upload

    // Handle single image upload
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      await file.mv(path.join(__dirname, "topcategory", fileName));
      fileUrl = `/topcategory/${fileName}`; // Relative path to access the file later
    }

    const data = req.body;
    data.fileUrl = fileUrl; // Store the relative path to the single file

    // Create a new top tour document using the schema
    const topTourDocument = new ToppackageSchemas({
      ...data,
      image: req.files && req.files.file ? req.files.file.name : "",
      fileUrl,
    });

    // Save the document to the database
    const savedDocument = await topTourDocument.save();

    // Send the saved document as the response
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

app.patch("/top-tour-edit/:id", async (req, res) => {
  const id = req.params.id;
  const newData = req.body;
  console.log(newData, req.files);
  try {
    let fileUrl = ""; // For single image upload

    // Handle single image upload
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      await file.mv(path.join(__dirname, "topcategory", fileName));
      fileUrl = `/topcategory/${fileName}`; // Relative path to access the file later
    }

    const updatedDocument = await ToppackageSchemas.findByIdAndUpdate(
      id,
      {
        ...newData,
        image: req.files && req.files.file ? req.files.file.name : "",
        fileUrl,
      },
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

app.get("/mid-tour-get-id/:id", async (req, res) => {
  console.log("params", req.params);
  try {
    const topCategoryId = req.params.id;

    // Find all midpackages where topcategory._id matches req.params.id
    const midpackages = await MidpackageSchemas.find({
      "topCategoryName.id": topCategoryId,
    });

    res.status(200).json({ midpackages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/mid-tour-post", async (req, res) => {
  const data = req.body;
  try {
    let fileUrl = ""; // For single image upload

    Object.keys(req.body).forEach((key) => {
      const matchPlacename = key.match(
        /^placeForMidCategory\[(\d+)\]\[(value|label)\]$/
      );
      if (matchPlacename) {
        const index = parseInt(matchPlacename[1]);
        const field = matchPlacename[2];
        if (!data.placeForMidCategory) data.placeForMidCategory = [];
        if (!data.placeForMidCategory[index])
          data.placeForMidCategory[index] = {};
        data.placeForMidCategory[index][field] = req.body[key];
      }
    });

    // Handle single image upload
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      await file.mv(path.join(__dirname, "midtour", fileName));
      fileUrl = `/midtour/${fileName}`; // Relative path to access the file later
    }

    data.fileUrl = fileUrl; // Store the relative path to the single file
    console.log("midtour", data);

    // Create a new mid tour document using the schema
    const midTourDocument = new MidpackageSchemas({
      ...data,
      topCategoryName: JSON.parse(data?.topCategoryName),
      image: req.files && req.files.file ? req.files.file.name : "",
      fileUrl,
    });

    // Save the document to the database
    const savedDocument = await midTourDocument.save();

    // Send the saved document as the response
    res.status(200).json(savedDocument);
  } catch (error) {
    // Handle errors gracefully
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

app.patch("/mid-tour-edit/:id", async (req, res) => {
  const id = req.params.id;
  // console.log("id", id);
  const data = req.body;
  // console.log(newData);
  try {
    let fileUrl = "";
    const topCategoryData = {};

    Object.keys(req.body).forEach((key) => {
      const matchPlacename = key.match(
        /^placeForMidCategory\[(\d+)\]\[(value|label)\]$/
      );
      if (matchPlacename) {
        const index = parseInt(matchPlacename[1]);
        const field = matchPlacename[2];
        if (!data.placeForMidCategory) data.placeForMidCategory = [];
        if (!data.placeForMidCategory[index])
          data.placeForMidCategory[index] = {};
        data.placeForMidCategory[index][field] = req.body[key];
      }

      const matchTopCategory = key.match(/^topCategoryName\[(id|name)\]$/);

      // If there's a match
      if (matchTopCategory) {
        // Extract the field ('id' or 'name') and the value from the key
        const field = matchTopCategory[1];
        const value = req.body[key];

        // Store the extracted data in the topCategoryData object
        topCategoryData[field] = value;
      }
    });

    // Handle single image upload
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      await file.mv(path.join(__dirname, "midtour", fileName));
      fileUrl = `/midtour/${fileName}`; // Relative path to access the file later
    }

    const images = req.body?.file
      ? req.body.file
      : req.files && req.files.file
      ? req.files.file.name
      : "";
    const imageurl = req.body?.fileUrl ? req.body.fileUrl : fileUrl;

    console.log("mid-tour-edit", data);
    const updatedDocument = await MidpackageSchemas.findByIdAndUpdate(
      id,
      {
        ...data,
        image: images,
        fileUrl: imageurl,
        topCategoryName: topCategoryData,
      },
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
    let fileUrl = ""; // For single image upload

    // Handle single image upload
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      await file.mv(path.join(__dirname, "region", fileName));
      fileUrl = `/region/${fileName}`; // Relative path to access the file later
    }

    const data = req.body;
    //  / Store the relative path to the single file

    // Create a new region tour document using the schema
    const regionTourDocument = new RegionSchemas({
      ...data,
      image: req.files && req.files.file ? req.files.file.name : "",
      fileUrl,
    });

    // Save the document to the database
    const savedDocument = await regionTourDocument.save();

    // Send the saved document as the response
    res.status(200).json(savedDocument);
  } catch (error) {
    // Handle errors gracefully
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

app.patch("/region-tour-edit/:id", async (req, res) => {
  const id = req.params.id;
  // console.log("id", id);

  // console.log(newData);
  const data = req.body;
  try {
    let fileUrl = ""; // For single image upload

    // Handle single image upload
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      await file.mv(path.join(__dirname, "region", fileName));
      fileUrl = `/region/${fileName}`; // Relative path to access the file later
    }

    data.fileUrl = fileUrl;
    console.log("region", data);
    const images = req.body?.file
      ? req.body.file
      : req.files && req.files.file
      ? req.files.file.name
      : "";
    const imageurl = req.body?.fileUrl ? req.body.fileUrl : fileUrl;
    const updatedDocument = await RegionSchemas.findByIdAndUpdate(
      id,
      { ...data, image: images, fileUrl: imageurl },
      {
        new: true,
      }
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
    let fileUrl = ""; // For single image upload

    // Handle single image upload
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      await file.mv(path.join(__dirname, "interest", fileName));
      fileUrl = `/interest/${fileName}`; // Relative path to access the file later
    }

    const data = req.body;
    data.fileUrl = fileUrl; // Store the relative path to the single file

    // Create a new interest tour document using the schema
    const interestTourDocument = new InterestSchema({
      ...data,
      image: req.files && req.files.file ? req.files.file.name : "",
      fileUrl,
    });

    // Save the document to the database
    const savedDocument = await interestTourDocument.save();

    // Send the saved document as the response
    res.status(200).json(savedDocument);
  } catch (error) {
    // Handle errors gracefully
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

app.patch("/interest-tour-edit/:id", async (req, res) => {
  const id = req.params.id;
  // console.log("id", id);
  const data = req.body;
  // console.log(newData);
  try {
    let fileUrl = ""; // For single image upload

    // Handle single image upload
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      await file.mv(path.join(__dirname, "interest", fileName));
      fileUrl = `/interest/${fileName}`; // Relative path to access the file later
    }

    data.fileUrl = fileUrl;
    console.log("interest", data);
    const images = req.body?.file
      ? req.body.file
      : req.files && req.files.file
      ? req.files.file.name
      : "";
    const imageurl = req.body?.fileUrl ? req.body.fileUrl : fileUrl;
    const updatedDocument = await InterestSchema.findByIdAndUpdate(
      id,
      { ...data, image: images, fileUrl: imageurl },
      {
        new: true,
      }
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
  console.log(req.body);
  console.log(req.files);
  try {
    let fileUrl = "";
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      // Move the file to the desired folder
      await file.mv(path.join(__dirname, "destinations", fileName));
      fileUrl = `/destinations/${fileName}`; // Relative path to access the file later
    }

    const data = req.body;
    data.fileUrl = fileUrl; // Store the relative path to the file

    // Create a new destination tour document using the schema
    const destinationDocument = await DestinationSchemas.create({
      ...data,
      image: req.files && req.files.file ? req.files.file.name : "",
      fileUrl,
    });

    res.status(200).json({
      data: destinationDocument,
      msg: "Successfully added Destination",
    });
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

app.patch("/destination-tour-edit/:id", async (req, res) => {
  const id = req.params.id;
  // console.log("id", id);
  const newData = req.body;
  // console.log(newData);
  try {
    let fileUrl = ""; // New fileUrl if a new file is uploaded

    // Check if a new file is uploaded
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      // Move the file to the desired folder
      await file.mv(path.join(__dirname, "destinations", fileName));
      fileUrl = `/destinations/${fileName}`; // Relative path to access the file later
    }

    // Update the newData with the new fileUrl if available
    if (fileUrl) {
      newData.fileUrl = fileUrl;
    }

    const newDatas =
      req.files && req.files.file
        ? { ...newData, image: req.files.file.name }
        : { ...newData };

    const updatedDocument = await DestinationSchemas.findByIdAndUpdate(
      id,
      newDatas,
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
  try {
    let fileUrl = "";
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      // Move the file to the desired folder
      await file.mv(path.join(__dirname, "placename", fileName));
      fileUrl = `/placename/${fileName}`; // Relative path to access the file later
    }

    const data = req.body;
    console.log("placenamepost", req.body);
    // Create a new placename tour document using the schema
    const newPlacename = await PlaceNameSchemas.create({
      DestinationName: JSON.parse(data.DestinationName),
      Placename: data.Placename,
      fileUrl,
      showOnMenu: data.showOnMenu,
      showForHotel: data.showForHotel,
      seoTitle: data.seoTitle,
      seoKeyword: data.seoKeyword,
      seoDescription: data.seoDescription,
      extractedText: data.extractedText,

      image: req.files && req.files.file ? req.files.file.name : "",
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

  const data = await PlaceNameSchemas.findById({ _id: id });
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

app.patch("/placename-tour-edit/:id", async (req, res) => {
  const id = req.params.id;
  // console.log("id", id);
  const newData = req.body;
  console.log(newData);
  try {
    let fileUrl = ""; // New fileUrl if a new file is uploaded

    // Check if a new file is uploaded
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      // Move the file to the desired folder
      await file.mv(path.join(__dirname, "destinations", fileName));
      fileUrl = `/destinations/${fileName}`; // Relative path to access the file later
    }

    const data = {};

    Object.keys(req.body).forEach((key) => {
      // Check if the key matches the pattern for DestinationName
      const matchDestinationName = key.match(/^DestinationName\[(id|name)\]$/);

      if (matchDestinationName) {
        // Extract the field (id or name)
        const field = matchDestinationName[1];

        // Store the value in the data object under the appropriate field
        data[field] = req.body[key];
      }
    });
    // Update the newData with the new fileUrl if available
    if (fileUrl) {
      newData.fileUrl = fileUrl;
    }

    console.log("placenamepatch", newData);

    const newDatas =
      req.files && req.files.file
        ? { ...newData, image: req.files.file.name }
        : { ...newData };
    const updatedDocument = await PlaceNameSchemas.findByIdAndUpdate(
      id,
      { ...newDatas, DestinationName: data },
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
  try {
    let fileUrl = ""; // For single image upload
    let newImagesUrl = []; // For multiple image upload

    // Handle single image upload
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      const resizedImageBuffer = await sharp(file.data)
        .resize({ width: 800 }) // Set desired width
        .jpeg({ quality: 80 }) // Set JPEG quality (optional)
        .toBuffer();

      // Save the resized image buffer to a file
      const savedFilePath = path.join(__dirname, "package", fileName);
      await sharp(resizedImageBuffer).toFile(savedFilePath);

      // Move the saved file
      // await file.mv(savedFilePath);

      fileUrl = `/package/${fileName}`; // Relative path to access the file later
    }

    // Handle multiple image upload
    if (req.files && req.files["images[]"]) {
      const images = Array.isArray(req.files["images[]"])
        ? req.files["images[]"]
        : [req.files["images[]"]];

      for (const image of images) {
        const fileName = image.name;
        await image.mv(path.join(__dirname, "packages", fileName));
        newImagesUrl.push(fileName);
      }
    }

    const data = req.body;
    const itineraryData = [];
    const inclusions = [];

    // Extract data from request body
    Object.keys(req.body).forEach((key) => {
      // Check if the key matches the pattern 'itineraryData[index][day]' or 'itineraryData[index][itinerary]'
      const matchItinerary = key.match(
        /^itineraryData\[(\d+)\]\[(day|itinerary)\]$/
      );
      if (matchItinerary) {
        const index = parseInt(matchItinerary[1]);
        const field = matchItinerary[2];
        const value = req.body[key];

        // Ensure the itinerary object exists at the index
        if (!itineraryData[index]) {
          itineraryData[index] = {};
        }

        // Set the field value for the corresponding itinerary object
        itineraryData[index][field] = value;
      }

      // Check if the key matches the pattern 'inclusions[]'
      const matchInclusions = key.match(/^inclusions\[\]$/);

      if (matchInclusions && Array.isArray(req.body[key])) {
        // Access the array of inclusions
        const inclusionValues = req.body[key];
        // Push each value to the 'inclusions' array
        inclusionValues.forEach((value) => {
          inclusions.push(value);
        });
      }

      // Check if the key matches the pattern 'DestinationOption[index][value]' or similar patterns
      const matchDestinationOption = key.match(
        /^DestinationOption\[(\d+)\]\[(value|label)\]$/
      );
      if (matchDestinationOption) {
        const index = parseInt(matchDestinationOption[1]);
        const field = matchDestinationOption[2];
        if (!data.DestinationOption) data.DestinationOption = [];
        if (!data.DestinationOption[index]) data.DestinationOption[index] = {};
        data.DestinationOption[index][field] = req.body[key];
      }

      const matchPlacename = key.match(
        /^placenameCategorySelect\[(\d+)\]\[(value|label)\]$/
      );
      if (matchPlacename) {
        const index = parseInt(matchPlacename[1]);
        const field = matchPlacename[2];
        if (!data.placenameCategorySelect) data.placenameCategorySelect = [];
        if (!data.placenameCategorySelect[index])
          data.placenameCategorySelect[index] = {};
        data.placenameCategorySelect[index][field] = req.body[key];
      }

      const matchmidCategoryOptions = key.match(
        /^midCategoryOptions\[(\d+)\]\[(value|label)\]$/
      );
      if (matchmidCategoryOptions) {
        const index = parseInt(matchmidCategoryOptions[1]);
        const field = matchmidCategoryOptions[2];
        if (!data.midCategoryOptions) data.midCategoryOptions = [];
        if (!data.midCategoryOptions[index])
          data.midCategoryOptions[index] = {};
        data.midCategoryOptions[index][field] = req.body[key];
      }
      const matchtripTypeSelect = key.match(
        /^tripTypeSelect\[(\d+)\]\[(value|label)\]$/
      );
      if (matchtripTypeSelect) {
        const index = parseInt(matchtripTypeSelect[1]);
        const field = matchtripTypeSelect[2];
        if (!data.tripTypeSelect) data.tripTypeSelect = [];
        if (!data.tripTypeSelect[index]) data.tripTypeSelect[index] = {};
        data.tripTypeSelect[index][field] = req.body[key];
      }

      const matchregionSelect = key.match(
        /^regionSelect\[(\d+)\]\[(value|label)\]$/
      );
      if (matchregionSelect) {
        const index = parseInt(matchregionSelect[1]);
        const field = matchregionSelect[2];
        if (!data.regionSelect) data.regionSelect = [];
        if (!data.regionSelect[index]) data.regionSelect[index] = {};
        data.regionSelect[index][field] = req.body[key];
      }

      const matchRelatedpackages = key.match(
        /^Relatedpackages\[(\d+)\]\[(value|label)\]$/
      );
      if (matchRelatedpackages) {
        const index = parseInt(matchRelatedpackages[1]);
        const field = matchRelatedpackages[2];
        if (!data.Relatedpackages) data.Relatedpackages = [];
        if (!data.Relatedpackages[index]) data.Relatedpackages[index] = {};
        data.Relatedpackages[index][field] = req.body[key];
      }
    });

    const cleanedItineraryData = itineraryData.filter((entry) => entry);

    // Now 'cleanedItineraryData' contains the parsed itinerary data
    // console.log(data);

    data.fileUrl = fileUrl; // Store the relative path to the single file
    data.newImagesUrl = newImagesUrl; // Store the relative paths to the multiple files

    // Create a new package tour document using the schema
    const packageDocument = await AddpackageSchemas.create({
      ...data,
      destinationName: JSON.parse(data?.destinationName),
      image: req.files && req.files.file ? req.files.file.name : "", // Store the single image name
      itineraryData: cleanedItineraryData,
      inclusions: inclusions,
      DestinationOption: data?.DestinationOption,
      placeName: data?.placenameCategorySelect,
      midCategoryOptions: data?.midCategoryOptions,
      tripTypeSelect: data?.tripTypeSelect,
      regionSelect: data?.regionSelect,
      Relatedpackages: data?.Relatedpackages,
    });

    res.status(200).json({
      data: packageDocument,
      msg: "Successfully added Package",
    });
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

app.get("/add-package-tour-get-midcategory/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    // Find packages where midCategoryOptions array contains an object with value matching the id
    const data = await AddpackageSchemas.find({
      "midCategoryOptions.value": id,
    });

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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

app.patch("/add-package-tour-edit/:id", async (req, res) => {
  const id = req.params.id;
  const newData = req.body;
  console.log("newdata package", newData);
  try {
    let fileUrl = ""; // For single image upload
    let newImagesUrl = [];
    const itineraryData = [];
    const inclusions = [];
    const data = {};
    // For multiple image upload
    // console.log(req.files);
    // Handle single image upload
    if (req.files && req.files.image) {
      const file = req.files.image;
      const fileName = file.name;
      await file.mv(path.join(__dirname, "package", fileName));
      fileUrl = `/package/${fileName}`; // Relative path to access the file later
    }

    Object.keys(req.body).forEach((key) => {
      const matchDestinationName = key.match(/^destinationName\[(id|name)\]$/);

      if (matchDestinationName) {
        // Extract the field (id or name)
        const field = matchDestinationName[1];

        // Store the value in the data object under the appropriate field
        data[field] = req.body[key];
      }
      // Check if the key matches the pattern 'images[]'
      const matchImages = key.match(/^images\[\]$/);

      if (matchImages) {
        // Access the array of image filenames
        const imageFilenames = req.body[key];
        newImagesUrl = imageFilenames;
        // console.log(imageFilenames.map((filename) => filename));
        // Handle the array of image filenames here
      }

      const matchItinerary = key.match(
        /^itineraryData\[(\d+)\]\[(day|itinerary)\]$/
      );
      if (matchItinerary) {
        const index = parseInt(matchItinerary[1]);
        const field = matchItinerary[2];
        const value = req.body[key];

        // Ensure the itinerary object exists at the index
        if (!itineraryData[index]) {
          itineraryData[index] = {};
        }

        // Set the field value for the corresponding itinerary object
        itineraryData[index][field] = value;
      }

      const matchInclusions = key.match(/^inclusions\[\]$/);

      if (matchInclusions && Array.isArray(req.body[key])) {
        // Access the array of inclusions
        const inclusionValues = req.body[key];
        // Push each value to the 'inclusions' array
        inclusionValues.forEach((value) => {
          inclusions.push(value);
        });
      }

      const matchDestinationOption = key.match(
        /^DestinationOption\[(\d+)\]\[(value|label)\]$/
      );
      if (matchDestinationOption) {
        const index = parseInt(matchDestinationOption[1]);
        const field = matchDestinationOption[2];
        if (!newData.DestinationOption) newData.DestinationOption = [];
        if (!newData.DestinationOption[index])
          newData.DestinationOption[index] = {};
        newData.DestinationOption[index][field] = req.body[key];
      }

      const matchPlacename = key.match(
        /^placenameCategorySelect\[(\d+)\]\[(value|label)\]$/
      );
      if (matchPlacename) {
        const index = parseInt(matchPlacename[1]);
        const field = matchPlacename[2];
        if (!newData.placenameCategorySelect)
          newData.placenameCategorySelect = [];
        if (!newData.placenameCategorySelect[index])
          newData.placenameCategorySelect[index] = {};
        newData.placenameCategorySelect[index][field] = req.body[key];
      }

      const matchmidCategoryOptions = key.match(
        /^midCategoryOptions\[(\d+)\]\[(value|label)\]$/
      );
      if (matchmidCategoryOptions) {
        const index = parseInt(matchmidCategoryOptions[1]);
        const field = matchmidCategoryOptions[2];
        if (!newData.midCategoryOptions) newData.midCategoryOptions = [];
        if (!newData.midCategoryOptions[index])
          newData.midCategoryOptions[index] = {};
        newData.midCategoryOptions[index][field] = req.body[key];
      }
      const matchtripTypeSelect = key.match(
        /^tripTypeSelect\[(\d+)\]\[(value|label)\]$/
      );
      if (matchtripTypeSelect) {
        const index = parseInt(matchtripTypeSelect[1]);
        const field = matchtripTypeSelect[2];
        if (!newData.tripTypeSelect) newData.tripTypeSelect = [];
        if (!newData.tripTypeSelect[index]) newData.tripTypeSelect[index] = {};
        newData.tripTypeSelect[index][field] = req.body[key];
      }

      const matchregionSelect = key.match(
        /^regionSelect\[(\d+)\]\[(value|label)\]$/
      );
      if (matchregionSelect) {
        const index = parseInt(matchregionSelect[1]);
        const field = matchregionSelect[2];
        if (!newData.regionSelect) newData.regionSelect = [];
        if (!newData.regionSelect[index]) newData.regionSelect[index] = {};
        newData.regionSelect[index][field] = req.body[key];
      }

      const matchRelatedpackages = key.match(
        /^Relatedpackages\[(\d+)\]\[(value|label)\]$/
      );
      if (matchRelatedpackages) {
        const index = parseInt(matchRelatedpackages[1]);
        const field = matchRelatedpackages[2];
        if (!newData.Relatedpackages) newData.Relatedpackages = [];
        if (!newData.Relatedpackages[index])
          newData.Relatedpackages[index] = {};
        newData.Relatedpackages[index][field] = req.body[key];
      }
    });

    const cleanedItineraryData = itineraryData.filter((entry) => entry);
    // Handle multiple image upload
    if (req.files && req.files["images[]"]) {
      const images = Array.isArray(req.files["images[]"])
        ? req.files["images[]"]
        : [req.files["images[]"]];

      for (const image of images) {
        const fileName = image.name;
        await image.mv(path.join(__dirname, "packages", fileName));
        const imageUrl = `/packages/${fileName}`; // Relative path to access the file later
        newImagesUrl.push(fileName);
      }
    }

    // Update the data object with new image URLs
    newData.fileUrl = fileUrl; // Update single image URL
    newData.newImagesUrl = newImagesUrl; // Update multiple image URLs

    const updatedDocument = await AddpackageSchemas.findByIdAndUpdate(
      id,
      {
        ...newData,
        image: req.files && req.files.image ? req.files.image.name : "",
        newImagesUrl: newData?.newImagesUrl,
        itineraryData: cleanedItineraryData,
        inclusions,
        DestinationOption: newData?.DestinationOption,
        destinationName: data,
        placeName: newData?.placenameCategorySelect,
      },
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

    const offerTourDocument = new OfferSchemas.create({ ...data });

    res.status(200).json(offerTourDocument);
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
  // const data = req.body;
  try {
    let fileUrl = "";
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      // Move the file to the desired folder
      await file.mv(path.join(__dirname, "blog", fileName));
      fileUrl = `/blog/${fileName}`; // Relative path to access the file later
    }

    const data = req.body;
    // console.log(data);
    const Blogdocument = await BlogSchemas.create({
      ...data,
      image: req.files && req.files.file ? req.files.file.name : "",
      fileUrl,
    });

    // console.log(topTourDocument);

    // const savedDocument = await Blogdocument.save();

    res.status(200).json(Blogdocument);
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

app.patch("/edit-blog/:id", async (req, res) => {
  const id = req.params.id;

  try {
    let fileUrl = "";
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      // Move the file to the desired folder
      await file.mv(path.join(__dirname, "blog", fileName));
      fileUrl = `/blog/${fileName}`; // Relative path to access the file later
    }

    const images = req.body?.file
      ? req.body.file
      : req.files && req.files.file
      ? req.files.file.name
      : "";

    const data = req.body;
    data.fileUrl = fileUrl;
    const imageurl = req.body?.fileUrl || fileUrl;
    console.log("blog", data);
    const updatedDocument = await BlogSchemas.findByIdAndUpdate(
      id,
      { ...data, image: images, fileUrl: imageurl },
      {
        new: true,
      }
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
    const Blogdocument = FaqSchemas.create({ ...data });
    // const savedDocument = await Blogdocument.save();

    res.status(200).json(Blogdocument);
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/admin/Faq-edit/:id", async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  try {
    const data = req.body;
    const updatedDocument = await FaqSchemas.findByIdAndUpdate(
      id,
      { ...data },
      {
        new: true,
      }
    );
    // const savedDocument = await Blogdocument.save();

    res.status(200).json(updatedDocument);
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

app.delete("/faq-delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deletedDocument = await FaqSchemas.findByIdAndDelete(id);

    if (deletedDocument) {
      res.status(200).json({ message: "Document deleted successfully" });
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = await User.create({
      username: email,
      password: hashedPassword,
    });

    // Save the user to the database
    // await newUser.save();

    // Send a success response
    res
      .status(200)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" }); // Temporary folder to save files

// Route to handle file upload
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const pdfPath = req.file.path; // Path to the uploaded file
    const pdfData = fs.readFileSync(pdfPath); // Read the file

    // Extract text from the PDF
    const pdfText = await pdfParse(pdfData);

    // Extracted data from form
    const questionType = req.body.questionType;
    const companyName = req.body.companyName;

    // Perform text extraction or processing
    const extractedData = {
      text: pdfText.text,
      questionType,
      companyName,
    };

    // Cleanup uploaded file
    fs.unlinkSync(pdfPath);

    // Send the extracted data back to the client
    res.json(extractedData);
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Failed to process resume." });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

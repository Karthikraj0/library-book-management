const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

/* ---------------- GET ALL BOOKS ---------------- */
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

/* ---------------- ADD BOOK ---------------- */
router.post("/", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body); // DEBUG

    const {
      title,
      author,
      category,
      publishedYear,
      availableCopies
    } = req.body;

    if (
      !title ||
      !author ||
      !category ||
      publishedYear == null ||
      availableCopies == null
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const book = new Book({
      title,
      author,
      category,
      publishedYear,
      availableCopies
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add book" });
  }
});

/* ---------------- UPDATE COPIES ---------------- */
router.put("/:id", async (req, res) => {
  try {
    const { availableCopies } = req.body;

    if (availableCopies < 0) {
      return res.status(400).json({ message: "Invalid update" });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { availableCopies },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

/* ---------------- DELETE BOOK ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies !== 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete book unless copies = 0" });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;

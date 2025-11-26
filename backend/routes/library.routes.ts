import { Router } from "express";
import {
    createBookCategory,
    getBookCategories,
    createBook,
    getBooks,
    updateBook,
    deleteBook,
    issueBook,
    returnBook,
    getIssuedBooks,
} from "../controllers/library.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Categories
router.post("/categories", protect, authorize("LIBRARIAN", "ADMIN"), createBookCategory);
router.get("/categories", protect, getBookCategories);

// Books
router.post("/books", protect, authorize("LIBRARIAN", "ADMIN"), createBook);
router.get("/books", protect, getBooks);
router.put("/books/:id", protect, authorize("LIBRARIAN", "ADMIN"), updateBook);
router.delete("/books/:id", protect, authorize("LIBRARIAN", "ADMIN"), deleteBook);

// Issues
router.post("/issue", protect, authorize("LIBRARIAN", "ADMIN"), issueBook);
router.post("/return/:id", protect, authorize("LIBRARIAN", "ADMIN"), returnBook);
router.get("/issued", protect, authorize("LIBRARIAN", "ADMIN"), getIssuedBooks);

export default router;

// This middleware will intercept the uploaded pdf by the user
// In-memory buffer for uploaded resumes -- easier for the backend to move it between programs
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else { // return a error message to client for non-pdf data
        cb(new Error("Only PDF files are accepted -- incorrect input."), false)
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 5 *1024 **2}
})

// Once the middleware succesfully creates a buffer, the buffer gets sent to the parser
// Uploaded PDF --> Buffer Created --> Ready to parse
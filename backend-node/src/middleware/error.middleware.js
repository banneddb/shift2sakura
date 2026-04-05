import multer from "multer";

export function errorHandler (err, req, res,    next) {
    console.error("Error:", err.message);

    if (err instanceof multer.MulterError) {

        // For whatever reason, Multer could not read and extract information.
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(413).json({error : "File is too large! Max size is 5MB."});
        }

        else {
            return res.status(413).json({ error: `Upload error: ${err.message}` });
        }
    }


    // invalid file request 
    if (err.message === "Only PDF files are accepted -- incorrect input.") {
        return res.status(415).json({ error: err.message });
    }


    // something else
    return res.status(500).json({ error: "Something went wrong on the server." });

}
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Add a timestamp to avoid duplicate filenames
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept only image files
  } else {
    cb(new Error("Invalid file type. Only images are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });
export default upload;

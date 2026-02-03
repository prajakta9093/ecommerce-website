import multer from "multer";

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// File filter (accept images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const mime = allowedTypes.test(file.mimetype);

  if (mime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpg, png, webp)"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter,
});

export default upload;
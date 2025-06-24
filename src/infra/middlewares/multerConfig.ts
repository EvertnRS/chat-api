import multer from "multer";

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB em bytes
  }
});

export default upload;

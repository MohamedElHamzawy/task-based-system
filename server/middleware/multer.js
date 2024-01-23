const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});
const filefilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "application/pdf"||
    file.mimetype === "application/zip"||
    file.mimetype === "application/msword"||
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"||
    file.mimetype === "video/mp4"||
    file.mimetype === "application/vnd.ms-excel"||
    file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    
  ) {
    cb(null, true);
  } else {
    console.log('cannot add file');
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: filefilter });

module.exports = { upload };
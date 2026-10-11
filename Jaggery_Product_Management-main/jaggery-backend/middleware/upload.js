const multer = require("multer");

// Images are kept in memory and written straight into the database (LONGBLOB),
// so no files are left on disk and the data travels with the DB.
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, WEBP or GIF images are allowed."));
  },
});

module.exports = upload;

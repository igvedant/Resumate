const multer = require("multer");

const upload = multer({
    storage:multer.memoryStorage(),
    fileFilter:(req, file, callback)=>{
        if (file.mimetype !== "application/pdf") {
            return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "resume"));
        }

        callback(null, true);
    },
    limits:{
        fileSize: 3*1024*1024 //3mb
    }
});

module.exports= upload;
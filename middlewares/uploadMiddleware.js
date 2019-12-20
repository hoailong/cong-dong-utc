const path = require('path');
const multer = require('multer');

const multerConfig = {
    storage: multer.diskStorage({
        destination: function (req, file, next) {
            const image = file.mimetype.startsWith('image/');
            const folder = image ? 'photo' : 'file';
            next(null, path.join(__dirname, `../public/upload/${folder}`))
        },
        filename: function (req, file, next) {
            const ext = file.originalname.split('.')[1];
            next(null, file.originalname.split('.')[0].replace(/ /gi, '_') + '_' + Date.now() + '.' + ext);
        }
    }),
    fileFilter: function (req, file, next) {
        if(!file) {
            next();
        }
        next(null, true);
    }
};

module.exports = multer(multerConfig);
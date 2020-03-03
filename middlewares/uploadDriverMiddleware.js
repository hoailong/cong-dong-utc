const path = require('path');
const multer = require('multer');
const os = require('os');
const fs = require('fs');
const getStream = require('get-stream');
const stream = require('stream');
const config = require('./../config');
const driveAPI = require('./../libs/googleDriveAPI');

const multerConfig = {
    storage: multer.diskStorage({
        destination: async (req, file, next) => {
            try{
                const image = file.mimetype.startsWith('image/');
                const folder = req.body.folder;
                const type = image ? 'photo' : 'file';
                const folder_id = config.driveFolder[folder][type];
                const uploaded = await driveAPI.storeFile(file.originalname, file.mimetype, folder_id, file.stream);
                file['id_folder'] = folder_id;
                file['type'] = type;
                file['src'] = uploaded.id;
                next(null, path.join(os.tmpdir()));
            } catch(err) {
                console.log({function: `multerConfig.storage`, message: err});
                next();
            }
        },
        filename: async (req, file, next) => {
            const ext = file.originalname.split('.')[1];
            next(null, file.originalname.split('.')[0].replace(/ /gi, '_') + '_' + Date.now() + '.' + ext);
        }
    }),
    fileFilter: (req, file, next) => {
        if(!file) {
            next();
        }
        next(null, true);
    }
};

module.exports = multer(multerConfig);
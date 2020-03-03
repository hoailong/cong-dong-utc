const fs = require('fs');
const {google} = require('googleapis');
const keys = require('../googleDriver/credentials');
const TOKEN_PATH = './../googleDriver/token.json';
const token = require(TOKEN_PATH);

const client = new google.auth.OAuth2(
    keys.installed.client_id,
    keys.installed.client_secret,
    keys.installed.redirect_uris[0]
);

client.setCredentials(token);

const drive = google.drive({ version: "v3", auth: client });

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
});

module.exports = {
    getToken: async (req, res, next) => {
        try {
            console.log(authUrl);
            const code = req.query.code;
            const res = await client.getToken(code);
            client.setCredentials(res.tokens);
            // Store the token to disk for later program executions
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(res.tokens));
        } catch (err) {
            console.log({function: `googleDriveAPI.getToken`, message: err});
        }
    },
    listFiles: async () => {
        try {
            const res = await drive.files.list({
                pageSize: 1000,
                fields: 'nextPageToken, files(id, name)',
            });
            const files = res.data.files;
            if (files.length) {
                console.log('Files:');
                files.map((file) => {
                    console.log(`${file.name} (${file.id})`);
                });
            } else {
                console.log('No files found.');
            }
        } catch (err) {
            console.log({function: `googleDriveAPI.listFiles`, message: err});
        }
    },
    createFolder: async(name, folder = undefined) => {
        try {
            const res = await drive.files.create({
                resource: {
                    name: name,
                    parents: folder ? [folder] : [],
                    mimeType: 'application/vnd.google-apps.folder'
                },
                fields: 'id'
            });
            console.log(res.data.id);
        } catch (err) {
            console.log({function: `googleDriveAPI.createFolder`, message: err});
        }

    },
    setPublicFolder: async(fileId) => {
        try {
            const res = await drive.permissions.create({
                resource: {
                    role: 'reader', // owner, writer, commenter
                    type: 'anyone'
                },
                fileId: fileId,
                fields: 'id'
            });
            console.log(res.data);
        } catch (err) {
            console.log({function: `googleDriveAPI.setPublicFolder`, message: err});
        }

    },
    storeFile: async(name, mimeType, folder = undefined, body) => {
        try {
            const res = await drive.files.create({
                resource: {
                    name: name,
                    parents: folder ? [folder] : []
                },
                media: {
                    body: body,
                    mimeType: mimeType,
                    // body: fs.createReadStream('E:\\cong-dong-utc\\public\\img/banner.jpg')
                }
            });
            return res.data;
        } catch (err) {
            console.log({function: `googleDriveAPI.storeFile`, message: err});
        }

    },
    deleteFile: async(fileId) => {
        try {
            const res = await drive.files.delete({fileId});
            console.log(res);
        } catch (err) {
            console.log({function: `googleDriveAPI.deleteFile`, message: err});
        }

    },
    deleteFiles: async(fileIds) => {
    try {
        let res = await Promise.all(
            fileIds.map(async fileId => {
                return await drive.files.delete({fileId})
            })
        );
        return res;
    } catch (err) {
        console.log({function: `googleDriveAPI.deleteFile`, message: err});
    }

},
    emptyTrash: async() => {
        try {
            const res = await drive.files.emptyTrash({});
            console.log(res);
        } catch (err) {
            console.log({function: `googleDriveAPI.emptyTrash`, message: err});
        }

    },
};
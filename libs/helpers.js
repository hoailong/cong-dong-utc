const jwt = require('jsonwebtoken');
const download = require('image-downloader');

module.exports = {
    promisify: inner => {
        return new Promise((resolve, reject) => {
        inner((err, res) => {
            if(err) {
                reject(err);
            } else {
                resolve(res);
            }});
        })
    },
    generateToken: (user, secretSignature, tokenLife) => {
        return new Promise((resolve, reject)=> {
            jwt.sign(
                {...user},
                secretSignature,
                {
                    algorithm: 'HS256',
                    expiresIn: tokenLife
                },
                (error, token)=>{
                    if(error){
                        return reject(error);
                    }
                    resolve(token);
                }
            )
        })
    },
    verifyToken: (token, secretKey) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, (error, decoded) => {
                if (error) {
                    return reject(error)
                }
                resolve(decoded);
            })
        })
    },
    downloadPhoto: (url, folder) => {
        return download.image({url: url, dest: folder})
            .then(({ filename, image }) => filename.substring(filename.lastIndexOf("/")+1))
            .catch((error) => error)
    }
};
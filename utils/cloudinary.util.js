const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: 'dqgixm8gu',
    api_key: '626521649321264',
    api_secret: 'PWHOCPSIvDfA44JMvTkcWq-X3vQ'
})

module.exports = cloudinary;
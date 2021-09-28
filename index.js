const cloudinary = require("cloudinary").v2;

// variables de entorno
cloudinary.config({
    cloud_name: 'hgaukkacp',
    api_key: '365913115355532',
    api_secret: 'mg7cOJFmXcjQ3jNu1jo5HbmJxG0'
});

const express = require('express')
const app = express()
const formidable = require('formidable')
const path = require('path')
const uploadDir = __dirname + "/files/"; // uploading the file to the same path as app.js

app.get('*', function (req, res) {
    const index = path.join(__dirname, 'build', 'index.html');
    res.sendFile(index);
  });

app.post('/', async (req, res) => {
    let pathToFile = "";
    var form = new formidable.IncomingForm()
    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = uploadDir
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(500).json({ error: err })        
    });
    
    // guarda el archivo en el file system
    await form.on('fileBegin', function (name, file) {
        const [fileName, fileExt] = file.name.split('.')
        file.path = path.join(uploadDir, `${fileName}_${new Date().getTime()}.${fileExt}`)
        pathToFile = file.path;
    })

    // guarda el archivo en cloudinary para poder visualizarlo u obtenerlo postiormente
    await cloudinary.uploader.upload(pathToFile,
        { resource_type: "auto" },
        function (error, result) {
            if (!error) {
                res.status(200).send(result.secure_url);
            }
            else { console.log(error); }
        });
});



app.listen(process.env.PORT || 5000, () => { console.log("app running on port", process.env.PORT) }
);



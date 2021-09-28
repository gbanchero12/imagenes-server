const cloudinary = require("cloudinary").v2;


const express = require('express');
const app = express();
const path = require('path');
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(fileupload());
app.use(express.static("files"));
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

// variables de entorno
cloudinary.config({
    cloud_name: 'hgaukkacp',
    api_key: '365913115355532',
    api_secret: 'mg7cOJFmXcjQ3jNu1jo5HbmJxG0'
});



app.post('/', async (req, res) => {
    const newpath = __dirname + "\\files\\";
    const files = req.files;
    const paths = [];

    for (let key of Object.keys(files)) {
        const filename = files[key].name;
        await files[key].mv(`${newpath}${filename}`, (err) => {
            if (err)
                console.log(err);
        });
        paths.push({ url: `${newpath}${filename}`, name: `${filename}` });
    }

    for (let path of paths) {
        await cloudinary.uploader.upload(path.url,
            function (error, result) {
                if (!error) {
                    res.status(200).send(result.secure_url);
                }
                else { console.log(error); }
            });
    }
});



app.listen(process.env.PORT || 5000, () => { console.log("app running on port", process.env.PORT) }
);



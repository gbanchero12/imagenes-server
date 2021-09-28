const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config();


const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: 'hofj27rpw',
    api_key: '818691961354294',
    api_secret: 'dQb5NBCGM2VaoUkDRbzOwH2_b6A'
});

app.post('/images', async (req, res, next) => {
    const newpath = __dirname + "\\files\\";
    const files = req.files;
    const paths = [];


    if (Object.keys(files).length < 0) {
        res.status(400).send("No files recived");
        return next();
    }

    for (let key of Object.keys(files)) {
        const filename = files[key].name;
        await files[key].mv(`${newpath}${filename}`, (err) => {
            if (err)
                console.log(err);
        });
        paths.push({ url: `${newpath}${filename}`, name: `${filename}` });
    }

    let urls = new Array();
    for (let path of paths) {

        await cloudinary.uploader.upload(path.url,
            { resource_type: "auto" },
            function (error, result) {
                if (!error) {
                    urls.push(result.secure_url)
                }
                else { console.log(error); }
            });
    }
    res.status(200).send(urls);

});




app.listen(process.env.PORT || 5000, () => { console.log("app running on port", process.env.PORT) }
);

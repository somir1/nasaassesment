
const { response, query } = require("express");
const axios = require("axios");
const Mars = require("../models/mars.model");
const nasa_image_url = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos";
const nasa_api_key = "xtkJvuCxbmg8shgaDNm5jryH0fChhwVqHCr8ejff";


// ?earth_date=2020-10-3&api_key=
module.exports.findAllImages = (req, res) => {
    let earthDate = req['query']['earth_date']

    if (!earthDate) {
        return res.status(400).json({ 
            success: false,
            message: "Please provide a proper date",
        })
    }
    
    let queryParams = `api_key=${nasa_api_key}`;
    if (earthDate) {
        queryParams += '&earth_date=' + earthDate;
    }

    const url = `${nasa_image_url}?${queryParams}`;

    axios.get(url).then(apires => {
        if (apires && apires['status'] == 200 && apires['data']) {
            let photos = apires['data']['photos']
            let photoURLs = photos.map(photo => {
                return {
                    "img_src": photo.img_src,
                    "earth_date": photo.earth_date
                }
            })
            return res.status(200).json({ 
                sucess: true,
                message: "Successfull retrived data",
                result: photoURLs
            })
        } else {
            return res.status(500).json({ 
                success: false,
                message: 'Not successful',
                result: null
            });
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            success: false,
            message: err.message,
            result: null
        })
    })
}
const axios = require('axios');
require('dotenv').config();

const usgs = axios.create({
    baseURL: 'https://api.waterdata.usgs.gov/ogcapi/v0/',
    headers: {
        'Accept': 'application/json',
    },
    timeout: 10_000,
});

module.exports = usgs;

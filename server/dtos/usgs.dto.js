exports.USGSGetStationByStateResDTO = (message = "Data Fetched Successfullly") => ({
    success: true,
    message,
    timestamp: Date.now()
});

exports.USGSGetStationDataResDTO = (message = "Data Fetched Successfullly") => ({
    success: true,
    message,
    timestamp: Date.now()
});

exports.ErrorResDTO = (message = "Something went wrong", code = "SERVER_ERROR") => ({
    success: false,
    error: {
        code,
        message
    },
    timestamp: Date.now()
});
const USGSWaterService = require("../services/usgs.service");

const {
    ErrorResDTO
} = require("../dtos/usgs.dto")

const USGSController = {
    getusgsStation: async (req, res) => {
        try {
            const {
                stateCode
            } = req.query

            const result = await USGSWaterService.getStationbyState(
                stateCode
            )
            res.status(200).json(result)
        }
        catch (err) {
            res.status(400).json(ErrorResDTO(err.message));
        }
    }
};

module.exports = USGSController;
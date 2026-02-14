const usgs = require("../api/usgs.api")

const {
    USGSGetStationByStateResDTO
} = require('../dtos/usgs.dto')

class USGSWaterService {
    static async getStationbyState(stateCode) {
        const response = await usgs.get(
            `collections/monitoring-locations/items`,
            {
                params: {
                    stateCode: stateCode,
                    limit: 10
                }
            }
        );

        return USGSGetStationByStateResDTO(response.data)
    }
}

module.exports = USGSWaterService;
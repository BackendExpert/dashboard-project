const usgs = require("../api/usgs.api")

const {
    USGSGetStationByStateResDTO,
    USGSGetStationDataResDTO,
} = require('../dtos/usgs.dto')

class USGSWaterService {
    static async getStationbyState(stateCode) {
        // const response = await usgs.get(
        //     `collections/monitoring-locations/items?state_code=${stateCode}&limit=50`,
        // );
        const response = await usgs.get(
            `collections/monitoring-locations/items`,
            {
                params: {
                    state_code: stateCode,
                    limit: 50
                }
            }
        );

        return USGSGetStationByStateResDTO(response.data)
    }

    static async getStationData(id) {

        const response = await usgs.get(
            `collections/monitoring-locations/items/${id}`,
        );
        return USGSGetStationDataResDTO(response.data)
    }
}

module.exports = USGSWaterService;
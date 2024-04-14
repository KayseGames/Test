//https://helldiverstrainingmanual.com/api

const HD2API = class {
    constructor() {
        this.fetchData = endpoint => {
            return new Promise((resolve, reject) => {
                axios.get(endpoint)
                    .then(response => {
                        resolve(response.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        }
        this.data = {
            status: {
                planetStatus: [],
            },
            info: {},
            news: {},
            campaign: {},
            planets: {},
            aggregated: [],
            waypoints: {
                origins: [],
                destinations: [],
            },
        };
        this.waypoints;
        this.isAggregated = false;

        this.statusEndpoint = 'https://helldiverstrainingmanual.com/api/v1/war/status';
        this.infoEndpoint = 'https://helldiverstrainingmanual.com/api/v1/war/info';
        this.newsEndpoint = 'https://helldiverstrainingmanual.com/api/v1/war/news';
        this.campaignEndpoint = 'https://helldiverstrainingmanual.com/api/v1/war/campaign';
        this.historyEndpoint = 'https://helldiverstrainingmanual.com/api/v1/war/history/';
        this.planetsEndpoint = 'https://helldiverstrainingmanual.com/api/v1/planets';


        //### OFFICIAL ENDPOINTS ###
        this.getStatus = () => this.fetchData(this.statusEndpoint)
            /* Example Response:
            {
                "warId": 801,
                "time": 5077480,
                "impactMultiplier": 0.0112724025,
                "storyBeatId32": 0,
                "planetStatus": [
                    {
                        "index": 0,
                        "owner": 1,
                        "health": 1000000,
                        "regenPerSecond": 1388.8889,
                        "players": 1451
                    },
                    {
                        "index": 1,
                        "owner": 1,
                        "health": 1000000,
                        "regenPerSecond": 1388.8889,
                        "players": 0
                    },
                    {
                        "index": 2,
                        "owner": 1,
                        "health": 1000000,
                        "regenPerSecond": 1388.8889,
                        "players": 0
                    },
                    ...
                    {
                        "index": 260,
                        "owner": 1,
                        "health": 1000000,
                        "regenPerSecond": 1388.8889,
                        "players": 0
                    }
                ],
                "planetAttacks": [
                    {
                        "source": 125,
                        "target": 34
                    },
                    {
                        "source": 125,
                        "target": 34
                    },
                    {
                        "source": 168,
                        "target": 34
                    },
                    {
                        "source": 168,
                        "target": 34
                    },
                    {
                        "source": 169,
                        "target": 34
                    },
                    {
                        "source": 169,
                        "target": 34
                    },
                    {
                        "source": 169,
                        "target": 170
                    },
                    {
                        "source": 169,
                        "target": 170
                    },
                    {
                        "source": 78,
                        "target": 170
                    }
                ],
                "campaigns": [
                    {
                        "id": 50041,
                        "planetIndex": 34,
                        "type": 0,
                        "count": 8
                    },
                    {
                        "id": 50063,
                        "planetIndex": 170,
                        "type": 0,
                        "count": 5
                    }
                ],
                "communityTargets": [],
                "jointOperations": [],
                "planetEvents": [],
                "planetActiveEffects": [],
                "activeElectionPolicyEffects": [],
                "globalEvents": [],
                "superEarthWarResults": []
            }
        */

        this.getInfo = () => this.fetchData(this.infoEndpoint)
            /* Example Response:
            {
                "warId": 801,
                "startDate": 1706040313,
                "endDate": 1833653095,
                "minimumClientVersion": "0.3.0",
                "planetInfos": [{
                    "index": 0,
                    "settingsHash": 897386910,
                    "position": {
                    "x": 0,
                    "y": 0
                    },
                    "waypoints": [1],
                    "sector": 0,
                    "maxHealth": 1000000,
                    "disabled": false,
                    "initialOwner": 1
                }, {
                    "index": 1,
                    "settingsHash": 3621417917,
                    "position": {
                    "x": 0.05373042,
                    "y": 0.10565466
                    },
                    "waypoints": [2],
                    "sector": 1,
                    "maxHealth": 1000000,
                    "disabled": false,
                    "initialOwner": 1
                },
                ...]
            }
        */

        this.getNews = () => this.fetchData(this.newsEndpoint)
            /* Example Response:
                [{
                    "id": 2804,
                    "published": 2822793,
                    "type": 0,
                    "tagIds": [],
                    "message": "FENRIR III SECURED\nThe Terminid Control System is now fully activated on Fenrir III."
                },
                {
                    "id": 2805,
                    "published": 2899259,
                    "type": 0,
                    "tagIds": [],
                    "message": "TURING SECURED\nThe Terminid Control System is now fully activated on Turing."
                },
                ...]
            */

        this.getCampaign = () => this.fetchData(this.campaignEndpoint)
            /* Example Response:
            [
                {
                    "planetIndex": 34,
                    "name": "Hellmire",
                    "faction": "Terminids",
                    "players": 229146,
                    "health": 182850,
                    "maxHealth": 1000000,
                    "percentage": 81.715,
                    "defense": false,
                    "majorOrder": false,
                    "biome": {
                        "slug": "desolate",
                        "description": "Scorching temperatures, high winds, and low precipitation cause a near-constant cycle of fires to sweep this planet, punctuated by short bursts of lush rebirth between infernos."
                    },
                    "expireDateTime": null
                },
                {
                    "planetIndex": 170,
                    "name": "Fori Prime",
                    "faction": "Terminids",
                    "players": 56952,
                    "health": 622019,
                    "maxHealth": 1000000,
                    "percentage": 37.7981,
                    "defense": false,
                    "majorOrder": false,
                    "biome": {
                        "slug": "canyon",
                        "description": "This arid, rocky biome covering this world has driven the evolution of exceptionally efficient water usage in its various organisms."
                    },
                    "expireDateTime": null
                }
            ]
        */

        this.getHistory = (planetIndex) => {
            this.fetchData(this.historyEndpoint + planetIndex)
                .then(data => {
                    return data;
                }).catch(error => {
                    console.error(error);
                });
        };

        this.getPlanets = () => this.fetchData(this.planetsEndpoint)
            /* Example Response:
            {
                "0": {
                "name": "Super Earth",
                "sector": "Sol",
                "biome": null,
                "environmentals": []
                },
                "1": {
                "name": "Klen Dahth II",
                "sector": "Altus",
                "biome": null,
                "environmentals": [{
                    "name": "Intense Heat",
                    "description": "High temperatures increase stamina drain and speed up heat buildup in weapons"
                }, {
                    "name": "Sandstorms",
                    "description": ""
                }]
                },
                "2": {
                "name": "Pathfinder V",
                "sector": "Altus",
                "biome": {
                    "slug": "highlands",
                    "description": "Rocky outcroppings punctuate fields of tall grass in a planet dominated by misty highland terrain."
                },
                "environmentals": [{
                    "name": "Thick Fog",
                    "description": ""
                }, {
                    "name": "Rainstorms",
                    "description": "Torrential rainstorms reduce visibility"
                }]
                },
                ...
            }
        */


        // ### CUSTOM ENDPOINTS ###

        // combine all available data
        this.aggregateData = () => {
            // for each planet, combine all available data into one planet object
            const aggregatedPlanets = [];
            for (const [planetIndex, planetObj] of Object.entries(this.data.planets)){
                const planetData = _.merge(
                    this.data.status.planetStatus[parseInt(planetIndex)],
                    this.data.info.planetInfos[parseInt(planetIndex)],
                    this.data.status.campaigns.find(event => event.planetIndex == parseInt(planetIndex)),
                    planetObj,
                );
                
                // this.data.campaign has information on planet's currently under attack
                // the of each of the planets in the campaign array is meaningless,
                // but each object of this.data.campaign contains a planetIndex property.
                // if the current planets index is found in the campaign array,
                // merge the campaign object to the planetData object using LoDash,
                // preferring values from this.data.campaign
                const campaign = this.data.campaign.find(campaign => campaign.planetIndex === parseInt(planetIndex));
                if (campaign){
                    _.merge(planetData, campaign);
                }

                aggregatedPlanets.push(planetData);
            }

            // get all unique sector names from entries of this.data.planets
            const sectors = [...new Set(Object.values(this.data.planets).map(planet => planet.sector))];

            // create an object for each sector, containing all planets in that sector
            // the planet objects should be those planet objects found in the aggregatedPlanets array
            const aggregatedSectors = sectors.map(sector => {
                return {
                    name: sector,
                    planets: aggregatedPlanets.filter(planet => planet.sector === sector)
                }
            });
            
            // sort by name then assign to this.data.aggregated
            this.data.aggregated = _.sortBy(aggregatedSectors, sector => sector.name);
            this.determineSectorOwnership();
            this.isAggregated = true;
        };
        this.determineSectorOwnership = () => {
            //  using aggregated data, determine the owner of each sector
            //  while iterating through the planets of a sector,
            //      if any planet has an owner other than 1,
            //          then the sector is owned by that planet's owner
            //      if all planets are owned by 1, but the sector has a planet with the defense property set to true,
            //          then the sector is ownership is determined by a switch statement on the planet's faction property:
            //              case 'Automatons': 2
            //              case 'Bugs': 3
            // by default the sector is owned by 1
            const sectors = this.data.aggregated;
            for (const sector of sectors){
                let owner = 1;
                for (const planet of sector.planets){
                    if (planet.owner !== 1){
                        owner = planet.owner;
                        break;
                    }
                }
                if (owner === 1){
                    for (const planet of sector.planets){
                        if (planet.defense){
                            switch (planet.faction){
                                case 'Automatons':
                                    owner = 3;
                                    break;
                                case 'Bugs':
                                    owner = 2;
                                    break;
                            }
                        }
                    }
                }
                sector.owner = owner;
            }
        }
        this.getSectorOwner = sectorName => {
            !this.isAggregated && this.aggregateData();
            // For the given sector name,
            // use the aggregated data to determine the owner of the sector
            let sector = '';
            let owner = '';
            try {
                sector = (this.data.aggregated.find(sector => sector.name === sectorName));
                owner = sector.owner
                return sector.owner;
            } catch (error) {
                console.log(error);
                return -1
            }
        }
        this.getPlanetOwner = planetIndex => {
            !this.isAggregated && this.aggregateData();
            // For the given planet index,
            // use the aggregated data to determine the owner of the planet
            const planet = this.data.aggregated.find(sector => sector.planets.find(planet => planet.index === planetIndex));
            return planet.owner;
        }
        this.getSectorHelldiverCount = sectorName => {
            !this.isAggregated && this.aggregateData();
            // For the given sector name,
            // loop through all planets in the sector
            // sum the number of players on each planet
            const sector = this.data.aggregated.find(sector => sector.name === sectorName);
            const planets = sector.planets;
            let totalPlayers = 0;
            for (const planet of planets){
                totalPlayers += planet.players;
            }
            return totalPlayers;
        }
        this.getTotalHelldiverCount = () => {
            !this.isAggregated && this.aggregateData();
            // return the total number of players on all planets
            const planets = this.data.aggregated.flatMap(sector => sector.planets);
            const totalPlayers = planets.reduce((total, planet) => total + planet.players, 0);
            return totalPlayers;
        }
        this.getSectorLiberationPercent = sectorName => {
            !this.isAggregated && this.aggregateData();
            // For the given sector name,
            // loop through all planets in the sector
            // sum the health of each planet
            // sum the maxHealth of each planet
            // return the percentage of health
            const sector = this.data.aggregated.find(sector => sector.name === sectorName);
            const planets = sector.planets;
            let totalPercent = 0;
            // if not planets in the sector are owned by 1,
            // and if the sector has no planets with a percentage property, return 0
            if (sector.owner !== 1 && !planets.some(planet => planet.percentage)){
                return '0.00000';
            }
            // for each planet in the sector,
            // check to see if has a percentage property
            //     if it does, add it to the totalPercent
            //     if it doesn't,
            //         calculate the percentage and add it to the totalPercent
            //         the percentage is the health divided by the maxHealth
            for (const planet of planets){
                if (planet.percentage){
                    totalPercent += planet.percentage;
                } else {
                    if (planet.owner == 1){
                        const percent = (planet.health / planet.maxHealth) * 100;
                        totalPercent += percent;
                    }
                }
            }

            const percent = (totalPercent / planets.length);

            // round and pad to the nearest 5 decimal places, pad with 0s if needed
            // JavaScript: "We have rounding functions at home." The rounding function at home:
            const finalPercent = (Math.round((percent) * 100000) / 100000).toFixed(5);
            return finalPercent;
        }
        this.getPlanetDataById = planetIndex => {
            if (!(planetIndex >= 0)){ 
                throw new Error('No planet index provided.');
            }
            const sector = MS().api.data.aggregated.find(sector => sector.planets.find(planet => planet.index === planetIndex));
            const planet = sector.planets.find(planet => planet.index === planetIndex);
            return planet;
        }
        this.getSectorNameByPlanetId = planetIndex => {
            if (!(planetIndex >= 0)){ 
                throw new Error('No planet index provided.');
            }
            const sector = MS().api.data.aggregated.find(sector => sector.planets.find(planet => planet.index === planetIndex));
            return sector.name;
        }
        this.getSectorDetails = sectorName => {
            !this.isAggregated && this.aggregateData();
            // For the given sector name,
            // return the sector object from the aggregated data
            return _.filter(this.data.aggregated, sector => sector.name == sectorName)[0]
        }
        this.getAllPlanetDetails = () => {
            !this.isAggregated && this.aggregateData();
            // return a flat list of all planets in all sectors in the aggregated data
            const planets = _.flatMap(this.data.aggregated, sector => sector.planets);
            // sort planets by index
            const sortedPlanets = _.sortBy(planets, planet => planet.index);
            return sortedPlanets;
        }
        this.getTotalHelldiverCount = () => {
            !this.isAggregated && this.aggregateData();
            // return the total number of players on all planets
            const planets = this.getAllPlanetDetails();
            const totalPlayers = planets.reduce((total, planet) => total + planet.players, 0);
            return totalPlayers;
        }
        this.getAllPlanetsHelldiverCount = () => {
            // return an array of arrays.
            // the sub array contains three elements:
            const planets = this.getAllPlanetDetails();
            const helldiverCounts = planets.map(planet => [
                // the first is the index of the planet.
                planet.index,
                // the second is the number of players on the planet.
                planet.players,
                // the third is the percentage of all players that are on the planet, rounded to the nearest hundredth
                (Math.round((planet.players / this.getTotalHelldiverCount()) * 10000) / 100),
                // the fourth is the sector the planet is in
                planet.sector,
                // the fifth is the name of the planet
                planet.name,
            ]);
            // do not include planets with 0 players, and return sorted by player count
            return helldiverCounts.filter(planet => planet[1] > 0).sort((a, b) => b[1] - a[1]);
        }
        this.getSectorPlanetIds = (sectorName, waypoints=false) => {
            // return an array of planet indexes in the given sector
            // if waypoints is true, then include the indexes of planets with waypoints connected to the planets of the sector
            !this.isAggregated && this.aggregateData();
            const sector = this.data.aggregated.find(sector => sector.name === sectorName);
            const planets = sector.planets;
            let planetIds = planets.map(planet => planet.index);
            if (waypoints){
                // use the destinations and origins arrays to get the indexes of planets with waypoints connected to the sector's planets
                const sectorPlanetIndexes = planets.map(planet => planet.index);
                const origins = this.waypoints.origins;
                const destinations = this.waypoints.destinations;
                for (const planetIndex of sectorPlanetIndexes){
                    // get the indexes of planets with waypoints connected to the current planet
                    const connectedPlanets = origins.find(origin => origin.source === planetIndex);
                    if (connectedPlanets){
                        planetIds = planetIds.concat(connectedPlanets.targets);
                    }
                    // get the indexes of planets with waypoints that connect to the current planet
                    const connectingPlanets = destinations.find(destination => destination.target === planetIndex);
                    if (connectingPlanets){
                        planetIds = planetIds.concat(connectingPlanets.sources);
                    }
                }
            }
            // remove any duplicates, and sort the array
            planetIds = [...new Set(planetIds)].sort((a, b) => a - b);
            return planetIds;
        }
        this.getAllSectorNames = () => {
            !this.isAggregated && this.aggregateData();
            // return an array of all sector names
            return this.data.aggregated.map(sector => sector.name);
        }
        this.getFactionName = factionId => {
            // return the name of the faction with the given id
            switch (factionId){
                case 1:
                    return 'Super Earth';
                case 2:
                    return 'Terminind';
                case 3:
                    return 'Automaton';
                case 4:
                    return 'Illuminate';
                default:
                    return 'Unknown';
            }
        }
        this.getPlanetEvents = () => {
            const eventPlanets = this.data.status.planetEvents;
            return eventPlanets;
        }
        this.getEventPlanetIds = (eventId) => {
            const defensePlanets = this.getPlanetEvents().filter(planet => planet.eventType === eventId);
            const defensePlanetIds = defensePlanets.map(eventPlanet => eventPlanet.planetIndex);
            return defensePlanetIds;
        }
        this.getCampaignData = () => {
            const campaignPlanets = this.data.campaign;
            const planetCampaign = {
                campaignTypeString: '',
                planetIndex: -1,
                campignTypeId: -1,
                description: '',
            };
            const campaignData = [];
            // for each campaignPlanet, fill out the details of the planetCampaign object,
            // and push a copy of the object to the campaignData array
            for (const campaignPlanet of campaignPlanets){
                // determine the campaign type by viewing the planet in aggregated data
                // and checking the 'type' property of the planet
                // note that the aggregated data is an array of sector objects,
                // with its 'planets' property being an array of planet objects
                const planetData = this.getPlanetDataById(campaignPlanet.planetIndex);
                const campaignTypeId = planetData.type;

                let campaignTypeString = '';
                switch (campaignTypeId) {
                    case 0:
                        // campaign is either liberation or defense;
                        // check the owner. if the owner is 1, then it's defense
                        // otherwise, it's liberation
                        campaignTypeString = planetData.owner === 1 ? 'Defense' : 'Liberation';
                        break;
                    case 1:
                        campaignTypeString = 'Recon';
                        break;
                    case 2:
                        campaignTypeString = 'Story';
                        break;
                    default:
                        campaignTypeString = 'Unknown';
                        break;
                }
                
                planetCampaign.description = 
                    `${campaignTypeString} vs ${planetData.faction} on ${planetData.name} in ${planetData.sector}.`;
                planetCampaign.planetIndex = planetData.index;
                planetCampaign.campignTypeId = campaignTypeId;
                planetCampaign.campaignTypeString = campaignTypeString;
                campaignData.push({...planetCampaign});

            }
            return campaignData;
        }
        this.init = () => {
            return Promise.all([
                this.getStatus().then(
                    result => this.data.status = result
                ),
                this.getInfo().then(
                    result => this.data.info = result
                ),
                this.getNews().then(
                    result => this.data.news = result
                ),
                this.getCampaign().then(
                    result => this.data.campaign = result
                ),
                this.getPlanets().then(
                    result => this.data.planets = result
                ),
            ]);
        }
    }
    get waypoints() {
        const waypoints = {};
        // for each planet, get it's waypoints
        // add the waypoints to the waypoints object
        // the key is the planet's index
        // the value is an array of waypoint objects
        const origins = [];
        const destinations = [];
        for (const [planetIndex, planetObj] of Object.entries(this.data.status.planetStatus)){
            const planetWaypoints = planetObj.waypoints;
            if (planetWaypoints.length > 0){
                origins.push({
                    source: parseInt(planetIndex),
                    targets: planetWaypoints
                });
                // for each index in planetWaypoints,
                // if the destinations array does not contain an object with a target value of the index,
                // add an object to the destinations array like so:
                // { target: index, sources: [planetIndex] }
                // otherwise, add the planetIndex to the sources array of the object with the target value of the index
                for (const index of planetWaypoints){
                    const destination = destinations.find(destination => destination.target === index);
                    if (!destination){
                        destinations.push({
                            target: index,
                            sources: [parseInt(planetIndex)]
                        });
                    } else {
                        destination.sources.push(parseInt(planetIndex));
                    }
                }
            }
        }
        waypoints.origins = origins;
        // sort the destinations array by the target value
        destinations.sort((a, b) => a.target - b.target);
        waypoints.destinations = destinations;
        return waypoints;
    }
}


export const hd2api = new HD2API();
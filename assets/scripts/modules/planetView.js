import { ms, getSectorId, initSectorView } from '../main.js';
import { playSFX } from '../util.js';

export const getSVGDataPlanetDetails = id => JSON.parse(document.getElementById(id).getAttribute('data-planet-details')); 

const svgNS = "http://www.w3.org/2000/svg";
const planetsContainer = document.getElementById('planets');
var adjustedPositionX;
var adjustedPositionY;
const planetHoverTooltipFadeSpeed = 300;

export const initPlanetSVGs = () => {
    const planets = ms.api.getAllPlanetDetails();
    let planetGroups = [];
    for (const planet of planets) {
        planetGroups.push(createPlanetGroup(planet));
    };
    setPlanetCSS();
    initWaypointSVGs();
    return planetGroups;
}

const createPlanetGroup = (planet) => {
    if (planet.index == undefined) {
        throw new Error('Planet index is undefined');
    }
    // create a g tag svg element with the name of the planet and append it to the planets container
    const g = document.createElementNS(svgNS, 'g');
    g.id = `${planet.index}`;
    g.classList.add('planet-group');


    const planetData = ms.api.getPlanetDataById(planet.index);
    const planetCircle = createPlanetCircle(planet, planetData);
    const planetName = setPlanetNameLabel(planet);
    
    const planetGroup = {
        g: g,
        circle: planetCircle,
        name: planetName,
    }

    g.appendChild(planetCircle);
    g.appendChild(planetName);
    planetsContainer.appendChild(g);

    return planetGroup;
};

const createPlanetCircle = (planet, planetDetails) => {
    const circle = document.createElementNS(svgNS, 'circle');
    const index = planet.index;
    circle.id = 'planet-circle-' + index;
    circle.classList.add('planet-svg');

    // the sectors-svg is 4kx4k, so we need to adjust the position of the planet
    adjustedPositionX = Math.round((planetDetails.position.x * 2000) + 2000);
    // note that y is inverted in the svg, so we need to multiply by -1
    adjustedPositionY = Math.round((planetDetails.position.y * -1 * 2000) + 2000);
    // append the x and y attributes to ms.ui.planets.positions where the index is the index of the planet
    ms.ui.planets.positions[index] = {x: adjustedPositionX, y: adjustedPositionY};

    circle.setAttributeNS(null, 'r',        ms.ui.planets.SVGSizeHidden);
    circle.setAttributeNS(null, 'cx',       adjustedPositionX);
    circle.setAttributeNS(null, 'cy',       adjustedPositionY);
    circle.setAttributeNS(null, 'fill',     ms.colors[0].none);
    circle.setAttributeNS(null, 'stroke',   ms.colors[planet.owner].Text);
    circle.setAttributeNS(null, 'opacity',  0.2);

    return circle;
}

const setPlanetNameLabel = (planet) => {
    // using the data-name attribute, create a text element with the planet name
    const nameLabel = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    nameLabel.innerHTML = planet.name;
    nameLabel.id = `text-${planet.id}`;
    nameLabel.classList.add('planet-text');
    nameLabel.classList.add('no-select');
    nameLabel.setAttributeNS(null, 'x',                  adjustedPositionX);
    nameLabel.setAttributeNS(null, 'y',                  adjustedPositionY+(ms.ui.planets.SVGSizeHidden * 2)+ms.ui.planets.SVGSizeVisible);
    nameLabel.setAttributeNS(null, 'fill',               ms.colors[planet.owner].Text);
    nameLabel.setAttributeNS(null, 'font-size',          `${ms.ui.planets.labelSize}px`);
    nameLabel.setAttributeNS(null, 'text-anchor',        'middle');
    nameLabel.setAttributeNS(null, 'alignment-baseline', 'middle');

    return nameLabel;
}

const setPlanetCSS = () => {
    $('.planet-svg')
    .css({
        'stroke-width': ms.ui.planets.strokeWidth,
        'z-index': 301,
    }).on('mouseenter', e => {
        // shrink the other planets
        $('.planet-svg').not(e.target).attr('r', 0);
        $(e.target).attr('r', ms.ui.planets.SVGSizeHover);
        // prepare the tooltip
        const planet = ms.api.getPlanetDataById(parseInt(e.target.parentElement.id))
        const tooltip = document.getElementById('planet-tooltip');
        const name = planet.name;
        const environmentals = planet.environmentals.map( env => env.name);
        const players = planet.players;
        const owner = planet.owner;
        const color = ms.getCSSColorById(planet.owner);
        let biome = '';
        try {
            biome = planet.biome.slug;
        } catch (e) {
            biome = 'Unknown';
        }

        // set the faction icon
        $('#planet-tooltip .hover-tooltip-owner-icon').hide();
        switch (owner) {
            case 1:
                $('#planet-tooltip-super-earth-icon').show();
                break;
            case 2:
                $('#planet-tooltip-bugs-icon').show();
                break;
            case 3:
                $('#planet-tooltip-bots-icon').show();
                break;
            default:
                throw new Error('Invalid owner');
        }

        // set the tooltip name and name color
        $('#planet-tooltip-owner-name')
        .text(name)
        .css('color', color);

        // set the tooltip biome bannner
        $('.planet-tooltip-banner').hide();
        switch (biome){
            case 'canyon':
                $('#planet-tooltip-banner-canyon').show();
                break;
            case 'crimsonmoor':
                $('#planet-tooltip-banner-crimson-moor').show();
                break;
            case 'desert':
                $('#planet-tooltip-banner-desert').show();
                break;
            case 'desolate':
                $('#planet-tooltip-banner-desolate').show();
                break;
            case 'ethereal':
                $('#planet-tooltip-banner-ethereal').show();
                break;
            case 'highlands':
                $('#planet-tooltip-banner-highlands').show();
                break;
            case 'icemoss-special':
                $('#planet-tooltip-banner-icemoss-special').show();
                break;
            case 'icemoss':
                $('#planet-tooltip-banner-icemoss').show();
                break;
            case 'jungle':
                $('#planet-tooltip-banner-jungle').show();
                break;
            case 'mesa':
                $('#planet-tooltip-banner-mesa').show();
                break;
            case 'moon':
                $('#planet-tooltip-banner-moon').show();
                break;
            case 'rainforest':
                $('#planet-tooltip-banner-rainforest').show();
                break;
            case 'swamp':
                $('#planet-tooltip-banner-swamp').show();
                break;
            case 'toxic':
                $('#planet-tooltip-banner-toxic').show();
                break;
            case 'tundra':
                $('#planet-tooltip-banner-tundra').show();
                break;
            case 'winter':
                $('#planet-tooltip-banner-winter').show();
                break;
            default:
                $('#planet-tooltip-banner-dummy').show();
                break;
        }

        // enable the environmentals
        $('.planet-tooltip-env-icon').hide();
        environmentals.length == 0 && $('#planet-tooltip-dummy-icon').show();
        for (const env of environmentals) {
            switch (env) {
                case 'Acid Storms':
                    $('#planet-tooltip-acid-storms-icon').show();
                    break;
                case 'Blizzards':
                    $('#planet-tooltip-blizzards-icon').show();
                    break;
                case 'Extreme Cold':
                    $('#planet-tooltip-extreme-cold-icon').show();
                    break;
                case 'Fire Tornadoes':
                    $('#planet-tooltip-fire-tornadoes-icon').show();
                    break;
                case 'Intense Heat':
                    $('#planet-tooltip-intense-heat-icon').show();
                    break;
                case 'Ion Storms':
                    $('#planet-tooltip-ion-storms-icon').show();
                    break;
                case 'Meteor Storms':
                    $('#planet-tooltip-meteor-storms-icon').show();
                    break;
                case 'Rainstorms':
                    $('#planet-tooltip-rainstorms-icon').show();
                    break;
                case 'Sandstorms':
                    $('#planet-tooltip-sandstorms-icon').show();
                    break;
                case 'Thick Fog':
                    $('#planet-tooltip-thick-fog-icon').show();
                    break;
                case 'Tremors':
                    $('#planet-tooltip-tremors-icon').show();
                    break;
                case 'Volcanic Activity':
                    $('#planet-tooltip-volcanic-activity-icon').show();
                    break;
                default:
                    $('#planet-tooltip-dummy-icon').show();
                    break;
            }
        }

        // set the helldiver count
        $('#planet-tooltip-helldivers').text(players);

        $('#planet-tooltip').css({ 'opacity': 1 });
        playSFX('planet-hover-sfx', 'FriendlyInspect', 'wav', 5, ms.ui.sound.sfxEnabled, ms.userInteraction);
    }).on('mouseleave', e => {
        // normalize the planet size
        $('.planet-svg').attr('r', ms.ui.planets.SVGSizeVisible);
        $('#planet-tooltip').css({ 'opacity': 0});
    }).on('click', e => {
        togglePlanetView(e.target.parentElement.id);
    });
    $('.planet-text').css({
        'z-index': 300,
        'pointer-events': 'none',
    });
    $('.planet-svg, .planet-text').css({
        'transition': '0.5s',
    });
    $('#planet-tooltip').css({
        'transition': `opacity ${planetHoverTooltipFadeSpeed}ms`,
    });
    $('#planet-tooltip').find('div, img').css({
        'transition': `opacity ${planetHoverTooltipFadeSpeed}ms`,
    });
}
const togglePlanetView = planetId => {
    // if the planet is not in ms.ui.planets.sector, return
    if (!ms.ui.planets.sector.includes(parseInt(planetId))) {
        // get the sector id and name from the planet Id
        const sectorName = ms.api.getPlanetDataById(parseInt(planetId)).sector;
        const sectorId = getSectorId(sectorName);
        initSectorView(sectorName, sectorId);
        return;
    }
    playSFX('planet-click-sfx', 'Ding3', 'wav', 25, ms.ui.sound.sfxEnabled, ms.userInteraction);
};

const initWaypointSVGs = () => {
    // get the origin waypoints from the api
    const originWaypoints = ms.api.waypoints.origins;
    // set the planet positions from the global ms object
    const planetPositions = ms.ui.planets.positions;
    // get the waypoints container
    const waypointsContainer = document.getElementById('waypoints');
    const svgNS = "http://www.w3.org/2000/svg";
    let waypointIndex = 0;
    // loop through the waypoints
    for (const waypoint of originWaypoints) {
        // for each waypoint.destination
        for (let targetIndex = 0; targetIndex < waypoint.targets.length; targetIndex++) {
            // create a line element
            const line = document.createElementNS(svgNS, 'line');
            // set the x1 and y1 attributes to the position of the planet
            line.setAttributeNS(null, 'x1', planetPositions[waypoint.source].x);
            line.setAttributeNS(null, 'y1', planetPositions[waypoint.source].y);
            // set the x2 and y2 attributes to the position of the waypoint
            line.setAttributeNS(null, 'x2', planetPositions[waypoint.targets[targetIndex]].x);
            line.setAttributeNS(null, 'y2', planetPositions[waypoint.targets[targetIndex]].y);
            // set the stroke color to the color of the planet owner
            line.setAttributeNS(null, 'stroke', ms.colors[0].waypoint.normal);
            // set the stroke width to 2
            line.setAttributeNS(null, 'stroke-width', 2);
            // append the line to the waypoints container
            waypointsContainer.appendChild(line);
            // set the data-source-planet attribute to the source planet index
            line.setAttribute('data-source-planet', waypoint.source);
            // set the data-target-planet attribute to the target planet index
            line.setAttribute('data-target-planet', waypoint.targets[targetIndex]);
            // set the id of the line to the waypoint index
            line.id = `waypoint-${waypointIndex}`;
            // increment the waypoint index
            waypointIndex++;
            // add the waypoint-svg class to the line
            line.classList.add('waypoint-svg');
            // hide the line
            $(line).css('pointer-events', 'none');
            $(line).hide();
        }
    }
}

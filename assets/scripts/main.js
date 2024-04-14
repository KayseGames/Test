import { Debug } from "./modules/debug.js";
import { detectWindowSize, calculateDimensions } from "./modules/responsiveResize.js";
import { Particles } from "./modules/particles.js";
import { hd2api } from "./api/HD2API.js";
import { playSFX } from "./util.js";
import { getSVGDataPlanetDetails, initPlanetSVGs } from "./modules/planetView.js";

/*  TODO:
    FIX
    - [ ] Choppy fog cycle
    - [ ] playSFX play/pause error
    - [ ] Stabilize horizontal map-frame parallax on different aspect ratios
    - [ ] Edges of screen on very wide aspect ratios
    - [x] On initialization, map table should tilt before transition speed css is applied
    - [x] Fix map table centering
        - [x] Add temp folder to assets/images
        - [x] Duplicate map table frame and move to temp folder
            - [x] Add lines to indicate center of map table image
            - [x] Add lines to indicate center of map table cutout
                - [x] The intersections of the lines above should be the same
        - [x] Find a way to dynamically align all elements
    - [x] Restore sectors-svg hover functionality
    - [x] Re-apply the svg mask to the hex grid, nebula bg, and sectors svg
    IMPROVE
    - [ ] Readability
        - [ ] Move all functions to their appropriate modules
        - [ ] Eliminate import/export of ms where possible, use parameter passing instead
    - [ ] Element creation
        - [ ] Use a list of strings to generate and inject HTML
        - [ ] Use a variable to dynamically increase the z-index of elements
        - [ ] Remove elements from index.html that don't have to be included there
        - [ ] Simplify constants (especially in responsiveResize.js)
        - [ ] Rename images so that they can be applied to their element dynamically
    - [ ] Debug
        - [ ] Add sliders for all settings
        - [ ] Make wireframes for where elements should be
            - [ ] Make toggle for wireframe
            - [ ] Add debug toggle for wireframes
            - [ ] Make Debug for wireframe to check for equivelant image size and position
    - [ ] Assets
        - [ ] Finish Table-Frame image
        - [ ] Floor center circle details
    ADD
    - [ ] Sector Zoom view
        - [ ] .sector path on-click, center and freeze floor/map frame elements
        - [ ] Freeze parallax functionality
        - [ ] set xRotation transfrom to 0
        - [ ] zooom in on clicked sector
        - [ ] enable sector zoom panning
    - [x] Sector Hover
    - [x] Sector Tooltip
    - [x] Planets svg
    - [ ] Fullscreen button
    - [ ] Comments to codebase
    - [ ] Codebase uniform style
    - [ ] Art
    - [ ] Hex grid shimmer effect (COMPLEX)
    - [ ] SFX
        - [x] Sounds folder with SFX and Music subfolders
        - [ ] SFX UI toggle
        - [ ] Music
        - [ ] Music UI toggle
*/

// (meta settings)
export const ms = {
    window: {
        W: window.innerWidth,
        H: window.innerHeight,
    },
    mouse: {
        x: 0,
        y: 0,
        xPercent: 0,
        yPercent: 0,
        xRelative: 0,
        yRelative: 0,
    },
    debug: {},
    debugUpdating: false,
    parallax: {
        updating: false,
        updateRate: 0.500, // in seconds
        easing: 'linear',
        frameMoveMultiplier: 1,
        frameSizeMultiplier: 2,
        floorSizeMultiplier: 1,
        mapTableTiltDegrees: 20,
        perspective: `100px`,
    },
    Layers: {
        Floor: {
            id: 'Floor',
            layer: 'floor',
            H: 0,
            W: 0,
        },
        RingLightGlow: {
            id: 'RingLightGlow',
            layer: 'floor',
            strength: 0,
        },
        Steam1: {
            id: 'Steam1',
            layer: 'floor',
        },
        Steam2: {
            id: 'Steam2',
            layer: 'floor',
        },
        MapLayers: {
            id: 'MapLayers',
            layer: 'projection',
        },
        MaskedSVGs: {
            id: 'MaskedSVGs',
            layer: 'projection',
        },
        MapMask: {
            id: 'MapMask',
            layer: 'projection',
        },
        HexGrid: {
            id: 'HexGrid',
            layer: 'projection',
        },
        Sectors: {
            id: 'Sectors',
            layer: 'map',
        },
        NebulaBG: {
            id: 'NebulaBG',
            layer: 'map',
        },
    },
    floor: {
        W: 2500,
        H: 1620,
        padding: {
            v: 0,
            h: 0,
        },
        shift: {
            v: 0,
            h: 0,
        },
    },
    ringLightGlow: {
        strength: 0,
    },
    particles: {
        settings: {
            Color: "rgba(255,255,255,1)",
            Size: {
                id: 'Size',
                value: 70,
                min: 0,
                max: 500,
                step: 5,
            },
            SizeMultiplier: {
                id: 'SizeMultiplier',
                value: 0.05,
                min: 0.01,
                max: 1,
                step: 0.01,
            },
            Count: {
                id: 'Count',
                value: 200,
                min: 0,
                max: 1000,
                step: 10,
            },
            SpeedX: {
                id : 'SpeedX',
                value: 2,
                min: 0,
                max: 10,
                step: 0.1,
            },
            SpeedY: {
                id : 'SpeedY',
                value: 2,
                min: 0,
                max: 10,
                step: 0.1,
            },
            CurveIntensity: {
                id: 'CurveIntensity',
                value: 20,
                min: 0,
                max: 100,
                step: 1,
            },
            FadeInDuration: {
                id: 'FadeInDuration',
                value: 1,
                min: 0,
                max: 10,
                step: .1,
            },
            FadeOutDuration: {
                id: 'FadeOutDuration',
                value: 2,
                min: 0,
                max: 15,
                step: 0.1,
            },
            InvisibleDuration: {
                id: 'InvisibleDuration',
                value: 20,
                min: 0,
                max: 100,
                step: 1,
            },
            VisibleDuration: {
                id: 'VisibleDuration',
                value: 0.1,
                min: 0,
                max: 10,
                step: 0.01,
            },
            FadeDurationMultiplier: {
                id: 'FadeDurationMultiplier',
                value: 0.75,
                min: 0.0,
                max: 1.25,
                step: 0.01,
            },
        }
    },
    mapMask: {
        circle1: {},
        circle2: {},
    },
    api: {},
    ui: {
        tooltipFadeSpeed:           0,
        updatingSectorTooltip:      false,
        sectorTooltipUpdateDelay:   50, //im ms
        view:                       'galaxy',
        currentSector:              '',
        sectorHover:                {},
        elementMouseOver:         {},
        planets: {
            SVGSizeHidden:      0,
            SVGSizeVisible:     75,
            SVGSizeHover:       125,
            SVGSizeClick:       100,
            strokeWidth:        10,
            labelSize:          40,
            relevant:           [],
            sector:             [],
            positions:          [],
            waypoints:          [],
        },
        planet: {
            id: '',
            name: '',
            owner: '',
            liberationPercent: '',
            helldiverCount: '',
        },
        sound: {
            sfxEnabled:         true,
            musicEnabled:       true,
            ambienceEnabled:    true,
        },
    },
    userInteraction: false,
    colors: [
        {   // UI/Misc
            none:               `rgba(0,     0,      0,      0.00    )`,
            HelldiverYellow:    `rgba(254,   236,    24,     1.00    )`,
            HelldiverYellow75:  `rgba(254,   236,    24,     0.75    )`,
            waypoint: {
                normal:         `rgba(128,   128,    128,    1.00    )`,
            }
        },
        {   // Liberated
            R:                  177,
            G:                  219,
            B:                  243,
            CSV:                `177,219,243`,
            RGB:                '177 219 243',
            BG:                 `rgba(198,   240,    255,    0.10    )`,
            FG:                 `rgba(54,    148,    182,    0.55    )`,
            BGLight:            `rgba(0,     0,      0,      0.20    )`,
            FGLight:            `rgba(54,    148,    182,    0.40    )`,
            BGLighter:          `rgba(0,     0,      0,      0.10    )`,
            FGLighter:          `rgba(54,    148,    182,    0.20    )`,
            BGTint:             `rgba(0,     0,      0,      0.08    )`,
            Text:               `rgba(177,   219,    243,    1.00    )`,
        },
        {   // Terminid
            R:                  255,
            G:                  202,
            B:                  0,
            CSV:                `255,202,0`,
            RGB:                '255 202 0',
            BG:                 `rgba(255,   202,    0,      0.70    )`,
            FG:                 `rgba(255,   202,    0,      0.90    )`,
            BGLight:            `rgba(255,   202,    0,      0.50    )`,
            FGLight:            `rgba(255,   202,    0,      0.80    )`,
            BGLighter:          `rgba(255,   202,    0,      0.25    )`,
            FGLighter:          `rgba(255,   202,    0,      0.40    )`,
            BGTint:             `rgba(255,   202,    0,      0.08    )`,
            Text:               `rgba(250,   183,    19,     1.00    )`,
        },
        {   // Automoton
            R:                  255,
            G:                  116,
            B:                  116,
            CSV:                `255,116,116`,
            RGB:                '255 116 116',
            BG:                 `rgba(255,   116,    116,    0.70    )`,
            FG:                 `rgba(255,   116,    116,    0.90    )`,
            BGLight:            `rgba(255,   116,    116,    0.50    )`,
            FGLight:            `rgba(255,   116,    116,    0.80    )`,
            BGLighter:          `rgba(255,   116,    116,    0.25    )`,
            FGLighter:          `rgba(255,   116,    116,    0.40    )`,
            BGTint:             `rgba(255,   116,    116,    0.08    )`,
            Text:               `rgba(255,   116,    116,    1.00    )`,
        },
    ],
    getCSSColorById: id => {
        let color = "";
        switch (id) {
            case 1:
                color = 'var(--super-earth-blue)';
                break;
            case 2:
                color = 'var(--terminid-orange)';
                break;
            case 3:
                color = 'var(--automaton-red)';
                break;
            case 4:
                color = 'var(--illuminates-purple)';
                break;
            default:
                throw new ('Invalid color id');
        }
        return color;
    },
}



const getMouseDetails = (e) => {
    let x = e.pageX;
    let y = e.pageY;
    let xPercent = x / window.innerWidth;
    let yPercent = y / window.innerHeight;
    let xRelative = (xPercent - 0.5) * 2;
    let yRelative = (yPercent - 0.5) * 2;
    return {
        x: x,
        y: y,
        xPercent: xPercent,
        yPercent: yPercent,
        xRelative: xRelative,
        yRelative: yRelative,
    }
}
const getDebugHTML = () => {
    let html = `
        <div id="debug" style="z-index: 1000;">
            <h1 class="text-light d-flex justify-content-center">Debug:</h1>
            <div class="container">
                <div class="row">
                    <div class="col-sm">
                        <h2>Independant</h2>
                        <table class="table text-light" >
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>x</th>
                                    <th>y</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Window Dimensions</td>
                                    <td>${window.innerWidth}</td>
                                    <td>${window.innerHeight}</td>
                                </tr>
                                <tr>
                                    <td>Mouse Position</td>
                                    <td>${ms.mouse.x}</td>
                                    <td>${ms.mouse.y}</td>
                                </tr>
                                <tr>
                                    <td>Mouse Pos.</td>
                                    <td>${Math.round(ms.mouse.xPercent*100)}%</td>
                                    <td>${Math.round(ms.mouse.yPercent*100)}%</td>
                                </tr>
                                <tr>
                                    <td>Relative Mouse Pos.</td>
                                    <td>${Math.round(ms.mouse.xRelative*100)}%</td>
                                    <td>${Math.round(ms.mouse.yRelative*100)}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="col-sm">
                        <h2>Misc</h2>
                        <table class="table text-light">
                            <tbody>
                                <tr>
                                    <td>Ring Light Glow Strength</td>
                                    <td>${ms.ringLightGlow.strength}</td>
                                </tr>
                                <tr>
                                    <td>Ring Light Opacity</td>
                                    <td>${Math.round($('ring-light-glow').css('opacity')*100)}%</td>
                                </tr>
                                <tr>
                                    <td>Vignette Opacity</td>
                                    <td>${Math.round($('ring-light-glow').css('opacity')*100)}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="col-sm">
                        <h2>Floor</h2>
                        <table class="table text-light">
                            <tbody>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>x</th>
                                        <th>y</th>
                                    </tr>
                                </thead>
                                <tr>
                                    <td>Calc. Dimensions</td>
                                    <td>${ms.floor.W}</td>
                                    <td>${ms.floor.H}</td>
                                </tr>
                                <tr>
                                    <td>Calc. Padding</td>
                                    <td>${ms.floor.padding.h}</td>
                                    <td>${ms.floor.padding.v}</td>
                                </tr>
                                <tr>
                                    <td>Floor Shift</td>
                                    <td>${Math.round(ms.floor.shift.h)}px</td>
                                    <td>${Math.round(ms.floor.shift.v)}px</td>
                                </tr>
                                <tr>
                                    <td>Transformation</td>
                                    <td>${Math.round($('#floor').css('transform').split(',')[4])}px</td>
                                    <td>${$('#floor').css('transform').split(',')[5] ? Math.round($('#floor').css('transform').split(',')[5].slice(0,-1)) : ''}px
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `;
    return html;
};
const debug = () => ms.debug.update(getDebugHTML());

const createMapMask = () => {
    const maskStart = 93;
    const maskMiddle = 95;
    const maskEnd = 100;
    $('#mask-svg').html(`
        <defs>
            <radialGradient id="Gradient">
                <stop offset="${maskStart}%" stop-color="white" />
                <stop offset="${maskMiddle}%" stop-color="gray" />
                <stop offset="${maskEnd}%" stop-color="black" />
            </radialGradient >
            <mask id="map-mask"></mask>
            <mask id="map-mask-2"></mask>
        </defs>
    `);
    const mapMask = document.querySelector('#map-mask');
    const mapMask2 = document.querySelector('#map-mask-2');

    const svgNS = "http://www.w3.org/2000/svg";
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttributeNS(null, 'fill', "url(#Gradient)");
    circle.id = 'circle-mask';
    ms.mapMask.circle1 = circle;
    mapMask.appendChild(circle);

    const circle2 = document.createElementNS(svgNS, 'circle');
    circle2.setAttributeNS(null, 'fill', "url(#Gradient)");
    circle2.id = 'circle-mask2';
    ms.mapMask.circle2 = circle2;
    mapMask2.appendChild(circle2);
}

const bindElements = () => {
    createMapMask();

    // Get the elements for the floor layer and add them to the ms object
    const floorElements = [
        'steam-1',
        'steam-2',
        'floor',
        'ring-light-glow',
        'particles',
    ]
    for (let element of floorElements) {
        $(`#${element}`).addClass('floor-layer');
        $(`#${element}`).addClass('parallax-layer');
    }

    const mapFrameLayerElements = [
        'mask-svg',
        'hex-grid',
        'map-table-frame',
        'map-layers', //contains nebula, sectors, anbd hex grid
    ];
    for (let element of mapFrameLayerElements) {
        $(`#${element}`).addClass('frame-layer');
        $(`#${element}`).addClass('parallax-layer');
    }
    $('#frame-layers').addClass('parallax-layer');
    $('#frame-layers').addClass('floor-layer');

    const mapLayerElements = [
        'nebula-bg',
        'masked-svgs',
        'sectors-svg'
    ];
    for (let element of mapLayerElements) {
        // add the map layer class to the element using jQuery
        $(`#${element}`).addClass('map-layer');
        $(`#${element}`).addClass('parallax-layer');
    }


    const viewportLayerElements = [
        'vignette',
        'sector-tooltip'
    ];
    for (let element of viewportLayerElements) {
        $(`#${element}`).addClass('ui-layer');
    }
}



const setSliders = () => {
    const sliders = document.createElement('div');
    sliders.id = 'sliders-container';
    $(sliders).css({
        width: '15%',
    });
    $(sliders).html(`
        <div class="accordion bg-dark text-light" id="accordionExample">
            <div class="accordion-item">
                <h2 class="accordion-header text-light" id="headingOne">
                    <button class="accordion-button bg-dark text-light collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Particles
                    </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div class="accordion-body bg-dark">
                        <span id="slider-container"></span>
                    </div>
                </div>
            </div>
        </div>
    `);
    document.body.appendChild(sliders);
    for (let setting in ms.particles.settings) {
        (ms.particles.settings[setting] != "rgba(255,255,255,1)") && buildSlider(ms.particles.settings[setting], 'Particle');
    }
    $(sliders).hide();
}
const buildSlider = (sliderObj, layer='') => {
    const { id, min, max, step, value} = sliderObj;
    const slider = document.createElement('span');
    slider.id = `${layer}${id}Slider`;
    const html = `
            <label id="${layer}${id}SliderLabel" for="${layer}${id}Slider" class="form-label mb-0">${layer} ${id}: ${value}</label>
            <input id="${layer}${id}SliderInput" type="range" class="form-range" min="${min}" max="${max}" step="${step}" value="${value}">
    `
    slider.innerHTML = html;
    const sliderContainer = document.querySelector('#slider-container');
    sliderContainer.appendChild(slider);
    bindSlider(id, layer);
}
const bindSlider = (id, layer='') => {
    const slider = document.getElementById(`${layer}${id}SliderInput`);
    slider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        const label = document.getElementById(`${layer}${id}SliderLabel`);
        label.innerHTML = `${layer} ${id}: ${value}`;
        
        switch (layer) {
            case 'Particle':
                ms.particles.settings[id].value = value;
                ms.particles.obj.updateSettings(ms.particles.settings);
                break;
            default:
                break;
        }
    });
}

const setCSS = () => {
    $('.floor-layer').css({
        'width':                `${ms.floor.W * ms.parallax.floorSizeMultiplier}px`,
        'height':               `${ms.floor.H * ms.parallax.floorSizeMultiplier}px`,
        'top':                  `${(window.innerHeight - ms.floor.H) / 2}px`,
        'left':                 `${(window.innerWidth - ms.floor.W) / 2}px`,
        'position':             `absolute`,
        'pointer-events':       `none`,
    });

    const frameLayerSize = ms.parallax.frameSizeMultiplier * 100;
    const frameLayerMargin = -((frameLayerSize - 100)/2);
    $('.frame-layer').css({
        'width':                `${frameLayerSize}%`,
        'height':               `${frameLayerSize}%`,
        'top':                  `${frameLayerMargin + (10 - (ms.parallax.mapTableTiltDegrees)/2)}%`,
        'left':                 `${frameLayerMargin}%`,
        'position':             `absolute`,
        'pointer-events':       `none`,
    });

    $('.frame-layer, #map-layers').css({
        transformStyle: `preserve-3d`,
        // rotate on X axis by 20 degrees
        transform: `rotateX(${ms.parallax.mapTableTiltDegrees}deg)`,
    });

    const gridLayerSizeMultiplier = 133.7;
    $('#hex-grid').css({
        'mask':                 `url(#map-mask)`,
        'width':                `${gridLayerSizeMultiplier}%`,
        'height':               `${gridLayerSizeMultiplier}%`,
        'top':                  `${-((gridLayerSizeMultiplier - 100)/2)}%`,
        'left':                 `${-((gridLayerSizeMultiplier - 100)/2)}%`,
        'position':             `relative`,
        'pointer-events':       `none`,
        'opacity':              `0.3`,
    });
    $('#nebula-bg').css({
        'mask':                 `url(#map-mask)`,
        'width':                `${gridLayerSizeMultiplier / 2}%`,
        'height':               `${gridLayerSizeMultiplier / 2}%`,
        'top':                  `${-((gridLayerSizeMultiplier / 2 - 100)/2)}%`,
        'left':                 `${-((gridLayerSizeMultiplier / 2 - 100)/2)}%`,
        'position':             `relative`,
        'pointer-events':       `none`,
    });

    const sectorsSvg = document.getElementById('sectors-svg');
    const hexGridHeight = $('#hex-grid').height();
    const sectorSizeMultiplier = 0.93;
    sectorsSvg.setAttribute('width', hexGridHeight * sectorSizeMultiplier);
    sectorsSvg.setAttribute('height', hexGridHeight * sectorSizeMultiplier);


    //vertically centered circle mask, value from setMapFrameLayerCSS
    const maskCircleDiameter = hexGridHeight;
    ms.mapMask.circle1.setAttributeNS(null, 'r', maskCircleDiameter/2);
    ms.mapMask.circle1.setAttributeNS(null, 'cy', maskCircleDiameter/2);
    const circleHorizontalOffset = maskCircleDiameter / 1.3;
    ms.mapMask.circle1.setAttributeNS(null, 'cx', (circleHorizontalOffset));

    ms.mapMask.circle2.setAttributeNS(null, 'r', maskCircleDiameter/2);
    ms.mapMask.circle2.setAttributeNS(null, 'cy', (maskCircleDiameter/2)*0.9);
    const circle2HorizontalOffset = maskCircleDiameter / 2.15;
    ms.mapMask.circle2.setAttributeNS(null, 'cx', (circle2HorizontalOffset));
    

    $('#sectors-svg').css({
        'mask':                 `url(#map-mask-2)`,
        'top':                  `${-47.8}%`,
        'left':                 `${29.9}%`,
        'position':             `relative`,
    });

    $('.ui-layer').css({
        'top':                  `0`,
        'left':                 `0`,
    });
    $('#vignette').css({
        'background-size':      `cover`,
        'width':                `${window.innerWidth}px`,
        'height':               `${window.innerHeight}px`,
        'position':             `fixed`,
    });
    $('.parallax-layer').css({
        'background-size':      `contain`,
        'transition':           `transform ${ms.parallax.updateRate}s ${ms.parallax.easing}`,
    });

    $('#vignette').css({
        'transition':           `transform ${ms.parallax.updateRate}s ${ms.parallax.easing}`,
        'pointer-events':       `none`,
    });
}

const galaxyViewParallax = e => {
    if (ms.parallax.updating) return;
    ms.parallax.Updating = true;
    setTimeout(() => ms.parallax.Updating = false, ms.parallaxUpdateRate*1000);
    //calculate the shift
    let shift = {
        h: - ((e.pageX - (window.innerWidth / 2)) * Math.abs(window.innerWidth - ((375 * window.innerHeight) / 162)) / (window.innerWidth)),
        v: - ((e.pageY - (window.innerHeight / 2)) * Math.abs(window.innerHeight - ((3 * window.innerHeight) / 2)) / (window.innerHeight)),
    };
    ms.floor.shift = shift;
    //apply the shift using the transform translate property
    $('.floor-layer').not('#frame-layers, #particles').css({
        transformStyle: `preserve-3d`,
        perspective: ms.parallax.perspective,
        // rotate on X axis by 20 degrees
        transform: `translate(${shift.h*ms.parallax.frameMoveMultiplier}px, ${shift.v*ms.parallax.frameMoveMultiplier}px) `
    });
    $('.frame-layer, #map-layers, #particles').css({
        transformStyle: `preserve-3d`,
        perspective: ms.parallax.perspective,
        // rotate on X axis by 20 degrees
        transform: `translate(${shift.h * (ms.parallax.frameMoveMultiplier * (window.innerWidth/window.innerHeight))}px, ${shift.v * ms.parallax.frameMoveMultiplier * (window.innerWidth/window.innerHeight)}px) rotateX(${ms.parallax.mapTableTiltDegrees}deg)`,
    });
    let offset = 0;
    ms.ui.view == 'galaxy' && (offset = 30);
    ms.ui.view == 'sector' && (offset = ms.ui.planets.SVGSizeVisible/2);
    $('.hover-tooltip').css({
        'left':     ms.mouse.x+offset,
        'top':      ms.mouse.y+offset,
    });
    animateRingLightGlow();
}
const animateRingLightGlow = () => {
    let glowStrength = ms.mouse.yRelative > 0 ? Math.floor(Math.pow(2, ((Math.abs(ms.mouse.xRelative * 100) + Math.abs(ms.mouse.yRelative * 100)) / 30)) - 1) : 0;
    ms.ringLightGlow.strength = glowStrength/100;
    $('#ring-light-glow').css({
        opacity: ms.ringLightGlow.strength,
    });
    $('#vignette').css({
        opacity: Math.abs(1-ms.ringLightGlow.strength),
    });
}
const initParticles = () => {
    const canvas = document.getElementById("particles");
    let particles = new Particles(canvas, ms.particles.settings);
    
    particles.init();
    ms.particles.obj = particles;
}


const getSectorName = sectorId => {
    // remove the last 7 characters from the sectorId to get the sector name
    let sectorName = sectorId.slice(0, -7);
    // replace any hyphens with spaces
    sectorName = sectorName.replace(/-/g, ' ');
    // capitalize the first letter of each word
    sectorName = sectorName.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    // if the sector is Lestrade, add a apostraphe between the L and the e
    sectorName = sectorName == 'Lestrade' ? 'L\'estrade' : sectorName;
    return sectorName;
};
export const getSectorId = sectorName => {
    // replace any spaces with hyphens, and make the string lowercase
    sectorName = sectorName.replace(/ /g, '-').replace(/'/g, '').toLowerCase();
    return sectorName + '-sector';
};
const getSectorDetails = sectorId => {
    const sectorName = getSectorName(sectorId);
    const sectorDetails = {
        name: sectorName + ' Sector',
        owner: ms.api.getSectorOwner(sectorName),
        liberationPercent: ms.api.getSectorLiberationPercent(sectorName),
        helldiverCount: ms.api.getSectorHelldiverCount(sectorName),
    };
    return sectorDetails;
};
const toggleSectorHover = () => {
    const enable = ms.ui.view == 'galaxy';
    if (enable) {
        colorCodeSectors();
        $('.sector-svg').on('mouseenter', e => {
            ms.ui.sectorHover = e;
            showSectorDetails(e);
            playSFX('sector-hover-sfx', 'SectorHover', 'wav', 5, ms.ui.sound.sfxEnabled, ms.userInteraction);
        })
        .on('mouseleave', e => {
            ms.ui.sectorHover = {};
            $('#sector-tooltip').hide(ms.ui.tooltipFadeSpeed);
            $(e.target).css({
                'stroke':   ms.colors[ms.api.getSectorOwner(getSectorName(e.target.id))].FGLight,
                'fill':     ms.colors[ms.api.getSectorOwner(getSectorName(e.target.id))].BGLight,
            })
        });
        // set the css properties of the event element
    } else {
        // remove the css hover effect from the sector elements
        $('.sector-svg').off('mouseenter').off('mouseleave')
        // for each .sector-svg element, set the fill and stroke equal BGLighter and FGLighter colors
        // of the owner of the sector using getSectorName(ms.api.getSectorOwner())
        .each((index, sector) => {
            $(sector).css({
                'fill':         ms.colors[ms.api.getSectorOwner(getSectorName(sector.id))].BGLighter,
                'stroke':       ms.colors[ms.api.getSectorOwner(getSectorName(sector.id))].FGLighter,
            });
        });
    }
}
const showSectorDetails = e => {
    const sectorDetails = getSectorDetails(e.target.id);
    const color = ms.colors[sectorDetails.owner].Text;
    $('#sector-tooltip-owner-name').text(`
        ${sectorDetails.name}
    `).css({
        'color':            color,
    });
    $('#sector-tooltip-inner-guage').css({
        'border-color':     color,
    })
    $("#sector-tooltip-liberated").css({
        'width':            `${sectorDetails.liberationPercent}%`,
    });
    $("#sector-tooltip-unliberated").css({
        'left':             `${sectorDetails.liberationPercent}%`,
        'width':            `${100-sectorDetails.liberationPercent}%`,
        'background-color':            color,
    });
    $('#sector-tooltip-percent').text(`
        ${sectorDetails.liberationPercent}% LIBERATED
    `);
    $('#sector-tooltip-helldivers').text(sectorDetails.helldiverCount);
    $('#sector-tooltip-super-earth-icon, #sector-tooltip-bugs-icon, #sector-tooltip-bots-icon').hide();
    switch (sectorDetails.owner) {
        case 1:
            $('#sector-tooltip-super-earth-icon').show();
            break;
        case 2:
            $('#sector-tooltip-bugs-icon').show();
            break;
        case 3:
            $('#sector-tooltip-bots-icon').show();
            break;
        case 4:
            $('#sector-tooltip-illuminate-icon').show();
            break;
        default:
            break;
    }

    $('#sector-tooltip').show(ms.ui.tooltipFadeSpeed);
    playSFX('sector-hover-sfx', 'SectorHover', 'wav', 5);
}
const colorCodeSectors = () => {
    const sectors = document.querySelectorAll('.sector-svg');
    sectors.forEach(sector => {
        try {
            const sectorName = getSectorName(sector.id);
            const owner = ms.api.getSectorOwner(sectorName);
            const color = ms.colors[owner];
            $(sector).css({
                'fill':         color.BGLight,
                'stroke':       color.FGLight,
                'stroke-width': owner != 1 ? 8 : 2,
                'z-index':      301 + owner,
            })
            // add an event listener to the sector to change the fill and stroke colors on hover
            $(sector).on('mouseenter', () => {
                $(sector).css({
                    fill: color.BG,
                    stroke: color.FG,
                });
            }).on('mouseleave', () => {
                $(sector).css({
                    fill: color.BGLight,
                    stroke: color.FGLight,
                });
            });
        } catch (error) {
            console.log(`Error in colorCodeSectors. \nSector: ${sector.id}\nError: ${error}`)
        }
    });
}
const toggleSectorView = e => {
    // get the sector name from the id of the element that was clicked
    const sectorName = getSectorName(e.target.id);
    // hide any planets currently displayed

    // if the sector clicked is the same as the currently displayed sector,
    // and if ms.ui.view is set to 'sector', set ms.ui.view to 'galaxy'
    if (ms.ui.currentSector == sectorName && ms.ui.view == 'sector') {
        initGalaxyView();
    }
    // otherwise, enable the sector view for the sector clicked
    else {
        initSectorView(sectorName, e.target.id);
    }
}
const initGalaxyView = () => {
    ms.ui.view = 'galaxy';
    ms.ui.currentSector = '';
    $('.planet-svg, .planet-text, .waypoint-svg').hide();
    toggleSectorHover();
    $('.title').show("slow");
    $('.sector-info').hide();
    playSFX('sector-cancel-sfx', 'Cancel', 'mp3', 15, ms.ui.sound.sfxEnabled, ms.userInteraction);
}
export const initSectorView = (sectorName, sectorId) => {
    /*  This function accomplishes 4 things:
        1) removes the showSectorDetails event listener from the sector-svg elements
        2) disables the parallax of the floor layers & map frame layers,
            and reverses the current x and y shift of the floor and map-table frame layers
        3) removes any 3d transformation from the map frame layers
        4) centers and resizes the map table so that the map layers are fully in view
        5) enables the parallax of the map layers
            (nebula-bg and sectors-svg,not map-table-frame or hex-grid)
        6) zooms in on the sector layer by ~ 3-5x
        7) modifies map-mask-2 so that it still covers the entire map
    */
    // remove the showSectorDetails event listener from the sector-svg elements
    ms.ui.view = 'sector';
    ms.ui.currentSector = sectorName;
    $('.planet-svg, .planet-text, .waypoint-svg').hide();
    toggleSectorHover();
    $('.title').hide();
    $('.planet-svg').attr('r', ms.ui.planets.SVGSizeHidden);
    // set the sector border color to the owner color's
    const owner = ms.api.getSectorOwner(sectorName);
    const color = ms.colors[owner];
    showSectorInfo(sectorId, color, owner);
    $(`#${sectorId}`).css({
        'fill':         `rgba(${color.CSV}, 0.08)`,
        'stroke':       `rgba(${color.CSV}, 1)`,
    })
    // make an inset glow effect on the sector
    showSectorPlanets(sectorName);
    showSectorWaypoints(sectorName);
    $('#planet-tooltip').css({ 'opacity': 0});
    $('#planet-tooltip').show();
    setMapTableSectorView();

    playSFX('sector-click-sfx', 'Ping', 'wav', 50, ms.ui.sound.sfxEnabled, ms.userInteraction);
};
const showSectorPlanets = (sectorName) => {
    // get the ids of the planets of the sector
    const relevantPlanets = hd2api.getSectorPlanetIds(sectorName, true);
    ms.ui.planets.relevant = relevantPlanets;

    // including planets that are not in the sector but are connected via waypoints
    for (const planetIndex of relevantPlanets) {
        // toggle the id of the planet to show or hide it
        $(`#${planetIndex} circle`).show();
        $(`#text-${planetIndex}`).show();
        // set the radius attribute of the planet to the visible size
        $(`#${planetIndex} circle`).attr('r', ms.ui.planets.SVGSizeVisible);
    }
}
const showSectorWaypoints = (sectorName) => {
    // get the ids of the planets only in this sector
    const sectorPlanets = hd2api.getSectorPlanetIds(sectorName, false);
    ms.ui.planets.sector = sectorPlanets;
    // loop through all .waypoint-svg elements;
    // if the waypoint element has a data-source-planet or data-target-planet that is in the sectorPlanets array,
    // show the waypoint element
    $('.waypoint-svg').each((index, waypoint) => {
        const sourcePlanet = parseInt(waypoint.getAttribute('data-source-planet'));
        const targetPlanet = parseInt(waypoint.getAttribute('data-target-planet'));
        (   sectorPlanets.includes(sourcePlanet) ||
            sectorPlanets.includes(targetPlanet)
        ) && $(waypoint).show();
    });
}
const setMapTableSectorView = () => {
/*  1)  Remove the galaxyViewParallax() event listener from document mousemove,
        or just rebind the document mousemove event without galaxyViewParallax
    2)  Perform the inverse transformations for the floor layers and map frame layers,
        ensure that the 3d transformation from the map frame layers has been removed
    3)  Disable the sector tooltip
*/
    // adjust the values in the ms object that determine the strength of the parallax effect
    
    //Rebind the document mousemove event without galaxyViewParallax
    document.addEventListener("mousemove", (e)=> {
        ms.mouse = getMouseDetails(e);
        debug();
    });
    //Perform the inverse transformations for the floor layers and map frame layers
    $('#floor-layer').css({
        transform: `translate(0px, 0px)`,
    });
    $('#frame-layer').css({
        transform: `translate(0px, 0px) rotateX(0deg)`,
    });
    $('#sector-tooltip').hide(ms.ui.tooltipFadeSpeed);

}

const showSectorInfo = (sectorId, color, owner) => {
    const sectorDetails = getSectorDetails(sectorId);

    $('.sector-info-img').hide();
    let icon = 'sector-info-icon-';
    owner == 1 && (icon += 'super-earth');
    owner == 2 && (icon += 'bugs');
    owner == 3 && (icon += 'bots');
    $(`#${icon}`).show();

    $('#sector-info-name')
        .text(`${sectorDetails.name}`)
        .css('color', `rgba(${color.CSV}, 1)`);
    $('#sector-info-owner')
        .text(`${ms.api.getFactionName(owner)} Control`)
        .css('color', `rgba(${color.CSV}, 1)`);
    $('#sector-info-percent')
        .text(`${sectorDetails.liberationPercent}% Liberated`);
    $("#sector-info-liberated").css({
        'width':            `${sectorDetails.liberationPercent}%`,
    });
    $("#sector-info-unliberated").css({
        'left':             `${sectorDetails.liberationPercent}%`,
        'width':            `${100-sectorDetails.liberationPercent}%`,
        // for the color, set it as the owner of the sector 
        'background-color': `rgba(${color.CSV}, 1)`,
    });
    $('.sector-info').show();
}


const addListeners = () => {
    //  Window event listeners
    window.addEventListener("resize",       e => {
        detectWindowSize(e);
        calculateDimensions();
        setCSS();
        ms.particles.obj.resize();
        debug();
    });
    window.addEventListener('mouseover', (e) => {
        const {
            clientX: x,
            clientY: y
        } = e
        const elementMouseOver = document.elementFromPoint(x, y);
        ms.ui.elementMouseOver = elementMouseOver;
    })

    //  Document event listeners
    document.addEventListener("mousemove",  e => {
        ms.mouse = getMouseDetails(e);
        galaxyViewParallax(e);
        debug();
    });
    document.onfullscreenchange =           e => {
        detectWindowSize(e);
        calculateDimensions();
        setCSS();
        ms.particles.obj.resize();
        debug();
    };
    document.addEventListener('keydown',    e => {
        // when the 0 key is pressed, toggle the display of the sliders element.
        (e.key == '0') && $('#sliders-container').toggle()
    });
    document.addEventListener('click',      e => {
        ms.userInteraction = true
    });
    document.onfullscreenchange,            e => {
        detectWindowSize(e);
        setCSS();
    };

    $('.sector-svg').on('click',        e   => toggleSectorView(e))
    
    
    $('body').bind('mousewheel', function(e){
        let scrollDirection = e.originalEvent.wheelDelta/120 > 0 ? 'up' : 'down';
        if (scrollDirection == 'down'){
            if( ms.ui.view == 'sector') {
                initGalaxyView();
                ms.ui.elementMouseOver.dispatchEvent(new MouseEvent('mouseover', { 'bubbles': true }));
                // if the mouse-over element has the sector-svg class, assign it to ms.ui.sectorHover
                if (ms.ui.elementMouseOver.classList.contains('sector-svg')) {
                    ms.ui.sectorHover = ms.ui.elementMouseOver;
                    showSectorDetails(ms.ui.sectorHover);
                }
            }
        } else {
            if (ms.ui.view == 'galaxy') {
                try {
                    const sectorId = ms.ui.sectorHover.target.id;
                    const sectorName = getSectorName(sectorId);
                    ms.ui.sectorHover = {};
                    initSectorView(sectorName, sectorId);
                } catch (e) {
                    // no sector hovered
                    return;
                }

            }
        }
    });
};

const init = () => {
    $('body').data('ms', ms);
    $('#sector-tooltip').hide();
    bindElements();
    detectWindowSize();
    calculateDimensions();
    setCSS();
    $('img').attr('draggable', false);
    initParticles();
    setSliders();
    addListeners();
    ms.debug = new Debug(getDebugHTML());
    debug();

    //  Initialize bootstrap tooltips
    $(()=> { $('[data-toggle="tooltip"]').tooltip();});

    //API Check
    ms.api = hd2api;
    hd2api.init()
    .then(() => {
        hd2api.aggregateData();
        $('#number-helldivers-active').text(hd2api.getTotalHelldiverCount());
        initPlanetSVGs();
        $('.sector-info, .planet-tooltip-env-icon, #planet-tooltip').hide();
        $('.planet-svg').hide();
        $('.planet-text').hide();
        $('#planet-tooltip-dummy-icon').show();


        $('.planet-tooltip-banner').hide();
        $('#planet-tooltip-banner-dummy').show();
        toggleSectorHover();

        
        $('#spinner-container').hide();
    })
}

$(document).ready(e => {
    init();
});
/// This was a one-time script to run in the console.
/// It calculates the center of each sector in the game,
/// based on the distribution of planets in the sector.
/// It uses Weiszfeld's Algorithm to calculate the geometric median of a set of points.
/// It prints in a format friendly to Google Sheets
const ACCURACY_THRESHOLD = 0.0000001;


let weiszfeld = (pointsArray, precisionThreshold) => {
    var n = pointsArray.length;
    var x = 0;
    var y = 0;
    for (var i = 0; i < n; i++) {
        x += pointsArray[i][0];
        y += pointsArray[i][1];
    }
    x /= n;
    y /= n;
    var last = null;
    while (true) {
        var num = [0, 0];
        var den = 0;
        for (var i = 0; i < n; i++) {
            var d = Math.sqrt((pointsArray[i][0] - x) * (pointsArray[i][0] - x) + (pointsArray[i][1] - y) * (pointsArray[i][1] - y));
            if (d == 0) {
                return [x, y];
            }
            num[0] += pointsArray[i][0] / d;
            num[1] += pointsArray[i][1] / d;
            den += 1 / d;
        }
        var p = [num[0] / den, num[1] / den];
        if (last && Math.abs(p[0] - last[0]) + Math.abs(p[1] - last[1]) < precisionThreshold) {
            return p;
        }
        last = p;
        x = p[0];
        y = p[1];
    }
}

let sectorNames = MS().api.getAllSectorNames();
for (let sectorName of sectorNames){
    let planetIds = MS().api.getSectorPlanetIds(sectorName, false);
    let planetCoordinates = MS().ui.planets.positions;

    let pointsArray = [];
    for (let id of planetIds){
        let point = [planetCoordinates[id].x, planetCoordinates[id].y]
        pointsArray.push(point);
    }
    let center = weiszfeld(pointsArray, ACCURACY_THRESHOLD);
    console.log(`${sectorName}\t${Math.round(center[0])}\t${Math.round(center[1])}`);
}
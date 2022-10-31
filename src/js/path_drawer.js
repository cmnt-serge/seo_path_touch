/**
 * TODO : forme d'entegistrement des fleches par case
 * [
 *  coord : {bank: {top}, move: null, harvest: {top, left, bot}},
 *  coord : {bank: {top}, move: null, harvest: {top, left, bot}},
 *  coord : {bank: {top}, move: null, harvest: {top, left, bot}}
 * ]
 * 
 * if(document.querySelector('#dofus-maps-menu svg')) document.querySelector('#dofus-maps-menu').removeChild(document.querySelector('#dofus-maps-menu svg'))
let arrow = SVG().addTo('#dofus-maps-menu').size(300, 300)
arrow.path("M 5 150 L 100 150 M 100 150 L 100 120").attr({fill: "black", stroke:"blue"})
 */ 

dtMap.on('click', (e) => {
    console.log(e.latlng)
    console.log(getDtCoordFromMapCoord(e.latlng.lng, e.latlng.lat))

    createArrow()
})

function createArrow(moves = null, directions = null){
    let arrow = SVG().addTo('#dofus-maps-menu').size(300, 300)
    let rect = arrow.rect(50, 100).attr({ fill: '#f06' })

    return arrow;
}










function getDtCoordFromMapCoord(e, t) {
    return [Math.floor(e / config.dtMapWidth), Math.floor(-t / config.dtMapHeight)];
}

function mouseOutOfMap() {
    document.getElementById("mapCoordinates").style.display = "none";
}

function mouseMoveOnMap(e) {
    var t = document.getElementById("mapCoordinates");
    if ((e.originalEvent.path && [...e.originalEvent.path].includes(document.getElementsByClassName("leaflet-control-container")[0])) || (e.originalEvent.originalTarget && e.originalEvent.originalTarget.offsetParent && "opener" == e.originalEvent.originalTarget.offsetParent.id)) return void (t.style.display = "none");
    const n = getDtCoordFromMapCoord(e.latlng.lng, e.latlng.lat),
        a = n[0],
        o = n[1],
        i = `${a}${o}`;
    if (mouseDtCoord.x != a || mouseDtCoord.y != o) {
        if (((objOnMap.markerAdditionalData.resources = ""), objOnMap.resourcesByCoord[i] && options.displayResourceInTooltip))
            for (const e in objOnMap.resourcesByCoord[i]) {
                var r = objOnMap.resourcesByCoord[i][e];
                r && (objOnMap.markerAdditionalData.resources += `<br>${i18n.translateForKey(r.i18n, config.lang)}, ${r.quantity}`);
            }
        (mouseDtCoord.x = a), (mouseDtCoord.y = o);
    }
    (t.innerHTML = `<span class="coord">${a}, ${o}</span>` + (objOnMap.markerAdditionalData.poi ? `<br> ${objOnMap.markerAdditionalData.poi}` : "") + (objOnMap.markerAdditionalData.resources ? `${objOnMap.markerAdditionalData.resources}` : "")), (t.style.top = e.containerPoint.y + 6 + "px"), (t.style.left = e.containerPoint.x + 6 + "px"), (t.style.display = "block"), objOnMap.rectangle.setLatLng(getMapStartCoordFromDtCoord(a, o));
}

function mouseClickOnMap(e) {
    const t = getDtCoordFromMapCoord(e.latlng.lng, e.latlng.lat),
        n = t[0],
        a = t[1],
        o = `${n}${a}`,
        i = api + `resources/coord/${n}/${a}`;
    function r(e, t) {
        var n = document.createElement("div");
        (n.className = "mi-container"), (n.innerHTML = `\n            <div class="title" data-i18n="${e}">${i18n.translateForKey(e, config.lang)}</div>`);
        var a = document.createElement("div");
        return (a.className = "mi-list"), n.append(a), t.append(n), a;
    }
    function s(e, t) {
        var n = document.createElement("div");
        (n.className = "mi-item"), (n.innerHTML = `<img class="icons resources-30w r-30w-${e.icon_name}" src="./assets/worldmapIcon/resources_30w.webp?${version}" width="30" height="30">\n                          <div class="mi-name" data-i18n="${e.i18n}">${i18n.translateForKey(e.i18n, config.lang)}</div>\n                          <div class="mi-quantity">${e.quantity}</div>`), t.append(n);
    }
    document.getElementById("mapInfo").classList.remove("close");
    getData(i, function (e) {
        (document.getElementById("mapInfo-title").innerHTML = `\n            <h4><span data-i18n="mapInfo.title">${i18n.translateForKey("mapInfo.title", config.lang)}</span> [${n},${a}]</h4>`),
            (e = Object.keys(e).map(function (t) {
                return e[t];
            })).sort((e, t) => t.quantity - e.quantity);
        const t = e.slice();
        var i = document.getElementById("mapInfo-content");
        if (((i.innerHTML = ""), objOnMap.resourcesByCoord[o] && Object.keys(objOnMap.resourcesByCoord[o]).length > 0)) {
            const n = r("mapInfo.selected-resources", i);
            e.forEach((e) => {
                if (objOnMap.resourcesByCoord[o][e.typeId]) {
                    s(e, n);
                    var a = t.indexOf(e);
                    t.splice(a, 1);
                }
            });
        }
        if (t && t.length > 0) {
            const e = r("mapInfo.resources", i);
            t.forEach((t) => s(t, e));
        }
        if (!objOnMap.resourcesByCoord[o] && e.length < 1) {
            var c = document.createElement("div");
            (c.className = "mi-nodata"), (c.innerText = "Pas de données"), i.append(c);
        }
    });
}

function getMapStartCoordFromDtCoord(e, t) {
    const n = e * config.dtMapWidth;
    return [-t * config.dtMapHeight, n];
}

function getMapCenterCoordFromDtCoord(e, t) {
    const n = getMapStartCoordFromDtCoord(e, t);
    return [n[0] - config.dtMapHeight / 2, n[1] + config.dtMapWidth / 2];
}
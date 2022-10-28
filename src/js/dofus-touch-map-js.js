const version = "1.0",
    config = { lang: "fr", dtMapWidth: 69.5, dtMapHeight: 49.7, minZoom: 3, maxZoom: 6 };
var objOnMap = { rectangle: null, poiMarkers: [], resourcesMarkers: [], playerMarker: null, resourcesByCoord: [], markerAdditionalData: { poi: null, resources: null } },
    mouseDtCoord = { x: null, y: null },
    cache = [];
const bounds = [
    [-3056, -6480],
    [4944, 3520],
];
var dtMap;
const isMobile = mobileAndTabletCheck(),
    isOnEmu = emuCheck();
var i18n;
const markerTypes = { POI: "poi", RESOURCE: "resource" };
var options = { saveSelectResources: !0, displayResourceInTooltip: !isMobile, menuOverlay: !1, playerMarker: isOnEmu };
const postMessageHandler = (e) => {
    if ("file://" == e.origin && e.data.type) {
        const t = e.data;
        switch (t.type) {
            case "updatePlayerMarker":
                displayPlayerMarker(t.pos.x, t.pos.y);
                break;
            case "centerViewOnPlayerMarker":
                centerViewOnPlayerMarker();
                break;
            default:
                console.error("Type not recognize");
        }
    }
};
function addAdBanner() {
    const e = document.getElementById("banner-content");
    let t;
    (t = isMobile ? '<iframe src="//a.exdynsrv.com/iframe.php?idzone=4391416&size=300x100" width="300" height="100" scrolling="no" marginwidth="0" marginheight="0" frameborder="0"></iframe>' : '<iframe src="//a.exdynsrv.com/iframe.php?idzone=4402736&size=728x90" width="728" height="90" scrolling="no" marginwidth="0" marginheight="0" frameborder="0"></iframe>'), e.insertAdjacentHTML("beforeend", t);
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
function mouseOutOfMap() {
    document.getElementById("mapCoordinates").style.display = "none";
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
function getDtCoordFromMapCoord(e, t) {
    return [Math.floor(e / config.dtMapWidth), Math.floor(-t / config.dtMapHeight)];
}
function getRectangleOnMapSize() {
    var e = dtMap.getZoom();
    return [config.dtMapWidth / Math.pow(2, config.maxZoom - e) - 2, config.dtMapHeight / Math.pow(2, config.maxZoom - e) - 2];
}
function getIcon(e, t, n, a) {
    var o = `<img class="${t}" src="${e}" width="${n}" height="${n}">`;
    return a && (o += `<div class="marker-icon-quantity">${a}</div>`), new L.DivIcon({ className: "custom-marker", html: o, iconSize: [n, n], iconAnchor: [n / 2, n / 2] });
}
function initOptions() {
    var e = window.localStorage.getItem("options");
    e ? (options = updateSavedOptionsModel(JSON.parse(e), options)) : window.localStorage.setItem("options", JSON.stringify(options)),
        Object.keys(options).forEach((e) => {
            const t = document.getElementById(e);
            (t.checked = options[e]),
                "playerMarker" === e && addCustomStyleForPlayerMarker(options[e]),
                t.addEventListener("change", (t) => {
                    switch (((options[e] = t.target.checked), window.localStorage.setItem("options", JSON.stringify(options)), e)) {
                        case "menuOverlay":
                            document.getElementById("menu-overlay").style.display = options[e] ? "block" : "none";
                            break;
                        case "playerMarker":
                            addCustomStyleForPlayerMarker(options[e]);
                    }
                });
        });
}
function updateSavedOptionsModel(e, t) {
    var n = !1;
    return (
        Object.keys(t).forEach((a) => {
            e.hasOwnProperty(a) || ((e[a] = t[a]), (n = !0));
        }),
        n && window.localStorage.setItem("options", JSON.stringify(e)),
        e
    );
}
function addCustomStyleForPlayerMarker(e) {
    var t;
    e ? (t = document.getElementById("player-marker-style")) && t.remove() : (((t = document.createElement("style")).id = "player-marker-style"), (t.innerHTML = ".player-marker { display: none; }"), document.head.appendChild(t));
}
function checkLastDonatePrint() {
    const e = window.localStorage.getItem("lastDonatePrint");
    if (e) {
        const t = new Date().getTime();
        t - 5184e5 >= e && (setTimeout(() => toggleWindow("donate"), 12e4), window.localStorage.setItem("lastDonatePrint", t));
    } else window.localStorage.setItem("lastDonatePrint", new Date().getTime()), setTimeout(() => toggleWindow("donate"), 12e4);
}
function openMenu() {
    const e = document.getElementById("opener"),
        t = document.getElementById("menu"),
        n = document.getElementById("menu-overlay");
    n.style.display = options.menuOverlay ? "block" : "none";
    var a = () => {
        t.classList.toggle("open"), n.classList.toggle("menu-overlay");
    };
    e.addEventListener("click", a), n.addEventListener("click", a);
}
function toggleWindow(e) {
    var t = document.getElementById(e);
    closeOtherWindows(t), t.classList.toggle("close");
}
function closeOtherWindows(e) {
    var t = document.getElementsByClassName("window");
    for (const n of t) n.classList.contains("close") || n == e || n.classList.add("close");
}
function closeMapInfo() {
    document.getElementById("mapInfo").classList.add("close");
}
function changeLang(e) {
    i18n.fetch([e]).then((t) => {
        t && (i18n.translatePageTo(e), (config.lang = e), (document.getElementById("lang-flag").className = `icons flags ${e}`));
    });
}
function getLastUpdateDate() {
    getData(api + "maps/latest", function (e) {
        document.getElementById("last-maj").innerHTML = `<span data-i18n="menu.last-maj">${i18n.translateForKey("menu.last-maj", config.lang)}</span> : ${convertDate(e.last_update)}`;
    });
}
function makeCollapsible() {
    var e = document.getElementsByClassName("collapsible");
    if (e.length < 8) setTimeout(() => makeCollapsible(), 200);
    else
        for (var t = 0; t < e.length; t++)
            e[t].addEventListener("click", function () {
                if (this.classList.contains("list-title")) for (var e = document.getElementsByClassName("list-title open"), t = 0; t < e.length; t++) e[t] != this && e[t].classList.remove("open");
                if (this.classList.contains("title")) for (e = document.getElementsByClassName("title open"), t = 0; t < e.length; t++) e[t] != this && e[t].classList.remove("open");
                this.classList.toggle("open");
            });
}
async function createPoiList() {
    var e = api + "poi/category",
        t = document.getElementById("poi-container");
    await getData(e, function (e) {
        e.forEach((e) => {
            var n = document.createElement("div");
            (n.className = "poi-list icon-text"), (n.id = `lip-${e.id}`), (n.innerHTML = `\n                <img class="icons poi-category-20w poi-${e.id}" src="./assets/icons/poi.webp?${version}" data-i18n="${e.i18n}" data-i18n-attr="alt" alt="${i18n.translateForKey(e.i18n, config.lang)}" width="20" height="20">\n                <div class="name" data-i18n="${e.i18n}">${i18n.translateForKey(e.i18n, config.lang)}</div>`), t.append(n), n.addEventListener("click", () => displayPoi(e.id));
        });
    });
}
async function createResourcesTypesList() {
    var e = api + "resources/parents",
        t = document.getElementById("parents-types");
    await getData(e, async function (e) {
        const n = [];
        for await (const r of e) {
            var a = document.createElement("div");
            a.className = "list";
            var o = document.createElement("div");
            (o.className = "list-title collapsible icon-text"), (o.id = `parent-${r.id}`), (o.innerHTML = `\n                <img class="icons jobs-20w job-${r.id}" src="./assets/icons/jobs.webp?${version}" data-i18n="${r.i18n}" data-i18n-attr="alt" alt="${i18n.translateForKey(r.i18n, config.lang)}" width="20" height="20">\n                <div class="name" data-i18n="${r.i18n}">${i18n.translateForKey(r.i18n, config.lang)}</div>`);
            var i = document.createElement("div");
            (i.className = "list-content content"),
                a.append(o, i),
                t.append(a),
                n.push(
                    new Promise(async (e, t) => {
                        await createResourcesListForAParentType(i, r.id), e();
                    })
                );
        }
        await Promise.all(n);
    });
}
async function createResourcesListForAParentType(e, t) {
    var n = api + "resources/types/parents/" + t;
    await getData(n, function (t) {
        t.forEach((t) => {
            var n = document.createElement("div");
            (n.className = "list-item icon-text"), (n.id = `lir-${t.id}`), (n.innerHTML = `\n                <img class="resource-icon icons resources-24w r-24w-${t.icon_name}" src="./assets/worldmapIcon/resources_24w.webp?${version}" data-i18n="${t.i18n}" data-i18n-attr="alt" alt="${i18n.translateForKey(t.i18n, config.lang)}" width="24" height="24">\n                <div class="name" data-i18n="${t.i18n}">${i18n.translateForKey(t.i18n, config.lang)}</div>`), e.append(n), n.addEventListener("click", () => displayResource(t));
        });
    });
}
function saveMarkerDisplay(e, t) {
    if (options.saveSelectResources) {
        var n = JSON.parse(window.localStorage.getItem("markerDisplaySave"));
        n || (n = { resource: {}, poi: {} }), e == markerTypes.RESOURCE ? (n[e][t.id] = t) : e == markerTypes.POI && (n[e][t] = t), window.localStorage.setItem("markerDisplaySave", JSON.stringify(n));
    }
}
function removeSaveMarker(e, t) {
    var n = JSON.parse(window.localStorage.getItem("markerDisplaySave"));
    n && ((e != markerTypes.RESOURCE && e != markerTypes.POI) || delete n[e][t], window.localStorage.setItem("markerDisplaySave", JSON.stringify(n)));
}
function displayMarkerFromLocalStorage() {
    var e = JSON.parse(window.localStorage.getItem("markerDisplaySave"));
    if (!e || !options.saveSelectResources) return void window.localStorage.removeItem("markerDisplaySave");
    new Map(Object.entries(e[markerTypes.RESOURCE])).forEach((e) => displayResource(e)), new Map(Object.entries(e[markerTypes.POI])).forEach((e) => displayPoi(e));
}
function displayPoi(e) {
    const t = document.getElementById(`lip-${e}`);
    var n = api + "poi/" + e,
        a = [];
    if (t.classList.contains("selected"))
        t.classList.remove("selected"),
            objOnMap.poiMarkers[e].forEach((e) => {
                dtMap.removeLayer(e);
            }),
            (objOnMap.poiMarkers[e] = []),
            removeSaveMarker(markerTypes.POI, e);
    else {
        t.classList.add("selected"), saveMarkerDisplay(markerTypes.POI, e);
        getData(n, function (t, n) {
            t.forEach((e) => {
                var t = L.marker(window.getMapCenterCoordFromDtCoord(e.pos_x, e.pos_y), { icon: getIcon(`./assets/worldmapIcon/poi_30w.webp?${version}`, `icons poi-30w p-30w-${e.icon_name}`, 30) }).addTo(dtMap);
                t.on("mouseover", () => {
                    objOnMap.markerAdditionalData.poi = i18n.translateForKey(e.i18n, config.lang);
                }),
                    t.on("mouseout", () => {
                        objOnMap.markerAdditionalData.poi = null;
                    }),
                    a.push(t);
            }),
                (objOnMap.poiMarkers[e] = a);
        });
    }
}
function displayResource(e) {
    const t = document.getElementById(`lir-${e.id}`);
    var n = api + "resources/" + e.id,
        a = [];
    if (t.classList.contains("selected")) removeSelectedResource(e.id);
    else {
        t.classList.toggle("selected"), addResourcesToSelectedList(e), saveMarkerDisplay(markerTypes.RESOURCE, e);
        getData(
            n,
            function (e, t) {
                var n = t.id;
                Object.keys(e)
                    .map(function (t) {
                        return e[t];
                    })
                    .forEach((e) => {
                        var t = L.marker(window.getMapCenterCoordFromDtCoord(e.pos_x, e.pos_y), { icon: getIcon(`./assets/worldmapIcon/resources_30w.webp?${version}`, `icons resources-30w r-30w-${e.icon_name}`, 30, e.quantity) }).addTo(dtMap),
                            o = `${e.pos_x}${e.pos_y}`;
                        a.push({ marker: t, coordKey: o }), objOnMap.resourcesByCoord[o] || (objOnMap.resourcesByCoord[o] = {}), (objOnMap.resourcesByCoord[o][n] = { id: e.id, i18n: e.i18n, name: i18n.translateForKey(e.i18n, config.lang), quantity: e.quantity });
                    }),
                    (objOnMap.resourcesMarkers[n] = a);
            },
            { id: e.id }
        );
    }
}
function displayPlayerMarker(e, t) {
    removePlayerMarker(), (objOnMap.playerMarker = L.marker(window.getMapCenterCoordFromDtCoord(e, t), { icon: new L.DivIcon({ className: "player-marker", html: `<img src="./assets/worldmapIcon/player_marker.webp?${version}" width="40" height="60">`, iconSize: [40, 60], iconAnchor: [20, 60] }) }).addTo(dtMap)), options.playerMarker && dtMap.setView(getMapCenterCoordFromDtCoord(e, t));
}
function removePlayerMarker() {
    objOnMap.playerMarker && dtMap.removeLayer(objOnMap.playerMarker);
}
function centerViewOnPlayerMarker() {
    dtMap.setView(objOnMap.playerMarker.getLatLng());
}
function addResourcesToSelectedList(e) {
    var t = document.getElementById("selected-resources"),
        n = document.getElementById("selected-resources-title"),
        a = document.createElement("div");
    (a.className = "item"), (a.id = `sr-${e.id}`), (a.innerHTML = `<img class="icons resources-40w r-40w-${e.icon_name}" src="./assets/worldmapIcon/resources_40w.webp?${version}" data-i18n="${e.i18n}" data-i18n-attr="alt" alt="${i18n.translateForKey(e.i18n, config.lang)}"" width="40" height="40">`), t.insertAdjacentElement("beforeend", a), n.classList.contains("clear") || (n.classList.add("clear"), (document.getElementById("no-selected-resources").style.display = "none"), n.addEventListener("click", clearAllSelectedResources)), a.addEventListener("click", () => removeSelectedResource(e.id));
}
function removeSelectedResource(e) {
    var t = document.getElementById("selected-resources"),
        n = document.getElementById("selected-resources-title"),
        a = document.getElementById(`lir-${e}`),
        o = document.getElementById(`sr-${e}`);
    objOnMap.resourcesMarkers[e] && a && o && (a.classList.remove("selected"), o.remove()),
        objOnMap.resourcesMarkers[e].forEach((t) => {
            dtMap.removeLayer(t.marker), delete objOnMap.resourcesByCoord[t.coordKey][e];
        }),
        (objOnMap.resourcesMarkers[e] = []),
        t.childElementCount < 2 && n.classList.contains("clear") && (n.classList.remove("clear"), (document.getElementById("no-selected-resources").style.display = ""), n.removeEventListener("click", clearAllSelectedResources)),
        removeSaveMarker(markerTypes.RESOURCE, e);
}
function clearAllSelectedResources() {
    (document.getElementById("no-selected-resources").style.display = ""),
        Object.keys(objOnMap.resourcesMarkers).forEach((e) => {
            removeSelectedResource(e);
        });
}
function mobileAndTabletCheck() {
    let e = !1;
    var t;
    return (
        (t = navigator.userAgent || navigator.vendor || window.opera),
        (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|lindo|silk/i.test(t) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                t.substr(0, 4)
            )) &&
            (e = !0),
        e
    );
}
function emuCheck() {
    return /lindo|mirage|blueberry/.test(navigator.userAgent);
}
async function getData(e, t, n) {
    if (!cache[e]) {
        var a = document.getElementById("loader-container"),
            o = setTimeout(() => {
                a.style.display = "block";
            }, 300);
        return fetch(e)
            .then((e) => e.json())
            .then(async (i) => {
                (cache[e] = i), await t(i, n), clearTimeout(o), (a.style.display = "none");
            })
            .catch((e) => console.log(e));
    }
    await t(cache[e], n);
}
function convertDate(e) {
    function t(e) {
        return e < 10 ? "0" + e : e;
    }
    var n = new Date(e);
    return [t(n.getDate()), t(n.getMonth() + 1), n.getFullYear()].join("/");
}
window.addEventListener("message", postMessageHandler, !1),
    (window.onload = async function () {
        const e = document.getElementById("map");
        if (((i18n = new Translator({ supportedLanguage: ["en", "fr", "de", "es", "it", "pt"] })), (config.lang = i18n.currentLanguage), i18n.fetch([config.lang]).then(() => i18n.translatePageTo(config.lang)), (document.getElementById("lang-flag").className = `icons flags ${config.lang}`), isMobile && (console.log("mobile detect"), document.getElementById("title").classList.add("collapsible"), document.getElementById("header-menu").classList.add("content")), isOnEmu)) {
            const e = document.createElement("style");
            (e.id = "patchEmu"),
                (e.innerHTML =
                    '\n            header { flex-direction:column; }\n            #title {\n                min-height: 40px;\n                padding-left: 40px;\n            }\n            #title:after {\n                content: " ";\n                position: absolute;\n                width: 24px;\n                height: 24px;\n                left: 10px;\n                background: url(../assets/icons/menu_white.webp);\n                top: calc((100% - 24px) / 2);\n            }\n            #title.collapsible.open:after { background: url(../assets/icons/close_white.webp) }\n            .header-menu {\n                position: absolute;\n                top: 40px;\n                width: 100%;\n                margin: 0;\n                background: #000000a6;\n                flex-direction: column;\n                align-items: initial;\n                backdrop-filter: blur(3px);\n            }\n            .menu-item { padding: 5px 20px }\n            #header-languages {\n                position: absolute;\n                margin: 0;\n                right: 10px;\n            }\n            #player-marker-option {\n                display: flex !important;\n            }'),
                document.getElementsByTagName("head")[0].appendChild(e),
                (document.getElementById("thankyou").style.display = "none");
        }
        function t(t) {
            const n = objOnMap.rectangle.options.icon;
            (n.options.iconSize = getRectangleOnMapSize()), objOnMap.rectangle.setIcon(n), e.setAttribute("data-zoom", t.target._animateToZoom);
        }
        setTimeout(() => {
            "undefined" == typeof canRunAds ? (document.getElementById("banner-msg").style.display = "block") : addAdBanner();
        }, 5e3),
            (L.CRS.SimpleDT = L.extend({}, L.CRS.Simple, { transformation: new L.Transformation(1 / 64, 101.255, -1 / 64, 77.25) })),
            (dtMap = L.map("map", { crs: L.CRS.SimpleDT, minZoom: config.minZoom, maxZoom: config.maxZoom, maxBounds: bounds, zoomControl: !1 })),
            new L.Control.Zoom({ position: "topright" }).addTo(dtMap);
        var n = L.Control.extend({
            options: { position: "topright" },
            onAdd: function (e) {
                var t = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom");
                t.id = "opener";
                var n = document.createElement("img");
                return (n.src = "./assets/icons/menu_white.webp"), (n.alt = "ouvrir le menu"), (n.width = "24"), (n.height = "24"), t.append(n), L.DomEvent.disableClickPropagation(t), t;
            },
        });
        dtMap.addControl(new n()),
            dtMap.fitBounds(bounds),
            dtMap.setView([0, 0], 4),
            (objOnMap.rectangle = L.marker(getMapStartCoordFromDtCoord(0, 0), "{ interactive: !1, icon: L.divIcon({ className: "rectangleOnMap", iconAnchor: [0, 0], iconSize: getRectangleOnMapSize() }) }).addTo(dtMap)),
            dtMap.on("mousemove", mouseMoveOnMap),
            dtMap.on("mouseout", mouseOutOfMap),
            dtMap.on("click", mouseClickOnMap),
            dtMap.on("zoomanim", t),
            dtMap.on("zoomend", t),
            (L.TileLayer.mapDt = L.TileLayer.extend({
                getTileUrl: function (e) {
                    const t = 5,
                        n = 4,
                        a = Math.pow(2, e.z - config.minZoom);
                    return e.x >= 0 && e.x < t * a && e.y >= 0 && e.y < n * a ? "mapDt/" + e.z + "/" + e.x + "/" + e.y + ".webp" : "";
                },
            })),
            new L.TileLayer.mapDt().addTo(dtMap),
            initOptions(),
            createPoiList(),
            await createResourcesTypesList(),
            makeCollapsible(),
            getLastUpdateDate(),
            openMenu(),
            displayMarkerFromLocalStorage(),
            checkLastDonatePrint(),
            document.addEventListener("click", (e) => {
                ((e.path && ![...e.path].includes(document.getElementById("languages-select"))) || (e.originalTarget && e.originalTarget.offsetParent && "lang-menu" != e.originalTarget.offsetParent.id && "languages-select" != e.originalTarget.offsetParent.id && "lang-collapsible" != e.originalTarget.offsetParent.id)) && document.getElementById("lang-collapsible").classList.remove("open");
            });
    });

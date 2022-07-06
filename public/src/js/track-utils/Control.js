import {mainAudio} from "../audio/Utils.js";

var browserHeight = undefined
const pluginDivHeight = 335;
const pluginDivHeightMin = 27;

var currentScrollX = undefined;

function scrollSync(selector) {
    let active = null;
    document.querySelectorAll(selector).forEach(function (element) {
        element.addEventListener("mouseenter", function (e) {
            active = e.target;
        });

        element.addEventListener("scroll", function (e) {
            if (e.target !== active) return;

            document.querySelectorAll(selector).forEach(function (target) {
                if (active === target) return;

                target.scrollTop = active.scrollTop;
                target.scrollLeft = active.scrollLeft;
            });
        });
    });
}

// function scrollPlayhead() {
//     let scroll = document.querySelector(".audio-tracks");
//     let sliderThumb = document.querySelector(".thumb.my");
//     let playhead = document.querySelector("playhead-slider");
//     currentScrollX = scroll.scrollLeft;
//     scroll.addEventListener("scroll", (e) => {
//         let move = currentScrollX - scroll.scrollLeft;
//         // console.log(move);
//         playhead.moveThumbWhenSlide(move);
//         currentScrollX = scroll.scrollLeft;
//     })
// }

function adaptSizePlugins() {
    let hideShowButton = document.querySelector("#hide-show-plugins");
    let pluginDiv = document.querySelector(".plugin-editor");
    let trackDiv = document.querySelector(".track-editor");
    let pluginHead = document.querySelector(".head-plugin-editor");

    let icon = hideShowButton.firstElementChild;
    if (icon.className.includes("up")) {
        // pluginDiv.style.height = pluginDivHeightMin+"px";
        pluginHead.style.position = "absolute";
        pluginHead.style.bottom = "0px";
        pluginDiv.style.minHeight = pluginDivHeightMin+"px";
        trackDiv.style.height = `${browserHeight-pluginDivHeightMin}px`;
    }
    else {
        pluginDiv.style.minHeight = pluginDivHeight + "px";
        trackDiv.style.height = `${browserHeight-pluginDivHeight}px`;;
    }
}

function hideShowPluginsRack(buttonSelector) {
    let hideShowButton = document.querySelector(buttonSelector);
    let pluginDiv = document.querySelector(".plugin-editor");
    let trackDiv = document.querySelector(".track-editor");
    // let playhead = document.querySelector("playhead-slider");
    let pluginHead = document.querySelector(".head-plugin-editor");
    let tracks = document.querySelector(".tracks");

    hideShowButton.addEventListener("click", (e) => {
        // console.log(browserHeight);
        let icon = hideShowButton.firstElementChild;
        if (icon.className.includes("down")) {
            pluginHead.style.position = "absolute";
            pluginHead.style.bottom = "0px";
            tracks.style.paddingBottom = "22px";
            pluginDiv.style.height = pluginDivHeightMin+"px";
            trackDiv.style.height = `${browserHeight-pluginDivHeightMin}px`;
            icon.className = "chevron up icon";
            hideShowButton.setAttribute("data-tooltip", "Show");
        }
        else {
            pluginHead.style.position = "relative";
            pluginHead.style.bottom = "";
            tracks.style.paddingBottom = "0px";
            pluginDiv.style.height = pluginDivHeight + "px";
            trackDiv.style.height = `${browserHeight-pluginDivHeight}px`;
            icon.className = "chevron down icon";
            hideShowButton.setAttribute("data-tooltip", "Hide");
        }
        // playhead.changeSizeSlider();
    });
}

function addRemoveEvent() {
    let addRemoveButton = document.querySelector("#add-remove-plugins");
    let pluginEditor = document.querySelector(".plugin-editor");
    let icon = addRemoveButton.firstElementChild;
    let track = mainAudio.selectedTrack;

    if (!icon.className.includes("disabled")) {
        if (track.hasPlugin) {
            icon.className = "disabled plus icon";
            addRemoveButton.className = "waiting item";
            pluginEditor.className = "waiting plugin-editor";
            addRemoveButton.setAttribute("data-tooltip", "Add pedalboard");
            track.removePedalBoard().then((r) => {
                icon.className = "plus icon";
                addRemoveButton.className = "item";
                pluginEditor.className = "plugin-editor";
            })
        }
        else {
            icon.className = "disabled minus icon";
            addRemoveButton.className = "waiting item";
            pluginEditor.className = "waiting plugin-editor";
            addRemoveButton.setAttribute("data-tooltip", "Remove pedalboard");
            track.addPedalBoard().then((r) => {
                icon.className = "minus icon";
                addRemoveButton.className = "item";
                pluginEditor.className = "plugin-editor";
            });
        }
    }
}

function addRemovePlugin() {
    let addRemoveButton = document.querySelector("#add-remove-plugins");
    addRemoveButton.addEventListener("click", addRemoveEvent);
}


window.onresize = (ev) => {
    browserHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    adaptSizePlugins();
}

window.onload = () => {
    browserHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    adaptSizePlugins();
}


scrollSync(".scroll-sync");
hideShowPluginsRack("#hide-show-plugins");
addRemovePlugin();
// scrollPlayhead();

$('.ui.dropdown.settings-menu').dropdown({
    action: 'hide',
});





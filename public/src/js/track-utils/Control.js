import {mainAudio} from "../audio/Utils.js";

var viewportHeight = document.documentElement.getBoundingClientRect().height;
const pluginDivHeight = 325;
const pluginDivHeightMin = 27;

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

function adaptSizePlugins() {
    let hideShowButton = document.querySelector("#hide-show-plugins");
    let pluginDiv = document.querySelector(".plugin-editor");
    let trackDiv = document.querySelector(".track-editor");
    let icon = hideShowButton.firstElementChild;
    if (icon.className.includes("up")) {
        pluginDiv.style.height = pluginDivHeightMin+"px";
        trackDiv.style.height = `${viewportHeight-pluginDivHeightMin}px`;
    }
    else {
        pluginDiv.style.height = pluginDivHeight + "px";
        trackDiv.style.height = `${viewportHeight-pluginDivHeight}px`;;
    }
}

function hideShowPluginsRack(buttonSelector) {
    let hideShowButton = document.querySelector(buttonSelector);
    let pluginDiv = document.querySelector(".plugin-editor");
    let trackDiv = document.querySelector(".track-editor");

    hideShowButton.addEventListener("click", (e) => {
        let icon = hideShowButton.firstElementChild;
        if (icon.className.includes("down")) {
            pluginDiv.style.height = pluginDivHeightMin+"px";
            trackDiv.style.height = `${viewportHeight-pluginDivHeightMin}px`;
            icon.className = "chevron up icon";
            hideShowButton.setAttribute("data-tooltip", "Show");
        }
        else {
            pluginDiv.style.height = pluginDivHeight + "px";
            trackDiv.style.height = `${viewportHeight-pluginDivHeight}px`;;
            icon.className = "chevron down icon";
            hideShowButton.setAttribute("data-tooltip", "Hide");
        }
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
    viewportHeight = document.documentElement.getBoundingClientRect().height;
    adaptSizePlugins();
}

window.onload = () => {
    viewportHeight = document.documentElement.getBoundingClientRect().height;
    adaptSizePlugins();
}


scrollSync(".scroll-sync");
hideShowPluginsRack("#hide-show-plugins");
addRemovePlugin();

$('.ui.dropdown.settings-menu').dropdown({
    action: 'hide',
});





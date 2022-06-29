import {mainAudio} from "../audio/Utils.js";

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

function hideShowPluginsRack(buttonSelector) {
    let hideShowButton = document.querySelector(buttonSelector);
    let pluginDiv = document.querySelector(".plugin-editor");
    let trackDiv = document.querySelector(".track-editor");
    hideShowButton.addEventListener("click", (e) => {
        let icon = hideShowButton.firstElementChild;
        if (icon.className.includes("down")) {
            pluginDiv.style.height = "5%";
            trackDiv.style.height = "95%";
            icon.className = "chevron up icon";
            hideShowButton.setAttribute("data-tooltip", "Show");
        }
        else {
            pluginDiv.style.height = "45%";
            trackDiv.style.height = "55%";
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

scrollSync(".scroll-sync");
hideShowPluginsRack("#hide-show-plugins");
addRemovePlugin();

$('.ui.dropdown.settings-menu').dropdown({
    action: 'hide',
});





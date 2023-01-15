import Visualizer from "./Visualizer.js";
import "http://localhost:3008/plugins/utils/webaudio-controls.js";

/**
 * @param {URL} relativeURL
 * @returns {string}
 */
const getBasetUrl = (relativeURL) => {
  const baseURL = relativeURL.href.substring(0, relativeURL.href.lastIndexOf("/"));
  return baseURL;
};

export default class pedalboardGui extends HTMLElement {
  _baseURL = getBasetUrl(new URL(".", import.meta.url));

  _saveSVGUrl = `${this._baseURL}/assets/saveButton.svg`;
  _editSVGUrl = `${this._baseURL}/assets/editButton.svg`;
  _deleteSVGUrl = `${this._baseURL}/assets/deleteButton.svg`;
  _crossIMGUrl = `${this._baseURL}/assets/cross.png`;

  constructor(plug) {
    super();
    this._plug = plug;
    this._plug.gui = this;

    this._root = this.attachShadow({ mode: "open" });

    this.init();
  }

  /**
   * Initlialise the differents elements of the gui. The PedalBoard is made from 3 sections, the
   * thumnails to select the WAM to add, the board where you can see the Gui of the
   * plugins and you can drag and drop them to change the order or remove them with the
   * cross and the presets section where you can save and load presets.
   * @author Quentin Beauchet
   */
  async init() {
    this.setStyle();
    this.main = document.createElement("main");

    await this.loadThumbnails();
    this.createBoard();
    await this._plug.pedalboardNode.initState();

    let canvas = document.createElement("canvas");
    canvas.on = true;
    this.main.appendChild(canvas);
    new Visualizer(canvas, this._plug.pedalboardNode._output);

    this.body = document.createElement("body");
    this.body.appendChild(this.main);

    this._root.appendChild(this.body);
  }

  /**
   * Loads the thumbnails for the plugins and create a filter selector based on their
   * keywords in their respective descriptor.json and for each image it had an event listener
   * to add the plugin to the board when clicked.
   * It needs to be asynchonous to be consistant each time in the order of the loaded plugins.
   * @author Quentin Beauchet
   */
  async loadThumbnails() {
    let wams = Object.keys(this._plug.WAMS);
    let keywords = { all: [] };
    let urls = await Promise.all(
      wams.map((el) => {
        let wam = this._plug.WAMS[el];
        keywords["all"].push(el);
        wam.descriptor.keywords.forEach((k) => {
          if (!(k in keywords)) {
            keywords[k] = [];
          }
          keywords[k].push(el);
        });
        return `${wam.url}${wam.descriptor.thumbnail}`;
      })
    );

    let section = document.createElement("section");
    section.id = "preview";

    let select = document.createElement("select");
    const refreshImages = (select) => {
      let keys = Object.keys(keywords);
      let currentKey = keys[select.selectedIndex];
      this.images.innerHTML = "";
      keywords[currentKey].forEach((el) => {
        this.images.appendChild(this._plug.WAMS[el].img);
      });
    };
    select.addEventListener("change", (event) => refreshImages(event.target));

    Object.keys(keywords).forEach((key, index) => {
      let filter = document.createElement("option");
      filter.innerHTML = `${index == 0 ? "Filter: " : ""}${key}`;
      select.appendChild(filter);
    });
    section.appendChild(select);

    this.images = document.createElement("div");
    urls.forEach((el, index) => {
      let img = document.createElement("img");
      img.src = el;
      img.setAttribute("crossorigin", "anonymous");
      img.addEventListener("click", () => this._plug.addWAM(wams[index]), {
        passive: false,
      });
      this._plug.WAMS[wams[index]].img = img;
    });
    section.appendChild(this.images);

    refreshImages(select);

    this.main.appendChild(section);
  }

  /**
   * reLoad all presets
   * @param presets all the presets
   * @returns {Promise<void>}
   */
  async reloadPresets(presets) {
    this.PresetsBank = presets;

    if (this.presetsMenu) {
      this._root.getElementById("presetsCollapsable").remove();
    }

    this.presetsMenu = await this.loadMenu();

    let presetsCollapsable = document.createElement("div");
    presetsCollapsable.id = "presetsCollapsable";

    let onoff = document.createElement("button");
    onoff.id = "presetsONOFF";
    onoff.innerHTML = "❱";

    onoff.onclick = () => {
      if (presetsCollapsable.getAttribute("collapsed") == "on") {
        presetsCollapsable.setAttribute("collapsed", "off");
        onoff.innerHTML = "❱";
      } else {
        presetsCollapsable.setAttribute("collapsed", "on");
        onoff.innerHTML = "❰";
      }
    };

    presetsCollapsable.appendChild(onoff);
    presetsCollapsable.appendChild(this.presetsMenu);

    this.main.appendChild(presetsCollapsable);
  }

  /**
   * Create the board and a dropZone to allow a change in order of the plugins.
   * @returns The board section where the guis from the pedals are listed.
   * @author Quentin Beauchet
   */
  createBoard() {
    this.board = document.createElement("div");
    this.board.id = "board";

    this.dropZone = document.createElement("div");
    this.dropZone.id = "dropZone";
    this.dropZone.ondragover = (e) => e.preventDefault();
    this.dropZone.ondrop = (e) => {
      e.preventDefault();
      let target = this.dropZone.nextSibling;
      this.board.removeChild(this.dropZone);

      this._plug.pedalboardNode.disconnectNodes(this.board.childNodes, false, () =>
        this.board.insertBefore(this.dragOrigin, target)
      );

      this.dragOrigin = undefined;
    };

    this.main.appendChild(this.board);
  }

  /**
   * Create the gui for the plugin and then the wrapper around it.
   * We need to resize it with resizeWrapper at the end.
   * If the customElement of the gui was already used we need to define it
   * with a new id until it's free to be defined.
   * @param {WebAudioModule} instance
   * @param {HTMLElement} img
   * @param {int} id
   * @author Quentin Beauchet
   */
  async addPlugin(instance, img, id) {
    var gui;
    try {
      gui = await instance.createGui();
    } catch (e) {
      if (e instanceof TypeError) {
        let path = e.stack.split("\n")[1].split("(")[1].split(":").slice(0, -2).join(":");
        let module = await import(path);
        let name = module.default.name.toLowerCase();
        let id = 0;
        while (customElements.get(`${name}-${id}`)) {
          id++;
          if (id > 1000) throw new Error("Element already defined");
        }
        customElements.define(`${name}-${id}`, module.default);
        gui = await instance.createGui();
      } else {
        throw e;
      }
    }
    let wrapper = document.createElement("article");
    wrapper.draggable = true;
    wrapper.ondragstart = (event) => {
      event.dataTransfer.setDragImage(img, img.width / 2, img.height / 2);
      this.dragOrigin = wrapper;
    };
    wrapper.ondragover = (event) => {
      let target = this.getWrapper(event);
      let mid = target.getBoundingClientRect().x + target.getBoundingClientRect().width / 2;
      if (target && this.dragOrigin) {
        this.board.insertBefore(this.dropZone, mid > event.x ? target : target.nextSibling);
      }
    };
    wrapper.ondragend = (event) => {
      event.preventDefault();
      if (this.dropZone.parentElement == this.board) {
        this.board.removeChild(this.dropZone);
      }
    };

    let header = document.createElement("header");
    let title = document.createElement("h2");
    title.innerHTML = instance.name;
    header.appendChild(title);

    let cross = document.createElement("img");
    cross.src = this._crossIMGUrl;
    cross.setAttribute("crossorigin", "anonymous");
    cross.addEventListener("click", () => {
      this._plug.pedalboardNode.disconnectNodes(this.board.childNodes, false, () => this.board.removeChild(wrapper));
    });
    header.append(cross);
    wrapper.appendChild(gui);
    wrapper.id = id;
    wrapper.classList.add("nodeArticle");

    this.board.appendChild(wrapper);

    // We need to do this because the HTMLElement is not fully loaded and the BoundingClientRect returns falsy values.
    wrapper.hidden = true;
    setTimeout(() => {
      wrapper.hidden = false;
      this.resizeWrapper(wrapper, header, title, cross, gui);
      wrapper.insertBefore(header, gui);
    }, 10);
  }

  /**
   * Scale the gui of the plugin.
   * @param {HTMLElement} wrapper
   * @param {HTMLElement} header
   * @param {HTMLElement} title
   * @param {HTMLElement} cross
   * @param {HTMLElement} gui
   * @author Quentin Beauchet
   */
  resizeWrapper(wrapper, header, title, cross, gui) {
    const parentScale = this.getBoundingClientRect().width / this.offsetWidth;
    const scale = (200 / gui.getBoundingClientRect().height) * parentScale;

    wrapper.style.transformOrigin = "top left";
    wrapper.style.transform = "scale(" + scale + ")";

    const width = Math.round(wrapper.getBoundingClientRect().width / scale);

    wrapper.style.width = `${wrapper.getBoundingClientRect().width / parentScale}px`;
    wrapper.style.height = `${wrapper.getBoundingClientRect().height / parentScale}px`;

    header.style.height = `${Math.round(30 / scale)}px`;
    header.style.width = `${Math.round(width / parentScale)}px`;
    header.style.borderWidth = `${Math.round(2 / scale)}px`;

    title.style.fontSize = `${100 / scale}%`;
    cross.style.width = `${Math.round(15 / scale)}px`;
    cross.style.height = `${Math.round(15 / scale)}px`;
  }

  /**
   * Return the nodeArticle when selecting child node instead of itself with drag and drop.
   * @param {HTMLElement[]} event
   * @returns The wrapper selected.
   */
  getWrapper(event) {
    let pre = this._root.elementFromPoint(event.clientX, event.clientY);
    while (pre && pre.parentNode != this.board) {
      pre = pre.parentNode;
    }
    return pre;
  }

  /**
   * Create the menu which contain the banks,presets and infos
   * @returns the div which contain the menu
   */
  async loadMenu() {
    let keys = Object.keys(this.PresetsBank);

    let menu = document.createElement("section");
    menu.id = "presetsInfos";

    this.banks = this.createBanks(keys);
    this.banks.id = "banks";

    this.presets = document.createElement("ul");
    this.presets.id = "presets";

    this.infos = document.createElement("div");
    this.infos.id = "infos";

    let banks = document.createElement("div");
    banks.innerHTML = "<h1>Banks</h1>";
    banks.classList.add("title");
    let presetsTitle = document.createElement("div");
    presetsTitle.innerHTML = "<h1>Presets</h1>";
    presetsTitle.classList.add("title");
    let infosTitle = document.createElement("div");
    infosTitle.innerHTML = "<h1>Information</h1>";
    infosTitle.classList.add("title");

    menu.appendChild(banks);
    menu.appendChild(presetsTitle);
    menu.appendChild(infosTitle);
    menu.appendChild(this.banks);
    menu.appendChild(this.presets);
    menu.appendChild(this.infos);
    return menu;
  }

  /**
   * List all the banks and print the buttons for the banks
   * @param keys it's the keys of banks (Rock,Pop,...)
   * @returns {HTMLUListElement} the list of all the banks
   */
  createBanks(keys) {
    let banks = document.createElement("ul");

    let button = document.createElement("button");
    button.innerHTML = "New Bank";
    button.classList.add("addBtn");
    button.addEventListener("click", () => {
      const bank = "";
      let presetInput = this.createBankElement(bank);
      this.banks.appendChild(presetInput);
      this.PresetsBank[bank] = {};
      presetInput.lastChild.previousSibling.click();
    });
    banks.appendChild(button);

    keys.forEach((bank) => {
      let el = this.createBankElement(bank);
      banks.appendChild(el);
    });

    return banks;
  }

  /**
   * Display the save in a bank with a button to create new preset.
   * @param bankNameCallBack the name of the bank
   */
  displayBank(bankNameCallBack) {
    this.presets.innerHTML = "";
    const bank = bankNameCallBack();
    let button = document.createElement("button");
    button.innerHTML = "New Preset";
    button.classList.add("addBtn");
    button.addEventListener("click", () => {
      const preset = "";
      let presetInput = this.createPresetElement(bankNameCallBack, preset);
      this.presets.appendChild(presetInput);
      this.PresetsBank[bank][preset] = [];
      presetInput.lastChild.previousSibling.click();
    });
    this.presets.appendChild(button);

    Object.keys(this.PresetsBank[bank]).forEach((preset) => {
      this.presets.appendChild(this.createPresetElement(bankNameCallBack, preset));
    });
  }

  // Load the save to the audioNode and show it's informations.
  /**
   * List all presets of a bank
   * @param bankNameCallBack the name of the bank
   * @param preset the key of the preset
   */
  displayPreset(bankNameCallBack, preset) {
    const bank = bankNameCallBack();
    this.infos.innerHTML = "";
    this._plug.loadPreset(this.PresetsBank[bank][preset]);

    let bnk = document.createElement("h4");
    bnk.innerHTML = `Bank: ${bank}`;

    let name = document.createElement("h4");
    name.innerHTML = `Name: ${preset}`;

    let ul = document.createElement("ul");
    this.PresetsBank[bank][preset].forEach((node) => {
      let li = document.createElement("li");
      li.innerHTML = node.name;
      ul.appendChild(li);
    });

    this.infos.appendChild(bnk);
    this.infos.appendChild(name);
    this.infos.appendChild(ul);
  }

  /**
   * Rename a preset
   * @param bank the name of the bank
   * @param oldName
   * @param newName
   * @returns {boolean} return true if the name is valid
   */
  renamePreset(bank, oldName, newName) {
    if (newName.trim().length == 0) {
      alert("Invalid preset name");
      return false;
    }
    if (newName != oldName) {
      if (this.PresetsBank[bank][newName]) {
        alert("This preset name is already used");
        return false;
      }
      this.PresetsBank[bank][newName] = this.PresetsBank[bank][oldName];
      delete this.PresetsBank[bank][oldName];
    }
    return true;
  }

  /**
   * Rename a bank.
   * @param oldName
   * @param newName
   * @returns {boolean} return true if the name is valid
   */
  renameBank(oldName, newName) {
    if (newName.trim().length == 0) {
      alert("Invalid bank name");
      return false;
    }
    if (newName != oldName) {
      if (this.PresetsBank[newName]) {
        alert("This bank name is already used");
        return false;
      }
      this.PresetsBank[newName] = this.PresetsBank[oldName];
      delete this.PresetsBank[oldName];
    }
    return true;
  }

  /**
   * Delete a preset
   * @param bankNameCallBack the name of the bank which contain the preset to delete
   * @param presetNameCallBack the name of the preset to delete
   * @param node of the preset
   */
  deletePreset(bankNameCallBack, presetNameCallBack, node) {
    delete this.PresetsBank[bankNameCallBack()][presetNameCallBack()];
    this.presets.removeChild(node);
  }

  /**
   * Delete a bank if it's empty.
   * @param {function} bankNameCallBack
   * @param {HTMLElement} node
   */
  deleteBank(bankNameCallBack, node) {
    const bank = bankNameCallBack();
    if (Object.keys(this.PresetsBank[bank]).length != 0) {
      alert("Empty the bank before trying to delete it");
    } else {
      delete this.PresetsBank[bank];
      this.banks.removeChild(node);
    }
  }

  /**
   * Create a preset editable with the buttons to it's right, it can save the onfiguration of the board.
   * @param {function} bankNameCallBack
   * @param {string} presetName
   * @returns The preset HTMLElement.
   * @author Quentin Beauchet
   */
  createPresetElement(bankNameCallBack, presetName) {
    const bank = bankNameCallBack();

    let el = document.createElement("li");
    el.classList.add("presetElement");

    let text = document.createElement("span");
    text.innerHTML = presetName;
    const clickEventCallBack = () => this.displayPreset(bankNameCallBack, text.innerHTML);
    text.addEventListener("click", clickEventCallBack);
    el.append(text);

    let input = document.createElement("input");
    input.addEventListener("keyup", (e) => {
      if (e.key == "Enter") input.blur();
    });
    input.addEventListener("blur", (e) => {
      if (this.renamePreset(bank, e.target.placeholder, e.target.value)) {
        text.innerHTML = e.target.value;
        text.addEventListener("click", clickEventCallBack);
      } else {
        setTimeout(() => input.focus(), 1);
      }
    });

    el.append(
      this.createLiButton(this._saveSVGUrl, "SAVE", () => {
        this._plug.pedalboardNode
          .getState(this.board.childNodes)
          .then((state) => (this.PresetsBank[bank][text.innerHTML] = state.current));
      })
    );

    el.append(
      this.createLiButton(this._editSVGUrl, "EDIT", () => {
        text.removeEventListener("click", clickEventCallBack);
        input.value = text.innerHTML;
        input.placeholder = input.value;
        text.innerHTML = "";
        text.appendChild(input);
        input.focus();
      })
    );

    el.append(
      this.createLiButton(this._deleteSVGUrl, "DELETE", () =>
        this.deletePreset(bankNameCallBack, () => text.innerHTML, el)
      )
    );

    return el;
  }

  /**
   * Create a bank editable with the buttons to it's right, it can hold multiples presets.
   * @param {string} name
   * @returns The bank HTMLElement.
   * @author Quentin Beauchet
   */
  createBankElement(name) {
    let el = document.createElement("li");
    el.classList.add("bankElement");

    const clickEventCallBack = () => this.displayBank(() => text.innerHTML);

    let text = document.createElement("span");
    text.innerHTML = name;
    text.addEventListener("click", clickEventCallBack);
    el.appendChild(text);

    let input = document.createElement("input");
    input.addEventListener("keyup", (e) => {
      if (e.key == "Enter") input.blur();
    });
    input.addEventListener("blur", (e) => {
      if (this.renameBank(e.target.placeholder, e.target.value)) {
        text.innerHTML = e.target.value;
        text.addEventListener("click", clickEventCallBack);
      } else {
        setTimeout(() => input.focus(), 1);
      }
    });

    el.append(
      this.createLiButton(this._editSVGUrl, "EDIT", () => {
        text.removeEventListener("click", clickEventCallBack);
        input.value = text.innerHTML;
        input.placeholder = input.value;
        text.innerHTML = "";
        text.appendChild(input);
        input.focus();
      })
    );

    el.append(this.createLiButton(this._deleteSVGUrl, "DELETE", () => this.deleteBank(() => text.innerHTML, el)));

    return el;
  }

  /**
   * Create a button (img) for a bank or a preset.
   * @param {string} url
   * @param {string} alt
   * @param {function} callback
   * @returns The button HTMLElement.
   * @author Quentin Beauchet
   */
  createLiButton(url, alt, callback) {
    let img = document.createElement("img");
    img.setAttribute("crossorigin", "anonymous");
    img.setAttribute("src", url);
    img.setAttribute("alt", alt);
    img.addEventListener("click", callback);
    img.classList.add("listElementButton");
    return img;
  }

  /**
   * Return DataWidth and DataHeight values.
   */
  get properties() {
    const bbox = this.body?.getBoundingClientRect();
    return {
      dataWidth: { value: bbox?.width || 1002 },
      dataHeight: { value: bbox?.height || 609 },
    };
  }

  /**
   * Link the css.
   * @author Quentin Beauchet
   */
  setStyle() {
    this.style.display = "block";

    var head = document.createElement("head");

    var style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("crossorigin", "anonymous");
    style.setAttribute("href", `${this._baseURL}/style.css`);

    head.appendChild(style);
    this._root.appendChild(head);
  }
}

customElements.define("wam2-pedalboard", pedalboardGui);

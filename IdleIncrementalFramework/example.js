(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let _IIF = require("../IIF/main");
let _View = require("./view");
class Game extends _IIF.Game {
    constructor(args) {
        super({
            langs : ['en-EN'], // optional, will default to en-EN. wil be ignored if no libName is given
            libName : 'Example', // optional, set to libName to load lang/libName.xml and activate localization using the _txt function
            viewClass : _View, // main view that will be targeted for redraws on value updates
            saveKey : 'example', // necessary for the save/load functions to work
            gameVersion : '0.1', // used for save migration/versioning
            ticks : true,// if set to true, activates the worker to tick when needed, activates the functions game.unpause, game.pause and game.restart
            gameValues : { // game values are saved, and are linked to a view component for redraw. it gives handles like game.getValue(valueKey) (passed as reference) and game.redrawValue(valueKey) for a targeted redraw
                gold : {
                    component : 'goldValueDisplay', // the component that will be used. Needs to be declared in the view
                    data : new _IIF.BigNumber(100,0), // the data structure that is used. needs to implement at least toStr() for drawing, toJSON() and fromJSON(json) for save and load behavior
                },
            }
        });
    }
    upgradeSave (saveData,fromVersion) {
        console.log("upgrading savedata from game",saveData,"from game version",fromVersion);
        // if saveData changes structure from one game version to another, you can alter the saved games here.
        switch(fromVersion) {
            case '0.1' : // put here the necessary changes from version 0.1 to the next. Don't use a break, so following upgrades will trigger too
            default:;
        }

        return saveData;
    }
    addGold (quantity) {
        this.getValue('gold').add(quantity);
        this.redrawValue('gold')
    }
    multGold (exponent) {
        let goldValue = this.getValue('gold')
        let currentGold = goldValue.getValue();
        currentGold = currentGold*Math.pow(10,exponent);
        goldValue.setValue(currentGold);
        this.redrawValue('gold')
    }
    resetGold () {
        this.getValue('gold').setValue(100);
        this.redrawValue('gold')
    }
}
module.exports = Game;

},{"../IIF/main":10,"./view":3}],2:[function(require,module,exports){
let _Game = require("./game");
window.game = new _Game();

},{"./game":1}],3:[function(require,module,exports){
let _IIF = require("../IIF/main");
let _txt = _IIF.html.localizedText;

class View extends _IIF.View {
    constructor (params) {
        // in this example, we will use a custom TPL
        params.customTpls = {
            control : 'Example/tpl/control.tpl',
            monitor : 'Example/tpl/monitor.tpl',
        }
        // you can also define tpl during runtime with :
        // _IIF.html.defineTpl('control','Example/tpl/control.tpl');

        // we then will use that component for 2 controls
        params.components = {
            addGold : {
                tpl : 'control',
                tplBindings : {
                    onclick : 'game.addGold(10)',
                    text : _txt("test_output>controls>addGold"),
                },
                anchor : 'addGold',
            },
            multiplyGold : {
                tpl : 'control',
                tplBindings : {
                    onclick : 'game.multGold(1)',
                    text : _txt("test_output>controls>multGold"),
                },
                anchor : 'multGold',
            },
            resetGold : {
                tpl : 'control',
                tplBindings : {
                    onclick : 'game.resetGold()',
                    text : _txt("test_output>controls>resetGold"),
                },
                anchor : 'resetGold',
            },
            save : {
                tpl : 'control',
                tplBindings : {
                    onclick : 'game.save()',
                    text : _txt("test_output>controls>save"),
                },
                anchor : 'save',
            },
            load : {
                tpl : 'control',
                tplBindings : {
                    onclick : 'game.load()',
                    text : _txt("test_output>controls>load"),
                },
                anchor : 'load',
            },
            clearSave : {
                tpl : 'control',
                tplBindings : {
                    onclick : 'game.clearSave()',
                    text : _txt("test_output>controls>clearSave"),
                },
                anchor : 'clearSave',
            },

            startTime : {
                tpl : 'control',
                tplBindings : {
                    onclick : 'game.unpause()',
                    text : _txt("test_output>controls>unpause"),
                },
                anchor : 'unpause',
            },
            stopTime : {
                tpl : 'control',
                tplBindings : {
                    onclick : 'game.pause()',
                    text : _txt("test_output>controls>pause"),
                },
                anchor : 'pause',
            },
            tick : {
                tpl : 'control',
                tplBindings : {
                    onclick : 'game.tick()',
                    text : _txt("test_output>controls>tick"),
                },
                anchor : 'tick',
            },

            goldDisplay : {
                tpl : 'monitor',
                tplBindings : {
                    label : _txt("test_output>resource>gold>label"),
                    value : '',
                    valueId : 'goldValueDisplay',
                },
                anchor : 'goldDisplay',
            },
            goldValueDisplay : {
                tpl : 'updatedValue',
                tplBindings : {
                    id : 'goldDisplay_value',
                    val : '',
                },
                anchor : 'goldValueDisplay',
            },
        }
        super(params)
    }
}
module.exports = View;

},{"../IIF/main":10}],4:[function(require,module,exports){
let debug = true;

let innerPrecision = Number.MAX_SAFE_INTEGER.toExponential().split("e+")[1] -1; // usually 14

let _value = new WeakMap();

class BigNumber {
    constructor (initialValue,displayPrecision) {
        let preciseValue = initialValue.toExponential().split('e');
        this.display_mode = 'toShortSuffix';
        let datas = {
            preciseValue : Math.floor(preciseValue[0]*Math.pow(10,innerPrecision-1)),
            exponent : (preciseValue[1])*1 -innerPrecision+1,
            precision : displayPrecision,
        };
        _value.set(this,datas)
    }
    setValue (initialValue) {
        let preciseValue = initialValue.toExponential().split('e');
        let value = _value.get(this);
        value.preciseValue = Math.floor(preciseValue[0]*Math.pow(10,innerPrecision-1));
        value.exponent = (preciseValue[1])*1 -innerPrecision+1,
        _value.set(this,value);
    }
    setPrecision (precision) {
        let value = _value.get(this);
        value.precision = precision;
        _value.set(this,value);
    }
    getValue () {
        let value = _value.get(this);
        return value.preciseValue*Math.pow(10,value.exponent);
    }
    add (toAdd) {
        let value = this.getValue();
        value = value + toAdd;
        this.setValue(value);
    }
    toStr () {
        return this[this.display_mode]();
    }
    toScientific () {
        let value = _value.get(this);
        let preciseSplit = value.preciseValue.toExponential().split('e')
        let displayExponent = preciseSplit[1]*1+value.exponent;
        let displayValue = (preciseSplit[0]*1).toFixed(value.precision);
        return displayValue+"e"+(displayExponent > 0 ? '+' : '')+displayExponent;
    }
    toEngineering () {
        let value = _value.get(this);
        let preciseSplit = value.preciseValue.toExponential().split('e');
        let displayExponent = preciseSplit[1]*1+value.exponent;
        let displayValue = (preciseSplit[0]*1);
        let removedExponent = displayExponent%3;
        displayExponent -= removedExponent;
        displayValue *= Math.pow(10,removedExponent);
        displayValue = displayValue.toFixed(value.precision);
        return displayValue+"e"+(displayExponent > 0 ? '+' : '')+displayExponent;
    }
    toShortSuffix () {
        let value = _value.get(this);
        let preciseSplit = value.preciseValue.toExponential().split('e');
        let displayExponent = preciseSplit[1]*1+value.exponent;
        let displayValue = (preciseSplit[0]*1);
        let removedExponent = displayExponent%3;
        displayExponent -= removedExponent;
        displayValue *= Math.pow(10,removedExponent);
        displayValue = displayValue.toFixed(value.precision);
        let suffix = "e"+(displayExponent > 0 ? '+' : '')+displayExponent
        switch (displayExponent/3) {
            case -8 : suffix = 'y';break;
            case -7 : suffix = 'z';break;
            case -6 : suffix = 'a';break;
            case -5 : suffix = 'f';break;
            case -4 : suffix = 'p';break;
            case -3 : suffix = 'n';break;
            case -2 : suffix = 'µ';break;
            case -1 : suffix = 'm';break;
            case 0 : suffix = '';break;
            case 1 : suffix = 'k';break;
            case 2 : suffix = 'M';break;
            case 3 : suffix = 'G';break;
            case 4 : suffix = 'T';break;
            case 5 : suffix = 'P';break;
            case 6 : suffix = 'E';break;
            case 7 : suffix = 'Z';break;
            case 8 : suffix = 'Y';break;
            default:break;
        }
        return displayValue+suffix;
    }
    toLongSuffix () {
        let value = _value.get(this);
        let preciseSplit = value.preciseValue.toExponential().split('e');
        let displayExponent = preciseSplit[1]*1+value.exponent;
        let displayValue = (preciseSplit[0]*1);
        let removedExponent = displayExponent%3;
        displayExponent -= removedExponent;
        displayValue *= Math.pow(10,removedExponent);
        displayValue = displayValue.toFixed(value.precision);
        let suffix = "e"+(displayExponent > 0 ? '+' : '')+displayExponent
        switch (displayExponent/3) {
            case -8 : suffix = 'yocto';break;
            case -7 : suffix = 'zepto';break;
            case -6 : suffix = 'atto';break;
            case -5 : suffix = 'femto';break;
            case -4 : suffix = 'pico';break;
            case -3 : suffix = 'nano';break;
            case -2 : suffix = 'micro';break;
            case -1 : suffix = 'milli';break;
            case 0 : suffix = '';break;
            case 1 : suffix = 'kilo';break;
            case 2 : suffix = 'mega';break;
            case 3 : suffix = 'giga';break;
            case 4 : suffix = 'tera';break;
            case 5 : suffix = 'peta';break;
            case 6 : suffix = 'exa';break;
            case 7 : suffix = 'zetta';break;
            case 8 : suffix = 'yotta';break;
            default:break;
        }
        return displayValue+suffix;
    }
    toJSON () {
        return _value.get(this);
    }
    fromJSON(json) {
        _value.set(this,json);
    }
}

module.exports = BigNumber;

},{}],5:[function(require,module,exports){
let debug = true;
let SavedValue = require('./savedValue');

class GameValue extends SavedValue {
    constructor (config) {
        if (debug)
            console.log("GameValue : creating a new value",config)
        super(config.data);
        this.id = config.id;
        this.component = config.component;
    }
    toStr() {
        return this.getValueObject().toStr();
    }
}
module.exports = GameValue;

},{"./savedValue":6}],6:[function(require,module,exports){
let debug = true;

let datas = new WeakMap();

class SavedValue {
    constructor (data) {
        if (debug)
            console.log("SavedValue : creating a new value",data);
        datas.set(this,data);
    }
    getValueObject() {
        return datas.get(this);
    }
    toJSON () {
        return this.getValueObject().toJSON();
    }
    fromJSON(json) {
        this.getValueObject().fromJSON(json);
    }
}
module.exports = SavedValue;

},{}],7:[function(require,module,exports){
let debug = true;
let localization = require('./localization');
let view = require('./view');
let GameValue = require('./dataStruct/gamevalue');
let Save = require('./save');
let Time = require('./time');

let _view = new WeakMap();
let _values = new WeakMap();
let _save = new WeakMap();
let _time = new WeakMap();

class Game {
    constructor(config) {

        if (debug)
            console.log("Game : new game",config)

        this.config = config;
        let that = this;

        if (!(typeof(config.libName) === "undefined")) {
            if ((typeof(config.langs) != "undefined") && (config.langs.length > 0)) {
                localization.setLang(config.langs[0]);
            }
            localization.load(config.libName,function(){
                that.localize()
            });
        }

        if(typeof(config.viewClass) === "undefined")
            config.viewClass = view.viewClass;
        let view = new config.viewClass({
            onInitialized : this.onViewInitialized,
            gameObj : this,
        })
        _view.set(this,view);

        _values.set(this,{});
        if (!(typeof(config.gameValues) === "undefined")) {
            Object.keys(config.gameValues).forEach(function(key) {
                that.registerValue(key,config.gameValues[key])
            })
            this.redrawValues();
        }

        if (!(typeof(config.ticks) === "undefined")) {
            _time.set(this,new Time(this));
        }

        _save.set(this,new Save(config.saveKey,this));
    }
    // values management
    redrawValue(key) {
        _view.get(this).redrawComponent(_values.get(this)[key]);
    }
    redrawValues() {
        if (this.getView().initialized === false) {
            return true;
        }
        let values = _values.get(this);
        let that = this;
        Object.keys(values).forEach(function(key) {
            _view.get(that).redrawComponent(values[key]);
        });
    }
    registerValue (key,config) {
        let values = _values.get(this);
        if (!(typeof(values[key]) === "undefined")) {
            console.warn('Game : trying to create a registered value with an already taken identifier :',key)
            return false;
        }
        config.id = key;
        values[key] = new GameValue(config);
        _values.set(this,values);
    }
    listValues() {
        return Object.keys(_values.get(this));
    }
    getValue(key) {
        return _values.get(this)[key].getValueObject();
    }
    // view management
    localize() {
        if (!(typeof(this.config.libName) === "undefined"))
            localization.parsePage(this.config.libName);
    }
    onViewInitialized () {
        if (debug)
            console.log("Game : View initialized",this)
        if (!(typeof(this.config.libName) === "undefined"))  // if the game is localized, we parse the page now that the view is built. The page is already parsed after the lib is loaded but we prepared the texts before that
            localization.parsePage(this.config.libName);
        this.redrawValues();
        this.localize();
    }
    getView () {
        return _view.get(this);
    }
    draw () {
        _view.get(this).draw();
    }
    update (target) {
        _view.get(this).update(target);
    }
    //save management
    load () {
        _save.get(this).load();
        this.redrawValues();
    }
    save () {
        _save.get(this).save();
    }
    clearSave () {
        _save.get(this).clearSave();
    }
    //time management
    getTicker() {
        if (this.config.ticks)
            return _time.get(this);
    }
    unpause () {
        if (this.config.ticks)
            _time.get(this).unpause();
    }
    pause () {
        if (this.config.ticks)
            _time.get(this).pause();
    }
    restart () {
        if (this.config.ticks)
            _time.get(this).restart();
    }
    tick () {
        if (this.config.ticks)
            _time.get(this).tick();
    }
    processTicks (tickCount) {
        if(debug)
            console.log("Game : processing ticks, tickCount :",tickCount);


    }
}
module.exports = Game;

},{"./dataStruct/gamevalue":5,"./localization":9,"./save":11,"./time":12,"./view":13}],8:[function(require,module,exports){
let debug = true;

let localization = require('./localization');

class Tpl {
    constructor (tplStr) {
        this.str = tplStr;
        this.keys = [];
        this.values = {};
        let match = false;
        while (match = tplStr.match((/{{([a-z]+)}}/))) {
            this.keys.push(match[1]);
            tplStr = tplStr.substr(match.index + 1);
        }
    }
    set (key,val) {
        this.values[key] = val;
    }
    getHtml () {
        let html = this.str;
        let values = this.values;
        Object.keys(this.values).forEach(function(key) {
            html = html.replace("{{"+key+"}}",values[key]);
        })
        return html;
    }
}
let tpls = {
    updatedValue : "<span id=\"{{id}}\">{{val}}</span>\n",
    localizedText :("<span class=\"{{locClass}}\" data-{{locDataKey}}=\"{{path}}\">{{text}}</span>\n")
                .replace('{{locClass}}',localization.config.class)
                .replace('{{locDataKey}}',localization.config.dataKey),
}

function loadTpl (path,callback) {
    let data = false;

    fetch(path)
        .then(response => response.text())
        .then(_data => {
            if (debug)
                console.log("html : Loaded tpl",path,_data);
            data = _data;
        })
        .catch(function(error) {
            console.warn("html : Error while loading a tpl : ",error.message,path);
        })
        .then(()=>{
            callback.call(this,data)
        });
}
function defineTpl (tplKey,tplPath,callback,ctx) {
    if (typeof(callback) === "undefined")
        callback = (()=>{});
    loadTpl(tplPath,function(tplStr) {
        tpls[tplKey] = tplStr;
        callback.call(ctx);
    })
}
function getTpl (tpl,datas) {
    if(typeof(tpls[tpl]) === "undefined") {
        if(debug)
            console.warn("html : Trying to use a tpl that isn't declared, or loaded yet :",tpl)
        return false;
    }
    if (tpls[tpl] === false)
        return false;
    if (typeof(datas) === "undefined")
        return new Tpl(tpls[tpl]);

    tpl = new Tpl(tpls[tpl]);
    Object.keys(datas).forEach(function(key) {
        tpl.set(key,datas[key])
    });
    return tpl.getHtml();
}
function localizedText (path,lib) {
    return getTpl('localizedText',{
    	path : path,
        text : localization.getText(path,lib),
    });
}
exports.getTpl = getTpl;
exports.defineTpl = defineTpl;
exports.localizedText = localizedText;


},{"./localization":9}],9:[function(require,module,exports){
let debug = true;
let defaultLang = 'en-EN';
let supportedLang = 'en-EN';

let htmlSelector = 'loc'; // class to add to the html tag to localize
let htmlDataKey = 'lk'; // data key to use to store the path to text

let key = 'lang'; // key used in the get parameter of the URL to set a specific language

let currentLang = undefined;
let currentLib = undefined;
let libs = {};
let listeners = {};

function setLang (lang) {
    if (typeof(lang) === "undefined") {
        currentLang = (typeof(currentLang) === "undefined") ? defaultLang : currentLang;
    } else currentLang = lang;
}

function setCurrentLib (libName) {
    currentLib = libName;
}

function fireListeners(loadedLib) {
    while (toFire = listeners[loadedLib].pop()) {
        toFire.call();
    }
}

function load (libName,callback) {

    // preparing the lang and lib to load
    let libToLoad = libName;
    if (typeof(libToLoad) === "undefined") {
        if (typeof(currentLib) === "undefined") {
            console.error("Localization : Trying to load XML file without providing a libName");
        }
        libToLoad = currentLib;
    }
    if (Object.keys(libs).length == 0)
        setCurrentLib(libToLoad);

    if (typeof(currentLang) === "undefined")
        setLang();

    let libPath = currentLang+'/'+libToLoad;

    //checking if the lib is loaded
    if (typeof(libs[libPath]) === "undefined") { // if the lib isn't already loaded
        libs[libPath] = false;
        listeners[libPath] = typeof(callback) === "undefined" ? [] : [callback];
        fetch('lang/'+libPath+'.xml')
            .then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(data => {
                libs[libPath] = XMLtoJSON(data).body;
                if (debug)
                    console.log("Localization : Loaded lib",libPath,libs[libPath]);
                fireListeners(libPath);
            })
            .catch(function(error) {
                console.warn("Localization : Error while loading the XML: ",error.message,libPath);
            });
    } else { // library is already loaded
        if (!(typeof(callback) === "undefined")) {
            listeners[libPath].push(callback);
            if (libs[libPath])
                fireListeners(libPath);
        }
    }
}

function isArray(o) {
    return Object.prototype.toString.apply(o) === '[object Array]';
}

function parseNode(xmlNode, result) {
    if (xmlNode.nodeName == "#text") {
        var v = xmlNode.nodeValue;
        if (v.trim()) {
           result['#text'] = v;
        }
        return;
    }

    var jsonNode = {};
    var existing = result[xmlNode.nodeName];
    if(existing) {
        if(!isArray(existing)) {
            result[xmlNode.nodeName] = [existing, jsonNode];
        }
        else {
            result[xmlNode.nodeName].push(jsonNode);
        }
    }
    else {
            result[xmlNode.nodeName] = jsonNode;
    }

    if(xmlNode.attributes) {
        var length = xmlNode.attributes.length;
        for(var i = 0; i < length; i++) {
            var attribute = xmlNode.attributes[i];
            jsonNode[attribute.nodeName] = attribute.nodeValue;
        }
    }

    var length = xmlNode.childNodes.length;
    for(var i = 0; i < length; i++) {
        parseNode(xmlNode.childNodes[i], jsonNode);
    }
}

function XMLtoJSON (xml) {
    var result = {};
    if(xml.childNodes.length) {
        parseNode(xml.childNodes[0], result);
    }

    return result;
}

function getLib (lib) {
    if (typeof(lib) === "undefined")
        lib = currentLib;
    let libPath = currentLang+'/'+lib;
    if(!libs[libPath]) {
        return false;
    }
    return libs[libPath];
}

function getText(_path,lib) {
    lib = getLib(lib);
    try {
        if (lib) {
            let path = _path.split(">");
            while (part = path.shift()) {
                lib = lib[part];
            }
            return lib['#text'];
        }
    } catch (error) {
        if (debug)
            console.log("Localization : Error retrieving the text for the key",_path)
    }
    return "["+_path+"]";
}

function parsePage (libName) {
    let elems = document.getElementsByClassName(htmlSelector)
    for(let i = 0; i < elems.length;i++) {
        let path = elems[i].attributes["data-"+htmlDataKey].value;
        elems[i].innerHTML = getText(path,libName)
    }

}

exports.setLang = setLang; // used to change the language
exports.setLib = setCurrentLib;
exports.load = load;
exports.parsePage = parsePage;
exports.getLib = getLib;
exports.getText = getText;
exports.config = {
    class : htmlSelector,
    dataKey : htmlDataKey,
}

},{}],10:[function(require,module,exports){
exports.IIF_version = '0.0.1';

exports.Game = require('./game.js');
exports.BigNumber = require('./dataStruct/bignumber.js');
exports.View = require('./view.js');
exports.html = require('./html.js');
exports.localization = require('./localization.js');

window.IIF = exports;

},{"./dataStruct/bignumber.js":4,"./game.js":7,"./html.js":8,"./localization.js":9,"./view.js":13}],11:[function(require,module,exports){
let debug = true;

let _IIF = require("./main");

class Save {
    constructor (saveKey,gameObj) {
        this.saveKey = saveKey+"_IIFSave";
        this.gameObj = gameObj;
        if (this.hasSaveData()) {
            this.load();
        } else {
            this.data = this.newSave();
            this.save();
            this.load();
        }
    }
    hasSaveData () {
        return !(localStorage.getItem(this.saveKey) === null);
    }
    clearSave () {
        localStorage.removeItem(this.saveKey);
        window.location.reload();
    }
    newSave () {
        return {
            meta : {
                IIF_version : _IIF.IIF_version,
                game_version : this.gameObj.config.gameVersion
            },
            values : {},
        }
    }
    save() {
        let that = this;
        this.gameObj.listValues().forEach(function(key) {
            that.data.values[key] = that.gameObj.getValue(key).toJSON();
        });

        if (debug)
            console.log('Save : saving data to localstorage',this.data);

        localStorage.setItem(this.saveKey,JSON.stringify(this.data));
    }
    load() {
        let that = this;
        this.data = JSON.parse(localStorage.getItem(this.saveKey));
        this.upgradeSave_IIF();
        this.upgradeSave_Game();
        if (debug)
            console.log('Save : loading data from localstorage',this.data);
        this.gameObj.listValues().forEach(function(key) {
            that.gameObj.getValue(key).fromJSON(that.data.values[key]);
        });
        return this.data;
    }
    upgradeSave_IIF() {

        if (this.data.meta.IIF_version === _IIF.IIF_version)
            return;

        if (debug)
            console.log('Save : migrating IIF savedData from ',this.data.meta.IIF_version,'to',_IIF.IIF_version);

        switch(this.data.meta.IIF_version) {
            case '0.0.1' : ;// add here the migration code for saveData from 0.0.1 to the next version. Don't put a break, and put versions in chronological order to trigger all the upgrades necessary
                // this.data.values = this.data.data;
                // delete(this.data.data);
            default:break;
        }
        this.data.meta.IIF_version = _IIF.IIF_version;

    }
    upgradeSave_Game () {

        if (this.data.meta.game_version === this.gameObj.config.gameVersion)
            return;

        if (debug)
            console.log('Save : migrating game savedData from ',this.data.meta.game_version,'to',this.gameObj.config.gameVersion);

        if (!(typeof(this.gameObj.upgradeSave) === 'undefined')) {
            this.data.values = this.gameObj.upgradeSave(this.data.values,this.data.meta.game_version);
        }
        this.data.meta.game_version = this.gameObj.config.gameVersion;

    }
}

module.exports = Save;

},{"./main":10}],12:[function(require,module,exports){
let debug = true;

class Time {
    constructor (tickedObject) {
        let that = this;
        this.tickedObject = tickedObject;
        this.worker = new Worker('IIFWorker.js');
        this.worker.onmessage = function(e) {
            that.handleWorkerMessage.call(that,e);
        }
        this.running = false;
    }
    unpause () {
        this.worker.postMessage('unpause');
    }
    pause () {
        this.worker.postMessage('pause');
    }
    restart () {
        this.worker.postMessage('restart');
    }
    tick () {
        this.worker.postMessage('tick');
    }
    handleWorkerMessage(e) {
        if (debug)
            console.log("Time : recieving a message from the worker",e.data,this)
        let response = e.data;
        switch (response[0]) {
            case 'doTick' :
                if (response[1] > 0)
                    this.tickedObject.processTicks(response[1]);
                break;
            default : break;
        }
    }
}

module.exports = Time;

},{}],13:[function(require,module,exports){
let debug = true;
let html = require('./html');
let tplsToLoad = new WeakMap();

class View {
    constructor (config) {
        if (debug)
            console.log("View : creating a new view",config)
        this.config = config;
        this.components = {};
        if (!(typeof(config.customTpls) === "undefined")) {
            tplsToLoad.set(this,Object.keys(config.customTpls).length);
            let that = this;
            this.initialized = false;
            Object.keys(config.customTpls).forEach(function(key) {
                html.defineTpl(key,config.customTpls[key],that.finishTplLoading,that)
            })
        } else {
            this.onInitialized();
        }
    }
    finishTplLoading() {
        tplsToLoad.set(this,tplsToLoad.get(this)-1);
        if (tplsToLoad.get(this)<=0) {
            this.onInitialized();
        }
    }
    onInitialized () {
        let that = this;
        if (!document.body) {
          window.addEventListener("load", function(event) {
            that.onInitialized();
          });
          return false;
        }
        this.initialized = true;
        if (debug)
            console.log("View : View initialized",this.config)

        // tpls are loaded, we build the components
        if (!(typeof(this.config.components) === "undefined")) {
            let that = this;
            Object.keys(this.config.components).forEach(function(key) {
                that.addComponent(key,that.config.components[key]);
            })
        }

        if (!(typeof(this.config.onInitialized) === "undefined"))
            this.config.onInitialized.call(this.config.gameObj);
    }
    addComponent (componentID,config) {
        this.components[componentID] = config;
        this.buildComponent(componentID);
    }
    buildComponent (componentID) {
        let config = this.components[componentID];
        let element = document.getElementById(config.anchor);
        if (element === null) {
            if(debug)
                console.log("View : trying to build an element but the anchor can't be found",componentID)
            return false;
        }
        let innerHTML = html.getTpl(config.tpl,config.tplBindings);
        if (innerHTML)
            element.innerHTML = innerHTML;
    }
    redrawComponent (componentObj) {
        if (this.components[componentObj.component].tpl === 'updatedValue') {
            let element = document.getElementById(this.components[componentObj.component].tplBindings.id);
            if (element) {
                element.innerHTML = componentObj.toStr();
            } else {
                if(debug)
                    console.log("View : trying to redraw an element but the anchor can't be found",componentID)
            }
        } else this.buildComponent(componentObj.component);
    }
    redraw () {
        let that = this;
        Object.keys(this.config.components).forEach(function(key) {
            that.redrawComponent(key);
        })
    }
}
module.exports = View;

},{"./html":8}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL0d1aXptby9BcHBEYXRhL1JvYW1pbmcvbnBtL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJFeGFtcGxlL2dhbWUuanMiLCJFeGFtcGxlL21haW4uanMiLCJFeGFtcGxlL3ZpZXcuanMiLCJJSUYvZGF0YVN0cnVjdC9iaWdudW1iZXIuanMiLCJJSUYvZGF0YVN0cnVjdC9nYW1ldmFsdWUuanMiLCJJSUYvZGF0YVN0cnVjdC9zYXZlZFZhbHVlLmpzIiwiSUlGL2dhbWUuanMiLCJJSUYvaW5wdXQuanMiLCJJSUYvbG9jYWxpemF0aW9uLmpzIiwiSUlGL21haW4uanMiLCJJSUYvc2F2ZS5qcyIsIklJRi90aW1lLmpzIiwiSUlGL3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibGV0IF9JSUYgPSByZXF1aXJlKFwiLi4vSUlGL21haW5cIik7XG5sZXQgX1ZpZXcgPSByZXF1aXJlKFwiLi92aWV3XCIpO1xuY2xhc3MgR2FtZSBleHRlbmRzIF9JSUYuR2FtZSB7XG4gICAgY29uc3RydWN0b3IoYXJncykge1xuICAgICAgICBzdXBlcih7XG4gICAgICAgICAgICBsYW5ncyA6IFsnZW4tRU4nXSwgLy8gb3B0aW9uYWwsIHdpbGwgZGVmYXVsdCB0byBlbi1FTi4gd2lsIGJlIGlnbm9yZWQgaWYgbm8gbGliTmFtZSBpcyBnaXZlblxuICAgICAgICAgICAgbGliTmFtZSA6ICdFeGFtcGxlJywgLy8gb3B0aW9uYWwsIHNldCB0byBsaWJOYW1lIHRvIGxvYWQgbGFuZy9saWJOYW1lLnhtbCBhbmQgYWN0aXZhdGUgbG9jYWxpemF0aW9uIHVzaW5nIHRoZSBfdHh0IGZ1bmN0aW9uXG4gICAgICAgICAgICB2aWV3Q2xhc3MgOiBfVmlldywgLy8gbWFpbiB2aWV3IHRoYXQgd2lsbCBiZSB0YXJnZXRlZCBmb3IgcmVkcmF3cyBvbiB2YWx1ZSB1cGRhdGVzXG4gICAgICAgICAgICBzYXZlS2V5IDogJ2V4YW1wbGUnLCAvLyBuZWNlc3NhcnkgZm9yIHRoZSBzYXZlL2xvYWQgZnVuY3Rpb25zIHRvIHdvcmtcbiAgICAgICAgICAgIGdhbWVWZXJzaW9uIDogJzAuMScsIC8vIHVzZWQgZm9yIHNhdmUgbWlncmF0aW9uL3ZlcnNpb25pbmdcbiAgICAgICAgICAgIHRpY2tzIDogdHJ1ZSwvLyBpZiBzZXQgdG8gdHJ1ZSwgYWN0aXZhdGVzIHRoZSB3b3JrZXIgdG8gdGljayB3aGVuIG5lZWRlZCwgYWN0aXZhdGVzIHRoZSBmdW5jdGlvbnMgZ2FtZS51bnBhdXNlLCBnYW1lLnBhdXNlIGFuZCBnYW1lLnJlc3RhcnRcbiAgICAgICAgICAgIGdhbWVWYWx1ZXMgOiB7IC8vIGdhbWUgdmFsdWVzIGFyZSBzYXZlZCwgYW5kIGFyZSBsaW5rZWQgdG8gYSB2aWV3IGNvbXBvbmVudCBmb3IgcmVkcmF3LiBpdCBnaXZlcyBoYW5kbGVzIGxpa2UgZ2FtZS5nZXRWYWx1ZSh2YWx1ZUtleSkgKHBhc3NlZCBhcyByZWZlcmVuY2UpIGFuZCBnYW1lLnJlZHJhd1ZhbHVlKHZhbHVlS2V5KSBmb3IgYSB0YXJnZXRlZCByZWRyYXdcbiAgICAgICAgICAgICAgICBnb2xkIDoge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgOiAnZ29sZFZhbHVlRGlzcGxheScsIC8vIHRoZSBjb21wb25lbnQgdGhhdCB3aWxsIGJlIHVzZWQuIE5lZWRzIHRvIGJlIGRlY2xhcmVkIGluIHRoZSB2aWV3XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgOiBuZXcgX0lJRi5CaWdOdW1iZXIoMTAwLDApLCAvLyB0aGUgZGF0YSBzdHJ1Y3R1cmUgdGhhdCBpcyB1c2VkLiBuZWVkcyB0byBpbXBsZW1lbnQgYXQgbGVhc3QgdG9TdHIoKSBmb3IgZHJhd2luZywgdG9KU09OKCkgYW5kIGZyb21KU09OKGpzb24pIGZvciBzYXZlIGFuZCBsb2FkIGJlaGF2aW9yXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHVwZ3JhZGVTYXZlIChzYXZlRGF0YSxmcm9tVmVyc2lvbikge1xuICAgICAgICBjb25zb2xlLmxvZyhcInVwZ3JhZGluZyBzYXZlZGF0YSBmcm9tIGdhbWVcIixzYXZlRGF0YSxcImZyb20gZ2FtZSB2ZXJzaW9uXCIsZnJvbVZlcnNpb24pO1xuICAgICAgICAvLyBpZiBzYXZlRGF0YSBjaGFuZ2VzIHN0cnVjdHVyZSBmcm9tIG9uZSBnYW1lIHZlcnNpb24gdG8gYW5vdGhlciwgeW91IGNhbiBhbHRlciB0aGUgc2F2ZWQgZ2FtZXMgaGVyZS5cbiAgICAgICAgc3dpdGNoKGZyb21WZXJzaW9uKSB7XG4gICAgICAgICAgICBjYXNlICcwLjEnIDogLy8gcHV0IGhlcmUgdGhlIG5lY2Vzc2FyeSBjaGFuZ2VzIGZyb20gdmVyc2lvbiAwLjEgdG8gdGhlIG5leHQuIERvbid0IHVzZSBhIGJyZWFrLCBzbyBmb2xsb3dpbmcgdXBncmFkZXMgd2lsbCB0cmlnZ2VyIHRvb1xuICAgICAgICAgICAgZGVmYXVsdDo7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2F2ZURhdGE7XG4gICAgfVxuICAgIGFkZEdvbGQgKHF1YW50aXR5KSB7XG4gICAgICAgIHRoaXMuZ2V0VmFsdWUoJ2dvbGQnKS5hZGQocXVhbnRpdHkpO1xuICAgICAgICB0aGlzLnJlZHJhd1ZhbHVlKCdnb2xkJylcbiAgICB9XG4gICAgbXVsdEdvbGQgKGV4cG9uZW50KSB7XG4gICAgICAgIGxldCBnb2xkVmFsdWUgPSB0aGlzLmdldFZhbHVlKCdnb2xkJylcbiAgICAgICAgbGV0IGN1cnJlbnRHb2xkID0gZ29sZFZhbHVlLmdldFZhbHVlKCk7XG4gICAgICAgIGN1cnJlbnRHb2xkID0gY3VycmVudEdvbGQqTWF0aC5wb3coMTAsZXhwb25lbnQpO1xuICAgICAgICBnb2xkVmFsdWUuc2V0VmFsdWUoY3VycmVudEdvbGQpO1xuICAgICAgICB0aGlzLnJlZHJhd1ZhbHVlKCdnb2xkJylcbiAgICB9XG4gICAgcmVzZXRHb2xkICgpIHtcbiAgICAgICAgdGhpcy5nZXRWYWx1ZSgnZ29sZCcpLnNldFZhbHVlKDEwMCk7XG4gICAgICAgIHRoaXMucmVkcmF3VmFsdWUoJ2dvbGQnKVxuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcbiIsImxldCBfR2FtZSA9IHJlcXVpcmUoXCIuL2dhbWVcIik7XG53aW5kb3cuZ2FtZSA9IG5ldyBfR2FtZSgpO1xuIiwibGV0IF9JSUYgPSByZXF1aXJlKFwiLi4vSUlGL21haW5cIik7XG5sZXQgX3R4dCA9IF9JSUYuaHRtbC5sb2NhbGl6ZWRUZXh0O1xuXG5jbGFzcyBWaWV3IGV4dGVuZHMgX0lJRi5WaWV3IHtcbiAgICBjb25zdHJ1Y3RvciAocGFyYW1zKSB7XG4gICAgICAgIC8vIGluIHRoaXMgZXhhbXBsZSwgd2Ugd2lsbCB1c2UgYSBjdXN0b20gVFBMXG4gICAgICAgIHBhcmFtcy5jdXN0b21UcGxzID0ge1xuICAgICAgICAgICAgY29udHJvbCA6ICdFeGFtcGxlL3RwbC9jb250cm9sLnRwbCcsXG4gICAgICAgICAgICBtb25pdG9yIDogJ0V4YW1wbGUvdHBsL21vbml0b3IudHBsJyxcbiAgICAgICAgfVxuICAgICAgICAvLyB5b3UgY2FuIGFsc28gZGVmaW5lIHRwbCBkdXJpbmcgcnVudGltZSB3aXRoIDpcbiAgICAgICAgLy8gX0lJRi5odG1sLmRlZmluZVRwbCgnY29udHJvbCcsJ0V4YW1wbGUvdHBsL2NvbnRyb2wudHBsJyk7XG5cbiAgICAgICAgLy8gd2UgdGhlbiB3aWxsIHVzZSB0aGF0IGNvbXBvbmVudCBmb3IgMiBjb250cm9sc1xuICAgICAgICBwYXJhbXMuY29tcG9uZW50cyA9IHtcbiAgICAgICAgICAgIGFkZEdvbGQgOiB7XG4gICAgICAgICAgICAgICAgdHBsIDogJ2NvbnRyb2wnLFxuICAgICAgICAgICAgICAgIHRwbEJpbmRpbmdzIDoge1xuICAgICAgICAgICAgICAgICAgICBvbmNsaWNrIDogJ2dhbWUuYWRkR29sZCgxMCknLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0IDogX3R4dChcInRlc3Rfb3V0cHV0PmNvbnRyb2xzPmFkZEdvbGRcIiksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhbmNob3IgOiAnYWRkR29sZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbXVsdGlwbHlHb2xkIDoge1xuICAgICAgICAgICAgICAgIHRwbCA6ICdjb250cm9sJyxcbiAgICAgICAgICAgICAgICB0cGxCaW5kaW5ncyA6IHtcbiAgICAgICAgICAgICAgICAgICAgb25jbGljayA6ICdnYW1lLm11bHRHb2xkKDEpJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA6IF90eHQoXCJ0ZXN0X291dHB1dD5jb250cm9scz5tdWx0R29sZFwiKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFuY2hvciA6ICdtdWx0R29sZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzZXRHb2xkIDoge1xuICAgICAgICAgICAgICAgIHRwbCA6ICdjb250cm9sJyxcbiAgICAgICAgICAgICAgICB0cGxCaW5kaW5ncyA6IHtcbiAgICAgICAgICAgICAgICAgICAgb25jbGljayA6ICdnYW1lLnJlc2V0R29sZCgpJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA6IF90eHQoXCJ0ZXN0X291dHB1dD5jb250cm9scz5yZXNldEdvbGRcIiksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhbmNob3IgOiAncmVzZXRHb2xkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzYXZlIDoge1xuICAgICAgICAgICAgICAgIHRwbCA6ICdjb250cm9sJyxcbiAgICAgICAgICAgICAgICB0cGxCaW5kaW5ncyA6IHtcbiAgICAgICAgICAgICAgICAgICAgb25jbGljayA6ICdnYW1lLnNhdmUoKScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQgOiBfdHh0KFwidGVzdF9vdXRwdXQ+Y29udHJvbHM+c2F2ZVwiKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFuY2hvciA6ICdzYXZlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsb2FkIDoge1xuICAgICAgICAgICAgICAgIHRwbCA6ICdjb250cm9sJyxcbiAgICAgICAgICAgICAgICB0cGxCaW5kaW5ncyA6IHtcbiAgICAgICAgICAgICAgICAgICAgb25jbGljayA6ICdnYW1lLmxvYWQoKScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQgOiBfdHh0KFwidGVzdF9vdXRwdXQ+Y29udHJvbHM+bG9hZFwiKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFuY2hvciA6ICdsb2FkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbGVhclNhdmUgOiB7XG4gICAgICAgICAgICAgICAgdHBsIDogJ2NvbnRyb2wnLFxuICAgICAgICAgICAgICAgIHRwbEJpbmRpbmdzIDoge1xuICAgICAgICAgICAgICAgICAgICBvbmNsaWNrIDogJ2dhbWUuY2xlYXJTYXZlKCknLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0IDogX3R4dChcInRlc3Rfb3V0cHV0PmNvbnRyb2xzPmNsZWFyU2F2ZVwiKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFuY2hvciA6ICdjbGVhclNhdmUnLFxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc3RhcnRUaW1lIDoge1xuICAgICAgICAgICAgICAgIHRwbCA6ICdjb250cm9sJyxcbiAgICAgICAgICAgICAgICB0cGxCaW5kaW5ncyA6IHtcbiAgICAgICAgICAgICAgICAgICAgb25jbGljayA6ICdnYW1lLnVucGF1c2UoKScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQgOiBfdHh0KFwidGVzdF9vdXRwdXQ+Y29udHJvbHM+dW5wYXVzZVwiKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFuY2hvciA6ICd1bnBhdXNlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdG9wVGltZSA6IHtcbiAgICAgICAgICAgICAgICB0cGwgOiAnY29udHJvbCcsXG4gICAgICAgICAgICAgICAgdHBsQmluZGluZ3MgOiB7XG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2sgOiAnZ2FtZS5wYXVzZSgpJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA6IF90eHQoXCJ0ZXN0X291dHB1dD5jb250cm9scz5wYXVzZVwiKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFuY2hvciA6ICdwYXVzZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGljayA6IHtcbiAgICAgICAgICAgICAgICB0cGwgOiAnY29udHJvbCcsXG4gICAgICAgICAgICAgICAgdHBsQmluZGluZ3MgOiB7XG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2sgOiAnZ2FtZS50aWNrKCknLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0IDogX3R4dChcInRlc3Rfb3V0cHV0PmNvbnRyb2xzPnRpY2tcIiksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhbmNob3IgOiAndGljaycsXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnb2xkRGlzcGxheSA6IHtcbiAgICAgICAgICAgICAgICB0cGwgOiAnbW9uaXRvcicsXG4gICAgICAgICAgICAgICAgdHBsQmluZGluZ3MgOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsIDogX3R4dChcInRlc3Rfb3V0cHV0PnJlc291cmNlPmdvbGQ+bGFiZWxcIiksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlIDogJycsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlSWQgOiAnZ29sZFZhbHVlRGlzcGxheScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhbmNob3IgOiAnZ29sZERpc3BsYXknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdvbGRWYWx1ZURpc3BsYXkgOiB7XG4gICAgICAgICAgICAgICAgdHBsIDogJ3VwZGF0ZWRWYWx1ZScsXG4gICAgICAgICAgICAgICAgdHBsQmluZGluZ3MgOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkIDogJ2dvbGREaXNwbGF5X3ZhbHVlJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsIDogJycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhbmNob3IgOiAnZ29sZFZhbHVlRGlzcGxheScsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICAgIHN1cGVyKHBhcmFtcylcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XG4iLCJsZXQgZGVidWcgPSB0cnVlO1xuXG5sZXQgaW5uZXJQcmVjaXNpb24gPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUi50b0V4cG9uZW50aWFsKCkuc3BsaXQoXCJlK1wiKVsxXSAtMTsgLy8gdXN1YWxseSAxNFxuXG5sZXQgX3ZhbHVlID0gbmV3IFdlYWtNYXAoKTtcblxuY2xhc3MgQmlnTnVtYmVyIHtcbiAgICBjb25zdHJ1Y3RvciAoaW5pdGlhbFZhbHVlLGRpc3BsYXlQcmVjaXNpb24pIHtcbiAgICAgICAgbGV0IHByZWNpc2VWYWx1ZSA9IGluaXRpYWxWYWx1ZS50b0V4cG9uZW50aWFsKCkuc3BsaXQoJ2UnKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5X21vZGUgPSAndG9TaG9ydFN1ZmZpeCc7XG4gICAgICAgIGxldCBkYXRhcyA9IHtcbiAgICAgICAgICAgIHByZWNpc2VWYWx1ZSA6IE1hdGguZmxvb3IocHJlY2lzZVZhbHVlWzBdKk1hdGgucG93KDEwLGlubmVyUHJlY2lzaW9uLTEpKSxcbiAgICAgICAgICAgIGV4cG9uZW50IDogKHByZWNpc2VWYWx1ZVsxXSkqMSAtaW5uZXJQcmVjaXNpb24rMSxcbiAgICAgICAgICAgIHByZWNpc2lvbiA6IGRpc3BsYXlQcmVjaXNpb24sXG4gICAgICAgIH07XG4gICAgICAgIF92YWx1ZS5zZXQodGhpcyxkYXRhcylcbiAgICB9XG4gICAgc2V0VmFsdWUgKGluaXRpYWxWYWx1ZSkge1xuICAgICAgICBsZXQgcHJlY2lzZVZhbHVlID0gaW5pdGlhbFZhbHVlLnRvRXhwb25lbnRpYWwoKS5zcGxpdCgnZScpO1xuICAgICAgICBsZXQgdmFsdWUgPSBfdmFsdWUuZ2V0KHRoaXMpO1xuICAgICAgICB2YWx1ZS5wcmVjaXNlVmFsdWUgPSBNYXRoLmZsb29yKHByZWNpc2VWYWx1ZVswXSpNYXRoLnBvdygxMCxpbm5lclByZWNpc2lvbi0xKSk7XG4gICAgICAgIHZhbHVlLmV4cG9uZW50ID0gKHByZWNpc2VWYWx1ZVsxXSkqMSAtaW5uZXJQcmVjaXNpb24rMSxcbiAgICAgICAgX3ZhbHVlLnNldCh0aGlzLHZhbHVlKTtcbiAgICB9XG4gICAgc2V0UHJlY2lzaW9uIChwcmVjaXNpb24pIHtcbiAgICAgICAgbGV0IHZhbHVlID0gX3ZhbHVlLmdldCh0aGlzKTtcbiAgICAgICAgdmFsdWUucHJlY2lzaW9uID0gcHJlY2lzaW9uO1xuICAgICAgICBfdmFsdWUuc2V0KHRoaXMsdmFsdWUpO1xuICAgIH1cbiAgICBnZXRWYWx1ZSAoKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IF92YWx1ZS5nZXQodGhpcyk7XG4gICAgICAgIHJldHVybiB2YWx1ZS5wcmVjaXNlVmFsdWUqTWF0aC5wb3coMTAsdmFsdWUuZXhwb25lbnQpO1xuICAgIH1cbiAgICBhZGQgKHRvQWRkKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoKTtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZSArIHRvQWRkO1xuICAgICAgICB0aGlzLnNldFZhbHVlKHZhbHVlKTtcbiAgICB9XG4gICAgdG9TdHIgKCkge1xuICAgICAgICByZXR1cm4gdGhpc1t0aGlzLmRpc3BsYXlfbW9kZV0oKTtcbiAgICB9XG4gICAgdG9TY2llbnRpZmljICgpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gX3ZhbHVlLmdldCh0aGlzKTtcbiAgICAgICAgbGV0IHByZWNpc2VTcGxpdCA9IHZhbHVlLnByZWNpc2VWYWx1ZS50b0V4cG9uZW50aWFsKCkuc3BsaXQoJ2UnKVxuICAgICAgICBsZXQgZGlzcGxheUV4cG9uZW50ID0gcHJlY2lzZVNwbGl0WzFdKjErdmFsdWUuZXhwb25lbnQ7XG4gICAgICAgIGxldCBkaXNwbGF5VmFsdWUgPSAocHJlY2lzZVNwbGl0WzBdKjEpLnRvRml4ZWQodmFsdWUucHJlY2lzaW9uKTtcbiAgICAgICAgcmV0dXJuIGRpc3BsYXlWYWx1ZStcImVcIisoZGlzcGxheUV4cG9uZW50ID4gMCA/ICcrJyA6ICcnKStkaXNwbGF5RXhwb25lbnQ7XG4gICAgfVxuICAgIHRvRW5naW5lZXJpbmcgKCkge1xuICAgICAgICBsZXQgdmFsdWUgPSBfdmFsdWUuZ2V0KHRoaXMpO1xuICAgICAgICBsZXQgcHJlY2lzZVNwbGl0ID0gdmFsdWUucHJlY2lzZVZhbHVlLnRvRXhwb25lbnRpYWwoKS5zcGxpdCgnZScpO1xuICAgICAgICBsZXQgZGlzcGxheUV4cG9uZW50ID0gcHJlY2lzZVNwbGl0WzFdKjErdmFsdWUuZXhwb25lbnQ7XG4gICAgICAgIGxldCBkaXNwbGF5VmFsdWUgPSAocHJlY2lzZVNwbGl0WzBdKjEpO1xuICAgICAgICBsZXQgcmVtb3ZlZEV4cG9uZW50ID0gZGlzcGxheUV4cG9uZW50JTM7XG4gICAgICAgIGRpc3BsYXlFeHBvbmVudCAtPSByZW1vdmVkRXhwb25lbnQ7XG4gICAgICAgIGRpc3BsYXlWYWx1ZSAqPSBNYXRoLnBvdygxMCxyZW1vdmVkRXhwb25lbnQpO1xuICAgICAgICBkaXNwbGF5VmFsdWUgPSBkaXNwbGF5VmFsdWUudG9GaXhlZCh2YWx1ZS5wcmVjaXNpb24pO1xuICAgICAgICByZXR1cm4gZGlzcGxheVZhbHVlK1wiZVwiKyhkaXNwbGF5RXhwb25lbnQgPiAwID8gJysnIDogJycpK2Rpc3BsYXlFeHBvbmVudDtcbiAgICB9XG4gICAgdG9TaG9ydFN1ZmZpeCAoKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IF92YWx1ZS5nZXQodGhpcyk7XG4gICAgICAgIGxldCBwcmVjaXNlU3BsaXQgPSB2YWx1ZS5wcmVjaXNlVmFsdWUudG9FeHBvbmVudGlhbCgpLnNwbGl0KCdlJyk7XG4gICAgICAgIGxldCBkaXNwbGF5RXhwb25lbnQgPSBwcmVjaXNlU3BsaXRbMV0qMSt2YWx1ZS5leHBvbmVudDtcbiAgICAgICAgbGV0IGRpc3BsYXlWYWx1ZSA9IChwcmVjaXNlU3BsaXRbMF0qMSk7XG4gICAgICAgIGxldCByZW1vdmVkRXhwb25lbnQgPSBkaXNwbGF5RXhwb25lbnQlMztcbiAgICAgICAgZGlzcGxheUV4cG9uZW50IC09IHJlbW92ZWRFeHBvbmVudDtcbiAgICAgICAgZGlzcGxheVZhbHVlICo9IE1hdGgucG93KDEwLHJlbW92ZWRFeHBvbmVudCk7XG4gICAgICAgIGRpc3BsYXlWYWx1ZSA9IGRpc3BsYXlWYWx1ZS50b0ZpeGVkKHZhbHVlLnByZWNpc2lvbik7XG4gICAgICAgIGxldCBzdWZmaXggPSBcImVcIisoZGlzcGxheUV4cG9uZW50ID4gMCA/ICcrJyA6ICcnKStkaXNwbGF5RXhwb25lbnRcbiAgICAgICAgc3dpdGNoIChkaXNwbGF5RXhwb25lbnQvMykge1xuICAgICAgICAgICAgY2FzZSAtOCA6IHN1ZmZpeCA9ICd5JzticmVhaztcbiAgICAgICAgICAgIGNhc2UgLTcgOiBzdWZmaXggPSAneic7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIC02IDogc3VmZml4ID0gJ2EnO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAtNSA6IHN1ZmZpeCA9ICdmJzticmVhaztcbiAgICAgICAgICAgIGNhc2UgLTQgOiBzdWZmaXggPSAncCc7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIC0zIDogc3VmZml4ID0gJ24nO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAtMiA6IHN1ZmZpeCA9ICfCtSc7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIC0xIDogc3VmZml4ID0gJ20nO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAwIDogc3VmZml4ID0gJyc7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDEgOiBzdWZmaXggPSAnayc7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDIgOiBzdWZmaXggPSAnTSc7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDMgOiBzdWZmaXggPSAnRyc7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQgOiBzdWZmaXggPSAnVCc7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDUgOiBzdWZmaXggPSAnUCc7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDYgOiBzdWZmaXggPSAnRSc7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDcgOiBzdWZmaXggPSAnWic7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDggOiBzdWZmaXggPSAnWSc7YnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OmJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaXNwbGF5VmFsdWUrc3VmZml4O1xuICAgIH1cbiAgICB0b0xvbmdTdWZmaXggKCkge1xuICAgICAgICBsZXQgdmFsdWUgPSBfdmFsdWUuZ2V0KHRoaXMpO1xuICAgICAgICBsZXQgcHJlY2lzZVNwbGl0ID0gdmFsdWUucHJlY2lzZVZhbHVlLnRvRXhwb25lbnRpYWwoKS5zcGxpdCgnZScpO1xuICAgICAgICBsZXQgZGlzcGxheUV4cG9uZW50ID0gcHJlY2lzZVNwbGl0WzFdKjErdmFsdWUuZXhwb25lbnQ7XG4gICAgICAgIGxldCBkaXNwbGF5VmFsdWUgPSAocHJlY2lzZVNwbGl0WzBdKjEpO1xuICAgICAgICBsZXQgcmVtb3ZlZEV4cG9uZW50ID0gZGlzcGxheUV4cG9uZW50JTM7XG4gICAgICAgIGRpc3BsYXlFeHBvbmVudCAtPSByZW1vdmVkRXhwb25lbnQ7XG4gICAgICAgIGRpc3BsYXlWYWx1ZSAqPSBNYXRoLnBvdygxMCxyZW1vdmVkRXhwb25lbnQpO1xuICAgICAgICBkaXNwbGF5VmFsdWUgPSBkaXNwbGF5VmFsdWUudG9GaXhlZCh2YWx1ZS5wcmVjaXNpb24pO1xuICAgICAgICBsZXQgc3VmZml4ID0gXCJlXCIrKGRpc3BsYXlFeHBvbmVudCA+IDAgPyAnKycgOiAnJykrZGlzcGxheUV4cG9uZW50XG4gICAgICAgIHN3aXRjaCAoZGlzcGxheUV4cG9uZW50LzMpIHtcbiAgICAgICAgICAgIGNhc2UgLTggOiBzdWZmaXggPSAneW9jdG8nO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAtNyA6IHN1ZmZpeCA9ICd6ZXB0byc7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIC02IDogc3VmZml4ID0gJ2F0dG8nO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAtNSA6IHN1ZmZpeCA9ICdmZW10byc7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIC00IDogc3VmZml4ID0gJ3BpY28nO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAtMyA6IHN1ZmZpeCA9ICduYW5vJzticmVhaztcbiAgICAgICAgICAgIGNhc2UgLTIgOiBzdWZmaXggPSAnbWljcm8nO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAtMSA6IHN1ZmZpeCA9ICdtaWxsaSc7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDAgOiBzdWZmaXggPSAnJzticmVhaztcbiAgICAgICAgICAgIGNhc2UgMSA6IHN1ZmZpeCA9ICdraWxvJzticmVhaztcbiAgICAgICAgICAgIGNhc2UgMiA6IHN1ZmZpeCA9ICdtZWdhJzticmVhaztcbiAgICAgICAgICAgIGNhc2UgMyA6IHN1ZmZpeCA9ICdnaWdhJzticmVhaztcbiAgICAgICAgICAgIGNhc2UgNCA6IHN1ZmZpeCA9ICd0ZXJhJzticmVhaztcbiAgICAgICAgICAgIGNhc2UgNSA6IHN1ZmZpeCA9ICdwZXRhJzticmVhaztcbiAgICAgICAgICAgIGNhc2UgNiA6IHN1ZmZpeCA9ICdleGEnO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSA3IDogc3VmZml4ID0gJ3pldHRhJzticmVhaztcbiAgICAgICAgICAgIGNhc2UgOCA6IHN1ZmZpeCA9ICd5b3R0YSc7YnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OmJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaXNwbGF5VmFsdWUrc3VmZml4O1xuICAgIH1cbiAgICB0b0pTT04gKCkge1xuICAgICAgICByZXR1cm4gX3ZhbHVlLmdldCh0aGlzKTtcbiAgICB9XG4gICAgZnJvbUpTT04oanNvbikge1xuICAgICAgICBfdmFsdWUuc2V0KHRoaXMsanNvbik7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJpZ051bWJlcjtcbiIsImxldCBkZWJ1ZyA9IHRydWU7XG5sZXQgU2F2ZWRWYWx1ZSA9IHJlcXVpcmUoJy4vc2F2ZWRWYWx1ZScpO1xuXG5jbGFzcyBHYW1lVmFsdWUgZXh0ZW5kcyBTYXZlZFZhbHVlIHtcbiAgICBjb25zdHJ1Y3RvciAoY29uZmlnKSB7XG4gICAgICAgIGlmIChkZWJ1ZylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2FtZVZhbHVlIDogY3JlYXRpbmcgYSBuZXcgdmFsdWVcIixjb25maWcpXG4gICAgICAgIHN1cGVyKGNvbmZpZy5kYXRhKTtcbiAgICAgICAgdGhpcy5pZCA9IGNvbmZpZy5pZDtcbiAgICAgICAgdGhpcy5jb21wb25lbnQgPSBjb25maWcuY29tcG9uZW50O1xuICAgIH1cbiAgICB0b1N0cigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWVPYmplY3QoKS50b1N0cigpO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gR2FtZVZhbHVlO1xuIiwibGV0IGRlYnVnID0gdHJ1ZTtcblxubGV0IGRhdGFzID0gbmV3IFdlYWtNYXAoKTtcblxuY2xhc3MgU2F2ZWRWYWx1ZSB7XG4gICAgY29uc3RydWN0b3IgKGRhdGEpIHtcbiAgICAgICAgaWYgKGRlYnVnKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTYXZlZFZhbHVlIDogY3JlYXRpbmcgYSBuZXcgdmFsdWVcIixkYXRhKTtcbiAgICAgICAgZGF0YXMuc2V0KHRoaXMsZGF0YSk7XG4gICAgfVxuICAgIGdldFZhbHVlT2JqZWN0KCkge1xuICAgICAgICByZXR1cm4gZGF0YXMuZ2V0KHRoaXMpO1xuICAgIH1cbiAgICB0b0pTT04gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZU9iamVjdCgpLnRvSlNPTigpO1xuICAgIH1cbiAgICBmcm9tSlNPTihqc29uKSB7XG4gICAgICAgIHRoaXMuZ2V0VmFsdWVPYmplY3QoKS5mcm9tSlNPTihqc29uKTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IFNhdmVkVmFsdWU7XG4iLCJsZXQgZGVidWcgPSB0cnVlO1xubGV0IGxvY2FsaXphdGlvbiA9IHJlcXVpcmUoJy4vbG9jYWxpemF0aW9uJyk7XG5sZXQgdmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xubGV0IEdhbWVWYWx1ZSA9IHJlcXVpcmUoJy4vZGF0YVN0cnVjdC9nYW1ldmFsdWUnKTtcbmxldCBTYXZlID0gcmVxdWlyZSgnLi9zYXZlJyk7XG5sZXQgVGltZSA9IHJlcXVpcmUoJy4vdGltZScpO1xuXG5sZXQgX3ZpZXcgPSBuZXcgV2Vha01hcCgpO1xubGV0IF92YWx1ZXMgPSBuZXcgV2Vha01hcCgpO1xubGV0IF9zYXZlID0gbmV3IFdlYWtNYXAoKTtcbmxldCBfdGltZSA9IG5ldyBXZWFrTWFwKCk7XG5cbmNsYXNzIEdhbWUge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuXG4gICAgICAgIGlmIChkZWJ1ZylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2FtZSA6IG5ldyBnYW1lXCIsY29uZmlnKVxuXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCEodHlwZW9mKGNvbmZpZy5saWJOYW1lKSA9PT0gXCJ1bmRlZmluZWRcIikpIHtcbiAgICAgICAgICAgIGlmICgodHlwZW9mKGNvbmZpZy5sYW5ncykgIT0gXCJ1bmRlZmluZWRcIikgJiYgKGNvbmZpZy5sYW5ncy5sZW5ndGggPiAwKSkge1xuICAgICAgICAgICAgICAgIGxvY2FsaXphdGlvbi5zZXRMYW5nKGNvbmZpZy5sYW5nc1swXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2NhbGl6YXRpb24ubG9hZChjb25maWcubGliTmFtZSxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoYXQubG9jYWxpemUoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0eXBlb2YoY29uZmlnLnZpZXdDbGFzcykgPT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICBjb25maWcudmlld0NsYXNzID0gdmlldy52aWV3Q2xhc3M7XG4gICAgICAgIGxldCB2aWV3ID0gbmV3IGNvbmZpZy52aWV3Q2xhc3Moe1xuICAgICAgICAgICAgb25Jbml0aWFsaXplZCA6IHRoaXMub25WaWV3SW5pdGlhbGl6ZWQsXG4gICAgICAgICAgICBnYW1lT2JqIDogdGhpcyxcbiAgICAgICAgfSlcbiAgICAgICAgX3ZpZXcuc2V0KHRoaXMsdmlldyk7XG5cbiAgICAgICAgX3ZhbHVlcy5zZXQodGhpcyx7fSk7XG4gICAgICAgIGlmICghKHR5cGVvZihjb25maWcuZ2FtZVZhbHVlcykgPT09IFwidW5kZWZpbmVkXCIpKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhjb25maWcuZ2FtZVZhbHVlcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnJlZ2lzdGVyVmFsdWUoa2V5LGNvbmZpZy5nYW1lVmFsdWVzW2tleV0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5yZWRyYXdWYWx1ZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKHR5cGVvZihjb25maWcudGlja3MpID09PSBcInVuZGVmaW5lZFwiKSkge1xuICAgICAgICAgICAgX3RpbWUuc2V0KHRoaXMsbmV3IFRpbWUodGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgX3NhdmUuc2V0KHRoaXMsbmV3IFNhdmUoY29uZmlnLnNhdmVLZXksdGhpcykpO1xuICAgIH1cbiAgICAvLyB2YWx1ZXMgbWFuYWdlbWVudFxuICAgIHJlZHJhd1ZhbHVlKGtleSkge1xuICAgICAgICBfdmlldy5nZXQodGhpcykucmVkcmF3Q29tcG9uZW50KF92YWx1ZXMuZ2V0KHRoaXMpW2tleV0pO1xuICAgIH1cbiAgICByZWRyYXdWYWx1ZXMoKSB7XG4gICAgICAgIGlmICh0aGlzLmdldFZpZXcoKS5pbml0aWFsaXplZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCB2YWx1ZXMgPSBfdmFsdWVzLmdldCh0aGlzKTtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICBPYmplY3Qua2V5cyh2YWx1ZXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICBfdmlldy5nZXQodGhhdCkucmVkcmF3Q29tcG9uZW50KHZhbHVlc1trZXldKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlZ2lzdGVyVmFsdWUgKGtleSxjb25maWcpIHtcbiAgICAgICAgbGV0IHZhbHVlcyA9IF92YWx1ZXMuZ2V0KHRoaXMpO1xuICAgICAgICBpZiAoISh0eXBlb2YodmFsdWVzW2tleV0pID09PSBcInVuZGVmaW5lZFwiKSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdHYW1lIDogdHJ5aW5nIHRvIGNyZWF0ZSBhIHJlZ2lzdGVyZWQgdmFsdWUgd2l0aCBhbiBhbHJlYWR5IHRha2VuIGlkZW50aWZpZXIgOicsa2V5KVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbmZpZy5pZCA9IGtleTtcbiAgICAgICAgdmFsdWVzW2tleV0gPSBuZXcgR2FtZVZhbHVlKGNvbmZpZyk7XG4gICAgICAgIF92YWx1ZXMuc2V0KHRoaXMsdmFsdWVzKTtcbiAgICB9XG4gICAgbGlzdFZhbHVlcygpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKF92YWx1ZXMuZ2V0KHRoaXMpKTtcbiAgICB9XG4gICAgZ2V0VmFsdWUoa2V5KSB7XG4gICAgICAgIHJldHVybiBfdmFsdWVzLmdldCh0aGlzKVtrZXldLmdldFZhbHVlT2JqZWN0KCk7XG4gICAgfVxuICAgIC8vIHZpZXcgbWFuYWdlbWVudFxuICAgIGxvY2FsaXplKCkge1xuICAgICAgICBpZiAoISh0eXBlb2YodGhpcy5jb25maWcubGliTmFtZSkgPT09IFwidW5kZWZpbmVkXCIpKVxuICAgICAgICAgICAgbG9jYWxpemF0aW9uLnBhcnNlUGFnZSh0aGlzLmNvbmZpZy5saWJOYW1lKTtcbiAgICB9XG4gICAgb25WaWV3SW5pdGlhbGl6ZWQgKCkge1xuICAgICAgICBpZiAoZGVidWcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdhbWUgOiBWaWV3IGluaXRpYWxpemVkXCIsdGhpcylcbiAgICAgICAgaWYgKCEodHlwZW9mKHRoaXMuY29uZmlnLmxpYk5hbWUpID09PSBcInVuZGVmaW5lZFwiKSkgIC8vIGlmIHRoZSBnYW1lIGlzIGxvY2FsaXplZCwgd2UgcGFyc2UgdGhlIHBhZ2Ugbm93IHRoYXQgdGhlIHZpZXcgaXMgYnVpbHQuIFRoZSBwYWdlIGlzIGFscmVhZHkgcGFyc2VkIGFmdGVyIHRoZSBsaWIgaXMgbG9hZGVkIGJ1dCB3ZSBwcmVwYXJlZCB0aGUgdGV4dHMgYmVmb3JlIHRoYXRcbiAgICAgICAgICAgIGxvY2FsaXphdGlvbi5wYXJzZVBhZ2UodGhpcy5jb25maWcubGliTmFtZSk7XG4gICAgICAgIHRoaXMucmVkcmF3VmFsdWVzKCk7XG4gICAgICAgIHRoaXMubG9jYWxpemUoKTtcbiAgICB9XG4gICAgZ2V0VmlldyAoKSB7XG4gICAgICAgIHJldHVybiBfdmlldy5nZXQodGhpcyk7XG4gICAgfVxuICAgIGRyYXcgKCkge1xuICAgICAgICBfdmlldy5nZXQodGhpcykuZHJhdygpO1xuICAgIH1cbiAgICB1cGRhdGUgKHRhcmdldCkge1xuICAgICAgICBfdmlldy5nZXQodGhpcykudXBkYXRlKHRhcmdldCk7XG4gICAgfVxuICAgIC8vc2F2ZSBtYW5hZ2VtZW50XG4gICAgbG9hZCAoKSB7XG4gICAgICAgIF9zYXZlLmdldCh0aGlzKS5sb2FkKCk7XG4gICAgICAgIHRoaXMucmVkcmF3VmFsdWVzKCk7XG4gICAgfVxuICAgIHNhdmUgKCkge1xuICAgICAgICBfc2F2ZS5nZXQodGhpcykuc2F2ZSgpO1xuICAgIH1cbiAgICBjbGVhclNhdmUgKCkge1xuICAgICAgICBfc2F2ZS5nZXQodGhpcykuY2xlYXJTYXZlKCk7XG4gICAgfVxuICAgIC8vdGltZSBtYW5hZ2VtZW50XG4gICAgZ2V0VGlja2VyKCkge1xuICAgICAgICBpZiAodGhpcy5jb25maWcudGlja3MpXG4gICAgICAgICAgICByZXR1cm4gX3RpbWUuZ2V0KHRoaXMpO1xuICAgIH1cbiAgICB1bnBhdXNlICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnRpY2tzKVxuICAgICAgICAgICAgX3RpbWUuZ2V0KHRoaXMpLnVucGF1c2UoKTtcbiAgICB9XG4gICAgcGF1c2UgKCkge1xuICAgICAgICBpZiAodGhpcy5jb25maWcudGlja3MpXG4gICAgICAgICAgICBfdGltZS5nZXQodGhpcykucGF1c2UoKTtcbiAgICB9XG4gICAgcmVzdGFydCAoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy50aWNrcylcbiAgICAgICAgICAgIF90aW1lLmdldCh0aGlzKS5yZXN0YXJ0KCk7XG4gICAgfVxuICAgIHRpY2sgKCkge1xuICAgICAgICBpZiAodGhpcy5jb25maWcudGlja3MpXG4gICAgICAgICAgICBfdGltZS5nZXQodGhpcykudGljaygpO1xuICAgIH1cbiAgICBwcm9jZXNzVGlja3MgKHRpY2tDb3VudCkge1xuICAgICAgICBpZihkZWJ1ZylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2FtZSA6IHByb2Nlc3NpbmcgdGlja3MsIHRpY2tDb3VudCA6XCIsdGlja0NvdW50KTtcblxuXG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xuIiwibGV0IGRlYnVnID0gdHJ1ZTtcbmxldCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5sZXQgbG9jYWxpemF0aW9uID0gcmVxdWlyZSgnLi9sb2NhbGl6YXRpb24nKTtcblxuY2xhc3MgVHBsIHtcbiAgICBjb25zdHJ1Y3RvciAodHBsU3RyKSB7XG4gICAgICAgIHRoaXMuc3RyID0gdHBsU3RyO1xuICAgICAgICB0aGlzLmtleXMgPSBbXTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSB7fTtcbiAgICAgICAgbGV0IG1hdGNoID0gZmFsc2U7XG4gICAgICAgIHdoaWxlIChtYXRjaCA9IHRwbFN0ci5tYXRjaCgoL3t7KFthLXpdKyl9fS8pKSkge1xuICAgICAgICAgICAgdGhpcy5rZXlzLnB1c2gobWF0Y2hbMV0pO1xuICAgICAgICAgICAgdHBsU3RyID0gdHBsU3RyLnN1YnN0cihtYXRjaC5pbmRleCArIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldCAoa2V5LHZhbCkge1xuICAgICAgICB0aGlzLnZhbHVlc1trZXldID0gdmFsO1xuICAgIH1cbiAgICBnZXRIdG1sICgpIHtcbiAgICAgICAgbGV0IGh0bWwgPSB0aGlzLnN0cjtcbiAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnZhbHVlcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoXCJ7e1wiK2tleStcIn19XCIsdmFsdWVzW2tleV0pO1xuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG59XG5sZXQgdHBscyA9IHtcbiAgICB1cGRhdGVkVmFsdWUgOiBmcy5yZWFkRmlsZVN5bmMoX19kaXJuYW1lICsgXCIvaHRtbC91cGRhdGVkVmFsdWUudHBsXCIsJ3V0ZjgnKSxcbiAgICBsb2NhbGl6ZWRUZXh0IDooZnMucmVhZEZpbGVTeW5jKF9fZGlybmFtZSArIFwiL2h0bWwvbG9jYWxpemVkVGV4dC50cGxcIiwndXRmOCcpKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd7e2xvY0NsYXNzfX0nLGxvY2FsaXphdGlvbi5jb25maWcuY2xhc3MpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoJ3t7bG9jRGF0YUtleX19Jyxsb2NhbGl6YXRpb24uY29uZmlnLmRhdGFLZXkpLFxufVxuXG5mdW5jdGlvbiBsb2FkVHBsIChwYXRoLGNhbGxiYWNrKSB7XG4gICAgbGV0IGRhdGEgPSBmYWxzZTtcblxuICAgIGZldGNoKHBhdGgpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLnRleHQoKSlcbiAgICAgICAgLnRoZW4oX2RhdGEgPT4ge1xuICAgICAgICAgICAgaWYgKGRlYnVnKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaHRtbCA6IExvYWRlZCB0cGxcIixwYXRoLF9kYXRhKTtcbiAgICAgICAgICAgIGRhdGEgPSBfZGF0YTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJodG1sIDogRXJyb3Igd2hpbGUgbG9hZGluZyBhIHRwbCA6IFwiLGVycm9yLm1lc3NhZ2UscGF0aCk7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKCgpPT57XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsZGF0YSlcbiAgICAgICAgfSk7XG59XG5mdW5jdGlvbiBkZWZpbmVUcGwgKHRwbEtleSx0cGxQYXRoLGNhbGxiYWNrLGN0eCkge1xuICAgIGlmICh0eXBlb2YoY2FsbGJhY2spID09PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICBjYWxsYmFjayA9ICgoKT0+e30pO1xuICAgIGxvYWRUcGwodHBsUGF0aCxmdW5jdGlvbih0cGxTdHIpIHtcbiAgICAgICAgdHBsc1t0cGxLZXldID0gdHBsU3RyO1xuICAgICAgICBjYWxsYmFjay5jYWxsKGN0eCk7XG4gICAgfSlcbn1cbmZ1bmN0aW9uIGdldFRwbCAodHBsLGRhdGFzKSB7XG4gICAgaWYodHlwZW9mKHRwbHNbdHBsXSkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYoZGVidWcpXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJodG1sIDogVHJ5aW5nIHRvIHVzZSBhIHRwbCB0aGF0IGlzbid0IGRlY2xhcmVkLCBvciBsb2FkZWQgeWV0IDpcIix0cGwpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRwbHNbdHBsXSA9PT0gZmFsc2UpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAodHlwZW9mKGRhdGFzKSA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgcmV0dXJuIG5ldyBUcGwodHBsc1t0cGxdKTtcblxuICAgIHRwbCA9IG5ldyBUcGwodHBsc1t0cGxdKTtcbiAgICBPYmplY3Qua2V5cyhkYXRhcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgdHBsLnNldChrZXksZGF0YXNba2V5XSlcbiAgICB9KTtcbiAgICByZXR1cm4gdHBsLmdldEh0bWwoKTtcbn1cbmZ1bmN0aW9uIGxvY2FsaXplZFRleHQgKHBhdGgsbGliKSB7XG4gICAgcmV0dXJuIGdldFRwbCgnbG9jYWxpemVkVGV4dCcse1xuICAgIFx0cGF0aCA6IHBhdGgsXG4gICAgICAgIHRleHQgOiBsb2NhbGl6YXRpb24uZ2V0VGV4dChwYXRoLGxpYiksXG4gICAgfSk7XG59XG5leHBvcnRzLmdldFRwbCA9IGdldFRwbDtcbmV4cG9ydHMuZGVmaW5lVHBsID0gZGVmaW5lVHBsO1xuZXhwb3J0cy5sb2NhbGl6ZWRUZXh0ID0gbG9jYWxpemVkVGV4dDtcbiIsImxldCBkZWJ1ZyA9IHRydWU7XG5sZXQgZGVmYXVsdExhbmcgPSAnZW4tRU4nO1xubGV0IHN1cHBvcnRlZExhbmcgPSAnZW4tRU4nO1xuXG5sZXQgaHRtbFNlbGVjdG9yID0gJ2xvYyc7IC8vIGNsYXNzIHRvIGFkZCB0byB0aGUgaHRtbCB0YWcgdG8gbG9jYWxpemVcbmxldCBodG1sRGF0YUtleSA9ICdsayc7IC8vIGRhdGEga2V5IHRvIHVzZSB0byBzdG9yZSB0aGUgcGF0aCB0byB0ZXh0XG5cbmxldCBrZXkgPSAnbGFuZyc7IC8vIGtleSB1c2VkIGluIHRoZSBnZXQgcGFyYW1ldGVyIG9mIHRoZSBVUkwgdG8gc2V0IGEgc3BlY2lmaWMgbGFuZ3VhZ2VcblxubGV0IGN1cnJlbnRMYW5nID0gdW5kZWZpbmVkO1xubGV0IGN1cnJlbnRMaWIgPSB1bmRlZmluZWQ7XG5sZXQgbGlicyA9IHt9O1xubGV0IGxpc3RlbmVycyA9IHt9O1xuXG5mdW5jdGlvbiBzZXRMYW5nIChsYW5nKSB7XG4gICAgaWYgKHR5cGVvZihsYW5nKSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBjdXJyZW50TGFuZyA9ICh0eXBlb2YoY3VycmVudExhbmcpID09PSBcInVuZGVmaW5lZFwiKSA/IGRlZmF1bHRMYW5nIDogY3VycmVudExhbmc7XG4gICAgfSBlbHNlIGN1cnJlbnRMYW5nID0gbGFuZztcbn1cblxuZnVuY3Rpb24gc2V0Q3VycmVudExpYiAobGliTmFtZSkge1xuICAgIGN1cnJlbnRMaWIgPSBsaWJOYW1lO1xufVxuXG5mdW5jdGlvbiBmaXJlTGlzdGVuZXJzKGxvYWRlZExpYikge1xuICAgIHdoaWxlICh0b0ZpcmUgPSBsaXN0ZW5lcnNbbG9hZGVkTGliXS5wb3AoKSkge1xuICAgICAgICB0b0ZpcmUuY2FsbCgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbG9hZCAobGliTmFtZSxjYWxsYmFjaykge1xuXG4gICAgLy8gcHJlcGFyaW5nIHRoZSBsYW5nIGFuZCBsaWIgdG8gbG9hZFxuICAgIGxldCBsaWJUb0xvYWQgPSBsaWJOYW1lO1xuICAgIGlmICh0eXBlb2YobGliVG9Mb2FkKSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mKGN1cnJlbnRMaWIpID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTG9jYWxpemF0aW9uIDogVHJ5aW5nIHRvIGxvYWQgWE1MIGZpbGUgd2l0aG91dCBwcm92aWRpbmcgYSBsaWJOYW1lXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxpYlRvTG9hZCA9IGN1cnJlbnRMaWI7XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyhsaWJzKS5sZW5ndGggPT0gMClcbiAgICAgICAgc2V0Q3VycmVudExpYihsaWJUb0xvYWQpO1xuXG4gICAgaWYgKHR5cGVvZihjdXJyZW50TGFuZykgPT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgIHNldExhbmcoKTtcblxuICAgIGxldCBsaWJQYXRoID0gY3VycmVudExhbmcrJy8nK2xpYlRvTG9hZDtcblxuICAgIC8vY2hlY2tpbmcgaWYgdGhlIGxpYiBpcyBsb2FkZWRcbiAgICBpZiAodHlwZW9mKGxpYnNbbGliUGF0aF0pID09PSBcInVuZGVmaW5lZFwiKSB7IC8vIGlmIHRoZSBsaWIgaXNuJ3QgYWxyZWFkeSBsb2FkZWRcbiAgICAgICAgbGlic1tsaWJQYXRoXSA9IGZhbHNlO1xuICAgICAgICBsaXN0ZW5lcnNbbGliUGF0aF0gPSB0eXBlb2YoY2FsbGJhY2spID09PSBcInVuZGVmaW5lZFwiID8gW10gOiBbY2FsbGJhY2tdO1xuICAgICAgICBmZXRjaCgnbGFuZy8nK2xpYlBhdGgrJy54bWwnKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UudGV4dCgpKVxuICAgICAgICAgICAgLnRoZW4oc3RyID0+IChuZXcgd2luZG93LkRPTVBhcnNlcigpKS5wYXJzZUZyb21TdHJpbmcoc3RyLCBcInRleHQveG1sXCIpKVxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgbGlic1tsaWJQYXRoXSA9IFhNTHRvSlNPTihkYXRhKS5ib2R5O1xuICAgICAgICAgICAgICAgIGlmIChkZWJ1ZylcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2NhbGl6YXRpb24gOiBMb2FkZWQgbGliXCIsbGliUGF0aCxsaWJzW2xpYlBhdGhdKTtcbiAgICAgICAgICAgICAgICBmaXJlTGlzdGVuZXJzKGxpYlBhdGgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkxvY2FsaXphdGlvbiA6IEVycm9yIHdoaWxlIGxvYWRpbmcgdGhlIFhNTDogXCIsZXJyb3IubWVzc2FnZSxsaWJQYXRoKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH0gZWxzZSB7IC8vIGxpYnJhcnkgaXMgYWxyZWFkeSBsb2FkZWRcbiAgICAgICAgaWYgKCEodHlwZW9mKGNhbGxiYWNrKSA9PT0gXCJ1bmRlZmluZWRcIikpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyc1tsaWJQYXRoXS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGlmIChsaWJzW2xpYlBhdGhdKVxuICAgICAgICAgICAgICAgIGZpcmVMaXN0ZW5lcnMobGliUGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkobykge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KG8pID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG5mdW5jdGlvbiBwYXJzZU5vZGUoeG1sTm9kZSwgcmVzdWx0KSB7XG4gICAgaWYgKHhtbE5vZGUubm9kZU5hbWUgPT0gXCIjdGV4dFwiKSB7XG4gICAgICAgIHZhciB2ID0geG1sTm9kZS5ub2RlVmFsdWU7XG4gICAgICAgIGlmICh2LnRyaW0oKSkge1xuICAgICAgICAgICByZXN1bHRbJyN0ZXh0J10gPSB2O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIganNvbk5vZGUgPSB7fTtcbiAgICB2YXIgZXhpc3RpbmcgPSByZXN1bHRbeG1sTm9kZS5ub2RlTmFtZV07XG4gICAgaWYoZXhpc3RpbmcpIHtcbiAgICAgICAgaWYoIWlzQXJyYXkoZXhpc3RpbmcpKSB7XG4gICAgICAgICAgICByZXN1bHRbeG1sTm9kZS5ub2RlTmFtZV0gPSBbZXhpc3RpbmcsIGpzb25Ob2RlXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdFt4bWxOb2RlLm5vZGVOYW1lXS5wdXNoKGpzb25Ob2RlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdFt4bWxOb2RlLm5vZGVOYW1lXSA9IGpzb25Ob2RlO1xuICAgIH1cblxuICAgIGlmKHhtbE5vZGUuYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgbGVuZ3RoID0geG1sTm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDtcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlID0geG1sTm9kZS5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAganNvbk5vZGVbYXR0cmlidXRlLm5vZGVOYW1lXSA9IGF0dHJpYnV0ZS5ub2RlVmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGVuZ3RoID0geG1sTm9kZS5jaGlsZE5vZGVzLmxlbmd0aDtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcGFyc2VOb2RlKHhtbE5vZGUuY2hpbGROb2Rlc1tpXSwganNvbk5vZGUpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gWE1MdG9KU09OICh4bWwpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYoeG1sLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgIHBhcnNlTm9kZSh4bWwuY2hpbGROb2Rlc1swXSwgcmVzdWx0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBnZXRMaWIgKGxpYikge1xuICAgIGlmICh0eXBlb2YobGliKSA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgbGliID0gY3VycmVudExpYjtcbiAgICBsZXQgbGliUGF0aCA9IGN1cnJlbnRMYW5nKycvJytsaWI7XG4gICAgaWYoIWxpYnNbbGliUGF0aF0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gbGlic1tsaWJQYXRoXTtcbn1cblxuZnVuY3Rpb24gZ2V0VGV4dChfcGF0aCxsaWIpIHtcbiAgICBsaWIgPSBnZXRMaWIobGliKTtcbiAgICB0cnkge1xuICAgICAgICBpZiAobGliKSB7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IF9wYXRoLnNwbGl0KFwiPlwiKTtcbiAgICAgICAgICAgIHdoaWxlIChwYXJ0ID0gcGF0aC5zaGlmdCgpKSB7XG4gICAgICAgICAgICAgICAgbGliID0gbGliW3BhcnRdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGxpYlsnI3RleHQnXTtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmIChkZWJ1ZylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9jYWxpemF0aW9uIDogRXJyb3IgcmV0cmlldmluZyB0aGUgdGV4dCBmb3IgdGhlIGtleVwiLF9wYXRoKVxuICAgIH1cbiAgICByZXR1cm4gXCJbXCIrX3BhdGgrXCJdXCI7XG59XG5cbmZ1bmN0aW9uIHBhcnNlUGFnZSAobGliTmFtZSkge1xuICAgIGxldCBlbGVtcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoaHRtbFNlbGVjdG9yKVxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBlbGVtcy5sZW5ndGg7aSsrKSB7XG4gICAgICAgIGxldCBwYXRoID0gZWxlbXNbaV0uYXR0cmlidXRlc1tcImRhdGEtXCIraHRtbERhdGFLZXldLnZhbHVlO1xuICAgICAgICBlbGVtc1tpXS5pbm5lckhUTUwgPSBnZXRUZXh0KHBhdGgsbGliTmFtZSlcbiAgICB9XG5cbn1cblxuZXhwb3J0cy5zZXRMYW5nID0gc2V0TGFuZzsgLy8gdXNlZCB0byBjaGFuZ2UgdGhlIGxhbmd1YWdlXG5leHBvcnRzLnNldExpYiA9IHNldEN1cnJlbnRMaWI7XG5leHBvcnRzLmxvYWQgPSBsb2FkO1xuZXhwb3J0cy5wYXJzZVBhZ2UgPSBwYXJzZVBhZ2U7XG5leHBvcnRzLmdldExpYiA9IGdldExpYjtcbmV4cG9ydHMuZ2V0VGV4dCA9IGdldFRleHQ7XG5leHBvcnRzLmNvbmZpZyA9IHtcbiAgICBjbGFzcyA6IGh0bWxTZWxlY3RvcixcbiAgICBkYXRhS2V5IDogaHRtbERhdGFLZXksXG59XG4iLCJleHBvcnRzLklJRl92ZXJzaW9uID0gJzAuMC4xJztcblxuZXhwb3J0cy5HYW1lID0gcmVxdWlyZSgnLi9nYW1lLmpzJyk7XG5leHBvcnRzLkJpZ051bWJlciA9IHJlcXVpcmUoJy4vZGF0YVN0cnVjdC9iaWdudW1iZXIuanMnKTtcbmV4cG9ydHMuVmlldyA9IHJlcXVpcmUoJy4vdmlldy5qcycpO1xuZXhwb3J0cy5odG1sID0gcmVxdWlyZSgnLi9odG1sLmpzJyk7XG5leHBvcnRzLmxvY2FsaXphdGlvbiA9IHJlcXVpcmUoJy4vbG9jYWxpemF0aW9uLmpzJyk7XG5cbndpbmRvdy5JSUYgPSBleHBvcnRzO1xuIiwibGV0IGRlYnVnID0gdHJ1ZTtcblxubGV0IF9JSUYgPSByZXF1aXJlKFwiLi9tYWluXCIpO1xuXG5jbGFzcyBTYXZlIHtcbiAgICBjb25zdHJ1Y3RvciAoc2F2ZUtleSxnYW1lT2JqKSB7XG4gICAgICAgIHRoaXMuc2F2ZUtleSA9IHNhdmVLZXkrXCJfSUlGU2F2ZVwiO1xuICAgICAgICB0aGlzLmdhbWVPYmogPSBnYW1lT2JqO1xuICAgICAgICBpZiAodGhpcy5oYXNTYXZlRGF0YSgpKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMubmV3U2F2ZSgpO1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBoYXNTYXZlRGF0YSAoKSB7XG4gICAgICAgIHJldHVybiAhKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuc2F2ZUtleSkgPT09IG51bGwpO1xuICAgIH1cbiAgICBjbGVhclNhdmUgKCkge1xuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLnNhdmVLZXkpO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfVxuICAgIG5ld1NhdmUgKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbWV0YSA6IHtcbiAgICAgICAgICAgICAgICBJSUZfdmVyc2lvbiA6IF9JSUYuSUlGX3ZlcnNpb24sXG4gICAgICAgICAgICAgICAgZ2FtZV92ZXJzaW9uIDogdGhpcy5nYW1lT2JqLmNvbmZpZy5nYW1lVmVyc2lvblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZhbHVlcyA6IHt9LFxuICAgICAgICB9XG4gICAgfVxuICAgIHNhdmUoKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhpcy5nYW1lT2JqLmxpc3RWYWx1ZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgdGhhdC5kYXRhLnZhbHVlc1trZXldID0gdGhhdC5nYW1lT2JqLmdldFZhbHVlKGtleSkudG9KU09OKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChkZWJ1ZylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTYXZlIDogc2F2aW5nIGRhdGEgdG8gbG9jYWxzdG9yYWdlJyx0aGlzLmRhdGEpO1xuXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuc2F2ZUtleSxKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGEpKTtcbiAgICB9XG4gICAgbG9hZCgpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICB0aGlzLmRhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuc2F2ZUtleSkpO1xuICAgICAgICB0aGlzLnVwZ3JhZGVTYXZlX0lJRigpO1xuICAgICAgICB0aGlzLnVwZ3JhZGVTYXZlX0dhbWUoKTtcbiAgICAgICAgaWYgKGRlYnVnKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NhdmUgOiBsb2FkaW5nIGRhdGEgZnJvbSBsb2NhbHN0b3JhZ2UnLHRoaXMuZGF0YSk7XG4gICAgICAgIHRoaXMuZ2FtZU9iai5saXN0VmFsdWVzKCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIHRoYXQuZ2FtZU9iai5nZXRWYWx1ZShrZXkpLmZyb21KU09OKHRoYXQuZGF0YS52YWx1ZXNba2V5XSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgIH1cbiAgICB1cGdyYWRlU2F2ZV9JSUYoKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuZGF0YS5tZXRhLklJRl92ZXJzaW9uID09PSBfSUlGLklJRl92ZXJzaW9uKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGlmIChkZWJ1ZylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTYXZlIDogbWlncmF0aW5nIElJRiBzYXZlZERhdGEgZnJvbSAnLHRoaXMuZGF0YS5tZXRhLklJRl92ZXJzaW9uLCd0bycsX0lJRi5JSUZfdmVyc2lvbik7XG5cbiAgICAgICAgc3dpdGNoKHRoaXMuZGF0YS5tZXRhLklJRl92ZXJzaW9uKSB7XG4gICAgICAgICAgICBjYXNlICcwLjAuMScgOiA7Ly8gYWRkIGhlcmUgdGhlIG1pZ3JhdGlvbiBjb2RlIGZvciBzYXZlRGF0YSBmcm9tIDAuMC4xIHRvIHRoZSBuZXh0IHZlcnNpb24uIERvbid0IHB1dCBhIGJyZWFrLCBhbmQgcHV0IHZlcnNpb25zIGluIGNocm9ub2xvZ2ljYWwgb3JkZXIgdG8gdHJpZ2dlciBhbGwgdGhlIHVwZ3JhZGVzIG5lY2Vzc2FyeVxuICAgICAgICAgICAgICAgIC8vIHRoaXMuZGF0YS52YWx1ZXMgPSB0aGlzLmRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAvLyBkZWxldGUodGhpcy5kYXRhLmRhdGEpO1xuICAgICAgICAgICAgZGVmYXVsdDpicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGEubWV0YS5JSUZfdmVyc2lvbiA9IF9JSUYuSUlGX3ZlcnNpb247XG5cbiAgICB9XG4gICAgdXBncmFkZVNhdmVfR2FtZSAoKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuZGF0YS5tZXRhLmdhbWVfdmVyc2lvbiA9PT0gdGhpcy5nYW1lT2JqLmNvbmZpZy5nYW1lVmVyc2lvbilcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBpZiAoZGVidWcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2F2ZSA6IG1pZ3JhdGluZyBnYW1lIHNhdmVkRGF0YSBmcm9tICcsdGhpcy5kYXRhLm1ldGEuZ2FtZV92ZXJzaW9uLCd0bycsdGhpcy5nYW1lT2JqLmNvbmZpZy5nYW1lVmVyc2lvbik7XG5cbiAgICAgICAgaWYgKCEodHlwZW9mKHRoaXMuZ2FtZU9iai51cGdyYWRlU2F2ZSkgPT09ICd1bmRlZmluZWQnKSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhLnZhbHVlcyA9IHRoaXMuZ2FtZU9iai51cGdyYWRlU2F2ZSh0aGlzLmRhdGEudmFsdWVzLHRoaXMuZGF0YS5tZXRhLmdhbWVfdmVyc2lvbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXRhLm1ldGEuZ2FtZV92ZXJzaW9uID0gdGhpcy5nYW1lT2JqLmNvbmZpZy5nYW1lVmVyc2lvbjtcblxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTYXZlO1xuIiwibGV0IGRlYnVnID0gdHJ1ZTtcblxuY2xhc3MgVGltZSB7XG4gICAgY29uc3RydWN0b3IgKHRpY2tlZE9iamVjdCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIHRoaXMudGlja2VkT2JqZWN0ID0gdGlja2VkT2JqZWN0O1xuICAgICAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIoJ0lJRldvcmtlci5qcycpO1xuICAgICAgICB0aGlzLndvcmtlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB0aGF0LmhhbmRsZVdvcmtlck1lc3NhZ2UuY2FsbCh0aGF0LGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgIH1cbiAgICB1bnBhdXNlICgpIHtcbiAgICAgICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2UoJ3VucGF1c2UnKTtcbiAgICB9XG4gICAgcGF1c2UgKCkge1xuICAgICAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSgncGF1c2UnKTtcbiAgICB9XG4gICAgcmVzdGFydCAoKSB7XG4gICAgICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKCdyZXN0YXJ0Jyk7XG4gICAgfVxuICAgIHRpY2sgKCkge1xuICAgICAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSgndGljaycpO1xuICAgIH1cbiAgICBoYW5kbGVXb3JrZXJNZXNzYWdlKGUpIHtcbiAgICAgICAgaWYgKGRlYnVnKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaW1lIDogcmVjaWV2aW5nIGEgbWVzc2FnZSBmcm9tIHRoZSB3b3JrZXJcIixlLmRhdGEsdGhpcylcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gZS5kYXRhO1xuICAgICAgICBzd2l0Y2ggKHJlc3BvbnNlWzBdKSB7XG4gICAgICAgICAgICBjYXNlICdkb1RpY2snIDpcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VbMV0gPiAwKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpY2tlZE9iamVjdC5wcm9jZXNzVGlja3MocmVzcG9uc2VbMV0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdCA6IGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWU7XG4iLCJsZXQgZGVidWcgPSB0cnVlO1xubGV0IGh0bWwgPSByZXF1aXJlKCcuL2h0bWwnKTtcbmxldCB0cGxzVG9Mb2FkID0gbmV3IFdlYWtNYXAoKTtcblxuY2xhc3MgVmlldyB7XG4gICAgY29uc3RydWN0b3IgKGNvbmZpZykge1xuICAgICAgICBpZiAoZGVidWcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZpZXcgOiBjcmVhdGluZyBhIG5ldyB2aWV3XCIsY29uZmlnKVxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0ge307XG4gICAgICAgIGlmICghKHR5cGVvZihjb25maWcuY3VzdG9tVHBscykgPT09IFwidW5kZWZpbmVkXCIpKSB7XG4gICAgICAgICAgICB0cGxzVG9Mb2FkLnNldCh0aGlzLE9iamVjdC5rZXlzKGNvbmZpZy5jdXN0b21UcGxzKS5sZW5ndGgpO1xuICAgICAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoY29uZmlnLmN1c3RvbVRwbHMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgaHRtbC5kZWZpbmVUcGwoa2V5LGNvbmZpZy5jdXN0b21UcGxzW2tleV0sdGhhdC5maW5pc2hUcGxMb2FkaW5nLHRoYXQpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vbkluaXRpYWxpemVkKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmluaXNoVHBsTG9hZGluZygpIHtcbiAgICAgICAgdHBsc1RvTG9hZC5zZXQodGhpcyx0cGxzVG9Mb2FkLmdldCh0aGlzKS0xKTtcbiAgICAgICAgaWYgKHRwbHNUb0xvYWQuZ2V0KHRoaXMpPD0wKSB7XG4gICAgICAgICAgICB0aGlzLm9uSW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBvbkluaXRpYWxpemVkICgpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICBpZiAoIWRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHRoYXQub25Jbml0aWFsaXplZCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKGRlYnVnKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJWaWV3IDogVmlldyBpbml0aWFsaXplZFwiLHRoaXMuY29uZmlnKVxuXG4gICAgICAgIC8vIHRwbHMgYXJlIGxvYWRlZCwgd2UgYnVpbGQgdGhlIGNvbXBvbmVudHNcbiAgICAgICAgaWYgKCEodHlwZW9mKHRoaXMuY29uZmlnLmNvbXBvbmVudHMpID09PSBcInVuZGVmaW5lZFwiKSkge1xuICAgICAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5jb25maWcuY29tcG9uZW50cykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICB0aGF0LmFkZENvbXBvbmVudChrZXksdGhhdC5jb25maWcuY29tcG9uZW50c1trZXldKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISh0eXBlb2YodGhpcy5jb25maWcub25Jbml0aWFsaXplZCkgPT09IFwidW5kZWZpbmVkXCIpKVxuICAgICAgICAgICAgdGhpcy5jb25maWcub25Jbml0aWFsaXplZC5jYWxsKHRoaXMuY29uZmlnLmdhbWVPYmopO1xuICAgIH1cbiAgICBhZGRDb21wb25lbnQgKGNvbXBvbmVudElELGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbXBvbmVudHNbY29tcG9uZW50SURdID0gY29uZmlnO1xuICAgICAgICB0aGlzLmJ1aWxkQ29tcG9uZW50KGNvbXBvbmVudElEKTtcbiAgICB9XG4gICAgYnVpbGRDb21wb25lbnQgKGNvbXBvbmVudElEKSB7XG4gICAgICAgIGxldCBjb25maWcgPSB0aGlzLmNvbXBvbmVudHNbY29tcG9uZW50SURdO1xuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbmZpZy5hbmNob3IpO1xuICAgICAgICBpZiAoZWxlbWVudCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgaWYoZGVidWcpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJWaWV3IDogdHJ5aW5nIHRvIGJ1aWxkIGFuIGVsZW1lbnQgYnV0IHRoZSBhbmNob3IgY2FuJ3QgYmUgZm91bmRcIixjb21wb25lbnRJRClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaW5uZXJIVE1MID0gaHRtbC5nZXRUcGwoY29uZmlnLnRwbCxjb25maWcudHBsQmluZGluZ3MpO1xuICAgICAgICBpZiAoaW5uZXJIVE1MKVxuICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gICAgfVxuICAgIHJlZHJhd0NvbXBvbmVudCAoY29tcG9uZW50T2JqKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbXBvbmVudHNbY29tcG9uZW50T2JqLmNvbXBvbmVudF0udHBsID09PSAndXBkYXRlZFZhbHVlJykge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvbXBvbmVudHNbY29tcG9uZW50T2JqLmNvbXBvbmVudF0udHBsQmluZGluZ3MuaWQpO1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IGNvbXBvbmVudE9iai50b1N0cigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZihkZWJ1ZylcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJWaWV3IDogdHJ5aW5nIHRvIHJlZHJhdyBhbiBlbGVtZW50IGJ1dCB0aGUgYW5jaG9yIGNhbid0IGJlIGZvdW5kXCIsY29tcG9uZW50SUQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB0aGlzLmJ1aWxkQ29tcG9uZW50KGNvbXBvbmVudE9iai5jb21wb25lbnQpO1xuICAgIH1cbiAgICByZWRyYXcgKCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLmNvbXBvbmVudHMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICB0aGF0LnJlZHJhd0NvbXBvbmVudChrZXkpO1xuICAgICAgICB9KVxuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gVmlldztcbiJdfQ==

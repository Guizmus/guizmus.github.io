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
            ticks : 50,// if set to a value, activates the worker to tick when needed, activates the functions game.unpause, game.pause and game.restart. Target as many ticks per second as the value
            gameValues : { // game values are saved, and are linked to a view component for redraw. it gives handles like game.getValue(valueKey) (passed as reference) and game.redrawValue(valueKey) for a targeted redraw

                gold : {
                    // let's define the gold values
                    component : 'goldValueDisplay',
                     // the component that will be used. Needs to be declared in the view using the same componentID or will raise errors

                    data : new _IIF.dataStruct.Decimal(100,3),
                    // params are initial value and precision to display
                    // depending on what you do with this value, you may want to use
                    // IIF.dataStruct.Decimal for more precise values, with big numbers
                    // IIF.dataStruct.BreakInfinity for fast calculation, with big numbers
                    // another class that you build, that presents the methods toStr() for drawing, toJSON() and fromJSON(json) for save and load behaviour
                },
            },
            dependencies : { // declaring dependencies will load them, and call game.onDependenciesLoaded when it is done.
                hammer : 'Example/lib/hammer.min.js', // in this example, you can then access hammer.min.js though game.getDependency('hammer')
            },
        });
    }
    onDependencyLoaded(key) { // if you define this function, it will be called upon each dependency that was asked in the constructor
        console.log("Example Game : dependency loaded",key);
    }
    onDependenciesLoaded() { // if you define this function, it will be called once all dependencies are loaded
        console.log("Example Game : all dependencies loaded");
        this.hammerTest();
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
    hammerTest() {
        var element = document.getElementById('hammerDisplay');
        var mc = new Hammer(element);
        mc.on("panleft panright tap press", function(ev) {
            element.textContent = ev.type +" gesture detected.";
        });
    }
}
module.exports = Game;

},{"../IIF/main":14,"./view":3}],2:[function(require,module,exports){
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

},{"../IIF/main":14}],4:[function(require,module,exports){
let debug = true;

let decimal = require('../lib/decimal.js');

let _valueClass = new WeakMap();
let _value = new WeakMap();

function getExponent (value) {
    let split = value.toExponential().split('e')
    let displayExponent = split[1] * 1;
    let displayValue = split[0] * 1;
    let removedExponent = displayExponent%3;
    displayExponent -= removedExponent;
    displayValue *= Math.pow(10,removedExponent);
    return {
        value : displayValue,
        exponent : displayExponent,
    }
}

class BigNumber {
    constructor (valueClass,precision) {

        if (debug)
            console.log("BigNumber : new BigNumber()",precision);

        this.precision = precision;
        this.display_mode = 'toShortSuffix';
        _valueClass.set(this,valueClass);
    }
    setValue (initialValue) {
        _value.set(this,new (_valueClass.get(this))(initialValue))
    }
    setValueObj (valueObj) {
        _value.set(this,valueObj)
    }
    getValue () {
        return _value.get(this);
    }
    add (toAdd) {
        _value.set(this,this.getValue().add(toAdd));
    }
    toStr () {
        return this[this.display_mode]();
    }
    toScientific () {
        return this.getValue().toExponential();
    }
    toEngineering () {
        let valueParts = getExponent(_value.get(this));
        return valueParts.value.toFixed(this.precision)+"e"+(valueParts.exponent > 0 ? '+' : '')+valueParts.exponent;
    }
    toShortSuffix () {
        let valueParts = getExponent(_value.get(this));
        let suffix = "e"+(valueParts.exponent > 0 ? '+' : '')+valueParts.exponent
        switch (valueParts.exponent/3) {
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
        return valueParts.value.toFixed(this.precision)+suffix;
    }
    toLongSuffix () {
        let valueParts = getExponent(_value.get(this));
        let suffix = "e"+(valueParts.exponent > 0 ? '+' : '')+valueParts.exponent
        switch (valueParts.exponent/3) {
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
        return valueParts.value.toFixed(this.precision)+suffix;
    }
}

module.exports = BigNumber;

},{"../lib/decimal.js":12}],5:[function(require,module,exports){
let debug = true;

let break_infinity = require('../lib/break_infinity.js');
let BigNumber = require('./bignumber.js');

let _value = new WeakMap();

class BreakInfinity extends BigNumber {
    constructor (initialValue,precision) {

        if (debug)
            console.log("BreakInfinity : new BreakInfinity()",initialValue,precision);

        super(break_infinity,precision);
        this.setValue(initialValue);
    }
    toJSON () {
        let value = this.getValue();
        return {
            mantissa : value.mantissa,
            exponent : value.exponent,
        };
    }
    fromJSON(json) {
        if (!((typeof(json.mantissa) === "undefined") || (typeof(json.exponent) === "undefined")))
            this.setValueObj((new break_infinity()).fromMantissaExponent(json.mantissa,json.exponent));
    }
}

module.exports = BreakInfinity;

},{"../lib/break_infinity.js":11,"./bignumber.js":4}],6:[function(require,module,exports){
let debug = true;

let decimal = require('../lib/decimal.js');
let BigNumber = require('./bignumber.js');

let _value = new WeakMap();

class Decimal extends BigNumber {
    constructor (initialValue,precision) {

        if (debug)
            console.log("Decimal : new Decimal()",initialValue,precision);

        super(decimal,precision);
        this.setValue(initialValue);
    }
    toJSON () {
        return {
            value : this.getValue().toString(),
        };
    }
    fromJSON(json) {
        if (!(typeof(json.value) === "undefined"))
            this.setValue(json.value);
    }
}

module.exports = Decimal;

},{"../lib/decimal.js":12,"./bignumber.js":4}],7:[function(require,module,exports){
let debug = true;

let SavedValue = require('./savedValue');

class GameValue extends SavedValue {
    constructor (config) {

        if (debug)
            console.log("GameValue : new GameValue()",config);

        super(config.data);
        this.id = config.id;
        this.component = config.component;
        if (!(typeof(config.behaviour) === "undefined")) {
            this.behaviour = new config.behaviour (this.getValueObject())
        } else
            this.behaviour = false;
    }
    toStr() {
        return this.getValueObject().toStr();
    }
}
module.exports = GameValue;

},{"./savedValue":8}],8:[function(require,module,exports){
let debug = false;

let _datas = new WeakMap();

class SavedValue {
    constructor (data) {

        if (debug)
            console.log("SavedValue : new SavedValue()",data);

        _datas.set(this,data);
    }
    getValueObject() {
        return _datas.get(this);
    }
    toJSON () {
        return this.getValueObject().toJSON();
    }
    fromJSON(json) {
        this.getValueObject().fromJSON(json);
    }
}
module.exports = SavedValue;

},{}],9:[function(require,module,exports){
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
let _dependencies = new WeakMap();

let reservedValues = ["time"];

class Game {
    constructor(config) {

        if (debug)
            console.log("Game : new Game()",config);

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
            _time.set(this,new Time(this,config.ticks));
        }

        if ((!(typeof(config.dependencies) === "undefined")) && (Object.keys(config.dependencies).length > 0)) {
            // there are dependencies to load
            let dependencies = {};

            Object.keys(config.dependencies).forEach(function(key) {
                dependencies[key] = false;
                that.loadDependency(key,config.dependencies[key],function() {
                    let dependencies = _dependencies.get(that);
                    dependencies[key] = true;
                    _dependencies.set(that,dependencies);
                    if (typeof(this.onDependencyLoaded) === "function") {
                        this.onDependencyLoaded.call(game,key);
                    }
                    if (typeof(this.onDependenciesLoaded) === "function") {
                        let allDependancyLoaded = true;
                        Object.keys(dependencies).forEach(function(key) {
                            allDependancyLoaded = allDependancyLoaded && dependencies[key];
                        })
                        if (allDependancyLoaded)
                            this.onDependenciesLoaded.call(game);
                    }
                });
            })

            _dependencies.set(this,dependencies);

        }

        _save.set(this,new Save(config.saveKey,this));
    }
    loadDependency (key,path,callback) {
        let that = this;
        fetch(path)
            .then(response => response.text())
            .then(_data => {
                if (debug)
                    console.log("Game : Loaded dependency",path);
                eval(_data);
            })
            .catch(function(error) {
                console.warn("Game : Error while loading a dependency : ",error.message,path);
            })
            .then(()=>{
                callback.call(that)
            });
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
        if (reservedValues.indexOf(key)>=0) {
            console.error('Game : trying to register a value with a reserved key :',key);
            return false;
        }
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

},{"./dataStruct/gamevalue":7,"./localization":13,"./save":15,"./time":16,"./view":17}],10:[function(require,module,exports){
let debug = false;


let localization = require('./localization');

class Tpl {
    constructor (tplStr) {

        if (debug)
            console.log("html : new Tpl()",tplStr);

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
    updatedValue : "<span id=\"{{id}}\">{{val}}</span>\r\n",
    localizedText :("<span class=\"{{locClass}}\" data-{{locDataKey}}=\"{{path}}\">{{text}}</span>\r\n")
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
        text : localization.getText(path,lib)
    });
}
exports.getTpl = getTpl;
exports.defineTpl = defineTpl;
exports.localizedText = localizedText;

},{"./localization":13}],11:[function(require,module,exports){
;(function (globalScope) {
	'use strict';

//START pad-end ( https://www.npmjs.com/package/pad-end )

var padEnd = function (string, maxLength, fillString) {

  if (string == null || maxLength == null) {
    return string;
  }

  var result    = String(string);

  var length = result.length;
  if (length >= maxLength) {
    return result;
  }

  var filled = fillString == null ? '' : String(fillString);
  if (filled === '') {
    filled = ' ';
  }

  var fillLen = maxLength - length;

  while (filled.length < fillLen) {
    filled += filled;
  }

  var truncated = filled.length > fillLen ? filled.substr(0, fillLen) : filled;

  return result + truncated;
};

//END pad-end

//IE6 polyfills

//Also need polyfills on IE6: log2, log1p, hypot, imul, fround, expm1, clz32, cbrt, hyperbolic trig

Math.log10 = Math.log10 || function(x) {
	return Math.log(x) * Math.LOG10E;
};

Number.isInteger = Number.isInteger || function(value) {
  return typeof value === 'number' &&
    isFinite(value) &&
    Math.floor(value) === value;
};

Number.isSafeInteger = Number.isSafeInteger || function (value) {
   return Number.isInteger(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
};

if (!Math.trunc) {
	Math.trunc = function(v) {
		v = +v;
		if (!isFinite(v)) return v;

		return (v - v % 1)   ||   (v < 0 ? -0 : v === 0 ? v : 0);

		// returns:
		//  0        ->  0
		// -0        -> -0
		//  0.2      ->  0
		// -0.2      -> -0
		//  0.7      ->  0
		// -0.7      -> -0
		//  Infinity ->  Infinity
		// -Infinity -> -Infinity
		//  NaN      ->  NaN
		//  null     ->  0
	};
}

if (!Math.sign) {
  Math.sign = function(x) {
    // If x is NaN, the result is NaN.
    // If x is -0, the result is -0.
    // If x is +0, the result is +0.
    // If x is negative and not -0, the result is -1.
    // If x is positive and not +0, the result is +1.
    return ((x > 0) - (x < 0)) || +x;
    // A more aesthetical persuado-representation is shown below
    //
    // ( (x > 0) ? 0 : 1 )  // if x is negative then negative one
    //          +           // else (because you cant be both - and +)
    // ( (x < 0) ? 0 : -1 ) // if x is positive then positive one
    //         ||           // if x is 0, -0, or NaN, or not a number,
    //         +x           // Then the result will be x, (or) if x is
    //                      // not a number, then x converts to number
  };
}

	/*

	# break_infinity.js
	A replacement for decimal.js for incremental games who want to deal with very large numbers (bigger in magnitude than 1e308, up to as much as 1e(9e15) ) and want to prioritize speed over accuracy.
	If you want to prioritize accuracy over speed, please use decimal.js instead.
	If you need to handle numbers as big as 1e(1.79e308), try break_break_infinity.js, which sacrifices speed to deal with such massive numbers.

	https://github.com/Patashu/break_infinity.js

	This library is open source and free to use/modify/fork for any purpose you want.

	By Patashu.

	---

	Decimal has only two fields:

	mantissa: A number (double) with absolute value between [1, 10) OR exactly 0. If mantissa is ever 10 or greater, it should be normalized (divide by 10 and add 1 to exponent until it is less than 10, or multiply by 10 and subtract 1 from exponent until it is 1 or greater). Infinity/-Infinity/NaN will cause bad things to happen.
	exponent: A number (integer) between -EXP_LIMIT and EXP_LIMIT. Non-integral/out of bounds will cause bad things to happen.

	The decimal's value is simply mantissa*10^exponent.

	Functions of Decimal:

	fromMantissaExponent(mantissa, exponent)
	fromDecimal(value)
	fromNumber(value)
	fromString(value)
	fromValue(value)

	toNumber()
	mantissaWithDecimalPlaces(places)
	toString()
	toFixed(places)
	toExponential(places)
	toPrecision(places)

	abs(), neg(), sign()
	add(value), sub(value), mul(value), div(value), recip()

	cmp(value), eq(value), neq(value), lt(value), lte(value), gt(value), gte(value)
	cmp_tolerance(value, tolerance), eq_tolerance(value, tolerance), neq_tolerance(value, tolerance), lt_tolerance(value, tolerance), lte_tolerance(value, tolerance), gt_tolerance(value, tolerance), gte_tolerance(value, tolerance)

	log(base), log10(), log2(), ln()
	pow(value, other), pow(value), pow_base(value), exp(), sqr(), sqrt(), cube(), cbrt()

	affordGeometricSeries(resourcesAvailable, priceStart, priceRatio, currentOwned), sumGeometricSeries(numItems, priceStart, priceRatio, currentOwned), affordArithmeticSeries(resourcesAvailable, priceStart, priceAdd, currentOwned), sumArithmeticSeries(numItems, priceStart, priceAdd, currentOwned)

	---

	So how much faster than decimal.js is break_infinity.js? Operations per second comparison using the same computer:
	new Decimal("1.23456789e987654321") : 1.5e6 to to 3e6 (2x speedup)
	Decimal.add("1e999", "9e998") : 1e6 to 1.5e7 (15x speedup)
	Decimal.mul("1e999", "9e998") : 1.5e6 to 1e8 (66x speedup)
	Decimal.pow(987.789, 123.321) : 8e3 to 2e6 (250x speedup)
	Decimal.exp(1e10) : 5e3 to 3.8e7 (7600x speedup)
	Decimal.ln("987.654e789") : 4e4 to 4.5e8 (11250x speedup)
	Decimal.log10("987.654e789") : 3e4 to 5e8 (16666x speedup)

	---

	Dedicated to Hevipelle, and all the CPUs that struggled to run Antimatter Dimensions.

	Related song: https://soundcloud.com/patashu/8-bit-progressive-stoic-platonic-ideal

	*/

	var MAX_SIGNIFICANT_DIGITS = 17; //for example: if two exponents are more than 17 apart, consider adding them together pointless, just return the larger one
	var EXP_LIMIT = 9e15; //highest value you can safely put here is Number.MAX_SAFE_INTEGER-MAX_SIGNIFICANT_DIGITS

	var NUMBER_EXP_MAX = 308; //the largest exponent that can appear in a Number, though not all mantissas are valid here.
	var NUMBER_EXP_MIN = -324; //The smallest exponent that can appear in a Number, though not all mantissas are valid here.

	//we need this lookup table because Math.pow(10, exponent) when exponent's absolute value is large is slightly inaccurate. you can fix it with the power of math... or just make a lookup table. faster AND simpler
	let powersof10 = [];
	for (let i = NUMBER_EXP_MIN + 1; i <= NUMBER_EXP_MAX; i++) {
		powersof10.push(Number('1e' + i));
	}
	var indexof0inpowersof10 = 323;

	class Decimal {

		/*static adjustMantissa(oldMantissa, exponent) {
			//Multiplying or dividing by 0.1 causes rounding errors, dividing or multiplying by 10 does not.
			//So always multiply/divide by a large number whenever we can get away with it.

			/*
			Still a few weird cases, IDK if they'll ever come up though:
0.001*1e308
1e+305
0.001*1e308*10
9.999999999999999e+305
			*/

			/*
			TODO: I'm not even sure if this is a good idea in general, because
1000*-4.03
-4030.0000000000005
-4.03/1e-3
-4030
			So it's not even true that mul/div by a positive power of 10 is always the more accurate approach.
			*/

			/*if (exponent == 0) { return oldMantissa; }
			if (exponent > 0)
			{
				if (exponent > 308)
				{
					return oldMantissa*1e308*powersof10[(exponent-308)+indexof0inpowersof10];
				}
				return oldMantissa*powersof10[exponent+indexof0inpowersof10];
			}
			else
			{
				if (exponent < -308)
				{
					return oldMantissa*powersof10[exponent+indexof0inpowersof10];
				}
				return oldMantissa/powersof10[-exponent+indexof0inpowersof10];
			}
		}*/

		normalize() {
			//When mantissa is very denormalized, use this to normalize much faster.

			//TODO: I'm worried about mantissa being negative 0 here which is why I set it again, but it may never matter
			if (this.mantissa == 0) { this.mantissa = 0; this.exponent = 0; return; }
			if (this.mantissa >= 1 && this.mantissa < 10) { return; }

			var temp_exponent = Math.floor(Math.log10(Math.abs(this.mantissa)));
			this.mantissa = this.mantissa/powersof10[temp_exponent+indexof0inpowersof10];
			this.exponent += temp_exponent;

			return this;
		}

		fromMantissaExponent(mantissa, exponent) {
			//SAFETY: don't let in non-numbers
			if (!isFinite(mantissa) || !isFinite(exponent)) { mantissa = Number.NaN; exponent = Number.NaN; }
			this.mantissa = mantissa;
			this.exponent = exponent;
			this.normalize(); //Non-normalized mantissas can easily get here, so this is mandatory.
			return this;
		}

		fromMantissaExponent_noNormalize(mantissa, exponent) {
			//Well, you know what you're doing!
			this.mantissa = mantissa;
			this.exponent = exponent;
			return this;
		}

		fromDecimal(value) {
			this.mantissa = value.mantissa;
			this.exponent = value.exponent;
			return this;
		}

		fromNumber(value) {
			//SAFETY: Handle Infinity and NaN in a somewhat meaningful way.
			if (isNaN(value)) { this.mantissa = Number.NaN; this.exponent = Number.NaN; }
			else if (value == Number.POSITIVE_INFINITY) { this.mantissa = 1; this.exponent = EXP_LIMIT; }
			else if (value == Number.NEGATIVE_INFINITY) { this.mantissa = -1; this.exponent = EXP_LIMIT; }
			else if (value == 0) { this.mantissa = 0; this.exponent = 0; }
			else
			{
				this.exponent = Math.floor(Math.log10(Math.abs(value)));
				//SAFETY: handle 5e-324, -5e-324 separately
				if (this.exponent == NUMBER_EXP_MIN)
				{
					this.mantissa = (value*10)/1e-323;
				}
				else
				{
					this.mantissa = value/powersof10[this.exponent+indexof0inpowersof10];
				}
				this.normalize(); //SAFETY: Prevent weirdness.
			}
			return this;
		}

		fromString(value) {
			if (value.indexOf("e") != -1)
			{
				var parts = value.split("e");
				this.mantissa = parseFloat(parts[0]);
				this.exponent = parseFloat(parts[1]);
				this.normalize(); //Non-normalized mantissas can easily get here, so this is mandatory.
			}
			else if (value == "NaN") { this.mantissa = Number.NaN; this.exponent = Number.NaN; }
			else
			{
				this.fromNumber(parseFloat(value));
				if (isNaN(this.mantissa)) { throw Error("[DecimalError] Invalid argument: " + value); }
			}
			return this;
		}

		fromValue(value) {
			if (value instanceof Decimal) {
				return this.fromDecimal(value);
			}
			else if (typeof(value) == 'number') {
				return this.fromNumber(value);
			}
			else if (typeof(value) == 'string') {
				return this.fromString(value);
			}
			else {
				this.mantissa = 0;
				this.exponent = 0;
				return this;
			}
		}

		constructor(value)
		{
			if (value instanceof Decimal) {
				this.fromDecimal(value);
			}
			else if (typeof(value) == 'number') {
				this.fromNumber(value);
			}
			else if (typeof(value) == 'string') {
				this.fromString(value);
			}
			else {
				this.mantissa = 0;
				this.exponent = 0;
			}
		}

		static fromMantissaExponent(mantissa, exponent) {
			return new Decimal().fromMantissaExponent(mantissa, exponent);
		}

		static fromMantissaExponent_noNormalize(mantissa, exponent) {
			return new Decimal().fromMantissaExponent_noNormalize(mantissa, exponent);
		}

		static fromDecimal(value) {
			return new Decimal().fromDecimal(value);
		}

		static fromNumber(value) {
			return new Decimal().fromNumber(value);
		}

		static fromString(value) {
			return new Decimal().fromString(value);
		}

		static fromValue(value) {
			if (value instanceof Decimal) {
				return value;
			}
			return new Decimal(value);
		}

		toNumber() {
			//Problem: new Decimal(116).toNumber() returns 115.99999999999999.
			//TODO: How to fix in general case? It's clear that if toNumber() is VERY close to an integer, we want exactly the integer. But it's not clear how to specifically write that. So I'll just settle with 'exponent >= 0 and difference between rounded and not rounded < 1e-9' as a quick fix.

			//var result = this.mantissa*Math.pow(10, this.exponent);

			if (!isFinite(this.exponent)) { return Number.NaN; }
			if (this.exponent > NUMBER_EXP_MAX) { return this.mantissa > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY; }
			if (this.exponent < NUMBER_EXP_MIN) { return 0; }
			//SAFETY: again, handle 5e-324, -5e-324 separately
			if (this.exponent == NUMBER_EXP_MIN) { return this.mantissa > 0 ? 5e-324 : -5e-324; }

			var result = this.mantissa*powersof10[this.exponent+indexof0inpowersof10];
			if (!isFinite(result) || this.exponent < 0) { return result; }
			var resultrounded = Math.round(result);
			if (Math.abs(resultrounded-result) < 1e-10) return resultrounded;
			return result;
		}

		mantissaWithDecimalPlaces(places) {
			// https://stackoverflow.com/a/37425022

			if (isNaN(this.mantissa) || isNaN(this.exponent)) return Number.NaN;
			if (this.mantissa == 0) return 0;

			var len = places+1;
			var numDigits = Math.ceil(Math.log10(Math.abs(this.mantissa)));
			var rounded = Math.round(this.mantissa*Math.pow(10,len-numDigits))*Math.pow(10,numDigits-len);
			return parseFloat(rounded.toFixed(Math.max(len-numDigits,0)));
		}

		toString() {
			if (isNaN(this.mantissa) || isNaN(this.exponent)) { return "NaN"; }
			if (this.exponent >= EXP_LIMIT)
			{
				return this.mantissa > 0 ? "Infinity" : "-Infinity";
			}
			if (this.exponent <= -EXP_LIMIT || this.mantissa == 0) { return "0"; }

			if (this.exponent < 21 && this.exponent > -7)
			{
				return this.toNumber().toString();
			}

			return this.mantissa + "e" + (this.exponent >= 0 ? "+" : "") + this.exponent;
		}

		toExponential(places) {
			// https://stackoverflow.com/a/37425022

			//TODO: Some unfixed cases:
			//new Decimal("1.2345e-999").toExponential()
			//"1.23450000000000015e-999"
			//new Decimal("1e-999").toExponential()
			//"1.000000000000000000e-999"
			//TBH I'm tempted to just say it's a feature. If you're doing pretty formatting then why don't you know how many decimal places you want...?

			if (isNaN(this.mantissa) || isNaN(this.exponent)) { return "NaN"; }
			if (this.exponent >= EXP_LIMIT)
			{
				return this.mantissa > 0 ? "Infinity" : "-Infinity";
			}
			if (this.exponent <= -EXP_LIMIT || this.mantissa == 0) { return "0" + (places > 0 ? padEnd(".", places+1, "0") : "") + "e+0"; }

			// two cases:
			// 1) exponent is < 308 and > -324: use basic toFixed
			// 2) everything else: we have to do it ourselves!

			if (this.exponent > NUMBER_EXP_MIN && this.exponent < NUMBER_EXP_MAX) { return this.toNumber().toExponential(places); }

			if (!isFinite(places)) { places = MAX_SIGNIFICANT_DIGITS; }

			var len = places+1;
			var numDigits = Math.max(1, Math.ceil(Math.log10(Math.abs(this.mantissa))));
			var rounded = Math.round(this.mantissa*Math.pow(10,len-numDigits))*Math.pow(10,numDigits-len);

			return rounded.toFixed(Math.max(len-numDigits,0)) + "e" + (this.exponent >= 0 ? "+" : "") + this.exponent;
		}

		toFixed(places) {
			if (isNaN(this.mantissa) || isNaN(this.exponent)) { return "NaN"; }
			if (this.exponent >= EXP_LIMIT)
			{
				return this.mantissa > 0 ? "Infinity" : "-Infinity";
			}
			if (this.exponent <= -EXP_LIMIT || this.mantissa == 0) { return "0" + (places > 0 ? padEnd(".", places+1, "0") : ""); }

			// two cases:
			// 1) exponent is 17 or greater: just print out mantissa with the appropriate number of zeroes after it
			// 2) exponent is 16 or less: use basic toFixed

			if (this.exponent >= MAX_SIGNIFICANT_DIGITS)
			{
				return this.mantissa.toString().replace(".", "").padEnd(this.exponent+1, "0") + (places > 0 ? padEnd(".", places+1, "0") : "");
			}
			else
			{
				return this.toNumber().toFixed(places);
			}
		}

		toPrecision(places) {
			if (this.exponent <= -7)
			{
				return this.toExponential(places-1);
			}
			if (places > this.exponent)
			{
				return this.toFixed(places - this.exponent - 1);
			}
			return this.toExponential(places-1);
		}

		valueOf() { return this.toString(); }
		toJSON() { return this.toString(); }
		toStringWithDecimalPlaces(places) { return this.toExponential(places); }

		get m() { return this.mantissa; }
		set m(value) { this.mantissa = value; }
		get e() { return this.exponent; }
		set e(value) { this.exponent = value; }

		abs() {
			return Decimal.fromMantissaExponent(Math.abs(this.mantissa), this.exponent);
		}

		static abs(value) {
			value = Decimal.fromValue(value);

			return value.abs();
		}

		neg() {
			return Decimal.fromMantissaExponent(-this.mantissa, this.exponent);
		}

		static neg(value) {
			value = Decimal.fromValue(value);

			return value.neg();
		}

		negate() {
			return this.neg();
		}

		static negate(value) {
			value = Decimal.fromValue(value);

			return value.neg();
		}

		negated() {
			return this.neg();
		}

		static negated(value) {
			value = Decimal.fromValue(value);

			return value.neg();
		}

		sign() {
			return Math.sign(this.mantissa);
		}

		static sign(value) {
			value = Decimal.fromValue(value);

			return value.sign();
		}

		sgn() {
			return this.sign();
		}

		static sgn(value) {
			value = Decimal.fromValue(value);

			return value.sign();
		}

		get s() {return this.sign(); }
		set s(value) {
			if (value == 0) { this.e = 0; this.m = 0; }
			if (this.sgn() != value) { this.m = -this.m; }
		}

		round() {
			if (this.exponent < -1)
			{
				return new Decimal(0);
			}
			else if (this.exponent < MAX_SIGNIFICANT_DIGITS)
			{
				return new Decimal(Math.round(this.toNumber()));
			}
			return this;
		}

		static round(value) {
			value = Decimal.fromValue(value);

			return value.round();
		}

		floor() {
			if (this.exponent < -1)
			{
				return Math.sign(this.mantissa) >= 0 ? new Decimal(0) : new Decimal(-1);
			}
			else if (this.exponent < MAX_SIGNIFICANT_DIGITS)
			{
				return new Decimal(Math.floor(this.toNumber()));
			}
			return this;
		}

		static floor(value) {
			value = Decimal.fromValue(value);

			return value.floor();
		}

		ceil() {
			if (this.exponent < -1)
			{
				return Math.sign(this.mantissa) > 0 ? new Decimal(1) : new Decimal(0);
			}
			if (this.exponent < MAX_SIGNIFICANT_DIGITS)
			{
				return new Decimal(Math.ceil(this.toNumber()));
			}
			return this;
		}

		static ceil(value) {
			value = Decimal.fromValue(value);

			return value.ceil();
		}

		trunc() {
			if (this.exponent < 0)
			{
				return new Decimal(0);
			}
			else if (this.exponent < MAX_SIGNIFICANT_DIGITS)
			{
				return new Decimal(Math.trunc(this.toNumber()));
			}
			return this;
		}

		static trunc(value) {
			value = Decimal.fromValue(value);

			return value.trunc();
		}

		add(value) {
			//figure out which is bigger, shrink the mantissa of the smaller by the difference in exponents, add mantissas, normalize and return

			//TODO: Optimizations and simplification may be possible, see https://github.com/Patashu/break_infinity.js/issues/8

			value = Decimal.fromValue(value);

			if (this.mantissa == 0) { return value; }
			if (value.mantissa == 0) { return this; }

			var biggerDecimal, smallerDecimal;
			if (this.exponent >= value.exponent)
			{
				biggerDecimal = this;
				smallerDecimal = value;
			}
			else
			{
				biggerDecimal = value;
				smallerDecimal = this;
			}

			if (biggerDecimal.exponent - smallerDecimal.exponent > MAX_SIGNIFICANT_DIGITS)
			{
				return biggerDecimal;
			}
			else
			{
				//have to do this because adding numbers that were once integers but scaled down is imprecise.
				//Example: 299 + 18
				return Decimal.fromMantissaExponent(
				Math.round(1e14*biggerDecimal.mantissa + 1e14*smallerDecimal.mantissa*powersof10[(smallerDecimal.exponent-biggerDecimal.exponent)+indexof0inpowersof10]),
				biggerDecimal.exponent-14);
			}
		}

		static add(value, other) {
			value = Decimal.fromValue(value);

			return value.add(other);
		}

		plus(value) {
			return this.add(value);
		}

		static plus(value, other) {
			value = Decimal.fromValue(value);

			return value.add(other);
		}

		sub(value) {
			value = Decimal.fromValue(value);

			return this.add(Decimal.fromMantissaExponent(-value.mantissa, value.exponent));
		}

		static sub(value, other) {
			value = Decimal.fromValue(value);

			return value.sub(other);
		}

		subtract(value) {
			return this.sub(value);
		}

		static subtract(value, other) {
			value = Decimal.fromValue(value);

			return value.sub(other);
		}

		minus(value) {
			return this.sub(value);
		}

		static minus(value, other) {
			value = Decimal.fromValue(value);

			return value.sub(other);
		}

		mul(value) {
			/*
			a_1*10^b_1 * a_2*10^b_2
			= a_1*a_2*10^(b_1+b_2)
			*/

			value = Decimal.fromValue(value);

			return Decimal.fromMantissaExponent(this.mantissa*value.mantissa, this.exponent+value.exponent);
		}

		static mul(value, other) {
			value = Decimal.fromValue(value);

			return value.mul(other);
		}

		multiply(value) {
			return this.mul(value);
		}

		static multiply(value, other) {
			value = Decimal.fromValue(value);

			return value.mul(other);
		}

		times(value) {
			return this.mul(value);
		}

		static times(value, other) {
			value = Decimal.fromValue(value);

			return value.mul(other);
		}

		div(value) {
			value = Decimal.fromValue(value);

			return this.mul(value.recip());
		}

		static div(value, other) {
			value = Decimal.fromValue(value);

			return value.div(other);
		}

		divide(value) {
			return this.div(value);
		}

		static divide(value, other) {
			value = Decimal.fromValue(value);

			return value.div(other);
		}

		divideBy(value) { return this.div(value); }
		dividedBy(value) { return this.div(value); }

		recip() {
			return Decimal.fromMantissaExponent(1/this.mantissa, -this.exponent);
		}

		static recip(value) {
			value = Decimal.fromValue(value);

			return value.recip();
		}

		reciprocal() {
			return this.recip();
		}

		static reciprocal(value) {
			value = Decimal.fromValue(value);

			return value.recip();
		}

		reciprocate() {
			return this.recip();
		}

		static reciprocate(value) {
			value = Decimal.fromValue(value);

			return value.reciprocate();
		}

		//-1 for less than value, 0 for equals value, 1 for greater than value
		cmp(value) {
			value = Decimal.fromValue(value);

			//TODO: sign(a-b) might be better? https://github.com/Patashu/break_infinity.js/issues/12

			/*
			from smallest to largest:

			-3e100
			-1e100
			-3e99
			-1e99
			-3e0
			-1e0
			-3e-99
			-1e-99
			-3e-100
			-1e-100
			0
			1e-100
			3e-100
			1e-99
			3e-99
			1e0
			3e0
			1e99
			3e99
			1e100
			3e100

			*/

			if (this.mantissa == 0)
			{
				if (value.mantissa == 0) { return 0; }
				if (value.mantissa < 0) { return 1; }
				if (value.mantissa > 0) { return -1; }
			}
			else if (value.mantissa == 0)
			{
				if (this.mantissa < 0) { return -1; }
				if (this.mantissa > 0) { return 1; }
			}

			if (this.mantissa > 0) //positive
			{
				if (value.mantissa < 0) { return 1; }
				if (this.exponent > value.exponent) { return 1; }
				if (this.exponent < value.exponent) { return -1; }
				if (this.mantissa > value.mantissa) { return 1; }
				if (this.mantissa < value.mantissa) { return -1; }
				return 0;
			}
			else if (this.mantissa < 0) // negative
			{
				if (value.mantissa > 0) { return -1; }
				if (this.exponent > value.exponent) { return -1; }
				if (this.exponent < value.exponent) { return 1; }
				if (this.mantissa > value.mantissa) { return 1; }
				if (this.mantissa < value.mantissa) { return -1; }
				return 0;
			}
		}

		static cmp(value, other) {
			value = Decimal.fromValue(value);

			return value.cmp(other);
		}

		compare(value) {
			return this.cmp(value);
		}

		static compare(value, other) {
			value = Decimal.fromValue(value);

			return value.cmp(other);
		}

		eq(value) {
			value = Decimal.fromValue(value);

			return this.exponent == value.exponent && this.mantissa == value.mantissa
		}

		static eq(value, other) {
			value = Decimal.fromValue(value);

			return value.eq(other);
		}

		equals(value) {
			return this.eq(value);
		}

		static equals(value, other) {
			value = Decimal.fromValue(value);

			return value.eq(other);
		}

		neq(value) {
			value = Decimal.fromValue(value);

			return this.exponent != value.exponent || this.mantissa != value.mantissa
		}

		static neq(value, other) {
			value = Decimal.fromValue(value);

			return value.neq(other);
		}

		notEquals(value) {
			return this.neq(value);
		}

		static notEquals(value, other) {
			value = Decimal.fromValue(value);

			return value.notEquals(other);
		}

		lt(value) {
			value = Decimal.fromValue(value);

			if (this.mantissa == 0) return value.mantissa > 0;
			if (value.mantissa == 0) return this.mantissa <= 0;
			if (this.exponent == value.exponent) return this.mantissa < value.mantissa;
			if (this.mantissa > 0) return value.mantissa > 0 && this.exponent < value.exponent;
			return value.mantissa > 0 || this.exponent > value.exponent;
		}

		static lt(value, other) {
			value = Decimal.fromValue(value);

			return value.lt(other);
		}

		lte(value) {
			value = Decimal.fromValue(value);

			if (this.mantissa == 0) return value.mantissa >= 0;
			if (value.mantissa == 0) return this.mantissa <= 0;
			if (this.exponent == value.exponent) return this.mantissa <= value.mantissa;
			if (this.mantissa > 0) return value.mantissa > 0 && this.exponent < value.exponent;
			return value.mantissa > 0 || this.exponent > value.exponent;
		}

		static lte(value, other) {
			value = Decimal.fromValue(value);

			return value.lte(other);
		}

		gt(value) {
			value = Decimal.fromValue(value);

			if (this.mantissa == 0) return value.mantissa < 0;
			if (value.mantissa == 0) return this.mantissa > 0;
			if (this.exponent == value.exponent) return this.mantissa > value.mantissa;
			if (this.mantissa > 0) return value.mantissa < 0 || this.exponent > value.exponent;
			return value.mantissa < 0 && this.exponent < value.exponent;
		}

		static gt(value, other) {
			value = Decimal.fromValue(value);

			return value.gt(other);
		}

		gte(value) {
			value = Decimal.fromValue(value);

			if (this.mantissa == 0) return value.mantissa <= 0;
			if (value.mantissa == 0) return this.mantissa > 0;
			if (this.exponent == value.exponent) return this.mantissa >= value.mantissa;
			if (this.mantissa > 0) return value.mantissa < 0 || this.exponent > value.exponent;
			return value.mantissa < 0 && this.exponent < value.exponent;
		}

		static gte(value, other) {
			value = Decimal.fromValue(value);

			return value.gte(other);
		}

		max(value) {
			value = Decimal.fromValue(value);

			if (this.gte(value)) return this;
			return value;
		}

		static max(value, other) {
			value = Decimal.fromValue(value);

			return value.max(other);
		}

		min(value) {
			value = Decimal.fromValue(value);

			if (this.lte(value)) return this;
			return value;
		}

		static min(value, other) {
			value = Decimal.fromValue(value);

			return value.min(other);
		}

		cmp_tolerance(value, tolerance) {
			value = Decimal.fromValue(value);

			if (this.eq_tolerance(value, tolerance)) return 0;
			return this.cmp(value);
		}

		static cmp_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);

			return value.cmp_tolerance(other, tolerance);
		}

		compare_tolerance(value, tolerance) {
			return this.cmp_tolerance(value, tolerance);
		}

		static compare_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);

			return value.cmp_tolerance(other, tolerance);
		}

		//tolerance is a relative tolerance, multiplied by the greater of the magnitudes of the two arguments. For example, if you put in 1e-9, then any number closer to the larger number than (larger number)*1e-9 will be considered equal.
		eq_tolerance(value, tolerance) {
			value = Decimal.fromValue(value);

			// https://stackoverflow.com/a/33024979
			//return abs(a-b) <= tolerance * max(abs(a), abs(b))

			return Decimal.lte(
				this.sub(value).abs(),
				Decimal.max(this.abs(), value.abs()).mul(tolerance)
				);
		}

		static eq_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);

			return value.eq_tolerance(other, tolerance);
		}

		equals_tolerance(value, tolerance) {
			return this.eq_tolerance(value, tolerance);
		}

		static equals_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);

			return value.eq_tolerance(other, tolerance);
		}

		neq_tolerance(value, tolerance) {
			value = Decimal.fromValue(value);

			return !this.eq_tolerance(value, tolerance);
		}

		static neq_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);

			return value.neq_tolerance(other, tolerance);
		}

		notEquals_tolerance(value, tolerance) {
			return this.neq_tolerance(value, tolerance);
		}

		static notEquals_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);

			return value.notEquals_tolerance(other, tolerance);
		}

		lt_tolerance(value, tolerance) {
			value = Decimal.fromValue(value);

			if (this.eq_tolerance(value, tolerance)) return false;
			return this.lt(value);
		}

		static lt_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);

			return value.lt_tolerance(other, tolerance);
		}

		lte_tolerance(value, tolerance) {
			value = Decimal.fromValue(value);

			if (this.eq_tolerance(value, tolerance)) return true;
			return this.lt(value);
		}

		static lte_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);

			return value.lte_tolerance(other, tolerance);
		}

		gt_tolerance(value, tolerance) {
			value = Decimal.fromValue(value);

			if (this.eq_tolerance(value, tolerance)) return false;
			return this.gt(value);
		}

		static gt_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);

			return value.gt_tolerance(other, tolerance);
		}

		gte_tolerance(value, tolerance) {
			value = Decimal.fromValue(value);

			if (this.eq_tolerance(value, tolerance)) return true;
			return this.gt(value);
		}

		static gte_tolerance(value, other, tolerance) {
			value = Decimal.fromValue(value);

			return value.gte_tolerance(other, tolerance);
		}

		log10() {
			return this.exponent + Math.log10(this.mantissa);
		}

		static log10(value) {
			value = Decimal.fromValue(value);

			return value.log10();
		}

		log(base) {
			//UN-SAFETY: Most incremental game cases are log(number := 1 or greater, base := 2 or greater). We assume this to be true and thus only need to return a number, not a Decimal, and don't do any other kind of error checking.
			return (Math.LN10/Math.log(base))*this.log10();
		}

		static log(value, base) {
			value = Decimal.fromValue(value);

			return value.log(base);
		}

		log2() {
			return 3.32192809488736234787*this.log10();
		}

		static log2(value) {
			value = Decimal.fromValue(value);

			return value.log2();
		}

		ln() {
			return 2.30258509299404568402*this.log10();
		}

		static ln(value) {
			value = Decimal.fromValue(value);

			return value.ln();
		}

		logarithm(base) {
			return this.log(base);
		}

		static logarithm(value, base) {
			value = Decimal.fromValue(value);

			return value.logarithm(base);
		}

		pow(value) {
			//UN-SAFETY: Accuracy not guaranteed beyond ~9~11 decimal places.

			if (value instanceof Decimal) { value = value.toNumber(); }

			//TODO: Fast track seems about neutral for performance. It might become faster if an integer pow is implemented, or it might not be worth doing (see https://github.com/Patashu/break_infinity.js/issues/4 )

			//Fast track: If (this.exponent*value) is an integer and mantissa^value fits in a Number, we can do a very fast method.
			var temp = this.exponent*value;
			if (Number.isSafeInteger(temp))
			{
				var newMantissa = Math.pow(this.mantissa, value);
				if (isFinite(newMantissa))
				{
					return Decimal.fromMantissaExponent(newMantissa, temp);
				}
			}

			//Same speed and usually more accurate. (An arbitrary-precision version of this calculation is used in break_break_infinity.js, sacrificing performance for utter accuracy.)

			var newexponent = Math.trunc(temp);
			var residue = temp-newexponent;
			var newMantissa = Math.pow(10, value*Math.log10(this.mantissa)+residue);
			if (isFinite(newMantissa))
			{
				return Decimal.fromMantissaExponent(newMantissa, newexponent);
			}

			//return Decimal.exp(value*this.ln());
			return Decimal.pow10(value*this.log10()); //this is 2x faster and gives same values AFAIK
		}

		static pow10(value) {
			if (Number.isInteger(value))
			{
				return Decimal.fromMantissaExponent_noNormalize(1,value);
			}
			return Decimal.fromMantissaExponent(Math.pow(10,value%1),Math.trunc(value));
		}

		pow_base(value) {
			value = Decimal.fromValue(value);

			return value.pow(this);
		}

		static pow(value, other) {
			//Fast track: 10^integer
			if (value == 10 && Number.isInteger(other)) { return Decimal.fromMantissaExponent(1, other); }

			value = Decimal.fromValue(value);

			return value.pow(other);
		}

		factorial() {
			//Using Stirling's Approximation. https://en.wikipedia.org/wiki/Stirling%27s_approximation#Versions_suitable_for_calculators

			var n = this.toNumber() + 1;

			return Decimal.pow((n/Math.E)*Math.sqrt(n*Math.sinh(1/n)+1/(810*Math.pow(n, 6))), n).mul(Math.sqrt(2*Math.PI/n));
		}

		exp() {
			//UN-SAFETY: Assuming this value is between [-2.1e15, 2.1e15]. Accuracy not guaranteed beyond ~9~11 decimal places.

			//Fast track: if -706 < this < 709, we can use regular exp.
			var x = this.toNumber();
			if (-706 < x && x < 709)
			{
				return Decimal.fromNumber(Math.exp(x));
			}
			else
			{
				//This has to be implemented fundamentally, so that pow(value) can be implemented on top of it.
				//Should be fast and accurate over the range [-2.1e15, 2.1e15]. Outside that it overflows, so we don't care about these cases.

				// Implementation from SpeedCrunch: https://bitbucket.org/heldercorreia/speedcrunch/src/9cffa7b674890affcb877bfebc81d39c26b20dcc/src/math/floatexp.c?at=master&fileviewer=file-view-default

				var exp, tmp, expx;

				exp = 0;
				expx = this.exponent;

				if (expx >= 0)
				{
					exp = Math.trunc(x/Math.LN10);
					tmp = exp*Math.LN10;
					x -= tmp;
					if (x >= Math.LN10)
					{
						++exp;
						x -= Math.LN10;
					}
				}
				if (x < 0)
				{
					--exp;
					x += Math.LN10;
				}

				//when we get here 0 <= x < ln 10
				x = Math.exp(x);

				if (exp != 0)
				{
					expx = Math.floor(exp); //TODO: or round, or even nothing? can it ever be non-integer?
					x = Decimal.fromMantissaExponent(x, expx);
				}

				return x;
			}
		}

		static exp(value) {
			value = Decimal.fromValue(value);

			return value.exp();
		}

		sqr() {
			return Decimal.fromMantissaExponent(Math.pow(this.mantissa, 2), this.exponent*2);
		}

		static sqr(value) {
			value = Decimal.fromValue(value);

			return value.sqr();
		}

		sqrt() {
			if (this.mantissa < 0) { return new Decimal(Number.NaN) };
			if (this.exponent % 2 != 0) { return Decimal.fromMantissaExponent(Math.sqrt(this.mantissa)*3.16227766016838, Math.floor(this.exponent/2)); } //mod of a negative number is negative, so != means '1 or -1'
			return Decimal.fromMantissaExponent(Math.sqrt(this.mantissa), Math.floor(this.exponent/2));
		}

		static sqrt(value) {
			value = Decimal.fromValue(value);

			return value.sqrt();
		}

		cube() {
			return Decimal.fromMantissaExponent(Math.pow(this.mantissa, 3), this.exponent*3);
		}

		static cube(value) {
			value = Decimal.fromValue(value);

			return value.cube();
		}

		cbrt() {
			var sign = 1;
			var mantissa = this.mantissa;
			if (mantissa < 0) { sign = -1; mantissa = -mantissa; };
			var newmantissa = sign*Math.pow(mantissa, (1/3));

			var mod = this.exponent % 3;
			if (mod == 1 || mod == -1) { return Decimal.fromMantissaExponent(newmantissa*2.1544346900318837, Math.floor(this.exponent/3)); }
			if (mod != 0) { return Decimal.fromMantissaExponent(newmantissa*4.6415888336127789, Math.floor(this.exponent/3)); } //mod != 0 at this point means 'mod == 2 || mod == -2'
			return Decimal.fromMantissaExponent(newmantissa, Math.floor(this.exponent/3));
		}

		static cbrt(value) {
			value = Decimal.fromValue(value);

			return value.cbrt();
		}

		//Some hyperbolic trig functions that happen to be easy
		sinh() {
			return this.exp().sub(this.negate().exp()).div(2);
		}
		cosh() {
			return this.exp().add(this.negate().exp()).div(2);
		}
		tanh() {
			return this.sinh().div(this.cosh());
		}
		asinh() {
			return Decimal.ln(this.add(this.sqr().add(1).sqrt()));
		}
		acosh() {
			return Decimal.ln(this.add(this.sqr().sub(1).sqrt()));
		}
		atanh() {
		if (this.abs().gte(1)) return Number.NaN;
		return Decimal.ln(this.add(1).div(new Decimal(1).sub(this))).div(2);
		}

		//If you're willing to spend 'resourcesAvailable' and want to buy something with exponentially increasing cost each purchase (start at priceStart, multiply by priceRatio, already own currentOwned), how much of it can you buy? Adapted from Trimps source code.
		static affordGeometricSeries(resourcesAvailable, priceStart, priceRatio, currentOwned)
		{
			resourcesAvailable = Decimal.fromValue(resourcesAvailable);
			priceStart = Decimal.fromValue(priceStart);
			priceRatio = Decimal.fromValue(priceRatio);
			var actualStart = priceStart.mul(Decimal.pow(priceRatio, currentOwned));

			//return Math.floor(log10(((resourcesAvailable / (priceStart * Math.pow(priceRatio, currentOwned))) * (priceRatio - 1)) + 1) / log10(priceRatio));

			return Decimal.floor(Decimal.log10(((resourcesAvailable.div(actualStart)).mul((priceRatio.sub(1)))).add(1)) / (Decimal.log10(priceRatio)));
		}

		//How much resource would it cost to buy (numItems) items if you already have currentOwned, the initial price is priceStart and it multiplies by priceRatio each purchase?
		static sumGeometricSeries(numItems, priceStart, priceRatio, currentOwned)
		{
			priceStart = Decimal.fromValue(priceStart);
			priceRatio = Decimal.fromValue(priceRatio);
			var actualStart = priceStart.mul(Decimal.pow(priceRatio, currentOwned));

			return (actualStart.mul(Decimal.sub(1,Decimal.pow(priceRatio,numItems)))).div(Decimal.sub(1,priceRatio));
		}

		//If you're willing to spend 'resourcesAvailable' and want to buy something with additively increasing cost each purchase (start at priceStart, add by priceAdd, already own currentOwned), how much of it can you buy?
		static affordArithmeticSeries(resourcesAvailable, priceStart, priceAdd, currentOwned)
		{
			resourcesAvailable = Decimal.fromValue(resourcesAvailable);
			priceStart = Decimal.fromValue(priceStart);
			priceAdd = Decimal.fromValue(priceAdd);
			currentOwned = Decimal.fromValue(currentOwned);
			var actualStart = priceStart.add(Decimal.mul(currentOwned,priceAdd));

			//n = (-(a-d/2) + sqrt((a-d/2)^2+2dS))/d
			//where a is actualStart, d is priceAdd and S is resourcesAvailable
			//then floor it and you're done!

			var b = actualStart.sub(priceAdd.div(2));
			var b2 = b.pow(2);

			return Decimal.floor(
			(b.neg().add(Decimal.sqrt(b2.add(Decimal.mul(priceAdd, resourcesAvailable).mul(2))))
			).div(priceAdd)
			);

			//return Decimal.floor(something);
		}

		//How much resource would it cost to buy (numItems) items if you already have currentOwned, the initial price is priceStart and it adds priceAdd each purchase? Adapted from http://www.mathwords.com/a/arithmetic_series.htm
		static sumArithmeticSeries(numItems, priceStart, priceAdd, currentOwned)
		{
			numItems = Decimal.fromValue(numItems);
			priceStart = Decimal.fromValue(priceStart);
			priceAdd = Decimal.fromValue(priceAdd);
			currentOwned = Decimal.fromValue(currentOwned);
			var actualStart = priceStart.add(Decimal.mul(currentOwned,priceAdd));

			//(n/2)*(2*a+(n-1)*d)

			return Decimal.div(numItems,2).mul(Decimal.mul(2,actualStart).plus(numItems.sub(1).mul(priceAdd)))
		}

		//Joke function from Realm Grinder
		ascensionPenalty(ascensions) {
			if (ascensions == 0) return this;
			return this.pow(Math.pow(10, -ascensions));
		}

		//When comparing two purchases that cost (resource) and increase your resource/sec by (delta_RpS), the lowest efficiency score is the better one to purchase. From Frozen Cookies: http://cookieclicker.wikia.com/wiki/Frozen_Cookies_(JavaScript_Add-on)#Efficiency.3F_What.27s_that.3F
		static efficiencyOfPurchase(cost, current_RpS, delta_RpS)
		{
			cost = Decimal.fromValue(cost);
			current_RpS = Decimal.fromValue(current_RpS);
			delta_RpS = Decimal.fromValue(delta_RpS);
			return Decimal.add(cost.div(current_RpS), cost.div(delta_RpS));
		}

		//Joke function from Cookie Clicker. It's 'egg'
		egg() { return this.add(9); }

        //  Porting some function from Decimal.js
        lessThanOrEqualTo(other) {return this.cmp(other) < 1; }
        lessThan(other) {return this.cmp(other) < 0; }
        greaterThanOrEqualTo(other) { return this.cmp(other) > -1; }
        greaterThan(other) {return this.cmp(other) > 0; }


		static randomDecimalForTesting(absMaxExponent)
		{
			//NOTE: This doesn't follow any kind of sane random distribution, so use this for testing purposes only.
			//5% of the time, have a mantissa of 0
			if (Math.random()*20 < 1) { return Decimal.fromMantissaExponent(0, 0); }
			var mantissa = Math.random()*10;
			//10% of the time, have a simple mantissa
			if (Math.random()*10 < 1) { mantissa = Math.round(mantissa); }
			mantissa *= Math.sign(Math.random()*2-1);
			var exponent = Math.floor(Math.random()*absMaxExponent*2) - absMaxExponent;
			return Decimal.fromMantissaExponent(mantissa, exponent);

			/*
Examples:

randomly test pow:

var a = Decimal.randomDecimalForTesting(1000);
var pow = Math.random()*20-10;
if (Math.random()*2 < 1) { pow = Math.round(pow); }
var result = Decimal.pow(a, pow);
["(" + a.toString() + ")^" + pow.toString(), result.toString()]

randomly test add:

var a = Decimal.randomDecimalForTesting(1000);
var b = Decimal.randomDecimalForTesting(17);
var c = a.mul(b);
var result = a.add(c);
[a.toString() + "+" + c.toString(), result.toString()]
			*/
		}
	}

	// Export.

	// AMD.
	if (typeof define == 'function' && define.amd) {
		define(function () {
		return Decimal;
	});

	// Node and other environments that support module.exports.
	} else if (typeof module != 'undefined' && module.exports) {
		module.exports = Decimal;

	// Browser.
	} else {
	if (!globalScope) {
		globalScope = typeof self != 'undefined' && self && self.self == self
		? self : Function('return this')();
	}

	var noConflict = globalScope.Decimal;
	Decimal.noConflict = function () {
		globalScope.Decimal = noConflict;
		return Decimal;
	};

	globalScope.Decimal = Decimal;
	}
})(this);

},{}],12:[function(require,module,exports){
/*! decimal.js v10.0.1 https://github.com/MikeMcl/decimal.js/LICENCE */
;(function (globalScope) {
  'use strict';


  /*
   *  decimal.js v10.0.1
   *  An arbitrary-precision Decimal type for JavaScript.
   *  https://github.com/MikeMcl/decimal.js
   *  Copyright (c) 2017 Michael Mclaughlin <M8ch88l@gmail.com>
   *  MIT Licence
   */


  // -----------------------------------  EDITABLE DEFAULTS  ------------------------------------ //


    // The maximum exponent magnitude.
    // The limit on the value of `toExpNeg`, `toExpPos`, `minE` and `maxE`.
  var EXP_LIMIT = 9e15,                      // 0 to 9e15

    // The limit on the value of `precision`, and on the value of the first argument to
    // `toDecimalPlaces`, `toExponential`, `toFixed`, `toPrecision` and `toSignificantDigits`.
    MAX_DIGITS = 1e9,                        // 0 to 1e9

    // Base conversion alphabet.
    NUMERALS = '0123456789abcdef',

    // The natural logarithm of 10 (1025 digits).
    LN10 = '2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058',

    // Pi (1025 digits).
    PI = '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789',


    // The initial configuration properties of the Decimal constructor.
    DEFAULTS = {

      // These values must be integers within the stated ranges (inclusive).
      // Most of these values can be changed at run-time using the `Decimal.config` method.

      // The maximum number of significant digits of the result of a calculation or base conversion.
      // E.g. `Decimal.config({ precision: 20 });`
      precision: 20,                         // 1 to MAX_DIGITS

      // The rounding mode used when rounding to `precision`.
      //
      // ROUND_UP         0 Away from zero.
      // ROUND_DOWN       1 Towards zero.
      // ROUND_CEIL       2 Towards +Infinity.
      // ROUND_FLOOR      3 Towards -Infinity.
      // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
      // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
      // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
      // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
      // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
      //
      // E.g.
      // `Decimal.rounding = 4;`
      // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
      rounding: 4,                           // 0 to 8

      // The modulo mode used when calculating the modulus: a mod n.
      // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
      // The remainder (r) is calculated as: r = a - n * q.
      //
      // UP         0 The remainder is positive if the dividend is negative, else is negative.
      // DOWN       1 The remainder has the same sign as the dividend (JavaScript %).
      // FLOOR      3 The remainder has the same sign as the divisor (Python %).
      // HALF_EVEN  6 The IEEE 754 remainder function.
      // EUCLID     9 Euclidian division. q = sign(n) * floor(a / abs(n)). Always positive.
      //
      // Truncated division (1), floored division (3), the IEEE 754 remainder (6), and Euclidian
      // division (9) are commonly used for the modulus operation. The other rounding modes can also
      // be used, but they may not give useful results.
      modulo: 1,                             // 0 to 9

      // The exponent value at and beneath which `toString` returns exponential notation.
      // JavaScript numbers: -7
      toExpNeg: -7,                          // 0 to -EXP_LIMIT

      // The exponent value at and above which `toString` returns exponential notation.
      // JavaScript numbers: 21
      toExpPos:  21,                         // 0 to EXP_LIMIT

      // The minimum exponent value, beneath which underflow to zero occurs.
      // JavaScript numbers: -324  (5e-324)
      minE: -EXP_LIMIT,                      // -1 to -EXP_LIMIT

      // The maximum exponent value, above which overflow to Infinity occurs.
      // JavaScript numbers: 308  (1.7976931348623157e+308)
      maxE: EXP_LIMIT,                       // 1 to EXP_LIMIT

      // Whether to use cryptographically-secure random number generation, if available.
      crypto: false                          // true/false
    },


  // ----------------------------------- END OF EDITABLE DEFAULTS ------------------------------- //


    Decimal, inexact, noConflict, quadrant,
    external = true,

    decimalError = '[DecimalError] ',
    invalidArgument = decimalError + 'Invalid argument: ',
    precisionLimitExceeded = decimalError + 'Precision limit exceeded',
    cryptoUnavailable = decimalError + 'crypto unavailable',

    mathfloor = Math.floor,
    mathpow = Math.pow,

    isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i,
    isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i,
    isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i,
    isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,

    BASE = 1e7,
    LOG_BASE = 7,
    MAX_SAFE_INTEGER = 9007199254740991,

    LN10_PRECISION = LN10.length - 1,
    PI_PRECISION = PI.length - 1,

    // Decimal.prototype object
    P = { name: '[object Decimal]' };


  // Decimal prototype methods


  /*
   *  absoluteValue             abs
   *  ceil
   *  comparedTo                cmp
   *  cosine                    cos
   *  cubeRoot                  cbrt
   *  decimalPlaces             dp
   *  dividedBy                 div
   *  dividedToIntegerBy        divToInt
   *  equals                    eq
   *  floor
   *  greaterThan               gt
   *  greaterThanOrEqualTo      gte
   *  hyperbolicCosine          cosh
   *  hyperbolicSine            sinh
   *  hyperbolicTangent         tanh
   *  inverseCosine             acos
   *  inverseHyperbolicCosine   acosh
   *  inverseHyperbolicSine     asinh
   *  inverseHyperbolicTangent  atanh
   *  inverseSine               asin
   *  inverseTangent            atan
   *  isFinite
   *  isInteger                 isInt
   *  isNaN
   *  isNegative                isNeg
   *  isPositive                isPos
   *  isZero
   *  lessThan                  lt
   *  lessThanOrEqualTo         lte
   *  logarithm                 log
   *  [maximum]                 [max]
   *  [minimum]                 [min]
   *  minus                     sub
   *  modulo                    mod
   *  naturalExponential        exp
   *  naturalLogarithm          ln
   *  negated                   neg
   *  plus                      add
   *  precision                 sd
   *  round
   *  sine                      sin
   *  squareRoot                sqrt
   *  tangent                   tan
   *  times                     mul
   *  toBinary
   *  toDecimalPlaces           toDP
   *  toExponential
   *  toFixed
   *  toFraction
   *  toHexadecimal             toHex
   *  toNearest
   *  toNumber
   *  toOctal
   *  toPower                   pow
   *  toPrecision
   *  toSignificantDigits       toSD
   *  toString
   *  truncated                 trunc
   *  valueOf                   toJSON
   */


  /*
   * Return a new Decimal whose value is the absolute value of this Decimal.
   *
   */
  P.absoluteValue = P.abs = function () {
    var x = new this.constructor(this);
    if (x.s < 0) x.s = 1;
    return finalise(x);
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a whole number in the
   * direction of positive Infinity.
   *
   */
  P.ceil = function () {
    return finalise(new this.constructor(this), this.e + 1, 2);
  };


  /*
   * Return
   *   1    if the value of this Decimal is greater than the value of `y`,
   *  -1    if the value of this Decimal is less than the value of `y`,
   *   0    if they have the same value,
   *   NaN  if the value of either Decimal is NaN.
   *
   */
  P.comparedTo = P.cmp = function (y) {
    var i, j, xdL, ydL,
      x = this,
      xd = x.d,
      yd = (y = new x.constructor(y)).d,
      xs = x.s,
      ys = y.s;

    // Either NaN or ±Infinity?
    if (!xd || !yd) {
      return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
    }

    // Either zero?
    if (!xd[0] || !yd[0]) return xd[0] ? xs : yd[0] ? -ys : 0;

    // Signs differ?
    if (xs !== ys) return xs;

    // Compare exponents.
    if (x.e !== y.e) return x.e > y.e ^ xs < 0 ? 1 : -1;

    xdL = xd.length;
    ydL = yd.length;

    // Compare digit by digit.
    for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) {
      if (xd[i] !== yd[i]) return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
    }

    // Compare lengths.
    return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
  };


  /*
   * Return a new Decimal whose value is the cosine of the value in radians of this Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-1, 1]
   *
   * cos(0)         = 1
   * cos(-0)        = 1
   * cos(Infinity)  = NaN
   * cos(-Infinity) = NaN
   * cos(NaN)       = NaN
   *
   */
  P.cosine = P.cos = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (!x.d) return new Ctor(NaN);

    // cos(0) = cos(-0) = 1
    if (!x.d[0]) return new Ctor(1);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
    Ctor.rounding = 1;

    x = cosine(Ctor, toLessThanHalfPi(Ctor, x));

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return finalise(quadrant == 2 || quadrant == 3 ? x.neg() : x, pr, rm, true);
  };


  /*
   *
   * Return a new Decimal whose value is the cube root of the value of this Decimal, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   *  cbrt(0)  =  0
   *  cbrt(-0) = -0
   *  cbrt(1)  =  1
   *  cbrt(-1) = -1
   *  cbrt(N)  =  N
   *  cbrt(-I) = -I
   *  cbrt(I)  =  I
   *
   * Math.cbrt(x) = (x < 0 ? -Math.pow(-x, 1/3) : Math.pow(x, 1/3))
   *
   */
  P.cubeRoot = P.cbrt = function () {
    var e, m, n, r, rep, s, sd, t, t3, t3plusx,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite() || x.isZero()) return new Ctor(x);
    external = false;

    // Initial estimate.
    s = x.s * Math.pow(x.s * x, 1 / 3);

     // Math.cbrt underflow/overflow?
     // Pass x to Math.pow as integer, then adjust the exponent of the result.
    if (!s || Math.abs(s) == 1 / 0) {
      n = digitsToString(x.d);
      e = x.e;

      // Adjust n exponent so it is a multiple of 3 away from x exponent.
      if (s = (e - n.length + 1) % 3) n += (s == 1 || s == -2 ? '0' : '00');
      s = Math.pow(n, 1 / 3);

      // Rarely, e may be one less than the result exponent value.
      e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));

      if (s == 1 / 0) {
        n = '5e' + e;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf('e') + 1) + e;
      }

      r = new Ctor(n);
      r.s = x.s;
    } else {
      r = new Ctor(s.toString());
    }

    sd = (e = Ctor.precision) + 3;

    // Halley's method.
    // TODO? Compare Newton's method.
    for (;;) {
      t = r;
      t3 = t.times(t).times(t);
      t3plusx = t3.plus(x);
      r = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1);

      // TODO? Replace with for-loop and checkRoundingDigits.
      if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
        n = n.slice(sd - 3, sd + 1);

        // The 4th rounding digit may be in error by -1 so if the 4 rounding digits are 9999 or 4999
        // , i.e. approaching a rounding boundary, continue the iteration.
        if (n == '9999' || !rep && n == '4999') {

          // On the first iteration only, check to see if rounding up gives the exact result as the
          // nines may infinitely repeat.
          if (!rep) {
            finalise(t, e + 1, 0);

            if (t.times(t).times(t).eq(x)) {
              r = t;
              break;
            }
          }

          sd += 4;
          rep = 1;
        } else {

          // If the rounding digits are null, 0{0,4} or 50{0,3}, check for an exact result.
          // If not, then there are further digits and m will be truthy.
          if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

            // Truncate to the first rounding digit.
            finalise(r, e + 1, 1);
            m = !r.times(r).times(r).eq(x);
          }

          break;
        }
      }
    }

    external = true;

    return finalise(r, e, Ctor.rounding, m);
  };


  /*
   * Return the number of decimal places of the value of this Decimal.
   *
   */
  P.decimalPlaces = P.dp = function () {
    var w,
      d = this.d,
      n = NaN;

    if (d) {
      w = d.length - 1;
      n = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE;

      // Subtract the number of trailing zeros of the last word.
      w = d[w];
      if (w) for (; w % 10 == 0; w /= 10) n--;
      if (n < 0) n = 0;
    }

    return n;
  };


  /*
   *  n / 0 = I
   *  n / N = N
   *  n / I = 0
   *  0 / n = 0
   *  0 / 0 = N
   *  0 / N = N
   *  0 / I = 0
   *  N / n = N
   *  N / 0 = N
   *  N / N = N
   *  N / I = N
   *  I / n = I
   *  I / 0 = I
   *  I / N = N
   *  I / I = N
   *
   * Return a new Decimal whose value is the value of this Decimal divided by `y`, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   */
  P.dividedBy = P.div = function (y) {
    return divide(this, new this.constructor(y));
  };


  /*
   * Return a new Decimal whose value is the integer part of dividing the value of this Decimal
   * by the value of `y`, rounded to `precision` significant digits using rounding mode `rounding`.
   *
   */
  P.dividedToIntegerBy = P.divToInt = function (y) {
    var x = this,
      Ctor = x.constructor;
    return finalise(divide(x, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
  };


  /*
   * Return true if the value of this Decimal is equal to the value of `y`, otherwise return false.
   *
   */
  P.equals = P.eq = function (y) {
    return this.cmp(y) === 0;
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a whole number in the
   * direction of negative Infinity.
   *
   */
  P.floor = function () {
    return finalise(new this.constructor(this), this.e + 1, 3);
  };


  /*
   * Return true if the value of this Decimal is greater than the value of `y`, otherwise return
   * false.
   *
   */
  P.greaterThan = P.gt = function (y) {
    return this.cmp(y) > 0;
  };


  /*
   * Return true if the value of this Decimal is greater than or equal to the value of `y`,
   * otherwise return false.
   *
   */
  P.greaterThanOrEqualTo = P.gte = function (y) {
    var k = this.cmp(y);
    return k == 1 || k === 0;
  };


  /*
   * Return a new Decimal whose value is the hyperbolic cosine of the value in radians of this
   * Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [1, Infinity]
   *
   * cosh(x) = 1 + x^2/2! + x^4/4! + x^6/6! + ...
   *
   * cosh(0)         = 1
   * cosh(-0)        = 1
   * cosh(Infinity)  = Infinity
   * cosh(-Infinity) = Infinity
   * cosh(NaN)       = NaN
   *
   *  x        time taken (ms)   result
   * 1000      9                 9.8503555700852349694e+433
   * 10000     25                4.4034091128314607936e+4342
   * 100000    171               1.4033316802130615897e+43429
   * 1000000   3817              1.5166076984010437725e+434294
   * 10000000  abandoned after 2 minute wait
   *
   * TODO? Compare performance of cosh(x) = 0.5 * (exp(x) + exp(-x))
   *
   */
  P.hyperbolicCosine = P.cosh = function () {
    var k, n, pr, rm, len,
      x = this,
      Ctor = x.constructor,
      one = new Ctor(1);

    if (!x.isFinite()) return new Ctor(x.s ? 1 / 0 : NaN);
    if (x.isZero()) return one;

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
    Ctor.rounding = 1;
    len = x.d.length;

    // Argument reduction: cos(4x) = 1 - 8cos^2(x) + 8cos^4(x) + 1
    // i.e. cos(x) = 1 - cos^2(x/4)(8 - 8cos^2(x/4))

    // Estimate the optimum number of times to use the argument reduction.
    // TODO? Estimation reused from cosine() and may not be optimal here.
    if (len < 32) {
      k = Math.ceil(len / 3);
      n = Math.pow(4, -k).toString();
    } else {
      k = 16;
      n = '2.3283064365386962890625e-10';
    }

    x = taylorSeries(Ctor, 1, x.times(n), new Ctor(1), true);

    // Reverse argument reduction
    var cosh2_x,
      i = k,
      d8 = new Ctor(8);
    for (; i--;) {
      cosh2_x = x.times(x);
      x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
    }

    return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
  };


  /*
   * Return a new Decimal whose value is the hyperbolic sine of the value in radians of this
   * Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-Infinity, Infinity]
   *
   * sinh(x) = x + x^3/3! + x^5/5! + x^7/7! + ...
   *
   * sinh(0)         = 0
   * sinh(-0)        = -0
   * sinh(Infinity)  = Infinity
   * sinh(-Infinity) = -Infinity
   * sinh(NaN)       = NaN
   *
   * x        time taken (ms)
   * 10       2 ms
   * 100      5 ms
   * 1000     14 ms
   * 10000    82 ms
   * 100000   886 ms            1.4033316802130615897e+43429
   * 200000   2613 ms
   * 300000   5407 ms
   * 400000   8824 ms
   * 500000   13026 ms          8.7080643612718084129e+217146
   * 1000000  48543 ms
   *
   * TODO? Compare performance of sinh(x) = 0.5 * (exp(x) - exp(-x))
   *
   */
  P.hyperbolicSine = P.sinh = function () {
    var k, pr, rm, len,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite() || x.isZero()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
    Ctor.rounding = 1;
    len = x.d.length;

    if (len < 3) {
      x = taylorSeries(Ctor, 2, x, x, true);
    } else {

      // Alternative argument reduction: sinh(3x) = sinh(x)(3 + 4sinh^2(x))
      // i.e. sinh(x) = sinh(x/3)(3 + 4sinh^2(x/3))
      // 3 multiplications and 1 addition

      // Argument reduction: sinh(5x) = sinh(x)(5 + sinh^2(x)(20 + 16sinh^2(x)))
      // i.e. sinh(x) = sinh(x/5)(5 + sinh^2(x/5)(20 + 16sinh^2(x/5)))
      // 4 multiplications and 2 additions

      // Estimate the optimum number of times to use the argument reduction.
      k = 1.4 * Math.sqrt(len);
      k = k > 16 ? 16 : k | 0;

      x = x.times(Math.pow(5, -k));

      x = taylorSeries(Ctor, 2, x, x, true);

      // Reverse argument reduction
      var sinh2_x,
        d5 = new Ctor(5),
        d16 = new Ctor(16),
        d20 = new Ctor(20);
      for (; k--;) {
        sinh2_x = x.times(x);
        x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
      }
    }

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return finalise(x, pr, rm, true);
  };


  /*
   * Return a new Decimal whose value is the hyperbolic tangent of the value in radians of this
   * Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-1, 1]
   *
   * tanh(x) = sinh(x) / cosh(x)
   *
   * tanh(0)         = 0
   * tanh(-0)        = -0
   * tanh(Infinity)  = 1
   * tanh(-Infinity) = -1
   * tanh(NaN)       = NaN
   *
   */
  P.hyperbolicTangent = P.tanh = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite()) return new Ctor(x.s);
    if (x.isZero()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 7;
    Ctor.rounding = 1;

    return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
  };


  /*
   * Return a new Decimal whose value is the arccosine (inverse cosine) in radians of the value of
   * this Decimal.
   *
   * Domain: [-1, 1]
   * Range: [0, pi]
   *
   * acos(x) = pi/2 - asin(x)
   *
   * acos(0)       = pi/2
   * acos(-0)      = pi/2
   * acos(1)       = 0
   * acos(-1)      = pi
   * acos(1/2)     = pi/3
   * acos(-1/2)    = 2*pi/3
   * acos(|x| > 1) = NaN
   * acos(NaN)     = NaN
   *
   */
  P.inverseCosine = P.acos = function () {
    var halfPi,
      x = this,
      Ctor = x.constructor,
      k = x.abs().cmp(1),
      pr = Ctor.precision,
      rm = Ctor.rounding;

    if (k !== -1) {
      return k === 0
        // |x| is 1
        ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0)
        // |x| > 1 or x is NaN
        : new Ctor(NaN);
    }

    if (x.isZero()) return getPi(Ctor, pr + 4, rm).times(0.5);

    // TODO? Special case acos(0.5) = pi/3 and acos(-0.5) = 2*pi/3

    Ctor.precision = pr + 6;
    Ctor.rounding = 1;

    x = x.asin();
    halfPi = getPi(Ctor, pr + 4, rm).times(0.5);

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return halfPi.minus(x);
  };


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic cosine in radians of the
   * value of this Decimal.
   *
   * Domain: [1, Infinity]
   * Range: [0, Infinity]
   *
   * acosh(x) = ln(x + sqrt(x^2 - 1))
   *
   * acosh(x < 1)     = NaN
   * acosh(NaN)       = NaN
   * acosh(Infinity)  = Infinity
   * acosh(-Infinity) = NaN
   * acosh(0)         = NaN
   * acosh(-0)        = NaN
   * acosh(1)         = 0
   * acosh(-1)        = NaN
   *
   */
  P.inverseHyperbolicCosine = P.acosh = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (x.lte(1)) return new Ctor(x.eq(1) ? 0 : NaN);
    if (!x.isFinite()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(Math.abs(x.e), x.sd()) + 4;
    Ctor.rounding = 1;
    external = false;

    x = x.times(x).minus(1).sqrt().plus(x);

    external = true;
    Ctor.precision = pr;
    Ctor.rounding = rm;

    return x.ln();
  };


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic sine in radians of the value
   * of this Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-Infinity, Infinity]
   *
   * asinh(x) = ln(x + sqrt(x^2 + 1))
   *
   * asinh(NaN)       = NaN
   * asinh(Infinity)  = Infinity
   * asinh(-Infinity) = -Infinity
   * asinh(0)         = 0
   * asinh(-0)        = -0
   *
   */
  P.inverseHyperbolicSine = P.asinh = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite() || x.isZero()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 2 * Math.max(Math.abs(x.e), x.sd()) + 6;
    Ctor.rounding = 1;
    external = false;

    x = x.times(x).plus(1).sqrt().plus(x);

    external = true;
    Ctor.precision = pr;
    Ctor.rounding = rm;

    return x.ln();
  };


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic tangent in radians of the
   * value of this Decimal.
   *
   * Domain: [-1, 1]
   * Range: [-Infinity, Infinity]
   *
   * atanh(x) = 0.5 * ln((1 + x) / (1 - x))
   *
   * atanh(|x| > 1)   = NaN
   * atanh(NaN)       = NaN
   * atanh(Infinity)  = NaN
   * atanh(-Infinity) = NaN
   * atanh(0)         = 0
   * atanh(-0)        = -0
   * atanh(1)         = Infinity
   * atanh(-1)        = -Infinity
   *
   */
  P.inverseHyperbolicTangent = P.atanh = function () {
    var pr, rm, wpr, xsd,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite()) return new Ctor(NaN);
    if (x.e >= 0) return new Ctor(x.abs().eq(1) ? x.s / 0 : x.isZero() ? x : NaN);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    xsd = x.sd();

    if (Math.max(xsd, pr) < 2 * -x.e - 1) return finalise(new Ctor(x), pr, rm, true);

    Ctor.precision = wpr = xsd - x.e;

    x = divide(x.plus(1), new Ctor(1).minus(x), wpr + pr, 1);

    Ctor.precision = pr + 4;
    Ctor.rounding = 1;

    x = x.ln();

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return x.times(0.5);
  };


  /*
   * Return a new Decimal whose value is the arcsine (inverse sine) in radians of the value of this
   * Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-pi/2, pi/2]
   *
   * asin(x) = 2*atan(x/(1 + sqrt(1 - x^2)))
   *
   * asin(0)       = 0
   * asin(-0)      = -0
   * asin(1/2)     = pi/6
   * asin(-1/2)    = -pi/6
   * asin(1)       = pi/2
   * asin(-1)      = -pi/2
   * asin(|x| > 1) = NaN
   * asin(NaN)     = NaN
   *
   * TODO? Compare performance of Taylor series.
   *
   */
  P.inverseSine = P.asin = function () {
    var halfPi, k,
      pr, rm,
      x = this,
      Ctor = x.constructor;

    if (x.isZero()) return new Ctor(x);

    k = x.abs().cmp(1);
    pr = Ctor.precision;
    rm = Ctor.rounding;

    if (k !== -1) {

      // |x| is 1
      if (k === 0) {
        halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
        halfPi.s = x.s;
        return halfPi;
      }

      // |x| > 1 or x is NaN
      return new Ctor(NaN);
    }

    // TODO? Special case asin(1/2) = pi/6 and asin(-1/2) = -pi/6

    Ctor.precision = pr + 6;
    Ctor.rounding = 1;

    x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return x.times(2);
  };


  /*
   * Return a new Decimal whose value is the arctangent (inverse tangent) in radians of the value
   * of this Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-pi/2, pi/2]
   *
   * atan(x) = x - x^3/3 + x^5/5 - x^7/7 + ...
   *
   * atan(0)         = 0
   * atan(-0)        = -0
   * atan(1)         = pi/4
   * atan(-1)        = -pi/4
   * atan(Infinity)  = pi/2
   * atan(-Infinity) = -pi/2
   * atan(NaN)       = NaN
   *
   */
  P.inverseTangent = P.atan = function () {
    var i, j, k, n, px, t, r, wpr, x2,
      x = this,
      Ctor = x.constructor,
      pr = Ctor.precision,
      rm = Ctor.rounding;

    if (!x.isFinite()) {
      if (!x.s) return new Ctor(NaN);
      if (pr + 4 <= PI_PRECISION) {
        r = getPi(Ctor, pr + 4, rm).times(0.5);
        r.s = x.s;
        return r;
      }
    } else if (x.isZero()) {
      return new Ctor(x);
    } else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
      r = getPi(Ctor, pr + 4, rm).times(0.25);
      r.s = x.s;
      return r;
    }

    Ctor.precision = wpr = pr + 10;
    Ctor.rounding = 1;

    // TODO? if (x >= 1 && pr <= PI_PRECISION) atan(x) = halfPi * x.s - atan(1 / x);

    // Argument reduction
    // Ensure |x| < 0.42
    // atan(x) = 2 * atan(x / (1 + sqrt(1 + x^2)))

    k = Math.min(28, wpr / LOG_BASE + 2 | 0);

    for (i = k; i; --i) x = x.div(x.times(x).plus(1).sqrt().plus(1));

    external = false;

    j = Math.ceil(wpr / LOG_BASE);
    n = 1;
    x2 = x.times(x);
    r = new Ctor(x);
    px = x;

    // atan(x) = x - x^3/3 + x^5/5 - x^7/7 + ...
    for (; i !== -1;) {
      px = px.times(x2);
      t = r.minus(px.div(n += 2));

      px = px.times(x2);
      r = t.plus(px.div(n += 2));

      if (r.d[j] !== void 0) for (i = j; r.d[i] === t.d[i] && i--;);
    }

    if (k) r = r.times(2 << (k - 1));

    external = true;

    return finalise(r, Ctor.precision = pr, Ctor.rounding = rm, true);
  };


  /*
   * Return true if the value of this Decimal is a finite number, otherwise return false.
   *
   */
  P.isFinite = function () {
    return !!this.d;
  };


  /*
   * Return true if the value of this Decimal is an integer, otherwise return false.
   *
   */
  P.isInteger = P.isInt = function () {
    return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
  };


  /*
   * Return true if the value of this Decimal is NaN, otherwise return false.
   *
   */
  P.isNaN = function () {
    return !this.s;
  };


  /*
   * Return true if the value of this Decimal is negative, otherwise return false.
   *
   */
  P.isNegative = P.isNeg = function () {
    return this.s < 0;
  };


  /*
   * Return true if the value of this Decimal is positive, otherwise return false.
   *
   */
  P.isPositive = P.isPos = function () {
    return this.s > 0;
  };


  /*
   * Return true if the value of this Decimal is 0 or -0, otherwise return false.
   *
   */
  P.isZero = function () {
    return !!this.d && this.d[0] === 0;
  };


  /*
   * Return true if the value of this Decimal is less than `y`, otherwise return false.
   *
   */
  P.lessThan = P.lt = function (y) {
    return this.cmp(y) < 0;
  };


  /*
   * Return true if the value of this Decimal is less than or equal to `y`, otherwise return false.
   *
   */
  P.lessThanOrEqualTo = P.lte = function (y) {
    return this.cmp(y) < 1;
  };


  /*
   * Return the logarithm of the value of this Decimal to the specified base, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * If no base is specified, return log[10](arg).
   *
   * log[base](arg) = ln(arg) / ln(base)
   *
   * The result will always be correctly rounded if the base of the log is 10, and 'almost always'
   * otherwise:
   *
   * Depending on the rounding mode, the result may be incorrectly rounded if the first fifteen
   * rounding digits are [49]99999999999999 or [50]00000000000000. In that case, the maximum error
   * between the result and the correctly rounded result will be one ulp (unit in the last place).
   *
   * log[-b](a)       = NaN
   * log[0](a)        = NaN
   * log[1](a)        = NaN
   * log[NaN](a)      = NaN
   * log[Infinity](a) = NaN
   * log[b](0)        = -Infinity
   * log[b](-0)       = -Infinity
   * log[b](-a)       = NaN
   * log[b](1)        = 0
   * log[b](Infinity) = Infinity
   * log[b](NaN)      = NaN
   *
   * [base] {number|string|Decimal} The base of the logarithm.
   *
   */
  P.logarithm = P.log = function (base) {
    var isBase10, d, denominator, k, inf, num, sd, r,
      arg = this,
      Ctor = arg.constructor,
      pr = Ctor.precision,
      rm = Ctor.rounding,
      guard = 5;

    // Default base is 10.
    if (base == null) {
      base = new Ctor(10);
      isBase10 = true;
    } else {
      base = new Ctor(base);
      d = base.d;

      // Return NaN if base is negative, or non-finite, or is 0 or 1.
      if (base.s < 0 || !d || !d[0] || base.eq(1)) return new Ctor(NaN);

      isBase10 = base.eq(10);
    }

    d = arg.d;

    // Is arg negative, non-finite, 0 or 1?
    if (arg.s < 0 || !d || !d[0] || arg.eq(1)) {
      return new Ctor(d && !d[0] ? -1 / 0 : arg.s != 1 ? NaN : d ? 0 : 1 / 0);
    }

    // The result will have a non-terminating decimal expansion if base is 10 and arg is not an
    // integer power of 10.
    if (isBase10) {
      if (d.length > 1) {
        inf = true;
      } else {
        for (k = d[0]; k % 10 === 0;) k /= 10;
        inf = k !== 1;
      }
    }

    external = false;
    sd = pr + guard;
    num = naturalLogarithm(arg, sd);
    denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);

    // The result will have 5 rounding digits.
    r = divide(num, denominator, sd, 1);

    // If at a rounding boundary, i.e. the result's rounding digits are [49]9999 or [50]0000,
    // calculate 10 further digits.
    //
    // If the result is known to have an infinite decimal expansion, repeat this until it is clear
    // that the result is above or below the boundary. Otherwise, if after calculating the 10
    // further digits, the last 14 are nines, round up and assume the result is exact.
    // Also assume the result is exact if the last 14 are zero.
    //
    // Example of a result that will be incorrectly rounded:
    // log[1048576](4503599627370502) = 2.60000000000000009610279511444746...
    // The above result correctly rounded using ROUND_CEIL to 1 decimal place should be 2.7, but it
    // will be given as 2.6 as there are 15 zeros immediately after the requested decimal place, so
    // the exact result would be assumed to be 2.6, which rounded using ROUND_CEIL to 1 decimal
    // place is still 2.6.
    if (checkRoundingDigits(r.d, k = pr, rm)) {

      do {
        sd += 10;
        num = naturalLogarithm(arg, sd);
        denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
        r = divide(num, denominator, sd, 1);

        if (!inf) {

          // Check for 14 nines from the 2nd rounding digit, as the first may be 4.
          if (+digitsToString(r.d).slice(k + 1, k + 15) + 1 == 1e14) {
            r = finalise(r, pr + 1, 0);
          }

          break;
        }
      } while (checkRoundingDigits(r.d, k += 10, rm));
    }

    external = true;

    return finalise(r, pr, rm);
  };


  /*
   * Return a new Decimal whose value is the maximum of the arguments and the value of this Decimal.
   *
   * arguments {number|string|Decimal}
   *
  P.max = function () {
    Array.prototype.push.call(arguments, this);
    return maxOrMin(this.constructor, arguments, 'lt');
  };
   */


  /*
   * Return a new Decimal whose value is the minimum of the arguments and the value of this Decimal.
   *
   * arguments {number|string|Decimal}
   *
  P.min = function () {
    Array.prototype.push.call(arguments, this);
    return maxOrMin(this.constructor, arguments, 'gt');
  };
   */


  /*
   *  n - 0 = n
   *  n - N = N
   *  n - I = -I
   *  0 - n = -n
   *  0 - 0 = 0
   *  0 - N = N
   *  0 - I = -I
   *  N - n = N
   *  N - 0 = N
   *  N - N = N
   *  N - I = N
   *  I - n = I
   *  I - 0 = I
   *  I - N = N
   *  I - I = N
   *
   * Return a new Decimal whose value is the value of this Decimal minus `y`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   */
  P.minus = P.sub = function (y) {
    var d, e, i, j, k, len, pr, rm, xd, xe, xLTy, yd,
      x = this,
      Ctor = x.constructor;

    y = new Ctor(y);

    // If either is not finite...
    if (!x.d || !y.d) {

      // Return NaN if either is NaN.
      if (!x.s || !y.s) y = new Ctor(NaN);

      // Return y negated if x is finite and y is ±Infinity.
      else if (x.d) y.s = -y.s;

      // Return x if y is finite and x is ±Infinity.
      // Return x if both are ±Infinity with different signs.
      // Return NaN if both are ±Infinity with the same sign.
      else y = new Ctor(y.d || x.s !== y.s ? x : NaN);

      return y;
    }

    // If signs differ...
    if (x.s != y.s) {
      y.s = -y.s;
      return x.plus(y);
    }

    xd = x.d;
    yd = y.d;
    pr = Ctor.precision;
    rm = Ctor.rounding;

    // If either is zero...
    if (!xd[0] || !yd[0]) {

      // Return y negated if x is zero and y is non-zero.
      if (yd[0]) y.s = -y.s;

      // Return x if y is zero and x is non-zero.
      else if (xd[0]) y = new Ctor(x);

      // Return zero if both are zero.
      // From IEEE 754 (2008) 6.3: 0 - 0 = -0 - -0 = -0 when rounding to -Infinity.
      else return new Ctor(rm === 3 ? -0 : 0);

      return external ? finalise(y, pr, rm) : y;
    }

    // x and y are finite, non-zero numbers with the same sign.

    // Calculate base 1e7 exponents.
    e = mathfloor(y.e / LOG_BASE);
    xe = mathfloor(x.e / LOG_BASE);

    xd = xd.slice();
    k = xe - e;

    // If base 1e7 exponents differ...
    if (k) {
      xLTy = k < 0;

      if (xLTy) {
        d = xd;
        k = -k;
        len = yd.length;
      } else {
        d = yd;
        e = xe;
        len = xd.length;
      }

      // Numbers with massively different exponents would result in a very high number of
      // zeros needing to be prepended, but this can be avoided while still ensuring correct
      // rounding by limiting the number of zeros to `Math.ceil(pr / LOG_BASE) + 2`.
      i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;

      if (k > i) {
        k = i;
        d.length = 1;
      }

      // Prepend zeros to equalise exponents.
      d.reverse();
      for (i = k; i--;) d.push(0);
      d.reverse();

    // Base 1e7 exponents equal.
    } else {

      // Check digits to determine which is the bigger number.

      i = xd.length;
      len = yd.length;
      xLTy = i < len;
      if (xLTy) len = i;

      for (i = 0; i < len; i++) {
        if (xd[i] != yd[i]) {
          xLTy = xd[i] < yd[i];
          break;
        }
      }

      k = 0;
    }

    if (xLTy) {
      d = xd;
      xd = yd;
      yd = d;
      y.s = -y.s;
    }

    len = xd.length;

    // Append zeros to `xd` if shorter.
    // Don't add zeros to `yd` if shorter as subtraction only needs to start at `yd` length.
    for (i = yd.length - len; i > 0; --i) xd[len++] = 0;

    // Subtract yd from xd.
    for (i = yd.length; i > k;) {

      if (xd[--i] < yd[i]) {
        for (j = i; j && xd[--j] === 0;) xd[j] = BASE - 1;
        --xd[j];
        xd[i] += BASE;
      }

      xd[i] -= yd[i];
    }

    // Remove trailing zeros.
    for (; xd[--len] === 0;) xd.pop();

    // Remove leading zeros and adjust exponent accordingly.
    for (; xd[0] === 0; xd.shift()) --e;

    // Zero?
    if (!xd[0]) return new Ctor(rm === 3 ? -0 : 0);

    y.d = xd;
    y.e = getBase10Exponent(xd, e);

    return external ? finalise(y, pr, rm) : y;
  };


  /*
   *   n % 0 =  N
   *   n % N =  N
   *   n % I =  n
   *   0 % n =  0
   *  -0 % n = -0
   *   0 % 0 =  N
   *   0 % N =  N
   *   0 % I =  0
   *   N % n =  N
   *   N % 0 =  N
   *   N % N =  N
   *   N % I =  N
   *   I % n =  N
   *   I % 0 =  N
   *   I % N =  N
   *   I % I =  N
   *
   * Return a new Decimal whose value is the value of this Decimal modulo `y`, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   * The result depends on the modulo mode.
   *
   */
  P.modulo = P.mod = function (y) {
    var q,
      x = this,
      Ctor = x.constructor;

    y = new Ctor(y);

    // Return NaN if x is ±Infinity or NaN, or y is NaN or ±0.
    if (!x.d || !y.s || y.d && !y.d[0]) return new Ctor(NaN);

    // Return x if y is ±Infinity or x is ±0.
    if (!y.d || x.d && !x.d[0]) {
      return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
    }

    // Prevent rounding of intermediate calculations.
    external = false;

    if (Ctor.modulo == 9) {

      // Euclidian division: q = sign(y) * floor(x / abs(y))
      // result = x - q * y    where  0 <= result < abs(y)
      q = divide(x, y.abs(), 0, 3, 1);
      q.s *= y.s;
    } else {
      q = divide(x, y, 0, Ctor.modulo, 1);
    }

    q = q.times(y);

    external = true;

    return x.minus(q);
  };


  /*
   * Return a new Decimal whose value is the natural exponential of the value of this Decimal,
   * i.e. the base e raised to the power the value of this Decimal, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   */
  P.naturalExponential = P.exp = function () {
    return naturalExponential(this);
  };


  /*
   * Return a new Decimal whose value is the natural logarithm of the value of this Decimal,
   * rounded to `precision` significant digits using rounding mode `rounding`.
   *
   */
  P.naturalLogarithm = P.ln = function () {
    return naturalLogarithm(this);
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal negated, i.e. as if multiplied by
   * -1.
   *
   */
  P.negated = P.neg = function () {
    var x = new this.constructor(this);
    x.s = -x.s;
    return finalise(x);
  };


  /*
   *  n + 0 = n
   *  n + N = N
   *  n + I = I
   *  0 + n = n
   *  0 + 0 = 0
   *  0 + N = N
   *  0 + I = I
   *  N + n = N
   *  N + 0 = N
   *  N + N = N
   *  N + I = N
   *  I + n = I
   *  I + 0 = I
   *  I + N = N
   *  I + I = I
   *
   * Return a new Decimal whose value is the value of this Decimal plus `y`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   */
  P.plus = P.add = function (y) {
    var carry, d, e, i, k, len, pr, rm, xd, yd,
      x = this,
      Ctor = x.constructor;

    y = new Ctor(y);

    // If either is not finite...
    if (!x.d || !y.d) {

      // Return NaN if either is NaN.
      if (!x.s || !y.s) y = new Ctor(NaN);

      // Return x if y is finite and x is ±Infinity.
      // Return x if both are ±Infinity with the same sign.
      // Return NaN if both are ±Infinity with different signs.
      // Return y if x is finite and y is ±Infinity.
      else if (!x.d) y = new Ctor(y.d || x.s === y.s ? x : NaN);

      return y;
    }

     // If signs differ...
    if (x.s != y.s) {
      y.s = -y.s;
      return x.minus(y);
    }

    xd = x.d;
    yd = y.d;
    pr = Ctor.precision;
    rm = Ctor.rounding;

    // If either is zero...
    if (!xd[0] || !yd[0]) {

      // Return x if y is zero.
      // Return y if y is non-zero.
      if (!yd[0]) y = new Ctor(x);

      return external ? finalise(y, pr, rm) : y;
    }

    // x and y are finite, non-zero numbers with the same sign.

    // Calculate base 1e7 exponents.
    k = mathfloor(x.e / LOG_BASE);
    e = mathfloor(y.e / LOG_BASE);

    xd = xd.slice();
    i = k - e;

    // If base 1e7 exponents differ...
    if (i) {

      if (i < 0) {
        d = xd;
        i = -i;
        len = yd.length;
      } else {
        d = yd;
        e = k;
        len = xd.length;
      }

      // Limit number of zeros prepended to max(ceil(pr / LOG_BASE), len) + 1.
      k = Math.ceil(pr / LOG_BASE);
      len = k > len ? k + 1 : len + 1;

      if (i > len) {
        i = len;
        d.length = 1;
      }

      // Prepend zeros to equalise exponents. Note: Faster to use reverse then do unshifts.
      d.reverse();
      for (; i--;) d.push(0);
      d.reverse();
    }

    len = xd.length;
    i = yd.length;

    // If yd is longer than xd, swap xd and yd so xd points to the longer array.
    if (len - i < 0) {
      i = len;
      d = yd;
      yd = xd;
      xd = d;
    }

    // Only start adding at yd.length - 1 as the further digits of xd can be left as they are.
    for (carry = 0; i;) {
      carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
      xd[i] %= BASE;
    }

    if (carry) {
      xd.unshift(carry);
      ++e;
    }

    // Remove trailing zeros.
    // No need to check for zero, as +x + +y != 0 && -x + -y != 0
    for (len = xd.length; xd[--len] == 0;) xd.pop();

    y.d = xd;
    y.e = getBase10Exponent(xd, e);

    return external ? finalise(y, pr, rm) : y;
  };


  /*
   * Return the number of significant digits of the value of this Decimal.
   *
   * [z] {boolean|number} Whether to count integer-part trailing zeros: true, false, 1 or 0.
   *
   */
  P.precision = P.sd = function (z) {
    var k,
      x = this;

    if (z !== void 0 && z !== !!z && z !== 1 && z !== 0) throw Error(invalidArgument + z);

    if (x.d) {
      k = getPrecision(x.d);
      if (z && x.e + 1 > k) k = x.e + 1;
    } else {
      k = NaN;
    }

    return k;
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a whole number using
   * rounding mode `rounding`.
   *
   */
  P.round = function () {
    var x = this,
      Ctor = x.constructor;

    return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
  };


  /*
   * Return a new Decimal whose value is the sine of the value in radians of this Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-1, 1]
   *
   * sin(x) = x - x^3/3! + x^5/5! - ...
   *
   * sin(0)         = 0
   * sin(-0)        = -0
   * sin(Infinity)  = NaN
   * sin(-Infinity) = NaN
   * sin(NaN)       = NaN
   *
   */
  P.sine = P.sin = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite()) return new Ctor(NaN);
    if (x.isZero()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
    Ctor.rounding = 1;

    x = sine(Ctor, toLessThanHalfPi(Ctor, x));

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return finalise(quadrant > 2 ? x.neg() : x, pr, rm, true);
  };


  /*
   * Return a new Decimal whose value is the square root of this Decimal, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   *  sqrt(-n) =  N
   *  sqrt(N)  =  N
   *  sqrt(-I) =  N
   *  sqrt(I)  =  I
   *  sqrt(0)  =  0
   *  sqrt(-0) = -0
   *
   */
  P.squareRoot = P.sqrt = function () {
    var m, n, sd, r, rep, t,
      x = this,
      d = x.d,
      e = x.e,
      s = x.s,
      Ctor = x.constructor;

    // Negative/NaN/Infinity/zero?
    if (s !== 1 || !d || !d[0]) {
      return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : 1 / 0);
    }

    external = false;

    // Initial estimate.
    s = Math.sqrt(+x);

    // Math.sqrt underflow/overflow?
    // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
    if (s == 0 || s == 1 / 0) {
      n = digitsToString(d);

      if ((n.length + e) % 2 == 0) n += '0';
      s = Math.sqrt(n);
      e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);

      if (s == 1 / 0) {
        n = '1e' + e;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf('e') + 1) + e;
      }

      r = new Ctor(n);
    } else {
      r = new Ctor(s.toString());
    }

    sd = (e = Ctor.precision) + 3;

    // Newton-Raphson iteration.
    for (;;) {
      t = r;
      r = t.plus(divide(x, t, sd + 2, 1)).times(0.5);

      // TODO? Replace with for-loop and checkRoundingDigits.
      if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
        n = n.slice(sd - 3, sd + 1);

        // The 4th rounding digit may be in error by -1 so if the 4 rounding digits are 9999 or
        // 4999, i.e. approaching a rounding boundary, continue the iteration.
        if (n == '9999' || !rep && n == '4999') {

          // On the first iteration only, check to see if rounding up gives the exact result as the
          // nines may infinitely repeat.
          if (!rep) {
            finalise(t, e + 1, 0);

            if (t.times(t).eq(x)) {
              r = t;
              break;
            }
          }

          sd += 4;
          rep = 1;
        } else {

          // If the rounding digits are null, 0{0,4} or 50{0,3}, check for an exact result.
          // If not, then there are further digits and m will be truthy.
          if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

            // Truncate to the first rounding digit.
            finalise(r, e + 1, 1);
            m = !r.times(r).eq(x);
          }

          break;
        }
      }
    }

    external = true;

    return finalise(r, e, Ctor.rounding, m);
  };


  /*
   * Return a new Decimal whose value is the tangent of the value in radians of this Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-Infinity, Infinity]
   *
   * tan(0)         = 0
   * tan(-0)        = -0
   * tan(Infinity)  = NaN
   * tan(-Infinity) = NaN
   * tan(NaN)       = NaN
   *
   */
  P.tangent = P.tan = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite()) return new Ctor(NaN);
    if (x.isZero()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 10;
    Ctor.rounding = 1;

    x = x.sin();
    x.s = 1;
    x = divide(x, new Ctor(1).minus(x.times(x)).sqrt(), pr + 10, 0);

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return finalise(quadrant == 2 || quadrant == 4 ? x.neg() : x, pr, rm, true);
  };


  /*
   *  n * 0 = 0
   *  n * N = N
   *  n * I = I
   *  0 * n = 0
   *  0 * 0 = 0
   *  0 * N = N
   *  0 * I = N
   *  N * n = N
   *  N * 0 = N
   *  N * N = N
   *  N * I = N
   *  I * n = I
   *  I * 0 = N
   *  I * N = N
   *  I * I = I
   *
   * Return a new Decimal whose value is this Decimal times `y`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   */
  P.times = P.mul = function (y) {
    var carry, e, i, k, r, rL, t, xdL, ydL,
      x = this,
      Ctor = x.constructor,
      xd = x.d,
      yd = (y = new Ctor(y)).d;

    y.s *= x.s;

     // If either is NaN, ±Infinity or ±0...
    if (!xd || !xd[0] || !yd || !yd[0]) {

      return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd

        // Return NaN if either is NaN.
        // Return NaN if x is ±0 and y is ±Infinity, or y is ±0 and x is ±Infinity.
        ? NaN

        // Return ±Infinity if either is ±Infinity.
        // Return ±0 if either is ±0.
        : !xd || !yd ? y.s / 0 : y.s * 0);
    }

    e = mathfloor(x.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
    xdL = xd.length;
    ydL = yd.length;

    // Ensure xd points to the longer array.
    if (xdL < ydL) {
      r = xd;
      xd = yd;
      yd = r;
      rL = xdL;
      xdL = ydL;
      ydL = rL;
    }

    // Initialise the result array with zeros.
    r = [];
    rL = xdL + ydL;
    for (i = rL; i--;) r.push(0);

    // Multiply!
    for (i = ydL; --i >= 0;) {
      carry = 0;
      for (k = xdL + i; k > i;) {
        t = r[k] + yd[i] * xd[k - i - 1] + carry;
        r[k--] = t % BASE | 0;
        carry = t / BASE | 0;
      }

      r[k] = (r[k] + carry) % BASE | 0;
    }

    // Remove trailing zeros.
    for (; !r[--rL];) r.pop();

    if (carry) ++e;
    else r.shift();

    y.d = r;
    y.e = getBase10Exponent(r, e);

    return external ? finalise(y, Ctor.precision, Ctor.rounding) : y;
  };


  /*
   * Return a string representing the value of this Decimal in base 2, round to `sd` significant
   * digits using rounding mode `rm`.
   *
   * If the optional `sd` argument is present then return binary exponential notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toBinary = function (sd, rm) {
    return toStringBinary(this, 2, sd, rm);
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of `dp`
   * decimal places using rounding mode `rm` or `rounding` if `rm` is omitted.
   *
   * If `dp` is omitted, return a new Decimal whose value is the value of this Decimal.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toDecimalPlaces = P.toDP = function (dp, rm) {
    var x = this,
      Ctor = x.constructor;

    x = new Ctor(x);
    if (dp === void 0) return x;

    checkInt32(dp, 0, MAX_DIGITS);

    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);

    return finalise(x, dp + x.e + 1, rm);
  };


  /*
   * Return a string representing the value of this Decimal in exponential notation rounded to
   * `dp` fixed decimal places using rounding mode `rounding`.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toExponential = function (dp, rm) {
    var str,
      x = this,
      Ctor = x.constructor;

    if (dp === void 0) {
      str = finiteToString(x, true);
    } else {
      checkInt32(dp, 0, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);

      x = finalise(new Ctor(x), dp + 1, rm);
      str = finiteToString(x, true, dp + 1);
    }

    return x.isNeg() && !x.isZero() ? '-' + str : str;
  };


  /*
   * Return a string representing the value of this Decimal in normal (fixed-point) notation to
   * `dp` fixed decimal places and rounded using rounding mode `rm` or `rounding` if `rm` is
   * omitted.
   *
   * As with JavaScript numbers, (-0).toFixed(0) is '0', but e.g. (-0.00001).toFixed(0) is '-0'.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
   * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
   * (-0).toFixed(3) is '0.000'.
   * (-0.5).toFixed(0) is '-0'.
   *
   */
  P.toFixed = function (dp, rm) {
    var str, y,
      x = this,
      Ctor = x.constructor;

    if (dp === void 0) {
      str = finiteToString(x);
    } else {
      checkInt32(dp, 0, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);

      y = finalise(new Ctor(x), dp + x.e + 1, rm);
      str = finiteToString(y, false, dp + y.e + 1);
    }

    // To determine whether to add the minus sign look at the value before it was rounded,
    // i.e. look at `x` rather than `y`.
    return x.isNeg() && !x.isZero() ? '-' + str : str;
  };


  /*
   * Return an array representing the value of this Decimal as a simple fraction with an integer
   * numerator and an integer denominator.
   *
   * The denominator will be a positive non-zero value less than or equal to the specified maximum
   * denominator. If a maximum denominator is not specified, the denominator will be the lowest
   * value necessary to represent the number exactly.
   *
   * [maxD] {number|string|Decimal} Maximum denominator. Integer >= 1 and < Infinity.
   *
   */
  P.toFraction = function (maxD) {
    var d, d0, d1, d2, e, k, n, n0, n1, pr, q, r,
      x = this,
      xd = x.d,
      Ctor = x.constructor;

    if (!xd) return new Ctor(x);

    n1 = d0 = new Ctor(1);
    d1 = n0 = new Ctor(0);

    d = new Ctor(d1);
    e = d.e = getPrecision(xd) - x.e - 1;
    k = e % LOG_BASE;
    d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);

    if (maxD == null) {

      // d is 10**e, the minimum max-denominator needed.
      maxD = e > 0 ? d : n1;
    } else {
      n = new Ctor(maxD);
      if (!n.isInt() || n.lt(n1)) throw Error(invalidArgument + n);
      maxD = n.gt(d) ? (e > 0 ? d : n1) : n;
    }

    external = false;
    n = new Ctor(digitsToString(xd));
    pr = Ctor.precision;
    Ctor.precision = e = xd.length * LOG_BASE * 2;

    for (;;)  {
      q = divide(n, d, 0, 1, 1);
      d2 = d0.plus(q.times(d1));
      if (d2.cmp(maxD) == 1) break;
      d0 = d1;
      d1 = d2;
      d2 = n1;
      n1 = n0.plus(q.times(d2));
      n0 = d2;
      d2 = d;
      d = n.minus(q.times(d2));
      n = d2;
    }

    d2 = divide(maxD.minus(d0), d1, 0, 1, 1);
    n0 = n0.plus(d2.times(n1));
    d0 = d0.plus(d2.times(d1));
    n0.s = n1.s = x.s;

    // Determine which fraction is closer to x, n0/d0 or n1/d1?
    r = divide(n1, d1, e, 1).minus(x).abs().cmp(divide(n0, d0, e, 1).minus(x).abs()) < 1
        ? [n1, d1] : [n0, d0];

    Ctor.precision = pr;
    external = true;

    return r;
  };


  /*
   * Return a string representing the value of this Decimal in base 16, round to `sd` significant
   * digits using rounding mode `rm`.
   *
   * If the optional `sd` argument is present then return binary exponential notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toHexadecimal = P.toHex = function (sd, rm) {
    return toStringBinary(this, 16, sd, rm);
  };



  /*
   * Returns a new Decimal whose value is the nearest multiple of `y` in the direction of rounding
   * mode `rm`, or `Decimal.rounding` if `rm` is omitted, to the value of this Decimal.
   *
   * The return value will always have the same sign as this Decimal, unless either this Decimal
   * or `y` is NaN, in which case the return value will be also be NaN.
   *
   * The return value is not affected by the value of `precision`.
   *
   * y {number|string|Decimal} The magnitude to round to a multiple of.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * 'toNearest() rounding mode not an integer: {rm}'
   * 'toNearest() rounding mode out of range: {rm}'
   *
   */
  P.toNearest = function (y, rm) {
    var x = this,
      Ctor = x.constructor;

    x = new Ctor(x);

    if (y == null) {

      // If x is not finite, return x.
      if (!x.d) return x;

      y = new Ctor(1);
      rm = Ctor.rounding;
    } else {
      y = new Ctor(y);
      if (rm === void 0) {
        rm = Ctor.rounding;
      } else {
        checkInt32(rm, 0, 8);
      }

      // If x is not finite, return x if y is not NaN, else NaN.
      if (!x.d) return y.s ? x : y;

      // If y is not finite, return Infinity with the sign of x if y is Infinity, else NaN.
      if (!y.d) {
        if (y.s) y.s = x.s;
        return y;
      }
    }

    // If y is not zero, calculate the nearest multiple of y to x.
    if (y.d[0]) {
      external = false;
      x = divide(x, y, 0, rm, 1).times(y);
      external = true;
      finalise(x);

    // If y is zero, return zero with the sign of x.
    } else {
      y.s = x.s;
      x = y;
    }

    return x;
  };


  /*
   * Return the value of this Decimal converted to a number primitive.
   * Zero keeps its sign.
   *
   */
  P.toNumber = function () {
    return +this;
  };


  /*
   * Return a string representing the value of this Decimal in base 8, round to `sd` significant
   * digits using rounding mode `rm`.
   *
   * If the optional `sd` argument is present then return binary exponential notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toOctal = function (sd, rm) {
    return toStringBinary(this, 8, sd, rm);
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal raised to the power `y`, rounded
   * to `precision` significant digits using rounding mode `rounding`.
   *
   * ECMAScript compliant.
   *
   *   pow(x, NaN)                           = NaN
   *   pow(x, ±0)                            = 1

   *   pow(NaN, non-zero)                    = NaN
   *   pow(abs(x) > 1, +Infinity)            = +Infinity
   *   pow(abs(x) > 1, -Infinity)            = +0
   *   pow(abs(x) == 1, ±Infinity)           = NaN
   *   pow(abs(x) < 1, +Infinity)            = +0
   *   pow(abs(x) < 1, -Infinity)            = +Infinity
   *   pow(+Infinity, y > 0)                 = +Infinity
   *   pow(+Infinity, y < 0)                 = +0
   *   pow(-Infinity, odd integer > 0)       = -Infinity
   *   pow(-Infinity, even integer > 0)      = +Infinity
   *   pow(-Infinity, odd integer < 0)       = -0
   *   pow(-Infinity, even integer < 0)      = +0
   *   pow(+0, y > 0)                        = +0
   *   pow(+0, y < 0)                        = +Infinity
   *   pow(-0, odd integer > 0)              = -0
   *   pow(-0, even integer > 0)             = +0
   *   pow(-0, odd integer < 0)              = -Infinity
   *   pow(-0, even integer < 0)             = +Infinity
   *   pow(finite x < 0, finite non-integer) = NaN
   *
   * For non-integer or very large exponents pow(x, y) is calculated using
   *
   *   x^y = exp(y*ln(x))
   *
   * Assuming the first 15 rounding digits are each equally likely to be any digit 0-9, the
   * probability of an incorrectly rounded result
   * P([49]9{14} | [50]0{14}) = 2 * 0.2 * 10^-14 = 4e-15 = 1/2.5e+14
   * i.e. 1 in 250,000,000,000,000
   *
   * If a result is incorrectly rounded the maximum error will be 1 ulp (unit in last place).
   *
   * y {number|string|Decimal} The power to which to raise this Decimal.
   *
   */
  P.toPower = P.pow = function (y) {
    var e, k, pr, r, rm, s,
      x = this,
      Ctor = x.constructor,
      yn = +(y = new Ctor(y));

    // Either ±Infinity, NaN or ±0?
    if (!x.d || !y.d || !x.d[0] || !y.d[0]) return new Ctor(mathpow(+x, yn));

    x = new Ctor(x);

    if (x.eq(1)) return x;

    pr = Ctor.precision;
    rm = Ctor.rounding;

    if (y.eq(1)) return finalise(x, pr, rm);

    // y exponent
    e = mathfloor(y.e / LOG_BASE);

    // If y is a small integer use the 'exponentiation by squaring' algorithm.
    if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
      r = intPow(Ctor, x, k, pr);
      return y.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
    }

    s = x.s;

    // if x is negative
    if (s < 0) {

      // if y is not an integer
      if (e < y.d.length - 1) return new Ctor(NaN);

      // Result is positive if x is negative and the last digit of integer y is even.
      if ((y.d[e] & 1) == 0) s = 1;

      // if x.eq(-1)
      if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
        x.s = s;
        return x;
      }
    }

    // Estimate result exponent.
    // x^y = 10^e,  where e = y * log10(x)
    // log10(x) = log10(x_significand) + x_exponent
    // log10(x_significand) = ln(x_significand) / ln(10)
    k = mathpow(+x, yn);
    e = k == 0 || !isFinite(k)
      ? mathfloor(yn * (Math.log('0.' + digitsToString(x.d)) / Math.LN10 + x.e + 1))
      : new Ctor(k + '').e;

    // Exponent estimate may be incorrect e.g. x: 0.999999999999999999, y: 2.29, e: 0, r.e: -1.

    // Overflow/underflow?
    if (e > Ctor.maxE + 1 || e < Ctor.minE - 1) return new Ctor(e > 0 ? s / 0 : 0);

    external = false;
    Ctor.rounding = x.s = 1;

    // Estimate the extra guard digits needed to ensure five correct rounding digits from
    // naturalLogarithm(x). Example of failure without these extra digits (precision: 10):
    // new Decimal(2.32456).pow('2087987436534566.46411')
    // should be 1.162377823e+764914905173815, but is 1.162355823e+764914905173815
    k = Math.min(12, (e + '').length);

    // r = x^y = exp(y*ln(x))
    r = naturalExponential(y.times(naturalLogarithm(x, pr + k)), pr);

    // r may be Infinity, e.g. (0.9999999999999999).pow(-1e+40)
    if (r.d) {

      // Truncate to the required precision plus five rounding digits.
      r = finalise(r, pr + 5, 1);

      // If the rounding digits are [49]9999 or [50]0000 increase the precision by 10 and recalculate
      // the result.
      if (checkRoundingDigits(r.d, pr, rm)) {
        e = pr + 10;

        // Truncate to the increased precision plus five rounding digits.
        r = finalise(naturalExponential(y.times(naturalLogarithm(x, e + k)), e), e + 5, 1);

        // Check for 14 nines from the 2nd rounding digit (the first rounding digit may be 4 or 9).
        if (+digitsToString(r.d).slice(pr + 1, pr + 15) + 1 == 1e14) {
          r = finalise(r, pr + 1, 0);
        }
      }
    }

    r.s = s;
    external = true;
    Ctor.rounding = rm;

    return finalise(r, pr, rm);
  };


  /*
   * Return a string representing the value of this Decimal rounded to `sd` significant digits
   * using rounding mode `rounding`.
   *
   * Return exponential notation if `sd` is less than the number of digits necessary to represent
   * the integer part of the value in normal notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toPrecision = function (sd, rm) {
    var str,
      x = this,
      Ctor = x.constructor;

    if (sd === void 0) {
      str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
    } else {
      checkInt32(sd, 1, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);

      x = finalise(new Ctor(x), sd, rm);
      str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
    }

    return x.isNeg() && !x.isZero() ? '-' + str : str;
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of `sd`
   * significant digits using rounding mode `rm`, or to `precision` and `rounding` respectively if
   * omitted.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * 'toSD() digits out of range: {sd}'
   * 'toSD() digits not an integer: {sd}'
   * 'toSD() rounding mode not an integer: {rm}'
   * 'toSD() rounding mode out of range: {rm}'
   *
   */
  P.toSignificantDigits = P.toSD = function (sd, rm) {
    var x = this,
      Ctor = x.constructor;

    if (sd === void 0) {
      sd = Ctor.precision;
      rm = Ctor.rounding;
    } else {
      checkInt32(sd, 1, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);
    }

    return finalise(new Ctor(x), sd, rm);
  };


  /*
   * Return a string representing the value of this Decimal.
   *
   * Return exponential notation if this Decimal has a positive exponent equal to or greater than
   * `toExpPos`, or a negative exponent equal to or less than `toExpNeg`.
   *
   */
  P.toString = function () {
    var x = this,
      Ctor = x.constructor,
      str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);

    return x.isNeg() && !x.isZero() ? '-' + str : str;
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal truncated to a whole number.
   *
   */
  P.truncated = P.trunc = function () {
    return finalise(new this.constructor(this), this.e + 1, 1);
  };


  /*
   * Return a string representing the value of this Decimal.
   * Unlike `toString`, negative zero will include the minus sign.
   *
   */
  P.valueOf = P.toJSON = function () {
    var x = this,
      Ctor = x.constructor,
      str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);

    return x.isNeg() ? '-' + str : str;
  };


  /*
  // Add aliases to match BigDecimal method names.
  // P.add = P.plus;
  P.subtract = P.minus;
  P.multiply = P.times;
  P.divide = P.div;
  P.remainder = P.mod;
  P.compareTo = P.cmp;
  P.negate = P.neg;
   */


  // Helper functions for Decimal.prototype (P) and/or Decimal methods, and their callers.


  /*
   *  digitsToString           P.cubeRoot, P.logarithm, P.squareRoot, P.toFraction, P.toPower,
   *                           finiteToString, naturalExponential, naturalLogarithm
   *  checkInt32               P.toDecimalPlaces, P.toExponential, P.toFixed, P.toNearest,
   *                           P.toPrecision, P.toSignificantDigits, toStringBinary, random
   *  checkRoundingDigits      P.logarithm, P.toPower, naturalExponential, naturalLogarithm
   *  convertBase              toStringBinary, parseOther
   *  cos                      P.cos
   *  divide                   P.atanh, P.cubeRoot, P.dividedBy, P.dividedToIntegerBy,
   *                           P.logarithm, P.modulo, P.squareRoot, P.tan, P.tanh, P.toFraction,
   *                           P.toNearest, toStringBinary, naturalExponential, naturalLogarithm,
   *                           taylorSeries, atan2, parseOther
   *  finalise                 P.absoluteValue, P.atan, P.atanh, P.ceil, P.cos, P.cosh,
   *                           P.cubeRoot, P.dividedToIntegerBy, P.floor, P.logarithm, P.minus,
   *                           P.modulo, P.negated, P.plus, P.round, P.sin, P.sinh, P.squareRoot,
   *                           P.tan, P.times, P.toDecimalPlaces, P.toExponential, P.toFixed,
   *                           P.toNearest, P.toPower, P.toPrecision, P.toSignificantDigits,
   *                           P.truncated, divide, getLn10, getPi, naturalExponential,
   *                           naturalLogarithm, ceil, floor, round, trunc
   *  finiteToString           P.toExponential, P.toFixed, P.toPrecision, P.toString, P.valueOf,
   *                           toStringBinary
   *  getBase10Exponent        P.minus, P.plus, P.times, parseOther
   *  getLn10                  P.logarithm, naturalLogarithm
   *  getPi                    P.acos, P.asin, P.atan, toLessThanHalfPi, atan2
   *  getPrecision             P.precision, P.toFraction
   *  getZeroString            digitsToString, finiteToString
   *  intPow                   P.toPower, parseOther
   *  isOdd                    toLessThanHalfPi
   *  maxOrMin                 max, min
   *  naturalExponential       P.naturalExponential, P.toPower
   *  naturalLogarithm         P.acosh, P.asinh, P.atanh, P.logarithm, P.naturalLogarithm,
   *                           P.toPower, naturalExponential
   *  nonFiniteToString        finiteToString, toStringBinary
   *  parseDecimal             Decimal
   *  parseOther               Decimal
   *  sin                      P.sin
   *  taylorSeries             P.cosh, P.sinh, cos, sin
   *  toLessThanHalfPi         P.cos, P.sin
   *  toStringBinary           P.toBinary, P.toHexadecimal, P.toOctal
   *  truncate                 intPow
   *
   *  Throws:                  P.logarithm, P.precision, P.toFraction, checkInt32, getLn10, getPi,
   *                           naturalLogarithm, config, parseOther, random, Decimal
   */


  function digitsToString(d) {
    var i, k, ws,
      indexOfLastWord = d.length - 1,
      str = '',
      w = d[0];

    if (indexOfLastWord > 0) {
      str += w;
      for (i = 1; i < indexOfLastWord; i++) {
        ws = d[i] + '';
        k = LOG_BASE - ws.length;
        if (k) str += getZeroString(k);
        str += ws;
      }

      w = d[i];
      ws = w + '';
      k = LOG_BASE - ws.length;
      if (k) str += getZeroString(k);
    } else if (w === 0) {
      return '0';
    }

    // Remove trailing zeros of last w.
    for (; w % 10 === 0;) w /= 10;

    return str + w;
  }


  function checkInt32(i, min, max) {
    if (i !== ~~i || i < min || i > max) {
      throw Error(invalidArgument + i);
    }
  }


  /*
   * Check 5 rounding digits if `repeating` is null, 4 otherwise.
   * `repeating == null` if caller is `log` or `pow`,
   * `repeating != null` if caller is `naturalLogarithm` or `naturalExponential`.
   */
  function checkRoundingDigits(d, i, rm, repeating) {
    var di, k, r, rd;

    // Get the length of the first word of the array d.
    for (k = d[0]; k >= 10; k /= 10) --i;

    // Is the rounding digit in the first word of d?
    if (--i < 0) {
      i += LOG_BASE;
      di = 0;
    } else {
      di = Math.ceil((i + 1) / LOG_BASE);
      i %= LOG_BASE;
    }

    // i is the index (0 - 6) of the rounding digit.
    // E.g. if within the word 3487563 the first rounding digit is 5,
    // then i = 4, k = 1000, rd = 3487563 % 1000 = 563
    k = mathpow(10, LOG_BASE - i);
    rd = d[di] % k | 0;

    if (repeating == null) {
      if (i < 3) {
        if (i == 0) rd = rd / 100 | 0;
        else if (i == 1) rd = rd / 10 | 0;
        r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 50000 || rd == 0;
      } else {
        r = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) &&
          (d[di + 1] / k / 100 | 0) == mathpow(10, i - 2) - 1 ||
            (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
      }
    } else {
      if (i < 4) {
        if (i == 0) rd = rd / 1000 | 0;
        else if (i == 1) rd = rd / 100 | 0;
        else if (i == 2) rd = rd / 10 | 0;
        r = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
      } else {
        r = ((repeating || rm < 4) && rd + 1 == k ||
        (!repeating && rm > 3) && rd + 1 == k / 2) &&
          (d[di + 1] / k / 1000 | 0) == mathpow(10, i - 3) - 1;
      }
    }

    return r;
  }


  // Convert string of `baseIn` to an array of numbers of `baseOut`.
  // Eg. convertBase('255', 10, 16) returns [15, 15].
  // Eg. convertBase('ff', 16, 10) returns [2, 5, 5].
  function convertBase(str, baseIn, baseOut) {
    var j,
      arr = [0],
      arrL,
      i = 0,
      strL = str.length;

    for (; i < strL;) {
      for (arrL = arr.length; arrL--;) arr[arrL] *= baseIn;
      arr[0] += NUMERALS.indexOf(str.charAt(i++));
      for (j = 0; j < arr.length; j++) {
        if (arr[j] > baseOut - 1) {
          if (arr[j + 1] === void 0) arr[j + 1] = 0;
          arr[j + 1] += arr[j] / baseOut | 0;
          arr[j] %= baseOut;
        }
      }
    }

    return arr.reverse();
  }


  /*
   * cos(x) = 1 - x^2/2! + x^4/4! - ...
   * |x| < pi/2
   *
   */
  function cosine(Ctor, x) {
    var k, y,
      len = x.d.length;

    // Argument reduction: cos(4x) = 8*(cos^4(x) - cos^2(x)) + 1
    // i.e. cos(x) = 8*(cos^4(x/4) - cos^2(x/4)) + 1

    // Estimate the optimum number of times to use the argument reduction.
    if (len < 32) {
      k = Math.ceil(len / 3);
      y = Math.pow(4, -k).toString();
    } else {
      k = 16;
      y = '2.3283064365386962890625e-10';
    }

    Ctor.precision += k;

    x = taylorSeries(Ctor, 1, x.times(y), new Ctor(1));

    // Reverse argument reduction
    for (var i = k; i--;) {
      var cos2x = x.times(x);
      x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
    }

    Ctor.precision -= k;

    return x;
  }


  /*
   * Perform division in the specified base.
   */
  var divide = (function () {

    // Assumes non-zero x and k, and hence non-zero result.
    function multiplyInteger(x, k, base) {
      var temp,
        carry = 0,
        i = x.length;

      for (x = x.slice(); i--;) {
        temp = x[i] * k + carry;
        x[i] = temp % base | 0;
        carry = temp / base | 0;
      }

      if (carry) x.unshift(carry);

      return x;
    }

    function compare(a, b, aL, bL) {
      var i, r;

      if (aL != bL) {
        r = aL > bL ? 1 : -1;
      } else {
        for (i = r = 0; i < aL; i++) {
          if (a[i] != b[i]) {
            r = a[i] > b[i] ? 1 : -1;
            break;
          }
        }
      }

      return r;
    }

    function subtract(a, b, aL, base) {
      var i = 0;

      // Subtract b from a.
      for (; aL--;) {
        a[aL] -= i;
        i = a[aL] < b[aL] ? 1 : 0;
        a[aL] = i * base + a[aL] - b[aL];
      }

      // Remove leading zeros.
      for (; !a[0] && a.length > 1;) a.shift();
    }

    return function (x, y, pr, rm, dp, base) {
      var cmp, e, i, k, logBase, more, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0,
        yL, yz,
        Ctor = x.constructor,
        sign = x.s == y.s ? 1 : -1,
        xd = x.d,
        yd = y.d;

      // Either NaN, Infinity or 0?
      if (!xd || !xd[0] || !yd || !yd[0]) {

        return new Ctor(// Return NaN if either NaN, or both Infinity or 0.
          !x.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN :

          // Return ±0 if x is 0 or y is ±Infinity, or return ±Infinity as y is 0.
          xd && xd[0] == 0 || !yd ? sign * 0 : sign / 0);
      }

      if (base) {
        logBase = 1;
        e = x.e - y.e;
      } else {
        base = BASE;
        logBase = LOG_BASE;
        e = mathfloor(x.e / logBase) - mathfloor(y.e / logBase);
      }

      yL = yd.length;
      xL = xd.length;
      q = new Ctor(sign);
      qd = q.d = [];

      // Result exponent may be one less than e.
      // The digit array of a Decimal from toStringBinary may have trailing zeros.
      for (i = 0; yd[i] == (xd[i] || 0); i++);

      if (yd[i] > (xd[i] || 0)) e--;

      if (pr == null) {
        sd = pr = Ctor.precision;
        rm = Ctor.rounding;
      } else if (dp) {
        sd = pr + (x.e - y.e) + 1;
      } else {
        sd = pr;
      }

      if (sd < 0) {
        qd.push(1);
        more = true;
      } else {

        // Convert precision in number of base 10 digits to base 1e7 digits.
        sd = sd / logBase + 2 | 0;
        i = 0;

        // divisor < 1e7
        if (yL == 1) {
          k = 0;
          yd = yd[0];
          sd++;

          // k is the carry.
          for (; (i < xL || k) && sd--; i++) {
            t = k * base + (xd[i] || 0);
            qd[i] = t / yd | 0;
            k = t % yd | 0;
          }

          more = k || i < xL;

        // divisor >= 1e7
        } else {

          // Normalise xd and yd so highest order digit of yd is >= base/2
          k = base / (yd[0] + 1) | 0;

          if (k > 1) {
            yd = multiplyInteger(yd, k, base);
            xd = multiplyInteger(xd, k, base);
            yL = yd.length;
            xL = xd.length;
          }

          xi = yL;
          rem = xd.slice(0, yL);
          remL = rem.length;

          // Add zeros to make remainder as long as divisor.
          for (; remL < yL;) rem[remL++] = 0;

          yz = yd.slice();
          yz.unshift(0);
          yd0 = yd[0];

          if (yd[1] >= base / 2) ++yd0;

          do {
            k = 0;

            // Compare divisor and remainder.
            cmp = compare(yd, rem, yL, remL);

            // If divisor < remainder.
            if (cmp < 0) {

              // Calculate trial digit, k.
              rem0 = rem[0];
              if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

              // k will be how many times the divisor goes into the current remainder.
              k = rem0 / yd0 | 0;

              //  Algorithm:
              //  1. product = divisor * trial digit (k)
              //  2. if product > remainder: product -= divisor, k--
              //  3. remainder -= product
              //  4. if product was < remainder at 2:
              //    5. compare new remainder and divisor
              //    6. If remainder > divisor: remainder -= divisor, k++

              if (k > 1) {
                if (k >= base) k = base - 1;

                // product = divisor * trial digit.
                prod = multiplyInteger(yd, k, base);
                prodL = prod.length;
                remL = rem.length;

                // Compare product and remainder.
                cmp = compare(prod, rem, prodL, remL);

                // product > remainder.
                if (cmp == 1) {
                  k--;

                  // Subtract divisor from product.
                  subtract(prod, yL < prodL ? yz : yd, prodL, base);
                }
              } else {

                // cmp is -1.
                // If k is 0, there is no need to compare yd and rem again below, so change cmp to 1
                // to avoid it. If k is 1 there is a need to compare yd and rem again below.
                if (k == 0) cmp = k = 1;
                prod = yd.slice();
              }

              prodL = prod.length;
              if (prodL < remL) prod.unshift(0);

              // Subtract product from remainder.
              subtract(rem, prod, remL, base);

              // If product was < previous remainder.
              if (cmp == -1) {
                remL = rem.length;

                // Compare divisor and new remainder.
                cmp = compare(yd, rem, yL, remL);

                // If divisor < new remainder, subtract divisor from remainder.
                if (cmp < 1) {
                  k++;

                  // Subtract divisor from remainder.
                  subtract(rem, yL < remL ? yz : yd, remL, base);
                }
              }

              remL = rem.length;
            } else if (cmp === 0) {
              k++;
              rem = [0];
            }    // if cmp === 1, k will be 0

            // Add the next digit, k, to the result array.
            qd[i++] = k;

            // Update the remainder.
            if (cmp && rem[0]) {
              rem[remL++] = xd[xi] || 0;
            } else {
              rem = [xd[xi]];
              remL = 1;
            }

          } while ((xi++ < xL || rem[0] !== void 0) && sd--);

          more = rem[0] !== void 0;
        }

        // Leading zero?
        if (!qd[0]) qd.shift();
      }

      // logBase is 1 when divide is being used for base conversion.
      if (logBase == 1) {
        q.e = e;
        inexact = more;
      } else {

        // To calculate q.e, first get the number of digits of qd[0].
        for (i = 1, k = qd[0]; k >= 10; k /= 10) i++;
        q.e = i + e * logBase - 1;

        finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
      }

      return q;
    };
  })();


  /*
   * Round `x` to `sd` significant digits using rounding mode `rm`.
   * Check for over/under-flow.
   */
   function finalise(x, sd, rm, isTruncated) {
    var digits, i, j, k, rd, roundUp, w, xd, xdi,
      Ctor = x.constructor;

    // Don't round if sd is null or undefined.
    out: if (sd != null) {
      xd = x.d;

      // Infinity/NaN.
      if (!xd) return x;

      // rd: the rounding digit, i.e. the digit after the digit that may be rounded up.
      // w: the word of xd containing rd, a base 1e7 number.
      // xdi: the index of w within xd.
      // digits: the number of digits of w.
      // i: what would be the index of rd within w if all the numbers were 7 digits long (i.e. if
      // they had leading zeros)
      // j: if > 0, the actual index of rd within w (if < 0, rd is a leading zero).

      // Get the length of the first word of the digits array xd.
      for (digits = 1, k = xd[0]; k >= 10; k /= 10) digits++;
      i = sd - digits;

      // Is the rounding digit in the first word of xd?
      if (i < 0) {
        i += LOG_BASE;
        j = sd;
        w = xd[xdi = 0];

        // Get the rounding digit at index j of w.
        rd = w / mathpow(10, digits - j - 1) % 10 | 0;
      } else {
        xdi = Math.ceil((i + 1) / LOG_BASE);
        k = xd.length;
        if (xdi >= k) {
          if (isTruncated) {

            // Needed by `naturalExponential`, `naturalLogarithm` and `squareRoot`.
            for (; k++ <= xdi;) xd.push(0);
            w = rd = 0;
            digits = 1;
            i %= LOG_BASE;
            j = i - LOG_BASE + 1;
          } else {
            break out;
          }
        } else {
          w = k = xd[xdi];

          // Get the number of digits of w.
          for (digits = 1; k >= 10; k /= 10) digits++;

          // Get the index of rd within w.
          i %= LOG_BASE;

          // Get the index of rd within w, adjusted for leading zeros.
          // The number of leading zeros of w is given by LOG_BASE - digits.
          j = i - LOG_BASE + digits;

          // Get the rounding digit at index j of w.
          rd = j < 0 ? 0 : w / mathpow(10, digits - j - 1) % 10 | 0;
        }
      }

      // Are there any non-zero digits after the rounding digit?
      isTruncated = isTruncated || sd < 0 ||
        xd[xdi + 1] !== void 0 || (j < 0 ? w : w % mathpow(10, digits - j - 1));

      // The expression `w % mathpow(10, digits - j - 1)` returns all the digits of w to the right
      // of the digit at (left-to-right) index j, e.g. if w is 908714 and j is 2, the expression
      // will give 714.

      roundUp = rm < 4
        ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
        : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 &&

          // Check whether the digit to the left of the rounding digit is odd.
          ((i > 0 ? j > 0 ? w / mathpow(10, digits - j) : 0 : xd[xdi - 1]) % 10) & 1 ||
            rm == (x.s < 0 ? 8 : 7));

      if (sd < 1 || !xd[0]) {
        xd.length = 0;
        if (roundUp) {

          // Convert sd to decimal places.
          sd -= x.e + 1;

          // 1, 0.1, 0.01, 0.001, 0.0001 etc.
          xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
          x.e = -sd || 0;
        } else {

          // Zero.
          xd[0] = x.e = 0;
        }

        return x;
      }

      // Remove excess digits.
      if (i == 0) {
        xd.length = xdi;
        k = 1;
        xdi--;
      } else {
        xd.length = xdi + 1;
        k = mathpow(10, LOG_BASE - i);

        // E.g. 56700 becomes 56000 if 7 is the rounding digit.
        // j > 0 means i > number of leading zeros of w.
        xd[xdi] = j > 0 ? (w / mathpow(10, digits - j) % mathpow(10, j) | 0) * k : 0;
      }

      if (roundUp) {
        for (;;) {

          // Is the digit to be rounded up in the first word of xd?
          if (xdi == 0) {

            // i will be the length of xd[0] before k is added.
            for (i = 1, j = xd[0]; j >= 10; j /= 10) i++;
            j = xd[0] += k;
            for (k = 1; j >= 10; j /= 10) k++;

            // if i != k the length has increased.
            if (i != k) {
              x.e++;
              if (xd[0] == BASE) xd[0] = 1;
            }

            break;
          } else {
            xd[xdi] += k;
            if (xd[xdi] != BASE) break;
            xd[xdi--] = 0;
            k = 1;
          }
        }
      }

      // Remove trailing zeros.
      for (i = xd.length; xd[--i] === 0;) xd.pop();
    }

    if (external) {

      // Overflow?
      if (x.e > Ctor.maxE) {

        // Infinity.
        x.d = null;
        x.e = NaN;

      // Underflow?
      } else if (x.e < Ctor.minE) {

        // Zero.
        x.e = 0;
        x.d = [0];
        // Ctor.underflow = true;
      } // else Ctor.underflow = false;
    }

    return x;
  }


  function finiteToString(x, isExp, sd) {
    if (!x.isFinite()) return nonFiniteToString(x);
    var k,
      e = x.e,
      str = digitsToString(x.d),
      len = str.length;

    if (isExp) {
      if (sd && (k = sd - len) > 0) {
        str = str.charAt(0) + '.' + str.slice(1) + getZeroString(k);
      } else if (len > 1) {
        str = str.charAt(0) + '.' + str.slice(1);
      }

      str = str + (x.e < 0 ? 'e' : 'e+') + x.e;
    } else if (e < 0) {
      str = '0.' + getZeroString(-e - 1) + str;
      if (sd && (k = sd - len) > 0) str += getZeroString(k);
    } else if (e >= len) {
      str += getZeroString(e + 1 - len);
      if (sd && (k = sd - e - 1) > 0) str = str + '.' + getZeroString(k);
    } else {
      if ((k = e + 1) < len) str = str.slice(0, k) + '.' + str.slice(k);
      if (sd && (k = sd - len) > 0) {
        if (e + 1 === len) str += '.';
        str += getZeroString(k);
      }
    }

    return str;
  }


  // Calculate the base 10 exponent from the base 1e7 exponent.
  function getBase10Exponent(digits, e) {
    var w = digits[0];

    // Add the number of digits of the first word of the digits array.
    for ( e *= LOG_BASE; w >= 10; w /= 10) e++;
    return e;
  }


  function getLn10(Ctor, sd, pr) {
    if (sd > LN10_PRECISION) {

      // Reset global state in case the exception is caught.
      external = true;
      if (pr) Ctor.precision = pr;
      throw Error(precisionLimitExceeded);
    }
    return finalise(new Ctor(LN10), sd, 1, true);
  }


  function getPi(Ctor, sd, rm) {
    if (sd > PI_PRECISION) throw Error(precisionLimitExceeded);
    return finalise(new Ctor(PI), sd, rm, true);
  }


  function getPrecision(digits) {
    var w = digits.length - 1,
      len = w * LOG_BASE + 1;

    w = digits[w];

    // If non-zero...
    if (w) {

      // Subtract the number of trailing zeros of the last word.
      for (; w % 10 == 0; w /= 10) len--;

      // Add the number of digits of the first word.
      for (w = digits[0]; w >= 10; w /= 10) len++;
    }

    return len;
  }


  function getZeroString(k) {
    var zs = '';
    for (; k--;) zs += '0';
    return zs;
  }


  /*
   * Return a new Decimal whose value is the value of Decimal `x` to the power `n`, where `n` is an
   * integer of type number.
   *
   * Implements 'exponentiation by squaring'. Called by `pow` and `parseOther`.
   *
   */
  function intPow(Ctor, x, n, pr) {
    var isTruncated,
      r = new Ctor(1),

      // Max n of 9007199254740991 takes 53 loop iterations.
      // Maximum digits array length; leaves [28, 34] guard digits.
      k = Math.ceil(pr / LOG_BASE + 4);

    external = false;

    for (;;) {
      if (n % 2) {
        r = r.times(x);
        if (truncate(r.d, k)) isTruncated = true;
      }

      n = mathfloor(n / 2);
      if (n === 0) {

        // To ensure correct rounding when r.d is truncated, increment the last word if it is zero.
        n = r.d.length - 1;
        if (isTruncated && r.d[n] === 0) ++r.d[n];
        break;
      }

      x = x.times(x);
      truncate(x.d, k);
    }

    external = true;

    return r;
  }


  function isOdd(n) {
    return n.d[n.d.length - 1] & 1;
  }


  /*
   * Handle `max` and `min`. `ltgt` is 'lt' or 'gt'.
   */
  function maxOrMin(Ctor, args, ltgt) {
    var y,
      x = new Ctor(args[0]),
      i = 0;

    for (; ++i < args.length;) {
      y = new Ctor(args[i]);
      if (!y.s) {
        x = y;
        break;
      } else if (x[ltgt](y)) {
        x = y;
      }
    }

    return x;
  }


  /*
   * Return a new Decimal whose value is the natural exponential of `x` rounded to `sd` significant
   * digits.
   *
   * Taylor/Maclaurin series.
   *
   * exp(x) = x^0/0! + x^1/1! + x^2/2! + x^3/3! + ...
   *
   * Argument reduction:
   *   Repeat x = x / 32, k += 5, until |x| < 0.1
   *   exp(x) = exp(x / 2^k)^(2^k)
   *
   * Previously, the argument was initially reduced by
   * exp(x) = exp(r) * 10^k  where r = x - k * ln10, k = floor(x / ln10)
   * to first put r in the range [0, ln10], before dividing by 32 until |x| < 0.1, but this was
   * found to be slower than just dividing repeatedly by 32 as above.
   *
   * Max integer argument: exp('20723265836946413') = 6.3e+9000000000000000
   * Min integer argument: exp('-20723265836946411') = 1.2e-9000000000000000
   * (Math object integer min/max: Math.exp(709) = 8.2e+307, Math.exp(-745) = 5e-324)
   *
   *  exp(Infinity)  = Infinity
   *  exp(-Infinity) = 0
   *  exp(NaN)       = NaN
   *  exp(±0)        = 1
   *
   *  exp(x) is non-terminating for any finite, non-zero x.
   *
   *  The result will always be correctly rounded.
   *
   */
  function naturalExponential(x, sd) {
    var denominator, guard, j, pow, sum, t, wpr,
      rep = 0,
      i = 0,
      k = 0,
      Ctor = x.constructor,
      rm = Ctor.rounding,
      pr = Ctor.precision;

    // 0/NaN/Infinity?
    if (!x.d || !x.d[0] || x.e > 17) {

      return new Ctor(x.d
        ? !x.d[0] ? 1 : x.s < 0 ? 0 : 1 / 0
        : x.s ? x.s < 0 ? 0 : x : 0 / 0);
    }

    if (sd == null) {
      external = false;
      wpr = pr;
    } else {
      wpr = sd;
    }

    t = new Ctor(0.03125);

    // while abs(x) >= 0.1
    while (x.e > -2) {

      // x = x / 2^5
      x = x.times(t);
      k += 5;
    }

    // Use 2 * log10(2^k) + 5 (empirically derived) to estimate the increase in precision
    // necessary to ensure the first 4 rounding digits are correct.
    guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
    wpr += guard;
    denominator = pow = sum = new Ctor(1);
    Ctor.precision = wpr;

    for (;;) {
      pow = finalise(pow.times(x), wpr, 1);
      denominator = denominator.times(++i);
      t = sum.plus(divide(pow, denominator, wpr, 1));

      if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
        j = k;
        while (j--) sum = finalise(sum.times(sum), wpr, 1);

        // Check to see if the first 4 rounding digits are [49]999.
        // If so, repeat the summation with a higher precision, otherwise
        // e.g. with precision: 18, rounding: 1
        // exp(18.404272462595034083567793919843761) = 98372560.1229999999 (should be 98372560.123)
        // `wpr - guard` is the index of first rounding digit.
        if (sd == null) {

          if (rep < 3 && checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
            Ctor.precision = wpr += 10;
            denominator = pow = t = new Ctor(1);
            i = 0;
            rep++;
          } else {
            return finalise(sum, Ctor.precision = pr, rm, external = true);
          }
        } else {
          Ctor.precision = pr;
          return sum;
        }
      }

      sum = t;
    }
  }


  /*
   * Return a new Decimal whose value is the natural logarithm of `x` rounded to `sd` significant
   * digits.
   *
   *  ln(-n)        = NaN
   *  ln(0)         = -Infinity
   *  ln(-0)        = -Infinity
   *  ln(1)         = 0
   *  ln(Infinity)  = Infinity
   *  ln(-Infinity) = NaN
   *  ln(NaN)       = NaN
   *
   *  ln(n) (n != 1) is non-terminating.
   *
   */
  function naturalLogarithm(y, sd) {
    var c, c0, denominator, e, numerator, rep, sum, t, wpr, x1, x2,
      n = 1,
      guard = 10,
      x = y,
      xd = x.d,
      Ctor = x.constructor,
      rm = Ctor.rounding,
      pr = Ctor.precision;

    // Is x negative or Infinity, NaN, 0 or 1?
    if (x.s < 0 || !xd || !xd[0] || !x.e && xd[0] == 1 && xd.length == 1) {
      return new Ctor(xd && !xd[0] ? -1 / 0 : x.s != 1 ? NaN : xd ? 0 : x);
    }

    if (sd == null) {
      external = false;
      wpr = pr;
    } else {
      wpr = sd;
    }

    Ctor.precision = wpr += guard;
    c = digitsToString(xd);
    c0 = c.charAt(0);

    if (Math.abs(e = x.e) < 1.5e15) {

      // Argument reduction.
      // The series converges faster the closer the argument is to 1, so using
      // ln(a^b) = b * ln(a),   ln(a) = ln(a^b) / b
      // multiply the argument by itself until the leading digits of the significand are 7, 8, 9,
      // 10, 11, 12 or 13, recording the number of multiplications so the sum of the series can
      // later be divided by this number, then separate out the power of 10 using
      // ln(a*10^b) = ln(a) + b*ln(10).

      // max n is 21 (gives 0.9, 1.0 or 1.1) (9e15 / 21 = 4.2e14).
      //while (c0 < 9 && c0 != 1 || c0 == 1 && c.charAt(1) > 1) {
      // max n is 6 (gives 0.7 - 1.3)
      while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
        x = x.times(y);
        c = digitsToString(x.d);
        c0 = c.charAt(0);
        n++;
      }

      e = x.e;

      if (c0 > 1) {
        x = new Ctor('0.' + c);
        e++;
      } else {
        x = new Ctor(c0 + '.' + c.slice(1));
      }
    } else {

      // The argument reduction method above may result in overflow if the argument y is a massive
      // number with exponent >= 1500000000000000 (9e15 / 6 = 1.5e15), so instead recall this
      // function using ln(x*10^e) = ln(x) + e*ln(10).
      t = getLn10(Ctor, wpr + 2, pr).times(e + '');
      x = naturalLogarithm(new Ctor(c0 + '.' + c.slice(1)), wpr - guard).plus(t);
      Ctor.precision = pr;

      return sd == null ? finalise(x, pr, rm, external = true) : x;
    }

    // x1 is x reduced to a value near 1.
    x1 = x;

    // Taylor series.
    // ln(y) = ln((1 + x)/(1 - x)) = 2(x + x^3/3 + x^5/5 + x^7/7 + ...)
    // where x = (y - 1)/(y + 1)    (|x| < 1)
    sum = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
    x2 = finalise(x.times(x), wpr, 1);
    denominator = 3;

    for (;;) {
      numerator = finalise(numerator.times(x2), wpr, 1);
      t = sum.plus(divide(numerator, new Ctor(denominator), wpr, 1));

      if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
        sum = sum.times(2);

        // Reverse the argument reduction. Check that e is not 0 because, besides preventing an
        // unnecessary calculation, -0 + 0 = +0 and to ensure correct rounding -0 needs to stay -0.
        if (e !== 0) sum = sum.plus(getLn10(Ctor, wpr + 2, pr).times(e + ''));
        sum = divide(sum, new Ctor(n), wpr, 1);

        // Is rm > 3 and the first 4 rounding digits 4999, or rm < 4 (or the summation has
        // been repeated previously) and the first 4 rounding digits 9999?
        // If so, restart the summation with a higher precision, otherwise
        // e.g. with precision: 12, rounding: 1
        // ln(135520028.6126091714265381533) = 18.7246299999 when it should be 18.72463.
        // `wpr - guard` is the index of first rounding digit.
        if (sd == null) {
          if (checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
            Ctor.precision = wpr += guard;
            t = numerator = x = divide(x1.minus(1), x1.plus(1), wpr, 1);
            x2 = finalise(x.times(x), wpr, 1);
            denominator = rep = 1;
          } else {
            return finalise(sum, Ctor.precision = pr, rm, external = true);
          }
        } else {
          Ctor.precision = pr;
          return sum;
        }
      }

      sum = t;
      denominator += 2;
    }
  }


  // ±Infinity, NaN.
  function nonFiniteToString(x) {
    // Unsigned.
    return String(x.s * x.s / 0);
  }


  /*
   * Parse the value of a new Decimal `x` from string `str`.
   */
  function parseDecimal(x, str) {
    var e, i, len;

    // Decimal point?
    if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

    // Exponential form?
    if ((i = str.search(/e/i)) > 0) {

      // Determine exponent.
      if (e < 0) e = i;
      e += +str.slice(i + 1);
      str = str.substring(0, i);
    } else if (e < 0) {

      // Integer.
      e = str.length;
    }

    // Determine leading zeros.
    for (i = 0; str.charCodeAt(i) === 48; i++);

    // Determine trailing zeros.
    for (len = str.length; str.charCodeAt(len - 1) === 48; --len);
    str = str.slice(i, len);

    if (str) {
      len -= i;
      x.e = e = e - i - 1;
      x.d = [];

      // Transform base

      // e is the base 10 exponent.
      // i is where to slice str to get the first word of the digits array.
      i = (e + 1) % LOG_BASE;
      if (e < 0) i += LOG_BASE;

      if (i < len) {
        if (i) x.d.push(+str.slice(0, i));
        for (len -= LOG_BASE; i < len;) x.d.push(+str.slice(i, i += LOG_BASE));
        str = str.slice(i);
        i = LOG_BASE - str.length;
      } else {
        i -= len;
      }

      for (; i--;) str += '0';
      x.d.push(+str);

      if (external) {

        // Overflow?
        if (x.e > x.constructor.maxE) {

          // Infinity.
          x.d = null;
          x.e = NaN;

        // Underflow?
        } else if (x.e < x.constructor.minE) {

          // Zero.
          x.e = 0;
          x.d = [0];
          // x.constructor.underflow = true;
        } // else x.constructor.underflow = false;
      }
    } else {

      // Zero.
      x.e = 0;
      x.d = [0];
    }

    return x;
  }


  /*
   * Parse the value of a new Decimal `x` from a string `str`, which is not a decimal value.
   */
  function parseOther(x, str) {
    var base, Ctor, divisor, i, isFloat, len, p, xd, xe;

    if (str === 'Infinity' || str === 'NaN') {
      if (!+str) x.s = NaN;
      x.e = NaN;
      x.d = null;
      return x;
    }

    if (isHex.test(str))  {
      base = 16;
      str = str.toLowerCase();
    } else if (isBinary.test(str))  {
      base = 2;
    } else if (isOctal.test(str))  {
      base = 8;
    } else {
      throw Error(invalidArgument + str);
    }

    // Is there a binary exponent part?
    i = str.search(/p/i);

    if (i > 0) {
      p = +str.slice(i + 1);
      str = str.substring(2, i);
    } else {
      str = str.slice(2);
    }

    // Convert `str` as an integer then divide the result by `base` raised to a power such that the
    // fraction part will be restored.
    i = str.indexOf('.');
    isFloat = i >= 0;
    Ctor = x.constructor;

    if (isFloat) {
      str = str.replace('.', '');
      len = str.length;
      i = len - i;

      // log[10](16) = 1.2041... , log[10](88) = 1.9444....
      divisor = intPow(Ctor, new Ctor(base), i, i * 2);
    }

    xd = convertBase(str, base, BASE);
    xe = xd.length - 1;

    // Remove trailing zeros.
    for (i = xe; xd[i] === 0; --i) xd.pop();
    if (i < 0) return new Ctor(x.s * 0);
    x.e = getBase10Exponent(xd, xe);
    x.d = xd;
    external = false;

    // At what precision to perform the division to ensure exact conversion?
    // maxDecimalIntegerPartDigitCount = ceil(log[10](b) * otherBaseIntegerPartDigitCount)
    // log[10](2) = 0.30103, log[10](8) = 0.90309, log[10](16) = 1.20412
    // E.g. ceil(1.2 * 3) = 4, so up to 4 decimal digits are needed to represent 3 hex int digits.
    // maxDecimalFractionPartDigitCount = {Hex:4|Oct:3|Bin:1} * otherBaseFractionPartDigitCount
    // Therefore using 4 * the number of digits of str will always be enough.
    if (isFloat) x = divide(x, divisor, len * 4);

    // Multiply by the binary exponent part if present.
    if (p) x = x.times(Math.abs(p) < 54 ? Math.pow(2, p) : Decimal.pow(2, p));
    external = true;

    return x;
  }


  /*
   * sin(x) = x - x^3/3! + x^5/5! - ...
   * |x| < pi/2
   *
   */
  function sine(Ctor, x) {
    var k,
      len = x.d.length;

    if (len < 3) return taylorSeries(Ctor, 2, x, x);

    // Argument reduction: sin(5x) = 16*sin^5(x) - 20*sin^3(x) + 5*sin(x)
    // i.e. sin(x) = 16*sin^5(x/5) - 20*sin^3(x/5) + 5*sin(x/5)
    // and  sin(x) = sin(x/5)(5 + sin^2(x/5)(16sin^2(x/5) - 20))

    // Estimate the optimum number of times to use the argument reduction.
    k = 1.4 * Math.sqrt(len);
    k = k > 16 ? 16 : k | 0;

    // Max k before Math.pow precision loss is 22
    x = x.times(Math.pow(5, -k));
    x = taylorSeries(Ctor, 2, x, x);

    // Reverse argument reduction
    var sin2_x,
      d5 = new Ctor(5),
      d16 = new Ctor(16),
      d20 = new Ctor(20);
    for (; k--;) {
      sin2_x = x.times(x);
      x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
    }

    return x;
  }


  // Calculate Taylor series for `cos`, `cosh`, `sin` and `sinh`.
  function taylorSeries(Ctor, n, x, y, isHyperbolic) {
    var j, t, u, x2,
      i = 1,
      pr = Ctor.precision,
      k = Math.ceil(pr / LOG_BASE);

    external = false;
    x2 = x.times(x);
    u = new Ctor(y);

    for (;;) {
      t = divide(u.times(x2), new Ctor(n++ * n++), pr, 1);
      u = isHyperbolic ? y.plus(t) : y.minus(t);
      y = divide(t.times(x2), new Ctor(n++ * n++), pr, 1);
      t = u.plus(y);

      if (t.d[k] !== void 0) {
        for (j = k; t.d[j] === u.d[j] && j--;);
        if (j == -1) break;
      }

      j = u;
      u = y;
      y = t;
      t = j;
      i++;
    }

    external = true;
    t.d.length = k + 1;

    return t;
  }


  // Return the absolute value of `x` reduced to less than or equal to half pi.
  function toLessThanHalfPi(Ctor, x) {
    var t,
      isNeg = x.s < 0,
      pi = getPi(Ctor, Ctor.precision, 1),
      halfPi = pi.times(0.5);

    x = x.abs();

    if (x.lte(halfPi)) {
      quadrant = isNeg ? 4 : 1;
      return x;
    }

    t = x.divToInt(pi);

    if (t.isZero()) {
      quadrant = isNeg ? 3 : 2;
    } else {
      x = x.minus(t.times(pi));

      // 0 <= x < pi
      if (x.lte(halfPi)) {
        quadrant = isOdd(t) ? (isNeg ? 2 : 3) : (isNeg ? 4 : 1);
        return x;
      }

      quadrant = isOdd(t) ? (isNeg ? 1 : 4) : (isNeg ? 3 : 2);
    }

    return x.minus(pi).abs();
  }


  /*
   * Return the value of Decimal `x` as a string in base `baseOut`.
   *
   * If the optional `sd` argument is present include a binary exponent suffix.
   */
  function toStringBinary(x, baseOut, sd, rm) {
    var base, e, i, k, len, roundUp, str, xd, y,
      Ctor = x.constructor,
      isExp = sd !== void 0;

    if (isExp) {
      checkInt32(sd, 1, MAX_DIGITS);
      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);
    } else {
      sd = Ctor.precision;
      rm = Ctor.rounding;
    }

    if (!x.isFinite()) {
      str = nonFiniteToString(x);
    } else {
      str = finiteToString(x);
      i = str.indexOf('.');

      // Use exponential notation according to `toExpPos` and `toExpNeg`? No, but if required:
      // maxBinaryExponent = floor((decimalExponent + 1) * log[2](10))
      // minBinaryExponent = floor(decimalExponent * log[2](10))
      // log[2](10) = 3.321928094887362347870319429489390175864

      if (isExp) {
        base = 2;
        if (baseOut == 16) {
          sd = sd * 4 - 3;
        } else if (baseOut == 8) {
          sd = sd * 3 - 2;
        }
      } else {
        base = baseOut;
      }

      // Convert the number as an integer then divide the result by its base raised to a power such
      // that the fraction part will be restored.

      // Non-integer.
      if (i >= 0) {
        str = str.replace('.', '');
        y = new Ctor(1);
        y.e = str.length - i;
        y.d = convertBase(finiteToString(y), 10, base);
        y.e = y.d.length;
      }

      xd = convertBase(str, 10, base);
      e = len = xd.length;

      // Remove trailing zeros.
      for (; xd[--len] == 0;) xd.pop();

      if (!xd[0]) {
        str = isExp ? '0p+0' : '0';
      } else {
        if (i < 0) {
          e--;
        } else {
          x = new Ctor(x);
          x.d = xd;
          x.e = e;
          x = divide(x, y, sd, rm, 0, base);
          xd = x.d;
          e = x.e;
          roundUp = inexact;
        }

        // The rounding digit, i.e. the digit after the digit that may be rounded up.
        i = xd[sd];
        k = base / 2;
        roundUp = roundUp || xd[sd + 1] !== void 0;

        roundUp = rm < 4
          ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2))
          : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 ||
            rm === (x.s < 0 ? 8 : 7));

        xd.length = sd;

        if (roundUp) {

          // Rounding up may mean the previous digit has to be rounded up and so on.
          for (; ++xd[--sd] > base - 1;) {
            xd[sd] = 0;
            if (!sd) {
              ++e;
              xd.unshift(1);
            }
          }
        }

        // Determine trailing zeros.
        for (len = xd.length; !xd[len - 1]; --len);

        // E.g. [4, 11, 15] becomes 4bf.
        for (i = 0, str = ''; i < len; i++) str += NUMERALS.charAt(xd[i]);

        // Add binary exponent suffix?
        if (isExp) {
          if (len > 1) {
            if (baseOut == 16 || baseOut == 8) {
              i = baseOut == 16 ? 4 : 3;
              for (--len; len % i; len++) str += '0';
              xd = convertBase(str, base, baseOut);
              for (len = xd.length; !xd[len - 1]; --len);

              // xd[0] will always be be 1
              for (i = 1, str = '1.'; i < len; i++) str += NUMERALS.charAt(xd[i]);
            } else {
              str = str.charAt(0) + '.' + str.slice(1);
            }
          }

          str =  str + (e < 0 ? 'p' : 'p+') + e;
        } else if (e < 0) {
          for (; ++e;) str = '0' + str;
          str = '0.' + str;
        } else {
          if (++e > len) for (e -= len; e-- ;) str += '0';
          else if (e < len) str = str.slice(0, e) + '.' + str.slice(e);
        }
      }

      str = (baseOut == 16 ? '0x' : baseOut == 2 ? '0b' : baseOut == 8 ? '0o' : '') + str;
    }

    return x.s < 0 ? '-' + str : str;
  }


  // Does not strip trailing zeros.
  function truncate(arr, len) {
    if (arr.length > len) {
      arr.length = len;
      return true;
    }
  }


  // Decimal methods


  /*
   *  abs
   *  acos
   *  acosh
   *  add
   *  asin
   *  asinh
   *  atan
   *  atanh
   *  atan2
   *  cbrt
   *  ceil
   *  clone
   *  config
   *  cos
   *  cosh
   *  div
   *  exp
   *  floor
   *  hypot
   *  ln
   *  log
   *  log2
   *  log10
   *  max
   *  min
   *  mod
   *  mul
   *  pow
   *  random
   *  round
   *  set
   *  sign
   *  sin
   *  sinh
   *  sqrt
   *  sub
   *  tan
   *  tanh
   *  trunc
   */


  /*
   * Return a new Decimal whose value is the absolute value of `x`.
   *
   * x {number|string|Decimal}
   *
   */
  function abs(x) {
    return new this(x).abs();
  }


  /*
   * Return a new Decimal whose value is the arccosine in radians of `x`.
   *
   * x {number|string|Decimal}
   *
   */
  function acos(x) {
    return new this(x).acos();
  }


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic cosine of `x`, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function acosh(x) {
    return new this(x).acosh();
  }


  /*
   * Return a new Decimal whose value is the sum of `x` and `y`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   * y {number|string|Decimal}
   *
   */
  function add(x, y) {
    return new this(x).plus(y);
  }


  /*
   * Return a new Decimal whose value is the arcsine in radians of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function asin(x) {
    return new this(x).asin();
  }


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic sine of `x`, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function asinh(x) {
    return new this(x).asinh();
  }


  /*
   * Return a new Decimal whose value is the arctangent in radians of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function atan(x) {
    return new this(x).atan();
  }


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic tangent of `x`, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function atanh(x) {
    return new this(x).atanh();
  }


  /*
   * Return a new Decimal whose value is the arctangent in radians of `y/x` in the range -pi to pi
   * (inclusive), rounded to `precision` significant digits using rounding mode `rounding`.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-pi, pi]
   *
   * y {number|string|Decimal} The y-coordinate.
   * x {number|string|Decimal} The x-coordinate.
   *
   * atan2(±0, -0)               = ±pi
   * atan2(±0, +0)               = ±0
   * atan2(±0, -x)               = ±pi for x > 0
   * atan2(±0, x)                = ±0 for x > 0
   * atan2(-y, ±0)               = -pi/2 for y > 0
   * atan2(y, ±0)                = pi/2 for y > 0
   * atan2(±y, -Infinity)        = ±pi for finite y > 0
   * atan2(±y, +Infinity)        = ±0 for finite y > 0
   * atan2(±Infinity, x)         = ±pi/2 for finite x
   * atan2(±Infinity, -Infinity) = ±3*pi/4
   * atan2(±Infinity, +Infinity) = ±pi/4
   * atan2(NaN, x) = NaN
   * atan2(y, NaN) = NaN
   *
   */
  function atan2(y, x) {
    y = new this(y);
    x = new this(x);
    var r,
      pr = this.precision,
      rm = this.rounding,
      wpr = pr + 4;

    // Either NaN
    if (!y.s || !x.s) {
      r = new this(NaN);

    // Both ±Infinity
    } else if (!y.d && !x.d) {
      r = getPi(this, wpr, 1).times(x.s > 0 ? 0.25 : 0.75);
      r.s = y.s;

    // x is ±Infinity or y is ±0
    } else if (!x.d || y.isZero()) {
      r = x.s < 0 ? getPi(this, pr, rm) : new this(0);
      r.s = y.s;

    // y is ±Infinity or x is ±0
    } else if (!y.d || x.isZero()) {
      r = getPi(this, wpr, 1).times(0.5);
      r.s = y.s;

    // Both non-zero and finite
    } else if (x.s < 0) {
      this.precision = wpr;
      this.rounding = 1;
      r = this.atan(divide(y, x, wpr, 1));
      x = getPi(this, wpr, 1);
      this.precision = pr;
      this.rounding = rm;
      r = y.s < 0 ? r.minus(x) : r.plus(x);
    } else {
      r = this.atan(divide(y, x, wpr, 1));
    }

    return r;
  }


  /*
   * Return a new Decimal whose value is the cube root of `x`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function cbrt(x) {
    return new this(x).cbrt();
  }


  /*
   * Return a new Decimal whose value is `x` rounded to an integer using `ROUND_CEIL`.
   *
   * x {number|string|Decimal}
   *
   */
  function ceil(x) {
    return finalise(x = new this(x), x.e + 1, 2);
  }


  /*
   * Configure global settings for a Decimal constructor.
   *
   * `obj` is an object with one or more of the following properties,
   *
   *   precision  {number}
   *   rounding   {number}
   *   toExpNeg   {number}
   *   toExpPos   {number}
   *   maxE       {number}
   *   minE       {number}
   *   modulo     {number}
   *   crypto     {boolean|number}
   *   defaults   {true}
   *
   * E.g. Decimal.config({ precision: 20, rounding: 4 })
   *
   */
  function config(obj) {
    if (!obj || typeof obj !== 'object') throw Error(decimalError + 'Object expected');
    var i, p, v,
      useDefaults = obj.defaults === true,
      ps = [
        'precision', 1, MAX_DIGITS,
        'rounding', 0, 8,
        'toExpNeg', -EXP_LIMIT, 0,
        'toExpPos', 0, EXP_LIMIT,
        'maxE', 0, EXP_LIMIT,
        'minE', -EXP_LIMIT, 0,
        'modulo', 0, 9
      ];

    for (i = 0; i < ps.length; i += 3) {
      if (p = ps[i], useDefaults) this[p] = DEFAULTS[p];
      if ((v = obj[p]) !== void 0) {
        if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
        else throw Error(invalidArgument + p + ': ' + v);
      }
    }

    if (p = 'crypto', useDefaults) this[p] = DEFAULTS[p];
    if ((v = obj[p]) !== void 0) {
      if (v === true || v === false || v === 0 || v === 1) {
        if (v) {
          if (typeof crypto != 'undefined' && crypto &&
            (crypto.getRandomValues || crypto.randomBytes)) {
            this[p] = true;
          } else {
            throw Error(cryptoUnavailable);
          }
        } else {
          this[p] = false;
        }
      } else {
        throw Error(invalidArgument + p + ': ' + v);
      }
    }

    return this;
  }


  /*
   * Return a new Decimal whose value is the cosine of `x`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function cos(x) {
    return new this(x).cos();
  }


  /*
   * Return a new Decimal whose value is the hyperbolic cosine of `x`, rounded to precision
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function cosh(x) {
    return new this(x).cosh();
  }


  /*
   * Create and return a Decimal constructor with the same configuration properties as this Decimal
   * constructor.
   *
   */
  function clone(obj) {
    var i, p, ps;

    /*
     * The Decimal constructor and exported function.
     * Return a new Decimal instance.
     *
     * v {number|string|Decimal} A numeric value.
     *
     */
    function Decimal(v) {
      var e, i, t,
        x = this;

      // Decimal called without new.
      if (!(x instanceof Decimal)) return new Decimal(v);

      // Retain a reference to this Decimal constructor, and shadow Decimal.prototype.constructor
      // which points to Object.
      x.constructor = Decimal;

      // Duplicate.
      if (v instanceof Decimal) {
        x.s = v.s;
        x.e = v.e;
        x.d = (v = v.d) ? v.slice() : v;
        return;
      }

      t = typeof v;

      if (t === 'number') {
        if (v === 0) {
          x.s = 1 / v < 0 ? -1 : 1;
          x.e = 0;
          x.d = [0];
          return;
        }

        if (v < 0) {
          v = -v;
          x.s = -1;
        } else {
          x.s = 1;
        }

        // Fast path for small integers.
        if (v === ~~v && v < 1e7) {
          for (e = 0, i = v; i >= 10; i /= 10) e++;
          x.e = e;
          x.d = [v];
          return;

        // Infinity, NaN.
        } else if (v * 0 !== 0) {
          if (!v) x.s = NaN;
          x.e = NaN;
          x.d = null;
          return;
        }

        return parseDecimal(x, v.toString());

      } else if (t !== 'string') {
        throw Error(invalidArgument + v);
      }

      // Minus sign?
      if (v.charCodeAt(0) === 45) {
        v = v.slice(1);
        x.s = -1;
      } else {
        x.s = 1;
      }

      return isDecimal.test(v) ? parseDecimal(x, v) : parseOther(x, v);
    }

    Decimal.prototype = P;

    Decimal.ROUND_UP = 0;
    Decimal.ROUND_DOWN = 1;
    Decimal.ROUND_CEIL = 2;
    Decimal.ROUND_FLOOR = 3;
    Decimal.ROUND_HALF_UP = 4;
    Decimal.ROUND_HALF_DOWN = 5;
    Decimal.ROUND_HALF_EVEN = 6;
    Decimal.ROUND_HALF_CEIL = 7;
    Decimal.ROUND_HALF_FLOOR = 8;
    Decimal.EUCLID = 9;

    Decimal.config = Decimal.set = config;
    Decimal.clone = clone;
    Decimal.isDecimal = isDecimalInstance;

    Decimal.abs = abs;
    Decimal.acos = acos;
    Decimal.acosh = acosh;        // ES6
    Decimal.add = add;
    Decimal.asin = asin;
    Decimal.asinh = asinh;        // ES6
    Decimal.atan = atan;
    Decimal.atanh = atanh;        // ES6
    Decimal.atan2 = atan2;
    Decimal.cbrt = cbrt;          // ES6
    Decimal.ceil = ceil;
    Decimal.cos = cos;
    Decimal.cosh = cosh;          // ES6
    Decimal.div = div;
    Decimal.exp = exp;
    Decimal.floor = floor;
    Decimal.hypot = hypot;        // ES6
    Decimal.ln = ln;
    Decimal.log = log;
    Decimal.log10 = log10;        // ES6
    Decimal.log2 = log2;          // ES6
    Decimal.max = max;
    Decimal.min = min;
    Decimal.mod = mod;
    Decimal.mul = mul;
    Decimal.pow = pow;
    Decimal.random = random;
    Decimal.round = round;
    Decimal.sign = sign;          // ES6
    Decimal.sin = sin;
    Decimal.sinh = sinh;          // ES6
    Decimal.sqrt = sqrt;
    Decimal.sub = sub;
    Decimal.tan = tan;
    Decimal.tanh = tanh;          // ES6
    Decimal.trunc = trunc;        // ES6

    if (obj === void 0) obj = {};
    if (obj) {
      if (obj.defaults !== true) {
        ps = ['precision', 'rounding', 'toExpNeg', 'toExpPos', 'maxE', 'minE', 'modulo', 'crypto'];
        for (i = 0; i < ps.length;) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
      }
    }

    Decimal.config(obj);

    return Decimal;
  }


  /*
   * Return a new Decimal whose value is `x` divided by `y`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   * y {number|string|Decimal}
   *
   */
  function div(x, y) {
    return new this(x).div(y);
  }


  /*
   * Return a new Decimal whose value is the natural exponential of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} The power to which to raise the base of the natural log.
   *
   */
  function exp(x) {
    return new this(x).exp();
  }


  /*
   * Return a new Decimal whose value is `x` round to an integer using `ROUND_FLOOR`.
   *
   * x {number|string|Decimal}
   *
   */
  function floor(x) {
    return finalise(x = new this(x), x.e + 1, 3);
  }


  /*
   * Return a new Decimal whose value is the square root of the sum of the squares of the arguments,
   * rounded to `precision` significant digits using rounding mode `rounding`.
   *
   * hypot(a, b, ...) = sqrt(a^2 + b^2 + ...)
   *
   */
  function hypot() {
    var i, n,
      t = new this(0);

    external = false;

    for (i = 0; i < arguments.length;) {
      n = new this(arguments[i++]);
      if (!n.d) {
        if (n.s) {
          external = true;
          return new this(1 / 0);
        }
        t = n;
      } else if (t.d) {
        t = t.plus(n.times(n));
      }
    }

    external = true;

    return t.sqrt();
  }


  /*
   * Return true if object is a Decimal instance (where Decimal is any Decimal constructor),
   * otherwise return false.
   *
   */
  function isDecimalInstance(obj) {
    return obj instanceof Decimal || obj && obj.name === '[object Decimal]' || false;
  }


  /*
   * Return a new Decimal whose value is the natural logarithm of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function ln(x) {
    return new this(x).ln();
  }


  /*
   * Return a new Decimal whose value is the log of `x` to the base `y`, or to base 10 if no base
   * is specified, rounded to `precision` significant digits using rounding mode `rounding`.
   *
   * log[y](x)
   *
   * x {number|string|Decimal} The argument of the logarithm.
   * y {number|string|Decimal} The base of the logarithm.
   *
   */
  function log(x, y) {
    return new this(x).log(y);
  }


  /*
   * Return a new Decimal whose value is the base 2 logarithm of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function log2(x) {
    return new this(x).log(2);
  }


  /*
   * Return a new Decimal whose value is the base 10 logarithm of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function log10(x) {
    return new this(x).log(10);
  }


  /*
   * Return a new Decimal whose value is the maximum of the arguments.
   *
   * arguments {number|string|Decimal}
   *
   */
  function max() {
    return maxOrMin(this, arguments, 'lt');
  }


  /*
   * Return a new Decimal whose value is the minimum of the arguments.
   *
   * arguments {number|string|Decimal}
   *
   */
  function min() {
    return maxOrMin(this, arguments, 'gt');
  }


  /*
   * Return a new Decimal whose value is `x` modulo `y`, rounded to `precision` significant digits
   * using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   * y {number|string|Decimal}
   *
   */
  function mod(x, y) {
    return new this(x).mod(y);
  }


  /*
   * Return a new Decimal whose value is `x` multiplied by `y`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   * y {number|string|Decimal}
   *
   */
  function mul(x, y) {
    return new this(x).mul(y);
  }


  /*
   * Return a new Decimal whose value is `x` raised to the power `y`, rounded to precision
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} The base.
   * y {number|string|Decimal} The exponent.
   *
   */
  function pow(x, y) {
    return new this(x).pow(y);
  }


  /*
   * Returns a new Decimal with a random value equal to or greater than 0 and less than 1, and with
   * `sd`, or `Decimal.precision` if `sd` is omitted, significant digits (or less if trailing zeros
   * are produced).
   *
   * [sd] {number} Significant digits. Integer, 0 to MAX_DIGITS inclusive.
   *
   */
  function random(sd) {
    var d, e, k, n,
      i = 0,
      r = new this(1),
      rd = [];

    if (sd === void 0) sd = this.precision;
    else checkInt32(sd, 1, MAX_DIGITS);

    k = Math.ceil(sd / LOG_BASE);

    if (!this.crypto) {
      for (; i < k;) rd[i++] = Math.random() * 1e7 | 0;

    // Browsers supporting crypto.getRandomValues.
    } else if (crypto.getRandomValues) {
      d = crypto.getRandomValues(new Uint32Array(k));

      for (; i < k;) {
        n = d[i];

        // 0 <= n < 4294967296
        // Probability n >= 4.29e9, is 4967296 / 4294967296 = 0.00116 (1 in 865).
        if (n >= 4.29e9) {
          d[i] = crypto.getRandomValues(new Uint32Array(1))[0];
        } else {

          // 0 <= n <= 4289999999
          // 0 <= (n % 1e7) <= 9999999
          rd[i++] = n % 1e7;
        }
      }

    // Node.js supporting crypto.randomBytes.
    } else if (crypto.randomBytes) {

      // buffer
      d = crypto.randomBytes(k *= 4);

      for (; i < k;) {

        // 0 <= n < 2147483648
        n = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 0x7f) << 24);

        // Probability n >= 2.14e9, is 7483648 / 2147483648 = 0.0035 (1 in 286).
        if (n >= 2.14e9) {
          crypto.randomBytes(4).copy(d, i);
        } else {

          // 0 <= n <= 2139999999
          // 0 <= (n % 1e7) <= 9999999
          rd.push(n % 1e7);
          i += 4;
        }
      }

      i = k / 4;
    } else {
      throw Error(cryptoUnavailable);
    }

    k = rd[--i];
    sd %= LOG_BASE;

    // Convert trailing digits to zeros according to sd.
    if (k && sd) {
      n = mathpow(10, LOG_BASE - sd);
      rd[i] = (k / n | 0) * n;
    }

    // Remove trailing words which are zero.
    for (; rd[i] === 0; i--) rd.pop();

    // Zero?
    if (i < 0) {
      e = 0;
      rd = [0];
    } else {
      e = -1;

      // Remove leading words which are zero and adjust exponent accordingly.
      for (; rd[0] === 0; e -= LOG_BASE) rd.shift();

      // Count the digits of the first word of rd to determine leading zeros.
      for (k = 1, n = rd[0]; n >= 10; n /= 10) k++;

      // Adjust the exponent for leading zeros of the first word of rd.
      if (k < LOG_BASE) e -= LOG_BASE - k;
    }

    r.e = e;
    r.d = rd;

    return r;
  }


  /*
   * Return a new Decimal whose value is `x` rounded to an integer using rounding mode `rounding`.
   *
   * To emulate `Math.round`, set rounding to 7 (ROUND_HALF_CEIL).
   *
   * x {number|string|Decimal}
   *
   */
  function round(x) {
    return finalise(x = new this(x), x.e + 1, this.rounding);
  }


  /*
   * Return
   *   1    if x > 0,
   *  -1    if x < 0,
   *   0    if x is 0,
   *  -0    if x is -0,
   *   NaN  otherwise
   *
   */
  function sign(x) {
    x = new this(x);
    return x.d ? (x.d[0] ? x.s : 0 * x.s) : x.s || NaN;
  }


  /*
   * Return a new Decimal whose value is the sine of `x`, rounded to `precision` significant digits
   * using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function sin(x) {
    return new this(x).sin();
  }


  /*
   * Return a new Decimal whose value is the hyperbolic sine of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function sinh(x) {
    return new this(x).sinh();
  }


  /*
   * Return a new Decimal whose value is the square root of `x`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function sqrt(x) {
    return new this(x).sqrt();
  }


  /*
   * Return a new Decimal whose value is `x` minus `y`, rounded to `precision` significant digits
   * using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   * y {number|string|Decimal}
   *
   */
  function sub(x, y) {
    return new this(x).sub(y);
  }


  /*
   * Return a new Decimal whose value is the tangent of `x`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function tan(x) {
    return new this(x).tan();
  }


  /*
   * Return a new Decimal whose value is the hyperbolic tangent of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function tanh(x) {
    return new this(x).tanh();
  }


  /*
   * Return a new Decimal whose value is `x` truncated to an integer.
   *
   * x {number|string|Decimal}
   *
   */
  function trunc(x) {
    return finalise(x = new this(x), x.e + 1, 1);
  }


  // Create and configure initial Decimal constructor.
  Decimal = clone(DEFAULTS);

  Decimal['default'] = Decimal.Decimal = Decimal;

  // Create the internal constants from their string values.
  LN10 = new Decimal(LN10);
  PI = new Decimal(PI);


  // Export.


  // AMD.
  if (typeof define == 'function' && define.amd) {
    define(function () {
      return Decimal;
    });

  // Node and other environments that support module.exports.
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = Decimal;

  // Browser.
  } else {
    if (!globalScope) {
      globalScope = typeof self != 'undefined' && self && self.self == self ? self : window;
    }

    noConflict = globalScope.Decimal;
    Decimal.noConflict = function () {
      globalScope.Decimal = noConflict;
      return Decimal;
    };

    globalScope.Decimal = Decimal;
  }
})(this);

},{}],13:[function(require,module,exports){
let debug = false;

//glabol params
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
        if (debug)
            console.warn("Localization : Trying to get an unloaded lib : "+libPath)
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

},{}],14:[function(require,module,exports){
exports.IIF_version = '0.0.2';

exports.Game = require('./game.js');
exports.dataStruct = {
    BreakInfinity : require('./dataStruct/breakinfinity.js'),
    Decimal : require('./dataStruct/decimal.js'),
}
exports.View = require('./view.js');
exports.html = require('./html.js');
exports.localization = require('./localization.js');

window.IIF = exports;

},{"./dataStruct/breakinfinity.js":5,"./dataStruct/decimal.js":6,"./game.js":9,"./html.js":10,"./localization.js":13,"./view.js":17}],15:[function(require,module,exports){
let debug = true;

let IIF = require("./main");

class Save {
    constructor (saveKey,gameObj) {

        if (debug)
            console.log("Save : new Save()",saveKey,gameObj);

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
                IIF_version : IIF.IIF_version,
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
        if (this.gameObj.config.ticks) {
            this.data.time = this.gameObj.getTicker().toJSON();
        }

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
        if ((this.gameObj.config.ticks) && !(typeof(this.data.time) === "undefined")) {
            this.gameObj.getTicker().fromJSON(this.data.time);
        }
        return this.data;
    }
    upgradeSave_IIF() {

        if (this.data.meta.IIF_version === IIF.IIF_version)
            return;

        if (debug)
            console.log('Save : migrating IIF savedData from ',this.data.meta.IIF_version,'to',IIF.IIF_version);

        switch(this.data.meta.IIF_version) {
            case '0.0.1' : ;// add here the migration code for saveData from 0.0.1 to the next version. Don't put a break, and put versions in chronological order to trigger all the upgrades necessary
                // this.data.values = this.data.data;
                // delete(this.data.data);
            default:break;
        }
        this.data.meta.IIF_version = IIF.IIF_version;

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

},{"./main":14}],16:[function(require,module,exports){
let debug = true;

let _running = new WeakMap();
let _lastTotalTicks = new WeakMap();

class Time {
    constructor (tickedObject,ticksPerSecond) {

        if (debug)
            console.log("Time : new Time()",tickedObject,ticksPerSecond);

        let that = this;
        this.tickedObject = tickedObject;
        this.ticksPerSecond = ticksPerSecond;
        this.worker = new Worker('IIFWorker.js');
        this.worker.onmessage = function(e) {
            that.handleWorkerMessage.call(that,e);
        }
        _running.set(this,false);
        _lastTotalTicks.set(this,0);
    }
    isRunning () {
        return _running.get(this);
    }
    unpause () {
        _running.set(this,true);
        this.worker.postMessage({action:'unpause'});
    }
    pause () {
        _running.set(this,false);
        this.worker.postMessage({action:'pause'});
    }
    restart () {
        _running.set(this,false);
        this.worker.postMessage({
            action:'restart',
            ticksPerSecond:ticksPerSecond,
        });
    }
    tick () {
        this.worker.postMessage({action:'tick'});
    }
    handleWorkerMessage(e) {
        if (debug)
            console.log("Time : recieving a message from the worker",e.data,this);
        let response = e.data;
        switch (response[0]) {
            case 'doTick' :
                _lastTotalTicks.set(this,response[2]);
                if (response[1] > 0)
                    this.tickedObject.processTicks(response[1]);
                break;
            default : break;
        }
    }
    toJSON() {
        return {
            running : this.isRunning(),
            lastTicks : _lastTotalTicks.get(this),
        }
    }
    fromJSON(json) {
        if (!((typeof(json.running) === "undefined") || (typeof(json.lastTicks) === "undefined"))) {
            if (debug)
                console.log("Time : loading from json",json);
            _running.set(this,json.running);
            this.worker.postMessage({
                action:'setState',
                ticks:json.lastTicks,
                running:json.running,
            });
        }

    }
}

module.exports = Time;

},{}],17:[function(require,module,exports){
let debug = true;

let html = require('./html');

let _tplsToLoad = new WeakMap();

class View {
    constructor (config) {

        if (debug)
            console.log("View : new View()",config);

        this.config = config;
        this.components = {};
        if (!(typeof(config.customTpls) === "undefined")) {
            _tplsToLoad.set(this,Object.keys(config.customTpls).length);
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
        _tplsToLoad.set(this,_tplsToLoad.get(this)-1);
        if (_tplsToLoad.get(this)<=0) {
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

},{"./html":10}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL0d1aXptby9BcHBEYXRhL1JvYW1pbmcvbnBtL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJFeGFtcGxlL2dhbWUuanMiLCJFeGFtcGxlL21haW4uanMiLCJFeGFtcGxlL3ZpZXcuanMiLCJJSUYvZGF0YVN0cnVjdC9iaWdudW1iZXIuanMiLCJJSUYvZGF0YVN0cnVjdC9icmVha2luZmluaXR5LmpzIiwiSUlGL2RhdGFTdHJ1Y3QvZGVjaW1hbC5qcyIsIklJRi9kYXRhU3RydWN0L2dhbWV2YWx1ZS5qcyIsIklJRi9kYXRhU3RydWN0L3NhdmVkVmFsdWUuanMiLCJJSUYvZ2FtZS5qcyIsIklJRi9pbnB1dC5qcyIsIklJRi9saWIvYnJlYWtfaW5maW5pdHkuanMiLCJJSUYvbGliL2RlY2ltYWwuanMiLCJJSUYvbG9jYWxpemF0aW9uLmpzIiwiSUlGL21haW4uanMiLCJJSUYvc2F2ZS5qcyIsIklJRi90aW1lLmpzIiwiSUlGL3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTUEsSUFBSSxRQUFRLEtBQUssQ0FBQzs7QUFFbEIsQUFBdUI7QUFDdkIsSUFBSSxlQUFlLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUU3QyxVQUFVO0lBQ04sWUFBWSxTQUFTOztRQUVqQixJQUFJLEtBQUs7WUFDTCxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7UUFFM0MsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQ2xCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNmLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLFFBQVEsS0FBSyxDQUFDO1FBQ2xCLE9BQU8sUUFBUSxNQUFNLE1BQU0sRUFBRSxjQUFjLEVBQUUsRUFBRTtZQUMzQyxJQUFJLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLFNBQVMsTUFBTSxPQUFPLENBQUMsS0FBSyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDM0M7S0FDSjtJQUNELElBQUksVUFBVTtRQUNWLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztLQUMxQjtJQUNELFFBQVEsR0FBRztRQUNQLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQztRQUNwQixJQUFJLFNBQVMsSUFBSSxPQUFPLENBQUM7UUFDekIsTUFBTSxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLGNBQWM7WUFDM0MsT0FBTyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNsRCxDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUM7S0FDZjtDQUNKO0FBQ0QsSUFBSSxPQUFPO0lBQ1AsZUFBZSx3Q0FBNEQ7SUFDM0UsZUFBZSxDQUFDLG1GQUE2RDt3QkFDekQsQ0FBQyxjQUFjLENBQUMsWUFBWSxPQUFPLE1BQU0sQ0FBQzt3QkFDMUMsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLE9BQU8sUUFBUSxDQUFDO0NBQ3JFOztBQUVELGlDQUFpQztJQUM3QixJQUFJLE9BQU8sS0FBSyxDQUFDOztJQUVqQixLQUFLLENBQUMsSUFBSSxDQUFDO2FBQ0YsQ0FBQyxZQUFZLFFBQVEsS0FBSyxFQUFFLENBQUM7YUFDN0IsQ0FBQyxTQUFTO1lBQ1gsSUFBSSxLQUFLO2dCQUNMLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoRCxPQUFPLEtBQUssQ0FBQztTQUNoQixDQUFDO2NBQ0ksQ0FBQyxnQkFBZ0I7WUFDbkIsT0FBTyxLQUFLLENBQUMscUNBQXFDLENBQUMsS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUUsQ0FBQzthQUNHLENBQUMsSUFBSTtZQUNOLFFBQVEsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDM0IsQ0FBQyxDQUFDO0NBQ1Y7QUFDRCxpREFBaUQ7SUFDN0MsSUFBSSxPQUFPLFFBQVEsQ0FBQyxLQUFLLFdBQVc7UUFDaEMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3hCLE9BQU8sQ0FBQyxPQUFPLENBQUMsaUJBQWlCO1FBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDdEIsUUFBUSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDdEIsQ0FBQztDQUNMO0FBQ0QsNEJBQTRCO0lBQ3hCLEdBQUcsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxXQUFXLEVBQUU7UUFDbEMsR0FBRyxLQUFLO1lBQ0osT0FBTyxLQUFLLENBQUMsaUVBQWlFLENBQUMsR0FBRyxDQUFDO1FBQ3ZGLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBQ0QsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSztRQUNuQixPQUFPLEtBQUssQ0FBQztJQUNqQixJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssV0FBVztRQUM3QixPQUFPLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztJQUU5QixNQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYztRQUNyQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzFCLENBQUMsQ0FBQztJQUNILE9BQU8sR0FBRyxRQUFRLEVBQUUsQ0FBQztDQUN4QjtBQUNELGtDQUFrQztJQUM5QixPQUFPLE1BQU0sQ0FBQyxlQUFlLENBQUM7S0FDN0IsT0FBTyxJQUFJO1FBQ1IsT0FBTyxZQUFZLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0tBQ3hDLENBQUMsQ0FBQztDQUNOO0FBQ0QsT0FBTyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3hCLE9BQU8sVUFBVSxHQUFHLFNBQVMsQ0FBQztBQUM5QixPQUFPLGNBQWMsR0FBRyxhQUFhLENBQUM7OztBQ3pGdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2gvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1dEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJsZXQgX0lJRiA9IHJlcXVpcmUoXCIuLi9JSUYvbWFpblwiKTtcclxubGV0IF9WaWV3ID0gcmVxdWlyZShcIi4vdmlld1wiKTtcclxuXHJcbmNsYXNzIEdhbWUgZXh0ZW5kcyBfSUlGLkdhbWUge1xyXG4gICAgY29uc3RydWN0b3IoYXJncykge1xyXG4gICAgICAgIHN1cGVyKHtcclxuICAgICAgICAgICAgbGFuZ3MgOiBbJ2VuLUVOJ10sIC8vIG9wdGlvbmFsLCB3aWxsIGRlZmF1bHQgdG8gZW4tRU4uIHdpbCBiZSBpZ25vcmVkIGlmIG5vIGxpYk5hbWUgaXMgZ2l2ZW5cclxuICAgICAgICAgICAgbGliTmFtZSA6ICdFeGFtcGxlJywgLy8gb3B0aW9uYWwsIHNldCB0byBsaWJOYW1lIHRvIGxvYWQgbGFuZy9saWJOYW1lLnhtbCBhbmQgYWN0aXZhdGUgbG9jYWxpemF0aW9uIHVzaW5nIHRoZSBfdHh0IGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIHZpZXdDbGFzcyA6IF9WaWV3LCAvLyBtYWluIHZpZXcgdGhhdCB3aWxsIGJlIHRhcmdldGVkIGZvciByZWRyYXdzIG9uIHZhbHVlIHVwZGF0ZXNcclxuICAgICAgICAgICAgc2F2ZUtleSA6ICdleGFtcGxlJywgLy8gbmVjZXNzYXJ5IGZvciB0aGUgc2F2ZS9sb2FkIGZ1bmN0aW9ucyB0byB3b3JrXHJcbiAgICAgICAgICAgIGdhbWVWZXJzaW9uIDogJzAuMScsIC8vIHVzZWQgZm9yIHNhdmUgbWlncmF0aW9uL3ZlcnNpb25pbmdcclxuICAgICAgICAgICAgdGlja3MgOiA1MCwvLyBpZiBzZXQgdG8gYSB2YWx1ZSwgYWN0aXZhdGVzIHRoZSB3b3JrZXIgdG8gdGljayB3aGVuIG5lZWRlZCwgYWN0aXZhdGVzIHRoZSBmdW5jdGlvbnMgZ2FtZS51bnBhdXNlLCBnYW1lLnBhdXNlIGFuZCBnYW1lLnJlc3RhcnQuIFRhcmdldCBhcyBtYW55IHRpY2tzIHBlciBzZWNvbmQgYXMgdGhlIHZhbHVlXHJcbiAgICAgICAgICAgIGdhbWVWYWx1ZXMgOiB7IC8vIGdhbWUgdmFsdWVzIGFyZSBzYXZlZCwgYW5kIGFyZSBsaW5rZWQgdG8gYSB2aWV3IGNvbXBvbmVudCBmb3IgcmVkcmF3LiBpdCBnaXZlcyBoYW5kbGVzIGxpa2UgZ2FtZS5nZXRWYWx1ZSh2YWx1ZUtleSkgKHBhc3NlZCBhcyByZWZlcmVuY2UpIGFuZCBnYW1lLnJlZHJhd1ZhbHVlKHZhbHVlS2V5KSBmb3IgYSB0YXJnZXRlZCByZWRyYXdcclxuXHJcbiAgICAgICAgICAgICAgICBnb2xkIDoge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxldCdzIGRlZmluZSB0aGUgZ29sZCB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgOiAnZ29sZFZhbHVlRGlzcGxheScsXHJcbiAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBjb21wb25lbnQgdGhhdCB3aWxsIGJlIHVzZWQuIE5lZWRzIHRvIGJlIGRlY2xhcmVkIGluIHRoZSB2aWV3IHVzaW5nIHRoZSBzYW1lIGNvbXBvbmVudElEIG9yIHdpbGwgcmFpc2UgZXJyb3JzXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgOiBuZXcgX0lJRi5kYXRhU3RydWN0LkRlY2ltYWwoMTAwLDMpLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHBhcmFtcyBhcmUgaW5pdGlhbCB2YWx1ZSBhbmQgcHJlY2lzaW9uIHRvIGRpc3BsYXlcclxuICAgICAgICAgICAgICAgICAgICAvLyBkZXBlbmRpbmcgb24gd2hhdCB5b3UgZG8gd2l0aCB0aGlzIHZhbHVlLCB5b3UgbWF5IHdhbnQgdG8gdXNlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSUlGLmRhdGFTdHJ1Y3QuRGVjaW1hbCBmb3IgbW9yZSBwcmVjaXNlIHZhbHVlcywgd2l0aCBiaWcgbnVtYmVyc1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElJRi5kYXRhU3RydWN0LkJyZWFrSW5maW5pdHkgZm9yIGZhc3QgY2FsY3VsYXRpb24sIHdpdGggYmlnIG51bWJlcnNcclxuICAgICAgICAgICAgICAgICAgICAvLyBhbm90aGVyIGNsYXNzIHRoYXQgeW91IGJ1aWxkLCB0aGF0IHByZXNlbnRzIHRoZSBtZXRob2RzIHRvU3RyKCkgZm9yIGRyYXdpbmcsIHRvSlNPTigpIGFuZCBmcm9tSlNPTihqc29uKSBmb3Igc2F2ZSBhbmQgbG9hZCBiZWhhdmlvdXJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcyA6IHsgLy8gZGVjbGFyaW5nIGRlcGVuZGVuY2llcyB3aWxsIGxvYWQgdGhlbSwgYW5kIGNhbGwgZ2FtZS5vbkRlcGVuZGVuY2llc0xvYWRlZCB3aGVuIGl0IGlzIGRvbmUuXHJcbiAgICAgICAgICAgICAgICBoYW1tZXIgOiAnRXhhbXBsZS9saWIvaGFtbWVyLm1pbi5qcycsIC8vIGluIHRoaXMgZXhhbXBsZSwgeW91IGNhbiB0aGVuIGFjY2VzcyBoYW1tZXIubWluLmpzIHRob3VnaCBnYW1lLmdldERlcGVuZGVuY3koJ2hhbW1lcicpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBvbkRlcGVuZGVuY3lMb2FkZWQoa2V5KSB7IC8vIGlmIHlvdSBkZWZpbmUgdGhpcyBmdW5jdGlvbiwgaXQgd2lsbCBiZSBjYWxsZWQgdXBvbiBlYWNoIGRlcGVuZGVuY3kgdGhhdCB3YXMgYXNrZWQgaW4gdGhlIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJFeGFtcGxlIEdhbWUgOiBkZXBlbmRlbmN5IGxvYWRlZFwiLGtleSk7XHJcbiAgICB9XHJcbiAgICBvbkRlcGVuZGVuY2llc0xvYWRlZCgpIHsgLy8gaWYgeW91IGRlZmluZSB0aGlzIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGNhbGxlZCBvbmNlIGFsbCBkZXBlbmRlbmNpZXMgYXJlIGxvYWRlZFxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXhhbXBsZSBHYW1lIDogYWxsIGRlcGVuZGVuY2llcyBsb2FkZWRcIik7XHJcbiAgICAgICAgdGhpcy5oYW1tZXJUZXN0KCk7XHJcbiAgICB9XHJcbiAgICB1cGdyYWRlU2F2ZSAoc2F2ZURhdGEsZnJvbVZlcnNpb24pIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInVwZ3JhZGluZyBzYXZlZGF0YSBmcm9tIGdhbWVcIixzYXZlRGF0YSxcImZyb20gZ2FtZSB2ZXJzaW9uXCIsZnJvbVZlcnNpb24pO1xyXG4gICAgICAgIC8vIGlmIHNhdmVEYXRhIGNoYW5nZXMgc3RydWN0dXJlIGZyb20gb25lIGdhbWUgdmVyc2lvbiB0byBhbm90aGVyLCB5b3UgY2FuIGFsdGVyIHRoZSBzYXZlZCBnYW1lcyBoZXJlLlxyXG4gICAgICAgIHN3aXRjaChmcm9tVmVyc2lvbikge1xyXG4gICAgICAgICAgICBjYXNlICcwLjEnIDogLy8gcHV0IGhlcmUgdGhlIG5lY2Vzc2FyeSBjaGFuZ2VzIGZyb20gdmVyc2lvbiAwLjEgdG8gdGhlIG5leHQuIERvbid0IHVzZSBhIGJyZWFrLCBzbyBmb2xsb3dpbmcgdXBncmFkZXMgd2lsbCB0cmlnZ2VyIHRvb1xyXG4gICAgICAgICAgICBkZWZhdWx0OjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzYXZlRGF0YTtcclxuICAgIH1cclxuICAgIGFkZEdvbGQgKHF1YW50aXR5KSB7XHJcbiAgICAgICAgdGhpcy5nZXRWYWx1ZSgnZ29sZCcpLmFkZChxdWFudGl0eSk7XHJcbiAgICAgICAgdGhpcy5yZWRyYXdWYWx1ZSgnZ29sZCcpXHJcbiAgICB9XHJcbiAgICBtdWx0R29sZCAoZXhwb25lbnQpIHtcclxuICAgICAgICBsZXQgZ29sZFZhbHVlID0gdGhpcy5nZXRWYWx1ZSgnZ29sZCcpXHJcbiAgICAgICAgbGV0IGN1cnJlbnRHb2xkID0gZ29sZFZhbHVlLmdldFZhbHVlKCk7XHJcbiAgICAgICAgY3VycmVudEdvbGQgPSBjdXJyZW50R29sZCpNYXRoLnBvdygxMCxleHBvbmVudCk7XHJcbiAgICAgICAgZ29sZFZhbHVlLnNldFZhbHVlKGN1cnJlbnRHb2xkKTtcclxuICAgICAgICB0aGlzLnJlZHJhd1ZhbHVlKCdnb2xkJylcclxuICAgIH1cclxuICAgIHJlc2V0R29sZCAoKSB7XHJcbiAgICAgICAgdGhpcy5nZXRWYWx1ZSgnZ29sZCcpLnNldFZhbHVlKDEwMCk7XHJcbiAgICAgICAgdGhpcy5yZWRyYXdWYWx1ZSgnZ29sZCcpXHJcbiAgICB9XHJcbiAgICBoYW1tZXJUZXN0KCkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hhbW1lckRpc3BsYXknKTtcclxuICAgICAgICB2YXIgbWMgPSBuZXcgSGFtbWVyKGVsZW1lbnQpO1xyXG4gICAgICAgIG1jLm9uKFwicGFubGVmdCBwYW5yaWdodCB0YXAgcHJlc3NcIiwgZnVuY3Rpb24oZXYpIHtcclxuICAgICAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IGV2LnR5cGUgK1wiIGdlc3R1cmUgZGV0ZWN0ZWQuXCI7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xyXG4iLCJsZXQgX0dhbWUgPSByZXF1aXJlKFwiLi9nYW1lXCIpO1xyXG5cclxud2luZG93LmdhbWUgPSBuZXcgX0dhbWUoKTtcclxuIiwibGV0IF9JSUYgPSByZXF1aXJlKFwiLi4vSUlGL21haW5cIik7XHJcbmxldCBfdHh0ID0gX0lJRi5odG1sLmxvY2FsaXplZFRleHQ7XHJcblxyXG5jbGFzcyBWaWV3IGV4dGVuZHMgX0lJRi5WaWV3IHtcclxuICAgIGNvbnN0cnVjdG9yIChwYXJhbXMpIHtcclxuICAgICAgICAvLyBpbiB0aGlzIGV4YW1wbGUsIHdlIHdpbGwgdXNlIGEgY3VzdG9tIFRQTFxyXG4gICAgICAgIHBhcmFtcy5jdXN0b21UcGxzID0ge1xyXG4gICAgICAgICAgICBjb250cm9sIDogJ0V4YW1wbGUvdHBsL2NvbnRyb2wudHBsJyxcclxuICAgICAgICAgICAgbW9uaXRvciA6ICdFeGFtcGxlL3RwbC9tb25pdG9yLnRwbCcsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHlvdSBjYW4gYWxzbyBkZWZpbmUgdHBsIGR1cmluZyBydW50aW1lIHdpdGggOlxyXG4gICAgICAgIC8vIF9JSUYuaHRtbC5kZWZpbmVUcGwoJ2NvbnRyb2wnLCdFeGFtcGxlL3RwbC9jb250cm9sLnRwbCcpO1xyXG5cclxuICAgICAgICAvLyB3ZSB0aGVuIHdpbGwgdXNlIHRoYXQgY29tcG9uZW50IGZvciAyIGNvbnRyb2xzXHJcbiAgICAgICAgcGFyYW1zLmNvbXBvbmVudHMgPSB7XHJcbiAgICAgICAgICAgIGFkZEdvbGQgOiB7XHJcbiAgICAgICAgICAgICAgICB0cGwgOiAnY29udHJvbCcsXHJcbiAgICAgICAgICAgICAgICB0cGxCaW5kaW5ncyA6IHtcclxuICAgICAgICAgICAgICAgICAgICBvbmNsaWNrIDogJ2dhbWUuYWRkR29sZCgxMCknLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgOiBfdHh0KFwidGVzdF9vdXRwdXQ+Y29udHJvbHM+YWRkR29sZFwiKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhbmNob3IgOiAnYWRkR29sZCcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG11bHRpcGx5R29sZCA6IHtcclxuICAgICAgICAgICAgICAgIHRwbCA6ICdjb250cm9sJyxcclxuICAgICAgICAgICAgICAgIHRwbEJpbmRpbmdzIDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2sgOiAnZ2FtZS5tdWx0R29sZCgxKScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA6IF90eHQoXCJ0ZXN0X291dHB1dD5jb250cm9scz5tdWx0R29sZFwiKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhbmNob3IgOiAnbXVsdEdvbGQnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXNldEdvbGQgOiB7XHJcbiAgICAgICAgICAgICAgICB0cGwgOiAnY29udHJvbCcsXHJcbiAgICAgICAgICAgICAgICB0cGxCaW5kaW5ncyA6IHtcclxuICAgICAgICAgICAgICAgICAgICBvbmNsaWNrIDogJ2dhbWUucmVzZXRHb2xkKCknLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgOiBfdHh0KFwidGVzdF9vdXRwdXQ+Y29udHJvbHM+cmVzZXRHb2xkXCIpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFuY2hvciA6ICdyZXNldEdvbGQnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzYXZlIDoge1xyXG4gICAgICAgICAgICAgICAgdHBsIDogJ2NvbnRyb2wnLFxyXG4gICAgICAgICAgICAgICAgdHBsQmluZGluZ3MgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25jbGljayA6ICdnYW1lLnNhdmUoKScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA6IF90eHQoXCJ0ZXN0X291dHB1dD5jb250cm9scz5zYXZlXCIpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFuY2hvciA6ICdzYXZlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbG9hZCA6IHtcclxuICAgICAgICAgICAgICAgIHRwbCA6ICdjb250cm9sJyxcclxuICAgICAgICAgICAgICAgIHRwbEJpbmRpbmdzIDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2sgOiAnZ2FtZS5sb2FkKCknLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgOiBfdHh0KFwidGVzdF9vdXRwdXQ+Y29udHJvbHM+bG9hZFwiKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhbmNob3IgOiAnbG9hZCcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNsZWFyU2F2ZSA6IHtcclxuICAgICAgICAgICAgICAgIHRwbCA6ICdjb250cm9sJyxcclxuICAgICAgICAgICAgICAgIHRwbEJpbmRpbmdzIDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2sgOiAnZ2FtZS5jbGVhclNhdmUoKScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA6IF90eHQoXCJ0ZXN0X291dHB1dD5jb250cm9scz5jbGVhclNhdmVcIiksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYW5jaG9yIDogJ2NsZWFyU2F2ZScsXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzdGFydFRpbWUgOiB7XHJcbiAgICAgICAgICAgICAgICB0cGwgOiAnY29udHJvbCcsXHJcbiAgICAgICAgICAgICAgICB0cGxCaW5kaW5ncyA6IHtcclxuICAgICAgICAgICAgICAgICAgICBvbmNsaWNrIDogJ2dhbWUudW5wYXVzZSgpJyxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0IDogX3R4dChcInRlc3Rfb3V0cHV0PmNvbnRyb2xzPnVucGF1c2VcIiksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYW5jaG9yIDogJ3VucGF1c2UnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdG9wVGltZSA6IHtcclxuICAgICAgICAgICAgICAgIHRwbCA6ICdjb250cm9sJyxcclxuICAgICAgICAgICAgICAgIHRwbEJpbmRpbmdzIDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2sgOiAnZ2FtZS5wYXVzZSgpJyxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0IDogX3R4dChcInRlc3Rfb3V0cHV0PmNvbnRyb2xzPnBhdXNlXCIpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFuY2hvciA6ICdwYXVzZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRpY2sgOiB7XHJcbiAgICAgICAgICAgICAgICB0cGwgOiAnY29udHJvbCcsXHJcbiAgICAgICAgICAgICAgICB0cGxCaW5kaW5ncyA6IHtcclxuICAgICAgICAgICAgICAgICAgICBvbmNsaWNrIDogJ2dhbWUudGljaygpJyxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0IDogX3R4dChcInRlc3Rfb3V0cHV0PmNvbnRyb2xzPnRpY2tcIiksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYW5jaG9yIDogJ3RpY2snLFxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ29sZERpc3BsYXkgOiB7XHJcbiAgICAgICAgICAgICAgICB0cGwgOiAnbW9uaXRvcicsXHJcbiAgICAgICAgICAgICAgICB0cGxCaW5kaW5ncyA6IHtcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbCA6IF90eHQoXCJ0ZXN0X291dHB1dD5yZXNvdXJjZT5nb2xkPmxhYmVsXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlIDogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVJZCA6ICdnb2xkVmFsdWVEaXNwbGF5JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhbmNob3IgOiAnZ29sZERpc3BsYXknLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnb2xkVmFsdWVEaXNwbGF5IDoge1xyXG4gICAgICAgICAgICAgICAgdHBsIDogJ3VwZGF0ZWRWYWx1ZScsXHJcbiAgICAgICAgICAgICAgICB0cGxCaW5kaW5ncyA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpZCA6ICdnb2xkRGlzcGxheV92YWx1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsIDogJycsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYW5jaG9yIDogJ2dvbGRWYWx1ZURpc3BsYXknLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH1cclxuICAgICAgICBzdXBlcihwYXJhbXMpXHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBWaWV3O1xyXG4iLCJsZXQgZGVidWcgPSB0cnVlO1xyXG5cclxubGV0IGRlY2ltYWwgPSByZXF1aXJlKCcuLi9saWIvZGVjaW1hbC5qcycpO1xyXG5cclxubGV0IF92YWx1ZUNsYXNzID0gbmV3IFdlYWtNYXAoKTtcclxubGV0IF92YWx1ZSA9IG5ldyBXZWFrTWFwKCk7XHJcblxyXG5mdW5jdGlvbiBnZXRFeHBvbmVudCAodmFsdWUpIHtcclxuICAgIGxldCBzcGxpdCA9IHZhbHVlLnRvRXhwb25lbnRpYWwoKS5zcGxpdCgnZScpXHJcbiAgICBsZXQgZGlzcGxheUV4cG9uZW50ID0gc3BsaXRbMV0gKiAxO1xyXG4gICAgbGV0IGRpc3BsYXlWYWx1ZSA9IHNwbGl0WzBdICogMTtcclxuICAgIGxldCByZW1vdmVkRXhwb25lbnQgPSBkaXNwbGF5RXhwb25lbnQlMztcclxuICAgIGRpc3BsYXlFeHBvbmVudCAtPSByZW1vdmVkRXhwb25lbnQ7XHJcbiAgICBkaXNwbGF5VmFsdWUgKj0gTWF0aC5wb3coMTAscmVtb3ZlZEV4cG9uZW50KTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdmFsdWUgOiBkaXNwbGF5VmFsdWUsXHJcbiAgICAgICAgZXhwb25lbnQgOiBkaXNwbGF5RXhwb25lbnQsXHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEJpZ051bWJlciB7XHJcbiAgICBjb25zdHJ1Y3RvciAodmFsdWVDbGFzcyxwcmVjaXNpb24pIHtcclxuXHJcbiAgICAgICAgaWYgKGRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJpZ051bWJlciA6IG5ldyBCaWdOdW1iZXIoKVwiLHByZWNpc2lvbik7XHJcblxyXG4gICAgICAgIHRoaXMucHJlY2lzaW9uID0gcHJlY2lzaW9uO1xyXG4gICAgICAgIHRoaXMuZGlzcGxheV9tb2RlID0gJ3RvU2hvcnRTdWZmaXgnO1xyXG4gICAgICAgIF92YWx1ZUNsYXNzLnNldCh0aGlzLHZhbHVlQ2xhc3MpO1xyXG4gICAgfVxyXG4gICAgc2V0VmFsdWUgKGluaXRpYWxWYWx1ZSkge1xyXG4gICAgICAgIF92YWx1ZS5zZXQodGhpcyxuZXcgKF92YWx1ZUNsYXNzLmdldCh0aGlzKSkoaW5pdGlhbFZhbHVlKSlcclxuICAgIH1cclxuICAgIHNldFZhbHVlT2JqICh2YWx1ZU9iaikge1xyXG4gICAgICAgIF92YWx1ZS5zZXQodGhpcyx2YWx1ZU9iailcclxuICAgIH1cclxuICAgIGdldFZhbHVlICgpIHtcclxuICAgICAgICByZXR1cm4gX3ZhbHVlLmdldCh0aGlzKTtcclxuICAgIH1cclxuICAgIGFkZCAodG9BZGQpIHtcclxuICAgICAgICBfdmFsdWUuc2V0KHRoaXMsdGhpcy5nZXRWYWx1ZSgpLmFkZCh0b0FkZCkpO1xyXG4gICAgfVxyXG4gICAgdG9TdHIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzW3RoaXMuZGlzcGxheV9tb2RlXSgpO1xyXG4gICAgfVxyXG4gICAgdG9TY2llbnRpZmljICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZSgpLnRvRXhwb25lbnRpYWwoKTtcclxuICAgIH1cclxuICAgIHRvRW5naW5lZXJpbmcgKCkge1xyXG4gICAgICAgIGxldCB2YWx1ZVBhcnRzID0gZ2V0RXhwb25lbnQoX3ZhbHVlLmdldCh0aGlzKSk7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlUGFydHMudmFsdWUudG9GaXhlZCh0aGlzLnByZWNpc2lvbikrXCJlXCIrKHZhbHVlUGFydHMuZXhwb25lbnQgPiAwID8gJysnIDogJycpK3ZhbHVlUGFydHMuZXhwb25lbnQ7XHJcbiAgICB9XHJcbiAgICB0b1Nob3J0U3VmZml4ICgpIHtcclxuICAgICAgICBsZXQgdmFsdWVQYXJ0cyA9IGdldEV4cG9uZW50KF92YWx1ZS5nZXQodGhpcykpO1xyXG4gICAgICAgIGxldCBzdWZmaXggPSBcImVcIisodmFsdWVQYXJ0cy5leHBvbmVudCA+IDAgPyAnKycgOiAnJykrdmFsdWVQYXJ0cy5leHBvbmVudFxyXG4gICAgICAgIHN3aXRjaCAodmFsdWVQYXJ0cy5leHBvbmVudC8zKSB7XHJcbiAgICAgICAgICAgIGNhc2UgLTggOiBzdWZmaXggPSAneSc7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgLTcgOiBzdWZmaXggPSAneic7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgLTYgOiBzdWZmaXggPSAnYSc7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgLTUgOiBzdWZmaXggPSAnZic7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgLTQgOiBzdWZmaXggPSAncCc7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgLTMgOiBzdWZmaXggPSAnbic7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgLTIgOiBzdWZmaXggPSAnwrUnO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIC0xIDogc3VmZml4ID0gJ20nO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDAgOiBzdWZmaXggPSAnJzticmVhaztcclxuICAgICAgICAgICAgY2FzZSAxIDogc3VmZml4ID0gJ2snO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDIgOiBzdWZmaXggPSAnTSc7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMyA6IHN1ZmZpeCA9ICdHJzticmVhaztcclxuICAgICAgICAgICAgY2FzZSA0IDogc3VmZml4ID0gJ1QnO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDUgOiBzdWZmaXggPSAnUCc7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNiA6IHN1ZmZpeCA9ICdFJzticmVhaztcclxuICAgICAgICAgICAgY2FzZSA3IDogc3VmZml4ID0gJ1onO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDggOiBzdWZmaXggPSAnWSc7YnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6YnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZVBhcnRzLnZhbHVlLnRvRml4ZWQodGhpcy5wcmVjaXNpb24pK3N1ZmZpeDtcclxuICAgIH1cclxuICAgIHRvTG9uZ1N1ZmZpeCAoKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlUGFydHMgPSBnZXRFeHBvbmVudChfdmFsdWUuZ2V0KHRoaXMpKTtcclxuICAgICAgICBsZXQgc3VmZml4ID0gXCJlXCIrKHZhbHVlUGFydHMuZXhwb25lbnQgPiAwID8gJysnIDogJycpK3ZhbHVlUGFydHMuZXhwb25lbnRcclxuICAgICAgICBzd2l0Y2ggKHZhbHVlUGFydHMuZXhwb25lbnQvMykge1xyXG4gICAgICAgICAgICBjYXNlIC04IDogc3VmZml4ID0gJ3lvY3RvJzticmVhaztcclxuICAgICAgICAgICAgY2FzZSAtNyA6IHN1ZmZpeCA9ICd6ZXB0byc7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgLTYgOiBzdWZmaXggPSAnYXR0byc7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgLTUgOiBzdWZmaXggPSAnZmVtdG8nO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIC00IDogc3VmZml4ID0gJ3BpY28nO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIC0zIDogc3VmZml4ID0gJ25hbm8nO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIC0yIDogc3VmZml4ID0gJ21pY3JvJzticmVhaztcclxuICAgICAgICAgICAgY2FzZSAtMSA6IHN1ZmZpeCA9ICdtaWxsaSc7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMCA6IHN1ZmZpeCA9ICcnO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDEgOiBzdWZmaXggPSAna2lsbyc7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMiA6IHN1ZmZpeCA9ICdtZWdhJzticmVhaztcclxuICAgICAgICAgICAgY2FzZSAzIDogc3VmZml4ID0gJ2dpZ2EnO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQgOiBzdWZmaXggPSAndGVyYSc7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNSA6IHN1ZmZpeCA9ICdwZXRhJzticmVhaztcclxuICAgICAgICAgICAgY2FzZSA2IDogc3VmZml4ID0gJ2V4YSc7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNyA6IHN1ZmZpeCA9ICd6ZXR0YSc7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgOCA6IHN1ZmZpeCA9ICd5b3R0YSc7YnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6YnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZVBhcnRzLnZhbHVlLnRvRml4ZWQodGhpcy5wcmVjaXNpb24pK3N1ZmZpeDtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCaWdOdW1iZXI7XHJcbiIsImxldCBkZWJ1ZyA9IHRydWU7XHJcblxyXG5sZXQgYnJlYWtfaW5maW5pdHkgPSByZXF1aXJlKCcuLi9saWIvYnJlYWtfaW5maW5pdHkuanMnKTtcclxubGV0IEJpZ051bWJlciA9IHJlcXVpcmUoJy4vYmlnbnVtYmVyLmpzJyk7XHJcblxyXG5sZXQgX3ZhbHVlID0gbmV3IFdlYWtNYXAoKTtcclxuXHJcbmNsYXNzIEJyZWFrSW5maW5pdHkgZXh0ZW5kcyBCaWdOdW1iZXIge1xyXG4gICAgY29uc3RydWN0b3IgKGluaXRpYWxWYWx1ZSxwcmVjaXNpb24pIHtcclxuXHJcbiAgICAgICAgaWYgKGRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJyZWFrSW5maW5pdHkgOiBuZXcgQnJlYWtJbmZpbml0eSgpXCIsaW5pdGlhbFZhbHVlLHByZWNpc2lvbik7XHJcblxyXG4gICAgICAgIHN1cGVyKGJyZWFrX2luZmluaXR5LHByZWNpc2lvbik7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShpbml0aWFsVmFsdWUpO1xyXG4gICAgfVxyXG4gICAgdG9KU09OICgpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmdldFZhbHVlKCk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbWFudGlzc2EgOiB2YWx1ZS5tYW50aXNzYSxcclxuICAgICAgICAgICAgZXhwb25lbnQgOiB2YWx1ZS5leHBvbmVudCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZnJvbUpTT04oanNvbikge1xyXG4gICAgICAgIGlmICghKCh0eXBlb2YoanNvbi5tYW50aXNzYSkgPT09IFwidW5kZWZpbmVkXCIpIHx8ICh0eXBlb2YoanNvbi5leHBvbmVudCkgPT09IFwidW5kZWZpbmVkXCIpKSlcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZU9iaigobmV3IGJyZWFrX2luZmluaXR5KCkpLmZyb21NYW50aXNzYUV4cG9uZW50KGpzb24ubWFudGlzc2EsanNvbi5leHBvbmVudCkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJyZWFrSW5maW5pdHk7XHJcbiIsImxldCBkZWJ1ZyA9IHRydWU7XHJcblxyXG5sZXQgZGVjaW1hbCA9IHJlcXVpcmUoJy4uL2xpYi9kZWNpbWFsLmpzJyk7XHJcbmxldCBCaWdOdW1iZXIgPSByZXF1aXJlKCcuL2JpZ251bWJlci5qcycpO1xyXG5cclxubGV0IF92YWx1ZSA9IG5ldyBXZWFrTWFwKCk7XHJcblxyXG5jbGFzcyBEZWNpbWFsIGV4dGVuZHMgQmlnTnVtYmVyIHtcclxuICAgIGNvbnN0cnVjdG9yIChpbml0aWFsVmFsdWUscHJlY2lzaW9uKSB7XHJcblxyXG4gICAgICAgIGlmIChkZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJEZWNpbWFsIDogbmV3IERlY2ltYWwoKVwiLGluaXRpYWxWYWx1ZSxwcmVjaXNpb24pO1xyXG5cclxuICAgICAgICBzdXBlcihkZWNpbWFsLHByZWNpc2lvbik7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShpbml0aWFsVmFsdWUpO1xyXG4gICAgfVxyXG4gICAgdG9KU09OICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB2YWx1ZSA6IHRoaXMuZ2V0VmFsdWUoKS50b1N0cmluZygpLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBmcm9tSlNPTihqc29uKSB7XHJcbiAgICAgICAgaWYgKCEodHlwZW9mKGpzb24udmFsdWUpID09PSBcInVuZGVmaW5lZFwiKSlcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShqc29uLnZhbHVlKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEZWNpbWFsO1xyXG4iLCJsZXQgZGVidWcgPSB0cnVlO1xyXG5cclxubGV0IFNhdmVkVmFsdWUgPSByZXF1aXJlKCcuL3NhdmVkVmFsdWUnKTtcclxuXHJcbmNsYXNzIEdhbWVWYWx1ZSBleHRlbmRzIFNhdmVkVmFsdWUge1xyXG4gICAgY29uc3RydWN0b3IgKGNvbmZpZykge1xyXG5cclxuICAgICAgICBpZiAoZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2FtZVZhbHVlIDogbmV3IEdhbWVWYWx1ZSgpXCIsY29uZmlnKTtcclxuXHJcbiAgICAgICAgc3VwZXIoY29uZmlnLmRhdGEpO1xyXG4gICAgICAgIHRoaXMuaWQgPSBjb25maWcuaWQ7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnQgPSBjb25maWcuY29tcG9uZW50O1xyXG4gICAgICAgIGlmICghKHR5cGVvZihjb25maWcuYmVoYXZpb3VyKSA9PT0gXCJ1bmRlZmluZWRcIikpIHtcclxuICAgICAgICAgICAgdGhpcy5iZWhhdmlvdXIgPSBuZXcgY29uZmlnLmJlaGF2aW91ciAodGhpcy5nZXRWYWx1ZU9iamVjdCgpKVxyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmJlaGF2aW91ciA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdG9TdHIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWVPYmplY3QoKS50b1N0cigpO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZVZhbHVlO1xyXG4iLCJsZXQgZGVidWcgPSBmYWxzZTtcclxuXHJcbmxldCBfZGF0YXMgPSBuZXcgV2Vha01hcCgpO1xyXG5cclxuY2xhc3MgU2F2ZWRWYWx1ZSB7XHJcbiAgICBjb25zdHJ1Y3RvciAoZGF0YSkge1xyXG5cclxuICAgICAgICBpZiAoZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2ZWRWYWx1ZSA6IG5ldyBTYXZlZFZhbHVlKClcIixkYXRhKTtcclxuXHJcbiAgICAgICAgX2RhdGFzLnNldCh0aGlzLGRhdGEpO1xyXG4gICAgfVxyXG4gICAgZ2V0VmFsdWVPYmplY3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9kYXRhcy5nZXQodGhpcyk7XHJcbiAgICB9XHJcbiAgICB0b0pTT04gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFZhbHVlT2JqZWN0KCkudG9KU09OKCk7XHJcbiAgICB9XHJcbiAgICBmcm9tSlNPTihqc29uKSB7XHJcbiAgICAgICAgdGhpcy5nZXRWYWx1ZU9iamVjdCgpLmZyb21KU09OKGpzb24pO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gU2F2ZWRWYWx1ZTtcclxuIiwibGV0IGRlYnVnID0gdHJ1ZTtcclxuXHJcbmxldCBsb2NhbGl6YXRpb24gPSByZXF1aXJlKCcuL2xvY2FsaXphdGlvbicpO1xyXG5sZXQgdmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xyXG5sZXQgR2FtZVZhbHVlID0gcmVxdWlyZSgnLi9kYXRhU3RydWN0L2dhbWV2YWx1ZScpO1xyXG5sZXQgU2F2ZSA9IHJlcXVpcmUoJy4vc2F2ZScpO1xyXG5sZXQgVGltZSA9IHJlcXVpcmUoJy4vdGltZScpO1xyXG5cclxubGV0IF92aWV3ID0gbmV3IFdlYWtNYXAoKTtcclxubGV0IF92YWx1ZXMgPSBuZXcgV2Vha01hcCgpO1xyXG5sZXQgX3NhdmUgPSBuZXcgV2Vha01hcCgpO1xyXG5sZXQgX3RpbWUgPSBuZXcgV2Vha01hcCgpO1xyXG5sZXQgX2RlcGVuZGVuY2llcyA9IG5ldyBXZWFrTWFwKCk7XHJcblxyXG5sZXQgcmVzZXJ2ZWRWYWx1ZXMgPSBbXCJ0aW1lXCJdO1xyXG5cclxuY2xhc3MgR2FtZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcclxuXHJcbiAgICAgICAgaWYgKGRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdhbWUgOiBuZXcgR2FtZSgpXCIsY29uZmlnKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoISh0eXBlb2YoY29uZmlnLmxpYk5hbWUpID09PSBcInVuZGVmaW5lZFwiKSkge1xyXG4gICAgICAgICAgICBpZiAoKHR5cGVvZihjb25maWcubGFuZ3MpICE9IFwidW5kZWZpbmVkXCIpICYmIChjb25maWcubGFuZ3MubGVuZ3RoID4gMCkpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsaXphdGlvbi5zZXRMYW5nKGNvbmZpZy5sYW5nc1swXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbG9jYWxpemF0aW9uLmxvYWQoY29uZmlnLmxpYk5hbWUsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHRoYXQubG9jYWxpemUoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZihjb25maWcudmlld0NsYXNzKSA9PT0gXCJ1bmRlZmluZWRcIilcclxuICAgICAgICAgICAgY29uZmlnLnZpZXdDbGFzcyA9IHZpZXcudmlld0NsYXNzO1xyXG4gICAgICAgIGxldCB2aWV3ID0gbmV3IGNvbmZpZy52aWV3Q2xhc3Moe1xyXG4gICAgICAgICAgICBvbkluaXRpYWxpemVkIDogdGhpcy5vblZpZXdJbml0aWFsaXplZCxcclxuICAgICAgICAgICAgZ2FtZU9iaiA6IHRoaXMsXHJcbiAgICAgICAgfSlcclxuICAgICAgICBfdmlldy5zZXQodGhpcyx2aWV3KTtcclxuXHJcbiAgICAgICAgX3ZhbHVlcy5zZXQodGhpcyx7fSk7XHJcbiAgICAgICAgaWYgKCEodHlwZW9mKGNvbmZpZy5nYW1lVmFsdWVzKSA9PT0gXCJ1bmRlZmluZWRcIikpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoY29uZmlnLmdhbWVWYWx1ZXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnJlZ2lzdGVyVmFsdWUoa2V5LGNvbmZpZy5nYW1lVmFsdWVzW2tleV0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMucmVkcmF3VmFsdWVzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoISh0eXBlb2YoY29uZmlnLnRpY2tzKSA9PT0gXCJ1bmRlZmluZWRcIikpIHtcclxuICAgICAgICAgICAgX3RpbWUuc2V0KHRoaXMsbmV3IFRpbWUodGhpcyxjb25maWcudGlja3MpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgoISh0eXBlb2YoY29uZmlnLmRlcGVuZGVuY2llcykgPT09IFwidW5kZWZpbmVkXCIpKSAmJiAoT2JqZWN0LmtleXMoY29uZmlnLmRlcGVuZGVuY2llcykubGVuZ3RoID4gMCkpIHtcclxuICAgICAgICAgICAgLy8gdGhlcmUgYXJlIGRlcGVuZGVuY2llcyB0byBsb2FkXHJcbiAgICAgICAgICAgIGxldCBkZXBlbmRlbmNpZXMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGNvbmZpZy5kZXBlbmRlbmNpZXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXNba2V5XSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5sb2FkRGVwZW5kZW5jeShrZXksY29uZmlnLmRlcGVuZGVuY2llc1trZXldLGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkZXBlbmRlbmNpZXMgPSBfZGVwZW5kZW5jaWVzLmdldCh0aGF0KTtcclxuICAgICAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXNba2V5XSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgX2RlcGVuZGVuY2llcy5zZXQodGhhdCxkZXBlbmRlbmNpZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YodGhpcy5vbkRlcGVuZGVuY3lMb2FkZWQpID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkRlcGVuZGVuY3lMb2FkZWQuY2FsbChnYW1lLGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YodGhpcy5vbkRlcGVuZGVuY2llc0xvYWRlZCkgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWxsRGVwZW5kYW5jeUxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGRlcGVuZGVuY2llcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbERlcGVuZGFuY3lMb2FkZWQgPSBhbGxEZXBlbmRhbmN5TG9hZGVkICYmIGRlcGVuZGVuY2llc1trZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxsRGVwZW5kYW5jeUxvYWRlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25EZXBlbmRlbmNpZXNMb2FkZWQuY2FsbChnYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIF9kZXBlbmRlbmNpZXMuc2V0KHRoaXMsZGVwZW5kZW5jaWVzKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfc2F2ZS5zZXQodGhpcyxuZXcgU2F2ZShjb25maWcuc2F2ZUtleSx0aGlzKSk7XHJcbiAgICB9XHJcbiAgICBsb2FkRGVwZW5kZW5jeSAoa2V5LHBhdGgsY2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgZmV0Y2gocGF0aClcclxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UudGV4dCgpKVxyXG4gICAgICAgICAgICAudGhlbihfZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGVidWcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHYW1lIDogTG9hZGVkIGRlcGVuZGVuY3lcIixwYXRoKTtcclxuICAgICAgICAgICAgICAgIGV2YWwoX2RhdGEpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkdhbWUgOiBFcnJvciB3aGlsZSBsb2FkaW5nIGEgZGVwZW5kZW5jeSA6IFwiLGVycm9yLm1lc3NhZ2UscGF0aCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKCgpPT57XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoYXQpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gdmFsdWVzIG1hbmFnZW1lbnRcclxuICAgIHJlZHJhd1ZhbHVlKGtleSkge1xyXG4gICAgICAgIF92aWV3LmdldCh0aGlzKS5yZWRyYXdDb21wb25lbnQoX3ZhbHVlcy5nZXQodGhpcylba2V5XSk7XHJcbiAgICB9XHJcbiAgICByZWRyYXdWYWx1ZXMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0VmlldygpLmluaXRpYWxpemVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHZhbHVlcyA9IF92YWx1ZXMuZ2V0KHRoaXMpO1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBPYmplY3Qua2V5cyh2YWx1ZXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgIF92aWV3LmdldCh0aGF0KS5yZWRyYXdDb21wb25lbnQodmFsdWVzW2tleV0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmVnaXN0ZXJWYWx1ZSAoa2V5LGNvbmZpZykge1xyXG4gICAgICAgIGlmIChyZXNlcnZlZFZhbHVlcy5pbmRleE9mKGtleSk+PTApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignR2FtZSA6IHRyeWluZyB0byByZWdpc3RlciBhIHZhbHVlIHdpdGggYSByZXNlcnZlZCBrZXkgOicsa2V5KTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdmFsdWVzID0gX3ZhbHVlcy5nZXQodGhpcyk7XHJcbiAgICAgICAgaWYgKCEodHlwZW9mKHZhbHVlc1trZXldKSA9PT0gXCJ1bmRlZmluZWRcIikpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdHYW1lIDogdHJ5aW5nIHRvIGNyZWF0ZSBhIHJlZ2lzdGVyZWQgdmFsdWUgd2l0aCBhbiBhbHJlYWR5IHRha2VuIGlkZW50aWZpZXIgOicsa2V5KVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbmZpZy5pZCA9IGtleTtcclxuICAgICAgICB2YWx1ZXNba2V5XSA9IG5ldyBHYW1lVmFsdWUoY29uZmlnKTtcclxuICAgICAgICBfdmFsdWVzLnNldCh0aGlzLHZhbHVlcyk7XHJcbiAgICB9XHJcbiAgICBsaXN0VmFsdWVzKCkge1xyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhfdmFsdWVzLmdldCh0aGlzKSk7XHJcbiAgICB9XHJcbiAgICBnZXRWYWx1ZShrZXkpIHtcclxuICAgICAgICByZXR1cm4gX3ZhbHVlcy5nZXQodGhpcylba2V5XS5nZXRWYWx1ZU9iamVjdCgpO1xyXG4gICAgfVxyXG4gICAgLy8gdmlldyBtYW5hZ2VtZW50XHJcbiAgICBsb2NhbGl6ZSgpIHtcclxuICAgICAgICBpZiAoISh0eXBlb2YodGhpcy5jb25maWcubGliTmFtZSkgPT09IFwidW5kZWZpbmVkXCIpKVxyXG4gICAgICAgICAgICBsb2NhbGl6YXRpb24ucGFyc2VQYWdlKHRoaXMuY29uZmlnLmxpYk5hbWUpO1xyXG4gICAgfVxyXG4gICAgb25WaWV3SW5pdGlhbGl6ZWQgKCkge1xyXG4gICAgICAgIGlmIChkZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJHYW1lIDogVmlldyBpbml0aWFsaXplZFwiLHRoaXMpXHJcbiAgICAgICAgaWYgKCEodHlwZW9mKHRoaXMuY29uZmlnLmxpYk5hbWUpID09PSBcInVuZGVmaW5lZFwiKSkgIC8vIGlmIHRoZSBnYW1lIGlzIGxvY2FsaXplZCwgd2UgcGFyc2UgdGhlIHBhZ2Ugbm93IHRoYXQgdGhlIHZpZXcgaXMgYnVpbHQuIFRoZSBwYWdlIGlzIGFscmVhZHkgcGFyc2VkIGFmdGVyIHRoZSBsaWIgaXMgbG9hZGVkIGJ1dCB3ZSBwcmVwYXJlZCB0aGUgdGV4dHMgYmVmb3JlIHRoYXRcclxuICAgICAgICAgICAgbG9jYWxpemF0aW9uLnBhcnNlUGFnZSh0aGlzLmNvbmZpZy5saWJOYW1lKTtcclxuICAgICAgICB0aGlzLnJlZHJhd1ZhbHVlcygpO1xyXG4gICAgICAgIHRoaXMubG9jYWxpemUoKTtcclxuICAgIH1cclxuICAgIGdldFZpZXcgKCkge1xyXG4gICAgICAgIHJldHVybiBfdmlldy5nZXQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBkcmF3ICgpIHtcclxuICAgICAgICBfdmlldy5nZXQodGhpcykuZHJhdygpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlICh0YXJnZXQpIHtcclxuICAgICAgICBfdmlldy5nZXQodGhpcykudXBkYXRlKHRhcmdldCk7XHJcbiAgICB9XHJcbiAgICAvL3NhdmUgbWFuYWdlbWVudFxyXG4gICAgbG9hZCAoKSB7XHJcbiAgICAgICAgX3NhdmUuZ2V0KHRoaXMpLmxvYWQoKTtcclxuICAgICAgICB0aGlzLnJlZHJhd1ZhbHVlcygpO1xyXG4gICAgfVxyXG4gICAgc2F2ZSAoKSB7XHJcbiAgICAgICAgX3NhdmUuZ2V0KHRoaXMpLnNhdmUoKTtcclxuICAgIH1cclxuICAgIGNsZWFyU2F2ZSAoKSB7XHJcbiAgICAgICAgX3NhdmUuZ2V0KHRoaXMpLmNsZWFyU2F2ZSgpO1xyXG4gICAgfVxyXG4gICAgLy90aW1lIG1hbmFnZW1lbnRcclxuICAgIGdldFRpY2tlcigpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcudGlja3MpXHJcbiAgICAgICAgICAgIHJldHVybiBfdGltZS5nZXQodGhpcyk7XHJcbiAgICB9XHJcbiAgICB1bnBhdXNlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcudGlja3MpXHJcbiAgICAgICAgICAgIF90aW1lLmdldCh0aGlzKS51bnBhdXNlKCk7XHJcbiAgICB9XHJcbiAgICBwYXVzZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnRpY2tzKVxyXG4gICAgICAgICAgICBfdGltZS5nZXQodGhpcykucGF1c2UoKTtcclxuICAgIH1cclxuICAgIHJlc3RhcnQgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy50aWNrcylcclxuICAgICAgICAgICAgX3RpbWUuZ2V0KHRoaXMpLnJlc3RhcnQoKTtcclxuICAgIH1cclxuICAgIHRpY2sgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy50aWNrcylcclxuICAgICAgICAgICAgX3RpbWUuZ2V0KHRoaXMpLnRpY2soKTtcclxuICAgIH1cclxuICAgIHByb2Nlc3NUaWNrcyAodGlja0NvdW50KSB7XHJcbiAgICAgICAgaWYoZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2FtZSA6IHByb2Nlc3NpbmcgdGlja3MsIHRpY2tDb3VudCA6XCIsdGlja0NvdW50KTtcclxuXHJcblxyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcclxuIiwibGV0IGRlYnVnID0gZmFsc2U7XHJcblxyXG5sZXQgZnMgPSByZXF1aXJlKCdmcycpO1xyXG5sZXQgbG9jYWxpemF0aW9uID0gcmVxdWlyZSgnLi9sb2NhbGl6YXRpb24nKTtcclxuXHJcbmNsYXNzIFRwbCB7XHJcbiAgICBjb25zdHJ1Y3RvciAodHBsU3RyKSB7XHJcblxyXG4gICAgICAgIGlmIChkZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJodG1sIDogbmV3IFRwbCgpXCIsdHBsU3RyKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdHIgPSB0cGxTdHI7XHJcbiAgICAgICAgdGhpcy5rZXlzID0gW107XHJcbiAgICAgICAgdGhpcy52YWx1ZXMgPSB7fTtcclxuICAgICAgICBsZXQgbWF0Y2ggPSBmYWxzZTtcclxuICAgICAgICB3aGlsZSAobWF0Y2ggPSB0cGxTdHIubWF0Y2goKC97eyhbYS16XSspfX0vKSkpIHtcclxuICAgICAgICAgICAgdGhpcy5rZXlzLnB1c2gobWF0Y2hbMV0pO1xyXG4gICAgICAgICAgICB0cGxTdHIgPSB0cGxTdHIuc3Vic3RyKG1hdGNoLmluZGV4ICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0IChrZXksdmFsKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZXNba2V5XSA9IHZhbDtcclxuICAgIH1cclxuICAgIGdldEh0bWwgKCkge1xyXG4gICAgICAgIGxldCBodG1sID0gdGhpcy5zdHI7XHJcbiAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMudmFsdWVzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlKFwie3tcIitrZXkrXCJ9fVwiLHZhbHVlc1trZXldKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfVxyXG59XHJcbmxldCB0cGxzID0ge1xyXG4gICAgdXBkYXRlZFZhbHVlIDogZnMucmVhZEZpbGVTeW5jKF9fZGlybmFtZSArIFwiL2h0bWwvdXBkYXRlZFZhbHVlLnRwbFwiLCd1dGY4JyksXHJcbiAgICBsb2NhbGl6ZWRUZXh0IDooZnMucmVhZEZpbGVTeW5jKF9fZGlybmFtZSArIFwiL2h0bWwvbG9jYWxpemVkVGV4dC50cGxcIiwndXRmOCcpKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoJ3t7bG9jQ2xhc3N9fScsbG9jYWxpemF0aW9uLmNvbmZpZy5jbGFzcylcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd7e2xvY0RhdGFLZXl9fScsbG9jYWxpemF0aW9uLmNvbmZpZy5kYXRhS2V5KSxcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZFRwbCAocGF0aCxjYWxsYmFjaykge1xyXG4gICAgbGV0IGRhdGEgPSBmYWxzZTtcclxuXHJcbiAgICBmZXRjaChwYXRoKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLnRleHQoKSlcclxuICAgICAgICAudGhlbihfZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkZWJ1ZylcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaHRtbCA6IExvYWRlZCB0cGxcIixwYXRoLF9kYXRhKTtcclxuICAgICAgICAgICAgZGF0YSA9IF9kYXRhO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcImh0bWwgOiBFcnJvciB3aGlsZSBsb2FkaW5nIGEgdHBsIDogXCIsZXJyb3IubWVzc2FnZSxwYXRoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCgpPT57XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcyxkYXRhKVxyXG4gICAgICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGRlZmluZVRwbCAodHBsS2V5LHRwbFBhdGgsY2FsbGJhY2ssY3R4KSB7XHJcbiAgICBpZiAodHlwZW9mKGNhbGxiYWNrKSA9PT0gXCJ1bmRlZmluZWRcIilcclxuICAgICAgICBjYWxsYmFjayA9ICgoKT0+e30pO1xyXG4gICAgbG9hZFRwbCh0cGxQYXRoLGZ1bmN0aW9uKHRwbFN0cikge1xyXG4gICAgICAgIHRwbHNbdHBsS2V5XSA9IHRwbFN0cjtcclxuICAgICAgICBjYWxsYmFjay5jYWxsKGN0eCk7XHJcbiAgICB9KVxyXG59XHJcbmZ1bmN0aW9uIGdldFRwbCAodHBsLGRhdGFzKSB7XHJcbiAgICBpZih0eXBlb2YodHBsc1t0cGxdKSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIGlmKGRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJodG1sIDogVHJ5aW5nIHRvIHVzZSBhIHRwbCB0aGF0IGlzbid0IGRlY2xhcmVkLCBvciBsb2FkZWQgeWV0IDpcIix0cGwpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYgKHRwbHNbdHBsXSA9PT0gZmFsc2UpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgaWYgKHR5cGVvZihkYXRhcykgPT09IFwidW5kZWZpbmVkXCIpXHJcbiAgICAgICAgcmV0dXJuIG5ldyBUcGwodHBsc1t0cGxdKTtcclxuXHJcbiAgICB0cGwgPSBuZXcgVHBsKHRwbHNbdHBsXSk7XHJcbiAgICBPYmplY3Qua2V5cyhkYXRhcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcclxuICAgICAgICB0cGwuc2V0KGtleSxkYXRhc1trZXldKVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdHBsLmdldEh0bWwoKTtcclxufVxyXG5mdW5jdGlvbiBsb2NhbGl6ZWRUZXh0IChwYXRoLGxpYikge1xyXG4gICAgcmV0dXJuIGdldFRwbCgnbG9jYWxpemVkVGV4dCcse1xyXG4gICAgXHRwYXRoIDogcGF0aCxcclxuICAgICAgICB0ZXh0IDogbG9jYWxpemF0aW9uLmdldFRleHQocGF0aCxsaWIpXHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmdldFRwbCA9IGdldFRwbDtcclxuZXhwb3J0cy5kZWZpbmVUcGwgPSBkZWZpbmVUcGw7XHJcbmV4cG9ydHMubG9jYWxpemVkVGV4dCA9IGxvY2FsaXplZFRleHQ7XHJcbiIsIjsoZnVuY3Rpb24gKGdsb2JhbFNjb3BlKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuLy9TVEFSVCBwYWQtZW5kICggaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvcGFkLWVuZCApXHJcblxyXG52YXIgcGFkRW5kID0gZnVuY3Rpb24gKHN0cmluZywgbWF4TGVuZ3RoLCBmaWxsU3RyaW5nKSB7XHJcblxyXG4gIGlmIChzdHJpbmcgPT0gbnVsbCB8fCBtYXhMZW5ndGggPT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIHN0cmluZztcclxuICB9XHJcblxyXG4gIHZhciByZXN1bHQgICAgPSBTdHJpbmcoc3RyaW5nKTtcclxuXHJcbiAgdmFyIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XHJcbiAgaWYgKGxlbmd0aCA+PSBtYXhMZW5ndGgpIHtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICB2YXIgZmlsbGVkID0gZmlsbFN0cmluZyA9PSBudWxsID8gJycgOiBTdHJpbmcoZmlsbFN0cmluZyk7XHJcbiAgaWYgKGZpbGxlZCA9PT0gJycpIHtcclxuICAgIGZpbGxlZCA9ICcgJztcclxuICB9XHJcblxyXG4gIHZhciBmaWxsTGVuID0gbWF4TGVuZ3RoIC0gbGVuZ3RoO1xyXG5cclxuICB3aGlsZSAoZmlsbGVkLmxlbmd0aCA8IGZpbGxMZW4pIHtcclxuICAgIGZpbGxlZCArPSBmaWxsZWQ7XHJcbiAgfVxyXG5cclxuICB2YXIgdHJ1bmNhdGVkID0gZmlsbGVkLmxlbmd0aCA+IGZpbGxMZW4gPyBmaWxsZWQuc3Vic3RyKDAsIGZpbGxMZW4pIDogZmlsbGVkO1xyXG5cclxuICByZXR1cm4gcmVzdWx0ICsgdHJ1bmNhdGVkO1xyXG59O1xyXG5cclxuLy9FTkQgcGFkLWVuZFxyXG5cclxuLy9JRTYgcG9seWZpbGxzXHJcblxyXG4vL0Fsc28gbmVlZCBwb2x5ZmlsbHMgb24gSUU2OiBsb2cyLCBsb2cxcCwgaHlwb3QsIGltdWwsIGZyb3VuZCwgZXhwbTEsIGNsejMyLCBjYnJ0LCBoeXBlcmJvbGljIHRyaWdcclxuXHJcbk1hdGgubG9nMTAgPSBNYXRoLmxvZzEwIHx8IGZ1bmN0aW9uKHgpIHtcclxuXHRyZXR1cm4gTWF0aC5sb2coeCkgKiBNYXRoLkxPRzEwRTtcclxufTtcclxuXHJcbk51bWJlci5pc0ludGVnZXIgPSBOdW1iZXIuaXNJbnRlZ2VyIHx8IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiZcclxuICAgIGlzRmluaXRlKHZhbHVlKSAmJlxyXG4gICAgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlO1xyXG59O1xyXG5cclxuTnVtYmVyLmlzU2FmZUludGVnZXIgPSBOdW1iZXIuaXNTYWZlSW50ZWdlciB8fCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIodmFsdWUpICYmIE1hdGguYWJzKHZhbHVlKSA8PSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxufTtcclxuXHJcbmlmICghTWF0aC50cnVuYykge1xyXG5cdE1hdGgudHJ1bmMgPSBmdW5jdGlvbih2KSB7XHJcblx0XHR2ID0gK3Y7XHJcblx0XHRpZiAoIWlzRmluaXRlKHYpKSByZXR1cm4gdjtcclxuXHJcblx0XHRyZXR1cm4gKHYgLSB2ICUgMSkgICB8fCAgICh2IDwgMCA/IC0wIDogdiA9PT0gMCA/IHYgOiAwKTtcclxuXHJcblx0XHQvLyByZXR1cm5zOlxyXG5cdFx0Ly8gIDAgICAgICAgIC0+ICAwXHJcblx0XHQvLyAtMCAgICAgICAgLT4gLTBcclxuXHRcdC8vICAwLjIgICAgICAtPiAgMFxyXG5cdFx0Ly8gLTAuMiAgICAgIC0+IC0wXHJcblx0XHQvLyAgMC43ICAgICAgLT4gIDBcclxuXHRcdC8vIC0wLjcgICAgICAtPiAtMFxyXG5cdFx0Ly8gIEluZmluaXR5IC0+ICBJbmZpbml0eVxyXG5cdFx0Ly8gLUluZmluaXR5IC0+IC1JbmZpbml0eVxyXG5cdFx0Ly8gIE5hTiAgICAgIC0+ICBOYU5cclxuXHRcdC8vICBudWxsICAgICAtPiAgMFxyXG5cdH07XHJcbn1cclxuXHJcbmlmICghTWF0aC5zaWduKSB7XHJcbiAgTWF0aC5zaWduID0gZnVuY3Rpb24oeCkge1xyXG4gICAgLy8gSWYgeCBpcyBOYU4sIHRoZSByZXN1bHQgaXMgTmFOLlxyXG4gICAgLy8gSWYgeCBpcyAtMCwgdGhlIHJlc3VsdCBpcyAtMC5cclxuICAgIC8vIElmIHggaXMgKzAsIHRoZSByZXN1bHQgaXMgKzAuXHJcbiAgICAvLyBJZiB4IGlzIG5lZ2F0aXZlIGFuZCBub3QgLTAsIHRoZSByZXN1bHQgaXMgLTEuXHJcbiAgICAvLyBJZiB4IGlzIHBvc2l0aXZlIGFuZCBub3QgKzAsIHRoZSByZXN1bHQgaXMgKzEuXHJcbiAgICByZXR1cm4gKCh4ID4gMCkgLSAoeCA8IDApKSB8fCAreDtcclxuICAgIC8vIEEgbW9yZSBhZXN0aGV0aWNhbCBwZXJzdWFkby1yZXByZXNlbnRhdGlvbiBpcyBzaG93biBiZWxvd1xyXG4gICAgLy9cclxuICAgIC8vICggKHggPiAwKSA/IDAgOiAxICkgIC8vIGlmIHggaXMgbmVnYXRpdmUgdGhlbiBuZWdhdGl2ZSBvbmVcclxuICAgIC8vICAgICAgICAgICsgICAgICAgICAgIC8vIGVsc2UgKGJlY2F1c2UgeW91IGNhbnQgYmUgYm90aCAtIGFuZCArKVxyXG4gICAgLy8gKCAoeCA8IDApID8gMCA6IC0xICkgLy8gaWYgeCBpcyBwb3NpdGl2ZSB0aGVuIHBvc2l0aXZlIG9uZVxyXG4gICAgLy8gICAgICAgICB8fCAgICAgICAgICAgLy8gaWYgeCBpcyAwLCAtMCwgb3IgTmFOLCBvciBub3QgYSBudW1iZXIsXHJcbiAgICAvLyAgICAgICAgICt4ICAgICAgICAgICAvLyBUaGVuIHRoZSByZXN1bHQgd2lsbCBiZSB4LCAob3IpIGlmIHggaXNcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIC8vIG5vdCBhIG51bWJlciwgdGhlbiB4IGNvbnZlcnRzIHRvIG51bWJlclxyXG4gIH07XHJcbn1cclxuXHJcblx0LypcclxuXHJcblx0IyBicmVha19pbmZpbml0eS5qc1xyXG5cdEEgcmVwbGFjZW1lbnQgZm9yIGRlY2ltYWwuanMgZm9yIGluY3JlbWVudGFsIGdhbWVzIHdobyB3YW50IHRvIGRlYWwgd2l0aCB2ZXJ5IGxhcmdlIG51bWJlcnMgKGJpZ2dlciBpbiBtYWduaXR1ZGUgdGhhbiAxZTMwOCwgdXAgdG8gYXMgbXVjaCBhcyAxZSg5ZTE1KSApIGFuZCB3YW50IHRvIHByaW9yaXRpemUgc3BlZWQgb3ZlciBhY2N1cmFjeS5cclxuXHRJZiB5b3Ugd2FudCB0byBwcmlvcml0aXplIGFjY3VyYWN5IG92ZXIgc3BlZWQsIHBsZWFzZSB1c2UgZGVjaW1hbC5qcyBpbnN0ZWFkLlxyXG5cdElmIHlvdSBuZWVkIHRvIGhhbmRsZSBudW1iZXJzIGFzIGJpZyBhcyAxZSgxLjc5ZTMwOCksIHRyeSBicmVha19icmVha19pbmZpbml0eS5qcywgd2hpY2ggc2FjcmlmaWNlcyBzcGVlZCB0byBkZWFsIHdpdGggc3VjaCBtYXNzaXZlIG51bWJlcnMuXHJcblxyXG5cdGh0dHBzOi8vZ2l0aHViLmNvbS9QYXRhc2h1L2JyZWFrX2luZmluaXR5LmpzXHJcblxyXG5cdFRoaXMgbGlicmFyeSBpcyBvcGVuIHNvdXJjZSBhbmQgZnJlZSB0byB1c2UvbW9kaWZ5L2ZvcmsgZm9yIGFueSBwdXJwb3NlIHlvdSB3YW50LlxyXG5cclxuXHRCeSBQYXRhc2h1LlxyXG5cclxuXHQtLS1cclxuXHJcblx0RGVjaW1hbCBoYXMgb25seSB0d28gZmllbGRzOlxyXG5cclxuXHRtYW50aXNzYTogQSBudW1iZXIgKGRvdWJsZSkgd2l0aCBhYnNvbHV0ZSB2YWx1ZSBiZXR3ZWVuIFsxLCAxMCkgT1IgZXhhY3RseSAwLiBJZiBtYW50aXNzYSBpcyBldmVyIDEwIG9yIGdyZWF0ZXIsIGl0IHNob3VsZCBiZSBub3JtYWxpemVkIChkaXZpZGUgYnkgMTAgYW5kIGFkZCAxIHRvIGV4cG9uZW50IHVudGlsIGl0IGlzIGxlc3MgdGhhbiAxMCwgb3IgbXVsdGlwbHkgYnkgMTAgYW5kIHN1YnRyYWN0IDEgZnJvbSBleHBvbmVudCB1bnRpbCBpdCBpcyAxIG9yIGdyZWF0ZXIpLiBJbmZpbml0eS8tSW5maW5pdHkvTmFOIHdpbGwgY2F1c2UgYmFkIHRoaW5ncyB0byBoYXBwZW4uXHJcblx0ZXhwb25lbnQ6IEEgbnVtYmVyIChpbnRlZ2VyKSBiZXR3ZWVuIC1FWFBfTElNSVQgYW5kIEVYUF9MSU1JVC4gTm9uLWludGVncmFsL291dCBvZiBib3VuZHMgd2lsbCBjYXVzZSBiYWQgdGhpbmdzIHRvIGhhcHBlbi5cclxuXHJcblx0VGhlIGRlY2ltYWwncyB2YWx1ZSBpcyBzaW1wbHkgbWFudGlzc2EqMTBeZXhwb25lbnQuXHJcblxyXG5cdEZ1bmN0aW9ucyBvZiBEZWNpbWFsOlxyXG5cclxuXHRmcm9tTWFudGlzc2FFeHBvbmVudChtYW50aXNzYSwgZXhwb25lbnQpXHJcblx0ZnJvbURlY2ltYWwodmFsdWUpXHJcblx0ZnJvbU51bWJlcih2YWx1ZSlcclxuXHRmcm9tU3RyaW5nKHZhbHVlKVxyXG5cdGZyb21WYWx1ZSh2YWx1ZSlcclxuXHJcblx0dG9OdW1iZXIoKVxyXG5cdG1hbnRpc3NhV2l0aERlY2ltYWxQbGFjZXMocGxhY2VzKVxyXG5cdHRvU3RyaW5nKClcclxuXHR0b0ZpeGVkKHBsYWNlcylcclxuXHR0b0V4cG9uZW50aWFsKHBsYWNlcylcclxuXHR0b1ByZWNpc2lvbihwbGFjZXMpXHJcblxyXG5cdGFicygpLCBuZWcoKSwgc2lnbigpXHJcblx0YWRkKHZhbHVlKSwgc3ViKHZhbHVlKSwgbXVsKHZhbHVlKSwgZGl2KHZhbHVlKSwgcmVjaXAoKVxyXG5cclxuXHRjbXAodmFsdWUpLCBlcSh2YWx1ZSksIG5lcSh2YWx1ZSksIGx0KHZhbHVlKSwgbHRlKHZhbHVlKSwgZ3QodmFsdWUpLCBndGUodmFsdWUpXHJcblx0Y21wX3RvbGVyYW5jZSh2YWx1ZSwgdG9sZXJhbmNlKSwgZXFfdG9sZXJhbmNlKHZhbHVlLCB0b2xlcmFuY2UpLCBuZXFfdG9sZXJhbmNlKHZhbHVlLCB0b2xlcmFuY2UpLCBsdF90b2xlcmFuY2UodmFsdWUsIHRvbGVyYW5jZSksIGx0ZV90b2xlcmFuY2UodmFsdWUsIHRvbGVyYW5jZSksIGd0X3RvbGVyYW5jZSh2YWx1ZSwgdG9sZXJhbmNlKSwgZ3RlX3RvbGVyYW5jZSh2YWx1ZSwgdG9sZXJhbmNlKVxyXG5cclxuXHRsb2coYmFzZSksIGxvZzEwKCksIGxvZzIoKSwgbG4oKVxyXG5cdHBvdyh2YWx1ZSwgb3RoZXIpLCBwb3codmFsdWUpLCBwb3dfYmFzZSh2YWx1ZSksIGV4cCgpLCBzcXIoKSwgc3FydCgpLCBjdWJlKCksIGNicnQoKVxyXG5cclxuXHRhZmZvcmRHZW9tZXRyaWNTZXJpZXMocmVzb3VyY2VzQXZhaWxhYmxlLCBwcmljZVN0YXJ0LCBwcmljZVJhdGlvLCBjdXJyZW50T3duZWQpLCBzdW1HZW9tZXRyaWNTZXJpZXMobnVtSXRlbXMsIHByaWNlU3RhcnQsIHByaWNlUmF0aW8sIGN1cnJlbnRPd25lZCksIGFmZm9yZEFyaXRobWV0aWNTZXJpZXMocmVzb3VyY2VzQXZhaWxhYmxlLCBwcmljZVN0YXJ0LCBwcmljZUFkZCwgY3VycmVudE93bmVkKSwgc3VtQXJpdGhtZXRpY1NlcmllcyhudW1JdGVtcywgcHJpY2VTdGFydCwgcHJpY2VBZGQsIGN1cnJlbnRPd25lZClcclxuXHJcblx0LS0tXHJcblxyXG5cdFNvIGhvdyBtdWNoIGZhc3RlciB0aGFuIGRlY2ltYWwuanMgaXMgYnJlYWtfaW5maW5pdHkuanM/IE9wZXJhdGlvbnMgcGVyIHNlY29uZCBjb21wYXJpc29uIHVzaW5nIHRoZSBzYW1lIGNvbXB1dGVyOlxyXG5cdG5ldyBEZWNpbWFsKFwiMS4yMzQ1Njc4OWU5ODc2NTQzMjFcIikgOiAxLjVlNiB0byB0byAzZTYgKDJ4IHNwZWVkdXApXHJcblx0RGVjaW1hbC5hZGQoXCIxZTk5OVwiLCBcIjllOTk4XCIpIDogMWU2IHRvIDEuNWU3ICgxNXggc3BlZWR1cClcclxuXHREZWNpbWFsLm11bChcIjFlOTk5XCIsIFwiOWU5OThcIikgOiAxLjVlNiB0byAxZTggKDY2eCBzcGVlZHVwKVxyXG5cdERlY2ltYWwucG93KDk4Ny43ODksIDEyMy4zMjEpIDogOGUzIHRvIDJlNiAoMjUweCBzcGVlZHVwKVxyXG5cdERlY2ltYWwuZXhwKDFlMTApIDogNWUzIHRvIDMuOGU3ICg3NjAweCBzcGVlZHVwKVxyXG5cdERlY2ltYWwubG4oXCI5ODcuNjU0ZTc4OVwiKSA6IDRlNCB0byA0LjVlOCAoMTEyNTB4IHNwZWVkdXApXHJcblx0RGVjaW1hbC5sb2cxMChcIjk4Ny42NTRlNzg5XCIpIDogM2U0IHRvIDVlOCAoMTY2NjZ4IHNwZWVkdXApXHJcblxyXG5cdC0tLVxyXG5cclxuXHREZWRpY2F0ZWQgdG8gSGV2aXBlbGxlLCBhbmQgYWxsIHRoZSBDUFVzIHRoYXQgc3RydWdnbGVkIHRvIHJ1biBBbnRpbWF0dGVyIERpbWVuc2lvbnMuXHJcblxyXG5cdFJlbGF0ZWQgc29uZzogaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9wYXRhc2h1LzgtYml0LXByb2dyZXNzaXZlLXN0b2ljLXBsYXRvbmljLWlkZWFsXHJcblxyXG5cdCovXHJcblxyXG5cdHZhciBNQVhfU0lHTklGSUNBTlRfRElHSVRTID0gMTc7IC8vZm9yIGV4YW1wbGU6IGlmIHR3byBleHBvbmVudHMgYXJlIG1vcmUgdGhhbiAxNyBhcGFydCwgY29uc2lkZXIgYWRkaW5nIHRoZW0gdG9nZXRoZXIgcG9pbnRsZXNzLCBqdXN0IHJldHVybiB0aGUgbGFyZ2VyIG9uZVxyXG5cdHZhciBFWFBfTElNSVQgPSA5ZTE1OyAvL2hpZ2hlc3QgdmFsdWUgeW91IGNhbiBzYWZlbHkgcHV0IGhlcmUgaXMgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVItTUFYX1NJR05JRklDQU5UX0RJR0lUU1xyXG5cclxuXHR2YXIgTlVNQkVSX0VYUF9NQVggPSAzMDg7IC8vdGhlIGxhcmdlc3QgZXhwb25lbnQgdGhhdCBjYW4gYXBwZWFyIGluIGEgTnVtYmVyLCB0aG91Z2ggbm90IGFsbCBtYW50aXNzYXMgYXJlIHZhbGlkIGhlcmUuXHJcblx0dmFyIE5VTUJFUl9FWFBfTUlOID0gLTMyNDsgLy9UaGUgc21hbGxlc3QgZXhwb25lbnQgdGhhdCBjYW4gYXBwZWFyIGluIGEgTnVtYmVyLCB0aG91Z2ggbm90IGFsbCBtYW50aXNzYXMgYXJlIHZhbGlkIGhlcmUuXHJcblxyXG5cdC8vd2UgbmVlZCB0aGlzIGxvb2t1cCB0YWJsZSBiZWNhdXNlIE1hdGgucG93KDEwLCBleHBvbmVudCkgd2hlbiBleHBvbmVudCdzIGFic29sdXRlIHZhbHVlIGlzIGxhcmdlIGlzIHNsaWdodGx5IGluYWNjdXJhdGUuIHlvdSBjYW4gZml4IGl0IHdpdGggdGhlIHBvd2VyIG9mIG1hdGguLi4gb3IganVzdCBtYWtlIGEgbG9va3VwIHRhYmxlLiBmYXN0ZXIgQU5EIHNpbXBsZXJcclxuXHRsZXQgcG93ZXJzb2YxMCA9IFtdO1xyXG5cdGZvciAobGV0IGkgPSBOVU1CRVJfRVhQX01JTiArIDE7IGkgPD0gTlVNQkVSX0VYUF9NQVg7IGkrKykge1xyXG5cdFx0cG93ZXJzb2YxMC5wdXNoKE51bWJlcignMWUnICsgaSkpO1xyXG5cdH1cclxuXHR2YXIgaW5kZXhvZjBpbnBvd2Vyc29mMTAgPSAzMjM7XHJcblxyXG5cdGNsYXNzIERlY2ltYWwge1xyXG5cclxuXHRcdC8qc3RhdGljIGFkanVzdE1hbnRpc3NhKG9sZE1hbnRpc3NhLCBleHBvbmVudCkge1xyXG5cdFx0XHQvL011bHRpcGx5aW5nIG9yIGRpdmlkaW5nIGJ5IDAuMSBjYXVzZXMgcm91bmRpbmcgZXJyb3JzLCBkaXZpZGluZyBvciBtdWx0aXBseWluZyBieSAxMCBkb2VzIG5vdC5cclxuXHRcdFx0Ly9TbyBhbHdheXMgbXVsdGlwbHkvZGl2aWRlIGJ5IGEgbGFyZ2UgbnVtYmVyIHdoZW5ldmVyIHdlIGNhbiBnZXQgYXdheSB3aXRoIGl0LlxyXG5cclxuXHRcdFx0LypcclxuXHRcdFx0U3RpbGwgYSBmZXcgd2VpcmQgY2FzZXMsIElESyBpZiB0aGV5J2xsIGV2ZXIgY29tZSB1cCB0aG91Z2g6XHJcbjAuMDAxKjFlMzA4XHJcbjFlKzMwNVxyXG4wLjAwMSoxZTMwOCoxMFxyXG45Ljk5OTk5OTk5OTk5OTk5OWUrMzA1XHJcblx0XHRcdCovXHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHRUT0RPOiBJJ20gbm90IGV2ZW4gc3VyZSBpZiB0aGlzIGlzIGEgZ29vZCBpZGVhIGluIGdlbmVyYWwsIGJlY2F1c2VcclxuMTAwMCotNC4wM1xyXG4tNDAzMC4wMDAwMDAwMDAwMDA1XHJcbi00LjAzLzFlLTNcclxuLTQwMzBcclxuXHRcdFx0U28gaXQncyBub3QgZXZlbiB0cnVlIHRoYXQgbXVsL2RpdiBieSBhIHBvc2l0aXZlIHBvd2VyIG9mIDEwIGlzIGFsd2F5cyB0aGUgbW9yZSBhY2N1cmF0ZSBhcHByb2FjaC5cclxuXHRcdFx0Ki9cclxuXHJcblx0XHRcdC8qaWYgKGV4cG9uZW50ID09IDApIHsgcmV0dXJuIG9sZE1hbnRpc3NhOyB9XHJcblx0XHRcdGlmIChleHBvbmVudCA+IDApXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoZXhwb25lbnQgPiAzMDgpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cmV0dXJuIG9sZE1hbnRpc3NhKjFlMzA4KnBvd2Vyc29mMTBbKGV4cG9uZW50LTMwOCkraW5kZXhvZjBpbnBvd2Vyc29mMTBdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gb2xkTWFudGlzc2EqcG93ZXJzb2YxMFtleHBvbmVudCtpbmRleG9mMGlucG93ZXJzb2YxMF07XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKGV4cG9uZW50IDwgLTMwOClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRyZXR1cm4gb2xkTWFudGlzc2EqcG93ZXJzb2YxMFtleHBvbmVudCtpbmRleG9mMGlucG93ZXJzb2YxMF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBvbGRNYW50aXNzYS9wb3dlcnNvZjEwWy1leHBvbmVudCtpbmRleG9mMGlucG93ZXJzb2YxMF07XHJcblx0XHRcdH1cclxuXHRcdH0qL1xyXG5cclxuXHRcdG5vcm1hbGl6ZSgpIHtcclxuXHRcdFx0Ly9XaGVuIG1hbnRpc3NhIGlzIHZlcnkgZGVub3JtYWxpemVkLCB1c2UgdGhpcyB0byBub3JtYWxpemUgbXVjaCBmYXN0ZXIuXHJcblxyXG5cdFx0XHQvL1RPRE86IEknbSB3b3JyaWVkIGFib3V0IG1hbnRpc3NhIGJlaW5nIG5lZ2F0aXZlIDAgaGVyZSB3aGljaCBpcyB3aHkgSSBzZXQgaXQgYWdhaW4sIGJ1dCBpdCBtYXkgbmV2ZXIgbWF0dGVyXHJcblx0XHRcdGlmICh0aGlzLm1hbnRpc3NhID09IDApIHsgdGhpcy5tYW50aXNzYSA9IDA7IHRoaXMuZXhwb25lbnQgPSAwOyByZXR1cm47IH1cclxuXHRcdFx0aWYgKHRoaXMubWFudGlzc2EgPj0gMSAmJiB0aGlzLm1hbnRpc3NhIDwgMTApIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0XHR2YXIgdGVtcF9leHBvbmVudCA9IE1hdGguZmxvb3IoTWF0aC5sb2cxMChNYXRoLmFicyh0aGlzLm1hbnRpc3NhKSkpO1xyXG5cdFx0XHR0aGlzLm1hbnRpc3NhID0gdGhpcy5tYW50aXNzYS9wb3dlcnNvZjEwW3RlbXBfZXhwb25lbnQraW5kZXhvZjBpbnBvd2Vyc29mMTBdO1xyXG5cdFx0XHR0aGlzLmV4cG9uZW50ICs9IHRlbXBfZXhwb25lbnQ7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH1cclxuXHJcblx0XHRmcm9tTWFudGlzc2FFeHBvbmVudChtYW50aXNzYSwgZXhwb25lbnQpIHtcclxuXHRcdFx0Ly9TQUZFVFk6IGRvbid0IGxldCBpbiBub24tbnVtYmVyc1xyXG5cdFx0XHRpZiAoIWlzRmluaXRlKG1hbnRpc3NhKSB8fCAhaXNGaW5pdGUoZXhwb25lbnQpKSB7IG1hbnRpc3NhID0gTnVtYmVyLk5hTjsgZXhwb25lbnQgPSBOdW1iZXIuTmFOOyB9XHJcblx0XHRcdHRoaXMubWFudGlzc2EgPSBtYW50aXNzYTtcclxuXHRcdFx0dGhpcy5leHBvbmVudCA9IGV4cG9uZW50O1xyXG5cdFx0XHR0aGlzLm5vcm1hbGl6ZSgpOyAvL05vbi1ub3JtYWxpemVkIG1hbnRpc3NhcyBjYW4gZWFzaWx5IGdldCBoZXJlLCBzbyB0aGlzIGlzIG1hbmRhdG9yeS5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnJvbU1hbnRpc3NhRXhwb25lbnRfbm9Ob3JtYWxpemUobWFudGlzc2EsIGV4cG9uZW50KSB7XHJcblx0XHRcdC8vV2VsbCwgeW91IGtub3cgd2hhdCB5b3UncmUgZG9pbmchXHJcblx0XHRcdHRoaXMubWFudGlzc2EgPSBtYW50aXNzYTtcclxuXHRcdFx0dGhpcy5leHBvbmVudCA9IGV4cG9uZW50O1xyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH1cclxuXHJcblx0XHRmcm9tRGVjaW1hbCh2YWx1ZSkge1xyXG5cdFx0XHR0aGlzLm1hbnRpc3NhID0gdmFsdWUubWFudGlzc2E7XHJcblx0XHRcdHRoaXMuZXhwb25lbnQgPSB2YWx1ZS5leHBvbmVudDtcclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnJvbU51bWJlcih2YWx1ZSkge1xyXG5cdFx0XHQvL1NBRkVUWTogSGFuZGxlIEluZmluaXR5IGFuZCBOYU4gaW4gYSBzb21ld2hhdCBtZWFuaW5nZnVsIHdheS5cclxuXHRcdFx0aWYgKGlzTmFOKHZhbHVlKSkgeyB0aGlzLm1hbnRpc3NhID0gTnVtYmVyLk5hTjsgdGhpcy5leHBvbmVudCA9IE51bWJlci5OYU47IH1cclxuXHRcdFx0ZWxzZSBpZiAodmFsdWUgPT0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSB7IHRoaXMubWFudGlzc2EgPSAxOyB0aGlzLmV4cG9uZW50ID0gRVhQX0xJTUlUOyB9XHJcblx0XHRcdGVsc2UgaWYgKHZhbHVlID09IE51bWJlci5ORUdBVElWRV9JTkZJTklUWSkgeyB0aGlzLm1hbnRpc3NhID0gLTE7IHRoaXMuZXhwb25lbnQgPSBFWFBfTElNSVQ7IH1cclxuXHRcdFx0ZWxzZSBpZiAodmFsdWUgPT0gMCkgeyB0aGlzLm1hbnRpc3NhID0gMDsgdGhpcy5leHBvbmVudCA9IDA7IH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGhpcy5leHBvbmVudCA9IE1hdGguZmxvb3IoTWF0aC5sb2cxMChNYXRoLmFicyh2YWx1ZSkpKTtcclxuXHRcdFx0XHQvL1NBRkVUWTogaGFuZGxlIDVlLTMyNCwgLTVlLTMyNCBzZXBhcmF0ZWx5XHJcblx0XHRcdFx0aWYgKHRoaXMuZXhwb25lbnQgPT0gTlVNQkVSX0VYUF9NSU4pXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dGhpcy5tYW50aXNzYSA9ICh2YWx1ZSoxMCkvMWUtMzIzO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dGhpcy5tYW50aXNzYSA9IHZhbHVlL3Bvd2Vyc29mMTBbdGhpcy5leHBvbmVudCtpbmRleG9mMGlucG93ZXJzb2YxMF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMubm9ybWFsaXplKCk7IC8vU0FGRVRZOiBQcmV2ZW50IHdlaXJkbmVzcy5cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH1cclxuXHJcblx0XHRmcm9tU3RyaW5nKHZhbHVlKSB7XHJcblx0XHRcdGlmICh2YWx1ZS5pbmRleE9mKFwiZVwiKSAhPSAtMSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZhciBwYXJ0cyA9IHZhbHVlLnNwbGl0KFwiZVwiKTtcclxuXHRcdFx0XHR0aGlzLm1hbnRpc3NhID0gcGFyc2VGbG9hdChwYXJ0c1swXSk7XHJcblx0XHRcdFx0dGhpcy5leHBvbmVudCA9IHBhcnNlRmxvYXQocGFydHNbMV0pO1xyXG5cdFx0XHRcdHRoaXMubm9ybWFsaXplKCk7IC8vTm9uLW5vcm1hbGl6ZWQgbWFudGlzc2FzIGNhbiBlYXNpbHkgZ2V0IGhlcmUsIHNvIHRoaXMgaXMgbWFuZGF0b3J5LlxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHZhbHVlID09IFwiTmFOXCIpIHsgdGhpcy5tYW50aXNzYSA9IE51bWJlci5OYU47IHRoaXMuZXhwb25lbnQgPSBOdW1iZXIuTmFOOyB9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRoaXMuZnJvbU51bWJlcihwYXJzZUZsb2F0KHZhbHVlKSk7XHJcblx0XHRcdFx0aWYgKGlzTmFOKHRoaXMubWFudGlzc2EpKSB7IHRocm93IEVycm9yKFwiW0RlY2ltYWxFcnJvcl0gSW52YWxpZCBhcmd1bWVudDogXCIgKyB2YWx1ZSk7IH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH1cclxuXHJcblx0XHRmcm9tVmFsdWUodmFsdWUpIHtcclxuXHRcdFx0aWYgKHZhbHVlIGluc3RhbmNlb2YgRGVjaW1hbCkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmZyb21EZWNpbWFsKHZhbHVlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0eXBlb2YodmFsdWUpID09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZnJvbU51bWJlcih2YWx1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodHlwZW9mKHZhbHVlKSA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmZyb21TdHJpbmcodmFsdWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMubWFudGlzc2EgPSAwO1xyXG5cdFx0XHRcdHRoaXMuZXhwb25lbnQgPSAwO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3RydWN0b3IodmFsdWUpXHJcblx0XHR7XHJcblx0XHRcdGlmICh2YWx1ZSBpbnN0YW5jZW9mIERlY2ltYWwpIHtcclxuXHRcdFx0XHR0aGlzLmZyb21EZWNpbWFsKHZhbHVlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0eXBlb2YodmFsdWUpID09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0dGhpcy5mcm9tTnVtYmVyKHZhbHVlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0eXBlb2YodmFsdWUpID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0dGhpcy5mcm9tU3RyaW5nKHZhbHVlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLm1hbnRpc3NhID0gMDtcclxuXHRcdFx0XHR0aGlzLmV4cG9uZW50ID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBmcm9tTWFudGlzc2FFeHBvbmVudChtYW50aXNzYSwgZXhwb25lbnQpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBEZWNpbWFsKCkuZnJvbU1hbnRpc3NhRXhwb25lbnQobWFudGlzc2EsIGV4cG9uZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgZnJvbU1hbnRpc3NhRXhwb25lbnRfbm9Ob3JtYWxpemUobWFudGlzc2EsIGV4cG9uZW50KSB7XHJcblx0XHRcdHJldHVybiBuZXcgRGVjaW1hbCgpLmZyb21NYW50aXNzYUV4cG9uZW50X25vTm9ybWFsaXplKG1hbnRpc3NhLCBleHBvbmVudCk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGZyb21EZWNpbWFsKHZhbHVlKSB7XHJcblx0XHRcdHJldHVybiBuZXcgRGVjaW1hbCgpLmZyb21EZWNpbWFsKHZhbHVlKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgZnJvbU51bWJlcih2YWx1ZSkge1xyXG5cdFx0XHRyZXR1cm4gbmV3IERlY2ltYWwoKS5mcm9tTnVtYmVyKHZhbHVlKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgZnJvbVN0cmluZyh2YWx1ZSkge1xyXG5cdFx0XHRyZXR1cm4gbmV3IERlY2ltYWwoKS5mcm9tU3RyaW5nKHZhbHVlKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgZnJvbVZhbHVlKHZhbHVlKSB7XHJcblx0XHRcdGlmICh2YWx1ZSBpbnN0YW5jZW9mIERlY2ltYWwpIHtcclxuXHRcdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG5ldyBEZWNpbWFsKHZhbHVlKTtcclxuXHRcdH1cclxuXHJcblx0XHR0b051bWJlcigpIHtcclxuXHRcdFx0Ly9Qcm9ibGVtOiBuZXcgRGVjaW1hbCgxMTYpLnRvTnVtYmVyKCkgcmV0dXJucyAxMTUuOTk5OTk5OTk5OTk5OTkuXHJcblx0XHRcdC8vVE9ETzogSG93IHRvIGZpeCBpbiBnZW5lcmFsIGNhc2U/IEl0J3MgY2xlYXIgdGhhdCBpZiB0b051bWJlcigpIGlzIFZFUlkgY2xvc2UgdG8gYW4gaW50ZWdlciwgd2Ugd2FudCBleGFjdGx5IHRoZSBpbnRlZ2VyLiBCdXQgaXQncyBub3QgY2xlYXIgaG93IHRvIHNwZWNpZmljYWxseSB3cml0ZSB0aGF0LiBTbyBJJ2xsIGp1c3Qgc2V0dGxlIHdpdGggJ2V4cG9uZW50ID49IDAgYW5kIGRpZmZlcmVuY2UgYmV0d2VlbiByb3VuZGVkIGFuZCBub3Qgcm91bmRlZCA8IDFlLTknIGFzIGEgcXVpY2sgZml4LlxyXG5cclxuXHRcdFx0Ly92YXIgcmVzdWx0ID0gdGhpcy5tYW50aXNzYSpNYXRoLnBvdygxMCwgdGhpcy5leHBvbmVudCk7XHJcblxyXG5cdFx0XHRpZiAoIWlzRmluaXRlKHRoaXMuZXhwb25lbnQpKSB7IHJldHVybiBOdW1iZXIuTmFOOyB9XHJcblx0XHRcdGlmICh0aGlzLmV4cG9uZW50ID4gTlVNQkVSX0VYUF9NQVgpIHsgcmV0dXJuIHRoaXMubWFudGlzc2EgPiAwID8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZIDogTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZOyB9XHJcblx0XHRcdGlmICh0aGlzLmV4cG9uZW50IDwgTlVNQkVSX0VYUF9NSU4pIHsgcmV0dXJuIDA7IH1cclxuXHRcdFx0Ly9TQUZFVFk6IGFnYWluLCBoYW5kbGUgNWUtMzI0LCAtNWUtMzI0IHNlcGFyYXRlbHlcclxuXHRcdFx0aWYgKHRoaXMuZXhwb25lbnQgPT0gTlVNQkVSX0VYUF9NSU4pIHsgcmV0dXJuIHRoaXMubWFudGlzc2EgPiAwID8gNWUtMzI0IDogLTVlLTMyNDsgfVxyXG5cclxuXHRcdFx0dmFyIHJlc3VsdCA9IHRoaXMubWFudGlzc2EqcG93ZXJzb2YxMFt0aGlzLmV4cG9uZW50K2luZGV4b2YwaW5wb3dlcnNvZjEwXTtcclxuXHRcdFx0aWYgKCFpc0Zpbml0ZShyZXN1bHQpIHx8IHRoaXMuZXhwb25lbnQgPCAwKSB7IHJldHVybiByZXN1bHQ7IH1cclxuXHRcdFx0dmFyIHJlc3VsdHJvdW5kZWQgPSBNYXRoLnJvdW5kKHJlc3VsdCk7XHJcblx0XHRcdGlmIChNYXRoLmFicyhyZXN1bHRyb3VuZGVkLXJlc3VsdCkgPCAxZS0xMCkgcmV0dXJuIHJlc3VsdHJvdW5kZWQ7XHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9XHJcblxyXG5cdFx0bWFudGlzc2FXaXRoRGVjaW1hbFBsYWNlcyhwbGFjZXMpIHtcclxuXHRcdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM3NDI1MDIyXHJcblxyXG5cdFx0XHRpZiAoaXNOYU4odGhpcy5tYW50aXNzYSkgfHwgaXNOYU4odGhpcy5leHBvbmVudCkpIHJldHVybiBOdW1iZXIuTmFOO1xyXG5cdFx0XHRpZiAodGhpcy5tYW50aXNzYSA9PSAwKSByZXR1cm4gMDtcclxuXHJcblx0XHRcdHZhciBsZW4gPSBwbGFjZXMrMTtcclxuXHRcdFx0dmFyIG51bURpZ2l0cyA9IE1hdGguY2VpbChNYXRoLmxvZzEwKE1hdGguYWJzKHRoaXMubWFudGlzc2EpKSk7XHJcblx0XHRcdHZhciByb3VuZGVkID0gTWF0aC5yb3VuZCh0aGlzLm1hbnRpc3NhKk1hdGgucG93KDEwLGxlbi1udW1EaWdpdHMpKSpNYXRoLnBvdygxMCxudW1EaWdpdHMtbGVuKTtcclxuXHRcdFx0cmV0dXJuIHBhcnNlRmxvYXQocm91bmRlZC50b0ZpeGVkKE1hdGgubWF4KGxlbi1udW1EaWdpdHMsMCkpKTtcclxuXHRcdH1cclxuXHJcblx0XHR0b1N0cmluZygpIHtcclxuXHRcdFx0aWYgKGlzTmFOKHRoaXMubWFudGlzc2EpIHx8IGlzTmFOKHRoaXMuZXhwb25lbnQpKSB7IHJldHVybiBcIk5hTlwiOyB9XHJcblx0XHRcdGlmICh0aGlzLmV4cG9uZW50ID49IEVYUF9MSU1JVClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLm1hbnRpc3NhID4gMCA/IFwiSW5maW5pdHlcIiA6IFwiLUluZmluaXR5XCI7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMuZXhwb25lbnQgPD0gLUVYUF9MSU1JVCB8fCB0aGlzLm1hbnRpc3NhID09IDApIHsgcmV0dXJuIFwiMFwiOyB9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5leHBvbmVudCA8IDIxICYmIHRoaXMuZXhwb25lbnQgPiAtNylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnRvTnVtYmVyKCkudG9TdHJpbmcoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMubWFudGlzc2EgKyBcImVcIiArICh0aGlzLmV4cG9uZW50ID49IDAgPyBcIitcIiA6IFwiXCIpICsgdGhpcy5leHBvbmVudDtcclxuXHRcdH1cclxuXHJcblx0XHR0b0V4cG9uZW50aWFsKHBsYWNlcykge1xyXG5cdFx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzc0MjUwMjJcclxuXHJcblx0XHRcdC8vVE9ETzogU29tZSB1bmZpeGVkIGNhc2VzOlxyXG5cdFx0XHQvL25ldyBEZWNpbWFsKFwiMS4yMzQ1ZS05OTlcIikudG9FeHBvbmVudGlhbCgpXHJcblx0XHRcdC8vXCIxLjIzNDUwMDAwMDAwMDAwMDE1ZS05OTlcIlxyXG5cdFx0XHQvL25ldyBEZWNpbWFsKFwiMWUtOTk5XCIpLnRvRXhwb25lbnRpYWwoKVxyXG5cdFx0XHQvL1wiMS4wMDAwMDAwMDAwMDAwMDAwMDBlLTk5OVwiXHJcblx0XHRcdC8vVEJIIEknbSB0ZW1wdGVkIHRvIGp1c3Qgc2F5IGl0J3MgYSBmZWF0dXJlLiBJZiB5b3UncmUgZG9pbmcgcHJldHR5IGZvcm1hdHRpbmcgdGhlbiB3aHkgZG9uJ3QgeW91IGtub3cgaG93IG1hbnkgZGVjaW1hbCBwbGFjZXMgeW91IHdhbnQuLi4/XHJcblxyXG5cdFx0XHRpZiAoaXNOYU4odGhpcy5tYW50aXNzYSkgfHwgaXNOYU4odGhpcy5leHBvbmVudCkpIHsgcmV0dXJuIFwiTmFOXCI7IH1cclxuXHRcdFx0aWYgKHRoaXMuZXhwb25lbnQgPj0gRVhQX0xJTUlUKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMubWFudGlzc2EgPiAwID8gXCJJbmZpbml0eVwiIDogXCItSW5maW5pdHlcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGhpcy5leHBvbmVudCA8PSAtRVhQX0xJTUlUIHx8IHRoaXMubWFudGlzc2EgPT0gMCkgeyByZXR1cm4gXCIwXCIgKyAocGxhY2VzID4gMCA/IHBhZEVuZChcIi5cIiwgcGxhY2VzKzEsIFwiMFwiKSA6IFwiXCIpICsgXCJlKzBcIjsgfVxyXG5cclxuXHRcdFx0Ly8gdHdvIGNhc2VzOlxyXG5cdFx0XHQvLyAxKSBleHBvbmVudCBpcyA8IDMwOCBhbmQgPiAtMzI0OiB1c2UgYmFzaWMgdG9GaXhlZFxyXG5cdFx0XHQvLyAyKSBldmVyeXRoaW5nIGVsc2U6IHdlIGhhdmUgdG8gZG8gaXQgb3Vyc2VsdmVzIVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuZXhwb25lbnQgPiBOVU1CRVJfRVhQX01JTiAmJiB0aGlzLmV4cG9uZW50IDwgTlVNQkVSX0VYUF9NQVgpIHsgcmV0dXJuIHRoaXMudG9OdW1iZXIoKS50b0V4cG9uZW50aWFsKHBsYWNlcyk7IH1cclxuXHJcblx0XHRcdGlmICghaXNGaW5pdGUocGxhY2VzKSkgeyBwbGFjZXMgPSBNQVhfU0lHTklGSUNBTlRfRElHSVRTOyB9XHJcblxyXG5cdFx0XHR2YXIgbGVuID0gcGxhY2VzKzE7XHJcblx0XHRcdHZhciBudW1EaWdpdHMgPSBNYXRoLm1heCgxLCBNYXRoLmNlaWwoTWF0aC5sb2cxMChNYXRoLmFicyh0aGlzLm1hbnRpc3NhKSkpKTtcclxuXHRcdFx0dmFyIHJvdW5kZWQgPSBNYXRoLnJvdW5kKHRoaXMubWFudGlzc2EqTWF0aC5wb3coMTAsbGVuLW51bURpZ2l0cykpKk1hdGgucG93KDEwLG51bURpZ2l0cy1sZW4pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHJvdW5kZWQudG9GaXhlZChNYXRoLm1heChsZW4tbnVtRGlnaXRzLDApKSArIFwiZVwiICsgKHRoaXMuZXhwb25lbnQgPj0gMCA/IFwiK1wiIDogXCJcIikgKyB0aGlzLmV4cG9uZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdHRvRml4ZWQocGxhY2VzKSB7XHJcblx0XHRcdGlmIChpc05hTih0aGlzLm1hbnRpc3NhKSB8fCBpc05hTih0aGlzLmV4cG9uZW50KSkgeyByZXR1cm4gXCJOYU5cIjsgfVxyXG5cdFx0XHRpZiAodGhpcy5leHBvbmVudCA+PSBFWFBfTElNSVQpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5tYW50aXNzYSA+IDAgPyBcIkluZmluaXR5XCIgOiBcIi1JbmZpbml0eVwiO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLmV4cG9uZW50IDw9IC1FWFBfTElNSVQgfHwgdGhpcy5tYW50aXNzYSA9PSAwKSB7IHJldHVybiBcIjBcIiArIChwbGFjZXMgPiAwID8gcGFkRW5kKFwiLlwiLCBwbGFjZXMrMSwgXCIwXCIpIDogXCJcIik7IH1cclxuXHJcblx0XHRcdC8vIHR3byBjYXNlczpcclxuXHRcdFx0Ly8gMSkgZXhwb25lbnQgaXMgMTcgb3IgZ3JlYXRlcjoganVzdCBwcmludCBvdXQgbWFudGlzc2Egd2l0aCB0aGUgYXBwcm9wcmlhdGUgbnVtYmVyIG9mIHplcm9lcyBhZnRlciBpdFxyXG5cdFx0XHQvLyAyKSBleHBvbmVudCBpcyAxNiBvciBsZXNzOiB1c2UgYmFzaWMgdG9GaXhlZFxyXG5cclxuXHRcdFx0aWYgKHRoaXMuZXhwb25lbnQgPj0gTUFYX1NJR05JRklDQU5UX0RJR0lUUylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLm1hbnRpc3NhLnRvU3RyaW5nKCkucmVwbGFjZShcIi5cIiwgXCJcIikucGFkRW5kKHRoaXMuZXhwb25lbnQrMSwgXCIwXCIpICsgKHBsYWNlcyA+IDAgPyBwYWRFbmQoXCIuXCIsIHBsYWNlcysxLCBcIjBcIikgOiBcIlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy50b051bWJlcigpLnRvRml4ZWQocGxhY2VzKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRvUHJlY2lzaW9uKHBsYWNlcykge1xyXG5cdFx0XHRpZiAodGhpcy5leHBvbmVudCA8PSAtNylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnRvRXhwb25lbnRpYWwocGxhY2VzLTEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChwbGFjZXMgPiB0aGlzLmV4cG9uZW50KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMudG9GaXhlZChwbGFjZXMgLSB0aGlzLmV4cG9uZW50IC0gMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXMudG9FeHBvbmVudGlhbChwbGFjZXMtMSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFsdWVPZigpIHsgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTsgfVxyXG5cdFx0dG9KU09OKCkgeyByZXR1cm4gdGhpcy50b1N0cmluZygpOyB9XHJcblx0XHR0b1N0cmluZ1dpdGhEZWNpbWFsUGxhY2VzKHBsYWNlcykgeyByZXR1cm4gdGhpcy50b0V4cG9uZW50aWFsKHBsYWNlcyk7IH1cclxuXHJcblx0XHRnZXQgbSgpIHsgcmV0dXJuIHRoaXMubWFudGlzc2E7IH1cclxuXHRcdHNldCBtKHZhbHVlKSB7IHRoaXMubWFudGlzc2EgPSB2YWx1ZTsgfVxyXG5cdFx0Z2V0IGUoKSB7IHJldHVybiB0aGlzLmV4cG9uZW50OyB9XHJcblx0XHRzZXQgZSh2YWx1ZSkgeyB0aGlzLmV4cG9uZW50ID0gdmFsdWU7IH1cclxuXHJcblx0XHRhYnMoKSB7XHJcblx0XHRcdHJldHVybiBEZWNpbWFsLmZyb21NYW50aXNzYUV4cG9uZW50KE1hdGguYWJzKHRoaXMubWFudGlzc2EpLCB0aGlzLmV4cG9uZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgYWJzKHZhbHVlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLmFicygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdG5lZygpIHtcclxuXHRcdFx0cmV0dXJuIERlY2ltYWwuZnJvbU1hbnRpc3NhRXhwb25lbnQoLXRoaXMubWFudGlzc2EsIHRoaXMuZXhwb25lbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBuZWcodmFsdWUpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUubmVnKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0bmVnYXRlKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5uZWcoKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgbmVnYXRlKHZhbHVlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLm5lZygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdG5lZ2F0ZWQoKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLm5lZygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBuZWdhdGVkKHZhbHVlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLm5lZygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNpZ24oKSB7XHJcblx0XHRcdHJldHVybiBNYXRoLnNpZ24odGhpcy5tYW50aXNzYSk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIHNpZ24odmFsdWUpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUuc2lnbigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNnbigpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuc2lnbigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBzZ24odmFsdWUpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUuc2lnbigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGdldCBzKCkge3JldHVybiB0aGlzLnNpZ24oKTsgfVxyXG5cdFx0c2V0IHModmFsdWUpIHtcclxuXHRcdFx0aWYgKHZhbHVlID09IDApIHsgdGhpcy5lID0gMDsgdGhpcy5tID0gMDsgfVxyXG5cdFx0XHRpZiAodGhpcy5zZ24oKSAhPSB2YWx1ZSkgeyB0aGlzLm0gPSAtdGhpcy5tOyB9XHJcblx0XHR9XHJcblxyXG5cdFx0cm91bmQoKSB7XHJcblx0XHRcdGlmICh0aGlzLmV4cG9uZW50IDwgLTEpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IERlY2ltYWwoMCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGhpcy5leHBvbmVudCA8IE1BWF9TSUdOSUZJQ0FOVF9ESUdJVFMpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IERlY2ltYWwoTWF0aC5yb3VuZCh0aGlzLnRvTnVtYmVyKCkpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgcm91bmQodmFsdWUpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUucm91bmQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRmbG9vcigpIHtcclxuXHRcdFx0aWYgKHRoaXMuZXhwb25lbnQgPCAtMSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJldHVybiBNYXRoLnNpZ24odGhpcy5tYW50aXNzYSkgPj0gMCA/IG5ldyBEZWNpbWFsKDApIDogbmV3IERlY2ltYWwoLTEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRoaXMuZXhwb25lbnQgPCBNQVhfU0lHTklGSUNBTlRfRElHSVRTKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBEZWNpbWFsKE1hdGguZmxvb3IodGhpcy50b051bWJlcigpKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGZsb29yKHZhbHVlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLmZsb29yKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y2VpbCgpIHtcclxuXHRcdFx0aWYgKHRoaXMuZXhwb25lbnQgPCAtMSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJldHVybiBNYXRoLnNpZ24odGhpcy5tYW50aXNzYSkgPiAwID8gbmV3IERlY2ltYWwoMSkgOiBuZXcgRGVjaW1hbCgwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGhpcy5leHBvbmVudCA8IE1BWF9TSUdOSUZJQ0FOVF9ESUdJVFMpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IERlY2ltYWwoTWF0aC5jZWlsKHRoaXMudG9OdW1iZXIoKSkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBjZWlsKHZhbHVlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLmNlaWwoKTtcclxuXHRcdH1cclxuXHJcblx0XHR0cnVuYygpIHtcclxuXHRcdFx0aWYgKHRoaXMuZXhwb25lbnQgPCAwKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBEZWNpbWFsKDApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRoaXMuZXhwb25lbnQgPCBNQVhfU0lHTklGSUNBTlRfRElHSVRTKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBEZWNpbWFsKE1hdGgudHJ1bmModGhpcy50b051bWJlcigpKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIHRydW5jKHZhbHVlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLnRydW5jKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0YWRkKHZhbHVlKSB7XHJcblx0XHRcdC8vZmlndXJlIG91dCB3aGljaCBpcyBiaWdnZXIsIHNocmluayB0aGUgbWFudGlzc2Egb2YgdGhlIHNtYWxsZXIgYnkgdGhlIGRpZmZlcmVuY2UgaW4gZXhwb25lbnRzLCBhZGQgbWFudGlzc2FzLCBub3JtYWxpemUgYW5kIHJldHVyblxyXG5cclxuXHRcdFx0Ly9UT0RPOiBPcHRpbWl6YXRpb25zIGFuZCBzaW1wbGlmaWNhdGlvbiBtYXkgYmUgcG9zc2libGUsIHNlZSBodHRwczovL2dpdGh1Yi5jb20vUGF0YXNodS9icmVha19pbmZpbml0eS5qcy9pc3N1ZXMvOFxyXG5cclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5tYW50aXNzYSA9PSAwKSB7IHJldHVybiB2YWx1ZTsgfVxyXG5cdFx0XHRpZiAodmFsdWUubWFudGlzc2EgPT0gMCkgeyByZXR1cm4gdGhpczsgfVxyXG5cclxuXHRcdFx0dmFyIGJpZ2dlckRlY2ltYWwsIHNtYWxsZXJEZWNpbWFsO1xyXG5cdFx0XHRpZiAodGhpcy5leHBvbmVudCA+PSB2YWx1ZS5leHBvbmVudClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGJpZ2dlckRlY2ltYWwgPSB0aGlzO1xyXG5cdFx0XHRcdHNtYWxsZXJEZWNpbWFsID0gdmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0YmlnZ2VyRGVjaW1hbCA9IHZhbHVlO1xyXG5cdFx0XHRcdHNtYWxsZXJEZWNpbWFsID0gdGhpcztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGJpZ2dlckRlY2ltYWwuZXhwb25lbnQgLSBzbWFsbGVyRGVjaW1hbC5leHBvbmVudCA+IE1BWF9TSUdOSUZJQ0FOVF9ESUdJVFMpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gYmlnZ2VyRGVjaW1hbDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcclxuXHRcdFx0XHQvL2hhdmUgdG8gZG8gdGhpcyBiZWNhdXNlIGFkZGluZyBudW1iZXJzIHRoYXQgd2VyZSBvbmNlIGludGVnZXJzIGJ1dCBzY2FsZWQgZG93biBpcyBpbXByZWNpc2UuXHJcblx0XHRcdFx0Ly9FeGFtcGxlOiAyOTkgKyAxOFxyXG5cdFx0XHRcdHJldHVybiBEZWNpbWFsLmZyb21NYW50aXNzYUV4cG9uZW50KFxyXG5cdFx0XHRcdE1hdGgucm91bmQoMWUxNCpiaWdnZXJEZWNpbWFsLm1hbnRpc3NhICsgMWUxNCpzbWFsbGVyRGVjaW1hbC5tYW50aXNzYSpwb3dlcnNvZjEwWyhzbWFsbGVyRGVjaW1hbC5leHBvbmVudC1iaWdnZXJEZWNpbWFsLmV4cG9uZW50KStpbmRleG9mMGlucG93ZXJzb2YxMF0pLFxyXG5cdFx0XHRcdGJpZ2dlckRlY2ltYWwuZXhwb25lbnQtMTQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGFkZCh2YWx1ZSwgb3RoZXIpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUuYWRkKG90aGVyKTtcclxuXHRcdH1cclxuXHJcblx0XHRwbHVzKHZhbHVlKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmFkZCh2YWx1ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIHBsdXModmFsdWUsIG90aGVyKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLmFkZChvdGhlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0c3ViKHZhbHVlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYWRkKERlY2ltYWwuZnJvbU1hbnRpc3NhRXhwb25lbnQoLXZhbHVlLm1hbnRpc3NhLCB2YWx1ZS5leHBvbmVudCkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBzdWIodmFsdWUsIG90aGVyKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLnN1YihvdGhlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0c3VidHJhY3QodmFsdWUpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuc3ViKHZhbHVlKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgc3VidHJhY3QodmFsdWUsIG90aGVyKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLnN1YihvdGhlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0bWludXModmFsdWUpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuc3ViKHZhbHVlKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgbWludXModmFsdWUsIG90aGVyKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLnN1YihvdGhlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0bXVsKHZhbHVlKSB7XHJcblx0XHRcdC8qXHJcblx0XHRcdGFfMSoxMF5iXzEgKiBhXzIqMTBeYl8yXHJcblx0XHRcdD0gYV8xKmFfMioxMF4oYl8xK2JfMilcclxuXHRcdFx0Ki9cclxuXHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIERlY2ltYWwuZnJvbU1hbnRpc3NhRXhwb25lbnQodGhpcy5tYW50aXNzYSp2YWx1ZS5tYW50aXNzYSwgdGhpcy5leHBvbmVudCt2YWx1ZS5leHBvbmVudCk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIG11bCh2YWx1ZSwgb3RoZXIpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUubXVsKG90aGVyKTtcclxuXHRcdH1cclxuXHJcblx0XHRtdWx0aXBseSh2YWx1ZSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5tdWwodmFsdWUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBtdWx0aXBseSh2YWx1ZSwgb3RoZXIpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUubXVsKG90aGVyKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aW1lcyh2YWx1ZSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5tdWwodmFsdWUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyB0aW1lcyh2YWx1ZSwgb3RoZXIpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUubXVsKG90aGVyKTtcclxuXHRcdH1cclxuXHJcblx0XHRkaXYodmFsdWUpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5tdWwodmFsdWUucmVjaXAoKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGRpdih2YWx1ZSwgb3RoZXIpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUuZGl2KG90aGVyKTtcclxuXHRcdH1cclxuXHJcblx0XHRkaXZpZGUodmFsdWUpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZGl2KHZhbHVlKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgZGl2aWRlKHZhbHVlLCBvdGhlcikge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5kaXYob3RoZXIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGRpdmlkZUJ5KHZhbHVlKSB7IHJldHVybiB0aGlzLmRpdih2YWx1ZSk7IH1cclxuXHRcdGRpdmlkZWRCeSh2YWx1ZSkgeyByZXR1cm4gdGhpcy5kaXYodmFsdWUpOyB9XHJcblxyXG5cdFx0cmVjaXAoKSB7XHJcblx0XHRcdHJldHVybiBEZWNpbWFsLmZyb21NYW50aXNzYUV4cG9uZW50KDEvdGhpcy5tYW50aXNzYSwgLXRoaXMuZXhwb25lbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyByZWNpcCh2YWx1ZSkge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5yZWNpcCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlY2lwcm9jYWwoKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnJlY2lwKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIHJlY2lwcm9jYWwodmFsdWUpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUucmVjaXAoKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZWNpcHJvY2F0ZSgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucmVjaXAoKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgcmVjaXByb2NhdGUodmFsdWUpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUucmVjaXByb2NhdGUoKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLy0xIGZvciBsZXNzIHRoYW4gdmFsdWUsIDAgZm9yIGVxdWFscyB2YWx1ZSwgMSBmb3IgZ3JlYXRlciB0aGFuIHZhbHVlXHJcblx0XHRjbXAodmFsdWUpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHQvL1RPRE86IHNpZ24oYS1iKSBtaWdodCBiZSBiZXR0ZXI/IGh0dHBzOi8vZ2l0aHViLmNvbS9QYXRhc2h1L2JyZWFrX2luZmluaXR5LmpzL2lzc3Vlcy8xMlxyXG5cclxuXHRcdFx0LypcclxuXHRcdFx0ZnJvbSBzbWFsbGVzdCB0byBsYXJnZXN0OlxyXG5cclxuXHRcdFx0LTNlMTAwXHJcblx0XHRcdC0xZTEwMFxyXG5cdFx0XHQtM2U5OVxyXG5cdFx0XHQtMWU5OVxyXG5cdFx0XHQtM2UwXHJcblx0XHRcdC0xZTBcclxuXHRcdFx0LTNlLTk5XHJcblx0XHRcdC0xZS05OVxyXG5cdFx0XHQtM2UtMTAwXHJcblx0XHRcdC0xZS0xMDBcclxuXHRcdFx0MFxyXG5cdFx0XHQxZS0xMDBcclxuXHRcdFx0M2UtMTAwXHJcblx0XHRcdDFlLTk5XHJcblx0XHRcdDNlLTk5XHJcblx0XHRcdDFlMFxyXG5cdFx0XHQzZTBcclxuXHRcdFx0MWU5OVxyXG5cdFx0XHQzZTk5XHJcblx0XHRcdDFlMTAwXHJcblx0XHRcdDNlMTAwXHJcblxyXG5cdFx0XHQqL1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubWFudGlzc2EgPT0gMClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmICh2YWx1ZS5tYW50aXNzYSA9PSAwKSB7IHJldHVybiAwOyB9XHJcblx0XHRcdFx0aWYgKHZhbHVlLm1hbnRpc3NhIDwgMCkgeyByZXR1cm4gMTsgfVxyXG5cdFx0XHRcdGlmICh2YWx1ZS5tYW50aXNzYSA+IDApIHsgcmV0dXJuIC0xOyB9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodmFsdWUubWFudGlzc2EgPT0gMClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmICh0aGlzLm1hbnRpc3NhIDwgMCkgeyByZXR1cm4gLTE7IH1cclxuXHRcdFx0XHRpZiAodGhpcy5tYW50aXNzYSA+IDApIHsgcmV0dXJuIDE7IH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMubWFudGlzc2EgPiAwKSAvL3Bvc2l0aXZlXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAodmFsdWUubWFudGlzc2EgPCAwKSB7IHJldHVybiAxOyB9XHJcblx0XHRcdFx0aWYgKHRoaXMuZXhwb25lbnQgPiB2YWx1ZS5leHBvbmVudCkgeyByZXR1cm4gMTsgfVxyXG5cdFx0XHRcdGlmICh0aGlzLmV4cG9uZW50IDwgdmFsdWUuZXhwb25lbnQpIHsgcmV0dXJuIC0xOyB9XHJcblx0XHRcdFx0aWYgKHRoaXMubWFudGlzc2EgPiB2YWx1ZS5tYW50aXNzYSkgeyByZXR1cm4gMTsgfVxyXG5cdFx0XHRcdGlmICh0aGlzLm1hbnRpc3NhIDwgdmFsdWUubWFudGlzc2EpIHsgcmV0dXJuIC0xOyB9XHJcblx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGhpcy5tYW50aXNzYSA8IDApIC8vIG5lZ2F0aXZlXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAodmFsdWUubWFudGlzc2EgPiAwKSB7IHJldHVybiAtMTsgfVxyXG5cdFx0XHRcdGlmICh0aGlzLmV4cG9uZW50ID4gdmFsdWUuZXhwb25lbnQpIHsgcmV0dXJuIC0xOyB9XHJcblx0XHRcdFx0aWYgKHRoaXMuZXhwb25lbnQgPCB2YWx1ZS5leHBvbmVudCkgeyByZXR1cm4gMTsgfVxyXG5cdFx0XHRcdGlmICh0aGlzLm1hbnRpc3NhID4gdmFsdWUubWFudGlzc2EpIHsgcmV0dXJuIDE7IH1cclxuXHRcdFx0XHRpZiAodGhpcy5tYW50aXNzYSA8IHZhbHVlLm1hbnRpc3NhKSB7IHJldHVybiAtMTsgfVxyXG5cdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGNtcCh2YWx1ZSwgb3RoZXIpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUuY21wKG90aGVyKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb21wYXJlKHZhbHVlKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmNtcCh2YWx1ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGNvbXBhcmUodmFsdWUsIG90aGVyKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLmNtcChvdGhlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXEodmFsdWUpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5leHBvbmVudCA9PSB2YWx1ZS5leHBvbmVudCAmJiB0aGlzLm1hbnRpc3NhID09IHZhbHVlLm1hbnRpc3NhXHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGVxKHZhbHVlLCBvdGhlcikge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5lcShvdGhlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXF1YWxzKHZhbHVlKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmVxKHZhbHVlKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgZXF1YWxzKHZhbHVlLCBvdGhlcikge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5lcShvdGhlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0bmVxKHZhbHVlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuZXhwb25lbnQgIT0gdmFsdWUuZXhwb25lbnQgfHwgdGhpcy5tYW50aXNzYSAhPSB2YWx1ZS5tYW50aXNzYVxyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBuZXEodmFsdWUsIG90aGVyKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLm5lcShvdGhlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0bm90RXF1YWxzKHZhbHVlKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLm5lcSh2YWx1ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIG5vdEVxdWFscyh2YWx1ZSwgb3RoZXIpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUubm90RXF1YWxzKG90aGVyKTtcclxuXHRcdH1cclxuXHJcblx0XHRsdCh2YWx1ZSkge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLm1hbnRpc3NhID09IDApIHJldHVybiB2YWx1ZS5tYW50aXNzYSA+IDA7XHJcblx0XHRcdGlmICh2YWx1ZS5tYW50aXNzYSA9PSAwKSByZXR1cm4gdGhpcy5tYW50aXNzYSA8PSAwO1xyXG5cdFx0XHRpZiAodGhpcy5leHBvbmVudCA9PSB2YWx1ZS5leHBvbmVudCkgcmV0dXJuIHRoaXMubWFudGlzc2EgPCB2YWx1ZS5tYW50aXNzYTtcclxuXHRcdFx0aWYgKHRoaXMubWFudGlzc2EgPiAwKSByZXR1cm4gdmFsdWUubWFudGlzc2EgPiAwICYmIHRoaXMuZXhwb25lbnQgPCB2YWx1ZS5leHBvbmVudDtcclxuXHRcdFx0cmV0dXJuIHZhbHVlLm1hbnRpc3NhID4gMCB8fCB0aGlzLmV4cG9uZW50ID4gdmFsdWUuZXhwb25lbnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGx0KHZhbHVlLCBvdGhlcikge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5sdChvdGhlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0bHRlKHZhbHVlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubWFudGlzc2EgPT0gMCkgcmV0dXJuIHZhbHVlLm1hbnRpc3NhID49IDA7XHJcblx0XHRcdGlmICh2YWx1ZS5tYW50aXNzYSA9PSAwKSByZXR1cm4gdGhpcy5tYW50aXNzYSA8PSAwO1xyXG5cdFx0XHRpZiAodGhpcy5leHBvbmVudCA9PSB2YWx1ZS5leHBvbmVudCkgcmV0dXJuIHRoaXMubWFudGlzc2EgPD0gdmFsdWUubWFudGlzc2E7XHJcblx0XHRcdGlmICh0aGlzLm1hbnRpc3NhID4gMCkgcmV0dXJuIHZhbHVlLm1hbnRpc3NhID4gMCAmJiB0aGlzLmV4cG9uZW50IDwgdmFsdWUuZXhwb25lbnQ7XHJcblx0XHRcdHJldHVybiB2YWx1ZS5tYW50aXNzYSA+IDAgfHwgdGhpcy5leHBvbmVudCA+IHZhbHVlLmV4cG9uZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBsdGUodmFsdWUsIG90aGVyKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLmx0ZShvdGhlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0Z3QodmFsdWUpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5tYW50aXNzYSA9PSAwKSByZXR1cm4gdmFsdWUubWFudGlzc2EgPCAwO1xyXG5cdFx0XHRpZiAodmFsdWUubWFudGlzc2EgPT0gMCkgcmV0dXJuIHRoaXMubWFudGlzc2EgPiAwO1xyXG5cdFx0XHRpZiAodGhpcy5leHBvbmVudCA9PSB2YWx1ZS5leHBvbmVudCkgcmV0dXJuIHRoaXMubWFudGlzc2EgPiB2YWx1ZS5tYW50aXNzYTtcclxuXHRcdFx0aWYgKHRoaXMubWFudGlzc2EgPiAwKSByZXR1cm4gdmFsdWUubWFudGlzc2EgPCAwIHx8IHRoaXMuZXhwb25lbnQgPiB2YWx1ZS5leHBvbmVudDtcclxuXHRcdFx0cmV0dXJuIHZhbHVlLm1hbnRpc3NhIDwgMCAmJiB0aGlzLmV4cG9uZW50IDwgdmFsdWUuZXhwb25lbnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGd0KHZhbHVlLCBvdGhlcikge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5ndChvdGhlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0Z3RlKHZhbHVlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubWFudGlzc2EgPT0gMCkgcmV0dXJuIHZhbHVlLm1hbnRpc3NhIDw9IDA7XHJcblx0XHRcdGlmICh2YWx1ZS5tYW50aXNzYSA9PSAwKSByZXR1cm4gdGhpcy5tYW50aXNzYSA+IDA7XHJcblx0XHRcdGlmICh0aGlzLmV4cG9uZW50ID09IHZhbHVlLmV4cG9uZW50KSByZXR1cm4gdGhpcy5tYW50aXNzYSA+PSB2YWx1ZS5tYW50aXNzYTtcclxuXHRcdFx0aWYgKHRoaXMubWFudGlzc2EgPiAwKSByZXR1cm4gdmFsdWUubWFudGlzc2EgPCAwIHx8IHRoaXMuZXhwb25lbnQgPiB2YWx1ZS5leHBvbmVudDtcclxuXHRcdFx0cmV0dXJuIHZhbHVlLm1hbnRpc3NhIDwgMCAmJiB0aGlzLmV4cG9uZW50IDwgdmFsdWUuZXhwb25lbnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGd0ZSh2YWx1ZSwgb3RoZXIpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUuZ3RlKG90aGVyKTtcclxuXHRcdH1cclxuXHJcblx0XHRtYXgodmFsdWUpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5ndGUodmFsdWUpKSByZXR1cm4gdGhpcztcclxuXHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBtYXgodmFsdWUsIG90aGVyKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLm1heChvdGhlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0bWluKHZhbHVlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubHRlKHZhbHVlKSkgcmV0dXJuIHRoaXM7XHJcblx0XHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgbWluKHZhbHVlLCBvdGhlcikge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5taW4ob3RoZXIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNtcF90b2xlcmFuY2UodmFsdWUsIHRvbGVyYW5jZSkge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmVxX3RvbGVyYW5jZSh2YWx1ZSwgdG9sZXJhbmNlKSkgcmV0dXJuIDA7XHJcblx0XHRcdHJldHVybiB0aGlzLmNtcCh2YWx1ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGNtcF90b2xlcmFuY2UodmFsdWUsIG90aGVyLCB0b2xlcmFuY2UpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUuY21wX3RvbGVyYW5jZShvdGhlciwgdG9sZXJhbmNlKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb21wYXJlX3RvbGVyYW5jZSh2YWx1ZSwgdG9sZXJhbmNlKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmNtcF90b2xlcmFuY2UodmFsdWUsIHRvbGVyYW5jZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGNvbXBhcmVfdG9sZXJhbmNlKHZhbHVlLCBvdGhlciwgdG9sZXJhbmNlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLmNtcF90b2xlcmFuY2Uob3RoZXIsIHRvbGVyYW5jZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly90b2xlcmFuY2UgaXMgYSByZWxhdGl2ZSB0b2xlcmFuY2UsIG11bHRpcGxpZWQgYnkgdGhlIGdyZWF0ZXIgb2YgdGhlIG1hZ25pdHVkZXMgb2YgdGhlIHR3byBhcmd1bWVudHMuIEZvciBleGFtcGxlLCBpZiB5b3UgcHV0IGluIDFlLTksIHRoZW4gYW55IG51bWJlciBjbG9zZXIgdG8gdGhlIGxhcmdlciBudW1iZXIgdGhhbiAobGFyZ2VyIG51bWJlcikqMWUtOSB3aWxsIGJlIGNvbnNpZGVyZWQgZXF1YWwuXHJcblx0XHRlcV90b2xlcmFuY2UodmFsdWUsIHRvbGVyYW5jZSkge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMzAyNDk3OVxyXG5cdFx0XHQvL3JldHVybiBhYnMoYS1iKSA8PSB0b2xlcmFuY2UgKiBtYXgoYWJzKGEpLCBhYnMoYikpXHJcblxyXG5cdFx0XHRyZXR1cm4gRGVjaW1hbC5sdGUoXHJcblx0XHRcdFx0dGhpcy5zdWIodmFsdWUpLmFicygpLFxyXG5cdFx0XHRcdERlY2ltYWwubWF4KHRoaXMuYWJzKCksIHZhbHVlLmFicygpKS5tdWwodG9sZXJhbmNlKVxyXG5cdFx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGVxX3RvbGVyYW5jZSh2YWx1ZSwgb3RoZXIsIHRvbGVyYW5jZSkge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5lcV90b2xlcmFuY2Uob3RoZXIsIHRvbGVyYW5jZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXF1YWxzX3RvbGVyYW5jZSh2YWx1ZSwgdG9sZXJhbmNlKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmVxX3RvbGVyYW5jZSh2YWx1ZSwgdG9sZXJhbmNlKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgZXF1YWxzX3RvbGVyYW5jZSh2YWx1ZSwgb3RoZXIsIHRvbGVyYW5jZSkge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5lcV90b2xlcmFuY2Uob3RoZXIsIHRvbGVyYW5jZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0bmVxX3RvbGVyYW5jZSh2YWx1ZSwgdG9sZXJhbmNlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuICF0aGlzLmVxX3RvbGVyYW5jZSh2YWx1ZSwgdG9sZXJhbmNlKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgbmVxX3RvbGVyYW5jZSh2YWx1ZSwgb3RoZXIsIHRvbGVyYW5jZSkge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5uZXFfdG9sZXJhbmNlKG90aGVyLCB0b2xlcmFuY2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdG5vdEVxdWFsc190b2xlcmFuY2UodmFsdWUsIHRvbGVyYW5jZSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5uZXFfdG9sZXJhbmNlKHZhbHVlLCB0b2xlcmFuY2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBub3RFcXVhbHNfdG9sZXJhbmNlKHZhbHVlLCBvdGhlciwgdG9sZXJhbmNlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLm5vdEVxdWFsc190b2xlcmFuY2Uob3RoZXIsIHRvbGVyYW5jZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0bHRfdG9sZXJhbmNlKHZhbHVlLCB0b2xlcmFuY2UpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5lcV90b2xlcmFuY2UodmFsdWUsIHRvbGVyYW5jZSkpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIHRoaXMubHQodmFsdWUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBsdF90b2xlcmFuY2UodmFsdWUsIG90aGVyLCB0b2xlcmFuY2UpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUubHRfdG9sZXJhbmNlKG90aGVyLCB0b2xlcmFuY2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGx0ZV90b2xlcmFuY2UodmFsdWUsIHRvbGVyYW5jZSkge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmVxX3RvbGVyYW5jZSh2YWx1ZSwgdG9sZXJhbmNlKSkgcmV0dXJuIHRydWU7XHJcblx0XHRcdHJldHVybiB0aGlzLmx0KHZhbHVlKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgbHRlX3RvbGVyYW5jZSh2YWx1ZSwgb3RoZXIsIHRvbGVyYW5jZSkge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5sdGVfdG9sZXJhbmNlKG90aGVyLCB0b2xlcmFuY2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGd0X3RvbGVyYW5jZSh2YWx1ZSwgdG9sZXJhbmNlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuZXFfdG9sZXJhbmNlKHZhbHVlLCB0b2xlcmFuY2UpKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdHJldHVybiB0aGlzLmd0KHZhbHVlKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgZ3RfdG9sZXJhbmNlKHZhbHVlLCBvdGhlciwgdG9sZXJhbmNlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLmd0X3RvbGVyYW5jZShvdGhlciwgdG9sZXJhbmNlKTtcclxuXHRcdH1cclxuXHJcblx0XHRndGVfdG9sZXJhbmNlKHZhbHVlLCB0b2xlcmFuY2UpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5lcV90b2xlcmFuY2UodmFsdWUsIHRvbGVyYW5jZSkpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5ndCh2YWx1ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGd0ZV90b2xlcmFuY2UodmFsdWUsIG90aGVyLCB0b2xlcmFuY2UpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUuZ3RlX3RvbGVyYW5jZShvdGhlciwgdG9sZXJhbmNlKTtcclxuXHRcdH1cclxuXHJcblx0XHRsb2cxMCgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZXhwb25lbnQgKyBNYXRoLmxvZzEwKHRoaXMubWFudGlzc2EpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBsb2cxMCh2YWx1ZSkge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5sb2cxMCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxvZyhiYXNlKSB7XHJcblx0XHRcdC8vVU4tU0FGRVRZOiBNb3N0IGluY3JlbWVudGFsIGdhbWUgY2FzZXMgYXJlIGxvZyhudW1iZXIgOj0gMSBvciBncmVhdGVyLCBiYXNlIDo9IDIgb3IgZ3JlYXRlcikuIFdlIGFzc3VtZSB0aGlzIHRvIGJlIHRydWUgYW5kIHRodXMgb25seSBuZWVkIHRvIHJldHVybiBhIG51bWJlciwgbm90IGEgRGVjaW1hbCwgYW5kIGRvbid0IGRvIGFueSBvdGhlciBraW5kIG9mIGVycm9yIGNoZWNraW5nLlxyXG5cdFx0XHRyZXR1cm4gKE1hdGguTE4xMC9NYXRoLmxvZyhiYXNlKSkqdGhpcy5sb2cxMCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBsb2codmFsdWUsIGJhc2UpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUubG9nKGJhc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxvZzIoKSB7XHJcblx0XHRcdHJldHVybiAzLjMyMTkyODA5NDg4NzM2MjM0Nzg3KnRoaXMubG9nMTAoKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgbG9nMih2YWx1ZSkge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5sb2cyKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0bG4oKSB7XHJcblx0XHRcdHJldHVybiAyLjMwMjU4NTA5Mjk5NDA0NTY4NDAyKnRoaXMubG9nMTAoKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgbG4odmFsdWUpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUubG4oKTtcclxuXHRcdH1cclxuXHJcblx0XHRsb2dhcml0aG0oYmFzZSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5sb2coYmFzZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGxvZ2FyaXRobSh2YWx1ZSwgYmFzZSkge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5sb2dhcml0aG0oYmFzZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cG93KHZhbHVlKSB7XHJcblx0XHRcdC8vVU4tU0FGRVRZOiBBY2N1cmFjeSBub3QgZ3VhcmFudGVlZCBiZXlvbmQgfjl+MTEgZGVjaW1hbCBwbGFjZXMuXHJcblxyXG5cdFx0XHRpZiAodmFsdWUgaW5zdGFuY2VvZiBEZWNpbWFsKSB7IHZhbHVlID0gdmFsdWUudG9OdW1iZXIoKTsgfVxyXG5cclxuXHRcdFx0Ly9UT0RPOiBGYXN0IHRyYWNrIHNlZW1zIGFib3V0IG5ldXRyYWwgZm9yIHBlcmZvcm1hbmNlLiBJdCBtaWdodCBiZWNvbWUgZmFzdGVyIGlmIGFuIGludGVnZXIgcG93IGlzIGltcGxlbWVudGVkLCBvciBpdCBtaWdodCBub3QgYmUgd29ydGggZG9pbmcgKHNlZSBodHRwczovL2dpdGh1Yi5jb20vUGF0YXNodS9icmVha19pbmZpbml0eS5qcy9pc3N1ZXMvNCApXHJcblxyXG5cdFx0XHQvL0Zhc3QgdHJhY2s6IElmICh0aGlzLmV4cG9uZW50KnZhbHVlKSBpcyBhbiBpbnRlZ2VyIGFuZCBtYW50aXNzYV52YWx1ZSBmaXRzIGluIGEgTnVtYmVyLCB3ZSBjYW4gZG8gYSB2ZXJ5IGZhc3QgbWV0aG9kLlxyXG5cdFx0XHR2YXIgdGVtcCA9IHRoaXMuZXhwb25lbnQqdmFsdWU7XHJcblx0XHRcdGlmIChOdW1iZXIuaXNTYWZlSW50ZWdlcih0ZW1wKSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZhciBuZXdNYW50aXNzYSA9IE1hdGgucG93KHRoaXMubWFudGlzc2EsIHZhbHVlKTtcclxuXHRcdFx0XHRpZiAoaXNGaW5pdGUobmV3TWFudGlzc2EpKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHJldHVybiBEZWNpbWFsLmZyb21NYW50aXNzYUV4cG9uZW50KG5ld01hbnRpc3NhLCB0ZW1wKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vU2FtZSBzcGVlZCBhbmQgdXN1YWxseSBtb3JlIGFjY3VyYXRlLiAoQW4gYXJiaXRyYXJ5LXByZWNpc2lvbiB2ZXJzaW9uIG9mIHRoaXMgY2FsY3VsYXRpb24gaXMgdXNlZCBpbiBicmVha19icmVha19pbmZpbml0eS5qcywgc2FjcmlmaWNpbmcgcGVyZm9ybWFuY2UgZm9yIHV0dGVyIGFjY3VyYWN5LilcclxuXHJcblx0XHRcdHZhciBuZXdleHBvbmVudCA9IE1hdGgudHJ1bmModGVtcCk7XHJcblx0XHRcdHZhciByZXNpZHVlID0gdGVtcC1uZXdleHBvbmVudDtcclxuXHRcdFx0dmFyIG5ld01hbnRpc3NhID0gTWF0aC5wb3coMTAsIHZhbHVlKk1hdGgubG9nMTAodGhpcy5tYW50aXNzYSkrcmVzaWR1ZSk7XHJcblx0XHRcdGlmIChpc0Zpbml0ZShuZXdNYW50aXNzYSkpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gRGVjaW1hbC5mcm9tTWFudGlzc2FFeHBvbmVudChuZXdNYW50aXNzYSwgbmV3ZXhwb25lbnQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL3JldHVybiBEZWNpbWFsLmV4cCh2YWx1ZSp0aGlzLmxuKCkpO1xyXG5cdFx0XHRyZXR1cm4gRGVjaW1hbC5wb3cxMCh2YWx1ZSp0aGlzLmxvZzEwKCkpOyAvL3RoaXMgaXMgMnggZmFzdGVyIGFuZCBnaXZlcyBzYW1lIHZhbHVlcyBBRkFJS1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBwb3cxMCh2YWx1ZSkge1xyXG5cdFx0XHRpZiAoTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gRGVjaW1hbC5mcm9tTWFudGlzc2FFeHBvbmVudF9ub05vcm1hbGl6ZSgxLHZhbHVlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gRGVjaW1hbC5mcm9tTWFudGlzc2FFeHBvbmVudChNYXRoLnBvdygxMCx2YWx1ZSUxKSxNYXRoLnRydW5jKHZhbHVlKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cG93X2Jhc2UodmFsdWUpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUucG93KHRoaXMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBwb3codmFsdWUsIG90aGVyKSB7XHJcblx0XHRcdC8vRmFzdCB0cmFjazogMTBeaW50ZWdlclxyXG5cdFx0XHRpZiAodmFsdWUgPT0gMTAgJiYgTnVtYmVyLmlzSW50ZWdlcihvdGhlcikpIHsgcmV0dXJuIERlY2ltYWwuZnJvbU1hbnRpc3NhRXhwb25lbnQoMSwgb3RoZXIpOyB9XHJcblxyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5wb3cob3RoZXIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZhY3RvcmlhbCgpIHtcclxuXHRcdFx0Ly9Vc2luZyBTdGlybGluZydzIEFwcHJveGltYXRpb24uIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1N0aXJsaW5nJTI3c19hcHByb3hpbWF0aW9uI1ZlcnNpb25zX3N1aXRhYmxlX2Zvcl9jYWxjdWxhdG9yc1xyXG5cclxuXHRcdFx0dmFyIG4gPSB0aGlzLnRvTnVtYmVyKCkgKyAxO1xyXG5cclxuXHRcdFx0cmV0dXJuIERlY2ltYWwucG93KChuL01hdGguRSkqTWF0aC5zcXJ0KG4qTWF0aC5zaW5oKDEvbikrMS8oODEwKk1hdGgucG93KG4sIDYpKSksIG4pLm11bChNYXRoLnNxcnQoMipNYXRoLlBJL24pKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHAoKSB7XHJcblx0XHRcdC8vVU4tU0FGRVRZOiBBc3N1bWluZyB0aGlzIHZhbHVlIGlzIGJldHdlZW4gWy0yLjFlMTUsIDIuMWUxNV0uIEFjY3VyYWN5IG5vdCBndWFyYW50ZWVkIGJleW9uZCB+OX4xMSBkZWNpbWFsIHBsYWNlcy5cclxuXHJcblx0XHRcdC8vRmFzdCB0cmFjazogaWYgLTcwNiA8IHRoaXMgPCA3MDksIHdlIGNhbiB1c2UgcmVndWxhciBleHAuXHJcblx0XHRcdHZhciB4ID0gdGhpcy50b051bWJlcigpO1xyXG5cdFx0XHRpZiAoLTcwNiA8IHggJiYgeCA8IDcwOSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJldHVybiBEZWNpbWFsLmZyb21OdW1iZXIoTWF0aC5leHAoeCkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0e1xyXG5cdFx0XHRcdC8vVGhpcyBoYXMgdG8gYmUgaW1wbGVtZW50ZWQgZnVuZGFtZW50YWxseSwgc28gdGhhdCBwb3codmFsdWUpIGNhbiBiZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2YgaXQuXHJcblx0XHRcdFx0Ly9TaG91bGQgYmUgZmFzdCBhbmQgYWNjdXJhdGUgb3ZlciB0aGUgcmFuZ2UgWy0yLjFlMTUsIDIuMWUxNV0uIE91dHNpZGUgdGhhdCBpdCBvdmVyZmxvd3MsIHNvIHdlIGRvbid0IGNhcmUgYWJvdXQgdGhlc2UgY2FzZXMuXHJcblxyXG5cdFx0XHRcdC8vIEltcGxlbWVudGF0aW9uIGZyb20gU3BlZWRDcnVuY2g6IGh0dHBzOi8vYml0YnVja2V0Lm9yZy9oZWxkZXJjb3JyZWlhL3NwZWVkY3J1bmNoL3NyYy85Y2ZmYTdiNjc0ODkwYWZmY2I4NzdiZmViYzgxZDM5YzI2YjIwZGNjL3NyYy9tYXRoL2Zsb2F0ZXhwLmM/YXQ9bWFzdGVyJmZpbGV2aWV3ZXI9ZmlsZS12aWV3LWRlZmF1bHRcclxuXHJcblx0XHRcdFx0dmFyIGV4cCwgdG1wLCBleHB4O1xyXG5cclxuXHRcdFx0XHRleHAgPSAwO1xyXG5cdFx0XHRcdGV4cHggPSB0aGlzLmV4cG9uZW50O1xyXG5cclxuXHRcdFx0XHRpZiAoZXhweCA+PSAwKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGV4cCA9IE1hdGgudHJ1bmMoeC9NYXRoLkxOMTApO1xyXG5cdFx0XHRcdFx0dG1wID0gZXhwKk1hdGguTE4xMDtcclxuXHRcdFx0XHRcdHggLT0gdG1wO1xyXG5cdFx0XHRcdFx0aWYgKHggPj0gTWF0aC5MTjEwKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHQrK2V4cDtcclxuXHRcdFx0XHRcdFx0eCAtPSBNYXRoLkxOMTA7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh4IDwgMClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHQtLWV4cDtcclxuXHRcdFx0XHRcdHggKz0gTWF0aC5MTjEwO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly93aGVuIHdlIGdldCBoZXJlIDAgPD0geCA8IGxuIDEwXHJcblx0XHRcdFx0eCA9IE1hdGguZXhwKHgpO1xyXG5cclxuXHRcdFx0XHRpZiAoZXhwICE9IDApXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0ZXhweCA9IE1hdGguZmxvb3IoZXhwKTsgLy9UT0RPOiBvciByb3VuZCwgb3IgZXZlbiBub3RoaW5nPyBjYW4gaXQgZXZlciBiZSBub24taW50ZWdlcj9cclxuXHRcdFx0XHRcdHggPSBEZWNpbWFsLmZyb21NYW50aXNzYUV4cG9uZW50KHgsIGV4cHgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIHg7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgZXhwKHZhbHVlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLmV4cCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNxcigpIHtcclxuXHRcdFx0cmV0dXJuIERlY2ltYWwuZnJvbU1hbnRpc3NhRXhwb25lbnQoTWF0aC5wb3codGhpcy5tYW50aXNzYSwgMiksIHRoaXMuZXhwb25lbnQqMik7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIHNxcih2YWx1ZSkge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5zcXIoKTtcclxuXHRcdH1cclxuXHJcblx0XHRzcXJ0KCkge1xyXG5cdFx0XHRpZiAodGhpcy5tYW50aXNzYSA8IDApIHsgcmV0dXJuIG5ldyBEZWNpbWFsKE51bWJlci5OYU4pIH07XHJcblx0XHRcdGlmICh0aGlzLmV4cG9uZW50ICUgMiAhPSAwKSB7IHJldHVybiBEZWNpbWFsLmZyb21NYW50aXNzYUV4cG9uZW50KE1hdGguc3FydCh0aGlzLm1hbnRpc3NhKSozLjE2MjI3NzY2MDE2ODM4LCBNYXRoLmZsb29yKHRoaXMuZXhwb25lbnQvMikpOyB9IC8vbW9kIG9mIGEgbmVnYXRpdmUgbnVtYmVyIGlzIG5lZ2F0aXZlLCBzbyAhPSBtZWFucyAnMSBvciAtMSdcclxuXHRcdFx0cmV0dXJuIERlY2ltYWwuZnJvbU1hbnRpc3NhRXhwb25lbnQoTWF0aC5zcXJ0KHRoaXMubWFudGlzc2EpLCBNYXRoLmZsb29yKHRoaXMuZXhwb25lbnQvMikpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBzcXJ0KHZhbHVlKSB7XHJcblx0XHRcdHZhbHVlID0gRGVjaW1hbC5mcm9tVmFsdWUodmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlLnNxcnQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRjdWJlKCkge1xyXG5cdFx0XHRyZXR1cm4gRGVjaW1hbC5mcm9tTWFudGlzc2FFeHBvbmVudChNYXRoLnBvdyh0aGlzLm1hbnRpc3NhLCAzKSwgdGhpcy5leHBvbmVudCozKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgY3ViZSh2YWx1ZSkge1xyXG5cdFx0XHR2YWx1ZSA9IERlY2ltYWwuZnJvbVZhbHVlKHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZS5jdWJlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y2JydCgpIHtcclxuXHRcdFx0dmFyIHNpZ24gPSAxO1xyXG5cdFx0XHR2YXIgbWFudGlzc2EgPSB0aGlzLm1hbnRpc3NhO1xyXG5cdFx0XHRpZiAobWFudGlzc2EgPCAwKSB7IHNpZ24gPSAtMTsgbWFudGlzc2EgPSAtbWFudGlzc2E7IH07XHJcblx0XHRcdHZhciBuZXdtYW50aXNzYSA9IHNpZ24qTWF0aC5wb3cobWFudGlzc2EsICgxLzMpKTtcclxuXHJcblx0XHRcdHZhciBtb2QgPSB0aGlzLmV4cG9uZW50ICUgMztcclxuXHRcdFx0aWYgKG1vZCA9PSAxIHx8IG1vZCA9PSAtMSkgeyByZXR1cm4gRGVjaW1hbC5mcm9tTWFudGlzc2FFeHBvbmVudChuZXdtYW50aXNzYSoyLjE1NDQzNDY5MDAzMTg4MzcsIE1hdGguZmxvb3IodGhpcy5leHBvbmVudC8zKSk7IH1cclxuXHRcdFx0aWYgKG1vZCAhPSAwKSB7IHJldHVybiBEZWNpbWFsLmZyb21NYW50aXNzYUV4cG9uZW50KG5ld21hbnRpc3NhKjQuNjQxNTg4ODMzNjEyNzc4OSwgTWF0aC5mbG9vcih0aGlzLmV4cG9uZW50LzMpKTsgfSAvL21vZCAhPSAwIGF0IHRoaXMgcG9pbnQgbWVhbnMgJ21vZCA9PSAyIHx8IG1vZCA9PSAtMidcclxuXHRcdFx0cmV0dXJuIERlY2ltYWwuZnJvbU1hbnRpc3NhRXhwb25lbnQobmV3bWFudGlzc2EsIE1hdGguZmxvb3IodGhpcy5leHBvbmVudC8zKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGNicnQodmFsdWUpIHtcclxuXHRcdFx0dmFsdWUgPSBEZWNpbWFsLmZyb21WYWx1ZSh2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWUuY2JydCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vU29tZSBoeXBlcmJvbGljIHRyaWcgZnVuY3Rpb25zIHRoYXQgaGFwcGVuIHRvIGJlIGVhc3lcclxuXHRcdHNpbmgoKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmV4cCgpLnN1Yih0aGlzLm5lZ2F0ZSgpLmV4cCgpKS5kaXYoMik7XHJcblx0XHR9XHJcblx0XHRjb3NoKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5leHAoKS5hZGQodGhpcy5uZWdhdGUoKS5leHAoKSkuZGl2KDIpO1xyXG5cdFx0fVxyXG5cdFx0dGFuaCgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuc2luaCgpLmRpdih0aGlzLmNvc2goKSk7XHJcblx0XHR9XHJcblx0XHRhc2luaCgpIHtcclxuXHRcdFx0cmV0dXJuIERlY2ltYWwubG4odGhpcy5hZGQodGhpcy5zcXIoKS5hZGQoMSkuc3FydCgpKSk7XHJcblx0XHR9XHJcblx0XHRhY29zaCgpIHtcclxuXHRcdFx0cmV0dXJuIERlY2ltYWwubG4odGhpcy5hZGQodGhpcy5zcXIoKS5zdWIoMSkuc3FydCgpKSk7XHJcblx0XHR9XHJcblx0XHRhdGFuaCgpIHtcclxuXHRcdGlmICh0aGlzLmFicygpLmd0ZSgxKSkgcmV0dXJuIE51bWJlci5OYU47XHJcblx0XHRyZXR1cm4gRGVjaW1hbC5sbih0aGlzLmFkZCgxKS5kaXYobmV3IERlY2ltYWwoMSkuc3ViKHRoaXMpKSkuZGl2KDIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vSWYgeW91J3JlIHdpbGxpbmcgdG8gc3BlbmQgJ3Jlc291cmNlc0F2YWlsYWJsZScgYW5kIHdhbnQgdG8gYnV5IHNvbWV0aGluZyB3aXRoIGV4cG9uZW50aWFsbHkgaW5jcmVhc2luZyBjb3N0IGVhY2ggcHVyY2hhc2UgKHN0YXJ0IGF0IHByaWNlU3RhcnQsIG11bHRpcGx5IGJ5IHByaWNlUmF0aW8sIGFscmVhZHkgb3duIGN1cnJlbnRPd25lZCksIGhvdyBtdWNoIG9mIGl0IGNhbiB5b3UgYnV5PyBBZGFwdGVkIGZyb20gVHJpbXBzIHNvdXJjZSBjb2RlLlxyXG5cdFx0c3RhdGljIGFmZm9yZEdlb21ldHJpY1NlcmllcyhyZXNvdXJjZXNBdmFpbGFibGUsIHByaWNlU3RhcnQsIHByaWNlUmF0aW8sIGN1cnJlbnRPd25lZClcclxuXHRcdHtcclxuXHRcdFx0cmVzb3VyY2VzQXZhaWxhYmxlID0gRGVjaW1hbC5mcm9tVmFsdWUocmVzb3VyY2VzQXZhaWxhYmxlKTtcclxuXHRcdFx0cHJpY2VTdGFydCA9IERlY2ltYWwuZnJvbVZhbHVlKHByaWNlU3RhcnQpO1xyXG5cdFx0XHRwcmljZVJhdGlvID0gRGVjaW1hbC5mcm9tVmFsdWUocHJpY2VSYXRpbyk7XHJcblx0XHRcdHZhciBhY3R1YWxTdGFydCA9IHByaWNlU3RhcnQubXVsKERlY2ltYWwucG93KHByaWNlUmF0aW8sIGN1cnJlbnRPd25lZCkpO1xyXG5cclxuXHRcdFx0Ly9yZXR1cm4gTWF0aC5mbG9vcihsb2cxMCgoKHJlc291cmNlc0F2YWlsYWJsZSAvIChwcmljZVN0YXJ0ICogTWF0aC5wb3cocHJpY2VSYXRpbywgY3VycmVudE93bmVkKSkpICogKHByaWNlUmF0aW8gLSAxKSkgKyAxKSAvIGxvZzEwKHByaWNlUmF0aW8pKTtcclxuXHJcblx0XHRcdHJldHVybiBEZWNpbWFsLmZsb29yKERlY2ltYWwubG9nMTAoKChyZXNvdXJjZXNBdmFpbGFibGUuZGl2KGFjdHVhbFN0YXJ0KSkubXVsKChwcmljZVJhdGlvLnN1YigxKSkpKS5hZGQoMSkpIC8gKERlY2ltYWwubG9nMTAocHJpY2VSYXRpbykpKTtcclxuXHRcdH1cclxuXHJcblx0XHQvL0hvdyBtdWNoIHJlc291cmNlIHdvdWxkIGl0IGNvc3QgdG8gYnV5IChudW1JdGVtcykgaXRlbXMgaWYgeW91IGFscmVhZHkgaGF2ZSBjdXJyZW50T3duZWQsIHRoZSBpbml0aWFsIHByaWNlIGlzIHByaWNlU3RhcnQgYW5kIGl0IG11bHRpcGxpZXMgYnkgcHJpY2VSYXRpbyBlYWNoIHB1cmNoYXNlP1xyXG5cdFx0c3RhdGljIHN1bUdlb21ldHJpY1NlcmllcyhudW1JdGVtcywgcHJpY2VTdGFydCwgcHJpY2VSYXRpbywgY3VycmVudE93bmVkKVxyXG5cdFx0e1xyXG5cdFx0XHRwcmljZVN0YXJ0ID0gRGVjaW1hbC5mcm9tVmFsdWUocHJpY2VTdGFydCk7XHJcblx0XHRcdHByaWNlUmF0aW8gPSBEZWNpbWFsLmZyb21WYWx1ZShwcmljZVJhdGlvKTtcclxuXHRcdFx0dmFyIGFjdHVhbFN0YXJ0ID0gcHJpY2VTdGFydC5tdWwoRGVjaW1hbC5wb3cocHJpY2VSYXRpbywgY3VycmVudE93bmVkKSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gKGFjdHVhbFN0YXJ0Lm11bChEZWNpbWFsLnN1YigxLERlY2ltYWwucG93KHByaWNlUmF0aW8sbnVtSXRlbXMpKSkpLmRpdihEZWNpbWFsLnN1YigxLHByaWNlUmF0aW8pKTtcclxuXHRcdH1cclxuXHJcblx0XHQvL0lmIHlvdSdyZSB3aWxsaW5nIHRvIHNwZW5kICdyZXNvdXJjZXNBdmFpbGFibGUnIGFuZCB3YW50IHRvIGJ1eSBzb21ldGhpbmcgd2l0aCBhZGRpdGl2ZWx5IGluY3JlYXNpbmcgY29zdCBlYWNoIHB1cmNoYXNlIChzdGFydCBhdCBwcmljZVN0YXJ0LCBhZGQgYnkgcHJpY2VBZGQsIGFscmVhZHkgb3duIGN1cnJlbnRPd25lZCksIGhvdyBtdWNoIG9mIGl0IGNhbiB5b3UgYnV5P1xyXG5cdFx0c3RhdGljIGFmZm9yZEFyaXRobWV0aWNTZXJpZXMocmVzb3VyY2VzQXZhaWxhYmxlLCBwcmljZVN0YXJ0LCBwcmljZUFkZCwgY3VycmVudE93bmVkKVxyXG5cdFx0e1xyXG5cdFx0XHRyZXNvdXJjZXNBdmFpbGFibGUgPSBEZWNpbWFsLmZyb21WYWx1ZShyZXNvdXJjZXNBdmFpbGFibGUpO1xyXG5cdFx0XHRwcmljZVN0YXJ0ID0gRGVjaW1hbC5mcm9tVmFsdWUocHJpY2VTdGFydCk7XHJcblx0XHRcdHByaWNlQWRkID0gRGVjaW1hbC5mcm9tVmFsdWUocHJpY2VBZGQpO1xyXG5cdFx0XHRjdXJyZW50T3duZWQgPSBEZWNpbWFsLmZyb21WYWx1ZShjdXJyZW50T3duZWQpO1xyXG5cdFx0XHR2YXIgYWN0dWFsU3RhcnQgPSBwcmljZVN0YXJ0LmFkZChEZWNpbWFsLm11bChjdXJyZW50T3duZWQscHJpY2VBZGQpKTtcclxuXHJcblx0XHRcdC8vbiA9ICgtKGEtZC8yKSArIHNxcnQoKGEtZC8yKV4yKzJkUykpL2RcclxuXHRcdFx0Ly93aGVyZSBhIGlzIGFjdHVhbFN0YXJ0LCBkIGlzIHByaWNlQWRkIGFuZCBTIGlzIHJlc291cmNlc0F2YWlsYWJsZVxyXG5cdFx0XHQvL3RoZW4gZmxvb3IgaXQgYW5kIHlvdSdyZSBkb25lIVxyXG5cclxuXHRcdFx0dmFyIGIgPSBhY3R1YWxTdGFydC5zdWIocHJpY2VBZGQuZGl2KDIpKTtcclxuXHRcdFx0dmFyIGIyID0gYi5wb3coMik7XHJcblxyXG5cdFx0XHRyZXR1cm4gRGVjaW1hbC5mbG9vcihcclxuXHRcdFx0KGIubmVnKCkuYWRkKERlY2ltYWwuc3FydChiMi5hZGQoRGVjaW1hbC5tdWwocHJpY2VBZGQsIHJlc291cmNlc0F2YWlsYWJsZSkubXVsKDIpKSkpXHJcblx0XHRcdCkuZGl2KHByaWNlQWRkKVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0Ly9yZXR1cm4gRGVjaW1hbC5mbG9vcihzb21ldGhpbmcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vSG93IG11Y2ggcmVzb3VyY2Ugd291bGQgaXQgY29zdCB0byBidXkgKG51bUl0ZW1zKSBpdGVtcyBpZiB5b3UgYWxyZWFkeSBoYXZlIGN1cnJlbnRPd25lZCwgdGhlIGluaXRpYWwgcHJpY2UgaXMgcHJpY2VTdGFydCBhbmQgaXQgYWRkcyBwcmljZUFkZCBlYWNoIHB1cmNoYXNlPyBBZGFwdGVkIGZyb20gaHR0cDovL3d3dy5tYXRod29yZHMuY29tL2EvYXJpdGhtZXRpY19zZXJpZXMuaHRtXHJcblx0XHRzdGF0aWMgc3VtQXJpdGhtZXRpY1NlcmllcyhudW1JdGVtcywgcHJpY2VTdGFydCwgcHJpY2VBZGQsIGN1cnJlbnRPd25lZClcclxuXHRcdHtcclxuXHRcdFx0bnVtSXRlbXMgPSBEZWNpbWFsLmZyb21WYWx1ZShudW1JdGVtcyk7XHJcblx0XHRcdHByaWNlU3RhcnQgPSBEZWNpbWFsLmZyb21WYWx1ZShwcmljZVN0YXJ0KTtcclxuXHRcdFx0cHJpY2VBZGQgPSBEZWNpbWFsLmZyb21WYWx1ZShwcmljZUFkZCk7XHJcblx0XHRcdGN1cnJlbnRPd25lZCA9IERlY2ltYWwuZnJvbVZhbHVlKGN1cnJlbnRPd25lZCk7XHJcblx0XHRcdHZhciBhY3R1YWxTdGFydCA9IHByaWNlU3RhcnQuYWRkKERlY2ltYWwubXVsKGN1cnJlbnRPd25lZCxwcmljZUFkZCkpO1xyXG5cclxuXHRcdFx0Ly8obi8yKSooMiphKyhuLTEpKmQpXHJcblxyXG5cdFx0XHRyZXR1cm4gRGVjaW1hbC5kaXYobnVtSXRlbXMsMikubXVsKERlY2ltYWwubXVsKDIsYWN0dWFsU3RhcnQpLnBsdXMobnVtSXRlbXMuc3ViKDEpLm11bChwcmljZUFkZCkpKVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vSm9rZSBmdW5jdGlvbiBmcm9tIFJlYWxtIEdyaW5kZXJcclxuXHRcdGFzY2Vuc2lvblBlbmFsdHkoYXNjZW5zaW9ucykge1xyXG5cdFx0XHRpZiAoYXNjZW5zaW9ucyA9PSAwKSByZXR1cm4gdGhpcztcclxuXHRcdFx0cmV0dXJuIHRoaXMucG93KE1hdGgucG93KDEwLCAtYXNjZW5zaW9ucykpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vV2hlbiBjb21wYXJpbmcgdHdvIHB1cmNoYXNlcyB0aGF0IGNvc3QgKHJlc291cmNlKSBhbmQgaW5jcmVhc2UgeW91ciByZXNvdXJjZS9zZWMgYnkgKGRlbHRhX1JwUyksIHRoZSBsb3dlc3QgZWZmaWNpZW5jeSBzY29yZSBpcyB0aGUgYmV0dGVyIG9uZSB0byBwdXJjaGFzZS4gRnJvbSBGcm96ZW4gQ29va2llczogaHR0cDovL2Nvb2tpZWNsaWNrZXIud2lraWEuY29tL3dpa2kvRnJvemVuX0Nvb2tpZXNfKEphdmFTY3JpcHRfQWRkLW9uKSNFZmZpY2llbmN5LjNGX1doYXQuMjdzX3RoYXQuM0ZcclxuXHRcdHN0YXRpYyBlZmZpY2llbmN5T2ZQdXJjaGFzZShjb3N0LCBjdXJyZW50X1JwUywgZGVsdGFfUnBTKVxyXG5cdFx0e1xyXG5cdFx0XHRjb3N0ID0gRGVjaW1hbC5mcm9tVmFsdWUoY29zdCk7XHJcblx0XHRcdGN1cnJlbnRfUnBTID0gRGVjaW1hbC5mcm9tVmFsdWUoY3VycmVudF9ScFMpO1xyXG5cdFx0XHRkZWx0YV9ScFMgPSBEZWNpbWFsLmZyb21WYWx1ZShkZWx0YV9ScFMpO1xyXG5cdFx0XHRyZXR1cm4gRGVjaW1hbC5hZGQoY29zdC5kaXYoY3VycmVudF9ScFMpLCBjb3N0LmRpdihkZWx0YV9ScFMpKTtcclxuXHRcdH1cclxuXHJcblx0XHQvL0pva2UgZnVuY3Rpb24gZnJvbSBDb29raWUgQ2xpY2tlci4gSXQncyAnZWdnJ1xyXG5cdFx0ZWdnKCkgeyByZXR1cm4gdGhpcy5hZGQoOSk7IH1cclxuXHJcbiAgICAgICAgLy8gIFBvcnRpbmcgc29tZSBmdW5jdGlvbiBmcm9tIERlY2ltYWwuanNcclxuICAgICAgICBsZXNzVGhhbk9yRXF1YWxUbyhvdGhlcikge3JldHVybiB0aGlzLmNtcChvdGhlcikgPCAxOyB9XHJcbiAgICAgICAgbGVzc1RoYW4ob3RoZXIpIHtyZXR1cm4gdGhpcy5jbXAob3RoZXIpIDwgMDsgfVxyXG4gICAgICAgIGdyZWF0ZXJUaGFuT3JFcXVhbFRvKG90aGVyKSB7IHJldHVybiB0aGlzLmNtcChvdGhlcikgPiAtMTsgfVxyXG4gICAgICAgIGdyZWF0ZXJUaGFuKG90aGVyKSB7cmV0dXJuIHRoaXMuY21wKG90aGVyKSA+IDA7IH1cclxuXHJcblxyXG5cdFx0c3RhdGljIHJhbmRvbURlY2ltYWxGb3JUZXN0aW5nKGFic01heEV4cG9uZW50KVxyXG5cdFx0e1xyXG5cdFx0XHQvL05PVEU6IFRoaXMgZG9lc24ndCBmb2xsb3cgYW55IGtpbmQgb2Ygc2FuZSByYW5kb20gZGlzdHJpYnV0aW9uLCBzbyB1c2UgdGhpcyBmb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5LlxyXG5cdFx0XHQvLzUlIG9mIHRoZSB0aW1lLCBoYXZlIGEgbWFudGlzc2Egb2YgMFxyXG5cdFx0XHRpZiAoTWF0aC5yYW5kb20oKSoyMCA8IDEpIHsgcmV0dXJuIERlY2ltYWwuZnJvbU1hbnRpc3NhRXhwb25lbnQoMCwgMCk7IH1cclxuXHRcdFx0dmFyIG1hbnRpc3NhID0gTWF0aC5yYW5kb20oKSoxMDtcclxuXHRcdFx0Ly8xMCUgb2YgdGhlIHRpbWUsIGhhdmUgYSBzaW1wbGUgbWFudGlzc2FcclxuXHRcdFx0aWYgKE1hdGgucmFuZG9tKCkqMTAgPCAxKSB7IG1hbnRpc3NhID0gTWF0aC5yb3VuZChtYW50aXNzYSk7IH1cclxuXHRcdFx0bWFudGlzc2EgKj0gTWF0aC5zaWduKE1hdGgucmFuZG9tKCkqMi0xKTtcclxuXHRcdFx0dmFyIGV4cG9uZW50ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmFic01heEV4cG9uZW50KjIpIC0gYWJzTWF4RXhwb25lbnQ7XHJcblx0XHRcdHJldHVybiBEZWNpbWFsLmZyb21NYW50aXNzYUV4cG9uZW50KG1hbnRpc3NhLCBleHBvbmVudCk7XHJcblxyXG5cdFx0XHQvKlxyXG5FeGFtcGxlczpcclxuXHJcbnJhbmRvbWx5IHRlc3QgcG93OlxyXG5cclxudmFyIGEgPSBEZWNpbWFsLnJhbmRvbURlY2ltYWxGb3JUZXN0aW5nKDEwMDApO1xyXG52YXIgcG93ID0gTWF0aC5yYW5kb20oKSoyMC0xMDtcclxuaWYgKE1hdGgucmFuZG9tKCkqMiA8IDEpIHsgcG93ID0gTWF0aC5yb3VuZChwb3cpOyB9XHJcbnZhciByZXN1bHQgPSBEZWNpbWFsLnBvdyhhLCBwb3cpO1xyXG5bXCIoXCIgKyBhLnRvU3RyaW5nKCkgKyBcIileXCIgKyBwb3cudG9TdHJpbmcoKSwgcmVzdWx0LnRvU3RyaW5nKCldXHJcblxyXG5yYW5kb21seSB0ZXN0IGFkZDpcclxuXHJcbnZhciBhID0gRGVjaW1hbC5yYW5kb21EZWNpbWFsRm9yVGVzdGluZygxMDAwKTtcclxudmFyIGIgPSBEZWNpbWFsLnJhbmRvbURlY2ltYWxGb3JUZXN0aW5nKDE3KTtcclxudmFyIGMgPSBhLm11bChiKTtcclxudmFyIHJlc3VsdCA9IGEuYWRkKGMpO1xyXG5bYS50b1N0cmluZygpICsgXCIrXCIgKyBjLnRvU3RyaW5nKCksIHJlc3VsdC50b1N0cmluZygpXVxyXG5cdFx0XHQqL1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gRXhwb3J0LlxyXG5cclxuXHQvLyBBTUQuXHJcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcblx0XHRkZWZpbmUoZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIERlY2ltYWw7XHJcblx0fSk7XHJcblxyXG5cdC8vIE5vZGUgYW5kIG90aGVyIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMuXHJcblx0fSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IERlY2ltYWw7XHJcblxyXG5cdC8vIEJyb3dzZXIuXHJcblx0fSBlbHNlIHtcclxuXHRpZiAoIWdsb2JhbFNjb3BlKSB7XHJcblx0XHRnbG9iYWxTY29wZSA9IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYgJiYgc2VsZi5zZWxmID09IHNlbGZcclxuXHRcdD8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XHJcblx0fVxyXG5cclxuXHR2YXIgbm9Db25mbGljdCA9IGdsb2JhbFNjb3BlLkRlY2ltYWw7XHJcblx0RGVjaW1hbC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0Z2xvYmFsU2NvcGUuRGVjaW1hbCA9IG5vQ29uZmxpY3Q7XHJcblx0XHRyZXR1cm4gRGVjaW1hbDtcclxuXHR9O1xyXG5cclxuXHRnbG9iYWxTY29wZS5EZWNpbWFsID0gRGVjaW1hbDtcclxuXHR9XHJcbn0pKHRoaXMpO1xyXG4iLCIvKiEgZGVjaW1hbC5qcyB2MTAuMC4xIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWtlTWNsL2RlY2ltYWwuanMvTElDRU5DRSAqL1xyXG47KGZ1bmN0aW9uIChnbG9iYWxTY29wZSkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4gIC8qXHJcbiAgICogIGRlY2ltYWwuanMgdjEwLjAuMVxyXG4gICAqICBBbiBhcmJpdHJhcnktcHJlY2lzaW9uIERlY2ltYWwgdHlwZSBmb3IgSmF2YVNjcmlwdC5cclxuICAgKiAgaHR0cHM6Ly9naXRodWIuY29tL01pa2VNY2wvZGVjaW1hbC5qc1xyXG4gICAqICBDb3B5cmlnaHQgKGMpIDIwMTcgTWljaGFlbCBNY2xhdWdobGluIDxNOGNoODhsQGdtYWlsLmNvbT5cclxuICAgKiAgTUlUIExpY2VuY2VcclxuICAgKi9cclxuXHJcblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICBFRElUQUJMRSBERUZBVUxUUyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXHJcblxyXG5cclxuICAgIC8vIFRoZSBtYXhpbXVtIGV4cG9uZW50IG1hZ25pdHVkZS5cclxuICAgIC8vIFRoZSBsaW1pdCBvbiB0aGUgdmFsdWUgb2YgYHRvRXhwTmVnYCwgYHRvRXhwUG9zYCwgYG1pbkVgIGFuZCBgbWF4RWAuXHJcbiAgdmFyIEVYUF9MSU1JVCA9IDllMTUsICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gOWUxNVxyXG5cclxuICAgIC8vIFRoZSBsaW1pdCBvbiB0aGUgdmFsdWUgb2YgYHByZWNpc2lvbmAsIGFuZCBvbiB0aGUgdmFsdWUgb2YgdGhlIGZpcnN0IGFyZ3VtZW50IHRvXHJcbiAgICAvLyBgdG9EZWNpbWFsUGxhY2VzYCwgYHRvRXhwb25lbnRpYWxgLCBgdG9GaXhlZGAsIGB0b1ByZWNpc2lvbmAgYW5kIGB0b1NpZ25pZmljYW50RGlnaXRzYC5cclxuICAgIE1BWF9ESUdJVFMgPSAxZTksICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byAxZTlcclxuXHJcbiAgICAvLyBCYXNlIGNvbnZlcnNpb24gYWxwaGFiZXQuXHJcbiAgICBOVU1FUkFMUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJyxcclxuXHJcbiAgICAvLyBUaGUgbmF0dXJhbCBsb2dhcml0aG0gb2YgMTAgKDEwMjUgZGlnaXRzKS5cclxuICAgIExOMTAgPSAnMi4zMDI1ODUwOTI5OTQwNDU2ODQwMTc5OTE0NTQ2ODQzNjQyMDc2MDExMDE0ODg2Mjg3NzI5NzYwMzMzMjc5MDA5Njc1NzI2MDk2NzczNTI0ODAyMzU5OTcyMDUwODk1OTgyOTgzNDE5Njc3ODQwNDIyODYyNDg2MzM0MDk1MjU0NjUwODI4MDY3NTY2NjYyODczNjkwOTg3ODE2ODk0ODI5MDcyMDgzMjU1NTQ2ODA4NDM3OTk4OTQ4MjYyMzMxOTg1MjgzOTM1MDUzMDg5NjUzNzc3MzI2Mjg4NDYxNjMzNjYyMjIyODc2OTgyMTk4ODY3NDY1NDM2Njc0NzQ0MDQyNDMyNzQzNjUxNTUwNDg5MzQzMTQ5MzkzOTE0Nzk2MTk0MDQ0MDAyMjIxMDUxMDE3MTQxNzQ4MDAzNjg4MDg0MDEyNjQ3MDgwNjg1NTY3NzQzMjE2MjI4MzU1MjIwMTE0ODA0NjYzNzE1NjU5MTIxMzczNDUwNzQ3ODU2OTQ3NjgzNDYzNjE2NzkyMTAxODA2NDQ1MDcwNjQ4MDAwMjc3NTAyNjg0OTE2NzQ2NTUwNTg2ODU2OTM1NjczNDIwNjcwNTgxMTM2NDI5MjI0NTU0NDA1NzU4OTI1NzI0MjA4MjQxMzE0Njk1Njg5MDE2NzU4OTQwMjU2Nzc2MzExMzU2OTE5MjkyMDMzMzc2NTg3MTQxNjYwMjMwMTA1NzAzMDg5NjM0NTcyMDc1NDQwMzcwODQ3NDY5OTQwMTY4MjY5MjgyODA4NDgxMTg0Mjg5MzE0ODQ4NTI0OTQ4NjQ0ODcxOTI3ODA5Njc2MjcxMjc1Nzc1Mzk3MDI3NjY4NjA1OTUyNDk2NzE2Njc0MTgzNDg1NzA0NDIyNTA3MTk3OTY1MDA0NzE0OTUxMDUwNDkyMjE0Nzc2NTY3NjM2OTM4NjYyOTc2OTc5NTIyMTEwNzE4MjY0NTQ5NzM0NzcyNjYyNDI1NzA5NDI5MzIyNTgyNzk4NTAyNTg1NTA5Nzg1MjY1MzgzMjA3NjA2NzI2MzE3MTY0MzA5NTA1OTk1MDg3ODA3NTIzNzEwMzMzMTAxMTk3ODU3NTQ3MzMxNTQxNDIxODA4NDI3NTQzODYzNTkxNzc4MTE3MDU0MzA5ODI3NDgyMzg1MDQ1NjQ4MDE5MDk1NjEwMjk5MjkxODI0MzE4MjM3NTI1MzU3NzA5NzUwNTM5NTY1MTg3Njk3NTEwMzc0OTcwODg4NjkyMTgwMjA1MTg5MzM5NTA3MjM4NTM5MjA1MTQ0NjM0MTk3MjY1Mjg3Mjg2OTY1MTEwODYyNTcxNDkyMTk4ODQ5OTc4NzQ4ODczNzcxMzQ1Njg2MjA5MTY3MDU4JyxcclxuXHJcbiAgICAvLyBQaSAoMTAyNSBkaWdpdHMpLlxyXG4gICAgUEkgPSAnMy4xNDE1OTI2NTM1ODk3OTMyMzg0NjI2NDMzODMyNzk1MDI4ODQxOTcxNjkzOTkzNzUxMDU4MjA5NzQ5NDQ1OTIzMDc4MTY0MDYyODYyMDg5OTg2MjgwMzQ4MjUzNDIxMTcwNjc5ODIxNDgwODY1MTMyODIzMDY2NDcwOTM4NDQ2MDk1NTA1ODIyMzE3MjUzNTk0MDgxMjg0ODExMTc0NTAyODQxMDI3MDE5Mzg1MjExMDU1NTk2NDQ2MjI5NDg5NTQ5MzAzODE5NjQ0Mjg4MTA5NzU2NjU5MzM0NDYxMjg0NzU2NDgyMzM3ODY3ODMxNjUyNzEyMDE5MDkxNDU2NDg1NjY5MjM0NjAzNDg2MTA0NTQzMjY2NDgyMTMzOTM2MDcyNjAyNDkxNDEyNzM3MjQ1ODcwMDY2MDYzMTU1ODgxNzQ4ODE1MjA5MjA5NjI4MjkyNTQwOTE3MTUzNjQzNjc4OTI1OTAzNjAwMTEzMzA1MzA1NDg4MjA0NjY1MjEzODQxNDY5NTE5NDE1MTE2MDk0MzMwNTcyNzAzNjU3NTk1OTE5NTMwOTIxODYxMTczODE5MzI2MTE3OTMxMDUxMTg1NDgwNzQ0NjIzNzk5NjI3NDk1NjczNTE4ODU3NTI3MjQ4OTEyMjc5MzgxODMwMTE5NDkxMjk4MzM2NzMzNjI0NDA2NTY2NDMwODYwMjEzOTQ5NDYzOTUyMjQ3MzcxOTA3MDIxNzk4NjA5NDM3MDI3NzA1MzkyMTcxNzYyOTMxNzY3NTIzODQ2NzQ4MTg0Njc2Njk0MDUxMzIwMDA1NjgxMjcxNDUyNjM1NjA4Mjc3ODU3NzEzNDI3NTc3ODk2MDkxNzM2MzcxNzg3MjE0Njg0NDA5MDEyMjQ5NTM0MzAxNDY1NDk1ODUzNzEwNTA3OTIyNzk2ODkyNTg5MjM1NDIwMTk5NTYxMTIxMjkwMjE5NjA4NjQwMzQ0MTgxNTk4MTM2Mjk3NzQ3NzEzMDk5NjA1MTg3MDcyMTEzNDk5OTk5OTgzNzI5NzgwNDk5NTEwNTk3MzE3MzI4MTYwOTYzMTg1OTUwMjQ0NTk0NTUzNDY5MDgzMDI2NDI1MjIzMDgyNTMzNDQ2ODUwMzUyNjE5MzExODgxNzEwMTAwMDMxMzc4Mzg3NTI4ODY1ODc1MzMyMDgzODE0MjA2MTcxNzc2NjkxNDczMDM1OTgyNTM0OTA0Mjg3NTU0Njg3MzExNTk1NjI4NjM4ODIzNTM3ODc1OTM3NTE5NTc3ODE4NTc3ODA1MzIxNzEyMjY4MDY2MTMwMDE5Mjc4NzY2MTExOTU5MDkyMTY0MjAxOTg5MzgwOTUyNTcyMDEwNjU0ODU4NjMyNzg5JyxcclxuXHJcblxyXG4gICAgLy8gVGhlIGluaXRpYWwgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIG9mIHRoZSBEZWNpbWFsIGNvbnN0cnVjdG9yLlxyXG4gICAgREVGQVVMVFMgPSB7XHJcblxyXG4gICAgICAvLyBUaGVzZSB2YWx1ZXMgbXVzdCBiZSBpbnRlZ2VycyB3aXRoaW4gdGhlIHN0YXRlZCByYW5nZXMgKGluY2x1c2l2ZSkuXHJcbiAgICAgIC8vIE1vc3Qgb2YgdGhlc2UgdmFsdWVzIGNhbiBiZSBjaGFuZ2VkIGF0IHJ1bi10aW1lIHVzaW5nIHRoZSBgRGVjaW1hbC5jb25maWdgIG1ldGhvZC5cclxuXHJcbiAgICAgIC8vIFRoZSBtYXhpbXVtIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHMgb2YgdGhlIHJlc3VsdCBvZiBhIGNhbGN1bGF0aW9uIG9yIGJhc2UgY29udmVyc2lvbi5cclxuICAgICAgLy8gRS5nLiBgRGVjaW1hbC5jb25maWcoeyBwcmVjaXNpb246IDIwIH0pO2BcclxuICAgICAgcHJlY2lzaW9uOiAyMCwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMSB0byBNQVhfRElHSVRTXHJcblxyXG4gICAgICAvLyBUaGUgcm91bmRpbmcgbW9kZSB1c2VkIHdoZW4gcm91bmRpbmcgdG8gYHByZWNpc2lvbmAuXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFJPVU5EX1VQICAgICAgICAgMCBBd2F5IGZyb20gemVyby5cclxuICAgICAgLy8gUk9VTkRfRE9XTiAgICAgICAxIFRvd2FyZHMgemVyby5cclxuICAgICAgLy8gUk9VTkRfQ0VJTCAgICAgICAyIFRvd2FyZHMgK0luZmluaXR5LlxyXG4gICAgICAvLyBST1VORF9GTE9PUiAgICAgIDMgVG93YXJkcyAtSW5maW5pdHkuXHJcbiAgICAgIC8vIFJPVU5EX0hBTEZfVVAgICAgNCBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdXAuXHJcbiAgICAgIC8vIFJPVU5EX0hBTEZfRE9XTiAgNSBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgZG93bi5cclxuICAgICAgLy8gUk9VTkRfSEFMRl9FVkVOICA2IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB0b3dhcmRzIGV2ZW4gbmVpZ2hib3VyLlxyXG4gICAgICAvLyBST1VORF9IQUxGX0NFSUwgIDcgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgK0luZmluaXR5LlxyXG4gICAgICAvLyBST1VORF9IQUxGX0ZMT09SIDggVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgLUluZmluaXR5LlxyXG4gICAgICAvL1xyXG4gICAgICAvLyBFLmcuXHJcbiAgICAgIC8vIGBEZWNpbWFsLnJvdW5kaW5nID0gNDtgXHJcbiAgICAgIC8vIGBEZWNpbWFsLnJvdW5kaW5nID0gRGVjaW1hbC5ST1VORF9IQUxGX1VQO2BcclxuICAgICAgcm91bmRpbmc6IDQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byA4XHJcblxyXG4gICAgICAvLyBUaGUgbW9kdWxvIG1vZGUgdXNlZCB3aGVuIGNhbGN1bGF0aW5nIHRoZSBtb2R1bHVzOiBhIG1vZCBuLlxyXG4gICAgICAvLyBUaGUgcXVvdGllbnQgKHEgPSBhIC8gbikgaXMgY2FsY3VsYXRlZCBhY2NvcmRpbmcgdG8gdGhlIGNvcnJlc3BvbmRpbmcgcm91bmRpbmcgbW9kZS5cclxuICAgICAgLy8gVGhlIHJlbWFpbmRlciAocikgaXMgY2FsY3VsYXRlZCBhczogciA9IGEgLSBuICogcS5cclxuICAgICAgLy9cclxuICAgICAgLy8gVVAgICAgICAgICAwIFRoZSByZW1haW5kZXIgaXMgcG9zaXRpdmUgaWYgdGhlIGRpdmlkZW5kIGlzIG5lZ2F0aXZlLCBlbHNlIGlzIG5lZ2F0aXZlLlxyXG4gICAgICAvLyBET1dOICAgICAgIDEgVGhlIHJlbWFpbmRlciBoYXMgdGhlIHNhbWUgc2lnbiBhcyB0aGUgZGl2aWRlbmQgKEphdmFTY3JpcHQgJSkuXHJcbiAgICAgIC8vIEZMT09SICAgICAgMyBUaGUgcmVtYWluZGVyIGhhcyB0aGUgc2FtZSBzaWduIGFzIHRoZSBkaXZpc29yIChQeXRob24gJSkuXHJcbiAgICAgIC8vIEhBTEZfRVZFTiAgNiBUaGUgSUVFRSA3NTQgcmVtYWluZGVyIGZ1bmN0aW9uLlxyXG4gICAgICAvLyBFVUNMSUQgICAgIDkgRXVjbGlkaWFuIGRpdmlzaW9uLiBxID0gc2lnbihuKSAqIGZsb29yKGEgLyBhYnMobikpLiBBbHdheXMgcG9zaXRpdmUuXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFRydW5jYXRlZCBkaXZpc2lvbiAoMSksIGZsb29yZWQgZGl2aXNpb24gKDMpLCB0aGUgSUVFRSA3NTQgcmVtYWluZGVyICg2KSwgYW5kIEV1Y2xpZGlhblxyXG4gICAgICAvLyBkaXZpc2lvbiAoOSkgYXJlIGNvbW1vbmx5IHVzZWQgZm9yIHRoZSBtb2R1bHVzIG9wZXJhdGlvbi4gVGhlIG90aGVyIHJvdW5kaW5nIG1vZGVzIGNhbiBhbHNvXHJcbiAgICAgIC8vIGJlIHVzZWQsIGJ1dCB0aGV5IG1heSBub3QgZ2l2ZSB1c2VmdWwgcmVzdWx0cy5cclxuICAgICAgbW9kdWxvOiAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byA5XHJcblxyXG4gICAgICAvLyBUaGUgZXhwb25lbnQgdmFsdWUgYXQgYW5kIGJlbmVhdGggd2hpY2ggYHRvU3RyaW5nYCByZXR1cm5zIGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAgICAvLyBKYXZhU2NyaXB0IG51bWJlcnM6IC03XHJcbiAgICAgIHRvRXhwTmVnOiAtNywgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gLUVYUF9MSU1JVFxyXG5cclxuICAgICAgLy8gVGhlIGV4cG9uZW50IHZhbHVlIGF0IGFuZCBhYm92ZSB3aGljaCBgdG9TdHJpbmdgIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAgIC8vIEphdmFTY3JpcHQgbnVtYmVyczogMjFcclxuICAgICAgdG9FeHBQb3M6ICAyMSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byBFWFBfTElNSVRcclxuXHJcbiAgICAgIC8vIFRoZSBtaW5pbXVtIGV4cG9uZW50IHZhbHVlLCBiZW5lYXRoIHdoaWNoIHVuZGVyZmxvdyB0byB6ZXJvIG9jY3Vycy5cclxuICAgICAgLy8gSmF2YVNjcmlwdCBudW1iZXJzOiAtMzI0ICAoNWUtMzI0KVxyXG4gICAgICBtaW5FOiAtRVhQX0xJTUlULCAgICAgICAgICAgICAgICAgICAgICAvLyAtMSB0byAtRVhQX0xJTUlUXHJcblxyXG4gICAgICAvLyBUaGUgbWF4aW11bSBleHBvbmVudCB2YWx1ZSwgYWJvdmUgd2hpY2ggb3ZlcmZsb3cgdG8gSW5maW5pdHkgb2NjdXJzLlxyXG4gICAgICAvLyBKYXZhU2NyaXB0IG51bWJlcnM6IDMwOCAgKDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4KVxyXG4gICAgICBtYXhFOiBFWFBfTElNSVQsICAgICAgICAgICAgICAgICAgICAgICAvLyAxIHRvIEVYUF9MSU1JVFxyXG5cclxuICAgICAgLy8gV2hldGhlciB0byB1c2UgY3J5cHRvZ3JhcGhpY2FsbHktc2VjdXJlIHJhbmRvbSBudW1iZXIgZ2VuZXJhdGlvbiwgaWYgYXZhaWxhYmxlLlxyXG4gICAgICBjcnlwdG86IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0cnVlL2ZhbHNlXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRU5EIE9GIEVESVRBQkxFIERFRkFVTFRTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcblxyXG4gICAgRGVjaW1hbCwgaW5leGFjdCwgbm9Db25mbGljdCwgcXVhZHJhbnQsXHJcbiAgICBleHRlcm5hbCA9IHRydWUsXHJcblxyXG4gICAgZGVjaW1hbEVycm9yID0gJ1tEZWNpbWFsRXJyb3JdICcsXHJcbiAgICBpbnZhbGlkQXJndW1lbnQgPSBkZWNpbWFsRXJyb3IgKyAnSW52YWxpZCBhcmd1bWVudDogJyxcclxuICAgIHByZWNpc2lvbkxpbWl0RXhjZWVkZWQgPSBkZWNpbWFsRXJyb3IgKyAnUHJlY2lzaW9uIGxpbWl0IGV4Y2VlZGVkJyxcclxuICAgIGNyeXB0b1VuYXZhaWxhYmxlID0gZGVjaW1hbEVycm9yICsgJ2NyeXB0byB1bmF2YWlsYWJsZScsXHJcblxyXG4gICAgbWF0aGZsb29yID0gTWF0aC5mbG9vcixcclxuICAgIG1hdGhwb3cgPSBNYXRoLnBvdyxcclxuXHJcbiAgICBpc0JpbmFyeSA9IC9eMGIoWzAxXSsoXFwuWzAxXSopP3xcXC5bMDFdKykocFsrLV0/XFxkKyk/JC9pLFxyXG4gICAgaXNIZXggPSAvXjB4KFswLTlhLWZdKyhcXC5bMC05YS1mXSopP3xcXC5bMC05YS1mXSspKHBbKy1dP1xcZCspPyQvaSxcclxuICAgIGlzT2N0YWwgPSAvXjBvKFswLTddKyhcXC5bMC03XSopP3xcXC5bMC03XSspKHBbKy1dP1xcZCspPyQvaSxcclxuICAgIGlzRGVjaW1hbCA9IC9eKFxcZCsoXFwuXFxkKik/fFxcLlxcZCspKGVbKy1dP1xcZCspPyQvaSxcclxuXHJcbiAgICBCQVNFID0gMWU3LFxyXG4gICAgTE9HX0JBU0UgPSA3LFxyXG4gICAgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTEsXHJcblxyXG4gICAgTE4xMF9QUkVDSVNJT04gPSBMTjEwLmxlbmd0aCAtIDEsXHJcbiAgICBQSV9QUkVDSVNJT04gPSBQSS5sZW5ndGggLSAxLFxyXG5cclxuICAgIC8vIERlY2ltYWwucHJvdG90eXBlIG9iamVjdFxyXG4gICAgUCA9IHsgbmFtZTogJ1tvYmplY3QgRGVjaW1hbF0nIH07XHJcblxyXG5cclxuICAvLyBEZWNpbWFsIHByb3RvdHlwZSBtZXRob2RzXHJcblxyXG5cclxuICAvKlxyXG4gICAqICBhYnNvbHV0ZVZhbHVlICAgICAgICAgICAgIGFic1xyXG4gICAqICBjZWlsXHJcbiAgICogIGNvbXBhcmVkVG8gICAgICAgICAgICAgICAgY21wXHJcbiAgICogIGNvc2luZSAgICAgICAgICAgICAgICAgICAgY29zXHJcbiAgICogIGN1YmVSb290ICAgICAgICAgICAgICAgICAgY2JydFxyXG4gICAqICBkZWNpbWFsUGxhY2VzICAgICAgICAgICAgIGRwXHJcbiAgICogIGRpdmlkZWRCeSAgICAgICAgICAgICAgICAgZGl2XHJcbiAgICogIGRpdmlkZWRUb0ludGVnZXJCeSAgICAgICAgZGl2VG9JbnRcclxuICAgKiAgZXF1YWxzICAgICAgICAgICAgICAgICAgICBlcVxyXG4gICAqICBmbG9vclxyXG4gICAqICBncmVhdGVyVGhhbiAgICAgICAgICAgICAgIGd0XHJcbiAgICogIGdyZWF0ZXJUaGFuT3JFcXVhbFRvICAgICAgZ3RlXHJcbiAgICogIGh5cGVyYm9saWNDb3NpbmUgICAgICAgICAgY29zaFxyXG4gICAqICBoeXBlcmJvbGljU2luZSAgICAgICAgICAgIHNpbmhcclxuICAgKiAgaHlwZXJib2xpY1RhbmdlbnQgICAgICAgICB0YW5oXHJcbiAgICogIGludmVyc2VDb3NpbmUgICAgICAgICAgICAgYWNvc1xyXG4gICAqICBpbnZlcnNlSHlwZXJib2xpY0Nvc2luZSAgIGFjb3NoXHJcbiAgICogIGludmVyc2VIeXBlcmJvbGljU2luZSAgICAgYXNpbmhcclxuICAgKiAgaW52ZXJzZUh5cGVyYm9saWNUYW5nZW50ICBhdGFuaFxyXG4gICAqICBpbnZlcnNlU2luZSAgICAgICAgICAgICAgIGFzaW5cclxuICAgKiAgaW52ZXJzZVRhbmdlbnQgICAgICAgICAgICBhdGFuXHJcbiAgICogIGlzRmluaXRlXHJcbiAgICogIGlzSW50ZWdlciAgICAgICAgICAgICAgICAgaXNJbnRcclxuICAgKiAgaXNOYU5cclxuICAgKiAgaXNOZWdhdGl2ZSAgICAgICAgICAgICAgICBpc05lZ1xyXG4gICAqICBpc1Bvc2l0aXZlICAgICAgICAgICAgICAgIGlzUG9zXHJcbiAgICogIGlzWmVyb1xyXG4gICAqICBsZXNzVGhhbiAgICAgICAgICAgICAgICAgIGx0XHJcbiAgICogIGxlc3NUaGFuT3JFcXVhbFRvICAgICAgICAgbHRlXHJcbiAgICogIGxvZ2FyaXRobSAgICAgICAgICAgICAgICAgbG9nXHJcbiAgICogIFttYXhpbXVtXSAgICAgICAgICAgICAgICAgW21heF1cclxuICAgKiAgW21pbmltdW1dICAgICAgICAgICAgICAgICBbbWluXVxyXG4gICAqICBtaW51cyAgICAgICAgICAgICAgICAgICAgIHN1YlxyXG4gICAqICBtb2R1bG8gICAgICAgICAgICAgICAgICAgIG1vZFxyXG4gICAqICBuYXR1cmFsRXhwb25lbnRpYWwgICAgICAgIGV4cFxyXG4gICAqICBuYXR1cmFsTG9nYXJpdGhtICAgICAgICAgIGxuXHJcbiAgICogIG5lZ2F0ZWQgICAgICAgICAgICAgICAgICAgbmVnXHJcbiAgICogIHBsdXMgICAgICAgICAgICAgICAgICAgICAgYWRkXHJcbiAgICogIHByZWNpc2lvbiAgICAgICAgICAgICAgICAgc2RcclxuICAgKiAgcm91bmRcclxuICAgKiAgc2luZSAgICAgICAgICAgICAgICAgICAgICBzaW5cclxuICAgKiAgc3F1YXJlUm9vdCAgICAgICAgICAgICAgICBzcXJ0XHJcbiAgICogIHRhbmdlbnQgICAgICAgICAgICAgICAgICAgdGFuXHJcbiAgICogIHRpbWVzICAgICAgICAgICAgICAgICAgICAgbXVsXHJcbiAgICogIHRvQmluYXJ5XHJcbiAgICogIHRvRGVjaW1hbFBsYWNlcyAgICAgICAgICAgdG9EUFxyXG4gICAqICB0b0V4cG9uZW50aWFsXHJcbiAgICogIHRvRml4ZWRcclxuICAgKiAgdG9GcmFjdGlvblxyXG4gICAqICB0b0hleGFkZWNpbWFsICAgICAgICAgICAgIHRvSGV4XHJcbiAgICogIHRvTmVhcmVzdFxyXG4gICAqICB0b051bWJlclxyXG4gICAqICB0b09jdGFsXHJcbiAgICogIHRvUG93ZXIgICAgICAgICAgICAgICAgICAgcG93XHJcbiAgICogIHRvUHJlY2lzaW9uXHJcbiAgICogIHRvU2lnbmlmaWNhbnREaWdpdHMgICAgICAgdG9TRFxyXG4gICAqICB0b1N0cmluZ1xyXG4gICAqICB0cnVuY2F0ZWQgICAgICAgICAgICAgICAgIHRydW5jXHJcbiAgICogIHZhbHVlT2YgICAgICAgICAgICAgICAgICAgdG9KU09OXHJcbiAgICovXHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmFic29sdXRlVmFsdWUgPSBQLmFicyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB4ID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyk7XHJcbiAgICBpZiAoeC5zIDwgMCkgeC5zID0gMTtcclxuICAgIHJldHVybiBmaW5hbGlzZSh4KTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYSB3aG9sZSBudW1iZXIgaW4gdGhlXHJcbiAgICogZGlyZWN0aW9uIG9mIHBvc2l0aXZlIEluZmluaXR5LlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5jZWlsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGZpbmFsaXNlKG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCB0aGlzLmUgKyAxLCAyKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm5cclxuICAgKiAgIDEgICAgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBncmVhdGVyIHRoYW4gdGhlIHZhbHVlIG9mIGB5YCxcclxuICAgKiAgLTEgICAgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBsZXNzIHRoYW4gdGhlIHZhbHVlIG9mIGB5YCxcclxuICAgKiAgIDAgICAgaWYgdGhleSBoYXZlIHRoZSBzYW1lIHZhbHVlLFxyXG4gICAqICAgTmFOICBpZiB0aGUgdmFsdWUgb2YgZWl0aGVyIERlY2ltYWwgaXMgTmFOLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5jb21wYXJlZFRvID0gUC5jbXAgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgdmFyIGksIGosIHhkTCwgeWRMLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgeGQgPSB4LmQsXHJcbiAgICAgIHlkID0gKHkgPSBuZXcgeC5jb25zdHJ1Y3Rvcih5KSkuZCxcclxuICAgICAgeHMgPSB4LnMsXHJcbiAgICAgIHlzID0geS5zO1xyXG5cclxuICAgIC8vIEVpdGhlciBOYU4gb3IgwrFJbmZpbml0eT9cclxuICAgIGlmICgheGQgfHwgIXlkKSB7XHJcbiAgICAgIHJldHVybiAheHMgfHwgIXlzID8gTmFOIDogeHMgIT09IHlzID8geHMgOiB4ZCA9PT0geWQgPyAwIDogIXhkIF4geHMgPCAwID8gMSA6IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEVpdGhlciB6ZXJvP1xyXG4gICAgaWYgKCF4ZFswXSB8fCAheWRbMF0pIHJldHVybiB4ZFswXSA/IHhzIDogeWRbMF0gPyAteXMgOiAwO1xyXG5cclxuICAgIC8vIFNpZ25zIGRpZmZlcj9cclxuICAgIGlmICh4cyAhPT0geXMpIHJldHVybiB4cztcclxuXHJcbiAgICAvLyBDb21wYXJlIGV4cG9uZW50cy5cclxuICAgIGlmICh4LmUgIT09IHkuZSkgcmV0dXJuIHguZSA+IHkuZSBeIHhzIDwgMCA/IDEgOiAtMTtcclxuXHJcbiAgICB4ZEwgPSB4ZC5sZW5ndGg7XHJcbiAgICB5ZEwgPSB5ZC5sZW5ndGg7XHJcblxyXG4gICAgLy8gQ29tcGFyZSBkaWdpdCBieSBkaWdpdC5cclxuICAgIGZvciAoaSA9IDAsIGogPSB4ZEwgPCB5ZEwgPyB4ZEwgOiB5ZEw7IGkgPCBqOyArK2kpIHtcclxuICAgICAgaWYgKHhkW2ldICE9PSB5ZFtpXSkgcmV0dXJuIHhkW2ldID4geWRbaV0gXiB4cyA8IDAgPyAxIDogLTE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29tcGFyZSBsZW5ndGhzLlxyXG4gICAgcmV0dXJuIHhkTCA9PT0geWRMID8gMCA6IHhkTCA+IHlkTCBeIHhzIDwgMCA/IDEgOiAtMTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgY29zaW5lIG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICogUmFuZ2U6IFstMSwgMV1cclxuICAgKlxyXG4gICAqIGNvcygwKSAgICAgICAgID0gMVxyXG4gICAqIGNvcygtMCkgICAgICAgID0gMVxyXG4gICAqIGNvcyhJbmZpbml0eSkgID0gTmFOXHJcbiAgICogY29zKC1JbmZpbml0eSkgPSBOYU5cclxuICAgKiBjb3MoTmFOKSAgICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5jb3NpbmUgPSBQLmNvcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwciwgcm0sXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoIXguZCkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gICAgLy8gY29zKDApID0gY29zKC0wKSA9IDFcclxuICAgIGlmICgheC5kWzBdKSByZXR1cm4gbmV3IEN0b3IoMSk7XHJcblxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heCh4LmUsIHguc2QoKSkgKyBMT0dfQkFTRTtcclxuICAgIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICAgIHggPSBjb3NpbmUoQ3RvciwgdG9MZXNzVGhhbkhhbGZQaShDdG9yLCB4KSk7XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UocXVhZHJhbnQgPT0gMiB8fCBxdWFkcmFudCA9PSAzID8geC5uZWcoKSA6IHgsIHByLCBybSwgdHJ1ZSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICpcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgY3ViZSByb290IG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwsIHJvdW5kZWQgdG9cclxuICAgKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogIGNicnQoMCkgID0gIDBcclxuICAgKiAgY2JydCgtMCkgPSAtMFxyXG4gICAqICBjYnJ0KDEpICA9ICAxXHJcbiAgICogIGNicnQoLTEpID0gLTFcclxuICAgKiAgY2JydChOKSAgPSAgTlxyXG4gICAqICBjYnJ0KC1JKSA9IC1JXHJcbiAgICogIGNicnQoSSkgID0gIElcclxuICAgKlxyXG4gICAqIE1hdGguY2JydCh4KSA9ICh4IDwgMCA/IC1NYXRoLnBvdygteCwgMS8zKSA6IE1hdGgucG93KHgsIDEvMykpXHJcbiAgICpcclxuICAgKi9cclxuICBQLmN1YmVSb290ID0gUC5jYnJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGUsIG0sIG4sIHIsIHJlcCwgcywgc2QsIHQsIHQzLCB0M3BsdXN4LFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKCF4LmlzRmluaXRlKCkgfHwgeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBJbml0aWFsIGVzdGltYXRlLlxyXG4gICAgcyA9IHgucyAqIE1hdGgucG93KHgucyAqIHgsIDEgLyAzKTtcclxuXHJcbiAgICAgLy8gTWF0aC5jYnJ0IHVuZGVyZmxvdy9vdmVyZmxvdz9cclxuICAgICAvLyBQYXNzIHggdG8gTWF0aC5wb3cgYXMgaW50ZWdlciwgdGhlbiBhZGp1c3QgdGhlIGV4cG9uZW50IG9mIHRoZSByZXN1bHQuXHJcbiAgICBpZiAoIXMgfHwgTWF0aC5hYnMocykgPT0gMSAvIDApIHtcclxuICAgICAgbiA9IGRpZ2l0c1RvU3RyaW5nKHguZCk7XHJcbiAgICAgIGUgPSB4LmU7XHJcblxyXG4gICAgICAvLyBBZGp1c3QgbiBleHBvbmVudCBzbyBpdCBpcyBhIG11bHRpcGxlIG9mIDMgYXdheSBmcm9tIHggZXhwb25lbnQuXHJcbiAgICAgIGlmIChzID0gKGUgLSBuLmxlbmd0aCArIDEpICUgMykgbiArPSAocyA9PSAxIHx8IHMgPT0gLTIgPyAnMCcgOiAnMDAnKTtcclxuICAgICAgcyA9IE1hdGgucG93KG4sIDEgLyAzKTtcclxuXHJcbiAgICAgIC8vIFJhcmVseSwgZSBtYXkgYmUgb25lIGxlc3MgdGhhbiB0aGUgcmVzdWx0IGV4cG9uZW50IHZhbHVlLlxyXG4gICAgICBlID0gbWF0aGZsb29yKChlICsgMSkgLyAzKSAtIChlICUgMyA9PSAoZSA8IDAgPyAtMSA6IDIpKTtcclxuXHJcbiAgICAgIGlmIChzID09IDEgLyAwKSB7XHJcbiAgICAgICAgbiA9ICc1ZScgKyBlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG4gPSBzLnRvRXhwb25lbnRpYWwoKTtcclxuICAgICAgICBuID0gbi5zbGljZSgwLCBuLmluZGV4T2YoJ2UnKSArIDEpICsgZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgciA9IG5ldyBDdG9yKG4pO1xyXG4gICAgICByLnMgPSB4LnM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByID0gbmV3IEN0b3Iocy50b1N0cmluZygpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZCA9IChlID0gQ3Rvci5wcmVjaXNpb24pICsgMztcclxuXHJcbiAgICAvLyBIYWxsZXkncyBtZXRob2QuXHJcbiAgICAvLyBUT0RPPyBDb21wYXJlIE5ld3RvbidzIG1ldGhvZC5cclxuICAgIGZvciAoOzspIHtcclxuICAgICAgdCA9IHI7XHJcbiAgICAgIHQzID0gdC50aW1lcyh0KS50aW1lcyh0KTtcclxuICAgICAgdDNwbHVzeCA9IHQzLnBsdXMoeCk7XHJcbiAgICAgIHIgPSBkaXZpZGUodDNwbHVzeC5wbHVzKHgpLnRpbWVzKHQpLCB0M3BsdXN4LnBsdXModDMpLCBzZCArIDIsIDEpO1xyXG5cclxuICAgICAgLy8gVE9ETz8gUmVwbGFjZSB3aXRoIGZvci1sb29wIGFuZCBjaGVja1JvdW5kaW5nRGlnaXRzLlxyXG4gICAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCBzZCkgPT09IChuID0gZGlnaXRzVG9TdHJpbmcoci5kKSkuc2xpY2UoMCwgc2QpKSB7XHJcbiAgICAgICAgbiA9IG4uc2xpY2Uoc2QgLSAzLCBzZCArIDEpO1xyXG5cclxuICAgICAgICAvLyBUaGUgNHRoIHJvdW5kaW5nIGRpZ2l0IG1heSBiZSBpbiBlcnJvciBieSAtMSBzbyBpZiB0aGUgNCByb3VuZGluZyBkaWdpdHMgYXJlIDk5OTkgb3IgNDk5OVxyXG4gICAgICAgIC8vICwgaS5lLiBhcHByb2FjaGluZyBhIHJvdW5kaW5nIGJvdW5kYXJ5LCBjb250aW51ZSB0aGUgaXRlcmF0aW9uLlxyXG4gICAgICAgIGlmIChuID09ICc5OTk5JyB8fCAhcmVwICYmIG4gPT0gJzQ5OTknKSB7XHJcblxyXG4gICAgICAgICAgLy8gT24gdGhlIGZpcnN0IGl0ZXJhdGlvbiBvbmx5LCBjaGVjayB0byBzZWUgaWYgcm91bmRpbmcgdXAgZ2l2ZXMgdGhlIGV4YWN0IHJlc3VsdCBhcyB0aGVcclxuICAgICAgICAgIC8vIG5pbmVzIG1heSBpbmZpbml0ZWx5IHJlcGVhdC5cclxuICAgICAgICAgIGlmICghcmVwKSB7XHJcbiAgICAgICAgICAgIGZpbmFsaXNlKHQsIGUgKyAxLCAwKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0LnRpbWVzKHQpLnRpbWVzKHQpLmVxKHgpKSB7XHJcbiAgICAgICAgICAgICAgciA9IHQ7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzZCArPSA0O1xyXG4gICAgICAgICAgcmVwID0gMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdHMgYXJlIG51bGwsIDB7MCw0fSBvciA1MHswLDN9LCBjaGVjayBmb3IgYW4gZXhhY3QgcmVzdWx0LlxyXG4gICAgICAgICAgLy8gSWYgbm90LCB0aGVuIHRoZXJlIGFyZSBmdXJ0aGVyIGRpZ2l0cyBhbmQgbSB3aWxsIGJlIHRydXRoeS5cclxuICAgICAgICAgIGlmICghK24gfHwgIStuLnNsaWNlKDEpICYmIG4uY2hhckF0KDApID09ICc1Jykge1xyXG5cclxuICAgICAgICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgICAgICBmaW5hbGlzZShyLCBlICsgMSwgMSk7XHJcbiAgICAgICAgICAgIG0gPSAhci50aW1lcyhyKS50aW1lcyhyKS5lcSh4KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHIsIGUsIEN0b3Iucm91bmRpbmcsIG0pO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0aGUgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmRlY2ltYWxQbGFjZXMgPSBQLmRwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHcsXHJcbiAgICAgIGQgPSB0aGlzLmQsXHJcbiAgICAgIG4gPSBOYU47XHJcblxyXG4gICAgaWYgKGQpIHtcclxuICAgICAgdyA9IGQubGVuZ3RoIC0gMTtcclxuICAgICAgbiA9ICh3IC0gbWF0aGZsb29yKHRoaXMuZSAvIExPR19CQVNFKSkgKiBMT0dfQkFTRTtcclxuXHJcbiAgICAgIC8vIFN1YnRyYWN0IHRoZSBudW1iZXIgb2YgdHJhaWxpbmcgemVyb3Mgb2YgdGhlIGxhc3Qgd29yZC5cclxuICAgICAgdyA9IGRbd107XHJcbiAgICAgIGlmICh3KSBmb3IgKDsgdyAlIDEwID09IDA7IHcgLz0gMTApIG4tLTtcclxuICAgICAgaWYgKG4gPCAwKSBuID0gMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbjtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiAgbiAvIDAgPSBJXHJcbiAgICogIG4gLyBOID0gTlxyXG4gICAqICBuIC8gSSA9IDBcclxuICAgKiAgMCAvIG4gPSAwXHJcbiAgICogIDAgLyAwID0gTlxyXG4gICAqICAwIC8gTiA9IE5cclxuICAgKiAgMCAvIEkgPSAwXHJcbiAgICogIE4gLyBuID0gTlxyXG4gICAqICBOIC8gMCA9IE5cclxuICAgKiAgTiAvIE4gPSBOXHJcbiAgICogIE4gLyBJID0gTlxyXG4gICAqICBJIC8gbiA9IElcclxuICAgKiAgSSAvIDAgPSBJXHJcbiAgICogIEkgLyBOID0gTlxyXG4gICAqICBJIC8gSSA9IE5cclxuICAgKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgZGl2aWRlZCBieSBgeWAsIHJvdW5kZWQgdG9cclxuICAgKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5kaXZpZGVkQnkgPSBQLmRpdiA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICByZXR1cm4gZGl2aWRlKHRoaXMsIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHkpKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW50ZWdlciBwYXJ0IG9mIGRpdmlkaW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWxcclxuICAgKiBieSB0aGUgdmFsdWUgb2YgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmRpdmlkZWRUb0ludGVnZXJCeSA9IFAuZGl2VG9JbnQgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgdmFyIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuICAgIHJldHVybiBmaW5hbGlzZShkaXZpZGUoeCwgbmV3IEN0b3IoeSksIDAsIDEsIDEpLCBDdG9yLnByZWNpc2lvbiwgQ3Rvci5yb3VuZGluZyk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBlcXVhbCB0byB0aGUgdmFsdWUgb2YgYHlgLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5lcXVhbHMgPSBQLmVxID0gZnVuY3Rpb24gKHkpIHtcclxuICAgIHJldHVybiB0aGlzLmNtcCh5KSA9PT0gMDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYSB3aG9sZSBudW1iZXIgaW4gdGhlXHJcbiAgICogZGlyZWN0aW9uIG9mIG5lZ2F0aXZlIEluZmluaXR5LlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5mbG9vciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBmaW5hbGlzZShuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKSwgdGhpcy5lICsgMSwgMyk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBncmVhdGVyIHRoYW4gdGhlIHZhbHVlIG9mIGB5YCwgb3RoZXJ3aXNlIHJldHVyblxyXG4gICAqIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5ncmVhdGVyVGhhbiA9IFAuZ3QgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuY21wKHkpID4gMDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWUgb2YgYHlgLFxyXG4gICAqIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmdyZWF0ZXJUaGFuT3JFcXVhbFRvID0gUC5ndGUgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgdmFyIGsgPSB0aGlzLmNtcCh5KTtcclxuICAgIHJldHVybiBrID09IDEgfHwgayA9PT0gMDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBjb3NpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gICAqIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqIFJhbmdlOiBbMSwgSW5maW5pdHldXHJcbiAgICpcclxuICAgKiBjb3NoKHgpID0gMSArIHheMi8yISArIHheNC80ISArIHheNi82ISArIC4uLlxyXG4gICAqXHJcbiAgICogY29zaCgwKSAgICAgICAgID0gMVxyXG4gICAqIGNvc2goLTApICAgICAgICA9IDFcclxuICAgKiBjb3NoKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gICAqIGNvc2goLUluZmluaXR5KSA9IEluZmluaXR5XHJcbiAgICogY29zaChOYU4pICAgICAgID0gTmFOXHJcbiAgICpcclxuICAgKiAgeCAgICAgICAgdGltZSB0YWtlbiAobXMpICAgcmVzdWx0XHJcbiAgICogMTAwMCAgICAgIDkgICAgICAgICAgICAgICAgIDkuODUwMzU1NTcwMDg1MjM0OTY5NGUrNDMzXHJcbiAgICogMTAwMDAgICAgIDI1ICAgICAgICAgICAgICAgIDQuNDAzNDA5MTEyODMxNDYwNzkzNmUrNDM0MlxyXG4gICAqIDEwMDAwMCAgICAxNzEgICAgICAgICAgICAgICAxLjQwMzMzMTY4MDIxMzA2MTU4OTdlKzQzNDI5XHJcbiAgICogMTAwMDAwMCAgIDM4MTcgICAgICAgICAgICAgIDEuNTE2NjA3Njk4NDAxMDQzNzcyNWUrNDM0Mjk0XHJcbiAgICogMTAwMDAwMDAgIGFiYW5kb25lZCBhZnRlciAyIG1pbnV0ZSB3YWl0XHJcbiAgICpcclxuICAgKiBUT0RPPyBDb21wYXJlIHBlcmZvcm1hbmNlIG9mIGNvc2goeCkgPSAwLjUgKiAoZXhwKHgpICsgZXhwKC14KSlcclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaHlwZXJib2xpY0Nvc2luZSA9IFAuY29zaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBrLCBuLCBwciwgcm0sIGxlbixcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICBvbmUgPSBuZXcgQ3RvcigxKTtcclxuXHJcbiAgICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKHgucyA/IDEgLyAwIDogTmFOKTtcclxuICAgIGlmICh4LmlzWmVybygpKSByZXR1cm4gb25lO1xyXG5cclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByICsgTWF0aC5tYXgoeC5lLCB4LnNkKCkpICsgNDtcclxuICAgIEN0b3Iucm91bmRpbmcgPSAxO1xyXG4gICAgbGVuID0geC5kLmxlbmd0aDtcclxuXHJcbiAgICAvLyBBcmd1bWVudCByZWR1Y3Rpb246IGNvcyg0eCkgPSAxIC0gOGNvc14yKHgpICsgOGNvc140KHgpICsgMVxyXG4gICAgLy8gaS5lLiBjb3MoeCkgPSAxIC0gY29zXjIoeC80KSg4IC0gOGNvc14yKHgvNCkpXHJcblxyXG4gICAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gICAgLy8gVE9ETz8gRXN0aW1hdGlvbiByZXVzZWQgZnJvbSBjb3NpbmUoKSBhbmQgbWF5IG5vdCBiZSBvcHRpbWFsIGhlcmUuXHJcbiAgICBpZiAobGVuIDwgMzIpIHtcclxuICAgICAgayA9IE1hdGguY2VpbChsZW4gLyAzKTtcclxuICAgICAgbiA9IE1hdGgucG93KDQsIC1rKS50b1N0cmluZygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgayA9IDE2O1xyXG4gICAgICBuID0gJzIuMzI4MzA2NDM2NTM4Njk2Mjg5MDYyNWUtMTAnO1xyXG4gICAgfVxyXG5cclxuICAgIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMSwgeC50aW1lcyhuKSwgbmV3IEN0b3IoMSksIHRydWUpO1xyXG5cclxuICAgIC8vIFJldmVyc2UgYXJndW1lbnQgcmVkdWN0aW9uXHJcbiAgICB2YXIgY29zaDJfeCxcclxuICAgICAgaSA9IGssXHJcbiAgICAgIGQ4ID0gbmV3IEN0b3IoOCk7XHJcbiAgICBmb3IgKDsgaS0tOykge1xyXG4gICAgICBjb3NoMl94ID0geC50aW1lcyh4KTtcclxuICAgICAgeCA9IG9uZS5taW51cyhjb3NoMl94LnRpbWVzKGQ4Lm1pbnVzKGNvc2gyX3gudGltZXMoZDgpKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmaW5hbGlzZSh4LCBDdG9yLnByZWNpc2lvbiA9IHByLCBDdG9yLnJvdW5kaW5nID0gcm0sIHRydWUpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIHNpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gICAqIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqIFJhbmdlOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKlxyXG4gICAqIHNpbmgoeCkgPSB4ICsgeF4zLzMhICsgeF41LzUhICsgeF43LzchICsgLi4uXHJcbiAgICpcclxuICAgKiBzaW5oKDApICAgICAgICAgPSAwXHJcbiAgICogc2luaCgtMCkgICAgICAgID0gLTBcclxuICAgKiBzaW5oKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gICAqIHNpbmgoLUluZmluaXR5KSA9IC1JbmZpbml0eVxyXG4gICAqIHNpbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICogeCAgICAgICAgdGltZSB0YWtlbiAobXMpXHJcbiAgICogMTAgICAgICAgMiBtc1xyXG4gICAqIDEwMCAgICAgIDUgbXNcclxuICAgKiAxMDAwICAgICAxNCBtc1xyXG4gICAqIDEwMDAwICAgIDgyIG1zXHJcbiAgICogMTAwMDAwICAgODg2IG1zICAgICAgICAgICAgMS40MDMzMzE2ODAyMTMwNjE1ODk3ZSs0MzQyOVxyXG4gICAqIDIwMDAwMCAgIDI2MTMgbXNcclxuICAgKiAzMDAwMDAgICA1NDA3IG1zXHJcbiAgICogNDAwMDAwICAgODgyNCBtc1xyXG4gICAqIDUwMDAwMCAgIDEzMDI2IG1zICAgICAgICAgIDguNzA4MDY0MzYxMjcxODA4NDEyOWUrMjE3MTQ2XHJcbiAgICogMTAwMDAwMCAgNDg1NDMgbXNcclxuICAgKlxyXG4gICAqIFRPRE8/IENvbXBhcmUgcGVyZm9ybWFuY2Ugb2Ygc2luaCh4KSA9IDAuNSAqIChleHAoeCkgLSBleHAoLXgpKVxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5oeXBlcmJvbGljU2luZSA9IFAuc2luaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBrLCBwciwgcm0sIGxlbixcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIDQ7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICAgIGxlbiA9IHguZC5sZW5ndGg7XHJcblxyXG4gICAgaWYgKGxlbiA8IDMpIHtcclxuICAgICAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAyLCB4LCB4LCB0cnVlKTtcclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAvLyBBbHRlcm5hdGl2ZSBhcmd1bWVudCByZWR1Y3Rpb246IHNpbmgoM3gpID0gc2luaCh4KSgzICsgNHNpbmheMih4KSlcclxuICAgICAgLy8gaS5lLiBzaW5oKHgpID0gc2luaCh4LzMpKDMgKyA0c2luaF4yKHgvMykpXHJcbiAgICAgIC8vIDMgbXVsdGlwbGljYXRpb25zIGFuZCAxIGFkZGl0aW9uXHJcblxyXG4gICAgICAvLyBBcmd1bWVudCByZWR1Y3Rpb246IHNpbmgoNXgpID0gc2luaCh4KSg1ICsgc2luaF4yKHgpKDIwICsgMTZzaW5oXjIoeCkpKVxyXG4gICAgICAvLyBpLmUuIHNpbmgoeCkgPSBzaW5oKHgvNSkoNSArIHNpbmheMih4LzUpKDIwICsgMTZzaW5oXjIoeC81KSkpXHJcbiAgICAgIC8vIDQgbXVsdGlwbGljYXRpb25zIGFuZCAyIGFkZGl0aW9uc1xyXG5cclxuICAgICAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gICAgICBrID0gMS40ICogTWF0aC5zcXJ0KGxlbik7XHJcbiAgICAgIGsgPSBrID4gMTYgPyAxNiA6IGsgfCAwO1xyXG5cclxuICAgICAgeCA9IHgudGltZXMoTWF0aC5wb3coNSwgLWspKTtcclxuXHJcbiAgICAgIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCwgdHJ1ZSk7XHJcblxyXG4gICAgICAvLyBSZXZlcnNlIGFyZ3VtZW50IHJlZHVjdGlvblxyXG4gICAgICB2YXIgc2luaDJfeCxcclxuICAgICAgICBkNSA9IG5ldyBDdG9yKDUpLFxyXG4gICAgICAgIGQxNiA9IG5ldyBDdG9yKDE2KSxcclxuICAgICAgICBkMjAgPSBuZXcgQ3RvcigyMCk7XHJcbiAgICAgIGZvciAoOyBrLS07KSB7XHJcbiAgICAgICAgc2luaDJfeCA9IHgudGltZXMoeCk7XHJcbiAgICAgICAgeCA9IHgudGltZXMoZDUucGx1cyhzaW5oMl94LnRpbWVzKGQxNi50aW1lcyhzaW5oMl94KS5wbHVzKGQyMCkpKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICAgIHJldHVybiBmaW5hbGlzZSh4LCBwciwgcm0sIHRydWUpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIHRhbmdlbnQgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gICAqIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqIFJhbmdlOiBbLTEsIDFdXHJcbiAgICpcclxuICAgKiB0YW5oKHgpID0gc2luaCh4KSAvIGNvc2goeClcclxuICAgKlxyXG4gICAqIHRhbmgoMCkgICAgICAgICA9IDBcclxuICAgKiB0YW5oKC0wKSAgICAgICAgPSAtMFxyXG4gICAqIHRhbmgoSW5maW5pdHkpICA9IDFcclxuICAgKiB0YW5oKC1JbmZpbml0eSkgPSAtMVxyXG4gICAqIHRhbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5oeXBlcmJvbGljVGFuZ2VudCA9IFAudGFuaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwciwgcm0sXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKHgucyk7XHJcbiAgICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByICsgNztcclxuICAgIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICAgIHJldHVybiBkaXZpZGUoeC5zaW5oKCksIHguY29zaCgpLCBDdG9yLnByZWNpc2lvbiA9IHByLCBDdG9yLnJvdW5kaW5nID0gcm0pO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmNjb3NpbmUgKGludmVyc2UgY29zaW5lKSBpbiByYWRpYW5zIG9mIHRoZSB2YWx1ZSBvZlxyXG4gICAqIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWy0xLCAxXVxyXG4gICAqIFJhbmdlOiBbMCwgcGldXHJcbiAgICpcclxuICAgKiBhY29zKHgpID0gcGkvMiAtIGFzaW4oeClcclxuICAgKlxyXG4gICAqIGFjb3MoMCkgICAgICAgPSBwaS8yXHJcbiAgICogYWNvcygtMCkgICAgICA9IHBpLzJcclxuICAgKiBhY29zKDEpICAgICAgID0gMFxyXG4gICAqIGFjb3MoLTEpICAgICAgPSBwaVxyXG4gICAqIGFjb3MoMS8yKSAgICAgPSBwaS8zXHJcbiAgICogYWNvcygtMS8yKSAgICA9IDIqcGkvM1xyXG4gICAqIGFjb3MofHh8ID4gMSkgPSBOYU5cclxuICAgKiBhY29zKE5hTikgICAgID0gTmFOXHJcbiAgICpcclxuICAgKi9cclxuICBQLmludmVyc2VDb3NpbmUgPSBQLmFjb3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaGFsZlBpLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIGsgPSB4LmFicygpLmNtcCgxKSxcclxuICAgICAgcHIgPSBDdG9yLnByZWNpc2lvbixcclxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG5cclxuICAgIGlmIChrICE9PSAtMSkge1xyXG4gICAgICByZXR1cm4gayA9PT0gMFxyXG4gICAgICAgIC8vIHx4fCBpcyAxXHJcbiAgICAgICAgPyB4LmlzTmVnKCkgPyBnZXRQaShDdG9yLCBwciwgcm0pIDogbmV3IEN0b3IoMClcclxuICAgICAgICAvLyB8eHwgPiAxIG9yIHggaXMgTmFOXHJcbiAgICAgICAgOiBuZXcgQ3RvcihOYU4pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh4LmlzWmVybygpKSByZXR1cm4gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcclxuXHJcbiAgICAvLyBUT0RPPyBTcGVjaWFsIGNhc2UgYWNvcygwLjUpID0gcGkvMyBhbmQgYWNvcygtMC41KSA9IDIqcGkvM1xyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHIgKyA2O1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gICAgeCA9IHguYXNpbigpO1xyXG4gICAgaGFsZlBpID0gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICAgIHJldHVybiBoYWxmUGkubWludXMoeCk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgY29zaW5lIGluIHJhZGlhbnMgb2YgdGhlXHJcbiAgICogdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbMSwgSW5maW5pdHldXHJcbiAgICogUmFuZ2U6IFswLCBJbmZpbml0eV1cclxuICAgKlxyXG4gICAqIGFjb3NoKHgpID0gbG4oeCArIHNxcnQoeF4yIC0gMSkpXHJcbiAgICpcclxuICAgKiBhY29zaCh4IDwgMSkgICAgID0gTmFOXHJcbiAgICogYWNvc2goTmFOKSAgICAgICA9IE5hTlxyXG4gICAqIGFjb3NoKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gICAqIGFjb3NoKC1JbmZpbml0eSkgPSBOYU5cclxuICAgKiBhY29zaCgwKSAgICAgICAgID0gTmFOXHJcbiAgICogYWNvc2goLTApICAgICAgICA9IE5hTlxyXG4gICAqIGFjb3NoKDEpICAgICAgICAgPSAwXHJcbiAgICogYWNvc2goLTEpICAgICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pbnZlcnNlSHlwZXJib2xpY0Nvc2luZSA9IFAuYWNvc2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHIsIHJtLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKHgubHRlKDEpKSByZXR1cm4gbmV3IEN0b3IoeC5lcSgxKSA/IDAgOiBOYU4pO1xyXG4gICAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KE1hdGguYWJzKHguZSksIHguc2QoKSkgKyA0O1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICAgIHggPSB4LnRpbWVzKHgpLm1pbnVzKDEpLnNxcnQoKS5wbHVzKHgpO1xyXG5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gICAgcmV0dXJuIHgubG4oKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyBzaW5lIGluIHJhZGlhbnMgb2YgdGhlIHZhbHVlXHJcbiAgICogb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICpcclxuICAgKiBhc2luaCh4KSA9IGxuKHggKyBzcXJ0KHheMiArIDEpKVxyXG4gICAqXHJcbiAgICogYXNpbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gICAqIGFzaW5oKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gICAqIGFzaW5oKC1JbmZpbml0eSkgPSAtSW5maW5pdHlcclxuICAgKiBhc2luaCgwKSAgICAgICAgID0gMFxyXG4gICAqIGFzaW5oKC0wKSAgICAgICAgPSAtMFxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pbnZlcnNlSHlwZXJib2xpY1NpbmUgPSBQLmFzaW5oID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByLCBybSxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDIgKiBNYXRoLm1heChNYXRoLmFicyh4LmUpLCB4LnNkKCkpICsgNjtcclxuICAgIEN0b3Iucm91bmRpbmcgPSAxO1xyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgICB4ID0geC50aW1lcyh4KS5wbHVzKDEpLnNxcnQoKS5wbHVzKHgpO1xyXG5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gICAgcmV0dXJuIHgubG4oKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyB0YW5nZW50IGluIHJhZGlhbnMgb2YgdGhlXHJcbiAgICogdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbLTEsIDFdXHJcbiAgICogUmFuZ2U6IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqXHJcbiAgICogYXRhbmgoeCkgPSAwLjUgKiBsbigoMSArIHgpIC8gKDEgLSB4KSlcclxuICAgKlxyXG4gICAqIGF0YW5oKHx4fCA+IDEpICAgPSBOYU5cclxuICAgKiBhdGFuaChOYU4pICAgICAgID0gTmFOXHJcbiAgICogYXRhbmgoSW5maW5pdHkpICA9IE5hTlxyXG4gICAqIGF0YW5oKC1JbmZpbml0eSkgPSBOYU5cclxuICAgKiBhdGFuaCgwKSAgICAgICAgID0gMFxyXG4gICAqIGF0YW5oKC0wKSAgICAgICAgPSAtMFxyXG4gICAqIGF0YW5oKDEpICAgICAgICAgPSBJbmZpbml0eVxyXG4gICAqIGF0YW5oKC0xKSAgICAgICAgPSAtSW5maW5pdHlcclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaW52ZXJzZUh5cGVyYm9saWNUYW5nZW50ID0gUC5hdGFuaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwciwgcm0sIHdwciwgeHNkLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG4gICAgaWYgKHguZSA+PSAwKSByZXR1cm4gbmV3IEN0b3IoeC5hYnMoKS5lcSgxKSA/IHgucyAvIDAgOiB4LmlzWmVybygpID8geCA6IE5hTik7XHJcblxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIHhzZCA9IHguc2QoKTtcclxuXHJcbiAgICBpZiAoTWF0aC5tYXgoeHNkLCBwcikgPCAyICogLXguZSAtIDEpIHJldHVybiBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgcHIsIHJtLCB0cnVlKTtcclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHdwciA9IHhzZCAtIHguZTtcclxuXHJcbiAgICB4ID0gZGl2aWRlKHgucGx1cygxKSwgbmV3IEN0b3IoMSkubWludXMoeCksIHdwciArIHByLCAxKTtcclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByICsgNDtcclxuICAgIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICAgIHggPSB4LmxuKCk7XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgICByZXR1cm4geC50aW1lcygwLjUpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmNzaW5lIChpbnZlcnNlIHNpbmUpIGluIHJhZGlhbnMgb2YgdGhlIHZhbHVlIG9mIHRoaXNcclxuICAgKiBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKiBSYW5nZTogWy1waS8yLCBwaS8yXVxyXG4gICAqXHJcbiAgICogYXNpbih4KSA9IDIqYXRhbih4LygxICsgc3FydCgxIC0geF4yKSkpXHJcbiAgICpcclxuICAgKiBhc2luKDApICAgICAgID0gMFxyXG4gICAqIGFzaW4oLTApICAgICAgPSAtMFxyXG4gICAqIGFzaW4oMS8yKSAgICAgPSBwaS82XHJcbiAgICogYXNpbigtMS8yKSAgICA9IC1waS82XHJcbiAgICogYXNpbigxKSAgICAgICA9IHBpLzJcclxuICAgKiBhc2luKC0xKSAgICAgID0gLXBpLzJcclxuICAgKiBhc2luKHx4fCA+IDEpID0gTmFOXHJcbiAgICogYXNpbihOYU4pICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICogVE9ETz8gQ29tcGFyZSBwZXJmb3JtYW5jZSBvZiBUYXlsb3Igc2VyaWVzLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pbnZlcnNlU2luZSA9IFAuYXNpbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBoYWxmUGksIGssXHJcbiAgICAgIHByLCBybSxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmICh4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgayA9IHguYWJzKCkuY21wKDEpO1xyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgICBpZiAoayAhPT0gLTEpIHtcclxuXHJcbiAgICAgIC8vIHx4fCBpcyAxXHJcbiAgICAgIGlmIChrID09PSAwKSB7XHJcbiAgICAgICAgaGFsZlBpID0gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcclxuICAgICAgICBoYWxmUGkucyA9IHgucztcclxuICAgICAgICByZXR1cm4gaGFsZlBpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyB8eHwgPiAxIG9yIHggaXMgTmFOXHJcbiAgICAgIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRPRE8/IFNwZWNpYWwgY2FzZSBhc2luKDEvMikgPSBwaS82IGFuZCBhc2luKC0xLzIpID0gLXBpLzZcclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByICsgNjtcclxuICAgIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICAgIHggPSB4LmRpdihuZXcgQ3RvcigxKS5taW51cyh4LnRpbWVzKHgpKS5zcXJ0KCkucGx1cygxKSkuYXRhbigpO1xyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gICAgcmV0dXJuIHgudGltZXMoMik7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY3RhbmdlbnQgKGludmVyc2UgdGFuZ2VudCkgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWVcclxuICAgKiBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqIFJhbmdlOiBbLXBpLzIsIHBpLzJdXHJcbiAgICpcclxuICAgKiBhdGFuKHgpID0geCAtIHheMy8zICsgeF41LzUgLSB4XjcvNyArIC4uLlxyXG4gICAqXHJcbiAgICogYXRhbigwKSAgICAgICAgID0gMFxyXG4gICAqIGF0YW4oLTApICAgICAgICA9IC0wXHJcbiAgICogYXRhbigxKSAgICAgICAgID0gcGkvNFxyXG4gICAqIGF0YW4oLTEpICAgICAgICA9IC1waS80XHJcbiAgICogYXRhbihJbmZpbml0eSkgID0gcGkvMlxyXG4gICAqIGF0YW4oLUluZmluaXR5KSA9IC1waS8yXHJcbiAgICogYXRhbihOYU4pICAgICAgID0gTmFOXHJcbiAgICpcclxuICAgKi9cclxuICBQLmludmVyc2VUYW5nZW50ID0gUC5hdGFuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGksIGosIGssIG4sIHB4LCB0LCByLCB3cHIsIHgyLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIHByID0gQ3Rvci5wcmVjaXNpb24sXHJcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgICBpZiAoIXguaXNGaW5pdGUoKSkge1xyXG4gICAgICBpZiAoIXgucykgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgICAgIGlmIChwciArIDQgPD0gUElfUFJFQ0lTSU9OKSB7XHJcbiAgICAgICAgciA9IGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuNSk7XHJcbiAgICAgICAgci5zID0geC5zO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHguaXNaZXJvKCkpIHtcclxuICAgICAgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG4gICAgfSBlbHNlIGlmICh4LmFicygpLmVxKDEpICYmIHByICsgNCA8PSBQSV9QUkVDSVNJT04pIHtcclxuICAgICAgciA9IGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuMjUpO1xyXG4gICAgICByLnMgPSB4LnM7XHJcbiAgICAgIHJldHVybiByO1xyXG4gICAgfVxyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gd3ByID0gcHIgKyAxMDtcclxuICAgIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICAgIC8vIFRPRE8/IGlmICh4ID49IDEgJiYgcHIgPD0gUElfUFJFQ0lTSU9OKSBhdGFuKHgpID0gaGFsZlBpICogeC5zIC0gYXRhbigxIC8geCk7XHJcblxyXG4gICAgLy8gQXJndW1lbnQgcmVkdWN0aW9uXHJcbiAgICAvLyBFbnN1cmUgfHh8IDwgMC40MlxyXG4gICAgLy8gYXRhbih4KSA9IDIgKiBhdGFuKHggLyAoMSArIHNxcnQoMSArIHheMikpKVxyXG5cclxuICAgIGsgPSBNYXRoLm1pbigyOCwgd3ByIC8gTE9HX0JBU0UgKyAyIHwgMCk7XHJcblxyXG4gICAgZm9yIChpID0gazsgaTsgLS1pKSB4ID0geC5kaXYoeC50aW1lcyh4KS5wbHVzKDEpLnNxcnQoKS5wbHVzKDEpKTtcclxuXHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICAgIGogPSBNYXRoLmNlaWwod3ByIC8gTE9HX0JBU0UpO1xyXG4gICAgbiA9IDE7XHJcbiAgICB4MiA9IHgudGltZXMoeCk7XHJcbiAgICByID0gbmV3IEN0b3IoeCk7XHJcbiAgICBweCA9IHg7XHJcblxyXG4gICAgLy8gYXRhbih4KSA9IHggLSB4XjMvMyArIHheNS81IC0geF43LzcgKyAuLi5cclxuICAgIGZvciAoOyBpICE9PSAtMTspIHtcclxuICAgICAgcHggPSBweC50aW1lcyh4Mik7XHJcbiAgICAgIHQgPSByLm1pbnVzKHB4LmRpdihuICs9IDIpKTtcclxuXHJcbiAgICAgIHB4ID0gcHgudGltZXMoeDIpO1xyXG4gICAgICByID0gdC5wbHVzKHB4LmRpdihuICs9IDIpKTtcclxuXHJcbiAgICAgIGlmIChyLmRbal0gIT09IHZvaWQgMCkgZm9yIChpID0gajsgci5kW2ldID09PSB0LmRbaV0gJiYgaS0tOyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGspIHIgPSByLnRpbWVzKDIgPDwgKGsgLSAxKSk7XHJcblxyXG4gICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiBmaW5hbGlzZShyLCBDdG9yLnByZWNpc2lvbiA9IHByLCBDdG9yLnJvdW5kaW5nID0gcm0sIHRydWUpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgYSBmaW5pdGUgbnVtYmVyLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pc0Zpbml0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAhIXRoaXMuZDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGFuIGludGVnZXIsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmlzSW50ZWdlciA9IFAuaXNJbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gISF0aGlzLmQgJiYgbWF0aGZsb29yKHRoaXMuZSAvIExPR19CQVNFKSA+IHRoaXMuZC5sZW5ndGggLSAyO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgTmFOLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pc05hTiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAhdGhpcy5zO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgbmVnYXRpdmUsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmlzTmVnYXRpdmUgPSBQLmlzTmVnID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucyA8IDA7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBwb3NpdGl2ZSwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaXNQb3NpdGl2ZSA9IFAuaXNQb3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zID4gMDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIDAgb3IgLTAsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmlzWmVybyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAhIXRoaXMuZCAmJiB0aGlzLmRbMF0gPT09IDA7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBsZXNzIHRoYW4gYHlgLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5sZXNzVGhhbiA9IFAubHQgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuY21wKHkpIDwgMDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgeWAsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmxlc3NUaGFuT3JFcXVhbFRvID0gUC5sdGUgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuY21wKHkpIDwgMTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdGhlIGxvZ2FyaXRobSBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHRvIHRoZSBzcGVjaWZpZWQgYmFzZSwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiBJZiBubyBiYXNlIGlzIHNwZWNpZmllZCwgcmV0dXJuIGxvZ1sxMF0oYXJnKS5cclxuICAgKlxyXG4gICAqIGxvZ1tiYXNlXShhcmcpID0gbG4oYXJnKSAvIGxuKGJhc2UpXHJcbiAgICpcclxuICAgKiBUaGUgcmVzdWx0IHdpbGwgYWx3YXlzIGJlIGNvcnJlY3RseSByb3VuZGVkIGlmIHRoZSBiYXNlIG9mIHRoZSBsb2cgaXMgMTAsIGFuZCAnYWxtb3N0IGFsd2F5cydcclxuICAgKiBvdGhlcndpc2U6XHJcbiAgICpcclxuICAgKiBEZXBlbmRpbmcgb24gdGhlIHJvdW5kaW5nIG1vZGUsIHRoZSByZXN1bHQgbWF5IGJlIGluY29ycmVjdGx5IHJvdW5kZWQgaWYgdGhlIGZpcnN0IGZpZnRlZW5cclxuICAgKiByb3VuZGluZyBkaWdpdHMgYXJlIFs0OV05OTk5OTk5OTk5OTk5OSBvciBbNTBdMDAwMDAwMDAwMDAwMDAuIEluIHRoYXQgY2FzZSwgdGhlIG1heGltdW0gZXJyb3JcclxuICAgKiBiZXR3ZWVuIHRoZSByZXN1bHQgYW5kIHRoZSBjb3JyZWN0bHkgcm91bmRlZCByZXN1bHQgd2lsbCBiZSBvbmUgdWxwICh1bml0IGluIHRoZSBsYXN0IHBsYWNlKS5cclxuICAgKlxyXG4gICAqIGxvZ1stYl0oYSkgICAgICAgPSBOYU5cclxuICAgKiBsb2dbMF0oYSkgICAgICAgID0gTmFOXHJcbiAgICogbG9nWzFdKGEpICAgICAgICA9IE5hTlxyXG4gICAqIGxvZ1tOYU5dKGEpICAgICAgPSBOYU5cclxuICAgKiBsb2dbSW5maW5pdHldKGEpID0gTmFOXHJcbiAgICogbG9nW2JdKDApICAgICAgICA9IC1JbmZpbml0eVxyXG4gICAqIGxvZ1tiXSgtMCkgICAgICAgPSAtSW5maW5pdHlcclxuICAgKiBsb2dbYl0oLWEpICAgICAgID0gTmFOXHJcbiAgICogbG9nW2JdKDEpICAgICAgICA9IDBcclxuICAgKiBsb2dbYl0oSW5maW5pdHkpID0gSW5maW5pdHlcclxuICAgKiBsb2dbYl0oTmFOKSAgICAgID0gTmFOXHJcbiAgICpcclxuICAgKiBbYmFzZV0ge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIGJhc2Ugb2YgdGhlIGxvZ2FyaXRobS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAubG9nYXJpdGhtID0gUC5sb2cgPSBmdW5jdGlvbiAoYmFzZSkge1xyXG4gICAgdmFyIGlzQmFzZTEwLCBkLCBkZW5vbWluYXRvciwgaywgaW5mLCBudW0sIHNkLCByLFxyXG4gICAgICBhcmcgPSB0aGlzLFxyXG4gICAgICBDdG9yID0gYXJnLmNvbnN0cnVjdG9yLFxyXG4gICAgICBwciA9IEN0b3IucHJlY2lzaW9uLFxyXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmcsXHJcbiAgICAgIGd1YXJkID0gNTtcclxuXHJcbiAgICAvLyBEZWZhdWx0IGJhc2UgaXMgMTAuXHJcbiAgICBpZiAoYmFzZSA9PSBudWxsKSB7XHJcbiAgICAgIGJhc2UgPSBuZXcgQ3RvcigxMCk7XHJcbiAgICAgIGlzQmFzZTEwID0gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGJhc2UgPSBuZXcgQ3RvcihiYXNlKTtcclxuICAgICAgZCA9IGJhc2UuZDtcclxuXHJcbiAgICAgIC8vIFJldHVybiBOYU4gaWYgYmFzZSBpcyBuZWdhdGl2ZSwgb3Igbm9uLWZpbml0ZSwgb3IgaXMgMCBvciAxLlxyXG4gICAgICBpZiAoYmFzZS5zIDwgMCB8fCAhZCB8fCAhZFswXSB8fCBiYXNlLmVxKDEpKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICAgIGlzQmFzZTEwID0gYmFzZS5lcSgxMCk7XHJcbiAgICB9XHJcblxyXG4gICAgZCA9IGFyZy5kO1xyXG5cclxuICAgIC8vIElzIGFyZyBuZWdhdGl2ZSwgbm9uLWZpbml0ZSwgMCBvciAxP1xyXG4gICAgaWYgKGFyZy5zIDwgMCB8fCAhZCB8fCAhZFswXSB8fCBhcmcuZXEoMSkpIHtcclxuICAgICAgcmV0dXJuIG5ldyBDdG9yKGQgJiYgIWRbMF0gPyAtMSAvIDAgOiBhcmcucyAhPSAxID8gTmFOIDogZCA/IDAgOiAxIC8gMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVGhlIHJlc3VsdCB3aWxsIGhhdmUgYSBub24tdGVybWluYXRpbmcgZGVjaW1hbCBleHBhbnNpb24gaWYgYmFzZSBpcyAxMCBhbmQgYXJnIGlzIG5vdCBhblxyXG4gICAgLy8gaW50ZWdlciBwb3dlciBvZiAxMC5cclxuICAgIGlmIChpc0Jhc2UxMCkge1xyXG4gICAgICBpZiAoZC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgaW5mID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKGsgPSBkWzBdOyBrICUgMTAgPT09IDA7KSBrIC89IDEwO1xyXG4gICAgICAgIGluZiA9IGsgIT09IDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gICAgc2QgPSBwciArIGd1YXJkO1xyXG4gICAgbnVtID0gbmF0dXJhbExvZ2FyaXRobShhcmcsIHNkKTtcclxuICAgIGRlbm9taW5hdG9yID0gaXNCYXNlMTAgPyBnZXRMbjEwKEN0b3IsIHNkICsgMTApIDogbmF0dXJhbExvZ2FyaXRobShiYXNlLCBzZCk7XHJcblxyXG4gICAgLy8gVGhlIHJlc3VsdCB3aWxsIGhhdmUgNSByb3VuZGluZyBkaWdpdHMuXHJcbiAgICByID0gZGl2aWRlKG51bSwgZGVub21pbmF0b3IsIHNkLCAxKTtcclxuXHJcbiAgICAvLyBJZiBhdCBhIHJvdW5kaW5nIGJvdW5kYXJ5LCBpLmUuIHRoZSByZXN1bHQncyByb3VuZGluZyBkaWdpdHMgYXJlIFs0OV05OTk5IG9yIFs1MF0wMDAwLFxyXG4gICAgLy8gY2FsY3VsYXRlIDEwIGZ1cnRoZXIgZGlnaXRzLlxyXG4gICAgLy9cclxuICAgIC8vIElmIHRoZSByZXN1bHQgaXMga25vd24gdG8gaGF2ZSBhbiBpbmZpbml0ZSBkZWNpbWFsIGV4cGFuc2lvbiwgcmVwZWF0IHRoaXMgdW50aWwgaXQgaXMgY2xlYXJcclxuICAgIC8vIHRoYXQgdGhlIHJlc3VsdCBpcyBhYm92ZSBvciBiZWxvdyB0aGUgYm91bmRhcnkuIE90aGVyd2lzZSwgaWYgYWZ0ZXIgY2FsY3VsYXRpbmcgdGhlIDEwXHJcbiAgICAvLyBmdXJ0aGVyIGRpZ2l0cywgdGhlIGxhc3QgMTQgYXJlIG5pbmVzLCByb3VuZCB1cCBhbmQgYXNzdW1lIHRoZSByZXN1bHQgaXMgZXhhY3QuXHJcbiAgICAvLyBBbHNvIGFzc3VtZSB0aGUgcmVzdWx0IGlzIGV4YWN0IGlmIHRoZSBsYXN0IDE0IGFyZSB6ZXJvLlxyXG4gICAgLy9cclxuICAgIC8vIEV4YW1wbGUgb2YgYSByZXN1bHQgdGhhdCB3aWxsIGJlIGluY29ycmVjdGx5IHJvdW5kZWQ6XHJcbiAgICAvLyBsb2dbMTA0ODU3Nl0oNDUwMzU5OTYyNzM3MDUwMikgPSAyLjYwMDAwMDAwMDAwMDAwMDA5NjEwMjc5NTExNDQ0NzQ2Li4uXHJcbiAgICAvLyBUaGUgYWJvdmUgcmVzdWx0IGNvcnJlY3RseSByb3VuZGVkIHVzaW5nIFJPVU5EX0NFSUwgdG8gMSBkZWNpbWFsIHBsYWNlIHNob3VsZCBiZSAyLjcsIGJ1dCBpdFxyXG4gICAgLy8gd2lsbCBiZSBnaXZlbiBhcyAyLjYgYXMgdGhlcmUgYXJlIDE1IHplcm9zIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSByZXF1ZXN0ZWQgZGVjaW1hbCBwbGFjZSwgc29cclxuICAgIC8vIHRoZSBleGFjdCByZXN1bHQgd291bGQgYmUgYXNzdW1lZCB0byBiZSAyLjYsIHdoaWNoIHJvdW5kZWQgdXNpbmcgUk9VTkRfQ0VJTCB0byAxIGRlY2ltYWxcclxuICAgIC8vIHBsYWNlIGlzIHN0aWxsIDIuNi5cclxuICAgIGlmIChjaGVja1JvdW5kaW5nRGlnaXRzKHIuZCwgayA9IHByLCBybSkpIHtcclxuXHJcbiAgICAgIGRvIHtcclxuICAgICAgICBzZCArPSAxMDtcclxuICAgICAgICBudW0gPSBuYXR1cmFsTG9nYXJpdGhtKGFyZywgc2QpO1xyXG4gICAgICAgIGRlbm9taW5hdG9yID0gaXNCYXNlMTAgPyBnZXRMbjEwKEN0b3IsIHNkICsgMTApIDogbmF0dXJhbExvZ2FyaXRobShiYXNlLCBzZCk7XHJcbiAgICAgICAgciA9IGRpdmlkZShudW0sIGRlbm9taW5hdG9yLCBzZCwgMSk7XHJcblxyXG4gICAgICAgIGlmICghaW5mKSB7XHJcblxyXG4gICAgICAgICAgLy8gQ2hlY2sgZm9yIDE0IG5pbmVzIGZyb20gdGhlIDJuZCByb3VuZGluZyBkaWdpdCwgYXMgdGhlIGZpcnN0IG1heSBiZSA0LlxyXG4gICAgICAgICAgaWYgKCtkaWdpdHNUb1N0cmluZyhyLmQpLnNsaWNlKGsgKyAxLCBrICsgMTUpICsgMSA9PSAxZTE0KSB7XHJcbiAgICAgICAgICAgIHIgPSBmaW5hbGlzZShyLCBwciArIDEsIDApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfSB3aGlsZSAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhyLmQsIGsgKz0gMTAsIHJtKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiBmaW5hbGlzZShyLCBwciwgcm0pO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBtYXhpbXVtIG9mIHRoZSBhcmd1bWVudHMgYW5kIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gIFAubWF4ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbChhcmd1bWVudHMsIHRoaXMpO1xyXG4gICAgcmV0dXJuIG1heE9yTWluKHRoaXMuY29uc3RydWN0b3IsIGFyZ3VtZW50cywgJ2x0Jyk7XHJcbiAgfTtcclxuICAgKi9cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1pbmltdW0gb2YgdGhlIGFyZ3VtZW50cyBhbmQgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgUC5taW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKGFyZ3VtZW50cywgdGhpcyk7XHJcbiAgICByZXR1cm4gbWF4T3JNaW4odGhpcy5jb25zdHJ1Y3RvciwgYXJndW1lbnRzLCAnZ3QnKTtcclxuICB9O1xyXG4gICAqL1xyXG5cclxuXHJcbiAgLypcclxuICAgKiAgbiAtIDAgPSBuXHJcbiAgICogIG4gLSBOID0gTlxyXG4gICAqICBuIC0gSSA9IC1JXHJcbiAgICogIDAgLSBuID0gLW5cclxuICAgKiAgMCAtIDAgPSAwXHJcbiAgICogIDAgLSBOID0gTlxyXG4gICAqICAwIC0gSSA9IC1JXHJcbiAgICogIE4gLSBuID0gTlxyXG4gICAqICBOIC0gMCA9IE5cclxuICAgKiAgTiAtIE4gPSBOXHJcbiAgICogIE4gLSBJID0gTlxyXG4gICAqICBJIC0gbiA9IElcclxuICAgKiAgSSAtIDAgPSBJXHJcbiAgICogIEkgLSBOID0gTlxyXG4gICAqICBJIC0gSSA9IE5cclxuICAgKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgbWludXMgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAubWludXMgPSBQLnN1YiA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICB2YXIgZCwgZSwgaSwgaiwgaywgbGVuLCBwciwgcm0sIHhkLCB4ZSwgeExUeSwgeWQsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICB5ID0gbmV3IEN0b3IoeSk7XHJcblxyXG4gICAgLy8gSWYgZWl0aGVyIGlzIG5vdCBmaW5pdGUuLi5cclxuICAgIGlmICgheC5kIHx8ICF5LmQpIHtcclxuXHJcbiAgICAgIC8vIFJldHVybiBOYU4gaWYgZWl0aGVyIGlzIE5hTi5cclxuICAgICAgaWYgKCF4LnMgfHwgIXkucykgeSA9IG5ldyBDdG9yKE5hTik7XHJcblxyXG4gICAgICAvLyBSZXR1cm4geSBuZWdhdGVkIGlmIHggaXMgZmluaXRlIGFuZCB5IGlzIMKxSW5maW5pdHkuXHJcbiAgICAgIGVsc2UgaWYgKHguZCkgeS5zID0gLXkucztcclxuXHJcbiAgICAgIC8vIFJldHVybiB4IGlmIHkgaXMgZmluaXRlIGFuZCB4IGlzIMKxSW5maW5pdHkuXHJcbiAgICAgIC8vIFJldHVybiB4IGlmIGJvdGggYXJlIMKxSW5maW5pdHkgd2l0aCBkaWZmZXJlbnQgc2lnbnMuXHJcbiAgICAgIC8vIFJldHVybiBOYU4gaWYgYm90aCBhcmUgwrFJbmZpbml0eSB3aXRoIHRoZSBzYW1lIHNpZ24uXHJcbiAgICAgIGVsc2UgeSA9IG5ldyBDdG9yKHkuZCB8fCB4LnMgIT09IHkucyA/IHggOiBOYU4pO1xyXG5cclxuICAgICAgcmV0dXJuIHk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgc2lnbnMgZGlmZmVyLi4uXHJcbiAgICBpZiAoeC5zICE9IHkucykge1xyXG4gICAgICB5LnMgPSAteS5zO1xyXG4gICAgICByZXR1cm4geC5wbHVzKHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHhkID0geC5kO1xyXG4gICAgeWQgPSB5LmQ7XHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG5cclxuICAgIC8vIElmIGVpdGhlciBpcyB6ZXJvLi4uXHJcbiAgICBpZiAoIXhkWzBdIHx8ICF5ZFswXSkge1xyXG5cclxuICAgICAgLy8gUmV0dXJuIHkgbmVnYXRlZCBpZiB4IGlzIHplcm8gYW5kIHkgaXMgbm9uLXplcm8uXHJcbiAgICAgIGlmICh5ZFswXSkgeS5zID0gLXkucztcclxuXHJcbiAgICAgIC8vIFJldHVybiB4IGlmIHkgaXMgemVybyBhbmQgeCBpcyBub24temVyby5cclxuICAgICAgZWxzZSBpZiAoeGRbMF0pIHkgPSBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICAgIC8vIFJldHVybiB6ZXJvIGlmIGJvdGggYXJlIHplcm8uXHJcbiAgICAgIC8vIEZyb20gSUVFRSA3NTQgKDIwMDgpIDYuMzogMCAtIDAgPSAtMCAtIC0wID0gLTAgd2hlbiByb3VuZGluZyB0byAtSW5maW5pdHkuXHJcbiAgICAgIGVsc2UgcmV0dXJuIG5ldyBDdG9yKHJtID09PSAzID8gLTAgOiAwKTtcclxuXHJcbiAgICAgIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHggYW5kIHkgYXJlIGZpbml0ZSwgbm9uLXplcm8gbnVtYmVycyB3aXRoIHRoZSBzYW1lIHNpZ24uXHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGJhc2UgMWU3IGV4cG9uZW50cy5cclxuICAgIGUgPSBtYXRoZmxvb3IoeS5lIC8gTE9HX0JBU0UpO1xyXG4gICAgeGUgPSBtYXRoZmxvb3IoeC5lIC8gTE9HX0JBU0UpO1xyXG5cclxuICAgIHhkID0geGQuc2xpY2UoKTtcclxuICAgIGsgPSB4ZSAtIGU7XHJcblxyXG4gICAgLy8gSWYgYmFzZSAxZTcgZXhwb25lbnRzIGRpZmZlci4uLlxyXG4gICAgaWYgKGspIHtcclxuICAgICAgeExUeSA9IGsgPCAwO1xyXG5cclxuICAgICAgaWYgKHhMVHkpIHtcclxuICAgICAgICBkID0geGQ7XHJcbiAgICAgICAgayA9IC1rO1xyXG4gICAgICAgIGxlbiA9IHlkLmxlbmd0aDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkID0geWQ7XHJcbiAgICAgICAgZSA9IHhlO1xyXG4gICAgICAgIGxlbiA9IHhkLmxlbmd0aDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gTnVtYmVycyB3aXRoIG1hc3NpdmVseSBkaWZmZXJlbnQgZXhwb25lbnRzIHdvdWxkIHJlc3VsdCBpbiBhIHZlcnkgaGlnaCBudW1iZXIgb2ZcclxuICAgICAgLy8gemVyb3MgbmVlZGluZyB0byBiZSBwcmVwZW5kZWQsIGJ1dCB0aGlzIGNhbiBiZSBhdm9pZGVkIHdoaWxlIHN0aWxsIGVuc3VyaW5nIGNvcnJlY3RcclxuICAgICAgLy8gcm91bmRpbmcgYnkgbGltaXRpbmcgdGhlIG51bWJlciBvZiB6ZXJvcyB0byBgTWF0aC5jZWlsKHByIC8gTE9HX0JBU0UpICsgMmAuXHJcbiAgICAgIGkgPSBNYXRoLm1heChNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSksIGxlbikgKyAyO1xyXG5cclxuICAgICAgaWYgKGsgPiBpKSB7XHJcbiAgICAgICAgayA9IGk7XHJcbiAgICAgICAgZC5sZW5ndGggPSAxO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVwZW5kIHplcm9zIHRvIGVxdWFsaXNlIGV4cG9uZW50cy5cclxuICAgICAgZC5yZXZlcnNlKCk7XHJcbiAgICAgIGZvciAoaSA9IGs7IGktLTspIGQucHVzaCgwKTtcclxuICAgICAgZC5yZXZlcnNlKCk7XHJcblxyXG4gICAgLy8gQmFzZSAxZTcgZXhwb25lbnRzIGVxdWFsLlxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIC8vIENoZWNrIGRpZ2l0cyB0byBkZXRlcm1pbmUgd2hpY2ggaXMgdGhlIGJpZ2dlciBudW1iZXIuXHJcblxyXG4gICAgICBpID0geGQubGVuZ3RoO1xyXG4gICAgICBsZW4gPSB5ZC5sZW5ndGg7XHJcbiAgICAgIHhMVHkgPSBpIDwgbGVuO1xyXG4gICAgICBpZiAoeExUeSkgbGVuID0gaTtcclxuXHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIGlmICh4ZFtpXSAhPSB5ZFtpXSkge1xyXG4gICAgICAgICAgeExUeSA9IHhkW2ldIDwgeWRbaV07XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGsgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh4TFR5KSB7XHJcbiAgICAgIGQgPSB4ZDtcclxuICAgICAgeGQgPSB5ZDtcclxuICAgICAgeWQgPSBkO1xyXG4gICAgICB5LnMgPSAteS5zO1xyXG4gICAgfVxyXG5cclxuICAgIGxlbiA9IHhkLmxlbmd0aDtcclxuXHJcbiAgICAvLyBBcHBlbmQgemVyb3MgdG8gYHhkYCBpZiBzaG9ydGVyLlxyXG4gICAgLy8gRG9uJ3QgYWRkIHplcm9zIHRvIGB5ZGAgaWYgc2hvcnRlciBhcyBzdWJ0cmFjdGlvbiBvbmx5IG5lZWRzIHRvIHN0YXJ0IGF0IGB5ZGAgbGVuZ3RoLlxyXG4gICAgZm9yIChpID0geWQubGVuZ3RoIC0gbGVuOyBpID4gMDsgLS1pKSB4ZFtsZW4rK10gPSAwO1xyXG5cclxuICAgIC8vIFN1YnRyYWN0IHlkIGZyb20geGQuXHJcbiAgICBmb3IgKGkgPSB5ZC5sZW5ndGg7IGkgPiBrOykge1xyXG5cclxuICAgICAgaWYgKHhkWy0taV0gPCB5ZFtpXSkge1xyXG4gICAgICAgIGZvciAoaiA9IGk7IGogJiYgeGRbLS1qXSA9PT0gMDspIHhkW2pdID0gQkFTRSAtIDE7XHJcbiAgICAgICAgLS14ZFtqXTtcclxuICAgICAgICB4ZFtpXSArPSBCQVNFO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB4ZFtpXSAtPSB5ZFtpXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKDsgeGRbLS1sZW5dID09PSAwOykgeGQucG9wKCk7XHJcblxyXG4gICAgLy8gUmVtb3ZlIGxlYWRpbmcgemVyb3MgYW5kIGFkanVzdCBleHBvbmVudCBhY2NvcmRpbmdseS5cclxuICAgIGZvciAoOyB4ZFswXSA9PT0gMDsgeGQuc2hpZnQoKSkgLS1lO1xyXG5cclxuICAgIC8vIFplcm8/XHJcbiAgICBpZiAoIXhkWzBdKSByZXR1cm4gbmV3IEN0b3Iocm0gPT09IDMgPyAtMCA6IDApO1xyXG5cclxuICAgIHkuZCA9IHhkO1xyXG4gICAgeS5lID0gZ2V0QmFzZTEwRXhwb25lbnQoeGQsIGUpO1xyXG5cclxuICAgIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqICAgbiAlIDAgPSAgTlxyXG4gICAqICAgbiAlIE4gPSAgTlxyXG4gICAqICAgbiAlIEkgPSAgblxyXG4gICAqICAgMCAlIG4gPSAgMFxyXG4gICAqICAtMCAlIG4gPSAtMFxyXG4gICAqICAgMCAlIDAgPSAgTlxyXG4gICAqICAgMCAlIE4gPSAgTlxyXG4gICAqICAgMCAlIEkgPSAgMFxyXG4gICAqICAgTiAlIG4gPSAgTlxyXG4gICAqICAgTiAlIDAgPSAgTlxyXG4gICAqICAgTiAlIE4gPSAgTlxyXG4gICAqICAgTiAlIEkgPSAgTlxyXG4gICAqICAgSSAlIG4gPSAgTlxyXG4gICAqICAgSSAlIDAgPSAgTlxyXG4gICAqICAgSSAlIE4gPSAgTlxyXG4gICAqICAgSSAlIEkgPSAgTlxyXG4gICAqXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBtb2R1bG8gYHlgLCByb3VuZGVkIHRvXHJcbiAgICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIFRoZSByZXN1bHQgZGVwZW5kcyBvbiB0aGUgbW9kdWxvIG1vZGUuXHJcbiAgICpcclxuICAgKi9cclxuICBQLm1vZHVsbyA9IFAubW9kID0gZnVuY3Rpb24gKHkpIHtcclxuICAgIHZhciBxLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgeSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICAgIC8vIFJldHVybiBOYU4gaWYgeCBpcyDCsUluZmluaXR5IG9yIE5hTiwgb3IgeSBpcyBOYU4gb3IgwrEwLlxyXG4gICAgaWYgKCF4LmQgfHwgIXkucyB8fCB5LmQgJiYgIXkuZFswXSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gICAgLy8gUmV0dXJuIHggaWYgeSBpcyDCsUluZmluaXR5IG9yIHggaXMgwrEwLlxyXG4gICAgaWYgKCF5LmQgfHwgeC5kICYmICF4LmRbMF0pIHtcclxuICAgICAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBDdG9yLnByZWNpc2lvbiwgQ3Rvci5yb3VuZGluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJldmVudCByb3VuZGluZyBvZiBpbnRlcm1lZGlhdGUgY2FsY3VsYXRpb25zLlxyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgICBpZiAoQ3Rvci5tb2R1bG8gPT0gOSkge1xyXG5cclxuICAgICAgLy8gRXVjbGlkaWFuIGRpdmlzaW9uOiBxID0gc2lnbih5KSAqIGZsb29yKHggLyBhYnMoeSkpXHJcbiAgICAgIC8vIHJlc3VsdCA9IHggLSBxICogeSAgICB3aGVyZSAgMCA8PSByZXN1bHQgPCBhYnMoeSlcclxuICAgICAgcSA9IGRpdmlkZSh4LCB5LmFicygpLCAwLCAzLCAxKTtcclxuICAgICAgcS5zICo9IHkucztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHEgPSBkaXZpZGUoeCwgeSwgMCwgQ3Rvci5tb2R1bG8sIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHEgPSBxLnRpbWVzKHkpO1xyXG5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4geC5taW51cyhxKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBleHBvbmVudGlhbCBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLFxyXG4gICAqIGkuZS4gdGhlIGJhc2UgZSByYWlzZWQgdG8gdGhlIHBvd2VyIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5uYXR1cmFsRXhwb25lbnRpYWwgPSBQLmV4cCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBuYXR1cmFsRXhwb25lbnRpYWwodGhpcyk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgbG9nYXJpdGhtIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwsXHJcbiAgICogcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5uYXR1cmFsTG9nYXJpdGhtID0gUC5sbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBuYXR1cmFsTG9nYXJpdGhtKHRoaXMpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgbmVnYXRlZCwgaS5lLiBhcyBpZiBtdWx0aXBsaWVkIGJ5XHJcbiAgICogLTEuXHJcbiAgICpcclxuICAgKi9cclxuICBQLm5lZ2F0ZWQgPSBQLm5lZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB4ID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyk7XHJcbiAgICB4LnMgPSAteC5zO1xyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHgpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqICBuICsgMCA9IG5cclxuICAgKiAgbiArIE4gPSBOXHJcbiAgICogIG4gKyBJID0gSVxyXG4gICAqICAwICsgbiA9IG5cclxuICAgKiAgMCArIDAgPSAwXHJcbiAgICogIDAgKyBOID0gTlxyXG4gICAqICAwICsgSSA9IElcclxuICAgKiAgTiArIG4gPSBOXHJcbiAgICogIE4gKyAwID0gTlxyXG4gICAqICBOICsgTiA9IE5cclxuICAgKiAgTiArIEkgPSBOXHJcbiAgICogIEkgKyBuID0gSVxyXG4gICAqICBJICsgMCA9IElcclxuICAgKiAgSSArIE4gPSBOXHJcbiAgICogIEkgKyBJID0gSVxyXG4gICAqXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBwbHVzIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnBsdXMgPSBQLmFkZCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICB2YXIgY2FycnksIGQsIGUsIGksIGssIGxlbiwgcHIsIHJtLCB4ZCwgeWQsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICB5ID0gbmV3IEN0b3IoeSk7XHJcblxyXG4gICAgLy8gSWYgZWl0aGVyIGlzIG5vdCBmaW5pdGUuLi5cclxuICAgIGlmICgheC5kIHx8ICF5LmQpIHtcclxuXHJcbiAgICAgIC8vIFJldHVybiBOYU4gaWYgZWl0aGVyIGlzIE5hTi5cclxuICAgICAgaWYgKCF4LnMgfHwgIXkucykgeSA9IG5ldyBDdG9yKE5hTik7XHJcblxyXG4gICAgICAvLyBSZXR1cm4geCBpZiB5IGlzIGZpbml0ZSBhbmQgeCBpcyDCsUluZmluaXR5LlxyXG4gICAgICAvLyBSZXR1cm4geCBpZiBib3RoIGFyZSDCsUluZmluaXR5IHdpdGggdGhlIHNhbWUgc2lnbi5cclxuICAgICAgLy8gUmV0dXJuIE5hTiBpZiBib3RoIGFyZSDCsUluZmluaXR5IHdpdGggZGlmZmVyZW50IHNpZ25zLlxyXG4gICAgICAvLyBSZXR1cm4geSBpZiB4IGlzIGZpbml0ZSBhbmQgeSBpcyDCsUluZmluaXR5LlxyXG4gICAgICBlbHNlIGlmICgheC5kKSB5ID0gbmV3IEN0b3IoeS5kIHx8IHgucyA9PT0geS5zID8geCA6IE5hTik7XHJcblxyXG4gICAgICByZXR1cm4geTtcclxuICAgIH1cclxuXHJcbiAgICAgLy8gSWYgc2lnbnMgZGlmZmVyLi4uXHJcbiAgICBpZiAoeC5zICE9IHkucykge1xyXG4gICAgICB5LnMgPSAteS5zO1xyXG4gICAgICByZXR1cm4geC5taW51cyh5KTtcclxuICAgIH1cclxuXHJcbiAgICB4ZCA9IHguZDtcclxuICAgIHlkID0geS5kO1xyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgICAvLyBJZiBlaXRoZXIgaXMgemVyby4uLlxyXG4gICAgaWYgKCF4ZFswXSB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAgIC8vIFJldHVybiB4IGlmIHkgaXMgemVyby5cclxuICAgICAgLy8gUmV0dXJuIHkgaWYgeSBpcyBub24temVyby5cclxuICAgICAgaWYgKCF5ZFswXSkgeSA9IG5ldyBDdG9yKHgpO1xyXG5cclxuICAgICAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8geCBhbmQgeSBhcmUgZmluaXRlLCBub24temVybyBudW1iZXJzIHdpdGggdGhlIHNhbWUgc2lnbi5cclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgYmFzZSAxZTcgZXhwb25lbnRzLlxyXG4gICAgayA9IG1hdGhmbG9vcih4LmUgLyBMT0dfQkFTRSk7XHJcbiAgICBlID0gbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuXHJcbiAgICB4ZCA9IHhkLnNsaWNlKCk7XHJcbiAgICBpID0gayAtIGU7XHJcblxyXG4gICAgLy8gSWYgYmFzZSAxZTcgZXhwb25lbnRzIGRpZmZlci4uLlxyXG4gICAgaWYgKGkpIHtcclxuXHJcbiAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgIGQgPSB4ZDtcclxuICAgICAgICBpID0gLWk7XHJcbiAgICAgICAgbGVuID0geWQubGVuZ3RoO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGQgPSB5ZDtcclxuICAgICAgICBlID0gaztcclxuICAgICAgICBsZW4gPSB4ZC5sZW5ndGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIExpbWl0IG51bWJlciBvZiB6ZXJvcyBwcmVwZW5kZWQgdG8gbWF4KGNlaWwocHIgLyBMT0dfQkFTRSksIGxlbikgKyAxLlxyXG4gICAgICBrID0gTWF0aC5jZWlsKHByIC8gTE9HX0JBU0UpO1xyXG4gICAgICBsZW4gPSBrID4gbGVuID8gayArIDEgOiBsZW4gKyAxO1xyXG5cclxuICAgICAgaWYgKGkgPiBsZW4pIHtcclxuICAgICAgICBpID0gbGVuO1xyXG4gICAgICAgIGQubGVuZ3RoID0gMTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuIE5vdGU6IEZhc3RlciB0byB1c2UgcmV2ZXJzZSB0aGVuIGRvIHVuc2hpZnRzLlxyXG4gICAgICBkLnJldmVyc2UoKTtcclxuICAgICAgZm9yICg7IGktLTspIGQucHVzaCgwKTtcclxuICAgICAgZC5yZXZlcnNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGVuID0geGQubGVuZ3RoO1xyXG4gICAgaSA9IHlkLmxlbmd0aDtcclxuXHJcbiAgICAvLyBJZiB5ZCBpcyBsb25nZXIgdGhhbiB4ZCwgc3dhcCB4ZCBhbmQgeWQgc28geGQgcG9pbnRzIHRvIHRoZSBsb25nZXIgYXJyYXkuXHJcbiAgICBpZiAobGVuIC0gaSA8IDApIHtcclxuICAgICAgaSA9IGxlbjtcclxuICAgICAgZCA9IHlkO1xyXG4gICAgICB5ZCA9IHhkO1xyXG4gICAgICB4ZCA9IGQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT25seSBzdGFydCBhZGRpbmcgYXQgeWQubGVuZ3RoIC0gMSBhcyB0aGUgZnVydGhlciBkaWdpdHMgb2YgeGQgY2FuIGJlIGxlZnQgYXMgdGhleSBhcmUuXHJcbiAgICBmb3IgKGNhcnJ5ID0gMDsgaTspIHtcclxuICAgICAgY2FycnkgPSAoeGRbLS1pXSA9IHhkW2ldICsgeWRbaV0gKyBjYXJyeSkgLyBCQVNFIHwgMDtcclxuICAgICAgeGRbaV0gJT0gQkFTRTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2FycnkpIHtcclxuICAgICAgeGQudW5zaGlmdChjYXJyeSk7XHJcbiAgICAgICsrZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAvLyBObyBuZWVkIHRvIGNoZWNrIGZvciB6ZXJvLCBhcyAreCArICt5ICE9IDAgJiYgLXggKyAteSAhPSAwXHJcbiAgICBmb3IgKGxlbiA9IHhkLmxlbmd0aDsgeGRbLS1sZW5dID09IDA7KSB4ZC5wb3AoKTtcclxuXHJcbiAgICB5LmQgPSB4ZDtcclxuICAgIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCBlKTtcclxuXHJcbiAgICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBwciwgcm0pIDogeTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdGhlIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHMgb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIFt6XSB7Ym9vbGVhbnxudW1iZXJ9IFdoZXRoZXIgdG8gY291bnQgaW50ZWdlci1wYXJ0IHRyYWlsaW5nIHplcm9zOiB0cnVlLCBmYWxzZSwgMSBvciAwLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5wcmVjaXNpb24gPSBQLnNkID0gZnVuY3Rpb24gKHopIHtcclxuICAgIHZhciBrLFxyXG4gICAgICB4ID0gdGhpcztcclxuXHJcbiAgICBpZiAoeiAhPT0gdm9pZCAwICYmIHogIT09ICEheiAmJiB6ICE9PSAxICYmIHogIT09IDApIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHopO1xyXG5cclxuICAgIGlmICh4LmQpIHtcclxuICAgICAgayA9IGdldFByZWNpc2lvbih4LmQpO1xyXG4gICAgICBpZiAoeiAmJiB4LmUgKyAxID4gaykgayA9IHguZSArIDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBrID0gTmFOO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBrO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIHdob2xlIG51bWJlciB1c2luZ1xyXG4gICAqIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAucm91bmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIHJldHVybiBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgeC5lICsgMSwgQ3Rvci5yb3VuZGluZyk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHNpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKiBSYW5nZTogWy0xLCAxXVxyXG4gICAqXHJcbiAgICogc2luKHgpID0geCAtIHheMy8zISArIHheNS81ISAtIC4uLlxyXG4gICAqXHJcbiAgICogc2luKDApICAgICAgICAgPSAwXHJcbiAgICogc2luKC0wKSAgICAgICAgPSAtMFxyXG4gICAqIHNpbihJbmZpbml0eSkgID0gTmFOXHJcbiAgICogc2luKC1JbmZpbml0eSkgPSBOYU5cclxuICAgKiBzaW4oTmFOKSAgICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5zaW5lID0gUC5zaW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHIsIHJtLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG4gICAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIExPR19CQVNFO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gICAgeCA9IHNpbmUoQ3RvciwgdG9MZXNzVGhhbkhhbGZQaShDdG9yLCB4KSk7XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UocXVhZHJhbnQgPiAyID8geC5uZWcoKSA6IHgsIHByLCBybSwgdHJ1ZSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHNxdWFyZSByb290IG9mIHRoaXMgRGVjaW1hbCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiAgc3FydCgtbikgPSAgTlxyXG4gICAqICBzcXJ0KE4pICA9ICBOXHJcbiAgICogIHNxcnQoLUkpID0gIE5cclxuICAgKiAgc3FydChJKSAgPSAgSVxyXG4gICAqICBzcXJ0KDApICA9ICAwXHJcbiAgICogIHNxcnQoLTApID0gLTBcclxuICAgKlxyXG4gICAqL1xyXG4gIFAuc3F1YXJlUm9vdCA9IFAuc3FydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBtLCBuLCBzZCwgciwgcmVwLCB0LFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgZCA9IHguZCxcclxuICAgICAgZSA9IHguZSxcclxuICAgICAgcyA9IHgucyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgLy8gTmVnYXRpdmUvTmFOL0luZmluaXR5L3plcm8/XHJcbiAgICBpZiAocyAhPT0gMSB8fCAhZCB8fCAhZFswXSkge1xyXG4gICAgICByZXR1cm4gbmV3IEN0b3IoIXMgfHwgcyA8IDAgJiYgKCFkIHx8IGRbMF0pID8gTmFOIDogZCA/IHggOiAxIC8gMCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBJbml0aWFsIGVzdGltYXRlLlxyXG4gICAgcyA9IE1hdGguc3FydCgreCk7XHJcblxyXG4gICAgLy8gTWF0aC5zcXJ0IHVuZGVyZmxvdy9vdmVyZmxvdz9cclxuICAgIC8vIFBhc3MgeCB0byBNYXRoLnNxcnQgYXMgaW50ZWdlciwgdGhlbiBhZGp1c3QgdGhlIGV4cG9uZW50IG9mIHRoZSByZXN1bHQuXHJcbiAgICBpZiAocyA9PSAwIHx8IHMgPT0gMSAvIDApIHtcclxuICAgICAgbiA9IGRpZ2l0c1RvU3RyaW5nKGQpO1xyXG5cclxuICAgICAgaWYgKChuLmxlbmd0aCArIGUpICUgMiA9PSAwKSBuICs9ICcwJztcclxuICAgICAgcyA9IE1hdGguc3FydChuKTtcclxuICAgICAgZSA9IG1hdGhmbG9vcigoZSArIDEpIC8gMikgLSAoZSA8IDAgfHwgZSAlIDIpO1xyXG5cclxuICAgICAgaWYgKHMgPT0gMSAvIDApIHtcclxuICAgICAgICBuID0gJzFlJyArIGU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbiA9IHMudG9FeHBvbmVudGlhbCgpO1xyXG4gICAgICAgIG4gPSBuLnNsaWNlKDAsIG4uaW5kZXhPZignZScpICsgMSkgKyBlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByID0gbmV3IEN0b3Iobik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByID0gbmV3IEN0b3Iocy50b1N0cmluZygpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZCA9IChlID0gQ3Rvci5wcmVjaXNpb24pICsgMztcclxuXHJcbiAgICAvLyBOZXd0b24tUmFwaHNvbiBpdGVyYXRpb24uXHJcbiAgICBmb3IgKDs7KSB7XHJcbiAgICAgIHQgPSByO1xyXG4gICAgICByID0gdC5wbHVzKGRpdmlkZSh4LCB0LCBzZCArIDIsIDEpKS50aW1lcygwLjUpO1xyXG5cclxuICAgICAgLy8gVE9ETz8gUmVwbGFjZSB3aXRoIGZvci1sb29wIGFuZCBjaGVja1JvdW5kaW5nRGlnaXRzLlxyXG4gICAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCBzZCkgPT09IChuID0gZGlnaXRzVG9TdHJpbmcoci5kKSkuc2xpY2UoMCwgc2QpKSB7XHJcbiAgICAgICAgbiA9IG4uc2xpY2Uoc2QgLSAzLCBzZCArIDEpO1xyXG5cclxuICAgICAgICAvLyBUaGUgNHRoIHJvdW5kaW5nIGRpZ2l0IG1heSBiZSBpbiBlcnJvciBieSAtMSBzbyBpZiB0aGUgNCByb3VuZGluZyBkaWdpdHMgYXJlIDk5OTkgb3JcclxuICAgICAgICAvLyA0OTk5LCBpLmUuIGFwcHJvYWNoaW5nIGEgcm91bmRpbmcgYm91bmRhcnksIGNvbnRpbnVlIHRoZSBpdGVyYXRpb24uXHJcbiAgICAgICAgaWYgKG4gPT0gJzk5OTknIHx8ICFyZXAgJiYgbiA9PSAnNDk5OScpIHtcclxuXHJcbiAgICAgICAgICAvLyBPbiB0aGUgZmlyc3QgaXRlcmF0aW9uIG9ubHksIGNoZWNrIHRvIHNlZSBpZiByb3VuZGluZyB1cCBnaXZlcyB0aGUgZXhhY3QgcmVzdWx0IGFzIHRoZVxyXG4gICAgICAgICAgLy8gbmluZXMgbWF5IGluZmluaXRlbHkgcmVwZWF0LlxyXG4gICAgICAgICAgaWYgKCFyZXApIHtcclxuICAgICAgICAgICAgZmluYWxpc2UodCwgZSArIDEsIDApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHQudGltZXModCkuZXEoeCkpIHtcclxuICAgICAgICAgICAgICByID0gdDtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHNkICs9IDQ7XHJcbiAgICAgICAgICByZXAgPSAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgLy8gSWYgdGhlIHJvdW5kaW5nIGRpZ2l0cyBhcmUgbnVsbCwgMHswLDR9IG9yIDUwezAsM30sIGNoZWNrIGZvciBhbiBleGFjdCByZXN1bHQuXHJcbiAgICAgICAgICAvLyBJZiBub3QsIHRoZW4gdGhlcmUgYXJlIGZ1cnRoZXIgZGlnaXRzIGFuZCBtIHdpbGwgYmUgdHJ1dGh5LlxyXG4gICAgICAgICAgaWYgKCErbiB8fCAhK24uc2xpY2UoMSkgJiYgbi5jaGFyQXQoMCkgPT0gJzUnKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBUcnVuY2F0ZSB0byB0aGUgZmlyc3Qgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgICAgICAgIGZpbmFsaXNlKHIsIGUgKyAxLCAxKTtcclxuICAgICAgICAgICAgbSA9ICFyLnRpbWVzKHIpLmVxKHgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UociwgZSwgQ3Rvci5yb3VuZGluZywgbSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHRhbmdlbnQgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICpcclxuICAgKiB0YW4oMCkgICAgICAgICA9IDBcclxuICAgKiB0YW4oLTApICAgICAgICA9IC0wXHJcbiAgICogdGFuKEluZmluaXR5KSAgPSBOYU5cclxuICAgKiB0YW4oLUluZmluaXR5KSA9IE5hTlxyXG4gICAqIHRhbihOYU4pICAgICAgID0gTmFOXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRhbmdlbnQgPSBQLnRhbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwciwgcm0sXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByICsgMTA7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgICB4ID0geC5zaW4oKTtcclxuICAgIHgucyA9IDE7XHJcbiAgICB4ID0gZGl2aWRlKHgsIG5ldyBDdG9yKDEpLm1pbnVzKHgudGltZXMoeCkpLnNxcnQoKSwgcHIgKyAxMCwgMCk7XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UocXVhZHJhbnQgPT0gMiB8fCBxdWFkcmFudCA9PSA0ID8geC5uZWcoKSA6IHgsIHByLCBybSwgdHJ1ZSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogIG4gKiAwID0gMFxyXG4gICAqICBuICogTiA9IE5cclxuICAgKiAgbiAqIEkgPSBJXHJcbiAgICogIDAgKiBuID0gMFxyXG4gICAqICAwICogMCA9IDBcclxuICAgKiAgMCAqIE4gPSBOXHJcbiAgICogIDAgKiBJID0gTlxyXG4gICAqICBOICogbiA9IE5cclxuICAgKiAgTiAqIDAgPSBOXHJcbiAgICogIE4gKiBOID0gTlxyXG4gICAqICBOICogSSA9IE5cclxuICAgKiAgSSAqIG4gPSBJXHJcbiAgICogIEkgKiAwID0gTlxyXG4gICAqICBJICogTiA9IE5cclxuICAgKiAgSSAqIEkgPSBJXHJcbiAgICpcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGlzIERlY2ltYWwgdGltZXMgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudGltZXMgPSBQLm11bCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICB2YXIgY2FycnksIGUsIGksIGssIHIsIHJMLCB0LCB4ZEwsIHlkTCxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICB4ZCA9IHguZCxcclxuICAgICAgeWQgPSAoeSA9IG5ldyBDdG9yKHkpKS5kO1xyXG5cclxuICAgIHkucyAqPSB4LnM7XHJcblxyXG4gICAgIC8vIElmIGVpdGhlciBpcyBOYU4sIMKxSW5maW5pdHkgb3IgwrEwLi4uXHJcbiAgICBpZiAoIXhkIHx8ICF4ZFswXSB8fCAheWQgfHwgIXlkWzBdKSB7XHJcblxyXG4gICAgICByZXR1cm4gbmV3IEN0b3IoIXkucyB8fCB4ZCAmJiAheGRbMF0gJiYgIXlkIHx8IHlkICYmICF5ZFswXSAmJiAheGRcclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIE5hTiBpZiBlaXRoZXIgaXMgTmFOLlxyXG4gICAgICAgIC8vIFJldHVybiBOYU4gaWYgeCBpcyDCsTAgYW5kIHkgaXMgwrFJbmZpbml0eSwgb3IgeSBpcyDCsTAgYW5kIHggaXMgwrFJbmZpbml0eS5cclxuICAgICAgICA/IE5hTlxyXG5cclxuICAgICAgICAvLyBSZXR1cm4gwrFJbmZpbml0eSBpZiBlaXRoZXIgaXMgwrFJbmZpbml0eS5cclxuICAgICAgICAvLyBSZXR1cm4gwrEwIGlmIGVpdGhlciBpcyDCsTAuXHJcbiAgICAgICAgOiAheGQgfHwgIXlkID8geS5zIC8gMCA6IHkucyAqIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGUgPSBtYXRoZmxvb3IoeC5lIC8gTE9HX0JBU0UpICsgbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuICAgIHhkTCA9IHhkLmxlbmd0aDtcclxuICAgIHlkTCA9IHlkLmxlbmd0aDtcclxuXHJcbiAgICAvLyBFbnN1cmUgeGQgcG9pbnRzIHRvIHRoZSBsb25nZXIgYXJyYXkuXHJcbiAgICBpZiAoeGRMIDwgeWRMKSB7XHJcbiAgICAgIHIgPSB4ZDtcclxuICAgICAgeGQgPSB5ZDtcclxuICAgICAgeWQgPSByO1xyXG4gICAgICByTCA9IHhkTDtcclxuICAgICAgeGRMID0geWRMO1xyXG4gICAgICB5ZEwgPSByTDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJbml0aWFsaXNlIHRoZSByZXN1bHQgYXJyYXkgd2l0aCB6ZXJvcy5cclxuICAgIHIgPSBbXTtcclxuICAgIHJMID0geGRMICsgeWRMO1xyXG4gICAgZm9yIChpID0gckw7IGktLTspIHIucHVzaCgwKTtcclxuXHJcbiAgICAvLyBNdWx0aXBseSFcclxuICAgIGZvciAoaSA9IHlkTDsgLS1pID49IDA7KSB7XHJcbiAgICAgIGNhcnJ5ID0gMDtcclxuICAgICAgZm9yIChrID0geGRMICsgaTsgayA+IGk7KSB7XHJcbiAgICAgICAgdCA9IHJba10gKyB5ZFtpXSAqIHhkW2sgLSBpIC0gMV0gKyBjYXJyeTtcclxuICAgICAgICByW2stLV0gPSB0ICUgQkFTRSB8IDA7XHJcbiAgICAgICAgY2FycnkgPSB0IC8gQkFTRSB8IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJba10gPSAocltrXSArIGNhcnJ5KSAlIEJBU0UgfCAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgIGZvciAoOyAhclstLXJMXTspIHIucG9wKCk7XHJcblxyXG4gICAgaWYgKGNhcnJ5KSArK2U7XHJcbiAgICBlbHNlIHIuc2hpZnQoKTtcclxuXHJcbiAgICB5LmQgPSByO1xyXG4gICAgeS5lID0gZ2V0QmFzZTEwRXhwb25lbnQociwgZSk7XHJcblxyXG4gICAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgQ3Rvci5wcmVjaXNpb24sIEN0b3Iucm91bmRpbmcpIDogeTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaW4gYmFzZSAyLCByb3VuZCB0byBgc2RgIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICAgKlxyXG4gICAqIElmIHRoZSBvcHRpb25hbCBgc2RgIGFyZ3VtZW50IGlzIHByZXNlbnQgdGhlbiByZXR1cm4gYmluYXJ5IGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAqXHJcbiAgICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDEgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50b0JpbmFyeSA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICAgIHJldHVybiB0b1N0cmluZ0JpbmFyeSh0aGlzLCAyLCBzZCwgcm0pO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIG1heGltdW0gb2YgYGRwYFxyXG4gICAqIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYCBvciBgcm91bmRpbmdgIGlmIGBybWAgaXMgb21pdHRlZC5cclxuICAgKlxyXG4gICAqIElmIGBkcGAgaXMgb21pdHRlZCwgcmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXMuIEludGVnZXIsIDAgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50b0RlY2ltYWxQbGFjZXMgPSBQLnRvRFAgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgICB2YXIgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIHggPSBuZXcgQ3Rvcih4KTtcclxuICAgIGlmIChkcCA9PT0gdm9pZCAwKSByZXR1cm4geDtcclxuXHJcbiAgICBjaGVja0ludDMyKGRwLCAwLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UoeCwgZHAgKyB4LmUgKyAxLCBybSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGluIGV4cG9uZW50aWFsIG5vdGF0aW9uIHJvdW5kZWQgdG9cclxuICAgKiBgZHBgIGZpeGVkIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXMuIEludGVnZXIsIDAgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50b0V4cG9uZW50aWFsID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gICAgdmFyIHN0cixcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmIChkcCA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHRydWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hlY2tJbnQzMihkcCwgMCwgTUFYX0RJR0lUUyk7XHJcblxyXG4gICAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG5cclxuICAgICAgeCA9IGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBkcCArIDEsIHJtKTtcclxuICAgICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgdHJ1ZSwgZHAgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBub3JtYWwgKGZpeGVkLXBvaW50KSBub3RhdGlvbiB0b1xyXG4gICAqIGBkcGAgZml4ZWQgZGVjaW1hbCBwbGFjZXMgYW5kIHJvdW5kZWQgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gIG9yIGByb3VuZGluZ2AgaWYgYHJtYCBpc1xyXG4gICAqIG9taXR0ZWQuXHJcbiAgICpcclxuICAgKiBBcyB3aXRoIEphdmFTY3JpcHQgbnVtYmVycywgKC0wKS50b0ZpeGVkKDApIGlzICcwJywgYnV0IGUuZy4gKC0wLjAwMDAxKS50b0ZpeGVkKDApIGlzICctMCcuXHJcbiAgICpcclxuICAgKiBbZHBdIHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzLiBJbnRlZ2VyLCAwIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqICgtMCkudG9GaXhlZCgwKSBpcyAnMCcsIGJ1dCAoLTAuMSkudG9GaXhlZCgwKSBpcyAnLTAnLlxyXG4gICAqICgtMCkudG9GaXhlZCgxKSBpcyAnMC4wJywgYnV0ICgtMC4wMSkudG9GaXhlZCgxKSBpcyAnLTAuMCcuXHJcbiAgICogKC0wKS50b0ZpeGVkKDMpIGlzICcwLjAwMCcuXHJcbiAgICogKC0wLjUpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9GaXhlZCA9IGZ1bmN0aW9uIChkcCwgcm0pIHtcclxuICAgIHZhciBzdHIsIHksXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoZHAgPT09IHZvaWQgMCkge1xyXG4gICAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNoZWNrSW50MzIoZHAsIDAsIE1BWF9ESUdJVFMpO1xyXG5cclxuICAgICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuXHJcbiAgICAgIHkgPSBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgZHAgKyB4LmUgKyAxLCBybSk7XHJcbiAgICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHksIGZhbHNlLCBkcCArIHkuZSArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRvIGRldGVybWluZSB3aGV0aGVyIHRvIGFkZCB0aGUgbWludXMgc2lnbiBsb29rIGF0IHRoZSB2YWx1ZSBiZWZvcmUgaXQgd2FzIHJvdW5kZWQsXHJcbiAgICAvLyBpLmUuIGxvb2sgYXQgYHhgIHJhdGhlciB0aGFuIGB5YC5cclxuICAgIHJldHVybiB4LmlzTmVnKCkgJiYgIXguaXNaZXJvKCkgPyAnLScgKyBzdHIgOiBzdHI7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGFuIGFycmF5IHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGFzIGEgc2ltcGxlIGZyYWN0aW9uIHdpdGggYW4gaW50ZWdlclxyXG4gICAqIG51bWVyYXRvciBhbmQgYW4gaW50ZWdlciBkZW5vbWluYXRvci5cclxuICAgKlxyXG4gICAqIFRoZSBkZW5vbWluYXRvciB3aWxsIGJlIGEgcG9zaXRpdmUgbm9uLXplcm8gdmFsdWUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBzcGVjaWZpZWQgbWF4aW11bVxyXG4gICAqIGRlbm9taW5hdG9yLiBJZiBhIG1heGltdW0gZGVub21pbmF0b3IgaXMgbm90IHNwZWNpZmllZCwgdGhlIGRlbm9taW5hdG9yIHdpbGwgYmUgdGhlIGxvd2VzdFxyXG4gICAqIHZhbHVlIG5lY2Vzc2FyeSB0byByZXByZXNlbnQgdGhlIG51bWJlciBleGFjdGx5LlxyXG4gICAqXHJcbiAgICogW21heERdIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IE1heGltdW0gZGVub21pbmF0b3IuIEludGVnZXIgPj0gMSBhbmQgPCBJbmZpbml0eS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9GcmFjdGlvbiA9IGZ1bmN0aW9uIChtYXhEKSB7XHJcbiAgICB2YXIgZCwgZDAsIGQxLCBkMiwgZSwgaywgbiwgbjAsIG4xLCBwciwgcSwgcixcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIHhkID0geC5kLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoIXhkKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgbjEgPSBkMCA9IG5ldyBDdG9yKDEpO1xyXG4gICAgZDEgPSBuMCA9IG5ldyBDdG9yKDApO1xyXG5cclxuICAgIGQgPSBuZXcgQ3RvcihkMSk7XHJcbiAgICBlID0gZC5lID0gZ2V0UHJlY2lzaW9uKHhkKSAtIHguZSAtIDE7XHJcbiAgICBrID0gZSAlIExPR19CQVNFO1xyXG4gICAgZC5kWzBdID0gbWF0aHBvdygxMCwgayA8IDAgPyBMT0dfQkFTRSArIGsgOiBrKTtcclxuXHJcbiAgICBpZiAobWF4RCA9PSBudWxsKSB7XHJcblxyXG4gICAgICAvLyBkIGlzIDEwKiplLCB0aGUgbWluaW11bSBtYXgtZGVub21pbmF0b3IgbmVlZGVkLlxyXG4gICAgICBtYXhEID0gZSA+IDAgPyBkIDogbjE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuID0gbmV3IEN0b3IobWF4RCk7XHJcbiAgICAgIGlmICghbi5pc0ludCgpIHx8IG4ubHQobjEpKSB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBuKTtcclxuICAgICAgbWF4RCA9IG4uZ3QoZCkgPyAoZSA+IDAgPyBkIDogbjEpIDogbjtcclxuICAgIH1cclxuXHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gICAgbiA9IG5ldyBDdG9yKGRpZ2l0c1RvU3RyaW5nKHhkKSk7XHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBlID0geGQubGVuZ3RoICogTE9HX0JBU0UgKiAyO1xyXG5cclxuICAgIGZvciAoOzspICB7XHJcbiAgICAgIHEgPSBkaXZpZGUobiwgZCwgMCwgMSwgMSk7XHJcbiAgICAgIGQyID0gZDAucGx1cyhxLnRpbWVzKGQxKSk7XHJcbiAgICAgIGlmIChkMi5jbXAobWF4RCkgPT0gMSkgYnJlYWs7XHJcbiAgICAgIGQwID0gZDE7XHJcbiAgICAgIGQxID0gZDI7XHJcbiAgICAgIGQyID0gbjE7XHJcbiAgICAgIG4xID0gbjAucGx1cyhxLnRpbWVzKGQyKSk7XHJcbiAgICAgIG4wID0gZDI7XHJcbiAgICAgIGQyID0gZDtcclxuICAgICAgZCA9IG4ubWludXMocS50aW1lcyhkMikpO1xyXG4gICAgICBuID0gZDI7XHJcbiAgICB9XHJcblxyXG4gICAgZDIgPSBkaXZpZGUobWF4RC5taW51cyhkMCksIGQxLCAwLCAxLCAxKTtcclxuICAgIG4wID0gbjAucGx1cyhkMi50aW1lcyhuMSkpO1xyXG4gICAgZDAgPSBkMC5wbHVzKGQyLnRpbWVzKGQxKSk7XHJcbiAgICBuMC5zID0gbjEucyA9IHgucztcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgd2hpY2ggZnJhY3Rpb24gaXMgY2xvc2VyIHRvIHgsIG4wL2QwIG9yIG4xL2QxP1xyXG4gICAgciA9IGRpdmlkZShuMSwgZDEsIGUsIDEpLm1pbnVzKHgpLmFicygpLmNtcChkaXZpZGUobjAsIGQwLCBlLCAxKS5taW51cyh4KS5hYnMoKSkgPCAxXHJcbiAgICAgICAgPyBbbjEsIGQxXSA6IFtuMCwgZDBdO1xyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIHI7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGluIGJhc2UgMTYsIHJvdW5kIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICAgKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gLlxyXG4gICAqXHJcbiAgICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCB0aGVuIHJldHVybiBiaW5hcnkgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICpcclxuICAgKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvSGV4YWRlY2ltYWwgPSBQLnRvSGV4ID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gICAgcmV0dXJuIHRvU3RyaW5nQmluYXJ5KHRoaXMsIDE2LCBzZCwgcm0pO1xyXG4gIH07XHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm5zIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5lYXJlc3QgbXVsdGlwbGUgb2YgYHlgIGluIHRoZSBkaXJlY3Rpb24gb2Ygcm91bmRpbmdcclxuICAgKiBtb2RlIGBybWAsIG9yIGBEZWNpbWFsLnJvdW5kaW5nYCBpZiBgcm1gIGlzIG9taXR0ZWQsIHRvIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBUaGUgcmV0dXJuIHZhbHVlIHdpbGwgYWx3YXlzIGhhdmUgdGhlIHNhbWUgc2lnbiBhcyB0aGlzIERlY2ltYWwsIHVubGVzcyBlaXRoZXIgdGhpcyBEZWNpbWFsXHJcbiAgICogb3IgYHlgIGlzIE5hTiwgaW4gd2hpY2ggY2FzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgYWxzbyBiZSBOYU4uXHJcbiAgICpcclxuICAgKiBUaGUgcmV0dXJuIHZhbHVlIGlzIG5vdCBhZmZlY3RlZCBieSB0aGUgdmFsdWUgb2YgYHByZWNpc2lvbmAuXHJcbiAgICpcclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBtYWduaXR1ZGUgdG8gcm91bmQgdG8gYSBtdWx0aXBsZSBvZi5cclxuICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKiAndG9OZWFyZXN0KCkgcm91bmRpbmcgbW9kZSBub3QgYW4gaW50ZWdlcjoge3JtfSdcclxuICAgKiAndG9OZWFyZXN0KCkgcm91bmRpbmcgbW9kZSBvdXQgb2YgcmFuZ2U6IHtybX0nXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvTmVhcmVzdCA9IGZ1bmN0aW9uICh5LCBybSkge1xyXG4gICAgdmFyIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICB4ID0gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgaWYgKHkgPT0gbnVsbCkge1xyXG5cclxuICAgICAgLy8gSWYgeCBpcyBub3QgZmluaXRlLCByZXR1cm4geC5cclxuICAgICAgaWYgKCF4LmQpIHJldHVybiB4O1xyXG5cclxuICAgICAgeSA9IG5ldyBDdG9yKDEpO1xyXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB5ID0gbmV3IEN0b3IoeSk7XHJcbiAgICAgIGlmIChybSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBJZiB4IGlzIG5vdCBmaW5pdGUsIHJldHVybiB4IGlmIHkgaXMgbm90IE5hTiwgZWxzZSBOYU4uXHJcbiAgICAgIGlmICgheC5kKSByZXR1cm4geS5zID8geCA6IHk7XHJcblxyXG4gICAgICAvLyBJZiB5IGlzIG5vdCBmaW5pdGUsIHJldHVybiBJbmZpbml0eSB3aXRoIHRoZSBzaWduIG9mIHggaWYgeSBpcyBJbmZpbml0eSwgZWxzZSBOYU4uXHJcbiAgICAgIGlmICgheS5kKSB7XHJcbiAgICAgICAgaWYgKHkucykgeS5zID0geC5zO1xyXG4gICAgICAgIHJldHVybiB5O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgeSBpcyBub3QgemVybywgY2FsY3VsYXRlIHRoZSBuZWFyZXN0IG11bHRpcGxlIG9mIHkgdG8geC5cclxuICAgIGlmICh5LmRbMF0pIHtcclxuICAgICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICAgICAgeCA9IGRpdmlkZSh4LCB5LCAwLCBybSwgMSkudGltZXMoeSk7XHJcbiAgICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgICAgZmluYWxpc2UoeCk7XHJcblxyXG4gICAgLy8gSWYgeSBpcyB6ZXJvLCByZXR1cm4gemVybyB3aXRoIHRoZSBzaWduIG9mIHguXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB5LnMgPSB4LnM7XHJcbiAgICAgIHggPSB5O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB4O1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGNvbnZlcnRlZCB0byBhIG51bWJlciBwcmltaXRpdmUuXHJcbiAgICogWmVybyBrZWVwcyBpdHMgc2lnbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9OdW1iZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gK3RoaXM7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGluIGJhc2UgOCwgcm91bmQgdG8gYHNkYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAuXHJcbiAgICpcclxuICAgKiBJZiB0aGUgb3B0aW9uYWwgYHNkYCBhcmd1bWVudCBpcyBwcmVzZW50IHRoZW4gcmV0dXJuIGJpbmFyeSBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgKlxyXG4gICAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9PY3RhbCA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICAgIHJldHVybiB0b1N0cmluZ0JpbmFyeSh0aGlzLCA4LCBzZCwgcm0pO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcmFpc2VkIHRvIHRoZSBwb3dlciBgeWAsIHJvdW5kZWRcclxuICAgKiB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogRUNNQVNjcmlwdCBjb21wbGlhbnQuXHJcbiAgICpcclxuICAgKiAgIHBvdyh4LCBOYU4pICAgICAgICAgICAgICAgICAgICAgICAgICAgPSBOYU5cclxuICAgKiAgIHBvdyh4LCDCsTApICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gMVxyXG5cclxuICAgKiAgIHBvdyhOYU4sIG5vbi16ZXJvKSAgICAgICAgICAgICAgICAgICAgPSBOYU5cclxuICAgKiAgIHBvdyhhYnMoeCkgPiAxLCArSW5maW5pdHkpICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICAgKiAgIHBvdyhhYnMoeCkgPiAxLCAtSW5maW5pdHkpICAgICAgICAgICAgPSArMFxyXG4gICAqICAgcG93KGFicyh4KSA9PSAxLCDCsUluZmluaXR5KSAgICAgICAgICAgPSBOYU5cclxuICAgKiAgIHBvdyhhYnMoeCkgPCAxLCArSW5maW5pdHkpICAgICAgICAgICAgPSArMFxyXG4gICAqICAgcG93KGFicyh4KSA8IDEsIC1JbmZpbml0eSkgICAgICAgICAgICA9ICtJbmZpbml0eVxyXG4gICAqICAgcG93KCtJbmZpbml0eSwgeSA+IDApICAgICAgICAgICAgICAgICA9ICtJbmZpbml0eVxyXG4gICAqICAgcG93KCtJbmZpbml0eSwgeSA8IDApICAgICAgICAgICAgICAgICA9ICswXHJcbiAgICogICBwb3coLUluZmluaXR5LCBvZGQgaW50ZWdlciA+IDApICAgICAgID0gLUluZmluaXR5XHJcbiAgICogICBwb3coLUluZmluaXR5LCBldmVuIGludGVnZXIgPiAwKSAgICAgID0gK0luZmluaXR5XHJcbiAgICogICBwb3coLUluZmluaXR5LCBvZGQgaW50ZWdlciA8IDApICAgICAgID0gLTBcclxuICAgKiAgIHBvdygtSW5maW5pdHksIGV2ZW4gaW50ZWdlciA8IDApICAgICAgPSArMFxyXG4gICAqICAgcG93KCswLCB5ID4gMCkgICAgICAgICAgICAgICAgICAgICAgICA9ICswXHJcbiAgICogICBwb3coKzAsIHkgPCAwKSAgICAgICAgICAgICAgICAgICAgICAgID0gK0luZmluaXR5XHJcbiAgICogICBwb3coLTAsIG9kZCBpbnRlZ2VyID4gMCkgICAgICAgICAgICAgID0gLTBcclxuICAgKiAgIHBvdygtMCwgZXZlbiBpbnRlZ2VyID4gMCkgICAgICAgICAgICAgPSArMFxyXG4gICAqICAgcG93KC0wLCBvZGQgaW50ZWdlciA8IDApICAgICAgICAgICAgICA9IC1JbmZpbml0eVxyXG4gICAqICAgcG93KC0wLCBldmVuIGludGVnZXIgPCAwKSAgICAgICAgICAgICA9ICtJbmZpbml0eVxyXG4gICAqICAgcG93KGZpbml0ZSB4IDwgMCwgZmluaXRlIG5vbi1pbnRlZ2VyKSA9IE5hTlxyXG4gICAqXHJcbiAgICogRm9yIG5vbi1pbnRlZ2VyIG9yIHZlcnkgbGFyZ2UgZXhwb25lbnRzIHBvdyh4LCB5KSBpcyBjYWxjdWxhdGVkIHVzaW5nXHJcbiAgICpcclxuICAgKiAgIHheeSA9IGV4cCh5KmxuKHgpKVxyXG4gICAqXHJcbiAgICogQXNzdW1pbmcgdGhlIGZpcnN0IDE1IHJvdW5kaW5nIGRpZ2l0cyBhcmUgZWFjaCBlcXVhbGx5IGxpa2VseSB0byBiZSBhbnkgZGlnaXQgMC05LCB0aGVcclxuICAgKiBwcm9iYWJpbGl0eSBvZiBhbiBpbmNvcnJlY3RseSByb3VuZGVkIHJlc3VsdFxyXG4gICAqIFAoWzQ5XTl7MTR9IHwgWzUwXTB7MTR9KSA9IDIgKiAwLjIgKiAxMF4tMTQgPSA0ZS0xNSA9IDEvMi41ZSsxNFxyXG4gICAqIGkuZS4gMSBpbiAyNTAsMDAwLDAwMCwwMDAsMDAwXHJcbiAgICpcclxuICAgKiBJZiBhIHJlc3VsdCBpcyBpbmNvcnJlY3RseSByb3VuZGVkIHRoZSBtYXhpbXVtIGVycm9yIHdpbGwgYmUgMSB1bHAgKHVuaXQgaW4gbGFzdCBwbGFjZSkuXHJcbiAgICpcclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBwb3dlciB0byB3aGljaCB0byByYWlzZSB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvUG93ZXIgPSBQLnBvdyA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICB2YXIgZSwgaywgcHIsIHIsIHJtLCBzLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIHluID0gKyh5ID0gbmV3IEN0b3IoeSkpO1xyXG5cclxuICAgIC8vIEVpdGhlciDCsUluZmluaXR5LCBOYU4gb3IgwrEwP1xyXG4gICAgaWYgKCF4LmQgfHwgIXkuZCB8fCAheC5kWzBdIHx8ICF5LmRbMF0pIHJldHVybiBuZXcgQ3RvcihtYXRocG93KCt4LCB5bikpO1xyXG5cclxuICAgIHggPSBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICBpZiAoeC5lcSgxKSkgcmV0dXJuIHg7XHJcblxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgICBpZiAoeS5lcSgxKSkgcmV0dXJuIGZpbmFsaXNlKHgsIHByLCBybSk7XHJcblxyXG4gICAgLy8geSBleHBvbmVudFxyXG4gICAgZSA9IG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcblxyXG4gICAgLy8gSWYgeSBpcyBhIHNtYWxsIGludGVnZXIgdXNlIHRoZSAnZXhwb25lbnRpYXRpb24gYnkgc3F1YXJpbmcnIGFsZ29yaXRobS5cclxuICAgIGlmIChlID49IHkuZC5sZW5ndGggLSAxICYmIChrID0geW4gPCAwID8gLXluIDogeW4pIDw9IE1BWF9TQUZFX0lOVEVHRVIpIHtcclxuICAgICAgciA9IGludFBvdyhDdG9yLCB4LCBrLCBwcik7XHJcbiAgICAgIHJldHVybiB5LnMgPCAwID8gbmV3IEN0b3IoMSkuZGl2KHIpIDogZmluYWxpc2UociwgcHIsIHJtKTtcclxuICAgIH1cclxuXHJcbiAgICBzID0geC5zO1xyXG5cclxuICAgIC8vIGlmIHggaXMgbmVnYXRpdmVcclxuICAgIGlmIChzIDwgMCkge1xyXG5cclxuICAgICAgLy8gaWYgeSBpcyBub3QgYW4gaW50ZWdlclxyXG4gICAgICBpZiAoZSA8IHkuZC5sZW5ndGggLSAxKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICAgIC8vIFJlc3VsdCBpcyBwb3NpdGl2ZSBpZiB4IGlzIG5lZ2F0aXZlIGFuZCB0aGUgbGFzdCBkaWdpdCBvZiBpbnRlZ2VyIHkgaXMgZXZlbi5cclxuICAgICAgaWYgKCh5LmRbZV0gJiAxKSA9PSAwKSBzID0gMTtcclxuXHJcbiAgICAgIC8vIGlmIHguZXEoLTEpXHJcbiAgICAgIGlmICh4LmUgPT0gMCAmJiB4LmRbMF0gPT0gMSAmJiB4LmQubGVuZ3RoID09IDEpIHtcclxuICAgICAgICB4LnMgPSBzO1xyXG4gICAgICAgIHJldHVybiB4O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRXN0aW1hdGUgcmVzdWx0IGV4cG9uZW50LlxyXG4gICAgLy8geF55ID0gMTBeZSwgIHdoZXJlIGUgPSB5ICogbG9nMTAoeClcclxuICAgIC8vIGxvZzEwKHgpID0gbG9nMTAoeF9zaWduaWZpY2FuZCkgKyB4X2V4cG9uZW50XHJcbiAgICAvLyBsb2cxMCh4X3NpZ25pZmljYW5kKSA9IGxuKHhfc2lnbmlmaWNhbmQpIC8gbG4oMTApXHJcbiAgICBrID0gbWF0aHBvdygreCwgeW4pO1xyXG4gICAgZSA9IGsgPT0gMCB8fCAhaXNGaW5pdGUoaylcclxuICAgICAgPyBtYXRoZmxvb3IoeW4gKiAoTWF0aC5sb2coJzAuJyArIGRpZ2l0c1RvU3RyaW5nKHguZCkpIC8gTWF0aC5MTjEwICsgeC5lICsgMSkpXHJcbiAgICAgIDogbmV3IEN0b3IoayArICcnKS5lO1xyXG5cclxuICAgIC8vIEV4cG9uZW50IGVzdGltYXRlIG1heSBiZSBpbmNvcnJlY3QgZS5nLiB4OiAwLjk5OTk5OTk5OTk5OTk5OTk5OSwgeTogMi4yOSwgZTogMCwgci5lOiAtMS5cclxuXHJcbiAgICAvLyBPdmVyZmxvdy91bmRlcmZsb3c/XHJcbiAgICBpZiAoZSA+IEN0b3IubWF4RSArIDEgfHwgZSA8IEN0b3IubWluRSAtIDEpIHJldHVybiBuZXcgQ3RvcihlID4gMCA/IHMgLyAwIDogMCk7XHJcblxyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICAgIEN0b3Iucm91bmRpbmcgPSB4LnMgPSAxO1xyXG5cclxuICAgIC8vIEVzdGltYXRlIHRoZSBleHRyYSBndWFyZCBkaWdpdHMgbmVlZGVkIHRvIGVuc3VyZSBmaXZlIGNvcnJlY3Qgcm91bmRpbmcgZGlnaXRzIGZyb21cclxuICAgIC8vIG5hdHVyYWxMb2dhcml0aG0oeCkuIEV4YW1wbGUgb2YgZmFpbHVyZSB3aXRob3V0IHRoZXNlIGV4dHJhIGRpZ2l0cyAocHJlY2lzaW9uOiAxMCk6XHJcbiAgICAvLyBuZXcgRGVjaW1hbCgyLjMyNDU2KS5wb3coJzIwODc5ODc0MzY1MzQ1NjYuNDY0MTEnKVxyXG4gICAgLy8gc2hvdWxkIGJlIDEuMTYyMzc3ODIzZSs3NjQ5MTQ5MDUxNzM4MTUsIGJ1dCBpcyAxLjE2MjM1NTgyM2UrNzY0OTE0OTA1MTczODE1XHJcbiAgICBrID0gTWF0aC5taW4oMTIsIChlICsgJycpLmxlbmd0aCk7XHJcblxyXG4gICAgLy8gciA9IHheeSA9IGV4cCh5KmxuKHgpKVxyXG4gICAgciA9IG5hdHVyYWxFeHBvbmVudGlhbCh5LnRpbWVzKG5hdHVyYWxMb2dhcml0aG0oeCwgcHIgKyBrKSksIHByKTtcclxuXHJcbiAgICAvLyByIG1heSBiZSBJbmZpbml0eSwgZS5nLiAoMC45OTk5OTk5OTk5OTk5OTk5KS5wb3coLTFlKzQwKVxyXG4gICAgaWYgKHIuZCkge1xyXG5cclxuICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIHJlcXVpcmVkIHByZWNpc2lvbiBwbHVzIGZpdmUgcm91bmRpbmcgZGlnaXRzLlxyXG4gICAgICByID0gZmluYWxpc2UociwgcHIgKyA1LCAxKTtcclxuXHJcbiAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdHMgYXJlIFs0OV05OTk5IG9yIFs1MF0wMDAwIGluY3JlYXNlIHRoZSBwcmVjaXNpb24gYnkgMTAgYW5kIHJlY2FsY3VsYXRlXHJcbiAgICAgIC8vIHRoZSByZXN1bHQuXHJcbiAgICAgIGlmIChjaGVja1JvdW5kaW5nRGlnaXRzKHIuZCwgcHIsIHJtKSkge1xyXG4gICAgICAgIGUgPSBwciArIDEwO1xyXG5cclxuICAgICAgICAvLyBUcnVuY2F0ZSB0byB0aGUgaW5jcmVhc2VkIHByZWNpc2lvbiBwbHVzIGZpdmUgcm91bmRpbmcgZGlnaXRzLlxyXG4gICAgICAgIHIgPSBmaW5hbGlzZShuYXR1cmFsRXhwb25lbnRpYWwoeS50aW1lcyhuYXR1cmFsTG9nYXJpdGhtKHgsIGUgKyBrKSksIGUpLCBlICsgNSwgMSk7XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGZvciAxNCBuaW5lcyBmcm9tIHRoZSAybmQgcm91bmRpbmcgZGlnaXQgKHRoZSBmaXJzdCByb3VuZGluZyBkaWdpdCBtYXkgYmUgNCBvciA5KS5cclxuICAgICAgICBpZiAoK2RpZ2l0c1RvU3RyaW5nKHIuZCkuc2xpY2UocHIgKyAxLCBwciArIDE1KSArIDEgPT0gMWUxNCkge1xyXG4gICAgICAgICAgciA9IGZpbmFsaXNlKHIsIHByICsgMSwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgci5zID0gcztcclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UociwgcHIsIHJtKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBgc2RgIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gICAqIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIFJldHVybiBleHBvbmVudGlhbCBub3RhdGlvbiBpZiBgc2RgIGlzIGxlc3MgdGhhbiB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBuZWNlc3NhcnkgdG8gcmVwcmVzZW50XHJcbiAgICogdGhlIGludGVnZXIgcGFydCBvZiB0aGUgdmFsdWUgaW4gbm9ybWFsIG5vdGF0aW9uLlxyXG4gICAqXHJcbiAgICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDEgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50b1ByZWNpc2lvbiA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICAgIHZhciBzdHIsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoc2QgPT09IHZvaWQgMCkge1xyXG4gICAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB4LmUgPD0gQ3Rvci50b0V4cE5lZyB8fCB4LmUgPj0gQ3Rvci50b0V4cFBvcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICAgIGlmIChybSA9PT0gdm9pZCAwKSBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICAgIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gICAgICB4ID0gZmluYWxpc2UobmV3IEN0b3IoeCksIHNkLCBybSk7XHJcbiAgICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHNkIDw9IHguZSB8fCB4LmUgPD0gQ3Rvci50b0V4cE5lZywgc2QpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB4LmlzTmVnKCkgJiYgIXguaXNaZXJvKCkgPyAnLScgKyBzdHIgOiBzdHI7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgbWF4aW11bSBvZiBgc2RgXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYCwgb3IgdG8gYHByZWNpc2lvbmAgYW5kIGByb3VuZGluZ2AgcmVzcGVjdGl2ZWx5IGlmXHJcbiAgICogb21pdHRlZC5cclxuICAgKlxyXG4gICAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqICd0b1NEKCkgZGlnaXRzIG91dCBvZiByYW5nZToge3NkfSdcclxuICAgKiAndG9TRCgpIGRpZ2l0cyBub3QgYW4gaW50ZWdlcjoge3NkfSdcclxuICAgKiAndG9TRCgpIHJvdW5kaW5nIG1vZGUgbm90IGFuIGludGVnZXI6IHtybX0nXHJcbiAgICogJ3RvU0QoKSByb3VuZGluZyBtb2RlIG91dCBvZiByYW5nZToge3JtfSdcclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9TaWduaWZpY2FudERpZ2l0cyA9IFAudG9TRCA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICAgIHZhciB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKHNkID09PSB2b2lkIDApIHtcclxuICAgICAgc2QgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XHJcblxyXG4gICAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgc2QsIHJtKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBSZXR1cm4gZXhwb25lbnRpYWwgbm90YXRpb24gaWYgdGhpcyBEZWNpbWFsIGhhcyBhIHBvc2l0aXZlIGV4cG9uZW50IGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhblxyXG4gICAqIGB0b0V4cFBvc2AsIG9yIGEgbmVnYXRpdmUgZXhwb25lbnQgZXF1YWwgdG8gb3IgbGVzcyB0aGFuIGB0b0V4cE5lZ2AuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgeC5lIDw9IEN0b3IudG9FeHBOZWcgfHwgeC5lID49IEN0b3IudG9FeHBQb3MpO1xyXG5cclxuICAgIHJldHVybiB4LmlzTmVnKCkgJiYgIXguaXNaZXJvKCkgPyAnLScgKyBzdHIgOiBzdHI7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCB0cnVuY2F0ZWQgdG8gYSB3aG9sZSBudW1iZXIuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRydW5jYXRlZCA9IFAudHJ1bmMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gZmluYWxpc2UobmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIHRoaXMuZSArIDEsIDEpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKiBVbmxpa2UgYHRvU3RyaW5nYCwgbmVnYXRpdmUgemVybyB3aWxsIGluY2x1ZGUgdGhlIG1pbnVzIHNpZ24uXHJcbiAgICpcclxuICAgKi9cclxuICBQLnZhbHVlT2YgPSBQLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHguZSA8PSBDdG9yLnRvRXhwTmVnIHx8IHguZSA+PSBDdG9yLnRvRXhwUG9zKTtcclxuXHJcbiAgICByZXR1cm4geC5pc05lZygpID8gJy0nICsgc3RyIDogc3RyO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gIC8vIEFkZCBhbGlhc2VzIHRvIG1hdGNoIEJpZ0RlY2ltYWwgbWV0aG9kIG5hbWVzLlxyXG4gIC8vIFAuYWRkID0gUC5wbHVzO1xyXG4gIFAuc3VidHJhY3QgPSBQLm1pbnVzO1xyXG4gIFAubXVsdGlwbHkgPSBQLnRpbWVzO1xyXG4gIFAuZGl2aWRlID0gUC5kaXY7XHJcbiAgUC5yZW1haW5kZXIgPSBQLm1vZDtcclxuICBQLmNvbXBhcmVUbyA9IFAuY21wO1xyXG4gIFAubmVnYXRlID0gUC5uZWc7XHJcbiAgICovXHJcblxyXG5cclxuICAvLyBIZWxwZXIgZnVuY3Rpb25zIGZvciBEZWNpbWFsLnByb3RvdHlwZSAoUCkgYW5kL29yIERlY2ltYWwgbWV0aG9kcywgYW5kIHRoZWlyIGNhbGxlcnMuXHJcblxyXG5cclxuICAvKlxyXG4gICAqICBkaWdpdHNUb1N0cmluZyAgICAgICAgICAgUC5jdWJlUm9vdCwgUC5sb2dhcml0aG0sIFAuc3F1YXJlUm9vdCwgUC50b0ZyYWN0aW9uLCBQLnRvUG93ZXIsXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pdGVUb1N0cmluZywgbmF0dXJhbEV4cG9uZW50aWFsLCBuYXR1cmFsTG9nYXJpdGhtXHJcbiAgICogIGNoZWNrSW50MzIgICAgICAgICAgICAgICBQLnRvRGVjaW1hbFBsYWNlcywgUC50b0V4cG9uZW50aWFsLCBQLnRvRml4ZWQsIFAudG9OZWFyZXN0LFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50b1ByZWNpc2lvbiwgUC50b1NpZ25pZmljYW50RGlnaXRzLCB0b1N0cmluZ0JpbmFyeSwgcmFuZG9tXHJcbiAgICogIGNoZWNrUm91bmRpbmdEaWdpdHMgICAgICBQLmxvZ2FyaXRobSwgUC50b1Bvd2VyLCBuYXR1cmFsRXhwb25lbnRpYWwsIG5hdHVyYWxMb2dhcml0aG1cclxuICAgKiAgY29udmVydEJhc2UgICAgICAgICAgICAgIHRvU3RyaW5nQmluYXJ5LCBwYXJzZU90aGVyXHJcbiAgICogIGNvcyAgICAgICAgICAgICAgICAgICAgICBQLmNvc1xyXG4gICAqICBkaXZpZGUgICAgICAgICAgICAgICAgICAgUC5hdGFuaCwgUC5jdWJlUm9vdCwgUC5kaXZpZGVkQnksIFAuZGl2aWRlZFRvSW50ZWdlckJ5LFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC5sb2dhcml0aG0sIFAubW9kdWxvLCBQLnNxdWFyZVJvb3QsIFAudGFuLCBQLnRhbmgsIFAudG9GcmFjdGlvbixcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudG9OZWFyZXN0LCB0b1N0cmluZ0JpbmFyeSwgbmF0dXJhbEV4cG9uZW50aWFsLCBuYXR1cmFsTG9nYXJpdGhtLFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdGF5bG9yU2VyaWVzLCBhdGFuMiwgcGFyc2VPdGhlclxyXG4gICAqICBmaW5hbGlzZSAgICAgICAgICAgICAgICAgUC5hYnNvbHV0ZVZhbHVlLCBQLmF0YW4sIFAuYXRhbmgsIFAuY2VpbCwgUC5jb3MsIFAuY29zaCxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAuY3ViZVJvb3QsIFAuZGl2aWRlZFRvSW50ZWdlckJ5LCBQLmZsb29yLCBQLmxvZ2FyaXRobSwgUC5taW51cyxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAubW9kdWxvLCBQLm5lZ2F0ZWQsIFAucGx1cywgUC5yb3VuZCwgUC5zaW4sIFAuc2luaCwgUC5zcXVhcmVSb290LFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50YW4sIFAudGltZXMsIFAudG9EZWNpbWFsUGxhY2VzLCBQLnRvRXhwb25lbnRpYWwsIFAudG9GaXhlZCxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudG9OZWFyZXN0LCBQLnRvUG93ZXIsIFAudG9QcmVjaXNpb24sIFAudG9TaWduaWZpY2FudERpZ2l0cyxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudHJ1bmNhdGVkLCBkaXZpZGUsIGdldExuMTAsIGdldFBpLCBuYXR1cmFsRXhwb25lbnRpYWwsXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBuYXR1cmFsTG9nYXJpdGhtLCBjZWlsLCBmbG9vciwgcm91bmQsIHRydW5jXHJcbiAgICogIGZpbml0ZVRvU3RyaW5nICAgICAgICAgICBQLnRvRXhwb25lbnRpYWwsIFAudG9GaXhlZCwgUC50b1ByZWNpc2lvbiwgUC50b1N0cmluZywgUC52YWx1ZU9mLFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9TdHJpbmdCaW5hcnlcclxuICAgKiAgZ2V0QmFzZTEwRXhwb25lbnQgICAgICAgIFAubWludXMsIFAucGx1cywgUC50aW1lcywgcGFyc2VPdGhlclxyXG4gICAqICBnZXRMbjEwICAgICAgICAgICAgICAgICAgUC5sb2dhcml0aG0sIG5hdHVyYWxMb2dhcml0aG1cclxuICAgKiAgZ2V0UGkgICAgICAgICAgICAgICAgICAgIFAuYWNvcywgUC5hc2luLCBQLmF0YW4sIHRvTGVzc1RoYW5IYWxmUGksIGF0YW4yXHJcbiAgICogIGdldFByZWNpc2lvbiAgICAgICAgICAgICBQLnByZWNpc2lvbiwgUC50b0ZyYWN0aW9uXHJcbiAgICogIGdldFplcm9TdHJpbmcgICAgICAgICAgICBkaWdpdHNUb1N0cmluZywgZmluaXRlVG9TdHJpbmdcclxuICAgKiAgaW50UG93ICAgICAgICAgICAgICAgICAgIFAudG9Qb3dlciwgcGFyc2VPdGhlclxyXG4gICAqICBpc09kZCAgICAgICAgICAgICAgICAgICAgdG9MZXNzVGhhbkhhbGZQaVxyXG4gICAqICBtYXhPck1pbiAgICAgICAgICAgICAgICAgbWF4LCBtaW5cclxuICAgKiAgbmF0dXJhbEV4cG9uZW50aWFsICAgICAgIFAubmF0dXJhbEV4cG9uZW50aWFsLCBQLnRvUG93ZXJcclxuICAgKiAgbmF0dXJhbExvZ2FyaXRobSAgICAgICAgIFAuYWNvc2gsIFAuYXNpbmgsIFAuYXRhbmgsIFAubG9nYXJpdGhtLCBQLm5hdHVyYWxMb2dhcml0aG0sXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRvUG93ZXIsIG5hdHVyYWxFeHBvbmVudGlhbFxyXG4gICAqICBub25GaW5pdGVUb1N0cmluZyAgICAgICAgZmluaXRlVG9TdHJpbmcsIHRvU3RyaW5nQmluYXJ5XHJcbiAgICogIHBhcnNlRGVjaW1hbCAgICAgICAgICAgICBEZWNpbWFsXHJcbiAgICogIHBhcnNlT3RoZXIgICAgICAgICAgICAgICBEZWNpbWFsXHJcbiAgICogIHNpbiAgICAgICAgICAgICAgICAgICAgICBQLnNpblxyXG4gICAqICB0YXlsb3JTZXJpZXMgICAgICAgICAgICAgUC5jb3NoLCBQLnNpbmgsIGNvcywgc2luXHJcbiAgICogIHRvTGVzc1RoYW5IYWxmUGkgICAgICAgICBQLmNvcywgUC5zaW5cclxuICAgKiAgdG9TdHJpbmdCaW5hcnkgICAgICAgICAgIFAudG9CaW5hcnksIFAudG9IZXhhZGVjaW1hbCwgUC50b09jdGFsXHJcbiAgICogIHRydW5jYXRlICAgICAgICAgICAgICAgICBpbnRQb3dcclxuICAgKlxyXG4gICAqICBUaHJvd3M6ICAgICAgICAgICAgICAgICAgUC5sb2dhcml0aG0sIFAucHJlY2lzaW9uLCBQLnRvRnJhY3Rpb24sIGNoZWNrSW50MzIsIGdldExuMTAsIGdldFBpLFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF0dXJhbExvZ2FyaXRobSwgY29uZmlnLCBwYXJzZU90aGVyLCByYW5kb20sIERlY2ltYWxcclxuICAgKi9cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGRpZ2l0c1RvU3RyaW5nKGQpIHtcclxuICAgIHZhciBpLCBrLCB3cyxcclxuICAgICAgaW5kZXhPZkxhc3RXb3JkID0gZC5sZW5ndGggLSAxLFxyXG4gICAgICBzdHIgPSAnJyxcclxuICAgICAgdyA9IGRbMF07XHJcblxyXG4gICAgaWYgKGluZGV4T2ZMYXN0V29yZCA+IDApIHtcclxuICAgICAgc3RyICs9IHc7XHJcbiAgICAgIGZvciAoaSA9IDE7IGkgPCBpbmRleE9mTGFzdFdvcmQ7IGkrKykge1xyXG4gICAgICAgIHdzID0gZFtpXSArICcnO1xyXG4gICAgICAgIGsgPSBMT0dfQkFTRSAtIHdzLmxlbmd0aDtcclxuICAgICAgICBpZiAoaykgc3RyICs9IGdldFplcm9TdHJpbmcoayk7XHJcbiAgICAgICAgc3RyICs9IHdzO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB3ID0gZFtpXTtcclxuICAgICAgd3MgPSB3ICsgJyc7XHJcbiAgICAgIGsgPSBMT0dfQkFTRSAtIHdzLmxlbmd0aDtcclxuICAgICAgaWYgKGspIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgfSBlbHNlIGlmICh3ID09PSAwKSB7XHJcbiAgICAgIHJldHVybiAnMCc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zIG9mIGxhc3Qgdy5cclxuICAgIGZvciAoOyB3ICUgMTAgPT09IDA7KSB3IC89IDEwO1xyXG5cclxuICAgIHJldHVybiBzdHIgKyB3O1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGNoZWNrSW50MzIoaSwgbWluLCBtYXgpIHtcclxuICAgIGlmIChpICE9PSB+fmkgfHwgaSA8IG1pbiB8fCBpID4gbWF4KSB7XHJcbiAgICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIGkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogQ2hlY2sgNSByb3VuZGluZyBkaWdpdHMgaWYgYHJlcGVhdGluZ2AgaXMgbnVsbCwgNCBvdGhlcndpc2UuXHJcbiAgICogYHJlcGVhdGluZyA9PSBudWxsYCBpZiBjYWxsZXIgaXMgYGxvZ2Agb3IgYHBvd2AsXHJcbiAgICogYHJlcGVhdGluZyAhPSBudWxsYCBpZiBjYWxsZXIgaXMgYG5hdHVyYWxMb2dhcml0aG1gIG9yIGBuYXR1cmFsRXhwb25lbnRpYWxgLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNoZWNrUm91bmRpbmdEaWdpdHMoZCwgaSwgcm0sIHJlcGVhdGluZykge1xyXG4gICAgdmFyIGRpLCBrLCByLCByZDtcclxuXHJcbiAgICAvLyBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgYXJyYXkgZC5cclxuICAgIGZvciAoayA9IGRbMF07IGsgPj0gMTA7IGsgLz0gMTApIC0taTtcclxuXHJcbiAgICAvLyBJcyB0aGUgcm91bmRpbmcgZGlnaXQgaW4gdGhlIGZpcnN0IHdvcmQgb2YgZD9cclxuICAgIGlmICgtLWkgPCAwKSB7XHJcbiAgICAgIGkgKz0gTE9HX0JBU0U7XHJcbiAgICAgIGRpID0gMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRpID0gTWF0aC5jZWlsKChpICsgMSkgLyBMT0dfQkFTRSk7XHJcbiAgICAgIGkgJT0gTE9HX0JBU0U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaSBpcyB0aGUgaW5kZXggKDAgLSA2KSBvZiB0aGUgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAvLyBFLmcuIGlmIHdpdGhpbiB0aGUgd29yZCAzNDg3NTYzIHRoZSBmaXJzdCByb3VuZGluZyBkaWdpdCBpcyA1LFxyXG4gICAgLy8gdGhlbiBpID0gNCwgayA9IDEwMDAsIHJkID0gMzQ4NzU2MyAlIDEwMDAgPSA1NjNcclxuICAgIGsgPSBtYXRocG93KDEwLCBMT0dfQkFTRSAtIGkpO1xyXG4gICAgcmQgPSBkW2RpXSAlIGsgfCAwO1xyXG5cclxuICAgIGlmIChyZXBlYXRpbmcgPT0gbnVsbCkge1xyXG4gICAgICBpZiAoaSA8IDMpIHtcclxuICAgICAgICBpZiAoaSA9PSAwKSByZCA9IHJkIC8gMTAwIHwgMDtcclxuICAgICAgICBlbHNlIGlmIChpID09IDEpIHJkID0gcmQgLyAxMCB8IDA7XHJcbiAgICAgICAgciA9IHJtIDwgNCAmJiByZCA9PSA5OTk5OSB8fCBybSA+IDMgJiYgcmQgPT0gNDk5OTkgfHwgcmQgPT0gNTAwMDAgfHwgcmQgPT0gMDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByID0gKHJtIDwgNCAmJiByZCArIDEgPT0gayB8fCBybSA+IDMgJiYgcmQgKyAxID09IGsgLyAyKSAmJlxyXG4gICAgICAgICAgKGRbZGkgKyAxXSAvIGsgLyAxMDAgfCAwKSA9PSBtYXRocG93KDEwLCBpIC0gMikgLSAxIHx8XHJcbiAgICAgICAgICAgIChyZCA9PSBrIC8gMiB8fCByZCA9PSAwKSAmJiAoZFtkaSArIDFdIC8gayAvIDEwMCB8IDApID09IDA7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChpIDwgNCkge1xyXG4gICAgICAgIGlmIChpID09IDApIHJkID0gcmQgLyAxMDAwIHwgMDtcclxuICAgICAgICBlbHNlIGlmIChpID09IDEpIHJkID0gcmQgLyAxMDAgfCAwO1xyXG4gICAgICAgIGVsc2UgaWYgKGkgPT0gMikgcmQgPSByZCAvIDEwIHwgMDtcclxuICAgICAgICByID0gKHJlcGVhdGluZyB8fCBybSA8IDQpICYmIHJkID09IDk5OTkgfHwgIXJlcGVhdGluZyAmJiBybSA+IDMgJiYgcmQgPT0gNDk5OTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByID0gKChyZXBlYXRpbmcgfHwgcm0gPCA0KSAmJiByZCArIDEgPT0gayB8fFxyXG4gICAgICAgICghcmVwZWF0aW5nICYmIHJtID4gMykgJiYgcmQgKyAxID09IGsgLyAyKSAmJlxyXG4gICAgICAgICAgKGRbZGkgKyAxXSAvIGsgLyAxMDAwIHwgMCkgPT0gbWF0aHBvdygxMCwgaSAtIDMpIC0gMTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIENvbnZlcnQgc3RyaW5nIG9mIGBiYXNlSW5gIHRvIGFuIGFycmF5IG9mIG51bWJlcnMgb2YgYGJhc2VPdXRgLlxyXG4gIC8vIEVnLiBjb252ZXJ0QmFzZSgnMjU1JywgMTAsIDE2KSByZXR1cm5zIFsxNSwgMTVdLlxyXG4gIC8vIEVnLiBjb252ZXJ0QmFzZSgnZmYnLCAxNiwgMTApIHJldHVybnMgWzIsIDUsIDVdLlxyXG4gIGZ1bmN0aW9uIGNvbnZlcnRCYXNlKHN0ciwgYmFzZUluLCBiYXNlT3V0KSB7XHJcbiAgICB2YXIgaixcclxuICAgICAgYXJyID0gWzBdLFxyXG4gICAgICBhcnJMLFxyXG4gICAgICBpID0gMCxcclxuICAgICAgc3RyTCA9IHN0ci5sZW5ndGg7XHJcblxyXG4gICAgZm9yICg7IGkgPCBzdHJMOykge1xyXG4gICAgICBmb3IgKGFyckwgPSBhcnIubGVuZ3RoOyBhcnJMLS07KSBhcnJbYXJyTF0gKj0gYmFzZUluO1xyXG4gICAgICBhcnJbMF0gKz0gTlVNRVJBTFMuaW5kZXhPZihzdHIuY2hhckF0KGkrKykpO1xyXG4gICAgICBmb3IgKGogPSAwOyBqIDwgYXJyLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgaWYgKGFycltqXSA+IGJhc2VPdXQgLSAxKSB7XHJcbiAgICAgICAgICBpZiAoYXJyW2ogKyAxXSA9PT0gdm9pZCAwKSBhcnJbaiArIDFdID0gMDtcclxuICAgICAgICAgIGFycltqICsgMV0gKz0gYXJyW2pdIC8gYmFzZU91dCB8IDA7XHJcbiAgICAgICAgICBhcnJbal0gJT0gYmFzZU91dDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXJyLnJldmVyc2UoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIGNvcyh4KSA9IDEgLSB4XjIvMiEgKyB4XjQvNCEgLSAuLi5cclxuICAgKiB8eHwgPCBwaS8yXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBjb3NpbmUoQ3RvciwgeCkge1xyXG4gICAgdmFyIGssIHksXHJcbiAgICAgIGxlbiA9IHguZC5sZW5ndGg7XHJcblxyXG4gICAgLy8gQXJndW1lbnQgcmVkdWN0aW9uOiBjb3MoNHgpID0gOCooY29zXjQoeCkgLSBjb3NeMih4KSkgKyAxXHJcbiAgICAvLyBpLmUuIGNvcyh4KSA9IDgqKGNvc140KHgvNCkgLSBjb3NeMih4LzQpKSArIDFcclxuXHJcbiAgICAvLyBFc3RpbWF0ZSB0aGUgb3B0aW11bSBudW1iZXIgb2YgdGltZXMgdG8gdXNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uXHJcbiAgICBpZiAobGVuIDwgMzIpIHtcclxuICAgICAgayA9IE1hdGguY2VpbChsZW4gLyAzKTtcclxuICAgICAgeSA9IE1hdGgucG93KDQsIC1rKS50b1N0cmluZygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgayA9IDE2O1xyXG4gICAgICB5ID0gJzIuMzI4MzA2NDM2NTM4Njk2Mjg5MDYyNWUtMTAnO1xyXG4gICAgfVxyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uICs9IGs7XHJcblxyXG4gICAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAxLCB4LnRpbWVzKHkpLCBuZXcgQ3RvcigxKSk7XHJcblxyXG4gICAgLy8gUmV2ZXJzZSBhcmd1bWVudCByZWR1Y3Rpb25cclxuICAgIGZvciAodmFyIGkgPSBrOyBpLS07KSB7XHJcbiAgICAgIHZhciBjb3MyeCA9IHgudGltZXMoeCk7XHJcbiAgICAgIHggPSBjb3MyeC50aW1lcyhjb3MyeCkubWludXMoY29zMngpLnRpbWVzKDgpLnBsdXMoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gLT0gaztcclxuXHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFBlcmZvcm0gZGl2aXNpb24gaW4gdGhlIHNwZWNpZmllZCBiYXNlLlxyXG4gICAqL1xyXG4gIHZhciBkaXZpZGUgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIC8vIEFzc3VtZXMgbm9uLXplcm8geCBhbmQgaywgYW5kIGhlbmNlIG5vbi16ZXJvIHJlc3VsdC5cclxuICAgIGZ1bmN0aW9uIG11bHRpcGx5SW50ZWdlcih4LCBrLCBiYXNlKSB7XHJcbiAgICAgIHZhciB0ZW1wLFxyXG4gICAgICAgIGNhcnJ5ID0gMCxcclxuICAgICAgICBpID0geC5sZW5ndGg7XHJcblxyXG4gICAgICBmb3IgKHggPSB4LnNsaWNlKCk7IGktLTspIHtcclxuICAgICAgICB0ZW1wID0geFtpXSAqIGsgKyBjYXJyeTtcclxuICAgICAgICB4W2ldID0gdGVtcCAlIGJhc2UgfCAwO1xyXG4gICAgICAgIGNhcnJ5ID0gdGVtcCAvIGJhc2UgfCAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY2FycnkpIHgudW5zaGlmdChjYXJyeSk7XHJcblxyXG4gICAgICByZXR1cm4geDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb21wYXJlKGEsIGIsIGFMLCBiTCkge1xyXG4gICAgICB2YXIgaSwgcjtcclxuXHJcbiAgICAgIGlmIChhTCAhPSBiTCkge1xyXG4gICAgICAgIHIgPSBhTCA+IGJMID8gMSA6IC0xO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvciAoaSA9IHIgPSAwOyBpIDwgYUw7IGkrKykge1xyXG4gICAgICAgICAgaWYgKGFbaV0gIT0gYltpXSkge1xyXG4gICAgICAgICAgICByID0gYVtpXSA+IGJbaV0gPyAxIDogLTE7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc3VidHJhY3QoYSwgYiwgYUwsIGJhc2UpIHtcclxuICAgICAgdmFyIGkgPSAwO1xyXG5cclxuICAgICAgLy8gU3VidHJhY3QgYiBmcm9tIGEuXHJcbiAgICAgIGZvciAoOyBhTC0tOykge1xyXG4gICAgICAgIGFbYUxdIC09IGk7XHJcbiAgICAgICAgaSA9IGFbYUxdIDwgYlthTF0gPyAxIDogMDtcclxuICAgICAgICBhW2FMXSA9IGkgKiBiYXNlICsgYVthTF0gLSBiW2FMXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUmVtb3ZlIGxlYWRpbmcgemVyb3MuXHJcbiAgICAgIGZvciAoOyAhYVswXSAmJiBhLmxlbmd0aCA+IDE7KSBhLnNoaWZ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh4LCB5LCBwciwgcm0sIGRwLCBiYXNlKSB7XHJcbiAgICAgIHZhciBjbXAsIGUsIGksIGssIGxvZ0Jhc2UsIG1vcmUsIHByb2QsIHByb2RMLCBxLCBxZCwgcmVtLCByZW1MLCByZW0wLCBzZCwgdCwgeGksIHhMLCB5ZDAsXHJcbiAgICAgICAgeUwsIHl6LFxyXG4gICAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICAgIHNpZ24gPSB4LnMgPT0geS5zID8gMSA6IC0xLFxyXG4gICAgICAgIHhkID0geC5kLFxyXG4gICAgICAgIHlkID0geS5kO1xyXG5cclxuICAgICAgLy8gRWl0aGVyIE5hTiwgSW5maW5pdHkgb3IgMD9cclxuICAgICAgaWYgKCF4ZCB8fCAheGRbMF0gfHwgIXlkIHx8ICF5ZFswXSkge1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEN0b3IoLy8gUmV0dXJuIE5hTiBpZiBlaXRoZXIgTmFOLCBvciBib3RoIEluZmluaXR5IG9yIDAuXHJcbiAgICAgICAgICAheC5zIHx8ICF5LnMgfHwgKHhkID8geWQgJiYgeGRbMF0gPT0geWRbMF0gOiAheWQpID8gTmFOIDpcclxuXHJcbiAgICAgICAgICAvLyBSZXR1cm4gwrEwIGlmIHggaXMgMCBvciB5IGlzIMKxSW5maW5pdHksIG9yIHJldHVybiDCsUluZmluaXR5IGFzIHkgaXMgMC5cclxuICAgICAgICAgIHhkICYmIHhkWzBdID09IDAgfHwgIXlkID8gc2lnbiAqIDAgOiBzaWduIC8gMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChiYXNlKSB7XHJcbiAgICAgICAgbG9nQmFzZSA9IDE7XHJcbiAgICAgICAgZSA9IHguZSAtIHkuZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBiYXNlID0gQkFTRTtcclxuICAgICAgICBsb2dCYXNlID0gTE9HX0JBU0U7XHJcbiAgICAgICAgZSA9IG1hdGhmbG9vcih4LmUgLyBsb2dCYXNlKSAtIG1hdGhmbG9vcih5LmUgLyBsb2dCYXNlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgeUwgPSB5ZC5sZW5ndGg7XHJcbiAgICAgIHhMID0geGQubGVuZ3RoO1xyXG4gICAgICBxID0gbmV3IEN0b3Ioc2lnbik7XHJcbiAgICAgIHFkID0gcS5kID0gW107XHJcblxyXG4gICAgICAvLyBSZXN1bHQgZXhwb25lbnQgbWF5IGJlIG9uZSBsZXNzIHRoYW4gZS5cclxuICAgICAgLy8gVGhlIGRpZ2l0IGFycmF5IG9mIGEgRGVjaW1hbCBmcm9tIHRvU3RyaW5nQmluYXJ5IG1heSBoYXZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgICBmb3IgKGkgPSAwOyB5ZFtpXSA9PSAoeGRbaV0gfHwgMCk7IGkrKyk7XHJcblxyXG4gICAgICBpZiAoeWRbaV0gPiAoeGRbaV0gfHwgMCkpIGUtLTtcclxuXHJcbiAgICAgIGlmIChwciA9PSBudWxsKSB7XHJcbiAgICAgICAgc2QgPSBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgICAgfSBlbHNlIGlmIChkcCkge1xyXG4gICAgICAgIHNkID0gcHIgKyAoeC5lIC0geS5lKSArIDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2QgPSBwcjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNkIDwgMCkge1xyXG4gICAgICAgIHFkLnB1c2goMSk7XHJcbiAgICAgICAgbW9yZSA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIENvbnZlcnQgcHJlY2lzaW9uIGluIG51bWJlciBvZiBiYXNlIDEwIGRpZ2l0cyB0byBiYXNlIDFlNyBkaWdpdHMuXHJcbiAgICAgICAgc2QgPSBzZCAvIGxvZ0Jhc2UgKyAyIHwgMDtcclxuICAgICAgICBpID0gMDtcclxuXHJcbiAgICAgICAgLy8gZGl2aXNvciA8IDFlN1xyXG4gICAgICAgIGlmICh5TCA9PSAxKSB7XHJcbiAgICAgICAgICBrID0gMDtcclxuICAgICAgICAgIHlkID0geWRbMF07XHJcbiAgICAgICAgICBzZCsrO1xyXG5cclxuICAgICAgICAgIC8vIGsgaXMgdGhlIGNhcnJ5LlxyXG4gICAgICAgICAgZm9yICg7IChpIDwgeEwgfHwgaykgJiYgc2QtLTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHQgPSBrICogYmFzZSArICh4ZFtpXSB8fCAwKTtcclxuICAgICAgICAgICAgcWRbaV0gPSB0IC8geWQgfCAwO1xyXG4gICAgICAgICAgICBrID0gdCAlIHlkIHwgMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBtb3JlID0gayB8fCBpIDwgeEw7XHJcblxyXG4gICAgICAgIC8vIGRpdmlzb3IgPj0gMWU3XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAvLyBOb3JtYWxpc2UgeGQgYW5kIHlkIHNvIGhpZ2hlc3Qgb3JkZXIgZGlnaXQgb2YgeWQgaXMgPj0gYmFzZS8yXHJcbiAgICAgICAgICBrID0gYmFzZSAvICh5ZFswXSArIDEpIHwgMDtcclxuXHJcbiAgICAgICAgICBpZiAoayA+IDEpIHtcclxuICAgICAgICAgICAgeWQgPSBtdWx0aXBseUludGVnZXIoeWQsIGssIGJhc2UpO1xyXG4gICAgICAgICAgICB4ZCA9IG11bHRpcGx5SW50ZWdlcih4ZCwgaywgYmFzZSk7XHJcbiAgICAgICAgICAgIHlMID0geWQubGVuZ3RoO1xyXG4gICAgICAgICAgICB4TCA9IHhkLmxlbmd0aDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB4aSA9IHlMO1xyXG4gICAgICAgICAgcmVtID0geGQuc2xpY2UoMCwgeUwpO1xyXG4gICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgLy8gQWRkIHplcm9zIHRvIG1ha2UgcmVtYWluZGVyIGFzIGxvbmcgYXMgZGl2aXNvci5cclxuICAgICAgICAgIGZvciAoOyByZW1MIDwgeUw7KSByZW1bcmVtTCsrXSA9IDA7XHJcblxyXG4gICAgICAgICAgeXogPSB5ZC5zbGljZSgpO1xyXG4gICAgICAgICAgeXoudW5zaGlmdCgwKTtcclxuICAgICAgICAgIHlkMCA9IHlkWzBdO1xyXG5cclxuICAgICAgICAgIGlmICh5ZFsxXSA+PSBiYXNlIC8gMikgKyt5ZDA7XHJcblxyXG4gICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBrID0gMDtcclxuXHJcbiAgICAgICAgICAgIC8vIENvbXBhcmUgZGl2aXNvciBhbmQgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICBjbXAgPSBjb21wYXJlKHlkLCByZW0sIHlMLCByZW1MKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIGRpdmlzb3IgPCByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIGlmIChjbXAgPCAwKSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSB0cmlhbCBkaWdpdCwgay5cclxuICAgICAgICAgICAgICByZW0wID0gcmVtWzBdO1xyXG4gICAgICAgICAgICAgIGlmICh5TCAhPSByZW1MKSByZW0wID0gcmVtMCAqIGJhc2UgKyAocmVtWzFdIHx8IDApO1xyXG5cclxuICAgICAgICAgICAgICAvLyBrIHdpbGwgYmUgaG93IG1hbnkgdGltZXMgdGhlIGRpdmlzb3IgZ29lcyBpbnRvIHRoZSBjdXJyZW50IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICBrID0gcmVtMCAvIHlkMCB8IDA7XHJcblxyXG4gICAgICAgICAgICAgIC8vICBBbGdvcml0aG06XHJcbiAgICAgICAgICAgICAgLy8gIDEuIHByb2R1Y3QgPSBkaXZpc29yICogdHJpYWwgZGlnaXQgKGspXHJcbiAgICAgICAgICAgICAgLy8gIDIuIGlmIHByb2R1Y3QgPiByZW1haW5kZXI6IHByb2R1Y3QgLT0gZGl2aXNvciwgay0tXHJcbiAgICAgICAgICAgICAgLy8gIDMuIHJlbWFpbmRlciAtPSBwcm9kdWN0XHJcbiAgICAgICAgICAgICAgLy8gIDQuIGlmIHByb2R1Y3Qgd2FzIDwgcmVtYWluZGVyIGF0IDI6XHJcbiAgICAgICAgICAgICAgLy8gICAgNS4gY29tcGFyZSBuZXcgcmVtYWluZGVyIGFuZCBkaXZpc29yXHJcbiAgICAgICAgICAgICAgLy8gICAgNi4gSWYgcmVtYWluZGVyID4gZGl2aXNvcjogcmVtYWluZGVyIC09IGRpdmlzb3IsIGsrK1xyXG5cclxuICAgICAgICAgICAgICBpZiAoayA+IDEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChrID49IGJhc2UpIGsgPSBiYXNlIC0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBwcm9kdWN0ID0gZGl2aXNvciAqIHRyaWFsIGRpZ2l0LlxyXG4gICAgICAgICAgICAgICAgcHJvZCA9IG11bHRpcGx5SW50ZWdlcih5ZCwgaywgYmFzZSk7XHJcbiAgICAgICAgICAgICAgICBwcm9kTCA9IHByb2QubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ29tcGFyZSBwcm9kdWN0IGFuZCByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgICBjbXAgPSBjb21wYXJlKHByb2QsIHJlbSwgcHJvZEwsIHJlbUwpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHByb2R1Y3QgPiByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgICBpZiAoY21wID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgay0tO1xyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgZGl2aXNvciBmcm9tIHByb2R1Y3QuXHJcbiAgICAgICAgICAgICAgICAgIHN1YnRyYWN0KHByb2QsIHlMIDwgcHJvZEwgPyB5eiA6IHlkLCBwcm9kTCwgYmFzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjbXAgaXMgLTEuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiBrIGlzIDAsIHRoZXJlIGlzIG5vIG5lZWQgdG8gY29tcGFyZSB5ZCBhbmQgcmVtIGFnYWluIGJlbG93LCBzbyBjaGFuZ2UgY21wIHRvIDFcclxuICAgICAgICAgICAgICAgIC8vIHRvIGF2b2lkIGl0LiBJZiBrIGlzIDEgdGhlcmUgaXMgYSBuZWVkIHRvIGNvbXBhcmUgeWQgYW5kIHJlbSBhZ2FpbiBiZWxvdy5cclxuICAgICAgICAgICAgICAgIGlmIChrID09IDApIGNtcCA9IGsgPSAxO1xyXG4gICAgICAgICAgICAgICAgcHJvZCA9IHlkLnNsaWNlKCk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBwcm9kTCA9IHByb2QubGVuZ3RoO1xyXG4gICAgICAgICAgICAgIGlmIChwcm9kTCA8IHJlbUwpIHByb2QudW5zaGlmdCgwKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gU3VidHJhY3QgcHJvZHVjdCBmcm9tIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICBzdWJ0cmFjdChyZW0sIHByb2QsIHJlbUwsIGJhc2UpO1xyXG5cclxuICAgICAgICAgICAgICAvLyBJZiBwcm9kdWN0IHdhcyA8IHByZXZpb3VzIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICBpZiAoY21wID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDb21wYXJlIGRpdmlzb3IgYW5kIG5ldyByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgICBjbXAgPSBjb21wYXJlKHlkLCByZW0sIHlMLCByZW1MKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiBkaXZpc29yIDwgbmV3IHJlbWFpbmRlciwgc3VidHJhY3QgZGl2aXNvciBmcm9tIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAgIGlmIChjbXAgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICAgIGsrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IGRpdmlzb3IgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgICAgIHN1YnRyYWN0KHJlbSwgeUwgPCByZW1MID8geXogOiB5ZCwgcmVtTCwgYmFzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjbXAgPT09IDApIHtcclxuICAgICAgICAgICAgICBrKys7XHJcbiAgICAgICAgICAgICAgcmVtID0gWzBdO1xyXG4gICAgICAgICAgICB9ICAgIC8vIGlmIGNtcCA9PT0gMSwgayB3aWxsIGJlIDBcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCB0aGUgbmV4dCBkaWdpdCwgaywgdG8gdGhlIHJlc3VsdCBhcnJheS5cclxuICAgICAgICAgICAgcWRbaSsrXSA9IGs7XHJcblxyXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgaWYgKGNtcCAmJiByZW1bMF0pIHtcclxuICAgICAgICAgICAgICByZW1bcmVtTCsrXSA9IHhkW3hpXSB8fCAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJlbSA9IFt4ZFt4aV1dO1xyXG4gICAgICAgICAgICAgIHJlbUwgPSAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfSB3aGlsZSAoKHhpKysgPCB4TCB8fCByZW1bMF0gIT09IHZvaWQgMCkgJiYgc2QtLSk7XHJcblxyXG4gICAgICAgICAgbW9yZSA9IHJlbVswXSAhPT0gdm9pZCAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTGVhZGluZyB6ZXJvP1xyXG4gICAgICAgIGlmICghcWRbMF0pIHFkLnNoaWZ0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGxvZ0Jhc2UgaXMgMSB3aGVuIGRpdmlkZSBpcyBiZWluZyB1c2VkIGZvciBiYXNlIGNvbnZlcnNpb24uXHJcbiAgICAgIGlmIChsb2dCYXNlID09IDEpIHtcclxuICAgICAgICBxLmUgPSBlO1xyXG4gICAgICAgIGluZXhhY3QgPSBtb3JlO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBUbyBjYWxjdWxhdGUgcS5lLCBmaXJzdCBnZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgcWRbMF0uXHJcbiAgICAgICAgZm9yIChpID0gMSwgayA9IHFkWzBdOyBrID49IDEwOyBrIC89IDEwKSBpKys7XHJcbiAgICAgICAgcS5lID0gaSArIGUgKiBsb2dCYXNlIC0gMTtcclxuXHJcbiAgICAgICAgZmluYWxpc2UocSwgZHAgPyBwciArIHEuZSArIDEgOiBwciwgcm0sIG1vcmUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcTtcclxuICAgIH07XHJcbiAgfSkoKTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUm91bmQgYHhgIHRvIGBzZGAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICAgKiBDaGVjayBmb3Igb3Zlci91bmRlci1mbG93LlxyXG4gICAqL1xyXG4gICBmdW5jdGlvbiBmaW5hbGlzZSh4LCBzZCwgcm0sIGlzVHJ1bmNhdGVkKSB7XHJcbiAgICB2YXIgZGlnaXRzLCBpLCBqLCBrLCByZCwgcm91bmRVcCwgdywgeGQsIHhkaSxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgLy8gRG9uJ3Qgcm91bmQgaWYgc2QgaXMgbnVsbCBvciB1bmRlZmluZWQuXHJcbiAgICBvdXQ6IGlmIChzZCAhPSBudWxsKSB7XHJcbiAgICAgIHhkID0geC5kO1xyXG5cclxuICAgICAgLy8gSW5maW5pdHkvTmFOLlxyXG4gICAgICBpZiAoIXhkKSByZXR1cm4geDtcclxuXHJcbiAgICAgIC8vIHJkOiB0aGUgcm91bmRpbmcgZGlnaXQsIGkuZS4gdGhlIGRpZ2l0IGFmdGVyIHRoZSBkaWdpdCB0aGF0IG1heSBiZSByb3VuZGVkIHVwLlxyXG4gICAgICAvLyB3OiB0aGUgd29yZCBvZiB4ZCBjb250YWluaW5nIHJkLCBhIGJhc2UgMWU3IG51bWJlci5cclxuICAgICAgLy8geGRpOiB0aGUgaW5kZXggb2YgdyB3aXRoaW4geGQuXHJcbiAgICAgIC8vIGRpZ2l0czogdGhlIG51bWJlciBvZiBkaWdpdHMgb2Ygdy5cclxuICAgICAgLy8gaTogd2hhdCB3b3VsZCBiZSB0aGUgaW5kZXggb2YgcmQgd2l0aGluIHcgaWYgYWxsIHRoZSBudW1iZXJzIHdlcmUgNyBkaWdpdHMgbG9uZyAoaS5lLiBpZlxyXG4gICAgICAvLyB0aGV5IGhhZCBsZWFkaW5nIHplcm9zKVxyXG4gICAgICAvLyBqOiBpZiA+IDAsIHRoZSBhY3R1YWwgaW5kZXggb2YgcmQgd2l0aGluIHcgKGlmIDwgMCwgcmQgaXMgYSBsZWFkaW5nIHplcm8pLlxyXG5cclxuICAgICAgLy8gR2V0IHRoZSBsZW5ndGggb2YgdGhlIGZpcnN0IHdvcmQgb2YgdGhlIGRpZ2l0cyBhcnJheSB4ZC5cclxuICAgICAgZm9yIChkaWdpdHMgPSAxLCBrID0geGRbMF07IGsgPj0gMTA7IGsgLz0gMTApIGRpZ2l0cysrO1xyXG4gICAgICBpID0gc2QgLSBkaWdpdHM7XHJcblxyXG4gICAgICAvLyBJcyB0aGUgcm91bmRpbmcgZGlnaXQgaW4gdGhlIGZpcnN0IHdvcmQgb2YgeGQ/XHJcbiAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgIGkgKz0gTE9HX0JBU0U7XHJcbiAgICAgICAgaiA9IHNkO1xyXG4gICAgICAgIHcgPSB4ZFt4ZGkgPSAwXTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSByb3VuZGluZyBkaWdpdCBhdCBpbmRleCBqIG9mIHcuXHJcbiAgICAgICAgcmQgPSB3IC8gbWF0aHBvdygxMCwgZGlnaXRzIC0gaiAtIDEpICUgMTAgfCAwO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHhkaSA9IE1hdGguY2VpbCgoaSArIDEpIC8gTE9HX0JBU0UpO1xyXG4gICAgICAgIGsgPSB4ZC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHhkaSA+PSBrKSB7XHJcbiAgICAgICAgICBpZiAoaXNUcnVuY2F0ZWQpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIE5lZWRlZCBieSBgbmF0dXJhbEV4cG9uZW50aWFsYCwgYG5hdHVyYWxMb2dhcml0aG1gIGFuZCBgc3F1YXJlUm9vdGAuXHJcbiAgICAgICAgICAgIGZvciAoOyBrKysgPD0geGRpOykgeGQucHVzaCgwKTtcclxuICAgICAgICAgICAgdyA9IHJkID0gMDtcclxuICAgICAgICAgICAgZGlnaXRzID0gMTtcclxuICAgICAgICAgICAgaSAlPSBMT0dfQkFTRTtcclxuICAgICAgICAgICAgaiA9IGkgLSBMT0dfQkFTRSArIDE7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBicmVhayBvdXQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHcgPSBrID0geGRbeGRpXTtcclxuXHJcbiAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2Ygdy5cclxuICAgICAgICAgIGZvciAoZGlnaXRzID0gMTsgayA+PSAxMDsgayAvPSAxMCkgZGlnaXRzKys7XHJcblxyXG4gICAgICAgICAgLy8gR2V0IHRoZSBpbmRleCBvZiByZCB3aXRoaW4gdy5cclxuICAgICAgICAgIGkgJT0gTE9HX0JBU0U7XHJcblxyXG4gICAgICAgICAgLy8gR2V0IHRoZSBpbmRleCBvZiByZCB3aXRoaW4gdywgYWRqdXN0ZWQgZm9yIGxlYWRpbmcgemVyb3MuXHJcbiAgICAgICAgICAvLyBUaGUgbnVtYmVyIG9mIGxlYWRpbmcgemVyb3Mgb2YgdyBpcyBnaXZlbiBieSBMT0dfQkFTRSAtIGRpZ2l0cy5cclxuICAgICAgICAgIGogPSBpIC0gTE9HX0JBU0UgKyBkaWdpdHM7XHJcblxyXG4gICAgICAgICAgLy8gR2V0IHRoZSByb3VuZGluZyBkaWdpdCBhdCBpbmRleCBqIG9mIHcuXHJcbiAgICAgICAgICByZCA9IGogPCAwID8gMCA6IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSkgJSAxMCB8IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBBcmUgdGhlcmUgYW55IG5vbi16ZXJvIGRpZ2l0cyBhZnRlciB0aGUgcm91bmRpbmcgZGlnaXQ/XHJcbiAgICAgIGlzVHJ1bmNhdGVkID0gaXNUcnVuY2F0ZWQgfHwgc2QgPCAwIHx8XHJcbiAgICAgICAgeGRbeGRpICsgMV0gIT09IHZvaWQgMCB8fCAoaiA8IDAgPyB3IDogdyAlIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGogLSAxKSk7XHJcblxyXG4gICAgICAvLyBUaGUgZXhwcmVzc2lvbiBgdyAlIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGogLSAxKWAgcmV0dXJucyBhbGwgdGhlIGRpZ2l0cyBvZiB3IHRvIHRoZSByaWdodFxyXG4gICAgICAvLyBvZiB0aGUgZGlnaXQgYXQgKGxlZnQtdG8tcmlnaHQpIGluZGV4IGosIGUuZy4gaWYgdyBpcyA5MDg3MTQgYW5kIGogaXMgMiwgdGhlIGV4cHJlc3Npb25cclxuICAgICAgLy8gd2lsbCBnaXZlIDcxNC5cclxuXHJcbiAgICAgIHJvdW5kVXAgPSBybSA8IDRcclxuICAgICAgICA/IChyZCB8fCBpc1RydW5jYXRlZCkgJiYgKHJtID09IDAgfHwgcm0gPT0gKHgucyA8IDAgPyAzIDogMikpXHJcbiAgICAgICAgOiByZCA+IDUgfHwgcmQgPT0gNSAmJiAocm0gPT0gNCB8fCBpc1RydW5jYXRlZCB8fCBybSA9PSA2ICYmXHJcblxyXG4gICAgICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgZGlnaXQgdG8gdGhlIGxlZnQgb2YgdGhlIHJvdW5kaW5nIGRpZ2l0IGlzIG9kZC5cclxuICAgICAgICAgICgoaSA+IDAgPyBqID4gMCA/IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqKSA6IDAgOiB4ZFt4ZGkgLSAxXSkgJSAxMCkgJiAxIHx8XHJcbiAgICAgICAgICAgIHJtID09ICh4LnMgPCAwID8gOCA6IDcpKTtcclxuXHJcbiAgICAgIGlmIChzZCA8IDEgfHwgIXhkWzBdKSB7XHJcbiAgICAgICAgeGQubGVuZ3RoID0gMDtcclxuICAgICAgICBpZiAocm91bmRVcCkge1xyXG5cclxuICAgICAgICAgIC8vIENvbnZlcnQgc2QgdG8gZGVjaW1hbCBwbGFjZXMuXHJcbiAgICAgICAgICBzZCAtPSB4LmUgKyAxO1xyXG5cclxuICAgICAgICAgIC8vIDEsIDAuMSwgMC4wMSwgMC4wMDEsIDAuMDAwMSBldGMuXHJcbiAgICAgICAgICB4ZFswXSA9IG1hdGhwb3coMTAsIChMT0dfQkFTRSAtIHNkICUgTE9HX0JBU0UpICUgTE9HX0JBU0UpO1xyXG4gICAgICAgICAgeC5lID0gLXNkIHx8IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAvLyBaZXJvLlxyXG4gICAgICAgICAgeGRbMF0gPSB4LmUgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFJlbW92ZSBleGNlc3MgZGlnaXRzLlxyXG4gICAgICBpZiAoaSA9PSAwKSB7XHJcbiAgICAgICAgeGQubGVuZ3RoID0geGRpO1xyXG4gICAgICAgIGsgPSAxO1xyXG4gICAgICAgIHhkaS0tO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHhkLmxlbmd0aCA9IHhkaSArIDE7XHJcbiAgICAgICAgayA9IG1hdGhwb3coMTAsIExPR19CQVNFIC0gaSk7XHJcblxyXG4gICAgICAgIC8vIEUuZy4gNTY3MDAgYmVjb21lcyA1NjAwMCBpZiA3IGlzIHRoZSByb3VuZGluZyBkaWdpdC5cclxuICAgICAgICAvLyBqID4gMCBtZWFucyBpID4gbnVtYmVyIG9mIGxlYWRpbmcgemVyb3Mgb2Ygdy5cclxuICAgICAgICB4ZFt4ZGldID0gaiA+IDAgPyAodyAvIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGopICUgbWF0aHBvdygxMCwgaikgfCAwKSAqIGsgOiAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocm91bmRVcCkge1xyXG4gICAgICAgIGZvciAoOzspIHtcclxuXHJcbiAgICAgICAgICAvLyBJcyB0aGUgZGlnaXQgdG8gYmUgcm91bmRlZCB1cCBpbiB0aGUgZmlyc3Qgd29yZCBvZiB4ZD9cclxuICAgICAgICAgIGlmICh4ZGkgPT0gMCkge1xyXG5cclxuICAgICAgICAgICAgLy8gaSB3aWxsIGJlIHRoZSBsZW5ndGggb2YgeGRbMF0gYmVmb3JlIGsgaXMgYWRkZWQuXHJcbiAgICAgICAgICAgIGZvciAoaSA9IDEsIGogPSB4ZFswXTsgaiA+PSAxMDsgaiAvPSAxMCkgaSsrO1xyXG4gICAgICAgICAgICBqID0geGRbMF0gKz0gaztcclxuICAgICAgICAgICAgZm9yIChrID0gMTsgaiA+PSAxMDsgaiAvPSAxMCkgaysrO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgaSAhPSBrIHRoZSBsZW5ndGggaGFzIGluY3JlYXNlZC5cclxuICAgICAgICAgICAgaWYgKGkgIT0gaykge1xyXG4gICAgICAgICAgICAgIHguZSsrO1xyXG4gICAgICAgICAgICAgIGlmICh4ZFswXSA9PSBCQVNFKSB4ZFswXSA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeGRbeGRpXSArPSBrO1xyXG4gICAgICAgICAgICBpZiAoeGRbeGRpXSAhPSBCQVNFKSBicmVhaztcclxuICAgICAgICAgICAgeGRbeGRpLS1dID0gMDtcclxuICAgICAgICAgICAgayA9IDE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgIGZvciAoaSA9IHhkLmxlbmd0aDsgeGRbLS1pXSA9PT0gMDspIHhkLnBvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChleHRlcm5hbCkge1xyXG5cclxuICAgICAgLy8gT3ZlcmZsb3c/XHJcbiAgICAgIGlmICh4LmUgPiBDdG9yLm1heEUpIHtcclxuXHJcbiAgICAgICAgLy8gSW5maW5pdHkuXHJcbiAgICAgICAgeC5kID0gbnVsbDtcclxuICAgICAgICB4LmUgPSBOYU47XHJcblxyXG4gICAgICAvLyBVbmRlcmZsb3c/XHJcbiAgICAgIH0gZWxzZSBpZiAoeC5lIDwgQ3Rvci5taW5FKSB7XHJcblxyXG4gICAgICAgIC8vIFplcm8uXHJcbiAgICAgICAgeC5lID0gMDtcclxuICAgICAgICB4LmQgPSBbMF07XHJcbiAgICAgICAgLy8gQ3Rvci51bmRlcmZsb3cgPSB0cnVlO1xyXG4gICAgICB9IC8vIGVsc2UgQ3Rvci51bmRlcmZsb3cgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiBmaW5pdGVUb1N0cmluZyh4LCBpc0V4cCwgc2QpIHtcclxuICAgIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbm9uRmluaXRlVG9TdHJpbmcoeCk7XHJcbiAgICB2YXIgayxcclxuICAgICAgZSA9IHguZSxcclxuICAgICAgc3RyID0gZGlnaXRzVG9TdHJpbmcoeC5kKSxcclxuICAgICAgbGVuID0gc3RyLmxlbmd0aDtcclxuXHJcbiAgICBpZiAoaXNFeHApIHtcclxuICAgICAgaWYgKHNkICYmIChrID0gc2QgLSBsZW4pID4gMCkge1xyXG4gICAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSkgKyBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgICB9IGVsc2UgaWYgKGxlbiA+IDEpIHtcclxuICAgICAgICBzdHIgPSBzdHIuY2hhckF0KDApICsgJy4nICsgc3RyLnNsaWNlKDEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzdHIgPSBzdHIgKyAoeC5lIDwgMCA/ICdlJyA6ICdlKycpICsgeC5lO1xyXG4gICAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG4gICAgICBzdHIgPSAnMC4nICsgZ2V0WmVyb1N0cmluZygtZSAtIDEpICsgc3RyO1xyXG4gICAgICBpZiAoc2QgJiYgKGsgPSBzZCAtIGxlbikgPiAwKSBzdHIgKz0gZ2V0WmVyb1N0cmluZyhrKTtcclxuICAgIH0gZWxzZSBpZiAoZSA+PSBsZW4pIHtcclxuICAgICAgc3RyICs9IGdldFplcm9TdHJpbmcoZSArIDEgLSBsZW4pO1xyXG4gICAgICBpZiAoc2QgJiYgKGsgPSBzZCAtIGUgLSAxKSA+IDApIHN0ciA9IHN0ciArICcuJyArIGdldFplcm9TdHJpbmcoayk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoKGsgPSBlICsgMSkgPCBsZW4pIHN0ciA9IHN0ci5zbGljZSgwLCBrKSArICcuJyArIHN0ci5zbGljZShrKTtcclxuICAgICAgaWYgKHNkICYmIChrID0gc2QgLSBsZW4pID4gMCkge1xyXG4gICAgICAgIGlmIChlICsgMSA9PT0gbGVuKSBzdHIgKz0gJy4nO1xyXG4gICAgICAgIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN0cjtcclxuICB9XHJcblxyXG5cclxuICAvLyBDYWxjdWxhdGUgdGhlIGJhc2UgMTAgZXhwb25lbnQgZnJvbSB0aGUgYmFzZSAxZTcgZXhwb25lbnQuXHJcbiAgZnVuY3Rpb24gZ2V0QmFzZTEwRXhwb25lbnQoZGlnaXRzLCBlKSB7XHJcbiAgICB2YXIgdyA9IGRpZ2l0c1swXTtcclxuXHJcbiAgICAvLyBBZGQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgdGhlIGZpcnN0IHdvcmQgb2YgdGhlIGRpZ2l0cyBhcnJheS5cclxuICAgIGZvciAoIGUgKj0gTE9HX0JBU0U7IHcgPj0gMTA7IHcgLz0gMTApIGUrKztcclxuICAgIHJldHVybiBlO1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGdldExuMTAoQ3Rvciwgc2QsIHByKSB7XHJcbiAgICBpZiAoc2QgPiBMTjEwX1BSRUNJU0lPTikge1xyXG5cclxuICAgICAgLy8gUmVzZXQgZ2xvYmFsIHN0YXRlIGluIGNhc2UgdGhlIGV4Y2VwdGlvbiBpcyBjYXVnaHQuXHJcbiAgICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgICAgaWYgKHByKSBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgICB0aHJvdyBFcnJvcihwcmVjaXNpb25MaW1pdEV4Y2VlZGVkKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmaW5hbGlzZShuZXcgQ3RvcihMTjEwKSwgc2QsIDEsIHRydWUpO1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGdldFBpKEN0b3IsIHNkLCBybSkge1xyXG4gICAgaWYgKHNkID4gUElfUFJFQ0lTSU9OKSB0aHJvdyBFcnJvcihwcmVjaXNpb25MaW1pdEV4Y2VlZGVkKTtcclxuICAgIHJldHVybiBmaW5hbGlzZShuZXcgQ3RvcihQSSksIHNkLCBybSwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gZ2V0UHJlY2lzaW9uKGRpZ2l0cykge1xyXG4gICAgdmFyIHcgPSBkaWdpdHMubGVuZ3RoIC0gMSxcclxuICAgICAgbGVuID0gdyAqIExPR19CQVNFICsgMTtcclxuXHJcbiAgICB3ID0gZGlnaXRzW3ddO1xyXG5cclxuICAgIC8vIElmIG5vbi16ZXJvLi4uXHJcbiAgICBpZiAodykge1xyXG5cclxuICAgICAgLy8gU3VidHJhY3QgdGhlIG51bWJlciBvZiB0cmFpbGluZyB6ZXJvcyBvZiB0aGUgbGFzdCB3b3JkLlxyXG4gICAgICBmb3IgKDsgdyAlIDEwID09IDA7IHcgLz0gMTApIGxlbi0tO1xyXG5cclxuICAgICAgLy8gQWRkIHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHRoZSBmaXJzdCB3b3JkLlxyXG4gICAgICBmb3IgKHcgPSBkaWdpdHNbMF07IHcgPj0gMTA7IHcgLz0gMTApIGxlbisrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBsZW47XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gZ2V0WmVyb1N0cmluZyhrKSB7XHJcbiAgICB2YXIgenMgPSAnJztcclxuICAgIGZvciAoOyBrLS07KSB6cyArPSAnMCc7XHJcbiAgICByZXR1cm4genM7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgRGVjaW1hbCBgeGAgdG8gdGhlIHBvd2VyIGBuYCwgd2hlcmUgYG5gIGlzIGFuXHJcbiAgICogaW50ZWdlciBvZiB0eXBlIG51bWJlci5cclxuICAgKlxyXG4gICAqIEltcGxlbWVudHMgJ2V4cG9uZW50aWF0aW9uIGJ5IHNxdWFyaW5nJy4gQ2FsbGVkIGJ5IGBwb3dgIGFuZCBgcGFyc2VPdGhlcmAuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBpbnRQb3coQ3RvciwgeCwgbiwgcHIpIHtcclxuICAgIHZhciBpc1RydW5jYXRlZCxcclxuICAgICAgciA9IG5ldyBDdG9yKDEpLFxyXG5cclxuICAgICAgLy8gTWF4IG4gb2YgOTAwNzE5OTI1NDc0MDk5MSB0YWtlcyA1MyBsb29wIGl0ZXJhdGlvbnMuXHJcbiAgICAgIC8vIE1heGltdW0gZGlnaXRzIGFycmF5IGxlbmd0aDsgbGVhdmVzIFsyOCwgMzRdIGd1YXJkIGRpZ2l0cy5cclxuICAgICAgayA9IE1hdGguY2VpbChwciAvIExPR19CQVNFICsgNCk7XHJcblxyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgICBmb3IgKDs7KSB7XHJcbiAgICAgIGlmIChuICUgMikge1xyXG4gICAgICAgIHIgPSByLnRpbWVzKHgpO1xyXG4gICAgICAgIGlmICh0cnVuY2F0ZShyLmQsIGspKSBpc1RydW5jYXRlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG4gPSBtYXRoZmxvb3IobiAvIDIpO1xyXG4gICAgICBpZiAobiA9PT0gMCkge1xyXG5cclxuICAgICAgICAvLyBUbyBlbnN1cmUgY29ycmVjdCByb3VuZGluZyB3aGVuIHIuZCBpcyB0cnVuY2F0ZWQsIGluY3JlbWVudCB0aGUgbGFzdCB3b3JkIGlmIGl0IGlzIHplcm8uXHJcbiAgICAgICAgbiA9IHIuZC5sZW5ndGggLSAxO1xyXG4gICAgICAgIGlmIChpc1RydW5jYXRlZCAmJiByLmRbbl0gPT09IDApICsrci5kW25dO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB4ID0geC50aW1lcyh4KTtcclxuICAgICAgdHJ1bmNhdGUoeC5kLCBrKTtcclxuICAgIH1cclxuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIHI7XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gaXNPZGQobikge1xyXG4gICAgcmV0dXJuIG4uZFtuLmQubGVuZ3RoIC0gMV0gJiAxO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogSGFuZGxlIGBtYXhgIGFuZCBgbWluYC4gYGx0Z3RgIGlzICdsdCcgb3IgJ2d0Jy5cclxuICAgKi9cclxuICBmdW5jdGlvbiBtYXhPck1pbihDdG9yLCBhcmdzLCBsdGd0KSB7XHJcbiAgICB2YXIgeSxcclxuICAgICAgeCA9IG5ldyBDdG9yKGFyZ3NbMF0pLFxyXG4gICAgICBpID0gMDtcclxuXHJcbiAgICBmb3IgKDsgKytpIDwgYXJncy5sZW5ndGg7KSB7XHJcbiAgICAgIHkgPSBuZXcgQ3RvcihhcmdzW2ldKTtcclxuICAgICAgaWYgKCF5LnMpIHtcclxuICAgICAgICB4ID0geTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfSBlbHNlIGlmICh4W2x0Z3RdKHkpKSB7XHJcbiAgICAgICAgeCA9IHk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGV4cG9uZW50aWFsIG9mIGB4YCByb3VuZGVkIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICAgKiBkaWdpdHMuXHJcbiAgICpcclxuICAgKiBUYXlsb3IvTWFjbGF1cmluIHNlcmllcy5cclxuICAgKlxyXG4gICAqIGV4cCh4KSA9IHheMC8wISArIHheMS8xISArIHheMi8yISArIHheMy8zISArIC4uLlxyXG4gICAqXHJcbiAgICogQXJndW1lbnQgcmVkdWN0aW9uOlxyXG4gICAqICAgUmVwZWF0IHggPSB4IC8gMzIsIGsgKz0gNSwgdW50aWwgfHh8IDwgMC4xXHJcbiAgICogICBleHAoeCkgPSBleHAoeCAvIDJeayleKDJeaylcclxuICAgKlxyXG4gICAqIFByZXZpb3VzbHksIHRoZSBhcmd1bWVudCB3YXMgaW5pdGlhbGx5IHJlZHVjZWQgYnlcclxuICAgKiBleHAoeCkgPSBleHAocikgKiAxMF5rICB3aGVyZSByID0geCAtIGsgKiBsbjEwLCBrID0gZmxvb3IoeCAvIGxuMTApXHJcbiAgICogdG8gZmlyc3QgcHV0IHIgaW4gdGhlIHJhbmdlIFswLCBsbjEwXSwgYmVmb3JlIGRpdmlkaW5nIGJ5IDMyIHVudGlsIHx4fCA8IDAuMSwgYnV0IHRoaXMgd2FzXHJcbiAgICogZm91bmQgdG8gYmUgc2xvd2VyIHRoYW4ganVzdCBkaXZpZGluZyByZXBlYXRlZGx5IGJ5IDMyIGFzIGFib3ZlLlxyXG4gICAqXHJcbiAgICogTWF4IGludGVnZXIgYXJndW1lbnQ6IGV4cCgnMjA3MjMyNjU4MzY5NDY0MTMnKSA9IDYuM2UrOTAwMDAwMDAwMDAwMDAwMFxyXG4gICAqIE1pbiBpbnRlZ2VyIGFyZ3VtZW50OiBleHAoJy0yMDcyMzI2NTgzNjk0NjQxMScpID0gMS4yZS05MDAwMDAwMDAwMDAwMDAwXHJcbiAgICogKE1hdGggb2JqZWN0IGludGVnZXIgbWluL21heDogTWF0aC5leHAoNzA5KSA9IDguMmUrMzA3LCBNYXRoLmV4cCgtNzQ1KSA9IDVlLTMyNClcclxuICAgKlxyXG4gICAqICBleHAoSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAgICogIGV4cCgtSW5maW5pdHkpID0gMFxyXG4gICAqICBleHAoTmFOKSAgICAgICA9IE5hTlxyXG4gICAqICBleHAowrEwKSAgICAgICAgPSAxXHJcbiAgICpcclxuICAgKiAgZXhwKHgpIGlzIG5vbi10ZXJtaW5hdGluZyBmb3IgYW55IGZpbml0ZSwgbm9uLXplcm8geC5cclxuICAgKlxyXG4gICAqICBUaGUgcmVzdWx0IHdpbGwgYWx3YXlzIGJlIGNvcnJlY3RseSByb3VuZGVkLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbmF0dXJhbEV4cG9uZW50aWFsKHgsIHNkKSB7XHJcbiAgICB2YXIgZGVub21pbmF0b3IsIGd1YXJkLCBqLCBwb3csIHN1bSwgdCwgd3ByLFxyXG4gICAgICByZXAgPSAwLFxyXG4gICAgICBpID0gMCxcclxuICAgICAgayA9IDAsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmcsXHJcbiAgICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcblxyXG4gICAgLy8gMC9OYU4vSW5maW5pdHk/XHJcbiAgICBpZiAoIXguZCB8fCAheC5kWzBdIHx8IHguZSA+IDE3KSB7XHJcblxyXG4gICAgICByZXR1cm4gbmV3IEN0b3IoeC5kXHJcbiAgICAgICAgPyAheC5kWzBdID8gMSA6IHgucyA8IDAgPyAwIDogMSAvIDBcclxuICAgICAgICA6IHgucyA/IHgucyA8IDAgPyAwIDogeCA6IDAgLyAwKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2QgPT0gbnVsbCkge1xyXG4gICAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gICAgICB3cHIgPSBwcjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHdwciA9IHNkO1xyXG4gICAgfVxyXG5cclxuICAgIHQgPSBuZXcgQ3RvcigwLjAzMTI1KTtcclxuXHJcbiAgICAvLyB3aGlsZSBhYnMoeCkgPj0gMC4xXHJcbiAgICB3aGlsZSAoeC5lID4gLTIpIHtcclxuXHJcbiAgICAgIC8vIHggPSB4IC8gMl41XHJcbiAgICAgIHggPSB4LnRpbWVzKHQpO1xyXG4gICAgICBrICs9IDU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXNlIDIgKiBsb2cxMCgyXmspICsgNSAoZW1waXJpY2FsbHkgZGVyaXZlZCkgdG8gZXN0aW1hdGUgdGhlIGluY3JlYXNlIGluIHByZWNpc2lvblxyXG4gICAgLy8gbmVjZXNzYXJ5IHRvIGVuc3VyZSB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgYXJlIGNvcnJlY3QuXHJcbiAgICBndWFyZCA9IE1hdGgubG9nKG1hdGhwb3coMiwgaykpIC8gTWF0aC5MTjEwICogMiArIDUgfCAwO1xyXG4gICAgd3ByICs9IGd1YXJkO1xyXG4gICAgZGVub21pbmF0b3IgPSBwb3cgPSBzdW0gPSBuZXcgQ3RvcigxKTtcclxuICAgIEN0b3IucHJlY2lzaW9uID0gd3ByO1xyXG5cclxuICAgIGZvciAoOzspIHtcclxuICAgICAgcG93ID0gZmluYWxpc2UocG93LnRpbWVzKHgpLCB3cHIsIDEpO1xyXG4gICAgICBkZW5vbWluYXRvciA9IGRlbm9taW5hdG9yLnRpbWVzKCsraSk7XHJcbiAgICAgIHQgPSBzdW0ucGx1cyhkaXZpZGUocG93LCBkZW5vbWluYXRvciwgd3ByLCAxKSk7XHJcblxyXG4gICAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCB3cHIpID09PSBkaWdpdHNUb1N0cmluZyhzdW0uZCkuc2xpY2UoMCwgd3ByKSkge1xyXG4gICAgICAgIGogPSBrO1xyXG4gICAgICAgIHdoaWxlIChqLS0pIHN1bSA9IGZpbmFsaXNlKHN1bS50aW1lcyhzdW0pLCB3cHIsIDEpO1xyXG5cclxuICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGZpcnN0IDQgcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5LlxyXG4gICAgICAgIC8vIElmIHNvLCByZXBlYXQgdGhlIHN1bW1hdGlvbiB3aXRoIGEgaGlnaGVyIHByZWNpc2lvbiwgb3RoZXJ3aXNlXHJcbiAgICAgICAgLy8gZS5nLiB3aXRoIHByZWNpc2lvbjogMTgsIHJvdW5kaW5nOiAxXHJcbiAgICAgICAgLy8gZXhwKDE4LjQwNDI3MjQ2MjU5NTAzNDA4MzU2Nzc5MzkxOTg0Mzc2MSkgPSA5ODM3MjU2MC4xMjI5OTk5OTk5IChzaG91bGQgYmUgOTgzNzI1NjAuMTIzKVxyXG4gICAgICAgIC8vIGB3cHIgLSBndWFyZGAgaXMgdGhlIGluZGV4IG9mIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgIGlmIChzZCA9PSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgaWYgKHJlcCA8IDMgJiYgY2hlY2tSb3VuZGluZ0RpZ2l0cyhzdW0uZCwgd3ByIC0gZ3VhcmQsIHJtLCByZXApKSB7XHJcbiAgICAgICAgICAgIEN0b3IucHJlY2lzaW9uID0gd3ByICs9IDEwO1xyXG4gICAgICAgICAgICBkZW5vbWluYXRvciA9IHBvdyA9IHQgPSBuZXcgQ3RvcigxKTtcclxuICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgICAgIHJlcCsrO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbmFsaXNlKHN1bSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgcm0sIGV4dGVybmFsID0gdHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgc3VtID0gdDtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGxvZ2FyaXRobSBvZiBgeGAgcm91bmRlZCB0byBgc2RgIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzLlxyXG4gICAqXHJcbiAgICogIGxuKC1uKSAgICAgICAgPSBOYU5cclxuICAgKiAgbG4oMCkgICAgICAgICA9IC1JbmZpbml0eVxyXG4gICAqICBsbigtMCkgICAgICAgID0gLUluZmluaXR5XHJcbiAgICogIGxuKDEpICAgICAgICAgPSAwXHJcbiAgICogIGxuKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gICAqICBsbigtSW5maW5pdHkpID0gTmFOXHJcbiAgICogIGxuKE5hTikgICAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqICBsbihuKSAobiAhPSAxKSBpcyBub24tdGVybWluYXRpbmcuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBuYXR1cmFsTG9nYXJpdGhtKHksIHNkKSB7XHJcbiAgICB2YXIgYywgYzAsIGRlbm9taW5hdG9yLCBlLCBudW1lcmF0b3IsIHJlcCwgc3VtLCB0LCB3cHIsIHgxLCB4MixcclxuICAgICAgbiA9IDEsXHJcbiAgICAgIGd1YXJkID0gMTAsXHJcbiAgICAgIHggPSB5LFxyXG4gICAgICB4ZCA9IHguZCxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZyxcclxuICAgICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuXHJcbiAgICAvLyBJcyB4IG5lZ2F0aXZlIG9yIEluZmluaXR5LCBOYU4sIDAgb3IgMT9cclxuICAgIGlmICh4LnMgPCAwIHx8ICF4ZCB8fCAheGRbMF0gfHwgIXguZSAmJiB4ZFswXSA9PSAxICYmIHhkLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQ3Rvcih4ZCAmJiAheGRbMF0gPyAtMSAvIDAgOiB4LnMgIT0gMSA/IE5hTiA6IHhkID8gMCA6IHgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZCA9PSBudWxsKSB7XHJcbiAgICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICAgIHdwciA9IHByO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd3ByID0gc2Q7XHJcbiAgICB9XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSB3cHIgKz0gZ3VhcmQ7XHJcbiAgICBjID0gZGlnaXRzVG9TdHJpbmcoeGQpO1xyXG4gICAgYzAgPSBjLmNoYXJBdCgwKTtcclxuXHJcbiAgICBpZiAoTWF0aC5hYnMoZSA9IHguZSkgPCAxLjVlMTUpIHtcclxuXHJcbiAgICAgIC8vIEFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICAgICAgLy8gVGhlIHNlcmllcyBjb252ZXJnZXMgZmFzdGVyIHRoZSBjbG9zZXIgdGhlIGFyZ3VtZW50IGlzIHRvIDEsIHNvIHVzaW5nXHJcbiAgICAgIC8vIGxuKGFeYikgPSBiICogbG4oYSksICAgbG4oYSkgPSBsbihhXmIpIC8gYlxyXG4gICAgICAvLyBtdWx0aXBseSB0aGUgYXJndW1lbnQgYnkgaXRzZWxmIHVudGlsIHRoZSBsZWFkaW5nIGRpZ2l0cyBvZiB0aGUgc2lnbmlmaWNhbmQgYXJlIDcsIDgsIDksXHJcbiAgICAgIC8vIDEwLCAxMSwgMTIgb3IgMTMsIHJlY29yZGluZyB0aGUgbnVtYmVyIG9mIG11bHRpcGxpY2F0aW9ucyBzbyB0aGUgc3VtIG9mIHRoZSBzZXJpZXMgY2FuXHJcbiAgICAgIC8vIGxhdGVyIGJlIGRpdmlkZWQgYnkgdGhpcyBudW1iZXIsIHRoZW4gc2VwYXJhdGUgb3V0IHRoZSBwb3dlciBvZiAxMCB1c2luZ1xyXG4gICAgICAvLyBsbihhKjEwXmIpID0gbG4oYSkgKyBiKmxuKDEwKS5cclxuXHJcbiAgICAgIC8vIG1heCBuIGlzIDIxIChnaXZlcyAwLjksIDEuMCBvciAxLjEpICg5ZTE1IC8gMjEgPSA0LjJlMTQpLlxyXG4gICAgICAvL3doaWxlIChjMCA8IDkgJiYgYzAgIT0gMSB8fCBjMCA9PSAxICYmIGMuY2hhckF0KDEpID4gMSkge1xyXG4gICAgICAvLyBtYXggbiBpcyA2IChnaXZlcyAwLjcgLSAxLjMpXHJcbiAgICAgIHdoaWxlIChjMCA8IDcgJiYgYzAgIT0gMSB8fCBjMCA9PSAxICYmIGMuY2hhckF0KDEpID4gMykge1xyXG4gICAgICAgIHggPSB4LnRpbWVzKHkpO1xyXG4gICAgICAgIGMgPSBkaWdpdHNUb1N0cmluZyh4LmQpO1xyXG4gICAgICAgIGMwID0gYy5jaGFyQXQoMCk7XHJcbiAgICAgICAgbisrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlID0geC5lO1xyXG5cclxuICAgICAgaWYgKGMwID4gMSkge1xyXG4gICAgICAgIHggPSBuZXcgQ3RvcignMC4nICsgYyk7XHJcbiAgICAgICAgZSsrO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHggPSBuZXcgQ3RvcihjMCArICcuJyArIGMuc2xpY2UoMSkpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgLy8gVGhlIGFyZ3VtZW50IHJlZHVjdGlvbiBtZXRob2QgYWJvdmUgbWF5IHJlc3VsdCBpbiBvdmVyZmxvdyBpZiB0aGUgYXJndW1lbnQgeSBpcyBhIG1hc3NpdmVcclxuICAgICAgLy8gbnVtYmVyIHdpdGggZXhwb25lbnQgPj0gMTUwMDAwMDAwMDAwMDAwMCAoOWUxNSAvIDYgPSAxLjVlMTUpLCBzbyBpbnN0ZWFkIHJlY2FsbCB0aGlzXHJcbiAgICAgIC8vIGZ1bmN0aW9uIHVzaW5nIGxuKHgqMTBeZSkgPSBsbih4KSArIGUqbG4oMTApLlxyXG4gICAgICB0ID0gZ2V0TG4xMChDdG9yLCB3cHIgKyAyLCBwcikudGltZXMoZSArICcnKTtcclxuICAgICAgeCA9IG5hdHVyYWxMb2dhcml0aG0obmV3IEN0b3IoYzAgKyAnLicgKyBjLnNsaWNlKDEpKSwgd3ByIC0gZ3VhcmQpLnBsdXModCk7XHJcbiAgICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcblxyXG4gICAgICByZXR1cm4gc2QgPT0gbnVsbCA/IGZpbmFsaXNlKHgsIHByLCBybSwgZXh0ZXJuYWwgPSB0cnVlKSA6IHg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8geDEgaXMgeCByZWR1Y2VkIHRvIGEgdmFsdWUgbmVhciAxLlxyXG4gICAgeDEgPSB4O1xyXG5cclxuICAgIC8vIFRheWxvciBzZXJpZXMuXHJcbiAgICAvLyBsbih5KSA9IGxuKCgxICsgeCkvKDEgLSB4KSkgPSAyKHggKyB4XjMvMyArIHheNS81ICsgeF43LzcgKyAuLi4pXHJcbiAgICAvLyB3aGVyZSB4ID0gKHkgLSAxKS8oeSArIDEpICAgICh8eHwgPCAxKVxyXG4gICAgc3VtID0gbnVtZXJhdG9yID0geCA9IGRpdmlkZSh4Lm1pbnVzKDEpLCB4LnBsdXMoMSksIHdwciwgMSk7XHJcbiAgICB4MiA9IGZpbmFsaXNlKHgudGltZXMoeCksIHdwciwgMSk7XHJcbiAgICBkZW5vbWluYXRvciA9IDM7XHJcblxyXG4gICAgZm9yICg7Oykge1xyXG4gICAgICBudW1lcmF0b3IgPSBmaW5hbGlzZShudW1lcmF0b3IudGltZXMoeDIpLCB3cHIsIDEpO1xyXG4gICAgICB0ID0gc3VtLnBsdXMoZGl2aWRlKG51bWVyYXRvciwgbmV3IEN0b3IoZGVub21pbmF0b3IpLCB3cHIsIDEpKTtcclxuXHJcbiAgICAgIGlmIChkaWdpdHNUb1N0cmluZyh0LmQpLnNsaWNlKDAsIHdwcikgPT09IGRpZ2l0c1RvU3RyaW5nKHN1bS5kKS5zbGljZSgwLCB3cHIpKSB7XHJcbiAgICAgICAgc3VtID0gc3VtLnRpbWVzKDIpO1xyXG5cclxuICAgICAgICAvLyBSZXZlcnNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uIENoZWNrIHRoYXQgZSBpcyBub3QgMCBiZWNhdXNlLCBiZXNpZGVzIHByZXZlbnRpbmcgYW5cclxuICAgICAgICAvLyB1bm5lY2Vzc2FyeSBjYWxjdWxhdGlvbiwgLTAgKyAwID0gKzAgYW5kIHRvIGVuc3VyZSBjb3JyZWN0IHJvdW5kaW5nIC0wIG5lZWRzIHRvIHN0YXkgLTAuXHJcbiAgICAgICAgaWYgKGUgIT09IDApIHN1bSA9IHN1bS5wbHVzKGdldExuMTAoQ3Rvciwgd3ByICsgMiwgcHIpLnRpbWVzKGUgKyAnJykpO1xyXG4gICAgICAgIHN1bSA9IGRpdmlkZShzdW0sIG5ldyBDdG9yKG4pLCB3cHIsIDEpO1xyXG5cclxuICAgICAgICAvLyBJcyBybSA+IDMgYW5kIHRoZSBmaXJzdCA0IHJvdW5kaW5nIGRpZ2l0cyA0OTk5LCBvciBybSA8IDQgKG9yIHRoZSBzdW1tYXRpb24gaGFzXHJcbiAgICAgICAgLy8gYmVlbiByZXBlYXRlZCBwcmV2aW91c2x5KSBhbmQgdGhlIGZpcnN0IDQgcm91bmRpbmcgZGlnaXRzIDk5OTk/XHJcbiAgICAgICAgLy8gSWYgc28sIHJlc3RhcnQgdGhlIHN1bW1hdGlvbiB3aXRoIGEgaGlnaGVyIHByZWNpc2lvbiwgb3RoZXJ3aXNlXHJcbiAgICAgICAgLy8gZS5nLiB3aXRoIHByZWNpc2lvbjogMTIsIHJvdW5kaW5nOiAxXHJcbiAgICAgICAgLy8gbG4oMTM1NTIwMDI4LjYxMjYwOTE3MTQyNjUzODE1MzMpID0gMTguNzI0NjI5OTk5OSB3aGVuIGl0IHNob3VsZCBiZSAxOC43MjQ2My5cclxuICAgICAgICAvLyBgd3ByIC0gZ3VhcmRgIGlzIHRoZSBpbmRleCBvZiBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgICBpZiAoc2QgPT0gbnVsbCkge1xyXG4gICAgICAgICAgaWYgKGNoZWNrUm91bmRpbmdEaWdpdHMoc3VtLmQsIHdwciAtIGd1YXJkLCBybSwgcmVwKSkge1xyXG4gICAgICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSBndWFyZDtcclxuICAgICAgICAgICAgdCA9IG51bWVyYXRvciA9IHggPSBkaXZpZGUoeDEubWludXMoMSksIHgxLnBsdXMoMSksIHdwciwgMSk7XHJcbiAgICAgICAgICAgIHgyID0gZmluYWxpc2UoeC50aW1lcyh4KSwgd3ByLCAxKTtcclxuICAgICAgICAgICAgZGVub21pbmF0b3IgPSByZXAgPSAxO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbmFsaXNlKHN1bSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgcm0sIGV4dGVybmFsID0gdHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgc3VtID0gdDtcclxuICAgICAgZGVub21pbmF0b3IgKz0gMjtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvLyDCsUluZmluaXR5LCBOYU4uXHJcbiAgZnVuY3Rpb24gbm9uRmluaXRlVG9TdHJpbmcoeCkge1xyXG4gICAgLy8gVW5zaWduZWQuXHJcbiAgICByZXR1cm4gU3RyaW5nKHgucyAqIHgucyAvIDApO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUGFyc2UgdGhlIHZhbHVlIG9mIGEgbmV3IERlY2ltYWwgYHhgIGZyb20gc3RyaW5nIGBzdHJgLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHBhcnNlRGVjaW1hbCh4LCBzdHIpIHtcclxuICAgIHZhciBlLCBpLCBsZW47XHJcblxyXG4gICAgLy8gRGVjaW1hbCBwb2ludD9cclxuICAgIGlmICgoZSA9IHN0ci5pbmRleE9mKCcuJykpID4gLTEpIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG5cclxuICAgIC8vIEV4cG9uZW50aWFsIGZvcm0/XHJcbiAgICBpZiAoKGkgPSBzdHIuc2VhcmNoKC9lL2kpKSA+IDApIHtcclxuXHJcbiAgICAgIC8vIERldGVybWluZSBleHBvbmVudC5cclxuICAgICAgaWYgKGUgPCAwKSBlID0gaTtcclxuICAgICAgZSArPSArc3RyLnNsaWNlKGkgKyAxKTtcclxuICAgICAgc3RyID0gc3RyLnN1YnN0cmluZygwLCBpKTtcclxuICAgIH0gZWxzZSBpZiAoZSA8IDApIHtcclxuXHJcbiAgICAgIC8vIEludGVnZXIuXHJcbiAgICAgIGUgPSBzdHIubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERldGVybWluZSBsZWFkaW5nIHplcm9zLlxyXG4gICAgZm9yIChpID0gMDsgc3RyLmNoYXJDb2RlQXQoaSkgPT09IDQ4OyBpKyspO1xyXG5cclxuICAgIC8vIERldGVybWluZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgIGZvciAobGVuID0gc3RyLmxlbmd0aDsgc3RyLmNoYXJDb2RlQXQobGVuIC0gMSkgPT09IDQ4OyAtLWxlbik7XHJcbiAgICBzdHIgPSBzdHIuc2xpY2UoaSwgbGVuKTtcclxuXHJcbiAgICBpZiAoc3RyKSB7XHJcbiAgICAgIGxlbiAtPSBpO1xyXG4gICAgICB4LmUgPSBlID0gZSAtIGkgLSAxO1xyXG4gICAgICB4LmQgPSBbXTtcclxuXHJcbiAgICAgIC8vIFRyYW5zZm9ybSBiYXNlXHJcblxyXG4gICAgICAvLyBlIGlzIHRoZSBiYXNlIDEwIGV4cG9uZW50LlxyXG4gICAgICAvLyBpIGlzIHdoZXJlIHRvIHNsaWNlIHN0ciB0byBnZXQgdGhlIGZpcnN0IHdvcmQgb2YgdGhlIGRpZ2l0cyBhcnJheS5cclxuICAgICAgaSA9IChlICsgMSkgJSBMT0dfQkFTRTtcclxuICAgICAgaWYgKGUgPCAwKSBpICs9IExPR19CQVNFO1xyXG5cclxuICAgICAgaWYgKGkgPCBsZW4pIHtcclxuICAgICAgICBpZiAoaSkgeC5kLnB1c2goK3N0ci5zbGljZSgwLCBpKSk7XHJcbiAgICAgICAgZm9yIChsZW4gLT0gTE9HX0JBU0U7IGkgPCBsZW47KSB4LmQucHVzaCgrc3RyLnNsaWNlKGksIGkgKz0gTE9HX0JBU0UpKTtcclxuICAgICAgICBzdHIgPSBzdHIuc2xpY2UoaSk7XHJcbiAgICAgICAgaSA9IExPR19CQVNFIC0gc3RyLmxlbmd0aDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpIC09IGxlbjtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yICg7IGktLTspIHN0ciArPSAnMCc7XHJcbiAgICAgIHguZC5wdXNoKCtzdHIpO1xyXG5cclxuICAgICAgaWYgKGV4dGVybmFsKSB7XHJcblxyXG4gICAgICAgIC8vIE92ZXJmbG93P1xyXG4gICAgICAgIGlmICh4LmUgPiB4LmNvbnN0cnVjdG9yLm1heEUpIHtcclxuXHJcbiAgICAgICAgICAvLyBJbmZpbml0eS5cclxuICAgICAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgICAgICB4LmUgPSBOYU47XHJcblxyXG4gICAgICAgIC8vIFVuZGVyZmxvdz9cclxuICAgICAgICB9IGVsc2UgaWYgKHguZSA8IHguY29uc3RydWN0b3IubWluRSkge1xyXG5cclxuICAgICAgICAgIC8vIFplcm8uXHJcbiAgICAgICAgICB4LmUgPSAwO1xyXG4gICAgICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAgICAgLy8geC5jb25zdHJ1Y3Rvci51bmRlcmZsb3cgPSB0cnVlO1xyXG4gICAgICAgIH0gLy8gZWxzZSB4LmNvbnN0cnVjdG9yLnVuZGVyZmxvdyA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgLy8gWmVyby5cclxuICAgICAgeC5lID0gMDtcclxuICAgICAgeC5kID0gWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB4O1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUGFyc2UgdGhlIHZhbHVlIG9mIGEgbmV3IERlY2ltYWwgYHhgIGZyb20gYSBzdHJpbmcgYHN0cmAsIHdoaWNoIGlzIG5vdCBhIGRlY2ltYWwgdmFsdWUuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcGFyc2VPdGhlcih4LCBzdHIpIHtcclxuICAgIHZhciBiYXNlLCBDdG9yLCBkaXZpc29yLCBpLCBpc0Zsb2F0LCBsZW4sIHAsIHhkLCB4ZTtcclxuXHJcbiAgICBpZiAoc3RyID09PSAnSW5maW5pdHknIHx8IHN0ciA9PT0gJ05hTicpIHtcclxuICAgICAgaWYgKCErc3RyKSB4LnMgPSBOYU47XHJcbiAgICAgIHguZSA9IE5hTjtcclxuICAgICAgeC5kID0gbnVsbDtcclxuICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzSGV4LnRlc3Qoc3RyKSkgIHtcclxuICAgICAgYmFzZSA9IDE2O1xyXG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcclxuICAgIH0gZWxzZSBpZiAoaXNCaW5hcnkudGVzdChzdHIpKSAge1xyXG4gICAgICBiYXNlID0gMjtcclxuICAgIH0gZWxzZSBpZiAoaXNPY3RhbC50ZXN0KHN0cikpICB7XHJcbiAgICAgIGJhc2UgPSA4O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgc3RyKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJcyB0aGVyZSBhIGJpbmFyeSBleHBvbmVudCBwYXJ0P1xyXG4gICAgaSA9IHN0ci5zZWFyY2goL3AvaSk7XHJcblxyXG4gICAgaWYgKGkgPiAwKSB7XHJcbiAgICAgIHAgPSArc3RyLnNsaWNlKGkgKyAxKTtcclxuICAgICAgc3RyID0gc3RyLnN1YnN0cmluZygyLCBpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN0ciA9IHN0ci5zbGljZSgyKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb252ZXJ0IGBzdHJgIGFzIGFuIGludGVnZXIgdGhlbiBkaXZpZGUgdGhlIHJlc3VsdCBieSBgYmFzZWAgcmFpc2VkIHRvIGEgcG93ZXIgc3VjaCB0aGF0IHRoZVxyXG4gICAgLy8gZnJhY3Rpb24gcGFydCB3aWxsIGJlIHJlc3RvcmVkLlxyXG4gICAgaSA9IHN0ci5pbmRleE9mKCcuJyk7XHJcbiAgICBpc0Zsb2F0ID0gaSA+PSAwO1xyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKGlzRmxvYXQpIHtcclxuICAgICAgc3RyID0gc3RyLnJlcGxhY2UoJy4nLCAnJyk7XHJcbiAgICAgIGxlbiA9IHN0ci5sZW5ndGg7XHJcbiAgICAgIGkgPSBsZW4gLSBpO1xyXG5cclxuICAgICAgLy8gbG9nWzEwXSgxNikgPSAxLjIwNDEuLi4gLCBsb2dbMTBdKDg4KSA9IDEuOTQ0NC4uLi5cclxuICAgICAgZGl2aXNvciA9IGludFBvdyhDdG9yLCBuZXcgQ3RvcihiYXNlKSwgaSwgaSAqIDIpO1xyXG4gICAgfVxyXG5cclxuICAgIHhkID0gY29udmVydEJhc2Uoc3RyLCBiYXNlLCBCQVNFKTtcclxuICAgIHhlID0geGQubGVuZ3RoIC0gMTtcclxuXHJcbiAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKGkgPSB4ZTsgeGRbaV0gPT09IDA7IC0taSkgeGQucG9wKCk7XHJcbiAgICBpZiAoaSA8IDApIHJldHVybiBuZXcgQ3Rvcih4LnMgKiAwKTtcclxuICAgIHguZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCB4ZSk7XHJcbiAgICB4LmQgPSB4ZDtcclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gICAgLy8gQXQgd2hhdCBwcmVjaXNpb24gdG8gcGVyZm9ybSB0aGUgZGl2aXNpb24gdG8gZW5zdXJlIGV4YWN0IGNvbnZlcnNpb24/XHJcbiAgICAvLyBtYXhEZWNpbWFsSW50ZWdlclBhcnREaWdpdENvdW50ID0gY2VpbChsb2dbMTBdKGIpICogb3RoZXJCYXNlSW50ZWdlclBhcnREaWdpdENvdW50KVxyXG4gICAgLy8gbG9nWzEwXSgyKSA9IDAuMzAxMDMsIGxvZ1sxMF0oOCkgPSAwLjkwMzA5LCBsb2dbMTBdKDE2KSA9IDEuMjA0MTJcclxuICAgIC8vIEUuZy4gY2VpbCgxLjIgKiAzKSA9IDQsIHNvIHVwIHRvIDQgZGVjaW1hbCBkaWdpdHMgYXJlIG5lZWRlZCB0byByZXByZXNlbnQgMyBoZXggaW50IGRpZ2l0cy5cclxuICAgIC8vIG1heERlY2ltYWxGcmFjdGlvblBhcnREaWdpdENvdW50ID0ge0hleDo0fE9jdDozfEJpbjoxfSAqIG90aGVyQmFzZUZyYWN0aW9uUGFydERpZ2l0Q291bnRcclxuICAgIC8vIFRoZXJlZm9yZSB1c2luZyA0ICogdGhlIG51bWJlciBvZiBkaWdpdHMgb2Ygc3RyIHdpbGwgYWx3YXlzIGJlIGVub3VnaC5cclxuICAgIGlmIChpc0Zsb2F0KSB4ID0gZGl2aWRlKHgsIGRpdmlzb3IsIGxlbiAqIDQpO1xyXG5cclxuICAgIC8vIE11bHRpcGx5IGJ5IHRoZSBiaW5hcnkgZXhwb25lbnQgcGFydCBpZiBwcmVzZW50LlxyXG4gICAgaWYgKHApIHggPSB4LnRpbWVzKE1hdGguYWJzKHApIDwgNTQgPyBNYXRoLnBvdygyLCBwKSA6IERlY2ltYWwucG93KDIsIHApKTtcclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIHNpbih4KSA9IHggLSB4XjMvMyEgKyB4XjUvNSEgLSAuLi5cclxuICAgKiB8eHwgPCBwaS8yXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBzaW5lKEN0b3IsIHgpIHtcclxuICAgIHZhciBrLFxyXG4gICAgICBsZW4gPSB4LmQubGVuZ3RoO1xyXG5cclxuICAgIGlmIChsZW4gPCAzKSByZXR1cm4gdGF5bG9yU2VyaWVzKEN0b3IsIDIsIHgsIHgpO1xyXG5cclxuICAgIC8vIEFyZ3VtZW50IHJlZHVjdGlvbjogc2luKDV4KSA9IDE2KnNpbl41KHgpIC0gMjAqc2luXjMoeCkgKyA1KnNpbih4KVxyXG4gICAgLy8gaS5lLiBzaW4oeCkgPSAxNipzaW5eNSh4LzUpIC0gMjAqc2luXjMoeC81KSArIDUqc2luKHgvNSlcclxuICAgIC8vIGFuZCAgc2luKHgpID0gc2luKHgvNSkoNSArIHNpbl4yKHgvNSkoMTZzaW5eMih4LzUpIC0gMjApKVxyXG5cclxuICAgIC8vIEVzdGltYXRlIHRoZSBvcHRpbXVtIG51bWJlciBvZiB0aW1lcyB0byB1c2UgdGhlIGFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICAgIGsgPSAxLjQgKiBNYXRoLnNxcnQobGVuKTtcclxuICAgIGsgPSBrID4gMTYgPyAxNiA6IGsgfCAwO1xyXG5cclxuICAgIC8vIE1heCBrIGJlZm9yZSBNYXRoLnBvdyBwcmVjaXNpb24gbG9zcyBpcyAyMlxyXG4gICAgeCA9IHgudGltZXMoTWF0aC5wb3coNSwgLWspKTtcclxuICAgIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCk7XHJcblxyXG4gICAgLy8gUmV2ZXJzZSBhcmd1bWVudCByZWR1Y3Rpb25cclxuICAgIHZhciBzaW4yX3gsXHJcbiAgICAgIGQ1ID0gbmV3IEN0b3IoNSksXHJcbiAgICAgIGQxNiA9IG5ldyBDdG9yKDE2KSxcclxuICAgICAgZDIwID0gbmV3IEN0b3IoMjApO1xyXG4gICAgZm9yICg7IGstLTspIHtcclxuICAgICAgc2luMl94ID0geC50aW1lcyh4KTtcclxuICAgICAgeCA9IHgudGltZXMoZDUucGx1cyhzaW4yX3gudGltZXMoZDE2LnRpbWVzKHNpbjJfeCkubWludXMoZDIwKSkpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG5cclxuICAvLyBDYWxjdWxhdGUgVGF5bG9yIHNlcmllcyBmb3IgYGNvc2AsIGBjb3NoYCwgYHNpbmAgYW5kIGBzaW5oYC5cclxuICBmdW5jdGlvbiB0YXlsb3JTZXJpZXMoQ3RvciwgbiwgeCwgeSwgaXNIeXBlcmJvbGljKSB7XHJcbiAgICB2YXIgaiwgdCwgdSwgeDIsXHJcbiAgICAgIGkgPSAxLFxyXG4gICAgICBwciA9IEN0b3IucHJlY2lzaW9uLFxyXG4gICAgICBrID0gTWF0aC5jZWlsKHByIC8gTE9HX0JBU0UpO1xyXG5cclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICB4MiA9IHgudGltZXMoeCk7XHJcbiAgICB1ID0gbmV3IEN0b3IoeSk7XHJcblxyXG4gICAgZm9yICg7Oykge1xyXG4gICAgICB0ID0gZGl2aWRlKHUudGltZXMoeDIpLCBuZXcgQ3RvcihuKysgKiBuKyspLCBwciwgMSk7XHJcbiAgICAgIHUgPSBpc0h5cGVyYm9saWMgPyB5LnBsdXModCkgOiB5Lm1pbnVzKHQpO1xyXG4gICAgICB5ID0gZGl2aWRlKHQudGltZXMoeDIpLCBuZXcgQ3RvcihuKysgKiBuKyspLCBwciwgMSk7XHJcbiAgICAgIHQgPSB1LnBsdXMoeSk7XHJcblxyXG4gICAgICBpZiAodC5kW2tdICE9PSB2b2lkIDApIHtcclxuICAgICAgICBmb3IgKGogPSBrOyB0LmRbal0gPT09IHUuZFtqXSAmJiBqLS07KTtcclxuICAgICAgICBpZiAoaiA9PSAtMSkgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGogPSB1O1xyXG4gICAgICB1ID0geTtcclxuICAgICAgeSA9IHQ7XHJcbiAgICAgIHQgPSBqO1xyXG4gICAgICBpKys7XHJcbiAgICB9XHJcblxyXG4gICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gICAgdC5kLmxlbmd0aCA9IGsgKyAxO1xyXG5cclxuICAgIHJldHVybiB0O1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIFJldHVybiB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgYHhgIHJlZHVjZWQgdG8gbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGhhbGYgcGkuXHJcbiAgZnVuY3Rpb24gdG9MZXNzVGhhbkhhbGZQaShDdG9yLCB4KSB7XHJcbiAgICB2YXIgdCxcclxuICAgICAgaXNOZWcgPSB4LnMgPCAwLFxyXG4gICAgICBwaSA9IGdldFBpKEN0b3IsIEN0b3IucHJlY2lzaW9uLCAxKSxcclxuICAgICAgaGFsZlBpID0gcGkudGltZXMoMC41KTtcclxuXHJcbiAgICB4ID0geC5hYnMoKTtcclxuXHJcbiAgICBpZiAoeC5sdGUoaGFsZlBpKSkge1xyXG4gICAgICBxdWFkcmFudCA9IGlzTmVnID8gNCA6IDE7XHJcbiAgICAgIHJldHVybiB4O1xyXG4gICAgfVxyXG5cclxuICAgIHQgPSB4LmRpdlRvSW50KHBpKTtcclxuXHJcbiAgICBpZiAodC5pc1plcm8oKSkge1xyXG4gICAgICBxdWFkcmFudCA9IGlzTmVnID8gMyA6IDI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB4ID0geC5taW51cyh0LnRpbWVzKHBpKSk7XHJcblxyXG4gICAgICAvLyAwIDw9IHggPCBwaVxyXG4gICAgICBpZiAoeC5sdGUoaGFsZlBpKSkge1xyXG4gICAgICAgIHF1YWRyYW50ID0gaXNPZGQodCkgPyAoaXNOZWcgPyAyIDogMykgOiAoaXNOZWcgPyA0IDogMSk7XHJcbiAgICAgICAgcmV0dXJuIHg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHF1YWRyYW50ID0gaXNPZGQodCkgPyAoaXNOZWcgPyAxIDogNCkgOiAoaXNOZWcgPyAzIDogMik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHgubWludXMocGkpLmFicygpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRoZSB2YWx1ZSBvZiBEZWNpbWFsIGB4YCBhcyBhIHN0cmluZyBpbiBiYXNlIGBiYXNlT3V0YC5cclxuICAgKlxyXG4gICAqIElmIHRoZSBvcHRpb25hbCBgc2RgIGFyZ3VtZW50IGlzIHByZXNlbnQgaW5jbHVkZSBhIGJpbmFyeSBleHBvbmVudCBzdWZmaXguXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gdG9TdHJpbmdCaW5hcnkoeCwgYmFzZU91dCwgc2QsIHJtKSB7XHJcbiAgICB2YXIgYmFzZSwgZSwgaSwgaywgbGVuLCByb3VuZFVwLCBzdHIsIHhkLCB5LFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgaXNFeHAgPSBzZCAhPT0gdm9pZCAwO1xyXG5cclxuICAgIGlmIChpc0V4cCkge1xyXG4gICAgICBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuICAgICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNkID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXguaXNGaW5pdGUoKSkge1xyXG4gICAgICBzdHIgPSBub25GaW5pdGVUb1N0cmluZyh4KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgpO1xyXG4gICAgICBpID0gc3RyLmluZGV4T2YoJy4nKTtcclxuXHJcbiAgICAgIC8vIFVzZSBleHBvbmVudGlhbCBub3RhdGlvbiBhY2NvcmRpbmcgdG8gYHRvRXhwUG9zYCBhbmQgYHRvRXhwTmVnYD8gTm8sIGJ1dCBpZiByZXF1aXJlZDpcclxuICAgICAgLy8gbWF4QmluYXJ5RXhwb25lbnQgPSBmbG9vcigoZGVjaW1hbEV4cG9uZW50ICsgMSkgKiBsb2dbMl0oMTApKVxyXG4gICAgICAvLyBtaW5CaW5hcnlFeHBvbmVudCA9IGZsb29yKGRlY2ltYWxFeHBvbmVudCAqIGxvZ1syXSgxMCkpXHJcbiAgICAgIC8vIGxvZ1syXSgxMCkgPSAzLjMyMTkyODA5NDg4NzM2MjM0Nzg3MDMxOTQyOTQ4OTM5MDE3NTg2NFxyXG5cclxuICAgICAgaWYgKGlzRXhwKSB7XHJcbiAgICAgICAgYmFzZSA9IDI7XHJcbiAgICAgICAgaWYgKGJhc2VPdXQgPT0gMTYpIHtcclxuICAgICAgICAgIHNkID0gc2QgKiA0IC0gMztcclxuICAgICAgICB9IGVsc2UgaWYgKGJhc2VPdXQgPT0gOCkge1xyXG4gICAgICAgICAgc2QgPSBzZCAqIDMgLSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBiYXNlID0gYmFzZU91dDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ29udmVydCB0aGUgbnVtYmVyIGFzIGFuIGludGVnZXIgdGhlbiBkaXZpZGUgdGhlIHJlc3VsdCBieSBpdHMgYmFzZSByYWlzZWQgdG8gYSBwb3dlciBzdWNoXHJcbiAgICAgIC8vIHRoYXQgdGhlIGZyYWN0aW9uIHBhcnQgd2lsbCBiZSByZXN0b3JlZC5cclxuXHJcbiAgICAgIC8vIE5vbi1pbnRlZ2VyLlxyXG4gICAgICBpZiAoaSA+PSAwKSB7XHJcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoJy4nLCAnJyk7XHJcbiAgICAgICAgeSA9IG5ldyBDdG9yKDEpO1xyXG4gICAgICAgIHkuZSA9IHN0ci5sZW5ndGggLSBpO1xyXG4gICAgICAgIHkuZCA9IGNvbnZlcnRCYXNlKGZpbml0ZVRvU3RyaW5nKHkpLCAxMCwgYmFzZSk7XHJcbiAgICAgICAgeS5lID0geS5kLmxlbmd0aDtcclxuICAgICAgfVxyXG5cclxuICAgICAgeGQgPSBjb252ZXJ0QmFzZShzdHIsIDEwLCBiYXNlKTtcclxuICAgICAgZSA9IGxlbiA9IHhkLmxlbmd0aDtcclxuXHJcbiAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgZm9yICg7IHhkWy0tbGVuXSA9PSAwOykgeGQucG9wKCk7XHJcblxyXG4gICAgICBpZiAoIXhkWzBdKSB7XHJcbiAgICAgICAgc3RyID0gaXNFeHAgPyAnMHArMCcgOiAnMCc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICBlLS07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHggPSBuZXcgQ3Rvcih4KTtcclxuICAgICAgICAgIHguZCA9IHhkO1xyXG4gICAgICAgICAgeC5lID0gZTtcclxuICAgICAgICAgIHggPSBkaXZpZGUoeCwgeSwgc2QsIHJtLCAwLCBiYXNlKTtcclxuICAgICAgICAgIHhkID0geC5kO1xyXG4gICAgICAgICAgZSA9IHguZTtcclxuICAgICAgICAgIHJvdW5kVXAgPSBpbmV4YWN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVGhlIHJvdW5kaW5nIGRpZ2l0LCBpLmUuIHRoZSBkaWdpdCBhZnRlciB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cC5cclxuICAgICAgICBpID0geGRbc2RdO1xyXG4gICAgICAgIGsgPSBiYXNlIC8gMjtcclxuICAgICAgICByb3VuZFVwID0gcm91bmRVcCB8fCB4ZFtzZCArIDFdICE9PSB2b2lkIDA7XHJcblxyXG4gICAgICAgIHJvdW5kVXAgPSBybSA8IDRcclxuICAgICAgICAgID8gKGkgIT09IHZvaWQgMCB8fCByb3VuZFVwKSAmJiAocm0gPT09IDAgfHwgcm0gPT09ICh4LnMgPCAwID8gMyA6IDIpKVxyXG4gICAgICAgICAgOiBpID4gayB8fCBpID09PSBrICYmIChybSA9PT0gNCB8fCByb3VuZFVwIHx8IHJtID09PSA2ICYmIHhkW3NkIC0gMV0gJiAxIHx8XHJcbiAgICAgICAgICAgIHJtID09PSAoeC5zIDwgMCA/IDggOiA3KSk7XHJcblxyXG4gICAgICAgIHhkLmxlbmd0aCA9IHNkO1xyXG5cclxuICAgICAgICBpZiAocm91bmRVcCkge1xyXG5cclxuICAgICAgICAgIC8vIFJvdW5kaW5nIHVwIG1heSBtZWFuIHRoZSBwcmV2aW91cyBkaWdpdCBoYXMgdG8gYmUgcm91bmRlZCB1cCBhbmQgc28gb24uXHJcbiAgICAgICAgICBmb3IgKDsgKyt4ZFstLXNkXSA+IGJhc2UgLSAxOykge1xyXG4gICAgICAgICAgICB4ZFtzZF0gPSAwO1xyXG4gICAgICAgICAgICBpZiAoIXNkKSB7XHJcbiAgICAgICAgICAgICAgKytlO1xyXG4gICAgICAgICAgICAgIHhkLnVuc2hpZnQoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIERldGVybWluZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgICBmb3IgKGxlbiA9IHhkLmxlbmd0aDsgIXhkW2xlbiAtIDFdOyAtLWxlbik7XHJcblxyXG4gICAgICAgIC8vIEUuZy4gWzQsIDExLCAxNV0gYmVjb21lcyA0YmYuXHJcbiAgICAgICAgZm9yIChpID0gMCwgc3RyID0gJyc7IGkgPCBsZW47IGkrKykgc3RyICs9IE5VTUVSQUxTLmNoYXJBdCh4ZFtpXSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBiaW5hcnkgZXhwb25lbnQgc3VmZml4P1xyXG4gICAgICAgIGlmIChpc0V4cCkge1xyXG4gICAgICAgICAgaWYgKGxlbiA+IDEpIHtcclxuICAgICAgICAgICAgaWYgKGJhc2VPdXQgPT0gMTYgfHwgYmFzZU91dCA9PSA4KSB7XHJcbiAgICAgICAgICAgICAgaSA9IGJhc2VPdXQgPT0gMTYgPyA0IDogMztcclxuICAgICAgICAgICAgICBmb3IgKC0tbGVuOyBsZW4gJSBpOyBsZW4rKykgc3RyICs9ICcwJztcclxuICAgICAgICAgICAgICB4ZCA9IGNvbnZlcnRCYXNlKHN0ciwgYmFzZSwgYmFzZU91dCk7XHJcbiAgICAgICAgICAgICAgZm9yIChsZW4gPSB4ZC5sZW5ndGg7ICF4ZFtsZW4gLSAxXTsgLS1sZW4pO1xyXG5cclxuICAgICAgICAgICAgICAvLyB4ZFswXSB3aWxsIGFsd2F5cyBiZSBiZSAxXHJcbiAgICAgICAgICAgICAgZm9yIChpID0gMSwgc3RyID0gJzEuJzsgaSA8IGxlbjsgaSsrKSBzdHIgKz0gTlVNRVJBTFMuY2hhckF0KHhkW2ldKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBzdHIgPSBzdHIuY2hhckF0KDApICsgJy4nICsgc3RyLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgc3RyID0gIHN0ciArIChlIDwgMCA/ICdwJyA6ICdwKycpICsgZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGUgPCAwKSB7XHJcbiAgICAgICAgICBmb3IgKDsgKytlOykgc3RyID0gJzAnICsgc3RyO1xyXG4gICAgICAgICAgc3RyID0gJzAuJyArIHN0cjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKCsrZSA+IGxlbikgZm9yIChlIC09IGxlbjsgZS0tIDspIHN0ciArPSAnMCc7XHJcbiAgICAgICAgICBlbHNlIGlmIChlIDwgbGVuKSBzdHIgPSBzdHIuc2xpY2UoMCwgZSkgKyAnLicgKyBzdHIuc2xpY2UoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBzdHIgPSAoYmFzZU91dCA9PSAxNiA/ICcweCcgOiBiYXNlT3V0ID09IDIgPyAnMGInIDogYmFzZU91dCA9PSA4ID8gJzBvJyA6ICcnKSArIHN0cjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geC5zIDwgMCA/ICctJyArIHN0ciA6IHN0cjtcclxuICB9XHJcblxyXG5cclxuICAvLyBEb2VzIG5vdCBzdHJpcCB0cmFpbGluZyB6ZXJvcy5cclxuICBmdW5jdGlvbiB0cnVuY2F0ZShhcnIsIGxlbikge1xyXG4gICAgaWYgKGFyci5sZW5ndGggPiBsZW4pIHtcclxuICAgICAgYXJyLmxlbmd0aCA9IGxlbjtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gRGVjaW1hbCBtZXRob2RzXHJcblxyXG5cclxuICAvKlxyXG4gICAqICBhYnNcclxuICAgKiAgYWNvc1xyXG4gICAqICBhY29zaFxyXG4gICAqICBhZGRcclxuICAgKiAgYXNpblxyXG4gICAqICBhc2luaFxyXG4gICAqICBhdGFuXHJcbiAgICogIGF0YW5oXHJcbiAgICogIGF0YW4yXHJcbiAgICogIGNicnRcclxuICAgKiAgY2VpbFxyXG4gICAqICBjbG9uZVxyXG4gICAqICBjb25maWdcclxuICAgKiAgY29zXHJcbiAgICogIGNvc2hcclxuICAgKiAgZGl2XHJcbiAgICogIGV4cFxyXG4gICAqICBmbG9vclxyXG4gICAqICBoeXBvdFxyXG4gICAqICBsblxyXG4gICAqICBsb2dcclxuICAgKiAgbG9nMlxyXG4gICAqICBsb2cxMFxyXG4gICAqICBtYXhcclxuICAgKiAgbWluXHJcbiAgICogIG1vZFxyXG4gICAqICBtdWxcclxuICAgKiAgcG93XHJcbiAgICogIHJhbmRvbVxyXG4gICAqICByb3VuZFxyXG4gICAqICBzZXRcclxuICAgKiAgc2lnblxyXG4gICAqICBzaW5cclxuICAgKiAgc2luaFxyXG4gICAqICBzcXJ0XHJcbiAgICogIHN1YlxyXG4gICAqICB0YW5cclxuICAgKiAgdGFuaFxyXG4gICAqICB0cnVuY1xyXG4gICAqL1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgYHhgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYWJzKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5hYnMoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmNjb3NpbmUgaW4gcmFkaWFucyBvZiBgeGAuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBhY29zKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5hY29zKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyBjb3NpbmUgb2YgYHhgLCByb3VuZGVkIHRvXHJcbiAgICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYWNvc2goeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmFjb3NoKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3VtIG9mIGB4YCBhbmQgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBhZGQoeCwgeSkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLnBsdXMoeSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjc2luZSBpbiByYWRpYW5zIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBhc2luKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5hc2luKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyBzaW5lIG9mIGB4YCwgcm91bmRlZCB0b1xyXG4gICAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGFzaW5oKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5hc2luaCgpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY3RhbmdlbnQgaW4gcmFkaWFucyBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYXRhbih4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuYXRhbigpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgdGFuZ2VudCBvZiBgeGAsIHJvdW5kZWQgdG9cclxuICAgKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBhdGFuaCh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuYXRhbmgoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmN0YW5nZW50IGluIHJhZGlhbnMgb2YgYHkveGAgaW4gdGhlIHJhbmdlIC1waSB0byBwaVxyXG4gICAqIChpbmNsdXNpdmUpLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqIFJhbmdlOiBbLXBpLCBwaV1cclxuICAgKlxyXG4gICAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIHktY29vcmRpbmF0ZS5cclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSB4LWNvb3JkaW5hdGUuXHJcbiAgICpcclxuICAgKiBhdGFuMijCsTAsIC0wKSAgICAgICAgICAgICAgID0gwrFwaVxyXG4gICAqIGF0YW4yKMKxMCwgKzApICAgICAgICAgICAgICAgPSDCsTBcclxuICAgKiBhdGFuMijCsTAsIC14KSAgICAgICAgICAgICAgID0gwrFwaSBmb3IgeCA+IDBcclxuICAgKiBhdGFuMijCsTAsIHgpICAgICAgICAgICAgICAgID0gwrEwIGZvciB4ID4gMFxyXG4gICAqIGF0YW4yKC15LCDCsTApICAgICAgICAgICAgICAgPSAtcGkvMiBmb3IgeSA+IDBcclxuICAgKiBhdGFuMih5LCDCsTApICAgICAgICAgICAgICAgID0gcGkvMiBmb3IgeSA+IDBcclxuICAgKiBhdGFuMijCsXksIC1JbmZpbml0eSkgICAgICAgID0gwrFwaSBmb3IgZmluaXRlIHkgPiAwXHJcbiAgICogYXRhbjIowrF5LCArSW5maW5pdHkpICAgICAgICA9IMKxMCBmb3IgZmluaXRlIHkgPiAwXHJcbiAgICogYXRhbjIowrFJbmZpbml0eSwgeCkgICAgICAgICA9IMKxcGkvMiBmb3IgZmluaXRlIHhcclxuICAgKiBhdGFuMijCsUluZmluaXR5LCAtSW5maW5pdHkpID0gwrEzKnBpLzRcclxuICAgKiBhdGFuMijCsUluZmluaXR5LCArSW5maW5pdHkpID0gwrFwaS80XHJcbiAgICogYXRhbjIoTmFOLCB4KSA9IE5hTlxyXG4gICAqIGF0YW4yKHksIE5hTikgPSBOYU5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGF0YW4yKHksIHgpIHtcclxuICAgIHkgPSBuZXcgdGhpcyh5KTtcclxuICAgIHggPSBuZXcgdGhpcyh4KTtcclxuICAgIHZhciByLFxyXG4gICAgICBwciA9IHRoaXMucHJlY2lzaW9uLFxyXG4gICAgICBybSA9IHRoaXMucm91bmRpbmcsXHJcbiAgICAgIHdwciA9IHByICsgNDtcclxuXHJcbiAgICAvLyBFaXRoZXIgTmFOXHJcbiAgICBpZiAoIXkucyB8fCAheC5zKSB7XHJcbiAgICAgIHIgPSBuZXcgdGhpcyhOYU4pO1xyXG5cclxuICAgIC8vIEJvdGggwrFJbmZpbml0eVxyXG4gICAgfSBlbHNlIGlmICgheS5kICYmICF4LmQpIHtcclxuICAgICAgciA9IGdldFBpKHRoaXMsIHdwciwgMSkudGltZXMoeC5zID4gMCA/IDAuMjUgOiAwLjc1KTtcclxuICAgICAgci5zID0geS5zO1xyXG5cclxuICAgIC8vIHggaXMgwrFJbmZpbml0eSBvciB5IGlzIMKxMFxyXG4gICAgfSBlbHNlIGlmICgheC5kIHx8IHkuaXNaZXJvKCkpIHtcclxuICAgICAgciA9IHgucyA8IDAgPyBnZXRQaSh0aGlzLCBwciwgcm0pIDogbmV3IHRoaXMoMCk7XHJcbiAgICAgIHIucyA9IHkucztcclxuXHJcbiAgICAvLyB5IGlzIMKxSW5maW5pdHkgb3IgeCBpcyDCsTBcclxuICAgIH0gZWxzZSBpZiAoIXkuZCB8fCB4LmlzWmVybygpKSB7XHJcbiAgICAgIHIgPSBnZXRQaSh0aGlzLCB3cHIsIDEpLnRpbWVzKDAuNSk7XHJcbiAgICAgIHIucyA9IHkucztcclxuXHJcbiAgICAvLyBCb3RoIG5vbi16ZXJvIGFuZCBmaW5pdGVcclxuICAgIH0gZWxzZSBpZiAoeC5zIDwgMCkge1xyXG4gICAgICB0aGlzLnByZWNpc2lvbiA9IHdwcjtcclxuICAgICAgdGhpcy5yb3VuZGluZyA9IDE7XHJcbiAgICAgIHIgPSB0aGlzLmF0YW4oZGl2aWRlKHksIHgsIHdwciwgMSkpO1xyXG4gICAgICB4ID0gZ2V0UGkodGhpcywgd3ByLCAxKTtcclxuICAgICAgdGhpcy5wcmVjaXNpb24gPSBwcjtcclxuICAgICAgdGhpcy5yb3VuZGluZyA9IHJtO1xyXG4gICAgICByID0geS5zIDwgMCA/IHIubWludXMoeCkgOiByLnBsdXMoeCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByID0gdGhpcy5hdGFuKGRpdmlkZSh5LCB4LCB3cHIsIDEpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcjtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBjdWJlIHJvb3Qgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNicnQoeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmNicnQoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByb3VuZGVkIHRvIGFuIGludGVnZXIgdXNpbmcgYFJPVU5EX0NFSUxgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY2VpbCh4KSB7XHJcbiAgICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCAyKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIENvbmZpZ3VyZSBnbG9iYWwgc2V0dGluZ3MgZm9yIGEgRGVjaW1hbCBjb25zdHJ1Y3Rvci5cclxuICAgKlxyXG4gICAqIGBvYmpgIGlzIGFuIG9iamVjdCB3aXRoIG9uZSBvciBtb3JlIG9mIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyxcclxuICAgKlxyXG4gICAqICAgcHJlY2lzaW9uICB7bnVtYmVyfVxyXG4gICAqICAgcm91bmRpbmcgICB7bnVtYmVyfVxyXG4gICAqICAgdG9FeHBOZWcgICB7bnVtYmVyfVxyXG4gICAqICAgdG9FeHBQb3MgICB7bnVtYmVyfVxyXG4gICAqICAgbWF4RSAgICAgICB7bnVtYmVyfVxyXG4gICAqICAgbWluRSAgICAgICB7bnVtYmVyfVxyXG4gICAqICAgbW9kdWxvICAgICB7bnVtYmVyfVxyXG4gICAqICAgY3J5cHRvICAgICB7Ym9vbGVhbnxudW1iZXJ9XHJcbiAgICogICBkZWZhdWx0cyAgIHt0cnVlfVxyXG4gICAqXHJcbiAgICogRS5nLiBEZWNpbWFsLmNvbmZpZyh7IHByZWNpc2lvbjogMjAsIHJvdW5kaW5nOiA0IH0pXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBjb25maWcob2JqKSB7XHJcbiAgICBpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JykgdGhyb3cgRXJyb3IoZGVjaW1hbEVycm9yICsgJ09iamVjdCBleHBlY3RlZCcpO1xyXG4gICAgdmFyIGksIHAsIHYsXHJcbiAgICAgIHVzZURlZmF1bHRzID0gb2JqLmRlZmF1bHRzID09PSB0cnVlLFxyXG4gICAgICBwcyA9IFtcclxuICAgICAgICAncHJlY2lzaW9uJywgMSwgTUFYX0RJR0lUUyxcclxuICAgICAgICAncm91bmRpbmcnLCAwLCA4LFxyXG4gICAgICAgICd0b0V4cE5lZycsIC1FWFBfTElNSVQsIDAsXHJcbiAgICAgICAgJ3RvRXhwUG9zJywgMCwgRVhQX0xJTUlULFxyXG4gICAgICAgICdtYXhFJywgMCwgRVhQX0xJTUlULFxyXG4gICAgICAgICdtaW5FJywgLUVYUF9MSU1JVCwgMCxcclxuICAgICAgICAnbW9kdWxvJywgMCwgOVxyXG4gICAgICBdO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBwcy5sZW5ndGg7IGkgKz0gMykge1xyXG4gICAgICBpZiAocCA9IHBzW2ldLCB1c2VEZWZhdWx0cykgdGhpc1twXSA9IERFRkFVTFRTW3BdO1xyXG4gICAgICBpZiAoKHYgPSBvYmpbcF0pICE9PSB2b2lkIDApIHtcclxuICAgICAgICBpZiAobWF0aGZsb29yKHYpID09PSB2ICYmIHYgPj0gcHNbaSArIDFdICYmIHYgPD0gcHNbaSArIDJdKSB0aGlzW3BdID0gdjtcclxuICAgICAgICBlbHNlIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHAgKyAnOiAnICsgdik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAocCA9ICdjcnlwdG8nLCB1c2VEZWZhdWx0cykgdGhpc1twXSA9IERFRkFVTFRTW3BdO1xyXG4gICAgaWYgKCh2ID0gb2JqW3BdKSAhPT0gdm9pZCAwKSB7XHJcbiAgICAgIGlmICh2ID09PSB0cnVlIHx8IHYgPT09IGZhbHNlIHx8IHYgPT09IDAgfHwgdiA9PT0gMSkge1xyXG4gICAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIGNyeXB0byAhPSAndW5kZWZpbmVkJyAmJiBjcnlwdG8gJiZcclxuICAgICAgICAgICAgKGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgfHwgY3J5cHRvLnJhbmRvbUJ5dGVzKSkge1xyXG4gICAgICAgICAgICB0aGlzW3BdID0gdHJ1ZTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGNyeXB0b1VuYXZhaWxhYmxlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpc1twXSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBwICsgJzogJyArIHYpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgY29zaW5lIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNvcyh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuY29zKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBjb3NpbmUgb2YgYHhgLCByb3VuZGVkIHRvIHByZWNpc2lvblxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNvc2goeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmNvc2goKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgRGVjaW1hbCBjb25zdHJ1Y3RvciB3aXRoIHRoZSBzYW1lIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBhcyB0aGlzIERlY2ltYWxcclxuICAgKiBjb25zdHJ1Y3Rvci5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNsb25lKG9iaikge1xyXG4gICAgdmFyIGksIHAsIHBzO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUaGUgRGVjaW1hbCBjb25zdHJ1Y3RvciBhbmQgZXhwb3J0ZWQgZnVuY3Rpb24uXHJcbiAgICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCBpbnN0YW5jZS5cclxuICAgICAqXHJcbiAgICAgKiB2IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgbnVtZXJpYyB2YWx1ZS5cclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIERlY2ltYWwodikge1xyXG4gICAgICB2YXIgZSwgaSwgdCxcclxuICAgICAgICB4ID0gdGhpcztcclxuXHJcbiAgICAgIC8vIERlY2ltYWwgY2FsbGVkIHdpdGhvdXQgbmV3LlxyXG4gICAgICBpZiAoISh4IGluc3RhbmNlb2YgRGVjaW1hbCkpIHJldHVybiBuZXcgRGVjaW1hbCh2KTtcclxuXHJcbiAgICAgIC8vIFJldGFpbiBhIHJlZmVyZW5jZSB0byB0aGlzIERlY2ltYWwgY29uc3RydWN0b3IsIGFuZCBzaGFkb3cgRGVjaW1hbC5wcm90b3R5cGUuY29uc3RydWN0b3JcclxuICAgICAgLy8gd2hpY2ggcG9pbnRzIHRvIE9iamVjdC5cclxuICAgICAgeC5jb25zdHJ1Y3RvciA9IERlY2ltYWw7XHJcblxyXG4gICAgICAvLyBEdXBsaWNhdGUuXHJcbiAgICAgIGlmICh2IGluc3RhbmNlb2YgRGVjaW1hbCkge1xyXG4gICAgICAgIHgucyA9IHYucztcclxuICAgICAgICB4LmUgPSB2LmU7XHJcbiAgICAgICAgeC5kID0gKHYgPSB2LmQpID8gdi5zbGljZSgpIDogdjtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHQgPSB0eXBlb2YgdjtcclxuXHJcbiAgICAgIGlmICh0ID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIGlmICh2ID09PSAwKSB7XHJcbiAgICAgICAgICB4LnMgPSAxIC8gdiA8IDAgPyAtMSA6IDE7XHJcbiAgICAgICAgICB4LmUgPSAwO1xyXG4gICAgICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHYgPCAwKSB7XHJcbiAgICAgICAgICB2ID0gLXY7XHJcbiAgICAgICAgICB4LnMgPSAtMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgeC5zID0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEZhc3QgcGF0aCBmb3Igc21hbGwgaW50ZWdlcnMuXHJcbiAgICAgICAgaWYgKHYgPT09IH5+diAmJiB2IDwgMWU3KSB7XHJcbiAgICAgICAgICBmb3IgKGUgPSAwLCBpID0gdjsgaSA+PSAxMDsgaSAvPSAxMCkgZSsrO1xyXG4gICAgICAgICAgeC5lID0gZTtcclxuICAgICAgICAgIHguZCA9IFt2XTtcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gSW5maW5pdHksIE5hTi5cclxuICAgICAgICB9IGVsc2UgaWYgKHYgKiAwICE9PSAwKSB7XHJcbiAgICAgICAgICBpZiAoIXYpIHgucyA9IE5hTjtcclxuICAgICAgICAgIHguZSA9IE5hTjtcclxuICAgICAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcGFyc2VEZWNpbWFsKHgsIHYudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKHQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgdik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE1pbnVzIHNpZ24/XHJcbiAgICAgIGlmICh2LmNoYXJDb2RlQXQoMCkgPT09IDQ1KSB7XHJcbiAgICAgICAgdiA9IHYuc2xpY2UoMSk7XHJcbiAgICAgICAgeC5zID0gLTE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeC5zID0gMTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGlzRGVjaW1hbC50ZXN0KHYpID8gcGFyc2VEZWNpbWFsKHgsIHYpIDogcGFyc2VPdGhlcih4LCB2KTtcclxuICAgIH1cclxuXHJcbiAgICBEZWNpbWFsLnByb3RvdHlwZSA9IFA7XHJcblxyXG4gICAgRGVjaW1hbC5ST1VORF9VUCA9IDA7XHJcbiAgICBEZWNpbWFsLlJPVU5EX0RPV04gPSAxO1xyXG4gICAgRGVjaW1hbC5ST1VORF9DRUlMID0gMjtcclxuICAgIERlY2ltYWwuUk9VTkRfRkxPT1IgPSAzO1xyXG4gICAgRGVjaW1hbC5ST1VORF9IQUxGX1VQID0gNDtcclxuICAgIERlY2ltYWwuUk9VTkRfSEFMRl9ET1dOID0gNTtcclxuICAgIERlY2ltYWwuUk9VTkRfSEFMRl9FVkVOID0gNjtcclxuICAgIERlY2ltYWwuUk9VTkRfSEFMRl9DRUlMID0gNztcclxuICAgIERlY2ltYWwuUk9VTkRfSEFMRl9GTE9PUiA9IDg7XHJcbiAgICBEZWNpbWFsLkVVQ0xJRCA9IDk7XHJcblxyXG4gICAgRGVjaW1hbC5jb25maWcgPSBEZWNpbWFsLnNldCA9IGNvbmZpZztcclxuICAgIERlY2ltYWwuY2xvbmUgPSBjbG9uZTtcclxuICAgIERlY2ltYWwuaXNEZWNpbWFsID0gaXNEZWNpbWFsSW5zdGFuY2U7XHJcblxyXG4gICAgRGVjaW1hbC5hYnMgPSBhYnM7XHJcbiAgICBEZWNpbWFsLmFjb3MgPSBhY29zO1xyXG4gICAgRGVjaW1hbC5hY29zaCA9IGFjb3NoOyAgICAgICAgLy8gRVM2XHJcbiAgICBEZWNpbWFsLmFkZCA9IGFkZDtcclxuICAgIERlY2ltYWwuYXNpbiA9IGFzaW47XHJcbiAgICBEZWNpbWFsLmFzaW5oID0gYXNpbmg7ICAgICAgICAvLyBFUzZcclxuICAgIERlY2ltYWwuYXRhbiA9IGF0YW47XHJcbiAgICBEZWNpbWFsLmF0YW5oID0gYXRhbmg7ICAgICAgICAvLyBFUzZcclxuICAgIERlY2ltYWwuYXRhbjIgPSBhdGFuMjtcclxuICAgIERlY2ltYWwuY2JydCA9IGNicnQ7ICAgICAgICAgIC8vIEVTNlxyXG4gICAgRGVjaW1hbC5jZWlsID0gY2VpbDtcclxuICAgIERlY2ltYWwuY29zID0gY29zO1xyXG4gICAgRGVjaW1hbC5jb3NoID0gY29zaDsgICAgICAgICAgLy8gRVM2XHJcbiAgICBEZWNpbWFsLmRpdiA9IGRpdjtcclxuICAgIERlY2ltYWwuZXhwID0gZXhwO1xyXG4gICAgRGVjaW1hbC5mbG9vciA9IGZsb29yO1xyXG4gICAgRGVjaW1hbC5oeXBvdCA9IGh5cG90OyAgICAgICAgLy8gRVM2XHJcbiAgICBEZWNpbWFsLmxuID0gbG47XHJcbiAgICBEZWNpbWFsLmxvZyA9IGxvZztcclxuICAgIERlY2ltYWwubG9nMTAgPSBsb2cxMDsgICAgICAgIC8vIEVTNlxyXG4gICAgRGVjaW1hbC5sb2cyID0gbG9nMjsgICAgICAgICAgLy8gRVM2XHJcbiAgICBEZWNpbWFsLm1heCA9IG1heDtcclxuICAgIERlY2ltYWwubWluID0gbWluO1xyXG4gICAgRGVjaW1hbC5tb2QgPSBtb2Q7XHJcbiAgICBEZWNpbWFsLm11bCA9IG11bDtcclxuICAgIERlY2ltYWwucG93ID0gcG93O1xyXG4gICAgRGVjaW1hbC5yYW5kb20gPSByYW5kb207XHJcbiAgICBEZWNpbWFsLnJvdW5kID0gcm91bmQ7XHJcbiAgICBEZWNpbWFsLnNpZ24gPSBzaWduOyAgICAgICAgICAvLyBFUzZcclxuICAgIERlY2ltYWwuc2luID0gc2luO1xyXG4gICAgRGVjaW1hbC5zaW5oID0gc2luaDsgICAgICAgICAgLy8gRVM2XHJcbiAgICBEZWNpbWFsLnNxcnQgPSBzcXJ0O1xyXG4gICAgRGVjaW1hbC5zdWIgPSBzdWI7XHJcbiAgICBEZWNpbWFsLnRhbiA9IHRhbjtcclxuICAgIERlY2ltYWwudGFuaCA9IHRhbmg7ICAgICAgICAgIC8vIEVTNlxyXG4gICAgRGVjaW1hbC50cnVuYyA9IHRydW5jOyAgICAgICAgLy8gRVM2XHJcblxyXG4gICAgaWYgKG9iaiA9PT0gdm9pZCAwKSBvYmogPSB7fTtcclxuICAgIGlmIChvYmopIHtcclxuICAgICAgaWYgKG9iai5kZWZhdWx0cyAhPT0gdHJ1ZSkge1xyXG4gICAgICAgIHBzID0gWydwcmVjaXNpb24nLCAncm91bmRpbmcnLCAndG9FeHBOZWcnLCAndG9FeHBQb3MnLCAnbWF4RScsICdtaW5FJywgJ21vZHVsbycsICdjcnlwdG8nXTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcHMubGVuZ3RoOykgaWYgKCFvYmouaGFzT3duUHJvcGVydHkocCA9IHBzW2krK10pKSBvYmpbcF0gPSB0aGlzW3BdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgRGVjaW1hbC5jb25maWcob2JqKTtcclxuXHJcbiAgICByZXR1cm4gRGVjaW1hbDtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCBkaXZpZGVkIGJ5IGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZGl2KHgsIHkpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5kaXYoeSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBleHBvbmVudGlhbCBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgcG93ZXIgdG8gd2hpY2ggdG8gcmFpc2UgdGhlIGJhc2Ugb2YgdGhlIG5hdHVyYWwgbG9nLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZXhwKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5leHAoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByb3VuZCB0byBhbiBpbnRlZ2VyIHVzaW5nIGBST1VORF9GTE9PUmAuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBmbG9vcih4KSB7XHJcbiAgICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCAzKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGUgc3VtIG9mIHRoZSBzcXVhcmVzIG9mIHRoZSBhcmd1bWVudHMsXHJcbiAgICogcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogaHlwb3QoYSwgYiwgLi4uKSA9IHNxcnQoYV4yICsgYl4yICsgLi4uKVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gaHlwb3QoKSB7XHJcbiAgICB2YXIgaSwgbixcclxuICAgICAgdCA9IG5ldyB0aGlzKDApO1xyXG5cclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7KSB7XHJcbiAgICAgIG4gPSBuZXcgdGhpcyhhcmd1bWVudHNbaSsrXSk7XHJcbiAgICAgIGlmICghbi5kKSB7XHJcbiAgICAgICAgaWYgKG4ucykge1xyXG4gICAgICAgICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gICAgICAgICAgcmV0dXJuIG5ldyB0aGlzKDEgLyAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdCA9IG47XHJcbiAgICAgIH0gZWxzZSBpZiAodC5kKSB7XHJcbiAgICAgICAgdCA9IHQucGx1cyhuLnRpbWVzKG4pKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gdC5zcXJ0KCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiBvYmplY3QgaXMgYSBEZWNpbWFsIGluc3RhbmNlICh3aGVyZSBEZWNpbWFsIGlzIGFueSBEZWNpbWFsIGNvbnN0cnVjdG9yKSxcclxuICAgKiBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gaXNEZWNpbWFsSW5zdGFuY2Uob2JqKSB7XHJcbiAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRGVjaW1hbCB8fCBvYmogJiYgb2JqLm5hbWUgPT09ICdbb2JqZWN0IERlY2ltYWxdJyB8fCBmYWxzZTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGxvZ2FyaXRobSBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbG4oeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmxuKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbG9nIG9mIGB4YCB0byB0aGUgYmFzZSBgeWAsIG9yIHRvIGJhc2UgMTAgaWYgbm8gYmFzZVxyXG4gICAqIGlzIHNwZWNpZmllZCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogbG9nW3ldKHgpXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBhcmd1bWVudCBvZiB0aGUgbG9nYXJpdGhtLlxyXG4gICAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIGJhc2Ugb2YgdGhlIGxvZ2FyaXRobS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGxvZyh4LCB5KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkubG9nKHkpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGJhc2UgMiBsb2dhcml0aG0gb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGxvZzIoeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmxvZygyKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBiYXNlIDEwIGxvZ2FyaXRobSBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbG9nMTAoeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmxvZygxMCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbWF4aW11bSBvZiB0aGUgYXJndW1lbnRzLlxyXG4gICAqXHJcbiAgICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBtYXgoKSB7XHJcbiAgICByZXR1cm4gbWF4T3JNaW4odGhpcywgYXJndW1lbnRzLCAnbHQnKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBtaW5pbXVtIG9mIHRoZSBhcmd1bWVudHMuXHJcbiAgICpcclxuICAgKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIG1pbigpIHtcclxuICAgIHJldHVybiBtYXhPck1pbih0aGlzLCBhcmd1bWVudHMsICdndCcpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIG1vZHVsbyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzXHJcbiAgICogdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIG1vZCh4LCB5KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkubW9kKHkpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIG11bHRpcGxpZWQgYnkgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBtdWwoeCwgeSkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLm11bCh5KTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByYWlzZWQgdG8gdGhlIHBvd2VyIGB5YCwgcm91bmRlZCB0byBwcmVjaXNpb25cclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYmFzZS5cclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBleHBvbmVudC5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHBvdyh4LCB5KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkucG93KHkpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJucyBhIG5ldyBEZWNpbWFsIHdpdGggYSByYW5kb20gdmFsdWUgZXF1YWwgdG8gb3IgZ3JlYXRlciB0aGFuIDAgYW5kIGxlc3MgdGhhbiAxLCBhbmQgd2l0aFxyXG4gICAqIGBzZGAsIG9yIGBEZWNpbWFsLnByZWNpc2lvbmAgaWYgYHNkYCBpcyBvbWl0dGVkLCBzaWduaWZpY2FudCBkaWdpdHMgKG9yIGxlc3MgaWYgdHJhaWxpbmcgemVyb3NcclxuICAgKiBhcmUgcHJvZHVjZWQpLlxyXG4gICAqXHJcbiAgICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDAgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiByYW5kb20oc2QpIHtcclxuICAgIHZhciBkLCBlLCBrLCBuLFxyXG4gICAgICBpID0gMCxcclxuICAgICAgciA9IG5ldyB0aGlzKDEpLFxyXG4gICAgICByZCA9IFtdO1xyXG5cclxuICAgIGlmIChzZCA9PT0gdm9pZCAwKSBzZCA9IHRoaXMucHJlY2lzaW9uO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICBrID0gTWF0aC5jZWlsKHNkIC8gTE9HX0JBU0UpO1xyXG5cclxuICAgIGlmICghdGhpcy5jcnlwdG8pIHtcclxuICAgICAgZm9yICg7IGkgPCBrOykgcmRbaSsrXSA9IE1hdGgucmFuZG9tKCkgKiAxZTcgfCAwO1xyXG5cclxuICAgIC8vIEJyb3dzZXJzIHN1cHBvcnRpbmcgY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5cclxuICAgIH0gZWxzZSBpZiAoY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xyXG4gICAgICBkID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDMyQXJyYXkoaykpO1xyXG5cclxuICAgICAgZm9yICg7IGkgPCBrOykge1xyXG4gICAgICAgIG4gPSBkW2ldO1xyXG5cclxuICAgICAgICAvLyAwIDw9IG4gPCA0Mjk0OTY3Mjk2XHJcbiAgICAgICAgLy8gUHJvYmFiaWxpdHkgbiA+PSA0LjI5ZTksIGlzIDQ5NjcyOTYgLyA0Mjk0OTY3Mjk2ID0gMC4wMDExNiAoMSBpbiA4NjUpLlxyXG4gICAgICAgIGlmIChuID49IDQuMjllOSkge1xyXG4gICAgICAgICAgZFtpXSA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQzMkFycmF5KDEpKVswXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIC8vIDAgPD0gbiA8PSA0Mjg5OTk5OTk5XHJcbiAgICAgICAgICAvLyAwIDw9IChuICUgMWU3KSA8PSA5OTk5OTk5XHJcbiAgICAgICAgICByZFtpKytdID0gbiAlIDFlNztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAvLyBOb2RlLmpzIHN1cHBvcnRpbmcgY3J5cHRvLnJhbmRvbUJ5dGVzLlxyXG4gICAgfSBlbHNlIGlmIChjcnlwdG8ucmFuZG9tQnl0ZXMpIHtcclxuXHJcbiAgICAgIC8vIGJ1ZmZlclxyXG4gICAgICBkID0gY3J5cHRvLnJhbmRvbUJ5dGVzKGsgKj0gNCk7XHJcblxyXG4gICAgICBmb3IgKDsgaSA8IGs7KSB7XHJcblxyXG4gICAgICAgIC8vIDAgPD0gbiA8IDIxNDc0ODM2NDhcclxuICAgICAgICBuID0gZFtpXSArIChkW2kgKyAxXSA8PCA4KSArIChkW2kgKyAyXSA8PCAxNikgKyAoKGRbaSArIDNdICYgMHg3ZikgPDwgMjQpO1xyXG5cclxuICAgICAgICAvLyBQcm9iYWJpbGl0eSBuID49IDIuMTRlOSwgaXMgNzQ4MzY0OCAvIDIxNDc0ODM2NDggPSAwLjAwMzUgKDEgaW4gMjg2KS5cclxuICAgICAgICBpZiAobiA+PSAyLjE0ZTkpIHtcclxuICAgICAgICAgIGNyeXB0by5yYW5kb21CeXRlcyg0KS5jb3B5KGQsIGkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgLy8gMCA8PSBuIDw9IDIxMzk5OTk5OTlcclxuICAgICAgICAgIC8vIDAgPD0gKG4gJSAxZTcpIDw9IDk5OTk5OTlcclxuICAgICAgICAgIHJkLnB1c2gobiAlIDFlNyk7XHJcbiAgICAgICAgICBpICs9IDQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpID0gayAvIDQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBFcnJvcihjcnlwdG9VbmF2YWlsYWJsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgayA9IHJkWy0taV07XHJcbiAgICBzZCAlPSBMT0dfQkFTRTtcclxuXHJcbiAgICAvLyBDb252ZXJ0IHRyYWlsaW5nIGRpZ2l0cyB0byB6ZXJvcyBhY2NvcmRpbmcgdG8gc2QuXHJcbiAgICBpZiAoayAmJiBzZCkge1xyXG4gICAgICBuID0gbWF0aHBvdygxMCwgTE9HX0JBU0UgLSBzZCk7XHJcbiAgICAgIHJkW2ldID0gKGsgLyBuIHwgMCkgKiBuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSB0cmFpbGluZyB3b3JkcyB3aGljaCBhcmUgemVyby5cclxuICAgIGZvciAoOyByZFtpXSA9PT0gMDsgaS0tKSByZC5wb3AoKTtcclxuXHJcbiAgICAvLyBaZXJvP1xyXG4gICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgIGUgPSAwO1xyXG4gICAgICByZCA9IFswXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGUgPSAtMTtcclxuXHJcbiAgICAgIC8vIFJlbW92ZSBsZWFkaW5nIHdvcmRzIHdoaWNoIGFyZSB6ZXJvIGFuZCBhZGp1c3QgZXhwb25lbnQgYWNjb3JkaW5nbHkuXHJcbiAgICAgIGZvciAoOyByZFswXSA9PT0gMDsgZSAtPSBMT0dfQkFTRSkgcmQuc2hpZnQoKTtcclxuXHJcbiAgICAgIC8vIENvdW50IHRoZSBkaWdpdHMgb2YgdGhlIGZpcnN0IHdvcmQgb2YgcmQgdG8gZGV0ZXJtaW5lIGxlYWRpbmcgemVyb3MuXHJcbiAgICAgIGZvciAoayA9IDEsIG4gPSByZFswXTsgbiA+PSAxMDsgbiAvPSAxMCkgaysrO1xyXG5cclxuICAgICAgLy8gQWRqdXN0IHRoZSBleHBvbmVudCBmb3IgbGVhZGluZyB6ZXJvcyBvZiB0aGUgZmlyc3Qgd29yZCBvZiByZC5cclxuICAgICAgaWYgKGsgPCBMT0dfQkFTRSkgZSAtPSBMT0dfQkFTRSAtIGs7XHJcbiAgICB9XHJcblxyXG4gICAgci5lID0gZTtcclxuICAgIHIuZCA9IHJkO1xyXG5cclxuICAgIHJldHVybiByO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIHJvdW5kZWQgdG8gYW4gaW50ZWdlciB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiBUbyBlbXVsYXRlIGBNYXRoLnJvdW5kYCwgc2V0IHJvdW5kaW5nIHRvIDcgKFJPVU5EX0hBTEZfQ0VJTCkuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiByb3VuZCh4KSB7XHJcbiAgICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCB0aGlzLnJvdW5kaW5nKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVyblxyXG4gICAqICAgMSAgICBpZiB4ID4gMCxcclxuICAgKiAgLTEgICAgaWYgeCA8IDAsXHJcbiAgICogICAwICAgIGlmIHggaXMgMCxcclxuICAgKiAgLTAgICAgaWYgeCBpcyAtMCxcclxuICAgKiAgIE5hTiAgb3RoZXJ3aXNlXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBzaWduKHgpIHtcclxuICAgIHggPSBuZXcgdGhpcyh4KTtcclxuICAgIHJldHVybiB4LmQgPyAoeC5kWzBdID8geC5zIDogMCAqIHgucykgOiB4LnMgfHwgTmFOO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHNpbmUgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gICAqIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gc2luKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5zaW4oKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIHNpbmUgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gc2luaCh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuc2luaCgpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHNxdWFyZSByb290IG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBzcXJ0KHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5zcXJ0KCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgbWludXMgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gICAqIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBzdWIoeCwgeSkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLnN1Yih5KTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB0YW5nZW50IG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHRhbih4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkudGFuKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyB0YW5nZW50IG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHRhbmgoeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLnRhbmgoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCB0cnVuY2F0ZWQgdG8gYW4gaW50ZWdlci5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHRydW5jKHgpIHtcclxuICAgIHJldHVybiBmaW5hbGlzZSh4ID0gbmV3IHRoaXMoeCksIHguZSArIDEsIDEpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIENyZWF0ZSBhbmQgY29uZmlndXJlIGluaXRpYWwgRGVjaW1hbCBjb25zdHJ1Y3Rvci5cclxuICBEZWNpbWFsID0gY2xvbmUoREVGQVVMVFMpO1xyXG5cclxuICBEZWNpbWFsWydkZWZhdWx0J10gPSBEZWNpbWFsLkRlY2ltYWwgPSBEZWNpbWFsO1xyXG5cclxuICAvLyBDcmVhdGUgdGhlIGludGVybmFsIGNvbnN0YW50cyBmcm9tIHRoZWlyIHN0cmluZyB2YWx1ZXMuXHJcbiAgTE4xMCA9IG5ldyBEZWNpbWFsKExOMTApO1xyXG4gIFBJID0gbmV3IERlY2ltYWwoUEkpO1xyXG5cclxuXHJcbiAgLy8gRXhwb3J0LlxyXG5cclxuXHJcbiAgLy8gQU1ELlxyXG4gIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgZGVmaW5lKGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIERlY2ltYWw7XHJcbiAgICB9KTtcclxuXHJcbiAgLy8gTm9kZSBhbmQgb3RoZXIgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cy5cclxuICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gRGVjaW1hbDtcclxuXHJcbiAgLy8gQnJvd3Nlci5cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKCFnbG9iYWxTY29wZSkge1xyXG4gICAgICBnbG9iYWxTY29wZSA9IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYgJiYgc2VsZi5zZWxmID09IHNlbGYgPyBzZWxmIDogd2luZG93O1xyXG4gICAgfVxyXG5cclxuICAgIG5vQ29uZmxpY3QgPSBnbG9iYWxTY29wZS5EZWNpbWFsO1xyXG4gICAgRGVjaW1hbC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBnbG9iYWxTY29wZS5EZWNpbWFsID0gbm9Db25mbGljdDtcclxuICAgICAgcmV0dXJuIERlY2ltYWw7XHJcbiAgICB9O1xyXG5cclxuICAgIGdsb2JhbFNjb3BlLkRlY2ltYWwgPSBEZWNpbWFsO1xyXG4gIH1cclxufSkodGhpcyk7XHJcbiIsImxldCBkZWJ1ZyA9IGZhbHNlO1xyXG5cclxuLy9nbGFib2wgcGFyYW1zXHJcbmxldCBkZWZhdWx0TGFuZyA9ICdlbi1FTic7XHJcbmxldCBzdXBwb3J0ZWRMYW5nID0gJ2VuLUVOJztcclxubGV0IGh0bWxTZWxlY3RvciA9ICdsb2MnOyAvLyBjbGFzcyB0byBhZGQgdG8gdGhlIGh0bWwgdGFnIHRvIGxvY2FsaXplXHJcbmxldCBodG1sRGF0YUtleSA9ICdsayc7IC8vIGRhdGEga2V5IHRvIHVzZSB0byBzdG9yZSB0aGUgcGF0aCB0byB0ZXh0XHJcbmxldCBrZXkgPSAnbGFuZyc7IC8vIGtleSB1c2VkIGluIHRoZSBnZXQgcGFyYW1ldGVyIG9mIHRoZSBVUkwgdG8gc2V0IGEgc3BlY2lmaWMgbGFuZ3VhZ2VcclxuXHJcbmxldCBjdXJyZW50TGFuZyA9IHVuZGVmaW5lZDtcclxubGV0IGN1cnJlbnRMaWIgPSB1bmRlZmluZWQ7XHJcbmxldCBsaWJzID0ge307XHJcbmxldCBsaXN0ZW5lcnMgPSB7fTtcclxuXHJcbmZ1bmN0aW9uIHNldExhbmcgKGxhbmcpIHtcclxuICAgIGlmICh0eXBlb2YobGFuZykgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBjdXJyZW50TGFuZyA9ICh0eXBlb2YoY3VycmVudExhbmcpID09PSBcInVuZGVmaW5lZFwiKSA/IGRlZmF1bHRMYW5nIDogY3VycmVudExhbmc7XHJcbiAgICB9IGVsc2UgY3VycmVudExhbmcgPSBsYW5nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRDdXJyZW50TGliIChsaWJOYW1lKSB7XHJcbiAgICBjdXJyZW50TGliID0gbGliTmFtZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlyZUxpc3RlbmVycyhsb2FkZWRMaWIpIHtcclxuICAgIHdoaWxlICh0b0ZpcmUgPSBsaXN0ZW5lcnNbbG9hZGVkTGliXS5wb3AoKSkge1xyXG4gICAgICAgIHRvRmlyZS5jYWxsKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWQgKGxpYk5hbWUsY2FsbGJhY2spIHtcclxuXHJcbiAgICAvLyBwcmVwYXJpbmcgdGhlIGxhbmcgYW5kIGxpYiB0byBsb2FkXHJcbiAgICBsZXQgbGliVG9Mb2FkID0gbGliTmFtZTtcclxuICAgIGlmICh0eXBlb2YobGliVG9Mb2FkKSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIGlmICh0eXBlb2YoY3VycmVudExpYikgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkxvY2FsaXphdGlvbiA6IFRyeWluZyB0byBsb2FkIFhNTCBmaWxlIHdpdGhvdXQgcHJvdmlkaW5nIGEgbGliTmFtZVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGliVG9Mb2FkID0gY3VycmVudExpYjtcclxuICAgIH1cclxuICAgIGlmIChPYmplY3Qua2V5cyhsaWJzKS5sZW5ndGggPT0gMClcclxuICAgICAgICBzZXRDdXJyZW50TGliKGxpYlRvTG9hZCk7XHJcblxyXG4gICAgaWYgKHR5cGVvZihjdXJyZW50TGFuZykgPT09IFwidW5kZWZpbmVkXCIpXHJcbiAgICAgICAgc2V0TGFuZygpO1xyXG5cclxuICAgIGxldCBsaWJQYXRoID0gY3VycmVudExhbmcrJy8nK2xpYlRvTG9hZDtcclxuXHJcbiAgICAvL2NoZWNraW5nIGlmIHRoZSBsaWIgaXMgbG9hZGVkXHJcbiAgICBpZiAodHlwZW9mKGxpYnNbbGliUGF0aF0pID09PSBcInVuZGVmaW5lZFwiKSB7IC8vIGlmIHRoZSBsaWIgaXNuJ3QgYWxyZWFkeSBsb2FkZWRcclxuICAgICAgICBsaWJzW2xpYlBhdGhdID0gZmFsc2U7XHJcbiAgICAgICAgbGlzdGVuZXJzW2xpYlBhdGhdID0gdHlwZW9mKGNhbGxiYWNrKSA9PT0gXCJ1bmRlZmluZWRcIiA/IFtdIDogW2NhbGxiYWNrXTtcclxuICAgICAgICBmZXRjaCgnbGFuZy8nK2xpYlBhdGgrJy54bWwnKVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS50ZXh0KCkpXHJcbiAgICAgICAgICAgIC50aGVuKHN0ciA9PiAobmV3IHdpbmRvdy5ET01QYXJzZXIoKSkucGFyc2VGcm9tU3RyaW5nKHN0ciwgXCJ0ZXh0L3htbFwiKSlcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsaWJzW2xpYlBhdGhdID0gWE1MdG9KU09OKGRhdGEpLmJvZHk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGVidWcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2NhbGl6YXRpb24gOiBMb2FkZWQgbGliXCIsbGliUGF0aCxsaWJzW2xpYlBhdGhdKTtcclxuICAgICAgICAgICAgICAgIGZpcmVMaXN0ZW5lcnMobGliUGF0aCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiTG9jYWxpemF0aW9uIDogRXJyb3Igd2hpbGUgbG9hZGluZyB0aGUgWE1MOiBcIixlcnJvci5tZXNzYWdlLGxpYlBhdGgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7IC8vIGxpYnJhcnkgaXMgYWxyZWFkeSBsb2FkZWRcclxuICAgICAgICBpZiAoISh0eXBlb2YoY2FsbGJhY2spID09PSBcInVuZGVmaW5lZFwiKSkge1xyXG4gICAgICAgICAgICBsaXN0ZW5lcnNbbGliUGF0aF0ucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIGlmIChsaWJzW2xpYlBhdGhdKVxyXG4gICAgICAgICAgICAgICAgZmlyZUxpc3RlbmVycyhsaWJQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQXJyYXkobykge1xyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuYXBwbHkobykgPT09ICdbb2JqZWN0IEFycmF5XSc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlTm9kZSh4bWxOb2RlLCByZXN1bHQpIHtcclxuICAgIGlmICh4bWxOb2RlLm5vZGVOYW1lID09IFwiI3RleHRcIikge1xyXG4gICAgICAgIHZhciB2ID0geG1sTm9kZS5ub2RlVmFsdWU7XHJcbiAgICAgICAgaWYgKHYudHJpbSgpKSB7XHJcbiAgICAgICAgICAgcmVzdWx0WycjdGV4dCddID0gdjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBqc29uTm9kZSA9IHt9O1xyXG4gICAgdmFyIGV4aXN0aW5nID0gcmVzdWx0W3htbE5vZGUubm9kZU5hbWVdO1xyXG4gICAgaWYoZXhpc3RpbmcpIHtcclxuICAgICAgICBpZighaXNBcnJheShleGlzdGluZykpIHtcclxuICAgICAgICAgICAgcmVzdWx0W3htbE5vZGUubm9kZU5hbWVdID0gW2V4aXN0aW5nLCBqc29uTm9kZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHRbeG1sTm9kZS5ub2RlTmFtZV0ucHVzaChqc29uTm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFt4bWxOb2RlLm5vZGVOYW1lXSA9IGpzb25Ob2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKHhtbE5vZGUuYXR0cmlidXRlcykge1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB4bWxOb2RlLmF0dHJpYnV0ZXMubGVuZ3RoO1xyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlID0geG1sTm9kZS5hdHRyaWJ1dGVzW2ldO1xyXG4gICAgICAgICAgICBqc29uTm9kZVthdHRyaWJ1dGUubm9kZU5hbWVdID0gYXR0cmlidXRlLm5vZGVWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxlbmd0aCA9IHhtbE5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBwYXJzZU5vZGUoeG1sTm9kZS5jaGlsZE5vZGVzW2ldLCBqc29uTm9kZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFhNTHRvSlNPTiAoeG1sKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZih4bWwuY2hpbGROb2Rlcy5sZW5ndGgpIHtcclxuICAgICAgICBwYXJzZU5vZGUoeG1sLmNoaWxkTm9kZXNbMF0sIHJlc3VsdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TGliIChsaWIpIHtcclxuICAgIGlmICh0eXBlb2YobGliKSA9PT0gXCJ1bmRlZmluZWRcIilcclxuICAgICAgICBsaWIgPSBjdXJyZW50TGliO1xyXG4gICAgbGV0IGxpYlBhdGggPSBjdXJyZW50TGFuZysnLycrbGliO1xyXG4gICAgaWYoIWxpYnNbbGliUGF0aF0pIHtcclxuICAgICAgICBpZiAoZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkxvY2FsaXphdGlvbiA6IFRyeWluZyB0byBnZXQgYW4gdW5sb2FkZWQgbGliIDogXCIrbGliUGF0aClcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGlic1tsaWJQYXRoXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VGV4dChfcGF0aCxsaWIpIHtcclxuICAgIGxpYiA9IGdldExpYihsaWIpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBpZiAobGliKSB7XHJcbiAgICAgICAgICAgIGxldCBwYXRoID0gX3BhdGguc3BsaXQoXCI+XCIpO1xyXG4gICAgICAgICAgICB3aGlsZSAocGFydCA9IHBhdGguc2hpZnQoKSkge1xyXG4gICAgICAgICAgICAgICAgbGliID0gbGliW3BhcnRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBsaWJbJyN0ZXh0J107XHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBpZiAoZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9jYWxpemF0aW9uIDogRXJyb3IgcmV0cmlldmluZyB0aGUgdGV4dCBmb3IgdGhlIGtleVwiLF9wYXRoKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIFwiW1wiK19wYXRoK1wiXVwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVBhZ2UgKGxpYk5hbWUpIHtcclxuICAgIGxldCBlbGVtcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoaHRtbFNlbGVjdG9yKVxyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGVsZW1zLmxlbmd0aDtpKyspIHtcclxuICAgICAgICBsZXQgcGF0aCA9IGVsZW1zW2ldLmF0dHJpYnV0ZXNbXCJkYXRhLVwiK2h0bWxEYXRhS2V5XS52YWx1ZTtcclxuICAgICAgICBlbGVtc1tpXS5pbm5lckhUTUwgPSBnZXRUZXh0KHBhdGgsbGliTmFtZSlcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydHMuc2V0TGFuZyA9IHNldExhbmc7IC8vIHVzZWQgdG8gY2hhbmdlIHRoZSBsYW5ndWFnZVxyXG5leHBvcnRzLnNldExpYiA9IHNldEN1cnJlbnRMaWI7XHJcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XHJcbmV4cG9ydHMucGFyc2VQYWdlID0gcGFyc2VQYWdlO1xyXG5leHBvcnRzLmdldExpYiA9IGdldExpYjtcclxuZXhwb3J0cy5nZXRUZXh0ID0gZ2V0VGV4dDtcclxuZXhwb3J0cy5jb25maWcgPSB7XHJcbiAgICBjbGFzcyA6IGh0bWxTZWxlY3RvcixcclxuICAgIGRhdGFLZXkgOiBodG1sRGF0YUtleSxcclxufVxyXG4iLCJleHBvcnRzLklJRl92ZXJzaW9uID0gJzAuMC4yJztcclxuXHJcbmV4cG9ydHMuR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZS5qcycpO1xyXG5leHBvcnRzLmRhdGFTdHJ1Y3QgPSB7XHJcbiAgICBCcmVha0luZmluaXR5IDogcmVxdWlyZSgnLi9kYXRhU3RydWN0L2JyZWFraW5maW5pdHkuanMnKSxcclxuICAgIERlY2ltYWwgOiByZXF1aXJlKCcuL2RhdGFTdHJ1Y3QvZGVjaW1hbC5qcycpLFxyXG59XHJcbmV4cG9ydHMuVmlldyA9IHJlcXVpcmUoJy4vdmlldy5qcycpO1xyXG5leHBvcnRzLmh0bWwgPSByZXF1aXJlKCcuL2h0bWwuanMnKTtcclxuZXhwb3J0cy5sb2NhbGl6YXRpb24gPSByZXF1aXJlKCcuL2xvY2FsaXphdGlvbi5qcycpO1xyXG5cclxud2luZG93LklJRiA9IGV4cG9ydHM7XHJcbiIsImxldCBkZWJ1ZyA9IHRydWU7XHJcblxyXG5sZXQgSUlGID0gcmVxdWlyZShcIi4vbWFpblwiKTtcclxuXHJcbmNsYXNzIFNhdmUge1xyXG4gICAgY29uc3RydWN0b3IgKHNhdmVLZXksZ2FtZU9iaikge1xyXG5cclxuICAgICAgICBpZiAoZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2ZSA6IG5ldyBTYXZlKClcIixzYXZlS2V5LGdhbWVPYmopO1xyXG5cclxuICAgICAgICB0aGlzLnNhdmVLZXkgPSBzYXZlS2V5K1wiX0lJRlNhdmVcIjtcclxuICAgICAgICB0aGlzLmdhbWVPYmogPSBnYW1lT2JqO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc1NhdmVEYXRhKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy5uZXdTYXZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBoYXNTYXZlRGF0YSAoKSB7XHJcbiAgICAgICAgcmV0dXJuICEobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5zYXZlS2V5KSA9PT0gbnVsbCk7XHJcbiAgICB9XHJcbiAgICBjbGVhclNhdmUgKCkge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuc2F2ZUtleSk7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgfVxyXG4gICAgbmV3U2F2ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbWV0YSA6IHtcclxuICAgICAgICAgICAgICAgIElJRl92ZXJzaW9uIDogSUlGLklJRl92ZXJzaW9uLFxyXG4gICAgICAgICAgICAgICAgZ2FtZV92ZXJzaW9uIDogdGhpcy5nYW1lT2JqLmNvbmZpZy5nYW1lVmVyc2lvblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB2YWx1ZXMgOiB7fSxcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzYXZlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLmdhbWVPYmoubGlzdFZhbHVlcygpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YS52YWx1ZXNba2V5XSA9IHRoYXQuZ2FtZU9iai5nZXRWYWx1ZShrZXkpLnRvSlNPTigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICh0aGlzLmdhbWVPYmouY29uZmlnLnRpY2tzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS50aW1lID0gdGhpcy5nYW1lT2JqLmdldFRpY2tlcigpLnRvSlNPTigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2F2ZSA6IHNhdmluZyBkYXRhIHRvIGxvY2Fsc3RvcmFnZScsdGhpcy5kYXRhKTtcclxuXHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5zYXZlS2V5LEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSkpO1xyXG4gICAgfVxyXG4gICAgbG9hZCgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnNhdmVLZXkpKTtcclxuICAgICAgICB0aGlzLnVwZ3JhZGVTYXZlX0lJRigpO1xyXG4gICAgICAgIHRoaXMudXBncmFkZVNhdmVfR2FtZSgpO1xyXG4gICAgICAgIGlmIChkZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NhdmUgOiBsb2FkaW5nIGRhdGEgZnJvbSBsb2NhbHN0b3JhZ2UnLHRoaXMuZGF0YSk7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqLmxpc3RWYWx1ZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICAgICAgICB0aGF0LmdhbWVPYmouZ2V0VmFsdWUoa2V5KS5mcm9tSlNPTih0aGF0LmRhdGEudmFsdWVzW2tleV0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICgodGhpcy5nYW1lT2JqLmNvbmZpZy50aWNrcykgJiYgISh0eXBlb2YodGhpcy5kYXRhLnRpbWUpID09PSBcInVuZGVmaW5lZFwiKSkge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVPYmouZ2V0VGlja2VyKCkuZnJvbUpTT04odGhpcy5kYXRhLnRpbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xyXG4gICAgfVxyXG4gICAgdXBncmFkZVNhdmVfSUlGKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLm1ldGEuSUlGX3ZlcnNpb24gPT09IElJRi5JSUZfdmVyc2lvbilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAoZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTYXZlIDogbWlncmF0aW5nIElJRiBzYXZlZERhdGEgZnJvbSAnLHRoaXMuZGF0YS5tZXRhLklJRl92ZXJzaW9uLCd0bycsSUlGLklJRl92ZXJzaW9uKTtcclxuXHJcbiAgICAgICAgc3dpdGNoKHRoaXMuZGF0YS5tZXRhLklJRl92ZXJzaW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJzAuMC4xJyA6IDsvLyBhZGQgaGVyZSB0aGUgbWlncmF0aW9uIGNvZGUgZm9yIHNhdmVEYXRhIGZyb20gMC4wLjEgdG8gdGhlIG5leHQgdmVyc2lvbi4gRG9uJ3QgcHV0IGEgYnJlYWssIGFuZCBwdXQgdmVyc2lvbnMgaW4gY2hyb25vbG9naWNhbCBvcmRlciB0byB0cmlnZ2VyIGFsbCB0aGUgdXBncmFkZXMgbmVjZXNzYXJ5XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLmRhdGEudmFsdWVzID0gdGhpcy5kYXRhLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAvLyBkZWxldGUodGhpcy5kYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICBkZWZhdWx0OmJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRhdGEubWV0YS5JSUZfdmVyc2lvbiA9IElJRi5JSUZfdmVyc2lvbjtcclxuXHJcbiAgICB9XHJcbiAgICB1cGdyYWRlU2F2ZV9HYW1lICgpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5tZXRhLmdhbWVfdmVyc2lvbiA9PT0gdGhpcy5nYW1lT2JqLmNvbmZpZy5nYW1lVmVyc2lvbilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAoZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTYXZlIDogbWlncmF0aW5nIGdhbWUgc2F2ZWREYXRhIGZyb20gJyx0aGlzLmRhdGEubWV0YS5nYW1lX3ZlcnNpb24sJ3RvJyx0aGlzLmdhbWVPYmouY29uZmlnLmdhbWVWZXJzaW9uKTtcclxuXHJcbiAgICAgICAgaWYgKCEodHlwZW9mKHRoaXMuZ2FtZU9iai51cGdyYWRlU2F2ZSkgPT09ICd1bmRlZmluZWQnKSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEudmFsdWVzID0gdGhpcy5nYW1lT2JqLnVwZ3JhZGVTYXZlKHRoaXMuZGF0YS52YWx1ZXMsdGhpcy5kYXRhLm1ldGEuZ2FtZV92ZXJzaW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kYXRhLm1ldGEuZ2FtZV92ZXJzaW9uID0gdGhpcy5nYW1lT2JqLmNvbmZpZy5nYW1lVmVyc2lvbjtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2F2ZTtcclxuIiwibGV0IGRlYnVnID0gdHJ1ZTtcclxuXHJcbmxldCBfcnVubmluZyA9IG5ldyBXZWFrTWFwKCk7XHJcbmxldCBfbGFzdFRvdGFsVGlja3MgPSBuZXcgV2Vha01hcCgpO1xyXG5cclxuY2xhc3MgVGltZSB7XHJcbiAgICBjb25zdHJ1Y3RvciAodGlja2VkT2JqZWN0LHRpY2tzUGVyU2Vjb25kKSB7XHJcblxyXG4gICAgICAgIGlmIChkZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaW1lIDogbmV3IFRpbWUoKVwiLHRpY2tlZE9iamVjdCx0aWNrc1BlclNlY29uZCk7XHJcblxyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLnRpY2tlZE9iamVjdCA9IHRpY2tlZE9iamVjdDtcclxuICAgICAgICB0aGlzLnRpY2tzUGVyU2Vjb25kID0gdGlja3NQZXJTZWNvbmQ7XHJcbiAgICAgICAgdGhpcy53b3JrZXIgPSBuZXcgV29ya2VyKCdJSUZXb3JrZXIuanMnKTtcclxuICAgICAgICB0aGlzLndvcmtlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIHRoYXQuaGFuZGxlV29ya2VyTWVzc2FnZS5jYWxsKHRoYXQsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF9ydW5uaW5nLnNldCh0aGlzLGZhbHNlKTtcclxuICAgICAgICBfbGFzdFRvdGFsVGlja3Muc2V0KHRoaXMsMCk7XHJcbiAgICB9XHJcbiAgICBpc1J1bm5pbmcgKCkge1xyXG4gICAgICAgIHJldHVybiBfcnVubmluZy5nZXQodGhpcyk7XHJcbiAgICB9XHJcbiAgICB1bnBhdXNlICgpIHtcclxuICAgICAgICBfcnVubmluZy5zZXQodGhpcyx0cnVlKTtcclxuICAgICAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7YWN0aW9uOid1bnBhdXNlJ30pO1xyXG4gICAgfVxyXG4gICAgcGF1c2UgKCkge1xyXG4gICAgICAgIF9ydW5uaW5nLnNldCh0aGlzLGZhbHNlKTtcclxuICAgICAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7YWN0aW9uOidwYXVzZSd9KTtcclxuICAgIH1cclxuICAgIHJlc3RhcnQgKCkge1xyXG4gICAgICAgIF9ydW5uaW5nLnNldCh0aGlzLGZhbHNlKTtcclxuICAgICAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICAgIGFjdGlvbjoncmVzdGFydCcsXHJcbiAgICAgICAgICAgIHRpY2tzUGVyU2Vjb25kOnRpY2tzUGVyU2Vjb25kLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdGljayAoKSB7XHJcbiAgICAgICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjondGljayd9KTtcclxuICAgIH1cclxuICAgIGhhbmRsZVdvcmtlck1lc3NhZ2UoZSkge1xyXG4gICAgICAgIGlmIChkZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaW1lIDogcmVjaWV2aW5nIGEgbWVzc2FnZSBmcm9tIHRoZSB3b3JrZXJcIixlLmRhdGEsdGhpcyk7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gZS5kYXRhO1xyXG4gICAgICAgIHN3aXRjaCAocmVzcG9uc2VbMF0pIHtcclxuICAgICAgICAgICAgY2FzZSAnZG9UaWNrJyA6XHJcbiAgICAgICAgICAgICAgICBfbGFzdFRvdGFsVGlja3Muc2V0KHRoaXMscmVzcG9uc2VbMl0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlWzFdID4gMClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpY2tlZE9iamVjdC5wcm9jZXNzVGlja3MocmVzcG9uc2VbMV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQgOiBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcnVubmluZyA6IHRoaXMuaXNSdW5uaW5nKCksXHJcbiAgICAgICAgICAgIGxhc3RUaWNrcyA6IF9sYXN0VG90YWxUaWNrcy5nZXQodGhpcyksXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnJvbUpTT04oanNvbikge1xyXG4gICAgICAgIGlmICghKCh0eXBlb2YoanNvbi5ydW5uaW5nKSA9PT0gXCJ1bmRlZmluZWRcIikgfHwgKHR5cGVvZihqc29uLmxhc3RUaWNrcykgPT09IFwidW5kZWZpbmVkXCIpKSkge1xyXG4gICAgICAgICAgICBpZiAoZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRpbWUgOiBsb2FkaW5nIGZyb20ganNvblwiLGpzb24pO1xyXG4gICAgICAgICAgICBfcnVubmluZy5zZXQodGhpcyxqc29uLnJ1bm5pbmcpO1xyXG4gICAgICAgICAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICAgICAgICBhY3Rpb246J3NldFN0YXRlJyxcclxuICAgICAgICAgICAgICAgIHRpY2tzOmpzb24ubGFzdFRpY2tzLFxyXG4gICAgICAgICAgICAgICAgcnVubmluZzpqc29uLnJ1bm5pbmcsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGltZTtcclxuIiwibGV0IGRlYnVnID0gdHJ1ZTtcclxuXHJcbmxldCBodG1sID0gcmVxdWlyZSgnLi9odG1sJyk7XHJcblxyXG5sZXQgX3RwbHNUb0xvYWQgPSBuZXcgV2Vha01hcCgpO1xyXG5cclxuY2xhc3MgVmlldyB7XHJcbiAgICBjb25zdHJ1Y3RvciAoY29uZmlnKSB7XHJcblxyXG4gICAgICAgIGlmIChkZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJWaWV3IDogbmV3IFZpZXcoKVwiLGNvbmZpZyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHt9O1xyXG4gICAgICAgIGlmICghKHR5cGVvZihjb25maWcuY3VzdG9tVHBscykgPT09IFwidW5kZWZpbmVkXCIpKSB7XHJcbiAgICAgICAgICAgIF90cGxzVG9Mb2FkLnNldCh0aGlzLE9iamVjdC5rZXlzKGNvbmZpZy5jdXN0b21UcGxzKS5sZW5ndGgpO1xyXG4gICAgICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoY29uZmlnLmN1c3RvbVRwbHMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgICAgICBodG1sLmRlZmluZVRwbChrZXksY29uZmlnLmN1c3RvbVRwbHNba2V5XSx0aGF0LmZpbmlzaFRwbExvYWRpbmcsdGhhdClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9uSW5pdGlhbGl6ZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmaW5pc2hUcGxMb2FkaW5nKCkge1xyXG4gICAgICAgIF90cGxzVG9Mb2FkLnNldCh0aGlzLF90cGxzVG9Mb2FkLmdldCh0aGlzKS0xKTtcclxuICAgICAgICBpZiAoX3RwbHNUb0xvYWQuZ2V0KHRoaXMpPD0wKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Jbml0aWFsaXplZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uSW5pdGlhbGl6ZWQgKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBpZiAoIWRvY3VtZW50LmJvZHkpIHtcclxuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICB0aGF0Lm9uSW5pdGlhbGl6ZWQoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICBpZiAoZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVmlldyA6IFZpZXcgaW5pdGlhbGl6ZWRcIix0aGlzLmNvbmZpZylcclxuXHJcbiAgICAgICAgLy8gdHBscyBhcmUgbG9hZGVkLCB3ZSBidWlsZCB0aGUgY29tcG9uZW50c1xyXG4gICAgICAgIGlmICghKHR5cGVvZih0aGlzLmNvbmZpZy5jb21wb25lbnRzKSA9PT0gXCJ1bmRlZmluZWRcIikpIHtcclxuICAgICAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZy5jb21wb25lbnRzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5hZGRDb21wb25lbnQoa2V5LHRoYXQuY29uZmlnLmNvbXBvbmVudHNba2V5XSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoISh0eXBlb2YodGhpcy5jb25maWcub25Jbml0aWFsaXplZCkgPT09IFwidW5kZWZpbmVkXCIpKVxyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5vbkluaXRpYWxpemVkLmNhbGwodGhpcy5jb25maWcuZ2FtZU9iaik7XHJcbiAgICB9XHJcbiAgICBhZGRDb21wb25lbnQgKGNvbXBvbmVudElELGNvbmZpZykge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50c1tjb21wb25lbnRJRF0gPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy5idWlsZENvbXBvbmVudChjb21wb25lbnRJRCk7XHJcbiAgICB9XHJcbiAgICBidWlsZENvbXBvbmVudCAoY29tcG9uZW50SUQpIHtcclxuICAgICAgICBsZXQgY29uZmlnID0gdGhpcy5jb21wb25lbnRzW2NvbXBvbmVudElEXTtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbmZpZy5hbmNob3IpO1xyXG4gICAgICAgIGlmIChlbGVtZW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmKGRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJWaWV3IDogdHJ5aW5nIHRvIGJ1aWxkIGFuIGVsZW1lbnQgYnV0IHRoZSBhbmNob3IgY2FuJ3QgYmUgZm91bmRcIixjb21wb25lbnRJRClcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaW5uZXJIVE1MID0gaHRtbC5nZXRUcGwoY29uZmlnLnRwbCxjb25maWcudHBsQmluZGluZ3MpO1xyXG4gICAgICAgIGlmIChpbm5lckhUTUwpXHJcbiAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xyXG4gICAgfVxyXG4gICAgcmVkcmF3Q29tcG9uZW50IChjb21wb25lbnRPYmopIHtcclxuICAgICAgICBpZiAodGhpcy5jb21wb25lbnRzW2NvbXBvbmVudE9iai5jb21wb25lbnRdLnRwbCA9PT0gJ3VwZGF0ZWRWYWx1ZScpIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvbXBvbmVudHNbY29tcG9uZW50T2JqLmNvbXBvbmVudF0udHBsQmluZGluZ3MuaWQpO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBjb21wb25lbnRPYmoudG9TdHIoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmKGRlYnVnKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVmlldyA6IHRyeWluZyB0byByZWRyYXcgYW4gZWxlbWVudCBidXQgdGhlIGFuY2hvciBjYW4ndCBiZSBmb3VuZFwiLGNvbXBvbmVudElEKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHRoaXMuYnVpbGRDb21wb25lbnQoY29tcG9uZW50T2JqLmNvbXBvbmVudCk7XHJcbiAgICB9XHJcbiAgICByZWRyYXcgKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZy5jb21wb25lbnRzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICAgICAgICB0aGF0LnJlZHJhd0NvbXBvbmVudChrZXkpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBWaWV3O1xyXG4iXX0=

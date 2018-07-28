let debug = false;

let fs = require('fs');
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
    updatedValue : fs.readFileSync(__dirname + "/html/updatedValue.tpl",'utf8'),
    localizedText :(fs.readFileSync(__dirname + "/html/localizedText.tpl",'utf8'))
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

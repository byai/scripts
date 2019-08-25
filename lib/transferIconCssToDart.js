#!/usr/bin/env node

var fs = require('fs');
var utils = require('./utils');

var DEFAULT_OUTPUT_PATH = './icons.dart';
var transferFilePath = process.argv[2];
var outputPath = process.argv[3];

if (!transferFilePath) {
    utils.exit('没有转换文件');
}

if (/^http/.test(transferFilePath)) {
    utils.downloadFile(transferFilePath, function(data) {
        transferCssToDart(data);
    });
} else {
    if (!fs.existsSync(transferFilePath)) {
        utils.exit('文件不存在');
    }
    fs.readFile(transferFilePath, { encoding: "utf-8" }, function (err, res) {
        if (err) {
            utils.exit(err);
        } else {
            transferCssToDart(res);
        }
    });
}

function transferCssToDart(res) {
    // 去除空格、回车换行
    var str = res.replace(/(\s+|[\r\n])/g, '');
    var iconObjects = parseCss(str);
    if (iconObjects.length == 0) {
        utils.exit('没有读取到icon配置');
    }
    outputToDart(iconObjects);
}


function parseCss(cssStr) {
    var reg = /\.icon-.*?\}/g;
    var icons = cssStr.match(reg);
    if (!icons || icons.length == 0) {
        utils.exit('没有读取到icon配置');
    }
    function toLowerCase(str) {
        var strArr = str.split('-');
        strArr.shift();
        if (strArr.length < 2) {
            return strArr[0];
        }
        for(var i = 1; i < strArr.length; i += 1) {
            if (!!strArr[i]) {
                var words = strArr[i].split('');
                if (/[a-z]/.test(words[0])) {
                    words[0] = words[0].toLocaleUpperCase();
                }
                strArr[i] = words.join('');
            }
        }
        return strArr.join('');
    }
    return icons.map(item => {
        var matchName = /(icon-[a-z|A-Z|0-9|-]*)/;
        var matchValue = /\\([a-z|A-Z|0-9]*)/;
        var name = item.match(matchName);
        var value = item.match(matchValue);
        name = !!name ? name[0] : '';
        value = !!value ? value[1] : '';
        if (!name || !value) {
            return null;
        }
        return {
            name: toLowerCase(name),
            value,
        };
    }).filter(item => item !== null);
}

function outputToDart(icons) {
    var dartStr = 'class Icons {\r\n';
    dartStr += icons.map(item => `  static int ${item.name} = 0x${item.value};\r\n`).join('');
    dartStr += '}';

    if (outputPath) {
        utils.checkAndCreateFile(outputPath);
    } else {
        utils.checkAndCreateFile(DEFAULT_OUTPUT_PATH);   
    }
    fs.writeFile(outputPath ? outputPath : DEFAULT_OUTPUT_PATH, dartStr, function(err){
        if(err) {
            utils.exit(err);
        }
        else console.log('写入成功');
    });
}

var fs = require('fs');
const http = require('http');

module.exports = {
    exit: function(str, code) {
        console.log(str);
        process.exit(code);
    },
    checkAndCreateFile: function(path) {
        var pathArr = path.split('/');
        var _path = `${pathArr[0]}/`;
        var fileName = pathArr.pop();
        if (fileName === '') {
            this.exit('输出文件是个路径！');
        }
        pathArr.shift();
        pathArr.forEach(item => {
            _path += `/${item}`;
            if (!fs.existsSync(_path)) {
                fs.mkdirSync(_path);
            }
        });
    },
    downloadFile(fileUrl, callback) {
        http.get(fileUrl, function(res) {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                callback(rawData);
            });
        }).on('error', (e) => this.exit(e));
    }
}
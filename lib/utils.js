var fs = require('fs');

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
        // if (!fs.existsSync(path)) {
        //     fs.createWriteStream(path);
        // }
    }
}
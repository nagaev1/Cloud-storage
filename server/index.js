const express = require('express'),
    app = express(),
    path = require('path'),
    fs = require('fs'),
    HOST = '192.168.0.44',
    PORT = 5000,
    cors = require('cors');





app.use(cors());

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
   });




app.get('/', cors (), (req, res) => {
    try {
        if (req.query === undefined) throw new Error('err');
        console.log('запрс на ' + req.query.path + ', ip: ' + req.ip);

        fs.lstat(req.query.path, (err, stats) => {
            if(stats.isDirectory()){
                console.log('Запрос папки');
                fs.readdir(req.query.path, (err, files) => {
                    console.log('отправлены файлы: ',  files);
                    res.send({files, type: 'files'})
                })
            } else if (stats.isFile()) {
                console.log('Запрос файла');
                fs.readFile(req.query.path, {encoding: 'utf-8'} , (err, file) => {
                    res.send({file, type: 'fileData'})
                })
            }

        })
        
    } catch (err) {
        console.log('ПОЙМАНА ОШИБКА', err);
        res.send({err});
    }
    
});




    app.listen(PORT, () => console.log('сервер работает'))
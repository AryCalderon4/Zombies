var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();

var publicPath = path.join(__dirname,'img');
app.use('/recursos',express.static(publicPath));

app.set('views',path.resolve(__dirname,'views'));
app.set('view engine','ejs');
var entries = [];
app.locals.entries = entries;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:false}));

var IP_VALIDA = ["192.168.12.34", "::1"];
var bandera = false;

app.get('/',(request,response)=>response.render('index'));
app.get('/clases',(request,response)=>response.render('clases'));
app.get('/armas',(request,response)=>response.render('armas'));
app.get('/victimas',(request,response)=>{
    for(var i = 0;i<IP_VALIDA.length && !bandera;i++){
        if(request.ip == IP_VALIDA[i]){
            bandera = true;
        }
    }
    if(bandera){
        response.render('victimas');
        next();
    }else{
        response.status(401).render('401');
    }
});

app.post('/victimas',(request,response)=>{
    if(!request.body.nombre || !request.body.direccion || !request.body.tel || !request.body.instagram){
        response.status(400).render('400');
        return;
    }
    entries.push({
        nombre: request.body.nombre,
        direccion: request.body.direccion,
        tel: request.body.tel,
        instagram: request.body.instagram
    });
    response.redirect('/');
});
app.use((request, response)=>response.status(404).render('404'));

http.createServer(app).listen(3000);
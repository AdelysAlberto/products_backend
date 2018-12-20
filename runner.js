const fs = require('fs');
const pkg = require('./package.json');
const config = require('./config');
const express = require("express"),
    mysql = require('mysql'),
    bodyParser = require('body-parser'),
    os = require('os'),
    v8 = require('v8'),
    cors = require('cors'),
    app = express(),
    hostname = '0.0.0.0',
    port = config.port,
    publicDir = './';

const corsOptions = {
    origin: config.url
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); // support encoded bodies
app.set('json spaces', 4);
const MyConnection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'productos'
});

app.get('/get', function(Req, Res) {
    const SQLGetAll = "SELECT * FROM productos";
    MyConnection.query(SQLGetAll, function(Error, data, Cols) {
        if(Error) {
            Res.write(JSON.stringify({
                error: true,
                error_object: Error
            }));
            Res.end();
        } else {
            Res.send(data);
            Res.end();
            return data
        }
    });
});



app.post("/load", async (req, Res) => {
    //console.log(req.body);
    return ladProducto(req.body,Res);

});

app.get('/health', async (req, res, next) => {
    res.json({
        name: process.name,
        nodeVersion: process.versions.node,
        envMode: process.env.NODE_ENV || null,
        memoryUsage: process.memoryUsage(),
        upTime: process.uptime(),
        totalMem: os.totalmem(),
        freeMem: os.freemem(),
        loadAvg: os.loadavg(),
        heap: v8.getHeapStatistics(),
        host: os.hostname(),
        packageJSON: pkg.version
    });
});


function ladProducto(data, Response) {
    let SQLCreate = "INSERT INTO productos (codigo, nombre) VALUES ("+data.codigo+",'"+data.nombre+"')";
    MyConnection.query(SQLCreate, function(Error, Data, oCols) {
        if(Error) {
            Response.write(JSON.stringify({
                error: true,
                error_object: Error.sqlMessage
            }));
            console.log(Error.sqlMessage);
            Response.end();
        } else {
            Response.send(Data);
            Response.end();
        }
    });
}



app.use(express.static(publicDir));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('==============================\nBackend on port %s\n==============================', port);

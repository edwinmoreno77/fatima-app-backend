const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const path = require('path');
const logger = require("morgan");

const { dbConnection } = require('../database/config.db');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            user: '/api/user',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            uploads: '/api/uploads'
        }

        // CONNECT TO DATABASE
        this.connectDB();

        //MIDDLEWARES
        this.middlewares();

        //ROUTES OF MY APP
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());
        this.app.use(logger("dev"));

        //READ AND PARSE JSON
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        // FILE UPLOAD
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }


    routes() {

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.user, require('../routes/user'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));

        //PUBLIC FOLDER
        this.app.use(express.static(path.join(__dirname, "../frontend/build")));


        // ESTA RUTA LE DICE A EXPRESS QUE CUALQUIER RUTA QUE NO ESTE DEFINIDA EN LAS RUTAS ANTERIORES, ME DEVUELVA EL INDEX.HTML Y REACT SE ENCARGUE DE MANEJAR LAS RUTAS
        this.app.get("*", function (_, res) {
            res.sendFile(
                path.join(__dirname, "../frontend/build/index.html"),
                function (err) {
                    if (err) {
                        res.status(500).send(err);
                    }
                }
            );
        });
    }


    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`)
        });
    }
}

module.exports = Server;
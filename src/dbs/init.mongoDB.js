'use strict';

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');
const connectString = 'mongodb://localhost:27017/eCommerce';
class Database {
    constructor() {
        this._connect();
    }

    _connect(type = 'mongodb') {
        mongoose
            .connect(connectString, { maxPoolSize: 50 })
            .then(() => {
                console.log('Database connection successful pro');
                // console.log('Count Connect MongoDB: ', countConnect());
            })
            .catch((err) => {
                console.error('Database connection error', err);
            });
    }

    static getInstance() {
        if (!Database.instance) {
            this.instance = new Database();
        }
        return this.instance;
    }
}

const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;

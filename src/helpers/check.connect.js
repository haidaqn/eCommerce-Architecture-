'use strict';

const mongoose = require('mongoose');
const os = require('os');
const precess = require('process');

const _SECONDS = 5000;

const countConnect = () => {
    const numConnection = mongoose.connections.length;
    return numConnection;
};

const checkOverLoad = () => {
    setInterval(() => {
        const numConnection = countConnect();
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        const maxConnection = numCores * 5;

        console.log(`Active connection: ${numConnection}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024}`);

        if (numConnection > maxConnection) {
            console.error('Overload connection');
        }
    }, _SECONDS);
};

module.exports = {
    countConnect,
    checkOverLoad
};

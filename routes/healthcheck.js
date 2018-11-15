'use strict';
module.exports.ping = (req, res) => {
    return res.status(200).json({ message: 'pong' });
}
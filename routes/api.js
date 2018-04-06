const express = require('express');
const router = new express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');

router.post('/authenticate', (req, res) => {
  User.findOne({
    uid: req.body.uid,
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.',
      });
      return;
    }

    if (user.password != req.body.password) {
      res.json({
        success: false,
        message: 'Authentication failed. Wrong password.',
      });
      return;
    }

    const token = jwt.sign(user.toJSON(), config.secret, {
      expiresIn: '24h',
    });

    res.json({
      success: true,
      message: 'Authentication successfully finished.',
      token: token,
    });
  });
});

router.use((req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];

  if (!token) {
    return res.status(403).send({
      success: false,
      message: 'No token provided.',
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.json({
        success: false,
        message: 'Invalid token',
      });
    }

    req.decoded = decoded;
    next();
  });
});

module.exports = router;

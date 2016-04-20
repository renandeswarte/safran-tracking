var express = require('express');
var signup = require('./services/signup');


var router = express.Router();

// Signup Routes
router.get('/api/signup/:key', signup.checkSecret);


module.exports = router;
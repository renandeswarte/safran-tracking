var bodyParser = require('body-parser');


var signup = {};

// Login Method
signup.checkSecret = function(req, res) {
  var secret = req.params.key;
  var error = "Wrong secret, please try again"

  if (process.env.SECRET === secret) {
    res.send("authorized");
  } else {
    res.status(400).send(error);
  }
};

module.exports = signup;

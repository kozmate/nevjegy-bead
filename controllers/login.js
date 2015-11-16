var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/', function (req, res) {
    res.render('login/index', {
        errorMessages: req.flash('error')
    });
})

router.post('/', passport.authenticate('local', {
    successRedirect: '/contacts/list',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Hiányzó adatok'
}));

router.get('/register', function (req, res) {
    res.render('login/register', {
        errorMessages: req.flash('error')
    });
});

router.post('/register', passport.authenticate('local-signup', {
    successRedirect:    '/login',
    failureRedirect:    '/login/register',
    failureFlash:       true,
    badRequestMessage:  'Hiányzó adatok'
}));

module.exports = router;

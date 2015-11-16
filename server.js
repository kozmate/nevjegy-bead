var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');

// importált modulok
var Waterline = require('waterline');
var waterlineConfig  = require('./config/waterline');

//---HBS

var hbs = require('hbs');

var blocks = {};

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 == v2) {
      //console.log("tulaj: " + v1 + " aktualis: " + v2);
      return options.fn(this);
  }
  return options.inverse(this);
});


//---

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Local Strategy for sign-up
passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    },   
        function(req, username, password, done) {
            req.app.models.user.findOne({ username: username }, function(err, user) {
                if (err) { return done(err); }
                if (user) {
                    return done(null, false, { message: 'Létező felhasználó.' });
                }
                req.app.models.user.create(req.body)
                .then(function (user) {
                    return done(null, user);
                })
                .catch(function (err) {
                    return done(null, false, { message: err.details });
                })
            });
        }
));

// Stratégia
passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, username, password, done) {
        req.app.models.user.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user || !user.validPassword(password)) {
                return done(null, false, { message: 'Helytelen adatok.' });
            }
            return done(null, user);
        });
    }
));

// Middleware segédfüggvény
function setLocalsForLayout() {
    return function (req, res, next) {
        res.locals.loggedIn = req.isAuthenticated();
        res.locals.user = req.user;
        next();
    }
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

function andRestrictTo(role) {
    return function(req, res, next) {
        if (req.user.role == role) {
            next();
        } else {
            next(new Error('Unauthorized'));
        }
    }
}

var app = express();

//view beállítás HBS-hez
app.set('views', './views');
app.set('view engine','hbs');

//middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(flash());
app.use(session({
    cookie: { maxAge: 600000 },
    secret: 'titkos szoveg',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

var contactRouter = require('./controllers/contact');
var loginController = require('./controllers/login');
var indexController = require('./controllers/index');

app.use(setLocalsForLayout());
app.use('/', indexController);
app.use('/contacts', ensureAuthenticated, contactRouter);
app.use('/login', loginController);

app.get('/operator', ensureAuthenticated, andRestrictTo('operator'), function(req, res) {
    res.end('operator');
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


// ORM példány
var orm = new Waterline();
orm.loadCollection(Waterline.Collection.extend(require('./models/contact')));
orm.loadCollection(Waterline.Collection.extend(require('./models/user')));
// ORM indítása
orm.initialize(waterlineConfig, function(err, models) {
   if(err) throw err;
    app.models = models.collections;
    app.connections = models.connections;
    var port = process.env.PORT;
    var host = process.env.IP;
    var server = app.listen(port, host, function(){console.log('Server is started.');});
    console.log("ORM is started.");
});

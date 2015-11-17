var express = require('express');
var router = express.Router();

var contactModel = require('../viewmodels/contact');

router.get('/list', function (req, res) {

    req.app.models.contact.find().then(function (contacts) {
        //console.log(contacts);
        
        res.render('contacts/list', {
            contacts: contactModel(contacts),
            messages: req.flash('info')
        });
    });
});

//Szám hozzáadása
router.get('/new', function(req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    
    res.render('contacts/new', {
        validationErrors: validationErrors,
        data: data,
    });
});

//Szám törlése
router.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    //console.log(id);
    req.app.models.contact.destroy({ id: id})
    .then(function (contact){
        req.flash('info', 'Sikeres törlés!');
        res.redirect('/contacts/list');
        
    })
    .catch(function (err) {
        console.log(err);
    });
});


//Módosítás
router.get('/:id', function(req, res) {
    var id = req.params.id;

    req.app.models.contact.findOne({ id: id}).then(function (contact) {
        res.render('contacts/modifi', {
            contact: contact,
        }); 
    });
});



//Új kontakt POST
router.post('/new', function(req, res) {
    //console.log(req.body);
    
    req.checkBody('contactName', 'Hibás név').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('phoneNumber').escape();
    req.checkBody('phoneNumber', 'Hibás telefonszám').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    
    if (validationErrors) {
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/contacts/new');
    }
    else {
        req.app.models.contact.create({
            status: 'new',
            contactName: req.body.contactName,
            phoneNumber: req.body.phoneNumber,
            ownerId: req.user.id
        })
        .then(function (contact) {
            req.flash('info', 'Kontakt sikeresen felvéve!');
            res.redirect('/contacts/list');
        })
        .catch(function (err) {
            console.log(err)
        });
    }
})

//Módosítás POST
router.post('/:id', function(req, res) {
    var id = req.params.id;
    
    //Név módosítása
    if(req.body.contactName != null){
        var contactName = req.body.contactName;
        console.log(contactName);
    }

    if(req.body.contactName != null){
        req.app.models.contact.update({id: id},{contactName: contactName})
        .then(function (contact){
            
        })
        .catch(function (err){
            console.log(err);
        });
    }
    
    //Szám módosítása
    if(req.body.phoneNumber != null){
        var phoneNumber = req.body.phoneNumber;
    }

    if(req.body.phoneNumber != null){
        req.app.models.contact.update({id: id},{phoneNumber: phoneNumber})
        .then(function (contact){
            
        })
        .catch(function (err){
            console.log(err);
        })
    }
    
    req.flash('info', 'Sikeres módosítás!');
    res.redirect('/contacts/list');
});

module.exports = router;
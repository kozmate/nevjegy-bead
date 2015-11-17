var bcrypt = require('bcryptjs');

module.exports = {
    identity: 'user',
    connection: 'default',
    attributes: {
        username: {
            type: 'string',
            required: true,
            unique: true,
        },
        password: {
            type: 'string',
            required: true,
        },
        firstname: {
            type: 'string',
            required: true,
        },
        lastname: {
            type: 'string',
            required: true,
        },
        role: {
            type: 'string',
            enum: ['riporter', 'operator'],
            required: true,
            defaultsTo: 'riporter'
        },
        contacts: {
            collection: 'contact',
            via: 'user'
        },
        
        //validPassword: function (password) {
        //    return password === this.password;
        //}
        
        validPassword: function (password) {
            return bcrypt.compareSync(password, this.password);
        }
    },
    
    beforeCreate: function(values, next) {
        bcrypt.hash(values.password, 10, function(err, hash) {
            if (err) {
                return next(err);
            }
            values.password = hash;
            next();
        });
    }

};
module.exports = {
    identity: 'contact',
    connection: 'default',
    attributes: {
        date: {
            type: 'datetime',
            defaultsTo: function () { return new Date(); },
            required: true,
        },
        status: {
            type: 'string',
            enum: ['new', 'assigned', 'ready', 'rejected', 'pending'],
            required: true,
        },
        contactName: {
            type: 'string',
            required: true,
        },
        phoneNumber: {
            type: 'string',
            required: true,
        },
        ownerId: {
            type: 'integer',
        },
        user: {
            model: 'user',
        }
    }
}
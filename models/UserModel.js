const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },


    phone: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
})

module.exports = mongoose.model('User', UserSchema)
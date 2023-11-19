const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
        name: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            default: 'none'
        },
        password: {
            type: String,
            required: true
        },
        create_date: {
            type: Date,
            default: Date.now
        },
        permission:{
            type: String,
            required: true
        },
        gender:{
            type: String,
            default: '-'
        },
        age:{
            type: String,
            default: '-'
        },
        birthday: {
            type: Date,
            default: ''
        },
        chat_last_seen: {
            type: Object,
            required: true,
            default: {},
        },
        notes: {
            type: Array,
            default: []
        },
        notes_last_seen: {
            type: Object,
            default: {},
        },
        more: {
            type: Object,
            default: {}
        },
        Experiments: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true,
        minimize: false
    });

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


module.exports = {
    User: mongoose.model('User', UserSchema)
};

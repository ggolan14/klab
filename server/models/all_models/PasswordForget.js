const mongoose = require('mongoose');

const PasswordForgetSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        new_password: {
            type: String,
        }
},
    {timestamps: true}
);

module.exports = {
    PasswordForget: mongoose.model('password_forget', PasswordForgetSchema)
};

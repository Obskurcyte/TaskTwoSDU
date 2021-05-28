import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true, minlength: 6},
    room: {type: String, required: true},
    health: {type: String},
    experience: {type: String},
    score: {type: String}
});

userSchema.plugin(uniqueValidator);

export const User = mongoose.model('User', userSchema)


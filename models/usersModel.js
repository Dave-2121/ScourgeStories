const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Please provide an username!'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minlength: [5, 'password should have at least 5 characters'],
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  failedExpiryTime: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('users', userSchema);

module.exports = User;

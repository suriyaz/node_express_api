const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

      //companySchema
const schema = new mongoose.Schema ({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, index: true },
  password: { type: String, required: true, trim: true, minlength: 4},
  role: { type: String, default: 'member'}
}, {
    collection: 'users'
});

// fun encryptPassword
schema.methods.encryptPassword = async function(password) {
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
}

// fun checkPassword
schema.methods.checkPassword = async function(password) {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
}

                                //companySchema
const user = mongoose.model('User', schema);

module.exports = user;
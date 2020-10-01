const mongoose = require('mongoose');

        //companySchema
const schema = new mongoose.Schema({
  name:  String, 
  address: {
    province: { type: String }
  },
},
{
    collection: 'companys'
});
                                          //companySchema
const company = mongoose.model('Company', schema);

module.exports = company;
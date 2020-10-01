const mongoose = require('mongoose');
const Schema = mongoose.Schema;

               //new mongoose.Schema
const schema = Schema ({
    name: { type: String, required: true, trim: true },
    price: { type: Number},
    shop: { type: Schema.Types.ObjectId, ref: 'Shop' } //ManyToOne

}, {
    toJSON: { virtuals : true}, //สร้างมาเพิ่ม ที่ไม่มีในdb
    timestamps: true,
    collection: 'menus'
});

schema.virtual('price_vat').get(function () {
    return (this.price*0.07) + this.price;
});

const menu = mongoose.model('Menu', schema);

module.exports = menu;
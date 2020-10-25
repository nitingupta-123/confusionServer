const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
//const model =require('./dishes');

const promoSchema = new Schema({

    name: {
        type: String,
        required: true
        
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    price: {
        type: Currency,
        required: true
    },
    
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Promos = mongoose.model('promo', promoSchema);

module.exports = Promos;


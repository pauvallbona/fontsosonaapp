const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema ({
   info: [{
    informació: [{
      nom: String,
      municipi: String,
      alçada: String,
      recullhistòric: String,
      citació: String,
      coordenades: {
          lon: String,
          lat: String
      }
  }],
    aigua: String,
   }] 
}, { collection: 'fonts' });

module.exports = Item = mongoose.model('item', ItemSchema);
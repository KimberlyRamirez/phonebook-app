let mongoose = require('mongoose');

let url = process.env.MONGO_URI;

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log(`Error connected to MongoDB: ${error.message}`));

const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: (num) => {
        return (/^\d{2,3}-\d{7,8}$/).test(num);
      }
    }
  }
});

noteSchema.set('toJSON', {
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString();
    delete retObj._id;
    delete retObj.__v;
  }
});

module.exports = mongoose.model('Note', noteSchema);
import mongoose, { Schema } from 'mongoose';

const Cat = new Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true },
  },
});

Cat.static('findOneByName', function(name, callback) {
  return this.findOne({ name }, callback);
});

Cat.virtual('id').get(function() {
  return this._id.toHexString();
});

Cat.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Cat', Cat);

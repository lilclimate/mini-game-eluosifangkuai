import { Schema, model } from 'mongoose';

const scoreSchema = new Schema({
  name: { type: String, required: true },
  points: { type: Number, required: true }
}, { timestamps: true });

export default model('Score', scoreSchema);

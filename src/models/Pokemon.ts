import mongoose, { Schema } from "mongoose";

const pokemonSchema = new Schema({
  pokemonId: {
    type: Number, 
    required: true, 
    unique: true
  },
  name: { type: String, required: true },
  koreanName: { type: String, required: true },
  genus: { type: String, required: true },
  sprites: {
    front_default: { type: String, required: true }
  },
  // types 구조 단순화
  types: [{
    name: { type: String, required: true }
  }],
  stats: [{
    stat: {
      name: { type: String, required: true }
    },
    base_stat: { type: Number, required: true }
  }]
}, {
  timestamps: true
});

const Pokemon = mongoose.models.Pokemon || mongoose.model("Pokemon", pokemonSchema);

export default Pokemon;

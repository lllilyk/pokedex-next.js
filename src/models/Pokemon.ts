import mongoose, { Schema } from "mongoose";

const pokemonSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
});

const Pokemon = mongoose.models.Pokemon || mongoose.model("Pokemon", pokemonSchema);

export default Pokemon;

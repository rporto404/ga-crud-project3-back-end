const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
  {
    itemName: String,
    category: String,
    description: String,
    // Price is a decimal number
    price: {type: mongoose.Types.Decimal128},
    image: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    soldOut: Boolean,
  },
  { timestamps: true }
);

const Store = mongoose.model("Store", StoreSchema);
//Connection name Movie will show up as movies

module.exports = Store;

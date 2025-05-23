const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    email: String,
    password: String,
    salt: String,
    phone: String,
    //reference to address model
    address: [{ type: Schema.Types.ObjectId, ref: "address", require: true }],
    cart: [
      {
        //reference to product model and we deleted to Product model
        // product: { type: Schema.Types.ObjectId, ref: "product", require: true },
        product: {
          _id: { type: String, require: true },
          name: { type: String },
          banner: { type: String },
          price: { type: Number },
        },
        unit: { type: Number, require: true },
      },
    ],
    wishlist: [
      //again reference to product model and we deleted it
      //   {
      //     type: Schema.Types.ObjectId,
      //     ref: "product",
      //     require: true,
      //   },
      {
        _id: { type: String, require: true },
        name: { type: String },
        description: { type: String },
        banner: { type: String },
        available: { type: Boolean },
        price: { type: Number },
      },
    ],

    orders: [
      // reference to order model and we deleted it
      // { type: Schema.Types.ObjectId, ref: "order", require: true }
      {
        _id: { type: String, require: true },
        amount: { type: String },
        data: { type: Date, default: Date.now() },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("customer", CustomerSchema);

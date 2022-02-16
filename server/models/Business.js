const { Schema, model, mongoose } = require("mongoose");
const Review = require("./Review");
const Tag = require("./Tag");

const validateURL = function (url) {
  let re =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return re.test(url);
};

const businessSchema = new Schema(
  {
  name: {
    type: String,
    unique: true,
    required: true, // Two businesses can't have the same name
    trim: true,
  },
  address: {
    type: String,
    unique: true, // Two businesses can't be at the same address
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min: [0, "Price cannot be less than zero"], // Price must be non-negative
    required: true,
  },
  quotes: [
    {
      type: String,
    },
  ],
  image: {
    type: String,
    //validate: [validateURL, "Please input a valid URL"],
  },

  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
},
/*{
  toJSON: {
    virtuals: true,
  },
  id: false,
}*/

);

businessSchema.index({ name: "text", description: "text" });

businessSchema.virtual('ratingAverage').get(function(){
    const sumRatings = 0;
    const numReviews = this.reviews.length;
    this.reviews.map((review) =>{
         sumRatings += review.rating;
    });
    console.log(sumRatings/numReviews);
    return sumRatings/numReviews;
})


// Initialize our Business model
const Business = model("Business", businessSchema);

module.exports = Business;

import mongoose, { Schema } from 'mongoose'; 

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'buyer', 'seller'], default: 'buyer' },
  purchases: { type: [Schema.Types.Mixed], default: null },
  cart: {
    items: { type: Schema.Types.Mixed, default: null }
  }, 
  isReturningCustomer: {type: Boolean, default: false},
  disabled: {type: Boolean, default: false},
  password: { type: String, required: true },
}, {timestamps: true});
export const User = mongoose.model('User', UserSchema);


const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const ProductSchema = new Schema({
  title: { type: String, required: true},
  price: { type: String, required: true}, 
  description: String,
  category: { type: Schema.Types.Mixed, required: true},
  images: [String],
  video: String,
  customization: Schema.Types.Mixed,
  keywords: [String],
  stocks: {type: Number, required: true, default: 0},
  reviews: [ReviewSchema],
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  status: { type: String, enum: ["in stock", "out of stock"], default: "in stock" }
}, {timestamps: true});

// Auto-update product status based on stock
ProductSchema.pre("save", function (next) {
    this.status = this.stocks > 0 ? "in stock" : "out of stock";
    next();
});
export const Product = mongoose.model('Product', ProductSchema); 

const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
});

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    subcategories: [SubcategorySchema], // Array of subcategories
  },
  { timestamps: true }
);
export const Category = mongoose.model("Category", CategorySchema);


const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    name: String,
    email: String,
    phone: Number,
    products: [
      { 
        title: String, 
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    paymentMethod: { type: String, enum: ["paypal", "crypto", "transfer", "card"], required: true },
    transactionId: { type: String },
    orderStatus: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
    shippingAddress: { type: String, required: true },
  },
  { timestamps: true }
);
export const Order = mongoose.model("Order", OrderSchema);


const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    minPurchase: { type: Number, default: 0 },
    maxDiscount: { type: Number }, // Only for percentage discounts
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export const Coupon = mongoose.model("Coupon", CouponSchema);

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
    isRootAdmin: {
        type: Boolean,
        default: false
    }
  });

module.exports = userSchema;
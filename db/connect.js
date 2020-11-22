const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env')});

module.exports = async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology:true });
}
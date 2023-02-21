const mongoose = require('mongoose')

mongoose.set('strictQuery', true)
const connectDB = async () => {
    try {
        mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, () => {
            console.log(`Connected to database...`);
        })
    } catch (err) {
        console.log(err);
        process.exit()
    }
}

module.exports = connectDB
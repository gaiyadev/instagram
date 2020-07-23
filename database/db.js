const config = require('config');
const mongoose = require('mongoose');

const ConnectDb = async () => {
    await mongoose.connect(config.get('APP_DB_CONNECTION'),
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).
        then(() => console.log('Connected to Database Successfully...'))
        .catch(err => console.error('Failed Could not connect to Database', err));
}

ConnectDb();
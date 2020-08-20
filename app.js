const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

//load config
dotenv.config({ path: './config/config.env' });

//passport config
require('./config/passport')(passport);

//connect db
connectDB();

const app = express();

//logging
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}

// handlebars
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// express session middleware
app.use(
    session({
        secret: 'storyBook secret',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);

//listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);

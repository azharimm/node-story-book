const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
const exphbs = require('express-handlebars');
const connectDB = require('./config/db');
const indexRoutes = require('./routes/index')

//load config
dotenv.config({ path: './config/config.env' });

//connect db
connectDB();

const app = express();

//logging
if(process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
}

// handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main' ,extname: '.hbs'}));
app.set('view engine', '.hbs');

//routes
app.use('/', indexRoutes);

//listen 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);

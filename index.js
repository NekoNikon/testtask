let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let expressHbs = require('express-handlebars')
let hbs = require('hbs')

app.use('/assets', express.static(__dirname + '/app/assets'))

app.use(express.json())

app.use((req, res, next)  => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', __dirname + '/app/views')
app.engine('hbs', expressHbs({
    defaultLayout: 'main',
    extname: 'hbs',
    layoutsDir: __dirname + '/app/views/layouts',
    partialsDir: __dirname + '/app/views/partials',
}))


app.set('view engine', 'hbs')



let main = require('./app/routes/main')(app)

app.listen(5000, () => {
    console.log('start')
})
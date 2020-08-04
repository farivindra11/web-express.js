const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const fs = require('fs')

let data = JSON.parse(fs.readFileSync('data.json'));

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('list', {data})); //list.ejs

app.get('/add', (req, res) => res.render('add'));


//ADD
app.post('/add', (req, res) => {
    data.push(req.body)
    // console.log(req.body);
    fs.writeFileSync('data.json', JSON.stringify(data)); 
    res.redirect('/')
});

//DELETE
app.get('/delete/:id', (req, res) => {
    data.splice(req.params.id, 1)
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.redirect('/')
});

//EDIT
app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    // console.log({ ...data[id] });
    res.render('edit', { item: { ...data[id] }, id });
})

app.post('/edit/:id', (req, res) => {
    let id = req.params.id;
    const edit = {
        string: req.body.string,
        integer: req.body.integer,
        float: req.body.float,
        date: req.body.date,
        boolean: req.body.boolean
    }
    data.splice(id, 1, edit);
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.redirect('/')
})

app.listen(3000, () => {
    console.log('port ini berjalan di port 3000');
})
const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const db = require('./database');

// Setting Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.status(200).json('success');
});

app.post('/signin', (req, res) => {
    let {email, password} = req.body;
    db.select('*')
        .from('login')
        .where('email', '=', email)
        .then(credentials => {
            if(credentials) {
                let passComp = bcrypt.compareSync(password, credentials[0].hash);
                if (passComp) {
                    db.select('*')
                        .from('users')
                        .where('email', '=', credentials[0].email)
                        .then(user => {
                            res.status(200).json(user[0]);
                        })
                        .catch(err => res.status(400).json('unable to get user'));
                } else {
                    res.status(400).json('incorrect credentials');
                }
            } else {
                res.status(400).json('incorrect credentials');
            }
        })
        .catch(err => res.status(400).json('incorrect credentials'));
});

app.post('/register', (req, res) => {
    let {name, email, password} = req.body;
    let hashPass = bcrypt.hashSync(password);

    db.transaction(trx => {
        let newLogin = {
            hash: hashPass,
            email: email,
        };
        trx.returning('email')
            .insert(newLogin)
            .into('login')
            .then(data => {
                let newUser = {
                    name: name,
                    email: data[0].email,
                    joined: new Date(),
                };
                trx.returning('*')
                    .insert(newUser)
                    .into('users')
                    .then(user => res.status(200).json(user[0]));
            })
            .catch(err => res.status(400).json('unable to register'))
            .then(trx.commit)
            .catch(trx.roolback);     
    })
    .catch(err => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
    let {id} =  req.params;
    db.select('*').from('users').where({id})
        .then(users => {
            if(users.length) {
                res.status(200).json(users[0]);
            } else {
                res.status(400).json({error: "user not found"});
            }
        })
        .catch(err => res.status(400)._construct("error retrieving user"));
})

app.put('/image', (req, res) => {
    let {id} = req.body;
    db('users').where('id', '=', id)
        .increment({entries: 1})
        .returning("entries")
        .then(entries => {
            if(entries.length) {
                res.status(200).json(entries[0].entries);
            } else {
                res.status(400).json("user not found");
            }
        })
        .catch(err => res.status(400).json("error retrieving user"));
});

app.listen('3000', () => {
    console.log('app is running on port 3000');
});
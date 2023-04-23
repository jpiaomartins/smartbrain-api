const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

// Database
const database = {
    users: [
        {
            id: '123',
            name: "John",
            email: "john@gmail.com",
            password: "123",
            entries:  0,
            joined: new Date(),
        },
        {
            id: "124",
            name: "Ann",
            email: "ann@gmail.com",
            password: "1234",
            entries:  0,
            joined: new Date(),
        },
    ],
    logins: [
        {
            id: '123',
            password: "123",
        },
        {
            id: '124',
            password: "1234",
        },
    ]
};

database.logins.forEach(login => {
    bcrypt.hash(login.password, null, null, (err, data) => {
        login.password = data;
    })
})

// Setting Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

// Routes
/*
/signin -> POST
/register -> POST
/profile/{id} -> GET
/image -> PUT
*/
app.get('/', (req, res) => {
    console.log(database.logins);
    res.json(database);
});

app.post('/signin', (req, res) => {
    let {email, password} = req.body;
    let id = database.users[0].id;
    if(id === database.logins[0].id) {
        bcrypt.compare(password, database.logins[0].password, (err, resp) => {
            if(resp) {
                res.status(200).json({
                    message: "success"
                });
            } else {
                res.status(404).json({
                    error: "incorrect credentials"
                });
            }
        });
    } else {
        res.status(404).json({
            error: "incorrect credentials"
        });
    }

});

app.post('/register', (req, res) => {
    let {name, email, password} = req.body;
    let newUser = {
        id: "125",
        name: name,
        email: email,
        entries: 0,
        joined: new Date(),
    };
    bcrypt.hash(password, null, null, (err, data) => {
        let newLogin = {
            id: "125",
            password: data
        };
        database.users.push(newUser);
        database.logins.push(newLogin);
    })
    res.status(200).json(newUser);
});

app.get('/profile/:id', (req, res) => {
    let {id} =  req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            return res.status(200).json(user);
        }
    });

    if(!found) res.status(400).json({error: "user not found"});
})

app.put('/image', (req, res) => {
    let {id} = req.body;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries++;
            return res.status(200).json(user.entries);
        }
    });
    if(!found) res.status(400).json({error: "user not found"});
});

app.listen('3000', () => {
    console.log('app is running on port 3000');
});
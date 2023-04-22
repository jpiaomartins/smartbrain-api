const express = require('express');
const app = express();

// Database
const database = {
    users: [
        {
            id: "123",
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
    ]
};

// Setting Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Routes
/*
/signin -> POST
/register -> POST
/profile/{id} -> GET
/image -> PUT
*/
app.get('/', (req, res) => {
    res.json(database);
});

app.post('/signin', (req, res) => {
    let {email, password} = req.body;
    if(email === database.users[0].email && password === database.users[0].password) {
        res.status(200).json({
            message: "success"
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
        password: password,
        entries: 0,
        joined: new Date(),
    };
    database.users.push(newUser);
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
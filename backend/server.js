const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const secretKey = 'test-secret';

//Login
app.post('/login', (req, res) => {
    const {email, password} = req.body;

    const token = jwt.sign({email}, secretKey, {expiresIn: '1h'});

    res.json({token});
});

//Init
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
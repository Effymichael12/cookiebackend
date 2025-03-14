const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');


app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:'https://cookiefrontend.vercel.app', credentials: true}))

app.post('/login', async (req, res) => {
  const emailBack = '123@gmail.com';
  const emailPass = '123@gmail.com';
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'No password or email' });
    }
    if (password !== emailPass || email !== emailBack) {
      return res.status(400).json({ message: 'Error' });
    }
    const token = await jwt.sign({ emailBack }, 'secretToken', { expiresIn: '1h' });
    res.cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'None' });
    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(400).json({ message: 'No token found' });
  }
  jwt.verify(token, 'secretToken', (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: 'Token is not valid' });
    }
    req.email = decoded.emailBack;
    next();
  });
};

app.get('/get-email', authenticateJWT, (req, res) => {
  return res.status(200).json({ message: 'Success', email: req.email });
});

app.listen(5200, () => {
  console.log('Server live');
});

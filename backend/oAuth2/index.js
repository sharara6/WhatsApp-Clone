const express = require('express');
const session = require('express-session');
const passport = require('passport');

require('./auth');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
    passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/google/failure'
    })
);

app.get('/protected', isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.displayName}`);
});

app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy();
    res.send('Logged out');
    });
});

app.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
});

const PORT = process.env.PORT || 5006;

app.listen(PORT, () => {
    console.log(`OAuth2 Service running at: http://localhost:${PORT}`);
});
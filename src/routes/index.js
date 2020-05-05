const auth = require('./auth_routes');
const user = require('./user_routes');

const authenticate = require('../middlewares/authenticate');

module.exports = app => {
    app.get('/', (req,res) => {
        res.status(200).send({message: 'Welcome to the AUTHENTICATION API. Register or Login to test Authentication.'});
    });

    app.use('/api/auth', auth);
    app.use('/api/user', authenticate, user);

};
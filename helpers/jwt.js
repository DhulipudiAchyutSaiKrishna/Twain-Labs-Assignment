const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret_key;
    const api = process.env.API_URL;
    return expressJwt({   //secret and algorithms are the reserved words for expressJwt module donot use secret_key or any other identifier
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            `${api}/users/login`,
            {url: /(.*)/ },
        ]
    })
}

function requireAdmin(req, res, next) {
    if (req.user.role === 'Admin') {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  }
  
  function requireManager(req, res, next) {
    if (req.user.role === 'Manager' || req.user.role === 'Admin') {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  }
  
  function requireEmployee(req, res, next) {
    if (req.user.role === 'Employee' || req.user.role === 'Manager' || req.user.role === 'Admin') {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  }

// async function isRevoked(req, payload, done) {
//     if(!payload.isAdmin) return done(null, true);
//     done();
// }

module.exports = authJwt;
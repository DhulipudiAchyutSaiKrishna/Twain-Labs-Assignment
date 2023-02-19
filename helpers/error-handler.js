function errorHandler(err, req, res, next) {
    if (err.name === 'Unauthorized error') {
      return  res.status(401).json({message: 'The user is not authorized to access this'});
    }

    if(err.name === 'ValidationError') {
        return res.status(403).json({message: err});
    }

    return res.status(500).json(err);
    
}

module.exports = errorHandler;
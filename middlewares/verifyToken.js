module.exports = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === process.env.SECRET_KEY) {
    next();
  } else {
    res.status(403).json({ message: 'Erişim reddedildi' });
  }

  };
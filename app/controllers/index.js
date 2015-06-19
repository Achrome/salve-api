export default {
  home: (req, res, next) => {
    res.send(200, {hello: 'world'});
    return next();
  }
};

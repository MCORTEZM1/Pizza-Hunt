const router = require('express').Router();
const commentRoutes = require('./comment-routes');
const pizzaRoutes = require('./pizza-routes');

// append comments to api /api/comments
router.use('/comments', commentRoutes);
// append /api/pizzas
router.use('/pizzas', pizzaRoutes);

module.exports = router; 
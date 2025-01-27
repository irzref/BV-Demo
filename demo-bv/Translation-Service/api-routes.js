// Initialize express router
let router = require('express').Router();

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});

var controller = require('./controller');

router.route('/translate-german-to-english')
    .get(controller.getTranslationDE2EN);

// Export API routes
module.exports = router;
const translate = require('@vitalets/google-translate-api');

var exports = module.exports = {};

exports.getTranslationDE2EN = function (req, res) {
    var text = req.query.text;
    console.log("req", req.query);

    translate(text, {from: "de", to: "en"})
    .then(function (ret) { 

        console.log("result", ret);
        res.json({
            text : ret.text
        });

    }).catch((err) => {

        console.log("error", err);
        res.send(err);

    });
    
}

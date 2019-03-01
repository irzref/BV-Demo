const translate = require('@vitalets/google-translate-api');

translate('Ik spreek Engels', {to: 'en'}).then(res => {
    console.log(res.text);
    //=> I speak English
    console.log(res.from.language.iso);
    //=> nl
}).catch(err => {
    console.error(err);
});

// const translate = require('@k3rn31p4nic/google-translate-api');

// translate('Tu es incroyable!', { to: 'en' }).then(res => {
//     console.log(res.text); // OUTPUT: You are amazing!
//   }).catch(err => {
//     console.error(err);
//   });
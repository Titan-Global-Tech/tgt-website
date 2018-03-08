const validator = require('validator');


function isValidId(id) {
    if(validator.isAlphanumeric(id) &&
        validator.isLength(id, 24, 24)) {

        console.log("id param validation successful.");
    } else {
        let err = new Error("Possible XSS attack. id validation failed.");
        console.error(err.message);
        next(err);
    }
}



module.exports = {
    isValidId,
};
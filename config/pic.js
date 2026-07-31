const engineers =
    require("./engineers");

const daftarPIC = {};

Object.values(engineers).forEach(engineer => {

    daftarPIC[engineer.code] =
        engineer.name;

    daftarPIC[engineer.code.toUpperCase()] =
        engineer.name;

    daftarPIC[engineer.name.toUpperCase()] =
        engineer.name;

});

module.exports = daftarPIC;
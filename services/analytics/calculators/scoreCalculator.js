function calculate(data) {

    const score =

        (data.completed * 10)

        +

        data.contribution

        -

        (data.process * 3);

    return Math.max(
        Math.round(score),
        0
    );

}

module.exports = {

    calculate

};
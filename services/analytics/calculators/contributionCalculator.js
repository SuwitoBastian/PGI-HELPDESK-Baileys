function calculate(assigned, totalAssigned) {

    if (totalAssigned === 0) {
        return 0;
    }

    return Number(
        ((assigned / totalAssigned) * 100)
            .toFixed(1)
    );

}

module.exports = {

    calculate

};
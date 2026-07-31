function calculate(process) {

    if (process >= 7) {

        return {

            level: "FULL",

            percent: 100

        };

    }

    if (process >= 5) {

        return {

            level: "HIGH",

            percent: 80

        };

    }

    if (process >= 2) {

        return {

            level: "MEDIUM",

            percent: 50

        };

    }

    return {

        level: "LOW",

        percent: 20

    };

}

module.exports = {

    calculate

};
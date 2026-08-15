function build(
    engineer,
    repository,
    start = null,
    end = null,
    team = null,
    location = null
) {

    if (location) {

        return repository.countCompletedByPICAndLocation(
            engineer.name,
            start,
            end,
            location
        );

    }


    return repository.countCompletedByPIC(
        engineer.name,
        start,
        end,
        team
    );

}


module.exports = {

    build

};
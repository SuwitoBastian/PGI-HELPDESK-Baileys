function build(
    engineer,
    repository,
    start = null,
    end = null,
    team = null,
    location = null
) {

    if (location) {

        return repository.countAssignedByPICAndLocation(
            engineer.name,
            start,
            end,
            location
        );

    }


    return repository.countAssignedByPIC(
        engineer.name,
        start,
        end,
        team
    );

}


module.exports = {

    build

};
function build(
    engineer,
    repository,
    start = null,
    end = null,
    team = null,
    location = null
) {

    if (location) {

        return repository.countProcessByPICAndLocation(
            engineer.name,
            start,
            end,
            location
        );

    }


    return repository.countProcessByPIC(
        engineer.name,
        start,
        end,
        team
    );

}


module.exports = {

    build

};
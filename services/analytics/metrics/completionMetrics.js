function build(
    engineer,
    repository,
    start = null,
    end = null,
    team = null,
    location = null
) {

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
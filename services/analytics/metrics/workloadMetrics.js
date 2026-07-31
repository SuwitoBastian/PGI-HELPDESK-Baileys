function build(
    engineer,
    repository,
    start = null,
    end = null,
    team = null
) {

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
var _ = require("underscore");

module.exports = {

    deathGamesWithCauses: function (games) {

        var monsterDeathGames = _.filter(games, function (game) {
            return game.description && game.description.search("Killed") != -1;
        });

        var monsterDeathGamesWithCause = _.map(monsterDeathGames, function (game) {

            var monsterRe = new RegExp("by\\s+[an]*\\s+(.*?)\\s+on");
            var descriptionMatch = monsterRe.exec(game.description);
            if (descriptionMatch) {
                game["cause"] = descriptionMatch[1];
            }
            else {
                game["cause"] = "unknown";
            }

            return game;
        });

        var burnedDeathGames = _.filter(games, function (game) {
            return game.description && game.description.search("Burned") != -1;
        });

        var burnedDeathGamesWithCause = _.map(burnedDeathGames, function(game) {
            game["cause"] = "burned to death";
            return game;
        });

        var poisonedDeathGames = _.filter(games, function (game) {
            return game.description && game.description.search("poison") != -1;
        });

        var poisonedDeathGamesWithCause = _.map(poisonedDeathGames, function(game) {
            game["cause"] = "poison";
            return game;
        });

        var starvedDeathGames = _.filter(games, function (game) {
            return game.description && game.description.search("Starved") != -1;
        });

        var starvedDeathGamesWithCause = _.map(starvedDeathGames, function(game) {
            game["cause"] = "starved";
            return game;
        });

        var lavaDeathGames = _.filter(games, function (game) {
            return game.description && game.description.search("by lava") != -1;
        });

        var lavaDeathGamesWithCause = _.map(lavaDeathGames, function(game) {
            game["cause"] = "lava";
            return game;
        });

        var allDeathGamesWithCause = monsterDeathGamesWithCause
            .concat(burnedDeathGamesWithCause)
            .concat(poisonedDeathGamesWithCause)
            .concat(starvedDeathGamesWithCause)
            .concat(lavaDeathGamesWithCause);

        return allDeathGamesWithCause;
    }
};

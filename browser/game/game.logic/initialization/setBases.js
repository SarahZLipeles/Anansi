var setBases = (game) => {
    var bases = game.board.bases;
    var yourBaseid = bases[game.role];
    var theirBaseid = bases[game.opponentRole];
    var yourBase = game.board.nodes.find((node) => {
        return node.id === yourBaseid;
    });
    var their = game.board.nodes.find((node) => {
        return node.id === theirBaseid;
    });

    yourBase.owner = game.role;
    yourBase.from = yourBase.id;

    their.owner = game.opponentRole;
    their.from = their.id;
    //Calculate base center
    var board = document.getElementsByTagName("game")[0];
    var boardRect = board.getBoundingClientRect();
    var homePos = {
        x: yourBase.x - boardRect.width / 2,
        y: yourBase.y - boardRect.height / 2
    };
    board.scrollLeft = homePos.x;
    board.scrollTop = homePos.y;
    return homePos;
};

module.exports = setBases;
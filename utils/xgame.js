import { MessageActionRow, MessageButton } from 'discord.js';
let games = {};


/** Devuelve un nรบmero aleatorio. [min, max) == [incluido, excluido). */
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; };


/** Empieza una nueva partida de xgame. */
async function xgame_start(interaction, x, y) {
    const instructions = 'Objetivo: Ocultar todas las x pulsando los botones. Los botones se invierten en forma de cruz +';
    if (x == 0) x = getRandomInt(3, 6);
    if (y == 0) y = getRandomInt(3, 6);
    let game = new x_game(x, y);
    await interaction.reply({ content: instructions, components: game.toMessage(), fetchReply: true }).then(function (msg2) { game.message_id = msg2.id; });
    games[interaction.user.id] = game;
}


/** Continรบa la partida y comprueba si ha ganado. */
async function xgame_continue(interaction) {
    const win = "๐๐๐ Ganaste ๐๐๐";
    if (games[interaction.user.id] !== undefined) {
        if (interaction.message.id == games[interaction.user.id].message_id) {
            let x = interaction.customId[0];
            let y = interaction.customId[1];
            games[interaction.user.id].change_boxes(x, y);
            interaction.editReply({ components: games[interaction.user.id].toMessage() });
            if (games[interaction.user.id].check_win(" ")) {
                interaction.editReply(win);
                delete games[interaction.user.id];
            }
        }
    }
}


class x_game {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.board = [];
        this.create_board();
        this.randomize_board();
        this.message_id = undefined;
    }
    create_board() {
        for (let i = 0; i < this.y; i++) {
            let line = [];
            for (let j = 0; j < this.x; j++) {
                line.push(" ");
            }
            this.board.push(line);
        }
    }
    change_boxes(press_x, press_y) {
        press_y = parseInt(press_y);
        press_x = parseInt(press_x);
        // Middle
        if (this.board[press_y][press_x] == " ") { this.board[press_y][press_x] = "x"; } else { this.board[press_y][press_x] = " "; };
        // Up
        if (press_y > 0) { if (this.board[press_y - 1][press_x] == " ") { this.board[press_y - 1][press_x] = "x"; } else { this.board[press_y - 1][press_x] = " "; } };
        // Down
        if (press_y + 1 != this.y) { if (this.board[press_y + 1][press_x] == " ") { this.board[press_y + 1][press_x] = "x"; } else { this.board[press_y + 1][press_x] = " "; } };
        // Left
        if (press_x > 0) { if (this.board[press_y][press_x - 1] == " ") { this.board[press_y][press_x - 1] = "x"; } else { this.board[press_y][press_x - 1] = " "; } };
        // Right
        if (press_x + 1 != this.x) { if (this.board[press_y][press_x + 1] == " ") { this.board[press_y][press_x + 1] = "x"; } else { this.board[press_y][press_x + 1] = " "; } };
    }
    randomize_board() {
        while (this.check_win(" ")) {
            for (let k = 0; k < getRandomInt(5, 20); k++) {
                this.change_boxes(getRandomInt(0, this.x), getRandomInt(0, this.y));
            }
        }
    }
    toMessage() {
        let rows = [];
        for (let y = 0; y < this.y; y++) {
            const row = new MessageActionRow();
            for (let x = 0; x < this.x; x++) {
                row.addComponents(new MessageButton()
                    .setCustomId(x.toString() + y.toString())
                    .setLabel(this.board[y][x])
                    .setStyle('SECONDARY'));
            }
            rows.push(row);
        }
        return rows;
    }
    // returns true when all are figure_to_check
    check_win(figure_to_check) { // figure_to_check = "x" or " "
        for (let i = 0; i < this.y; i++) {
            for (let j = 0; j < this.x; j++) {
                if (this.board[i][j] != figure_to_check) {
                    return false;
                }
            }
        }
        return true;
    }
}


export { xgame_start, xgame_continue };
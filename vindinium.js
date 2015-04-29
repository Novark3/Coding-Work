var Bot = require('bot');
var PF = require('pathfinding');
var bot = new Bot('21w2b21s', 'arena', 'http://24.6.28.217:9000'); //Put your bot's code here and change training to Arena when you want to fight others.
//var bot = new Bot('nxirueqe', 'arena', 'http://vindinium.org/');
var goDir;
var Promise = require('bluebird');
Bot.prototype.botBrain = function() {
    return new Promise(function(resolve, reject) {
        _this = bot;
        /* Write your bot below Here */
        /* Set `bot.goDir` in the direction you want to go */
        //These are all of the variables used in the entire code
        var myPos = [bot.yourBot.pos.x, bot.yourBot.pos.y];
        var enemyBots = [];
        var enemyMines = [];
        var closestLife = bot.taverns[0];
        //        var rand = Math.floor(Math.random() * 4);
        //        var dirs = ["north", "south", "east", "west"];
        var enemyHealth = [];
        var lowestEnemy = enemyHealth[0];
        var availableEnemy = [];
        var enemyPosition = [];
        var minesOneOwns = [];
        var minesTwoOwns = [];
        var minesThreeOwns = [];
        var minesFourOwns = [];
        var whoOwnsMost = [];
        var ownsMore = [];
        var closestTavern = bot.taverns[0];
        //This code tries to find who the enemy bots are
        if(bot.yourBot.id != 1) {
            enemyBots.push(bot.bot1);
        }
        if(bot.yourBot.id != 2) {
            enemyBots.push(bot.bot2);
        }
        if(bot.yourBot.id != 3) {
            enemyBots.push(bot.bot3);
        }
        if(bot.yourBot.id != 4) {
            enemyBots.push(bot.bot4);
        }
        //This variable keeps the coordinates of the closest enemy to me in case I want to attack them
        var closestEnemy = [enemyBots[0].pos.x, enemyBots[0].pos.y];
        //The code here stores the locations of enemy mines.
        if(bot.yourBot.id != 1) {
            enemyMines = enemyMines.concat(bot.bot1mines), minesOneOwns = minesOneOwns.concat(bot.bot1mines);
        }
        if(bot.yourBot.id != 2) {
            enemyMines = enemyMines.concat(bot.bot2mines), minesTwoOwns = minesTwoOwns.concat(bot.bot2mines);
        }
        if(bot.yourBot.id != 3) {
            enemyMines = enemyMines.concat(bot.bot3mines), minesThreeOwns = minesThreeOwns.concat(bot.bot3mines);
        }
        if(bot.yourBot.id != 4) {
            enemyMines = enemyMines.concat(bot.bot4mines), minesFourOwns = minesFourOwns.concat(bot.bot4mines);
        }
        //This Code moves in random directions
        /*function randomMove(){
        bot.goDir = dirs[rand];
        }*/
        //This code checks if there is a player with more mines than I then puts a true / false into an above array

        function checkEnemyMines() {
            if(minesOneOwns.length > bot.yourBot.mineCount || minesFourOwns.length > bot.yourBot.mineCount || minesThreeOwns.length > bot.yourBot.mineCount || minesTwoOwns.length > bot.yourBot.mineCount) {
                ownsMore = true
            } else {
                ownsMore = false
            }
        }
        //This code checks my player's health and if it is low, go to fill it up at the nearest tavern

        function health() {
            for(i = 0; i < bot.taverns.length; i++) {
                if(bot.findDistance(myPos, closestLife) > bot.findDistance(myPos, bot.taverns[i])) {
                    closestLife = bot.taverns[i];
                }
            }
            bot.goDir = bot.findPath(myPos, closestLife);
        }
        //This code returns the [x,y] of the closest health tavern then returns it into an array

        function findClosestTavern() {
            var closestTavern
            for(i = 0; i < bot.taverns.length; i++) {
                if(bot.findDistance(myPos, closestTavern) > bot.findDistance(myPos, bot.taverns[i])) {
                    closestTavern = bot.taverns[i];
                }
            }
            return closestTavern;
        }
        //This code finds the nearest free mine and goes in that direction to go capture it

        function mines() {
            var closestMine = bot.freeMines[0];
            for(i = 0; i < bot.freeMines.length; i++) {
                if(bot.findDistance(myPos, closestMine) > bot.findDistance(myPos, bot.freeMines[i])) {
                    closestMine = bot.freeMines[i];
                }
            }
            bot.goDir = bot.findPath(myPos, closestMine);
        }
        //This is a function for going to enemy mines and capturing them

        function capEnemyMine() {
            var nearestMine = enemyMines[0];
            for(i = 0; i < enemyMines.length; i++) {
                if(bot.findDistance(myPos, nearestMine) > bot.findDistance(myPos, enemyMines[i])) {
                    nearestMine = enemyMines[i];
                }
            }
            bot.goDir = bot.findPath(myPos, nearestMine);
        }
        //This function checks if there is a player with less health than I and pushes a true / false into an array above

        function globalTarget() {
            for(i = 0; i < enemyBots.length; i++) {
                if(enemyBots[i].life < bot.yourBot.life) {
                    availableEnemy = true
                } else {
                    availableEnemy = false
                }
            }
        }
        //This code makes the bot go and attack the closest player

        function attackEnemy() {
            for(i = 0; i < enemyBots.length; i++) {
                if(bot.findDistance(myPos, closestEnemy) > bot.findDistance(myPos, [enemyBots[i].pos.x, enemyBots[i].pos.y])) {
                    closestEnemy = [enemyBots[i].pos.x, enemyBots[i].pos.y];
                }
            }
            bot.goDir = bot.findPath(myPos, closestEnemy);
        }
        //This code checks which enemy has the most mines and pushes their position into an array to be used later in the function strategicKill

        function checkEnemy() {
            if(minesFourOwns.length >= minesOneOwns.length && minesFourOwns.length >= minesTwoOwns.length && minesFourOwns.length >= minesThreeOwns.length) {
                whoOwnsMost.push(bot.bot4.pos.x, bot.bot4.pos.y)
            } else if(minesThreeOwns.length >= minesFourOwns.length && minesThreeOwns.length >= minesTwoOwns.length && minesThreeOwns.length >= minesOneOwns.length) {
                whoOwnsMost.push(bot.bot3.pos.x, bot.bot3.pos.y)
            } else if(minesTwoOwns.length >= minesFourOwns.length && minesTwoOwns.length >= minesThreeOwns.length && minesTwoOwns.length >= minesOneOwns.length) {
                whoOwnsMost.push(bot.bot2.pos.x, bot.bot2.pos.y)
            } else if(minesOneOwns.length >= minesFourOwns.length && minesOneOwns.length >= minesThreeOwns && minesOneOwns.length >= minesTwoOwns.length) {
                whoOwnsMost.push(bot.bot1.pos.x, bot.bot1.pos.y)
            }
        }
        //This code checks who to kill if I want to be strategic

        function strategicKill() {
            if(bot.yourBot.life < enemyBots[0].life || bot.yourBot.life < enemyBots[1].life || bot.yourBot.life < enemyBots[2].life) {
                health();
            }
            bot.goDir = bot.findPath(myPos, whoOwnsMost)
        }
        //This code will be to determine whether I should run away or not
        var totalMines = enemyMines.length + bot.freeMines.length + bot.yourBot.mineCount;
        var percentMinesOwned = bot.yourBot.mineCount / totalMines;
        var freeMinesLeft = bot.freeMines.length / totalMines
        //This is so that there is always a scan for low hp targets
        globalTarget();
        //This is so that there is always a scan for which enemy owns the most mines
        checkEnemy();
        //This makes sure that there is a scan for enemies with more mines
        checkEnemyMines();
        //This code scans for the closest tavern
        for(i = 0; i < bot.taverns.length; i++) {
            if(bot.findDistance(myPos, closestTavern) > bot.findDistance(myPos, bot.taverns[i])) {
                closestTavern = bot.taverns[i];
            }
        }
        //This decides what the bot will do
        if(bot.yourBot.life <= 30) {
            health();
        } else if((bot.findDistance(myPos, closestTavern) === 2) && (bot.yourBot.life < 80)) {
            bot.goDir = bot.findPath(myPos, closestTavern);
        } else if(freeMinesLeft > .4) {
            mines();
        } else if(percentMinesOwned > .65) {
            health();
        } else if(enemyMines.length > 0 && ownsMore == false) {
            capEnemyMine();
        } else if(ownsMore == true) {
            strategicKill();
        } else if(availableEnemy === true) {
            attackEnemy();
        } else if(availableEnemy === false) {
            health();
        }
        /* DON'T REMOVE ANTYTHING BELOW THIS LINE */
        resolve();
    });
};
bot.runGame();
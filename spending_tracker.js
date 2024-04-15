"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const filters_1 = require("telegraf/filters");
const fs = require("fs");
require('dotenv').config();
if (!process.env.BOT_TOKEN) {
    console.error('Error: BOT_TOKEN is not defined in the environment variables.');
    process.exit(1);
}
if (!process.env.CHAT_ID) {
    console.error('Error: CHAT_ID is not defined in the environment variables.');
    process.exit(1);
}
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
let step = 0;
let date, category, description, amount;
let isGame = false;
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on((0, filters_1.message)('sticker'), (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.command('add', async (ctx) => {
    step = 1;
    await ctx.reply('Please enter the date (YYYY-MM-DD):');
});
bot.command('draft', async (ctx) => {
    isGame = true;
    await ctx.reply('Game started!');
});
bot.on('text', async (ctx) => {
    if (isGame) {
        playGame(ctx.message.text);
    }
    else {
        switch (step) {
            case 1:
                date = ctx.message.text;
                step = 2;
                await ctx.reply(`Choose a category:
            1. food
            2. utilities
            3. entertainment
            4. internet
            5. clothes
            6. groceries
            7. others`);
                break;
            case 2:
                const option = parseInt(ctx.message.text);
                switch (option) {
                    case 1:
                        category = 'food';
                        break;
                    case 2:
                        category = 'utilities';
                        break;
                    case 3:
                        category = 'entertainment';
                        break;
                    case 4:
                        category = 'internet';
                        break;
                    case 5:
                        category = 'clothes';
                        break;
                    case 6:
                        category = 'groceries';
                        break;
                    case 7:
                        category = 'others';
                        break;
                    default:
                        category = 'others';
                        break;
                }
                step = 3;
                await ctx.reply('Enter a description:');
                break;
            case 3:
                description = ctx.message.text;
                step = 4;
                await ctx.reply('Enter the amount:');
                break;
            case 4:
                amount = ctx.message.text;
                saveData({ date, category, description, amount });
                step = 0;
                date = category = description = amount = "";
                await ctx.reply('Data saved successfully!');
                break;
            default:
                break;
        }
    }
});
function playGame(text) {
    if (!process.env.CHAT_ID) {
        console.error('Error: CHAT_ID is not defined in the environment variables.');
        process.exit(1);
    }
    const options = ['rock', 'paper', 'scissors'];
    const computerChoice = options[Math.floor(Math.random() * options.length)];
    const userChoice = text.toLowerCase();
    if (userChoice === computerChoice) {
        bot.telegram.sendMessage(process.env.CHAT_ID, 'Tie! Try again!');
    }
    else if ((userChoice === 'rock' && computerChoice === 'scissors') || (userChoice === 'paper' && computerChoice === 'rock') || (userChoice === 'scissors' && computerChoice === 'paper')) {
        bot.telegram.sendMessage(process.env.CHAT_ID, 'You win!');
    }
    else {
        bot.telegram.sendMessage(process.env.CHAT_ID, 'You lose!');
    }
}
function saveData(data) {
    const filename = 'data.json';
    let jsonData = [];
    if (fs.existsSync(filename)) {
        const existingData = fs.readFileSync(filename, 'utf8');
        jsonData = JSON.parse(existingData);
    }
    jsonData.push(data);
    fs.writeFileSync(filename, JSON.stringify(jsonData, null, 4));
}
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

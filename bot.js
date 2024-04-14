const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', (ctx) => {
    console.log('Received /start command');
    ctx.reply('Hello! Welcome to your Telegram bot.');
});

let questionAsked = false;

function checkTimeAndAsk() {
    console.log('Checking time...');
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    console.log('Current time:', currentHour + ':' + currentMinute);

    if (currentHour === 16 && currentMinute === 20 && !questionAsked) {
        console.log("It's 4 PM! Asking the question...");
        bot.telegram.sendMessage(process.env.CHAT_ID, 'Darlingson, have you eaten yet?');
        questionAsked = true;
    }
}

setInterval(checkTimeAndAsk, 60000);

bot.hears('no', (ctx) => {
    console.log('Received "no" response');
    ctx.reply('Damn bruh, get some food');
    questionAsked = false;
});

bot.hears('yes', (ctx) => {
    console.log('Received "yes" response');
    ctx.reply('Ayt, good!');
    questionAsked = false;
});

console.log('Bot started polling...');
bot.startPolling();
console.log('Bot started successfully.');

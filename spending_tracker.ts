import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import * as fs from 'fs';
require('dotenv').config()

if (!process.env.BOT_TOKEN) {
    console.error('Error: BOT_TOKEN is not defined in the environment variables.');
    process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

let step = 0;
let date: string, category : string, description: string, amount;

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.command('add', async (ctx) => {
    step = 1;
    await ctx.reply('Please enter the date (YYYY-MM-DD):');
});

bot.on('text', async (ctx) => {
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
});

function saveData(data: any) {
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

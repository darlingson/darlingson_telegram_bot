import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import * as fs from 'fs';
require('dotenv').config()

if (!process.env.BOT_TOKEN) {
    console.error('Error: BOT_TOKEN is not defined in the environment variables.');
    process.exit(1);
}
if (!process.env.CHAT_ID) {
    console.error('Error: CHAT_ID is not defined in the environment variables.');
    process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);
let state = 'greeting';
let step = 0;
bot.start((ctx) => ctx.reply(`
                    Welcome to the products chatbot!
                    You can ask me about the products you need.
                    We have offer the following products:
                    1. Smartphone App development
                    2. Web development
                    3. AI development
                    4. Desktop development
                    5. Game development

                    Type samples to see some samples

                    `));
bot.hears('samples', (ctx) => {
    state = 'samples'
    ctx.reply(`
    Enter the category number:
        1. Smartphone App development
        2. Web development
        3. AI development
        4. Desktop development
        5. Game development
    `)
})
bot.on('text' , async (ctx) => {
    
})

function getSamples() {
    
}
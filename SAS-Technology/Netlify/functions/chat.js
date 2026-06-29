// netlify/functions/chat.js
const { GoogleGenAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
    // تەنها ڕێگا بە داواکاری POST دەدەین
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { message } = JSON.parse(event.body);
        
        // وەرگرتنی کلیل لە ڕێکخستنە پارێزراوەکانی نێتلایف
        const apiKey = process.env.GEMINI_API_KEY;
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

        // چاندنی زانیاری جێگیری ماڵپەڕەکە لە مێشکی مۆدێلەکەدا (System Instructions)
        const systemPrompt = `تۆ یاریدەدەری زیرەکی ماڵپەڕی SAS-Tech یت. خاوەنی ئەم پلاتفۆرمە شادمان ئەحمەد سامی ڕەشیدە. 
        تەنها و تەنها بە زمانی کوردی (سۆرانی) وەڵام بدەرەوە. 
        زانیارییەکانت تەنها لەسەر ئەم بابەتانە بێت:
        - کۆرسی هۆشیاری و ئۆتۆماتیکردنی بزنس بە AI (نرخ: ٢٥,٠٠٠ دینار مانگانە).
        - ماستەرکلاسی مۆنتۆژ و بەرهەمهێنانی دیجیتاڵی (نرخ: ٢٠,٠٠٠ دینار مانگانە).
        - بابەتەکانی ماڵپەڕەکە: بەکارهێنانی ChatGPT لە ژیانی ڕۆژانە، دروستکردنی ناوەڕۆک بە AI، ڕێبەری لۆکاڵ ئۆفلاین AI.
        ئەگەر بەکارهێنەر پرسیارێکی دەرەوەی ئەم بابەتانەی کرد، بە ئەدەبەوە بڵێ من تەنها دەتوانم وەڵامی پرسیارەکانی پەیوەست بە SAS-Tech بدەمەوە.`;

        const result = await model.generateContent([systemPrompt, message]);
        const responseText = result.response.text();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reply: responseText })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
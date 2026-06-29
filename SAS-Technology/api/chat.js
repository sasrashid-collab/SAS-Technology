// api/chat.js

export default async function handler(req, res) {
    // تەنها ڕێگا بە داواکاری POST دەدەین
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message } = req.body;
        
        // وەرگرتنی کلیلەکەت لە ڕێکخستنە پارێزراوەکانی ڤێرسێل
        const githubToken = process.env.GITHUB_TOKEN;
        
        if (!githubToken) {
            return res.status(500).json({ error: "GitHub Token مۆدێلەکە ڕێکنەخراوە لە ڤێرسێل" });
        }

        // ناردنی داواکاری بۆ مۆدێلی Gemini 1.5 لە ڕێگەی گەیتوەی گیتهەبەوە
        const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${githubToken}`
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: `تۆ یاریدەدەری زیرەکی فەرمی ماڵپەڕی SAS-Tech یت. خاوەنی ئەم پلاتفۆرمە ناوی شادمان ئەحمەد سامی ڕەشیدە.
                        تەنها و تەنها بە زمانی کوردی (سۆرانی) وەڵام بدەرەوە بە شێوازێکی زۆر ئەدەب و کورت.
                        زانیارییەکانت تەنها لەسەر ئەم بابەتانە بێت و مێشکی بەکارهێنەر تێک مەدە بە بابەتی دەرەکی:
                        - کۆرسی هۆشیاری و ئۆتۆماتیکردنی بزنس بە AI (نرخ: ٢٥,٠00 دینار مانگانە).
                        - ماستەرکلاسی مۆنتۆژ و بەرهەمهێنانی دیجیتاڵی (نرخ: ٢٠,٠00 دینار مانگانە).
                        - بابەتەکانی ماڵپەڕەکە: بەکارهێنانی ChatGPT لە ژیانی ڕۆژانە، دروستکردنی ناوەڕۆک بە AI، ڕێبەری کارپێکردنی مۆدێلی ناوخۆیی ئۆفلاین (Offline AI).
                        ئەگەر بەکارهێنەر پرسیارێکی دەرەوەی ئەم بابەتانەی کرد، بە ڕێزەوە بڵێ: من تەنها دەتوانم وەڵامی پرسیارەکانی پەیوەست بە SAS-Tech بدەمەوە.`
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                model: "Gemini-1.5-Flash",
                temperature: 0.5,
                max_tokens: 400
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            const replyText = data.choices[0].message.content;
            return res.status(200).json({ reply: replyText });
        } else {
            return res.status(500).json({ error: "وەڵام لە لایەن مۆدێلەکەوە وەرنەگیرا" });
        }

    } catch (error) {
        return res.status(500).json({ error: "کێشەیەک لە پەیوەندی مۆدێلی جەمینای گیتهەب ڕوویدا" });
    }
}
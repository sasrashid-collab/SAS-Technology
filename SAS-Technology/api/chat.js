// ئەم ناونیشانە نوێیە بخەرە ناو فایلی index.html لە بەشی fetch
const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
});
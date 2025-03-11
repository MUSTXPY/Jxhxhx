function sendMessage() {
    let userInput = document.getElementById("userInput").value;
    let chatbox = document.getElementById("chatbox");

    if (userInput.trim() === "") {
        alert("الرجاء إدخال رسالة قبل الإرسال.");
        return;
    }

    // عرض رسالة المستخدم
    let userMessage = `<div class="message user">${userInput}</div>`;
    chatbox.innerHTML += userMessage;

    // تنظيف الإدخال
    document.getElementById("userInput").value = "";

    // تأثير التحميل
    let loadingMessage = `<div class="message bot loading">يتم التحميل...</div>`;
    chatbox.innerHTML += loadingMessage;
    scrollToBottom();

    // استدعاء API
    fetch(`https://atared.serv00.net/api/chatgpt3.5.php?text=${encodeURIComponent(userInput)}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector(".loading").remove();

            let botResponse = formatResponse(data.response);
            chatbox.innerHTML += botResponse;

            scrollToBottom();
        })
        .catch(error => {
            document.querySelector(".loading").remove();
            let errorMessage = `<div class="message bot">حدث خطأ، حاول مرة أخرى!</div>`;
            chatbox.innerHTML += errorMessage;
        });
}

// تنسيق الردود بحيث تدعم الأكواد البرمجية
function formatResponse(text) {
    let formattedText = text.replace(/```(.*?)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `
            <pre><button class="copy-btn" onclick="copyCode(this)">نسخ</button><code>${code}</code></pre>
        `;
    });

    return `<div class="message bot">${formattedText}</div>`;
}

// تمرير المحادثة لآخر الرسائل
function scrollToBottom() {
    let chatbox = document.getElementById("chatbox");
    chatbox.scrollTop = chatbox.scrollHeight;
}

// وظيفة زر النسخ
function copyCode(button) {
    let codeBlock = button.nextElementSibling.innerText;
    navigator.clipboard.writeText(codeBlock).then(() => {
        button.innerText = "تم النسخ!";
        setTimeout(() => button.innerText = "نسخ", 2000);
    });
}

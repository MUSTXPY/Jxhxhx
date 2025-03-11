document.addEventListener("DOMContentLoaded", () => {
    loadChatHistory();
});

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

    // حفظ المحادثة
    saveChatHistory(userMessage);

    // تنظيف الإدخال
    document.getElementById("userInput").value = "";

    // عرض تأثير التحميل
    let loadingMessage = `<div class="message bot loading">يتم التحميل...</div>`;
    chatbox.innerHTML += loadingMessage;
    scrollToBottom();

    // استدعاء API
    fetch(`https://atared.serv00.net/api/chatgpt3.5.php?text=${encodeURIComponent(userInput)}`)
        .then(response => response.json())
        .then(data => {
            // إزالة تأثير التحميل
            document.querySelector(".loading").remove();

            let botResponse = `<div class="message bot">${data.response}</div>`;
            chatbox.innerHTML += botResponse;

            // حفظ المحادثة
            saveChatHistory(botResponse);

            // تمرير إلى آخر رسالة
            scrollToBottom();
        })
        .catch(error => {
            document.querySelector(".loading").remove();
            let errorMessage = `<div class="message bot">حدث خطأ، حاول مرة أخرى!</div>`;
            chatbox.innerHTML += errorMessage;
            saveChatHistory(errorMessage);
        });
}

// إرسال بالضغط على Enter
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// تمرير المحادثة إلى آخر رسالة
function scrollToBottom() {
    let chatbox = document.getElementById("chatbox");
    chatbox.scrollTop = chatbox.scrollHeight;
}

// حفظ المحادثات في Local Storage
function saveChatHistory(message) {
    let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
    history.push(message);
    localStorage.setItem("chatHistory", JSON.stringify(history));
}

// تحميل المحادثات السابقة
function loadChatHistory() {
    let chatbox = document.getElementById("chatbox");
    let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
    history.forEach(msg => {
        chatbox.innerHTML += msg;
    });
    scrollToBottom();
}
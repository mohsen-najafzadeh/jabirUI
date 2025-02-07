const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');
const sendBtn = document.getElementById('sendBtn');
sendBtn.addEventListener('click', sendMessage);
messageInput.focus();
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

function sendMessage() {
    const messageText = messageInput.value.trim();

    if (messageText !== '') {
        // ایجاد پیام ارسالی
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'sent');
        messageElement.innerHTML = `<div class="bubble">${messageText}</div>`;
        chatMessages.appendChild(messageElement);

        callServer(messageText);
    }
}

async function callServer(messageText) {
    messageInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    sendBtn.innerText = "در حال دریافت ... ⏳";
    sendBtn.disabled = true;

    await fetch('/jabir-startchat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCSRFToken()
            },
            body: new URLSearchParams({
                'user_input': messageText
            })
        })
        .then(response => response.json())
        .then(data => {
            result = data.message;

            // ایجاد پیام دریافتی
            const replyElement = document.createElement('div');
            replyElement.classList.add('message', 'received');
            replyElement.innerHTML = '<div class="bubble">' + result + '</div>';

            chatMessages.appendChild(replyElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(error => {
            console.error('error:', error);
        });

    sendBtn.innerText = "ارسال ⮜";
    sendBtn.disabled = false;
    messageInput.focus();
}
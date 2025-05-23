# AI相談チャット (AI Counseling Chat)

This is a Vue.js-based AI-powered chat application designed for providing helpful and empathetic counseling in different life categories (e.g. work, health, relationships).

## 🧠 Features

- 💬 Clean and responsive chat interface  
- 🤖 OpenAI GPT integration  
- 🗂️ Category-based prompts (e.g. work, study, health, relationships)  
- 🇯🇵 User-friendly Japanese design  
- 📱 Mobile responsive layout   
- 🌍 Multilingual support

## 🌐 Multilingual Support

The system is designed to respond in the **same language** the user writes in.

To support this behavior, use the following system prompt (in English):

> _"You are a helpful, empathetic counselor. Respond to the user in the same language they use."_

Users can freely chat in Japanese, English, or any other supported language.

If you want to enforce a fixed language (e.g. Japanese), use:

> _"あなたは親切で共感的なカウンセラーです。日本語で丁寧に返答してください。"_

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-counseling-chat.git
cd ai-counseling-chat

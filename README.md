# AI相談チャット (AI Counseling Chat)

This is a Vue.js-based AI-powered chat application designed for providing helpful and empathetic counseling in different life categories (e.g. work, health, relationships).

## 🌐 Demo
👉 [Live Demo](https://juliettkhar.github.io/ai-consult-app/) 
> 🔑 **An OpenAI API key is required to use.**  
Users must provide their own API key in the app interface to enable access to AI responses.

## 🧰 Built With

- ⚡ Vue 3 + Vite
- 💬 OpenAI API
- 🎨 SCSS custom styling
- 🌐 Multilingual support

## 🧠 Features

- 🔐 API key input (user-provided or demo key)
- 🌏 Supports any input language (OpenAI handles translation)
- 🗂 Category selection for contextual prompts
- 🤖 Talking bot with chat bubble animation
- ✨ Animated glowing points and background effects
- 📱 Responsive design with adaptive layouts
- 🧩 Modular component structure
- 📜 FAQ, Privacy Policy, and Terms links

## 🌐 Multilingual Support

The system is designed to respond in the **same language** the user writes in.

To support this behavior, use the following system prompt (in English):

> _"You are a helpful, empathetic counselor. Respond to the user in the same language they use."_

Users can freely chat in Japanese, English, or any other supported language.

If you want to enforce a fixed language (e.g. Japanese), use:

> _"あなたは親切で共感的なカウンセラーです。日本語で丁寧に返答してください。"_

## 📦 Setup

```bash
git clone https://github.com/juliettkhar.github.io/ai-consultant.git
cd ai-consultant
npm install
npm run dev

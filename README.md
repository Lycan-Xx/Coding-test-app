# CodeTest AI - Dark-themed Coding Test Platform

A modern, dark-themed coding test platform built with React and Express, featuring AI-powered question generation and code evaluation.

## Features

- 🎨 Dark-themed modern UI using shadcn/ui components
- 🧠 AI-powered coding questions generation
- 💻 Built-in code editor with syntax highlighting
- 🔍 Real-time code evaluation and feedback
- ⚡ Multiple AI provider support (OpenAI, Gemini)
- 🎯 Difficulty levels for questions
- 🛠️ User settings customization

## Tech Stack

- **Frontend**: React with JSX
- **Backend**: Express.js
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Code Editor**: Monaco Editor
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Form Handling**: React Hook Form
- **AI Integration**: OpenAI API

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── ui/
│   │   │   └── ...
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   ├── ai/
│   │   │   └── ...
│   │   └── pages/
├── server/
│   ├── routes.ts
│   ├── storage.ts
│   └── ...
└── shared/
    └── schema.ts
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Create a `.env` file
   - Add your OpenAI API key:
     ```
     VITE_OPENAI_API_KEY=your_api_key_here
     ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5000 in your browser

## Features in Detail

### AI Question Generation
- Automatically generates coding questions with varying difficulty levels
- Includes test cases and examples for each question
- Supports multiple programming languages

### Code Evaluation
- Real-time code execution in a sandboxed environment
- AI-powered code review and feedback
- Test case validation

### User Interface
- Clean, dark-themed design
- Responsive layout
- Split-view coding environment
- Syntax highlighting
- Console output display

### User Settings
- Difficulty level preferences
- Programming language selection
- AI model selection
- Theme customization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

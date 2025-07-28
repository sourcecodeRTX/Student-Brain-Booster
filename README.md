# 🎓 Student Brain Booster

![Version](https://img.shields.io/badge/version-0.1.0-blue) 
![NextJS](https://img.shields.io/badge/NextJS-14.2.16-black)
![License](https://img.shields.io/badge/license-MIT-green)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%201.5-orange)

<p align="center">
  <img src="public/placeholder-logo.svg" alt="Student Brain Booster Logo" width="200" />
</p>

## 📚 Overview

Student Brain Booster is an interactive AI-powered educational tool designed to help students of all educational levels with their academic questions. It leverages Google's Gemini AI to provide intelligent answers tailored to specific subjects and educational levels, enabling personalized learning assistance on demand.

This application features a modern, responsive UI with theme support, a Pomodoro timer for focused study sessions, and both text and image-based question handling capabilities. Student Brain Booster is perfect for students seeking quick clarification on concepts, solving complex problems, or getting help with homework across various subjects.

---

## ✨ Features

### 🤖 AI-Powered Assistance
- **Subject-Specific Help**: Get tailored answers for 14+ academic subjects
- **Education Level Customization**: Adjust responses to match primary school through college level
- **Text & Image Questions**: Upload images of handwritten problems or textbook questions
- **Structured Responses**: Receive clear, well-organized answers with key points and memory tips

### ⏱️ Productivity Tools
- **Built-in Pomodoro Timer**: 25-minute focus sessions followed by 5-minute breaks
- **Study Statistics**: Track questions answered and total study time
- **Question History**: Access previously asked questions for review

### 🎨 User Experience
- **Dark/Light Theme**: Choose your preferred visual mode
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Animations & Effects**: Engaging interactive elements enhance user experience
- **Accessibility Features**: Designed with accessibility in mind

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration**: [Google Gemini 1.5 Flash API](https://ai.google.dev/)
- **State Management**: React Hooks & Context
- **Form Handling**: React Hook Form
- **Animations**: CSS Animations & Transitions

---

## 📋 Prerequisites

Before you begin, ensure you have:

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)
- [Google Gemini API Key(s)](https://makersuite.google.com/)

---

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/student-brain-booster.git
   cd student-brain-booster
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn install

   # Using pnpm
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with:
   ```
   GEMINI_API_KEY_1=your_gemini_api_key_here
   # Optional additional keys for rotation
   GEMINI_API_KEY_2=your_backup_key_1
   GEMINI_API_KEY_3=your_backup_key_2
   GEMINI_API_KEY_4=your_backup_key_3
   ```

4. **Start the development server**
   ```bash
   # Using npm
   npm run dev

   # Using yarn
   yarn dev

   # Using pnpm
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔄 Core Workflow

### 📊 System Architecture

```mermaid
graph TD
    subgraph "Client Side"
        UI[User Interface] --> InputHandler[Input Handler]
        InputHandler --> TextProcessor[Text Processor]
        InputHandler --> ImageProcessor[Image Processor]
        ThemeManager[Theme Manager] --> UI
        PomoTimer[Pomodoro Timer] --> UI
        HistoryManager[History Manager] <--> UI
        TextProcessor --> RequestManager[Request Manager]
        ImageProcessor --> RequestManager
    end
    
    subgraph "Server Side"
        RequestManager --> APIController[API Controller]
        APIController --> KeyRotator[API Key Rotator]
        KeyRotator --> GeminiAPI[Gemini AI API]
        GeminiAPI --> ResponseFormatter[Response Formatter]
        ResponseFormatter --> APIController
    end
    
    APIController --> UI
```

### 🔄 User Session Flow

```mermaid
flowchart TD
    Start([Start]) --> Home[Home Page]
    Home --> Subject[Subject Selection]
    Subject --> EducationLevel[Education Level]
    EducationLevel --> InputType{Input Type?}
    
    InputType -->|Text| TextInput[Text Question]
    InputType -->|Image| ImageUpload[Image Upload]
    
    TextInput --> OptionalContext[Add Context]
    ImageUpload --> OptionalContext
    
    OptionalContext --> StartTimer{Start Timer?}
    StartTimer -->|Yes| PomodoroTimer[Pomodoro Timer]
    StartTimer -->|No| SubmitQuestion[Submit Question]
    PomodoroTimer --> SubmitQuestion
    
    SubmitQuestion --> Processing[Processing]
    Processing --> Response[AI Response]
    
    Response --> SaveHistory[Save to History]
    SaveHistory --> NewQuestion{New Question?}
    
    NewQuestion -->|Yes| InputType
    NewQuestion -->|No| End([End])
```

### 🤖 AI Question-Answer Flow

```mermaid
graph TD
    A[User selects subject] --> B[User selects education level]
    B --> C{Input mode?}
    C -->|Text| D[User types question]
    C -->|Image| E[User uploads image]
    E --> F[User adds optional context]
    D --> G[Send to AI]
    F --> G
    G --> H[Server processes request]
    H --> I[Call Gemini AI API]
    I --> J[Format & return answer]
    J --> K[Display answer to user]
    K --> L[Save to question history]
```

### 🔑 API Key Rotation System

```mermaid
graph TD
    A[Request initiates] --> B[Get next API key from pool]
    B --> C{API call successful?}
    C -->|Yes| D[Return AI response]
    C -->|No| E[Try next API key]
    E --> F{More keys available?}
    F -->|Yes| B
    F -->|No| G[Return error]
```

---

## 🧩 Main Components

### 1. Question Interface

- Subject selection with visual cards
- Education level dropdown
- Text/image input toggle
- Image upload with preview and compression
- AI request and response handling

### 2. Pomodoro Timer

- 25-minute focus sessions
- 5-minute break intervals
- Visual progress tracking
- Session statistics

### 3. Question History

- Local storage of previous questions
- Quick access to frequently asked questions
- One-click reuse of previous questions

### 4. Theme System

- Light/dark mode toggle
- Persisted user preference
- System preference detection

---

## 🔐 Data Privacy

- All question data is stored locally on your device
- No user data is sent to servers except questions and images for AI processing
- Images are compressed client-side before transmission
- No registration or login required

---

## 📱 Mobile Experience

Student Brain Booster is fully responsive and optimized for mobile devices:

- Adaptive layouts for different screen sizes
- Touch-friendly interface elements
- Optimized image handling for mobile bandwidth

---

## 🔧 Advanced Customization

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| GEMINI_API_KEY_1 | Primary Gemini API key | Yes |
| GEMINI_API_KEY_2-4 | Backup API keys for rotation | No |

### Image Compression

You can adjust image compression settings in the `utils.ts` file:

- `maxWidth`: Maximum image dimension (default: 512px)
- `quality`: JPEG compression quality (default: 0.6)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👏 Acknowledgements

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Google Gemini AI](https://deepmind.google/technologies/gemini/) - AI model
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

---

---

> **Built with ❤️ for students everywhere**

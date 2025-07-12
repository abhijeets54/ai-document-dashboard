# Slideoo - AI Document Dashboard

A modern, responsive dashboard for managing AI-generated documents built with Next.js, TypeScript, and Tailwind CSS. Features intelligent document creation using Google's Gemini AI with automatic fallback to multiple models.

## 🚀 Live Demo

[View Live Demo](https://slideoo-dashboard.vercel.app) *(Will be available after deployment)*

## ✨ Features

### Core Functionality
- **📄 Document Management**: Create, view, edit, and delete documents with full CRUD operations
- **🤖 AI-Powered Generation**: Intelligent document creation using Google Gemini AI with multiple model fallbacks
- **🔍 Advanced Search & Filtering**: Real-time search with filters by type, category, and date range
- **📱 Responsive Design**: Mobile-first approach that works seamlessly on all devices
- **🌙 Dark/Light Theme**: Toggle between themes with system preference detection
- **♿ Accessibility**: WCAG compliant with ARIA labels, keyboard navigation, and screen reader support

### Document Types
- **📄 Documents**: Traditional text documents for reports, articles, and content
- **📊 Presentations**: Slide deck content optimized for presentations
- **📈 Spreadsheets**: Structured data and tabular information

### Categories
- **💼 Business**: Professional documents, reports, and corporate content
- **👤 Personal**: Personal notes, journals, and individual projects
- **🎓 Academic**: Research papers, essays, and educational content

### Performance & UX
- **⚡ Lazy Loading**: Optimized image loading and component rendering
- **🔄 Infinite Scroll**: Seamless infinite scrolling with automatic loading of more documents
- **💾 Local Storage**: Persistent user preferences and document caching
- **🎨 Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **⌨️ Keyboard Navigation**: Full keyboard accessibility support

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration**: [Google Generative AI](https://ai.google.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Utilities**: [clsx](https://github.com/lukeed/clsx)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd slideoo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Copy the example environment file and add your API key:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 🏗️ Architecture Decisions

### Component Architecture
- **Atomic Design**: Components organized into UI primitives, composed components, and page layouts
- **Compound Components**: Complex components like Card use compound pattern for flexibility
- **Custom Hooks**: Business logic separated into reusable hooks for state management

### State Management
- **Local State**: React hooks for component-level state
- **Custom Hooks**: Centralized business logic in `useDocuments` and `useUserPreferences`
- **Local Storage**: Persistent storage for user preferences and document caching

### AI Integration
- **Multiple Models**: Automatic fallback between Gemini models for reliability
- **Error Handling**: Graceful degradation when AI services are unavailable
- **API Routes**: Server-side AI integration for security and performance

### Accessibility
- **WCAG 2.1 AA**: Compliant with accessibility standards
- **Keyboard Navigation**: Full keyboard support with focus management
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Trapping**: Modal focus management for better UX

### Performance
- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js Image component with lazy loading
- **Bundle Analysis**: Optimized bundle size with tree shaking
- **Caching**: Strategic caching of API responses and user data

## 🧪 Testing

The project includes comprehensive testing coverage:

### Unit Tests
- **Components**: All UI components have corresponding test files
- **Hooks**: Custom hooks tested with React Testing Library
- **Utilities**: Helper functions and utilities fully tested

### Test Structure
```
src/
├── components/
│   ├── ui/
│   │   └── __tests__/
│   └── __tests__/
├── hooks/
│   └── __tests__/
└── utils/
    └── __tests__/
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 768px (stacked layout, collapsible sidebar)
- **Tablet**: 768px - 1024px (partial sidebar, 2-column grid)
- **Desktop**: 1024px+ (full sidebar, 3-4 column grid)

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#6B7280)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Font Family**: System fonts with fallbacks
- **Scale**: Tailwind's default type scale
- **Line Height**: Optimized for readability

## 🔧 Configuration

### Environment Variables
```env
GEMINI_API_KEY=your_api_key_here
```

### Tailwind Configuration
Custom configuration in `tailwind.config.js` includes:
- Custom color palette
- Extended spacing scale
- Animation utilities
- Dark mode support

## 🚀 Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/slideoo-dashboard&env=GEMINI_API_KEY&envDescription=Google%20Gemini%20AI%20API%20Key&envLink=https://ai.google.dev/)

### Manual Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `GEMINI_API_KEY`
   - Deploy!

3. **Environment Variables**
   In your Vercel dashboard, add:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Google AI](https://ai.google.dev/) for the Gemini API
- [Lucide](https://lucide.dev/) for the beautiful icons
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

---

Built with ❤️ using modern web technologies

# Recipe Discovery App

A modern, responsive React desktop web application that serves as your ultimate cooking assistant. Designed with a beautiful, mobile-first approach, it allows users to discover recipes, plan meals, save favourites, and even generate smart shopping lists.

## Features
1. **Search by Dish or Ingredient**: Instantly find meals using the Spoonacular API.
2. **Recipe Details & Nutrition**: View comprehensive ingredients, step-by-step instructions, and detailed nutritional facts (macros & micro-nutrients).
3. **Favourites**: Save your favourite recipes securely to local storage.
4. **Dietary Filters**: Client-side and API-level filtering for Vegan, Vegetarian, Keto, Gluten-Free, Dairy-Free, and Halal.
5. **Weekly Meal Planner**: An intuitive, drag-and-drop calendar interface to schedule your weekly meals.
6. **Smart Shopping List**: Automatically aggregates and consolidates ingredients from your meal plan into a clean, printable checklist.
7. **Community Submissions**: Share your own recipes with the community using a robust form.
8. **Dark Mode & Aesthetics**: A premium, warm UI with a fully persistent dark mode, sleek transitions, and toast notifications.

## Tech Stack
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS v3
- **Components**: shadcn/ui, Radix UI primitives
- **Icons**: Lucide React
- **State Management**: Zustand (with Persist middleware)
- **Data Fetching**: TanStack Query (React Query v5)
- **Routing**: React Router v6
- **Drag & Drop**: @dnd-kit/core
- **Charts**: Recharts (for nutrition visuals)
- **API**: Spoonacular API (Free Tier)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd recipe-discovery-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Variables:
   Copy `.env.example` to a new file named `.env` and add your Spoonacular API key:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and replace `your_api_key_here` with your actual key from [Spoonacular](https://spoonacular.com/food-api).

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Folder Structure
```text
src/
├── components/
│   ├── community/    # Community recipe submission components
│   ├── layout/       # Navbar, Layout, PageWrapper
│   ├── planner/      # Drag and drop calendar components
│   ├── recipe/       # Recipe cards, grids, nutrition panel
│   ├── search/       # Search bar and dietary filters
│   └── ui/           # Reusable shadcn UI components
├── hooks/            # Custom TanStack query hooks
├── lib/              # Utility functions (cn, etc.)
├── pages/            # Main route views
├── services/         # API integration (Spoonacular)
├── store/            # Zustand global state (Favourites, Planner, etc.)
└── utils/            # Helper functions for calculations and formatting
```

## API Usage Note
This app utilizes the free tier of the Spoonacular API, which has a daily point limit (currently 150 points). To conserve quota, the application heavily caches requests using TanStack Query (5-minute stale time) and utilizes bulk fetching algorithms where appropriate.
# react-mini-project

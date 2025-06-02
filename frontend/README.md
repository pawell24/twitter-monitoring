# Twitter Monitoring Frontend

A React application for monitoring Twitter profiles and their activities.

## Features

- Profile list with activity statistics
- Alerts for inactive profiles
- Activity submission form
- Real-time updates using React Query

## Technical Stack

- React 18 with TypeScript
- Material-UI for components and styling
- React Query for data fetching and caching
- React Router for navigation
- Axios for API communication
- date-fns for date formatting

## Technical Decisions

1. **TypeScript**: Used for type safety and better developer experience
2. **Material-UI**: Chosen for its comprehensive component library and theming capabilities
3. **React Query**: Implemented for efficient data fetching, caching, and real-time updates
4. **Component Structure**: Organized into reusable components with clear responsibilities
5. **Form Handling**: Used controlled components with Material-UI for form management
6. **Date Formatting**: Utilized date-fns for consistent and localized date formatting

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Development

- The application uses Vite for fast development and building
- ESLint and TypeScript are configured for code quality
- Components are organized in a modular structure
- API calls are centralized in the services directory

## Testing

Run tests with:

```bash
npm test
```

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── services/      # API and other services
  ├── types/         # TypeScript type definitions
  └── utils/         # Utility functions
```

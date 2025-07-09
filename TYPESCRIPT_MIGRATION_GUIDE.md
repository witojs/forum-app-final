# TypeScript Migration Guide

This guide demonstrates how to migrate a React JavaScript application to TypeScript, using the Forum App as an example.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setting Up TypeScript](#setting-up-typescript)
3. [Configuration Files](#configuration-files)
4. [Type Definitions](#type-definitions)
5. [Converting Files](#converting-files)
6. [Common Patterns](#common-patterns)
7. [Migration Checklist](#migration-checklist)

## Prerequisites

Before migrating, ensure your project has:
- React 18+
- Modern build tools (Vite, webpack, etc.)
- ESLint for code quality
- A clear understanding of your data structures

## Setting Up TypeScript

### 1. Install TypeScript Dependencies

```bash
npm install --save-dev typescript @types/react @types/react-dom @types/node
```

For specific libraries, add their type definitions:
```bash
npm install --save-dev @types/styled-components
```

### 2. Install ESLint TypeScript Support

```bash
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-airbnb-typescript
```

## Configuration Files

### 1. TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2. ESLint Configuration (`.eslintrc.json`)

```json
{
  "extends": ["airbnb", "airbnb-typescript"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

### 3. Update Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint ./src --ext .jsx,.js,.tsx,.ts"
  }
}
```

## Type Definitions

### 1. API Types (`src/types/api.ts`)

Define interfaces for API responses and data structures:

```typescript
// API Response wrapper
export interface ApiResponse<T> {
  status: 'success' | 'fail';
  message: string;
  data: T;
}

// Domain entities
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Thread {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  ownerId: string;
  upVotesBy: string[];
  downVotesBy: string[];
  totalComments: number;
}

// Input/Output types
export interface CreateThreadData {
  title: string;
  body: string;
  category: string;
}
```

### 2. Redux Types (`src/types/redux.ts`)

Define Redux state and action types:

```typescript
// Store state
export interface RootState {
  users: User[];
  authUser: User | null;
  isPreload: boolean;
  threads: Thread[];
  threadDetail: ThreadDetail | null;
  darkTheme: boolean;
  loadingBar: { default: number };
}

// Action types
export interface PayloadAction<T> {
  type: string;
  payload: T;
}

export interface AddThreadAction extends PayloadAction<{ thread: Thread }> {
  type: 'ADD_THREAD';
}

// Component props
export interface ThreadInputProps {
  addThread: (data: CreateThreadData) => void;
}
```

## Converting Files

### 1. Converting Utilities

**Before (JavaScript):**
```javascript
// utils/api.js
const api = (() => {
  async function login({ email, password }) {
    // API call implementation
    return token;
  }
  
  return { login };
})();
```

**After (TypeScript):**
```typescript
// utils/api.ts
import { LoginData, ApiResponse } from '../types/api';

const api = (() => {
  async function login({ email, password }: LoginData): Promise<string> {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const responseJson: ApiResponse<{ token: string }> = await response.json();
    
    if (responseJson.status !== 'success') {
      throw new Error(responseJson.message);
    }

    return responseJson.data.token;
  }
  
  return { login };
})();
```

### 2. Converting Custom Hooks

**Before (JavaScript):**
```javascript
// hooks/useInput.js
import { useState } from 'react';

function useInput(defaultValue = '') {
  const [value, setValue] = useState(defaultValue);

  function handleValueChange({ target }) {
    setValue(target.value);
  }

  return [value, handleValueChange, setValue];
}
```

**After (TypeScript):**
```typescript
// hooks/useInput.ts
import { useState } from 'react';

type InputEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type UseInputReturn = [
  string,
  (event: InputEvent) => void,
  React.Dispatch<React.SetStateAction<string>>
];

function useInput(defaultValue: string = ''): UseInputReturn {
  const [value, setValue] = useState<string>(defaultValue);

  function handleValueChange(event: InputEvent): void {
    setValue(event.target.value);
  }

  return [value, handleValueChange, setValue];
}
```

### 3. Converting Redux Actions

**Before (JavaScript):**
```javascript
// states/threads/action.js
function addThread(thread) {
  return {
    type: 'ADD_THREAD',
    payload: { thread },
  };
}

function asyncAddThread({ title, body, category }) {
  return async (dispatch) => {
    try {
      const thread = await api.createThread({ title, body, category });
      dispatch(addThread(thread));
    } catch (error) {
      alert(error.message);
    }
  };
}
```

**After (TypeScript):**
```typescript
// states/threads/action.ts
import { Thread, CreateThreadData } from '../../types/api';
import { AddThreadAction, AppThunk } from '../../types/redux';

function addThread(thread: Thread): AddThreadAction {
  return {
    type: 'ADD_THREAD',
    payload: { thread },
  };
}

function asyncAddThread({ title, body, category }: CreateThreadData): AppThunk {
  return async (dispatch) => {
    try {
      const thread = await api.createThread({ title, body, category });
      dispatch(addThread(thread));
    } catch (error) {
      alert((error as Error).message);
    }
  };
}
```

### 4. Converting Redux Reducers

**Before (JavaScript):**
```javascript
// states/threads/reducer.js
function threadsReducer(threads = [], action = {}) {
  switch (action.type) {
    case 'ADD_THREAD':
      return [action.payload.thread, ...threads];
    default:
      return threads;
  }
}
```

**After (TypeScript):**
```typescript
// states/threads/reducer.ts
import { Thread } from '../../types/api';
import { ThreadsAction } from '../../types/redux';

function threadsReducer(action: ThreadsAction, threads: Thread[] = []): Thread[] {
  switch (action.type) {
    case 'ADD_THREAD':
      return [action.payload.thread, ...threads];
    default:
      return threads;
  }
}
```

### 5. Converting Components

**Before (JavaScript):**
```javascript
// components/ThreadInput.jsx
import React from 'react';
import PropTypes from 'prop-types';

function ThreadInput({ addThread }) {
  // Component logic
  return <form>...</form>;
}

ThreadInput.propTypes = {
  addThread: PropTypes.func.isRequired,
};
```

**After (TypeScript):**
```typescript
// components/ThreadInput.tsx
import React from 'react';
import { ThreadInputProps } from '../types/redux';

function ThreadInput({ addThread }: ThreadInputProps): JSX.Element {
  // Component logic
  return <form>...</form>;
}
```

## Common Patterns

### 1. Event Handlers

```typescript
// Input change events
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};

// Button click events
const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  // Handle click
};

// Form submission
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  // Handle form submission
};
```

### 2. Redux Selectors

```typescript
// Typed selectors
const selectAuthUser = (state: RootState) => state.authUser;
const selectThreads = (state: RootState) => state.threads;
const selectIsPreload = (state: RootState) => state.isPreload;

// In components
const authUser = useSelector(selectAuthUser);
const threads = useSelector(selectThreads);
```

### 3. Async Error Handling

```typescript
// Type-safe error handling
try {
  const result = await api.someMethod();
  // Handle success
} catch (error) {
  // Type assertion for error handling
  const errorMessage = (error as Error).message;
  alert(errorMessage);
}
```

## Migration Checklist

### Setup Phase
- [ ] Install TypeScript and type dependencies
- [ ] Create `tsconfig.json` configuration
- [ ] Update ESLint configuration for TypeScript
- [ ] Update build scripts to handle TypeScript files

### Type Definitions Phase
- [ ] Create type definitions for API responses
- [ ] Define interfaces for Redux state
- [ ] Create action type definitions
- [ ] Define component prop interfaces

### File Conversion Phase
- [ ] Convert utility functions (`utils/api.js` → `utils/api.ts`)
- [ ] Convert custom hooks (`hooks/useInput.js` → `hooks/useInput.ts`)
- [ ] Convert Redux store configuration
- [ ] Convert Redux actions and reducers
- [ ] Convert main App component
- [ ] Convert key components to demonstrate patterns

### Testing Phase
- [ ] Run TypeScript compiler to check for errors
- [ ] Run ESLint to ensure code quality
- [ ] Test build process
- [ ] Verify application functionality

### Documentation Phase
- [ ] Document migration process
- [ ] Create examples showing before/after conversions
- [ ] Document common patterns and best practices

## Benefits of TypeScript Migration

1. **Type Safety**: Catch errors at compile time
2. **Better IDE Support**: Enhanced autocomplete and refactoring
3. **Improved Documentation**: Types serve as living documentation
4. **Easier Refactoring**: Safe renaming and restructuring
5. **Better Developer Experience**: Clearer error messages
6. **Reduced Runtime Errors**: Many bugs caught during development

## Best Practices

1. **Start with Types**: Define your data structures first
2. **Gradual Migration**: Convert files incrementally
3. **Use Strict Mode**: Enable strict TypeScript checking
4. **Avoid `any`**: Use specific types whenever possible
5. **Consistent Naming**: Use consistent naming conventions for types
6. **Document Complex Types**: Add comments for complex type definitions

## Troubleshooting

### Common Issues

1. **Import Errors**: Update imports to use `.ts`/`.tsx` extensions where needed
2. **Type Errors**: Add proper type annotations
3. **ESLint Errors**: Update ESLint configuration for TypeScript
4. **Build Errors**: Check TypeScript configuration

### Solutions

- Use TypeScript's `--noEmit` flag to check types without building
- Use `// @ts-ignore` sparingly for temporary fixes
- Use type assertions `as Type` when you know the type
- Use `unknown` instead of `any` for better type safety

This migration guide provides a comprehensive approach to converting a React JavaScript application to TypeScript, ensuring type safety, better developer experience, and maintainable code.
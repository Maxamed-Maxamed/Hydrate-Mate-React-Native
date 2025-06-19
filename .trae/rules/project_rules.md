# 📂 Project Rules: Hydrate Mate – React Native

These rules define how AI tools or collaborators should behave while working within this project.

---

## 🧑‍💻 Project Context

**Hydrate Mate** is a mobile app built with React Native (Expo) that helps users stay hydrated through reminders, daily goal tracking, and hydration analytics. The app is clean, accessible, and optimized for quick interactions.

---

## 🛠️ Code Assistant Preferences

### 📋 Code Style

- **Language:** JavaScript + TypeScript  (React Native via Expo)
- **Styling:** Use ESLint + Prettier + Google Fonts + Expo 
- **Components:** Functional components only (no class-based)
- **State Management:** Zustand preferred; Redux acceptable
- **Comments:** Generate brief, purposeful comments for functions and components

---

## ⚛️ React Native Conventions

- Always use `SafeAreaView` for top-level layout
- Use `TouchableOpacity` with `activeOpacity` instead of `Button`
- Use `StyleSheet.create` for styling
- Avoid inline styles except for layout adjustments
- Use `expo-image`, `expo-font`, and other Expo best practices

---

## 🔔 Notification Rules

- Use `expo-notifications` for local reminders
- Default interval: every 2 hours
- Quiet hours: No notifications between 10 PM and 6 AM

---

## 🧪 Testing

- Use `jest` with `@testing-library/react-native`
- Prefer testing hooks, components, and utility functions

---

## 🧩 Folder Structure Rules

src/
│
├── components/ → Reusable UI components
├── screens/ → Screen-level views
├── assets/ → Icons, images, fonts
├── context/ → Zustand state logic
├── services/ → Notifications, storage
├── utils/ → Helpers and constants
└── navigation/ → Navigation stack configuration


---

## ✅ Commit Standards

- Use [Conventional Commits](https://www.conventionalcommits.org/)
- Example: `feat: add hydration ring component` or `fix: reminder interval bug`

---

## 🧑‍🎨 UX & UI Notes

- Stick to the blue (`#007BFF`) and white theme
- Always prioritize accessibility (high contrast, large tap areas)
- Consistent use of rounded buttons and cards
- Follow the mockups provided in `/docs` or `/designs`

---

## 🧠 Assistant Behavior

- Prefer concise output unless explanation is explicitly requested
- Use code blocks (` ```js `) when returning code
- Avoid suggesting non-Expo packages unless necessary
- Keep context of screens, UI flow, and hydration logic in memory

---

> These project rules ensure consistency, accessibility, and ease of development across all contributors and tooling assistants in Hydrate Mate.
---
# 🧠 Developer User Rules for Hydrate Mate
These rules define how developers should behave while working within this project.

---

## 🧑‍💻 Project Context

**Hydrate Mate** is a mobile app built with React Native (Expo) that helps users stay hydrated through reminders, daily goal tracking, and hydration analytics. The app is clean, accessible, and optimized for quick interactions.

---

## 🛠️ Code Assistant Preferences
### 📋 Code Style

- **Language:** JavaScript and TypeScript  (React Native via Expo)
- **Styling:** Use ESLint + Prettier (follows Airbnb style guide)
- **Components:** Functional components only (no class-based)
- **State Management:** Zustand preferred; Redux acceptable
- **Comments:** Generate brief, purposeful comments for functions and components

---

## ⚛️ React Native Conventions

- Always use `SafeAreaView` for top-level layout
- Use `TouchableOpacity` with `activeOpacity` instead of `Button`
- Use `StyleSheet.create` for styling
- Avoid inline styles except for layout adjustments
- Use `expo-image`, `expo-font`, and other Expo best practices
- Use `expo-notifications` for local reminders
- Default interval: every 2 hours
- Quiet hours: No notifications between 10 PM and 6 AM

---

## 🧪 Testing

- Use `jest` with `@testing-library/react-native`
- Prefer testing hooks, components, and utility functions

---

## 🧩 Folder Structure Rules

src/
│
├── components/ → Reusable UI components
├── screens/ → Screen-level views
├── assets/ → Icons, images, fonts
├── context/ → Zustand state logic
├── services/ → Notifications, storage
├── utils/ → Helpers and constants
└── navigation/ → Navigation stack configuration
└── docs/ → Project documentation
└── designs/ → Design files (Figma, Adobe XD)

---

## ✅ Commit Standards

- Use [Conventional Commits](docs/ → Project documentation
designs/ → Design files (Figma, Adobe XD)

---

## ✅ Commit Standards

- Use [Conventional Commits](URL_ADDRESS.conventionalcommits.org/)
- Example: `feat: add hydration ring component` or `fix: reminder interval bug`

---

## 🧑‍🎨 UX & UI Notes
- Stick to the blue (`#007BFF`) and white theme
- Always prioritize accessibility (high contrast, large tap areas)
- Consistent use of rounded buttons and cards
- Follow the mockups provided in `/docs` or `/designs`

---

## 🧠 Assistant Behavior

- Prefer concise output unless explanation is explicitly requested
- Use code blocks (` ```jsx or js or tsx or ts `) when returning code
- Avoid suggesting non-Expo packages unless necessary
- Keep context of screens, UI flow, and hydration logic in memory

---

> These project rules ensure consistency, accessibility, and ease of development across all contributors and tooling assistants in Hydrate Mate.
---
## 🧠 Developer User Rules for Hydrate Mate
These rules define how developers should behave while working within this project.

---

## 🧑‍💻 Project Context

**Hydrate Mate** is a mobile app built with React Native (Expo) that helps users stay hydrated through reminders, daily goal tracking, and hydration analytics. The app is clean, accessible, and optimized for quick interactions.


# 🛡️ Security and Code Quality Audit for Hydrate Mate

## Security Analysis

### Authentication & Authorization

- **Issue**: Basic authentication implementation lacks secure password requirements
  - **Impact**: Weak passwords increase risk of credential-stuffing attacks
  - **Recommendation**: Implement password strength validation during signup
  - **Tools**: Consider `zxcvbn` for password strength estimation

- **Issue**: Missing proper session management and token handling
  - **Impact**: Without proper session handling, users may be vulnerable to session hijacking
  - **Recommendation**: Implement secure token-based authentication with proper expiration
  - **Tools**: `expo-secure-store` for storing tokens securely on device

### Data Storage & Encryption

- **Issue**: Using AsyncStorage for potentially sensitive data
  - **Impact**: User credentials and hydration data might be accessible on compromised devices
  - **Recommendation**: Use `expo-secure-store` instead of AsyncStorage for sensitive data
  - **Tools**: `expo-secure-store` for secure local data storage

- **Issue**: No visible data encryption strategy for local data
  - **Impact**: If device is compromised, stored user data could be exposed
  - **Recommendation**: Encrypt sensitive data before storing locally
  - **Tools**: `expo-crypto` for encryption operations

### Input Validation & Sanitization

- **Issue**: Login and signup forms lack input validation
  - **Impact**: Risk of injection attacks and malformed data entering the system
  - **Recommendation**: Add validation for email, password, and name fields
  - **Tools**: Formik+Yup for comprehensive form validation

- **Issue**: External link handling in ExternalLink component doesn't validate URLs
  - **Impact**: Potential for malicious URL exploitation
  - **Recommendation**: Add URL validation before opening external links
  - **Tools**: URL validation regex or dedicated libraries

### API and External Integration Security

- **Issue**: Social login buttons appear in UI without implementation
  - **Impact**: Incomplete implementation may create confusion and security gaps
  - **Recommendation**: Either implement proper OAuth flows or remove buttons until implemented
  - **Tools**: Expo AuthSession for secure OAuth implementation

## Code Quality Analysis

### Component Architecture

- **Issue**: Inconsistent component structure across the app
  - **Impact**: Makes code harder to maintain as the application scales
  - **Recommendation**: Create a consistent pattern for component organization
  - **Example**: Split components into atomic, molecular, and organism patterns

- **Issue**: Duplicated styles and layout patterns
  - **Impact**: Style inconsistencies and maintenance challenges
  - **Recommendation**: Create a shared design system with reusable style components
  - **Tools**: Consider creating a theme context or adopting styled-components

### State Management

- **Issue**: Missing centralized state management
  - **Impact**: As app grows, managing state across components becomes unwieldy
  - **Recommendation**: Implement Zustand as mentioned in project rules
  - **Example**: Create stores for user authentication, hydration data, and settings

### Performance Optimization

- **Issue**: Non-optimized animations
  - **Impact**: May cause performance issues on lower-end devices
  - **Recommendation**: Use `useNativeDriver` consistently, memoize animation values
  - **Tools**: React Native Performance Monitor

- **Issue**: Missing performance optimization for list rendering
  - **Impact**: Potential performance issues when rendering long lists (e.g., hydration history)
  - **Recommendation**: Implement virtualized lists and proper memoization
  - **Tools**: FlatList with proper key implementation and item memoization

### Code Structure & Organization

- **Issue**: Folder structure doesn't follow project rules
  - **Impact**: Makes it harder to locate and organize code components
  - **Recommendation**: Reorganize according to specified folder structure in project rules
  - **Example**: Create `/screens`, `/services`, and other directories as specified

- **Issue**: Missing TypeScript strict mode in some files
  - **Impact**: Inconsistent type safety across the project
  - **Recommendation**: Enable strict mode and fix all type issues
  - **Tools**: TypeScript compiler with strict flag

## Security Best Practices Implementation Plan

1. **Immediate Actions**:
   - Add input validation to all forms
   - Replace AsyncStorage usage with expo-secure-store
   - Implement password strength requirements

2. **Short-term Improvements**:
   - Create proper authentication flow with secure token management
   - Add URL validation to ExternalLink component
   - Implement proper social login flows or remove the buttons

3. **Long-term Security Roadmap**:
   - Implement end-to-end encryption for sensitive data
   - Add biometric authentication option
   - Create a security policy and disclosure process

## Code Quality Improvement Plan

1. **Immediate Actions**:
   - Create centralized theme and styling system
   - Fix TypeScript strict mode issues
   - Optimize animations with useNativeDriver

2. **Short-term Improvements**:
   - Implement Zustand for state management
   - Reorganize folder structure according to project rules
   - Create reusable form components with built-in validation

3. **Long-term Code Quality Roadmap**:
   - Implement comprehensive testing suite
   - Create storybook documentation for components
   - Add automated linting and formatting in CI pipeline

---

## 🔐 Security Rules

### Authentication & Data Protection
- Use `expo-secure-store` for storing sensitive data (tokens, credentials)
- Implement password strength validation (minimum 8 chars, mixed case, numbers)
- Never store plaintext passwords, even temporarily
- Implement proper input validation for all user inputs (forms, search fields)
- Use JWT for authentication with appropriate expiration times

### Best Practices
- Validate all URLs before opening external links
- Sanitize all user inputs to prevent injection attacks
- Implement proper OAuth flows for social logins
- Use HTTPS for all network requests
- Implement biometric authentication option where appropriate
- Apply rate limiting for login attempts to prevent brute force attacks

### Data Encryption
- Encrypt sensitive data at rest using `expo-crypto`
- Use secure connections (HTTPS) for all API calls
- Implement proper token refresh mechanisms
- Follow the principle of least privilege for data access

### Code Generation Guidelines
- Never generate hardcoded credentials or API keys
- Always include proper error handling in security-critical sections
- Generate validation for all user inputs
- Include security-focused comments for sensitive operations

---
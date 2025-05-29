# 📂 Project Rules: Hydrate Mate – React Native

These rules define how AI tools or collaborators should behave while working within this project.

---

## 🧑‍💻 Project Context

**Hydrate Mate** is a mobile app built with React Native (Expo) that helps users stay hydrated through reminders, daily goal tracking, and hydration analytics. The app is clean, accessible, and optimized for quick interactions.

---

## 🛠️ Code Assistant Preferences

### 📋 Code Style

- **Language:** JavaScript (React Native via Expo)
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
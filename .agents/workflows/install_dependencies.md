---
description: Install required dependencies for authentication (expo-secure-store) and fix missing icons
---
1. Open terminal in the project root (`/Users/abhimanraj/APPNOVAHACKTHAON/frontend/pedestal`).
2. Run the following command to add expo-secure-store:
   ```
   npm install expo-secure-store
   ```
   // turbo
3. Verify that the installation succeeded without errors.
4. Update the import statements in `context/AuthContext.tsx` to correctly import SecureStore from the newly installed package.
5. Replace the missing `Google` icon import in `app/login.tsx` and `app/signup.tsx` with a compatible icon (e.g., `Globe` from `lucide-react-native`).
   ```tsx
   import { Globe } from 'lucide-react-native';
   ```
   Update the JSX where `<Google .../>` is used to `<Globe .../>`.
6. Run the development server to ensure the app builds:
   ```
   npm run dev
   ```
   // turbo
7. Test the login and signup flows on a device or emulator to confirm authentication works.

# My Web Project

import  from "/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  plugins: [
    ({
      // Support for legacy code that imports the  SDK with @/integrations, @/entities, etc.
      // can be removed if the code has been updated to use the new SDK imports from @/sdk
      legacySDKImports: process.env._LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
  ]
});

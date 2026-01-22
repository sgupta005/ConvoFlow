// vite.config.ts
import { defineConfig } from "file:///home/shivam2005/repos/next/ConvoFlow/node_modules/.pnpm/vite@5.4.21_@types+node@24.3.0_lightningcss@1.30.2/node_modules/vite/dist/node/index.js";
import { crx } from "file:///home/shivam2005/repos/next/ConvoFlow/node_modules/.pnpm/@crxjs+vite-plugin@2.2.1/node_modules/@crxjs/vite-plugin/dist/index.mjs";
import tailwindcss from "file:///home/shivam2005/repos/next/ConvoFlow/node_modules/.pnpm/@tailwindcss+vite@4.1.17_vite@5.4.21_@types+node@24.3.0_lightningcss@1.30.2_/node_modules/@tailwindcss/vite/dist/index.mjs";
import { resolve } from "path";

// manifest.json
var manifest_default = {
  name: "ConvoFlow - Meeting Transcription",
  description: "Real-time transcription for Google Meet and Zoom meetings",
  manifest_version: 3,
  version: "1.0.0",
  minimum_chrome_version: "116",
  action: {
    default_icon: "public/icons/icon.svg",
    default_popup: "src/popup/popup.html"
  },
  background: {
    service_worker: "src/background/service-worker.ts"
  },
  permissions: ["tabCapture", "offscreen", "activeTab"],
  host_permissions: ["https://meet.google.com/*", "https://*.zoom.us/*"],
  web_accessible_resources: [
    {
      resources: [
        "src/permission/permission.html",
        "src/offscreen/offscreen.html"
      ],
      matches: ["<all_urls>"]
    }
  ]
};

// vite.config.ts
var __vite_injected_original_dirname = "/home/shivam2005/repos/next/ConvoFlow/apps/extension";
var vite_config_default = defineConfig({
  plugins: [tailwindcss(), crx({ manifest: manifest_default })],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__vite_injected_original_dirname, "src/popup/popup.html"),
        offscreen: resolve(__vite_injected_original_dirname, "src/offscreen/offscreen.html"),
        permission: resolve(__vite_injected_original_dirname, "src/permission/permission.html")
      }
    }
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  worker: {
    format: "es"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL3NoaXZhbTIwMDUvcmVwb3MvbmV4dC9Db252b0Zsb3cvYXBwcy9leHRlbnNpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3NoaXZhbTIwMDUvcmVwb3MvbmV4dC9Db252b0Zsb3cvYXBwcy9leHRlbnNpb24vdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvc2hpdmFtMjAwNS9yZXBvcy9uZXh0L0NvbnZvRmxvdy9hcHBzL2V4dGVuc2lvbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgY3J4IH0gZnJvbSAnQGNyeGpzL3ZpdGUtcGx1Z2luJztcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi9tYW5pZmVzdC5qc29uJyB3aXRoIHsgdHlwZTogJ2pzb24nIH07XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFt0YWlsd2luZGNzcygpLCBjcngoeyBtYW5pZmVzdCB9KV0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgcG9wdXA6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3BvcHVwL3BvcHVwLmh0bWwnKSxcbiAgICAgICAgb2Zmc2NyZWVuOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9vZmZzY3JlZW4vb2Zmc2NyZWVuLmh0bWwnKSxcbiAgICAgICAgcGVybWlzc2lvbjogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvcGVybWlzc2lvbi9wZXJtaXNzaW9uLmh0bWwnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgd29ya2VyOiB7XG4gICAgZm9ybWF0OiAnZXMnLFxuICB9LFxufSk7XG4iLCAie1xuICBcIm5hbWVcIjogXCJDb252b0Zsb3cgLSBNZWV0aW5nIFRyYW5zY3JpcHRpb25cIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIlJlYWwtdGltZSB0cmFuc2NyaXB0aW9uIGZvciBHb29nbGUgTWVldCBhbmQgWm9vbSBtZWV0aW5nc1wiLFxuICBcIm1hbmlmZXN0X3ZlcnNpb25cIjogMyxcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjBcIixcbiAgXCJtaW5pbXVtX2Nocm9tZV92ZXJzaW9uXCI6IFwiMTE2XCIsXG4gIFwiYWN0aW9uXCI6IHtcbiAgICBcImRlZmF1bHRfaWNvblwiOiBcInB1YmxpYy9pY29ucy9pY29uLnN2Z1wiLFxuICAgIFwiZGVmYXVsdF9wb3B1cFwiOiBcInNyYy9wb3B1cC9wb3B1cC5odG1sXCJcbiAgfSxcbiAgXCJiYWNrZ3JvdW5kXCI6IHtcbiAgICBcInNlcnZpY2Vfd29ya2VyXCI6IFwic3JjL2JhY2tncm91bmQvc2VydmljZS13b3JrZXIudHNcIlxuICB9LFxuICBcInBlcm1pc3Npb25zXCI6IFtcInRhYkNhcHR1cmVcIiwgXCJvZmZzY3JlZW5cIiwgXCJhY3RpdmVUYWJcIl0sXG4gIFwiaG9zdF9wZXJtaXNzaW9uc1wiOiBbXCJodHRwczovL21lZXQuZ29vZ2xlLmNvbS8qXCIsIFwiaHR0cHM6Ly8qLnpvb20udXMvKlwiXSxcbiAgXCJ3ZWJfYWNjZXNzaWJsZV9yZXNvdXJjZXNcIjogW1xuICAgIHtcbiAgICAgIFwicmVzb3VyY2VzXCI6IFtcbiAgICAgICAgXCJzcmMvcGVybWlzc2lvbi9wZXJtaXNzaW9uLmh0bWxcIixcbiAgICAgICAgXCJzcmMvb2Zmc2NyZWVuL29mZnNjcmVlbi5odG1sXCJcbiAgICAgIF0sXG4gICAgICBcIm1hdGNoZXNcIjogW1wiPGFsbF91cmxzPlwiXVxuICAgIH1cbiAgXVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VSxTQUFTLG9CQUFvQjtBQUMzVyxTQUFTLFdBQVc7QUFDcEIsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyxlQUFlOzs7QUNIeEI7QUFBQSxFQUNFLE1BQVE7QUFBQSxFQUNSLGFBQWU7QUFBQSxFQUNmLGtCQUFvQjtBQUFBLEVBQ3BCLFNBQVc7QUFBQSxFQUNYLHdCQUEwQjtBQUFBLEVBQzFCLFFBQVU7QUFBQSxJQUNSLGNBQWdCO0FBQUEsSUFDaEIsZUFBaUI7QUFBQSxFQUNuQjtBQUFBLEVBQ0EsWUFBYztBQUFBLElBQ1osZ0JBQWtCO0FBQUEsRUFDcEI7QUFBQSxFQUNBLGFBQWUsQ0FBQyxjQUFjLGFBQWEsV0FBVztBQUFBLEVBQ3RELGtCQUFvQixDQUFDLDZCQUE2QixxQkFBcUI7QUFBQSxFQUN2RSwwQkFBNEI7QUFBQSxJQUMxQjtBQUFBLE1BQ0UsV0FBYTtBQUFBLFFBQ1g7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLE1BQ0EsU0FBVyxDQUFDLFlBQVk7QUFBQSxJQUMxQjtBQUFBLEVBQ0Y7QUFDRjs7O0FEeEJBLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxZQUFZLEdBQUcsSUFBSSxFQUFFLDJCQUFTLENBQUMsQ0FBQztBQUFBLEVBQzFDLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLE9BQU8sUUFBUSxrQ0FBVyxzQkFBc0I7QUFBQSxRQUNoRCxXQUFXLFFBQVEsa0NBQVcsOEJBQThCO0FBQUEsUUFDNUQsWUFBWSxRQUFRLGtDQUFXLGdDQUFnQztBQUFBLE1BQ2pFO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixRQUFRO0FBQUEsRUFDVjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

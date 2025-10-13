import { defineConfig, loadEnv, PluginOption } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProd = mode === 'production';

  const plugins: PluginOption[] = [
    react({
      // SWC options for React development
      plugins: [['@swc/plugin-react-refresh', { refresh: !isProd }]]
    })
  ].filter(Boolean);

  return {
    plugins,
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      cors: true,
      hmr: {
        overlay: false,
      },
    },
    build: {
      sourcemap: true,
      minify: 'esbuild',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': [
              '@radix-ui/react-accordion',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-context-menu',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-label',
              '@radix-ui/react-menubar',
              '@radix-ui/react-navigation-menu',
              '@radix-ui/react-popover',
              '@radix-ui/react-progress',
              '@radix-ui/react-radio-group',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slider',
              '@radix-ui/react-switch',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast'
            ],
            'chart-vendor': ['recharts'],
            'supabase-vendor': ['@supabase/supabase-js'],
            'utils-vendor': ['date-fns', 'zod', 'react-hook-form'],
          }
        }
      },
      chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      exclude: ['@supabase/supabase-js']
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    preview: {
      port: 5173,
      strictPort: true,
      cors: true
    }
  };
});
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      // Map @agor/core/* imports to source files for testing
      // This allows integration tests to import from @agor/core without build errors
      '@agor/core/types': resolve(__dirname, '../../packages/core/src/types/index.ts'),
      '@agor/core/db': resolve(__dirname, '../../packages/core/src/db/index.ts'),
      '@agor/core/git': resolve(__dirname, '../../packages/core/src/git/index.ts'),
      '@agor/core/api': resolve(__dirname, '../../packages/core/src/api/index.ts'),
      '@agor/core/claude': resolve(__dirname, '../../packages/core/src/claude/index.ts'),
      '@agor/core/config/browser': resolve(__dirname, '../../packages/core/src/config/browser.ts'),
      '@agor/core/config': resolve(__dirname, '../../packages/core/src/config/index.ts'),
      '@agor/core/tools/models': resolve(__dirname, '../../packages/core/src/tools/models.ts'),
      '@agor/core/tools/claude/models': resolve(
        __dirname,
        '../../packages/core/src/tools/claude/models.ts'
      ),
      '@agor/core/tools': resolve(__dirname, '../../packages/core/src/tools/index.ts'),
      '@agor/core/permissions': resolve(__dirname, '../../packages/core/src/permissions/index.ts'),
      '@agor/core/feathers': resolve(__dirname, '../../packages/core/src/feathers/index.ts'),
      '@agor/core/lib/feathers-validation': resolve(
        __dirname,
        '../../packages/core/src/lib/feathers-validation.ts'
      ),
      '@agor/core/templates/handlebars-helpers': resolve(
        __dirname,
        '../../packages/core/src/templates/handlebars-helpers.ts'
      ),
      '@agor/core/environment/variable-resolver': resolve(
        __dirname,
        '../../packages/core/src/environment/variable-resolver.ts'
      ),
      '@agor/core/utils/errors': resolve(__dirname, '../../packages/core/src/utils/errors.ts'),
      '@agor/core/utils/url': resolve(__dirname, '../../packages/core/src/utils/url.ts'),
      '@agor/core/utils/permission-mode-mapper': resolve(
        __dirname,
        '../../packages/core/src/utils/permission-mode-mapper.ts'
      ),
      '@agor/core/utils/cron': resolve(__dirname, '../../packages/core/src/utils/cron.ts'),
      '@agor/core/utils/context-window': resolve(
        __dirname,
        '../../packages/core/src/utils/context-window.ts'
      ),
      '@agor/core/utils/sdk-normalizer': resolve(
        __dirname,
        '../../packages/core/src/utils/sdk-normalizer.ts'
      ),
      '@agor/core/utils/path': resolve(__dirname, '../../packages/core/src/utils/path.ts'),
      '@agor/core/utils/logger': resolve(__dirname, '../../packages/core/src/utils/logger.ts'),
      '@agor/core/seed': resolve(__dirname, '../../packages/core/src/seed/index.ts'),
      '@agor/core/callbacks/child-completion-template': resolve(
        __dirname,
        '../../packages/core/src/callbacks/child-completion-template.ts'
      ),
      '@agor/core': resolve(__dirname, '../../packages/core/src/index.ts'),
    },
  },
});

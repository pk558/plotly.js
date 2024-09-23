import { build } from 'esbuild';

import esbuildConfig from './esbuild-config.js';

await build(esbuildConfig);

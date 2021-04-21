import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/index.ts',
  output: [{
    file: pkg.main,
    exports: 'named',
    format: 'cjs'
  }, {
    file: pkg.module,
    format: 'esm'
  }],
  plugins: [
    nodeResolve({ resolveOnly: [/^\./] }),
    typescript({ tsconfig: './tsconfig.build.json' })
  ]
};

import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'HyperswitchEmbeddable',
      sourcemap: true,
      globals: {
        react: 'React'
      }
    },
    {
      file: 'dist/index.min.js',
      format: 'umd',
      name: 'HyperswitchEmbeddable',
      plugins: [terser()],
      sourcemap: true,
      globals: {
        react: 'React'
      }
    }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      clean: true
    }),
    resolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      preventAssignment: true
    })
  ],
  external: [
    'react',
    'react-dom'
  ]
};

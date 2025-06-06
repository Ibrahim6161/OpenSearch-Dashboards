/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { pipeline } from 'stream';
import { promisify } from 'util';

// @ts-expect-error @types/gulp-babel is outdated and doesn't work for gulp-babel v8
import gulpBabel from 'gulp-babel';
import vfs from 'vinyl-fs';

import { Task, Build } from '../lib';

const asyncPipeline = promisify(pipeline);

type Preset = string | [string, Record<string, any>];

const transpileWithBabel = async (srcGlobs: string[], build: Build, presets: Preset[]) => {
  const buildRoot = build.resolvePath();

  await asyncPipeline(
    vfs.src(
      srcGlobs.concat([
        '!**/*.d.ts',
        '!packages/**',
        '!**/node_modules/**',
        '!**/bower_components/**',
        '!**/__tests__/**',
      ]),
      {
        cwd: buildRoot,
      }
    ),

    gulpBabel({
      babelrc: false,
      presets,
    }),

    vfs.dest(buildRoot)
  );
};

export const TranspileBabel: Task = {
  description: 'Transpiling sources with babel',

  async run(config, log, build) {
    // Transpile server code
    await transpileWithBabel(['**/*.{js,ts,tsx}', '!**/public/**'], build, [
      [
        require.resolve('@osd/babel-preset/node_preset'),
        {
          'babel-plugin-module-resolver': { root: [build.resolvePath()], cwd: build.resolvePath() },
        },
      ],
    ]);

    // Transpile client code
    // NOTE: For the client, as we have the optimizer, we are only
    // pre-transpiling the typescript based files
    await transpileWithBabel(['**/public/**/*.{ts,tsx}'], build, [
      require.resolve('@osd/babel-preset/webpack_preset'),
    ]);
  },
};

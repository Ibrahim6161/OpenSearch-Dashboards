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

import React from 'react';
import { EuiCodeBlock } from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { stringify } from '@osd/std';
import { DocViewRenderProps } from '../../doc_views/doc_views_types';

export function JsonCodeBlock({ hit }: DocViewRenderProps) {
  const label = i18n.translate('explore.discover.docViews.json.codeEditorAriaLabel', {
    defaultMessage: 'Read only JSON view of an opensearch document',
  });
  return (
    <EuiCodeBlock aria-label={label} language="json" isCopyable paddingSize="s" fontSize="s">
      {stringify(hit, null, 2)}
    </EuiCodeBlock>
  );
}

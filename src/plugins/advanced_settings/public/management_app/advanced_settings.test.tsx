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
import { Observable } from 'rxjs';
import { ReactWrapper } from 'enzyme';
import { mountWithI18nProvider } from 'test_utils/enzyme_helpers';
import dedent from 'dedent';
import {
  PublicUiSettingsParams,
  UserProvidedValues,
  UiSettingsType,
  IUiSettingsClient,
} from '../../../../core/public';
import { FieldSetting } from './types';
import { AdvancedSettingsComponent } from './advanced_settings';
import {
  notificationServiceMock,
  docLinksServiceMock,
  applicationServiceMock,
} from '../../../../core/public/mocks';
import { ComponentRegistry } from '../component_registry';
import { navigationPluginMock } from '../../../navigation/public/mocks';

jest.mock('./components/field', () => ({
  Field: () => {
    return 'field';
  },
}));

jest.mock('./components/call_outs', () => ({
  CallOuts: () => {
    return 'callOuts';
  },
}));

jest.mock('./components/search', () => ({
  Search: () => {
    return 'search';
  },
}));

function mockConfig() {
  const defaultConfig: Partial<FieldSetting> = {
    displayName: 'defaultName',
    requiresPageReload: false,
    isOverridden: false,
    isPermissionControlled: false,
    ariaName: 'ariaName',
    readOnly: false,
    isCustom: false,
    defVal: 'defVal',
    type: 'string' as UiSettingsType,
    category: ['category'],
  };

  const getAll = (): Readonly<Record<string, PublicUiSettingsParams & UserProvidedValues>> => {
    return {
      'test:array:setting': {
        ...defaultConfig,
        value: ['default_value'],
        name: 'Test array setting',
        description: 'Description for Test array setting',
        category: ['opensearch'],
      },
      'test:boolean:setting': {
        ...defaultConfig,
        value: true,
        name: 'Test boolean setting',
        description: 'Description for Test boolean setting',
        category: ['opensearch'],
      },
      'test:image:setting': {
        ...defaultConfig,
        value: null,
        name: 'Test image setting',
        description: 'Description for Test image setting',
        type: 'image',
      },
      'test:json:setting': {
        ...defaultConfig,
        value: '{"foo": "bar"}',
        name: 'Test json setting',
        description: 'Description for Test json setting',
        type: 'json',
      },
      'test:markdown:setting': {
        ...defaultConfig,
        value: '',
        name: 'Test markdown setting',
        description: 'Description for Test markdown setting',
        type: 'markdown',
      },
      'test:number:setting': {
        ...defaultConfig,
        value: 5,
        name: 'Test number setting',
        description: 'Description for Test number setting',
      },
      'test:select:setting': {
        ...defaultConfig,
        value: 'orange',
        name: 'Test select setting',
        description: 'Description for Test select setting',
        type: 'select',
        options: ['apple', 'orange', 'banana'],
      },
      'test:string:setting': {
        ...defaultConfig,
        ...{
          value: null,
          name: 'Test string setting',
          description: 'Description for Test string setting',
          type: 'string',
          isCustom: true,
        },
      },
      'test:readonlystring:setting': {
        ...defaultConfig,
        ...{
          value: null,
          name: 'Test readonly string setting',
          description: 'Description for Test readonly string setting',
          type: 'string',
          readOnly: true,
        },
      },
      'test:customstring:setting': {
        ...defaultConfig,
        ...{
          value: null,
          name: 'Test custom string setting',
          description: 'Description for Test custom string setting',
          type: 'string',
          isCustom: true,
        },
      },
      'test:isOverridden:string': {
        ...defaultConfig,
        isOverridden: true,
        value: 'foo',
        name: 'An overridden string',
        description: 'Description for overridden string',
        type: 'string',
      },
      'test:isOverridden:number': {
        ...defaultConfig,
        isOverridden: true,
        value: 1234,
        name: 'An overridden number',
        description: 'Description for overridden number',
        type: 'number',
      },
      'test:isOverridden:json': {
        ...defaultConfig,
        isOverridden: true,
        value: dedent`
          {
            "foo": "bar"
          }
        `,
        name: 'An overridden json',
        description: 'Description for overridden json',
        type: 'json',
      },
      'test:isOverridden:select': {
        ...defaultConfig,
        isOverridden: true,
        value: 'orange',
        name: 'Test overridden select setting',
        description: 'Description for overridden select setting',
        type: 'select',
        options: ['apple', 'orange', 'banana'],
      },
      'test:isPermissionControlled:string': {
        ...defaultConfig,
        isOverridden: true,
        value: 'foo',
        name: 'An permission controlled string',
        description: 'Description for permission controlled string',
        type: 'string',
      },
    };
  };

  const config: IUiSettingsClient = {
    set: (key: string, value: any) => Promise.resolve(true),
    remove: (key: string) => Promise.resolve(true),
    isCustom: (key: string) => false,
    isOverridden: (key: string) => Boolean(config.getAll()[key].isOverridden),
    overrideLocalDefault: (key: string, value: any) => {},
    getUpdate$: () =>
      new Observable<{
        key: string;
        newValue: any;
        oldValue: any;
      }>(),
    isDeclared: (key: string) => true,
    isDefault: (key: string) => true,

    getSaved$: () =>
      new Observable<{
        key: string;
        newValue: any;
        oldValue: any;
      }>(),
    getUpdateErrors$: () => new Observable<Error>(),
    get: (key: string, defaultOverride?: any): any => config.getAll()[key] || defaultOverride,
    get$: (key: string) => new Observable<any>(config.get(key)),
    getAll,
    getUserProvidedWithScope: ((key) =>
      Promise.resolve(config.getAll()[key])) as IUiSettingsClient['getUserProvidedWithScope'],
    getDefault: jest.fn() as IUiSettingsClient['getDefault'],
  };
  return {
    core: {
      uiSettings: config,
    },
    plugins: {
      advancedSettings: {
        componentRegistry: {
          get: () => {
            const foo: React.ComponentType = () => <div>Hello</div>;
            foo.displayName = 'foo_component';
            return foo;
          },
          componentType: {
            PAGE_TITLE_COMPONENT: 'page_title_component',
            PAGE_SUBTITLE_COMPONENT: 'page_subtitle_component',
          },
        },
      },
    },
  };
}

const navigationUI = navigationPluginMock.createStartContract().ui;
const applicationMock = applicationServiceMock.createStartContract();

describe('AdvancedSettings', () => {
  it('should render specific setting if given setting key', async () => {
    const component = mountWithI18nProvider(
      <AdvancedSettingsComponent
        queryText="test:string:setting"
        enableSaving={true}
        toasts={notificationServiceMock.createStartContract().toasts}
        dockLinks={docLinksServiceMock.createStartContract().links}
        uiSettings={mockConfig().core.uiSettings}
        componentRegistry={new ComponentRegistry().start}
        useUpdatedUX={false}
        navigationUI={navigationUI}
        application={applicationMock}
      />
    );

    expect(
      component
        .find('Field')
        .filterWhere(
          (n: ReactWrapper) =>
            (n.prop('setting') as Record<string, string>).name === 'test:string:setting'
        )
    ).toHaveLength(1);
  });

  it('should render read-only when saving is disabled', async () => {
    const component = mountWithI18nProvider(
      <AdvancedSettingsComponent
        queryText="test:string:setting"
        enableSaving={false}
        toasts={notificationServiceMock.createStartContract().toasts}
        dockLinks={docLinksServiceMock.createStartContract().links}
        uiSettings={mockConfig().core.uiSettings}
        componentRegistry={new ComponentRegistry().start}
        useUpdatedUX={false}
        navigationUI={navigationUI}
        application={applicationMock}
      />
    );

    expect(
      component
        .find('Field')
        .filterWhere(
          (n: ReactWrapper) =>
            (n.prop('setting') as Record<string, string>).name === 'test:string:setting'
        )
        .prop('enableSaving')
    ).toBe(false);
  });

  it('should render read-only when the setting is permission controlled', async () => {
    const component = mountWithI18nProvider(
      <AdvancedSettingsComponent
        queryText="test:isPermissionControlled:string"
        enableSaving={false}
        toasts={notificationServiceMock.createStartContract().toasts}
        dockLinks={docLinksServiceMock.createStartContract().links}
        uiSettings={mockConfig().core.uiSettings}
        componentRegistry={new ComponentRegistry().start}
        useUpdatedUX={false}
        navigationUI={navigationUI}
        application={applicationMock}
      />
    );

    expect(
      component
        .find('Field')
        .filterWhere(
          (n: ReactWrapper) =>
            (n.prop('setting') as Record<string, string>).name ===
            'test:isPermissionControlled:string'
        )
        .prop('enableSaving')
    ).toBe(false);
  });

  it('should render normally when use updated UX', async () => {
    const component = mountWithI18nProvider(
      <AdvancedSettingsComponent
        queryText="test:string:setting"
        enableSaving={false}
        toasts={notificationServiceMock.createStartContract().toasts}
        dockLinks={docLinksServiceMock.createStartContract().links}
        uiSettings={mockConfig().core.uiSettings}
        componentRegistry={new ComponentRegistry().start}
        useUpdatedUX={true}
        navigationUI={{ HeaderControl: () => null, TopNavMenu: () => null }}
        application={applicationServiceMock.createStartContract()}
      />
    );
    expect(component).toMatchSnapshot();
  });
});

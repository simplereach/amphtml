/**
 * Copyright 2016 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {getServicePromise} from './service';
import {timer} from './timer';

/**
 * List of extensions that, if they're included on the page, must be loaded
 * before the page should be shown to users.
 * Do not add an extension unless absolutely necessary.
 * @const {!Array<string>}
 */
const EXTENSIONS = [
  'amp-accordion',
  'amp-dynamic-css-classes'
];

/**
 * Maximum milliseconds to wait for all extensions to load before erroring.
 * @const
 */
const LOAD_TIMEOUT = 3000;


/**
 * Detects any extensions that are were included on the page that need to
 * delay unhiding the body (to avoid Flash of Unstyled Content), and returns
 * a promise that will resolve when they have loaded or reject after a timeout.
 * @param {!Window} win
 * @return {?Promise}
 */
export function waitForExtensions(win) {
  const extensions = includedExtensions(win);

  if (extensions.length) {
    return timer.timeoutPromise(LOAD_TIMEOUT, Promise.all(extensions));
  }
}

/**
 * Detects which, if any, render-delaying extensions are included on the page.
 * @param {!Window} win
 * @return {!Array<string>}
 */
export function includedExtensions(win) {
  const document = win.document;

  return EXTENSIONS.filter(extension => {
    return document.querySelector(`[custom-element="${extension}"]`);
  }).map(extension => {
    return getServicePromise(win, extension);
  });
}

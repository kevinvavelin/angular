/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import {NgLocalization, getPluralCategory} from '../i18n/localization';
import {invalidPipeArgumentError} from './invalid_pipe_argument_error';

const _INTERPOLATION_REGEXP: RegExp = /#/g;

/**
 * @ngModule CommonModule
 * @description
 *
 * Maps a value to a string that pluralizes the value according to locale rules.
 *
 * @usageNotes
 *
 * ### Example
 *
 * {@example common/pipes/ts/i18n_pipe.ts region='I18nPluralPipeComponent'}
 *
 * @publicApi
 */
@Injectable()
@Pipe({name: 'i18nPlural', pure: true})
export class I18nPluralPipe implements PipeTransform {
  constructor(private _localization: NgLocalization) {}

  /**
   * @param value the number to be formatted
   * @param pluralMap an object that mimics the ICU format, see
   * http://userguide.icu-project.org/formatparse/messages.
   * @param locale a `string` defining the locale to use (uses the current {@link LOCALE_ID} by
   * default).
   */
  transform(value: number, pluralMap: {[count: string]: string}, locale?: string): string {
    if (value == null) return '';

    if (typeof pluralMap !== 'object' || pluralMap === null) {
      throw invalidPipeArgumentError(I18nPluralPipe, pluralMap);
    }

    const key = getPluralCategory(value, Object.keys(pluralMap), this._localization, locale);

    return pluralMap[key].replace(_INTERPOLATION_REGEXP, value.toString());
  }
}

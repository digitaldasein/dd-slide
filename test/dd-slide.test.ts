// SPDX-FileCopyrightText: 2022 Digital Dasein <https://digital-dasein.gitlab.io/>
// SPDX-FileCopyrightText: 2022 Gerben Peeters <gerben@digitaldasein.org>
// SPDX-FileCopyrightText: 2022 Senne Van Baelen <senne@digitaldasein.org>
//
// SPDX-License-Identifier: MIT

import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { DdSlide } from '../src/DdSlide.js';
import '../src/dd-slide.js';

/*---------------------------------------------------------------------*/
/* Config                                                              */
/*---------------------------------------------------------------------*/

/*---------------------------------------------------------------------*/
/* Test                                                                */
/*---------------------------------------------------------------------*/

describe('DdSlide', () => {
  it('has a default slotcounter of zero', async () => {
    const el = await fixture<DdSlide>(html`<dd-slide></dd-slide>`);
    expect(el.slotCounter).to.equal(0);
  });

  it('grid rows from dim property', async () => {
    const el = await fixture<DdSlide>(html`
      <dd-slide dim="50 50; 50 50;"></dd-slide>
    `);
    expect(el.slotCounter).to.equal(4);

    // two grid rows
    const gridRows = el.shadowRoot!.querySelectorAll('.gridrow');
    expect(gridRows.length).to.equal(2);

    // two grid slots per row
    expect(gridRows[0].querySelectorAll('slot').length).to.equal(2);
  });

  it('no grid for single dim', async () => {
    const el = await fixture<DdSlide>(html` <dd-slide dim="100"></dd-slide> `);
    const gridRows = el.shadowRoot!.querySelectorAll('.gridrow');
    expect(gridRows.length).to.equal(0);
  });

  it('no auto-fillers', async () => {
    const el = await fixture<DdSlide>(html`
      <dd-slide no-fillers dim="50 50;"></dd-slide>
    `);
    const shadow = el.shadowRoot!.innerHTML;
    expect(shadow).to.not.include('replace me');
  });

  it('center content', async () => {
    await fixture<DdSlide>(html` <dd-slide center></dd-slide> `);
  });

  /*
  it('wrong dim', async () => {
    const el = await fixture<DdSlide>(html` <dd-slide dim></dd-slide> `);

    const shadow = el.shadowRoot!.innerHTML;
    expect(shadow).to.include('WARNING');
  });

  it('null dim check string', async () => {
    const el = await fixture<DdSlide>(html` <dd-slide></dd-slide> `);
    el.makeGridDim();
  });
  */

  it('passes the a11y audit', async () => {
    const el = await fixture<DdSlide>(html`<dd-slide></dd-slide>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});

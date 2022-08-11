// SPDX-FileCopyrightText: 2022 Digital Dasein <https://digital-dasein.gitlab.io/>
// SPDX-FileCopyrightText: 2022 Gerben Peeters <gerben@digitaldasein.org>
// SPDX-FileCopyrightText: 2022 Senne Van Baelen <senne@digitaldasein.org>
//
// SPDX-License-Identifier: MIT

import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

const DEFAULT_ATTRIBUTES = {
  dim: '',
  slotStyle: '',
  rowStyle: '',
  noFillers: false,
  noFooter: false,
};

/**
 * Main class for HTML web component **`dd-slide`**
 *
 * For **styling** this component, check out {@link DdSlide.styles | the styles
 * section}.
 *
 * <u>**Important note**</u>: all lit-component properties (interpreted here as
 * `other properties`) that are documented here have a **corresponding
 * HTML attribute**. The _non-attribute_ properties are consired private,
 * and are ingored in the documentation.
 *
 * @example
 * A simple example, with 2x2 grid (4 slots), each taking up 50% of the width,
 * with a border around each slot (cell)
 * ```html
 * <html>
 *   [...]
 *   <dd-slide dim="50 50; 50 50;" slot-style="border: 1px solid black;">
 *     <h2>A slide heading</h2>
 *     <div slot="1">
 *       <h4>A slot header.</h4>
 *     </div>
 *     <div slot="2">
 *         Slot 2 content
 *     </div>
 *     <div slot="3">...</div>
 *     <div slot="4">...</div>
 *   </dd-slide>
 *   [...]
 * </html>
 * ```
 */
export class DdSlide extends LitElement {
  /**
   * To style the `dd-slide` component, use the following **CSS host
   * variables** (including their default values), in combination with {@link
   * DdSlide.slotStyle} and {@link DdSlide.rowStyle}:
   *
   *
   * |  <div style="width:200px">CSS variable</div>   | <div style="width:200px">Default</div>   | Description |
   * |:-----------------------------------------------|:-----------------------------------------|:------------|
   * |**`--dd-color-heading`**     |`var(--dd-color-prim-dark)` | slide heading color, falls back to `black` if not defined                          |
   * |**`--dd-slide-ratio`**       |`calc(16/9)`                | slide ratio                                                                        |
   * |**`--dd-slide-width`**       |`1024px`                    | slide width (this, together with`--dd-slide-ratio` determines the slide height)    |
   * |**`--dd-font`**              |`24px/2 'Roboto', sans-serif`| font style |
   * |**`--dd-slide-gridspace-row`**    |`10px`                 | vertical spacing between grid rows (defined with `dim` attr) |
   * |**`--dd-slide-gridspace-col`**    |`10px`                 | horizontal spacing between grid rows (defined with `dim` attr) |
   *
   *
   * The variables can be set anywhere in your HTML context (e.g. in `:root`,
   * up until the `dd-slide` component itself).
   *
   *
   */
  static styles = css`
    /****************************************************************
     * Element styling
     ****************************************************************/

    :host {
      /* color pallette */
      --slide-color-heading: var(--dd-color-heading, var(--dd-color-prim-dark));
      --slide-color-link: var(--dd-color-link, rgba(65, 90, 72, 0.7));
      --slide-color-link-hover: var(--dd-color-link-hover, rgba(65, 90, 72, 1));

      --slide-ratio: var(--dd-slide-ratio, calc(16 / 9));
      --slide-width: var(--dd-slide-width, 1024px);
      --slide-height: calc(var(--slide-width) / var(--slide-ratio));
      --slide-font: var(--dd-font, 24px/2 'Roboto', sans-serif);

      --slide-pad-top: 0px;
      --slide-pad-top-content: 0px;
      --slide-pad-right: calc(25px + var(--slide-gridspace-col));
      --slide-pad-left: 25px;

      --slide-gridspace-row: var(--dd-slide-gridspace-row, 10px);
      --slide-gridspace-col: var(--dd-slide-gridspace-col, 10px);

      display: block;
      font: var(--slide-font);
    }

    ::slotted(h1),
    h1,
    ::slotted(h2),
    h2,
    ::slotted(h3),
    h3,
    ::slotted(h4),
    h4,
    ::slotted(h5),
    h5,
    ::slotted(h6),
    h6 {
      /* style headings in the template "<slot> dummy text </slot>" */
      color: var(--slide-color-heading);
      margin: 0;
      padding: 0 0 var(--slide-pad-top-content) 0;
    }

    :host(.slide) {
      padding: var(--slide-pad-top) var(--slide-pad-right) 0
        var(--slide-pad-left);

      position: relative;
      z-index: 0;
      overflow: hidden;
      box-sizing: border-box;
      width: var(--slide-width);
      max-width: 100%;
      height: var(--slide-height);
      background-color: white;
      margin: 0;
    }

    .gridrow {
      padding-bottom: var(--slide-gridspace-row);
    }

    /* https://github.com/WICG/webcomponents/issues/889 */
  `;

  /**
   * Add grid dimensions to your slide
   *
   * **Corresponding attribute:** `dim`
   *
   * **Default value:** `""` (empty string)
   *
   * @example
   * A 2 x 2 grid, 4 slots, each slot 50% width
   * ```html
   * <dd-slide dim="50 50; 50 50;">
   *   <div slot="1">
   *      <h2>Slot 1 header</h2>
   *    </div>
   *    <div slot="2">
   *      second slot content
   *    </div>
   *    <div slot="3">...</div>
   *    <div slot="4">...</div>
   * </dd-slide>
   * ```
   */
  @property({ type: String, attribute: 'dim' })
  dim = DEFAULT_ATTRIBUTES.dim;

  /**
   * Add custom style to slots
   *
   * **Corresponding attribute:** `slot-style`
   *
   * **Default value:** `""` (empty string)
   *
   * @example
   * Add border around each slot (cell)
   * ```html
   * <dd-slide slot-style="border: 1px solid black;">...</dd-slide>
   * ```
   */
  @property({ type: String, attribute: 'slot-style' })
  slotStyle = DEFAULT_ATTRIBUTES.slotStyle;

  /**
   * Alias for {@link DdSlide.slotStyle}
   *
   * **Corresponding attribute:** `cell-style`
   */
  @property({ type: String, attribute: 'cell-style' })
  cellStyle = DEFAULT_ATTRIBUTES.slotStyle;

  /**
   * Add custom style to each grid row
   *
   * **Corresponding attribute:** `row-style`
   *
   * **Default value:** `""` (empty string)
   *
   * @example
   * Add border around each row (spanning 3 equally-sized columns)
   * ```html
   * <dd-slide dim="33 33 33; 33 33 33;"
   *           row-style="border: 1px solid black;">
   *   ...
   * </dd-slide>
   * ```
   */
  @property({ type: String, attribute: 'row-style' })
  rowStyle = DEFAULT_ATTRIBUTES.rowStyle;

  /**
   * _Omit_ default fillers (as reminders), that is, for slide titles and/or slot
   * content, whenever no title or slot-content is provided.
   *
   * **Corresponding attribute:** `no-fillers`
   *
   * **Default value:** `false`
   */
  @property({ type: Boolean, attribute: 'no-fillers', reflect: true })
  noFillers = DEFAULT_ATTRIBUTES.noFillers;

  /**
   * _Omit_ slide footer on _this_ slide when auto-inserted by the
   * `dd-footer` element (using the associated `to-selector` attr).
   *
   * **Corresponding attribute:** `no-footer`
   *
   * **Default value:** `false`
   */
  @property({ type: Boolean, attribute: 'no-footer', reflect: true })
  noFooter = DEFAULT_ATTRIBUTES.noFooter;

  /** @ignore */
  @property({ type: Number })
  slotCounter = 0;

  /* Make grid from dimensions */
  private _makeGridDim() {
    let gridClasses = '';
    let gridContents = '';

    // if (typeof this.dim !== 'string') return ``;
    // find each grid row
    const dimArray = (this.dim as string)!.split(/[;]/);
    // if last row ended with ';', an empty item in the row needs to be popped
    if (dimArray.at(-1) === '') dimArray.pop();

    // check if it is not just an empty grid or a grid of 1 cell
    let noGrid = false;
    if (dimArray.length > 0) {
      if (dimArray.length === 1 && dimArray[0].split(' ').length === 1)
        noGrid = true;
    }
    if (!noGrid) {
      // find the amount of grid rows
      const gridRows = dimArray.length;

      // parse each row
      for (let i = 0; i < gridRows; i++) {
        const row = dimArray[i];

        // split by white space, throw out empty spaces " "
        const rowSplit = row.split(' ');
        const rowCells = rowSplit.filter(e => e);
        let rowCellContent = '';

        // add % to each number, to be used by grid template
        for (let el = 0; el < rowCells.length; el++) {
          rowCells[el] = `${rowCells[el]}%`;
          if (this.noFillers)
            rowCellContent += `
             <div style="${this.slotStyle} ${this.cellStyle}">
                <slot name="${this.slotCounter + 1}"> </slot>
            </div>`;
          else
            rowCellContent += `
             <div style="${this.slotStyle} ${this.cellStyle}">
                <slot name="${this.slotCounter + 1}">
                  <i>replace me with: <br>
                  <code>
                  &lt;div slot=${
                    this.slotCounter + 1
                  }&gt;your content&lt;/div&gt;
                  </code>
                  </i>
                </slot>
            </div>`;

          this.slotCounter++;
        }

        // join together again (grid template)
        const rowColumns = rowCells.join(' ');
        const gridClass = `
          .grid-${i + 1}{
            display: grid;
            grid-template-columns: ${rowColumns};
            grid-gap: var(--slide-gridspace-col);
          }
          `;
        // add the new grid class to the styles element
        gridClasses += gridClass;

        // adding the content fillers
        gridContents += `
        <div class="gridrow grid-${i + 1}" style="${this.rowStyle}">
          ${rowCellContent}
        </div>
        `;
      }
    }

    const resultStyle = `
      <style>
        ${gridClasses}
      </style>
    `;

    const resultHtml = `
        ${gridContents}
    `;

    return `
      ${resultStyle}
      ${resultHtml}
    `;
  }

  /* c8 ignore next 7 */
  /* ingore because of event DOM content load testing is tricky */
  private _checkFooter = () => {
    if (this.noFooter) {
      const footerElem = this.querySelector('dd-footer');
      (footerElem as HTMLElement).style.display = 'none';
    }
  };

  async firstUpdated() {
    //
  }

  connectedCallback() {
    super.connectedCallback();
    // on slide click (from list), check if url changes to full
    document.addEventListener('DOMContentLoaded', this._checkFooter);
  }

  disconnectedCallback() {
    window.removeEventListener('DOMContentLoaded', this._checkFooter);
    super.disconnectedCallback();
  }

  render() {
    this.classList.add('slide');
    this.title = 'Slide';

    if (this.dim) {
      if (!this.noFillers)
        return html`
          <slot>
            <h2>Put a title to remove me</h2>
          </slot>
          ${unsafeHTML(this._makeGridDim())}
          <slot name="postgrid"></slot>
        `;
      return html`
        <slot></slot>
        ${unsafeHTML(this._makeGridDim())}
        <slot name="postgrid"></slot>
      `;
    }

    /*
    if (this.dim === '')
      return html`
        <h2>[WARNING] Please make sure to add proper grid dimensions.</h2>
      `;
    */

    return html`
      <slot
        ><h2>
          No content added, or no grid layout defined. Default will be an empty
          page. Typing content in your slide will replace this message.
        </h2></slot
      >
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dd-slide': DdSlide;
  }
}

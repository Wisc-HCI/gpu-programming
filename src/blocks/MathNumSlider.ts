/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Number slider input field.
 * @author kozbial@google.com (Monica Kozbial)
 */

import * as Blockly from 'blockly/core';
import { string } from 'blockly/core/utils';

/**
 * A config object for defining a field slider.
 */
export type MathNumSliderConfig = Blockly.FieldNumberConfig;

/**
 * Options used to define a field slider from JSON.
 */
export interface MathNumSliderOptions extends MathNumSliderConfig {
  value?: string | number;
}

export type MathNumSliderValidator = Blockly.FieldNumberValidator;

/**
 * Slider field.
 */
export class MathNumSlider extends Blockly.FieldNumber {
  /**
   * Array holding info needed to unbind events.
   * Used for disposing.
   * Ex: [[node, name, func], [node, name, func]].
   */
  private boundEvents: Blockly.browserEvents.Data[] = [];

  /**
   * The HTML range input element.
   */
  private sliderInput: HTMLInputElement | null = null;

  private leftLabel: string | undefined;
  private rightLabel: string | undefined;

  /**
   * Class for an number slider field.
   *
   * @param value The initial value of the field. Should
   *    cast to a number. Defaults to 0.
   * @param min Minimum value.
   * @param max Maximum value.
   * @param precision Precision for value.
   * @param validator A function that is called to validate
   *    changes to the field's value. Takes in a number & returns a validated
   *    number, or null to abort the change.
   * @param config A map of options used to configure the field.
   *    See the [field creation documentation]{@link
   * https://developers.google.com/blockly/guides/create-custom-blocks/fields/built-in-fields/number#creation}
   *    for a list of properties this parameter supports.
   */
  constructor(
    value?: string | number,
    min?: string | number,
    max?: string | number,
    precision?: string | number,
    leftLabel?: string,
    rightLabel?: string,
    validator?: MathNumSliderValidator,
    config?: MathNumSliderConfig,
  ) {
    super(value, min, max, precision, validator, config);
    this.leftLabel = leftLabel;
    this.rightLabel = rightLabel;
  }

  public setLeftLabel(leftLabel: string) {
    this.leftLabel = leftLabel;
  }

  public setRightLabel(rightLabel: string) {
    this.rightLabel = rightLabel;
  }

  public setLabels(leftLabel: string, rightLabel: string) {
    this.leftLabel = leftLabel;
    this.rightLabel = rightLabel;
  }

  /**
   * Constructs a MathNumSlider from a JSON arg object.
   *
   * @param options A JSON object with options
   *     (value, min, max, precision).
   * @returns The new field instance.
   * @package
   * @nocollapse
   */
  static fromJson(options: MathNumSliderOptions): MathNumSlider {
    // `this` might be a subclass of MathNumSlider if that class doesn't override
    // the static fromJson method.
    return new this(
      options.value,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      options,
    );
  }

  /* eslint-disable @typescript-eslint/naming-convention */
  /**
   * Show the inline free-text editor on top of the text along with the slider
   * editor.
   *
   * @param e Optional mouse event that triggered the field to
   *     open, or undefined if triggered programmatically.
   * @param quietInput Quiet input (prevent focusing on the editor).
   */
  protected showEditor_(e?: Event, quietInput?: boolean) {
    // Always quiet the input for the super constructor, as we don't want to
    // focus on the text field, and we don't want to display the modal
    // editor on mobile devices.
    super.showEditor_(e, true);

    // Build the DOM.
    const editor = this.dropdownCreate_();

    Blockly.DropDownDiv.getContentDiv().appendChild(editor);
    const sourceBlock = this.getSourceBlock();
    if (sourceBlock instanceof Blockly.BlockSvg) {
      const primary = sourceBlock.getColour() || '';
      const tertiary = sourceBlock.getColourTertiary() || '';
      Blockly.DropDownDiv.setColour(primary, tertiary);
    }

    Blockly.DropDownDiv.showPositionedByField(
      this,
      this.dropdownDispose_.bind(this),
    );

    // Focus on the slider field, unless quietInput is passed.
    if (!quietInput) {
      (editor.firstChild as HTMLInputElement).focus({
        preventScroll: true,
      });
    }
  }

  /**
   * Updates the slider when the field rerenders.
   */
  protected render_() {
    super.render_();
    this.updateSlider_();
  }

  /**
   * Creates a row with a slider label and a readout to display the slider
   * value, appends it to the provided container, and returns the readout.
   *
   * @param name The display name of the slider.
   * @param container Where the row will be inserted.
   * @returns The readout, so that it can be updated.
   */
  private static createLabelInContainer(
    name: string,
    container: HTMLElement,
  ): HTMLSpanElement {
    const label: HTMLDivElement = document.createElement('div');
    const labelText: HTMLSpanElement = document.createElement('span');
    const readout: HTMLSpanElement = document.createElement('span');
    label.classList.add('mathNumSliderLabel');
    labelText.textContent = name;
    label.appendChild(labelText);
    label.appendChild(readout);
    container.appendChild(label);
    return readout;
  }
  /**
   * Creates the slider editor and add event listeners.
   *
   * @returns The newly created slider.
   */
  private dropdownCreate_(): HTMLElement {
    const wrapper = document.createElement('div') as HTMLElement;
    wrapper.className = 'mathNumSliderContainer';
    if (this.leftLabel) {
        const leftSliderLabel = MathNumSlider.createLabelInContainer(
            this.leftLabel,
            wrapper
        );
    }
    const sliderInput = document.createElement('input');
    sliderInput.setAttribute('type', 'range');
    sliderInput.setAttribute('min', `${this.min_}`);
    sliderInput.setAttribute('max', `${this.max_}`);
    sliderInput.setAttribute('step', `${this.precision_}`);
    sliderInput.setAttribute('value', `${this.getValue()}`);
    sliderInput.setAttribute('tabindex', '0');
    sliderInput.className = 'mathNumSlider';
    wrapper.appendChild(sliderInput);
    
    if (this.rightLabel) {
        const rightSliderLabel = MathNumSlider.createLabelInContainer(
            this.rightLabel,
            wrapper
        );
    }
    this.sliderInput = sliderInput;

    this.boundEvents.push(
      Blockly.browserEvents.conditionalBind(
        sliderInput,
        'input',
        this,
        this.onSliderChange_,
      ),
    );

    return wrapper;
  }

  /**
   * Disposes of events belonging to the slider editor.
   */
  private dropdownDispose_() {
    for (const event of this.boundEvents) {
      Blockly.browserEvents.unbind(event);
    }
    this.boundEvents.length = 0;
    this.sliderInput = null;
  }

  /**
   * Sets the text to match the slider's position.
   */
  private onSliderChange_() {
    // Intermediate value changes from user input are not confirmed until the
    // user closes the editor, and may be numerous. Inhibit reporting these as
    // normal block change events, and instead report them as special
    // intermediate changes that do not get recorded in undo history.
    const oldValue = this.value_;
    this.setEditorValue_(this.sliderInput?.value, false);
    if (this.getSourceBlock()) {
      Blockly.Events.fire(
        new (Blockly.Events.get(
          Blockly.Events.BLOCK_FIELD_INTERMEDIATE_CHANGE,
        ))(this.sourceBlock_, this.name || null, oldValue, this.value_),
      );
    }
    this.resizeEditor_();
  }

  /**
   * Updates the slider when the field rerenders.
   */
  private updateSlider_() {
    if (!this.sliderInput) {
      return;
    }
    this.sliderInput.setAttribute('value', `${this.getValue()}`);
  }
  /* eslint-enable @typescript-eslint/naming-convention */
}

Blockly.fieldRegistry.register('math_num_slider', MathNumSlider);

/**
 * CSS for slider field.
 */
Blockly.Css.register(`
.mathNumSliderContainer {
  align-items: center;
  display: flex;
  height: 32px;
  justify-content: center;
  width: auto;
}
.mathNumSliderLabel {
    color: white;
}
.mathNumSlider {
  -webkit-appearance: none;
  background: transparent; /* override white in chrome */
  margin: 4px;
  padding: 0;
  width: 100%;
}
.mathNumSlider:focus {
  outline: none;
}
/* Webkit */
.mathNumSlider::-webkit-slider-runnable-track {
  background: #ddd;
  border-radius: 5px;
  height: 10px;
}
.mathNumSlider::-webkit-slider-thumb {
  -webkit-appearance: none;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(255,255,255,.15);
  cursor: pointer;
  height: 24px;
  margin-top: -7px;
  width: 24px;
}
/* Firefox */
.mathNumSlider::-moz-range-track {
  background: #ddd;
  border-radius: 5px;
  height: 10px;
}
.mathNumSlider::-moz-range-thumb {
  background: #fff;
  border: none;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(255,255,255,.15);
  cursor: pointer;
  height: 24px;
  width: 24px;
}
.mathNumSlider::-moz-focus-outer {
  /* override the focus border style */
  border: 0;
}
/* IE */
.mathNumSlider::-ms-track {
  /* IE wont let the thumb overflow the track, so fake it */
  background: transparent;
  border-color: transparent;
  border-width: 15px 0;
  /* remove default tick marks */
  color: transparent;
  height: 10px;
  width: 100%;
  margin: -4px 0;
}
.mathNumSlider::-ms-fill-lower  {
  background: #ddd;
  border-radius: 5px;
}
.mathNumSlider::-ms-fill-upper  {
  background: #ddd;
  border-radius: 5px;
}
.mathNumSlider::-ms-thumb {
  background: #fff;
  border: none;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(255,255,255,.15);
  cursor: pointer;
  height: 24px;
  width: 24px;
}
`);

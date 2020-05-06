import videojs from 'video.js';
import {version as VERSION} from "../../package";
import {
  CHANGE_ASPECT_RATIO,
  CHANGE_PLAYBACK_RATE,
  CHANGE_PLAYER_QUALITY
} from '../event';

const ClickableComponent = videojs.getComponent('ClickableComponent');

// Default options for the plugin.
const defaults = {};


class SettingMenuSubItem extends ClickableComponent {

  constructor(player, options) {
    super(player, options);

    this.options = videojs.mergeOptions(defaults, options);
  }

  createEl() {
    const el = videojs.dom.createEl('div', {
      className: `vjs-setting-item`,
      innerHTML: this.options_['innerHTML']
    });

    return el;
  }

  handleClick(event) {
    // console.log('Clicked Sub Menu', event);
    this.player().trigger(this.options_['event'], this.options_['value']);
    switch (this.options_['event']) {
      case CHANGE_PLAYBACK_RATE:
        this.playbackRateDomMod(event, this.options_['value']);
        break;
      case CHANGE_PLAYER_QUALITY:
        this.qualityDomMod(event, this.options_['value']);
        break;
      case CHANGE_ASPECT_RATIO:
        this.aspectDomMod(event, this.options_['value']);
        break;
    }
  }

  playbackRateDomMod(data, value) {
    // update outer value
    document.getElementsByClassName('vjs-setting-speed')[0].innerHTML = (value === 1) ? 'Normal' : value + 'x';

    // update radio button
    document.getElementsByClassName('vjs-speed vjs-icon-circle-inner-circle')[0].classList.add('vjs-icon-circle-outline');
    document.getElementsByClassName('vjs-speed vjs-icon-circle-inner-circle')[0].classList.remove('vjs-icon-circle-inner-circle');
    if (data.target && data.target.children.length > 1) {
      data.target.children[1].classList.add('vjs-icon-circle-inner-circle');
      data.target.children[1].classList.remove('vjs-icon-circle-outline');
    } else {
      data.currentTarget.children[1].classList.add('vjs-icon-circle-inner-circle');
      data.currentTarget.children[1].classList.remove('vjs-icon-circle-outline');
    }

  }

  qualityDomMod(data, value) {
    // update outer value
    document.getElementsByClassName('vjs-setting-quality')[0].innerHTML = value.label === 'Auto' ? 'Auto': value.label + 'p';

    // update radio button
    document.getElementsByClassName('vjs-quality vjs-icon-circle-inner-circle')[0].classList.add('vjs-icon-circle-outline');
    document.getElementsByClassName('vjs-quality vjs-icon-circle-inner-circle')[0].classList.remove('vjs-icon-circle-inner-circle');

    if (data.target && data.target.children.length > 1) {
      data.target.children[1].classList.add('vjs-icon-circle-inner-circle');
      data.target.children[1].classList.remove('vjs-icon-circle-outline');
    } else {
      data.currentTarget.children[1].classList.add('vjs-icon-circle-inner-circle');
      data.currentTarget.children[1].classList.remove('vjs-icon-circle-outline');
    }
  }

  aspectDomMod(data, value) {
    // update outer value
    document.getElementsByClassName('vjs-setting-ratio')[0].innerHTML = value;

    // update radio button
    document.getElementsByClassName('vjs-ratio vjs-icon-circle-inner-circle')[0].classList.add('vjs-icon-circle-outline');
    document.getElementsByClassName('vjs-ratio vjs-icon-circle-inner-circle')[0].classList.remove('vjs-icon-circle-inner-circle');
    if (data.target && data.target.children.length > 1) {
      data.target.children[1].classList.add('vjs-icon-circle-inner-circle');
      data.target.children[1].classList.remove('vjs-icon-circle-outline');
    } else {
      data.currentTarget.children[1].classList.add('vjs-icon-circle-inner-circle');
      data.currentTarget.children[1].classList.remove('vjs-icon-circle-outline');
    }
  }

  /**
   * Dispose of the `menu-button` and all child components.
   */
  dispose() {
    super.dispose();
  }
}

// Define default values for the plugin's `state` object here.
SettingMenuSubItem.defaultState = {};

// Include the version number.
SettingMenuSubItem.VERSION = VERSION;

videojs.registerComponent('settingMenuSubItem', SettingMenuSubItem);
export default SettingMenuSubItem;

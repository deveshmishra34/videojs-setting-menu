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
      className: `vjs-setting-item `,
      innerHTML: this.options_['innerHTML']
    });

    return el;
  }

  handleClick(event) {
    this.player().trigger(this.options_['event'], {item: this.options_['value'], element: event} );
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

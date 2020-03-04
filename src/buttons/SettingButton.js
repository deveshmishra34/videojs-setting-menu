import videojs from 'video.js';
import {version as VERSION} from "../../package";
import {TOGGLE_MAIN_MENU} from "../event";

const Button = videojs.getComponent('Button');

// Default options for the plugin.
const defaults = {};

class SettingButton extends Button{
  constructor(player, options){
    super(player, options);

    this.options = videojs.mergeOptions(defaults, options);
  }

  buildCSSClass() {
    return `vjs-setting-menu-button vjs-icon-cog ${super.buildCSSClass()}`;
  }

  handleClick(event) {
    this.player_.trigger(TOGGLE_MAIN_MENU, {});
    if (event.target.classList.contains('vjs-setting-button-anim')) {
      event.target.classList.remove('vjs-setting-button-anim');
    } else {
      event.target.classList.add('vjs-setting-button-anim');
    }
  }
}


// Define default values for the plugin's `state` object here.
SettingButton.defaultState = {};

// Include the version number.
SettingButton.VERSION = VERSION;

videojs.registerComponent('settingButton', SettingButton);
export default SettingButton;

import videojs from 'video.js';
import {version as VERSION} from "../../package";
import SettingMenuSubItem from './SettingMenuSubItem';

const Menu = videojs.getComponent('Menu');
const Component = videojs.getComponent('Component');

// Default options for the plugin.
const defaults = {};


class SettingMenuItem extends Component {

  constructor(player, options) {
    super(player, options);

    this.options = videojs.mergeOptions(defaults, options);

    const subMenu = this.options_['options'] || [];
    this.update(subMenu);
    this.el()['classList'].add('vjs-hidden'); // initial all the menu will be hidden
  }

  createEl() {
    const el = videojs.dom.createEl('div', {
      className: `vjs-settings-menu-${this.options_['name']} `,
    });

    return el;
  }

  /**
   * Update the menu based on the current state of its items.
   */
  update(subMenu) {
    const menu = this.createMenu(subMenu);

    if (this['menu']) {
      this['menu'].dispose();
      this.removeChild(this['menu']);
    }

    this['menu'] = menu;
    this.addChild(menu);
  }

  createMenu(subMenu) {
    const menu = new Menu(this.player(), {contentElType: 'div'});
    if (subMenu && subMenu.length) {
      for (let i = 0; i < subMenu.length; i++) {
        const subItem = new SettingMenuSubItem(this.player(), subMenu[i]);
        menu.addChild(subItem);
      }
    }

    return menu;
  }

  /**
   * Dispose of the `menu-button` and all child components.
   */
  dispose() {
    super.dispose();
  }
}

// Define default values for the plugin's `state` object here.
SettingMenuItem.defaultState = {};

// Include the version number.
SettingMenuItem.VERSION = VERSION;

videojs.registerComponent('settingMenuItem', SettingMenuItem);
export default SettingMenuItem;

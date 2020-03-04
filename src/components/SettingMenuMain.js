import videojs from 'video.js';
import {version as VERSION} from "../../package";
import {
  CHANGE_PLAYBACK_RATE,
  CHANGE_PLAYER_QUALITY,
  GO_TO_MAIN_MENU,
  TOGGLE_MAIN_MENU,
  TOGGLE_QUALITY_MENU,
  TOGGLE_SPEED_MENU
} from '../event';
import SettingMenuItem from './SettingMenuItem';
const Menu = videojs.getComponent('Menu');
const Component = videojs.getComponent('Component');

// Default options for the plugin.
const defaults = {
  menu: ['speed', 'quality'],
  speed: [],
  sources: [],
  defaultQuality: 'default',
};


class SettingMenuMain extends Component {
  constructor(player, options) {
    super(player, options);

    this.options = videojs.mergeOptions(defaults, options);

    console.log('options: ', this.options, this.options_);
    // when player is ready setup basic option
    player.on('ready', () => {
      this.getSpeedList();
      this.getQualityList();
      this.update();
    });

    // in case url type is not mp4 quality will be return after loadedmetadata event
    player.on('loadedmetadata', () => {
      if (!this.options_['sources'] || !this.options_['sources'].length) {
        this.getQualityList();
        this.update();
      }
    });

    player.on('userinactive', () => {
      const eleDiv = document.getElementsByClassName('vjs-settings-menu-home')[0]; //.add('vjs-hidden');
      const eleSpeed = document.getElementsByClassName('vjs-settings-menu-speed')[0]; //.add('vjs-hidden');
      const eleQuality = document.getElementsByClassName('vjs-settings-menu-quality')[0]; //.add('vjs-hidden');

      eleDiv.classList.add('vjs-hidden');
      eleSpeed.classList.add('vjs-hidden');
      eleQuality.classList.add('vjs-hidden');
    });

    // Hide/Show Speed Menu
    player.on(TOGGLE_MAIN_MENU, () => {
      const eleDiv = document.getElementsByClassName('vjs-settings-menu-home')[0]; //.add('vjs-hidden');
      const eleSpeed = document.getElementsByClassName('vjs-settings-menu-speed')[0]; //.add('vjs-hidden');
      const eleQuality = document.getElementsByClassName('vjs-settings-menu-quality')[0]; //.add('vjs-hidden');
      // document.getElementsByClassName('vjs-settings-menu-home')[0].classList.add('vjs-hidden');
      // document.getElementsByClassName('vjs-settings-menu-speed')[0].classList.remove('vjs-hidden');
      if (eleDiv.classList.contains('vjs-hidden')) {
        eleDiv.classList.remove('vjs-hidden');
        eleSpeed.classList.add('vjs-hidden');
        eleQuality.classList.add('vjs-hidden');
      } else {
        eleDiv.classList.add('vjs-hidden');
        eleSpeed.classList.add('vjs-hidden');
        eleQuality.classList.add('vjs-hidden');
      }

    });

    player.on(TOGGLE_SPEED_MENU, () => {
      document.getElementsByClassName('vjs-settings-menu-home')[0].classList.add('vjs-hidden');
      document.getElementsByClassName('vjs-settings-menu-speed')[0].classList.remove('vjs-hidden');
    });

    // Hide/Show Quality Menu
    player.on(TOGGLE_QUALITY_MENU, () => {
      document.getElementsByClassName('vjs-settings-menu-home')[0].classList.add('vjs-hidden');
      document.getElementsByClassName('vjs-settings-menu-quality')[0].classList.remove('vjs-hidden');
    });

    // Go back to main menu, hide everything accept main menu
    player.on(GO_TO_MAIN_MENU, () => {
      document.getElementsByClassName('vjs-settings-menu-home')[0].classList.remove('vjs-hidden');
      document.getElementsByClassName('vjs-settings-menu-speed')[0].classList.add('vjs-hidden');
      document.getElementsByClassName('vjs-settings-menu-quality')[0].classList.add('vjs-hidden');
    });

    // on playbackRate change
    player.on(CHANGE_PLAYBACK_RATE, (data, item) => {
      this.player().playbackRate(item ? item : 1);
    });

    // on player quality change
    player.on(CHANGE_PLAYER_QUALITY, (data, item) => {
      const isPaused = this.player().paused();
      const currentTime = this.player().currentTime();
      this.player().src(item);
      // this.player_.play();

      this.player().ready(() => {
        // console.log('Player is ready toh play');
        if (!isPaused) {
          this.player().play();
        }
        this.player().currentTime(currentTime);
      });
    });
  }

  createEl() {
    const el = videojs.dom.createEl('div', {
      className: 'vjs-setting-menu-main'
    });

    return el;
  }

  /**
   * Update the menu based on the current state of its items.
   */
  update() {
    const menu = this.createMenu();

    if (this['menu']) {
      this['menu'].dispose();
      this.removeChild(this['menu']);
    }

    this['menu'] = menu;
    this.addChild(menu);

    // if (this.items && this.items.length <= this.hideThreshold_) {
    //   this.hide();
    // } else {
    //   this.show();
    // }
  }

  createMenu() {
    const menu = new Menu(this.player(), {contentElType: 'div'});

    const mainMenu = [
      {
        name: 'home',
        options: this.getHomeMenu()
      },
      {
        name: 'speed',
        options: this.getSpeedMenu()
      },
      {
        name: 'quality',
        options: this.getQualityMenu()
      }
    ];

    if (mainMenu && mainMenu.length) {
      for (let i = 0; i < mainMenu.length; i++) {
        menu.addChild(new SettingMenuItem(this.player_, mainMenu[i]));
      }
    }

    return menu;
  }

  getSpeedList() {
    const playBackRates = this.player()['options_'].playerOptions.playbackRates;
    const playBackRate = this.player().playbackRate();
    this.options_['speed'] = playBackRates;
    this.options_['currentPlaybackSpeed'] = playBackRate;
  }

  getQualityList() {
    let currentSources = this.player().currentSource();
    // const tech = this.player_.tech();
    // console.log(tech['hls']);
    if (currentSources && currentSources.type === 'application/x-mpegURL' && this.player()['hls']) {
      const representations = this.player()['hls'].representations();
      // console.log(representations);
      this.options_['sources'] = representations.map(el => {
        return {
          src: (el) ? el.id.substr(2, el.id.length - 1) : currentSources.src,
          label: el.height.toString() || '240',
          type: 'application/x-mpegURL'
        };
      });
    } else if (currentSources && currentSources.type === 'video/mp4') {
      const sources = [];
      this.player().currentSources().forEach(el => {
        if (el && el.label) {
          sources.push({
            src: el.src,
            label: el.label,
            type: el.label
          })
        }
      });
      // console.log('sources: ', sources, this.player().currentSources());
      this.options_['sources'] = sources;
    }

    if (this.options_['sources'] && this.options_['sources'].length) {
      this.options_['sources'] = this.options_['sources'].sort((a, b) => {
        return parseInt(b.label, 10) - parseInt(a.label, 10);
      });

      currentSources = (currentSources && currentSources.type === 'video/mp4') ? currentSources : this.options_['sources'][this.options_['sources'].length - 1];
      const defaultQuality = this.options_['defaultQuality']? this.options_['defaultQuality'].toString() : 'default';
      this.playDefaultQuality(this.options_['sources'], currentSources, defaultQuality);
    }
  }

  playDefaultQuality(sources, currentSources, quality) {
    let defaultSource = [];

    if (quality !== 'default' && currentSources && currentSources.label !== quality) {
      defaultSource = sources.filter((el) => (el.label === quality));
    } else {
      defaultSource = [sources[sources.length - 1]];
    }
    if (defaultSource.length) {
      this.player().trigger(CHANGE_PLAYER_QUALITY, defaultSource[0]);
    }
  }

  getQualityMenu() {
    const currentSource = this.player().currentSource();
    const sources = this.options_['sources'];

    // console.log('sources: ', sources, 'currentSrc: ', currentSource, this.options_, this.player_.getCache());
    const speedOptions = sources.map(el => {
      return {
        name: el.label + 'p',
        value: el,
        isSelected: el.label === currentSource['src'],
        className: (el.label === currentSource['label']) ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline',
        event: CHANGE_PLAYER_QUALITY,
        innerHTML: `<span class="vjs-setting-title">${el.label + 'p'}</span>
<span class="vjs-setting-icon vjs-quality ${(el.label === currentSource['label']) ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline'}"></span>`
      };
    });
    speedOptions.splice(0, 0, {
      name: 'Quality',
      value: 'Quality',
      isSelected: false,
      className: 'vjs-icon-play',
      event: GO_TO_MAIN_MENU,
      innerHTML: `<span style="transform: rotate(180deg);" class="vjs-setting-icon vjs-icon-play"></span>
                    <span class="vjs-setting-title">Quality</span>`
    });

    return speedOptions;
  }

  getSpeedMenu() {
    const playBackRates = this.options_['speed'];
    const playBackRate = this.options_['currentPlaybackSpeed'];

    if (!playBackRates || !playBackRate) {
      return;
    }

    const speedOptions = playBackRates.map(el => {
      return {
        name: el + 'x',
        value: el,
        isSelected: el === playBackRate,
        className: (el === playBackRate) ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline',
        event: CHANGE_PLAYBACK_RATE,
        innerHTML: `<span class="vjs-setting-title">${el === 1 ? 'Normal' : el + 'x'}</span>
<span class="vjs-setting-icon vjs-speed ${(el === playBackRate) ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline'}"></span>`
      };
    });
    speedOptions.splice(0, 0, {
      name: 'Speed',
      value: 'Speed',
      isSelected: false,
      className: 'vjs-icon-play',
      event: GO_TO_MAIN_MENU,
      innerHTML: `<span style="transform: rotate(180deg);" class="vjs-setting-icon vjs-icon-play"></span>
                    <span class="vjs-setting-title">Speed</span>`
    });

    return speedOptions;
  }

  getHomeMenu() {
    console.log('optionsL ', this.options);
    if (!this.options['menu'] || !this.options['menu'].length) {
      return;
    }

    const menu = [];
    const requiredMenu = this.options['menu'].map(el => el.toString().toLowerCase());

    if (requiredMenu.indexOf('share') > -1) {
      menu.push(      {
        name: 'Share',
        value: 0,
        event: TOGGLE_SPEED_MENU,
        innerHTML: `<span class="vjs-setting-title">Share</span>
<span class="vjs-setting-icon vjs-icon-share"></span>`
      },)
    }

    if (requiredMenu.indexOf('zoom') > -1) {
      menu.push(      {
        name: 'Zoom',
        class: 'vjs-icon-spinner',
        value: 0,
        event: TOGGLE_SPEED_MENU,
        innerHTML: `<span class="vjs-setting-title">Zoom</span>
<span class="vjs-setting-icon vjs-icon-spinner"></span>`
      })
    }

    if (requiredMenu.indexOf('related') > -1) {
      menu.push(      {
        name: 'Related',
        class: 'vjs-icon-chapters',
        value: 0,
        event: TOGGLE_SPEED_MENU,
        innerHTML: `<span class="vjs-setting-title text-left">Related</span>
<span class="vjs-setting-icon vjs-icon-chapters"></span>`
      })
    }

    if (requiredMenu.indexOf('speed') > -1) {
      menu.push({
        name: 'Speed',
        class: '',
        value: 'Normal',
        event: TOGGLE_SPEED_MENU,
        innerHTML: `<span class="vjs-setting-title text-left">Speed</span>
<span class="vjs-setting-icon vjs-setting-speed">Normal</span>`
      })
    }

    if (requiredMenu.indexOf('quality') > -1) {
      menu.push({
        name: 'Quality',
        class: '',
        value: '250p',
        event: TOGGLE_QUALITY_MENU,
        innerHTML: `<span class="vjs-setting-title text-left">Quality</span>
<span class="vjs-setting-icon vjs-setting-quality">${this.options_['defaultQuality'] || 'default'}</span>`
      })
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
SettingMenuMain.defaultState = {};

// Include the version number.
SettingMenuMain.VERSION = VERSION;

videojs.registerComponent('settingMenuMain', SettingMenuMain);
export default SettingMenuMain;

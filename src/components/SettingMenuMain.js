import videojs from 'video.js';
import {version as VERSION} from "../../package";
import {
  CHANGE_ASPECT_RATIO,
  CHANGE_PLAYBACK_RATE,
  CHANGE_PLAYER_QUALITY,
  GO_TO_MAIN_MENU,
  TOGGLE_MAIN_MENU,
  TOGGLE_QUALITY_MENU, TOGGLE_RATIO_MENU,
  TOGGLE_SPEED_MENU
} from '../event';
import SettingMenuItem from './SettingMenuItem';

const Menu = videojs.getComponent('Menu');
const Component = videojs.getComponent('Component');

// Default options for the plugin.
const defaults = {
  menu: ['speed', 'quality'],
  speed: [],
  aspectRatio: ['16:9', '4:3'],
  sources: [],
  defaultQuality: 'default',
};


class SettingMenuMain extends Component {
  constructor(player, options) {
    super(player, options);

    this.options = videojs.mergeOptions(defaults, options);
    // console.log('options: ', this.options, this.options_);
    // when player is ready setup basic option
    this.el()['classList'].add('vjs-hidden');
    player.on('ready', () => {
      console.log('ready');
      this.getSpeedList();
      this.getRatioList();
      this.getQualityList();
    });

    // in case url type is not mp4 quality will be return after loadedmetadata event
    player.on('loadedmetadata', () => {
      console.log('loadedmetadata');
      // console.log('cache: ', this.player.getCache());
      // if (!this.options_['sources'] || !this.options_['sources'].length) {
      this.getSpeedList();
      this.getRatioList();
      this.getQualityList();
      // }

      // setTimeout( () => {
      //   console.log('player', player.aspectRatio('4:3'));
      // }, 5000)
    });

    player.on('userinactive', () => {
      const eleMain = document.getElementsByClassName('vjs-setting-menu-main'); //.add('vjs-hidden');
      const eleDiv = document.getElementsByClassName('vjs-settings-menu-home'); //.add('vjs-hidden');
      const eleSpeed = document.getElementsByClassName('vjs-settings-menu-speed'); //.add('vjs-hidden');
      const eleQuality = document.getElementsByClassName('vjs-settings-menu-quality'); //.add('vjs-hidden');

      this.eleClassAction(eleMain, 'vjs-hidden');
      this.eleClassAction(eleDiv, 'vjs-hidden');
      this.eleClassAction(eleSpeed, 'vjs-hidden');
      this.eleClassAction(eleQuality, 'vjs-hidden');
    });

    // Hide/Show Speed Menu
    player.on(TOGGLE_MAIN_MENU, () => {
      const eleMain = document.getElementsByClassName('vjs-setting-menu-main'); //.add('vjs-hidden');
      const eleDiv = document.getElementsByClassName('vjs-settings-menu-home'); //.add('vjs-hidden');
      const eleSpeed = document.getElementsByClassName('vjs-settings-menu-speed'); //.add('vjs-hidden');
      const eleQuality = document.getElementsByClassName('vjs-settings-menu-quality'); //.add('vjs-hidden');
      // document.getElementsByClassName('vjs-settings-menu-home')[0].classList.add('vjs-hidden');
      // document.getElementsByClassName('vjs-settings-menu-speed')[0].classList.remove('vjs-hidden');
      if (eleDiv && eleDiv[0] && eleDiv[0].classList.contains('vjs-hidden')) {
        this.eleClassAction(eleMain, 'vjs-hidden', 'remove');
        this.eleClassAction(eleDiv, 'vjs-hidden', 'remove');
        this.eleClassAction(eleSpeed, 'vjs-hidden');
        this.eleClassAction(eleQuality, 'vjs-hidden');
      } else {
        this.eleClassAction(eleMain, 'vjs-hidden');
        this.eleClassAction(eleDiv, 'vjs-hidden');
        this.eleClassAction(eleSpeed, 'vjs-hidden');
        this.eleClassAction(eleQuality, 'vjs-hidden');
      }

    });

    player.on(TOGGLE_SPEED_MENU, () => {
      // document.getElementsByClassName('vjs-settings-menu-home')[0].classList.add('vjs-hidden');
      // document.getElementsByClassName('vjs-settings-menu-speed')[0].classList.remove('vjs-hidden');
      this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-home'), 'vjs-hidden');
      this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-speed'), 'vjs-hidden', 'remove');
    });

    player.on(TOGGLE_RATIO_MENU, () => {
      // document.getElementsByClassName('vjs-settings-menu-home')[0].classList.add('vjs-hidden');
      // document.getElementsByClassName('vjs-settings-menu-ratio')[0].classList.remove('vjs-hidden');
      this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-home'), 'vjs-hidden');
      this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-ratio'), 'vjs-hidden', 'remove');
    });

    // Hide/Show Quality Menu
    player.on(TOGGLE_QUALITY_MENU, () => {
      // document.getElementsByClassName('vjs-settings-menu-home')[0].classList.add('vjs-hidden');
      // document.getElementsByClassName('vjs-settings-menu-quality')[0].classList.remove('vjs-hidden');

      this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-home'), 'vjs-hidden');
      this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-quality'), 'vjs-hidden', 'remove');
    });

    // Go back to main menu, hide everything accept main menu
    player.on(GO_TO_MAIN_MENU, () => {
    //   document.getElementsByClassName('vjs-settings-menu-home')[0].classList.remove('vjs-hidden');
    //   document.getElementsByClassName('vjs-settings-menu-speed')[0].classList.add('vjs-hidden');
    //   document.getElementsByClassName('vjs-settings-menu-quality')[0].classList.add('vjs-hidden');
    //   document.getElementsByClassName('vjs-settings-menu-ratio')[0].classList.add('vjs-hidden');

      this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-home'), 'vjs-hidden', 'remove');
      this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-speed'), 'vjs-hidden');
      this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-quality'), 'vjs-hidden');
      this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-ratio'), 'vjs-hidden');
    });

    // on playbackRate change
    player.on(CHANGE_PLAYBACK_RATE, (data, item) => {
      this.player().playbackRate(item ? item : 1);
    });

    // on playbackRate change
    player.on(CHANGE_ASPECT_RATIO, (data, item) => {
      // console.log(CHANGE_ASPECT_RATIO, item);
      this.player().aspectRatio(item ? item : '16:9');
    });

    // on player quality change
    player.on(CHANGE_PLAYER_QUALITY, (data, item) => {
      const tech = this.player().tech().hls;
      if (item && (item.type === 'application/x-mpegURL' || item.type === 'application/dash+xml') && tech) {
        const masterDetails = tech.playlists.master;
        const representations = masterDetails.playlists;
        const playLists = representations.filter( (playlistInfo) => {
          if (playlistInfo && playlistInfo.resolvedUri === item.src) {
            return playlistInfo;
          }
        });
        if (playLists.length) {
          tech.playlists.media(playLists[0]);
          tech.selectPlaylist = function () {
            return playLists[0];
          }
        }
      } else {
        const isPaused = this.player().paused();
        const currentTime = this.player().currentTime();
        this.player().src(item);
        this.player().ready(() => {
          if (!isPaused) {
            this.player().play();
          }
          this.player().currentTime(currentTime);
        });
      }
    });
  }

  eleClassAction(ele, className, action = 'add') {
    if (ele && ele[0] && ele[0].classList && className && action === 'add') {
      ele[0].classList.add(className);
    } else if (ele && ele[0] && ele[0].classList && className && action === 'remove') {
      ele[0].classList.remove(className);
    }
  }

  createEl() {
    const el = videojs.dom.createEl('div', {
      className: 'vjs-setting-menu-main'
    });
    // el.classList.addClass('vjs-hidden');
    return el;
  }

  /**
   * Update the menu based on the current state of its items.
   */
  update() {
    console.log('update');
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
        name: 'ratio',
        options: this.getRatioMenu()
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

  getRatioList() {
    this.options_['aspectRatio'] = ['16:9', '4:3'];
    this.options_['currentRatio'] = '16:9';
  }

  getQualityList() {
    let currentSource = this.player().currentSource();
    const tech = this.player().tech().hls;
    if (currentSource && (currentSource.type === 'application/x-mpegURL' || currentSource.type === 'application/dash+xml') && tech && tech.playlists && tech.playlists.master) {
      const masterDetails = tech.playlists.master;
      const representations = masterDetails.playlists;
      if (this.options_['sources'] && (currentSource.src === representations[0].resolvedUri || representations[0].resolvedUri.includes(currentSource.src))) {
        return;
      }

      const sources = {};
      representations.forEach( (el) => {
        const height = el.attributes && el.attributes.RESOLUTION && el.attributes.RESOLUTION.height ? el.attributes.RESOLUTION.height.toString() : '240';
        if (!sources.hasOwnProperty(height)) {
          sources[height] = {
            src: (el.resolvedUri && (el.resolvedUri.split(':')[0].length === 5 || el.id.split(':')[0].length === 4)) ? el.resolvedUri : el.resolvedUri.substr(2, el.resolvedUri.length - 1), //: currentSources.src
            label: el.attributes && el.attributes.RESOLUTION && el.attributes.RESOLUTION.height ? el.attributes.RESOLUTION.height.toString() : '240',
            type: currentSource.type
          }
        }
      });
      this.options_['sources'] = Object.values(sources);

      this.options_['sources'].push({
        src: currentSource.src,
        label: 'Auto',
        type: currentSource.type
      });

      this.options_['defaultQuality'] = 'Auto';
      // console.log(this.options_['sources']);
    } else if (currentSource && currentSource.type === 'video/mp4') {
      // console.log('here');
      const currentSources = this.player().currentSources();
      const sources = [];
      const filterSources = this.options_['sources'] ? this.options_['sources'].filter( (el) => el.src === currentSources[0].src) : [];
      if (this.options_['sources'] && currentSource.src === currentSources[0].src && filterSources.length &&filterSources[0].src === currentSource.src) {
        return;
      }

      currentSources.forEach(el => {
        if (el && el.label) {
          sources.push({
            src: el.src,
            label: el.label,
            type: el.type
          })
        }
      });
      // console.log('sources: ', sources, this.player().currentSources());
      this.options_['sources'] = sources;
      this.options_['defaultQuality'] = currentSource.label ? currentSource.label + 'p' : 'Auto';
    }

    if (this.options_['sources'] && this.options_['sources'].length) {
      this.options_['sources'] = this.options_['sources'].sort((a, b) => {
        return parseInt(b.label, 10) - parseInt(a.label, 10);
      });

      // currentSources = (currentSources && currentSources.type === 'video/mp4') ? currentSources : this.options_['sources'][this.options_['sources'].length - 1];
      // const defaultQuality = this.options_['defaultQuality']? this.options_['defaultQuality'].toString() : 'default';
      // this.playDefaultQuality(this.options_['sources'], currentSources, defaultQuality);
    }

    this.update();
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
    const sources = this.options_['sources'] || [];

    // console.log('sources: ', sources, 'currentSrc: ', currentSource, this.options_, this.player_.getCache());
    const speedOptions = sources.map(el => {
      return {
        name: (el.label === 'Auto') ? 'Auto' : el.label + 'p',
        value: el,
        isSelected: (el.label === currentSource['src'] || el.label === 'Auto'),
        className: (el.label === currentSource['label'] || el.label === 'Auto') ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline',
        event: CHANGE_PLAYER_QUALITY,
        innerHTML: `<span class="vjs-setting-title">${(el.label === 'Auto') ? 'Auto' : el.label + 'p'}</span>
<span class="vjs-setting-icon vjs-quality ${(el.label === currentSource['label'] || el.label === 'Auto') ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline'}"></span>`
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

  getRatioMenu() {
    const aspectRatio = this.options_['aspectRatio'];
    const currentAspectRatio = this.options_['currentRatio'];

    if (!aspectRatio || !currentAspectRatio) {
      return;
    }

    const ratioOptions = aspectRatio.map(el => {
      return {
        name: el,
        value: el,
        isSelected: el === currentAspectRatio,
        className: (el === currentAspectRatio) ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline',
        event: CHANGE_ASPECT_RATIO,
        innerHTML: `<span class="vjs-setting-title">${el === 1 ? 'Normal' : el + 'x'}</span>
<span class="vjs-setting-icon vjs-ratio ${(el === currentAspectRatio) ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline'}"></span>`
      };
    });
    ratioOptions.splice(0, 0, {
      name: 'Ratio',
      value: 'Ratio',
      isSelected: false,
      className: 'vjs-icon-play',
      event: GO_TO_MAIN_MENU,
      innerHTML: `<span style="transform: rotate(180deg);" class="vjs-setting-icon vjs-icon-play"></span>
                    <span class="vjs-setting-title">Ratio</span>`
    });

    return ratioOptions;
  }

  getHomeMenu() {
    if (!this.options['menu'] || !this.options['menu'].length) {
      return;
    }

    const menu = [];
    const requiredMenu = this.options['menu'].map(el => el.toString().toLowerCase());

    if (requiredMenu.indexOf('share') > -1) {
      menu.push({
        name: 'Share',
        value: 0,
        event: TOGGLE_SPEED_MENU,
        innerHTML: `<span class="vjs-setting-title">Share</span>
<span class="vjs-setting-icon vjs-icon-share"></span>`
      },)
    }

    if (requiredMenu.indexOf('zoom') > -1) {
      menu.push({
        name: 'Zoom',
        class: 'vjs-icon-spinner',
        value: 0,
        event: TOGGLE_SPEED_MENU,
        innerHTML: `<span class="vjs-setting-title">Zoom</span>
<span class="vjs-setting-icon vjs-icon-spinner"></span>`
      })
    }

    if (requiredMenu.indexOf('related') > -1) {
      menu.push({
        name: 'Related',
        class: 'vjs-icon-chapters',
        value: 0,
        event: TOGGLE_SPEED_MENU,
        innerHTML: `<span class="vjs-setting-title text-left">Related</span>
<span class="vjs-setting-icon vjs-icon-chapters"></span>`
      })
    }

    if (requiredMenu.indexOf('aspect-ratio') > -1 && this.options_['aspectRatio'] && this.options_['aspectRatio'].length) {
      menu.push({
        name: 'Ratio',
        class: '',
        value: '16:9',
        event: TOGGLE_RATIO_MENU,
        innerHTML: `<span class="vjs-setting-title text-left">Ratio</span>
<span class="vjs-setting-icon vjs-setting-ratio">16:9</span>`
      })
    }

    if (requiredMenu.indexOf('speed') > -1 && this.options_['speed'] && this.options_['speed'].length) {
      menu.push({
        name: 'Speed',
        class: '',
        value: 'Normal',
        event: TOGGLE_SPEED_MENU,
        innerHTML: `<span class="vjs-setting-title text-left">Speed</span>
<span class="vjs-setting-icon vjs-setting-speed">Normal</span>`
      })
    }

    if (requiredMenu.indexOf('quality') > -1 && this.options_['sources'] && this.options_['sources'].length) {
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

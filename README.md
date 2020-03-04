# videojs-setting-menu

Adding a setting menu in videojs control bar

## Installation

```sh
npm install --save videojs-setting-menu
```

## Usage

To include videojs-setting-menu on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-setting-menu.min.js"></script>
<script>
  var player = videojs('my-video');

  player.settingMenu();
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-setting-menu via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-setting-menu');

var player = videojs('my-video');

player.settingMenu();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-setting-menu'], function(videojs) {
  var player = videojs('my-video');

  player.settingMenu();
});
```

## License

MIT. Copyright (c) Devesh mishra &lt;deveshmishra34@gmail.com&gt;


[videojs]: http://videojs.com/

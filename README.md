# JavaScript powered QML Engine

[![Join the chat at https://gitter.im/qmlweb/qmlweb](https://badges.gitter.im/qmlweb/qmlweb.svg)](https://gitter.im/qmlweb/qmlweb?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/qmlweb/qmlweb.svg?branch=master)](https://travis-ci.org/qmlweb/qmlweb)
[![codecov](https://codecov.io/gh/qmlweb/qmlweb/branch/master/graph/badge.svg)](https://codecov.io/gh/qmlweb/qmlweb)

[![npm](https://img.shields.io/npm/v/qmlweb.svg)](https://www.npmjs.com/package/qmlweb)
[![Bower](https://img.shields.io/bower/v/qmlweb.svg)](http://bower.io/search/?q=qmlweb)
[![GitHub tag](https://img.shields.io/github/tag/qmlweb/qmlweb.svg)](https://github.com/qmlweb/qmlweb/releases)

This project aims at bringing the power of QML to the web browser.
Here's a sample of how QML looks like:

```QML
import QtQuick 2.0

Rectangle {
   width: 500; height: 200
   color: "lightgray"

   Text {
       id: helloText
       text: "Hello world!"
       anchors.verticalCenter: parent.verticalCenter
       anchors.horizontalCenter: parent.horizontalCenter
       font.pointSize: 24; font.bold: true
   }
}
```

## How to use

### Add the library to your web page

Using one of the methods below, install the qmlweb JavaScript library:

- [npm](https://www.npmjs.com/package/qmlweb):

  ```sh
  npm install qmlweb
  ```

- [Bower](http://bower.io/search/?q=qmlweb):

  ```sh
  bower install qmlweb
  ```

- GitHub [releases](https://github.com/qmlweb/qmlweb/releases):

  ```sh
  tar -xzvf v0.0.4.tar.gz
  ```

- Manually using gulp (recommended if you cloned from git):

  ```sh
  npm install
  npm run build
  ```

Next, simply add `lib/qt.js` to the list of other JavaScript files in your app's
HTML file:

```HTML
<script type="text/javascript" src="/lib/qt.js"></script>
```

### Auto-load

You may then modify the `<body>` element to specify what QML file to load when
the page is opened.

```HTML
<!DOCTYPE html>
<html>
  <head>
    <title>QML Auto-load Example</title>
  </head>
  <body style="margin: 0;" data-qml="qml/main.qml">
    <script type="text/javascript" src="/lib/qt.js"></script>
  </body>
</html>
````

## How to use with Gulp

See [gulp-qmlweb](https://github.com/qmlweb/gulp-qmlweb) package.

## How to extend

When implementing new features, you may need to get away from QML and create
your own QML components from scratch, using directly the engine's API.

```Javascript
registerQmlType({
  module:   'MyModule',
  name:     'MyTypeName',
  baseClass: 'QtQuick.Item',
  versions: /^1(\.[0-3])?$/, // that regexp must match the version number for the import to work
  constructor: function(meta) {
    callSuper(this, meta);

    var self = this;

    // Managing properties
    createProperty("var", this, "data"); // creates a property 'data' of undefined type
    // creates a property 'name' of type string, with a default value
    createProperty("string", this, "name", { initialValue: 'default name' });

    // Signals
    this.somethingHappened = Signal(); // creates a signal somethingHappened

    this.somethingHappened.connect(this, function() {
      console.log('You may also connect to signals in JavaScript');
    });

    // Using the DOM
    function updateText() {
      var text = '';
      for (var i = 0 ; i < self.data.length ; ++i)
        text += '[' + data[i] + '] ';
      self.dom.textContent = text; // Updating the dom
      self.somethingHappened(); // triggers the 'somethingHappened' signal.
    }

    // Run updateText once, ensure it'll be executed whenever the 'data' property changes.
    updateText();
    this.onDataChanged.connect(this, updateText);
  }
});
```

And here's how you would use that component in a regular QML file:

```QML
import MyModule 1.3

MyTypeName {
  name: 'el nombre'
  data: [ 1, 2, 3 ]

  onSomethingHappened: console.log(data)
}
```

## History

1. [git://anongit.kde.org/qmlweb](https://quickgit.kde.org/?p=qmlweb.git), see [Webapps written in qml not far from reality anymore](http://akreuzkamp.de/2013/07/10/webapps-written-in-qml-not-far-from-reality-anymore),
2. [@JoshuaKolden/qmlweb](https://github.com/JoshuaKolden/qmlweb),
3. [@Plaristote/qmlweb](https://github.com/Plaristote/qmlweb),
4. [@labsin/qmlweb](https://github.com/labsin/qmlweb),
5. [@arnopaehler/qmlweb](https://github.com/arnopaehler/qmlweb).

var buttons = require('sdk/ui/button/action');
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var shown = false;

var button = buttons.ActionButton({
  id: "quran-link",
  label: "Search in Quran",
  icon: {
    "16": "./btn16.jpg",
    "32": "./btn32.jpg",
    "64": "./btn64.jpg",
  },
  onClick: handleClick
});

var panel = panels.Panel({
  contentURL: self.data.url("index.html"),
  contentScriptFile: self.data.url("index.js"),
  onShow: handleShow,
  onHide: handleHide,
  position: {
    top: 0,
    bottom: 0,
    right: 0
  },
  width: 300
});


function handleClick(state) {
  handleChange();
}

var contextMenu = require("sdk/context-menu");
var menuItem = contextMenu.Item({
  label: "Search in Quran",
  context: contextMenu.SelectionContext(),
  contentScript: 'self.on("click", function () {' +
                 '  var text = window.getSelection().toString();' +
                 '  self.postMessage(text);' +
                 '});',
  accessKey: "l",
  onMessage: function (selectionText) {
    panel.port.emit("search", selectionText);
    panel.show();
    
  }
});


var worker;

function handleChange() {
  if (!shown){
    panel.show({
      //position: button
    });
  } else{
    panel.hide();
  }
}

function handleHide() {
  shown = false;
}

function handleShow() {
  worker = tabs.activeTab.attach({
    contentScriptFile: self.data.url("insert.js")
  });
  shown = true;
}

panel.port.on("search", function (text) {
  panel.port.emit("search", text);
});

panel.port.on("add", function (text) {
  worker.port.emit("add", text);
});

panel.port.on("close", function () {
   panel.hide();
});

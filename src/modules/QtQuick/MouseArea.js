registerQmlType({
  module: "QtQuick",
  name: "MouseArea",
  versions: /.*/,
  baseClass: "Item",
  properties: {
    acceptedButtons: { type: "variant", initialValue: 1 }, // Qt.LeftButton
    enabled: { type: "bool", initialValue: true },
    hoverEnabled: "bool",
    mouseX: "real",
    mouseY: "real",
    pressed: "bool",
    containsMouse: "bool",
    pressedButtons: { type: "variant", initialValue: 0 },
    cursorShape: "enum" // Qt.ArrowCursor
  },
  signals: {
    clicked: [{ type: "variant", name: "mouse" }],
    entered: [],
    exited: [],
    positionChanged: [{ type: "variant", name: "mouse" }]
  }
}, class {
  constructor(meta) {
    callSuper(this, meta);
    var self = this;

    this.dom.style.pointerEvents = "all";

    // IE does not handle mouse clicks to transparent divs, so we have
    // to set a background color and make it invisible using opacity
    // as that doesn't affect the mouse handling.
    this.dom.style.backgroundColor = "white";
    this.dom.style.opacity = 0;

    function eventToMouse(e) {
        return {
            accepted: true,
            button: e.button == 0 ? Qt.LeftButton :
                    e.button == 1 ? Qt.MiddleButton :
                    e.button == 2 ? Qt.RightButton :
                    0,
            modifiers: (e.ctrlKey * Qt.CtrlModifier)
                    | (e.altKey * Qt.AltModifier)
                    | (e.shiftKey * Qt.ShiftModifier)
                    | (e.metaKey * Qt.MetaModifier),
            x: (e.offsetX || e.layerX),
            y: (e.offsetY || e.layerY)
        };
    }
    function handleClick(e) {
        var mouse = eventToMouse(e);

        if (self.enabled && self.acceptedButtons & mouse.button) {
            self.clicked(mouse);
        }
        // This decides whether to show the browser's context menu on right click or not
        return !(self.acceptedButtons & Qt.RightButton);
    }
    this.dom.onclick = handleClick;
    this.dom.oncontextmenu = handleClick;
    this.dom.onmousedown = function(e) {
        if (self.enabled) {
            var mouse = eventToMouse(e);
            self.mouseX = mouse.x;
            self.mouseY = mouse.y;
            self.pressed = true;
        }
        self.pressedButtons = mouse.button;
    }
    this.dom.onmouseup = function(e) {
        self.pressed = false;
        self.pressedButtons = 0;
    }
    this.dom.onmouseover = function(e) {
        self.containsMouse = true;
        self.entered();
    }
    this.dom.onmouseout = function(e) {
        self.containsMouse = false;
        self.exited();
    }
    this.dom.onmousemove = function(e) {
        if (self.enabled && (self.hoverEnabled || self.pressed)) {
            var mouse = eventToMouse(e);
            self.positionChanged(mouse);
            self.mouseX = mouse.x;
            self.mouseY = mouse.y;
        }
    }

    this.cursorShapeChanged.connect(function() {
      self.dom.style.cursor = this.$cursorShapeToCSS();
    });
  }
  $cursorShapeToCSS() {
    switch (this.cursorShape) {
      case Qt.ArrowCursor: return "default";
      case Qt.UpArrowCursor: return "n-resize";
      case Qt.CrossCursor: return "crosshair";
      case Qt.WaitCursor: return "wait";
      case Qt.IBeamCursor: return "text";
      case Qt.SizeVerCursor: return "ew-resize";
      case Qt.SizeHorCursor: return "ns-resize";
      case Qt.SizeBDiagCursor: return "nesw-resize";
      case Qt.SizeFDiagCursor: return "nwse-resize";
      case Qt.SizeAllCursor: return "all-scroll";
      case Qt.BlankCursor: return "none";
      case Qt.SplitVCursor: return "row-resize";
      case Qt.SplitHCursor: return "col-resize";
      case Qt.PointingHandCursor: return "pointer";
      case Qt.ForbiddenCursor: return "not-allowed";
      case Qt.WhatsThisCursor: return "help";
      case Qt.BusyCursor: return "progress";
      case Qt.OpenHandCursor: return "grab";
      case Qt.ClosedHandCursor: return "grabbing";
      case Qt.DragCopyCursor: return "copy";
      case Qt.DragMoveCursor: return "move";
      case Qt.DragLinkCursor: return "alias";
      //case Qt.BitmapCursor: return "auto";
      //case Qt.CustomCursor: return "auto";
    }
    return "auto";
  }
});

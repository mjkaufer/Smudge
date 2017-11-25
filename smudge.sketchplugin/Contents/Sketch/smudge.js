var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.runSmudge = runSmudge;

exports["default"] = function (context) {
    return runSmudge(context);
};

function runSmudge(context) {

    if (context.selection.length != 2) {
        context.document.showMessage("Please select two elements!");
        return;
    }
    var results = getInput();
    if (results == false) {
        // they cancelled
        return;
    }
    var layer = context.selection[0];
    var target = context.selection[1];

    var cloneAmount = 50;
    var scaleRatio = 0.99;
    var cloneAmount = results.count;
    var scaleRatio = results.ratio;
    var delta = 0.1;
    var currentScale = 1;

    var groupLayer = MSLayerGroup["new"]();
    var targetParent = target.parentGroup();

    if (layer && layer.isKindOfClass(MSShapeGroup)) {
        var count = cloneAmount;
        var path = layer.bezierPathWithTransforms();
        print(path.length());
        var step = path.length() / count;
        var addedShapes = [];

        for (var i = 0; i <= count; i++) {
            var distance = step * i;
            var leftPoint = path.pointOnPathAtLength(distance);
            var rightPoint = path.pointOnPathAtLength(distance + delta);

            if (i == count) {
                // we're at the end, so we can't do + delta
                rightPoint = leftPoint;
                leftPoint = path.pointOnPathAtLength(distance - delta);
            }

            var deltaX = rightPoint.x - leftPoint.x;
            var deltaY = rightPoint.y - leftPoint.y;

            var radian = Math.atan2(deltaY, deltaX);
            var degree = radian * 180 / Math.PI;
            degree = 270 - degree;

            var targetCopy = target.duplicate();

            targetCopy.multiplyBy(currentScale);
            targetCopy.setRotation(degree);

            targetCopy.frame().midX = leftPoint.x;
            targetCopy.frame().midY = leftPoint.y;

            currentScale *= scaleRatio;
            addedShapes.push(targetCopy);
        }

        for (var i = 0; i < addedShapes.length; i++) {
            // for some reason, stuff breaks if we try to move it to the layer as we add
            var shape = addedShapes[i];
            // [shape moveToLayer:groupLayer beforeLayer:targetParent]
            shape.moveToLayer_beforeLayer(groupLayer, targetParent);
        }

        targetParent.addLayers([groupLayer]);
        groupLayer.setName(target.name() + " Smudged");
        target.setIsVisible(false);
    }
}

function getInput() {
    var alert = COSAlertWindow["new"]();

    // alert.setIcon(NSImage.alloc().initByReferencingFile(plugin.urlForResourceNamed("rectangle@2x.png").path()));
    alert.setMessageText("Smudge Settings");

    alert.addButtonWithTitle("Smudge!");
    alert.addButtonWithTitle("Cancel");

    // amount, scale ratio, delta

    // Creating the view
    var viewWidth = 300;
    var viewHeight = 105;

    var elementWidth = 130;
    var elementHeight = 20;

    var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));

    var countLabel = NSTextView.alloc().initWithFrame(NSMakeRect(0, viewHeight - 60, elementWidth, elementHeight));
    var scaleLabel = NSTextView.alloc().initWithFrame(NSMakeRect(140, viewHeight - 60, elementWidth, elementHeight));

    countLabel.setString("Number of Shapes");
    countLabel.setDrawsBackground(false);
    countLabel.setEditable(false);
    // [countLabel setString:@"Number of Shapes"];
    // [countLabel setDrawsBackground:false];
    // [countLabel setEditable:false];

    scaleLabel.setString("Cumulative Shape Scale Multiplier");
    scaleLabel.setDrawsBackground(false);
    scaleLabel.setEditable(false);
    // [scaleLabel setString:@"Number of Shapes"];
    // [scaleLabel setDrawsBackground:false];
    // [scaleLabel setEditable:false];

    view.addSubview(countLabel);
    view.addSubview(scaleLabel);

    var countTextField = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 85, elementWidth, elementHeight));
    var scaleRatioTextField = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 85, elementWidth, elementHeight));

    // countTextField.setTitle("Number of copies");
    // scaleRatioTextField.setTitle("How much to scale by");

    // Adding the textfield 
    view.addSubview(countTextField);
    view.addSubview(scaleRatioTextField);

    // Default values for textfield
    countTextField.setStringValue('30');
    scaleRatioTextField.setStringValue('0.99');

    alert.addAccessoryView(view);

    // Create and configure your inputs here
    // ...


    var response = alert.runModal();

    if (response == 1001) {
        //cancel
        return false;
    } else {
        var results = {
            count: parseInt(countTextField.stringValue()),
            ratio: parseFloat(scaleRatioTextField.stringValue())
        };

        return results;
    }
}

/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['runSmudge'] = __skpm_run.bind(this, 'runSmudge');
that['onRun'] = __skpm_run.bind(this, 'default')

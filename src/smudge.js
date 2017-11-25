export function runSmudge(context) {

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

    var groupLayer = MSLayerGroup.new();
    var targetParent = target.parentGroup();

    if(layer && layer.isKindOfClass(MSShapeGroup)) {
        var count = cloneAmount;
        var path = layer.bezierPathWithTransforms();
        print(path.length());
        var step = path.length()/count;
        var addedShapes = [];
        
        for(var i=0;i<=count;i++) {
            var distance = step*i;
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
    var alert = COSAlertWindow.new();

    // alert.setIcon(NSImage.alloc().initByReferencingFile(plugin.urlForResourceNamed("rectangle@2x.png").path()));
    alert.setMessageText("Smudge Settings")

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
            ratio: parseFloat(scaleRatioTextField.stringValue()),
        };

        return results;
    }
}

export default function(context) {
    return runSmudge(context);
}
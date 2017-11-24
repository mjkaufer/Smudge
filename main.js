if (context.selection.length != 2) {
    return;
}

var layer = context.selection[0];
var target = context.selection[1];
print(target.Rotate);

var cloneAmount = 50;
var scaleRatio = 0.99;
var delta = 0.1;
var currentScale = 1;

if(layer && layer.isKindOfClass(MSShapeGroup)) {
    var count = cloneAmount;
    var path = layer.bezierPathWithTransforms();
    print(path.length());
    var step = path.length()/count;

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
        print(degree);

        var targetCopy = target.duplicate();
        targetCopy.multiplyBy(currentScale);

        targetCopy.frame().midX = leftPoint.x;
        targetCopy.frame().midY = leftPoint.y;
        targetCopy.setRotation(degree);

        context.document.currentPage().addLayers([targetCopy]);

        currentScale *= scaleRatio;

    }
}
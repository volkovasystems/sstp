var fs = require("fs"),
    DOMParser = require("xmldom").DOMParser,
    XMLSerializer = require("xmldom").XMLSerializer;

var svgn = "http://www.w3.org/2000/svg";

function convertRect(rects, context) {
    var len = rects.length,
        x, y, w, h, pathObj, node;
    if (len < 1) {
        return;
    }

    for (var n = 0; n < len; n++) {
        node = rects.item(n);
        x = +node.getAttribute("x");
        y = +node.getAttribute("y");
        w = +node.getAttribute("width");
        h = +node.getAttribute("height");
        pathObj = context.createElementNS(svgn, "path");
        pathObj.setAttribute("d", "M " + x + " " + y
                                + " L " + (x + w) + " " + y
                                + " L " + (x + w) + " " + (y + h)
                                + " L " + x + " " + (y + h)
                                + " Z");
        pathObj.setAttribute("fill", "#000");
        node.parentNode.insertBefore(pathObj, node);
    }
    while(rects.length > 0) {
        rects.item(0).parentNode.removeChild(rects.item(0));
    }
}

function convertCircle(circles, context) {
    var len = circles.length,
        cx, cy, r, pathObj, node;
    if (len < 1) {
        return;
    }

    for (var n = 0; n < len; n++) {
        node = circles.item(n);
        cx = +node.getAttribute("cx");
        cy = +node.getAttribute("cy");
        r = +node.getAttribute("r");
        pathObj = context.createElementNS(svgn, "path");
        pathObj.setAttribute("d", "M " + (cx - r) + " " + cy + " A " + r + " " + r + " 0 1 0 " + (cx + r) + " " + cy + " A " + r + " " + r + " 0 1 0 " + (cx - r) + " " + cy + " Z");
        pathObj.setAttribute("fill", "#000");
        node.parentNode.insertBefore(pathObj, node);
    }
    while(circles.length > 0) {
        circles.item(0).parentNode.removeChild(circles.item(0));
    }
}

function convertEllipse(ellipses, context) {
    var len = ellipses.length,
        cx, cy, rx, ry, pathObj, node;
    if (len < 1) {
        return;
    }

    for (var n = 0; n < len; n++) {
        node = ellipses.item(n);
        cx = +node.getAttribute("cx");
        cy = +node.getAttribute("cy");
        rx = +node.getAttribute("rx");
        ry = +node.getAttribute("ry");
        pathObj = context.createElementNS(svgn, "path");
        pathObj.setAttribute("d", "M " + (cx - rx) + " " + cy
                                    + " C " + (cx - rx) + " " + (cy - ry) + " " + (cx) + " " + (cy - ry) + " " + cx + " " + (cy - ry)
                                    + " C " + (cx + rx) + " " + (cy - ry) + " " + (cx + rx) + " " + cy + " " + (cx + rx) + " " + cy
                                    + " C " + (cx + rx) + " " + (cy + ry) + " " + (cx) + " " + (cy + ry) + " " + cx + " " + (cy + ry)
                                    + " C " + (cx - rx) + " " + (cy + ry) + " " + (cx - rx) + " " + (cy) + " " + (cx - rx) + " " + cy
                                    + " Z");
        pathObj.setAttribute("fill", "#000");
        node.parentNode.insertBefore(pathObj, node);
    }
    while(ellipses.length > 0) {
        ellipses.item(0).parentNode.removeChild(ellipses.item(0));
    }
}

function convertPolygon(polygons, context) {
    var len = polygons.length,
        points, pathObj, data, node;
    if (len < 1) {
        return;
    }

    for (var n = 0; n < len; n++) {
        node = polygons.item(n);
        points = node.getAttribute("points").split(/\s|,/);
        data = "M " + points[0] + " " + points[1];
        points = points.slice(2);
        for (var i = 0, size = points.length - 2; i < size; i += 2) {
            data += " L " + points[i] + " " + points[i + 1];
        }
        pathObj = context.createElementNS(svgn, "path");
        pathObj.setAttribute("d", data + " Z");
        pathObj.setAttribute("fill", "#000");
        node.parentNode.insertBefore(pathObj, node);
    }
    while(polygons.length > 0) {
        polygons.item(0).parentNode.removeChild(polygons.item(0));
    }
}

function mergePath(parent) {
    var paths = parent.getElementsByTagName("path"),
        len = paths.length,
        d = "";
    if (len < 1) {
        return;
    }

    d = paths.item(0).getAttribute("d");

    for (var n = 1; n < len; n++) {
        d += " " + paths.item(n).getAttribute("d");
    }
    while(paths.length > 1) {
        paths.item(1).parentNode.removeChild(paths.item(1));
    }
    paths.item(0).setAttribute("d", d);
}

exports.convertToPath = function(sourcefile, toFile) {
    var svgString, doc, svg, rects, circles, ellipses, polygons, xml;
    try {
        svgString = fs.readFileSync(sourcefile, "utf8");
    } catch(e) {
        throw sourcefile + " not found.";
    }
    if (!svgString) {
        return;
    }

    doc = new DOMParser().parseFromString(svgString, "text/xml");
    svg = doc.getElementsByTagName("svg")[0];

    rects = svg.getElementsByTagName("rect");
    circles = svg.getElementsByTagName("circle");
    ellipses = svg.getElementsByTagName("ellipse");
    polygons = svg.getElementsByTagName("polygon");

    convertRect(rects, doc);
    convertCircle(circles, doc);
    convertEllipse(ellipses, doc);
    convertPolygon(polygons, doc);
    mergePath(svg);

    xml = new XMLSerializer().serializeToString(doc);
    // console.log(xml);
    fs.writeFileSync(toFile, xml, "utf8");
};
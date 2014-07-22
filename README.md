## svgShapeToPath

Convert rect/circle/ellipse/polygon elements to path element.

### Install

	git clone git@github.com:mailzwj/sstp.git
	# or
	npm install sstp

### Use

First

	npm install

Then

	var convertToPath = require("./svg-shape-to-path").convertToPath;
	convertToPath("./shape-to-path.svg", "./converted.svg");

### Function

Convert rect/circle/ellipse/polygon elements to path element. Don't contain line and polyline element. if need, please use rect instead.

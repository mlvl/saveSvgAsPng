D3 to PNG
============

### Download PNG

To save a D3 SVG as a PNG, call ```svgConvert.downloadSvgAsPng(selectorName, fileName, scale)``` where

*selectorName* is the ID of the element containing the D3 SVG, as well as the selector for CSS styling.*

*fileName* is the name you would like your PNG file to have.

*scale* is an optional parameter to increase or decrease your image's size. The default is 3.


### SVG to PNG URI

To get the PNG URI for the SVG, call ```svgConvert.svgToPngBytes(selectorName, callback, scale)``` where

*selectorName* is the same as above.

*callback* a function that will be called to return the URI bytes.

*scale* is the same as above.

### Download image URI as PNG

Call ```svgConvert.downloadUriAsPng(uri, fileName)```.

Quick addition for a project, this ideally will not be exposed in the future.


#### Notes

\* CSS selector namespacing was added because, for our usage, we have many visualizations with unique styles defined for elements like "line" and "axis". Simply rolling up all application styles and applying them to the PNG won't ensure the right CSS styles are applied.

Furthermore, if font-family and font-size are not explicitly defined, they will not be visable on the PNG, so the libarary checks to see if both are defined, and, if not, will define them for you as ```text { font-family: Helvetica, Arial, sans-serif;} ``` and ```text { font-size: 12px;} ```. If you define these attributes within the CSS namespace of your SVG, those definitions will be respected.

This project has been adapted from exupero's version [here](https://github.com/exupero/saveSvgAsPng).
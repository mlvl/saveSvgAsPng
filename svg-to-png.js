(function() {
  var out$ = typeof exports != 'undefined' && exports || this;
  out$.svgConvert = {};

  var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

  function inlineImages(callback) {
    var images = document.querySelectorAll('svg image');
    var left = images.length;
    if (left == 0) {
      callback();
    }
    for (var i = 0; i < images.length; i++) {
      (function(image) {
        if (image.getAttribute('xlink:href')) {
          var href = image.getAttribute('xlink:href').value;
          if (/^http/.test(href) && !(new RegExp('^' + window.location.host).test(href))) {
            throw new Error("Cannot render embedded images linking to external hosts.");
          }
        }
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.src = image.getAttribute('xlink:href');
        img.onload = function() {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          image.setAttribute('xlink:href', canvas.toDataURL('image/png'));
          left--;
          if (left == 0) {
            callback();
          }
        }
      })(images[i]);
    }
  }

  function styles(dom, selectorName) {
    var used = "";
    var re_id = new RegExp("#"+selectorName, "g");
    var re_class = new RegExp("."+selectorName, "g");
    var sheets = document.styleSheets;
    for (var i = 0; i < sheets.length; i++) {
      var rules = sheets[i].cssRules;
      for (var j = 0; j < rules.length; j++) {
        var rule = rules[j];
        if (rule.selectorText && typeof(rule.style) != "undefined") {
          if (rule.selectorText.indexOf(selectorName) > -1) {
            var st = rule.selectorText.replace(re_id, "").replace(re_class,"");
            used += st + " { " + rule.style.cssText + " }\n";
          }
        }
      }
    }
    // Add a font if none exists
    if (used.indexOf("font-family") === -1)
      used += "text { font-family: Helvetica, Arial, sans-serif;} ";
    if (used.indexOf("font-size") === -1) 
      used += "text { font-size: 12px;} ";

    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    s.innerHTML = used;
    var defs = document.createElement('defs');
    defs.appendChild(s);
    return defs;
  }

  function svgAsDataUri(el, selectorName, scaleFactor, cb) {
    scaleFactor = scaleFactor || 1;

    inlineImages(function() {
      var outer = document.createElement("div");
      var clone = el.cloneNode(true);
      var width = parseInt(clone.getAttribute("width"));
      var height = parseInt(clone.getAttribute("height"));

      var xmlns = "http://www.w3.org/2000/xmlns/";

      clone.setAttribute("version", "1.1");
      clone.setAttributeNS(xmlns, "xmlns", "http://www.w3.org/2000/svg");
      clone.setAttributeNS(xmlns, "xmlns:xlink", "http://www.w3.org/1999/xlink");
      clone.setAttribute("width", width * scaleFactor);
      clone.setAttribute("height", height * scaleFactor);
      clone.setAttribute("viewBox", "0 0 " + width + " " + height);
      outer.appendChild(clone);

      clone.insertBefore(styles(clone, selectorName), clone.firstChild);

      var svg = doctype + outer.innerHTML;
      var uri = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg)));
      if (cb) {
        cb(uri);
      }
    });
  }
  function getUri(selectorName, scaleFactor, callback) {
    var el = document.getElementById(selectorName);
    svgAsDataUri(el, selectorName, scaleFactor, function(uri) {
      callback(uri);
    });
  }
  function downloadPng(uri, fileName) {
    var image = new Image();
    image.src = uri;
    image.onload = function() {
      var canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      var context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);

      var a = document.createElement('a');
      a.download = fileName;
      a.href = canvas.toDataURL('image/png');
      document.body.appendChild(a);
      a.click();
    }
  }
  out$.svgConvert.svgToPngBytes = function(selectorName, callback, scale) {
    scale ? scaleFactor = scale : scaleFactor = 3;
    getUri(selectorName, scaleFactor, function(uri) {
      callback(uri);
    });    
  }
  out$.svgConvert.downloadSvgAsPng = function(selectorName, fileName, scale) {
    scale ? scaleFactor = scale : scaleFactor = 3;
    getUri(selectorName, scaleFactor, function(uri) {
      downloadPng(uri, fileName);
    });
  }
  out$.svgConvert.downloadUriAsPng = function(uri, fileName) {
    downloadPng(uri, fileName);
  };
})();
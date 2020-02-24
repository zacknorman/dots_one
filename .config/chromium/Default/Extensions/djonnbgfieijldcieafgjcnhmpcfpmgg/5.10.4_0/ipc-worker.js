/* Inter-process communication for PPE.
   Created by Daniel Vershinin
   2015-2016 (c) Polarr, Inc */

/* POMessage constants */

var MESSAGE_KEY_PARTIAL = "_i_partial";

/* Base-64 */

var Base64 = {};

(function(){
  "use strict";

  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // Use a lookup table to find the index.
  var lookup = new Uint8Array(256);
  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  Base64.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  Base64.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i+1)];
      encoded3 = lookup[base64.charCodeAt(i+2)];
      encoded4 = lookup[base64.charCodeAt(i+3)];

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})();

/*function base64ArrayBuffer(arrayBuffer)
{
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }
  
  return base64
}*/

/* Nested objects */

var NestedObjects = {

	get : function(obj, path) 
	{
  		var parsed = NestedObjects.parse(path);
  		return NestedObjects.getPathValue(parsed, obj);
	},

	set : function(obj, path, val) 
	{
		var parsed = NestedObjects.parse(path);
  		NestedObjects.setPathValue(parsed, val, obj);
	},

	parse : function(path) 
	{
		var str = (path || '').replace(/\[/g, '.[');
		var parts = str.match(/(\\\.|[^.]+?)+/g);
		var re = /\[(\d+)\]$/;
		var ret = [];
		var mArr = null;

		for (var i = 0, len = parts.length; i < len; i++) 
		{
			mArr = re.exec(parts[i]);
			ret.push(mArr ? { i: parseFloat(mArr[1]) } : { p: parts[i] });
		}

		return ret;
	},

	defined : function(val) 
	{
  		return !(!val && 'undefined' === typeof val);
  	},

  	getPathValue : function(parsed, obj) 
  	{
		var tmp = obj;
  		var res;

		for (var i = 0, l = parsed.length; i < l; i++) 
		{
			var part = parsed[i];
			if (tmp) 
			{
				if (NestedObjects.defined(part.p)) tmp = tmp[part.p];
				else if (NestedObjects.defined(part.i)) tmp = tmp[part.i];
				if (i == (l - 1)) res = tmp;
			} 
			else 
			{
				res = undefined;
			}
		}

  		return res;
	},

	setPathValue : function(parsed, val, obj) 
	{
		var tmp = obj;
		var i = 0;
		var l = parsed.length;
		var part;

		for (; i < l; i++) 
		{
			part = parsed[i];

			if (NestedObjects.defined(tmp) && i == (l - 1)) 
			{
				var x = NestedObjects.defined(part.p) ? part.p : part.i;
				tmp[x] = val;
			} 
			else if (NestedObjects.defined(tmp)) 
			{
				if (NestedObjects.defined(part.p) && tmp[part.p]) 
				{
					tmp = tmp[part.p];
				} 
				else if (NestedObjects.defined(part.i) && tmp[part.i]) 
				{
					tmp = tmp[part.i];
				} 
				else 
				{
					var next = parsed[i + 1];
					var x = NestedObjects.defined(part.p) ? part.p : part.i;
					var y = NestedObjects.defined(next.p) ? {} : [];
					tmp[x] = y;
					tmp = tmp[x];
				}
			} 
			else 
			{
				if (i == (l - 1)) tmp = val;
				else if (NestedObjects.defined(part.p)) tmp = {};
				else if (NestedObjects.defined(part.i)) tmp = [];
			}
		}
	}
};

//Extracting partials
encodePartials = function(message, path)
{
	if (typeof path === "undefined" ) path = "";

	function encodePartialsData(data, path)
	{
		for (var key in data)
		{
			if (data[key] && data[key].buffer instanceof ArrayBuffer && data[key].byteLength !== undefined)
			{
				data[key] = { data : Base64.encode(data[key]) }
				data[key]["type"] = MESSAGE_KEY_PARTIAL;
				continue;
			}

			if (typeof data[key] === "object")
			{
				encodePartialsData(data[key], path.length != 0 ? path + "." + key : key);
			}
		}
	}

	encodePartialsData(message, path);
}

decodePartials = function(message, path)
{
	if (typeof path === "undefined" ) path = "";

	function decodePartialsData(data, path)
	{
		for (var key in data)
		{
			if (data[key] != null && typeof data[key] === "object")
			{
				if (data[key]["type"] === MESSAGE_KEY_PARTIAL)
				{
					data[key] = Base64.decode(data[key]["data"]);
					continue;
				}
				else
				{
					decodePartialsData(data[key], path.length != 0 ? path + "." + key : key);
				}
			}
		}
	}

	decodePartialsData(message, path);
}

onmessage = function (e) {
	switch (e.data.method) {
		case 'encodePartials':
			encodePartials(e.data.message, e.data.path)
			break;

		case 'decodePartials':
      decodePartials(e.data.message, e.data.path)
			break;
	}

	postMessage({ message: e.data.message, identifier: e.data.identifier })
}



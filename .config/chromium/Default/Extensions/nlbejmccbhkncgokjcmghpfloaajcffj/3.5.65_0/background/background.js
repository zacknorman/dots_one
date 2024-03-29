(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
/*
 Copyright 2013-2014 Daniel Wirtz <dcode@dcode.io>

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * @license bytebuffer.js (c) 2015 Daniel Wirtz <dcode@dcode.io>
 * Backing buffer: ArrayBuffer, Accessor: Uint8Array
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/bytebuffer.js for details
 */
(function(global, factory) {

    /* AMD */ if (typeof define === 'function' && define["amd"])
        define(["long"], factory);
    /* CommonJS */ else if (typeof require === 'function' && typeof module === "object" && module && module["exports"])
        module['exports'] = (function() {
            var Long; try { Long = require("long"); } catch (e) {}
            return factory(Long);
        })();
    /* Global */ else
        (global["dcodeIO"] = global["dcodeIO"] || {})["ByteBuffer"] = factory(global["dcodeIO"]["Long"]);

})(this, function(Long) {
    "use strict";

    /**
     * Constructs a new ByteBuffer.
     * @class The swiss army knife for binary data in JavaScript.
     * @exports ByteBuffer
     * @constructor
     * @param {number=} capacity Initial capacity. Defaults to {@link ByteBuffer.DEFAULT_CAPACITY}.
     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
     * @expose
     */
    var ByteBuffer = function(capacity, littleEndian, noAssert) {
        if (typeof capacity === 'undefined')
            capacity = ByteBuffer.DEFAULT_CAPACITY;
        if (typeof littleEndian === 'undefined')
            littleEndian = ByteBuffer.DEFAULT_ENDIAN;
        if (typeof noAssert === 'undefined')
            noAssert = ByteBuffer.DEFAULT_NOASSERT;
        if (!noAssert) {
            capacity = capacity | 0;
            if (capacity < 0)
                throw RangeError("Illegal capacity");
            littleEndian = !!littleEndian;
            noAssert = !!noAssert;
        }

        /**
         * Backing ArrayBuffer.
         * @type {!ArrayBuffer}
         * @expose
         */
        this.buffer = capacity === 0 ? EMPTY_BUFFER : new ArrayBuffer(capacity);

        /**
         * Uint8Array utilized to manipulate the backing buffer. Becomes `null` if the backing buffer has a capacity of `0`.
         * @type {?Uint8Array}
         * @expose
         */
        this.view = capacity === 0 ? null : new Uint8Array(this.buffer);

        /**
         * Absolute read/write offset.
         * @type {number}
         * @expose
         * @see ByteBuffer#flip
         * @see ByteBuffer#clear
         */
        this.offset = 0;

        /**
         * Marked offset.
         * @type {number}
         * @expose
         * @see ByteBuffer#mark
         * @see ByteBuffer#reset
         */
        this.markedOffset = -1;

        /**
         * Absolute limit of the contained data. Set to the backing buffer's capacity upon allocation.
         * @type {number}
         * @expose
         * @see ByteBuffer#flip
         * @see ByteBuffer#clear
         */
        this.limit = capacity;

        /**
         * Whether to use little endian byte order, defaults to `false` for big endian.
         * @type {boolean}
         * @expose
         */
        this.littleEndian = littleEndian;

        /**
         * Whether to skip assertions of offsets and values, defaults to `false`.
         * @type {boolean}
         * @expose
         */
        this.noAssert = noAssert;
    };

    /**
     * ByteBuffer version.
     * @type {string}
     * @const
     * @expose
     */
    ByteBuffer.VERSION = "5.0.1";

    /**
     * Little endian constant that can be used instead of its boolean value. Evaluates to `true`.
     * @type {boolean}
     * @const
     * @expose
     */
    ByteBuffer.LITTLE_ENDIAN = true;

    /**
     * Big endian constant that can be used instead of its boolean value. Evaluates to `false`.
     * @type {boolean}
     * @const
     * @expose
     */
    ByteBuffer.BIG_ENDIAN = false;

    /**
     * Default initial capacity of `16`.
     * @type {number}
     * @expose
     */
    ByteBuffer.DEFAULT_CAPACITY = 16;

    /**
     * Default endianess of `false` for big endian.
     * @type {boolean}
     * @expose
     */
    ByteBuffer.DEFAULT_ENDIAN = ByteBuffer.BIG_ENDIAN;

    /**
     * Default no assertions flag of `false`.
     * @type {boolean}
     * @expose
     */
    ByteBuffer.DEFAULT_NOASSERT = false;

    /**
     * A `Long` class for representing a 64-bit two's-complement integer value. May be `null` if Long.js has not been loaded
     *  and int64 support is not available.
     * @type {?Long}
     * @const
     * @see https://github.com/dcodeIO/long.js
     * @expose
     */
    ByteBuffer.Long = Long || null;

    /**
     * @alias ByteBuffer.prototype
     * @inner
     */
    var ByteBufferPrototype = ByteBuffer.prototype;

    /**
     * An indicator used to reliably determine if an object is a ByteBuffer or not.
     * @type {boolean}
     * @const
     * @expose
     * @private
     */
    ByteBufferPrototype.__isByteBuffer__;

    Object.defineProperty(ByteBufferPrototype, "__isByteBuffer__", {
        value: true,
        enumerable: false,
        configurable: false
    });

    // helpers

    /**
     * @type {!ArrayBuffer}
     * @inner
     */
    var EMPTY_BUFFER = new ArrayBuffer(0);

    /**
     * String.fromCharCode reference for compile-time renaming.
     * @type {function(...number):string}
     * @inner
     */
    var stringFromCharCode = String.fromCharCode;

    /**
     * Creates a source function for a string.
     * @param {string} s String to read from
     * @returns {function():number|null} Source function returning the next char code respectively `null` if there are
     *  no more characters left.
     * @throws {TypeError} If the argument is invalid
     * @inner
     */
    function stringSource(s) {
        var i=0; return function() {
            return i < s.length ? s.charCodeAt(i++) : null;
        };
    }

    /**
     * Creates a destination function for a string.
     * @returns {function(number=):undefined|string} Destination function successively called with the next char code.
     *  Returns the final string when called without arguments.
     * @inner
     */
    function stringDestination() {
        var cs = [], ps = []; return function() {
            if (arguments.length === 0)
                return ps.join('')+stringFromCharCode.apply(String, cs);
            if (cs.length + arguments.length > 1024)
                ps.push(stringFromCharCode.apply(String, cs)),
                    cs.length = 0;
            Array.prototype.push.apply(cs, arguments);
        };
    }

    /**
     * Gets the accessor type.
     * @returns {Function} `Buffer` under node.js, `Uint8Array` respectively `DataView` in the browser (classes)
     * @expose
     */
    ByteBuffer.accessor = function() {
        return Uint8Array;
    };
    /**
     * Allocates a new ByteBuffer backed by a buffer of the specified capacity.
     * @param {number=} capacity Initial capacity. Defaults to {@link ByteBuffer.DEFAULT_CAPACITY}.
     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
     * @returns {!ByteBuffer}
     * @expose
     */
    ByteBuffer.allocate = function(capacity, littleEndian, noAssert) {
        return new ByteBuffer(capacity, littleEndian, noAssert);
    };

    /**
     * Concatenates multiple ByteBuffers into one.
     * @param {!Array.<!ByteBuffer|!ArrayBuffer|!Uint8Array|string>} buffers Buffers to concatenate
     * @param {(string|boolean)=} encoding String encoding if `buffers` contains a string ("base64", "hex", "binary",
     *  defaults to "utf8")
     * @param {boolean=} littleEndian Whether to use little or big endian byte order for the resulting ByteBuffer. Defaults
     *  to {@link ByteBuffer.DEFAULT_ENDIAN}.
     * @param {boolean=} noAssert Whether to skip assertions of offsets and values for the resulting ByteBuffer. Defaults to
     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
     * @returns {!ByteBuffer} Concatenated ByteBuffer
     * @expose
     */
    ByteBuffer.concat = function(buffers, encoding, littleEndian, noAssert) {
        if (typeof encoding === 'boolean' || typeof encoding !== 'string') {
            noAssert = littleEndian;
            littleEndian = encoding;
            encoding = undefined;
        }
        var capacity = 0;
        for (var i=0, k=buffers.length, length; i<k; ++i) {
            if (!ByteBuffer.isByteBuffer(buffers[i]))
                buffers[i] = ByteBuffer.wrap(buffers[i], encoding);
            length = buffers[i].limit - buffers[i].offset;
            if (length > 0) capacity += length;
        }
        if (capacity === 0)
            return new ByteBuffer(0, littleEndian, noAssert);
        var bb = new ByteBuffer(capacity, littleEndian, noAssert),
            bi;
        i=0; while (i<k) {
            bi = buffers[i++];
            length = bi.limit - bi.offset;
            if (length <= 0) continue;
            bb.view.set(bi.view.subarray(bi.offset, bi.limit), bb.offset);
            bb.offset += length;
        }
        bb.limit = bb.offset;
        bb.offset = 0;
        return bb;
    };

    /**
     * Tests if the specified type is a ByteBuffer.
     * @param {*} bb ByteBuffer to test
     * @returns {boolean} `true` if it is a ByteBuffer, otherwise `false`
     * @expose
     */
    ByteBuffer.isByteBuffer = function(bb) {
        return (bb && bb["__isByteBuffer__"]) === true;
    };
    /**
     * Gets the backing buffer type.
     * @returns {Function} `Buffer` under node.js, `ArrayBuffer` in the browser (classes)
     * @expose
     */
    ByteBuffer.type = function() {
        return ArrayBuffer;
    };
    /**
     * Wraps a buffer or a string. Sets the allocated ByteBuffer's {@link ByteBuffer#offset} to `0` and its
     *  {@link ByteBuffer#limit} to the length of the wrapped data.
     * @param {!ByteBuffer|!ArrayBuffer|!Uint8Array|string|!Array.<number>} buffer Anything that can be wrapped
     * @param {(string|boolean)=} encoding String encoding if `buffer` is a string ("base64", "hex", "binary", defaults to
     *  "utf8")
     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
     * @returns {!ByteBuffer} A ByteBuffer wrapping `buffer`
     * @expose
     */
    ByteBuffer.wrap = function(buffer, encoding, littleEndian, noAssert) {
        if (typeof encoding !== 'string') {
            noAssert = littleEndian;
            littleEndian = encoding;
            encoding = undefined;
        }
        if (typeof buffer === 'string') {
            if (typeof encoding === 'undefined')
                encoding = "utf8";
            switch (encoding) {
                case "base64":
                    return ByteBuffer.fromBase64(buffer, littleEndian);
                case "hex":
                    return ByteBuffer.fromHex(buffer, littleEndian);
                case "binary":
                    return ByteBuffer.fromBinary(buffer, littleEndian);
                case "utf8":
                    return ByteBuffer.fromUTF8(buffer, littleEndian);
                case "debug":
                    return ByteBuffer.fromDebug(buffer, littleEndian);
                default:
                    throw Error("Unsupported encoding: "+encoding);
            }
        }
        if (buffer === null || typeof buffer !== 'object')
            throw TypeError("Illegal buffer");
        var bb;
        if (ByteBuffer.isByteBuffer(buffer)) {
            bb = ByteBufferPrototype.clone.call(buffer);
            bb.markedOffset = -1;
            return bb;
        }
        if (buffer instanceof Uint8Array) { // Extract ArrayBuffer from Uint8Array
            bb = new ByteBuffer(0, littleEndian, noAssert);
            if (buffer.length > 0) { // Avoid references to more than one EMPTY_BUFFER
                bb.buffer = buffer.buffer;
                bb.offset = buffer.byteOffset;
                bb.limit = buffer.byteOffset + buffer.byteLength;
                bb.view = new Uint8Array(buffer.buffer);
            }
        } else if (buffer instanceof ArrayBuffer) { // Reuse ArrayBuffer
            bb = new ByteBuffer(0, littleEndian, noAssert);
            if (buffer.byteLength > 0) {
                bb.buffer = buffer;
                bb.offset = 0;
                bb.limit = buffer.byteLength;
                bb.view = buffer.byteLength > 0 ? new Uint8Array(buffer) : null;
            }
        } else if (Object.prototype.toString.call(buffer) === "[object Array]") { // Create from octets
            bb = new ByteBuffer(buffer.length, littleEndian, noAssert);
            bb.limit = buffer.length;
            for (var i=0; i<buffer.length; ++i)
                bb.view[i] = buffer[i];
        } else
            throw TypeError("Illegal buffer"); // Otherwise fail
        return bb;
    };

    /**
     * Writes the array as a bitset.
     * @param {Array<boolean>} value Array of booleans to write
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `length` if omitted.
     * @returns {!ByteBuffer}
     * @expose
     */
    ByteBufferPrototype.writeBitSet = function(value, offset) {
      var relative = typeof offset === 'undefined';
      if (relative) offset = this.offset;
      if (!this.noAssert) {
        if (!(value instanceof Array))
          throw TypeError("Illegal BitSet: Not an array");
        if (typeof offset !== 'number' || offset % 1 !== 0)
            throw TypeError("Illegal offset: "+offset+" (not an integer)");
        offset >>>= 0;
        if (offset < 0 || offset + 0 > this.buffer.byteLength)
            throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
      }

      var start = offset,
          bits = value.length,
          bytes = (bits >> 3),
          bit = 0,
          k;

      offset += this.writeVarint32(bits,offset);

      while(bytes--) {
        k = (!!value[bit++] & 1) |
            ((!!value[bit++] & 1) << 1) |
            ((!!value[bit++] & 1) << 2) |
            ((!!value[bit++] & 1) << 3) |
            ((!!value[bit++] & 1) << 4) |
            ((!!value[bit++] & 1) << 5) |
            ((!!value[bit++] & 1) << 6) |
            ((!!value[bit++] & 1) << 7);
        this.writeByte(k,offset++);
      }

      if(bit < bits) {
        var m = 0; k = 0;
        while(bit < bits) k = k | ((!!value[bit++] & 1) << (m++));
        this.writeByte(k,offset++);
      }

      if (relative) {
        this.offset = offset;
        return this;
      }
      return offset - start;
    }

    /**
     * Reads a BitSet as an array of booleans.
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `length` if omitted.
     * @returns {Array<boolean>
     * @expose
     */
    ByteBufferPrototype.readBitSet = function(offset) {
      var relative = typeof offset === 'undefined';
      if (relative) offset = this.offset;

      var ret = this.readVarint32(offset),
          bits = ret.value,
          bytes = (bits >> 3),
          bit = 0,
          value = [],
          k;

      offset += ret.length;

      while(bytes--) {
        k = this.readByte(offset++);
        value[bit++] = !!(k & 0x01);
        value[bit++] = !!(k & 0x02);
        value[bit++] = !!(k & 0x04);
        value[bit++] = !!(k & 0x08);
        value[bit++] = !!(k & 0x10);
        value[bit++] = !!(k & 0x20);
        value[bit++] = !!(k & 0x40);
        value[bit++] = !!(k & 0x80);
      }

      if(bit < bits) {
        var m = 0;
        k = this.readByte(offset++);
        while(bit < bits) value[bit++] = !!((k >> (m++)) & 1);
      }

      if (relative) {
        this.offset = offset;
      }
      return value;
    }
    /**
     * Reads the specified number of bytes.
     * @param {number} length Number of bytes to read
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `length` if omitted.
     * @returns {!ByteBuffer}
     * @expose
     */
    ByteBufferPrototype.readBytes = function(length, offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + length > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+length+") <= "+this.buffer.byteLength);
        }
        var slice = this.slice(offset, offset + length);
        if (relative) this.offset += length;
        return slice;
    };

    /**
     * Writes a payload of bytes. This is an alias of {@link ByteBuffer#append}.
     * @function
     * @param {!ByteBuffer|!ArrayBuffer|!Uint8Array|string} source Data to write. If `source` is a ByteBuffer, its offsets
     *  will be modified according to the performed read operation.
     * @param {(string|number)=} encoding Encoding if `data` is a string ("base64", "hex", "binary", defaults to "utf8")
     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
     *  written if omitted.
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.writeBytes = ByteBufferPrototype.append;

    // types/ints/int8

    /**
     * Writes an 8bit signed integer.
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.writeInt8 = function(value, offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof value !== 'number' || value % 1 !== 0)
                throw TypeError("Illegal value: "+value+" (not an integer)");
            value |= 0;
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        offset += 1;
        var capacity0 = this.buffer.byteLength;
        if (offset > capacity0)
            this.resize((capacity0 *= 2) > offset ? capacity0 : offset);
        offset -= 1;
        this.view[offset] = value;
        if (relative) this.offset += 1;
        return this;
    };

    /**
     * Writes an 8bit signed integer. This is an alias of {@link ByteBuffer#writeInt8}.
     * @function
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.writeByte = ByteBufferPrototype.writeInt8;

    /**
     * Reads an 8bit signed integer.
     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
     * @returns {number} Value read
     * @expose
     */
    ByteBufferPrototype.readInt8 = function(offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 1 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
        }
        var value = this.view[offset];
        if ((value & 0x80) === 0x80) value = -(0xFF - value + 1); // Cast to signed
        if (relative) this.offset += 1;
        return value;
    };

    /**
     * Reads an 8bit signed integer. This is an alias of {@link ByteBuffer#readInt8}.
     * @function
     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
     * @returns {number} Value read
     * @expose
     */
    ByteBufferPrototype.readByte = ByteBufferPrototype.readInt8;

    /**
     * Writes an 8bit unsigned integer.
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.writeUint8 = function(value, offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof value !== 'number' || value % 1 !== 0)
                throw TypeError("Illegal value: "+value+" (not an integer)");
            value >>>= 0;
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        offset += 1;
        var capacity1 = this.buffer.byteLength;
        if (offset > capacity1)
            this.resize((capacity1 *= 2) > offset ? capacity1 : offset);
        offset -= 1;
        this.view[offset] = value;
        if (relative) this.offset += 1;
        return this;
    };

    /**
     * Writes an 8bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint8}.
     * @function
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.writeUInt8 = ByteBufferPrototype.writeUint8;

    /**
     * Reads an 8bit unsigned integer.
     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
     * @returns {number} Value read
     * @expose
     */
    ByteBufferPrototype.readUint8 = function(offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 1 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
        }
        var value = this.view[offset];
        if (relative) this.offset += 1;
        return value;
    };

    /**
     * Reads an 8bit unsigned integer. This is an alias of {@link ByteBuffer#readUint8}.
     * @function
     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
     * @returns {number} Value read
     * @expose
     */
    ByteBufferPrototype.readUInt8 = ByteBufferPrototype.readUint8;

    // types/ints/int16

    /**
     * Writes a 16bit signed integer.
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
     * @throws {TypeError} If `offset` or `value` is not a valid number
     * @throws {RangeError} If `offset` is out of bounds
     * @expose
     */
    ByteBufferPrototype.writeInt16 = function(value, offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof value !== 'number' || value % 1 !== 0)
                throw TypeError("Illegal value: "+value+" (not an integer)");
            value |= 0;
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        offset += 2;
        var capacity2 = this.buffer.byteLength;
        if (offset > capacity2)
            this.resize((capacity2 *= 2) > offset ? capacity2 : offset);
        offset -= 2;
        if (this.littleEndian) {
            this.view[offset+1] = (value & 0xFF00) >>> 8;
            this.view[offset  ] =  value & 0x00FF;
        } else {
            this.view[offset]   = (value & 0xFF00) >>> 8;
            this.view[offset+1] =  value & 0x00FF;
        }
        if (relative) this.offset += 2;
        return this;
    };

    /**
     * Writes a 16bit signed integer. This is an alias of {@link ByteBuffer#writeInt16}.
     * @function
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
     * @throws {TypeError} If `offset` or `value` is not a valid number
     * @throws {RangeError} If `offset` is out of bounds
     * @expose
     */
    ByteBufferPrototype.writeShort = ByteBufferPrototype.writeInt16;

    /**
     * Reads a 16bit signed integer.
     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
     * @returns {number} Value read
     * @throws {TypeError} If `offset` is not a valid number
     * @throws {RangeError} If `offset` is out of bounds
     * @expose
     */
    ByteBufferPrototype.readInt16 = function(offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 2 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+2+") <= "+this.buffer.byteLength);
        }
        var value = 0;
        if (this.littleEndian) {
            value  = this.view[offset  ];
            value |= this.view[offset+1] << 8;
        } else {
            value  = this.view[offset  ] << 8;
            value |= this.view[offset+1];
        }
        if ((value & 0x8000) === 0x8000) value = -(0xFFFF - value + 1); // Cast to signed
        if (relative) this.offset += 2;
        return value;
    };

    /**
     * Reads a 16bit signed integer. This is an alias of {@link ByteBuffer#readInt16}.
     * @function
     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
     * @returns {number} Value read
     * @throws {TypeError} If `offset` is not a valid number
     * @throws {RangeError} If `offset` is out of bounds
     * @expose
     */
    ByteBufferPrototype.readShort = ByteBufferPrototype.readInt16;

    /**
     * Writes a 16bit unsigned integer.
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
     * @throws {TypeError} If `offset` or `value` is not a valid number
     * @throws {RangeError} If `offset` is out of bounds
     * @expose
     */
    ByteBufferPrototype.writeUint16 = function(value, offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof value !== 'number' || value % 1 !== 0)
                throw TypeError("Illegal value: "+value+" (not an integer)");
            value >>>= 0;
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        offset += 2;
        var capacity3 = this.buffer.byteLength;
        if (offset > capacity3)
            this.resize((capacity3 *= 2) > offset ? capacity3 : offset);
        offset -= 2;
        if (this.littleEndian) {
            this.view[offset+1] = (value & 0xFF00) >>> 8;
            this.view[offset  ] =  value & 0x00FF;
        } else {
            this.view[offset]   = (value & 0xFF00) >>> 8;
            this.view[offset+1] =  value & 0x00FF;
        }
        if (relative) this.offset += 2;
        return this;
    };

    /**
     * Writes a 16bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint16}.
     * @function
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
     * @throws {TypeError} If `offset` or `value` is not a valid number
     * @throws {RangeError} If `offset` is out of bounds
     * @expose
     */
    ByteBufferPrototype.writeUInt16 = ByteBufferPrototype.writeUint16;

    /**
     * Reads a 16bit unsigned integer.
     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
     * @returns {number} Value read
     * @throws {TypeError} If `offset` is not a valid number
     * @throws {RangeError} If `offset` is out of bounds
     * @expose
     */
    ByteBufferPrototype.readUint16 = function(offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 2 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+2+") <= "+this.buffer.byteLength);
        }
        var value = 0;
        if (this.littleEndian) {
            value  = this.view[offset  ];
            value |= this.view[offset+1] << 8;
        } else {
            value  = this.view[offset  ] << 8;
            value |= this.view[offset+1];
        }
        if (relative) this.offset += 2;
        return value;
    };

    /**
     * Reads a 16bit unsigned integer. This is an alias of {@link ByteBuffer#readUint16}.
     * @function
     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
     * @returns {number} Value read
     * @throws {TypeError} If `offset` is not a valid number
     * @throws {RangeError} If `offset` is out of bounds
     * @expose
     */
    ByteBufferPrototype.readUInt16 = ByteBufferPrototype.readUint16;

    // types/ints/int32

    /**
     * Writes a 32bit signed integer.
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
     * @expose
     */
    ByteBufferPrototype.writeInt32 = function(value, offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof value !== 'number' || value % 1 !== 0)
                throw TypeError("Illegal value: "+value+" (not an integer)");
            value |= 0;
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        offset += 4;
        var capacity4 = this.buffer.byteLength;
        if (offset > capacity4)
            this.resize((capacity4 *= 2) > offset ? capacity4 : offset);
        offset -= 4;
        if (this.littleEndian) {
            this.view[offset+3] = (value >>> 24) & 0xFF;
            this.view[offset+2] = (value >>> 16) & 0xFF;
            this.view[offset+1] = (value >>>  8) & 0xFF;
            this.view[offset  ] =  value         & 0xFF;
        } else {
            this.view[offset  ] = (value >>> 24) & 0xFF;
            this.view[offset+1] = (value >>> 16) & 0xFF;
            this.view[offset+2] = (value >>>  8) & 0xFF;
            this.view[offset+3] =  value         & 0xFF;
        }
        if (relative) this.offset += 4;
        return this;
    };

    /**
     * Writes a 32bit signed integer. This is an alias of {@link ByteBuffer#writeInt32}.
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
     * @expose
     */
    ByteBufferPrototype.writeInt = ByteBufferPrototype.writeInt32;

    /**
     * Reads a 32bit signed integer.
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
     * @returns {number} Value read
     * @expose
     */
    ByteBufferPrototype.readInt32 = function(offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 4 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+4+") <= "+this.buffer.byteLength);
        }
        var value = 0;
        if (this.littleEndian) {
            value  = this.view[offset+2] << 16;
            value |= this.view[offset+1] <<  8;
            value |= this.view[offset  ];
            value += this.view[offset+3] << 24 >>> 0;
        } else {
            value  = this.view[offset+1] << 16;
            value |= this.view[offset+2] <<  8;
            value |= this.view[offset+3];
            value += this.view[offset  ] << 24 >>> 0;
        }
        value |= 0; // Cast to signed
        if (relative) this.offset += 4;
        return value;
    };

    /**
     * Reads a 32bit signed integer. This is an alias of {@link ByteBuffer#readInt32}.
     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `4` if omitted.
     * @returns {number} Value read
     * @expose
     */
    ByteBufferPrototype.readInt = ByteBufferPrototype.readInt32;

    /**
     * Writes a 32bit unsigned integer.
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
     * @expose
     */
    ByteBufferPrototype.writeUint32 = function(value, offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof value !== 'number' || value % 1 !== 0)
                throw TypeError("Illegal value: "+value+" (not an integer)");
            value >>>= 0;
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        offset += 4;
        var capacity5 = this.buffer.byteLength;
        if (offset > capacity5)
            this.resize((capacity5 *= 2) > offset ? capacity5 : offset);
        offset -= 4;
        if (this.littleEndian) {
            this.view[offset+3] = (value >>> 24) & 0xFF;
            this.view[offset+2] = (value >>> 16) & 0xFF;
            this.view[offset+1] = (value >>>  8) & 0xFF;
            this.view[offset  ] =  value         & 0xFF;
        } else {
            this.view[offset  ] = (value >>> 24) & 0xFF;
            this.view[offset+1] = (value >>> 16) & 0xFF;
            this.view[offset+2] = (value >>>  8) & 0xFF;
            this.view[offset+3] =  value         & 0xFF;
        }
        if (relative) this.offset += 4;
        return this;
    };

    /**
     * Writes a 32bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint32}.
     * @function
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
     * @expose
     */
    ByteBufferPrototype.writeUInt32 = ByteBufferPrototype.writeUint32;

    /**
     * Reads a 32bit unsigned integer.
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
     * @returns {number} Value read
     * @expose
     */
    ByteBufferPrototype.readUint32 = function(offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 4 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+4+") <= "+this.buffer.byteLength);
        }
        var value = 0;
        if (this.littleEndian) {
            value  = this.view[offset+2] << 16;
            value |= this.view[offset+1] <<  8;
            value |= this.view[offset  ];
            value += this.view[offset+3] << 24 >>> 0;
        } else {
            value  = this.view[offset+1] << 16;
            value |= this.view[offset+2] <<  8;
            value |= this.view[offset+3];
            value += this.view[offset  ] << 24 >>> 0;
        }
        if (relative) this.offset += 4;
        return value;
    };

    /**
     * Reads a 32bit unsigned integer. This is an alias of {@link ByteBuffer#readUint32}.
     * @function
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
     * @returns {number} Value read
     * @expose
     */
    ByteBufferPrototype.readUInt32 = ByteBufferPrototype.readUint32;

    // types/ints/int64

    if (Long) {

        /**
         * Writes a 64bit signed integer.
         * @param {number|!Long} value Value to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.writeInt64 = function(value, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof value === 'number')
                    value = Long.fromNumber(value);
                else if (typeof value === 'string')
                    value = Long.fromString(value);
                else if (!(value && value instanceof Long))
                    throw TypeError("Illegal value: "+value+" (not an integer or Long)");
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            if (typeof value === 'number')
                value = Long.fromNumber(value);
            else if (typeof value === 'string')
                value = Long.fromString(value);
            offset += 8;
            var capacity6 = this.buffer.byteLength;
            if (offset > capacity6)
                this.resize((capacity6 *= 2) > offset ? capacity6 : offset);
            offset -= 8;
            var lo = value.low,
                hi = value.high;
            if (this.littleEndian) {
                this.view[offset+3] = (lo >>> 24) & 0xFF;
                this.view[offset+2] = (lo >>> 16) & 0xFF;
                this.view[offset+1] = (lo >>>  8) & 0xFF;
                this.view[offset  ] =  lo         & 0xFF;
                offset += 4;
                this.view[offset+3] = (hi >>> 24) & 0xFF;
                this.view[offset+2] = (hi >>> 16) & 0xFF;
                this.view[offset+1] = (hi >>>  8) & 0xFF;
                this.view[offset  ] =  hi         & 0xFF;
            } else {
                this.view[offset  ] = (hi >>> 24) & 0xFF;
                this.view[offset+1] = (hi >>> 16) & 0xFF;
                this.view[offset+2] = (hi >>>  8) & 0xFF;
                this.view[offset+3] =  hi         & 0xFF;
                offset += 4;
                this.view[offset  ] = (lo >>> 24) & 0xFF;
                this.view[offset+1] = (lo >>> 16) & 0xFF;
                this.view[offset+2] = (lo >>>  8) & 0xFF;
                this.view[offset+3] =  lo         & 0xFF;
            }
            if (relative) this.offset += 8;
            return this;
        };

        /**
         * Writes a 64bit signed integer. This is an alias of {@link ByteBuffer#writeInt64}.
         * @param {number|!Long} value Value to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.writeLong = ByteBufferPrototype.writeInt64;

        /**
         * Reads a 64bit signed integer.
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
         * @returns {!Long}
         * @expose
         */
        ByteBufferPrototype.readInt64 = function(offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 8 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+8+") <= "+this.buffer.byteLength);
            }
            var lo = 0,
                hi = 0;
            if (this.littleEndian) {
                lo  = this.view[offset+2] << 16;
                lo |= this.view[offset+1] <<  8;
                lo |= this.view[offset  ];
                lo += this.view[offset+3] << 24 >>> 0;
                offset += 4;
                hi  = this.view[offset+2] << 16;
                hi |= this.view[offset+1] <<  8;
                hi |= this.view[offset  ];
                hi += this.view[offset+3] << 24 >>> 0;
            } else {
                hi  = this.view[offset+1] << 16;
                hi |= this.view[offset+2] <<  8;
                hi |= this.view[offset+3];
                hi += this.view[offset  ] << 24 >>> 0;
                offset += 4;
                lo  = this.view[offset+1] << 16;
                lo |= this.view[offset+2] <<  8;
                lo |= this.view[offset+3];
                lo += this.view[offset  ] << 24 >>> 0;
            }
            var value = new Long(lo, hi, false);
            if (relative) this.offset += 8;
            return value;
        };

        /**
         * Reads a 64bit signed integer. This is an alias of {@link ByteBuffer#readInt64}.
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
         * @returns {!Long}
         * @expose
         */
        ByteBufferPrototype.readLong = ByteBufferPrototype.readInt64;

        /**
         * Writes a 64bit unsigned integer.
         * @param {number|!Long} value Value to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.writeUint64 = function(value, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof value === 'number')
                    value = Long.fromNumber(value);
                else if (typeof value === 'string')
                    value = Long.fromString(value);
                else if (!(value && value instanceof Long))
                    throw TypeError("Illegal value: "+value+" (not an integer or Long)");
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            if (typeof value === 'number')
                value = Long.fromNumber(value);
            else if (typeof value === 'string')
                value = Long.fromString(value);
            offset += 8;
            var capacity7 = this.buffer.byteLength;
            if (offset > capacity7)
                this.resize((capacity7 *= 2) > offset ? capacity7 : offset);
            offset -= 8;
            var lo = value.low,
                hi = value.high;
            if (this.littleEndian) {
                this.view[offset+3] = (lo >>> 24) & 0xFF;
                this.view[offset+2] = (lo >>> 16) & 0xFF;
                this.view[offset+1] = (lo >>>  8) & 0xFF;
                this.view[offset  ] =  lo         & 0xFF;
                offset += 4;
                this.view[offset+3] = (hi >>> 24) & 0xFF;
                this.view[offset+2] = (hi >>> 16) & 0xFF;
                this.view[offset+1] = (hi >>>  8) & 0xFF;
                this.view[offset  ] =  hi         & 0xFF;
            } else {
                this.view[offset  ] = (hi >>> 24) & 0xFF;
                this.view[offset+1] = (hi >>> 16) & 0xFF;
                this.view[offset+2] = (hi >>>  8) & 0xFF;
                this.view[offset+3] =  hi         & 0xFF;
                offset += 4;
                this.view[offset  ] = (lo >>> 24) & 0xFF;
                this.view[offset+1] = (lo >>> 16) & 0xFF;
                this.view[offset+2] = (lo >>>  8) & 0xFF;
                this.view[offset+3] =  lo         & 0xFF;
            }
            if (relative) this.offset += 8;
            return this;
        };

        /**
         * Writes a 64bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint64}.
         * @function
         * @param {number|!Long} value Value to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.writeUInt64 = ByteBufferPrototype.writeUint64;

        /**
         * Reads a 64bit unsigned integer.
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
         * @returns {!Long}
         * @expose
         */
        ByteBufferPrototype.readUint64 = function(offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 8 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+8+") <= "+this.buffer.byteLength);
            }
            var lo = 0,
                hi = 0;
            if (this.littleEndian) {
                lo  = this.view[offset+2] << 16;
                lo |= this.view[offset+1] <<  8;
                lo |= this.view[offset  ];
                lo += this.view[offset+3] << 24 >>> 0;
                offset += 4;
                hi  = this.view[offset+2] << 16;
                hi |= this.view[offset+1] <<  8;
                hi |= this.view[offset  ];
                hi += this.view[offset+3] << 24 >>> 0;
            } else {
                hi  = this.view[offset+1] << 16;
                hi |= this.view[offset+2] <<  8;
                hi |= this.view[offset+3];
                hi += this.view[offset  ] << 24 >>> 0;
                offset += 4;
                lo  = this.view[offset+1] << 16;
                lo |= this.view[offset+2] <<  8;
                lo |= this.view[offset+3];
                lo += this.view[offset  ] << 24 >>> 0;
            }
            var value = new Long(lo, hi, true);
            if (relative) this.offset += 8;
            return value;
        };

        /**
         * Reads a 64bit unsigned integer. This is an alias of {@link ByteBuffer#readUint64}.
         * @function
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
         * @returns {!Long}
         * @expose
         */
        ByteBufferPrototype.readUInt64 = ByteBufferPrototype.readUint64;

    } // Long


    // types/floats/float32

    /*
     ieee754 - https://github.com/feross/ieee754

     The MIT License (MIT)

     Copyright (c) Feross Aboukhadijeh

     Permission is hereby granted, free of charge, to any person obtaining a copy
     of this software and associated documentation files (the "Software"), to deal
     in the Software without restriction, including without limitation the rights
     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the Software is
     furnished to do so, subject to the following conditions:

     The above copyright notice and this permission notice shall be included in
     all copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     THE SOFTWARE.
    */

    /**
     * Reads an IEEE754 float from a byte array.
     * @param {!Array} buffer
     * @param {number} offset
     * @param {boolean} isLE
     * @param {number} mLen
     * @param {number} nBytes
     * @returns {number}
     * @inner
     */
    function ieee754_read(buffer, offset, isLE, mLen, nBytes) {
        var e, m,
            eLen = nBytes * 8 - mLen - 1,
            eMax = (1 << eLen) - 1,
            eBias = eMax >> 1,
            nBits = -7,
            i = isLE ? (nBytes - 1) : 0,
            d = isLE ? -1 : 1,
            s = buffer[offset + i];

        i += d;

        e = s & ((1 << (-nBits)) - 1);
        s >>= (-nBits);
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

        m = e & ((1 << (-nBits)) - 1);
        e >>= (-nBits);
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

        if (e === 0) {
            e = 1 - eBias;
        } else if (e === eMax) {
            return m ? NaN : ((s ? -1 : 1) * Infinity);
        } else {
            m = m + Math.pow(2, mLen);
            e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    }

    /**
     * Writes an IEEE754 float to a byte array.
     * @param {!Array} buffer
     * @param {number} value
     * @param {number} offset
     * @param {boolean} isLE
     * @param {number} mLen
     * @param {number} nBytes
     * @inner
     */
    function ieee754_write(buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c,
            eLen = nBytes * 8 - mLen - 1,
            eMax = (1 << eLen) - 1,
            eBias = eMax >> 1,
            rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
            i = isLE ? 0 : (nBytes - 1),
            d = isLE ? 1 : -1,
            s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

        value = Math.abs(value);

        if (isNaN(value) || value === Infinity) {
            m = isNaN(value) ? 1 : 0;
            e = eMax;
        } else {
            e = Math.floor(Math.log(value) / Math.LN2);
            if (value * (c = Math.pow(2, -e)) < 1) {
                e--;
                c *= 2;
            }
            if (e + eBias >= 1) {
                value += rt / c;
            } else {
                value += rt * Math.pow(2, 1 - eBias);
            }
            if (value * c >= 2) {
                e++;
                c /= 2;
            }

            if (e + eBias >= eMax) {
                m = 0;
                e = eMax;
            } else if (e + eBias >= 1) {
                m = (value * c - 1) * Math.pow(2, mLen);
                e = e + eBias;
            } else {
                m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                e = 0;
            }
        }

        for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

        e = (e << mLen) | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

        buffer[offset + i - d] |= s * 128;
    }

    /**
     * Writes a 32bit float.
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.writeFloat32 = function(value, offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof value !== 'number')
                throw TypeError("Illegal value: "+value+" (not a number)");
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        offset += 4;
        var capacity8 = this.buffer.byteLength;
        if (offset > capacity8)
            this.resize((capacity8 *= 2) > offset ? capacity8 : offset);
        offset -= 4;
        ieee754_write(this.view, value, offset, this.littleEndian, 23, 4);
        if (relative) this.offset += 4;
        return this;
    };

    /**
     * Writes a 32bit float. This is an alias of {@link ByteBuffer#writeFloat32}.
     * @function
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.writeFloat = ByteBufferPrototype.writeFloat32;

    /**
     * Reads a 32bit float.
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
     * @returns {number}
     * @expose
     */
    ByteBufferPrototype.readFloat32 = function(offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 4 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+4+") <= "+this.buffer.byteLength);
        }
        var value = ieee754_read(this.view, offset, this.littleEndian, 23, 4);
        if (relative) this.offset += 4;
        return value;
    };

    /**
     * Reads a 32bit float. This is an alias of {@link ByteBuffer#readFloat32}.
     * @function
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
     * @returns {number}
     * @expose
     */
    ByteBufferPrototype.readFloat = ByteBufferPrototype.readFloat32;

    // types/floats/float64

    /**
     * Writes a 64bit float.
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.writeFloat64 = function(value, offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof value !== 'number')
                throw TypeError("Illegal value: "+value+" (not a number)");
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        offset += 8;
        var capacity9 = this.buffer.byteLength;
        if (offset > capacity9)
            this.resize((capacity9 *= 2) > offset ? capacity9 : offset);
        offset -= 8;
        ieee754_write(this.view, value, offset, this.littleEndian, 52, 8);
        if (relative) this.offset += 8;
        return this;
    };

    /**
     * Writes a 64bit float. This is an alias of {@link ByteBuffer#writeFloat64}.
     * @function
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.writeDouble = ByteBufferPrototype.writeFloat64;

    /**
     * Reads a 64bit float.
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
     * @returns {number}
     * @expose
     */
    ByteBufferPrototype.readFloat64 = function(offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 8 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+8+") <= "+this.buffer.byteLength);
        }
        var value = ieee754_read(this.view, offset, this.littleEndian, 52, 8);
        if (relative) this.offset += 8;
        return value;
    };

    /**
     * Reads a 64bit float. This is an alias of {@link ByteBuffer#readFloat64}.
     * @function
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
     * @returns {number}
     * @expose
     */
    ByteBufferPrototype.readDouble = ByteBufferPrototype.readFloat64;


    // types/varints/varint32

    /**
     * Maximum number of bytes required to store a 32bit base 128 variable-length integer.
     * @type {number}
     * @const
     * @expose
     */
    ByteBuffer.MAX_VARINT32_BYTES = 5;

    /**
     * Calculates the actual number of bytes required to store a 32bit base 128 variable-length integer.
     * @param {number} value Value to encode
     * @returns {number} Number of bytes required. Capped to {@link ByteBuffer.MAX_VARINT32_BYTES}
     * @expose
     */
    ByteBuffer.calculateVarint32 = function(value) {
        // ref: src/google/protobuf/io/coded_stream.cc
        value = value >>> 0;
             if (value < 1 << 7 ) return 1;
        else if (value < 1 << 14) return 2;
        else if (value < 1 << 21) return 3;
        else if (value < 1 << 28) return 4;
        else                      return 5;
    };

    /**
     * Zigzag encodes a signed 32bit integer so that it can be effectively used with varint encoding.
     * @param {number} n Signed 32bit integer
     * @returns {number} Unsigned zigzag encoded 32bit integer
     * @expose
     */
    ByteBuffer.zigZagEncode32 = function(n) {
        return (((n |= 0) << 1) ^ (n >> 31)) >>> 0; // ref: src/google/protobuf/wire_format_lite.h
    };

    /**
     * Decodes a zigzag encoded signed 32bit integer.
     * @param {number} n Unsigned zigzag encoded 32bit integer
     * @returns {number} Signed 32bit integer
     * @expose
     */
    ByteBuffer.zigZagDecode32 = function(n) {
        return ((n >>> 1) ^ -(n & 1)) | 0; // // ref: src/google/protobuf/wire_format_lite.h
    };

    /**
     * Writes a 32bit base 128 variable-length integer.
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
     *  written if omitted.
     * @returns {!ByteBuffer|number} this if `offset` is omitted, else the actual number of bytes written
     * @expose
     */
    ByteBufferPrototype.writeVarint32 = function(value, offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof value !== 'number' || value % 1 !== 0)
                throw TypeError("Illegal value: "+value+" (not an integer)");
            value |= 0;
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        var size = ByteBuffer.calculateVarint32(value),
            b;
        offset += size;
        var capacity10 = this.buffer.byteLength;
        if (offset > capacity10)
            this.resize((capacity10 *= 2) > offset ? capacity10 : offset);
        offset -= size;
        value >>>= 0;
        while (value >= 0x80) {
            b = (value & 0x7f) | 0x80;
            this.view[offset++] = b;
            value >>>= 7;
        }
        this.view[offset++] = value;
        if (relative) {
            this.offset = offset;
            return this;
        }
        return size;
    };

    /**
     * Writes a zig-zag encoded (signed) 32bit base 128 variable-length integer.
     * @param {number} value Value to write
     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
     *  written if omitted.
     * @returns {!ByteBuffer|number} this if `offset` is omitted, else the actual number of bytes written
     * @expose
     */
    ByteBufferPrototype.writeVarint32ZigZag = function(value, offset) {
        return this.writeVarint32(ByteBuffer.zigZagEncode32(value), offset);
    };

    /**
     * Reads a 32bit base 128 variable-length integer.
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
     *  written if omitted.
     * @returns {number|!{value: number, length: number}} The value read if offset is omitted, else the value read
     *  and the actual number of bytes read.
     * @throws {Error} If it's not a valid varint. Has a property `truncated = true` if there is not enough data available
     *  to fully decode the varint.
     * @expose
     */
    ByteBufferPrototype.readVarint32 = function(offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 1 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
        }
        var c = 0,
            value = 0 >>> 0,
            b;
        do {
            if (!this.noAssert && offset > this.limit) {
                var err = Error("Truncated");
                err['truncated'] = true;
                throw err;
            }
            b = this.view[offset++];
            if (c < 5)
                value |= (b & 0x7f) << (7*c);
            ++c;
        } while ((b & 0x80) !== 0);
        value |= 0;
        if (relative) {
            this.offset = offset;
            return value;
        }
        return {
            "value": value,
            "length": c
        };
    };

    /**
     * Reads a zig-zag encoded (signed) 32bit base 128 variable-length integer.
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
     *  written if omitted.
     * @returns {number|!{value: number, length: number}} The value read if offset is omitted, else the value read
     *  and the actual number of bytes read.
     * @throws {Error} If it's not a valid varint
     * @expose
     */
    ByteBufferPrototype.readVarint32ZigZag = function(offset) {
        var val = this.readVarint32(offset);
        if (typeof val === 'object')
            val["value"] = ByteBuffer.zigZagDecode32(val["value"]);
        else
            val = ByteBuffer.zigZagDecode32(val);
        return val;
    };

    // types/varints/varint64

    if (Long) {

        /**
         * Maximum number of bytes required to store a 64bit base 128 variable-length integer.
         * @type {number}
         * @const
         * @expose
         */
        ByteBuffer.MAX_VARINT64_BYTES = 10;

        /**
         * Calculates the actual number of bytes required to store a 64bit base 128 variable-length integer.
         * @param {number|!Long} value Value to encode
         * @returns {number} Number of bytes required. Capped to {@link ByteBuffer.MAX_VARINT64_BYTES}
         * @expose
         */
        ByteBuffer.calculateVarint64 = function(value) {
            if (typeof value === 'number')
                value = Long.fromNumber(value);
            else if (typeof value === 'string')
                value = Long.fromString(value);
            // ref: src/google/protobuf/io/coded_stream.cc
            var part0 = value.toInt() >>> 0,
                part1 = value.shiftRightUnsigned(28).toInt() >>> 0,
                part2 = value.shiftRightUnsigned(56).toInt() >>> 0;
            if (part2 == 0) {
                if (part1 == 0) {
                    if (part0 < 1 << 14)
                        return part0 < 1 << 7 ? 1 : 2;
                    else
                        return part0 < 1 << 21 ? 3 : 4;
                } else {
                    if (part1 < 1 << 14)
                        return part1 < 1 << 7 ? 5 : 6;
                    else
                        return part1 < 1 << 21 ? 7 : 8;
                }
            } else
                return part2 < 1 << 7 ? 9 : 10;
        };

        /**
         * Zigzag encodes a signed 64bit integer so that it can be effectively used with varint encoding.
         * @param {number|!Long} value Signed long
         * @returns {!Long} Unsigned zigzag encoded long
         * @expose
         */
        ByteBuffer.zigZagEncode64 = function(value) {
            if (typeof value === 'number')
                value = Long.fromNumber(value, false);
            else if (typeof value === 'string')
                value = Long.fromString(value, false);
            else if (value.unsigned !== false) value = value.toSigned();
            // ref: src/google/protobuf/wire_format_lite.h
            return value.shiftLeft(1).xor(value.shiftRight(63)).toUnsigned();
        };

        /**
         * Decodes a zigzag encoded signed 64bit integer.
         * @param {!Long|number} value Unsigned zigzag encoded long or JavaScript number
         * @returns {!Long} Signed long
         * @expose
         */
        ByteBuffer.zigZagDecode64 = function(value) {
            if (typeof value === 'number')
                value = Long.fromNumber(value, false);
            else if (typeof value === 'string')
                value = Long.fromString(value, false);
            else if (value.unsigned !== false) value = value.toSigned();
            // ref: src/google/protobuf/wire_format_lite.h
            return value.shiftRightUnsigned(1).xor(value.and(Long.ONE).toSigned().negate()).toSigned();
        };

        /**
         * Writes a 64bit base 128 variable-length integer.
         * @param {number|Long} value Value to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  written if omitted.
         * @returns {!ByteBuffer|number} `this` if offset is omitted, else the actual number of bytes written.
         * @expose
         */
        ByteBufferPrototype.writeVarint64 = function(value, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof value === 'number')
                    value = Long.fromNumber(value);
                else if (typeof value === 'string')
                    value = Long.fromString(value);
                else if (!(value && value instanceof Long))
                    throw TypeError("Illegal value: "+value+" (not an integer or Long)");
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            if (typeof value === 'number')
                value = Long.fromNumber(value, false);
            else if (typeof value === 'string')
                value = Long.fromString(value, false);
            else if (value.unsigned !== false) value = value.toSigned();
            var size = ByteBuffer.calculateVarint64(value),
                part0 = value.toInt() >>> 0,
                part1 = value.shiftRightUnsigned(28).toInt() >>> 0,
                part2 = value.shiftRightUnsigned(56).toInt() >>> 0;
            offset += size;
            var capacity11 = this.buffer.byteLength;
            if (offset > capacity11)
                this.resize((capacity11 *= 2) > offset ? capacity11 : offset);
            offset -= size;
            switch (size) {
                case 10: this.view[offset+9] = (part2 >>>  7) & 0x01;
                case 9 : this.view[offset+8] = size !== 9 ? (part2       ) | 0x80 : (part2       ) & 0x7F;
                case 8 : this.view[offset+7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
                case 7 : this.view[offset+6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
                case 6 : this.view[offset+5] = size !== 6 ? (part1 >>>  7) | 0x80 : (part1 >>>  7) & 0x7F;
                case 5 : this.view[offset+4] = size !== 5 ? (part1       ) | 0x80 : (part1       ) & 0x7F;
                case 4 : this.view[offset+3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
                case 3 : this.view[offset+2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
                case 2 : this.view[offset+1] = size !== 2 ? (part0 >>>  7) | 0x80 : (part0 >>>  7) & 0x7F;
                case 1 : this.view[offset  ] = size !== 1 ? (part0       ) | 0x80 : (part0       ) & 0x7F;
            }
            if (relative) {
                this.offset += size;
                return this;
            } else {
                return size;
            }
        };

        /**
         * Writes a zig-zag encoded 64bit base 128 variable-length integer.
         * @param {number|Long} value Value to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  written if omitted.
         * @returns {!ByteBuffer|number} `this` if offset is omitted, else the actual number of bytes written.
         * @expose
         */
        ByteBufferPrototype.writeVarint64ZigZag = function(value, offset) {
            return this.writeVarint64(ByteBuffer.zigZagEncode64(value), offset);
        };

        /**
         * Reads a 64bit base 128 variable-length integer. Requires Long.js.
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  read if omitted.
         * @returns {!Long|!{value: Long, length: number}} The value read if offset is omitted, else the value read and
         *  the actual number of bytes read.
         * @throws {Error} If it's not a valid varint
         * @expose
         */
        ByteBufferPrototype.readVarint64 = function(offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 1 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
            }
            // ref: src/google/protobuf/io/coded_stream.cc
            var start = offset,
                part0 = 0,
                part1 = 0,
                part2 = 0,
                b  = 0;
            b = this.view[offset++]; part0  = (b & 0x7F)      ; if ( b & 0x80                                                   ) {
            b = this.view[offset++]; part0 |= (b & 0x7F) <<  7; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
            b = this.view[offset++]; part0 |= (b & 0x7F) << 14; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
            b = this.view[offset++]; part0 |= (b & 0x7F) << 21; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
            b = this.view[offset++]; part1  = (b & 0x7F)      ; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
            b = this.view[offset++]; part1 |= (b & 0x7F) <<  7; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
            b = this.view[offset++]; part1 |= (b & 0x7F) << 14; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
            b = this.view[offset++]; part1 |= (b & 0x7F) << 21; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
            b = this.view[offset++]; part2  = (b & 0x7F)      ; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
            b = this.view[offset++]; part2 |= (b & 0x7F) <<  7; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
            throw Error("Buffer overrun"); }}}}}}}}}}
            var value = Long.fromBits(part0 | (part1 << 28), (part1 >>> 4) | (part2) << 24, false);
            if (relative) {
                this.offset = offset;
                return value;
            } else {
                return {
                    'value': value,
                    'length': offset-start
                };
            }
        };

        /**
         * Reads a zig-zag encoded 64bit base 128 variable-length integer. Requires Long.js.
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  read if omitted.
         * @returns {!Long|!{value: Long, length: number}} The value read if offset is omitted, else the value read and
         *  the actual number of bytes read.
         * @throws {Error} If it's not a valid varint
         * @expose
         */
        ByteBufferPrototype.readVarint64ZigZag = function(offset) {
            var val = this.readVarint64(offset);
            if (val && val['value'] instanceof Long)
                val["value"] = ByteBuffer.zigZagDecode64(val["value"]);
            else
                val = ByteBuffer.zigZagDecode64(val);
            return val;
        };

    } // Long


    // types/strings/cstring

    /**
     * Writes a NULL-terminated UTF8 encoded string. For this to work the specified string must not contain any NULL
     *  characters itself.
     * @param {string} str String to write
     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
     *  contained in `str` + 1 if omitted.
     * @returns {!ByteBuffer|number} this if offset is omitted, else the actual number of bytes written
     * @expose
     */
    ByteBufferPrototype.writeCString = function(str, offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        var i,
            k = str.length;
        if (!this.noAssert) {
            if (typeof str !== 'string')
                throw TypeError("Illegal str: Not a string");
            for (i=0; i<k; ++i) {
                if (str.charCodeAt(i) === 0)
                    throw RangeError("Illegal str: Contains NULL-characters");
            }
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        // UTF8 strings do not contain zero bytes in between except for the zero character, so:
        k = utfx.calculateUTF16asUTF8(stringSource(str))[1];
        offset += k+1;
        var capacity12 = this.buffer.byteLength;
        if (offset > capacity12)
            this.resize((capacity12 *= 2) > offset ? capacity12 : offset);
        offset -= k+1;
        utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
            this.view[offset++] = b;
        }.bind(this));
        this.view[offset++] = 0;
        if (relative) {
            this.offset = offset;
            return this;
        }
        return k;
    };

    /**
     * Reads a NULL-terminated UTF8 encoded string. For this to work the string read must not contain any NULL characters
     *  itself.
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
     *  read if omitted.
     * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
     *  read and the actual number of bytes read.
     * @expose
     */
    ByteBufferPrototype.readCString = function(offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 1 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
        }
        var start = offset,
            temp;
        // UTF8 strings do not contain zero bytes in between except for the zero character itself, so:
        var sd, b = -1;
        utfx.decodeUTF8toUTF16(function() {
            if (b === 0) return null;
            if (offset >= this.limit)
                throw RangeError("Illegal range: Truncated data, "+offset+" < "+this.limit);
            b = this.view[offset++];
            return b === 0 ? null : b;
        }.bind(this), sd = stringDestination(), true);
        if (relative) {
            this.offset = offset;
            return sd();
        } else {
            return {
                "string": sd(),
                "length": offset - start
            };
        }
    };

    // types/strings/istring

    /**
     * Writes a length as uint32 prefixed UTF8 encoded string.
     * @param {string} str String to write
     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
     *  written if omitted.
     * @returns {!ByteBuffer|number} `this` if `offset` is omitted, else the actual number of bytes written
     * @expose
     * @see ByteBuffer#writeVarint32
     */
    ByteBufferPrototype.writeIString = function(str, offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof str !== 'string')
                throw TypeError("Illegal str: Not a string");
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        var start = offset,
            k;
        k = utfx.calculateUTF16asUTF8(stringSource(str), this.noAssert)[1];
        offset += 4+k;
        var capacity13 = this.buffer.byteLength;
        if (offset > capacity13)
            this.resize((capacity13 *= 2) > offset ? capacity13 : offset);
        offset -= 4+k;
        if (this.littleEndian) {
            this.view[offset+3] = (k >>> 24) & 0xFF;
            this.view[offset+2] = (k >>> 16) & 0xFF;
            this.view[offset+1] = (k >>>  8) & 0xFF;
            this.view[offset  ] =  k         & 0xFF;
        } else {
            this.view[offset  ] = (k >>> 24) & 0xFF;
            this.view[offset+1] = (k >>> 16) & 0xFF;
            this.view[offset+2] = (k >>>  8) & 0xFF;
            this.view[offset+3] =  k         & 0xFF;
        }
        offset += 4;
        utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
            this.view[offset++] = b;
        }.bind(this));
        if (offset !== start + 4 + k)
            throw RangeError("Illegal range: Truncated data, "+offset+" == "+(offset+4+k));
        if (relative) {
            this.offset = offset;
            return this;
        }
        return offset - start;
    };

    /**
     * Reads a length as uint32 prefixed UTF8 encoded string.
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
     *  read if omitted.
     * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
     *  read and the actual number of bytes read.
     * @expose
     * @see ByteBuffer#readVarint32
     */
    ByteBufferPrototype.readIString = function(offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 4 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+4+") <= "+this.buffer.byteLength);
        }
        var start = offset;
        var len = this.readUint32(offset);
        var str = this.readUTF8String(len, ByteBuffer.METRICS_BYTES, offset += 4);
        offset += str['length'];
        if (relative) {
            this.offset = offset;
            return str['string'];
        } else {
            return {
                'string': str['string'],
                'length': offset - start
            };
        }
    };

    // types/strings/utf8string

    /**
     * Metrics representing number of UTF8 characters. Evaluates to `c`.
     * @type {string}
     * @const
     * @expose
     */
    ByteBuffer.METRICS_CHARS = 'c';

    /**
     * Metrics representing number of bytes. Evaluates to `b`.
     * @type {string}
     * @const
     * @expose
     */
    ByteBuffer.METRICS_BYTES = 'b';

    /**
     * Writes an UTF8 encoded string.
     * @param {string} str String to write
     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} if omitted.
     * @returns {!ByteBuffer|number} this if offset is omitted, else the actual number of bytes written.
     * @expose
     */
    ByteBufferPrototype.writeUTF8String = function(str, offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        var k;
        var start = offset;
        k = utfx.calculateUTF16asUTF8(stringSource(str))[1];
        offset += k;
        var capacity14 = this.buffer.byteLength;
        if (offset > capacity14)
            this.resize((capacity14 *= 2) > offset ? capacity14 : offset);
        offset -= k;
        utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
            this.view[offset++] = b;
        }.bind(this));
        if (relative) {
            this.offset = offset;
            return this;
        }
        return offset - start;
    };

    /**
     * Writes an UTF8 encoded string. This is an alias of {@link ByteBuffer#writeUTF8String}.
     * @function
     * @param {string} str String to write
     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} if omitted.
     * @returns {!ByteBuffer|number} this if offset is omitted, else the actual number of bytes written.
     * @expose
     */
    ByteBufferPrototype.writeString = ByteBufferPrototype.writeUTF8String;

    /**
     * Calculates the number of UTF8 characters of a string. JavaScript itself uses UTF-16, so that a string's
     *  `length` property does not reflect its actual UTF8 size if it contains code points larger than 0xFFFF.
     * @param {string} str String to calculate
     * @returns {number} Number of UTF8 characters
     * @expose
     */
    ByteBuffer.calculateUTF8Chars = function(str) {
        return utfx.calculateUTF16asUTF8(stringSource(str))[0];
    };

    /**
     * Calculates the number of UTF8 bytes of a string.
     * @param {string} str String to calculate
     * @returns {number} Number of UTF8 bytes
     * @expose
     */
    ByteBuffer.calculateUTF8Bytes = function(str) {
        return utfx.calculateUTF16asUTF8(stringSource(str))[1];
    };

    /**
     * Calculates the number of UTF8 bytes of a string. This is an alias of {@link ByteBuffer.calculateUTF8Bytes}.
     * @function
     * @param {string} str String to calculate
     * @returns {number} Number of UTF8 bytes
     * @expose
     */
    ByteBuffer.calculateString = ByteBuffer.calculateUTF8Bytes;

    /**
     * Reads an UTF8 encoded string.
     * @param {number} length Number of characters or bytes to read.
     * @param {string=} metrics Metrics specifying what `length` is meant to count. Defaults to
     *  {@link ByteBuffer.METRICS_CHARS}.
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
     *  read if omitted.
     * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
     *  read and the actual number of bytes read.
     * @expose
     */
    ByteBufferPrototype.readUTF8String = function(length, metrics, offset) {
        if (typeof metrics === 'number') {
            offset = metrics;
            metrics = undefined;
        }
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (typeof metrics === 'undefined') metrics = ByteBuffer.METRICS_CHARS;
        if (!this.noAssert) {
            if (typeof length !== 'number' || length % 1 !== 0)
                throw TypeError("Illegal length: "+length+" (not an integer)");
            length |= 0;
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        var i = 0,
            start = offset,
            sd;
        if (metrics === ByteBuffer.METRICS_CHARS) { // The same for node and the browser
            sd = stringDestination();
            utfx.decodeUTF8(function() {
                return i < length && offset < this.limit ? this.view[offset++] : null;
            }.bind(this), function(cp) {
                ++i; utfx.UTF8toUTF16(cp, sd);
            });
            if (i !== length)
                throw RangeError("Illegal range: Truncated data, "+i+" == "+length);
            if (relative) {
                this.offset = offset;
                return sd();
            } else {
                return {
                    "string": sd(),
                    "length": offset - start
                };
            }
        } else if (metrics === ByteBuffer.METRICS_BYTES) {
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + length > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+length+") <= "+this.buffer.byteLength);
            }
            var k = offset + length;
            utfx.decodeUTF8toUTF16(function() {
                return offset < k ? this.view[offset++] : null;
            }.bind(this), sd = stringDestination(), this.noAssert);
            if (offset !== k)
                throw RangeError("Illegal range: Truncated data, "+offset+" == "+k);
            if (relative) {
                this.offset = offset;
                return sd();
            } else {
                return {
                    'string': sd(),
                    'length': offset - start
                };
            }
        } else
            throw TypeError("Unsupported metrics: "+metrics);
    };

    /**
     * Reads an UTF8 encoded string. This is an alias of {@link ByteBuffer#readUTF8String}.
     * @function
     * @param {number} length Number of characters or bytes to read
     * @param {number=} metrics Metrics specifying what `n` is meant to count. Defaults to
     *  {@link ByteBuffer.METRICS_CHARS}.
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
     *  read if omitted.
     * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
     *  read and the actual number of bytes read.
     * @expose
     */
    ByteBufferPrototype.readString = ByteBufferPrototype.readUTF8String;

    // types/strings/vstring

    /**
     * Writes a length as varint32 prefixed UTF8 encoded string.
     * @param {string} str String to write
     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
     *  written if omitted.
     * @returns {!ByteBuffer|number} `this` if `offset` is omitted, else the actual number of bytes written
     * @expose
     * @see ByteBuffer#writeVarint32
     */
    ByteBufferPrototype.writeVString = function(str, offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof str !== 'string')
                throw TypeError("Illegal str: Not a string");
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        var start = offset,
            k, l;
        k = utfx.calculateUTF16asUTF8(stringSource(str), this.noAssert)[1];
        l = ByteBuffer.calculateVarint32(k);
        offset += l+k;
        var capacity15 = this.buffer.byteLength;
        if (offset > capacity15)
            this.resize((capacity15 *= 2) > offset ? capacity15 : offset);
        offset -= l+k;
        offset += this.writeVarint32(k, offset);
        utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
            this.view[offset++] = b;
        }.bind(this));
        if (offset !== start+k+l)
            throw RangeError("Illegal range: Truncated data, "+offset+" == "+(offset+k+l));
        if (relative) {
            this.offset = offset;
            return this;
        }
        return offset - start;
    };

    /**
     * Reads a length as varint32 prefixed UTF8 encoded string.
     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
     *  read if omitted.
     * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
     *  read and the actual number of bytes read.
     * @expose
     * @see ByteBuffer#readVarint32
     */
    ByteBufferPrototype.readVString = function(offset) {
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 1 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
        }
        var start = offset;
        var len = this.readVarint32(offset);
        var str = this.readUTF8String(len['value'], ByteBuffer.METRICS_BYTES, offset += len['length']);
        offset += str['length'];
        if (relative) {
            this.offset = offset;
            return str['string'];
        } else {
            return {
                'string': str['string'],
                'length': offset - start
            };
        }
    };


    /**
     * Appends some data to this ByteBuffer. This will overwrite any contents behind the specified offset up to the appended
     *  data's length.
     * @param {!ByteBuffer|!ArrayBuffer|!Uint8Array|string} source Data to append. If `source` is a ByteBuffer, its offsets
     *  will be modified according to the performed read operation.
     * @param {(string|number)=} encoding Encoding if `data` is a string ("base64", "hex", "binary", defaults to "utf8")
     * @param {number=} offset Offset to append at. Will use and increase {@link ByteBuffer#offset} by the number of bytes
     *  written if omitted.
     * @returns {!ByteBuffer} this
     * @expose
     * @example A relative `<01 02>03.append(<04 05>)` will result in `<01 02 04 05>, 04 05|`
     * @example An absolute `<01 02>03.append(04 05>, 1)` will result in `<01 04>05, 04 05|`
     */
    ByteBufferPrototype.append = function(source, encoding, offset) {
        if (typeof encoding === 'number' || typeof encoding !== 'string') {
            offset = encoding;
            encoding = undefined;
        }
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        if (!(source instanceof ByteBuffer))
            source = ByteBuffer.wrap(source, encoding);
        var length = source.limit - source.offset;
        if (length <= 0) return this; // Nothing to append
        offset += length;
        var capacity16 = this.buffer.byteLength;
        if (offset > capacity16)
            this.resize((capacity16 *= 2) > offset ? capacity16 : offset);
        offset -= length;
        this.view.set(source.view.subarray(source.offset, source.limit), offset);
        source.offset += length;
        if (relative) this.offset += length;
        return this;
    };

    /**
     * Appends this ByteBuffer's contents to another ByteBuffer. This will overwrite any contents at and after the
        specified offset up to the length of this ByteBuffer's data.
     * @param {!ByteBuffer} target Target ByteBuffer
     * @param {number=} offset Offset to append to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
     *  read if omitted.
     * @returns {!ByteBuffer} this
     * @expose
     * @see ByteBuffer#append
     */
    ByteBufferPrototype.appendTo = function(target, offset) {
        target.append(this, offset);
        return this;
    };

    /**
     * Enables or disables assertions of argument types and offsets. Assertions are enabled by default but you can opt to
     *  disable them if your code already makes sure that everything is valid.
     * @param {boolean} assert `true` to enable assertions, otherwise `false`
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.assert = function(assert) {
        this.noAssert = !assert;
        return this;
    };

    /**
     * Gets the capacity of this ByteBuffer's backing buffer.
     * @returns {number} Capacity of the backing buffer
     * @expose
     */
    ByteBufferPrototype.capacity = function() {
        return this.buffer.byteLength;
    };
    /**
     * Clears this ByteBuffer's offsets by setting {@link ByteBuffer#offset} to `0` and {@link ByteBuffer#limit} to the
     *  backing buffer's capacity. Discards {@link ByteBuffer#markedOffset}.
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.clear = function() {
        this.offset = 0;
        this.limit = this.buffer.byteLength;
        this.markedOffset = -1;
        return this;
    };

    /**
     * Creates a cloned instance of this ByteBuffer, preset with this ByteBuffer's values for {@link ByteBuffer#offset},
     *  {@link ByteBuffer#markedOffset} and {@link ByteBuffer#limit}.
     * @param {boolean=} copy Whether to copy the backing buffer or to return another view on the same, defaults to `false`
     * @returns {!ByteBuffer} Cloned instance
     * @expose
     */
    ByteBufferPrototype.clone = function(copy) {
        var bb = new ByteBuffer(0, this.littleEndian, this.noAssert);
        if (copy) {
            bb.buffer = new ArrayBuffer(this.buffer.byteLength);
            bb.view = new Uint8Array(bb.buffer);
        } else {
            bb.buffer = this.buffer;
            bb.view = this.view;
        }
        bb.offset = this.offset;
        bb.markedOffset = this.markedOffset;
        bb.limit = this.limit;
        return bb;
    };

    /**
     * Compacts this ByteBuffer to be backed by a {@link ByteBuffer#buffer} of its contents' length. Contents are the bytes
     *  between {@link ByteBuffer#offset} and {@link ByteBuffer#limit}. Will set `offset = 0` and `limit = capacity` and
     *  adapt {@link ByteBuffer#markedOffset} to the same relative position if set.
     * @param {number=} begin Offset to start at, defaults to {@link ByteBuffer#offset}
     * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.compact = function(begin, end) {
        if (typeof begin === 'undefined') begin = this.offset;
        if (typeof end === 'undefined') end = this.limit;
        if (!this.noAssert) {
            if (typeof begin !== 'number' || begin % 1 !== 0)
                throw TypeError("Illegal begin: Not an integer");
            begin >>>= 0;
            if (typeof end !== 'number' || end % 1 !== 0)
                throw TypeError("Illegal end: Not an integer");
            end >>>= 0;
            if (begin < 0 || begin > end || end > this.buffer.byteLength)
                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
        }
        if (begin === 0 && end === this.buffer.byteLength)
            return this; // Already compacted
        var len = end - begin;
        if (len === 0) {
            this.buffer = EMPTY_BUFFER;
            this.view = null;
            if (this.markedOffset >= 0) this.markedOffset -= begin;
            this.offset = 0;
            this.limit = 0;
            return this;
        }
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        view.set(this.view.subarray(begin, end));
        this.buffer = buffer;
        this.view = view;
        if (this.markedOffset >= 0) this.markedOffset -= begin;
        this.offset = 0;
        this.limit = len;
        return this;
    };

    /**
     * Creates a copy of this ByteBuffer's contents. Contents are the bytes between {@link ByteBuffer#offset} and
     *  {@link ByteBuffer#limit}.
     * @param {number=} begin Begin offset, defaults to {@link ByteBuffer#offset}.
     * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.
     * @returns {!ByteBuffer} Copy
     * @expose
     */
    ByteBufferPrototype.copy = function(begin, end) {
        if (typeof begin === 'undefined') begin = this.offset;
        if (typeof end === 'undefined') end = this.limit;
        if (!this.noAssert) {
            if (typeof begin !== 'number' || begin % 1 !== 0)
                throw TypeError("Illegal begin: Not an integer");
            begin >>>= 0;
            if (typeof end !== 'number' || end % 1 !== 0)
                throw TypeError("Illegal end: Not an integer");
            end >>>= 0;
            if (begin < 0 || begin > end || end > this.buffer.byteLength)
                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
        }
        if (begin === end)
            return new ByteBuffer(0, this.littleEndian, this.noAssert);
        var capacity = end - begin,
            bb = new ByteBuffer(capacity, this.littleEndian, this.noAssert);
        bb.offset = 0;
        bb.limit = capacity;
        if (bb.markedOffset >= 0) bb.markedOffset -= begin;
        this.copyTo(bb, 0, begin, end);
        return bb;
    };

    /**
     * Copies this ByteBuffer's contents to another ByteBuffer. Contents are the bytes between {@link ByteBuffer#offset} and
     *  {@link ByteBuffer#limit}.
     * @param {!ByteBuffer} target Target ByteBuffer
     * @param {number=} targetOffset Offset to copy to. Will use and increase the target's {@link ByteBuffer#offset}
     *  by the number of bytes copied if omitted.
     * @param {number=} sourceOffset Offset to start copying from. Will use and increase {@link ByteBuffer#offset} by the
     *  number of bytes copied if omitted.
     * @param {number=} sourceLimit Offset to end copying from, defaults to {@link ByteBuffer#limit}
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.copyTo = function(target, targetOffset, sourceOffset, sourceLimit) {
        var relative,
            targetRelative;
        if (!this.noAssert) {
            if (!ByteBuffer.isByteBuffer(target))
                throw TypeError("Illegal target: Not a ByteBuffer");
        }
        targetOffset = (targetRelative = typeof targetOffset === 'undefined') ? target.offset : targetOffset | 0;
        sourceOffset = (relative = typeof sourceOffset === 'undefined') ? this.offset : sourceOffset | 0;
        sourceLimit = typeof sourceLimit === 'undefined' ? this.limit : sourceLimit | 0;

        if (targetOffset < 0 || targetOffset > target.buffer.byteLength)
            throw RangeError("Illegal target range: 0 <= "+targetOffset+" <= "+target.buffer.byteLength);
        if (sourceOffset < 0 || sourceLimit > this.buffer.byteLength)
            throw RangeError("Illegal source range: 0 <= "+sourceOffset+" <= "+this.buffer.byteLength);

        var len = sourceLimit - sourceOffset;
        if (len === 0)
            return target; // Nothing to copy

        target.ensureCapacity(targetOffset + len);

        target.view.set(this.view.subarray(sourceOffset, sourceLimit), targetOffset);

        if (relative) this.offset += len;
        if (targetRelative) target.offset += len;

        return this;
    };

    /**
     * Makes sure that this ByteBuffer is backed by a {@link ByteBuffer#buffer} of at least the specified capacity. If the
     *  current capacity is exceeded, it will be doubled. If double the current capacity is less than the required capacity,
     *  the required capacity will be used instead.
     * @param {number} capacity Required capacity
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.ensureCapacity = function(capacity) {
        var current = this.buffer.byteLength;
        if (current < capacity)
            return this.resize((current *= 2) > capacity ? current : capacity);
        return this;
    };

    /**
     * Overwrites this ByteBuffer's contents with the specified value. Contents are the bytes between
     *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}.
     * @param {number|string} value Byte value to fill with. If given as a string, the first character is used.
     * @param {number=} begin Begin offset. Will use and increase {@link ByteBuffer#offset} by the number of bytes
     *  written if omitted. defaults to {@link ByteBuffer#offset}.
     * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.
     * @returns {!ByteBuffer} this
     * @expose
     * @example `someByteBuffer.clear().fill(0)` fills the entire backing buffer with zeroes
     */
    ByteBufferPrototype.fill = function(value, begin, end) {
        var relative = typeof begin === 'undefined';
        if (relative) begin = this.offset;
        if (typeof value === 'string' && value.length > 0)
            value = value.charCodeAt(0);
        if (typeof begin === 'undefined') begin = this.offset;
        if (typeof end === 'undefined') end = this.limit;
        if (!this.noAssert) {
            if (typeof value !== 'number' || value % 1 !== 0)
                throw TypeError("Illegal value: "+value+" (not an integer)");
            value |= 0;
            if (typeof begin !== 'number' || begin % 1 !== 0)
                throw TypeError("Illegal begin: Not an integer");
            begin >>>= 0;
            if (typeof end !== 'number' || end % 1 !== 0)
                throw TypeError("Illegal end: Not an integer");
            end >>>= 0;
            if (begin < 0 || begin > end || end > this.buffer.byteLength)
                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
        }
        if (begin >= end)
            return this; // Nothing to fill
        while (begin < end) this.view[begin++] = value;
        if (relative) this.offset = begin;
        return this;
    };

    /**
     * Makes this ByteBuffer ready for a new sequence of write or relative read operations. Sets `limit = offset` and
     *  `offset = 0`. Make sure always to flip a ByteBuffer when all relative read or write operations are complete.
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.flip = function() {
        this.limit = this.offset;
        this.offset = 0;
        return this;
    };
    /**
     * Marks an offset on this ByteBuffer to be used later.
     * @param {number=} offset Offset to mark. Defaults to {@link ByteBuffer#offset}.
     * @returns {!ByteBuffer} this
     * @throws {TypeError} If `offset` is not a valid number
     * @throws {RangeError} If `offset` is out of bounds
     * @see ByteBuffer#reset
     * @expose
     */
    ByteBufferPrototype.mark = function(offset) {
        offset = typeof offset === 'undefined' ? this.offset : offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        this.markedOffset = offset;
        return this;
    };
    /**
     * Sets the byte order.
     * @param {boolean} littleEndian `true` for little endian byte order, `false` for big endian
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.order = function(littleEndian) {
        if (!this.noAssert) {
            if (typeof littleEndian !== 'boolean')
                throw TypeError("Illegal littleEndian: Not a boolean");
        }
        this.littleEndian = !!littleEndian;
        return this;
    };

    /**
     * Switches (to) little endian byte order.
     * @param {boolean=} littleEndian Defaults to `true`, otherwise uses big endian
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.LE = function(littleEndian) {
        this.littleEndian = typeof littleEndian !== 'undefined' ? !!littleEndian : true;
        return this;
    };

    /**
     * Switches (to) big endian byte order.
     * @param {boolean=} bigEndian Defaults to `true`, otherwise uses little endian
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.BE = function(bigEndian) {
        this.littleEndian = typeof bigEndian !== 'undefined' ? !bigEndian : false;
        return this;
    };
    /**
     * Prepends some data to this ByteBuffer. This will overwrite any contents before the specified offset up to the
     *  prepended data's length. If there is not enough space available before the specified `offset`, the backing buffer
     *  will be resized and its contents moved accordingly.
     * @param {!ByteBuffer|string|!ArrayBuffer} source Data to prepend. If `source` is a ByteBuffer, its offset will be
     *  modified according to the performed read operation.
     * @param {(string|number)=} encoding Encoding if `data` is a string ("base64", "hex", "binary", defaults to "utf8")
     * @param {number=} offset Offset to prepend at. Will use and decrease {@link ByteBuffer#offset} by the number of bytes
     *  prepended if omitted.
     * @returns {!ByteBuffer} this
     * @expose
     * @example A relative `00<01 02 03>.prepend(<04 05>)` results in `<04 05 01 02 03>, 04 05|`
     * @example An absolute `00<01 02 03>.prepend(<04 05>, 2)` results in `04<05 02 03>, 04 05|`
     */
    ByteBufferPrototype.prepend = function(source, encoding, offset) {
        if (typeof encoding === 'number' || typeof encoding !== 'string') {
            offset = encoding;
            encoding = undefined;
        }
        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: "+offset+" (not an integer)");
            offset >>>= 0;
            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
        }
        if (!(source instanceof ByteBuffer))
            source = ByteBuffer.wrap(source, encoding);
        var len = source.limit - source.offset;
        if (len <= 0) return this; // Nothing to prepend
        var diff = len - offset;
        if (diff > 0) { // Not enough space before offset, so resize + move
            var buffer = new ArrayBuffer(this.buffer.byteLength + diff);
            var view = new Uint8Array(buffer);
            view.set(this.view.subarray(offset, this.buffer.byteLength), len);
            this.buffer = buffer;
            this.view = view;
            this.offset += diff;
            if (this.markedOffset >= 0) this.markedOffset += diff;
            this.limit += diff;
            offset += diff;
        } else {
            var arrayView = new Uint8Array(this.buffer);
        }
        this.view.set(source.view.subarray(source.offset, source.limit), offset - len);

        source.offset = source.limit;
        if (relative)
            this.offset -= len;
        return this;
    };

    /**
     * Prepends this ByteBuffer to another ByteBuffer. This will overwrite any contents before the specified offset up to the
     *  prepended data's length. If there is not enough space available before the specified `offset`, the backing buffer
     *  will be resized and its contents moved accordingly.
     * @param {!ByteBuffer} target Target ByteBuffer
     * @param {number=} offset Offset to prepend at. Will use and decrease {@link ByteBuffer#offset} by the number of bytes
     *  prepended if omitted.
     * @returns {!ByteBuffer} this
     * @expose
     * @see ByteBuffer#prepend
     */
    ByteBufferPrototype.prependTo = function(target, offset) {
        target.prepend(this, offset);
        return this;
    };
    /**
     * Prints debug information about this ByteBuffer's contents.
     * @param {function(string)=} out Output function to call, defaults to console.log
     * @expose
     */
    ByteBufferPrototype.printDebug = function(out) {
        if (typeof out !== 'function') out = console.log.bind(console);
        out(
            this.toString()+"\n"+
            "-------------------------------------------------------------------\n"+
            this.toDebug(/* columns */ true)
        );
    };

    /**
     * Gets the number of remaining readable bytes. Contents are the bytes between {@link ByteBuffer#offset} and
     *  {@link ByteBuffer#limit}, so this returns `limit - offset`.
     * @returns {number} Remaining readable bytes. May be negative if `offset > limit`.
     * @expose
     */
    ByteBufferPrototype.remaining = function() {
        return this.limit - this.offset;
    };
    /**
     * Resets this ByteBuffer's {@link ByteBuffer#offset}. If an offset has been marked through {@link ByteBuffer#mark}
     *  before, `offset` will be set to {@link ByteBuffer#markedOffset}, which will then be discarded. If no offset has been
     *  marked, sets `offset = 0`.
     * @returns {!ByteBuffer} this
     * @see ByteBuffer#mark
     * @expose
     */
    ByteBufferPrototype.reset = function() {
        if (this.markedOffset >= 0) {
            this.offset = this.markedOffset;
            this.markedOffset = -1;
        } else {
            this.offset = 0;
        }
        return this;
    };
    /**
     * Resizes this ByteBuffer to be backed by a buffer of at least the given capacity. Will do nothing if already that
     *  large or larger.
     * @param {number} capacity Capacity required
     * @returns {!ByteBuffer} this
     * @throws {TypeError} If `capacity` is not a number
     * @throws {RangeError} If `capacity < 0`
     * @expose
     */
    ByteBufferPrototype.resize = function(capacity) {
        if (!this.noAssert) {
            if (typeof capacity !== 'number' || capacity % 1 !== 0)
                throw TypeError("Illegal capacity: "+capacity+" (not an integer)");
            capacity |= 0;
            if (capacity < 0)
                throw RangeError("Illegal capacity: 0 <= "+capacity);
        }
        if (this.buffer.byteLength < capacity) {
            var buffer = new ArrayBuffer(capacity);
            var view = new Uint8Array(buffer);
            view.set(this.view);
            this.buffer = buffer;
            this.view = view;
        }
        return this;
    };
    /**
     * Reverses this ByteBuffer's contents.
     * @param {number=} begin Offset to start at, defaults to {@link ByteBuffer#offset}
     * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.reverse = function(begin, end) {
        if (typeof begin === 'undefined') begin = this.offset;
        if (typeof end === 'undefined') end = this.limit;
        if (!this.noAssert) {
            if (typeof begin !== 'number' || begin % 1 !== 0)
                throw TypeError("Illegal begin: Not an integer");
            begin >>>= 0;
            if (typeof end !== 'number' || end % 1 !== 0)
                throw TypeError("Illegal end: Not an integer");
            end >>>= 0;
            if (begin < 0 || begin > end || end > this.buffer.byteLength)
                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
        }
        if (begin === end)
            return this; // Nothing to reverse
        Array.prototype.reverse.call(this.view.subarray(begin, end));
        return this;
    };
    /**
     * Skips the next `length` bytes. This will just advance
     * @param {number} length Number of bytes to skip. May also be negative to move the offset back.
     * @returns {!ByteBuffer} this
     * @expose
     */
    ByteBufferPrototype.skip = function(length) {
        if (!this.noAssert) {
            if (typeof length !== 'number' || length % 1 !== 0)
                throw TypeError("Illegal length: "+length+" (not an integer)");
            length |= 0;
        }
        var offset = this.offset + length;
        if (!this.noAssert) {
            if (offset < 0 || offset > this.buffer.byteLength)
                throw RangeError("Illegal length: 0 <= "+this.offset+" + "+length+" <= "+this.buffer.byteLength);
        }
        this.offset = offset;
        return this;
    };

    /**
     * Slices this ByteBuffer by creating a cloned instance with `offset = begin` and `limit = end`.
     * @param {number=} begin Begin offset, defaults to {@link ByteBuffer#offset}.
     * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.
     * @returns {!ByteBuffer} Clone of this ByteBuffer with slicing applied, backed by the same {@link ByteBuffer#buffer}
     * @expose
     */
    ByteBufferPrototype.slice = function(begin, end) {
        if (typeof begin === 'undefined') begin = this.offset;
        if (typeof end === 'undefined') end = this.limit;
        if (!this.noAssert) {
            if (typeof begin !== 'number' || begin % 1 !== 0)
                throw TypeError("Illegal begin: Not an integer");
            begin >>>= 0;
            if (typeof end !== 'number' || end % 1 !== 0)
                throw TypeError("Illegal end: Not an integer");
            end >>>= 0;
            if (begin < 0 || begin > end || end > this.buffer.byteLength)
                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
        }
        var bb = this.clone();
        bb.offset = begin;
        bb.limit = end;
        return bb;
    };
    /**
     * Returns a copy of the backing buffer that contains this ByteBuffer's contents. Contents are the bytes between
     *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}.
     * @param {boolean=} forceCopy If `true` returns a copy, otherwise returns a view referencing the same memory if
     *  possible. Defaults to `false`
     * @returns {!ArrayBuffer} Contents as an ArrayBuffer
     * @expose
     */
    ByteBufferPrototype.toBuffer = function(forceCopy) {
        var offset = this.offset,
            limit = this.limit;
        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: Not an integer");
            offset >>>= 0;
            if (typeof limit !== 'number' || limit % 1 !== 0)
                throw TypeError("Illegal limit: Not an integer");
            limit >>>= 0;
            if (offset < 0 || offset > limit || limit > this.buffer.byteLength)
                throw RangeError("Illegal range: 0 <= "+offset+" <= "+limit+" <= "+this.buffer.byteLength);
        }
        // NOTE: It's not possible to have another ArrayBuffer reference the same memory as the backing buffer. This is
        // possible with Uint8Array#subarray only, but we have to return an ArrayBuffer by contract. So:
        if (!forceCopy && offset === 0 && limit === this.buffer.byteLength)
            return this.buffer;
        if (offset === limit)
            return EMPTY_BUFFER;
        var buffer = new ArrayBuffer(limit - offset);
        new Uint8Array(buffer).set(new Uint8Array(this.buffer).subarray(offset, limit), 0);
        return buffer;
    };

    /**
     * Returns a raw buffer compacted to contain this ByteBuffer's contents. Contents are the bytes between
     *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}. This is an alias of {@link ByteBuffer#toBuffer}.
     * @function
     * @param {boolean=} forceCopy If `true` returns a copy, otherwise returns a view referencing the same memory.
     *  Defaults to `false`
     * @returns {!ArrayBuffer} Contents as an ArrayBuffer
     * @expose
     */
    ByteBufferPrototype.toArrayBuffer = ByteBufferPrototype.toBuffer;

    /**
     * Converts the ByteBuffer's contents to a string.
     * @param {string=} encoding Output encoding. Returns an informative string representation if omitted but also allows
     *  direct conversion to "utf8", "hex", "base64" and "binary" encoding. "debug" returns a hex representation with
     *  highlighted offsets.
     * @param {number=} begin Offset to begin at, defaults to {@link ByteBuffer#offset}
     * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}
     * @returns {string} String representation
     * @throws {Error} If `encoding` is invalid
     * @expose
     */
    ByteBufferPrototype.toString = function(encoding, begin, end) {
        if (typeof encoding === 'undefined')
            return "ByteBufferAB(offset="+this.offset+",markedOffset="+this.markedOffset+",limit="+this.limit+",capacity="+this.capacity()+")";
        if (typeof encoding === 'number')
            encoding = "utf8",
            begin = encoding,
            end = begin;
        switch (encoding) {
            case "utf8":
                return this.toUTF8(begin, end);
            case "base64":
                return this.toBase64(begin, end);
            case "hex":
                return this.toHex(begin, end);
            case "binary":
                return this.toBinary(begin, end);
            case "debug":
                return this.toDebug();
            case "columns":
                return this.toColumns();
            default:
                throw Error("Unsupported encoding: "+encoding);
        }
    };

    // lxiv-embeddable

    /**
     * lxiv-embeddable (c) 2014 Daniel Wirtz <dcode@dcode.io>
     * Released under the Apache License, Version 2.0
     * see: https://github.com/dcodeIO/lxiv for details
     */
    var lxiv = function() {
        "use strict";

        /**
         * lxiv namespace.
         * @type {!Object.<string,*>}
         * @exports lxiv
         */
        var lxiv = {};

        /**
         * Character codes for output.
         * @type {!Array.<number>}
         * @inner
         */
        var aout = [
            65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
            81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102,
            103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118,
            119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47
        ];

        /**
         * Character codes for input.
         * @type {!Array.<number>}
         * @inner
         */
        var ain = [];
        for (var i=0, k=aout.length; i<k; ++i)
            ain[aout[i]] = i;

        /**
         * Encodes bytes to base64 char codes.
         * @param {!function():number|null} src Bytes source as a function returning the next byte respectively `null` if
         *  there are no more bytes left.
         * @param {!function(number)} dst Characters destination as a function successively called with each encoded char
         *  code.
         */
        lxiv.encode = function(src, dst) {
            var b, t;
            while ((b = src()) !== null) {
                dst(aout[(b>>2)&0x3f]);
                t = (b&0x3)<<4;
                if ((b = src()) !== null) {
                    t |= (b>>4)&0xf;
                    dst(aout[(t|((b>>4)&0xf))&0x3f]);
                    t = (b&0xf)<<2;
                    if ((b = src()) !== null)
                        dst(aout[(t|((b>>6)&0x3))&0x3f]),
                        dst(aout[b&0x3f]);
                    else
                        dst(aout[t&0x3f]),
                        dst(61);
                } else
                    dst(aout[t&0x3f]),
                    dst(61),
                    dst(61);
            }
        };

        /**
         * Decodes base64 char codes to bytes.
         * @param {!function():number|null} src Characters source as a function returning the next char code respectively
         *  `null` if there are no more characters left.
         * @param {!function(number)} dst Bytes destination as a function successively called with the next byte.
         * @throws {Error} If a character code is invalid
         */
        lxiv.decode = function(src, dst) {
            var c, t1, t2;
            function fail(c) {
                throw Error("Illegal character code: "+c);
            }
            while ((c = src()) !== null) {
                t1 = ain[c];
                if (typeof t1 === 'undefined') fail(c);
                if ((c = src()) !== null) {
                    t2 = ain[c];
                    if (typeof t2 === 'undefined') fail(c);
                    dst((t1<<2)>>>0|(t2&0x30)>>4);
                    if ((c = src()) !== null) {
                        t1 = ain[c];
                        if (typeof t1 === 'undefined')
                            if (c === 61) break; else fail(c);
                        dst(((t2&0xf)<<4)>>>0|(t1&0x3c)>>2);
                        if ((c = src()) !== null) {
                            t2 = ain[c];
                            if (typeof t2 === 'undefined')
                                if (c === 61) break; else fail(c);
                            dst(((t1&0x3)<<6)>>>0|t2);
                        }
                    }
                }
            }
        };

        /**
         * Tests if a string is valid base64.
         * @param {string} str String to test
         * @returns {boolean} `true` if valid, otherwise `false`
         */
        lxiv.test = function(str) {
            return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(str);
        };

        return lxiv;
    }();

    // encodings/base64

    /**
     * Encodes this ByteBuffer's contents to a base64 encoded string.
     * @param {number=} begin Offset to begin at, defaults to {@link ByteBuffer#offset}.
     * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}.
     * @returns {string} Base64 encoded string
     * @throws {RangeError} If `begin` or `end` is out of bounds
     * @expose
     */
    ByteBufferPrototype.toBase64 = function(begin, end) {
        if (typeof begin === 'undefined')
            begin = this.offset;
        if (typeof end === 'undefined')
            end = this.limit;
        begin = begin | 0; end = end | 0;
        if (begin < 0 || end > this.capacity || begin > end)
            throw RangeError("begin, end");
        var sd; lxiv.encode(function() {
            return begin < end ? this.view[begin++] : null;
        }.bind(this), sd = stringDestination());
        return sd();
    };

    /**
     * Decodes a base64 encoded string to a ByteBuffer.
     * @param {string} str String to decode
     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
     * @returns {!ByteBuffer} ByteBuffer
     * @expose
     */
    ByteBuffer.fromBase64 = function(str, littleEndian) {
        if (typeof str !== 'string')
            throw TypeError("str");
        var bb = new ByteBuffer(str.length/4*3, littleEndian),
            i = 0;
        lxiv.decode(stringSource(str), function(b) {
            bb.view[i++] = b;
        });
        bb.limit = i;
        return bb;
    };

    /**
     * Encodes a binary string to base64 like `window.btoa` does.
     * @param {string} str Binary string
     * @returns {string} Base64 encoded string
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Window.btoa
     * @expose
     */
    ByteBuffer.btoa = function(str) {
        return ByteBuffer.fromBinary(str).toBase64();
    };

    /**
     * Decodes a base64 encoded string to binary like `window.atob` does.
     * @param {string} b64 Base64 encoded string
     * @returns {string} Binary string
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Window.atob
     * @expose
     */
    ByteBuffer.atob = function(b64) {
        return ByteBuffer.fromBase64(b64).toBinary();
    };

    // encodings/binary

    /**
     * Encodes this ByteBuffer to a binary encoded string, that is using only characters 0x00-0xFF as bytes.
     * @param {number=} begin Offset to begin at. Defaults to {@link ByteBuffer#offset}.
     * @param {number=} end Offset to end at. Defaults to {@link ByteBuffer#limit}.
     * @returns {string} Binary encoded string
     * @throws {RangeError} If `offset > limit`
     * @expose
     */
    ByteBufferPrototype.toBinary = function(begin, end) {
        if (typeof begin === 'undefined')
            begin = this.offset;
        if (typeof end === 'undefined')
            end = this.limit;
        begin |= 0; end |= 0;
        if (begin < 0 || end > this.capacity() || begin > end)
            throw RangeError("begin, end");
        if (begin === end)
            return "";
        var chars = [],
            parts = [];
        while (begin < end) {
            chars.push(this.view[begin++]);
            if (chars.length >= 1024)
                parts.push(String.fromCharCode.apply(String, chars)),
                chars = [];
        }
        return parts.join('') + String.fromCharCode.apply(String, chars);
    };

    /**
     * Decodes a binary encoded string, that is using only characters 0x00-0xFF as bytes, to a ByteBuffer.
     * @param {string} str String to decode
     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
     * @returns {!ByteBuffer} ByteBuffer
     * @expose
     */
    ByteBuffer.fromBinary = function(str, littleEndian) {
        if (typeof str !== 'string')
            throw TypeError("str");
        var i = 0,
            k = str.length,
            charCode,
            bb = new ByteBuffer(k, littleEndian);
        while (i<k) {
            charCode = str.charCodeAt(i);
            if (charCode > 0xff)
                throw RangeError("illegal char code: "+charCode);
            bb.view[i++] = charCode;
        }
        bb.limit = k;
        return bb;
    };

    // encodings/debug

    /**
     * Encodes this ByteBuffer to a hex encoded string with marked offsets. Offset symbols are:
     * * `<` : offset,
     * * `'` : markedOffset,
     * * `>` : limit,
     * * `|` : offset and limit,
     * * `[` : offset and markedOffset,
     * * `]` : markedOffset and limit,
     * * `!` : offset, markedOffset and limit
     * @param {boolean=} columns If `true` returns two columns hex + ascii, defaults to `false`
     * @returns {string|!Array.<string>} Debug string or array of lines if `asArray = true`
     * @expose
     * @example `>00'01 02<03` contains four bytes with `limit=0, markedOffset=1, offset=3`
     * @example `00[01 02 03>` contains four bytes with `offset=markedOffset=1, limit=4`
     * @example `00|01 02 03` contains four bytes with `offset=limit=1, markedOffset=-1`
     * @example `|` contains zero bytes with `offset=limit=0, markedOffset=-1`
     */
    ByteBufferPrototype.toDebug = function(columns) {
        var i = -1,
            k = this.buffer.byteLength,
            b,
            hex = "",
            asc = "",
            out = "";
        while (i<k) {
            if (i !== -1) {
                b = this.view[i];
                if (b < 0x10) hex += "0"+b.toString(16).toUpperCase();
                else hex += b.toString(16).toUpperCase();
                if (columns)
                    asc += b > 32 && b < 127 ? String.fromCharCode(b) : '.';
            }
            ++i;
            if (columns) {
                if (i > 0 && i % 16 === 0 && i !== k) {
                    while (hex.length < 3*16+3) hex += " ";
                    out += hex+asc+"\n";
                    hex = asc = "";
                }
            }
            if (i === this.offset && i === this.limit)
                hex += i === this.markedOffset ? "!" : "|";
            else if (i === this.offset)
                hex += i === this.markedOffset ? "[" : "<";
            else if (i === this.limit)
                hex += i === this.markedOffset ? "]" : ">";
            else
                hex += i === this.markedOffset ? "'" : (columns || (i !== 0 && i !== k) ? " " : "");
        }
        if (columns && hex !== " ") {
            while (hex.length < 3*16+3)
                hex += " ";
            out += hex + asc + "\n";
        }
        return columns ? out : hex;
    };

    /**
     * Decodes a hex encoded string with marked offsets to a ByteBuffer.
     * @param {string} str Debug string to decode (not be generated with `columns = true`)
     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
     * @returns {!ByteBuffer} ByteBuffer
     * @expose
     * @see ByteBuffer#toDebug
     */
    ByteBuffer.fromDebug = function(str, littleEndian, noAssert) {
        var k = str.length,
            bb = new ByteBuffer(((k+1)/3)|0, littleEndian, noAssert);
        var i = 0, j = 0, ch, b,
            rs = false, // Require symbol next
            ho = false, hm = false, hl = false, // Already has offset (ho), markedOffset (hm), limit (hl)?
            fail = false;
        while (i<k) {
            switch (ch = str.charAt(i++)) {
                case '!':
                    if (!noAssert) {
                        if (ho || hm || hl) {
                            fail = true;
                            break;
                        }
                        ho = hm = hl = true;
                    }
                    bb.offset = bb.markedOffset = bb.limit = j;
                    rs = false;
                    break;
                case '|':
                    if (!noAssert) {
                        if (ho || hl) {
                            fail = true;
                            break;
                        }
                        ho = hl = true;
                    }
                    bb.offset = bb.limit = j;
                    rs = false;
                    break;
                case '[':
                    if (!noAssert) {
                        if (ho || hm) {
                            fail = true;
                            break;
                        }
                        ho = hm = true;
                    }
                    bb.offset = bb.markedOffset = j;
                    rs = false;
                    break;
                case '<':
                    if (!noAssert) {
                        if (ho) {
                            fail = true;
                            break;
                        }
                        ho = true;
                    }
                    bb.offset = j;
                    rs = false;
                    break;
                case ']':
                    if (!noAssert) {
                        if (hl || hm) {
                            fail = true;
                            break;
                        }
                        hl = hm = true;
                    }
                    bb.limit = bb.markedOffset = j;
                    rs = false;
                    break;
                case '>':
                    if (!noAssert) {
                        if (hl) {
                            fail = true;
                            break;
                        }
                        hl = true;
                    }
                    bb.limit = j;
                    rs = false;
                    break;
                case "'":
                    if (!noAssert) {
                        if (hm) {
                            fail = true;
                            break;
                        }
                        hm = true;
                    }
                    bb.markedOffset = j;
                    rs = false;
                    break;
                case ' ':
                    rs = false;
                    break;
                default:
                    if (!noAssert) {
                        if (rs) {
                            fail = true;
                            break;
                        }
                    }
                    b = parseInt(ch+str.charAt(i++), 16);
                    if (!noAssert) {
                        if (isNaN(b) || b < 0 || b > 255)
                            throw TypeError("Illegal str: Not a debug encoded string");
                    }
                    bb.view[j++] = b;
                    rs = true;
            }
            if (fail)
                throw TypeError("Illegal str: Invalid symbol at "+i);
        }
        if (!noAssert) {
            if (!ho || !hl)
                throw TypeError("Illegal str: Missing offset or limit");
            if (j<bb.buffer.byteLength)
                throw TypeError("Illegal str: Not a debug encoded string (is it hex?) "+j+" < "+k);
        }
        return bb;
    };

    // encodings/hex

    /**
     * Encodes this ByteBuffer's contents to a hex encoded string.
     * @param {number=} begin Offset to begin at. Defaults to {@link ByteBuffer#offset}.
     * @param {number=} end Offset to end at. Defaults to {@link ByteBuffer#limit}.
     * @returns {string} Hex encoded string
     * @expose
     */
    ByteBufferPrototype.toHex = function(begin, end) {
        begin = typeof begin === 'undefined' ? this.offset : begin;
        end = typeof end === 'undefined' ? this.limit : end;
        if (!this.noAssert) {
            if (typeof begin !== 'number' || begin % 1 !== 0)
                throw TypeError("Illegal begin: Not an integer");
            begin >>>= 0;
            if (typeof end !== 'number' || end % 1 !== 0)
                throw TypeError("Illegal end: Not an integer");
            end >>>= 0;
            if (begin < 0 || begin > end || end > this.buffer.byteLength)
                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
        }
        var out = new Array(end - begin),
            b;
        while (begin < end) {
            b = this.view[begin++];
            if (b < 0x10)
                out.push("0", b.toString(16));
            else out.push(b.toString(16));
        }
        return out.join('');
    };

    /**
     * Decodes a hex encoded string to a ByteBuffer.
     * @param {string} str String to decode
     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
     * @returns {!ByteBuffer} ByteBuffer
     * @expose
     */
    ByteBuffer.fromHex = function(str, littleEndian, noAssert) {
        if (!noAssert) {
            if (typeof str !== 'string')
                throw TypeError("Illegal str: Not a string");
            if (str.length % 2 !== 0)
                throw TypeError("Illegal str: Length not a multiple of 2");
        }
        var k = str.length,
            bb = new ByteBuffer((k / 2) | 0, littleEndian),
            b;
        for (var i=0, j=0; i<k; i+=2) {
            b = parseInt(str.substring(i, i+2), 16);
            if (!noAssert)
                if (!isFinite(b) || b < 0 || b > 255)
                    throw TypeError("Illegal str: Contains non-hex characters");
            bb.view[j++] = b;
        }
        bb.limit = j;
        return bb;
    };

    // utfx-embeddable

    /**
     * utfx-embeddable (c) 2014 Daniel Wirtz <dcode@dcode.io>
     * Released under the Apache License, Version 2.0
     * see: https://github.com/dcodeIO/utfx for details
     */
    var utfx = function() {
        "use strict";

        /**
         * utfx namespace.
         * @inner
         * @type {!Object.<string,*>}
         */
        var utfx = {};

        /**
         * Maximum valid code point.
         * @type {number}
         * @const
         */
        utfx.MAX_CODEPOINT = 0x10FFFF;

        /**
         * Encodes UTF8 code points to UTF8 bytes.
         * @param {(!function():number|null) | number} src Code points source, either as a function returning the next code point
         *  respectively `null` if there are no more code points left or a single numeric code point.
         * @param {!function(number)} dst Bytes destination as a function successively called with the next byte
         */
        utfx.encodeUTF8 = function(src, dst) {
            var cp = null;
            if (typeof src === 'number')
                cp = src,
                src = function() { return null; };
            while (cp !== null || (cp = src()) !== null) {
                if (cp < 0x80)
                    dst(cp&0x7F);
                else if (cp < 0x800)
                    dst(((cp>>6)&0x1F)|0xC0),
                    dst((cp&0x3F)|0x80);
                else if (cp < 0x10000)
                    dst(((cp>>12)&0x0F)|0xE0),
                    dst(((cp>>6)&0x3F)|0x80),
                    dst((cp&0x3F)|0x80);
                else
                    dst(((cp>>18)&0x07)|0xF0),
                    dst(((cp>>12)&0x3F)|0x80),
                    dst(((cp>>6)&0x3F)|0x80),
                    dst((cp&0x3F)|0x80);
                cp = null;
            }
        };

        /**
         * Decodes UTF8 bytes to UTF8 code points.
         * @param {!function():number|null} src Bytes source as a function returning the next byte respectively `null` if there
         *  are no more bytes left.
         * @param {!function(number)} dst Code points destination as a function successively called with each decoded code point.
         * @throws {RangeError} If a starting byte is invalid in UTF8
         * @throws {Error} If the last sequence is truncated. Has an array property `bytes` holding the
         *  remaining bytes.
         */
        utfx.decodeUTF8 = function(src, dst) {
            var a, b, c, d, fail = function(b) {
                b = b.slice(0, b.indexOf(null));
                var err = Error(b.toString());
                err.name = "TruncatedError";
                err['bytes'] = b;
                throw err;
            };
            while ((a = src()) !== null) {
                if ((a&0x80) === 0)
                    dst(a);
                else if ((a&0xE0) === 0xC0)
                    ((b = src()) === null) && fail([a, b]),
                    dst(((a&0x1F)<<6) | (b&0x3F));
                else if ((a&0xF0) === 0xE0)
                    ((b=src()) === null || (c=src()) === null) && fail([a, b, c]),
                    dst(((a&0x0F)<<12) | ((b&0x3F)<<6) | (c&0x3F));
                else if ((a&0xF8) === 0xF0)
                    ((b=src()) === null || (c=src()) === null || (d=src()) === null) && fail([a, b, c ,d]),
                    dst(((a&0x07)<<18) | ((b&0x3F)<<12) | ((c&0x3F)<<6) | (d&0x3F));
                else throw RangeError("Illegal starting byte: "+a);
            }
        };

        /**
         * Converts UTF16 characters to UTF8 code points.
         * @param {!function():number|null} src Characters source as a function returning the next char code respectively
         *  `null` if there are no more characters left.
         * @param {!function(number)} dst Code points destination as a function successively called with each converted code
         *  point.
         */
        utfx.UTF16toUTF8 = function(src, dst) {
            var c1, c2 = null;
            while (true) {
                if ((c1 = c2 !== null ? c2 : src()) === null)
                    break;
                if (c1 >= 0xD800 && c1 <= 0xDFFF) {
                    if ((c2 = src()) !== null) {
                        if (c2 >= 0xDC00 && c2 <= 0xDFFF) {
                            dst((c1-0xD800)*0x400+c2-0xDC00+0x10000);
                            c2 = null; continue;
                        }
                    }
                }
                dst(c1);
            }
            if (c2 !== null) dst(c2);
        };

        /**
         * Converts UTF8 code points to UTF16 characters.
         * @param {(!function():number|null) | number} src Code points source, either as a function returning the next code point
         *  respectively `null` if there are no more code points left or a single numeric code point.
         * @param {!function(number)} dst Characters destination as a function successively called with each converted char code.
         * @throws {RangeError} If a code point is out of range
         */
        utfx.UTF8toUTF16 = function(src, dst) {
            var cp = null;
            if (typeof src === 'number')
                cp = src, src = function() { return null; };
            while (cp !== null || (cp = src()) !== null) {
                if (cp <= 0xFFFF)
                    dst(cp);
                else
                    cp -= 0x10000,
                    dst((cp>>10)+0xD800),
                    dst((cp%0x400)+0xDC00);
                cp = null;
            }
        };

        /**
         * Converts and encodes UTF16 characters to UTF8 bytes.
         * @param {!function():number|null} src Characters source as a function returning the next char code respectively `null`
         *  if there are no more characters left.
         * @param {!function(number)} dst Bytes destination as a function successively called with the next byte.
         */
        utfx.encodeUTF16toUTF8 = function(src, dst) {
            utfx.UTF16toUTF8(src, function(cp) {
                utfx.encodeUTF8(cp, dst);
            });
        };

        /**
         * Decodes and converts UTF8 bytes to UTF16 characters.
         * @param {!function():number|null} src Bytes source as a function returning the next byte respectively `null` if there
         *  are no more bytes left.
         * @param {!function(number)} dst Characters destination as a function successively called with each converted char code.
         * @throws {RangeError} If a starting byte is invalid in UTF8
         * @throws {Error} If the last sequence is truncated. Has an array property `bytes` holding the remaining bytes.
         */
        utfx.decodeUTF8toUTF16 = function(src, dst) {
            utfx.decodeUTF8(src, function(cp) {
                utfx.UTF8toUTF16(cp, dst);
            });
        };

        /**
         * Calculates the byte length of an UTF8 code point.
         * @param {number} cp UTF8 code point
         * @returns {number} Byte length
         */
        utfx.calculateCodePoint = function(cp) {
            return (cp < 0x80) ? 1 : (cp < 0x800) ? 2 : (cp < 0x10000) ? 3 : 4;
        };

        /**
         * Calculates the number of UTF8 bytes required to store UTF8 code points.
         * @param {(!function():number|null)} src Code points source as a function returning the next code point respectively
         *  `null` if there are no more code points left.
         * @returns {number} The number of UTF8 bytes required
         */
        utfx.calculateUTF8 = function(src) {
            var cp, l=0;
            while ((cp = src()) !== null)
                l += (cp < 0x80) ? 1 : (cp < 0x800) ? 2 : (cp < 0x10000) ? 3 : 4;
            return l;
        };

        /**
         * Calculates the number of UTF8 code points respectively UTF8 bytes required to store UTF16 char codes.
         * @param {(!function():number|null)} src Characters source as a function returning the next char code respectively
         *  `null` if there are no more characters left.
         * @returns {!Array.<number>} The number of UTF8 code points at index 0 and the number of UTF8 bytes required at index 1.
         */
        utfx.calculateUTF16asUTF8 = function(src) {
            var n=0, l=0;
            utfx.UTF16toUTF8(src, function(cp) {
                ++n; l += (cp < 0x80) ? 1 : (cp < 0x800) ? 2 : (cp < 0x10000) ? 3 : 4;
            });
            return [n,l];
        };

        return utfx;
    }();

    // encodings/utf8

    /**
     * Encodes this ByteBuffer's contents between {@link ByteBuffer#offset} and {@link ByteBuffer#limit} to an UTF8 encoded
     *  string.
     * @returns {string} Hex encoded string
     * @throws {RangeError} If `offset > limit`
     * @expose
     */
    ByteBufferPrototype.toUTF8 = function(begin, end) {
        if (typeof begin === 'undefined') begin = this.offset;
        if (typeof end === 'undefined') end = this.limit;
        if (!this.noAssert) {
            if (typeof begin !== 'number' || begin % 1 !== 0)
                throw TypeError("Illegal begin: Not an integer");
            begin >>>= 0;
            if (typeof end !== 'number' || end % 1 !== 0)
                throw TypeError("Illegal end: Not an integer");
            end >>>= 0;
            if (begin < 0 || begin > end || end > this.buffer.byteLength)
                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
        }
        var sd; try {
            utfx.decodeUTF8toUTF16(function() {
                return begin < end ? this.view[begin++] : null;
            }.bind(this), sd = stringDestination());
        } catch (e) {
            if (begin !== end)
                throw RangeError("Illegal range: Truncated data, "+begin+" != "+end);
        }
        return sd();
    };

    /**
     * Decodes an UTF8 encoded string to a ByteBuffer.
     * @param {string} str String to decode
     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
     * @returns {!ByteBuffer} ByteBuffer
     * @expose
     */
    ByteBuffer.fromUTF8 = function(str, littleEndian, noAssert) {
        if (!noAssert)
            if (typeof str !== 'string')
                throw TypeError("Illegal str: Not a string");
        var bb = new ByteBuffer(utfx.calculateUTF16asUTF8(stringSource(str), true)[1], littleEndian, noAssert),
            i = 0;
        utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
            bb.view[i++] = b;
        });
        bb.limit = i;
        return bb;
    };

    return ByteBuffer;
});

},{"long":4}],3:[function(require,module,exports){
/*
License gpl-3.0 http://www.gnu.org/licenses/gpl-3.0-standalone.html
*/
/*jslint
    evil: true,
    node: true
*/
'use strict';
/**
 * Clones non native JavaScript functions, or references native functions.
 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
 * @param {Function} func The function to clone.
 * @returns {Function} Returns a clone of the non native function, or a
 *  reference to the native function.
 */
function cloneFunction(func) {
    var out, str;
    try {
        str = func.toString();
        if (/\[native code\]/.test(str)) {
            out = func;
        } else {
            out = eval('(function(){return ' + str + '}());');
        }
    } catch (e) {
        throw new Error(e.message + '\r\n\r\n' + str);
    }
    return out;
}
module.exports = cloneFunction;
},{}],4:[function(require,module,exports){
/*
 Copyright 2013 Daniel Wirtz <dcode@dcode.io>
 Copyright 2009 The Closure Library Authors. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS-IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * @license long.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/long.js for details
 */
(function(global, factory) {

    /* AMD */ if (typeof define === 'function' && define["amd"])
        define([], factory);
    /* CommonJS */ else if (typeof require === 'function' && typeof module === "object" && module && module["exports"])
        module["exports"] = factory();
    /* Global */ else
        (global["dcodeIO"] = global["dcodeIO"] || {})["Long"] = factory();

})(this, function() {
    "use strict";

    /**
     * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
     *  See the from* functions below for more convenient ways of constructing Longs.
     * @exports Long
     * @class A Long class for representing a 64 bit two's-complement integer value.
     * @param {number} low The low (signed) 32 bits of the long
     * @param {number} high The high (signed) 32 bits of the long
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @constructor
     */
    function Long(low, high, unsigned) {

        /**
         * The low 32 bits as a signed value.
         * @type {number}
         */
        this.low = low | 0;

        /**
         * The high 32 bits as a signed value.
         * @type {number}
         */
        this.high = high | 0;

        /**
         * Whether unsigned or not.
         * @type {boolean}
         */
        this.unsigned = !!unsigned;
    }

    // The internal representation of a long is the two given signed, 32-bit values.
    // We use 32-bit pieces because these are the size of integers on which
    // Javascript performs bit-operations.  For operations like addition and
    // multiplication, we split each number into 16 bit pieces, which can easily be
    // multiplied within Javascript's floating-point representation without overflow
    // or change in sign.
    //
    // In the algorithms below, we frequently reduce the negative case to the
    // positive case by negating the input(s) and then post-processing the result.
    // Note that we must ALWAYS check specially whether those values are MIN_VALUE
    // (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
    // a positive number, it overflows back into a negative).  Not handling this
    // case would often result in infinite recursion.
    //
    // Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
    // methods on which they depend.

    /**
     * An indicator used to reliably determine if an object is a Long or not.
     * @type {boolean}
     * @const
     * @private
     */
    Long.prototype.__isLong__;

    Object.defineProperty(Long.prototype, "__isLong__", {
        value: true,
        enumerable: false,
        configurable: false
    });

    /**
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     * @inner
     */
    function isLong(obj) {
        return (obj && obj["__isLong__"]) === true;
    }

    /**
     * Tests if the specified object is a Long.
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     */
    Long.isLong = isLong;

    /**
     * A cache of the Long representations of small integer values.
     * @type {!Object}
     * @inner
     */
    var INT_CACHE = {};

    /**
     * A cache of the Long representations of small unsigned integer values.
     * @type {!Object}
     * @inner
     */
    var UINT_CACHE = {};

    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromInt(value, unsigned) {
        var obj, cachedObj, cache;
        if (unsigned) {
            value >>>= 0;
            if (cache = (0 <= value && value < 256)) {
                cachedObj = UINT_CACHE[value];
                if (cachedObj)
                    return cachedObj;
            }
            obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
            if (cache)
                UINT_CACHE[value] = obj;
            return obj;
        } else {
            value |= 0;
            if (cache = (-128 <= value && value < 128)) {
                cachedObj = INT_CACHE[value];
                if (cachedObj)
                    return cachedObj;
            }
            obj = fromBits(value, value < 0 ? -1 : 0, false);
            if (cache)
                INT_CACHE[value] = obj;
            return obj;
        }
    }

    /**
     * Returns a Long representing the given 32 bit integer value.
     * @function
     * @param {number} value The 32 bit integer in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     */
    Long.fromInt = fromInt;

    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromNumber(value, unsigned) {
        if (isNaN(value) || !isFinite(value))
            return unsigned ? UZERO : ZERO;
        if (unsigned) {
            if (value < 0)
                return UZERO;
            if (value >= TWO_PWR_64_DBL)
                return MAX_UNSIGNED_VALUE;
        } else {
            if (value <= -TWO_PWR_63_DBL)
                return MIN_VALUE;
            if (value + 1 >= TWO_PWR_63_DBL)
                return MAX_VALUE;
        }
        if (value < 0)
            return fromNumber(-value, unsigned).neg();
        return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
    }

    /**
     * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
     * @function
     * @param {number} value The number in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     */
    Long.fromNumber = fromNumber;

    /**
     * @param {number} lowBits
     * @param {number} highBits
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromBits(lowBits, highBits, unsigned) {
        return new Long(lowBits, highBits, unsigned);
    }

    /**
     * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
     *  assumed to use 32 bits.
     * @function
     * @param {number} lowBits The low 32 bits
     * @param {number} highBits The high 32 bits
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     */
    Long.fromBits = fromBits;

    /**
     * @function
     * @param {number} base
     * @param {number} exponent
     * @returns {number}
     * @inner
     */
    var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

    /**
     * @param {string} str
     * @param {(boolean|number)=} unsigned
     * @param {number=} radix
     * @returns {!Long}
     * @inner
     */
    function fromString(str, unsigned, radix) {
        if (str.length === 0)
            throw Error('empty string');
        if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
            return ZERO;
        if (typeof unsigned === 'number') {
            // For goog.math.long compatibility
            radix = unsigned,
            unsigned = false;
        } else {
            unsigned = !! unsigned;
        }
        radix = radix || 10;
        if (radix < 2 || 36 < radix)
            throw RangeError('radix');

        var p;
        if ((p = str.indexOf('-')) > 0)
            throw Error('interior hyphen');
        else if (p === 0) {
            return fromString(str.substring(1), unsigned, radix).neg();
        }

        // Do several (8) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 8));

        var result = ZERO;
        for (var i = 0; i < str.length; i += 8) {
            var size = Math.min(8, str.length - i),
                value = parseInt(str.substring(i, i + size), radix);
            if (size < 8) {
                var power = fromNumber(pow_dbl(radix, size));
                result = result.mul(power).add(fromNumber(value));
            } else {
                result = result.mul(radixToPower);
                result = result.add(fromNumber(value));
            }
        }
        result.unsigned = unsigned;
        return result;
    }

    /**
     * Returns a Long representation of the given string, written using the specified radix.
     * @function
     * @param {string} str The textual representation of the Long
     * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
     * @returns {!Long} The corresponding Long value
     */
    Long.fromString = fromString;

    /**
     * @function
     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
     * @returns {!Long}
     * @inner
     */
    function fromValue(val) {
        if (val /* is compatible */ instanceof Long)
            return val;
        if (typeof val === 'number')
            return fromNumber(val);
        if (typeof val === 'string')
            return fromString(val);
        // Throws for non-objects, converts non-instanceof Long:
        return fromBits(val.low, val.high, val.unsigned);
    }

    /**
     * Converts the specified value to a Long.
     * @function
     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
     * @returns {!Long}
     */
    Long.fromValue = fromValue;

    // NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
    // no runtime penalty for these.

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_16_DBL = 1 << 16;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_24_DBL = 1 << 24;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

    /**
     * @type {!Long}
     * @const
     * @inner
     */
    var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

    /**
     * @type {!Long}
     * @inner
     */
    var ZERO = fromInt(0);

    /**
     * Signed zero.
     * @type {!Long}
     */
    Long.ZERO = ZERO;

    /**
     * @type {!Long}
     * @inner
     */
    var UZERO = fromInt(0, true);

    /**
     * Unsigned zero.
     * @type {!Long}
     */
    Long.UZERO = UZERO;

    /**
     * @type {!Long}
     * @inner
     */
    var ONE = fromInt(1);

    /**
     * Signed one.
     * @type {!Long}
     */
    Long.ONE = ONE;

    /**
     * @type {!Long}
     * @inner
     */
    var UONE = fromInt(1, true);

    /**
     * Unsigned one.
     * @type {!Long}
     */
    Long.UONE = UONE;

    /**
     * @type {!Long}
     * @inner
     */
    var NEG_ONE = fromInt(-1);

    /**
     * Signed negative one.
     * @type {!Long}
     */
    Long.NEG_ONE = NEG_ONE;

    /**
     * @type {!Long}
     * @inner
     */
    var MAX_VALUE = fromBits(0xFFFFFFFF|0, 0x7FFFFFFF|0, false);

    /**
     * Maximum signed value.
     * @type {!Long}
     */
    Long.MAX_VALUE = MAX_VALUE;

    /**
     * @type {!Long}
     * @inner
     */
    var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF|0, 0xFFFFFFFF|0, true);

    /**
     * Maximum unsigned value.
     * @type {!Long}
     */
    Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

    /**
     * @type {!Long}
     * @inner
     */
    var MIN_VALUE = fromBits(0, 0x80000000|0, false);

    /**
     * Minimum signed value.
     * @type {!Long}
     */
    Long.MIN_VALUE = MIN_VALUE;

    /**
     * @alias Long.prototype
     * @inner
     */
    var LongPrototype = Long.prototype;

    /**
     * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
     * @returns {number}
     */
    LongPrototype.toInt = function toInt() {
        return this.unsigned ? this.low >>> 0 : this.low;
    };

    /**
     * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
     * @returns {number}
     */
    LongPrototype.toNumber = function toNumber() {
        if (this.unsigned)
            return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
        return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    };

    /**
     * Converts the Long to a string written in the specified radix.
     * @param {number=} radix Radix (2-36), defaults to 10
     * @returns {string}
     * @override
     * @throws {RangeError} If `radix` is out of range
     */
    LongPrototype.toString = function toString(radix) {
        radix = radix || 10;
        if (radix < 2 || 36 < radix)
            throw RangeError('radix');
        if (this.isZero())
            return '0';
        if (this.isNegative()) { // Unsigned Longs are never negative
            if (this.eq(MIN_VALUE)) {
                // We need to change the Long value before it can be negated, so we remove
                // the bottom-most digit in this base and then recurse to do the rest.
                var radixLong = fromNumber(radix),
                    div = this.div(radixLong),
                    rem1 = div.mul(radixLong).sub(this);
                return div.toString(radix) + rem1.toInt().toString(radix);
            } else
                return '-' + this.neg().toString(radix);
        }

        // Do several (6) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
            rem = this;
        var result = '';
        while (true) {
            var remDiv = rem.div(radixToPower),
                intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
                digits = intval.toString(radix);
            rem = remDiv;
            if (rem.isZero())
                return digits + result;
            else {
                while (digits.length < 6)
                    digits = '0' + digits;
                result = '' + digits + result;
            }
        }
    };

    /**
     * Gets the high 32 bits as a signed integer.
     * @returns {number} Signed high bits
     */
    LongPrototype.getHighBits = function getHighBits() {
        return this.high;
    };

    /**
     * Gets the high 32 bits as an unsigned integer.
     * @returns {number} Unsigned high bits
     */
    LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
        return this.high >>> 0;
    };

    /**
     * Gets the low 32 bits as a signed integer.
     * @returns {number} Signed low bits
     */
    LongPrototype.getLowBits = function getLowBits() {
        return this.low;
    };

    /**
     * Gets the low 32 bits as an unsigned integer.
     * @returns {number} Unsigned low bits
     */
    LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
        return this.low >>> 0;
    };

    /**
     * Gets the number of bits needed to represent the absolute value of this Long.
     * @returns {number}
     */
    LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
        if (this.isNegative()) // Unsigned Longs are never negative
            return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
        var val = this.high != 0 ? this.high : this.low;
        for (var bit = 31; bit > 0; bit--)
            if ((val & (1 << bit)) != 0)
                break;
        return this.high != 0 ? bit + 33 : bit + 1;
    };

    /**
     * Tests if this Long's value equals zero.
     * @returns {boolean}
     */
    LongPrototype.isZero = function isZero() {
        return this.high === 0 && this.low === 0;
    };

    /**
     * Tests if this Long's value is negative.
     * @returns {boolean}
     */
    LongPrototype.isNegative = function isNegative() {
        return !this.unsigned && this.high < 0;
    };

    /**
     * Tests if this Long's value is positive.
     * @returns {boolean}
     */
    LongPrototype.isPositive = function isPositive() {
        return this.unsigned || this.high >= 0;
    };

    /**
     * Tests if this Long's value is odd.
     * @returns {boolean}
     */
    LongPrototype.isOdd = function isOdd() {
        return (this.low & 1) === 1;
    };

    /**
     * Tests if this Long's value is even.
     * @returns {boolean}
     */
    LongPrototype.isEven = function isEven() {
        return (this.low & 1) === 0;
    };

    /**
     * Tests if this Long's value equals the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.equals = function equals(other) {
        if (!isLong(other))
            other = fromValue(other);
        if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
            return false;
        return this.high === other.high && this.low === other.low;
    };

    /**
     * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.eq = LongPrototype.equals;

    /**
     * Tests if this Long's value differs from the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.notEquals = function notEquals(other) {
        return !this.eq(/* validates */ other);
    };

    /**
     * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.neq = LongPrototype.notEquals;

    /**
     * Tests if this Long's value is less than the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lessThan = function lessThan(other) {
        return this.comp(/* validates */ other) < 0;
    };

    /**
     * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lt = LongPrototype.lessThan;

    /**
     * Tests if this Long's value is less than or equal the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
        return this.comp(/* validates */ other) <= 0;
    };

    /**
     * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lte = LongPrototype.lessThanOrEqual;

    /**
     * Tests if this Long's value is greater than the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.greaterThan = function greaterThan(other) {
        return this.comp(/* validates */ other) > 0;
    };

    /**
     * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.gt = LongPrototype.greaterThan;

    /**
     * Tests if this Long's value is greater than or equal the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
        return this.comp(/* validates */ other) >= 0;
    };

    /**
     * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.gte = LongPrototype.greaterThanOrEqual;

    /**
     * Compares this Long's value with the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     */
    LongPrototype.compare = function compare(other) {
        if (!isLong(other))
            other = fromValue(other);
        if (this.eq(other))
            return 0;
        var thisNeg = this.isNegative(),
            otherNeg = other.isNegative();
        if (thisNeg && !otherNeg)
            return -1;
        if (!thisNeg && otherNeg)
            return 1;
        // At this point the sign bits are the same
        if (!this.unsigned)
            return this.sub(other).isNegative() ? -1 : 1;
        // Both are positive if at least one is unsigned
        return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
    };

    /**
     * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     */
    LongPrototype.comp = LongPrototype.compare;

    /**
     * Negates this Long's value.
     * @returns {!Long} Negated Long
     */
    LongPrototype.negate = function negate() {
        if (!this.unsigned && this.eq(MIN_VALUE))
            return MIN_VALUE;
        return this.not().add(ONE);
    };

    /**
     * Negates this Long's value. This is an alias of {@link Long#negate}.
     * @function
     * @returns {!Long} Negated Long
     */
    LongPrototype.neg = LongPrototype.negate;

    /**
     * Returns the sum of this and the specified Long.
     * @param {!Long|number|string} addend Addend
     * @returns {!Long} Sum
     */
    LongPrototype.add = function add(addend) {
        if (!isLong(addend))
            addend = fromValue(addend);

        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;

        var b48 = addend.high >>> 16;
        var b32 = addend.high & 0xFFFF;
        var b16 = addend.low >>> 16;
        var b00 = addend.low & 0xFFFF;

        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 + b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 + b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 + b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 + b48;
        c48 &= 0xFFFF;
        return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    };

    /**
     * Returns the difference of this and the specified Long.
     * @param {!Long|number|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     */
    LongPrototype.subtract = function subtract(subtrahend) {
        if (!isLong(subtrahend))
            subtrahend = fromValue(subtrahend);
        return this.add(subtrahend.neg());
    };

    /**
     * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
     * @function
     * @param {!Long|number|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     */
    LongPrototype.sub = LongPrototype.subtract;

    /**
     * Returns the product of this and the specified Long.
     * @param {!Long|number|string} multiplier Multiplier
     * @returns {!Long} Product
     */
    LongPrototype.multiply = function multiply(multiplier) {
        if (this.isZero())
            return ZERO;
        if (!isLong(multiplier))
            multiplier = fromValue(multiplier);
        if (multiplier.isZero())
            return ZERO;
        if (this.eq(MIN_VALUE))
            return multiplier.isOdd() ? MIN_VALUE : ZERO;
        if (multiplier.eq(MIN_VALUE))
            return this.isOdd() ? MIN_VALUE : ZERO;

        if (this.isNegative()) {
            if (multiplier.isNegative())
                return this.neg().mul(multiplier.neg());
            else
                return this.neg().mul(multiplier).neg();
        } else if (multiplier.isNegative())
            return this.mul(multiplier.neg()).neg();

        // If both longs are small, use float multiplication
        if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
            return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
        // We can skip products that would overflow.

        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;

        var b48 = multiplier.high >>> 16;
        var b32 = multiplier.high & 0xFFFF;
        var b16 = multiplier.low >>> 16;
        var b00 = multiplier.low & 0xFFFF;

        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 * b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 * b00;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c16 += a00 * b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 * b00;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a16 * b16;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a00 * b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
        c48 &= 0xFFFF;
        return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    };

    /**
     * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
     * @function
     * @param {!Long|number|string} multiplier Multiplier
     * @returns {!Long} Product
     */
    LongPrototype.mul = LongPrototype.multiply;

    /**
     * Returns this Long divided by the specified. The result is signed if this Long is signed or
     *  unsigned if this Long is unsigned.
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Quotient
     */
    LongPrototype.divide = function divide(divisor) {
        if (!isLong(divisor))
            divisor = fromValue(divisor);
        if (divisor.isZero())
            throw Error('division by zero');
        if (this.isZero())
            return this.unsigned ? UZERO : ZERO;
        var approx, rem, res;
        if (!this.unsigned) {
            // This section is only relevant for signed longs and is derived from the
            // closure library as a whole.
            if (this.eq(MIN_VALUE)) {
                if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                    return MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
                else if (divisor.eq(MIN_VALUE))
                    return ONE;
                else {
                    // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                    var halfThis = this.shr(1);
                    approx = halfThis.div(divisor).shl(1);
                    if (approx.eq(ZERO)) {
                        return divisor.isNegative() ? ONE : NEG_ONE;
                    } else {
                        rem = this.sub(divisor.mul(approx));
                        res = approx.add(rem.div(divisor));
                        return res;
                    }
                }
            } else if (divisor.eq(MIN_VALUE))
                return this.unsigned ? UZERO : ZERO;
            if (this.isNegative()) {
                if (divisor.isNegative())
                    return this.neg().div(divisor.neg());
                return this.neg().div(divisor).neg();
            } else if (divisor.isNegative())
                return this.div(divisor.neg()).neg();
            res = ZERO;
        } else {
            // The algorithm below has not been made for unsigned longs. It's therefore
            // required to take special care of the MSB prior to running it.
            if (!divisor.unsigned)
                divisor = divisor.toUnsigned();
            if (divisor.gt(this))
                return UZERO;
            if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
                return UONE;
            res = UZERO;
        }

        // Repeat the following until the remainder is less than other:  find a
        // floating-point that approximates remainder / other *from below*, add this
        // into the result, and subtract it from the remainder.  It is critical that
        // the approximate value is less than or equal to the real value so that the
        // remainder never becomes negative.
        rem = this;
        while (rem.gte(divisor)) {
            // Approximate the result of division. This may be a little greater or
            // smaller than the actual value.
            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

            // We will tweak the approximate result by changing it in the 48-th digit or
            // the smallest non-fractional digit, whichever is larger.
            var log2 = Math.ceil(Math.log(approx) / Math.LN2),
                delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48),

            // Decrease the approximation until it is smaller than the remainder.  Note
            // that if it is too large, the product overflows and is negative.
                approxRes = fromNumber(approx),
                approxRem = approxRes.mul(divisor);
            while (approxRem.isNegative() || approxRem.gt(rem)) {
                approx -= delta;
                approxRes = fromNumber(approx, this.unsigned);
                approxRem = approxRes.mul(divisor);
            }

            // We know the answer can't be zero... and actually, zero would cause
            // infinite recursion since we would make no progress.
            if (approxRes.isZero())
                approxRes = ONE;

            res = res.add(approxRes);
            rem = rem.sub(approxRem);
        }
        return res;
    };

    /**
     * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
     * @function
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Quotient
     */
    LongPrototype.div = LongPrototype.divide;

    /**
     * Returns this Long modulo the specified.
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Remainder
     */
    LongPrototype.modulo = function modulo(divisor) {
        if (!isLong(divisor))
            divisor = fromValue(divisor);
        return this.sub(this.div(divisor).mul(divisor));
    };

    /**
     * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
     * @function
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Remainder
     */
    LongPrototype.mod = LongPrototype.modulo;

    /**
     * Returns the bitwise NOT of this Long.
     * @returns {!Long}
     */
    LongPrototype.not = function not() {
        return fromBits(~this.low, ~this.high, this.unsigned);
    };

    /**
     * Returns the bitwise AND of this Long and the specified.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     */
    LongPrototype.and = function and(other) {
        if (!isLong(other))
            other = fromValue(other);
        return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    };

    /**
     * Returns the bitwise OR of this Long and the specified.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     */
    LongPrototype.or = function or(other) {
        if (!isLong(other))
            other = fromValue(other);
        return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    };

    /**
     * Returns the bitwise XOR of this Long and the given one.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     */
    LongPrototype.xor = function xor(other) {
        if (!isLong(other))
            other = fromValue(other);
        return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    };

    /**
     * Returns this Long with bits shifted to the left by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shiftLeft = function shiftLeft(numBits) {
        if (isLong(numBits))
            numBits = numBits.toInt();
        if ((numBits &= 63) === 0)
            return this;
        else if (numBits < 32)
            return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
        else
            return fromBits(0, this.low << (numBits - 32), this.unsigned);
    };

    /**
     * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shl = LongPrototype.shiftLeft;

    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shiftRight = function shiftRight(numBits) {
        if (isLong(numBits))
            numBits = numBits.toInt();
        if ((numBits &= 63) === 0)
            return this;
        else if (numBits < 32)
            return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
        else
            return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
    };

    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shr = LongPrototype.shiftRight;

    /**
     * Returns this Long with bits logically shifted to the right by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
        if (isLong(numBits))
            numBits = numBits.toInt();
        numBits &= 63;
        if (numBits === 0)
            return this;
        else {
            var high = this.high;
            if (numBits < 32) {
                var low = this.low;
                return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
            } else if (numBits === 32)
                return fromBits(high, 0, this.unsigned);
            else
                return fromBits(high >>> (numBits - 32), 0, this.unsigned);
        }
    };

    /**
     * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shru = LongPrototype.shiftRightUnsigned;

    /**
     * Converts this Long to signed.
     * @returns {!Long} Signed long
     */
    LongPrototype.toSigned = function toSigned() {
        if (!this.unsigned)
            return this;
        return fromBits(this.low, this.high, false);
    };

    /**
     * Converts this Long to unsigned.
     * @returns {!Long} Unsigned long
     */
    LongPrototype.toUnsigned = function toUnsigned() {
        if (this.unsigned)
            return this;
        return fromBits(this.low, this.high, true);
    };

    /**
     * Converts this Long to its byte representation.
     * @param {boolean=} le Whether little or big endian, defaults to big endian
     * @returns {!Array.<number>} Byte representation
     */
    LongPrototype.toBytes = function(le) {
        return le ? this.toBytesLE() : this.toBytesBE();
    }

    /**
     * Converts this Long to its little endian byte representation.
     * @returns {!Array.<number>} Little endian byte representation
     */
    LongPrototype.toBytesLE = function() {
        var hi = this.high,
            lo = this.low;
        return [
             lo         & 0xff,
            (lo >>>  8) & 0xff,
            (lo >>> 16) & 0xff,
            (lo >>> 24) & 0xff,
             hi         & 0xff,
            (hi >>>  8) & 0xff,
            (hi >>> 16) & 0xff,
            (hi >>> 24) & 0xff
        ];
    }

    /**
     * Converts this Long to its big endian byte representation.
     * @returns {!Array.<number>} Big endian byte representation
     */
    LongPrototype.toBytesBE = function() {
        var hi = this.high,
            lo = this.low;
        return [
            (hi >>> 24) & 0xff,
            (hi >>> 16) & 0xff,
            (hi >>>  8) & 0xff,
             hi         & 0xff,
            (lo >>> 24) & 0xff,
            (lo >>> 16) & 0xff,
            (lo >>>  8) & 0xff,
             lo         & 0xff
        ];
    }

    return Long;
});

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MiniSignalBinding = (function () {
  function MiniSignalBinding(fn, once, thisArg) {
    if (once === undefined) once = false;

    _classCallCheck(this, MiniSignalBinding);

    this._fn = fn;
    this._once = once;
    this._thisArg = thisArg;
    this._next = this._prev = this._owner = null;
  }

  _createClass(MiniSignalBinding, [{
    key: 'detach',
    value: function detach() {
      if (this._owner === null) return false;
      this._owner.detach(this);
      return true;
    }
  }]);

  return MiniSignalBinding;
})();

function _addMiniSignalBinding(self, node) {
  if (!self._head) {
    self._head = node;
    self._tail = node;
  } else {
    self._tail._next = node;
    node._prev = self._tail;
    self._tail = node;
  }

  node._owner = self;

  return node;
}

var MiniSignal = (function () {
  function MiniSignal() {
    _classCallCheck(this, MiniSignal);

    this._head = this._tail = undefined;
  }

  _createClass(MiniSignal, [{
    key: 'handlers',
    value: function handlers() {
      var exists = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var node = this._head;

      if (exists) return !!node;

      var ee = [];

      while (node) {
        ee.push(node);
        node = node._next;
      }

      return ee;
    }
  }, {
    key: 'has',
    value: function has(node) {
      if (!(node instanceof MiniSignalBinding)) {
        throw new Error('MiniSignal#has(): First arg must be a MiniSignalBinding object.');
      }

      return node._owner === this;
    }
  }, {
    key: 'dispatch',
    value: function dispatch() {
      var node = this._head;

      if (!node) return false;

      while (node) {
        if (node._once) this.detach(node);
        node._fn.apply(node._thisArg, arguments);
        node = node._next;
      }

      return true;
    }
  }, {
    key: 'add',
    value: function add(fn) {
      var thisArg = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if (typeof fn !== 'function') {
        throw new Error('MiniSignal#add(): First arg must be a Function.');
      }
      return _addMiniSignalBinding(this, new MiniSignalBinding(fn, false, thisArg));
    }
  }, {
    key: 'once',
    value: function once(fn) {
      var thisArg = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if (typeof fn !== 'function') {
        throw new Error('MiniSignal#once(): First arg must be a Function.');
      }
      return _addMiniSignalBinding(this, new MiniSignalBinding(fn, true, thisArg));
    }
  }, {
    key: 'detach',
    value: function detach(node) {
      if (!(node instanceof MiniSignalBinding)) {
        throw new Error('MiniSignal#detach(): First arg must be a MiniSignalBinding object.');
      }
      if (node._owner !== this) return this;

      if (node._prev) node._prev._next = node._next;
      if (node._next) node._next._prev = node._prev;

      if (node === this._head) {
        this._head = node._next;
        if (node._next === null) {
          this._tail = null;
        }
      } else if (node === this._tail) {
        this._tail = node._prev;
        this._tail._next = null;
      }

      node._owner = null;
      return this;
    }
  }, {
    key: 'detachAll',
    value: function detachAll() {
      var node = this._head;
      if (!node) return this;

      this._head = this._tail = null;

      while (node) {
        node._owner = null;
        node = node._next;
      }
      return this;
    }
  }]);

  return MiniSignal;
})();

MiniSignal.MiniSignalBinding = MiniSignalBinding;

exports['default'] = MiniSignal;
module.exports = exports['default'];

},{}],6:[function(require,module,exports){
/**
 * Executes a function on each of an objects own enumerable properties. The
 *  callback function will receive three arguments: the value of the current
 *  property, the name of the property, and the object being processed. This is
 *  roughly equivalent to the signature for callbacks to
 *  Array.prototype.forEach.
 * @param {Object} obj The object to act on.
 * @param {Function} callback The function to execute.
 * @returns {Object} Returns the given object.
 */
function objectForeach(obj, callback) {
    "use strict";
    Object.keys(obj).forEach(function (prop) {
        callback(obj[prop], prop, obj);
    });
    return obj;
};
module.exports = objectForeach;
},{}],7:[function(require,module,exports){
/*
License gpl-3.0 http://www.gnu.org/licenses/gpl-3.0-standalone.html
*/
/*jslint
    white: true,
    vars: true,
    node: true
*/
function ObjectMergeOptions(opts) {
    'use strict';
    opts = opts || {};
    this.depth = opts.depth || false;
    // circular ref check is true unless explicitly set to false
    // ignore the jslint warning here, it's pointless.
    this.throwOnCircularRef = 'throwOnCircularRef' in opts && opts.throwOnCircularRef === false ? false : true;
}
/*jslint unparam:true*/
/**
 * Creates a new options object suitable for use with objectMerge.
 * @memberOf objectMerge
 * @param {Object} [opts] An object specifying the options.
 * @param {Object} [opts.depth = false] Specifies the depth to traverse objects
 *  during merging. If this is set to false then there will be no depth limit.
 * @param {Object} [opts.throwOnCircularRef = true] Set to false to suppress
 *  errors on circular references.
 * @returns {ObjectMergeOptions} Returns an instance of ObjectMergeOptions
 *  to be used with objectMerge.
 * @example
 *  var opts = objectMerge.createOptions({
 *      depth : 2,
 *      throwOnCircularRef : false
 *  });
 *  var obj1 = {
 *      a1 : {
 *          a2 : {
 *              a3 : {}
 *          }
 *      }
 *  };
 *  var obj2 = {
 *      a1 : {
 *          a2 : {
 *              a3 : 'will not be in output'
 *          },
 *          a22 : {}
 *      }
 *  };
 *  objectMerge(opts, obj1, obj2);
 */
function createOptions(opts) {
    'use strict';
    var argz = Array.prototype.slice.call(arguments, 0);
    argz.unshift(null);
    var F = ObjectMergeOptions.bind.apply(ObjectMergeOptions, argz);
    return new F();
}
/*jslint unparam:false*/
/**
 * Merges JavaScript objects recursively without altering the objects merged.
 * @namespace Merges JavaScript objects recursively without altering the objects merged.
 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
 * @param {ObjectMergeOptions} [opts] An options object created by 
 *  objectMerge.createOptions. Options must be specified as the first argument
 *  and must be an object created with createOptions or else the object will
 *  not be recognized as an options object and will be merged instead.
 * @param {Object} shadows [[shadows]...] One or more objects to merge. Each
 *  argument given will be treated as an object to merge. Each object
 *  overwrites the previous objects descendant properties if the property name
 *  matches. If objects properties are objects they will be merged recursively
 *  as well.
 * @returns {Object} Returns a single merged object composed from clones of the
 *  input objects.
 * @example
 *  var objectMerge = require('object-merge');
 *  var x = {
 *      a : 'a',
 *      b : 'b',
 *      c : {
 *          d : 'd',
 *          e : 'e',
 *          f : {
 *              g : 'g'
 *          }
 *      }
 *  };
 *  var y = {
 *      a : '`a',
 *      b : '`b',
 *      c : {
 *          d : '`d'
 *      }
 *  };
 *  var z = {
 *      a : {
 *          b : '``b'
 *      },
 *      fun : function foo () {
 *          return 'foo';
 *      },
 *      aps : Array.prototype.slice
 *  };
 *  var out = objectMerge(x, y, z);
 *  // out.a will be {
 *  //         b : '``b'
 *  //     }
 *  // out.b will be '`b'
 *  // out.c will be {
 *  //         d : '`d',
 *  //         e : 'e',
 *  //         f : {
 *  //             g : 'g'
 *  //         }
 *  //     }
 *  // out.fun will be a clone of z.fun
 *  // out.aps will be equal to z.aps
 */
function objectMerge(shadows) {
    'use strict';
    var objectForeach = require('object-foreach');
    var cloneFunction = require('clone-function');
    // this is the queue of visited objects / properties.
    var visited = [];
    // various merge options
    var options = {};
    // gets the sequential trailing objects from array.
    function getShadowObjects(shadows) {
        var out = shadows.reduce(function (collector, shadow) {
                if (shadow instanceof Object) {
                    collector.push(shadow);
                } else {
                    collector = [];
                }
                return collector;
            }, []);
        return out;
    }
    // gets either a new object of the proper type or the last primitive value
    function getOutputObject(shadows) {
        var out;
        var lastShadow = shadows[shadows.length - 1];
        if (lastShadow instanceof Array) {
            out = [];
        } else if (lastShadow instanceof Function) {
            try {
                out = cloneFunction(lastShadow);
            } catch (e) {
                throw new Error(e.message);
            }
        } else if (lastShadow instanceof Object) {
            out = {};
        } else {
            // lastShadow is a primitive value;
            out = lastShadow;
        }
        return out;
    }
    // checks for circular references
    function circularReferenceCheck(shadows) {
        // if any of the current objects to process exist in the queue
        // then throw an error.
        shadows.forEach(function (item) {
            if (item instanceof Object && visited.indexOf(item) > -1) {
                throw new Error('Circular reference error');
            }
        });
        // if none of the current objects were in the queue
        // then add references to the queue.
        visited = visited.concat(shadows);
    }
    function objectMergeRecursor(shadows, currentDepth) {
        if (options.depth !== false) {
            currentDepth = currentDepth ? currentDepth + 1 : 1;
        } else {
            currentDepth = 0;
        }
        if (options.throwOnCircularRef === true) {
            circularReferenceCheck(shadows);
        }
        var out = getOutputObject(shadows);
        /*jslint unparam: true */
        function shadowHandler(val, prop, shadow) {
            if (out[prop]) {
                out[prop] = objectMergeRecursor([
                    out[prop],
                    shadow[prop]
                ], currentDepth);
            } else {
                out[prop] = objectMergeRecursor([shadow[prop]], currentDepth);
            }
        }
        /*jslint unparam:false */
        function shadowMerger(shadow) {
            objectForeach(shadow, shadowHandler);
        }
        // short circuits case where output would be a primitive value
        // anyway.
        if (out instanceof Object && currentDepth <= options.depth) {
            // only merges trailing objects since primitives would wipe out
            // previous objects, as in merging {a:'a'}, 'a', and {b:'b'}
            // would result in {b:'b'} so the first two arguments
            // can be ignored completely.
            var relevantShadows = getShadowObjects(shadows);
            relevantShadows.forEach(shadowMerger);
        }
        return out;
    }
    // determines whether an options object was passed in and
    // uses it if present
    // ignore the jslint warning here too.
    if (arguments[0] instanceof ObjectMergeOptions) {
        options = arguments[0];
        shadows = Array.prototype.slice.call(arguments, 1);
    } else {
        options = createOptions();
        shadows = Array.prototype.slice.call(arguments, 0);
    }
    return objectMergeRecursor(shadows);
}
objectMerge.createOptions = createOptions;
module.exports = objectMerge;
},{"clone-function":3,"object-foreach":6}],8:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],9:[function(require,module,exports){
(function (process){
/*
 Copyright 2013 Daniel Wirtz <dcode@dcode.io>

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * @license protobuf.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/protobuf.js for details
 */
(function(global, factory) {

    /* AMD */ if (typeof define === 'function' && define["amd"])
        define(["bytebuffer"], factory);
    /* CommonJS */ else if (typeof require === "function" && typeof module === "object" && module && module["exports"])
        module["exports"] = factory(require("bytebuffer"), true);
    /* Global */ else
        (global["dcodeIO"] = global["dcodeIO"] || {})["ProtoBuf"] = factory(global["dcodeIO"]["ByteBuffer"]);

})(this, function(ByteBuffer, isCommonJS) {
    "use strict";

    /**
     * The ProtoBuf namespace.
     * @exports ProtoBuf
     * @namespace
     * @expose
     */
    var ProtoBuf = {};

    /**
     * @type {!function(new: ByteBuffer, ...[*])}
     * @expose
     */
    ProtoBuf.ByteBuffer = ByteBuffer;

    /**
     * @type {?function(new: Long, ...[*])}
     * @expose
     */
    ProtoBuf.Long = ByteBuffer.Long || null;

    /**
     * ProtoBuf.js version.
     * @type {string}
     * @const
     * @expose
     */
    ProtoBuf.VERSION = "5.0.3";

    /**
     * Wire types.
     * @type {Object.<string,number>}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES = {};

    /**
     * Varint wire type.
     * @type {number}
     * @expose
     */
    ProtoBuf.WIRE_TYPES.VARINT = 0;

    /**
     * Fixed 64 bits wire type.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES.BITS64 = 1;

    /**
     * Length delimited wire type.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES.LDELIM = 2;

    /**
     * Start group wire type.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES.STARTGROUP = 3;

    /**
     * End group wire type.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES.ENDGROUP = 4;

    /**
     * Fixed 32 bits wire type.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES.BITS32 = 5;

    /**
     * Packable wire types.
     * @type {!Array.<number>}
     * @const
     * @expose
     */
    ProtoBuf.PACKABLE_WIRE_TYPES = [
        ProtoBuf.WIRE_TYPES.VARINT,
        ProtoBuf.WIRE_TYPES.BITS64,
        ProtoBuf.WIRE_TYPES.BITS32
    ];

    /**
     * Types.
     * @dict
     * @type {!Object.<string,{name: string, wireType: number, defaultValue: *}>}
     * @const
     * @expose
     */
    ProtoBuf.TYPES = {
        // According to the protobuf spec.
        "int32": {
            name: "int32",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: 0
        },
        "uint32": {
            name: "uint32",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: 0
        },
        "sint32": {
            name: "sint32",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: 0
        },
        "int64": {
            name: "int64",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.ZERO : undefined
        },
        "uint64": {
            name: "uint64",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.UZERO : undefined
        },
        "sint64": {
            name: "sint64",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.ZERO : undefined
        },
        "bool": {
            name: "bool",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: false
        },
        "double": {
            name: "double",
            wireType: ProtoBuf.WIRE_TYPES.BITS64,
            defaultValue: 0
        },
        "string": {
            name: "string",
            wireType: ProtoBuf.WIRE_TYPES.LDELIM,
            defaultValue: ""
        },
        "bytes": {
            name: "bytes",
            wireType: ProtoBuf.WIRE_TYPES.LDELIM,
            defaultValue: null // overridden in the code, must be a unique instance
        },
        "fixed32": {
            name: "fixed32",
            wireType: ProtoBuf.WIRE_TYPES.BITS32,
            defaultValue: 0
        },
        "sfixed32": {
            name: "sfixed32",
            wireType: ProtoBuf.WIRE_TYPES.BITS32,
            defaultValue: 0
        },
        "fixed64": {
            name: "fixed64",
            wireType: ProtoBuf.WIRE_TYPES.BITS64,
            defaultValue:  ProtoBuf.Long ? ProtoBuf.Long.UZERO : undefined
        },
        "sfixed64": {
            name: "sfixed64",
            wireType: ProtoBuf.WIRE_TYPES.BITS64,
            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.ZERO : undefined
        },
        "float": {
            name: "float",
            wireType: ProtoBuf.WIRE_TYPES.BITS32,
            defaultValue: 0
        },
        "enum": {
            name: "enum",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: 0
        },
        "message": {
            name: "message",
            wireType: ProtoBuf.WIRE_TYPES.LDELIM,
            defaultValue: null
        },
        "group": {
            name: "group",
            wireType: ProtoBuf.WIRE_TYPES.STARTGROUP,
            defaultValue: null
        }
    };

    /**
     * Valid map key types.
     * @type {!Array.<!Object.<string,{name: string, wireType: number, defaultValue: *}>>}
     * @const
     * @expose
     */
    ProtoBuf.MAP_KEY_TYPES = [
        ProtoBuf.TYPES["int32"],
        ProtoBuf.TYPES["sint32"],
        ProtoBuf.TYPES["sfixed32"],
        ProtoBuf.TYPES["uint32"],
        ProtoBuf.TYPES["fixed32"],
        ProtoBuf.TYPES["int64"],
        ProtoBuf.TYPES["sint64"],
        ProtoBuf.TYPES["sfixed64"],
        ProtoBuf.TYPES["uint64"],
        ProtoBuf.TYPES["fixed64"],
        ProtoBuf.TYPES["bool"],
        ProtoBuf.TYPES["string"],
        ProtoBuf.TYPES["bytes"]
    ];

    /**
     * Minimum field id.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.ID_MIN = 1;

    /**
     * Maximum field id.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.ID_MAX = 0x1FFFFFFF;

    /**
     * If set to `true`, field names will be converted from underscore notation to camel case. Defaults to `false`.
     *  Must be set prior to parsing.
     * @type {boolean}
     * @expose
     */
    ProtoBuf.convertFieldsToCamelCase = false;

    /**
     * By default, messages are populated with (setX, set_x) accessors for each field. This can be disabled by
     *  setting this to `false` prior to building messages.
     * @type {boolean}
     * @expose
     */
    ProtoBuf.populateAccessors = true;

    /**
     * By default, messages are populated with default values if a field is not present on the wire. To disable
     *  this behavior, set this setting to `false`.
     * @type {boolean}
     * @expose
     */
    ProtoBuf.populateDefaults = true;

    /**
     * @alias ProtoBuf.Util
     * @expose
     */
    ProtoBuf.Util = (function() {
        "use strict";

        /**
         * ProtoBuf utilities.
         * @exports ProtoBuf.Util
         * @namespace
         */
        var Util = {};

        /**
         * Flag if running in node or not.
         * @type {boolean}
         * @const
         * @expose
         */
        Util.IS_NODE = !!(
            typeof process === 'object' && process+'' === '[object process]' && !process['browser']
        );

        /**
         * Constructs a XMLHttpRequest object.
         * @return {XMLHttpRequest}
         * @throws {Error} If XMLHttpRequest is not supported
         * @expose
         */
        Util.XHR = function() {
            // No dependencies please, ref: http://www.quirksmode.org/js/xmlhttp.html
            var XMLHttpFactories = [
                function () {return new XMLHttpRequest()},
                function () {return new ActiveXObject("Msxml2.XMLHTTP")},
                function () {return new ActiveXObject("Msxml3.XMLHTTP")},
                function () {return new ActiveXObject("Microsoft.XMLHTTP")}
            ];
            /** @type {?XMLHttpRequest} */
            var xhr = null;
            for (var i=0;i<XMLHttpFactories.length;i++) {
                try { xhr = XMLHttpFactories[i](); }
                catch (e) { continue; }
                break;
            }
            if (!xhr)
                throw Error("XMLHttpRequest is not supported");
            return xhr;
        };

        /**
         * Fetches a resource.
         * @param {string} path Resource path
         * @param {function(?string)=} callback Callback receiving the resource's contents. If omitted the resource will
         *   be fetched synchronously. If the request failed, contents will be null.
         * @return {?string|undefined} Resource contents if callback is omitted (null if the request failed), else undefined.
         * @expose
         */
        Util.fetch = function(path, callback) {
            if (callback && typeof callback != 'function')
                callback = null;
            if (Util.IS_NODE) {
                var fs = require("fs");
                if (callback) {
                    fs.readFile(path, function(err, data) {
                        if (err)
                            callback(null);
                        else
                            callback(""+data);
                    });
                } else
                    try {
                        return fs.readFileSync(path);
                    } catch (e) {
                        return null;
                    }
            } else {
                var xhr = Util.XHR();
                xhr.open('GET', path, callback ? true : false);
                // xhr.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
                xhr.setRequestHeader('Accept', 'text/plain');
                if (typeof xhr.overrideMimeType === 'function') xhr.overrideMimeType('text/plain');
                if (callback) {
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState != 4) return;
                        if (/* remote */ xhr.status == 200 || /* local */ (xhr.status == 0 && typeof xhr.responseText === 'string'))
                            callback(xhr.responseText);
                        else
                            callback(null);
                    };
                    if (xhr.readyState == 4)
                        return;
                    xhr.send(null);
                } else {
                    xhr.send(null);
                    if (/* remote */ xhr.status == 200 || /* local */ (xhr.status == 0 && typeof xhr.responseText === 'string'))
                        return xhr.responseText;
                    return null;
                }
            }
        };

        /**
         * Converts a string to camel case.
         * @param {string} str
         * @returns {string}
         * @expose
         */
        Util.toCamelCase = function(str) {
            return str.replace(/_([a-zA-Z])/g, function ($0, $1) {
                return $1.toUpperCase();
            });
        };

        return Util;
    })();

    /**
     * Language expressions.
     * @type {!Object.<string,!RegExp>}
     * @expose
     */
    ProtoBuf.Lang = {

        // Characters always ending a statement
        DELIM: /[\s\{\}=;:\[\],'"\(\)<>]/g,

        // Field rules
        RULE: /^(?:required|optional|repeated|map)$/,

        // Field types
        TYPE: /^(?:double|float|int32|uint32|sint32|int64|uint64|sint64|fixed32|sfixed32|fixed64|sfixed64|bool|string|bytes)$/,

        // Names
        NAME: /^[a-zA-Z_][a-zA-Z_0-9]*$/,

        // Type definitions
        TYPEDEF: /^[a-zA-Z][a-zA-Z_0-9]*$/,

        // Type references
        TYPEREF: /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)(?:\.[a-zA-Z_][a-zA-Z_0-9]*)*$/,

        // Fully qualified type references
        FQTYPEREF: /^(?:\.[a-zA-Z_][a-zA-Z_0-9]*)+$/,

        // All numbers
        NUMBER: /^-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+|([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?)|inf|nan)$/,

        // Decimal numbers
        NUMBER_DEC: /^(?:[1-9][0-9]*|0)$/,

        // Hexadecimal numbers
        NUMBER_HEX: /^0[xX][0-9a-fA-F]+$/,

        // Octal numbers
        NUMBER_OCT: /^0[0-7]+$/,

        // Floating point numbers
        NUMBER_FLT: /^([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?|inf|nan)$/,

        // Booleans
        BOOL: /^(?:true|false)$/i,

        // Id numbers
        ID: /^(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/,

        // Negative id numbers (enum values)
        NEGID: /^\-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/,

        // Whitespaces
        WHITESPACE: /\s/,

        // All strings
        STRING: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")|(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,

        // Double quoted strings
        STRING_DQ: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,

        // Single quoted strings
        STRING_SQ: /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g
    };

    /**
     * @alias ProtoBuf.DotProto
     * @expose
     */
    ProtoBuf.DotProto = (function(ProtoBuf, Lang) {
        "use strict";

        /**
         * Utilities to parse .proto files.
         * @exports ProtoBuf.DotProto
         * @namespace
         */
        var DotProto = {};

        /**
         * Constructs a new Tokenizer.
         * @exports ProtoBuf.DotProto.Tokenizer
         * @class prototype tokenizer
         * @param {string} proto Proto to tokenize
         * @constructor
         */
        var Tokenizer = function(proto) {

            /**
             * Source to parse.
             * @type {string}
             * @expose
             */
            this.source = proto+"";

            /**
             * Current index.
             * @type {number}
             * @expose
             */
            this.index = 0;

            /**
             * Current line.
             * @type {number}
             * @expose
             */
            this.line = 1;

            /**
             * Token stack.
             * @type {!Array.<string>}
             * @expose
             */
            this.stack = [];

            /**
             * Opening character of the current string read, if any.
             * @type {?string}
             * @private
             */
            this._stringOpen = null;
        };

        /**
         * @alias ProtoBuf.DotProto.Tokenizer.prototype
         * @inner
         */
        var TokenizerPrototype = Tokenizer.prototype;

        /**
         * Reads a string beginning at the current index.
         * @return {string}
         * @private
         */
        TokenizerPrototype._readString = function() {
            var re = this._stringOpen === '"'
                ? Lang.STRING_DQ
                : Lang.STRING_SQ;
            re.lastIndex = this.index - 1; // Include the open quote
            var match = re.exec(this.source);
            if (!match)
                throw Error("unterminated string");
            this.index = re.lastIndex;
            this.stack.push(this._stringOpen);
            this._stringOpen = null;
            return match[1];
        };

        /**
         * Gets the next token and advances by one.
         * @return {?string} Token or `null` on EOF
         * @expose
         */
        TokenizerPrototype.next = function() {
            if (this.stack.length > 0)
                return this.stack.shift();
            if (this.index >= this.source.length)
                return null;
            if (this._stringOpen !== null)
                return this._readString();

            var repeat,
                prev,
                next;
            do {
                repeat = false;

                // Strip white spaces
                while (Lang.WHITESPACE.test(next = this.source.charAt(this.index))) {
                    if (next === '\n')
                        ++this.line;
                    if (++this.index === this.source.length)
                        return null;
                }

                // Strip comments
                if (this.source.charAt(this.index) === '/') {
                    ++this.index;
                    if (this.source.charAt(this.index) === '/') { // Line
                        while (this.source.charAt(++this.index) !== '\n')
                            if (this.index == this.source.length)
                                return null;
                        ++this.index;
                        ++this.line;
                        repeat = true;
                    } else if ((next = this.source.charAt(this.index)) === '*') { /* Block */
                        do {
                            if (next === '\n')
                                ++this.line;
                            if (++this.index === this.source.length)
                                return null;
                            prev = next;
                            next = this.source.charAt(this.index);
                        } while (prev !== '*' || next !== '/');
                        ++this.index;
                        repeat = true;
                    } else
                        return '/';
                }
            } while (repeat);

            if (this.index === this.source.length)
                return null;

            // Read the next token
            var end = this.index;
            Lang.DELIM.lastIndex = 0;
            var delim = Lang.DELIM.test(this.source.charAt(end++));
            if (!delim)
                while(end < this.source.length && !Lang.DELIM.test(this.source.charAt(end)))
                    ++end;
            var token = this.source.substring(this.index, this.index = end);
            if (token === '"' || token === "'")
                this._stringOpen = token;
            return token;
        };

        /**
         * Peeks for the next token.
         * @return {?string} Token or `null` on EOF
         * @expose
         */
        TokenizerPrototype.peek = function() {
            if (this.stack.length === 0) {
                var token = this.next();
                if (token === null)
                    return null;
                this.stack.push(token);
            }
            return this.stack[0];
        };

        /**
         * Skips a specific token and throws if it differs.
         * @param {string} expected Expected token
         * @throws {Error} If the actual token differs
         */
        TokenizerPrototype.skip = function(expected) {
            var actual = this.next();
            if (actual !== expected)
                throw Error("illegal '"+actual+"', '"+expected+"' expected");
        };

        /**
         * Omits an optional token.
         * @param {string} expected Expected optional token
         * @returns {boolean} `true` if the token exists
         */
        TokenizerPrototype.omit = function(expected) {
            if (this.peek() === expected) {
                this.next();
                return true;
            }
            return false;
        };

        /**
         * Returns a string representation of this object.
         * @return {string} String representation as of "Tokenizer(index/length)"
         * @expose
         */
        TokenizerPrototype.toString = function() {
            return "Tokenizer ("+this.index+"/"+this.source.length+" at line "+this.line+")";
        };

        /**
         * @alias ProtoBuf.DotProto.Tokenizer
         * @expose
         */
        DotProto.Tokenizer = Tokenizer;

        /**
         * Constructs a new Parser.
         * @exports ProtoBuf.DotProto.Parser
         * @class prototype parser
         * @param {string} source Source
         * @constructor
         */
        var Parser = function(source) {

            /**
             * Tokenizer.
             * @type {!ProtoBuf.DotProto.Tokenizer}
             * @expose
             */
            this.tn = new Tokenizer(source);

            /**
             * Whether parsing proto3 or not.
             * @type {boolean}
             */
            this.proto3 = false;
        };

        /**
         * @alias ProtoBuf.DotProto.Parser.prototype
         * @inner
         */
        var ParserPrototype = Parser.prototype;

        /**
         * Parses the source.
         * @returns {!Object}
         * @throws {Error} If the source cannot be parsed
         * @expose
         */
        ParserPrototype.parse = function() {
            var topLevel = {
                "name": "[ROOT]", // temporary
                "package": null,
                "messages": [],
                "enums": [],
                "imports": [],
                "options": {},
                "services": []
                // "syntax": undefined
            };
            var token,
                head = true,
                weak;
            try {
                while (token = this.tn.next()) {
                    switch (token) {
                        case 'package':
                            if (!head || topLevel["package"] !== null)
                                throw Error("unexpected 'package'");
                            token = this.tn.next();
                            if (!Lang.TYPEREF.test(token))
                                throw Error("illegal package name: " + token);
                            this.tn.skip(";");
                            topLevel["package"] = token;
                            break;
                        case 'import':
                            if (!head)
                                throw Error("unexpected 'import'");
                            token = this.tn.peek();
                            if (token === "public" || (weak = token === "weak")) // token ignored
                                this.tn.next();
                            token = this._readString();
                            this.tn.skip(";");
                            if (!weak) // import ignored
                                topLevel["imports"].push(token);
                            break;
                        case 'syntax':
                            if (!head)
                                throw Error("unexpected 'syntax'");
                            this.tn.skip("=");
                            if ((topLevel["syntax"] = this._readString()) === "proto3")
                                this.proto3 = true;
                            this.tn.skip(";");
                            break;
                        case 'message':
                            this._parseMessage(topLevel, null);
                            head = false;
                            break;
                        case 'enum':
                            this._parseEnum(topLevel);
                            head = false;
                            break;
                        case 'option':
                            this._parseOption(topLevel);
                            break;
                        case 'service':
                            this._parseService(topLevel);
                            break;
                        case 'extend':
                            this._parseExtend(topLevel);
                            break;
                        default:
                            throw Error("unexpected '" + token + "'");
                    }
                }
            } catch (e) {
                e.message = "Parse error at line "+this.tn.line+": " + e.message;
                throw e;
            }
            delete topLevel["name"];
            return topLevel;
        };

        /**
         * Parses the specified source.
         * @returns {!Object}
         * @throws {Error} If the source cannot be parsed
         * @expose
         */
        Parser.parse = function(source) {
            return new Parser(source).parse();
        };

        // ----- Conversion ------

        /**
         * Converts a numerical string to an id.
         * @param {string} value
         * @param {boolean=} mayBeNegative
         * @returns {number}
         * @inner
         */
        function mkId(value, mayBeNegative) {
            var id = -1,
                sign = 1;
            if (value.charAt(0) == '-') {
                sign = -1;
                value = value.substring(1);
            }
            if (Lang.NUMBER_DEC.test(value))
                id = parseInt(value);
            else if (Lang.NUMBER_HEX.test(value))
                id = parseInt(value.substring(2), 16);
            else if (Lang.NUMBER_OCT.test(value))
                id = parseInt(value.substring(1), 8);
            else
                throw Error("illegal id value: " + (sign < 0 ? '-' : '') + value);
            id = (sign*id)|0; // Force to 32bit
            if (!mayBeNegative && id < 0)
                throw Error("illegal id value: " + (sign < 0 ? '-' : '') + value);
            return id;
        }

        /**
         * Converts a numerical string to a number.
         * @param {string} val
         * @returns {number}
         * @inner
         */
        function mkNumber(val) {
            var sign = 1;
            if (val.charAt(0) == '-') {
                sign = -1;
                val = val.substring(1);
            }
            if (Lang.NUMBER_DEC.test(val))
                return sign * parseInt(val, 10);
            else if (Lang.NUMBER_HEX.test(val))
                return sign * parseInt(val.substring(2), 16);
            else if (Lang.NUMBER_OCT.test(val))
                return sign * parseInt(val.substring(1), 8);
            else if (val === 'inf')
                return sign * Infinity;
            else if (val === 'nan')
                return NaN;
            else if (Lang.NUMBER_FLT.test(val))
                return sign * parseFloat(val);
            throw Error("illegal number value: " + (sign < 0 ? '-' : '') + val);
        }

        // ----- Reading ------

        /**
         * Reads a string.
         * @returns {string}
         * @private
         */
        ParserPrototype._readString = function() {
            var value = "",
                token,
                delim;
            do {
                delim = this.tn.next();
                if (delim !== "'" && delim !== '"')
                    throw Error("illegal string delimiter: "+delim);
                value += this.tn.next();
                this.tn.skip(delim);
                token = this.tn.peek();
            } while (token === '"' || token === '"'); // multi line?
            return value;
        };

        /**
         * Reads a value.
         * @param {boolean=} mayBeTypeRef
         * @returns {number|boolean|string}
         * @private
         */
        ParserPrototype._readValue = function(mayBeTypeRef) {
            var token = this.tn.peek(),
                value;
            if (token === '"' || token === "'")
                return this._readString();
            this.tn.next();
            if (Lang.NUMBER.test(token))
                return mkNumber(token);
            if (Lang.BOOL.test(token))
                return (token.toLowerCase() === 'true');
            if (mayBeTypeRef && Lang.TYPEREF.test(token))
                return token;
            throw Error("illegal value: "+token);

        };

        // ----- Parsing constructs -----

        /**
         * Parses a namespace option.
         * @param {!Object} parent Parent definition
         * @param {boolean=} isList
         * @private
         */
        ParserPrototype._parseOption = function(parent, isList) {
            var token = this.tn.next(),
                custom = false;
            if (token === '(') {
                custom = true;
                token = this.tn.next();
            }
            if (!Lang.TYPEREF.test(token))
                // we can allow options of the form google.protobuf.* since they will just get ignored anyways
                // if (!/google\.protobuf\./.test(token)) // FIXME: Why should that not be a valid typeref?
                    throw Error("illegal option name: "+token);
            var name = token;
            if (custom) { // (my_method_option).foo, (my_method_option), some_method_option, (foo.my_option).bar
                this.tn.skip(')');
                name = '('+name+')';
                token = this.tn.peek();
                if (Lang.FQTYPEREF.test(token)) {
                    name += token;
                    this.tn.next();
                }
            }
            this.tn.skip('=');
            this._parseOptionValue(parent, name);
            if (!isList)
                this.tn.skip(";");
        };

        /**
         * Sets an option on the specified options object.
         * @param {!Object.<string,*>} options
         * @param {string} name
         * @param {string|number|boolean} value
         * @inner
         */
        function setOption(options, name, value) {
            if (typeof options[name] === 'undefined')
                options[name] = value;
            else {
                if (!Array.isArray(options[name]))
                    options[name] = [ options[name] ];
                options[name].push(value);
            }
        }

        /**
         * Parses an option value.
         * @param {!Object} parent
         * @param {string} name
         * @private
         */
        ParserPrototype._parseOptionValue = function(parent, name) {
            var token = this.tn.peek();
            if (token !== '{') { // Plain value
                setOption(parent["options"], name, this._readValue(true));
            } else { // Aggregate options
                this.tn.skip("{");
                while ((token = this.tn.next()) !== '}') {
                    if (!Lang.NAME.test(token))
                        throw Error("illegal option name: " + name + "." + token);
                    if (this.tn.omit(":"))
                        setOption(parent["options"], name + "." + token, this._readValue(true));
                    else
                        this._parseOptionValue(parent, name + "." + token);
                }
            }
        };

        /**
         * Parses a service definition.
         * @param {!Object} parent Parent definition
         * @private
         */
        ParserPrototype._parseService = function(parent) {
            var token = this.tn.next();
            if (!Lang.NAME.test(token))
                throw Error("illegal service name at line "+this.tn.line+": "+token);
            var name = token;
            var svc = {
                "name": name,
                "rpc": {},
                "options": {}
            };
            this.tn.skip("{");
            while ((token = this.tn.next()) !== '}') {
                if (token === "option")
                    this._parseOption(svc);
                else if (token === 'rpc')
                    this._parseServiceRPC(svc);
                else
                    throw Error("illegal service token: "+token);
            }
            this.tn.omit(";");
            parent["services"].push(svc);
        };

        /**
         * Parses a RPC service definition of the form ['rpc', name, (request), 'returns', (response)].
         * @param {!Object} svc Service definition
         * @private
         */
        ParserPrototype._parseServiceRPC = function(svc) {
            var type = "rpc",
                token = this.tn.next();
            if (!Lang.NAME.test(token))
                throw Error("illegal rpc service method name: "+token);
            var name = token;
            var method = {
                "request": null,
                "response": null,
                "request_stream": false,
                "response_stream": false,
                "options": {}
            };
            this.tn.skip("(");
            token = this.tn.next();
            if (token.toLowerCase() === "stream") {
              method["request_stream"] = true;
              token = this.tn.next();
            }
            if (!Lang.TYPEREF.test(token))
                throw Error("illegal rpc service request type: "+token);
            method["request"] = token;
            this.tn.skip(")");
            token = this.tn.next();
            if (token.toLowerCase() !== "returns")
                throw Error("illegal rpc service request type delimiter: "+token);
            this.tn.skip("(");
            token = this.tn.next();
            if (token.toLowerCase() === "stream") {
              method["response_stream"] = true;
              token = this.tn.next();
            }
            method["response"] = token;
            this.tn.skip(")");
            token = this.tn.peek();
            if (token === '{') {
                this.tn.next();
                while ((token = this.tn.next()) !== '}') {
                    if (token === 'option')
                        this._parseOption(method);
                    else
                        throw Error("illegal rpc service token: " + token);
                }
                this.tn.omit(";");
            } else
                this.tn.skip(";");
            if (typeof svc[type] === 'undefined')
                svc[type] = {};
            svc[type][name] = method;
        };

        /**
         * Parses a message definition.
         * @param {!Object} parent Parent definition
         * @param {!Object=} fld Field definition if this is a group
         * @returns {!Object}
         * @private
         */
        ParserPrototype._parseMessage = function(parent, fld) {
            var isGroup = !!fld,
                token = this.tn.next();
            var msg = {
                "name": "",
                "fields": [],
                "enums": [],
                "messages": [],
                "options": {},
                "services": [],
                "oneofs": {}
                // "extensions": undefined
            };
            if (!Lang.NAME.test(token))
                throw Error("illegal "+(isGroup ? "group" : "message")+" name: "+token);
            msg["name"] = token;
            if (isGroup) {
                this.tn.skip("=");
                fld["id"] = mkId(this.tn.next());
                msg["isGroup"] = true;
            }
            token = this.tn.peek();
            if (token === '[' && fld)
                this._parseFieldOptions(fld);
            this.tn.skip("{");
            while ((token = this.tn.next()) !== '}') {
                if (Lang.RULE.test(token))
                    this._parseMessageField(msg, token);
                else if (token === "oneof")
                    this._parseMessageOneOf(msg);
                else if (token === "enum")
                    this._parseEnum(msg);
                else if (token === "message")
                    this._parseMessage(msg);
                else if (token === "option")
                    this._parseOption(msg);
                else if (token === "service")
                    this._parseService(msg);
                else if (token === "extensions")
                    if (msg.hasOwnProperty("extensions")) {
                        msg["extensions"] = msg["extensions"].concat(this._parseExtensionRanges())
                    } else {
                        msg["extensions"] = this._parseExtensionRanges();
                    }
                else if (token === "reserved")
                    this._parseIgnored(); // TODO
                else if (token === "extend")
                    this._parseExtend(msg);
                else if (Lang.TYPEREF.test(token)) {
                    if (!this.proto3)
                        throw Error("illegal field rule: "+token);
                    this._parseMessageField(msg, "optional", token);
                } else
                    throw Error("illegal message token: "+token);
            }
            this.tn.omit(";");
            parent["messages"].push(msg);
            return msg;
        };

        /**
         * Parses an ignored statement.
         * @private
         */
        ParserPrototype._parseIgnored = function() {
            while (this.tn.peek() !== ';')
                this.tn.next();
            this.tn.skip(";");
        };

        /**
         * Parses a message field.
         * @param {!Object} msg Message definition
         * @param {string} rule Field rule
         * @param {string=} type Field type if already known (never known for maps)
         * @returns {!Object} Field descriptor
         * @private
         */
        ParserPrototype._parseMessageField = function(msg, rule, type) {
            if (!Lang.RULE.test(rule))
                throw Error("illegal message field rule: "+rule);
            var fld = {
                "rule": rule,
                "type": "",
                "name": "",
                "options": {},
                "id": 0
            };
            var token;
            if (rule === "map") {

                if (type)
                    throw Error("illegal type: " + type);
                this.tn.skip('<');
                token = this.tn.next();
                if (!Lang.TYPE.test(token) && !Lang.TYPEREF.test(token))
                    throw Error("illegal message field type: " + token);
                fld["keytype"] = token;
                this.tn.skip(',');
                token = this.tn.next();
                if (!Lang.TYPE.test(token) && !Lang.TYPEREF.test(token))
                    throw Error("illegal message field: " + token);
                fld["type"] = token;
                this.tn.skip('>');
                token = this.tn.next();
                if (!Lang.NAME.test(token))
                    throw Error("illegal message field name: " + token);
                fld["name"] = token;
                this.tn.skip("=");
                fld["id"] = mkId(this.tn.next());
                token = this.tn.peek();
                if (token === '[')
                    this._parseFieldOptions(fld);
                this.tn.skip(";");

            } else {

                type = typeof type !== 'undefined' ? type : this.tn.next();

                if (type === "group") {

                    // "A [legacy] group simply combines a nested message type and a field into a single declaration. In your
                    // code, you can treat this message just as if it had a Result type field called result (the latter name is
                    // converted to lower-case so that it does not conflict with the former)."
                    var grp = this._parseMessage(msg, fld);
                    if (!/^[A-Z]/.test(grp["name"]))
                        throw Error('illegal group name: '+grp["name"]);
                    fld["type"] = grp["name"];
                    fld["name"] = grp["name"].toLowerCase();
                    this.tn.omit(";");

                } else {

                    if (!Lang.TYPE.test(type) && !Lang.TYPEREF.test(type))
                        throw Error("illegal message field type: " + type);
                    fld["type"] = type;
                    token = this.tn.next();
                    if (!Lang.NAME.test(token))
                        throw Error("illegal message field name: " + token);
                    fld["name"] = token;
                    this.tn.skip("=");
                    fld["id"] = mkId(this.tn.next());
                    token = this.tn.peek();
                    if (token === "[")
                        this._parseFieldOptions(fld);
                    this.tn.skip(";");

                }
            }
            msg["fields"].push(fld);
            return fld;
        };

        /**
         * Parses a message oneof.
         * @param {!Object} msg Message definition
         * @private
         */
        ParserPrototype._parseMessageOneOf = function(msg) {
            var token = this.tn.next();
            if (!Lang.NAME.test(token))
                throw Error("illegal oneof name: "+token);
            var name = token,
                fld;
            var fields = [];
            this.tn.skip("{");
            while ((token = this.tn.next()) !== "}") {
                fld = this._parseMessageField(msg, "optional", token);
                fld["oneof"] = name;
                fields.push(fld["id"]);
            }
            this.tn.omit(";");
            msg["oneofs"][name] = fields;
        };

        /**
         * Parses a set of field option definitions.
         * @param {!Object} fld Field definition
         * @private
         */
        ParserPrototype._parseFieldOptions = function(fld) {
            this.tn.skip("[");
            var token,
                first = true;
            while ((token = this.tn.peek()) !== ']') {
                if (!first)
                    this.tn.skip(",");
                this._parseOption(fld, true);
                first = false;
            }
            this.tn.next();
        };

        /**
         * Parses an enum.
         * @param {!Object} msg Message definition
         * @private
         */
        ParserPrototype._parseEnum = function(msg) {
            var enm = {
                "name": "",
                "values": [],
                "options": {}
            };
            var token = this.tn.next();
            if (!Lang.NAME.test(token))
                throw Error("illegal name: "+token);
            enm["name"] = token;
            this.tn.skip("{");
            while ((token = this.tn.next()) !== '}') {
                if (token === "option")
                    this._parseOption(enm);
                else {
                    if (!Lang.NAME.test(token))
                        throw Error("illegal name: "+token);
                    this.tn.skip("=");
                    var val = {
                        "name": token,
                        "id": mkId(this.tn.next(), true)
                    };
                    token = this.tn.peek();
                    if (token === "[")
                        this._parseFieldOptions({ "options": {} });
                    this.tn.skip(";");
                    enm["values"].push(val);
                }
            }
            this.tn.omit(";");
            msg["enums"].push(enm);
        };

        /**
         * Parses extension / reserved ranges.
         * @returns {!Array.<!Array.<number>>}
         * @private
         */
        ParserPrototype._parseExtensionRanges = function() {
            var ranges = [];
            var token,
                range,
                value;
            do {
                range = [];
                while (true) {
                    token = this.tn.next();
                    switch (token) {
                        case "min":
                            value = ProtoBuf.ID_MIN;
                            break;
                        case "max":
                            value = ProtoBuf.ID_MAX;
                            break;
                        default:
                            value = mkNumber(token);
                            break;
                    }
                    range.push(value);
                    if (range.length === 2)
                        break;
                    if (this.tn.peek() !== "to") {
                        range.push(value);
                        break;
                    }
                    this.tn.next();
                }
                ranges.push(range);
            } while (this.tn.omit(","));
            this.tn.skip(";");
            return ranges;
        };

        /**
         * Parses an extend block.
         * @param {!Object} parent Parent object
         * @private
         */
        ParserPrototype._parseExtend = function(parent) {
            var token = this.tn.next();
            if (!Lang.TYPEREF.test(token))
                throw Error("illegal extend reference: "+token);
            var ext = {
                "ref": token,
                "fields": []
            };
            this.tn.skip("{");
            while ((token = this.tn.next()) !== '}') {
                if (Lang.RULE.test(token))
                    this._parseMessageField(ext, token);
                else if (Lang.TYPEREF.test(token)) {
                    if (!this.proto3)
                        throw Error("illegal field rule: "+token);
                    this._parseMessageField(ext, "optional", token);
                } else
                    throw Error("illegal extend token: "+token);
            }
            this.tn.omit(";");
            parent["messages"].push(ext);
            return ext;
        };

        // ----- General -----

        /**
         * Returns a string representation of this parser.
         * @returns {string}
         */
        ParserPrototype.toString = function() {
            return "Parser at line "+this.tn.line;
        };

        /**
         * @alias ProtoBuf.DotProto.Parser
         * @expose
         */
        DotProto.Parser = Parser;

        return DotProto;

    })(ProtoBuf, ProtoBuf.Lang);

    /**
     * @alias ProtoBuf.Reflect
     * @expose
     */
    ProtoBuf.Reflect = (function(ProtoBuf) {
        "use strict";

        /**
         * Reflection types.
         * @exports ProtoBuf.Reflect
         * @namespace
         */
        var Reflect = {};

        /**
         * Constructs a Reflect base class.
         * @exports ProtoBuf.Reflect.T
         * @constructor
         * @abstract
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {?ProtoBuf.Reflect.T} parent Parent object
         * @param {string} name Object name
         */
        var T = function(builder, parent, name) {

            /**
             * Builder reference.
             * @type {!ProtoBuf.Builder}
             * @expose
             */
            this.builder = builder;

            /**
             * Parent object.
             * @type {?ProtoBuf.Reflect.T}
             * @expose
             */
            this.parent = parent;

            /**
             * Object name in namespace.
             * @type {string}
             * @expose
             */
            this.name = name;

            /**
             * Fully qualified class name
             * @type {string}
             * @expose
             */
            this.className;
        };

        /**
         * @alias ProtoBuf.Reflect.T.prototype
         * @inner
         */
        var TPrototype = T.prototype;

        /**
         * Returns the fully qualified name of this object.
         * @returns {string} Fully qualified name as of ".PATH.TO.THIS"
         * @expose
         */
        TPrototype.fqn = function() {
            var name = this.name,
                ptr = this;
            do {
                ptr = ptr.parent;
                if (ptr == null)
                    break;
                name = ptr.name+"."+name;
            } while (true);
            return name;
        };

        /**
         * Returns a string representation of this Reflect object (its fully qualified name).
         * @param {boolean=} includeClass Set to true to include the class name. Defaults to false.
         * @return String representation
         * @expose
         */
        TPrototype.toString = function(includeClass) {
            return (includeClass ? this.className + " " : "") + this.fqn();
        };

        /**
         * Builds this type.
         * @throws {Error} If this type cannot be built directly
         * @expose
         */
        TPrototype.build = function() {
            throw Error(this.toString(true)+" cannot be built directly");
        };

        /**
         * @alias ProtoBuf.Reflect.T
         * @expose
         */
        Reflect.T = T;

        /**
         * Constructs a new Namespace.
         * @exports ProtoBuf.Reflect.Namespace
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {?ProtoBuf.Reflect.Namespace} parent Namespace parent
         * @param {string} name Namespace name
         * @param {Object.<string,*>=} options Namespace options
         * @param {string?} syntax The syntax level of this definition (e.g., proto3)
         * @constructor
         * @extends ProtoBuf.Reflect.T
         */
        var Namespace = function(builder, parent, name, options, syntax) {
            T.call(this, builder, parent, name);

            /**
             * @override
             */
            this.className = "Namespace";

            /**
             * Children inside the namespace.
             * @type {!Array.<ProtoBuf.Reflect.T>}
             */
            this.children = [];

            /**
             * Options.
             * @type {!Object.<string, *>}
             */
            this.options = options || {};

            /**
             * Syntax level (e.g., proto2 or proto3).
             * @type {!string}
             */
            this.syntax = syntax || "proto2";
        };

        /**
         * @alias ProtoBuf.Reflect.Namespace.prototype
         * @inner
         */
        var NamespacePrototype = Namespace.prototype = Object.create(T.prototype);

        /**
         * Returns an array of the namespace's children.
         * @param {ProtoBuf.Reflect.T=} type Filter type (returns instances of this type only). Defaults to null (all children).
         * @return {Array.<ProtoBuf.Reflect.T>}
         * @expose
         */
        NamespacePrototype.getChildren = function(type) {
            type = type || null;
            if (type == null)
                return this.children.slice();
            var children = [];
            for (var i=0, k=this.children.length; i<k; ++i)
                if (this.children[i] instanceof type)
                    children.push(this.children[i]);
            return children;
        };

        /**
         * Adds a child to the namespace.
         * @param {ProtoBuf.Reflect.T} child Child
         * @throws {Error} If the child cannot be added (duplicate)
         * @expose
         */
        NamespacePrototype.addChild = function(child) {
            var other;
            if (other = this.getChild(child.name)) {
                // Try to revert camelcase transformation on collision
                if (other instanceof Message.Field && other.name !== other.originalName && this.getChild(other.originalName) === null)
                    other.name = other.originalName; // Revert previous first (effectively keeps both originals)
                else if (child instanceof Message.Field && child.name !== child.originalName && this.getChild(child.originalName) === null)
                    child.name = child.originalName;
                else
                    throw Error("Duplicate name in namespace "+this.toString(true)+": "+child.name);
            }
            this.children.push(child);
        };

        /**
         * Gets a child by its name or id.
         * @param {string|number} nameOrId Child name or id
         * @return {?ProtoBuf.Reflect.T} The child or null if not found
         * @expose
         */
        NamespacePrototype.getChild = function(nameOrId) {
            var key = typeof nameOrId === 'number' ? 'id' : 'name';
            for (var i=0, k=this.children.length; i<k; ++i)
                if (this.children[i][key] === nameOrId)
                    return this.children[i];
            return null;
        };

        /**
         * Resolves a reflect object inside of this namespace.
         * @param {string|!Array.<string>} qn Qualified name to resolve
         * @param {boolean=} excludeNonNamespace Excludes non-namespace types, defaults to `false`
         * @return {?ProtoBuf.Reflect.Namespace} The resolved type or null if not found
         * @expose
         */
        NamespacePrototype.resolve = function(qn, excludeNonNamespace) {
            var part = typeof qn === 'string' ? qn.split(".") : qn,
                ptr = this,
                i = 0;
            if (part[i] === "") { // Fully qualified name, e.g. ".My.Message'
                while (ptr.parent !== null)
                    ptr = ptr.parent;
                i++;
            }
            var child;
            do {
                do {
                    if (!(ptr instanceof Reflect.Namespace)) {
                        ptr = null;
                        break;
                    }
                    child = ptr.getChild(part[i]);
                    if (!child || !(child instanceof Reflect.T) || (excludeNonNamespace && !(child instanceof Reflect.Namespace))) {
                        ptr = null;
                        break;
                    }
                    ptr = child; i++;
                } while (i < part.length);
                if (ptr != null)
                    break; // Found
                // Else search the parent
                if (this.parent !== null)
                    return this.parent.resolve(qn, excludeNonNamespace);
            } while (ptr != null);
            return ptr;
        };

        /**
         * Determines the shortest qualified name of the specified type, if any, relative to this namespace.
         * @param {!ProtoBuf.Reflect.T} t Reflection type
         * @returns {string} The shortest qualified name or, if there is none, the fqn
         * @expose
         */
        NamespacePrototype.qn = function(t) {
            var part = [], ptr = t;
            do {
                part.unshift(ptr.name);
                ptr = ptr.parent;
            } while (ptr !== null);
            for (var len=1; len <= part.length; len++) {
                var qn = part.slice(part.length-len);
                if (t === this.resolve(qn, t instanceof Reflect.Namespace))
                    return qn.join(".");
            }
            return t.fqn();
        };

        /**
         * Builds the namespace and returns the runtime counterpart.
         * @return {Object.<string,Function|Object>} Runtime namespace
         * @expose
         */
        NamespacePrototype.build = function() {
            /** @dict */
            var ns = {};
            var children = this.children;
            for (var i=0, k=children.length, child; i<k; ++i) {
                child = children[i];
                if (child instanceof Namespace)
                    ns[child.name] = child.build();
            }
            if (Object.defineProperty)
                Object.defineProperty(ns, "$options", { "value": this.buildOpt() });
            return ns;
        };

        /**
         * Builds the namespace's '$options' property.
         * @return {Object.<string,*>}
         */
        NamespacePrototype.buildOpt = function() {
            var opt = {},
                keys = Object.keys(this.options);
            for (var i=0, k=keys.length; i<k; ++i) {
                var key = keys[i],
                    val = this.options[keys[i]];
                // TODO: Options are not resolved, yet.
                // if (val instanceof Namespace) {
                //     opt[key] = val.build();
                // } else {
                opt[key] = val;
                // }
            }
            return opt;
        };

        /**
         * Gets the value assigned to the option with the specified name.
         * @param {string=} name Returns the option value if specified, otherwise all options are returned.
         * @return {*|Object.<string,*>}null} Option value or NULL if there is no such option
         */
        NamespacePrototype.getOption = function(name) {
            if (typeof name === 'undefined')
                return this.options;
            return typeof this.options[name] !== 'undefined' ? this.options[name] : null;
        };

        /**
         * @alias ProtoBuf.Reflect.Namespace
         * @expose
         */
        Reflect.Namespace = Namespace;

        /**
         * Constructs a new Element implementation that checks and converts values for a
         * particular field type, as appropriate.
         *
         * An Element represents a single value: either the value of a singular field,
         * or a value contained in one entry of a repeated field or map field. This
         * class does not implement these higher-level concepts; it only encapsulates
         * the low-level typechecking and conversion.
         *
         * @exports ProtoBuf.Reflect.Element
         * @param {{name: string, wireType: number}} type Resolved data type
         * @param {ProtoBuf.Reflect.T|null} resolvedType Resolved type, if relevant
         * (e.g. submessage field).
         * @param {boolean} isMapKey Is this element a Map key? The value will be
         * converted to string form if so.
         * @param {string} syntax Syntax level of defining message type, e.g.,
         * proto2 or proto3.
         * @param {string} name Name of the field containing this element (for error
         * messages)
         * @constructor
         */
        var Element = function(type, resolvedType, isMapKey, syntax, name) {

            /**
             * Element type, as a string (e.g., int32).
             * @type {{name: string, wireType: number}}
             */
            this.type = type;

            /**
             * Element type reference to submessage or enum definition, if needed.
             * @type {ProtoBuf.Reflect.T|null}
             */
            this.resolvedType = resolvedType;

            /**
             * Element is a map key.
             * @type {boolean}
             */
            this.isMapKey = isMapKey;

            /**
             * Syntax level of defining message type, e.g., proto2 or proto3.
             * @type {string}
             */
            this.syntax = syntax;

            /**
             * Name of the field containing this element (for error messages)
             * @type {string}
             */
            this.name = name;

            if (isMapKey && ProtoBuf.MAP_KEY_TYPES.indexOf(type) < 0)
                throw Error("Invalid map key type: " + type.name);
        };

        var ElementPrototype = Element.prototype;

        /**
         * Obtains a (new) default value for the specified type.
         * @param type {string|{name: string, wireType: number}} Field type
         * @returns {*} Default value
         * @inner
         */
        function mkDefault(type) {
            if (typeof type === 'string')
                type = ProtoBuf.TYPES[type];
            if (typeof type.defaultValue === 'undefined')
                throw Error("default value for type "+type.name+" is not supported");
            if (type == ProtoBuf.TYPES["bytes"])
                return new ByteBuffer(0);
            return type.defaultValue;
        }

        /**
         * Returns the default value for this field in proto3.
         * @function
         * @param type {string|{name: string, wireType: number}} the field type
         * @returns {*} Default value
         */
        Element.defaultFieldValue = mkDefault;

        /**
         * Makes a Long from a value.
         * @param {{low: number, high: number, unsigned: boolean}|string|number} value Value
         * @param {boolean=} unsigned Whether unsigned or not, defaults to reuse it from Long-like objects or to signed for
         *  strings and numbers
         * @returns {!Long}
         * @throws {Error} If the value cannot be converted to a Long
         * @inner
         */
        function mkLong(value, unsigned) {
            if (value && typeof value.low === 'number' && typeof value.high === 'number' && typeof value.unsigned === 'boolean'
                && value.low === value.low && value.high === value.high)
                return new ProtoBuf.Long(value.low, value.high, typeof unsigned === 'undefined' ? value.unsigned : unsigned);
            if (typeof value === 'string')
                return ProtoBuf.Long.fromString(value, unsigned || false, 10);
            if (typeof value === 'number')
                return ProtoBuf.Long.fromNumber(value, unsigned || false);
            throw Error("not convertible to Long");
        }

        ElementPrototype.toString = function() {
            return (this.name || '') + (this.isMapKey ? 'map' : 'value') + ' element';
        }

        /**
         * Checks if the given value can be set for an element of this type (singular
         * field or one element of a repeated field or map).
         * @param {*} value Value to check
         * @return {*} Verified, maybe adjusted, value
         * @throws {Error} If the value cannot be verified for this element slot
         * @expose
         */
        ElementPrototype.verifyValue = function(value) {
            var self = this;
            function fail(val, msg) {
                throw Error("Illegal value for "+self.toString(true)+" of type "+self.type.name+": "+val+" ("+msg+")");
            }
            switch (this.type) {
                // Signed 32bit
                case ProtoBuf.TYPES["int32"]:
                case ProtoBuf.TYPES["sint32"]:
                case ProtoBuf.TYPES["sfixed32"]:
                    // Account for !NaN: value === value
                    if (typeof value !== 'number' || (value === value && value % 1 !== 0))
                        fail(typeof value, "not an integer");
                    return value > 4294967295 ? value | 0 : value;

                // Unsigned 32bit
                case ProtoBuf.TYPES["uint32"]:
                case ProtoBuf.TYPES["fixed32"]:
                    if (typeof value !== 'number' || (value === value && value % 1 !== 0))
                        fail(typeof value, "not an integer");
                    return value < 0 ? value >>> 0 : value;

                // Signed 64bit
                case ProtoBuf.TYPES["int64"]:
                case ProtoBuf.TYPES["sint64"]:
                case ProtoBuf.TYPES["sfixed64"]: {
                    if (ProtoBuf.Long)
                        try {
                            return mkLong(value, false);
                        } catch (e) {
                            fail(typeof value, e.message);
                        }
                    else
                        fail(typeof value, "requires Long.js");
                }

                // Unsigned 64bit
                case ProtoBuf.TYPES["uint64"]:
                case ProtoBuf.TYPES["fixed64"]: {
                    if (ProtoBuf.Long)
                        try {
                            return mkLong(value, true);
                        } catch (e) {
                            fail(typeof value, e.message);
                        }
                    else
                        fail(typeof value, "requires Long.js");
                }

                // Bool
                case ProtoBuf.TYPES["bool"]:
                    if (typeof value !== 'boolean')
                        fail(typeof value, "not a boolean");
                    return value;

                // Float
                case ProtoBuf.TYPES["float"]:
                case ProtoBuf.TYPES["double"]:
                    if (typeof value !== 'number')
                        fail(typeof value, "not a number");
                    return value;

                // Length-delimited string
                case ProtoBuf.TYPES["string"]:
                    if (typeof value !== 'string' && !(value && value instanceof String))
                        fail(typeof value, "not a string");
                    return ""+value; // Convert String object to string

                // Length-delimited bytes
                case ProtoBuf.TYPES["bytes"]:
                    if (ByteBuffer.isByteBuffer(value))
                        return value;
                    return ByteBuffer.wrap(value, "base64");

                // Constant enum value
                case ProtoBuf.TYPES["enum"]: {
                    var values = this.resolvedType.getChildren(ProtoBuf.Reflect.Enum.Value);
                    for (i=0; i<values.length; i++)
                        if (values[i].name == value)
                            return values[i].id;
                        else if (values[i].id == value)
                            return values[i].id;

                    if (this.syntax === 'proto3') {
                        // proto3: just make sure it's an integer.
                        if (typeof value !== 'number' || (value === value && value % 1 !== 0))
                            fail(typeof value, "not an integer");
                        if (value > 4294967295 || value < 0)
                            fail(typeof value, "not in range for uint32")
                        return value;
                    } else {
                        // proto2 requires enum values to be valid.
                        fail(value, "not a valid enum value");
                    }
                }
                // Embedded message
                case ProtoBuf.TYPES["group"]:
                case ProtoBuf.TYPES["message"]: {
                    if (!value || typeof value !== 'object')
                        fail(typeof value, "object expected");
                    if (value instanceof this.resolvedType.clazz)
                        return value;
                    if (value instanceof ProtoBuf.Builder.Message) {
                        // Mismatched type: Convert to object (see: https://github.com/dcodeIO/ProtoBuf.js/issues/180)
                        var obj = {};
                        for (var i in value)
                            if (value.hasOwnProperty(i))
                                obj[i] = value[i];
                        value = obj;
                    }
                    // Else let's try to construct one from a key-value object
                    return new (this.resolvedType.clazz)(value); // May throw for a hundred of reasons
                }
            }

            // We should never end here
            throw Error("[INTERNAL] Illegal value for "+this.toString(true)+": "+value+" (undefined type "+this.type+")");
        };

        /**
         * Calculates the byte length of an element on the wire.
         * @param {number} id Field number
         * @param {*} value Field value
         * @returns {number} Byte length
         * @throws {Error} If the value cannot be calculated
         * @expose
         */
        ElementPrototype.calculateLength = function(id, value) {
            if (value === null) return 0; // Nothing to encode
            // Tag has already been written
            var n;
            switch (this.type) {
                case ProtoBuf.TYPES["int32"]:
                    return value < 0 ? ByteBuffer.calculateVarint64(value) : ByteBuffer.calculateVarint32(value);
                case ProtoBuf.TYPES["uint32"]:
                    return ByteBuffer.calculateVarint32(value);
                case ProtoBuf.TYPES["sint32"]:
                    return ByteBuffer.calculateVarint32(ByteBuffer.zigZagEncode32(value));
                case ProtoBuf.TYPES["fixed32"]:
                case ProtoBuf.TYPES["sfixed32"]:
                case ProtoBuf.TYPES["float"]:
                    return 4;
                case ProtoBuf.TYPES["int64"]:
                case ProtoBuf.TYPES["uint64"]:
                    return ByteBuffer.calculateVarint64(value);
                case ProtoBuf.TYPES["sint64"]:
                    return ByteBuffer.calculateVarint64(ByteBuffer.zigZagEncode64(value));
                case ProtoBuf.TYPES["fixed64"]:
                case ProtoBuf.TYPES["sfixed64"]:
                    return 8;
                case ProtoBuf.TYPES["bool"]:
                    return 1;
                case ProtoBuf.TYPES["enum"]:
                    return ByteBuffer.calculateVarint32(value);
                case ProtoBuf.TYPES["double"]:
                    return 8;
                case ProtoBuf.TYPES["string"]:
                    n = ByteBuffer.calculateUTF8Bytes(value);
                    return ByteBuffer.calculateVarint32(n) + n;
                case ProtoBuf.TYPES["bytes"]:
                    if (value.remaining() < 0)
                        throw Error("Illegal value for "+this.toString(true)+": "+value.remaining()+" bytes remaining");
                    return ByteBuffer.calculateVarint32(value.remaining()) + value.remaining();
                case ProtoBuf.TYPES["message"]:
                    n = this.resolvedType.calculate(value);
                    return ByteBuffer.calculateVarint32(n) + n;
                case ProtoBuf.TYPES["group"]:
                    n = this.resolvedType.calculate(value);
                    return n + ByteBuffer.calculateVarint32((id << 3) | ProtoBuf.WIRE_TYPES.ENDGROUP);
            }
            // We should never end here
            throw Error("[INTERNAL] Illegal value to encode in "+this.toString(true)+": "+value+" (unknown type)");
        };

        /**
         * Encodes a value to the specified buffer. Does not encode the key.
         * @param {number} id Field number
         * @param {*} value Field value
         * @param {ByteBuffer} buffer ByteBuffer to encode to
         * @return {ByteBuffer} The ByteBuffer for chaining
         * @throws {Error} If the value cannot be encoded
         * @expose
         */
        ElementPrototype.encodeValue = function(id, value, buffer) {
            if (value === null) return buffer; // Nothing to encode
            // Tag has already been written

            switch (this.type) {
                // 32bit signed varint
                case ProtoBuf.TYPES["int32"]:
                    // "If you use int32 or int64 as the type for a negative number, the resulting varint is always ten bytes
                    // long – it is, effectively, treated like a very large unsigned integer." (see #122)
                    if (value < 0)
                        buffer.writeVarint64(value);
                    else
                        buffer.writeVarint32(value);
                    break;

                // 32bit unsigned varint
                case ProtoBuf.TYPES["uint32"]:
                    buffer.writeVarint32(value);
                    break;

                // 32bit varint zig-zag
                case ProtoBuf.TYPES["sint32"]:
                    buffer.writeVarint32ZigZag(value);
                    break;

                // Fixed unsigned 32bit
                case ProtoBuf.TYPES["fixed32"]:
                    buffer.writeUint32(value);
                    break;

                // Fixed signed 32bit
                case ProtoBuf.TYPES["sfixed32"]:
                    buffer.writeInt32(value);
                    break;

                // 64bit varint as-is
                case ProtoBuf.TYPES["int64"]:
                case ProtoBuf.TYPES["uint64"]:
                    buffer.writeVarint64(value); // throws
                    break;

                // 64bit varint zig-zag
                case ProtoBuf.TYPES["sint64"]:
                    buffer.writeVarint64ZigZag(value); // throws
                    break;

                // Fixed unsigned 64bit
                case ProtoBuf.TYPES["fixed64"]:
                    buffer.writeUint64(value); // throws
                    break;

                // Fixed signed 64bit
                case ProtoBuf.TYPES["sfixed64"]:
                    buffer.writeInt64(value); // throws
                    break;

                // Bool
                case ProtoBuf.TYPES["bool"]:
                    if (typeof value === 'string')
                        buffer.writeVarint32(value.toLowerCase() === 'false' ? 0 : !!value);
                    else
                        buffer.writeVarint32(value ? 1 : 0);
                    break;

                // Constant enum value
                case ProtoBuf.TYPES["enum"]:
                    buffer.writeVarint32(value);
                    break;

                // 32bit float
                case ProtoBuf.TYPES["float"]:
                    buffer.writeFloat32(value);
                    break;

                // 64bit float
                case ProtoBuf.TYPES["double"]:
                    buffer.writeFloat64(value);
                    break;

                // Length-delimited string
                case ProtoBuf.TYPES["string"]:
                    buffer.writeVString(value);
                    break;

                // Length-delimited bytes
                case ProtoBuf.TYPES["bytes"]:
                    if (value.remaining() < 0)
                        throw Error("Illegal value for "+this.toString(true)+": "+value.remaining()+" bytes remaining");
                    var prevOffset = value.offset;
                    buffer.writeVarint32(value.remaining());
                    buffer.append(value);
                    value.offset = prevOffset;
                    break;

                // Embedded message
                case ProtoBuf.TYPES["message"]:
                    var bb = new ByteBuffer().LE();
                    this.resolvedType.encode(value, bb);
                    buffer.writeVarint32(bb.offset);
                    buffer.append(bb.flip());
                    break;

                // Legacy group
                case ProtoBuf.TYPES["group"]:
                    this.resolvedType.encode(value, buffer);
                    buffer.writeVarint32((id << 3) | ProtoBuf.WIRE_TYPES.ENDGROUP);
                    break;

                default:
                    // We should never end here
                    throw Error("[INTERNAL] Illegal value to encode in "+this.toString(true)+": "+value+" (unknown type)");
            }
            return buffer;
        };

        /**
         * Decode one element value from the specified buffer.
         * @param {ByteBuffer} buffer ByteBuffer to decode from
         * @param {number} wireType The field wire type
         * @param {number} id The field number
         * @return {*} Decoded value
         * @throws {Error} If the field cannot be decoded
         * @expose
         */
        ElementPrototype.decode = function(buffer, wireType, id) {
            if (wireType != this.type.wireType)
                throw Error("Unexpected wire type for element");

            var value, nBytes;
            switch (this.type) {
                // 32bit signed varint
                case ProtoBuf.TYPES["int32"]:
                    return buffer.readVarint32() | 0;

                // 32bit unsigned varint
                case ProtoBuf.TYPES["uint32"]:
                    return buffer.readVarint32() >>> 0;

                // 32bit signed varint zig-zag
                case ProtoBuf.TYPES["sint32"]:
                    return buffer.readVarint32ZigZag() | 0;

                // Fixed 32bit unsigned
                case ProtoBuf.TYPES["fixed32"]:
                    return buffer.readUint32() >>> 0;

                case ProtoBuf.TYPES["sfixed32"]:
                    return buffer.readInt32() | 0;

                // 64bit signed varint
                case ProtoBuf.TYPES["int64"]:
                    return buffer.readVarint64();

                // 64bit unsigned varint
                case ProtoBuf.TYPES["uint64"]:
                    return buffer.readVarint64().toUnsigned();

                // 64bit signed varint zig-zag
                case ProtoBuf.TYPES["sint64"]:
                    return buffer.readVarint64ZigZag();

                // Fixed 64bit unsigned
                case ProtoBuf.TYPES["fixed64"]:
                    return buffer.readUint64();

                // Fixed 64bit signed
                case ProtoBuf.TYPES["sfixed64"]:
                    return buffer.readInt64();

                // Bool varint
                case ProtoBuf.TYPES["bool"]:
                    return !!buffer.readVarint32();

                // Constant enum value (varint)
                case ProtoBuf.TYPES["enum"]:
                    // The following Builder.Message#set will already throw
                    return buffer.readVarint32();

                // 32bit float
                case ProtoBuf.TYPES["float"]:
                    return buffer.readFloat();

                // 64bit float
                case ProtoBuf.TYPES["double"]:
                    return buffer.readDouble();

                // Length-delimited string
                case ProtoBuf.TYPES["string"]:
                    return buffer.readVString();

                // Length-delimited bytes
                case ProtoBuf.TYPES["bytes"]: {
                    nBytes = buffer.readVarint32();
                    if (buffer.remaining() < nBytes)
                        throw Error("Illegal number of bytes for "+this.toString(true)+": "+nBytes+" required but got only "+buffer.remaining());
                    value = buffer.clone(); // Offset already set
                    value.limit = value.offset+nBytes;
                    buffer.offset += nBytes;
                    return value;
                }

                // Length-delimited embedded message
                case ProtoBuf.TYPES["message"]: {
                    nBytes = buffer.readVarint32();
                    return this.resolvedType.decode(buffer, nBytes);
                }

                // Legacy group
                case ProtoBuf.TYPES["group"]:
                    return this.resolvedType.decode(buffer, -1, id);
            }

            // We should never end here
            throw Error("[INTERNAL] Illegal decode type");
        };

        /**
         * Converts a value from a string to the canonical element type.
         *
         * Legal only when isMapKey is true.
         *
         * @param {string} str The string value
         * @returns {*} The value
         */
        ElementPrototype.valueFromString = function(str) {
            if (!this.isMapKey) {
                throw Error("valueFromString() called on non-map-key element");
            }

            switch (this.type) {
                case ProtoBuf.TYPES["int32"]:
                case ProtoBuf.TYPES["sint32"]:
                case ProtoBuf.TYPES["sfixed32"]:
                case ProtoBuf.TYPES["uint32"]:
                case ProtoBuf.TYPES["fixed32"]:
                    return this.verifyValue(parseInt(str));

                case ProtoBuf.TYPES["int64"]:
                case ProtoBuf.TYPES["sint64"]:
                case ProtoBuf.TYPES["sfixed64"]:
                case ProtoBuf.TYPES["uint64"]:
                case ProtoBuf.TYPES["fixed64"]:
                      // Long-based fields support conversions from string already.
                      return this.verifyValue(str);

                case ProtoBuf.TYPES["bool"]:
                      return str === "true";

                case ProtoBuf.TYPES["string"]:
                      return this.verifyValue(str);

                case ProtoBuf.TYPES["bytes"]:
                      return ByteBuffer.fromBinary(str);
            }
        };

        /**
         * Converts a value from the canonical element type to a string.
         *
         * It should be the case that `valueFromString(valueToString(val))` returns
         * a value equivalent to `verifyValue(val)` for every legal value of `val`
         * according to this element type.
         *
         * This may be used when the element must be stored or used as a string,
         * e.g., as a map key on an Object.
         *
         * Legal only when isMapKey is true.
         *
         * @param {*} val The value
         * @returns {string} The string form of the value.
         */
        ElementPrototype.valueToString = function(value) {
            if (!this.isMapKey) {
                throw Error("valueToString() called on non-map-key element");
            }

            if (this.type === ProtoBuf.TYPES["bytes"]) {
                return value.toString("binary");
            } else {
                return value.toString();
            }
        };

        /**
         * @alias ProtoBuf.Reflect.Element
         * @expose
         */
        Reflect.Element = Element;

        /**
         * Constructs a new Message.
         * @exports ProtoBuf.Reflect.Message
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Namespace} parent Parent message or namespace
         * @param {string} name Message name
         * @param {Object.<string,*>=} options Message options
         * @param {boolean=} isGroup `true` if this is a legacy group
         * @param {string?} syntax The syntax level of this definition (e.g., proto3)
         * @constructor
         * @extends ProtoBuf.Reflect.Namespace
         */
        var Message = function(builder, parent, name, options, isGroup, syntax) {
            Namespace.call(this, builder, parent, name, options, syntax);

            /**
             * @override
             */
            this.className = "Message";

            /**
             * Extensions range.
             * @type {!Array.<number>|undefined}
             * @expose
             */
            this.extensions = undefined;

            /**
             * Runtime message class.
             * @type {?function(new:ProtoBuf.Builder.Message)}
             * @expose
             */
            this.clazz = null;

            /**
             * Whether this is a legacy group or not.
             * @type {boolean}
             * @expose
             */
            this.isGroup = !!isGroup;

            // The following cached collections are used to efficiently iterate over or look up fields when decoding.

            /**
             * Cached fields.
             * @type {?Array.<!ProtoBuf.Reflect.Message.Field>}
             * @private
             */
            this._fields = null;

            /**
             * Cached fields by id.
             * @type {?Object.<number,!ProtoBuf.Reflect.Message.Field>}
             * @private
             */
            this._fieldsById = null;

            /**
             * Cached fields by name.
             * @type {?Object.<string,!ProtoBuf.Reflect.Message.Field>}
             * @private
             */
            this._fieldsByName = null;
        };

        /**
         * @alias ProtoBuf.Reflect.Message.prototype
         * @inner
         */
        var MessagePrototype = Message.prototype = Object.create(Namespace.prototype);

        /**
         * Builds the message and returns the runtime counterpart, which is a fully functional class.
         * @see ProtoBuf.Builder.Message
         * @param {boolean=} rebuild Whether to rebuild or not, defaults to false
         * @return {ProtoBuf.Reflect.Message} Message class
         * @throws {Error} If the message cannot be built
         * @expose
         */
        MessagePrototype.build = function(rebuild) {
            if (this.clazz && !rebuild)
                return this.clazz;

            // Create the runtime Message class in its own scope
            var clazz = (function(ProtoBuf, T) {

                var fields = T.getChildren(ProtoBuf.Reflect.Message.Field),
                    oneofs = T.getChildren(ProtoBuf.Reflect.Message.OneOf);

                /**
                 * Constructs a new runtime Message.
                 * @name ProtoBuf.Builder.Message
                 * @class Barebone of all runtime messages.
                 * @param {!Object.<string,*>|string} values Preset values
                 * @param {...string} var_args
                 * @constructor
                 * @throws {Error} If the message cannot be created
                 */
                var Message = function(values, var_args) {
                    ProtoBuf.Builder.Message.call(this);

                    // Create virtual oneof properties
                    for (var i=0, k=oneofs.length; i<k; ++i)
                        this[oneofs[i].name] = null;
                    // Create fields and set default values
                    for (i=0, k=fields.length; i<k; ++i) {
                        var field = fields[i];
                        this[field.name] =
                            field.repeated ? [] :
                            (field.map ? new ProtoBuf.Map(field) : null);
                        if ((field.required || T.syntax === 'proto3') &&
                            field.defaultValue !== null)
                            this[field.name] = field.defaultValue;
                    }

                    if (arguments.length > 0) {
                        var value;
                        // Set field values from a values object
                        if (arguments.length === 1 && values !== null && typeof values === 'object' &&
                            /* not _another_ Message */ (typeof values.encode !== 'function' || values instanceof Message) &&
                            /* not a repeated field */ !Array.isArray(values) &&
                            /* not a Map */ !(values instanceof ProtoBuf.Map) &&
                            /* not a ByteBuffer */ !ByteBuffer.isByteBuffer(values) &&
                            /* not an ArrayBuffer */ !(values instanceof ArrayBuffer) &&
                            /* not a Long */ !(ProtoBuf.Long && values instanceof ProtoBuf.Long)) {
                            this.$set(values);
                        } else // Set field values from arguments, in declaration order
                            for (i=0, k=arguments.length; i<k; ++i)
                                if (typeof (value = arguments[i]) !== 'undefined')
                                    this.$set(fields[i].name, value); // May throw
                    }
                };

                /**
                 * @alias ProtoBuf.Builder.Message.prototype
                 * @inner
                 */
                var MessagePrototype = Message.prototype = Object.create(ProtoBuf.Builder.Message.prototype);

                /**
                 * Adds a value to a repeated field.
                 * @name ProtoBuf.Builder.Message#add
                 * @function
                 * @param {string} key Field name
                 * @param {*} value Value to add
                 * @param {boolean=} noAssert Whether to assert the value or not (asserts by default)
                 * @returns {!ProtoBuf.Builder.Message} this
                 * @throws {Error} If the value cannot be added
                 * @expose
                 */
                MessagePrototype.add = function(key, value, noAssert) {
                    var field = T._fieldsByName[key];
                    if (!noAssert) {
                        if (!field)
                            throw Error(this+"#"+key+" is undefined");
                        if (!(field instanceof ProtoBuf.Reflect.Message.Field))
                            throw Error(this+"#"+key+" is not a field: "+field.toString(true)); // May throw if it's an enum or embedded message
                        if (!field.repeated)
                            throw Error(this+"#"+key+" is not a repeated field");
                        value = field.verifyValue(value, true);
                    }
                    if (this[key] === null)
                        this[key] = [];
                    this[key].push(value);
                    return this;
                };

                /**
                 * Adds a value to a repeated field. This is an alias for {@link ProtoBuf.Builder.Message#add}.
                 * @name ProtoBuf.Builder.Message#$add
                 * @function
                 * @param {string} key Field name
                 * @param {*} value Value to add
                 * @param {boolean=} noAssert Whether to assert the value or not (asserts by default)
                 * @returns {!ProtoBuf.Builder.Message} this
                 * @throws {Error} If the value cannot be added
                 * @expose
                 */
                MessagePrototype.$add = MessagePrototype.add;

                /**
                 * Sets a field's value.
                 * @name ProtoBuf.Builder.Message#set
                 * @function
                 * @param {string|!Object.<string,*>} keyOrObj String key or plain object holding multiple values
                 * @param {(*|boolean)=} value Value to set if key is a string, otherwise omitted
                 * @param {boolean=} noAssert Whether to not assert for an actual field / proper value type, defaults to `false`
                 * @returns {!ProtoBuf.Builder.Message} this
                 * @throws {Error} If the value cannot be set
                 * @expose
                 */
                MessagePrototype.set = function(keyOrObj, value, noAssert) {
                    if (keyOrObj && typeof keyOrObj === 'object') {
                        noAssert = value;
                        for (var ikey in keyOrObj) {
                            // Check if virtual oneof field - don't set these
                            if (keyOrObj.hasOwnProperty(ikey) && typeof (value = keyOrObj[ikey]) !== 'undefined' && T._oneofsByName[ikey] === undefined)
                                this.$set(ikey, value, noAssert);
                        }
                        return this;
                    }
                    var field = T._fieldsByName[keyOrObj];
                    if (!noAssert) {
                        if (!field)
                            throw Error(this+"#"+keyOrObj+" is not a field: undefined");
                        if (!(field instanceof ProtoBuf.Reflect.Message.Field))
                            throw Error(this+"#"+keyOrObj+" is not a field: "+field.toString(true));
                        this[field.name] = (value = field.verifyValue(value)); // May throw
                    } else
                        this[keyOrObj] = value;
                    if (field && field.oneof) { // Field is part of an OneOf (not a virtual OneOf field)
                        var currentField = this[field.oneof.name]; // Virtual field references currently set field
                        if (value !== null) {
                            if (currentField !== null && currentField !== field.name)
                                this[currentField] = null; // Clear currently set field
                            this[field.oneof.name] = field.name; // Point virtual field at this field
                        } else if (/* value === null && */currentField === keyOrObj)
                            this[field.oneof.name] = null; // Clear virtual field (current field explicitly cleared)
                    }
                    return this;
                };

                /**
                 * Sets a field's value. This is an alias for [@link ProtoBuf.Builder.Message#set}.
                 * @name ProtoBuf.Builder.Message#$set
                 * @function
                 * @param {string|!Object.<string,*>} keyOrObj String key or plain object holding multiple values
                 * @param {(*|boolean)=} value Value to set if key is a string, otherwise omitted
                 * @param {boolean=} noAssert Whether to not assert the value, defaults to `false`
                 * @throws {Error} If the value cannot be set
                 * @expose
                 */
                MessagePrototype.$set = MessagePrototype.set;

                /**
                 * Gets a field's value.
                 * @name ProtoBuf.Builder.Message#get
                 * @function
                 * @param {string} key Key
                 * @param {boolean=} noAssert Whether to not assert for an actual field, defaults to `false`
                 * @return {*} Value
                 * @throws {Error} If there is no such field
                 * @expose
                 */
                MessagePrototype.get = function(key, noAssert) {
                    if (noAssert)
                        return this[key];
                    var field = T._fieldsByName[key];
                    if (!field || !(field instanceof ProtoBuf.Reflect.Message.Field))
                        throw Error(this+"#"+key+" is not a field: undefined");
                    if (!(field instanceof ProtoBuf.Reflect.Message.Field))
                        throw Error(this+"#"+key+" is not a field: "+field.toString(true));
                    return this[field.name];
                };

                /**
                 * Gets a field's value. This is an alias for {@link ProtoBuf.Builder.Message#$get}.
                 * @name ProtoBuf.Builder.Message#$get
                 * @function
                 * @param {string} key Key
                 * @return {*} Value
                 * @throws {Error} If there is no such field
                 * @expose
                 */
                MessagePrototype.$get = MessagePrototype.get;

                // Getters and setters

                for (var i=0; i<fields.length; i++) {
                    var field = fields[i];
                    // no setters for extension fields as these are named by their fqn
                    if (field instanceof ProtoBuf.Reflect.Message.ExtensionField)
                        continue;

                    if (T.builder.options['populateAccessors'])
                        (function(field) {
                            // set/get[SomeValue]
                            var Name = field.originalName.replace(/(_[a-zA-Z])/g, function(match) {
                                return match.toUpperCase().replace('_','');
                            });
                            Name = Name.substring(0,1).toUpperCase() + Name.substring(1);

                            // set/get_[some_value] FIXME: Do we really need these?
                            var name = field.originalName.replace(/([A-Z])/g, function(match) {
                                return "_"+match;
                            });

                            /**
                             * The current field's unbound setter function.
                             * @function
                             * @param {*} value
                             * @param {boolean=} noAssert
                             * @returns {!ProtoBuf.Builder.Message}
                             * @inner
                             */
                            var setter = function(value, noAssert) {
                                this[field.name] = noAssert ? value : field.verifyValue(value);
                                return this;
                            };

                            /**
                             * The current field's unbound getter function.
                             * @function
                             * @returns {*}
                             * @inner
                             */
                            var getter = function() {
                                return this[field.name];
                            };

                            if (T.getChild("set"+Name) === null)
                                /**
                                 * Sets a value. This method is present for each field, but only if there is no name conflict with
                                 *  another field.
                                 * @name ProtoBuf.Builder.Message#set[SomeField]
                                 * @function
                                 * @param {*} value Value to set
                                 * @param {boolean=} noAssert Whether to not assert the value, defaults to `false`
                                 * @returns {!ProtoBuf.Builder.Message} this
                                 * @abstract
                                 * @throws {Error} If the value cannot be set
                                 */
                                MessagePrototype["set"+Name] = setter;

                            if (T.getChild("set_"+name) === null)
                                /**
                                 * Sets a value. This method is present for each field, but only if there is no name conflict with
                                 *  another field.
                                 * @name ProtoBuf.Builder.Message#set_[some_field]
                                 * @function
                                 * @param {*} value Value to set
                                 * @param {boolean=} noAssert Whether to not assert the value, defaults to `false`
                                 * @returns {!ProtoBuf.Builder.Message} this
                                 * @abstract
                                 * @throws {Error} If the value cannot be set
                                 */
                                MessagePrototype["set_"+name] = setter;

                            if (T.getChild("get"+Name) === null)
                                /**
                                 * Gets a value. This method is present for each field, but only if there is no name conflict with
                                 *  another field.
                                 * @name ProtoBuf.Builder.Message#get[SomeField]
                                 * @function
                                 * @abstract
                                 * @return {*} The value
                                 */
                                MessagePrototype["get"+Name] = getter;

                            if (T.getChild("get_"+name) === null)
                                /**
                                 * Gets a value. This method is present for each field, but only if there is no name conflict with
                                 *  another field.
                                 * @name ProtoBuf.Builder.Message#get_[some_field]
                                 * @function
                                 * @return {*} The value
                                 * @abstract
                                 */
                                MessagePrototype["get_"+name] = getter;

                        })(field);
                }

                // En-/decoding

                /**
                 * Encodes the message.
                 * @name ProtoBuf.Builder.Message#$encode
                 * @function
                 * @param {(!ByteBuffer|boolean)=} buffer ByteBuffer to encode to. Will create a new one and flip it if omitted.
                 * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
                 * @return {!ByteBuffer} Encoded message as a ByteBuffer
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded ByteBuffer in the `encoded` property on the error.
                 * @expose
                 * @see ProtoBuf.Builder.Message#encode64
                 * @see ProtoBuf.Builder.Message#encodeHex
                 * @see ProtoBuf.Builder.Message#encodeAB
                 */
                MessagePrototype.encode = function(buffer, noVerify) {
                    if (typeof buffer === 'boolean')
                        noVerify = buffer,
                        buffer = undefined;
                    var isNew = false;
                    if (!buffer)
                        buffer = new ByteBuffer(),
                        isNew = true;
                    var le = buffer.littleEndian;
                    try {
                        T.encode(this, buffer.LE(), noVerify);
                        return (isNew ? buffer.flip() : buffer).LE(le);
                    } catch (e) {
                        buffer.LE(le);
                        throw(e);
                    }
                };

                /**
                 * Encodes a message using the specified data payload.
                 * @param {!Object.<string,*>} data Data payload
                 * @param {(!ByteBuffer|boolean)=} buffer ByteBuffer to encode to. Will create a new one and flip it if omitted.
                 * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
                 * @return {!ByteBuffer} Encoded message as a ByteBuffer
                 * @expose
                 */
                Message.encode = function(data, buffer, noVerify) {
                    return new Message(data).encode(buffer, noVerify);
                };

                /**
                 * Calculates the byte length of the message.
                 * @name ProtoBuf.Builder.Message#calculate
                 * @function
                 * @returns {number} Byte length
                 * @throws {Error} If the message cannot be calculated or if required fields are missing.
                 * @expose
                 */
                MessagePrototype.calculate = function() {
                    return T.calculate(this);
                };

                /**
                 * Encodes the varint32 length-delimited message.
                 * @name ProtoBuf.Builder.Message#encodeDelimited
                 * @function
                 * @param {(!ByteBuffer|boolean)=} buffer ByteBuffer to encode to. Will create a new one and flip it if omitted.
                 * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
                 * @return {!ByteBuffer} Encoded message as a ByteBuffer
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded ByteBuffer in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.encodeDelimited = function(buffer, noVerify) {
                    var isNew = false;
                    if (!buffer)
                        buffer = new ByteBuffer(),
                        isNew = true;
                    var enc = new ByteBuffer().LE();
                    T.encode(this, enc, noVerify).flip();
                    buffer.writeVarint32(enc.remaining());
                    buffer.append(enc);
                    return isNew ? buffer.flip() : buffer;
                };

                /**
                 * Directly encodes the message to an ArrayBuffer.
                 * @name ProtoBuf.Builder.Message#encodeAB
                 * @function
                 * @return {ArrayBuffer} Encoded message as ArrayBuffer
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded ArrayBuffer in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.encodeAB = function() {
                    try {
                        return this.encode().toArrayBuffer();
                    } catch (e) {
                        if (e["encoded"]) e["encoded"] = e["encoded"].toArrayBuffer();
                        throw(e);
                    }
                };

                /**
                 * Returns the message as an ArrayBuffer. This is an alias for {@link ProtoBuf.Builder.Message#encodeAB}.
                 * @name ProtoBuf.Builder.Message#toArrayBuffer
                 * @function
                 * @return {ArrayBuffer} Encoded message as ArrayBuffer
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded ArrayBuffer in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.toArrayBuffer = MessagePrototype.encodeAB;

                /**
                 * Directly encodes the message to a node Buffer.
                 * @name ProtoBuf.Builder.Message#encodeNB
                 * @function
                 * @return {!Buffer}
                 * @throws {Error} If the message cannot be encoded, not running under node.js or if required fields are
                 *  missing. The later still returns the encoded node Buffer in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.encodeNB = function() {
                    try {
                        return this.encode().toBuffer();
                    } catch (e) {
                        if (e["encoded"]) e["encoded"] = e["encoded"].toBuffer();
                        throw(e);
                    }
                };

                /**
                 * Returns the message as a node Buffer. This is an alias for {@link ProtoBuf.Builder.Message#encodeNB}.
                 * @name ProtoBuf.Builder.Message#toBuffer
                 * @function
                 * @return {!Buffer}
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded node Buffer in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.toBuffer = MessagePrototype.encodeNB;

                /**
                 * Directly encodes the message to a base64 encoded string.
                 * @name ProtoBuf.Builder.Message#encode64
                 * @function
                 * @return {string} Base64 encoded string
                 * @throws {Error} If the underlying buffer cannot be encoded or if required fields are missing. The later
                 *  still returns the encoded base64 string in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.encode64 = function() {
                    try {
                        return this.encode().toBase64();
                    } catch (e) {
                        if (e["encoded"]) e["encoded"] = e["encoded"].toBase64();
                        throw(e);
                    }
                };

                /**
                 * Returns the message as a base64 encoded string. This is an alias for {@link ProtoBuf.Builder.Message#encode64}.
                 * @name ProtoBuf.Builder.Message#toBase64
                 * @function
                 * @return {string} Base64 encoded string
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded base64 string in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.toBase64 = MessagePrototype.encode64;

                /**
                 * Directly encodes the message to a hex encoded string.
                 * @name ProtoBuf.Builder.Message#encodeHex
                 * @function
                 * @return {string} Hex encoded string
                 * @throws {Error} If the underlying buffer cannot be encoded or if required fields are missing. The later
                 *  still returns the encoded hex string in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.encodeHex = function() {
                    try {
                        return this.encode().toHex();
                    } catch (e) {
                        if (e["encoded"]) e["encoded"] = e["encoded"].toHex();
                        throw(e);
                    }
                };

                /**
                 * Returns the message as a hex encoded string. This is an alias for {@link ProtoBuf.Builder.Message#encodeHex}.
                 * @name ProtoBuf.Builder.Message#toHex
                 * @function
                 * @return {string} Hex encoded string
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded hex string in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.toHex = MessagePrototype.encodeHex;

                /**
                 * Clones a message object or field value to a raw object.
                 * @param {*} obj Object to clone
                 * @param {boolean} binaryAsBase64 Whether to include binary data as base64 strings or as a buffer otherwise
                 * @param {boolean} longsAsStrings Whether to encode longs as strings
                 * @param {!ProtoBuf.Reflect.T=} resolvedType The resolved field type if a field
                 * @returns {*} Cloned object
                 * @inner
                 */
                function cloneRaw(obj, binaryAsBase64, longsAsStrings, resolvedType) {
                    if (obj === null || typeof obj !== 'object') {
                        // Convert enum values to their respective names
                        if (resolvedType && resolvedType instanceof ProtoBuf.Reflect.Enum) {
                            var name = ProtoBuf.Reflect.Enum.getName(resolvedType.object, obj);
                            if (name !== null)
                                return name;
                        }
                        // Pass-through string, number, boolean, null...
                        return obj;
                    }
                    // Convert ByteBuffers to raw buffer or strings
                    if (ByteBuffer.isByteBuffer(obj))
                        return binaryAsBase64 ? obj.toBase64() : obj.toBuffer();
                    // Convert Longs to proper objects or strings
                    if (ProtoBuf.Long.isLong(obj))
                        return longsAsStrings ? obj.toString() : ProtoBuf.Long.fromValue(obj);
                    var clone;
                    // Clone arrays
                    if (Array.isArray(obj)) {
                        clone = [];
                        obj.forEach(function(v, k) {
                            clone[k] = cloneRaw(v, binaryAsBase64, longsAsStrings, resolvedType);
                        });
                        return clone;
                    }
                    clone = {};
                    // Convert maps to objects
                    if (obj instanceof ProtoBuf.Map) {
                        var it = obj.entries();
                        for (var e = it.next(); !e.done; e = it.next())
                            clone[obj.keyElem.valueToString(e.value[0])] = cloneRaw(e.value[1], binaryAsBase64, longsAsStrings, obj.valueElem.resolvedType);
                        return clone;
                    }
                    // Everything else is a non-null object
                    var type = obj.$type,
                        field = undefined;
                    for (var i in obj)
                        if (obj.hasOwnProperty(i)) {
                            if (type && (field = type.getChild(i)))
                                clone[i] = cloneRaw(obj[i], binaryAsBase64, longsAsStrings, field.resolvedType);
                            else
                                clone[i] = cloneRaw(obj[i], binaryAsBase64, longsAsStrings);
                        }
                    return clone;
                }

                /**
                 * Returns the message's raw payload.
                 * @param {boolean=} binaryAsBase64 Whether to include binary data as base64 strings instead of Buffers, defaults to `false`
                 * @param {boolean} longsAsStrings Whether to encode longs as strings
                 * @returns {Object.<string,*>} Raw payload
                 * @expose
                 */
                MessagePrototype.toRaw = function(binaryAsBase64, longsAsStrings) {
                    return cloneRaw(this, !!binaryAsBase64, !!longsAsStrings, this.$type);
                };

                /**
                 * Encodes a message to JSON.
                 * @returns {string} JSON string
                 * @expose
                 */
                MessagePrototype.encodeJSON = function() {
                    return JSON.stringify(
                        cloneRaw(this,
                             /* binary-as-base64 */ true,
                             /* longs-as-strings */ true,
                             this.$type
                        )
                    );
                };

                /**
                 * Decodes a message from the specified buffer or string.
                 * @name ProtoBuf.Builder.Message.decode
                 * @function
                 * @param {!ByteBuffer|!ArrayBuffer|!Buffer|string} buffer Buffer to decode from
                 * @param {(number|string)=} length Message length. Defaults to decode all the remainig data.
                 * @param {string=} enc Encoding if buffer is a string: hex, utf8 (not recommended), defaults to base64
                 * @return {!ProtoBuf.Builder.Message} Decoded message
                 * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
                 *  returns the decoded message with missing fields in the `decoded` property on the error.
                 * @expose
                 * @see ProtoBuf.Builder.Message.decode64
                 * @see ProtoBuf.Builder.Message.decodeHex
                 */
                Message.decode = function(buffer, length, enc) {
                    if (typeof length === 'string')
                        enc = length,
                        length = -1;
                    if (typeof buffer === 'string')
                        buffer = ByteBuffer.wrap(buffer, enc ? enc : "base64");
                    else if (!ByteBuffer.isByteBuffer(buffer))
                        buffer = ByteBuffer.wrap(buffer); // May throw
                    var le = buffer.littleEndian;
                    try {
                        var msg = T.decode(buffer.LE(), length);
                        buffer.LE(le);
                        return msg;
                    } catch (e) {
                        buffer.LE(le);
                        throw(e);
                    }
                };

                /**
                 * Decodes a varint32 length-delimited message from the specified buffer or string.
                 * @name ProtoBuf.Builder.Message.decodeDelimited
                 * @function
                 * @param {!ByteBuffer|!ArrayBuffer|!Buffer|string} buffer Buffer to decode from
                 * @param {string=} enc Encoding if buffer is a string: hex, utf8 (not recommended), defaults to base64
                 * @return {ProtoBuf.Builder.Message} Decoded message or `null` if not enough bytes are available yet
                 * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
                 *  returns the decoded message with missing fields in the `decoded` property on the error.
                 * @expose
                 */
                Message.decodeDelimited = function(buffer, enc) {
                    if (typeof buffer === 'string')
                        buffer = ByteBuffer.wrap(buffer, enc ? enc : "base64");
                    else if (!ByteBuffer.isByteBuffer(buffer))
                        buffer = ByteBuffer.wrap(buffer); // May throw
                    if (buffer.remaining() < 1)
                        return null;
                    var off = buffer.offset,
                        len = buffer.readVarint32();
                    if (buffer.remaining() < len) {
                        buffer.offset = off;
                        return null;
                    }
                    try {
                        var msg = T.decode(buffer.slice(buffer.offset, buffer.offset + len).LE());
                        buffer.offset += len;
                        return msg;
                    } catch (err) {
                        buffer.offset += len;
                        throw err;
                    }
                };

                /**
                 * Decodes the message from the specified base64 encoded string.
                 * @name ProtoBuf.Builder.Message.decode64
                 * @function
                 * @param {string} str String to decode from
                 * @return {!ProtoBuf.Builder.Message} Decoded message
                 * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
                 *  returns the decoded message with missing fields in the `decoded` property on the error.
                 * @expose
                 */
                Message.decode64 = function(str) {
                    return Message.decode(str, "base64");
                };

                /**
                 * Decodes the message from the specified hex encoded string.
                 * @name ProtoBuf.Builder.Message.decodeHex
                 * @function
                 * @param {string} str String to decode from
                 * @return {!ProtoBuf.Builder.Message} Decoded message
                 * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
                 *  returns the decoded message with missing fields in the `decoded` property on the error.
                 * @expose
                 */
                Message.decodeHex = function(str) {
                    return Message.decode(str, "hex");
                };

                /**
                 * Decodes the message from a JSON string.
                 * @name ProtoBuf.Builder.Message.decodeJSON
                 * @function
                 * @param {string} str String to decode from
                 * @return {!ProtoBuf.Builder.Message} Decoded message
                 * @throws {Error} If the message cannot be decoded or if required fields are
                 * missing.
                 * @expose
                 */
                Message.decodeJSON = function(str) {
                    return new Message(JSON.parse(str));
                };

                // Utility

                /**
                 * Returns a string representation of this Message.
                 * @name ProtoBuf.Builder.Message#toString
                 * @function
                 * @return {string} String representation as of ".Fully.Qualified.MessageName"
                 * @expose
                 */
                MessagePrototype.toString = function() {
                    return T.toString();
                };

                // Properties

                /**
                 * Message options.
                 * @name ProtoBuf.Builder.Message.$options
                 * @type {Object.<string,*>}
                 * @expose
                 */
                var $optionsS; // cc needs this

                /**
                 * Message options.
                 * @name ProtoBuf.Builder.Message#$options
                 * @type {Object.<string,*>}
                 * @expose
                 */
                var $options;

                /**
                 * Reflection type.
                 * @name ProtoBuf.Builder.Message.$type
                 * @type {!ProtoBuf.Reflect.Message}
                 * @expose
                 */
                var $typeS;

                /**
                 * Reflection type.
                 * @name ProtoBuf.Builder.Message#$type
                 * @type {!ProtoBuf.Reflect.Message}
                 * @expose
                 */
                var $type;

                if (Object.defineProperty)
                    Object.defineProperty(Message, '$options', { "value": T.buildOpt() }),
                    Object.defineProperty(MessagePrototype, "$options", { "value": Message["$options"] }),
                    Object.defineProperty(Message, "$type", { "value": T }),
                    Object.defineProperty(MessagePrototype, "$type", { "value": T });

                return Message;

            })(ProtoBuf, this);

            // Static enums and prototyped sub-messages / cached collections
            this._fields = [];
            this._fieldsById = {};
            this._fieldsByName = {};
            this._oneofsByName = {};
            for (var i=0, k=this.children.length, child; i<k; i++) {
                child = this.children[i];
                if (child instanceof Enum || child instanceof Message || child instanceof Service) {
                    if (clazz.hasOwnProperty(child.name))
                        throw Error("Illegal reflect child of "+this.toString(true)+": "+child.toString(true)+" cannot override static property '"+child.name+"'");
                    clazz[child.name] = child.build();
                } else if (child instanceof Message.Field)
                    child.build(),
                    this._fields.push(child),
                    this._fieldsById[child.id] = child,
                    this._fieldsByName[child.name] = child;
                else if (child instanceof Message.OneOf) {
                    this._oneofsByName[child.name] = child;
                }
                else if (!(child instanceof Message.OneOf) && !(child instanceof Extension)) // Not built
                    throw Error("Illegal reflect child of "+this.toString(true)+": "+this.children[i].toString(true));
            }

            return this.clazz = clazz;
        };

        /**
         * Encodes a runtime message's contents to the specified buffer.
         * @param {!ProtoBuf.Builder.Message} message Runtime message to encode
         * @param {ByteBuffer} buffer ByteBuffer to write to
         * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
         * @return {ByteBuffer} The ByteBuffer for chaining
         * @throws {Error} If required fields are missing or the message cannot be encoded for another reason
         * @expose
         */
        MessagePrototype.encode = function(message, buffer, noVerify) {
            var fieldMissing = null,
                field;
            for (var i=0, k=this._fields.length, val; i<k; ++i) {
                field = this._fields[i];
                val = message[field.name];
                if (field.required && val === null) {
                    if (fieldMissing === null)
                        fieldMissing = field;
                } else
                    field.encode(noVerify ? val : field.verifyValue(val), buffer, message);
            }
            if (fieldMissing !== null) {
                var err = Error("Missing at least one required field for "+this.toString(true)+": "+fieldMissing);
                err["encoded"] = buffer; // Still expose what we got
                throw(err);
            }
            return buffer;
        };

        /**
         * Calculates a runtime message's byte length.
         * @param {!ProtoBuf.Builder.Message} message Runtime message to encode
         * @returns {number} Byte length
         * @throws {Error} If required fields are missing or the message cannot be calculated for another reason
         * @expose
         */
        MessagePrototype.calculate = function(message) {
            for (var n=0, i=0, k=this._fields.length, field, val; i<k; ++i) {
                field = this._fields[i];
                val = message[field.name];
                if (field.required && val === null)
                   throw Error("Missing at least one required field for "+this.toString(true)+": "+field);
                else
                    n += field.calculate(val, message);
            }
            return n;
        };

        /**
         * Skips all data until the end of the specified group has been reached.
         * @param {number} expectedId Expected GROUPEND id
         * @param {!ByteBuffer} buf ByteBuffer
         * @returns {boolean} `true` if a value as been skipped, `false` if the end has been reached
         * @throws {Error} If it wasn't possible to find the end of the group (buffer overrun or end tag mismatch)
         * @inner
         */
        function skipTillGroupEnd(expectedId, buf) {
            var tag = buf.readVarint32(), // Throws on OOB
                wireType = tag & 0x07,
                id = tag >>> 3;
            switch (wireType) {
                case ProtoBuf.WIRE_TYPES.VARINT:
                    do tag = buf.readUint8();
                    while ((tag & 0x80) === 0x80);
                    break;
                case ProtoBuf.WIRE_TYPES.BITS64:
                    buf.offset += 8;
                    break;
                case ProtoBuf.WIRE_TYPES.LDELIM:
                    tag = buf.readVarint32(); // reads the varint
                    buf.offset += tag;        // skips n bytes
                    break;
                case ProtoBuf.WIRE_TYPES.STARTGROUP:
                    skipTillGroupEnd(id, buf);
                    break;
                case ProtoBuf.WIRE_TYPES.ENDGROUP:
                    if (id === expectedId)
                        return false;
                    else
                        throw Error("Illegal GROUPEND after unknown group: "+id+" ("+expectedId+" expected)");
                case ProtoBuf.WIRE_TYPES.BITS32:
                    buf.offset += 4;
                    break;
                default:
                    throw Error("Illegal wire type in unknown group "+expectedId+": "+wireType);
            }
            return true;
        }

        /**
         * Decodes an encoded message and returns the decoded message.
         * @param {ByteBuffer} buffer ByteBuffer to decode from
         * @param {number=} length Message length. Defaults to decode all remaining data.
         * @param {number=} expectedGroupEndId Expected GROUPEND id if this is a legacy group
         * @return {ProtoBuf.Builder.Message} Decoded message
         * @throws {Error} If the message cannot be decoded
         * @expose
         */
        MessagePrototype.decode = function(buffer, length, expectedGroupEndId) {
            if (typeof length !== 'number')
                length = -1;
            var start = buffer.offset,
                msg = new (this.clazz)(),
                tag, wireType, id, field;
            while (buffer.offset < start+length || (length === -1 && buffer.remaining() > 0)) {
                tag = buffer.readVarint32();
                wireType = tag & 0x07;
                id = tag >>> 3;
                if (wireType === ProtoBuf.WIRE_TYPES.ENDGROUP) {
                    if (id !== expectedGroupEndId)
                        throw Error("Illegal group end indicator for "+this.toString(true)+": "+id+" ("+(expectedGroupEndId ? expectedGroupEndId+" expected" : "not a group")+")");
                    break;
                }
                if (!(field = this._fieldsById[id])) {
                    // "messages created by your new code can be parsed by your old code: old binaries simply ignore the new field when parsing."
                    switch (wireType) {
                        case ProtoBuf.WIRE_TYPES.VARINT:
                            buffer.readVarint32();
                            break;
                        case ProtoBuf.WIRE_TYPES.BITS32:
                            buffer.offset += 4;
                            break;
                        case ProtoBuf.WIRE_TYPES.BITS64:
                            buffer.offset += 8;
                            break;
                        case ProtoBuf.WIRE_TYPES.LDELIM:
                            var len = buffer.readVarint32();
                            buffer.offset += len;
                            break;
                        case ProtoBuf.WIRE_TYPES.STARTGROUP:
                            while (skipTillGroupEnd(id, buffer)) {}
                            break;
                        default:
                            throw Error("Illegal wire type for unknown field "+id+" in "+this.toString(true)+"#decode: "+wireType);
                    }
                    continue;
                }
                if (field.repeated && !field.options["packed"]) {
                    msg[field.name].push(field.decode(wireType, buffer));
                } else if (field.map) {
                    var keyval = field.decode(wireType, buffer);
                    msg[field.name].set(keyval[0], keyval[1]);
                } else {
                    msg[field.name] = field.decode(wireType, buffer);
                    if (field.oneof) { // Field is part of an OneOf (not a virtual OneOf field)
                        var currentField = msg[field.oneof.name]; // Virtual field references currently set field
                        if (currentField !== null && currentField !== field.name)
                            msg[currentField] = null; // Clear currently set field
                        msg[field.oneof.name] = field.name; // Point virtual field at this field
                    }
                }
            }

            // Check if all required fields are present and set default values for optional fields that are not
            for (var i=0, k=this._fields.length; i<k; ++i) {
                field = this._fields[i];
                if (msg[field.name] === null) {
                    if (this.syntax === "proto3") { // Proto3 sets default values by specification
                        msg[field.name] = field.defaultValue;
                    } else if (field.required) {
                        var err = Error("Missing at least one required field for " + this.toString(true) + ": " + field.name);
                        err["decoded"] = msg; // Still expose what we got
                        throw(err);
                    } else if (ProtoBuf.populateDefaults && field.defaultValue !== null)
                        msg[field.name] = field.defaultValue;
                }
            }
            return msg;
        };

        /**
         * @alias ProtoBuf.Reflect.Message
         * @expose
         */
        Reflect.Message = Message;

        /**
         * Constructs a new Message Field.
         * @exports ProtoBuf.Reflect.Message.Field
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Message} message Message reference
         * @param {string} rule Rule, one of requried, optional, repeated
         * @param {string?} keytype Key data type, if any.
         * @param {string} type Data type, e.g. int32
         * @param {string} name Field name
         * @param {number} id Unique field id
         * @param {Object.<string,*>=} options Options
         * @param {!ProtoBuf.Reflect.Message.OneOf=} oneof Enclosing OneOf
         * @param {string?} syntax The syntax level of this definition (e.g., proto3)
         * @constructor
         * @extends ProtoBuf.Reflect.T
         */
        var Field = function(builder, message, rule, keytype, type, name, id, options, oneof, syntax) {
            T.call(this, builder, message, name);

            /**
             * @override
             */
            this.className = "Message.Field";

            /**
             * Message field required flag.
             * @type {boolean}
             * @expose
             */
            this.required = rule === "required";

            /**
             * Message field repeated flag.
             * @type {boolean}
             * @expose
             */
            this.repeated = rule === "repeated";

            /**
             * Message field map flag.
             * @type {boolean}
             * @expose
             */
            this.map = rule === "map";

            /**
             * Message field key type. Type reference string if unresolved, protobuf
             * type if resolved. Valid only if this.map === true, null otherwise.
             * @type {string|{name: string, wireType: number}|null}
             * @expose
             */
            this.keyType = keytype || null;

            /**
             * Message field type. Type reference string if unresolved, protobuf type if
             * resolved. In a map field, this is the value type.
             * @type {string|{name: string, wireType: number}}
             * @expose
             */
            this.type = type;

            /**
             * Resolved type reference inside the global namespace.
             * @type {ProtoBuf.Reflect.T|null}
             * @expose
             */
            this.resolvedType = null;

            /**
             * Unique message field id.
             * @type {number}
             * @expose
             */
            this.id = id;

            /**
             * Message field options.
             * @type {!Object.<string,*>}
             * @dict
             * @expose
             */
            this.options = options || {};

            /**
             * Default value.
             * @type {*}
             * @expose
             */
            this.defaultValue = null;

            /**
             * Enclosing OneOf.
             * @type {?ProtoBuf.Reflect.Message.OneOf}
             * @expose
             */
            this.oneof = oneof || null;

            /**
             * Syntax level of this definition (e.g., proto3).
             * @type {string}
             * @expose
             */
            this.syntax = syntax || 'proto2';

            /**
             * Original field name.
             * @type {string}
             * @expose
             */
            this.originalName = this.name; // Used to revert camelcase transformation on naming collisions

            /**
             * Element implementation. Created in build() after types are resolved.
             * @type {ProtoBuf.Element}
             * @expose
             */
            this.element = null;

            /**
             * Key element implementation, for map fields. Created in build() after
             * types are resolved.
             * @type {ProtoBuf.Element}
             * @expose
             */
            this.keyElement = null;

            // Convert field names to camel case notation if the override is set
            if (this.builder.options['convertFieldsToCamelCase'] && !(this instanceof Message.ExtensionField))
                this.name = ProtoBuf.Util.toCamelCase(this.name);
        };

        /**
         * @alias ProtoBuf.Reflect.Message.Field.prototype
         * @inner
         */
        var FieldPrototype = Field.prototype = Object.create(T.prototype);

        /**
         * Builds the field.
         * @override
         * @expose
         */
        FieldPrototype.build = function() {
            this.element = new Element(this.type, this.resolvedType, false, this.syntax, this.name);
            if (this.map)
                this.keyElement = new Element(this.keyType, undefined, true, this.syntax, this.name);

            // In proto3, fields do not have field presence, and every field is set to
            // its type's default value ("", 0, 0.0, or false).
            if (this.syntax === 'proto3' && !this.repeated && !this.map)
                this.defaultValue = Element.defaultFieldValue(this.type);

            // Otherwise, default values are present when explicitly specified
            else if (typeof this.options['default'] !== 'undefined')
                this.defaultValue = this.verifyValue(this.options['default']);
        };

        /**
         * Checks if the given value can be set for this field.
         * @param {*} value Value to check
         * @param {boolean=} skipRepeated Whether to skip the repeated value check or not. Defaults to false.
         * @return {*} Verified, maybe adjusted, value
         * @throws {Error} If the value cannot be set for this field
         * @expose
         */
        FieldPrototype.verifyValue = function(value, skipRepeated) {
            skipRepeated = skipRepeated || false;
            var self = this;
            function fail(val, msg) {
                throw Error("Illegal value for "+self.toString(true)+" of type "+self.type.name+": "+val+" ("+msg+")");
            }
            if (value === null) { // NULL values for optional fields
                if (this.required)
                    fail(typeof value, "required");
                if (this.syntax === 'proto3' && this.type !== ProtoBuf.TYPES["message"])
                    fail(typeof value, "proto3 field without field presence cannot be null");
                return null;
            }
            var i;
            if (this.repeated && !skipRepeated) { // Repeated values as arrays
                if (!Array.isArray(value))
                    value = [value];
                var res = [];
                for (i=0; i<value.length; i++)
                    res.push(this.element.verifyValue(value[i]));
                return res;
            }
            if (this.map && !skipRepeated) { // Map values as objects
                if (!(value instanceof ProtoBuf.Map)) {
                    // If not already a Map, attempt to convert.
                    if (!(value instanceof Object)) {
                        fail(typeof value,
                             "expected ProtoBuf.Map or raw object for map field");
                    }
                    return new ProtoBuf.Map(this, value);
                } else {
                    return value;
                }
            }
            // All non-repeated fields expect no array
            if (!this.repeated && Array.isArray(value))
                fail(typeof value, "no array expected");

            return this.element.verifyValue(value);
        };

        /**
         * Determines whether the field will have a presence on the wire given its
         * value.
         * @param {*} value Verified field value
         * @param {!ProtoBuf.Builder.Message} message Runtime message
         * @return {boolean} Whether the field will be present on the wire
         */
        FieldPrototype.hasWirePresence = function(value, message) {
            if (this.syntax !== 'proto3')
                return (value !== null);
            if (this.oneof && message[this.oneof.name] === this.name)
                return true;
            switch (this.type) {
                case ProtoBuf.TYPES["int32"]:
                case ProtoBuf.TYPES["sint32"]:
                case ProtoBuf.TYPES["sfixed32"]:
                case ProtoBuf.TYPES["uint32"]:
                case ProtoBuf.TYPES["fixed32"]:
                    return value !== 0;

                case ProtoBuf.TYPES["int64"]:
                case ProtoBuf.TYPES["sint64"]:
                case ProtoBuf.TYPES["sfixed64"]:
                case ProtoBuf.TYPES["uint64"]:
                case ProtoBuf.TYPES["fixed64"]:
                    return value.low !== 0 || value.high !== 0;

                case ProtoBuf.TYPES["bool"]:
                    return value;

                case ProtoBuf.TYPES["float"]:
                case ProtoBuf.TYPES["double"]:
                    return value !== 0.0;

                case ProtoBuf.TYPES["string"]:
                    return value.length > 0;

                case ProtoBuf.TYPES["bytes"]:
                    return value.remaining() > 0;

                case ProtoBuf.TYPES["enum"]:
                    return value !== 0;

                case ProtoBuf.TYPES["message"]:
                    return value !== null;
                default:
                    return true;
            }
        };

        /**
         * Encodes the specified field value to the specified buffer.
         * @param {*} value Verified field value
         * @param {ByteBuffer} buffer ByteBuffer to encode to
         * @param {!ProtoBuf.Builder.Message} message Runtime message
         * @return {ByteBuffer} The ByteBuffer for chaining
         * @throws {Error} If the field cannot be encoded
         * @expose
         */
        FieldPrototype.encode = function(value, buffer, message) {
            if (this.type === null || typeof this.type !== 'object')
                throw Error("[INTERNAL] Unresolved type in "+this.toString(true)+": "+this.type);
            if (value === null || (this.repeated && value.length == 0))
                return buffer; // Optional omitted
            try {
                if (this.repeated) {
                    var i;
                    // "Only repeated fields of primitive numeric types (types which use the varint, 32-bit, or 64-bit wire
                    // types) can be declared 'packed'."
                    if (this.options["packed"] && ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
                        // "All of the elements of the field are packed into a single key-value pair with wire type 2
                        // (length-delimited). Each element is encoded the same way it would be normally, except without a
                        // tag preceding it."
                        buffer.writeVarint32((this.id << 3) | ProtoBuf.WIRE_TYPES.LDELIM);
                        buffer.ensureCapacity(buffer.offset += 1); // We do not know the length yet, so let's assume a varint of length 1
                        var start = buffer.offset; // Remember where the contents begin
                        for (i=0; i<value.length; i++)
                            this.element.encodeValue(this.id, value[i], buffer);
                        var len = buffer.offset-start,
                            varintLen = ByteBuffer.calculateVarint32(len);
                        if (varintLen > 1) { // We need to move the contents
                            var contents = buffer.slice(start, buffer.offset);
                            start += varintLen-1;
                            buffer.offset = start;
                            buffer.append(contents);
                        }
                        buffer.writeVarint32(len, start-varintLen);
                    } else {
                        // "If your message definition has repeated elements (without the [packed=true] option), the encoded
                        // message has zero or more key-value pairs with the same tag number"
                        for (i=0; i<value.length; i++)
                            buffer.writeVarint32((this.id << 3) | this.type.wireType),
                            this.element.encodeValue(this.id, value[i], buffer);
                    }
                } else if (this.map) {
                    // Write out each map entry as a submessage.
                    value.forEach(function(val, key, m) {
                        // Compute the length of the submessage (key, val) pair.
                        var length =
                            ByteBuffer.calculateVarint32((1 << 3) | this.keyType.wireType) +
                            this.keyElement.calculateLength(1, key) +
                            ByteBuffer.calculateVarint32((2 << 3) | this.type.wireType) +
                            this.element.calculateLength(2, val);

                        // Submessage with wire type of length-delimited.
                        buffer.writeVarint32((this.id << 3) | ProtoBuf.WIRE_TYPES.LDELIM);
                        buffer.writeVarint32(length);

                        // Write out the key and val.
                        buffer.writeVarint32((1 << 3) | this.keyType.wireType);
                        this.keyElement.encodeValue(1, key, buffer);
                        buffer.writeVarint32((2 << 3) | this.type.wireType);
                        this.element.encodeValue(2, val, buffer);
                    }, this);
                } else {
                    if (this.hasWirePresence(value, message)) {
                        buffer.writeVarint32((this.id << 3) | this.type.wireType);
                        this.element.encodeValue(this.id, value, buffer);
                    }
                }
            } catch (e) {
                throw Error("Illegal value for "+this.toString(true)+": "+value+" ("+e+")");
            }
            return buffer;
        };

        /**
         * Calculates the length of this field's value on the network level.
         * @param {*} value Field value
         * @param {!ProtoBuf.Builder.Message} message Runtime message
         * @returns {number} Byte length
         * @expose
         */
        FieldPrototype.calculate = function(value, message) {
            value = this.verifyValue(value); // May throw
            if (this.type === null || typeof this.type !== 'object')
                throw Error("[INTERNAL] Unresolved type in "+this.toString(true)+": "+this.type);
            if (value === null || (this.repeated && value.length == 0))
                return 0; // Optional omitted
            var n = 0;
            try {
                if (this.repeated) {
                    var i, ni;
                    if (this.options["packed"] && ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
                        n += ByteBuffer.calculateVarint32((this.id << 3) | ProtoBuf.WIRE_TYPES.LDELIM);
                        ni = 0;
                        for (i=0; i<value.length; i++)
                            ni += this.element.calculateLength(this.id, value[i]);
                        n += ByteBuffer.calculateVarint32(ni);
                        n += ni;
                    } else {
                        for (i=0; i<value.length; i++)
                            n += ByteBuffer.calculateVarint32((this.id << 3) | this.type.wireType),
                            n += this.element.calculateLength(this.id, value[i]);
                    }
                } else if (this.map) {
                    // Each map entry becomes a submessage.
                    value.forEach(function(val, key, m) {
                        // Compute the length of the submessage (key, val) pair.
                        var length =
                            ByteBuffer.calculateVarint32((1 << 3) | this.keyType.wireType) +
                            this.keyElement.calculateLength(1, key) +
                            ByteBuffer.calculateVarint32((2 << 3) | this.type.wireType) +
                            this.element.calculateLength(2, val);

                        n += ByteBuffer.calculateVarint32((this.id << 3) | ProtoBuf.WIRE_TYPES.LDELIM);
                        n += ByteBuffer.calculateVarint32(length);
                        n += length;
                    }, this);
                } else {
                    if (this.hasWirePresence(value, message)) {
                        n += ByteBuffer.calculateVarint32((this.id << 3) | this.type.wireType);
                        n += this.element.calculateLength(this.id, value);
                    }
                }
            } catch (e) {
                throw Error("Illegal value for "+this.toString(true)+": "+value+" ("+e+")");
            }
            return n;
        };

        /**
         * Decode the field value from the specified buffer.
         * @param {number} wireType Leading wire type
         * @param {ByteBuffer} buffer ByteBuffer to decode from
         * @param {boolean=} skipRepeated Whether to skip the repeated check or not. Defaults to false.
         * @return {*} Decoded value: array for packed repeated fields, [key, value] for
         *             map fields, or an individual value otherwise.
         * @throws {Error} If the field cannot be decoded
         * @expose
         */
        FieldPrototype.decode = function(wireType, buffer, skipRepeated) {
            var value, nBytes;

            // We expect wireType to match the underlying type's wireType unless we see
            // a packed repeated field, or unless this is a map field.
            var wireTypeOK =
                (!this.map && wireType == this.type.wireType) ||
                (!skipRepeated && this.repeated && this.options["packed"] &&
                 wireType == ProtoBuf.WIRE_TYPES.LDELIM) ||
                (this.map && wireType == ProtoBuf.WIRE_TYPES.LDELIM);
            if (!wireTypeOK)
                throw Error("Illegal wire type for field "+this.toString(true)+": "+wireType+" ("+this.type.wireType+" expected)");

            // Handle packed repeated fields.
            if (wireType == ProtoBuf.WIRE_TYPES.LDELIM && this.repeated && this.options["packed"] && ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
                if (!skipRepeated) {
                    nBytes = buffer.readVarint32();
                    nBytes = buffer.offset + nBytes; // Limit
                    var values = [];
                    while (buffer.offset < nBytes)
                        values.push(this.decode(this.type.wireType, buffer, true));
                    return values;
                }
                // Read the next value otherwise...
            }

            // Handle maps.
            if (this.map) {
                // Read one (key, value) submessage, and return [key, value]
                var key = Element.defaultFieldValue(this.keyType);
                value = Element.defaultFieldValue(this.type);

                // Read the length
                nBytes = buffer.readVarint32();
                if (buffer.remaining() < nBytes)
                    throw Error("Illegal number of bytes for "+this.toString(true)+": "+nBytes+" required but got only "+buffer.remaining());

                // Get a sub-buffer of this key/value submessage
                var msgbuf = buffer.clone();
                msgbuf.limit = msgbuf.offset + nBytes;
                buffer.offset += nBytes;

                while (msgbuf.remaining() > 0) {
                    var tag = msgbuf.readVarint32();
                    wireType = tag & 0x07;
                    var id = tag >>> 3;
                    if (id === 1) {
                        key = this.keyElement.decode(msgbuf, wireType, id);
                    } else if (id === 2) {
                        value = this.element.decode(msgbuf, wireType, id);
                    } else {
                        throw Error("Unexpected tag in map field key/value submessage");
                    }
                }

                return [key, value];
            }

            // Handle singular and non-packed repeated field values.
            return this.element.decode(buffer, wireType, this.id);
        };

        /**
         * @alias ProtoBuf.Reflect.Message.Field
         * @expose
         */
        Reflect.Message.Field = Field;

        /**
         * Constructs a new Message ExtensionField.
         * @exports ProtoBuf.Reflect.Message.ExtensionField
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Message} message Message reference
         * @param {string} rule Rule, one of requried, optional, repeated
         * @param {string} type Data type, e.g. int32
         * @param {string} name Field name
         * @param {number} id Unique field id
         * @param {!Object.<string,*>=} options Options
         * @constructor
         * @extends ProtoBuf.Reflect.Message.Field
         */
        var ExtensionField = function(builder, message, rule, type, name, id, options) {
            Field.call(this, builder, message, rule, /* keytype = */ null, type, name, id, options);

            /**
             * Extension reference.
             * @type {!ProtoBuf.Reflect.Extension}
             * @expose
             */
            this.extension;
        };

        // Extends Field
        ExtensionField.prototype = Object.create(Field.prototype);

        /**
         * @alias ProtoBuf.Reflect.Message.ExtensionField
         * @expose
         */
        Reflect.Message.ExtensionField = ExtensionField;

        /**
         * Constructs a new Message OneOf.
         * @exports ProtoBuf.Reflect.Message.OneOf
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Message} message Message reference
         * @param {string} name OneOf name
         * @constructor
         * @extends ProtoBuf.Reflect.T
         */
        var OneOf = function(builder, message, name) {
            T.call(this, builder, message, name);

            /**
             * Enclosed fields.
             * @type {!Array.<!ProtoBuf.Reflect.Message.Field>}
             * @expose
             */
            this.fields = [];
        };

        /**
         * @alias ProtoBuf.Reflect.Message.OneOf
         * @expose
         */
        Reflect.Message.OneOf = OneOf;

        /**
         * Constructs a new Enum.
         * @exports ProtoBuf.Reflect.Enum
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.T} parent Parent Reflect object
         * @param {string} name Enum name
         * @param {Object.<string,*>=} options Enum options
         * @param {string?} syntax The syntax level (e.g., proto3)
         * @constructor
         * @extends ProtoBuf.Reflect.Namespace
         */
        var Enum = function(builder, parent, name, options, syntax) {
            Namespace.call(this, builder, parent, name, options, syntax);

            /**
             * @override
             */
            this.className = "Enum";

            /**
             * Runtime enum object.
             * @type {Object.<string,number>|null}
             * @expose
             */
            this.object = null;
        };

        /**
         * Gets the string name of an enum value.
         * @param {!ProtoBuf.Builder.Enum} enm Runtime enum
         * @param {number} value Enum value
         * @returns {?string} Name or `null` if not present
         * @expose
         */
        Enum.getName = function(enm, value) {
            var keys = Object.keys(enm);
            for (var i=0, key; i<keys.length; ++i)
                if (enm[key = keys[i]] === value)
                    return key;
            return null;
        };

        /**
         * @alias ProtoBuf.Reflect.Enum.prototype
         * @inner
         */
        var EnumPrototype = Enum.prototype = Object.create(Namespace.prototype);

        /**
         * Builds this enum and returns the runtime counterpart.
         * @param {boolean} rebuild Whether to rebuild or not, defaults to false
         * @returns {!Object.<string,number>}
         * @expose
         */
        EnumPrototype.build = function(rebuild) {
            if (this.object && !rebuild)
                return this.object;
            var enm = new ProtoBuf.Builder.Enum(),
                values = this.getChildren(Enum.Value);
            for (var i=0, k=values.length; i<k; ++i)
                enm[values[i]['name']] = values[i]['id'];
            if (Object.defineProperty)
                Object.defineProperty(enm, '$options', {
                    "value": this.buildOpt(),
                    "enumerable": false
                });
            return this.object = enm;
        };

        /**
         * @alias ProtoBuf.Reflect.Enum
         * @expose
         */
        Reflect.Enum = Enum;

        /**
         * Constructs a new Enum Value.
         * @exports ProtoBuf.Reflect.Enum.Value
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Enum} enm Enum reference
         * @param {string} name Field name
         * @param {number} id Unique field id
         * @constructor
         * @extends ProtoBuf.Reflect.T
         */
        var Value = function(builder, enm, name, id) {
            T.call(this, builder, enm, name);

            /**
             * @override
             */
            this.className = "Enum.Value";

            /**
             * Unique enum value id.
             * @type {number}
             * @expose
             */
            this.id = id;
        };

        // Extends T
        Value.prototype = Object.create(T.prototype);

        /**
         * @alias ProtoBuf.Reflect.Enum.Value
         * @expose
         */
        Reflect.Enum.Value = Value;

        /**
         * An extension (field).
         * @exports ProtoBuf.Reflect.Extension
         * @constructor
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.T} parent Parent object
         * @param {string} name Object name
         * @param {!ProtoBuf.Reflect.Message.Field} field Extension field
         */
        var Extension = function(builder, parent, name, field) {
            T.call(this, builder, parent, name);

            /**
             * Extended message field.
             * @type {!ProtoBuf.Reflect.Message.Field}
             * @expose
             */
            this.field = field;
        };

        // Extends T
        Extension.prototype = Object.create(T.prototype);

        /**
         * @alias ProtoBuf.Reflect.Extension
         * @expose
         */
        Reflect.Extension = Extension;

        /**
         * Constructs a new Service.
         * @exports ProtoBuf.Reflect.Service
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Namespace} root Root
         * @param {string} name Service name
         * @param {Object.<string,*>=} options Options
         * @constructor
         * @extends ProtoBuf.Reflect.Namespace
         */
        var Service = function(builder, root, name, options) {
            Namespace.call(this, builder, root, name, options);

            /**
             * @override
             */
            this.className = "Service";

            /**
             * Built runtime service class.
             * @type {?function(new:ProtoBuf.Builder.Service)}
             */
            this.clazz = null;
        };

        /**
         * @alias ProtoBuf.Reflect.Service.prototype
         * @inner
         */
        var ServicePrototype = Service.prototype = Object.create(Namespace.prototype);

        /**
         * Builds the service and returns the runtime counterpart, which is a fully functional class.
         * @see ProtoBuf.Builder.Service
         * @param {boolean=} rebuild Whether to rebuild or not
         * @return {Function} Service class
         * @throws {Error} If the message cannot be built
         * @expose
         */
        ServicePrototype.build = function(rebuild) {
            if (this.clazz && !rebuild)
                return this.clazz;

            // Create the runtime Service class in its own scope
            return this.clazz = (function(ProtoBuf, T) {

                /**
                 * Constructs a new runtime Service.
                 * @name ProtoBuf.Builder.Service
                 * @param {function(string, ProtoBuf.Builder.Message, function(Error, ProtoBuf.Builder.Message=))=} rpcImpl RPC implementation receiving the method name and the message
                 * @class Barebone of all runtime services.
                 * @constructor
                 * @throws {Error} If the service cannot be created
                 */
                var Service = function(rpcImpl) {
                    ProtoBuf.Builder.Service.call(this);

                    /**
                     * Service implementation.
                     * @name ProtoBuf.Builder.Service#rpcImpl
                     * @type {!function(string, ProtoBuf.Builder.Message, function(Error, ProtoBuf.Builder.Message=))}
                     * @expose
                     */
                    this.rpcImpl = rpcImpl || function(name, msg, callback) {
                        // This is what a user has to implement: A function receiving the method name, the actual message to
                        // send (type checked) and the callback that's either provided with the error as its first
                        // argument or null and the actual response message.
                        setTimeout(callback.bind(this, Error("Not implemented, see: https://github.com/dcodeIO/ProtoBuf.js/wiki/Services")), 0); // Must be async!
                    };
                };

                /**
                 * @alias ProtoBuf.Builder.Service.prototype
                 * @inner
                 */
                var ServicePrototype = Service.prototype = Object.create(ProtoBuf.Builder.Service.prototype);

                /**
                 * Asynchronously performs an RPC call using the given RPC implementation.
                 * @name ProtoBuf.Builder.Service.[Method]
                 * @function
                 * @param {!function(string, ProtoBuf.Builder.Message, function(Error, ProtoBuf.Builder.Message=))} rpcImpl RPC implementation
                 * @param {ProtoBuf.Builder.Message} req Request
                 * @param {function(Error, (ProtoBuf.Builder.Message|ByteBuffer|Buffer|string)=)} callback Callback receiving
                 *  the error if any and the response either as a pre-parsed message or as its raw bytes
                 * @abstract
                 */

                /**
                 * Asynchronously performs an RPC call using the instance's RPC implementation.
                 * @name ProtoBuf.Builder.Service#[Method]
                 * @function
                 * @param {ProtoBuf.Builder.Message} req Request
                 * @param {function(Error, (ProtoBuf.Builder.Message|ByteBuffer|Buffer|string)=)} callback Callback receiving
                 *  the error if any and the response either as a pre-parsed message or as its raw bytes
                 * @abstract
                 */

                var rpc = T.getChildren(ProtoBuf.Reflect.Service.RPCMethod);
                for (var i=0; i<rpc.length; i++) {
                    (function(method) {

                        // service#Method(message, callback)
                        ServicePrototype[method.name] = function(req, callback) {
                            try {
                                try {
                                    // If given as a buffer, decode the request. Will throw a TypeError if not a valid buffer.
                                    req = method.resolvedRequestType.clazz.decode(ByteBuffer.wrap(req));
                                } catch (err) {
                                    if (!(err instanceof TypeError))
                                        throw err;
                                }
                                if (req === null || typeof req !== 'object')
                                    throw Error("Illegal arguments");
                                if (!(req instanceof method.resolvedRequestType.clazz))
                                    req = new method.resolvedRequestType.clazz(req);
                                this.rpcImpl(method.fqn(), req, function(err, res) { // Assumes that this is properly async
                                    if (err) {
                                        callback(err);
                                        return;
                                    }
                                    // Coalesce to empty string when service response has empty content
                                    if (res === null)
                                        res = ''
                                    try { res = method.resolvedResponseType.clazz.decode(res); } catch (notABuffer) {}
                                    if (!res || !(res instanceof method.resolvedResponseType.clazz)) {
                                        callback(Error("Illegal response type received in service method "+ T.name+"#"+method.name));
                                        return;
                                    }
                                    callback(null, res);
                                });
                            } catch (err) {
                                setTimeout(callback.bind(this, err), 0);
                            }
                        };

                        // Service.Method(rpcImpl, message, callback)
                        Service[method.name] = function(rpcImpl, req, callback) {
                            new Service(rpcImpl)[method.name](req, callback);
                        };

                        if (Object.defineProperty)
                            Object.defineProperty(Service[method.name], "$options", { "value": method.buildOpt() }),
                            Object.defineProperty(ServicePrototype[method.name], "$options", { "value": Service[method.name]["$options"] });
                    })(rpc[i]);
                }

                // Properties

                /**
                 * Service options.
                 * @name ProtoBuf.Builder.Service.$options
                 * @type {Object.<string,*>}
                 * @expose
                 */
                var $optionsS; // cc needs this

                /**
                 * Service options.
                 * @name ProtoBuf.Builder.Service#$options
                 * @type {Object.<string,*>}
                 * @expose
                 */
                var $options;

                /**
                 * Reflection type.
                 * @name ProtoBuf.Builder.Service.$type
                 * @type {!ProtoBuf.Reflect.Service}
                 * @expose
                 */
                var $typeS;

                /**
                 * Reflection type.
                 * @name ProtoBuf.Builder.Service#$type
                 * @type {!ProtoBuf.Reflect.Service}
                 * @expose
                 */
                var $type;

                if (Object.defineProperty)
                    Object.defineProperty(Service, "$options", { "value": T.buildOpt() }),
                    Object.defineProperty(ServicePrototype, "$options", { "value": Service["$options"] }),
                    Object.defineProperty(Service, "$type", { "value": T }),
                    Object.defineProperty(ServicePrototype, "$type", { "value": T });

                return Service;

            })(ProtoBuf, this);
        };

        /**
         * @alias ProtoBuf.Reflect.Service
         * @expose
         */
        Reflect.Service = Service;

        /**
         * Abstract service method.
         * @exports ProtoBuf.Reflect.Service.Method
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Service} svc Service
         * @param {string} name Method name
         * @param {Object.<string,*>=} options Options
         * @constructor
         * @extends ProtoBuf.Reflect.T
         */
        var Method = function(builder, svc, name, options) {
            T.call(this, builder, svc, name);

            /**
             * @override
             */
            this.className = "Service.Method";

            /**
             * Options.
             * @type {Object.<string, *>}
             * @expose
             */
            this.options = options || {};
        };

        /**
         * @alias ProtoBuf.Reflect.Service.Method.prototype
         * @inner
         */
        var MethodPrototype = Method.prototype = Object.create(T.prototype);

        /**
         * Builds the method's '$options' property.
         * @name ProtoBuf.Reflect.Service.Method#buildOpt
         * @function
         * @return {Object.<string,*>}
         */
        MethodPrototype.buildOpt = NamespacePrototype.buildOpt;

        /**
         * @alias ProtoBuf.Reflect.Service.Method
         * @expose
         */
        Reflect.Service.Method = Method;

        /**
         * RPC service method.
         * @exports ProtoBuf.Reflect.Service.RPCMethod
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Service} svc Service
         * @param {string} name Method name
         * @param {string} request Request message name
         * @param {string} response Response message name
         * @param {boolean} request_stream Whether requests are streamed
         * @param {boolean} response_stream Whether responses are streamed
         * @param {Object.<string,*>=} options Options
         * @constructor
         * @extends ProtoBuf.Reflect.Service.Method
         */
        var RPCMethod = function(builder, svc, name, request, response, request_stream, response_stream, options) {
            Method.call(this, builder, svc, name, options);

            /**
             * @override
             */
            this.className = "Service.RPCMethod";

            /**
             * Request message name.
             * @type {string}
             * @expose
             */
            this.requestName = request;

            /**
             * Response message name.
             * @type {string}
             * @expose
             */
            this.responseName = response;

            /**
             * Whether requests are streamed
             * @type {bool}
             * @expose
             */
            this.requestStream = request_stream;

            /**
             * Whether responses are streamed
             * @type {bool}
             * @expose
             */
            this.responseStream = response_stream;

            /**
             * Resolved request message type.
             * @type {ProtoBuf.Reflect.Message}
             * @expose
             */
            this.resolvedRequestType = null;

            /**
             * Resolved response message type.
             * @type {ProtoBuf.Reflect.Message}
             * @expose
             */
            this.resolvedResponseType = null;
        };

        // Extends Method
        RPCMethod.prototype = Object.create(Method.prototype);

        /**
         * @alias ProtoBuf.Reflect.Service.RPCMethod
         * @expose
         */
        Reflect.Service.RPCMethod = RPCMethod;

        return Reflect;

    })(ProtoBuf);

    /**
     * @alias ProtoBuf.Builder
     * @expose
     */
    ProtoBuf.Builder = (function(ProtoBuf, Lang, Reflect) {
        "use strict";

        /**
         * Constructs a new Builder.
         * @exports ProtoBuf.Builder
         * @class Provides the functionality to build protocol messages.
         * @param {Object.<string,*>=} options Options
         * @constructor
         */
        var Builder = function(options) {

            /**
             * Namespace.
             * @type {ProtoBuf.Reflect.Namespace}
             * @expose
             */
            this.ns = new Reflect.Namespace(this, null, ""); // Global namespace

            /**
             * Namespace pointer.
             * @type {ProtoBuf.Reflect.T}
             * @expose
             */
            this.ptr = this.ns;

            /**
             * Resolved flag.
             * @type {boolean}
             * @expose
             */
            this.resolved = false;

            /**
             * The current building result.
             * @type {Object.<string,ProtoBuf.Builder.Message|Object>|null}
             * @expose
             */
            this.result = null;

            /**
             * Imported files.
             * @type {Array.<string>}
             * @expose
             */
            this.files = {};

            /**
             * Import root override.
             * @type {?string}
             * @expose
             */
            this.importRoot = null;

            /**
             * Options.
             * @type {!Object.<string, *>}
             * @expose
             */
            this.options = options || {};
        };

        /**
         * @alias ProtoBuf.Builder.prototype
         * @inner
         */
        var BuilderPrototype = Builder.prototype;

        // ----- Definition tests -----

        /**
         * Tests if a definition most likely describes a message.
         * @param {!Object} def
         * @returns {boolean}
         * @expose
         */
        Builder.isMessage = function(def) {
            // Messages require a string name
            if (typeof def["name"] !== 'string')
                return false;
            // Messages do not contain values (enum) or rpc methods (service)
            if (typeof def["values"] !== 'undefined' || typeof def["rpc"] !== 'undefined')
                return false;
            return true;
        };

        /**
         * Tests if a definition most likely describes a message field.
         * @param {!Object} def
         * @returns {boolean}
         * @expose
         */
        Builder.isMessageField = function(def) {
            // Message fields require a string rule, name and type and an id
            if (typeof def["rule"] !== 'string' || typeof def["name"] !== 'string' || typeof def["type"] !== 'string' || typeof def["id"] === 'undefined')
                return false;
            return true;
        };

        /**
         * Tests if a definition most likely describes an enum.
         * @param {!Object} def
         * @returns {boolean}
         * @expose
         */
        Builder.isEnum = function(def) {
            // Enums require a string name
            if (typeof def["name"] !== 'string')
                return false;
            // Enums require at least one value
            if (typeof def["values"] === 'undefined' || !Array.isArray(def["values"]) || def["values"].length === 0)
                return false;
            return true;
        };

        /**
         * Tests if a definition most likely describes a service.
         * @param {!Object} def
         * @returns {boolean}
         * @expose
         */
        Builder.isService = function(def) {
            // Services require a string name and an rpc object
            if (typeof def["name"] !== 'string' || typeof def["rpc"] !== 'object' || !def["rpc"])
                return false;
            return true;
        };

        /**
         * Tests if a definition most likely describes an extended message
         * @param {!Object} def
         * @returns {boolean}
         * @expose
         */
        Builder.isExtend = function(def) {
            // Extends rquire a string ref
            if (typeof def["ref"] !== 'string')
                return false;
            return true;
        };

        // ----- Building -----

        /**
         * Resets the pointer to the root namespace.
         * @returns {!ProtoBuf.Builder} this
         * @expose
         */
        BuilderPrototype.reset = function() {
            this.ptr = this.ns;
            return this;
        };

        /**
         * Defines a namespace on top of the current pointer position and places the pointer on it.
         * @param {string} namespace
         * @return {!ProtoBuf.Builder} this
         * @expose
         */
        BuilderPrototype.define = function(namespace) {
            if (typeof namespace !== 'string' || !Lang.TYPEREF.test(namespace))
                throw Error("illegal namespace: "+namespace);
            namespace.split(".").forEach(function(part) {
                var ns = this.ptr.getChild(part);
                if (ns === null) // Keep existing
                    this.ptr.addChild(ns = new Reflect.Namespace(this, this.ptr, part));
                this.ptr = ns;
            }, this);
            return this;
        };

        /**
         * Creates the specified definitions at the current pointer position.
         * @param {!Array.<!Object>} defs Messages, enums or services to create
         * @returns {!ProtoBuf.Builder} this
         * @throws {Error} If a message definition is invalid
         * @expose
         */
        BuilderPrototype.create = function(defs) {
            if (!defs)
                return this; // Nothing to create
            if (!Array.isArray(defs))
                defs = [defs];
            else {
                if (defs.length === 0)
                    return this;
                defs = defs.slice();
            }

            // It's quite hard to keep track of scopes and memory here, so let's do this iteratively.
            var stack = [defs];
            while (stack.length > 0) {
                defs = stack.pop();

                if (!Array.isArray(defs)) // Stack always contains entire namespaces
                    throw Error("not a valid namespace: "+JSON.stringify(defs));

                while (defs.length > 0) {
                    var def = defs.shift(); // Namespaces always contain an array of messages, enums and services

                    if (Builder.isMessage(def)) {
                        var obj = new Reflect.Message(this, this.ptr, def["name"], def["options"], def["isGroup"], def["syntax"]);

                        // Create OneOfs
                        var oneofs = {};
                        if (def["oneofs"])
                            Object.keys(def["oneofs"]).forEach(function(name) {
                                obj.addChild(oneofs[name] = new Reflect.Message.OneOf(this, obj, name));
                            }, this);

                        // Create fields
                        if (def["fields"])
                            def["fields"].forEach(function(fld) {
                                if (obj.getChild(fld["id"]|0) !== null)
                                    throw Error("duplicate or invalid field id in "+obj.name+": "+fld['id']);
                                if (fld["options"] && typeof fld["options"] !== 'object')
                                    throw Error("illegal field options in "+obj.name+"#"+fld["name"]);
                                var oneof = null;
                                if (typeof fld["oneof"] === 'string' && !(oneof = oneofs[fld["oneof"]]))
                                    throw Error("illegal oneof in "+obj.name+"#"+fld["name"]+": "+fld["oneof"]);
                                fld = new Reflect.Message.Field(this, obj, fld["rule"], fld["keytype"], fld["type"], fld["name"], fld["id"], fld["options"], oneof, def["syntax"]);
                                if (oneof)
                                    oneof.fields.push(fld);
                                obj.addChild(fld);
                            }, this);

                        // Push children to stack
                        var subObj = [];
                        if (def["enums"])
                            def["enums"].forEach(function(enm) {
                                subObj.push(enm);
                            });
                        if (def["messages"])
                            def["messages"].forEach(function(msg) {
                                subObj.push(msg);
                            });
                        if (def["services"])
                            def["services"].forEach(function(svc) {
                                subObj.push(svc);
                            });

                        // Set extension ranges
                        if (def["extensions"]) {
                            if (typeof def["extensions"][0] === 'number') // pre 5.0.1
                                obj.extensions = [ def["extensions"] ];
                            else
                                obj.extensions = def["extensions"];
                        }

                        // Create on top of current namespace
                        this.ptr.addChild(obj);
                        if (subObj.length > 0) {
                            stack.push(defs); // Push the current level back
                            defs = subObj; // Continue processing sub level
                            subObj = null;
                            this.ptr = obj; // And move the pointer to this namespace
                            obj = null;
                            continue;
                        }
                        subObj = null;

                    } else if (Builder.isEnum(def)) {

                        obj = new Reflect.Enum(this, this.ptr, def["name"], def["options"], def["syntax"]);
                        def["values"].forEach(function(val) {
                            obj.addChild(new Reflect.Enum.Value(this, obj, val["name"], val["id"]));
                        }, this);
                        this.ptr.addChild(obj);

                    } else if (Builder.isService(def)) {

                        obj = new Reflect.Service(this, this.ptr, def["name"], def["options"]);
                        Object.keys(def["rpc"]).forEach(function(name) {
                            var mtd = def["rpc"][name];
                            obj.addChild(new Reflect.Service.RPCMethod(this, obj, name, mtd["request"], mtd["response"], !!mtd["request_stream"], !!mtd["response_stream"], mtd["options"]));
                        }, this);
                        this.ptr.addChild(obj);

                    } else if (Builder.isExtend(def)) {

                        obj = this.ptr.resolve(def["ref"], true);
                        if (obj) {
                            def["fields"].forEach(function(fld) {
                                if (obj.getChild(fld['id']|0) !== null)
                                    throw Error("duplicate extended field id in "+obj.name+": "+fld['id']);
                                // Check if field id is allowed to be extended
                                if (obj.extensions) {
                                    var valid = false;
                                    obj.extensions.forEach(function(range) {
                                        if (fld["id"] >= range[0] && fld["id"] <= range[1])
                                            valid = true;
                                    });
                                    if (!valid)
                                        throw Error("illegal extended field id in "+obj.name+": "+fld['id']+" (not within valid ranges)");
                                }
                                // Convert extension field names to camel case notation if the override is set
                                var name = fld["name"];
                                if (this.options['convertFieldsToCamelCase'])
                                    name = ProtoBuf.Util.toCamelCase(name);
                                // see #161: Extensions use their fully qualified name as their runtime key and...
                                var field = new Reflect.Message.ExtensionField(this, obj, fld["rule"], fld["type"], this.ptr.fqn()+'.'+name, fld["id"], fld["options"]);
                                // ...are added on top of the current namespace as an extension which is used for
                                // resolving their type later on (the extension always keeps the original name to
                                // prevent naming collisions)
                                var ext = new Reflect.Extension(this, this.ptr, fld["name"], field);
                                field.extension = ext;
                                this.ptr.addChild(ext);
                                obj.addChild(field);
                            }, this);

                        } else if (!/\.?google\.protobuf\./.test(def["ref"])) // Silently skip internal extensions
                            throw Error("extended message "+def["ref"]+" is not defined");

                    } else
                        throw Error("not a valid definition: "+JSON.stringify(def));

                    def = null;
                    obj = null;
                }
                // Break goes here
                defs = null;
                this.ptr = this.ptr.parent; // Namespace done, continue at parent
            }
            this.resolved = false; // Require re-resolve
            this.result = null; // Require re-build
            return this;
        };

        /**
         * Propagates syntax to all children.
         * @param {!Object} parent
         * @inner
         */
        function propagateSyntax(parent) {
            if (parent['messages']) {
                parent['messages'].forEach(function(child) {
                    child["syntax"] = parent["syntax"];
                    propagateSyntax(child);
                });
            }
            if (parent['enums']) {
                parent['enums'].forEach(function(child) {
                    child["syntax"] = parent["syntax"];
                });
            }
        }

        /**
         * Imports another definition into this builder.
         * @param {Object.<string,*>} json Parsed import
         * @param {(string|{root: string, file: string})=} filename Imported file name
         * @returns {!ProtoBuf.Builder} this
         * @throws {Error} If the definition or file cannot be imported
         * @expose
         */
        BuilderPrototype["import"] = function(json, filename) {
            var delim = '/';

            // Make sure to skip duplicate imports

            if (typeof filename === 'string') {

                if (ProtoBuf.Util.IS_NODE)
                    filename = require("path")['resolve'](filename);
                if (this.files[filename] === true)
                    return this.reset();
                this.files[filename] = true;

            } else if (typeof filename === 'object') { // Object with root, file.

                var root = filename.root;
                if (ProtoBuf.Util.IS_NODE)
                    root = require("path")['resolve'](root);
                if (root.indexOf("\\") >= 0 || filename.file.indexOf("\\") >= 0)
                    delim = '\\';
                var fname;
                if (ProtoBuf.Util.IS_NODE)
                    fname = require("path")['join'](root, filename.file);
                else
                    fname = root + delim + filename.file;
                if (this.files[fname] === true)
                    return this.reset();
                this.files[fname] = true;
            }

            // Import imports

            if (json['imports'] && json['imports'].length > 0) {
                var importRoot,
                    resetRoot = false;

                if (typeof filename === 'object') { // If an import root is specified, override

                    this.importRoot = filename["root"]; resetRoot = true; // ... and reset afterwards
                    importRoot = this.importRoot;
                    filename = filename["file"];
                    if (importRoot.indexOf("\\") >= 0 || filename.indexOf("\\") >= 0)
                        delim = '\\';

                } else if (typeof filename === 'string') {

                    if (this.importRoot) // If import root is overridden, use it
                        importRoot = this.importRoot;
                    else { // Otherwise compute from filename
                        if (filename.indexOf("/") >= 0) { // Unix
                            importRoot = filename.replace(/\/[^\/]*$/, "");
                            if (/* /file.proto */ importRoot === "")
                                importRoot = "/";
                        } else if (filename.indexOf("\\") >= 0) { // Windows
                            importRoot = filename.replace(/\\[^\\]*$/, "");
                            delim = '\\';
                        } else
                            importRoot = ".";
                    }

                } else
                    importRoot = null;

                for (var i=0; i<json['imports'].length; i++) {
                    if (typeof json['imports'][i] === 'string') { // Import file
                        if (!importRoot)
                            throw Error("cannot determine import root");
                        var importFilename = json['imports'][i];
                        if (importFilename === "google/protobuf/descriptor.proto")
                            continue; // Not needed and therefore not used
                        if (ProtoBuf.Util.IS_NODE)
                            importFilename = require("path")['join'](importRoot, importFilename);
                        else
                            importFilename = importRoot + delim + importFilename;
                        if (this.files[importFilename] === true)
                            continue; // Already imported
                        if (/\.proto$/i.test(importFilename) && !ProtoBuf.DotProto)       // If this is a light build
                            importFilename = importFilename.replace(/\.proto$/, ".json"); // always load the JSON file
                        var contents = ProtoBuf.Util.fetch(importFilename);
                        if (contents === null)
                            throw Error("failed to import '"+importFilename+"' in '"+filename+"': file not found");
                        if (/\.json$/i.test(importFilename)) // Always possible
                            this["import"](JSON.parse(contents+""), importFilename); // May throw
                        else
                            this["import"](ProtoBuf.DotProto.Parser.parse(contents), importFilename); // May throw
                    } else // Import structure
                        if (!filename)
                            this["import"](json['imports'][i]);
                        else if (/\.(\w+)$/.test(filename)) // With extension: Append _importN to the name portion to make it unique
                            this["import"](json['imports'][i], filename.replace(/^(.+)\.(\w+)$/, function($0, $1, $2) { return $1+"_import"+i+"."+$2; }));
                        else // Without extension: Append _importN to make it unique
                            this["import"](json['imports'][i], filename+"_import"+i);
                }
                if (resetRoot) // Reset import root override when all imports are done
                    this.importRoot = null;
            }

            // Import structures

            if (json['package'])
                this.define(json['package']);
            if (json['syntax'])
                propagateSyntax(json);
            var base = this.ptr;
            if (json['options'])
                Object.keys(json['options']).forEach(function(key) {
                    base.options[key] = json['options'][key];
                });
            if (json['messages'])
                this.create(json['messages']),
                this.ptr = base;
            if (json['enums'])
                this.create(json['enums']),
                this.ptr = base;
            if (json['services'])
                this.create(json['services']),
                this.ptr = base;
            if (json['extends'])
                this.create(json['extends']);

            return this.reset();
        };

        /**
         * Resolves all namespace objects.
         * @throws {Error} If a type cannot be resolved
         * @returns {!ProtoBuf.Builder} this
         * @expose
         */
        BuilderPrototype.resolveAll = function() {
            // Resolve all reflected objects
            var res;
            if (this.ptr == null || typeof this.ptr.type === 'object')
                return this; // Done (already resolved)

            if (this.ptr instanceof Reflect.Namespace) { // Resolve children

                this.ptr.children.forEach(function(child) {
                    this.ptr = child;
                    this.resolveAll();
                }, this);

            } else if (this.ptr instanceof Reflect.Message.Field) { // Resolve type

                if (!Lang.TYPE.test(this.ptr.type)) {
                    if (!Lang.TYPEREF.test(this.ptr.type))
                        throw Error("illegal type reference in "+this.ptr.toString(true)+": "+this.ptr.type);
                    res = (this.ptr instanceof Reflect.Message.ExtensionField ? this.ptr.extension.parent : this.ptr.parent).resolve(this.ptr.type, true);
                    if (!res)
                        throw Error("unresolvable type reference in "+this.ptr.toString(true)+": "+this.ptr.type);
                    this.ptr.resolvedType = res;
                    if (res instanceof Reflect.Enum) {
                        this.ptr.type = ProtoBuf.TYPES["enum"];
                        if (this.ptr.syntax === 'proto3' && res.syntax !== 'proto3')
                            throw Error("proto3 message cannot reference proto2 enum");
                    }
                    else if (res instanceof Reflect.Message)
                        this.ptr.type = res.isGroup ? ProtoBuf.TYPES["group"] : ProtoBuf.TYPES["message"];
                    else
                        throw Error("illegal type reference in "+this.ptr.toString(true)+": "+this.ptr.type);
                } else
                    this.ptr.type = ProtoBuf.TYPES[this.ptr.type];

                // If it's a map field, also resolve the key type. The key type can be only a numeric, string, or bool type
                // (i.e., no enums or messages), so we don't need to resolve against the current namespace.
                if (this.ptr.map) {
                    if (!Lang.TYPE.test(this.ptr.keyType))
                        throw Error("illegal key type for map field in "+this.ptr.toString(true)+": "+this.ptr.keyType);
                    this.ptr.keyType = ProtoBuf.TYPES[this.ptr.keyType];
                }

                // If it's a repeated and packable field then proto3 mandates it should be packed by
                // default
                if (
                  this.ptr.syntax === 'proto3' &&
                  this.ptr.repeated && this.ptr.options.packed === undefined &&
                  ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.ptr.type.wireType) !== -1
                ) {
                  this.ptr.options.packed = true;
                }

            } else if (this.ptr instanceof ProtoBuf.Reflect.Service.Method) {

                if (this.ptr instanceof ProtoBuf.Reflect.Service.RPCMethod) {
                    res = this.ptr.parent.resolve(this.ptr.requestName, true);
                    if (!res || !(res instanceof ProtoBuf.Reflect.Message))
                        throw Error("Illegal type reference in "+this.ptr.toString(true)+": "+this.ptr.requestName);
                    this.ptr.resolvedRequestType = res;
                    res = this.ptr.parent.resolve(this.ptr.responseName, true);
                    if (!res || !(res instanceof ProtoBuf.Reflect.Message))
                        throw Error("Illegal type reference in "+this.ptr.toString(true)+": "+this.ptr.responseName);
                    this.ptr.resolvedResponseType = res;
                } else // Should not happen as nothing else is implemented
                    throw Error("illegal service type in "+this.ptr.toString(true));

            } else if (
                !(this.ptr instanceof ProtoBuf.Reflect.Message.OneOf) && // Not built
                !(this.ptr instanceof ProtoBuf.Reflect.Extension) && // Not built
                !(this.ptr instanceof ProtoBuf.Reflect.Enum.Value) // Built in enum
            )
                throw Error("illegal object in namespace: "+typeof(this.ptr)+": "+this.ptr);

            return this.reset();
        };

        /**
         * Builds the protocol. This will first try to resolve all definitions and, if this has been successful,
         * return the built package.
         * @param {(string|Array.<string>)=} path Specifies what to return. If omitted, the entire namespace will be returned.
         * @returns {!ProtoBuf.Builder.Message|!Object.<string,*>}
         * @throws {Error} If a type could not be resolved
         * @expose
         */
        BuilderPrototype.build = function(path) {
            this.reset();
            if (!this.resolved)
                this.resolveAll(),
                this.resolved = true,
                this.result = null; // Require re-build
            if (this.result === null) // (Re-)Build
                this.result = this.ns.build();
            if (!path)
                return this.result;
            var part = typeof path === 'string' ? path.split(".") : path,
                ptr = this.result; // Build namespace pointer (no hasChild etc.)
            for (var i=0; i<part.length; i++)
                if (ptr[part[i]])
                    ptr = ptr[part[i]];
                else {
                    ptr = null;
                    break;
                }
            return ptr;
        };

        /**
         * Similar to {@link ProtoBuf.Builder#build}, but looks up the internal reflection descriptor.
         * @param {string=} path Specifies what to return. If omitted, the entire namespace wiil be returned.
         * @param {boolean=} excludeNonNamespace Excludes non-namespace types like fields, defaults to `false`
         * @returns {?ProtoBuf.Reflect.T} Reflection descriptor or `null` if not found
         */
        BuilderPrototype.lookup = function(path, excludeNonNamespace) {
            return path ? this.ns.resolve(path, excludeNonNamespace) : this.ns;
        };

        /**
         * Returns a string representation of this object.
         * @return {string} String representation as of "Builder"
         * @expose
         */
        BuilderPrototype.toString = function() {
            return "Builder";
        };

        // ----- Base classes -----
        // Exist for the sole purpose of being able to "... instanceof ProtoBuf.Builder.Message" etc.

        /**
         * @alias ProtoBuf.Builder.Message
         */
        Builder.Message = function() {};

        /**
         * @alias ProtoBuf.Builder.Enum
         */
        Builder.Enum = function() {};

        /**
         * @alias ProtoBuf.Builder.Message
         */
        Builder.Service = function() {};

        return Builder;

    })(ProtoBuf, ProtoBuf.Lang, ProtoBuf.Reflect);

    /**
     * @alias ProtoBuf.Map
     * @expose
     */
    ProtoBuf.Map = (function(ProtoBuf, Reflect) {
        "use strict";

        /**
         * Constructs a new Map. A Map is a container that is used to implement map
         * fields on message objects. It closely follows the ES6 Map API; however,
         * it is distinct because we do not want to depend on external polyfills or
         * on ES6 itself.
         *
         * @exports ProtoBuf.Map
         * @param {!ProtoBuf.Reflect.Field} field Map field
         * @param {Object.<string,*>=} contents Initial contents
         * @constructor
         */
        var Map = function(field, contents) {
            if (!field.map)
                throw Error("field is not a map");

            /**
             * The field corresponding to this map.
             * @type {!ProtoBuf.Reflect.Field}
             */
            this.field = field;

            /**
             * Element instance corresponding to key type.
             * @type {!ProtoBuf.Reflect.Element}
             */
            this.keyElem = new Reflect.Element(field.keyType, null, true, field.syntax);

            /**
             * Element instance corresponding to value type.
             * @type {!ProtoBuf.Reflect.Element}
             */
            this.valueElem = new Reflect.Element(field.type, field.resolvedType, false, field.syntax);

            /**
             * Internal map: stores mapping of (string form of key) -> (key, value)
             * pair.
             *
             * We provide map semantics for arbitrary key types, but we build on top
             * of an Object, which has only string keys. In order to avoid the need
             * to convert a string key back to its native type in many situations,
             * we store the native key value alongside the value. Thus, we only need
             * a one-way mapping from a key type to its string form that guarantees
             * uniqueness and equality (i.e., str(K1) === str(K2) if and only if K1
             * === K2).
             *
             * @type {!Object<string, {key: *, value: *}>}
             */
            this.map = {};

            /**
             * Returns the number of elements in the map.
             */
            Object.defineProperty(this, "size", {
                get: function() { return Object.keys(this.map).length; }
            });

            // Fill initial contents from a raw object.
            if (contents) {
                var keys = Object.keys(contents);
                for (var i = 0; i < keys.length; i++) {
                    var key = this.keyElem.valueFromString(keys[i]);
                    var val = this.valueElem.verifyValue(contents[keys[i]]);
                    this.map[this.keyElem.valueToString(key)] =
                        { key: key, value: val };
                }
            }
        };

        var MapPrototype = Map.prototype;

        /**
         * Helper: return an iterator over an array.
         * @param {!Array<*>} arr the array
         * @returns {!Object} an iterator
         * @inner
         */
        function arrayIterator(arr) {
            var idx = 0;
            return {
                next: function() {
                    if (idx < arr.length)
                        return { done: false, value: arr[idx++] };
                    return { done: true };
                }
            }
        }

        /**
         * Clears the map.
         */
        MapPrototype.clear = function() {
            this.map = {};
        };

        /**
         * Deletes a particular key from the map.
         * @returns {boolean} Whether any entry with this key was deleted.
         */
        MapPrototype["delete"] = function(key) {
            var keyValue = this.keyElem.valueToString(this.keyElem.verifyValue(key));
            var hadKey = keyValue in this.map;
            delete this.map[keyValue];
            return hadKey;
        };

        /**
         * Returns an iterator over [key, value] pairs in the map.
         * @returns {Object} The iterator
         */
        MapPrototype.entries = function() {
            var entries = [];
            var strKeys = Object.keys(this.map);
            for (var i = 0, entry; i < strKeys.length; i++)
                entries.push([(entry=this.map[strKeys[i]]).key, entry.value]);
            return arrayIterator(entries);
        };

        /**
         * Returns an iterator over keys in the map.
         * @returns {Object} The iterator
         */
        MapPrototype.keys = function() {
            var keys = [];
            var strKeys = Object.keys(this.map);
            for (var i = 0; i < strKeys.length; i++)
                keys.push(this.map[strKeys[i]].key);
            return arrayIterator(keys);
        };

        /**
         * Returns an iterator over values in the map.
         * @returns {!Object} The iterator
         */
        MapPrototype.values = function() {
            var values = [];
            var strKeys = Object.keys(this.map);
            for (var i = 0; i < strKeys.length; i++)
                values.push(this.map[strKeys[i]].value);
            return arrayIterator(values);
        };

        /**
         * Iterates over entries in the map, calling a function on each.
         * @param {function(this:*, *, *, *)} cb The callback to invoke with value, key, and map arguments.
         * @param {Object=} thisArg The `this` value for the callback
         */
        MapPrototype.forEach = function(cb, thisArg) {
            var strKeys = Object.keys(this.map);
            for (var i = 0, entry; i < strKeys.length; i++)
                cb.call(thisArg, (entry=this.map[strKeys[i]]).value, entry.key, this);
        };

        /**
         * Sets a key in the map to the given value.
         * @param {*} key The key
         * @param {*} value The value
         * @returns {!ProtoBuf.Map} The map instance
         */
        MapPrototype.set = function(key, value) {
            var keyValue = this.keyElem.verifyValue(key);
            var valValue = this.valueElem.verifyValue(value);
            this.map[this.keyElem.valueToString(keyValue)] =
                { key: keyValue, value: valValue };
            return this;
        };

        /**
         * Gets the value corresponding to a key in the map.
         * @param {*} key The key
         * @returns {*|undefined} The value, or `undefined` if key not present
         */
        MapPrototype.get = function(key) {
            var keyValue = this.keyElem.valueToString(this.keyElem.verifyValue(key));
            if (!(keyValue in this.map))
                return undefined;
            return this.map[keyValue].value;
        };

        /**
         * Determines whether the given key is present in the map.
         * @param {*} key The key
         * @returns {boolean} `true` if the key is present
         */
        MapPrototype.has = function(key) {
            var keyValue = this.keyElem.valueToString(this.keyElem.verifyValue(key));
            return (keyValue in this.map);
        };

        return Map;
    })(ProtoBuf, ProtoBuf.Reflect);


    /**
     * Loads a .proto string and returns the Builder.
     * @param {string} proto .proto file contents
     * @param {(ProtoBuf.Builder|string|{root: string, file: string})=} builder Builder to append to. Will create a new one if omitted.
     * @param {(string|{root: string, file: string})=} filename The corresponding file name if known. Must be specified for imports.
     * @return {ProtoBuf.Builder} Builder to create new messages
     * @throws {Error} If the definition cannot be parsed or built
     * @expose
     */
    ProtoBuf.loadProto = function(proto, builder, filename) {
        if (typeof builder === 'string' || (builder && typeof builder["file"] === 'string' && typeof builder["root"] === 'string'))
            filename = builder,
            builder = undefined;
        return ProtoBuf.loadJson(ProtoBuf.DotProto.Parser.parse(proto), builder, filename);
    };

    /**
     * Loads a .proto string and returns the Builder. This is an alias of {@link ProtoBuf.loadProto}.
     * @function
     * @param {string} proto .proto file contents
     * @param {(ProtoBuf.Builder|string)=} builder Builder to append to. Will create a new one if omitted.
     * @param {(string|{root: string, file: string})=} filename The corresponding file name if known. Must be specified for imports.
     * @return {ProtoBuf.Builder} Builder to create new messages
     * @throws {Error} If the definition cannot be parsed or built
     * @expose
     */
    ProtoBuf.protoFromString = ProtoBuf.loadProto; // Legacy

    /**
     * Loads a .proto file and returns the Builder.
     * @param {string|{root: string, file: string}} filename Path to proto file or an object specifying 'file' with
     *  an overridden 'root' path for all imported files.
     * @param {function(?Error, !ProtoBuf.Builder=)=} callback Callback that will receive `null` as the first and
     *  the Builder as its second argument on success, otherwise the error as its first argument. If omitted, the
     *  file will be read synchronously and this function will return the Builder.
     * @param {ProtoBuf.Builder=} builder Builder to append to. Will create a new one if omitted.
     * @return {?ProtoBuf.Builder|undefined} The Builder if synchronous (no callback specified, will be NULL if the
     *   request has failed), else undefined
     * @expose
     */
    ProtoBuf.loadProtoFile = function(filename, callback, builder) {
        if (callback && typeof callback === 'object')
            builder = callback,
            callback = null;
        else if (!callback || typeof callback !== 'function')
            callback = null;
        if (callback)
            return ProtoBuf.Util.fetch(typeof filename === 'string' ? filename : filename["root"]+"/"+filename["file"], function(contents) {
                if (contents === null) {
                    callback(Error("Failed to fetch file"));
                    return;
                }
                try {
                    callback(null, ProtoBuf.loadProto(contents, builder, filename));
                } catch (e) {
                    callback(e);
                }
            });
        var contents = ProtoBuf.Util.fetch(typeof filename === 'object' ? filename["root"]+"/"+filename["file"] : filename);
        return contents === null ? null : ProtoBuf.loadProto(contents, builder, filename);
    };

    /**
     * Loads a .proto file and returns the Builder. This is an alias of {@link ProtoBuf.loadProtoFile}.
     * @function
     * @param {string|{root: string, file: string}} filename Path to proto file or an object specifying 'file' with
     *  an overridden 'root' path for all imported files.
     * @param {function(?Error, !ProtoBuf.Builder=)=} callback Callback that will receive `null` as the first and
     *  the Builder as its second argument on success, otherwise the error as its first argument. If omitted, the
     *  file will be read synchronously and this function will return the Builder.
     * @param {ProtoBuf.Builder=} builder Builder to append to. Will create a new one if omitted.
     * @return {!ProtoBuf.Builder|undefined} The Builder if synchronous (no callback specified, will be NULL if the
     *   request has failed), else undefined
     * @expose
     */
    ProtoBuf.protoFromFile = ProtoBuf.loadProtoFile; // Legacy


    /**
     * Constructs a new empty Builder.
     * @param {Object.<string,*>=} options Builder options, defaults to global options set on ProtoBuf
     * @return {!ProtoBuf.Builder} Builder
     * @expose
     */
    ProtoBuf.newBuilder = function(options) {
        options = options || {};
        if (typeof options['convertFieldsToCamelCase'] === 'undefined')
            options['convertFieldsToCamelCase'] = ProtoBuf.convertFieldsToCamelCase;
        if (typeof options['populateAccessors'] === 'undefined')
            options['populateAccessors'] = ProtoBuf.populateAccessors;
        return new ProtoBuf.Builder(options);
    };

    /**
     * Loads a .json definition and returns the Builder.
     * @param {!*|string} json JSON definition
     * @param {(ProtoBuf.Builder|string|{root: string, file: string})=} builder Builder to append to. Will create a new one if omitted.
     * @param {(string|{root: string, file: string})=} filename The corresponding file name if known. Must be specified for imports.
     * @return {ProtoBuf.Builder} Builder to create new messages
     * @throws {Error} If the definition cannot be parsed or built
     * @expose
     */
    ProtoBuf.loadJson = function(json, builder, filename) {
        if (typeof builder === 'string' || (builder && typeof builder["file"] === 'string' && typeof builder["root"] === 'string'))
            filename = builder,
            builder = null;
        if (!builder || typeof builder !== 'object')
            builder = ProtoBuf.newBuilder();
        if (typeof json === 'string')
            json = JSON.parse(json);
        builder["import"](json, filename);
        builder.resolveAll();
        return builder;
    };

    /**
     * Loads a .json file and returns the Builder.
     * @param {string|!{root: string, file: string}} filename Path to json file or an object specifying 'file' with
     *  an overridden 'root' path for all imported files.
     * @param {function(?Error, !ProtoBuf.Builder=)=} callback Callback that will receive `null` as the first and
     *  the Builder as its second argument on success, otherwise the error as its first argument. If omitted, the
     *  file will be read synchronously and this function will return the Builder.
     * @param {ProtoBuf.Builder=} builder Builder to append to. Will create a new one if omitted.
     * @return {?ProtoBuf.Builder|undefined} The Builder if synchronous (no callback specified, will be NULL if the
     *   request has failed), else undefined
     * @expose
     */
    ProtoBuf.loadJsonFile = function(filename, callback, builder) {
        if (callback && typeof callback === 'object')
            builder = callback,
            callback = null;
        else if (!callback || typeof callback !== 'function')
            callback = null;
        if (callback)
            return ProtoBuf.Util.fetch(typeof filename === 'string' ? filename : filename["root"]+"/"+filename["file"], function(contents) {
                if (contents === null) {
                    callback(Error("Failed to fetch file"));
                    return;
                }
                try {
                    callback(null, ProtoBuf.loadJson(JSON.parse(contents), builder, filename));
                } catch (e) {
                    callback(e);
                }
            });
        var contents = ProtoBuf.Util.fetch(typeof filename === 'object' ? filename["root"]+"/"+filename["file"] : filename);
        return contents === null ? null : ProtoBuf.loadJson(JSON.parse(contents), builder, filename);
    };

    return ProtoBuf;
});

}).call(this,require('_process'))
},{"_process":8,"bytebuffer":2,"fs":1,"path":1}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AdBlocker = require('commonShared/AdBlocker');

var _AdBlocker2 = _interopRequireDefault(_AdBlocker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AdBlocker = function (_CoreAblocker) {
  _inherits(AdBlocker, _CoreAblocker);

  function AdBlocker() {
    _classCallCheck(this, AdBlocker);

    return _possibleConstructorReturn(this, (AdBlocker.__proto__ || Object.getPrototypeOf(AdBlocker)).call(this));
  }

  return AdBlocker;
}(_AdBlocker2.default);

exports.default = AdBlocker;

},{"commonShared/AdBlocker":43}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BandwidthCounter = require('commonShared/BandwidthCounter');

var _BandwidthCounter2 = _interopRequireDefault(_BandwidthCounter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BandwidthCounter = function (_CoreBandwidthCounter) {
  _inherits(BandwidthCounter, _CoreBandwidthCounter);

  function BandwidthCounter() {
    _classCallCheck(this, BandwidthCounter);

    return _possibleConstructorReturn(this, (BandwidthCounter.__proto__ || Object.getPrototypeOf(BandwidthCounter)).call(this));
  }

  return BandwidthCounter;
}(_BandwidthCounter2.default);

exports.default = BandwidthCounter;

},{"commonShared/BandwidthCounter":44}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CookiesBlocker = require('commonShared/CookiesBlocker');

var _CookiesBlocker2 = _interopRequireDefault(_CookiesBlocker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CookiesBlocker = function (_CoreCookiesBlocker) {
  _inherits(CookiesBlocker, _CoreCookiesBlocker);

  function CookiesBlocker() {
    _classCallCheck(this, CookiesBlocker);

    return _possibleConstructorReturn(this, (CookiesBlocker.__proto__ || Object.getPrototypeOf(CookiesBlocker)).call(this));
  }

  return CookiesBlocker;
}(_CookiesBlocker2.default);

exports.default = CookiesBlocker;

},{"commonShared/CookiesBlocker":45}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DnsPrefetch = require('commonShared/DnsPrefetch');

var _DnsPrefetch2 = _interopRequireDefault(_DnsPrefetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DnsPrefetch = function (_CoreDnsPrefetch) {
  _inherits(DnsPrefetch, _CoreDnsPrefetch);

  function DnsPrefetch() {
    _classCallCheck(this, DnsPrefetch);

    return _possibleConstructorReturn(this, (DnsPrefetch.__proto__ || Object.getPrototypeOf(DnsPrefetch)).call(this));
  }

  return DnsPrefetch;
}(_DnsPrefetch2.default);

exports.default = DnsPrefetch;

},{"commonShared/DnsPrefetch":46}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MalwareBlocker = require('commonShared/MalwareBlocker');

var _MalwareBlocker2 = _interopRequireDefault(_MalwareBlocker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MalwareBlocker = function (_CoreMalwareBlocker) {
  _inherits(MalwareBlocker, _CoreMalwareBlocker);

  function MalwareBlocker() {
    _classCallCheck(this, MalwareBlocker);

    return _possibleConstructorReturn(this, (MalwareBlocker.__proto__ || Object.getPrototypeOf(MalwareBlocker)).call(this));
  }

  return MalwareBlocker;
}(_MalwareBlocker2.default);

exports.default = MalwareBlocker;

},{"commonShared/MalwareBlocker":47}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Monitoring = require('commonShared/Monitoring');

var _Monitoring2 = _interopRequireDefault(_Monitoring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Monitoring = function (_CoreMonitoring) {
  _inherits(Monitoring, _CoreMonitoring);

  function Monitoring() {
    _classCallCheck(this, Monitoring);

    return _possibleConstructorReturn(this, (Monitoring.__proto__ || Object.getPrototypeOf(Monitoring)).call(this));
  }

  return Monitoring;
}(_Monitoring2.default);

exports.default = Monitoring;

},{"commonShared/Monitoring":48}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Autorization = function Autorization() {
  _classCallCheck(this, Autorization);

  browser.webRequest.onAuthRequired.addListener(function (details, callback) {
    if (!details.isProxy) {
      return callback();
    }

    var type = 'default';
    var servers = sdk.proxy.getServers('all');
    for (var t in servers) {
      for (var c in servers[t]) {
        for (var k in servers[t][c]) {
          if (servers[t][c][k].address === details.challenger.host && !servers[t][c][k].password) {
            type = 'new';
          }
        }
      }
    }

    if (type === 'new' && sdk.user.credentials.prod.username) {
      callback({
        authCredentials: {
          username: sdk.user.credentials.prod.username,
          password: sdk.user.credentials.prod.password
        }
      });
    } else {
      callback({
        authCredentials: {
          username: sdk.user.credentials.old.username,
          password: sdk.user.credentials.old.password
        }
      });
    }
  }, { urls: ['http://*/*', 'https://*/*'] }, ['asyncBlocking']);
};

exports.default = Autorization;

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Signal = require('Wdgt/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LIST = 'Proxy.BypassWebsites.list';

var BypassWebsites = function () {
  function BypassWebsites() {
    _classCallCheck(this, BypassWebsites);

    this.list = sdk.storage.get(LIST) ? sdk.storage.get(LIST) : [];
    this.onChange = new _Signal2.default();
  }

  _createClass(BypassWebsites, [{
    key: 'add',
    value: function add(domain) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (_this.list.indexOf(domain) === -1) {
          _this.list.push(domain);
          return sdk.storage.set(LIST, _this.list).then(function () {
            sdk.proxy.render();
            _this.onChange.dispatch(_this.get());
            return resolve(_this.list);
          });
        }

        return resolve(_this.list);
      });
    }
  }, {
    key: 'get',
    value: function get() {
      return this.list;
    }
  }, {
    key: 'remove',
    value: function remove(domain) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (_this2.list.indexOf(domain) !== -1) {
          _this2.list.splice(_this2.list.indexOf(domain), 1);
          return sdk.storage.set(LIST, _this2.list).then(function () {
            sdk.proxy.render();
            _this2.onChange.dispatch(_this2.get());
            return resolve();
          });
        }

        return resolve();
      });
    }
  }, {
    key: 'isInList',
    value: function isInList(domain) {
      if (this.list.indexOf(domain) !== -1) return true;
      return false;
    }
  }]);

  return BypassWebsites;
}();

exports.default = BypassWebsites;

},{"Wdgt/Signal":34}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Network = require('Wdgt/Network');

var _Network2 = _interopRequireDefault(_Network);

var _servers = require('shared/config/servers');

var _servers2 = _interopRequireDefault(_servers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CONFIG = 'Proxy.Config.config';
var STOP_UPDATE = 'Proxy.Config.stopUpdate';

var Config = function () {
  function Config() {
    _classCallCheck(this, Config);

    this.config = {
      servers: {
        elite: {},
        regular: {}
      },
      locations: {
        elite: [],
        regular: []
      }
    };

    this.restoreConfig();
    this.runPolling();

    if (sdk.config.debug) {
      sdk.restoreConfig = this.restoreConfig.bind(this);
    }
  }

  _createClass(Config, [{
    key: 'runPolling',
    value: function runPolling() {
      var _this = this;

      this.loadConfig();

      setInterval(function () {
        _this.loadConfig();
      }, 24 * 60 * 60 * 1000);
    }
  }, {
    key: 'loadConfig',
    value: function loadConfig() {
      var _this2 = this;

      if (sdk.storage.get(STOP_UPDATE)) return;
      var loadConfigs = function loadConfigs(urls, i, results) {
        i = typeof i === 'undefined' ? 0 : ++i;
        results = typeof results === 'undefined' ? [] : results;

        return new Promise(function (resolve) {
          if (i === urls.length || !urls[i]) return resolve(results);

          _Network2.default.get(urls[i]).then(function (result) {
            try {
              result = JSON.parse(result);
              if (result.servers) {
                results.push(result.servers);
              } else {
                result.push([]);
              }
            } catch (e) {
              result.push([]);
            }

            return resolve(loadConfigs(urls, i, results));
          }).catch(function (e) {
            results.push([]);
            return resolve(loadConfigs(urls, i, results));
          });
        });
      };

      loadConfigs([sdk.config.configs.free, sdk.config.configs.elite]).then(function (configs) {
        var temp = {
          free: undefined,
          elite: undefined
        };

        if (configs && configs[0] && configs[0].length > 0) {
          temp.free = configs[0];
        } else if (_servers2.default.free) {
          temp.free = _servers2.default.free;
        }

        if (configs && configs[1] && configs[1].length > 0) {
          temp.elite = configs[1];
        } else if (_servers2.default.elite) {
          temp.elite = _servers2.default.elite;
        }

        _this2.parseConfig(temp);
      });
    }
  }, {
    key: 'restoreConfig',
    value: function restoreConfig() {
      var config = sdk.storage.get(CONFIG) ? sdk.storage.get(CONFIG) : _servers2.default;
      if (typeof config === 'string') config = _servers2.default;
      this.parseConfig(config);
    }
  }, {
    key: 'parseConfig',
    value: function parseConfig(data) {
      var config = {
        servers: {
          elite: {},
          regular: {}
        },
        locations: {
          elite: [],
          regular: []
        }
      };

      for (var k in data.free) {
        var server = data.free[k];
        if (data.elite && ['us', 'gb', 'fr', 'in', 'sg'].indexOf(server.country) !== -1) continue;

        if (config.locations.regular.indexOf(server.country) === -1) {
          config.locations.regular.push(server.country);
          config.servers.regular[server.country] = [];
        }

        config.servers.regular[server.country].push(server);
      }

      for (var _k in data.elite) {
        var _server = data.elite[_k];

        if (config.locations.elite.indexOf(_server.country) === -1) {
          config.locations.elite.push(_server.country);
          config.servers.elite[_server.country] = [];
        }

        config.servers.elite[_server.country].push(_server);
      }

      sdk.storage.set(CONFIG, data);

      this.config = config;
    }
  }, {
    key: 'getLocations',
    value: function getLocations(type) {
      type = type ? type : 'regular';

      if (type === 'all') {
        return this.config.locations;
      }

      if (!this.config.locations[type]) {
        return {};
      }

      return this.config.locations[type];
    }
  }, {
    key: 'getServers',
    value: function getServers(type, country) {
      type = type ? type : 'regular';

      if (type === 'all') return JSON.parse(JSON.stringify(this.config.servers));

      var servers = JSON.parse(JSON.stringify(this.config.servers));

      if (!servers[type]) return null;
      if (country && !servers[type][country]) return null;
      if (country && servers[type][country]) return servers[type][country];
      if (!country && servers[type]) return servers[type];

      return null;
    }
  }]);

  return Config;
}();

exports.default = Config;

},{"Wdgt/Network":33,"shared/config/servers":76}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Servers = require('./Servers');

var _Servers2 = _interopRequireDefault(_Servers);

var _whiteListDomains = require('shared/config/whiteListDomains');

var _whiteListDomains2 = _interopRequireDefault(_whiteListDomains);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PROXY_LOCAL = 'Proxy.proxyLocal';

var Core = function () {
  function Core() {
    _classCallCheck(this, Core);

    this.servers = new _Servers2.default();
    this.secured = undefined;
  }

  _createClass(Core, [{
    key: 'updateProxy',
    value: function updateProxy() {
      var _this = this;

      var servers = this.servers.get(this.status.location, sdk.user.status.elite ? 'elite' : 'regular');
      return this.servers.setActive(servers).then(function () {
        return _this.render();
      });
    }
  }, {
    key: 'renderClearProxy',
    value: function renderClearProxy() {
      var pacScript = "function FindProxyForURL(url, host) {\n" + "  return 'DIRECT';\n" + "}";

      return this.setPacScript(pacScript);
    }
  }, {
    key: 'render',
    value: function render(direct) {
      var proxyLocal = sdk.storage.get(PROXY_LOCAL),
          dr = '';

      if (proxyLocal && sdk.proxy.status.status === 'connected') {
        dr = "  var ip = dnsResolve(host);\n" + "  if(isPlainHostName(host) || shExpMatch(host, '*.local') || isInNet(ip, '10.0.0.0', '255.0.0.0') || isInNet(ip, '172.16.0.0',  '255.240.0.0') || isInNet(ip, '192.168.0.0',  '255.255.0.0') || isInNet(ip, '173.37.0.0',  '255.255.0.0') || isInNet(ip, '127.0.0.0', '255.255.255.0')) return 'DIRECT';\n\n";
      }

      var pacScript = "let active  = false,\n" + "    created = " + Date.now() + ",\n" + "    started = Date.now();\n\n" + "if((started-100) < created) {\n" + "  active = true;\n" + "}\n\n" + "function FindProxyForURL(url, host) {\n" + "  if(!url.match(/^(https?)|(ftp):\\/\\//)) return;\n" + "  if(!active && (Date.now() > (started + 2000))) active = true;\n" + "  if(!active) return 'DIRECT';\n\n" + this.excludedDomain() + dr + "  if(";

      for (var k in _whiteListDomains2.default) {
        pacScript += "shExpMatch(host, '" + _whiteListDomains2.default[k] + "') || ";
      }

      pacScript += "shExpMatch(host, 'www.google-analytics.com') || shExpMatch(host, 'localhost') || shExpMatch(host, '127.0.0.1')) return 'DIRECT';\n\n" + this.bypassWebsitesRow() + this.globalRow(direct) + this.securedWebsitesRow(direct) + "  return 'DIRECT';\n" + "}";

      return this.setPacScript(pacScript);
    }
  }, {
    key: 'excludedDomain',
    value: function excludedDomain() {
      return '';
    }
  }, {
    key: 'globalRow',
    value: function globalRow(direct) {
      if (this.status.status !== 'connected' || this.globalStatus !== 'avaliable') return '';
      return "  return '" + (this.servers.concat(this.servers.getActive()) + (direct ? 'DIRECT;' : '')) + "';\n";
    }
  }, {
    key: 'bypassWebsitesRow',
    value: function bypassWebsitesRow() {
      if (!sdk.proxy || !sdk.proxy.bypass) return '';
      if (sdk.proxy.bypass.get().length === 0) return '';

      return "  if(/" + sdk.proxy.bypass.get().join('|').replace(/([-+.])/g, '\\$1') + "/.test(host)) return 'DIRECT';\n\n";
    }
  }, {
    key: 'securedWebsitesRow',
    value: function securedWebsitesRow(direct) {
      if (!sdk.proxy || !sdk.proxy.secured) return '';
      var securedWebsites = sdk.proxy.secured.get();
      if (Object.keys(securedWebsites).length === 0) return '';

      var a = [];
      for (var k in securedWebsites) {
        a.push(k);
      }

      if (!this.secured) {
        this.secured = this.servers.concat(this.servers.get('optimal', sdk.user.status.elite ? 'elite' : 'regular'));
      }

      return "  if(" + JSON.stringify(a) + ".indexOf(host.replace(/^www\\./, '')) !== -1) return '" + this.secured + (direct ? 'DIRECT;' : '') + "';\n";
    }
  }, {
    key: 'setPacScript',
    value: function setPacScript(pacScript) {
      return new Promise(function (resolve) {
        debug(pacScript);
        debug('-----------------------------');

        var config = {
          mode: "pac_script",
          pacScript: {
            data: pacScript
          }
        };

        browser.proxy.settings.set({ value: config, scope: 'regular' }, function () {
          resolve();
        });

        browser.extension.isAllowedIncognitoAccess(function (result) {
          if (!result) return;

          try {
            browser.proxy.settings.set({ value: config, scope: 'incognito_persistent' }, function () {});
          } catch (e) {
            error(e);
          }
        });
      });
    }
  }]);

  return Core;
}();

exports.default = Core;

},{"./Servers":21,"shared/config/whiteListDomains":77}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Signal = require('Wdgt/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LIST = 'Proxy.SecuredWebsites.list';

var SecuredWebsites = function () {
  function SecuredWebsites() {
    var _this = this;

    _classCallCheck(this, SecuredWebsites);

    this.list = sdk.storage.get(LIST) ? sdk.storage.get(LIST) : undefined;
    if (!this.list) {
      this.list = {};

      sdk.storage.set(LIST, this.list);
    }
    this.onChange = new _Signal2.default();
    this.lock = {};
    sdk.tabs.onPageView.add(function (info) {
      if (info && info.domain && _this.isInList(info.domain)) {
        _this.list[info.domain].visited++;
        sdk.storage.set(LIST, _this.list);
      }
    });
  }

  _createClass(SecuredWebsites, [{
    key: 'add',
    value: function add(domain, lock) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (!_this2.list[domain]) {
          _this2.lock[domain] = true;
          _this2.list[domain] = { location: 'optimal', type: 'custom', visited: 0 };
          sdk.storage.set(LIST, _this2.list);
          sdk.proxy.render();
          _this2.onChange.dispatch(_this2.get());
          return resolve(_this2.list);
        }

        return resolve(_this2.list);
      });
    }
  }, {
    key: 'get',
    value: function get() {
      return this.list;
    }
  }, {
    key: 'remove',
    value: function remove(domain) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        if (_this3.list[domain]) {
          delete _this3.list[domain];
          return sdk.storage.set(LIST, _this3.list).then(function () {
            sdk.proxy.render();
            _this3.onChange.dispatch(_this3.get());
            return resolve();
          });
        }

        return resolve();
      });
    }
  }, {
    key: 'isInList',
    value: function isInList(domain) {
      return !!this.list[domain];
    }
  }, {
    key: 'isLocked',
    value: function isLocked(domain) {
      return !!this.lock[domain];
    }
  }, {
    key: 'unlock',
    value: function unlock(domain) {
      delete this.lock[domain];
    }
  }]);

  return SecuredWebsites;
}();

exports.default = SecuredWebsites;

},{"Wdgt/Signal":34}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = require('./Config');

var _Config2 = _interopRequireDefault(_Config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ACTIVE = 'Proxy.Servers.active';
var LIMIT = 5;

var Servers = function () {
  function Servers() {
    _classCallCheck(this, Servers);

    this.config = new _Config2.default();

    this.active = sdk.storage.get(ACTIVE) ? sdk.storage.get(ACTIVE) : [];
  }

  _createClass(Servers, [{
    key: 'setActive',
    value: function setActive(active) {
      this.active = active;
      return sdk.storage.set(ACTIVE, active);
    }
  }, {
    key: 'getActive',
    value: function getActive() {
      return this.active;
    }
  }, {
    key: 'get',
    value: function get(location, type) {
      if (!location || location === 'optimal') location = this.getOptimalLocation(type);

      return this.getServers(location, type);
    }
  }, {
    key: 'getServers',
    value: function getServers(location, type) {
      var servers = this.getServersByPriority(this.config.getServers(type)[location]).splice(0, LIMIT);
      if (servers.length < LIMIT) {
        var backup = this.getBackupServers(location, type);

        var i = 0;
        while (servers.length < LIMIT) {
          servers.push(backup[i]);
          i++;
        }
      }

      return servers;
    }
  }, {
    key: 'getBackupServers',
    value: function getBackupServers(location, type) {
      var temp = this.config.getServers(type);
      var servers = [];

      for (var k in temp) {
        if (k === location) continue;

        for (var i in temp[k]) {
          servers.push(temp[k][i]);
        }
      }

      return this.getServersByPriority(servers);
    }
  }, {
    key: 'getServersByPriority',
    value: function getServersByPriority(servers, result) {
      var priorities = new Array();
      var total = 0;
      result = result ? result : [];

      for (var k in servers) {
        total += servers[k].priority;
        priorities.push(total);
      }

      var rand = Math.floor(Math.random() * total);

      for (var i = 0; i < priorities.length; i++) {
        if (rand <= priorities[i]) {
          result.push(servers[i]);
          servers.splice(i, 1);
          return this.getServersByPriority(servers, result);
        }
      }

      return result;
    }
  }, {
    key: 'getOptimalLocation',
    value: function getOptimalLocation(type) {
      // @todo choose server based on network speed
      var locations = this.config.getLocations(type);
      return locations[[Math.floor(Math.random() * locations.length)]];
    }
  }, {
    key: 'concat',
    value: function concat(servers) {
      var row = "";

      for (var k in servers) {
        if (!servers[k]) continue;
        var scheme = servers[k].scheme === 'http' ? 'proxy' : servers[k].scheme;
        row += scheme + ' ' + servers[k].address + ':' + servers[k].port + ';';
      }

      return row;
    }
  }]);

  return Servers;
}();

exports.default = Servers;

},{"./Config":18}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Speed = function () {
  function Speed() {
    _classCallCheck(this, Speed);
  }

  _createClass(Speed, [{
    key: 'get',
    value: function get() {
      return '5.00';
    }
  }, {
    key: 'ping',
    value: function ping() {}
  }, {
    key: 'test',
    value: function test() {}
  }]);

  return Speed;
}();

exports.default = Speed;

/*import Network from 'Wdgt/Network';

const DATA     = 'Proxy.Speed.data';

class Speed {
  constructor() {
    this.data       = sdk.storage.get(DATA) ? sdk.storage.get(DATA) : {};
    this.inProgress = false;
  }

  get(server) {
    if(!server) {
      let servers = sdk.proxy.getActiveServers();
      if(!servers[0]) return '5.00';
      server = servers[0].address;
    }

    if(!this.data[server]) {
      this.test(server);
      return '5.00';
    }

    if(this.data[server].next < Date.now()) {
      this.test(server);
      return this.data[server].speed;
    }

    return this.data[server].speed;
  }

  ping(server) {
    return new Promise((resolve, reject) => {
      if(!server) return resolve();

      this.inProgress = true;
      let url = 'http://'+server+':8080/100Kb';
      Network.get(url + '?r='+Date.now()).then(() => {
        this.inProgress = false;
        return resolve();
      }).catch((e) => {
        this.inProgress = false;
        return reject();
      });
    });
  }

  test(server) {
    if(this.inProgress) return;

    let start = Date.now();
    this.ping(server).then(() => {
      let delta = (Date.now() - start) / 1000;

      this.data[server] = {
        next: (Date.now()+12*60*60*1000),
        speed: ((0.1 * 8 / delta)+2)
      };

      sdk.storage.set(DATA, this.data);
    }).catch(() => {
      this.data[server] = {
        next: (Date.now()+12*60*60*1000),
        speed: 5
      };

      sdk.storage.set(DATA, this.data);
    });
  }
}

export default Speed;*/

},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Signal = require('Wdgt/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _Core2 = require('./Core');

var _Core3 = _interopRequireDefault(_Core2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STATUS = 'Proxy.Status.status';
var DESKTOP = 'Proxy.Status.desktopApplication';

var ERROR_LIMIT = 50;
var ON_PROXY_ERROR_RECALL = 5 * 1000;

var Status = function (_Core) {
  _inherits(Status, _Core);

  function Status() {
    _classCallCheck(this, Status);

    var _this = _possibleConstructorReturn(this, (Status.__proto__ || Object.getPrototypeOf(Status)).call(this));

    _this.status = sdk.storage.get(STATUS) ? sdk.storage.get(STATUS) : { status: 'disconnected', location: 'optimal' };

    _this.createSignals();
    _this.watchForProxySettings();
    _this.watchForProxyError();
    return _this;
  }

  _createClass(Status, [{
    key: 'createSignals',
    value: function createSignals() {
      this.onProxyError = new _Signal2.default();
      this.onStatusChanged = new _Signal2.default();
      this.onGlobalStatusChanged = new _Signal2.default();
    }
  }, {
    key: 'updateStatus',
    value: function updateStatus(status, location) {
      this.status.status = status;
      this.status.location = location ? location : this.status.location;

      return sdk.storage.set(STATUS, this.status);
    }
  }, {
    key: 'watchForProxySettings',
    value: function watchForProxySettings() {
      var _this2 = this;

      var proxySettings = function proxySettings(details) {
        if (!details) return;

        var desktopApplication = sdk.storage.get(DESKTOP);

        if (desktopApplication) {
          _this2.updateGlobalStatus('desktop');
        } else if (details.levelOfControl === 'not_controllable' || details.levelOfControl === 'controlled_by_other_extensions') {
          _this2.updateGlobalStatus('unavailable');
        } else {
          _this2.updateGlobalStatus('avaliable');
        }
      };

      browser.proxy.settings.get({}, proxySettings.bind(this));
      browser.proxy.settings.onChange.addListener(proxySettings.bind(this));
    }
  }, {
    key: 'updateGlobalStatus',
    value: function updateGlobalStatus(status) {
      if (this.globalStatus === status) return;
      this.globalStatus = status;
      this.onGlobalStatusChanged.dispatch(status);
    }
  }, {
    key: 'getGlobalStatus',
    value: function getGlobalStatus() {
      return this.globalStatus;
    }
  }, {
    key: 'watchForProxyError',
    value: function watchForProxyError() {
      var _this3 = this;

      var lastError = void 0;
      var errorCounter = 0;
      var waitForRecall = false;

      browser.proxy.onProxyError.addListener(function (info) {
        if (sdk.proxy.disableErrors || waitForRecall) return;

        waitForRecall = true;

        errorCounter = lastError && lastError < Date.now() - 30 * 1000 ? 0 : ++errorCounter;
        lastError = Date.now();

        if (errorCounter === ERROR_LIMIT) {
          return sdk.proxy.disconnect().then(function () {
            _this3.onProxyError.dispatch('disconnect');
            errorCounter = 0;
            waitForRecall = false;
          });
        }

        _this3.onProxyError.dispatch('update');
        _this3.render(true);

        setTimeout(function () {
          waitForRecall = false;
          _this3.render();
        }, ON_PROXY_ERROR_RECALL);
      });
    }
  }, {
    key: 'disableOtherProxy',
    value: function disableOtherProxy() {
      var enableExtention = function enableExtention(id, enable) {
        return new Promise(function (resolve, reject) {
          browser.management.setEnabled(id, false, function () {
            resolve();
          });
        });
      };

      var retrieveExtensionInfos = function retrieveExtensionInfos() {
        return new Promise(function (resolve, reject) {
          browser.management.getAll(function (extensionInfos) {
            resolve(extensionInfos);
          });
        });
      };

      return retrieveExtensionInfos().then(function (extensionInfos) {
        var extensionsIds = [];
        var currentExtensionId = sdk.config.application.applicationId;

        for (var k in extensionInfos) {
          var extensionInfo = extensionInfos[k];
          if (extensionInfo.id === currentExtensionId) {
            continue;
          }

          if (!extensionInfo.enabled) {
            continue;
          }

          if (extensionInfo.permissions.indexOf('proxy') === -1) {
            continue;
          }

          extensionsIds.push(extensionInfo.id);
        }

        return Promise.all(extensionsIds.map(function (extensionId) {
          return enableExtention(extensionId, false);
        })).then(function () {
          return;
        });
      });
    }
  }]);

  return Status;
}(_Core3.default);

exports.default = Status;

},{"./Core":19,"Wdgt/Signal":34}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Timer = function () {
  function Timer(proxy) {
    var _this = this;

    _classCallCheck(this, Timer);

    this.startTime = 0;
    this.status = sdk.proxy.status.status;

    if (this.status === 'connected') {
      this.startTime = Date.now();
    }

    sdk.proxy.onStatusChanged.add(function (status) {
      if (['connected', 'disconnected'].indexOf(status.status) === -1) return;

      if (_this.status === 'connected' && status.status !== 'connected') {
        _this.startTime = 0;
      }

      if (status.status === 'connected' && _this.status !== 'connected') {
        _this.startTime = Date.now();
      }

      _this.status = status.status;
    });
  }

  _createClass(Timer, [{
    key: 'get',
    value: function get() {
      return this.startTime;
    }
  }]);

  return Timer;
}();

exports.default = Timer;

},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _Speed = require('./Speed');

var _Speed2 = _interopRequireDefault(_Speed);

var _Status2 = require('./Status');

var _Status3 = _interopRequireDefault(_Status2);

var _Autorization = require('./Autorization');

var _Autorization2 = _interopRequireDefault(_Autorization);

var _BypassWebsites = require('./BypassWebsites');

var _BypassWebsites2 = _interopRequireDefault(_BypassWebsites);

var _SecuredWebsites2 = require('./SecuredWebsites');

var _SecuredWebsites3 = _interopRequireDefault(_SecuredWebsites2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STORAGE_ERROR = 'Storage.error';
var GDPR_CONNECTED = 'GDPR.Connected';

var Proxy = function (_Status) {
  _inherits(Proxy, _Status);

  function Proxy() {
    _classCallCheck(this, Proxy);

    var _this = _possibleConstructorReturn(this, (Proxy.__proto__ || Object.getPrototypeOf(Proxy)).call(this));

    new _Autorization2.default();

    sdk.proxy = {
      status: _this.status,
      render: _this.render.bind(_this),
      connect: _this.connect.bind(_this),
      reconnect: _this.reconnect.bind(_this),
      disconnect: _this.disconnect.bind(_this),

      getServers: _this.servers.config.getServers.bind(_this.servers.config),
      getLocations: _this.servers.config.getLocations.bind(_this.servers.config),
      getGlobalStatus: _this.getGlobalStatus.bind(_this),
      getActiveServers: _this.servers.getActive.bind(_this.servers),
      disableOtherProxy: _this.disableOtherProxy.bind(_this),

      onProxyError: _this.onProxyError,
      onStatusChanged: _this.onStatusChanged,
      onGlobalStatusChanged: _this.onGlobalStatusChanged,

      disableErrors: false
    };

    var timer = new _Timer2.default();
    sdk.proxy.timer = timer.get.bind(timer);

    var bypass = new _BypassWebsites2.default();
    sdk.proxy.bypass = {
      add: bypass.add.bind(bypass),
      get: bypass.get.bind(bypass),
      remove: bypass.remove.bind(bypass),
      isInList: bypass.isInList.bind(bypass),
      onChange: bypass.onChange
    };

    _this.SecuredWebsites();

    var speed = new _Speed2.default();
    sdk.proxy.speed = {
      get: speed.get.bind(speed),
      ping: speed.ping.bind(speed),
      test: speed.test.bind(speed)
    };

    _this.initDone();
    return _this;
  }

  _createClass(Proxy, [{
    key: 'SecuredWebsites',
    value: function SecuredWebsites(alexa) {
      var secured = new _SecuredWebsites3.default(alexa);
      sdk.proxy.secured = {
        add: secured.add.bind(secured),
        get: secured.get.bind(secured),
        remove: secured.remove.bind(secured),
        isInList: secured.isInList.bind(secured),
        isLocked: secured.isLocked.bind(secured),
        unlock: secured.unlock.bind(secured),
        onChange: secured.onChange
      };
    }
  }, {
    key: 'initDone',
    value: function initDone() {
      if (sdk.storage.get(STORAGE_ERROR)) {
        this.renderClearProxy();
      } else {
        sdk.proxy.disconnect();
      }
    }
  }, {
    key: 'connect',
    value: function connect(location, delay) {
      var _this2 = this;

      delay = delay ? delay : sdk.config.proxy.connecting.delay * 1000;
      location = location ? location : 'optimal';
      debug('Connect: ' + location);

      return new Promise(function (resolve) {
        sdk.storage.set(GDPR_CONNECTED, true).then(function () {
          _this2.updateStatus('connected', location).then(function () {
            _this2.updateProxy().then(function () {
              _this2.onStatusChanged.dispatch({ status: 'connecting', location: _this2.status.location });

              setTimeout(function () {
                _this2.onStatusChanged.dispatch(_this2.status);
                resolve();
              }, delay);
            });
          });
        });
      });
    }
  }, {
    key: 'reconnect',
    value: function reconnect(location) {
      var _this3 = this;

      location = location ? location : 'optimal';
      debug('Reconnect: ' + location);

      return new Promise(function (resolve) {
        _this3.updateStatus('connected', location).then(function () {
          _this3.updateProxy().then(function () {
            _this3.onStatusChanged.dispatch({ status: 'connected', location: _this3.status.location });
            resolve();
          });
        });
      });
    }
  }, {
    key: 'disconnect',
    value: function disconnect(delay) {
      var _this4 = this;

      delay = delay ? delay : sdk.config.proxy.disconnecting.delay * 1000;
      debug('Disconnect');

      return new Promise(function (resolve) {

        _this4.updateStatus('disconnected').then(function () {
          _this4.updateProxy().then(function () {
            _this4.onStatusChanged.dispatch({ status: 'disconnecting', location: _this4.status.location });

            setTimeout(function () {
              _this4.onStatusChanged.dispatch(_this4.status);
              resolve();
            }, delay);
          });
        });
      });
    }
  }]);

  return Proxy;
}(_Status3.default);

exports.default = Proxy;

},{"./Autorization":16,"./BypassWebsites":17,"./SecuredWebsites":20,"./Speed":22,"./Status":23,"./Timer":24}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Reporting = require('commonShared/Reporting');

var _Reporting2 = _interopRequireDefault(_Reporting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Reporting = function (_CoreReporting) {
  _inherits(Reporting, _CoreReporting);

  function Reporting() {
    _classCallCheck(this, Reporting);

    return _possibleConstructorReturn(this, (Reporting.__proto__ || Object.getPrototypeOf(Reporting)).call(this));
  }

  return Reporting;
}(_Reporting2.default);

exports.default = Reporting;

},{"commonShared/Reporting":51}],27:[function(require,module,exports){
"use strict";

window.browser = window.browser ? window.browser : window.chrome ? window.chrome : {};

window.sdk = {
  loading: {
    loaded: false,
    started: Date.now(),
    restart: function restart() {
      location.reload();
    }
  }
};

},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SitesCounter = require('commonShared/SitesCounter');

var _SitesCounter2 = _interopRequireDefault(_SitesCounter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SitesCounter = function (_CoreSitesCounter) {
  _inherits(SitesCounter, _CoreSitesCounter);

  function SitesCounter() {
    _classCallCheck(this, SitesCounter);

    return _possibleConstructorReturn(this, (SitesCounter.__proto__ || Object.getPrototypeOf(SitesCounter)).call(this));
  }

  return SitesCounter;
}(_SitesCounter2.default);

exports.default = SitesCounter;

},{"commonShared/SitesCounter":52}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Sword = require('commonShared/Sword');

var _Sword2 = _interopRequireDefault(_Sword);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sword = function (_CoreSword) {
  _inherits(Sword, _CoreSword);

  function Sword() {
    _classCallCheck(this, Sword);

    return _possibleConstructorReturn(this, (Sword.__proto__ || Object.getPrototypeOf(Sword)).call(this));
  }

  return Sword;
}(_Sword2.default);

exports.default = Sword;

},{"commonShared/Sword":55}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TrackerBlocker = require('commonShared/TrackerBlocker');

var _TrackerBlocker2 = _interopRequireDefault(_TrackerBlocker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TrackerBlocker = function (_CoreTrackerBlocker) {
  _inherits(TrackerBlocker, _CoreTrackerBlocker);

  function TrackerBlocker() {
    _classCallCheck(this, TrackerBlocker);

    return _possibleConstructorReturn(this, (TrackerBlocker.__proto__ || Object.getPrototypeOf(TrackerBlocker)).call(this));
  }

  return TrackerBlocker;
}(_TrackerBlocker2.default);

exports.default = TrackerBlocker;

},{"commonShared/TrackerBlocker":56}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _User = require('commonShared/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var User = function (_CoreUser) {
  _inherits(User, _CoreUser);

  function User() {
    _classCallCheck(this, User);

    return _possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).call(this));
  }

  return User;
}(_User2.default);

exports.default = User;

},{"commonShared/User":59}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Debug = require('commonShared/Wdgt/Debug');

var _Debug2 = _interopRequireDefault(_Debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Debug = function (_CoreDebug) {
  _inherits(Debug, _CoreDebug);

  function Debug() {
    _classCallCheck(this, Debug);

    return _possibleConstructorReturn(this, (Debug.__proto__ || Object.getPrototypeOf(Debug)).call(this));
  }

  return Debug;
}(_Debug2.default);

exports.default = Debug;

},{"commonShared/Wdgt/Debug":63}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Network = require('commonShared/Wdgt/Network');

var _Network2 = _interopRequireDefault(_Network);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Network = function (_CoreNetwork) {
  _inherits(Network, _CoreNetwork);

  function Network() {
    _classCallCheck(this, Network);

    return _possibleConstructorReturn(this, (Network.__proto__ || Object.getPrototypeOf(Network)).call(this));
  }

  return Network;
}(_Network2.default);

exports.default = Network;

},{"commonShared/Wdgt/Network":64}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _miniSignals = require('mini-signals');

var _miniSignals2 = _interopRequireDefault(_miniSignals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Signal = function (_CoreSignal) {
  _inherits(Signal, _CoreSignal);

  function Signal() {
    _classCallCheck(this, Signal);

    return _possibleConstructorReturn(this, (Signal.__proto__ || Object.getPrototypeOf(Signal)).call(this));
  }

  return Signal;
}(_miniSignals2.default);

exports.default = Signal;

},{"mini-signals":5}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Storage = require('commonShared/Wdgt/Storage');

var _Storage2 = _interopRequireDefault(_Storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Storage = function (_CoreStorage) {
  _inherits(Storage, _CoreStorage);

  function Storage() {
    _classCallCheck(this, Storage);

    return _possibleConstructorReturn(this, (Storage.__proto__ || Object.getPrototypeOf(Storage)).call(this));
  }

  return Storage;
}(_Storage2.default);

exports.default = Storage;

},{"commonShared/Wdgt/Storage":65}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Tabs = require('commonShared/Wdgt/Tabs');

var _Tabs2 = _interopRequireDefault(_Tabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tabs = function (_CoreTabs) {
  _inherits(Tabs, _CoreTabs);

  function Tabs() {
    _classCallCheck(this, Tabs);

    return _possibleConstructorReturn(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).call(this));
  }

  return Tabs;
}(_Tabs2.default);

exports.default = Tabs;

},{"commonShared/Wdgt/Tabs":66}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _WebRTC = require('commonShared/WebRTC');

var _WebRTC2 = _interopRequireDefault(_WebRTC);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WebRTC = function (_CoreWebRTC) {
  _inherits(WebRTC, _CoreWebRTC);

  function WebRTC() {
    _classCallCheck(this, WebRTC);

    return _possibleConstructorReturn(this, (WebRTC.__proto__ || Object.getPrototypeOf(WebRTC)).call(this));
  }

  return WebRTC;
}(_WebRTC2.default);

exports.default = WebRTC;

},{"commonShared/WebRTC":67}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DomMatcher = function () {
  function DomMatcher(rules) {
    _classCallCheck(this, DomMatcher);

    this.rules = rules;
  }

  _createClass(DomMatcher, [{
    key: "getRules",
    value: function getRules(domain) {
      if (this.rules[domain]) return this.rules[domain];

      return this.rules.none;
    }
  }]);

  return DomMatcher;
}();

exports.default = DomMatcher;

},{}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DomRules = function () {
  function DomRules() {
    _classCallCheck(this, DomRules);
  }

  _createClass(DomRules, null, [{
    key: 'step1',
    value: function step1(rules) {
      var temp = { none: [] };

      for (var k in rules) {
        var rule = rules[k];

        var _rule$match = rule.match(/([^#]*)##(.*)/),
            _rule$match2 = _slicedToArray(_rule$match, 3),
            r = _rule$match2[0],
            domains = _rule$match2[1],
            filter = _rule$match2[2];

        domains = domains.match(/[^,]+/g);

        if (!domains) {
          temp.none.push(filter);
          continue;
        }

        for (var _k in domains) {
          var domain = domains[_k];
          if (!temp[domain]) temp[domain] = [];

          temp[domain].push(filter);
        }
      }

      for (var _k2 in temp) {
        temp[_k2] = temp[_k2].join(', ');
      }

      return temp;
    }
  }]);

  return DomRules;
}();

exports.default = DomRules;

},{}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RequestMatcher = function () {
  function RequestMatcher(rules) {
    _classCallCheck(this, RequestMatcher);

    this.rules = rules;
  }

  _createClass(RequestMatcher, [{
    key: "check",
    value: function check(request) {
      var keywords = request.url.replace(/^https?:\/\//, '').match(/[a-z0-9]{4,}/g);
      if (!keywords) keywords = [""];else keywords.push("");

      for (var k in keywords) {
        var word = keywords[k];
        if (this.rules.keywords.white[word]) {
          if (this.checkRules(request, this.rules.keywords.white[word], 'whitelist')) return false;
        }
      }

      for (var _k in keywords) {
        var _word = keywords[_k];
        if (this.rules.keywords.black[_word]) {
          if (this.checkRules(request, this.rules.keywords.black[_word], 'blacklist')) return true;
        }
      }

      return false;
    }
  }, {
    key: "checkRules",
    value: function checkRules(request, rules, type) {
      for (var k in rules) {
        var rule = this.rules.filters[rules[k]];
        if (rule.thirdParty && request.thirdParty !== rule.thirdParty) continue;
        if (!rule.filter.test(request.url)) continue;

        if (rule.isDomain && !rule.isDomain.test(request.referer)) continue;
        if (rule.notDomain && rule.notDomain.test(request.referer)) continue;
        if (rule.isType && !rule.isType.test(request.type)) continue;
        if (rule.notType && rule.notType.test(request.type)) continue;

        debug(request.url + ' ' + type);
        debug(request);
        debug(rule);
        debug('---------------------------------');

        return true;
      }

      return false;
    }
  }]);

  return RequestMatcher;
}();

exports.default = RequestMatcher;

},{}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RequestRules = function () {
  function RequestRules() {
    _classCallCheck(this, RequestRules);
  }

  _createClass(RequestRules, null, [{
    key: 'step1',
    value: function step1(rules) {
      for (var k in rules) {
        var _rules$k$match = rules[k].match(/[^$]+/g),
            _rules$k$match2 = _slicedToArray(_rules$k$match, 2),
            filter = _rules$k$match2[0],
            options = _rules$k$match2[1];

        var keywords = filter.replace(/https?:\/\//, '').match(/[a-z0-9]{4,}/g);
        rules[k] = {
          origin: rules[k],
          filter: RequestRules.parseFilter(filter),
          options: RequestRules.parseOptions(options),
          keywords: keywords ? keywords : [''],
          exception: /^@@/.test(filter)
        };
      }

      return rules;
    }
  }, {
    key: 'step2',
    value: function step2(rules) {
      var filters = [],
          keywords = { white: {}, black: {} },
          i = 0;

      for (var k in rules) {
        var rule = rules[k];
        var filter = {
          filter: new RegExp(rule.filter),
          origin: rule.origin
        };

        if (rule.options) {
          if (rule.options.isType) filter.isType = new RegExp(rule.options.isType);
          if (rule.options.notType) filter.notType = new RegExp(rule.options.notType);
          if (rule.options.isDomain) filter.isDomain = new RegExp(rule.options.isDomain);
          if (rule.options.notDomain) filter.notDomain = new RegExp(rule.options.notDomain);
          if (rule.options.thirdParty) filter.thirdParty = rule.options.thirdParty;
        }

        filters[i] = filter;

        for (var _k in rule.keywords) {
          var word = rule.keywords[_k];
          var type = rule.exception ? 'white' : 'black';

          if (!keywords[type][word]) keywords[type][word] = [];

          keywords[type][word].push(i);
        }

        i++;
      }

      return { filters: filters, keywords: keywords };
    }
  }, {
    key: 'parseFilter',
    value: function parseFilter(filter) {
      return filter.replace(/(^@@)|(\|$)/g, '').replace(/([-\[\]/{}()+?.$])/g, '\\$1').replace(/^[|]{1}([^|])/, '$1').replace(/\^(.)/g, '(\\/|\\?)$1').replace(/\^/g, '((\\/|\\?)|$)').replace(/^[|]{2}/, 'https?://([^/]+)?').replace(/\*/g, '.*').replace(/\|/g, '\\|');
    }
  }, {
    key: 'parseOptions',
    value: function parseOptions(options) {
      if (!options) return false;
      if (/^(websocket|popup|elemhide|generichide|genericblock|object\-subrequest)$/.test(options)) return -1;

      var result = {},
          isDomains = [],
          notDomains = [],
          isType = [],
          notType = [];

      options = options.match(/[^,]+/g);

      for (var k in options) {
        var option = options[k];
        if (/^(websocket|popup|elemhide|generichide|genericblock|object\-subrequest)$/.test(option)) continue;

        if (/^~third\-party/.test(option)) result.thirdParty = -1;else if (/^third\-party/.test(option)) result.thirdParty = 1;else if (/^domain=/.test(option)) {
          var domains = option.replace(/([.-])/g, '\\$1').match(/domain=(.*)/)[1].match(/[^|]+/g);
          for (var _k2 in domains) {
            var domain = domains[_k2];
            if (/^~/.test(domain)) {
              notDomains.push('^.*' + domain.replace(/~/, '') + '$');
            } else {
              isDomains.push('^.*' + domain + '$');
            }
          }
        } else if (/~/.test(option)) {
          notType.push(option);
        } else isType.push(option);
      }

      var i = 0;

      if (isDomains.length > 0) {
        i++;
        result.isDomain = isDomains.join('|');
      }

      if (notDomains.length > 0) {
        i++;
        result.notDomain = notDomains.join('|');
      }

      if (isType.length > 0) {
        i++;
        result.isType = isType.join('|');
      }

      if (notType.length > 0) {
        i++;
        result.notType = notType.join('|');
      }

      if (i === 0 && !result.thirdParty) return false;

      return result;
    }
  }]);

  return RequestRules;
}();

exports.default = RequestRules;

},{}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Network = require('Wdgt/Network');

var _Network2 = _interopRequireDefault(_Network);

var _DomRules = require('./DomRules');

var _DomRules2 = _interopRequireDefault(_DomRules);

var _RequestRules = require('./RequestRules');

var _RequestRules2 = _interopRequireDefault(_RequestRules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URL = sdk.config.protocolPrefix + '://' + sdk.config.application.applicationId + '/static/data/adblock';
var SAVED_RULES = 'AdBlocker.Rules.savedRules';

var Rules = function () {
  function Rules() {
    _classCallCheck(this, Rules);
  }

  _createClass(Rules, [{
    key: 'getRules',
    value: function getRules() {
      var _this = this;

      return new Promise(function (resolve) {
        var rules = sdk.storage.get(SAVED_RULES);
        if (rules) {
          rules[0] = _RequestRules2.default.step2(rules[0]);
          return resolve(rules);
        }

        _this.loadRules().then(function (rules) {
          var _splitRulesByType = _this.splitRulesByType(rules),
              _splitRulesByType2 = _slicedToArray(_splitRulesByType, 2),
              requestRules = _splitRulesByType2[0],
              domRules = _splitRulesByType2[1];

          domRules = _DomRules2.default.step1(domRules);
          requestRules = _RequestRules2.default.step1(requestRules);

          sdk.storage.set(SAVED_RULES, [requestRules, domRules]).then(function () {
            requestRules = _RequestRules2.default.step2(requestRules);

            return resolve([requestRules, domRules]);
          });
        });
      });
    }
  }, {
    key: 'splitRulesByType',
    value: function splitRulesByType(rules) {
      rules = rules.replace(/[ ]/g, '').match(/[^\r\n]+/g);
      var domRules = [],
          requestRules = [];

      for (var k in rules) {
        var rule = rules[k];
        if (rule === '' || /^\/.*\/(\$|$)/.test(rule) || /^!|\[|#@#/.test(rule)) continue;

        if (/##/.test(rule)) {
          domRules.push(rule);
        } else {
          requestRules.push(rule);
        }
      }

      return [requestRules, domRules];
    }
  }, {
    key: 'loadRules',
    value: function loadRules() {
      return _Network2.default.get(URL).then(function (response) {
        return response;
      }).catch(function () {
        return '';
      });
    }
  }]);

  return Rules;
}();

exports.default = Rules;

},{"./DomRules":39,"./RequestRules":41,"Wdgt/Network":33}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Rules = require('./Rules');

var _Rules2 = _interopRequireDefault(_Rules);

var _DomMatcher = require('./DomMatcher');

var _DomMatcher2 = _interopRequireDefault(_DomMatcher);

var _RequestMatcher = require('./RequestMatcher');

var _RequestMatcher2 = _interopRequireDefault(_RequestMatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STATUS = 'AdBlocker.status';
var COUNTER = 'AdBlocker.counter';

var AdBlocker = function () {
  function AdBlocker() {
    var _this = this;

    _classCallCheck(this, AdBlocker);

    this.rules = new _Rules2.default();

    this.rules.getRules().then(function (rules) {
      var _rules = _slicedToArray(rules, 2),
          requestRules = _rules[0],
          domRules = _rules[1];

      var temp = [];
      for (var k in requestRules.filters) {
        var r = requestRules.filters[k];

        if (Object.keys(r).length > 2) continue;
        temp.push(r.filter.toString());
      }

      window.tempFilters = temp;

      _this.status = sdk.storage.get(STATUS) ? sdk.storage.get(STATUS) : 'off';
      _this.counter = sdk.storage.get(COUNTER) ? sdk.storage.get(COUNTER) : 0;

      _this.domMatcher = new _DomMatcher2.default(domRules);
      _this.requestMatcher = new _RequestMatcher2.default(requestRules);
    });
  }

  _createClass(AdBlocker, [{
    key: 'check',
    value: function check(details) {
      if (this.status !== 'on' || details.type === 'main_frame') return false;

      if (details.type === 'sub_frame') details.type = 'subdocument';

      var request = {
        url: details.url,
        type: details.type.toLowerCase(),
        referer: details.url.match(/https?:\/\/([^/]+)/)[1],
        thirdParty: -1
      };

      for (var k in details.requestHeaders) {
        var header = details.requestHeaders[k];
        if (header.name.toLowerCase() === 'referer') {
          request.referer = header.value.match(/https?:\/\/([^/]+)/)[1];
        }
      }

      var tab = sdk.tabs.getByTabId(details.tabId);
      if (tab && tab.domain !== request.referer) request.thirdParty = 1;

      request.tab = tab;

      var shouldBeBlocked = this.requestMatcher.check(request);
      if (shouldBeBlocked) this.counter++;

      return shouldBeBlocked;
    }
  }, {
    key: 'getCounter',
    value: function getCounter() {
      return this.counter;
    }
  }, {
    key: 'getStatus',
    value: function getStatus() {
      return this.status;
    }
  }, {
    key: 'getDomRules',
    value: function getDomRules(id) {
      if (this.status !== 'on' || !this.isConnected(id)) return false;

      return this.domMatcher.getRules();
    }
  }, {
    key: 'isConnected',
    value: function isConnected(id) {
      if (!id) return false;

      var tab = sdk.tabs.getByTabId(id);
      if (!tab) return false;

      if (sdk.proxy.bypass.isInList(tab.domain)) return false;else if (sdk.proxy.secured.isInList(tab.domain)) return true;else if (sdk.proxy.status.status === 'connected') return true;

      return false;
    }
  }, {
    key: 'setStatus',
    value: function setStatus(status) {
      if (['on', 'off', 'disabled'].indexOf(status) === -1) return;
      this.status = status;
      return sdk.storage.set(STATUS, status);
    }
  }]);

  return AdBlocker;
}();

exports.default = AdBlocker;

},{"./DomMatcher":38,"./RequestMatcher":40,"./Rules":42}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var COUNTER = 'Connection.Bandwidth.counter';
var SAVE_INTERVAL = 60 * 1000;

var BandwidthCounter = function () {
  function BandwidthCounter() {
    _classCallCheck(this, BandwidthCounter);

    this.restore();
    this.save();
  }

  _createClass(BandwidthCounter, [{
    key: 'getCounter',
    value: function getCounter() {
      return this.counter;
    }
  }, {
    key: 'save',
    value: function save() {
      if (!this.saveInterval) {
        this.saveInterval = setInterval(this.save.bind(this), SAVE_INTERVAL);
        return;
      }

      sdk.storage.set(COUNTER, this.counter);
    }
  }, {
    key: 'count',
    value: function count(headers) {
      if (!this.counter) return;

      for (var k in headers) {
        var header = headers[k];
        header.name = header.name.toLowerCase();
        header.value = header.value.toLowerCase();

        if (header.name === 'content-length') {
          this.update(header.value);
          return { cancel: false };
        }
      }
    }
  }, {
    key: 'update',
    value: function update(number) {
      number = Number((Number(number) / 1048576).toFixed(4));

      var now = Math.round(Date.now() / 1000);
      var day = 24 * 60 * 60;
      var week = 7 * day;
      var month = 30 * day;
      var c = this.counter;

      if (now < c.day.end) c.day.bandwidth += number;else c.day = { bandwidth: 0, end: now + day };

      if (now < c.week.end) c.week.bandwidth += number;else c.week = { bandwidth: 0, end: now + week };

      if (now < c.month.end) c.month.bandwidth += number;else c.month = { bandwidth: 0, end: now + month };

      c.total.bandwidth += number;

      this.counter = c;
    }
  }, {
    key: 'restore',
    value: function restore() {
      var counter = sdk.storage.get(COUNTER);
      if (!counter) {
        var now = Math.round(Date.now() / 1000);
        var day = 24 * 60 * 60;
        var week = 7 * day;
        var month = 30 * day;

        counter = {
          total: {
            bandwidth: 0
          },
          month: {
            bandwidth: 0,
            end: now + month
          },
          week: {
            bandwidth: 0,
            end: now + week
          },
          day: {
            bandwidth: 0,
            end: now + day
          }
        };

        sdk.storage.set(COUNTER, counter);
      }

      this.counter = counter;
    }
  }]);

  return BandwidthCounter;
}();

exports.default = BandwidthCounter;

},{}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STATUS = 'Connection.Cookie.status';
var COUNTER = 'Connection.Cookie.counter';

var CookiesBlocker = function () {
  function CookiesBlocker() {
    var _this = this;

    _classCallCheck(this, CookiesBlocker);

    this.status = sdk.storage.get(STATUS) ? sdk.storage.get(STATUS) : 'off';
    this.counter = sdk.storage.get(COUNTER) ? sdk.storage.get(COUNTER) : 0;

    setInterval(function () {
      sdk.storage.set(COUNTER, _this.counter);
    }, 30000);
  }

  _createClass(CookiesBlocker, [{
    key: 'getCounter',
    value: function getCounter() {
      return this.counter;
    }
  }, {
    key: 'getStatus',
    value: function getStatus() {
      return this.status;
    }
  }, {
    key: 'setStatus',
    value: function setStatus(status) {
      if (['on', 'off', 'disabled'].indexOf(status) === -1) return;
      this.status = status;
      return sdk.storage.set(STATUS, status);
    }
  }, {
    key: 'check',
    value: function check(headers) {
      if (this.status !== 'on') return headers;

      for (var k in headers) {
        var name = {};
        name = headers[k].name.toLowerCase();

        if (name === 'cookie') {
          if (Number(Date.now().toString().match(/[0-9]{2}$/)) < 10) this.counter++;
          headers.splice(k, 1);
          break;
        }
      }

      return headers;
    }
  }]);

  return CookiesBlocker;
}();

exports.default = CookiesBlocker;

},{}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DnsPrefetch = function () {
  function DnsPrefetch() {
    var _this = this;

    _classCallCheck(this, DnsPrefetch);

    var action = '';
    if (sdk.proxy.status.status === 'connected') {
      action = 'enable';
    } else {
      action = 'disable';
    }

    this[action]().then(function () {
      sdk.proxy.onStatusChanged.add(_this.proxyStatusChanged.bind(_this));
    });
  }

  _createClass(DnsPrefetch, [{
    key: 'proxyStatusChanged',
    value: function proxyStatusChanged() {
      if (sdk.proxy.status.status === 'connected' && this.status === 'off') {
        this.enable();
      } else if (sdk.proxy.status.status === 'disconnected' && this.status === 'on') {
        this.disable();
      }
    }
  }, {
    key: 'init',
    value: function init() {
      var _this2 = this;

      browser.privacy.network.networkPredictionEnabled.get({}, function (response) {
        if (response && response.value) _this2.status = 'on';else _this2.status = 'off';
      });
    }
  }, {
    key: 'enable',
    value: function enable() {
      var _this3 = this;

      return new Promise(function (resolve) {
        browser.privacy.network.networkPredictionEnabled.set({ value: false }, function () {
          _this3.status = 'on';
          return resolve();
        });
      });
    }
  }, {
    key: 'disable',
    value: function disable() {
      var _this4 = this;

      return new Promise(function (resolve) {
        browser.privacy.network.networkPredictionEnabled.set({ value: true }, function () {
          _this4.status = 'off';
          return resolve();
        });
      });
    }
  }]);

  return DnsPrefetch;
}();

exports.default = DnsPrefetch;

},{}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Network = require('Wdgt/Network');

var _Network2 = _interopRequireDefault(_Network);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STATUS = 'Connection.MalwareBlocker.status';
var COUNTER = 'Connection.MalwareBlocker.counter';
var WHITE_LIST = 'Connection.MalwareBlocker.whiteList';

var URL = sdk.config.protocolPrefix + '://' + sdk.config.application.applicationId + '/static/data/malware';

var MalwareBlocker = function () {
  function MalwareBlocker() {
    var _this = this;

    _classCallCheck(this, MalwareBlocker);

    this.status = sdk.storage.get(STATUS) ? sdk.storage.get(STATUS) : 'off';
    this.counter = sdk.storage.get(COUNTER) ? sdk.storage.get(COUNTER) : 0;
    this.whiteList = sdk.storage.get(WHITE_LIST) ? sdk.storage.get(WHITE_LIST) : [];

    this.loadRules().then(function () {
      setInterval(function () {
        sdk.storage.set(COUNTER, _this.counter);
      }, 30000);
    });
  }

  _createClass(MalwareBlocker, [{
    key: 'getCounter',
    value: function getCounter() {
      return this.counter;
    }
  }, {
    key: 'getStatus',
    value: function getStatus() {
      return this.status;
    }
  }, {
    key: 'setStatus',
    value: function setStatus(status) {
      if (['on', 'off', 'disabled'].indexOf(status) === -1) return;
      this.status = status;
      return sdk.storage.set(STATUS, status);
    }
  }, {
    key: 'loadRules',
    value: function loadRules() {
      var _this2 = this;

      return _Network2.default.get(URL).then(function (rules) {
        _this2.rules = rules.split(" ");
      }).catch(function (e) {
        error(e);
      });
    }
  }, {
    key: 'check',
    value: function check(domain) {
      if (this.status !== 'on' || !domain || this.whiteList.indexOf(domain) !== -1) return false;

      if (this.rules.indexOf(domain) !== -1) {
        this.counter++;
        return true;
      }

      return false;
    }
  }, {
    key: 'proceed',
    value: function proceed(url) {
      var _this3 = this;

      return new Promise(function (resolve) {
        var domain = sdk.tabs.getDomain(url);
        if (!domain || _this3.whiteList.indexOf(domain) !== -1) return resolve();

        sdk.reporting.report('malware', 'proceed', domain);

        _this3.whiteList.push(domain);
        sdk.storage.set(WHITE_LIST, _this3.whiteList).then(function () {
          return resolve();
        });
      });
    }
  }]);

  return MalwareBlocker;
}();

exports.default = MalwareBlocker;

},{"Wdgt/Network":33}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LAUNCHED = 'Monitoring.launched';
var NEXT_PING = 'Monitoring.lextPing';
var STATUS_INTERVAL = 2 * 60 * 1000;
var GDPR_CONNECTED = 'GDPR.Connected';

var Monitoring = function () {
  function Monitoring() {
    _classCallCheck(this, Monitoring);

    this.install();
    this.update();
    this.ping();
    this.status();
  }

  _createClass(Monitoring, [{
    key: 'status',
    value: function status() {
      var status = {
        connected: 0,
        disconnected: 0,
        secured: 0,
        bypass: 0
      };
      var rules = {
        bypass: ['disconnected', 'bypass'],
        secured: ['connected', 'secured'],
        connected: ['connected', 'regular'],
        disconnected: ['disconnected', 'regular']
      };

      sdk.tabs.onPageView.add(function (page) {
        if (!page || !page.domain) return;

        if (sdk.proxy.bypass.isInList(page.domain) && sdk.proxy.status.status === 'connected') {
          status.bypass++;
        } else if (sdk.proxy.secured.isInList(page.domain) && sdk.proxy.status.status !== 'connected') {
          status.secured++;
        } else if (sdk.proxy.status.status === 'connected') {
          status.connected++;
        } else {
          status.disconnected++;
        }

        sdk.reporting.internal('pageview', { 'category': Date.now(), 'connection-status': sdk.proxy.status.status, 'connection-country': sdk.proxy.status.location });
      });

      setInterval(function () {
        for (var k in status) {
          if (status[k] === 0 || !sdk.storage.get(GDPR_CONNECTED)) continue;

          sdk.reporting.internal('status', {
            connection_status: rules[k][0],
            connection_type: rules[k][1],
            sites_number: status[k]
          });
        }

        status = {
          connected: 0,
          disconnected: 0,
          secured: 0,
          bypass: 0
        };
      }, STATUS_INTERVAL);
    }
  }, {
    key: 'update',
    value: function update() {
      browser.runtime.onUpdateAvailable.addListener(function () {
        sdk.reporting.report('application', 'updated').then(function () {
          browser.runtime.reload();
        });
      });
    }
  }, {
    key: 'install',
    value: function install() {
      if (sdk.config.uninstallUrl) {
        browser.runtime.setUninstallURL(sdk.config.uninstallUrl);
      }
      if (sdk.storage.get(LAUNCHED)) return;

      sdk.reporting.report('application', 'installed').then(function () {
        sdk.storage.set(LAUNCHED, true).then(function () {
          if (sdk.config.installUrl) {
            sdk.tabs.openPage(sdk.config.installUrl);
          }
        });
      });
    }
  }, {
    key: 'ping',
    value: function ping() {
      var _this = this;

      if (!sdk.config.reporting || !sdk.config.reporting.analytics || sdk.config.reporting.analytics.interval) return;

      if (!sdk.storage.get(NEXT_PING) || sdk.storage.get(NEXT_PING) < Date.now()) {
        sdk.reporting.analytics('application', 'status', sdk.user.status.elite ? 'elite' : 'free').then(function () {
          sdk.storage.set(NEXT_PING, Date.now() + sdk.config.reporting.analytics.interval);
        });
      }
      setTimeout(function () {
        _this.ping();
      }, 60 * 60 * 1000);
    }
  }]);

  return Monitoring;
}();

exports.default = Monitoring;

},{}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Network = require('Wdgt/Network');

var _Network2 = _interopRequireDefault(_Network);

var _objectMerge = require('object-merge');

var _objectMerge2 = _interopRequireDefault(_objectMerge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URL = 'http://www.google-analytics.com/collect';
var PARAMETERS_MAP = {
  'version': 'v',
  'clientId': 'cid',
  'userId': 'uid',
  'trackingId': 'tid',
  'hitType': 't',
  'applicationName': 'an',
  'applicationId': 'aid',
  'applicationVersion': 'av',
  'contentDescription': 'cd',
  'category': 'ec',
  'action': 'ea',
  'label': 'el',
  'value': 'ev',
  'screenName': 'cd',
  'campaignName': 'cn',
  'campaignSource': 'cs',
  'campaignMedium': 'cm',
  'clientIpAddress': 'uip',
  'userAgent': 'ua'
};

var PARAMS = 'Reporting.Analytics.param';

var Analytics = function () {
  function Analytics() {
    _classCallCheck(this, Analytics);
  }

  _createClass(Analytics, [{
    key: 'init',
    value: function init() {
      if (!sdk || !sdk.config || !sdk.config.reporting || !sdk.config.reporting.analytics || !sdk.config.reporting.analytics.id) return new Promise(function (resolve) {
        resolve();
      });

      return this.restoreParams();
    }
  }, {
    key: 'event',
    value: function event(params) {
      var _this = this;

      return new Promise(function (resolve) {
        if (!params || !params.category || !sdk || !sdk.config || !sdk.config.reporting || !sdk.config.reporting.analytics || !sdk.config.reporting.analytics.id) return resolve();

        var config = sdk.config.reporting.analytics;
        var rand = Number(Date.now().toString().match(/[0-9]{2}$/));
        var sampling = config.sampling[params.category] ? config.sampling[params.category] : config.sampling.default;

        if (rand > sampling - 1) return resolve();

        if (!config.noPrefix) {
          params.category = "_" + params.category;
        }
        params.hitType = 'event';
        params.version = '1';
        params.clientId = sdk.user.hash;
        params.applicationId = sdk.config.application.id;
        params.applicationName = sdk.config.application.name;
        params.applicationVersion = sdk.config.application.version;
        params = (0, _objectMerge2.default)(params, _this.params);

        return resolve(_this.send(params));
      });
    }
  }, {
    key: 'send',
    value: function send(params) {
      return new Promise(function (resolve, reject) {
        var stringify = function stringify(parameters) {
          var shortParameters = {};
          for (var name in parameters) {
            var value = parameters[name];
            if (typeof value === 'undefined' || value == null) {
              continue;
            }

            shortParameters[PARAMETERS_MAP[name] || name] = value;
          }

          var bodyParts = [];
          for (var key in shortParameters) {
            bodyParts.push(key + '=' + encodeURIComponent(shortParameters[key]));
          }

          return bodyParts.join('&');
        };

        _Network2.default.post(URL, stringify(params)).then(function () {
          return resolve();
        }).catch(function () {
          return resolve();
        });
      });
    }
  }, {
    key: 'restoreParams',
    value: function restoreParams() {
      var _this2 = this;

      this.params = sdk.storage.get(PARAMS) ? sdk.storage.get(PARAMS) : {};

      return new Promise(function (resolve) {
        if (!_this2.params.trackingId) {
          return _this2.createParams().then(function () {
            return resolve();
          });
        }
        return resolve();
      });
    }
  }, {
    key: 'createParams',
    value: function createParams() {
      var _this3 = this;

      var params = {
        trackingId: sdk.config.reporting.analytics.id
      };

      return new Promise(function (resolve) {
        _this3.updateParams(params).then(function () {
          browser.tabs.query({
            url: 'https://chrome.google.com/*' + sdk.config.application.applicationId + '*'
          }, function (tabs) {
            var tab = tabs[0];
            if (!tab) {
              return resolve();
            }

            var campaignName = tab.url.match(/utm_campaign=([^&]+)/);
            var campaignSource = tab.url.match(/utm_source=([^&]+)/);
            var campaignMedium = tab.url.match(/utm_medium=([^&]+)/);

            var params = {
              campaignName: campaignName && campaignName[1] ? campaignName[1] : null,
              campaignSource: campaignSource && campaignSource[1] ? campaignSource[1] : null,
              campaignMedium: campaignMedium && campaignMedium[1] ? campaignMedium[1] : null
            };

            _this3.updateParams(params).then(function () {
              return resolve();
            });
          });
        });
      });
    }
  }, {
    key: 'updateParams',
    value: function updateParams(params) {
      this.params = (0, _objectMerge2.default)(this.params, params);

      return sdk.storage.set(PARAMS, this.params);
    }
  }]);

  return Analytics;
}();

exports.default = Analytics;

},{"Wdgt/Network":33,"object-merge":7}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Network = require('Wdgt/Network');

var _Network2 = _interopRequireDefault(_Network);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URL = 'https://event.shelljacket.us/api/report/chrome_ext';
var QUEUE = 'Reporting.Internal.queue';
var INTERVAL = 2.5 * 60 * 1000;
var GDPR_CONNECTED = 'GDPR.Connected';

var Internal = function () {
  function Internal() {
    _classCallCheck(this, Internal);

    this.queue = sdk.storage.get(QUEUE) ? sdk.storage.get(QUEUE) : [];

    this.send();
    setInterval(this.send.bind(this), INTERVAL);
  }

  _createClass(Internal, [{
    key: 'event',
    value: function event(params) {
      params.payload.version = sdk.config.application.dotVersion;
      params.payload.country = sdk.user.country;
      params.payload.hash = sdk.user.hash;
      params.payload.id = sdk.config.application.id;
      params.payload.ts = Date.now();

      this.queue.push(params);

      return sdk.storage.set(QUEUE, this.queue).then(function () {
        return params;
      });
    }
  }, {
    key: 'send',
    value: function send() {
      var _this = this;

      if (this.queue.length === 0 || !sdk.storage.get(GDPR_CONNECTED)) return;

      var temp = this.queue;
      this.queue = [];

      var count = this.queue.length - 1;
      var report = '';

      for (var k in temp) {
        report += JSON.stringify(temp[k]).toLowerCase();
        if (k !== count) report += "\n";
      }

      _Network2.default.post(URL, report).then(function () {
        sdk.storage.set(QUEUE, _this.queue);
      }).catch(function (e) {
        _this.queue = _this.queue.concat(temp);
        sdk.storage.set(QUEUE, _this.queue);
      });
    }
  }]);

  return Internal;
}();

exports.default = Internal;

},{"Wdgt/Network":33}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Internal = require('./Internal');

var _Internal2 = _interopRequireDefault(_Internal);

var _Analytics = require('./Analytics');

var _Analytics2 = _interopRequireDefault(_Analytics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Reporting = function () {
  function Reporting() {
    _classCallCheck(this, Reporting);
  }

  _createClass(Reporting, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.internalObj = new _Internal2.default();
      this.analyticsObj = new _Analytics2.default();

      return this.analyticsObj.init().then(function () {
        sdk.reporting = {
          report: _this.report.bind(_this),
          internal: _this.internal.bind(_this),
          analytics: _this.analytics.bind(_this)
        };
      });
    }
  }, {
    key: 'report',
    value: function report() {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      this.internal.apply(this, params);
      return this.analytics.apply(this, params);
    }
  }, {
    key: 'internal',
    value: function internal() {
      for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        params[_key2] = arguments[_key2];
      }

      if (params.length === 0) {
        return new Promise(function (resolve) {
          resolve();
        });
      }

      var fields = ['event', 'category', 'action', 'label', 'value'];
      var record = {};

      for (var k in params) {
        if (_typeof(params[k]) !== 'object' && fields[k]) {
          record[fields[k]] = params[k];
          continue;
        }

        if (_typeof(params[k]) === 'object') {
          for (var j in params[k]) {
            if (!params[k][j]) continue;
            record[j] = params[k][j];
          }
        }
      }

      if (!record.event) {
        return new Promise(function (resolve) {
          resolve();
        });
      }
      var report = {
        event: record.event,
        payload: {}
      };

      delete record.event;
      for (var _k in record) {
        report.payload[_k] = record[_k];
      }

      return this.internalObj.event(report);
    }
  }, {
    key: 'analytics',
    value: function analytics() {
      for (var _len3 = arguments.length, params = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        params[_key3] = arguments[_key3];
      }

      if (params.length === 0) {
        return new Promise(function (resolve) {
          resolve();
        });
      }
      var fields = ['category', 'action', 'label', 'value'];
      var record = {};

      for (var k in params) {
        if (_typeof(params[k]) !== 'object' && fields[k]) {
          record[fields[k]] = params[k];
          continue;
        }

        if (_typeof(params[k]) === 'object') {
          for (var j in params[k]) {
            record[j] = params[k][j];
          }
        }
      }

      if (!record.category) {
        return new Promise(function (resolve) {
          resolve();
        });
      }

      if (record.value) {
        record.label = record.label + '_' + record.value;
      }

      return this.analyticsObj.event({
        category: record.category,
        action: record.action,
        label: record.label
      });
    }
  }]);

  return Reporting;
}();

exports.default = Reporting;

},{"./Analytics":49,"./Internal":50}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var COUNTER = 'Connection.Sites.counter';
var SAVE_INTERVAL = 30 * 1000;

var SitesCounter = function () {
  function SitesCounter() {
    var _this = this;

    _classCallCheck(this, SitesCounter);

    this.counter = sdk.storage.get(COUNTER) ? sdk.storage.get(COUNTER) : 0;

    this.save();

    sdk.tabs.onPageView.add(function () {
      if (sdk.proxy.status.status === 'connected') _this.counter++;
    });
  }

  _createClass(SitesCounter, [{
    key: 'getCounter',
    value: function getCounter() {
      return this.counter;
    }
  }, {
    key: 'save',
    value: function save() {
      if (!this.saveInterval) {
        this.saveInterval = setInterval(this.save.bind(this), SAVE_INTERVAL);
        return;
      }

      sdk.storage.set(COUNTER, this.counter);
    }
  }]);

  return SitesCounter;
}();

exports.default = SitesCounter;

},{}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Methods = function () {
  function Methods() {
    _classCallCheck(this, Methods);
  }

  _createClass(Methods, null, [{
    key: 'getDomain',
    value: function getDomain(url) {
      if (!url) return '';
      var firstTLDs = "ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|be|bf|bg|bh|bi|bj|bm|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|cl|cm|cn|co|cr|cu|cv|cw|cx|cz|de|dj|dk|dm|do|dz|ec|ee|eg|es|et|eu|fi|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|im|in|io|iq|ir|is|it|je|jo|jp|kg|ki|km|kn|kp|kr|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|na|nc|ne|nf|ng|nl|no|nr|nu|nz|om|pa|pe|pf|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|yt".split('|');
      var secondTLDs = "com|edu|gov|net|mil|org|nom|sch|caa|res|off|gob|int|tur|ip6|uri|urn|asn|act|nsw|qld|tas|vic|pro|biz|adm|adv|agr|arq|art|ato|bio|bmd|cim|cng|cnt|ecn|eco|emp|eng|esp|etc|eti|far|fnd|fot|fst|g12|ggf|imb|ind|inf|jor|jus|leg|lel|mat|med|mus|not|ntr|odo|ppg|psc|psi|qsl|rec|slg|srv|teo|tmp|trd|vet|zlg|web|ltd|sld|pol|fin|k12|lib|pri|aip|fie|eun|sci|prd|cci|pvt|mod|idv|rel|sex|gen|nic|abr|bas|cal|cam|emr|fvg|laz|lig|lom|mar|mol|pmn|pug|sar|sic|taa|tos|umb|vao|vda|ven|mie|北海道|和歌山|神奈川|鹿児島|ass|rep|tra|per|ngo|soc|grp|plc|its|air|and|bus|can|ddr|jfk|mad|nrw|nyc|ski|spy|tcm|ulm|usa|war|fhs|vgs|dep|eid|fet|fla|flå|gol|hof|hol|sel|vik|cri|iwi|ing|abo|fam|gok|gon|gop|gos|aid|atm|gsm|sos|elk|waw|est|aca|bar|cpa|jur|law|sec|plo|www|bir|cbg|jar|khv|msk|nov|nsk|ptz|rnd|spb|stv|tom|tsk|udm|vrn|cmw|kms|nkz|snz|pub|fhv|red|ens|nat|rns|rnu|bbs|tel|bel|kep|nhs|dni|fed|isa|nsn|gub|e12|tec|орг|обр|упр|alt|nis|jpn|mex|ath|iki|nid|gda|inc".split('|');

      url = url.replace(/^(https?:)?\/\/(www.)?([^/]+).*/, '$3');
      var parts = url.split('.');
      while (parts.length > 3) {
        parts.shift();
      }
      if (parts.length === 3 && (parts[1].length > 2 && parts[2].length > 2 || secondTLDs.indexOf(parts[1]) === -1 && firstTLDs.indexOf(parts[2]) === -1)) {
        parts.shift();
      }
      return parts.join('.');
    }
  }, {
    key: 'getFullDomain',
    value: function getFullDomain(url) {
      if (!url) return '';
      url = url.replace(/^(https?:)?\/\/(www.)?([^/]+).*/, '$3');
      return url ? url : '';
    }
  }]);

  return Methods;
}();

exports.default = Methods;

},{}],54:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Network = require('Wdgt/Network');

var _Network2 = _interopRequireDefault(_Network);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URL = sdk.config.protocolPrefix + '://' + sdk.config.application.applicationId + '/static/data/sword';

var Rules = function () {
  function Rules() {
    _classCallCheck(this, Rules);

    this.rules = {};
  }

  _createClass(Rules, [{
    key: 'loadRules',
    value: function loadRules() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _Network2.default.get(URL).then(function (r) {
          try {
            r = JSON.parse(r);

            var rules = {};
            for (var k in r) {
              try {
                if (r[k].match(/\.$/)) continue;
                var rule = r[k].split('.');
                rule.reverse();
                rules[rule[0]] = rules[rule[0]] ? rules[rule[0]] : [];
                rules[rule[0]].push(r[k]);
              } catch (e) {
                error(e);
              }
            }

            _this.rules = rules;
            return resolve();
          } catch (e) {
            return reject();
          }
        }).catch(function (e) {
          return reject();
        });
      });
    }
  }, {
    key: 'isInList',
    value: function isInList(domain) {
      var splited = domain.split('.');
      if (!this.rules[splited[splited.length - 1]] || this.rules[splited[splited.length - 1]].indexOf(domain) === -1) return false;

      return true;
    }
  }]);

  return Rules;
}();

exports.default = Rules;

},{"Wdgt/Network":33}],55:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Rules = require('./Rules');

var _Rules2 = _interopRequireDefault(_Rules);

var _Methods = require('./Methods');

var _Methods2 = _interopRequireDefault(_Methods);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var REPLACE = 'Sword.Replace';
var ENABLED = 'Sword.Enabled';

var DEFAULT_REPLACE = ['hotspotshield.com', 'betternet.co', 'hamsterdance.com', 'html5zombo.com'];

var Sword = function () {
  function Sword() {
    var _this = this;

    _classCallCheck(this, Sword);

    this.tabs = {};
    this.done = false;
    this.enabled = false;
    this.replace = false;
    this.swordQ = {};

    if (!sdk.storage.get(REPLACE)) {
      sdk.storage.set(REPLACE, DEFAULT_REPLACE);
    }

    this.rules = new _Rules2.default();
    this.rules.loadRules().then(function () {
      _this.done = true;
      _this.enabled = sdk.storage.get(ENABLED) ? sdk.storage.get(ENABLED) : false;
      _this.replace = sdk.storage.get(REPLACE) && sdk.storage.get(REPLACE).length > 0 ? sdk.storage.get(REPLACE) : [];

      if (_this.replace.length === 0) {
        _this.enabled = false;
        sdk.storage.set(ENABLED, _this.enabled);
      }
    }).catch(function () {
      _this.disable();
    });
  }

  _createClass(Sword, [{
    key: 'getList',
    value: function getList() {
      return this.replace;
    }
  }, {
    key: 'removeFromList',
    value: function removeFromList(k) {
      var _this2 = this;

      this.replace.splice(k, 1);
      return sdk.storage.set(REPLACE, this.replace).then(function () {
        _this2.replace = sdk.storage.get(REPLACE) && sdk.storage.get(REPLACE).length > 0 ? sdk.storage.get(REPLACE) : [];

        if (_this2.replace.length === 0) {
          _this2.enabled = false;
          sdk.storage.set(ENABLED, _this2.enabled);
        }

        return _this2.replace;
      });
    }
  }, {
    key: 'addToList',
    value: function addToList(domain) {
      var _this3 = this;

      var exist = false;
      for (var k in this.replace) {
        if (this.replace[k] === domain) exist = true;
      }

      return new Promise(function (resolve) {
        if (exist) return resolve();
        _this3.replace.push(domain);
        sdk.storage.set(REPLACE, _this3.replace).then(function () {
          return resolve(_this3.replace);
        });
      });
    }
  }, {
    key: 'message',
    value: function message(request, sender) {
      switch (request.method) {
        case 'getSwordData':
          return this.getSwordData(sender.tab.id);
        case 'checkSwordInsertionDomain':
          return this.checkSwordInsertionDomain(request.message.url, sender.tab.id);
      }
    }
  }, {
    key: 'getSwordData',
    value: function getSwordData(id) {
      if (!this.done || !this.enabled || !this.tabs[id]) return { disabled: true };

      return this.tabs[id];
    }
  }, {
    key: 'checkSwordInsertionDomain',
    value: function checkSwordInsertionDomain(url, id) {
      if (!this.done || !this.enabled || !this.tabs[id]) return { isInList: false };

      var domain = _Methods2.default.getDomain(url),
          fullDomain = _Methods2.default.getFullDomain(url);

      if (domain === this.tabs[id].domain) return { isInList: false };

      if (!this.rules.isInList(fullDomain) && !this.rules.isInList(domain)) return { isInList: false };

      return { isInList: true };
    }
  }, {
    key: 'onBeforeRequest',
    value: function onBeforeRequest(details) {
      if (!this.done || !this.enabled) return false;

      if (details.type === 'main_frame') {
        var replace = this.replace[Math.floor(Math.random() * this.replace.length)];

        this.tabs[details.tabId] = {
          id: details.tabId,
          url: details.url,
          domain: _Methods2.default.getDomain(details.url),
          fullDomain: _Methods2.default.getFullDomain(details.url),
          aliasDomain: replace
        };
        return false;
      }

      var request = this.getRequestInfo(details);
      if (!request || request.request.url.indexOf(request.tab.domain) === -1) return false;
      if (!this.rules.isInList(request.request.fullDomain) && !this.rules.isInList(request.request.domain)) return false;

      var newUrl = request.request.url.replace(new RegExp(request.tab.domain, 'g'), request.aliasDomain);

      this.swordQ[newUrl] = 'replace';

      return newUrl;
    }
  }, {
    key: 'onBeforeSendHeaders',
    value: function onBeforeSendHeaders(details) {
      if (!this.done || !this.enabled) return false;

      var request = this.getRequestInfo(details);
      if (!request) return false;
      if (!this.rules.isInList(request.request.fullDomain) && !this.rules.isInList(request.request.domain)) return false;

      var headers = [],
          updated = false;

      for (var k in request.headers) {
        var header = request.headers[k];

        if (header.value.indexOf(request.tab.domain) !== -1) {
          updated = true;
          header.value = header.value.replace(new RegExp(request.tab.domain, 'g'), request.aliasDomain);
        }

        headers.push(header);
      }

      if (updated) {
        if (details.url) this.swordQ[details.url] = 'update';
        return headers;
      }

      return false;
    }
  }, {
    key: 'onHeadersReceived',
    value: function onHeadersReceived(details) {
      if (!this.done || !this.enabled) return false;

      var request = this.getRequestInfo(details);
      if (!request || request.request.domain === request.request.initiatorDomain) return false;
      delete this.swordQ[details.url];

      var headers = [],
          cors = false,
          updated = false;

      for (var k in request.headers) {
        var header = request.headers[k];

        if (header.name.toLowerCase() === 'access-control-allow-origin') cors = true;
        if (header.value.indexOf(request.aliasDomain) !== -1) {
          updated = true;
          header.value = header.value.replace(new RegExp(request.aliasDomain, 'g'), request.tab.domain);
        }

        headers.push(header);
      }

      if (!cors) {
        updated = true;
        headers.push({
          name: 'Access-Control-Allow-Origin',
          value: request.request.initiator
        });
      }

      if (updated) {
        return headers;
      }

      return false;
    }
  }, {
    key: 'getStatus',
    value: function getStatus() {
      return this.enabled ? 'on' : 'off';
    }
  }, {
    key: 'setStatus',
    value: function setStatus(status) {
      if (['on', 'off', 'disabled'].indexOf(status) === -1) return;

      this.enabled = status === 'on';
      if (this.replace.length === 0) {
        this.enabled = false;
      }
      return sdk.storage.set(ENABLED, this.enabled);
    }
  }, {
    key: 'getRequestInfo',
    value: function getRequestInfo(r) {
      if (!r || !r.tabId || !this.tabs[r.tabId]) return false;
      var request = {
        tab: {
          url: this.tabs[r.tabId].url,
          domain: this.tabs[r.tabId].domain,
          fullDomain: this.tabs[r.tabId].fullDomain
        },
        request: {
          url: r.url,
          domain: _Methods2.default.getDomain(r.url),
          initiator: r.initiator,
          initiatorDomain: _Methods2.default.getDomain(r.initiator),
          fullDomain: _Methods2.default.getFullDomain(r.url)
        },
        headers: r.requestHeaders ? r.requestHeaders : r.responseHeaders ? r.responseHeaders : [],
        aliasDomain: this.tabs[r.tabId].aliasDomain
      };

      if (request.tab.domain === request.request.domain) return false;

      return request;
    }
  }]);

  return Sword;
}();

exports.default = Sword;

},{"./Methods":53,"./Rules":54}],56:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Network = require('Wdgt/Network');

var _Network2 = _interopRequireDefault(_Network);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STATUS = 'Connection.Tracker.status';
var COUNTER = 'Connection.Tracker.counter';

var URL = sdk.config.protocolPrefix + '://' + sdk.config.application.applicationId + '/static/data/trackers';

var TrackerBlocker = function () {
  function TrackerBlocker() {
    var _this = this;

    _classCallCheck(this, TrackerBlocker);

    this.status = sdk.storage.get(STATUS) ? sdk.storage.get(STATUS) : 'off';
    this.counter = sdk.storage.get(COUNTER) ? sdk.storage.get(COUNTER) : 0;

    this.loadRules().then(function () {
      setInterval(function () {
        sdk.storage.set(COUNTER, _this.counter);
      }, 30000);
    });
  }

  _createClass(TrackerBlocker, [{
    key: 'getCounter',
    value: function getCounter() {
      return this.counter;
    }
  }, {
    key: 'getStatus',
    value: function getStatus() {
      return this.status;
    }
  }, {
    key: 'setStatus',
    value: function setStatus(status) {
      if (['on', 'off', 'disabled'].indexOf(status) === -1) return;
      this.status = status;
      return sdk.storage.set(STATUS, status);
    }
  }, {
    key: 'loadRules',
    value: function loadRules() {
      var _this2 = this;

      return _Network2.default.get(URL).then(function (rules) {
        _this2.rules = rules.split(" ");
      }).catch(function (e) {
        error(e);
      });
    }
  }, {
    key: 'check',
    value: function check(domain) {
      if (this.status !== 'on' || !domain) return false;

      if (this.rules.indexOf(domain) !== -1) {
        this.counter++;
        return true;
      }

      return false;
    }
  }]);

  return TrackerBlocker;
}();

exports.default = TrackerBlocker;

},{"Wdgt/Network":33}],57:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Network = require('Wdgt/Network');

var _Network2 = _interopRequireDefault(_Network);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FIREBASE_DATA = 'User.Authorization.firebaseData';

var DATA = 'User.data';

var URLS = {
  prod: ['api-prod-partner-us-west-2.northghost.com'],
  debug: ['api-stage-partner-us-west-2.northghost.com']
};

var Authorization = function () {
  function Authorization() {
    _classCallCheck(this, Authorization);

    this.url;
  }

  _createClass(Authorization, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.onBeforeSendHeaders();
      return new Promise(function (resolve) {
        _this.getToken().then(function () {
          if (sdk.config.debug) {
            _this.getToken('debug').then(function () {
              return resolve();
            });
          } else {
            return resolve();
          }
        });
      });
    }
  }, {
    key: 'getToken',
    value: function getToken(type, i) {
      var _this2 = this;

      i = i === undefined ? 0 : ++i;
      type = type ? type : 'prod';
      return new Promise(function (resolve) {
        if (URLS[type].length <= i || sdk.user.credentials[type].username) return resolve();

        var firebase = sdk.storage.get(FIREBASE_DATA);
        var url = 'https://' + URLS[type][i] + '/user/login' + '?device_id=' + sdk.user.hash + '&device_name=Chrome%20Extension' + '&device_type=' + sdk.config.authorization.platform + '_extension' + '&carrier_id=' + sdk.config.authorization.carrier + '&tz=' + new Date().getTimezoneOffset() + '&auth_method=' + (firebase ? 'firebase' : 'anonymous');

        if (firebase) {
          url += '&access_token=' + firebase.token;
        }

        _this2.url = URLS[type][i];
        _Network2.default.post(url).then(function (response) {
          _this2.url = undefined;
          try {
            response = JSON.parse(response);
          } catch (e) {
            response = undefined;
          }

          if (!response || !response.result || response.result !== 'OK') {
            return resolve(_this2.getToken(type, i));
          }

          try {
            sdk.user.credentials[type] = {
              id: response.subscriber.id,
              name: response.subscriber.name,
              carrier_id: response.subscriber.carrier_id,
              username: 'access_token',
              password: response.access_token
            };
          } catch (e) {
            sdk.user.credentials[type] = {};
          }

          sdk.storage.set(DATA, sdk.user).then(function () {
            return resolve();
          });
        }).catch(function (e) {
          _this2.url = undefined;
          resolve(_this2.getToken(type, i));
        });
      });
    }
  }, {
    key: 'onBeforeSendHeaders',
    value: function onBeforeSendHeaders() {
      var _this3 = this;

      browser.webRequest.onBeforeSendHeaders.addListener(function (details) {
        if (!_this3.url) return;

        if (details.url.indexOf(_this3.url) === -1) return;

        for (var k in details.requestHeaders) {
          if (details.requestHeaders[k].name.toLowerCase() === 'origin') {
            details.requestHeaders[k].value = 'https://' + _this3.url;
            break;
          }
        }

        return { requestHeaders: details.requestHeaders };
      }, { urls: ["https://*/*"] }, ["blocking", "requestHeaders"]);
    }
  }]);

  return Authorization;
}();

exports.default = Authorization;

},{"Wdgt/Network":33}],58:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Proto = require('./proto/Proto');

var _Proto2 = _interopRequireDefault(_Proto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DATA = 'User.data';

var Elite = function () {
  function Elite() {
    _classCallCheck(this, Elite);

    this.popUp = {
      deviceInfo: '',
      trial: 'https://www.hsselite.com/payment/cc/week2month?chrome_ext=1',
      payment: 'https://www.hsselite.com/pre_purchase?chrome_ext=1'
    };

    this.proto = new _Proto2.default();
  }

  _createClass(Elite, [{
    key: 'init',
    value: function init() {
      var _this = this;

      return new Promise(function (resolve) {
        _this.getStatus().then(function () {
          _this.getPopUp();
          _this.showToPublic();
          return resolve();
        });
      });
    }
  }, {
    key: 'getStatus',
    value: function getStatus() {
      var _this2 = this;

      return new Promise(function (resolve) {
        _this2.proto.request('Status', 'status', { DeviceInfo: _this2.deviceInfo() }).then(function (result) {
          _this2.statusCallback(result).then(function () {
            return resolve();
          });
        }).catch(function (result) {
          _this2.statusCallback(result).then(function () {
            return resolve();
          });
        });
      });
    }
  }, {
    key: 'signIn',
    value: function signIn(login, password) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var data = {
          category: 'signin'
        };

        _this3.eliteEvent(data);

        _this3.proto.request('Signin', 'signin', { DeviceInfo: _this3.deviceInfo(), login: login, password: password }).then(function (result) {
          _this3.statusCallback(result).then(function (status) {
            var data = {
              category: 'signedin',
              touchpoint: sdk.user.status.elite ? 'elite' : 'free'

            };
            _this3.eliteEvent(data);

            return resolve(status);
          });
        }).catch(function (e) {
          return reject(e.ResponseStatus);
        });
      });
    }
  }, {
    key: 'signUp',
    value: function signUp(login, password) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var data = {
          category: 'signup'
        };

        _this4.eliteEvent(data);

        _this4.proto.request('Signup', 'signup', { DeviceInfo: _this4.deviceInfo(), email: login, password: password }).then(function (result) {
          _this4.signIn(login, password).then(function (data) {
            return resolve(data);
          });
        }).catch(function (e) {
          return reject(e.ResponseStatus);
        });
      });
    }
  }, {
    key: 'restorePassword',
    value: function restorePassword(login) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        var data = {
          category: 'restorepassword'
        };

        _this5.eliteEvent(data);

        _this5.proto.request('RestorePassword', 'restore', { DeviceInfo: _this5.deviceInfo(), email: login }).then(function (result) {
          return resolve(result);
        }).catch(function (e) {
          return reject(e.ResponseStatus);
        });
      });
    }
  }, {
    key: 'getPopUp',
    value: function getPopUp() {
      var _this6 = this;

      this.proto.request('Config', 'config/payment_popup', { DeviceInfo: this.deviceInfo() }).then(function (result) {
        if (!result || !result.ResponseStatus || !result.ResponseStatus.success) return;

        if (result.PaymentPopup && result.PaymentPopup.url) _this6.popUp.payment = result.PaymentPopup.url;
        if (result.PaymentOptinTrial && result.PaymentOptinTrial.url) _this6.popUp.trial = result.PaymentOptinTrial.url;

        _this6.proto.getBase64DeviceInfo(_this6.deviceInfo()).then(function (deviceInfo) {
          _this6.popUp.deviceInfo = deviceInfo;
        });
      });
    }
  }, {
    key: 'openPopUp',
    value: function openPopUp(touchpoint, domain) {
      this.domain = domain;
      this.touchpoint = touchpoint;

      var data = {
        category: 'openpopup',
        touchpoint: this.touchpoint
      };

      this.eliteEvent(data);

      var params = 'touchpoint=' + touchpoint + '&domain=' + this.domain + '&user_co=' + sdk.user.country + (sdk.proxy.status.status === 'connected' ? '&proxy_co=' + sdk.proxy.status.location : '');

      var url = this.popUp.payment + (this.popUp.payment.indexOf('?') !== -1 ? '&' : '?') + 'pbdi=' + this.popUp.deviceInfo + '&ct=' + encodeURIComponent(params) + '&utm_source=' + sdk.config.elite.popupUtm + '&utm_medium=Free&utm_campaign=' + this.touchpoint;

      sdk.tabs.openPage(url);
    }
  }, {
    key: 'openTrialPromo',
    value: function openTrialPromo(touchpoint, domain) {
      this.domain = domain;
      this.touchpoint = touchpoint;

      var data = {
        category: 'opentrialpromo',
        touchpoint: this.touchpoint
      };

      this.eliteEvent(data);

      var params = 'touchpoint=' + touchpoint + '&domain=' + this.domain + '&user_co=' + sdk.user.country + (sdk.proxy.status.status === 'connected' ? '&proxy_co=' + sdk.proxy.status.location : '');

      var url = this.popUp.trial + '&pbdi=' + this.popUp.deviceInfo + '&ct=' + encodeURIComponent(params) + '&utm_source=' + sdk.config.elite.popupUtm + '&utm_medium=Free&utm_campaign=' + this.touchpoint;

      sdk.tabs.openPage(url);
    }
  }, {
    key: 'statusCallback',
    value: function statusCallback(status) {
      return new Promise(function (resolve) {
        sdk.user.status.token = undefined;
        sdk.user.status.elite = false;
        sdk.user.status.login = undefined;
        sdk.user.status.bnLink = false;
        sdk.user.status.authorized = false;

        if (status.token) {
          sdk.user.status.token = status.token;
        }

        if (status.UserStatus && typeof status.UserStatus.is_anonymous !== 'undefined' && !status.UserStatus.is_anonymous && status.UserStatus.login && status.UserStatus.login !== '_AFFREE_') {
          sdk.user.status.login = status.UserStatus.login;
          sdk.user.status.authorized = true;
          sdk.user.status.bnLink = false;
        }

        if (status.UserStatus && status.UserStatus.packages) {
          for (var k in status.UserStatus.packages) {
            var p = status.UserStatus.packages[k];
            if (p.is_active) {
              sdk.user.status.elite = true;
              break;
            }
          }
        }

        sdk.storage.set(DATA, sdk.user).then(function () {
          return resolve(JSON.parse(JSON.stringify(sdk.user.status)));
        });
      });
    }
  }, {
    key: 'showToPublic',
    value: function showToPublic() {
      //sdk.user.bnLink    = this.bnLink.bind(this);
      sdk.user.signUp = this.signUp.bind(this);
      sdk.user.signIn = this.signIn.bind(this);
      //sdk.user.signOut   = this.signOut.bind(this);
      sdk.user.openPopUp = this.openPopUp.bind(this);
      sdk.user.getStatus = this.getStatus.bind(this);
      sdk.user.openTrialPromo = this.openTrialPromo.bind(this);
      sdk.user.restorePassword = this.restorePassword.bind(this);
    }
  }, {
    key: 'deviceInfo',
    value: function deviceInfo() {
      var deviceInfo = {
        hash: sdk.user.hash,
        make: sdk.config.elite.deviceInfo.make,
        model: sdk.config.elite.deviceInfo.model,
        os_name: navigator.userAgent.match(/\(([^);]+)/i) ? navigator.userAgent.match(/\(([^);]+)/i)[1] : 'undefined',
        language: sdk.user.language,
        platform: sdk.config.elite.deviceInfo.platform,
        app_version: 2.0,
        package_name: sdk.config.elite.deviceInfo.package_name
      };

      if (sdk.user.status.token) {
        deviceInfo.token = sdk.user.status.token;
      }

      return deviceInfo;
    }
  }, {
    key: 'eliteEvent',
    value: function eliteEvent(data) {
      return new Promise(function (resolve) {
        try {
          var status = sdk.proxy.status;

          var event = {
            event: 'elite',
            category: data.category,
            touchpoint: data.touchpoint,
            'connection-country': status && status.status === 'connected' ? status.country : null
          };

          sdk.reporting.analytics('elite', data.category, data.touchpoint);
          sdk.reporting.internal(event).then(function () {
            return resolve();
          });
        } catch (e) {
          return resolve();
        }
      });
    }
  }]);

  return Elite;
}();

exports.default = Elite;

},{"./proto/Proto":60}],59:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Network = require('Wdgt/Network');

var _Network2 = _interopRequireDefault(_Network);

var _Elite = require('./Elite');

var _Elite2 = _interopRequireDefault(_Elite);

var _Authorization = require('./Authorization');

var _Authorization2 = _interopRequireDefault(_Authorization);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DATA = 'User.data';

var User = function () {
  function User() {
    _classCallCheck(this, User);

    this.data = sdk.storage.get(DATA);

    if (!this.data || !this.data.credentials || !this.data.credentials.prod || !this.data.credentials.old) {
      this.data = {
        status: {},
        credentials: {
          prod: {},
          debug: {},
          old: {}
        }
      };
    }

    this.hash();
    this.percent();
    this.language();
    this.country();

    sdk.user = this.data;

    if (!sdk.user.credentials.old.username) {
      sdk.user.credentials.old.username = sdk.user.hash + ".h783ohaw09jdf0";
      sdk.user.credentials.old.password = sdk.user.hash + ".h78239hd";
    }
  }

  _createClass(User, [{
    key: 'init',
    value: function init() {
      return new Promise(function (resolve) {
        new _Elite2.default().init().then(function () {
          new _Authorization2.default().init().then(function () {
            return resolve();
          });
        });
      });
    }
  }, {
    key: 'hash',
    value: function hash() {
      if (this.data.hash) return;

      this.data.hash = '';

      for (var i = 0; i < 8; i++) {
        this.data.hash += ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
      }
      this.data.hash = sdk.config.elite.prefix + this.data.hash;
    }
  }, {
    key: 'percent',
    value: function percent() {
      if (this.data.percent) return;

      this.data.percent = Number(Date.now().toString().substr(-2, 2));
    }
  }, {
    key: 'language',
    value: function language() {
      this.data.language = navigator && navigator.language ? navigator.language.replace(/-.*/, '').toLowerCase() : '';
    }
  }, {
    key: 'country',
    value: function country() {
      var _this = this;

      return new Promise(function (resolve) {
        if (_this.data.country) return resolve(true);

        _Network2.default.get(sdk.config.countryCheckUrl).then(function (response) {
          try {
            var json = JSON.parse(response);
            if (json && json.country_code) {
              _this.data.country = json.country_code.toLowerCase();
              resolve(true);
            }
          } catch (e) {
            resolve(true);
          }
        }).catch(function () {
          resolve(true);
        });
      });
    }
  }]);

  return User;
}();

exports.default = User;

},{"./Authorization":57,"./Elite":58,"Wdgt/Network":33}],60:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _protobufjs = require('protobufjs');

var _protobufjs2 = _interopRequireDefault(_protobufjs);

var _protoRequest = require('./protoRequest');

var _protoRequest2 = _interopRequireDefault(_protoRequest);

var _protoResponse = require('./protoResponse');

var _protoResponse2 = _interopRequireDefault(_protoResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Proto = function () {
  function Proto() {
    _classCallCheck(this, Proto);

    this.protoRequest = _protobufjs2.default.loadProto(_protoRequest2.default.content).build('proto.api.request');
    this.protoResponse = _protobufjs2.default.loadProto(_protoResponse2.default.content).build('proto.api.response');
  }

  _createClass(Proto, [{
    key: 'getBase64DeviceInfo',
    value: function getBase64DeviceInfo(deviceInfo) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var message = _this.protoRequest.DeviceInfo;
        var base64 = new message(deviceInfo).encode().toBase64();
        base64 = base64.replace(/\+/gi, "-").replace(/\//gi, "_").replace(/=/gi, "");
        resolve(base64);
      });
    }
  }, {
    key: 'request',
    value: function request(messageName, urlPrefix, content) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        debug('Proto request: ' + urlPrefix);
        debug(JSON.stringify(content));
        debug('-------------------------------------');
        var message = _this2.protoRequest[messageName];
        var buffer = new message(content).encode().toArrayBuffer();

        _this2.sendRequest(messageName, urlPrefix, buffer).then(function (result) {
          try {
            if (!result.ResponseStatus.success) return reject(result);
            return resolve(result);
          } catch (e) {
            return reject(result);
          }
        }).catch(function (status) {
          var result = {
            ResponseStatus: {
              success: false,
              error_code: status,
              error_message: null
            }
          };

          reject(result);
        });
      });
    }
  }, {
    key: 'response',
    value: function response(messageName, _response) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var message = _this3.protoResponse[messageName];
        var content = message.decode(_response);
        content = _this3.transformToObject(content);

        debug('Proto response:');
        debug(JSON.stringify(content));
        debug('-------------------------------------');

        resolve(content);
      });
    }
  }, {
    key: 'sendRequest',
    value: function sendRequest(messageName, urlPrefix, buffer) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('POST', sdk.config.elite.api + urlPrefix);
        request.overrideMimeType('application/octet-stream');
        request.responseType = "arraybuffer";

        request.onload = function () {
          if (request.status >= 200 && request.status < 300 && request.response) {
            this.response(messageName, request.response).then(function (result) {
              resolve(result);
            }).catch(function (e) {
              reject(200);
            });
          } else {
            reject(request.status);
          }
        }.bind(_this4);

        request.onerror = function () {
          reject(request.status);
        }.bind(_this4);

        request.send(buffer);
      });
    }
  }, {
    key: 'transformToObject',
    value: function transformToObject(message) {
      var object = {};

      for (var k in message) {
        if (typeof message[k] === 'function') {
          continue;
        }

        if (message[k] === null) {
          object[k] = message[k];
        } else if (_typeof(message[k]) === 'object') {
          object[k] = this.transformToObject(message[k]);
        } else {
          object[k] = message[k];
        }
      }

      return object;
    }
  }]);

  return Proto;
}();

exports.default = Proto;

},{"./protoRequest":61,"./protoResponse":62,"protobufjs":9}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var proto = {};

proto.content = "package proto.api.request;\nmessage DeviceInfo {\n\tenum Platform {\n\t\tIOS              = 1;\n\t\tANDROID          = 2;\n\t\tWINDOWS          = 3;\n\t\tMAC              = 4;\n\t\tEXTENSION_CHROME = 5;\n\t\tOPEN_WRT         = 6;\n\t\tEXTENSION_FFOX   = 7;\n\t}\n\n\trequired Platform platform           = 1;\n\trequired string   hash               = 2;\n\trequired string   package_name       = 3; // ex: com.example.myapp\n\trequired int32    app_version        = 4;\n\trequired string   model              = 5; // ex: iPhone 6/Galaxy S3\n\trequired string   make               = 6; // ex: Samsung/Apple/HP/etc\n\trequired string   os_name            = 7; // ex: Windows 7 build 12324\n\trequired string   language           = 8;\n\toptional string   signature          = 9;\n\toptional string   token              = 10; // authorization token. If user not authorized, must be left empty\n\toptional string   channel            = 11; // installation channel\n\toptional string   bn_proxy_device_id = 12;\n\t//optional string flavour\n}\n\nmessage Config {\n\trequired DeviceInfo DeviceInfo = 1;\n}\n\nmessage RestorePassword {\n\trequired DeviceInfo DeviceInfo = 1;\n\trequired string     email      = 2;\n}\n\nmessage Signin {\n\trequired DeviceInfo DeviceInfo = 1;\n\trequired string     login      = 2;\n\trequired string     password   = 3;\n}\n\nmessage Signout {\n\trequired DeviceInfo DeviceInfo = 1;\n}\n\nmessage Signup {\n\trequired DeviceInfo DeviceInfo = 1;\n\trequired string     email      = 2;\n\trequired string     password   = 3;\n}\n\nmessage Status {\n\trequired DeviceInfo DeviceInfo = 1;\n}\n\nmessage BNLink {\n    required DeviceInfo DeviceInfo = 1;\n    required string     email      = 2;\n}";

exports.default = proto;

},{}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var proto = {};

proto.content = "package proto.api.response;\nmessage ResponseStatus {\n\tenum Errno {\n\t\tPLATFORM_NOT_SUPPORTED  = 10;\n\t\tOPERATION_NOT_SUPPORTED = 11;\n\t\tUNAUTHORIZED            = 12;\n\t\tINVALID_INPUT           = 13;\n\t\tSERVER_INTERNAL         = 14;\n\t}\n\n\trequired bool   success       = 1;\n\toptional uint32 error_code    = 2;\n\toptional string error_message = 3;\n\toptional string debug         = 4;\n}\n\nmessage Package {\n\tenum Id {\n\t\tELITE              = 1;\n\t\tDEDICATED          = 10;\n\t\tTURBO              = 11;\n\t\tTRIAL              = 15;\n\t\tADS                = 13;\n\t\tVIRTUAL_LOCATION   = 12;\n\t\tFIVE_EXTRA_DEVICES = 18;\n\t\tTRIALWARE          = 19;\n\t}\n\n\trequired Id      id              = 1;\n\toptional bool    is_active       = 2;\n\toptional uint64  expiration_date = 3;\n\toptional bool    is_lifetime     = 4;\n}\n\nmessage Timestamp {\n  optional int64 seconds = 1;\n  optional int32 nanos = 2;\n}\n\nmessage TimeRange {\n\toptional Timestamp start = 1;\n\toptional Timestamp end   = 2;\n}\n\nmessage UserStatus {\n\trepeated Package.Id packages_list = 1;\n\trepeated Package    packages      = 2;\n\n\toptional string login        = 3;\n\toptional uint32 devices_max  = 4;\n\toptional uint32 devices_used = 5;\n\toptional bool   is_anonymous = 6;\n\toptional TimeRange trial_period = 7;\n}\n\nmessage PaymentPopup {\n\tenum Type {\n\t\tPOPUP = 1;\n\t\tPAGE  = 2;\n\t}\n\n\trequired string url            = 1;\n\trequired uint32 width          = 2;\n\trequired uint32 height         = 3;\n\trequired uint32 corners_radius = 4;\n  required Type   type           = 5;\n}\n\nmessage Config {\n\trequired ResponseStatus ResponseStatus    = 1;\n\toptional PaymentPopup   PaymentPopup      = 2;\n\toptional PaymentPopup   PaymentOptinTrial = 3;\n}\n\nmessage Error {\n\trequired ResponseStatus ResponseStatus = 1;\n}\n\nmessage RestorePassword {\n\trequired ResponseStatus ResponseStatus = 1;\n}\n\nmessage Signin {\n\trequired ResponseStatus ResponseStatus = 1;\n\toptional UserStatus     UserStatus     = 2;\n\toptional string         token          = 3;\n}\n\nmessage Signout {\n\trequired ResponseStatus ResponseStatus = 1;\n\toptional UserStatus     UserStatus     = 2;\n\toptional string         token          = 3;\n}\n\nmessage Signup {\n\trequired ResponseStatus ResponseStatus = 1;\n\toptional UserStatus     UserStatus     = 2;\n\toptional string         token          = 3;\n}\n\nmessage Status {\n\trequired ResponseStatus ResponseStatus = 1;\n\toptional UserStatus     UserStatus     = 2;\n\toptional string         token          = 3;\n\toptional string         client_cache   = 4;\n}\n\nmessage BNLink {\n    enum LinkStatus {\n        ACCEPTED    = 202;\n        NO_CONTENT  = 204;\n        BAD_REQUEST = 400;\n        CONFLICT    = 409;\n        LOCKED      = 423;\n    }\n\n    required ResponseStatus ResponseStatus = 1;\n    optional LinkStatus link_status = 2;\n}";

exports.default = proto;

},{}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Debug = function Debug() {
  _classCallCheck(this, Debug);

  window.log = function () {};
  window.debug = function () {};
  window.error = function () {};

  if (sdk.config.debug) {
    window.log = console.log;
    window.debug = console.debug;
    window.error = console.error;
  }
};

exports.default = Debug;

},{}],64:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Network = function () {
  function Network() {
    _classCallCheck(this, Network);
  }

  _createClass(Network, null, [{
    key: 'get',
    value: function get(url, timeout) {
      return Network.request(url, 'GET', false, timeout);
    }
  }, {
    key: 'post',
    value: function post(url, body, timeout) {
      return Network.request(url, 'POST', body, timeout);
    }
  }, {
    key: 'request',
    value: function request(url, method, body, timeout) {
      timeout = timeout ? timeout : 60000;

      return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open(method, url);

        if (method === 'POST') {
          request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        request.onload = function () {
          if (request.status >= 200 && request.status < 300) {
            resolve(request.responseText);
          } else {
            reject();
          }
        };

        request.onerror = function (e) {
          reject(e);
        };

        request.timeout = timeout;

        request.ontimeout = function (e) {
          reject(e);
        };

        request.send(body);
      });
    }
  }]);

  return Network;
}();

exports.default = Network;

},{}],65:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PANEL_LOADED = 'Panel.loaded';
var PANEL_ANIMATED = 'Panel.animated';

var STORAGE_ERROR = 'Storage.error';
var TOOLTIPS_SHOWED = 'Panel.tooltipsShowed';

var Storage = function () {
  function Storage() {
    _classCallCheck(this, Storage);

    this.data = {};
  }

  _createClass(Storage, [{
    key: 'init',
    value: function init() {
      var _this = this;

      return new Promise(function (resolve) {
        sdk.storage = {};

        sdk.storage.get = _this.get.bind(_this);
        sdk.storage.set = _this.set.bind(_this);
        sdk.storage.print = function () {
          log(_this.data);
        };
        sdk.storage.clean = function () {
          browser.storage.local.clear();location.reload();
        };

        try {
          browser.storage.local.get(null, function (data) {
            debug(data);

            _this.data = data;
            _this.data[PANEL_LOADED] = false;
            _this.data[PANEL_ANIMATED] = false;

            resolve();
          });
        } catch (e) {
          _this.data = {};
          _this.data[PANEL_LOADED] = false;
          _this.data[PANEL_ANIMATED] = false;
          _this.data[STORAGE_ERROR] = true;
          _this.data[TOOLTIPS_SHOWED] = true;

          resolve();
        }
      });
    }
  }, {
    key: 'get',
    value: function get(key) {
      if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
        var result = [];
        for (var k in key) {
          result.push(this.data[key[k]]);
        }

        return result;
      }

      return this.data[key];
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      this.data[key] = this.clone(value);
      if (!value) {

        return new Promise(function (resolve) {
          try {
            browser.storage.local.remove(key, function () {
              resolve();
            });
          } catch (e) {
            resolve();
          }
        });
      }

      return new Promise(function (resolve) {
        try {
          browser.storage.local.set(_defineProperty({}, key, value), function () {
            resolve();
          });
        } catch (e) {
          resolve();
        }
      });
    }
  }, {
    key: 'clone',
    value: function clone(value) {
      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') return value;
      return JSON.parse(JSON.stringify(value));
    }
  }]);

  return Storage;
}();

exports.default = Storage;

},{}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Signal = require('Wdgt/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FAVICONS = 'Tabs.favicons';

var Tabs = function () {
  function Tabs() {
    _classCallCheck(this, Tabs);

    this.data = {
      tabs: [],
      active: {
        id: undefined,
        domain: undefined,
        title: undefined
      }
    };

    this.favicons = sdk.storage.get(FAVICONS) ? sdk.storage.get(FAVICONS) : {};

    this.createSignals();
  }

  _createClass(Tabs, [{
    key: 'init',
    value: function init() {
      var _this = this;

      return this.updateList().then(function () {
        _this.pageView();
        _this.listeners();

        sdk.tabs = {
          active: _this.data.active,
          openPage: _this.openPage.bind(_this),
          getDomain: _this.getDomain.bind(_this),
          addFavicon: _this.addFavicon.bind(_this),
          getFavicon: _this.getFavicon.bind(_this),
          getByTabId: _this.getByTabId.bind(_this),
          getActiveTab: _this.getActiveTab.bind(_this),
          getByWindowId: _this.getByWindowId.bind(_this),
          onPageView: _this.onPageView,
          onTabChanged: _this.onTabChanged,
          onDomainChanged: _this.onDomainChanged
        };
      });
    }
  }, {
    key: 'listeners',
    value: function listeners() {
      browser.tabs.onRemoved.addListener(this.updateList.bind(this));
      browser.tabs.onDetached.addListener(this.updateList.bind(this));
      browser.tabs.onReplaced.addListener(this.updateList.bind(this));
      browser.tabs.onActivated.addListener(this.updateList.bind(this));
    }
  }, {
    key: 'updateList',
    value: function updateList() {
      var _this2 = this;

      return new Promise(function (resolve) {
        browser.tabs.query({}, function (tabs) {
          _this2.data.tabs = [];
          for (var k in tabs) {
            if (!tabs[k] || !tabs[k].url || !tabs[k].url.match(/^https?/)) continue;

            var record = _this2.createRecord(tabs[k]);
            if (record) _this2.data.tabs.push(record);
          }

          _this2.getActiveTab().then(function (activeTab) {
            var old = {
              id: _this2.data.active.id,
              domain: _this2.data.active.domain,
              title: _this2.data.active.title
            };

            _this2.data.active.id = activeTab.id;
            _this2.data.active.domain = activeTab.domain;
            _this2.data.active.title = activeTab.title;

            if (old.id && old.id !== activeTab.id) {
              _this2.onTabChanged.dispatch(activeTab);
            } else if (old.id && old.domain !== activeTab.domain) {
              _this2.onDomainChanged.dispatch(activeTab);
            }

            return resolve();
          });
        });
      });
    }
  }, {
    key: 'addFavicon',
    value: function addFavicon(domain, url) {
      if (!this.favicons[domain]) this.favicons[domain] = url;
      sdk.storage.set(FAVICONS, this.favicons);
    }
  }, {
    key: 'getFavicon',
    value: function getFavicon(domain) {
      return this.favicons[domain] ? this.favicons[domain] : undefined;
    }
  }, {
    key: 'getActiveTab',
    value: function getActiveTab() {
      var _this3 = this;

      return new Promise(function (resolve) {
        browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          if (tabs && tabs[0]) return resolve(_this3.createRecord(tabs[0]));

          browser.tabs.query({ active: true }, function (tabs) {
            if (tabs && tabs[0]) return resolve(_this3.createRecord(tabs[0]));

            return resolve({ id: undefined, domain: undefined, title: undefined });
          });
        });
      });
    }
  }, {
    key: 'getByTabId',
    value: function getByTabId(id) {
      if (!id || typeof id !== 'number') return false;

      for (var k in this.data.tabs) {
        var tab = this.data.tabs[k];
        if (tab.id === id) return tab;
      }

      return false;
    }
  }, {
    key: 'getByWindowId',
    value: function getByWindowId(id) {
      if (!id || typeof id !== 'number') return false;

      for (var k in this.data.tabs) {
        var tab = this.data.tabs[k];
        if (tab.windowId === id) return tab;
      }

      return false;
    }
  }, {
    key: 'createRecord',
    value: function createRecord(tab) {
      if (!tab) return undefined;

      var record = {
        id: tab.id,
        url: tab.url,
        title: tab.title,
        domain: this.getDomain(tab.url),
        windowId: tab.windowId
      };

      if (tab.favIconUrl) this.addFavicon(record.domain, tab.favIconUrl);

      return record;
    }
  }, {
    key: 'createSignals',
    value: function createSignals() {
      this.onPageView = new _Signal2.default();
      this.onTabChanged = new _Signal2.default();
      this.onDomainChanged = new _Signal2.default();
    }
  }, {
    key: 'getDomain',
    value: function getDomain(url) {
      if (!url) return undefined;

      var parsed = url.toLowerCase().match(/^[^:]+:\/\/(www\.)?([^?/\\]+)/);
      if (!parsed || !parsed[2]) return undefined;

      return parsed[2];
    }
  }, {
    key: 'pageView',
    value: function pageView() {
      var _this4 = this;

      browser.webRequest.onResponseStarted.addListener(function (details) {
        if (!details || details.tabId === -1 || details.type !== 'main_frame') return;

        var domain = _this4.getDomain(details.url);
        if (!domain) return;

        _this4.updateList().then(function () {
          _this4.onPageView.dispatch({ domain: domain });
        });
      }, { urls: ["http://*/*", "https://*/*"] }, ["responseHeaders"]);
    }
  }, {
    key: 'openPage',
    value: function openPage(url, parameters) {
      return new Promise(function (resolve) {
        parameters = parameters || {};

        if (parameters.mode === 'popup') {
          var width = parameters.width || 580;
          var height = parameters.height || 600;
          var left = screen.width / 2 - width / 2;
          var top = screen.height / 2 - height / 2;

          browser.windows.create({
            url: url,
            width: Math.round(width),
            height: Math.round(height),
            left: Math.round(left),
            top: Math.round(top),
            focused: true,
            type: 'popup'
          }, function (window) {
            resolve(window.tabs[0]);
          });
          return;
        }

        browser.tabs.create({ url: url }, function (tab) {
          resolve(tab);
        });
      });
    }
  }]);

  return Tabs;
}();

exports.default = Tabs;

},{"Wdgt/Signal":34}],67:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebRTC = function () {
  function WebRTC() {
    var _this = this;

    _classCallCheck(this, WebRTC);

    browser.privacy.network.webRTCIPHandlingPolicy.get({}, function (response) {
      if (response && response.value === 'disable_non_proxied_udp') _this.status = 'on';else _this.status = 'off';
    });
  }

  _createClass(WebRTC, [{
    key: 'getStatus',
    value: function getStatus() {
      return this.status;
    }
  }, {
    key: 'setStatus',
    value: function setStatus(status) {
      if (['on', 'off', 'disabled'].indexOf(status) === -1) return;
      this.status = status;
      if (this.status === 'on') return this.enable();else return this.disable();
    }
  }, {
    key: 'enable',
    value: function enable() {
      return new Promise(function (resolve) {
        browser.privacy.network.webRTCIPHandlingPolicy.set({ value: 'disable_non_proxied_udp' }, function () {
          return resolve();
        });
      });
    }
  }, {
    key: 'disable',
    value: function disable() {
      return new Promise(function (resolve) {
        browser.privacy.network.webRTCIPHandlingPolicy.set({ value: 'default_public_and_private_interfaces' }, function () {
          return resolve();
        });
      });
    }
  }]);

  return WebRTC;
}();

exports.default = WebRTC;

},{}],68:[function(require,module,exports){
'use strict';

var _background = require('shared/background');

var _background2 = _interopRequireDefault(_background);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

try {
  var background = function (_CoreBackground) {
    _inherits(background, _CoreBackground);

    function background() {
      _classCallCheck(this, background);

      return _possibleConstructorReturn(this, (background.__proto__ || Object.getPrototypeOf(background)).call(this));
    }

    return background;
  }(_background2.default);

  new background();
} catch (e) {
  console.log('CRITICAL ERROR');
  console.log(e);
}

},{"shared/background":75}],69:[function(require,module,exports){
'use strict';

sdk.config = {
  browser: 'Chrome',
  debug: false,
  application: {
    id: 'hotspot-shield-chrome',
    name: 'hotspot-shield',
    version: browser.runtime.getManifest().version,
    dotVersion: Number(browser.runtime.getManifest().version.replace(/\.([0-9]+)$/, '$1')),
    applicationId: browser.runtime.id
  },

  authorization: {
    carrier: 'hss',
    platform: 'chrome'
  },

  protocolPrefix: 'chrome-extension',

  configs: {
    free: 'https://s3-us-west-2.amazonaws.com/hssext/hss-free.json',
    elite: 'https://s3-us-west-2.amazonaws.com/hssext/hss-elite.json'
  },

  countryCheckUrl: "https://www.hsselite.com/ipinfo",

  elite: {
    api: "https://api.hsselite.com/1/plain/",
    enabled: true,
    prefix: 'HC',
    popupUtm: 'hss_ChromeExtension',

    deviceInfo: {
      make: navigator.userAgent.match(/Chrom(e|ium)/g) ? navigator.userAgent.match(/Chrom(e|ium)/g)[0] : 'undefined',
      model: 'Chrome',
      platform: 5,
      package_name: 'com.anchorfree.extchrome'
    }
  },

  proxy: {
    connecting: {
      enabled: true,
      delay: 3.5
    },
    disconnecting: {
      enabled: true,
      delay: 1.8
    }
  },

  reporting: {
    analytics: {
      id: 'UA-114461737-1',
      sampling: {
        elite: 100,
        click: 100,
        bypass: 100,
        secured: 100,
        malware: 100,
        connection: 100,
        application: 100,
        contentWall: 100,
        SpeedMonitoring: 100,
        default: 10
      },
      interval: 20 * 60 * 60 * 1000,
      noPrefix: true
    }
  },

  promo: {
    rateUs: {
      delay: 20 * 60 * 1000,
      interval: 604800 * 1000
    },
    trial: {
      delay: 0,
      interval: 86400 * 1000,
      limit: 10
    }
  },

  uninstallUrl: "https://www.hotspotshield.com/vpn/vpn-for-chrome/uninstall/"
};

sdk.config.installUrl = "chrome-extension://" + sdk.config.application.applicationId + "/pages/welcome.html";
sdk.config.promo.rateUs.url = "https://chrome.google.com/webstore/detail/hotspot-shield-vpn-free-p/" + sdk.config.application.applicationId + "?hl=en-US";

},{}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DOMAINS = ["xvideos.com", "pornolab.net", "nudevista.com", "bet365.com", "youporn.com", "myfreecams.com", "planetromeo.com", "youjizz.com", "spankbang.com", "txxx.com", "new.livejasmin.com", "xonline.vip", "porntube.com", "vporn.com", "video-one.com", "creatives.livejasmin.com", "alohatube.com", "4tube.com", "avnori.com", "porn.com", "tnaflix.com", "tube8.com", "eporner.com", "hclips.com", "gotporn.com", "brazzers.com", "ashemaletube.com", "pron.tv", "fetlife.com", "xpcams.com", "hqporner.com", "pornhd.com", "cam4.es", "bongacams.com", "whoer.net", "proxy-nl.hide.me", "href.li", "hiload.com", "hola.org", "manhunt.net", "privatecams.com", "manjam.com"];

var TIMER = 'ContentWall.timer';
var DISCONNECTED = 'ContentWall.disconnected';

var ContentWall = function () {
  function ContentWall() {
    _classCallCheck(this, ContentWall);

    this.timer = sdk.storage.get(TIMER) ? sdk.storage.get(TIMER) : 0;
    this.limit = sdk.storage.get(DISCONNECTED) ? 30 : 120;
  }

  _createClass(ContentWall, [{
    key: "handleRequest",
    value: function handleRequest(request) {
      var _this = this;

      return new Promise(function (resolve) {
        switch (request.method) {
          case 'shouldShow':
            return resolve(_this.shouldShow(request));
          case 'increase':
            return resolve(_this.increase());
          case 'disconnect':
            return resolve(_this.disconnect(request));
          case 'open':
            return resolve(_this.openPopUp(request));
        }
      });
    }
  }, {
    key: "shouldShow",
    value: function shouldShow(request) {
      if (!request.message || !request.message.domain || DOMAINS.indexOf(request.message.domain) === -1 || sdk.user.status.elite) return false;

      var domain = request.message.domain;

      if (!sdk.proxy.bypass.isInList(domain) && (sdk.proxy.secured.isInList(domain) || sdk.proxy.status.status === 'connected')) {
        sdk.reporting.report('contentWall', 'show', domain);
        return { limit: this.limit, timer: this.timer };
      }

      return false;
    }
  }, {
    key: "disconnect",
    value: function disconnect(request) {
      if (!request.message || !request.message.domain || DOMAINS.indexOf(request.message.domain) === -1) return false;

      var domain = request.message.domain;

      if (sdk.proxy.secured.isInList(domain)) {
        sdk.proxy.secured.remove(domain);
      }

      this.timer = 0;
      this.limit = 30;

      sdk.storage.set(DISCONNECTED, true);
      sdk.storage.set(TIMER, this.timer);

      sdk.reporting.report('contentWall', 'disconnect', domain);
      sdk.reporting.report('bypass', 'addCw', domain).then(function () {
        sdk.proxy.bypass.add(domain);
      });
    }
  }, {
    key: "increase",
    value: function increase() {
      sdk.storage.set(TIMER, ++this.timer);
    }
  }, {
    key: "openPopUp",
    value: function openPopUp(request) {
      sdk.reporting.report('contentWall', 'popup', sdk.tabs.active.domain);
      sdk.user.openPopUp('contentWall', request.message && request.message.domain ? request.message.domain : undefined);
    }
  }]);

  return ContentWall;
}();

exports.default = ContentWall;

},{}],71:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NEXT_PROMO = 'DesktopMessages.nextPromoMessage';
var WHAT_CONNECT = 'DesktopMessages.whatConnect';

var DesktopMessages = function () {
  function DesktopMessages() {
    var _this = this;

    _classCallCheck(this, DesktopMessages);

    sdk.proxy.onProxyError.add(this.proxyError.bind(this));
    sdk.proxy.onStatusChanged.add(this.proxyStatusChanged.bind(this));

    browser.notifications.onClosed.addListener(function (id) {
      var type = _this.checkType(id);
      if (!type) return;

      sdk.reporting.report('message', type, 'closed');
    });

    browser.notifications.onButtonClicked.addListener(function (id, buttonId) {
      var type = _this.checkType(id);
      if (!type) return;

      if (buttonId === 1) {
        browser.notifications.clear(id, function () {
          sdk.reporting.report('message', type, 'buttonClose');
        });
      } else if (buttonId === 0 && type === 'error') {
        browser.notifications.clear(id, function () {
          sdk.reporting.report('message', type, 'buttonDownload');
          if (navigator.platform.indexOf('Mac') !== -1) window.open('https://control.kochava.com/v1/cpi/click?campaign_id=kohotspot-shield-e1z5meb8bd0bc517b5d1&network_id=7450&site_id=1&device_id=device_id');else window.open('https://control.kochava.com/v1/cpi/click?campaign_id=kohotspot-shield-2oo5a539acac1e6b0f&network_id=7450&site_id=1&device_id=device_id');
        });
      } else if (buttonId === 0 && type === 'promo') {
        browser.notifications.clear(id, function () {
          sdk.reporting.report('message', type, 'buttonDownload');
          if (navigator.platform.indexOf('Mac') !== -1) window.open('https://control.kochava.com/v1/cpi/click?campaign_id=kohotspot-shield-e1z5meb8bd0bc517b5d1&network_id=7450&site_id=1&device_id=device_id');else window.open('https://control.kochava.com/v1/cpi/click?campaign_id=kohotspot-shield-2oo5a539acac1e6b0f&network_id=7450&site_id=1&device_id=device_id');
        });
      } else if (buttonId === 0 && type === 'update') {
        browser.notifications.clear(id, function () {});
      }
    });
  }

  _createClass(DesktopMessages, [{
    key: 'proxyStatusChanged',
    value: function proxyStatusChanged(event) {
      var _this2 = this;

      if (!event || !event.status || event.status !== 'connected') return;

      var connect = sdk.storage.get(WHAT_CONNECT) ? sdk.storage.get(WHAT_CONNECT) : 0;
      connect++;
      sdk.storage.set(WHAT_CONNECT, connect);
      if (connect < 2) {
        return;
      }

      setTimeout(function () {
        _this2.showProxyStatusMessage();
      }, 15000);
    }
  }, {
    key: 'showProxyStatusMessage',
    value: function showProxyStatusMessage() {
      var nextPromoMessage = sdk.storage.get(NEXT_PROMO) ? sdk.storage.get(NEXT_PROMO) : 0;

      if (nextPromoMessage >= Date.now()) return;

      browser.notifications.create('promoMessage' + Date.now(), {
        type: 'image',
        title: 'Try our Desktop VPN Client',
        iconUrl: '/static/assets/messages/logo.svg',
        imageUrl: '/static/assets/messages/block.png',
        message: 'Protect your entire internet connection, not just browser',
        requireInteraction: true,
        buttons: [{ title: 'Start Free Download' }, { title: 'Next time' }]
      }, function () {
        sdk.reporting.report('message', 'promo', 'showed');
        sdk.storage.set(NEXT_PROMO, Date.now() + 7 * 24 * 60 * 60 * 1000);
      });
    }
  }, {
    key: 'proxyError',
    value: function proxyError(action) {
      if (action !== 'disconnect') return;

      browser.notifications.create('errorMessage' + Date.now(), {
        type: 'basic',
        title: 'Connection alert',
        iconUrl: '/static/assets/messages/warning.png',
        message: 'We are having troubles. Download Hotspot Shield to get secure and unrestricted access',
        requireInteraction: true,
        buttons: [{ title: 'Fix Connection' }, { title: 'Close' }]
      }, function () {
        sdk.reporting.report('message', 'error', 'showed');
      });
    }
  }, {
    key: 'checkType',
    value: function checkType(id) {
      var name = id.match(/^([a-z]+)Message/);
      if (!name || !name[1]) return undefined;

      switch (name[1]) {
        case 'error':
          return 'error';
        case 'promo':
          return 'promo';
        case 'update':
          return 'update';
        default:
          return undefined;
      }
    }
  }]);

  return DesktopMessages;
}();

exports.default = DesktopMessages;

},{}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IconController = function () {
  function IconController() {
    _classCallCheck(this, IconController);

    this.setIcon();

    sdk.tabs.onPageView.add(this.setIcon.bind(this));
    sdk.tabs.onTabChanged.add(this.setIcon.bind(this));
    sdk.proxy.onStatusChanged.add(this.setIcon.bind(this));
    sdk.proxy.bypass.onChange.add(this.setIcon.bind(this));
    sdk.proxy.secured.onChange.add(this.setIcon.bind(this));
    sdk.proxy.onGlobalStatusChanged.add(this.setIcon.bind(this));
  }

  _createClass(IconController, [{
    key: 'setIcon',
    value: function setIcon() {
      var domain = sdk.tabs.active.domain,
          status = sdk.proxy.status.status,
          icon = void 0;

      if (sdk.proxy.getGlobalStatus() === 'unavailable') {
        icon = 'unavailable';
      } else if (sdk.proxy.getGlobalStatus() === 'desktop') {
        icon = 'connected';
      } else if (sdk.proxy.bypass.isInList(domain) && status !== 'disconnected') {
        icon = 'bypass';
      } else if (['connecting', 'disconnecting'].indexOf(status) !== -1) {
        icon = 'connecting';
      } else if (status === 'connected') {
        icon = 'connected';
      } else if (sdk.proxy.secured.isInList(domain)) {
        icon = 'secured';
      } else {
        icon = status;
      }

      browser.browserAction.setIcon({
        path: {
          "19": "/static/assets/icons/status/" + icon + ".png",
          "38": "/static/assets/icons/status/" + icon + ".png"
        }
      });
    }
  }]);

  return IconController;
}();

exports.default = IconController;

},{}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ContentWall = require('../ContentWall');

var _ContentWall2 = _interopRequireDefault(_ContentWall);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Messaging = function () {
  function Messaging() {
    var _this = this;

    _classCallCheck(this, Messaging);

    this.contentWall = new _ContentWall2.default();

    browser.runtime.onMessage.addListener(function (request, sender, callback) {
      _this.handleRequest(request, callback);

      return true;
    });
  }

  _createClass(Messaging, [{
    key: 'handleRequest',
    value: function handleRequest(request, callback) {
      if (!request || !request.from || !request.method) return;

      if (request.from === 'ContentWall') {
        this.contentWall.handleRequest(request).then(function (result) {
          callback(result);
        });
      } else if (request.from === 'AdBlocker') {
        callback(sdk.adBlocker.getDomRules());
      }
    }
  }]);

  return Messaging;
}();

exports.default = Messaging;

},{"../ContentWall":70}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sword = require('common/Sword');

var _Sword2 = _interopRequireDefault(_Sword);

var _WebRTC = require('common/WebRTC');

var _WebRTC2 = _interopRequireDefault(_WebRTC);

var _AdBlocker = require('common/AdBlocker');

var _AdBlocker2 = _interopRequireDefault(_AdBlocker);

var _DnsPrefetch = require('common/DnsPrefetch');

var _DnsPrefetch2 = _interopRequireDefault(_DnsPrefetch);

var _SitesCounter = require('common/SitesCounter');

var _SitesCounter2 = _interopRequireDefault(_SitesCounter);

var _MalwareBlocker = require('common/MalwareBlocker');

var _MalwareBlocker2 = _interopRequireDefault(_MalwareBlocker);

var _TrackerBlocker = require('common/TrackerBlocker');

var _TrackerBlocker2 = _interopRequireDefault(_TrackerBlocker);

var _CookiesBlocker = require('common/CookiesBlocker');

var _CookiesBlocker2 = _interopRequireDefault(_CookiesBlocker);

var _BandwidthCounter = require('common/BandwidthCounter');

var _BandwidthCounter2 = _interopRequireDefault(_BandwidthCounter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RequestMonitoring = function () {
  function RequestMonitoring() {
    _classCallCheck(this, RequestMonitoring);

    this.sword = new _Sword2.default();
    this.webRTC = new _WebRTC2.default();
    this.adBlocker = new _AdBlocker2.default();
    this.dnsPrefetch = new _DnsPrefetch2.default();
    this.sitesCounter = new _SitesCounter2.default();
    this.malwareBlocker = new _MalwareBlocker2.default();
    this.trackerBlocker = new _TrackerBlocker2.default();
    this.cookiesBlocker = new _CookiesBlocker2.default();
    this.bandwidthCounter = new _BandwidthCounter2.default();

    sdk.sitesCounter = this.sitesCounter.getCounter.bind(this.sitesCounter);
    sdk.bandwidthCounter = this.bandwidthCounter.getCounter.bind(this.bandwidthCounter);

    sdk.cookiesBlocker = {
      getStatus: this.cookiesBlocker.getStatus.bind(this.cookiesBlocker),
      setStatus: this.cookiesBlocker.setStatus.bind(this.cookiesBlocker),
      getCounter: this.cookiesBlocker.getCounter.bind(this.cookiesBlocker)
    };
    sdk.adBlocker = {
      setStatus: this.adBlocker.setStatus.bind(this.adBlocker),
      getStatus: this.adBlocker.getStatus.bind(this.adBlocker),
      getCounter: this.adBlocker.getCounter.bind(this.adBlocker),
      getDomRules: this.adBlocker.getDomRules.bind(this.adBlocker)
    };
    sdk.trackerBlocker = {
      setStatus: this.trackerBlocker.setStatus.bind(this.trackerBlocker),
      getStatus: this.trackerBlocker.getStatus.bind(this.trackerBlocker),
      getCounter: this.trackerBlocker.getCounter.bind(this.trackerBlocker)
    };
    sdk.malwareBlocker = {
      setStatus: this.malwareBlocker.setStatus.bind(this.malwareBlocker),
      getStatus: this.malwareBlocker.getStatus.bind(this.malwareBlocker),
      getCounter: this.malwareBlocker.getCounter.bind(this.malwareBlocker),
      proceed: this.malwareBlocker.proceed.bind(this.malwareBlocker)
    };
    sdk.webRTC = {
      setStatus: this.webRTC.setStatus.bind(this.webRTC),
      getStatus: this.webRTC.getStatus.bind(this.webRTC)
    };
    sdk.sword = {
      message: this.sword.message.bind(this.sword),
      getList: this.sword.getList.bind(this.sword),
      setStatus: this.sword.setStatus.bind(this.sword),
      getStatus: this.sword.getStatus.bind(this.sword),
      addToList: this.sword.addToList.bind(this.sword),
      removeFromList: this.sword.removeFromList.bind(this.sword)
    };

    this.onBeforeRequest();
    this.onHeadersRecived();
    this.onBeforeSendHeaders();
  }

  _createClass(RequestMonitoring, [{
    key: 'onBeforeRequest',
    value: function onBeforeRequest() {
      var _this = this;

      browser.webRequest.onBeforeRequest.addListener(function (details) {
        if (details.tabId === -1 || !_this.isConnected(details.tabId)) return;
        var start = Date.now();

        var check = _this.sword.onBeforeRequest(details);
        if (check) {
          debug('Sword redirect: ' + (Date.now() - start) + ' ' + check);
          return { redirectUrl: check };
        }

        start = Date.now();
        var domain = sdk.tabs.getDomain(details.url);
        if (_this.malwareBlocker.check(domain)) {
          if (details.type === 'main_frame') {
            debug('malwareBlocker redirect: ' + (Date.now() - start) + ' ' + details.url);
            sdk.reporting.report('malware', 'blocked', domain);
            return { redirectUrl: sdk.config.protocolPrefix + '://' + sdk.config.application.applicationId + '/pages/blocked.html?url=' + escape(details.url) };
          }
          sdk.reporting.report('malware', 'canceled', domain);
          debug('malwareBlocker cancel: ' + (Date.now() - start) + ' ' + details.url);
          return { cancel: true };
        }

        start = Date.now();
        if (_this.trackerBlocker.check(domain)) {
          debug('trackerBlocker: ' + (Date.now() - start) + ' ' + details.url);
          return { cancel: true };
        }
      }, { urls: ["http://*/*", "https://*/*"] }, ["blocking", "requestBody"]);
    }
  }, {
    key: 'onBeforeSendHeaders',
    value: function onBeforeSendHeaders() {
      var _this2 = this;

      browser.webRequest.onBeforeSendHeaders.addListener(function (details) {
        if (details.tabId === -1 || !_this2.isConnected(details.tabId)) return;

        var start = Date.now();
        if (_this2.adBlocker.check(details)) {
          debug('AdBlocker: ' + (Date.now() - start) + ' ' + details.url);
          return { cancel: true };
        }

        start = Date.now();
        var header = _this2.sword.onBeforeSendHeaders(details);
        if (header) {
          debug('Sword modify headers: ' + (Date.now() - start) + ' ' + details.url);
        }

        return { "requestHeaders": _this2.cookiesBlocker.check(details.requestHeaders) };
      }, { urls: ["http://*/*", "https://*/*"] }, ["blocking", "requestHeaders"]);
    }
  }, {
    key: 'onHeadersRecived',
    value: function onHeadersRecived() {
      var _this3 = this;

      browser.webRequest.onHeadersReceived.addListener(function (details) {
        if (details.tabId === -1 || !_this3.isConnected(details.tabId)) return;

        _this3.bandwidthCounter.count(details.responseHeaders);

        var check = _this3.sword.onHeadersReceived(details);
        if (check) {
          return { responseHeaders: check };
        }
      }, { urls: ["<all_urls>"] }, ["blocking", "responseHeaders"]);
    }
  }, {
    key: 'isConnected',
    value: function isConnected(id) {
      if (!id) return false;

      var tab = sdk.tabs.getByTabId(id);
      if (!tab) return false;

      if (sdk.proxy.bypass.isInList(tab.domain)) return false;else if (sdk.proxy.secured.isInList(tab.domain)) return true;else if (sdk.proxy.status.status === 'connected') return true;

      return false;
    }
  }]);

  return RequestMonitoring;
}();

exports.default = RequestMonitoring;

},{"common/AdBlocker":10,"common/BandwidthCounter":11,"common/CookiesBlocker":12,"common/DnsPrefetch":13,"common/MalwareBlocker":14,"common/SitesCounter":28,"common/Sword":29,"common/TrackerBlocker":30,"common/WebRTC":37}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('common/SDK');

require('config');

var _Debug = require('Wdgt/Debug');

var _Debug2 = _interopRequireDefault(_Debug);

var _User = require('common/User');

var _User2 = _interopRequireDefault(_User);

var _Tabs = require('Wdgt/Tabs');

var _Tabs2 = _interopRequireDefault(_Tabs);

var _Proxy = require('common/Proxy');

var _Proxy2 = _interopRequireDefault(_Proxy);

var _Storage = require('Wdgt/Storage');

var _Storage2 = _interopRequireDefault(_Storage);

var _Messaging = require('./Messaging');

var _Messaging2 = _interopRequireDefault(_Messaging);

var _Reporting = require('common/Reporting');

var _Reporting2 = _interopRequireDefault(_Reporting);

var _Monitoring = require('common/Monitoring');

var _Monitoring2 = _interopRequireDefault(_Monitoring);

var _IconController = require('./IconController');

var _IconController2 = _interopRequireDefault(_IconController);

var _RequestMonitoring = require('./RequestMonitoring');

var _RequestMonitoring2 = _interopRequireDefault(_RequestMonitoring);

var _DesktopMessages = require('./DesktopMessages');

var _DesktopMessages2 = _interopRequireDefault(_DesktopMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var background = function () {
  function background() {
    _classCallCheck(this, background);

    this.init();
  }

  _createClass(background, [{
    key: 'init',
    value: function init() {
      new _Debug2.default();
      new _Storage2.default().init().then(function () {
        new _Tabs2.default().init().then(function () {
          new _User2.default().init().then(function () {
            new _Reporting2.default().init().then(function () {
              new _Proxy2.default();
              new _Messaging2.default();
              new _Monitoring2.default();
              new _IconController2.default();
              new _DesktopMessages2.default();
              new _RequestMonitoring2.default();
              sdk.loading.loaded = true;
            });
          });
        });
      });
    }
  }]);

  return background;
}();

exports.default = background;

},{"./DesktopMessages":71,"./IconController":72,"./Messaging":73,"./RequestMonitoring":74,"Wdgt/Debug":32,"Wdgt/Storage":35,"Wdgt/Tabs":36,"common/Monitoring":15,"common/Proxy":25,"common/Reporting":26,"common/SDK":27,"common/User":31,"config":69}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = { "free": [{ "address": "ovh-ex-ca-1.northghost.com", "country": "ca", "name": "ovh-ex-ca-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "ovh-ex-ca-2.northghost.com", "country": "ca", "name": "ovh-ex-ca-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "ovh-ex-ca-3.northghost.com", "country": "ca", "name": "ovh-ex-ca-3.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "ovh-ex-fr-2.northghost.com", "country": "fr", "name": "ovh-ex-fr-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "FR Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "ovh-ex-fr-3.northghost.com", "country": "fr", "name": "ovh-ex-fr-3.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "FR Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-1.northghost.com", "country": "ca", "name": "do-ex-ca-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-2.northghost.com", "country": "ca", "name": "do-ex-ca-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-3.northghost.com", "country": "ca", "name": "do-ex-ca-3.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-4.northghost.com", "country": "ca", "name": "do-ex-ca-4.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-5.northghost.com", "country": "ca", "name": "do-ex-ca-5.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-6.northghost.com", "country": "ca", "name": "do-ex-ca-6.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-7.northghost.com", "country": "ca", "name": "do-ex-ca-7.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-8.northghost.com", "country": "ca", "name": "do-ex-ca-8.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-9.northghost.com", "country": "ca", "name": "do-ex-ca-9.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-10.northghost.com", "country": "ca", "name": "do-ex-ca-10.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-11.northghost.com", "country": "ca", "name": "do-ex-ca-11.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-12.northghost.com", "country": "ca", "name": "do-ex-ca-12.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-13.northghost.com", "country": "ca", "name": "do-ex-ca-13.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-14.northghost.com", "country": "ca", "name": "do-ex-ca-14.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-15.northghost.com", "country": "ca", "name": "do-ex-ca-15.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-16.northghost.com", "country": "ca", "name": "do-ex-ca-16.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-17.northghost.com", "country": "ca", "name": "do-ex-ca-17.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-18.northghost.com", "country": "ca", "name": "do-ex-ca-18.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-19.northghost.com", "country": "ca", "name": "do-ex-ca-19.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-20.northghost.com", "country": "ca", "name": "do-ex-ca-20.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-21.northghost.com", "country": "ca", "name": "do-ex-ca-21.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-22.northghost.com", "country": "ca", "name": "do-ex-ca-22.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-23.northghost.com", "country": "ca", "name": "do-ex-ca-23.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-24.northghost.com", "country": "ca", "name": "do-ex-ca-24.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-25.northghost.com", "country": "ca", "name": "do-ex-ca-25.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-26.northghost.com", "country": "ca", "name": "do-ex-ca-26.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-27.northghost.com", "country": "ca", "name": "do-ex-ca-27.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-28.northghost.com", "country": "ca", "name": "do-ex-ca-28.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-29.northghost.com", "country": "ca", "name": "do-ex-ca-29.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-30.northghost.com", "country": "ca", "name": "do-ex-ca-30.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-31.northghost.com", "country": "ca", "name": "do-ex-ca-31.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-32.northghost.com", "country": "ca", "name": "do-ex-ca-32.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-33.northghost.com", "country": "ca", "name": "do-ex-ca-33.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-34.northghost.com", "country": "ca", "name": "do-ex-ca-34.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-35.northghost.com", "country": "ca", "name": "do-ex-ca-35.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-36.northghost.com", "country": "ca", "name": "do-ex-ca-36.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-37.northghost.com", "country": "ca", "name": "do-ex-ca-37.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-38.northghost.com", "country": "ca", "name": "do-ex-ca-38.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-39.northghost.com", "country": "ca", "name": "do-ex-ca-39.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-ca-40.northghost.com", "country": "ca", "name": "do-ex-ca-40.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "dc-ex-ru-1.northghost.com", "country": "ru", "name": "dc-ex-ru-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "RU Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "dc-ex-ru-2.northghost.com", "country": "ru", "name": "dc-ex-ru-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "RU Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "dc-ex-ru-3.northghost.com", "country": "ru", "name": "dc-ex-ru-3.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "RU Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "dc-ex-ru-4.northghost.com", "country": "ru", "name": "dc-ex-ru-4.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "RU Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "dc-ex-ru-5.northghost.com", "country": "ru", "name": "dc-ex-ru-5.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "RU Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "dc-ex-ru-6.northghost.com", "country": "ru", "name": "dc-ex-ru-6.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "RU Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "dc-ex-ru-7.northghost.com", "country": "ru", "name": "dc-ex-ru-7.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "RU Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "dc-ex-ru-8.northghost.com", "country": "ru", "name": "dc-ex-ru-8.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "RU Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "dc-ex-ru-9.northghost.com", "country": "ru", "name": "dc-ex-ru-9.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "RU Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "dc-ex-ru-10.northghost.com", "country": "ru", "name": "dc-ex-ru-10.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "RU Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "dc-ex-ru-11.northghost.com", "country": "ru", "name": "dc-ex-ru-11.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "RU Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "dc-ex-ru-12.northghost.com", "country": "ru", "name": "dc-ex-ru-12.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "RU Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-1.northghost.com", "country": "de", "name": "do-ex-de-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-2.northghost.com", "country": "de", "name": "do-ex-de-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-3.northghost.com", "country": "de", "name": "do-ex-de-3.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-4.northghost.com", "country": "de", "name": "do-ex-de-4.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-5.northghost.com", "country": "de", "name": "do-ex-de-5.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-6.northghost.com", "country": "de", "name": "do-ex-de-6.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-7.northghost.com", "country": "de", "name": "do-ex-de-7.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-8.northghost.com", "country": "de", "name": "do-ex-de-8.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-9.northghost.com", "country": "de", "name": "do-ex-de-9.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-10.northghost.com", "country": "de", "name": "do-ex-de-10.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-11.northghost.com", "country": "de", "name": "do-ex-de-11.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-12.northghost.com", "country": "de", "name": "do-ex-de-12.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-13.northghost.com", "country": "de", "name": "do-ex-de-13.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-14.northghost.com", "country": "de", "name": "do-ex-de-14.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-15.northghost.com", "country": "de", "name": "do-ex-de-15.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-16.northghost.com", "country": "de", "name": "do-ex-de-16.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-17.northghost.com", "country": "de", "name": "do-ex-de-17.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-18.northghost.com", "country": "de", "name": "do-ex-de-18.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-19.northghost.com", "country": "de", "name": "do-ex-de-19.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-20.northghost.com", "country": "de", "name": "do-ex-de-20.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-21.northghost.com", "country": "de", "name": "do-ex-de-21.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-22.northghost.com", "country": "de", "name": "do-ex-de-22.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-23.northghost.com", "country": "de", "name": "do-ex-de-23.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-24.northghost.com", "country": "de", "name": "do-ex-de-24.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-25.northghost.com", "country": "de", "name": "do-ex-de-25.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-26.northghost.com", "country": "de", "name": "do-ex-de-26.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-27.northghost.com", "country": "de", "name": "do-ex-de-27.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-28.northghost.com", "country": "de", "name": "do-ex-de-28.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-29.northghost.com", "country": "de", "name": "do-ex-de-29.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-30.northghost.com", "country": "de", "name": "do-ex-de-30.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-31.northghost.com", "country": "de", "name": "do-ex-de-31.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-32.northghost.com", "country": "de", "name": "do-ex-de-32.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-33.northghost.com", "country": "de", "name": "do-ex-de-33.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-34.northghost.com", "country": "de", "name": "do-ex-de-34.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-35.northghost.com", "country": "de", "name": "do-ex-de-35.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-36.northghost.com", "country": "de", "name": "do-ex-de-36.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-37.northghost.com", "country": "de", "name": "do-ex-de-37.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-38.northghost.com", "country": "de", "name": "do-ex-de-38.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-39.northghost.com", "country": "de", "name": "do-ex-de-39.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-40.northghost.com", "country": "de", "name": "do-ex-de-40.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-41.northghost.com", "country": "de", "name": "do-ex-de-41.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-42.northghost.com", "country": "de", "name": "do-ex-de-42.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-43.northghost.com", "country": "de", "name": "do-ex-de-43.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-44.northghost.com", "country": "de", "name": "do-ex-de-44.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-45.northghost.com", "country": "de", "name": "do-ex-de-45.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-46.northghost.com", "country": "de", "name": "do-ex-de-46.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-47.northghost.com", "country": "de", "name": "do-ex-de-47.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-48.northghost.com", "country": "de", "name": "do-ex-de-48.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-49.northghost.com", "country": "de", "name": "do-ex-de-49.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-50.northghost.com", "country": "de", "name": "do-ex-de-50.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-51.northghost.com", "country": "de", "name": "do-ex-de-51.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-52.northghost.com", "country": "de", "name": "do-ex-de-52.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-53.northghost.com", "country": "de", "name": "do-ex-de-53.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-54.northghost.com", "country": "de", "name": "do-ex-de-54.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-55.northghost.com", "country": "de", "name": "do-ex-de-55.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-56.northghost.com", "country": "de", "name": "do-ex-de-56.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-57.northghost.com", "country": "de", "name": "do-ex-de-57.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-58.northghost.com", "country": "de", "name": "do-ex-de-58.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-59.northghost.com", "country": "de", "name": "do-ex-de-59.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-de-60.northghost.com", "country": "de", "name": "do-ex-de-60.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-1.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-2.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-3.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-3.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-4.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-4.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-5.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-5.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-6.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-6.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-7.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-7.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-8.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-8.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-9.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-9.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-10.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-10.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-11.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-11.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-12.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-12.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-13.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-13.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-14.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-14.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-15.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-15.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-16.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-16.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-17.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-17.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-18.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-18.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-19.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-19.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-gb-20.northghost.com", "country": "gb", "free": "false", "name": "do-ex-gb-20.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-1.northghost.com", "country": "nl", "name": "do-ex-nl-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-2.northghost.com", "country": "nl", "name": "do-ex-nl-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-3.northghost.com", "country": "nl", "name": "do-ex-nl-3.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-4.northghost.com", "country": "nl", "name": "do-ex-nl-4.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-5.northghost.com", "country": "nl", "name": "do-ex-nl-5.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-6.northghost.com", "country": "nl", "name": "do-ex-nl-6.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-7.northghost.com", "country": "nl", "name": "do-ex-nl-7.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-8.northghost.com", "country": "nl", "name": "do-ex-nl-8.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-9.northghost.com", "country": "nl", "name": "do-ex-nl-9.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-10.northghost.com", "country": "nl", "name": "do-ex-nl-10.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-11.northghost.com", "country": "nl", "name": "do-ex-nl-11.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-12.northghost.com", "country": "nl", "name": "do-ex-nl-12.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-13.northghost.com", "country": "nl", "name": "do-ex-nl-13.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-14.northghost.com", "country": "nl", "name": "do-ex-nl-14.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-15.northghost.com", "country": "nl", "name": "do-ex-nl-15.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-16.northghost.com", "country": "nl", "name": "do-ex-nl-16.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-17.northghost.com", "country": "nl", "name": "do-ex-nl-17.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-18.northghost.com", "country": "nl", "name": "do-ex-nl-18.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-19.northghost.com", "country": "nl", "name": "do-ex-nl-19.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-20.northghost.com", "country": "nl", "name": "do-ex-nl-20.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-21.northghost.com", "country": "nl", "name": "do-ex-nl-21.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-22.northghost.com", "country": "nl", "name": "do-ex-nl-22.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-23.northghost.com", "country": "nl", "name": "do-ex-nl-23.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-24.northghost.com", "country": "nl", "name": "do-ex-nl-24.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-25.northghost.com", "country": "nl", "name": "do-ex-nl-25.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-26.northghost.com", "country": "nl", "name": "do-ex-nl-26.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-27.northghost.com", "country": "nl", "name": "do-ex-nl-27.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-28.northghost.com", "country": "nl", "name": "do-ex-nl-28.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-29.northghost.com", "country": "nl", "name": "do-ex-nl-29.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-30.northghost.com", "country": "nl", "name": "do-ex-nl-30.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-31.northghost.com", "country": "nl", "name": "do-ex-nl-31.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-32.northghost.com", "country": "nl", "name": "do-ex-nl-32.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-33.northghost.com", "country": "nl", "name": "do-ex-nl-33.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-34.northghost.com", "country": "nl", "name": "do-ex-nl-34.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-35.northghost.com", "country": "nl", "name": "do-ex-nl-35.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-36.northghost.com", "country": "nl", "name": "do-ex-nl-36.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-37.northghost.com", "country": "nl", "name": "do-ex-nl-37.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-38.northghost.com", "country": "nl", "name": "do-ex-nl-38.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-39.northghost.com", "country": "nl", "name": "do-ex-nl-39.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-40.northghost.com", "country": "nl", "name": "do-ex-nl-40.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-41.northghost.com", "country": "nl", "name": "do-ex-nl-41.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-nl-42.northghost.com", "country": "nl", "name": "do-ex-nl-42.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-ny-1.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-ny-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-ny-2.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-ny-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-ny-3.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-ny-3.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-ny-4.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-ny-4.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-ny-5.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-ny-5.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-ny-6.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-ny-6.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-ny-7.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-ny-7.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-ny-8.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-ny-8.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-ny-9.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-ny-9.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-ny-10.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-ny-10.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-ny-11.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-ny-11.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-sf-1.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-sf-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-sf-2.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-sf-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-sf-3.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-sf-3.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-sf-4.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-sf-4.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-sf-5.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-sf-5.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-sf-6.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-sf-6.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-sf-7.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-sf-7.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-sf-8.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-sf-8.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-sf-9.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-sf-9.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-sf-10.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-sf-10.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-sf-11.northghost.com", "country": "us", "free": "false", "name": "do-ex-us-sf-11.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-ex-us-sf-stage-1.northghost.com", "country": "us", "name": "do-ex-us-sf-stage-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 100, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }], "elite": [{ "address": "ovh-exelite-fr-1.northghost.com", "country": "fr", "free": "false", "name": "ovh-exelite-fr-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "FR Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "ovh-exelite-fr-2.northghost.com", "country": "fr", "free": "false", "name": "ovh-exelite-fr-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "FR Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "dc-exelite-ru-1.northghost.com", "country": "ru", "free": "false", "name": "dc-exelite-ru-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "RU Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "dc-exelite-ru-2.northghost.com", "country": "ru", "free": "false", "name": "dc-exelite-ru-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 1000, "scheme": "https", "title": "RU Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-exelite-us-ny-1.northghost.com", "country": "us", "free": "false", "name": "do-exelite-us-ny-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-exelite-us-sf-1.northghost.com", "country": "us", "free": "false", "name": "do-exelite-us-sf-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "US Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-exelite-nl-1.northghost.com", "country": "nl", "free": "false", "name": "do-exelite-nl-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-exelite-nl-2.northghost.com", "country": "nl", "free": "false", "name": "do-exelite-nl-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "NL Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-exelite-gb-1.northghost.com", "country": "gb", "free": "false", "name": "do-exelite-gb-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-exelite-gb-2.northghost.com", "country": "gb", "free": "false", "name": "do-exelite-gb-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "UK Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-exelite-sg-1.northghost.com", "country": "sg", "free": "false", "name": "do-exelite-sg-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "SG Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-exelite-sg-2.northghost.com", "country": "sg", "free": "false", "name": "do-exelite-sg-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "SG Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-exelite-ca-1.northghost.com", "country": "ca", "free": "false", "name": "do-exelite-ca-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-exelite-ca-2.northghost.com", "country": "ca", "free": "false", "name": "do-exelite-ca-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "CA Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-exelite-de-1.northghost.com", "country": "de", "free": "false", "name": "do-exelite-de-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-exelite-de-2.northghost.com", "country": "de", "free": "false", "name": "do-exelite-de-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "DE Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-exelite-in-1.northghost.com", "country": "in", "free": "false", "name": "do-exelite-in-1.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "IN Server", "username": "{id}.h783ohaw09jdf0" }, { "address": "do-exelite-in-2.northghost.com", "country": "in", "free": "false", "name": "do-exelite-in-2.northghost.com", "password": "{id}.h78239hd", "port": 443, "priority": 500, "scheme": "https", "title": "IN Server", "username": "{id}.h783ohaw09jdf0" }] };

},{}],77:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ["pixel.quantserve.com", "event.shelljacket.us", "api.hsselite.com", "order.hotspotshield.com"];

},{}]},{},[68]);

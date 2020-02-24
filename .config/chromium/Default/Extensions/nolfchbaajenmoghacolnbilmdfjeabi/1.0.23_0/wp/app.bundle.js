webpackJsonp([ 1 ], [ function(module, exports, __webpack_require__) {
module.exports = __webpack_require__(491);
}, , , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
(function(global) {
"use strict";
function _interopRequireWildcard(obj) {
if (obj && obj.__esModule) return obj;
var newObj = {};
if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
return newObj.default = obj, newObj;
}
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function ImageElement() {
var _src = "", _handlers = {}, isInTest = "function" == typeof global.it;
return isInTest ? (Object.defineProperty(this, "src", {
get: function get() {
return _src;
},
set: function set(value) {
_src = value, fetch(_src, {
method: "get"
}).then(function(response) {
return 200 == response.status ? _handlers.load() : _handlers.error();
}).catch(function(err) {
return _handlers.error();
});
}
}), this.addEventListener = function(name, handler) {
_handlers[name] = handler;
}, void (this.removeEventListener = function(name, handler) {})) : new Image();
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.loadHeapAnalyticsScript = exports.loggerMiddleware = exports.isInExtension = exports.config = exports.logger = exports._ = void 0, 
exports.ImageElement = ImageElement;
var _config = __webpack_require__(56), _config2 = _interopRequireDefault(_config), _loglevel = __webpack_require__(905), _loglevel2 = _interopRequireDefault(_loglevel), _lodash = __webpack_require__(263), lodash = _interopRequireWildcard(_lodash), _diacritic = __webpack_require__(778), _diacritic2 = _interopRequireDefault(_diacritic);
lodash.mixin(__webpack_require__(801)), lodash.mixin({
async: function async(dispatch, f) {
for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
setTimeout(function() {
dispatch(f.apply(void 0, args));
});
},
clean: function clean(str) {
return _diacritic2.default.clean(str).toLowerCase().trim();
}
});
exports._ = lodash;
exports.logger = _loglevel2.default, exports.config = _config2.default;
var isInExtension = exports.isInExtension = "undefined" != typeof window && window.chrome && chrome.runtime && chrome.runtime.id, log = _loglevel2.default.getLogger("redux");
isInExtension || log.setLevel("DEBUG");
exports.loggerMiddleware = function loggerMiddleware(store) {
return function(next) {
return function(action) {
return log.debug("dispatch." + action.type), next(action);
};
};
}, exports.loadHeapAnalyticsScript = function loadHeapAnalyticsScript() {
var scriptTag = document.createElement("script"), heapScript = document.createTextNode('window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=t.forceSSL||"https:"===document.location.protocol,a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=(r?"https:":"http:")+"//cdn.heapanalytics.com/js/heap-"+e+".js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(a,n);for(var o=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],c=0;c<p.length;c++)heap[p[c]]=o(p[c])};heap.load(' + _config2.default.heap.app_id + ");");
scriptTag.appendChild(heapScript), document.getElementsByTagName("head")[0].appendChild(scriptTag);
};
}).call(exports, function() {
return this;
}());
}, , 46, [ 1135, 542 ], function(module, exports) {
"use strict";
exports.__esModule = !0, exports.default = function(instance, Constructor) {
if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
};
}, [ 1140, 530, 529, 319 ], [ 1141, 319 ], , , function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.PureRenderComponent = void 0;
var _getPrototypeOf = __webpack_require__(20), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(21), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _possibleConstructorReturn2 = __webpack_require__(23), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(22), _inherits3 = _interopRequireDefault(_inherits2), _react = __webpack_require__(4), _reactAddonsPureRenderMixin = (_interopRequireDefault(_react), 
__webpack_require__(999)), _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);
exports.PureRenderComponent = function(_Component) {
function PureRenderComponent(props) {
(0, _classCallCheck3.default)(this, PureRenderComponent);
var _this = (0, _possibleConstructorReturn3.default)(this, (PureRenderComponent.__proto__ || (0, 
_getPrototypeOf2.default)(PureRenderComponent)).call(this, props));
return _this.shouldComponentUpdate = _reactAddonsPureRenderMixin2.default.shouldComponentUpdate.bind(_this), 
_this;
}
return (0, _inherits3.default)(PureRenderComponent, _Component), PureRenderComponent;
}(_react.Component);
}, [ 1139, 318 ], 5, function(module, exports, __webpack_require__) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.CommonMixin = exports.BackgroundMixin = void 0;
var _utils = __webpack_require__(17), log = _utils.logger.getLogger("app");
_utils.isInExtension || log.setLevel("DEBUG");
exports.BackgroundMixin = {
getFallbackBackground: function getFallbackBackground(backgrounds) {
return {
url: "fallback/" + backgrounds.fallback[0]
};
},
getBackground: function getBackground(backgrounds, _day) {
var day = (_day || moment()).format("YYYY-MM-DD");
return backgrounds.items.hasOwnProperty(day) && backgrounds.items[day].hasOwnProperty("items") ? backgrounds.items[day].items[0] : this.getFallbackBackground(backgrounds);
},
isFallBack: function isFallBack(backgrounds) {
return this.getBackground(backgrounds).url.indexOf("fallback") >= 0;
}
}, exports.CommonMixin = {
componentWillMount: function componentWillMount() {
log.debug("componentWillMount", this.constructor.name);
},
componentWillUpdate: function componentWillUpdate() {
"App" != this.constructor.name && log.debug("componentWillUpdate", this.constructor.name);
},
getCurrentTimeZone: function getCurrentTimeZone() {
return this.props.user.location && this.props.user.location.hasOwnProperty("tz") ? this.props.user.location.tz.replace(/\_/g, " ") : null;
},
getTimeWithUserZone: function getTimeWithUserZone(time) {
var zonedTime = moment(time);
return this.props.user && this.props.user.location && zonedTime.tz(this.props.user.location.tz), 
zonedTime;
},
getTimeWithExtraOffset: function getTimeWithExtraOffset() {
return moment(this.props.time).add(this.props.time_extra, "days");
},
getMyLocationAsLabel: function getMyLocationAsLabel(nameOnly) {
if (nameOnly = nameOnly || !1, null == this.props.user.location) return "";
var name = this.props.user.location.name;
if (name && nameOnly) return name;
var country = this.props.user.location.country;
return name && name != country ? name + ", " + country : country;
},
handleClosePopupClick: function handleClosePopupClick() {
var self = this;
setTimeout(function() {
self.props.dispatch(actions.ui.closePopups());
});
},
handleSignupClick: function handleSignupClick() {
document.getElementById("hint").value = "Signup", document.getElementById("login").submit();
},
handleLoginClick: function handleLoginClick() {
document.getElementById("hint").value = "Login", document.getElementById("login").submit();
},
handleEventClick: function handleEventClick(id, e) {
e.preventDefault();
var tracking = "utm_source=chrome&utm_medium=extension&utm_campaign=event.view", url = "https://events.predicthq.com/events/" + id + "/?" + tracking;
window.open(url, "_blank");
}
};
}, 46, , , , [ 1198, 273, 186, 28 ], function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
exports.__esModule = !0, exports.connect = exports.Provider = void 0;
var _Provider = __webpack_require__(1026), _Provider2 = _interopRequireDefault(_Provider), _connect = __webpack_require__(1027), _connect2 = _interopRequireDefault(_connect);
exports.Provider = _Provider2.default, exports.connect = _connect2.default;
}, function(module, exports, __webpack_require__) {
(function(global) {
module.exports = global.actions = __webpack_require__(506);
}).call(exports, function() {
return this;
}());
}, , , , , , function(module, exports) {
var isArray = Array.isArray;
module.exports = isArray;
}, function(module, exports, __webpack_require__) {
function setDefaultProps(reactMixin) {
var getDefaultProps = reactMixin.getDefaultProps;
getDefaultProps && (reactMixin.defaultProps = getDefaultProps(), delete reactMixin.getDefaultProps);
}
function setInitialState(reactMixin) {
function applyInitialState(instance) {
var state = instance.state || {};
assign(state, getInitialState.call(instance)), instance.state = state;
}
var getInitialState = reactMixin.getInitialState, componentWillMount = reactMixin.componentWillMount;
getInitialState && (componentWillMount ? reactMixin.componentWillMount = function() {
applyInitialState(this), componentWillMount.call(this);
} : reactMixin.componentWillMount = function() {
applyInitialState(this);
}, delete reactMixin.getInitialState);
}
function mixinClass(reactClass, reactMixin) {
setDefaultProps(reactMixin), setInitialState(reactMixin);
var prototypeMethods = {}, staticProps = {};
Object.keys(reactMixin).forEach(function(key) {
"mixins" !== key && "statics" !== key && ("function" == typeof reactMixin[key] ? prototypeMethods[key] = reactMixin[key] : staticProps[key] = reactMixin[key]);
}), mixinProto(reactClass.prototype, prototypeMethods);
var mergePropTypes = function(left, right, key) {
if (!left) return right;
if (!right) return left;
var result = {};
return Object.keys(left).forEach(function(leftKey) {
right[leftKey] || (result[leftKey] = left[leftKey]);
}), Object.keys(right).forEach(function(rightKey) {
left[rightKey] ? result[rightKey] = function checkBothContextTypes() {
return right[rightKey].apply(this, arguments) && left[rightKey].apply(this, arguments);
} : result[rightKey] = right[rightKey];
}), result;
};
return mixin({
childContextTypes: mergePropTypes,
contextTypes: mergePropTypes,
propTypes: mixin.MANY_MERGED_LOOSE,
defaultProps: mixin.MANY_MERGED_LOOSE
})(reactClass, staticProps), reactMixin.statics && Object.getOwnPropertyNames(reactMixin.statics).forEach(function(key) {
var left = reactClass[key], right = reactMixin.statics[key];
if (void 0 !== left && void 0 !== right) throw new TypeError("Cannot mixin statics because statics." + key + " and Component." + key + " are defined.");
reactClass[key] = void 0 !== left ? left : right;
}), reactMixin.mixins && reactMixin.mixins.reverse().forEach(mixinClass.bind(null, reactClass)), 
reactClass;
}
var mixin = __webpack_require__(1116), assign = __webpack_require__(10), mixinProto = mixin({
componentDidMount: mixin.MANY,
componentWillMount: mixin.MANY,
componentWillReceiveProps: mixin.MANY,
shouldComponentUpdate: mixin.ONCE,
componentWillUpdate: mixin.MANY,
componentDidUpdate: mixin.MANY,
componentWillUnmount: mixin.MANY,
getChildContext: mixin.MANY_MERGED
});
module.exports = function() {
var reactMixin = mixinProto;
return reactMixin.onClass = function(reactClass, mixin) {
return mixin = assign({}, mixin), mixinClass(reactClass, mixin);
}, reactMixin.decorate = function(mixin) {
return function(reactClass) {
return reactMixin.onClass(reactClass, mixin);
};
}, reactMixin;
}();
}, , , , , , , , , , , , , function(module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: !0
});
var protocol = "https", server = "predicthq.com", config = {
raven: {
dsn: "https://9920e59e26eb499485d97e363ad70742@app.getsentry.com/69666",
config: {
ignoreUrls: [ "localhost" ]
}
},
heap: {
app_id: "2099083646"
},
focus: {
url: "https://focus.predicthq.com",
feed: "/feed/",
events: "/events/",
places: "/places/"
},
phq: {
controlCentreUrl: protocol + "://control." + server,
signUpUrl: protocol + "://signup." + server,
url: protocol + "://api." + server
},
event: {
categories: [ "school-holidays", "public-holidays", "observances", "concerts", "conferences", "expos", "festivals", "performing-arts", "sports", "politics" ]
},
oauth: {
target: protocol + "://api." + server,
clientId: "phq.sKQyNepcKAtmzNYq8swxbMNeakjDiGKRZZW3n9TH",
scope: "accounts profile events places offline",
redirectUri: protocol + "://app." + server + "/grant/completed/",
responseType: "token"
},
upgrades: {
"1.0.10": [ "Bug fixes" ],
"1.0.11": [ "Changes to support going out of beta" ],
"1.0.12": [ "Updated feedback links, feedback is always appreciated~" ],
"1.0.13": [ "Bug Fixes", "12hr clock option (Find it in bottom left/location popup)" ],
"1.0.14": [ "Bug Fixes" ],
"1.0.15": [ "Fixed bug with missing event" ],
"1.0.16": [ "Added support for the new Politics category" ],
"1.0.19": [ "Fixed bug with guest mode location" ],
"1.0.20": [ "Minor changes and updates" ],
"1.0.21": [ "Minor update" ],
"1.0.22": [ "Minor changes" ],
"1.0.23": [ "Minor bug fix - view event url updated" ]
}
};
exports.default = config;
}, [ 1198, 216, 153, 65 ], , , function(module, exports, __webpack_require__) {
(function(global) {
var checkGlobal = __webpack_require__(842), freeGlobal = checkGlobal("object" == typeof global && global), freeSelf = checkGlobal("object" == typeof self && self), thisGlobal = checkGlobal("object" == typeof this && this), root = freeGlobal || freeSelf || thisGlobal || Function("return this")();
module.exports = root;
}).call(exports, function() {
return this;
}());
}, [ 1151, 71 ], [ 1148, 28, 19, 133, 94, 93 ], , , 5, , , , , [ 1155, 134 ], 9, [ 1173, 61, 404, 275, 70 ], , , , , [ 1155, 120 ], 37, [ 1173, 98, 323, 219, 77 ], , , , , , , , , , , , 21, [ 1139, 908 ], 37, [ 1159, 72, 183, 70 ], function(module, exports) {
var global = module.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
"number" == typeof __g && (__g = global);
}, , function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireWildcard(obj) {
if (obj && obj.__esModule) return obj;
var newObj = {};
if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
return newObj.default = obj, newObj;
}
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.logger = exports._ = void 0;
var _loglevel = __webpack_require__(981), _loglevel2 = _interopRequireDefault(_loglevel), _lodash = __webpack_require__(501), lodash = _interopRequireWildcard(_lodash), _ = exports._ = lodash;
_.mixin, _.fromPairs, _.indexOf, _.isArray, _.isString, _.map, _.toPairs, _.trim, 
exports.logger = _loglevel2.default;
}, [ 1151, 101 ], [ 1148, 65, 30, 321, 100, 78 ], [ 1159, 79, 152, 77 ], 9, [ 1191, 551, 209 ], , , , , function(module, exports, __webpack_require__) {
function getNative(object, key) {
var value = getValue(object, key);
return baseIsNative(value) ? value : void 0;
}
var baseIsNative = __webpack_require__(829), getValue = __webpack_require__(853);
module.exports = getNative;
}, , [ 1191, 928, 266 ], function(module, exports, __webpack_require__) {
module.exports = !__webpack_require__(189)(function() {
return 7 != Object.defineProperty({}, "a", {
get: function() {
return 7;
}
}).a;
});
}, function(module, exports) {
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key) {
return hasOwnProperty.call(it, key);
};
}, function(module, exports, __webpack_require__) {
var IObject = __webpack_require__(966), defined = __webpack_require__(962);
module.exports = function(it) {
return IObject(defined(it));
};
}, , , , , function(module, exports) {
"use strict";
function countArguments(args, max) {
var n = args.length;
for (n > max && (n = max); args[n - 1] === _; ) n--;
return n;
}
function curry1(fn) {
return function curried(a) {
for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
var b = args[0], c = args[1], n = countArguments(arguments);
return n >= 1 ? fn(a, b, c) : curried;
};
}
function curry2(fn) {
return function curried(a, b) {
for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) args[_key2 - 2] = arguments[_key2];
var c = args[0], d = args[1], n = countArguments(arguments, 2);
if (b === _ || c === _ || d === _) throw new Error("Can only use placeholder on first argument of this function.");
return n >= 2 ? a === _ ? curry1(function(a, c, d) {
return fn(a, b, c, d);
}) : fn(a, b, c, d) : 1 === n ? curry1(function(b, c, d) {
return fn(a, b, c, d);
}) : curried;
};
}
function curry3(fn) {
return function curried(a, b, c) {
for (var _len3 = arguments.length, args = Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) args[_key3 - 3] = arguments[_key3];
var d = args[0], e = args[1], n = countArguments(arguments, 3);
if (c === _ || d === _ || e === _) throw new Error("Can only use placeholder on first or second argument of this function.");
return n >= 3 ? a === _ ? b === _ ? curry2(function(a, b, d, e) {
return fn(a, b, c, d, e);
}) : curry1(function(a, d, e) {
return fn(a, b, c, d, e);
}) : b === _ ? curry1(function(b, d, e) {
return fn(a, b, c, d, e);
}) : fn(a, b, c, d, e) : 2 === n ? a === _ ? curry2(function(a, c, d, e) {
return fn(a, b, c, d, e);
}) : curry1(function(c, d, e) {
return fn(a, b, c, d, e);
}) : 1 === n ? curry2(function(b, c, d, e) {
return fn(a, b, c, d, e);
}) : curried;
};
}
function curry4(fn) {
return function curried(a, b, c, d) {
for (var _len4 = arguments.length, args = Array(_len4 > 4 ? _len4 - 4 : 0), _key4 = 4; _key4 < _len4; _key4++) args[_key4 - 4] = arguments[_key4];
var e = args[0], f = args[1], n = countArguments(arguments, 4);
if (d === _ || e === _ || f === _) throw new Error("Can only use placeholder on first, second or third argument of this function.");
return n >= 4 ? a === _ ? b === _ ? c === _ ? curry3(function(a, b, c, e, f) {
return fn(a, b, c, d, e, f);
}) : curry2(function(a, b, e, f) {
return fn(a, b, c, d, e, f);
}) : c === _ ? curry2(function(a, c, e, f) {
return fn(a, b, c, d, e, f);
}) : curry1(function(a, e, f) {
return fn(a, b, c, d, e, f);
}) : b === _ ? c === _ ? curry2(function(b, c, e, f) {
return fn(a, b, c, d, e, f);
}) : curry1(function(b, e, f) {
return fn(a, b, c, d, e, f);
}) : c === _ ? curry1(function(c, e, f) {
return fn(a, b, c, d, e, f);
}) : fn(a, b, c, d, e, f) : 3 === n ? a === _ ? b === _ ? curry3(function(a, b, d, e, f) {
return fn(a, b, c, d, e, f);
}) : curry2(function(a, d, e, f) {
return fn(a, b, c, d, e, f);
}) : b === _ ? curry2(function(b, d, e, f) {
return fn(a, b, c, d, e, f);
}) : curry1(function(d, e, f) {
return fn(a, b, c, d, e, f);
}) : 2 === n ? a === _ ? curry3(function(a, c, d, e, f) {
return fn(a, b, c, d, e, f);
}) : curry2(function(c, d, e, f) {
return fn(a, b, c, d, e, f);
}) : 1 === n ? curry3(function(b, c, d, e, f) {
return fn(a, b, c, d, e, f);
}) : curried;
};
}
function curry(fn) {
var length = arguments.length <= 1 || void 0 === arguments[1] ? fn.length : arguments[1];
return [ fn, curry1, curry2, curry3, curry4 ][length](fn);
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.curry1 = curry1, exports.curry2 = curry2, exports.curry3 = curry3, exports.curry4 = curry4, 
exports.default = curry;
var _ = exports._ = "@@updeep/placeholder";
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function wrap(func) {
var length = arguments.length <= 1 || void 0 === arguments[1] ? func.length : arguments[1];
return (0, _curry2.default)(function() {
return (0, _freeze2.default)(func.apply(void 0, arguments));
}, length);
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.default = wrap;
var _curry = __webpack_require__(117), _curry2 = _interopRequireDefault(_curry), _freeze = __webpack_require__(308), _freeze2 = _interopRequireDefault(_freeze);
}, , 8, 104, , , , , , function(module, exports, __webpack_require__) {
"use strict";
var uri = __webpack_require__(488), ValidationError = exports.ValidationError = function ValidationError(message, instance, schema, propertyPath, name, argument) {
propertyPath && (this.property = propertyPath), message && (this.message = message), 
schema && (schema.id ? this.schema = schema.id : this.schema = schema), instance && (this.instance = instance), 
this.name = name, this.argument = argument, this.stack = this.toString();
};
ValidationError.prototype.toString = function toString() {
return this.property + " " + this.message;
};
var ValidatorResult = exports.ValidatorResult = function ValidatorResult(instance, schema, options, ctx) {
this.instance = instance, this.schema = schema, this.propertyPath = ctx.propertyPath, 
this.errors = [], this.throwError = options && options.throwError, this.disableFormat = options && options.disableFormat === !0;
};
ValidatorResult.prototype.addError = function addError(detail) {
var err;
if ("string" == typeof detail) err = new ValidationError(detail, this.instance, this.schema, this.propertyPath); else {
if (!detail) throw new Error("Missing error detail");
if (!detail.message) throw new Error("Missing error message");
if (!detail.name) throw new Error("Missing validator type");
err = new ValidationError(detail.message, this.instance, this.schema, this.propertyPath, detail.name, detail.argument);
}
if (this.throwError) throw err;
return this.errors.push(err), err;
}, ValidatorResult.prototype.importErrors = function importErrors(res) {
if ("string" == typeof res || res && res.validatorType) this.addError(res); else if (res && res.errors) {
var errs = this.errors;
res.errors.forEach(function(v) {
errs.push(v);
});
}
}, ValidatorResult.prototype.toString = function toString(res) {
return this.errors.map(function(v, i) {
return i + ": " + v.toString() + "\n";
}).join("");
}, Object.defineProperty(ValidatorResult.prototype, "valid", {
get: function() {
return !this.errors.length;
}
});
var SchemaError = exports.SchemaError = function SchemaError(msg, schema) {
this.message = msg, this.schema = schema, Error.call(this, msg), Error.captureStackTrace(this, SchemaError);
};
SchemaError.prototype = Object.create(Error.prototype, {
constructor: {
value: SchemaError,
enumerable: !1
},
name: {
value: "SchemaError",
enumerable: !1
}
});
var SchemaContext = exports.SchemaContext = function SchemaContext(schema, options, propertyPath, base, schemas) {
this.schema = schema, this.options = options, this.propertyPath = propertyPath, 
this.base = base, this.schemas = schemas;
};
SchemaContext.prototype.resolve = function resolve(target) {
return uri.resolve(this.base, target);
}, SchemaContext.prototype.makeChild = function makeChild(schema, propertyName) {
var propertyPath = void 0 === propertyName ? this.propertyPath : this.propertyPath + makeSuffix(propertyName), base = uri.resolve(this.base, schema.id || ""), ctx = new SchemaContext(schema, this.options, propertyPath, base, Object.create(this.schemas));
return schema.id && !ctx.schemas[base] && (ctx.schemas[base] = schema), ctx;
};
var FORMAT_REGEXPS = exports.FORMAT_REGEXPS = {
"date-time": /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-(3[01]|0[1-9]|[12][0-9])[tT ](2[0-4]|[01][0-9]):([0-5][0-9]):(60|[0-5][0-9])(\.\d+)?([zZ]|[+-]([0-5][0-9]):(60|[0-5][0-9]))$/,
date: /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-(3[01]|0[1-9]|[12][0-9])$/,
time: /^(2[0-4]|[01][0-9]):([0-5][0-9]):(60|[0-5][0-9])$/,
email: /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/,
"ip-address": /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
ipv6: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
uri: /^[a-zA-Z][a-zA-Z0-9+-.]*:[^\s]*$/,
color: /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/,
hostname: /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,
"host-name": /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,
alpha: /^[a-zA-Z]+$/,
alphanumeric: /^[a-zA-Z0-9]+$/,
"utc-millisec": function(input) {
return "string" == typeof input && parseFloat(input) === parseInt(input, 10) && !isNaN(input);
},
regex: function(input) {
var result = !0;
try {
new RegExp(input);
} catch (e) {
result = !1;
}
return result;
},
style: /\s*(.+?):\s*([^;]+);?/g,
phone: /^\+(?:[0-9] ?){6,14}[0-9]$/
};
FORMAT_REGEXPS.regexp = FORMAT_REGEXPS.regex, FORMAT_REGEXPS.pattern = FORMAT_REGEXPS.regex, 
FORMAT_REGEXPS.ipv4 = FORMAT_REGEXPS["ip-address"], exports.isFormat = function isFormat(input, format, validator) {
if ("string" == typeof input && void 0 !== FORMAT_REGEXPS[format]) {
if (FORMAT_REGEXPS[format] instanceof RegExp) return FORMAT_REGEXPS[format].test(input);
if ("function" == typeof FORMAT_REGEXPS[format]) return FORMAT_REGEXPS[format](input);
} else if (validator && validator.customFormats && "function" == typeof validator.customFormats[format]) return validator.customFormats[format](input);
return !0;
};
var makeSuffix = exports.makeSuffix = function makeSuffix(key) {
return key = key.toString(), key.match(/[.\s\[\]]/) || key.match(/^[\d]/) ? key.match(/^\d+$/) ? "[" + key + "]" : "[" + JSON.stringify(key) + "]" : "." + key;
};
exports.deepCompareStrict = function deepCompareStrict(a, b) {
if (typeof a != typeof b) return !1;
if (a instanceof Array) return b instanceof Array && (a.length === b.length && a.every(function(v, i) {
return deepCompareStrict(a[i], b[i]);
}));
if ("object" == typeof a) {
if (!a || !b) return a === b;
var aKeys = Object.keys(a), bKeys = Object.keys(b);
return aKeys.length === bKeys.length && aKeys.every(function(v) {
return deepCompareStrict(a[v], b[v]);
});
}
return a === b;
}, module.exports.deepMerge = function deepMerge(target, src) {
var array = Array.isArray(src), dst = array && [] || {};
return array ? (target = target || [], dst = dst.concat(target), src.forEach(function(e, i) {
"object" == typeof e ? dst[i] = deepMerge(target[i], e) : target.indexOf(e) === -1 && dst.push(e);
})) : (target && "object" == typeof target && Object.keys(target).forEach(function(key) {
dst[key] = target[key];
}), Object.keys(src).forEach(function(key) {
"object" == typeof src[key] && src[key] && target[key] ? dst[key] = deepMerge(target[key], src[key]) : dst[key] = src[key];
})), dst;
}, exports.objectGetPath = function objectGetPath(o, s) {
for (var k, parts = s.split("/").slice(1); "string" == typeof (k = parts.shift()); ) {
var n = decodeURIComponent(k.replace(/~0/, "~").replace(/~1/g, "/"));
if (!(n in o)) return;
o = o[n];
}
return o;
}, exports.encodePath = function encodePointer(a) {
return a.map(function(v) {
return "/" + encodeURIComponent(v).replace(/~/g, "%7E");
}).join("");
};
}, function(module, exports, __webpack_require__) {
function baseIteratee(value) {
return "function" == typeof value ? value : null == value ? identity : "object" == typeof value ? isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value) : property(value);
}
var baseMatches = __webpack_require__(833), baseMatchesProperty = __webpack_require__(834), identity = __webpack_require__(889), isArray = __webpack_require__(42), property = __webpack_require__(898);
module.exports = baseIteratee;
}, function(module, exports, __webpack_require__) {
function toKey(value) {
if ("string" == typeof value || isSymbol(value)) return value;
var result = value + "";
return "0" == result && 1 / value == -INFINITY ? "-0" : result;
}
var isSymbol = __webpack_require__(178), INFINITY = 1 / 0;
module.exports = toKey;
}, function(module, exports) {
function isObject(value) {
var type = typeof value;
return !!value && ("object" == type || "function" == type);
}
module.exports = isObject;
}, [ 1135, 916 ], 45, [ 1154, 181 ], 8, 104, function(module, exports) {
module.exports = !0;
}, function(module, exports, __webpack_require__) {
var anObject = __webpack_require__(187), IE8_DOM_DEFINE = __webpack_require__(424), toPrimitive = __webpack_require__(285), dP = Object.defineProperty;
exports.f = __webpack_require__(110) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
if (anObject(O), P = toPrimitive(P, !0), anObject(Attributes), IE8_DOM_DEFINE) try {
return dP(O, P, Attributes);
} catch (e) {}
if ("get" in Attributes || "set" in Attributes) throw TypeError("Accessors not supported!");
return "value" in Attributes && (O[P] = Attributes.value), O;
};
}, function(module, exports) {
var id = 0, px = Math.random();
module.exports = function(key) {
return "Symbol(".concat(void 0 === key ? "" : key, ")_", (++id + px).toString(36));
};
}, function(module, exports) {
"use strict";
exports.default = function(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}, exports.__esModule = !0;
}, function(module, exports) {
var $Object = Object;
module.exports = {
create: $Object.create,
getProto: $Object.getPrototypeOf,
isEnum: {}.propertyIsEnumerable,
getDesc: $Object.getOwnPropertyDescriptor,
setDesc: $Object.defineProperty,
setDescs: $Object.defineProperties,
getKeys: $Object.keys,
getNames: $Object.getOwnPropertyNames,
getSymbols: $Object.getOwnPropertySymbols,
each: [].forEach
};
}, , , , , , , function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function _toConsumableArray(arr) {
if (Array.isArray(arr)) {
for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
return arr2;
}
return Array.from(arr);
}
function isEmpty(object) {
return !Object.keys(object).length;
}
function reduce(object, callback, initialValue) {
return Object.keys(object).reduce(function(acc, key) {
return callback(acc, object[key], key);
}, initialValue);
}
function resolveUpdates(updates, object) {
return reduce(updates, function(acc, value, key) {
var updatedValue = value;
return Array.isArray(value) || null === value || "object" !== ("undefined" == typeof value ? "undefined" : _typeof(value)) ? "function" == typeof value && (updatedValue = value(object[key])) : updatedValue = update(value, object[key]), 
object[key] !== updatedValue && (acc[key] = updatedValue), acc;
}, {});
}
function updateArray(updates, object) {
var newArray = [].concat(_toConsumableArray(object));
return Object.keys(updates).forEach(function(key) {
newArray[key] = updates[key];
}), newArray;
}
function update(updates, object) {
if ("function" == typeof updates) {
for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
return updates.apply(void 0, [ object ].concat(args));
}
if (!(0, _isPlainObject2.default)(updates)) return updates;
var defaultedObject = "undefined" == typeof object || null === object ? {} : object, resolvedUpdates = resolveUpdates(updates, defaultedObject);
return isEmpty(resolvedUpdates) ? defaultedObject : Array.isArray(defaultedObject) ? updateArray(resolvedUpdates, defaultedObject) : _extends({}, defaultedObject, resolvedUpdates);
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _extends = Object.assign || function(target) {
for (var i = 1; i < arguments.length; i++) {
var source = arguments[i];
for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
}
return target;
}, _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
return typeof obj;
} : function(obj) {
return obj && "function" == typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, _wrap = __webpack_require__(118), _wrap2 = _interopRequireDefault(_wrap), _isPlainObject = __webpack_require__(177), _isPlainObject2 = _interopRequireDefault(_isPlainObject);
exports.default = (0, _wrap2.default)(update, 2);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _classCallCheck2 = __webpack_require__(91), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(92), _createClass3 = _interopRequireDefault(_createClass2), _utils = __webpack_require__(97), _jsonschema = __webpack_require__(252), BaseEndpoint = function() {
function BaseEndpoint(client) {
(0, _classCallCheck3.default)(this, BaseEndpoint), this.client = client;
}
return (0, _createClass3.default)(BaseEndpoint, [ {
key: "build_url",
value: function build_url(prefix, suffix) {
return this.accountId ? "/" + prefix + "/accounts/" + _utils._.trim(this.accountId, "/") + "/" + _utils._.trim(suffix, "/") + "/" : "/" + prefix + "/" + _utils._.trim(suffix, "/") + "/";
}
}, {
key: "deserializeOptions",
value: function deserializeOptions(options) {
var self = this;
return _utils._.fromPairs(_utils._.map(_utils._.toPairs(options), function(item) {
return _utils._.indexOf(self.arrayOptions, item[0]) >= 0 && (_utils._.isString(item[1]) && (item[1] = item[1].split(",")), 
_utils._.isArray(item[1]) || (item[1] = [ item[1] ])), _utils._.indexOf(self.integerOptions, item[0]) >= 0 && (_utils._.isArray(item[1]) ? item[1] = _utils._.map(item[1], function(x) {
return parseInt(x);
}) : item[1] = parseInt(item[1])), item;
}));
}
}, {
key: "serializeOptions",
value: function serializeOptions(options) {
var self = this;
return _utils._.fromPairs(_utils._.map(_utils._.toPairs(options), function(item) {
return _utils._.indexOf(self.arrayOptions, item[0]) >= 0 && _utils._.isArray(item[1]) && (item[1] = item[1].join(",")), 
item;
}));
}
}, {
key: "validate",
value: function validate(options) {
var v = new _jsonschema.Validator(), _options = this.deserializeOptions(options);
return v.validate(_options, this.schema);
}
}, {
key: "get",
value: function get(version, path, returnClass, options) {
return options = this.serializeOptions(options), this.client.get(this.build_url(version, path), returnClass, options);
}
} ]), BaseEndpoint;
}();
exports.default = BaseEndpoint;
}, function(module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: !0
});
var EventSchema = JSON.parse('{\n  "$schema": "http://json-schema.org/draft-04/schema#",\n  "title": "Event Search Schema",\n  "type": "object",\n  "additionalProperties": false,\n  "properties": {\n    "q": {\n      "type": "string"\n    },\n    "id": {\n      "type": "string"\n    },\n    "label": {\n      "type": "array"\n    },\n    "within": {\n      "type": "string"\n    },\n    "country": {\n      "type": "array"\n    },\n    "start.tz": {\n      "type": "string"\n    },\n    "start.gt": {\n      "type": "string",\n      "pattern": "^([0-9]{4})-[0-9]{2}-[0-9]{2}$"\n    },\n    "start.gte": {\n      "type": "string",\n      "pattern": "^([0-9]{4})-[0-9]{2}-[0-9]{2}$"\n    },\n    "start.lt": {\n      "type": "string",\n      "pattern": "^([0-9]{4})-[0-9]{2}-[0-9]{2}$"\n    },\n    "start.lte": {\n      "type": "string",\n      "pattern": "^([0-9]{4})-[0-9]{2}-[0-9]{2}$"\n    },\n    "end.tz": {\n      "type": "string"\n    },\n    "end.gt": {\n      "type": "string",\n      "pattern": "^([0-9]{4})-[0-9]{2}-[0-9]{2}$"\n    },\n    "end.gte": {\n      "type": "string",\n      "pattern": "^([0-9]{4})-[0-9]{2}-[0-9]{2}$"\n    },\n    "end.lt": {\n      "type": "string",\n      "pattern": "^([0-9]{4})-[0-9]{2}-[0-9]{2}$"\n    },\n    "end.lte": {\n      "type": "string",\n      "pattern": "^([0-9]{4})-[0-9]{2}-[0-9]{2}$"\n    },\n    "active.tz": {\n      "type": "string"\n    },\n    "active.gt": {\n      "type": "string",\n      "pattern": "^([0-9]{4})-[0-9]{2}-[0-9]{2}$"\n    },\n    "active.gte": {\n      "type": "string",\n      "pattern": "^([0-9]{4})-[0-9]{2}-[0-9]{2}$"\n    },\n    "active.lt": {\n      "type": "string",\n      "pattern": "^([0-9]{4})-[0-9]{2}-[0-9]{2}$"\n    },\n    "active.lte": {\n      "type": "string",\n      "pattern": "^([0-9]{4})-[0-9]{2}-[0-9]{2}$"\n    },\n    "limit": {\n      "type": "integer",\n      "minimum": 10,\n      "maximum": 200\n    },\n    "top_events.limit": {\n      "type": "integer",\n      "minimum": 1,\n      "maximum": 10\n    },\n    "offset": {\n      "type": "integer",\n      "minimum": 10\n    },\n    "rank_level": {\n      "items": {\n        "enum": [\n          1,\n          2,\n          3,\n          4,\n          5\n        ]\n      },\n      "type": "array"\n    },\n    "sort": {\n      "items": {\n        "enum": [\n          "id",\n          "title",\n          "start",\n          "end",\n          "rank",\n          "category",\n          "duration",\n          "country",\n          "labels",\n          "-id",\n          "-title",\n          "-start",\n          "-end",\n          "-rank",\n          "-category",\n          "-duration",\n          "-country",\n          "-labels"\n        ]\n      },\n      "type": "array"\n    },\n    "top_events.sort": {\n      "items": {\n        "enum": [\n          "id",\n          "title",\n          "start",\n          "end",\n          "rank",\n          "category",\n          "duration",\n          "country",\n          "labels",\n          "-id",\n          "-title",\n          "-start",\n          "-end",\n          "-rank",\n          "-category",\n          "-duration",\n          "-country",\n          "-labels"\n        ]\n      },\n      "type": "array"\n    },\n    "category": {\n      "items": {\n        "enum": [\n          "school-holidays",\n          "public-holidays",\n          "observances",\n          "concerts",\n          "conferences",\n          "expos",\n          "festivals",\n          "performing-arts",\n          "sports",\n          "daylight-savings",\n          "airport-delays",\n          "severe-weather",\n          "disasters"\n        ]\n      },\n      "type": "array"\n    }\n  },\n  "required": [\n\n  ]\n}'), PlaceSchema = JSON.parse('{\n  "$schema": "http://json-schema.org/draft-04/schema#",\n  "title": "Place Search Schema",\n  "type": "object",\n  "additionalProperties": false,\n  "properties": {\n    "q": {\n      "type": "string"\n    },\n    "id": {\n      "type": "string"\n    },\n    "country": {\n      "type": "array"\n    },\n    "limit": {\n      "type": "integer",\n      "minimum": 10,\n      "maximum": 200\n    },\n    "type": {\n      "items": {\n        "enum": [\n          "neighbourhood",\n          "locality",\n          "localadmin",\n          "county",\n          "region",\n          "country",\n          "continent",\n          "country",\n          "planet",\n          "local",\n          "metro",\n          "major"\n        ]\n      },\n      "type": "array"\n    }\n  },\n  "required": [\n\n  ]\n}');
exports.EventSchema = EventSchema, exports.PlaceSchema = PlaceSchema;
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.ResultSet = void 0;
var _iterator = __webpack_require__(401), _iterator2 = _interopRequireDefault(_iterator), _classCallCheck2 = __webpack_require__(91), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(92), _createClass3 = _interopRequireDefault(_createClass2);
__webpack_require__(957);
var ResultSet = function() {
function ResultSet(result) {
(0, _classCallCheck3.default)(this, ResultSet), this.result = result;
}
return (0, _createClass3.default)(ResultSet, [ {
key: "toArray",
value: function toArray() {
return this.result.results;
}
}, {
key: _iterator2.default,
value: function value() {
var index = -1, data = this.result.results;
return {
next: function next() {
return {
value: data[++index],
done: index == data.length
};
}
};
}
} ]), ResultSet;
}();
exports.ResultSet = ResultSet;
}, 136, 85, 89, , , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
function ListCache(entries) {
var index = -1, length = entries ? entries.length : 0;
for (this.clear(); ++index < length; ) {
var entry = entries[index];
this.set(entry[0], entry[1]);
}
}
var listCacheClear = __webpack_require__(865), listCacheDelete = __webpack_require__(866), listCacheGet = __webpack_require__(867), listCacheHas = __webpack_require__(868), listCacheSet = __webpack_require__(869);
ListCache.prototype.clear = listCacheClear, ListCache.prototype.delete = listCacheDelete, 
ListCache.prototype.get = listCacheGet, ListCache.prototype.has = listCacheHas, 
ListCache.prototype.set = listCacheSet, module.exports = ListCache;
}, function(module, exports, __webpack_require__) {
function assocIndexOf(array, key) {
for (var length = array.length; length--; ) if (eq(array[length][0], key)) return length;
return -1;
}
var eq = __webpack_require__(885);
module.exports = assocIndexOf;
}, function(module, exports, __webpack_require__) {
function getMapData(map, key) {
var data = map.__data__;
return isKeyable(key) ? data["string" == typeof key ? "string" : "hash"] : data.map;
}
var isKeyable = __webpack_require__(862);
module.exports = getMapData;
}, function(module, exports, __webpack_require__) {
function isKey(value, object) {
if (isArray(value)) return !1;
var type = typeof value;
return !("number" != type && "symbol" != type && "boolean" != type && null != value && !isSymbol(value)) || (reIsPlainProp.test(value) || !reIsDeepProp.test(value) || null != object && value in Object(object));
}
var isArray = __webpack_require__(42), isSymbol = __webpack_require__(178), reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
module.exports = isKey;
}, function(module, exports, __webpack_require__) {
var getNative = __webpack_require__(107), nativeCreate = getNative(Object, "create");
module.exports = nativeCreate;
}, function(module, exports, __webpack_require__) {
function isArrayLike(value) {
return null != value && isLength(getLength(value)) && !isFunction(value);
}
var getLength = __webpack_require__(848), isFunction = __webpack_require__(261), isLength = __webpack_require__(176);
module.exports = isArrayLike;
}, function(module, exports) {
function isLength(value) {
return "number" == typeof value && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
var MAX_SAFE_INTEGER = 9007199254740991;
module.exports = isLength;
}, , function(module, exports, __webpack_require__) {
function isSymbol(value) {
return "symbol" == typeof value || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
var isObjectLike = __webpack_require__(108), symbolTag = "[object Symbol]", objectProto = Object.prototype, objectToString = objectProto.toString;
module.exports = isSymbol;
}, [ 1140, 911, 400, 265 ], [ 1141, 265 ], 24, [ 1180, 410, 268 ], 85, [ 1184, 72, 93, 34 ], [ 1193, 266 ], 89, function(module, exports, __webpack_require__) {
var isObject = __webpack_require__(190);
module.exports = function(it) {
if (!isObject(it)) throw TypeError(it + " is not an object!");
return it;
};
}, function(module, exports) {
var core = module.exports = {
version: "2.1.4"
};
"number" == typeof __e && (__e = core);
}, function(module, exports) {
module.exports = function(exec) {
try {
return !!exec();
} catch (e) {
return !0;
}
};
}, function(module, exports) {
module.exports = function(it) {
return "object" == typeof it ? null !== it : "function" == typeof it;
};
}, function(module, exports, __webpack_require__) {
var store = __webpack_require__(284)("wks"), uid = __webpack_require__(138), Symbol = __webpack_require__(95).Symbol, USE_SYMBOL = "function" == typeof Symbol;
module.exports = function(name) {
return store[name] || (store[name] = USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)("Symbol." + name));
};
}, function(module, exports) {
"use strict";
exports.default = function(instance, Constructor) {
if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}, exports.__esModule = !0;
}, function(module, exports, __webpack_require__) {
"use strict";
var _Object$defineProperty = __webpack_require__(434).default;
exports.default = function() {
function defineProperties(target, props) {
for (var i = 0; i < props.length; i++) {
var descriptor = props[i];
descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
"value" in descriptor && (descriptor.writable = !0), _Object$defineProperty(target, descriptor.key, descriptor);
}
}
return function(Constructor, protoProps, staticProps) {
return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), 
Constructor;
};
}(), exports.__esModule = !0;
}, function(module, exports, __webpack_require__) {
"use strict";
var _Object$assign = __webpack_require__(1004).default;
exports.default = _Object$assign || function(target) {
for (var i = 1; i < arguments.length; i++) {
var source = arguments[i];
for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
}
return target;
}, exports.__esModule = !0;
}, function(module, exports, __webpack_require__) {
"use strict";
var _Object$getOwnPropertyDescriptor = __webpack_require__(1006).default;
exports.default = function get(_x, _x2, _x3) {
for (var _again = !0; _again; ) {
var object = _x, property = _x2, receiver = _x3;
_again = !1, null === object && (object = Function.prototype);
var desc = _Object$getOwnPropertyDescriptor(object, property);
if (void 0 !== desc) {
if ("value" in desc) return desc.value;
var getter = desc.get;
if (void 0 === getter) return;
return getter.call(receiver);
}
var parent = Object.getPrototypeOf(object);
if (null === parent) return;
_x = parent, _x2 = property, _x3 = receiver, _again = !0, desc = parent = void 0;
}
}, exports.__esModule = !0;
}, function(module, exports, __webpack_require__) {
"use strict";
var _Object$create = __webpack_require__(1005).default, _Object$setPrototypeOf = __webpack_require__(1007).default;
exports.default = function(subClass, superClass) {
if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
subClass.prototype = _Object$create(superClass && superClass.prototype, {
constructor: {
value: subClass,
enumerable: !1,
writable: !0,
configurable: !0
}
}), superClass && (_Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
}, exports.__esModule = !0;
}, function(module, exports) {
var core = module.exports = {
version: "1.2.6"
};
"number" == typeof __e && (__e = core);
}, , , , , , , , , , function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function updateEventsCompleted(options, dates) {
return {
type: UPDATE_EVENTS_COMPLETED,
options: options,
dates: dates
};
}
function updateEvents(options) {
return function(dispatch, getState) {
var state = getState();
options = options || {};
var uri = null, token = null;
if (null == state.user.location) return void log.debug("updateEvents - skipping because no location");
var accountId = null, useApi = state.user.token && state.user.location.hasOwnProperty("id") && state.user.location.id;
if (useApi) {
if (null == state.user.orgs || 0 == _utils._.size(state.user.orgs)) return void console.info("skipping. no orgs");
accountId = state.user.default_org ? state.user.default_org : _utils._.keys(state.user.orgs)[0], 
state.user.orgs[accountId].hasOwnProperty("subscriptions") && state.user.orgs[accountId].subscriptions.hasOwnProperty("app_subscription") || (useApi = !1);
}
if (useApi) {
uri = new _youarei2.default(_config2.default.phq.url + "/v1/accounts/" + accountId + "/events/calendar/");
var currentDate = options.date || (0, _moment2.default)(getState().ui_state.current_day), startDate = currentDate.clone().subtract(4, "days"), endDate = currentDate.clone().add(7, "days"), category = _config2.default.event.categories, params = {
"active.from": startDate.format("YYYY-MM-DD"),
"active.to": endDate.format("YYYY-MM-DD"),
"active.tz": state.user.location.tz,
"top_events.limit": 10,
"top_events.sort": "rank",
rank_level: "2,3,4,5",
category: category.join(","),
"place.scope": state.user.location.id
};
log.debug(params), uri.query_push(params), token = state.user.token;
} else {
if (!state.user.location.hasOwnProperty("id") || !state.user.location.id) return dispatch(updateEventsCompleted(options, []));
var location = state.user.location.id, tz = (state.user.location.tz || "America/New_York").replace("/", ".").toLowerCase(), offset = (0, 
_moment2.default)(state.ui_state.current_day).diff((0, _moment2.default)(), "days");
offset < 0 && (offset += -2), uri = new _youarei2.default(_config2.default.focus.url + _config2.default.focus.events + (location + "/" + tz + "/")), 
uri.query_set({
offset: offset
});
}
fetch(uri.to_string(), {
method: "get",
headers: {
Authorization: "Bearer " + token,
Accept: "application/json"
}
}).then(function(response) {
return response.json();
}).then(function(data) {
setTimeout(function() {
return dispatch(updateEventsCompleted(options, data.results));
}, 0);
}).catch(function(err) {
console.error("err", err);
});
};
}
function shouldUpdateEvents(events) {
if (events.lastCheckStatus !== !0 || null == events.lastCheck) return log.debug("shouldUpdateEvents - no lastCheck"), 
!0;
var lastCheck = _moment2.default.duration((0, _moment2.default)().diff((0, _moment2.default)(events.lastCheck)));
return lastCheck.asDays() >= 2 ? (log.debug("shouldUpdateEvents.lastCheck", parseFloat(lastCheck.asHours()).toFixed(2) + " hours ago"), 
!0) : 0 == _utils._.size(events.items);
}
function updateEventsIfRequired(options) {
return function(dispatch, getState) {
return shouldUpdateEvents(options.events) ? dispatch(updateEvents({
purge_before: (0, _moment2.default)().subtract(14, "days")
})) : void log.debug("updateEventsIfRequired - not required");
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.UPDATE_EVENTS_COMPLETED = void 0, exports.updateEventsCompleted = updateEventsCompleted, 
exports.updateEvents = updateEvents, exports.updateEventsIfRequired = updateEventsIfRequired;
var _utils = __webpack_require__(17), _moment = __webpack_require__(25), _moment2 = _interopRequireDefault(_moment), _youarei = __webpack_require__(309), _youarei2 = _interopRequireDefault(_youarei), _config = __webpack_require__(56), _config2 = _interopRequireDefault(_config), _client = __webpack_require__(311), UPDATE_EVENTS_COMPLETED = (_interopRequireDefault(_client), 
exports.UPDATE_EVENTS_COMPLETED = "UPDATE_EVENTS_COMPLETED"), log = _utils.logger.getLogger("actions.event");
log.setLevel("DEBUG");
}, 45, 51, 229, [ 1172, 98, 556, 210, 215, 322, 550 ], [ 1180, 329, 210 ], 124, [ 1184, 79, 78, 57 ], [ 1185, 216, 153 ], [ 1186, 30, 65, 151 ], 49, [ 1193, 209 ], [ 1194, 101 ], [ 1196, 65, 30, 151, 221, 79 ], [ 1197, 57 ], [ 1207, 560, 324 ], [ 1150, 566, 65, 100, 121, 57 ], , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
"use strict";
var Validator = module.exports.Validator = __webpack_require__(800);
module.exports.ValidatorResult = __webpack_require__(127).ValidatorResult, module.exports.ValidationError = __webpack_require__(127).ValidationError, 
module.exports.SchemaError = __webpack_require__(127).SchemaError, module.exports.validate = function(instance, schema, options) {
var v = new Validator();
return v.validate(instance, schema, options);
};
}, function(module, exports, __webpack_require__) {
function MapCache(entries) {
var index = -1, length = entries ? entries.length : 0;
for (this.clear(); ++index < length; ) {
var entry = entries[index];
this.set(entry[0], entry[1]);
}
}
var mapCacheClear = __webpack_require__(870), mapCacheDelete = __webpack_require__(871), mapCacheGet = __webpack_require__(872), mapCacheHas = __webpack_require__(873), mapCacheSet = __webpack_require__(874);
MapCache.prototype.clear = mapCacheClear, MapCache.prototype.delete = mapCacheDelete, 
MapCache.prototype.get = mapCacheGet, MapCache.prototype.has = mapCacheHas, MapCache.prototype.set = mapCacheSet, 
module.exports = MapCache;
}, function(module, exports) {
function arrayMap(array, iteratee) {
for (var index = -1, length = array ? array.length : 0, result = Array(length); ++index < length; ) result[index] = iteratee(array[index], index, array);
return result;
}
module.exports = arrayMap;
}, function(module, exports) {
function arrayPush(array, values) {
for (var index = -1, length = values.length, offset = array.length; ++index < length; ) array[offset + index] = values[index];
return array;
}
module.exports = arrayPush;
}, function(module, exports, __webpack_require__) {
var baseForOwn = __webpack_require__(379), createBaseEach = __webpack_require__(844), baseEach = createBaseEach(baseForOwn);
module.exports = baseEach;
}, , , function(module, exports) {
function isIndex(value, length) {
return length = null == length ? MAX_SAFE_INTEGER : length, !!length && ("number" == typeof value || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
var MAX_SAFE_INTEGER = 9007199254740991, reIsUint = /^(?:0|[1-9]\d*)$/;
module.exports = isIndex;
}, function(module, exports, __webpack_require__) {
function isArguments(value) {
return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
}
var isArrayLikeObject = __webpack_require__(890), argsTag = "[object Arguments]", objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty, objectToString = objectProto.toString, propertyIsEnumerable = objectProto.propertyIsEnumerable;
module.exports = isArguments;
}, function(module, exports, __webpack_require__) {
function isFunction(value) {
var tag = isObject(value) ? objectToString.call(value) : "";
return tag == funcTag || tag == genTag;
}
var isObject = __webpack_require__(130), funcTag = "[object Function]", genTag = "[object GeneratorFunction]", objectProto = Object.prototype, objectToString = objectProto.toString;
module.exports = isFunction;
}, function(module, exports, __webpack_require__) {
function keys(object) {
var isProto = isPrototype(object);
if (!isProto && !isArrayLike(object)) return baseKeys(object);
var indexes = indexKeys(object), skipIndexes = !!indexes, result = indexes || [], length = result.length;
for (var key in object) !baseHas(object, key) || skipIndexes && ("length" == key || isIndex(key, length)) || isProto && "constructor" == key || result.push(key);
return result;
}
var baseHas = __webpack_require__(381), baseKeys = __webpack_require__(830), indexKeys = __webpack_require__(387), isArrayLike = __webpack_require__(175), isIndex = __webpack_require__(259), isPrototype = __webpack_require__(388);
module.exports = keys;
}, , function(module, exports, __webpack_require__) {
module.exports = {
"default": __webpack_require__(919),
__esModule: !0
};
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
exports.__esModule = !0;
var _iterator = __webpack_require__(401), _iterator2 = _interopRequireDefault(_iterator), _symbol = __webpack_require__(912), _symbol2 = _interopRequireDefault(_symbol), _typeof = "function" == typeof _symbol2.default && "symbol" == typeof _iterator2.default ? function(obj) {
return typeof obj;
} : function(obj) {
return obj && "function" == typeof _symbol2.default && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj;
};
exports.default = "function" == typeof _symbol2.default && "symbol" === _typeof(_iterator2.default) ? function(obj) {
return "undefined" == typeof obj ? "undefined" : _typeof(obj);
} : function(obj) {
return obj && "function" == typeof _symbol2.default && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : "undefined" == typeof obj ? "undefined" : _typeof(obj);
};
}, 51, [ 1156, 71, 28 ], 229, [ 1171, 181 ], [ 1172, 61, 937, 268, 272, 267, 403 ], 124, [ 1185, 273, 186 ], [ 1186, 19, 28, 136 ], 49, [ 1194, 71 ], [ 1196, 28, 19, 136, 277, 72 ], [ 1197, 34 ], function(module, exports) {
var toString = {}.toString;
module.exports = function(it) {
return toString.call(it).slice(8, -1);
};
}, function(module, exports) {
module.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
}, function(module, exports, __webpack_require__) {
var $keys = __webpack_require__(427), enumBugKeys = __webpack_require__(279);
module.exports = Object.keys || function keys(O) {
return $keys(O, enumBugKeys);
};
}, function(module, exports) {
exports.f = {}.propertyIsEnumerable;
}, function(module, exports) {
module.exports = function(bitmap, value) {
return {
enumerable: !(1 & bitmap),
configurable: !(2 & bitmap),
writable: !(4 & bitmap),
value: value
};
};
}, function(module, exports, __webpack_require__) {
var global = __webpack_require__(95), hide = __webpack_require__(423), has = __webpack_require__(111), SRC = __webpack_require__(138)("src"), TO_STRING = "toString", $toString = Function[TO_STRING], TPL = ("" + $toString).split(TO_STRING);
__webpack_require__(188).inspectSource = function(it) {
return $toString.call(it);
}, (module.exports = function(O, key, val, safe) {
var isFunction = "function" == typeof val;
isFunction && (has(val, "name") || hide(val, "name", key)), O[key] !== val && (isFunction && (has(val, SRC) || hide(val, SRC, O[key] ? "" + O[key] : TPL.join(String(key)))), 
O === global ? O[key] = val : safe ? O[key] ? O[key] = val : hide(O, key, val) : (delete O[key], 
hide(O, key, val)));
})(Function.prototype, TO_STRING, function toString() {
return "function" == typeof this && this[SRC] || $toString.call(this);
});
}, function(module, exports, __webpack_require__) {
var global = __webpack_require__(95), SHARED = "__core-js_shared__", store = global[SHARED] || (global[SHARED] = {});
module.exports = function(key) {
return store[key] || (store[key] = {});
};
}, function(module, exports, __webpack_require__) {
var isObject = __webpack_require__(190);
module.exports = function(it, S) {
if (!isObject(it)) return it;
var fn, val;
if (S && "function" == typeof (fn = it.toString) && !isObject(val = fn.call(it))) return val;
if ("function" == typeof (fn = it.valueOf) && !isObject(val = fn.call(it))) return val;
if (!S && "function" == typeof (fn = it.toString) && !isObject(val = fn.call(it))) return val;
throw TypeError("Can't convert object to primitive value");
};
}, , function(module, exports, __webpack_require__) {
var global = __webpack_require__(1017), core = __webpack_require__(197), ctx = __webpack_require__(436), PROTOTYPE = "prototype", $export = function(type, name, source) {
var key, own, out, IS_FORCED = type & $export.F, IS_GLOBAL = type & $export.G, IS_STATIC = type & $export.S, IS_PROTO = type & $export.P, IS_BIND = type & $export.B, IS_WRAP = type & $export.W, exports = IS_GLOBAL ? core : core[name] || (core[name] = {}), target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
IS_GLOBAL && (source = name);
for (key in source) own = !IS_FORCED && target && key in target, own && key in exports || (out = own ? target[key] : source[key], 
exports[key] = IS_GLOBAL && "function" != typeof target[key] ? source[key] : IS_BIND && own ? ctx(out, global) : IS_WRAP && target[key] == out ? function(C) {
var F = function(param) {
return this instanceof C ? new C(param) : C(param);
};
return F[PROTOTYPE] = C[PROTOTYPE], F;
}(out) : IS_PROTO && "function" == typeof out ? ctx(Function.call, out) : out, IS_PROTO && ((exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out));
};
$export.F = 1, $export.G = 2, $export.S = 4, $export.P = 8, $export.B = 16, $export.W = 32, 
module.exports = $export;
}, , , , , , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
(function() {
function createReduce(dir) {
function iterator(obj, iteratee, memo, keys, index, length) {
for (;index >= 0 && index < length; index += dir) {
var currentKey = keys ? keys[index] : index;
memo = iteratee(memo, obj[currentKey], currentKey, obj);
}
return memo;
}
return function(obj, iteratee, memo, context) {
iteratee = optimizeCb(iteratee, context, 4);
var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, index = dir > 0 ? 0 : length - 1;
return arguments.length < 3 && (memo = obj[keys ? keys[index] : index], index += dir), 
iterator(obj, iteratee, memo, keys, index, length);
};
}
function createPredicateIndexFinder(dir) {
return function(array, predicate, context) {
predicate = cb(predicate, context);
for (var length = getLength(array), index = dir > 0 ? 0 : length - 1; index >= 0 && index < length; index += dir) if (predicate(array[index], index, array)) return index;
return -1;
};
}
function createIndexFinder(dir, predicateFind, sortedIndex) {
return function(array, item, idx) {
var i = 0, length = getLength(array);
if ("number" == typeof idx) dir > 0 ? i = idx >= 0 ? idx : Math.max(idx + length, i) : length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1; else if (sortedIndex && idx && length) return idx = sortedIndex(array, item), 
array[idx] === item ? idx : -1;
if (item !== item) return idx = predicateFind(slice.call(array, i, length), _.isNaN), 
idx >= 0 ? idx + i : -1;
for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) if (array[idx] === item) return idx;
return -1;
};
}
function collectNonEnumProps(obj, keys) {
var nonEnumIdx = nonEnumerableProps.length, constructor = obj.constructor, proto = _.isFunction(constructor) && constructor.prototype || ObjProto, prop = "constructor";
for (_.has(obj, prop) && !_.contains(keys, prop) && keys.push(prop); nonEnumIdx--; ) prop = nonEnumerableProps[nonEnumIdx], 
prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop) && keys.push(prop);
}
var root = this, previousUnderscore = root._, ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype, push = ArrayProto.push, slice = ArrayProto.slice, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty, nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind, nativeCreate = Object.create, Ctor = function() {}, _ = function(obj) {
return obj instanceof _ ? obj : this instanceof _ ? void (this._wrapped = obj) : new _(obj);
};
"undefined" != typeof module && module.exports && (exports = module.exports = _), 
exports._ = _, _.VERSION = "1.8.3";
var optimizeCb = function(func, context, argCount) {
if (void 0 === context) return func;
switch (null == argCount ? 3 : argCount) {
case 1:
return function(value) {
return func.call(context, value);
};

case 2:
return function(value, other) {
return func.call(context, value, other);
};

case 3:
return function(value, index, collection) {
return func.call(context, value, index, collection);
};

case 4:
return function(accumulator, value, index, collection) {
return func.call(context, accumulator, value, index, collection);
};
}
return function() {
return func.apply(context, arguments);
};
}, cb = function(value, context, argCount) {
return null == value ? _.identity : _.isFunction(value) ? optimizeCb(value, context, argCount) : _.isObject(value) ? _.matcher(value) : _.property(value);
};
_.iteratee = function(value, context) {
return cb(value, context, 1 / 0);
};
var createAssigner = function(keysFunc, undefinedOnly) {
return function(obj) {
var length = arguments.length;
if (length < 2 || null == obj) return obj;
for (var index = 1; index < length; index++) for (var source = arguments[index], keys = keysFunc(source), l = keys.length, i = 0; i < l; i++) {
var key = keys[i];
undefinedOnly && void 0 !== obj[key] || (obj[key] = source[key]);
}
return obj;
};
}, baseCreate = function(prototype) {
if (!_.isObject(prototype)) return {};
if (nativeCreate) return nativeCreate(prototype);
Ctor.prototype = prototype;
var result = new Ctor();
return Ctor.prototype = null, result;
}, property = function(key) {
return function(obj) {
return null == obj ? void 0 : obj[key];
};
}, MAX_ARRAY_INDEX = Math.pow(2, 53) - 1, getLength = property("length"), isArrayLike = function(collection) {
var length = getLength(collection);
return "number" == typeof length && length >= 0 && length <= MAX_ARRAY_INDEX;
};
_.each = _.forEach = function(obj, iteratee, context) {
iteratee = optimizeCb(iteratee, context);
var i, length;
if (isArrayLike(obj)) for (i = 0, length = obj.length; i < length; i++) iteratee(obj[i], i, obj); else {
var keys = _.keys(obj);
for (i = 0, length = keys.length; i < length; i++) iteratee(obj[keys[i]], keys[i], obj);
}
return obj;
}, _.map = _.collect = function(obj, iteratee, context) {
iteratee = cb(iteratee, context);
for (var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, results = Array(length), index = 0; index < length; index++) {
var currentKey = keys ? keys[index] : index;
results[index] = iteratee(obj[currentKey], currentKey, obj);
}
return results;
}, _.reduce = _.foldl = _.inject = createReduce(1), _.reduceRight = _.foldr = createReduce(-1), 
_.find = _.detect = function(obj, predicate, context) {
var key;
if (key = isArrayLike(obj) ? _.findIndex(obj, predicate, context) : _.findKey(obj, predicate, context), 
void 0 !== key && key !== -1) return obj[key];
}, _.filter = _.select = function(obj, predicate, context) {
var results = [];
return predicate = cb(predicate, context), _.each(obj, function(value, index, list) {
predicate(value, index, list) && results.push(value);
}), results;
}, _.reject = function(obj, predicate, context) {
return _.filter(obj, _.negate(cb(predicate)), context);
}, _.every = _.all = function(obj, predicate, context) {
predicate = cb(predicate, context);
for (var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, index = 0; index < length; index++) {
var currentKey = keys ? keys[index] : index;
if (!predicate(obj[currentKey], currentKey, obj)) return !1;
}
return !0;
}, _.some = _.any = function(obj, predicate, context) {
predicate = cb(predicate, context);
for (var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, index = 0; index < length; index++) {
var currentKey = keys ? keys[index] : index;
if (predicate(obj[currentKey], currentKey, obj)) return !0;
}
return !1;
}, _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
return isArrayLike(obj) || (obj = _.values(obj)), ("number" != typeof fromIndex || guard) && (fromIndex = 0), 
_.indexOf(obj, item, fromIndex) >= 0;
}, _.invoke = function(obj, method) {
var args = slice.call(arguments, 2), isFunc = _.isFunction(method);
return _.map(obj, function(value) {
var func = isFunc ? method : value[method];
return null == func ? func : func.apply(value, args);
});
}, _.pluck = function(obj, key) {
return _.map(obj, _.property(key));
}, _.where = function(obj, attrs) {
return _.filter(obj, _.matcher(attrs));
}, _.findWhere = function(obj, attrs) {
return _.find(obj, _.matcher(attrs));
}, _.max = function(obj, iteratee, context) {
var value, computed, result = -(1 / 0), lastComputed = -(1 / 0);
if (null == iteratee && null != obj) {
obj = isArrayLike(obj) ? obj : _.values(obj);
for (var i = 0, length = obj.length; i < length; i++) value = obj[i], value > result && (result = value);
} else iteratee = cb(iteratee, context), _.each(obj, function(value, index, list) {
computed = iteratee(value, index, list), (computed > lastComputed || computed === -(1 / 0) && result === -(1 / 0)) && (result = value, 
lastComputed = computed);
});
return result;
}, _.min = function(obj, iteratee, context) {
var value, computed, result = 1 / 0, lastComputed = 1 / 0;
if (null == iteratee && null != obj) {
obj = isArrayLike(obj) ? obj : _.values(obj);
for (var i = 0, length = obj.length; i < length; i++) value = obj[i], value < result && (result = value);
} else iteratee = cb(iteratee, context), _.each(obj, function(value, index, list) {
computed = iteratee(value, index, list), (computed < lastComputed || computed === 1 / 0 && result === 1 / 0) && (result = value, 
lastComputed = computed);
});
return result;
}, _.shuffle = function(obj) {
for (var rand, set = isArrayLike(obj) ? obj : _.values(obj), length = set.length, shuffled = Array(length), index = 0; index < length; index++) rand = _.random(0, index), 
rand !== index && (shuffled[index] = shuffled[rand]), shuffled[rand] = set[index];
return shuffled;
}, _.sample = function(obj, n, guard) {
return null == n || guard ? (isArrayLike(obj) || (obj = _.values(obj)), obj[_.random(obj.length - 1)]) : _.shuffle(obj).slice(0, Math.max(0, n));
}, _.sortBy = function(obj, iteratee, context) {
return iteratee = cb(iteratee, context), _.pluck(_.map(obj, function(value, index, list) {
return {
value: value,
index: index,
criteria: iteratee(value, index, list)
};
}).sort(function(left, right) {
var a = left.criteria, b = right.criteria;
if (a !== b) {
if (a > b || void 0 === a) return 1;
if (a < b || void 0 === b) return -1;
}
return left.index - right.index;
}), "value");
};
var group = function(behavior) {
return function(obj, iteratee, context) {
var result = {};
return iteratee = cb(iteratee, context), _.each(obj, function(value, index) {
var key = iteratee(value, index, obj);
behavior(result, value, key);
}), result;
};
};
_.groupBy = group(function(result, value, key) {
_.has(result, key) ? result[key].push(value) : result[key] = [ value ];
}), _.indexBy = group(function(result, value, key) {
result[key] = value;
}), _.countBy = group(function(result, value, key) {
_.has(result, key) ? result[key]++ : result[key] = 1;
}), _.toArray = function(obj) {
return obj ? _.isArray(obj) ? slice.call(obj) : isArrayLike(obj) ? _.map(obj, _.identity) : _.values(obj) : [];
}, _.size = function(obj) {
return null == obj ? 0 : isArrayLike(obj) ? obj.length : _.keys(obj).length;
}, _.partition = function(obj, predicate, context) {
predicate = cb(predicate, context);
var pass = [], fail = [];
return _.each(obj, function(value, key, obj) {
(predicate(value, key, obj) ? pass : fail).push(value);
}), [ pass, fail ];
}, _.first = _.head = _.take = function(array, n, guard) {
if (null != array) return null == n || guard ? array[0] : _.initial(array, array.length - n);
}, _.initial = function(array, n, guard) {
return slice.call(array, 0, Math.max(0, array.length - (null == n || guard ? 1 : n)));
}, _.last = function(array, n, guard) {
if (null != array) return null == n || guard ? array[array.length - 1] : _.rest(array, Math.max(0, array.length - n));
}, _.rest = _.tail = _.drop = function(array, n, guard) {
return slice.call(array, null == n || guard ? 1 : n);
}, _.compact = function(array) {
return _.filter(array, _.identity);
};
var flatten = function(input, shallow, strict, startIndex) {
for (var output = [], idx = 0, i = startIndex || 0, length = getLength(input); i < length; i++) {
var value = input[i];
if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
shallow || (value = flatten(value, shallow, strict));
var j = 0, len = value.length;
for (output.length += len; j < len; ) output[idx++] = value[j++];
} else strict || (output[idx++] = value);
}
return output;
};
_.flatten = function(array, shallow) {
return flatten(array, shallow, !1);
}, _.without = function(array) {
return _.difference(array, slice.call(arguments, 1));
}, _.uniq = _.unique = function(array, isSorted, iteratee, context) {
_.isBoolean(isSorted) || (context = iteratee, iteratee = isSorted, isSorted = !1), 
null != iteratee && (iteratee = cb(iteratee, context));
for (var result = [], seen = [], i = 0, length = getLength(array); i < length; i++) {
var value = array[i], computed = iteratee ? iteratee(value, i, array) : value;
isSorted ? (i && seen === computed || result.push(value), seen = computed) : iteratee ? _.contains(seen, computed) || (seen.push(computed), 
result.push(value)) : _.contains(result, value) || result.push(value);
}
return result;
}, _.union = function() {
return _.uniq(flatten(arguments, !0, !0));
}, _.intersection = function(array) {
for (var result = [], argsLength = arguments.length, i = 0, length = getLength(array); i < length; i++) {
var item = array[i];
if (!_.contains(result, item)) {
for (var j = 1; j < argsLength && _.contains(arguments[j], item); j++) ;
j === argsLength && result.push(item);
}
}
return result;
}, _.difference = function(array) {
var rest = flatten(arguments, !0, !0, 1);
return _.filter(array, function(value) {
return !_.contains(rest, value);
});
}, _.zip = function() {
return _.unzip(arguments);
}, _.unzip = function(array) {
for (var length = array && _.max(array, getLength).length || 0, result = Array(length), index = 0; index < length; index++) result[index] = _.pluck(array, index);
return result;
}, _.object = function(list, values) {
for (var result = {}, i = 0, length = getLength(list); i < length; i++) values ? result[list[i]] = values[i] : result[list[i][0]] = list[i][1];
return result;
}, _.findIndex = createPredicateIndexFinder(1), _.findLastIndex = createPredicateIndexFinder(-1), 
_.sortedIndex = function(array, obj, iteratee, context) {
iteratee = cb(iteratee, context, 1);
for (var value = iteratee(obj), low = 0, high = getLength(array); low < high; ) {
var mid = Math.floor((low + high) / 2);
iteratee(array[mid]) < value ? low = mid + 1 : high = mid;
}
return low;
}, _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex), _.lastIndexOf = createIndexFinder(-1, _.findLastIndex), 
_.range = function(start, stop, step) {
null == stop && (stop = start || 0, start = 0), step = step || 1;
for (var length = Math.max(Math.ceil((stop - start) / step), 0), range = Array(length), idx = 0; idx < length; idx++, 
start += step) range[idx] = start;
return range;
};
var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
var self = baseCreate(sourceFunc.prototype), result = sourceFunc.apply(self, args);
return _.isObject(result) ? result : self;
};
_.bind = function(func, context) {
if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
if (!_.isFunction(func)) throw new TypeError("Bind must be called on a function");
var args = slice.call(arguments, 2), bound = function() {
return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
};
return bound;
}, _.partial = function(func) {
var boundArgs = slice.call(arguments, 1), bound = function() {
for (var position = 0, length = boundArgs.length, args = Array(length), i = 0; i < length; i++) args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
for (;position < arguments.length; ) args.push(arguments[position++]);
return executeBound(func, bound, this, this, args);
};
return bound;
}, _.bindAll = function(obj) {
var i, key, length = arguments.length;
if (length <= 1) throw new Error("bindAll must be passed function names");
for (i = 1; i < length; i++) key = arguments[i], obj[key] = _.bind(obj[key], obj);
return obj;
}, _.memoize = function(func, hasher) {
var memoize = function(key) {
var cache = memoize.cache, address = "" + (hasher ? hasher.apply(this, arguments) : key);
return _.has(cache, address) || (cache[address] = func.apply(this, arguments)), 
cache[address];
};
return memoize.cache = {}, memoize;
}, _.delay = function(func, wait) {
var args = slice.call(arguments, 2);
return setTimeout(function() {
return func.apply(null, args);
}, wait);
}, _.defer = _.partial(_.delay, _, 1), _.throttle = function(func, wait, options) {
var context, args, result, timeout = null, previous = 0;
options || (options = {});
var later = function() {
previous = options.leading === !1 ? 0 : _.now(), timeout = null, result = func.apply(context, args), 
timeout || (context = args = null);
};
return function() {
var now = _.now();
previous || options.leading !== !1 || (previous = now);
var remaining = wait - (now - previous);
return context = this, args = arguments, remaining <= 0 || remaining > wait ? (timeout && (clearTimeout(timeout), 
timeout = null), previous = now, result = func.apply(context, args), timeout || (context = args = null)) : timeout || options.trailing === !1 || (timeout = setTimeout(later, remaining)), 
result;
};
}, _.debounce = function(func, wait, immediate) {
var timeout, args, context, timestamp, result, later = function() {
var last = _.now() - timestamp;
last < wait && last >= 0 ? timeout = setTimeout(later, wait - last) : (timeout = null, 
immediate || (result = func.apply(context, args), timeout || (context = args = null)));
};
return function() {
context = this, args = arguments, timestamp = _.now();
var callNow = immediate && !timeout;
return timeout || (timeout = setTimeout(later, wait)), callNow && (result = func.apply(context, args), 
context = args = null), result;
};
}, _.wrap = function(func, wrapper) {
return _.partial(wrapper, func);
}, _.negate = function(predicate) {
return function() {
return !predicate.apply(this, arguments);
};
}, _.compose = function() {
var args = arguments, start = args.length - 1;
return function() {
for (var i = start, result = args[start].apply(this, arguments); i--; ) result = args[i].call(this, result);
return result;
};
}, _.after = function(times, func) {
return function() {
if (--times < 1) return func.apply(this, arguments);
};
}, _.before = function(times, func) {
var memo;
return function() {
return --times > 0 && (memo = func.apply(this, arguments)), times <= 1 && (func = null), 
memo;
};
}, _.once = _.partial(_.before, 2);
var hasEnumBug = !{
toString: null
}.propertyIsEnumerable("toString"), nonEnumerableProps = [ "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString" ];
_.keys = function(obj) {
if (!_.isObject(obj)) return [];
if (nativeKeys) return nativeKeys(obj);
var keys = [];
for (var key in obj) _.has(obj, key) && keys.push(key);
return hasEnumBug && collectNonEnumProps(obj, keys), keys;
}, _.allKeys = function(obj) {
if (!_.isObject(obj)) return [];
var keys = [];
for (var key in obj) keys.push(key);
return hasEnumBug && collectNonEnumProps(obj, keys), keys;
}, _.values = function(obj) {
for (var keys = _.keys(obj), length = keys.length, values = Array(length), i = 0; i < length; i++) values[i] = obj[keys[i]];
return values;
}, _.mapObject = function(obj, iteratee, context) {
iteratee = cb(iteratee, context);
for (var currentKey, keys = _.keys(obj), length = keys.length, results = {}, index = 0; index < length; index++) currentKey = keys[index], 
results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
return results;
}, _.pairs = function(obj) {
for (var keys = _.keys(obj), length = keys.length, pairs = Array(length), i = 0; i < length; i++) pairs[i] = [ keys[i], obj[keys[i]] ];
return pairs;
}, _.invert = function(obj) {
for (var result = {}, keys = _.keys(obj), i = 0, length = keys.length; i < length; i++) result[obj[keys[i]]] = keys[i];
return result;
}, _.functions = _.methods = function(obj) {
var names = [];
for (var key in obj) _.isFunction(obj[key]) && names.push(key);
return names.sort();
}, _.extend = createAssigner(_.allKeys), _.extendOwn = _.assign = createAssigner(_.keys), 
_.findKey = function(obj, predicate, context) {
predicate = cb(predicate, context);
for (var key, keys = _.keys(obj), i = 0, length = keys.length; i < length; i++) if (key = keys[i], 
predicate(obj[key], key, obj)) return key;
}, _.pick = function(object, oiteratee, context) {
var iteratee, keys, result = {}, obj = object;
if (null == obj) return result;
_.isFunction(oiteratee) ? (keys = _.allKeys(obj), iteratee = optimizeCb(oiteratee, context)) : (keys = flatten(arguments, !1, !1, 1), 
iteratee = function(value, key, obj) {
return key in obj;
}, obj = Object(obj));
for (var i = 0, length = keys.length; i < length; i++) {
var key = keys[i], value = obj[key];
iteratee(value, key, obj) && (result[key] = value);
}
return result;
}, _.omit = function(obj, iteratee, context) {
if (_.isFunction(iteratee)) iteratee = _.negate(iteratee); else {
var keys = _.map(flatten(arguments, !1, !1, 1), String);
iteratee = function(value, key) {
return !_.contains(keys, key);
};
}
return _.pick(obj, iteratee, context);
}, _.defaults = createAssigner(_.allKeys, !0), _.create = function(prototype, props) {
var result = baseCreate(prototype);
return props && _.extendOwn(result, props), result;
}, _.clone = function(obj) {
return _.isObject(obj) ? _.isArray(obj) ? obj.slice() : _.extend({}, obj) : obj;
}, _.tap = function(obj, interceptor) {
return interceptor(obj), obj;
}, _.isMatch = function(object, attrs) {
var keys = _.keys(attrs), length = keys.length;
if (null == object) return !length;
for (var obj = Object(object), i = 0; i < length; i++) {
var key = keys[i];
if (attrs[key] !== obj[key] || !(key in obj)) return !1;
}
return !0;
};
var eq = function(a, b, aStack, bStack) {
if (a === b) return 0 !== a || 1 / a === 1 / b;
if (null == a || null == b) return a === b;
a instanceof _ && (a = a._wrapped), b instanceof _ && (b = b._wrapped);
var className = toString.call(a);
if (className !== toString.call(b)) return !1;
switch (className) {
case "[object RegExp]":
case "[object String]":
return "" + a == "" + b;

case "[object Number]":
return +a !== +a ? +b !== +b : 0 === +a ? 1 / +a === 1 / b : +a === +b;

case "[object Date]":
case "[object Boolean]":
return +a === +b;
}
var areArrays = "[object Array]" === className;
if (!areArrays) {
if ("object" != typeof a || "object" != typeof b) return !1;
var aCtor = a.constructor, bCtor = b.constructor;
if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b) return !1;
}
aStack = aStack || [], bStack = bStack || [];
for (var length = aStack.length; length--; ) if (aStack[length] === a) return bStack[length] === b;
if (aStack.push(a), bStack.push(b), areArrays) {
if (length = a.length, length !== b.length) return !1;
for (;length--; ) if (!eq(a[length], b[length], aStack, bStack)) return !1;
} else {
var key, keys = _.keys(a);
if (length = keys.length, _.keys(b).length !== length) return !1;
for (;length--; ) if (key = keys[length], !_.has(b, key) || !eq(a[key], b[key], aStack, bStack)) return !1;
}
return aStack.pop(), bStack.pop(), !0;
};
_.isEqual = function(a, b) {
return eq(a, b);
}, _.isEmpty = function(obj) {
return null == obj || (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) ? 0 === obj.length : 0 === _.keys(obj).length);
}, _.isElement = function(obj) {
return !(!obj || 1 !== obj.nodeType);
}, _.isArray = nativeIsArray || function(obj) {
return "[object Array]" === toString.call(obj);
}, _.isObject = function(obj) {
var type = typeof obj;
return "function" === type || "object" === type && !!obj;
}, _.each([ "Arguments", "Function", "String", "Number", "Date", "RegExp", "Error" ], function(name) {
_["is" + name] = function(obj) {
return toString.call(obj) === "[object " + name + "]";
};
}), _.isArguments(arguments) || (_.isArguments = function(obj) {
return _.has(obj, "callee");
}), "function" != typeof /./ && "object" != typeof Int8Array && (_.isFunction = function(obj) {
return "function" == typeof obj || !1;
}), _.isFinite = function(obj) {
return isFinite(obj) && !isNaN(parseFloat(obj));
}, _.isNaN = function(obj) {
return _.isNumber(obj) && obj !== +obj;
}, _.isBoolean = function(obj) {
return obj === !0 || obj === !1 || "[object Boolean]" === toString.call(obj);
}, _.isNull = function(obj) {
return null === obj;
}, _.isUndefined = function(obj) {
return void 0 === obj;
}, _.has = function(obj, key) {
return null != obj && hasOwnProperty.call(obj, key);
}, _.noConflict = function() {
return root._ = previousUnderscore, this;
}, _.identity = function(value) {
return value;
}, _.constant = function(value) {
return function() {
return value;
};
}, _.noop = function() {}, _.property = property, _.propertyOf = function(obj) {
return null == obj ? function() {} : function(key) {
return obj[key];
};
}, _.matcher = _.matches = function(attrs) {
return attrs = _.extendOwn({}, attrs), function(obj) {
return _.isMatch(obj, attrs);
};
}, _.times = function(n, iteratee, context) {
var accum = Array(Math.max(0, n));
iteratee = optimizeCb(iteratee, context, 1);
for (var i = 0; i < n; i++) accum[i] = iteratee(i);
return accum;
}, _.random = function(min, max) {
return null == max && (max = min, min = 0), min + Math.floor(Math.random() * (max - min + 1));
}, _.now = Date.now || function() {
return new Date().getTime();
};
var escapeMap = {
"&": "&amp;",
"<": "&lt;",
">": "&gt;",
'"': "&quot;",
"'": "&#x27;",
"`": "&#x60;"
}, unescapeMap = _.invert(escapeMap), createEscaper = function(map) {
var escaper = function(match) {
return map[match];
}, source = "(?:" + _.keys(map).join("|") + ")", testRegexp = RegExp(source), replaceRegexp = RegExp(source, "g");
return function(string) {
return string = null == string ? "" : "" + string, testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
};
};
_.escape = createEscaper(escapeMap), _.unescape = createEscaper(unescapeMap), _.result = function(object, property, fallback) {
var value = null == object ? void 0 : object[property];
return void 0 === value && (value = fallback), _.isFunction(value) ? value.call(object) : value;
};
var idCounter = 0;
_.uniqueId = function(prefix) {
var id = ++idCounter + "";
return prefix ? prefix + id : id;
}, _.templateSettings = {
evaluate: /<%([\s\S]+?)%>/g,
interpolate: /<%=([\s\S]+?)%>/g,
escape: /<%-([\s\S]+?)%>/g
};
var noMatch = /(.)^/, escapes = {
"'": "'",
"\\": "\\",
"\r": "r",
"\n": "n",
"\u2028": "u2028",
"\u2029": "u2029"
}, escaper = /\\|'|\r|\n|\u2028|\u2029/g, escapeChar = function(match) {
return "\\" + escapes[match];
};
_.template = function(text, settings, oldSettings) {
!settings && oldSettings && (settings = oldSettings), settings = _.defaults({}, settings, _.templateSettings);
var matcher = RegExp([ (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source ].join("|") + "|$", "g"), index = 0, source = "__p+='";
text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
return source += text.slice(index, offset).replace(escaper, escapeChar), index = offset + match.length, 
escape ? source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'" : interpolate ? source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'" : evaluate && (source += "';\n" + evaluate + "\n__p+='"), 
match;
}), source += "';\n", settings.variable || (source = "with(obj||{}){\n" + source + "}\n"), 
source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
try {
var render = new Function(settings.variable || "obj", "_", source);
} catch (e) {
throw e.source = source, e;
}
var template = function(data) {
return render.call(this, data, _);
}, argument = settings.variable || "obj";
return template.source = "function(" + argument + "){\n" + source + "}", template;
}, _.chain = function(obj) {
var instance = _(obj);
return instance._chain = !0, instance;
};
var result = function(instance, obj) {
return instance._chain ? _(obj).chain() : obj;
};
_.mixin = function(obj) {
_.each(_.functions(obj), function(name) {
var func = _[name] = obj[name];
_.prototype[name] = function() {
var args = [ this._wrapped ];
return push.apply(args, arguments), result(this, func.apply(_, args));
};
});
}, _.mixin(_), _.each([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ], function(name) {
var method = ArrayProto[name];
_.prototype[name] = function() {
var obj = this._wrapped;
return method.apply(obj, arguments), "shift" !== name && "splice" !== name || 0 !== obj.length || delete obj[0], 
result(this, obj);
};
}), _.each([ "concat", "join", "slice" ], function(name) {
var method = ArrayProto[name];
_.prototype[name] = function() {
return result(this, method.apply(this._wrapped, arguments));
};
}), _.prototype.value = function() {
return this._wrapped;
}, _.prototype.valueOf = _.prototype.toJSON = _.prototype.value, _.prototype.toString = function() {
return "" + this._wrapped;
}, __WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
return _;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), !(void 0 !== __WEBPACK_AMD_DEFINE_RESULT__ && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).call(this);
}, function(module, exports, __webpack_require__) {
(function(process) {
"use strict";
function freeze(object) {
return object;
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
"function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
return typeof obj;
} : function(obj) {
return obj && "function" == typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
};
exports.default = freeze;
}).call(exports, __webpack_require__(74));
}, function(module, exports, __webpack_require__) {
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;
!function(root, factory) {
__WEBPACK_AMD_DEFINE_FACTORY__ = factory, __WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module) : __WEBPACK_AMD_DEFINE_FACTORY__, 
!(void 0 !== __WEBPACK_AMD_DEFINE_RESULT__ && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}(this, function() {
function toCamel(str) {
return str.replace(/(\_[a-z])/g, function($1) {
return $1.toUpperCase().replace("_", "");
});
}
function YouAreI(uri) {
return this.parse(uri);
}
var uri_re = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/, auth_re = /^([^\@]+)\@/, port_re = /:(\d+)$/, qp_re = /^([^=]+)(?:=(.*))?$/, is_array = function(object) {
return "[object Array]" === Object.prototype.toString.call(object);
};
YouAreI.prototype = {
parse: function(uri) {
var f = uri ? uri.match(uri_re) : [];
return this.scheme(f[2] || "").authority(f[4] || "").path_set(f[5] || "").fragment(f[9] || "").query_set(f[7] || "");
},
clone: function() {
var copy = this.constructor();
for (var attr in this) copy[attr] = this[attr];
return copy;
},
gs: function(val, tar, fn) {
return void 0 !== val ? (this[tar] = val, this) : fn ? fn(this[tar]) : this[tar];
},
fragment: function(f) {
return this.gs(f, "_fragment");
},
user_info: function(f) {
return this.gs(f, "_userinfo", function(r) {
return void 0 === r ? r : encodeURI(r);
});
},
path_set: function(f) {
return this._path_parse(f), this;
},
path_basename_set: function(name) {
return this._path_trailing_slash ? (this._path.push(name), this._path_trailing_slash = !1) : this._path[this._path.length - 1] = name, 
this;
},
_path_parse: function(path) {
path = decodeURIComponent(path || "");
var spl = path.split("/");
return this._path_leading_slash = !1, this._path_trailing_slash = !1, path.match(/^\//) && (this._path_leading_slash = !0, 
spl.shift()), spl.length > 1 && path.match(/\/$/) && (this._path_trailing_slash = !0, 
spl.pop()), this._path = spl, spl;
},
path_to_string: function(opt_path) {
return path = (opt_path || this._path).join("/"), this._path_leading_slash && (path = "/" + path), 
this._path_trailing_slash && (path += "/"), path;
},
path_to_dir: function() {
var path = this._path;
return this._path_trailing_slash || (path.pop(), path.push("")), this.path_to_string(path);
},
path_parts: function(f) {
return this.gs(f, "_path");
},
scheme: function(f) {
return this.gs(f, "_scheme");
},
port: function(f) {
return this.gs(f, "_port");
},
host: function(f) {
return this.gs(f, "_host");
},
protocol: function() {
return this.scheme.toLowerCase();
},
authority: function(authority) {
var auth, port, userinfo;
return void 0 !== authority ? (this._authority = authority, (auth = authority.match(auth_re)) && (authority = authority.replace(auth_re, ""), 
this.user_info(auth[1])), (port = authority.match(port_re)) && (authority = authority.replace(port_re, ""), 
this.port(port[1])), this.host(authority), this) : (authority = "", (userinfo = this.user_info()) && (authority = userinfo + "@"), 
authority += this.host(), (port = this.port()) && (authority += ":" + port), authority);
},
to_string: function() {
var q = this.query_to_string(), f = this.fragment(), s = this.scheme();
return (s ? s + "://" : "") + this.authority() + this.path_to_string() + (q ? "?" + q : "") + (f ? "#" + f : "");
},
query_to_string: function() {
for (var pairs = [], n = this._query[0], v = this._query[1], i = 0; i < n.length; i++) pairs.push(encodeURIComponent(n[i]) + "=" + encodeURIComponent(v[i]));
return pairs.join("&");
},
query_get: function(limit) {
for (var dict = {}, opts = this._query, i = 0; i < opts[0].length; i++) {
var k = opts[0][i], v = opts[1][i];
limit && k !== limit || dict[k] || (dict[k] = v);
}
return limit ? dict[limit] : dict;
},
query_get_all: function(limit) {
for (var dict = {}, opts = this._query, i = 0; i < opts[0].length; i++) {
var k = opts[0][i], v = opts[1][i];
limit && k !== limit || (dict[k] ? dict[k].push(v) : dict[k] = [ v ]);
}
return limit ? dict[limit] : dict;
},
_query_parse: function(raw) {
for (var struct = [ [], [] ], pairs = raw.split(/&|;/), j = 0; j < pairs.length; j++) {
var pair = pairs[j], n_pair = pair.match(qp_re);
if (n_pair && "undefined" != typeof n_pair[n_pair.length - 1]) {
n_pair.shift();
for (var i = 0; i < n_pair.length; i++) {
var p = n_pair[i];
struct[i].push(decodeURIComponent(p.replace("+", " ", "g")));
}
}
}
return struct;
},
_query_toList: function(p, q, opt) {
for (var key in opt) if (is_array(opt[key])) for (var i = 0; i < opt[key].length; i++) {
var val = opt[key][i];
p.push(key), q.push(val);
} else void 0 !== opt[key] && null !== opt[key] && (p.push(key), q.push(opt[key]));
return [ p, q ];
},
query_push: function(opt) {
return this._query = this._query_toList(this._query[0], this._query[1], opt), this;
},
query_merge: function(opt) {
var p = this._query[0], q = this._query[1];
for (var key in opt) for (var kset = !1, i = 0; i < p.length; i++) {
var x_key = p[i];
if (key === x_key) {
if (kset) {
p.splice(i, 1), q.splice(i, 1);
continue;
}
is_array(opt[key]) ? q[i] = opt[key].shift() : void 0 === opt[key] || null === opt[key] ? (p.splice(i, 1), 
q.splice(i, 1), delete opt[key]) : (q[i] = opt[key], delete opt[key]), kset = !0;
}
}
return this.query_push(opt), this;
},
query_clear: function() {
return this._query = [ [], [] ], this;
},
query_set: function() {
var args = Array.prototype.slice.call(arguments);
if (1 === args.length) "object" == typeof args[0] ? this._query = this._query_toList([], [], args[0]) : this._query = this._query_parse(args[0]); else if (0 === args.length) this.query_clear(); else {
var obj = {};
obj[args[0]] = args[1], this.query_merge(obj);
}
return this;
}
};
for (var name in YouAreI.prototype) if (!name.match(/^_/)) {
var cName = toCamel(name);
YouAreI.prototype[cName] = YouAreI.prototype[name];
}
return YouAreI;
});
}, , function(module, exports, __webpack_require__) {
(function(process, global) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.Client = void 0;
var _promise = __webpack_require__(264), _promise2 = _interopRequireDefault(_promise), _classCallCheck2 = __webpack_require__(91), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(92), _createClass3 = _interopRequireDefault(_createClass2), _utils = __webpack_require__(97), _events = __webpack_require__(503), _events2 = _interopRequireDefault(_events), _places = __webpack_require__(504), _places2 = _interopRequireDefault(_places), _users = __webpack_require__(505), _users2 = _interopRequireDefault(_users), _accounts = __webpack_require__(502), _accounts2 = _interopRequireDefault(_accounts), _es6Promise = __webpack_require__(980);
__webpack_require__(982);
var _youarei = __webpack_require__(309), _youarei2 = _interopRequireDefault(_youarei), _dotenv = __webpack_require__(779), _dotenv2 = _interopRequireDefault(_dotenv);
(0, _es6Promise.polyfill)(), _dotenv2.default.config({
silent: !0
});
var log = _utils.logger.getLogger("predicthq.client"), Client = function() {
function Client(options) {
(0, _classCallCheck3.default)(this, Client), options = options || {}, this.baseUrl = options.endpoint || process.env.ENDPOINT_URL, 
this.options = options, this.events = new _events2.default(this), this.places = new _places2.default(this), 
this.users = new _users2.default(this), this.accounts = new _accounts2.default(this), 
this.fetch = options.fetch || !1, this.fetch || ("undefined" != typeof global && global.hasOwnProperty("fetch") ? this.fetch = global.fetch : "undefined" != typeof window && window.hasOwnProperty("fetch") ? this.fetch = window.fetch : this.fetch = function() {
throw "No Fetch Library present. You must provide one!";
});
}
return (0, _createClass3.default)(Client, [ {
key: "request",
value: function request(method, path, returnClass, options) {
var access_token = this.options.access_token, uri = new _youarei2.default("" + this.baseUrl + path);
uri.query_push(options);
var fetch = this.fetch;
return new _promise2.default(function(resolve, reject) {
log.debug(uri.to_string()), fetch(uri.to_string(), {
method: method,
headers: {
Authorization: "Bearer " + access_token,
Accept: "application/json"
}
}).then(function(response) {
return response.json();
}).then(function(result) {
return result.hasOwnProperty("error") ? reject(result) : resolve(returnClass ? new returnClass(result) : result);
}).catch(function(err) {
return reject({
code: null,
error: err
});
});
});
}
}, {
key: "get",
value: function get(path, returnClass, options) {
return this.request("GET", path, returnClass, options);
}
} ]), Client;
}();
exports.default = Client, exports.Client = Client;
}).call(exports, __webpack_require__(74), function() {
return this;
}());
}, function(module, exports, __webpack_require__) {
"use strict";
function closePopups() {
return {
type: CLOSE_POPUPS
};
}
function showPopup(type, enabled) {
return function(dispatch, getState) {
dispatch(closePopups()), dispatch({
type: type,
enabled: enabled
});
};
}
function selectPopupDay(day) {
return function(dispatch, getState) {
var state = getState();
dispatch(closePopups()), state.ui_state.popup_day != day && dispatch({
type: SELECT_POPUP_DAY,
day: day
});
};
}
function moveTimelineBackwards() {
return function(dispatch, getState) {
dispatch({
type: SELECT_CURRENT_DAY,
add_days: -1
});
var currentDate = getState().ui_state.current_day;
dispatch((0, _event.updateEvents)({
date: moment(currentDate)
}));
};
}
function moveTimelineForwards() {
return function(dispatch, getState) {
dispatch({
type: SELECT_CURRENT_DAY,
add_days: 1
});
var currentDate = getState().ui_state.current_day;
dispatch((0, _event.updateEvents)({
date: moment(currentDate)
}));
};
}
function resetTimeline() {
return function(dispatch, getState) {
dispatch({
type: RESET_CURRENT_DAY
}), dispatch((0, _event.updateEvents)());
};
}
function showLocationPopup(enabled) {
return showPopup(SHOW_LOCATION_POPUP, enabled);
}
function showBackgroundEventPopup(enabled) {
return showPopup(SHOW_BACKGROUND_EVENT_POPUP, enabled);
}
function showSignUpForMoreEventsPopup(enabled) {
return showPopup(SHOW_SIGNUP_FOR_MORE_EVENTS_POPUP, enabled);
}
function showProfilePopup(enabled) {
return showPopup(SHOW_PROFILE_POPUP, enabled);
}
function showOrgPopup(enabled) {
return showPopup(SHOW_ORG_POPUP, enabled);
}
function upgrade(details) {
return {
type: UPGRADE,
details: details
};
}
function removeUpgradeMsg(details) {
return {
type: UPGRADE,
details: null
};
}
function inputStateFromSentry() {
return {
type: INPUT_STATE_FROM_SENTRY
};
}
function replaceState(value) {
return {
type: REPLACE_STATE,
value: value
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.REPLACE_STATE = exports.INPUT_STATE_FROM_SENTRY = exports.UPGRADE = exports.SHOW_ORG_POPUP = exports.SHOW_PROFILE_POPUP = exports.SHOW_SIGNUP_FOR_MORE_EVENTS_POPUP = exports.SHOW_BACKGROUND_EVENT_POPUP = exports.SHOW_LOCATION_POPUP = exports.SELECT_POPUP_DAY = exports.SELECT_CURRENT_DAY = exports.RESET_CURRENT_DAY = exports.CLOSE_POPUPS = void 0, 
exports.closePopups = closePopups, exports.selectPopupDay = selectPopupDay, exports.moveTimelineBackwards = moveTimelineBackwards, 
exports.moveTimelineForwards = moveTimelineForwards, exports.resetTimeline = resetTimeline, 
exports.showLocationPopup = showLocationPopup, exports.showBackgroundEventPopup = showBackgroundEventPopup, 
exports.showSignUpForMoreEventsPopup = showSignUpForMoreEventsPopup, exports.showProfilePopup = showProfilePopup, 
exports.showOrgPopup = showOrgPopup, exports.upgrade = upgrade, exports.removeUpgradeMsg = removeUpgradeMsg, 
exports.inputStateFromSentry = inputStateFromSentry, exports.replaceState = replaceState;
var _event = __webpack_require__(207), CLOSE_POPUPS = exports.CLOSE_POPUPS = "CLOSE_POPUPS", RESET_CURRENT_DAY = exports.RESET_CURRENT_DAY = "RESET_CURRENT_DAY", SELECT_CURRENT_DAY = exports.SELECT_CURRENT_DAY = "SELECT_CURRENT_DAY", SELECT_POPUP_DAY = exports.SELECT_POPUP_DAY = "SELECT_POPUP_DAY", SHOW_LOCATION_POPUP = exports.SHOW_LOCATION_POPUP = "SHOW_LOCATION_POPUP", SHOW_BACKGROUND_EVENT_POPUP = exports.SHOW_BACKGROUND_EVENT_POPUP = "SHOW_BACKGROUND_EVENT_POPUP", SHOW_SIGNUP_FOR_MORE_EVENTS_POPUP = exports.SHOW_SIGNUP_FOR_MORE_EVENTS_POPUP = "SHOW_SIGNUP_FOR_MORE_EVENTS_POPUP", SHOW_PROFILE_POPUP = exports.SHOW_PROFILE_POPUP = "SHOW_PROFILE_POPUP", SHOW_ORG_POPUP = exports.SHOW_ORG_POPUP = "SHOW_ORG_POPUP", UPGRADE = exports.UPGRADE = "UPGRADE", INPUT_STATE_FROM_SENTRY = exports.INPUT_STATE_FROM_SENTRY = "INPUT_STATE_FROM_SENTRY", REPLACE_STATE = exports.REPLACE_STATE = "REPLACE_STATE";
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _getPrototypeOf = __webpack_require__(20), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(21), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(27), _createClass3 = _interopRequireDefault(_createClass2), _possibleConstructorReturn2 = __webpack_require__(23), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(22), _inherits3 = _interopRequireDefault(_inherits2), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactRedux = __webpack_require__(35), _reactMixin = __webpack_require__(43), _reactMixin2 = _interopRequireDefault(_reactMixin), _shared = __webpack_require__(26), _mixins = __webpack_require__(29), _utils = __webpack_require__(17), _moment = __webpack_require__(25), _moment2 = _interopRequireDefault(_moment), _countryData = __webpack_require__(368), Event = function(_PureRenderComponent) {
function Event() {
return (0, _classCallCheck3.default)(this, Event), (0, _possibleConstructorReturn3.default)(this, (Event.__proto__ || (0, 
_getPrototypeOf2.default)(Event)).apply(this, arguments));
}
return (0, _inherits3.default)(Event, _PureRenderComponent), (0, _createClass3.default)(Event, [ {
key: "getCategoryIcon",
value: function getCategoryIcon(category) {
switch (category) {
case "airport-delays":
return "travel";

case "severe-weather":
return "severe-weather";

case "disasters":
return "disaster";

case "school-holidays":
return "school";

case "public-holidays":
return "holiday";

case "observances":
return "observance";

case "concerts":
return "concert";

case "conferences":
return "conference";

case "expos":
return "expo";

case "sports":
return "entertainment";

case "daylight-savings":
return "daylight";

case "festivals":
return "festival";

case "performing-arts":
return "performing";

case "politics":
return "politics";
}
}
}, {
key: "getTimeZoned",
value: function getTimeZoned(event, field) {
var item = (0, _moment2.default)(event[field]);
return event.hasOwnProperty("timezone") && event.timezone.length && (item = item.tz(event.timezone)), 
item;
}
}, {
key: "renderEventStart",
value: function renderEventStart() {
var event = this.props.event;
if (event.hasOwnProperty("end")) {
var start = this.getTimeWithUserZone((0, _moment2.default)(event.start)), end = this.getTimeWithUserZone((0, 
_moment2.default)(event.end)), durationDays = end.diff(start, "days") + 1, eventDuration = null, eventDescription = null;
return event.hasOwnProperty("description") && event.description.length && (eventDescription = _react2.default.createElement("p", null, event.description)), 
durationDays > 1 && (eventDuration = _react2.default.createElement("span", null, _react2.default.createElement("span", null, " - ", end.format("ddd D MMM, YYYY")), _react2.default.createElement("br", null), _react2.default.createElement("span", {
className: "event-duration"
}, "(", _utils._.pluralize("day", durationDays, !0), ")"))), _react2.default.createElement("div", {
className: "event-period"
}, start.format("ddd D MMM, YYYY"), eventDuration);
}
}
}, {
key: "render",
value: function render() {
var event = this.props.event;
if (!event.category) return null;
var detailedDescription = null;
this.props.hasOwnProperty("showDetailed") && this.props.showDetailed && (detailedDescription = _react2.default.createElement("div", {
className: "event-description"
}, event.description));
var onClick = this.handleEventClick.bind(this, event.id);
this.props.hasOwnProperty("onClick") && (onClick = this.props.onClick), event.hasOwnProperty("rank") || (event.rank = 100);
var category = this.getCategoryIcon(event.category);
category = _react2.default.createElement("div", {
title: _utils._.titleize(event.category.replace("-", " ")),
className: "event-category icon " + category
});
var rankLevel = Math.ceil(event.rank / 20), country = null;
event.hasOwnProperty("country") && _countryData.countries.hasOwnProperty(event.country) && (country = _countryData.countries[event.country].name);
var rankTitle = [ "Minor", "Moderate", "Important", "Significant", "Major" ][rankLevel - 1];
return _react2.default.createElement("div", {
className: "event",
key: event.id
}, _react2.default.createElement("div", {
className: "rank"
}, _react2.default.createElement("div", {
className: "icon strength phq" + rankLevel,
title: rankTitle
})), _react2.default.createElement("div", {
className: "info"
}, _react2.default.createElement("div", {
onClick: onClick,
className: "event-title"
}, event.title, _react2.default.createElement("span", {
title: _utils._.titleize(event.category.replace("-", " ")) + " - " + event.title
})), _react2.default.createElement("div", {
className: "event-country"
}, country), category, this.renderEventStart(), detailedDescription));
}
} ]), Event;
}(_shared.PureRenderComponent);
Event.propTypes = {
event: _react2.default.PropTypes.object.isRequired,
onClick: _react2.default.PropTypes.func
}, _reactMixin2.default.onClass(Event, _mixins.CommonMixin), exports.default = (0, 
_reactRedux.connect)()(Event);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireWildcard(obj) {
if (obj && obj.__esModule) return obj;
var newObj = {};
if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
return newObj.default = obj, newObj;
}
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function user() {
var state = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, action = arguments[1];
switch (action.type) {
case actions.user.LOGIN_INVALID_REQUEST:
case actions.user.LOGIN_INVALID_AUTHENTICATION:
case actions.user.LOGIN_INVALID_PAYMENT_REQUIRED:
return (0, _updeep2.default)({
invalid_login: !0,
invalid_msg: action.err
}, state);

case actions.user.LOGIN_COMPLETED:
return (0, _updeep2.default)({
token: action.token
}, state);

case actions.user.UPDATE_USER:
return (0, _updeep2.default)({
account: action.account,
guest: !1,
invalid_login: !1,
lastCheckStatus: !0,
lastCheck: (0, _moment2.default)().toISOString()
}, state);

case actions.user.LOGIN_GUEST:
return (0, _updeep2.default)({
guest: !0,
token: null,
account: null,
orgs: null,
invalid_login: null,
location: function location() {
return {};
}
}, state);

case actions.user.LOGIN_PARTIAL_GUEST:
return (0, _updeep2.default)({
guest: !0,
token: null,
account: null,
orgs: null,
invalid_login: null
}, state);

case actions.user.UPDATE_SUBSCRIPTIONS:
return (0, _updeep2.default)({
orgs: (0, _defineProperty3.default)({}, action.id, {
subscriptions: action.subscriptions
})
}, state);

case actions.user.UPDATE_LOCATION:
return (0, _updeep2.default)({
location: action.location
}, state);

case actions.user.UPDATE_ORGS:
return (0, _updeep2.default)({
orgs: action.orgs,
default_org: action.default_org
}, state);

case actions.user.UPDATE_DEFAULT_ORG:
return (0, _updeep2.default)({
default_org: action.id
}, state);

case actions.user.UPDATE_TIME_FORMAT:
return (0, _updeep2.default)({
twelveHourClock: action.enableTwelveHours
}, state);

case actions.ui.REPLACE_STATE:
return action.value.user;

default:
return state;
}
}
function countries() {
var state = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, action = arguments[1];
switch (action.type) {
default:
return state;
}
}
function timezones() {
var state = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, action = arguments[1];
switch (action.type) {
case actions.ui.REPLACE_STATE:
return action.value.user;

default:
return state;
}
}
function places() {
var state = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, action = arguments[1];
switch (action.type) {
case actions.places.PLACES_SEARCH_COMPLETED:
return (0, _updeep2.default)({
search: action.results
}, state);

default:
return state;
}
}
function ui_state() {
var state = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, action = arguments[1];
switch (action.type) {
case actions.ui.CLOSE_POPUPS:
return (0, _updeep2.default)({
popup_location: !1,
popup_background_event: !1,
SHOW_ORG_POPUP: !1,
popup_day: !1,
popup_signup_for_more_events: !1,
popup_profile: !1
}, state);

case actions.ui.SELECT_POPUP_DAY:
return null == action.day || state.hasOwnProperty("popup_day") && state.popup_day == action.day ? (0, 
_updeep2.default)({
popup_day: null
}, state) : (0, _updeep2.default)({
popup_day: action.day
}, state);

case actions.ui.SELECT_CURRENT_DAY:
return (0, _updeep2.default)({
current_day: (0, _moment2.default)(state.current_day).add(action.add_days, "days").format()
}, state);

case actions.ui.RESET_CURRENT_DAY:
return (0, _updeep2.default)({
current_day: (0, _moment2.default)().format()
}, state);

case actions.ui.SHOW_LOCATION_POPUP:
return (0, _updeep2.default)({
popup_location: action.enabled
}, state);

case actions.ui.SHOW_BACKGROUND_EVENT_POPUP:
return (0, _updeep2.default)({
popup_background_event: action.enabled
}, state);

case actions.ui.SHOW_SIGNUP_FOR_MORE_EVENTS_POPUP:
return (0, _updeep2.default)({
popup_signup_for_more_events: action.enabled
}, state);

case actions.ui.SHOW_PROFILE_POPUP:
return (0, _updeep2.default)({
popup_profile: action.enabled
}, state);

case actions.ui.SHOW_ORG_POPUP:
return (0, _updeep2.default)({
popup_org_picker: action.enabled
}, state);

case actions.ui.UPGRADE:
return (0, _updeep2.default)({
upgrade: {
details: action.details,
at: (0, _moment2.default)().format()
}
}, state);

case actions.ui.INPUT_STATE_FROM_SENTRY:
return (0, _updeep2.default)({
input_state_from_sentry: !0
}, state);

case actions.ui.REPLACE_STATE:
return action.value.ui_state;

default:
return state;
}
}
function events() {
var state = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, action = arguments[1];
switch (action.type) {
case actions.event.UPDATE_EVENTS_COMPLETED:
var reset = action.options.hasOwnProperty("reset"), mergedItems = function mergedItems(existing) {
var newResult = _utils._.assign({}, reset ? {} : existing);
_utils._.each(action.dates, function(date) {
newResult[date.date] = date;
});
var purge_day = action.options.hasOwnProperty("purge_before") ? _moment2.default.utc(action.options.purge_before) : null;
return purge_day && (newResult = _utils._.omitBy(newResult, function(v, k) {
return _moment2.default.utc(k) < purge_day;
})), newResult;
}, lastCheckStatus = !0;
return reset && (lastCheckStatus = !1), (0, _updeep2.default)({
lastCheckStatus: lastCheckStatus,
lastCheck: (0, _moment2.default)().toISOString(),
items: mergedItems
}, state);

case actions.ui.REPLACE_STATE:
return action.value.events;

default:
return state;
}
}
function tasks() {
var state = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, action = arguments[1];
switch (action.type) {
default:
return state;
}
}
function backgrounds() {
var state = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, action = arguments[1];
switch (action.type) {
case actions.background.CACHE_BACKGROUND_COMPLETED:
var d = action.day;
return (0, _updeep2.default)({
items: (0, _defineProperty3.default)({}, d, {
cached: action.success
})
}, state);

case actions.background.UPDATE_BACKGROUNDS_FAILED:
return (0, _updeep2.default)({
lastCheckStatus: !1,
lastCheck: (0, _moment2.default)().toISOString()
}, state);

case actions.background.UPDATE_BACKGROUNDS_COMPLETED:
var mergedItems = function mergedItems(existing) {
var newResult = _utils._.assign({}, existing);
_utils._.each(action.results, function(entry) {
var d = _moment2.default.utc(entry.publish_at).format("YYYY-MM-DD");
newResult[d] = {
cached: !1,
items: []
};
var id = entry.id, ids = _utils._.map(newResult[d].items, "id");
ids.indexOf(id) == -1 && (newResult[d].cached = !1, newResult[d].items.push(_utils._.extend({
id: id
}, entry)));
});
var day = action.options.hasOwnProperty("day") ? (0, _moment2.default)(action.options.day) : (0, 
_moment2.default)();
return day.subtract(1, "days"), newResult = _utils._.omitBy(newResult, function(v, k) {
return _moment2.default.utc(k) < day;
});
};
return (0, _updeep2.default)({
lastCheckStatus: !0,
lastCheck: (0, _moment2.default)().toISOString(),
items: mergedItems
}, state);

case actions.ui.REPLACE_STATE:
return action.value.backgrounds;

default:
return state;
}
}
function time() {
var state = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, action = arguments[1];
switch (action.type) {
case actions.time.UPDATE_TIME:
return action.time;

default:
return state;
}
}
function time_extra() {
var state = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, action = arguments[1];
switch (action.type) {
case actions.time.ADJUST_DAY:
return state + action.add_days;

default:
return state;
}
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _defineProperty2 = __webpack_require__(533), _defineProperty3 = _interopRequireDefault(_defineProperty2), _updeep = __webpack_require__(1122), _updeep2 = _interopRequireDefault(_updeep), _redux = __webpack_require__(146), _actions = __webpack_require__(36), actions = _interopRequireWildcard(_actions), _moment = __webpack_require__(25), _moment2 = _interopRequireDefault(_moment), _utils = __webpack_require__(17), log = _utils.logger.getLogger("reducer");
log.setLevel("DEBUG");
var reducer = (0, _redux.combineReducers)({
user: user,
countries: countries,
timezones: timezones,
places: places,
ui_state: ui_state,
events: events,
tasks: tasks,
backgrounds: backgrounds,
time: time,
time_extra: time_extra
});
exports.default = reducer;
}, function(module, exports, __webpack_require__) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.getActiveOrg = exports.getActiveOrgId = void 0;
var _utils = __webpack_require__(17), _reselect = __webpack_require__(1115), getActiveOrgId = exports.getActiveOrgId = (0, 
_reselect.createSelector)(function(user) {
return user;
}, function(user) {
return null == user.orgs || 0 == user.orgs.length ? null : user.default_org ? user.default_org : _utils._.keys(user.orgs)[0];
});
exports.getActiveOrg = (0, _reselect.createSelector)(function(user) {
return user;
}, function(user) {
var accountId = getActiveOrgId(user);
return null == accountId ? null : user.orgs[accountId];
});
}, , function(module, exports, __webpack_require__) {
module.exports = {
"default": __webpack_require__(539),
__esModule: !0
};
}, [ 1134, 541 ], function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
exports.__esModule = !0;
var _iterator = __webpack_require__(532), _iterator2 = _interopRequireDefault(_iterator), _symbol = __webpack_require__(531), _symbol2 = _interopRequireDefault(_symbol), _typeof = "function" == typeof _symbol2.default && "symbol" == typeof _iterator2.default ? function(obj) {
return typeof obj;
} : function(obj) {
return obj && "function" == typeof _symbol2.default && obj.constructor === _symbol2.default ? "symbol" : typeof obj;
};
exports.default = "function" == typeof _symbol2.default && "symbol" === _typeof(_iterator2.default) ? function(obj) {
return "undefined" == typeof obj ? "undefined" : _typeof(obj);
} : function(obj) {
return obj && "function" == typeof _symbol2.default && obj.constructor === _symbol2.default ? "symbol" : "undefined" == typeof obj ? "undefined" : _typeof(obj);
};
}, [ 1153, 208, 57 ], [ 1154, 546 ], [ 1156, 101, 65 ], [ 1161, 77, 120, 322 ], [ 1167, 151, 99, 330, 100, 121, 553, 214, 328, 57 ], [ 1175, 213, 152, 102, 219, 78, 323, 77 ], [ 1177, 329, 210 ], 161, [ 1178, 78, 218, 215 ], [ 1179, 78, 102, 548, 215 ], [ 1149, 100 ], , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(module, exports) {
"use strict";
var regions = {};
regions.centralAsia = {
name: "Central Asia",
countries: [ "KZ", "KG", "TJ", "TM", "UZ" ]
}, regions.southernAsia = {
name: "Southern Asia",
countries: [ "AF", "BD", "BT", "IO", "IN", "IR", "MV", "NP", "PK", "LK" ]
}, regions.southeastAsia = {
name: "Southeast Asia",
countries: [ "BN", "KH", "CX", "CC", "TL", "ID", "LA", "MY", "MM", "PH", "SG", "TH", "VN" ]
}, regions.eastAsia = {
name: "East Asia",
countries: [ "CN", "HK", "JP", "KP", "KR", "MO", "MN", "TW" ]
}, regions.westernAsia = {
name: "Western Asia",
countries: [ "AM", "AZ", "BH", "IQ", "IL", "JO", "KW", "LB", "OM", "PS", "QA", "SA", "SY", "TR", "AE", "YE" ]
}, regions.centralAfrica = {
name: "Central Aftrica",
countries: [ "AO", "CM", "CF", "TD", "CG", "CD", "GQ", "GA", "ST" ]
}, regions.northAfrica = {
name: "North Africa",
countries: [ "DZ", "EG", "LY", "MA", "SD", "TN", "EH" ]
}, regions.southernAfrica = {
name: "Southern Africa",
countries: [ "BW", "LS", "NA", "ZA", "SZ" ]
}, regions.eastAfrica = {
name: "East Africa",
countries: [ "BI", "KM", "DJ", "ER", "ET", "KE", "MG", "MW", "MU", "YT", "MZ", "RE", "RW", "SC", "SO", "SS", "TZ", "UG", "ZM", "ZW" ]
}, regions.westAfrica = {
name: "West Africa",
countries: [ "BJ", "BF", "CV", "CI", "GM", "GH", "GN", "GW", "LR", "ML", "MR", "NE", "NG", "SH", "SN", "SL", "TG" ]
}, regions.centralAmerica = {
name: "Central America",
countries: [ "BZ", "CR", "SV", "GT", "HN", "NI", "PA" ]
}, regions.northernAmerica = {
name: "Northern America",
countries: [ "BM", "CA", "GL", "MX", "PM", "US" ]
}, regions.caribbean = {
name: "Caribbean",
countries: [ "AI", "AG", "AW", "BS", "BB", "BQ", "VG", "KY", "CU", "CW", "DM", "DO", "GD", "GP", "HT", "JM", "MQ", "MS", "PR", "BL", "KN", "LC", "MF", "VC", "SX", "TT", "TC", "VI" ]
}, regions.southAmerica = {
name: "South America",
countries: [ "AR", "BO", "BR", "CL", "CO", "EC", "FK", "GF", "GY", "PY", "PE", "SR", "UY", "VE" ]
}, regions.antartica = {
name: "Antartica",
countries: [ "AQ", "BV", "TF", "HM", "GS" ]
}, regions.northernEurope = {
name: "Northern Europe",
countries: [ "AX", "DK", "EE", "FO", "FI", "GG", "IS", "IE", "JE", "IM", "LV", "LT", "NO", "SJ", "SE", "GB" ]
}, regions.southernEurope = {
name: "Southern Europe",
countries: [ "AL", "AD", "BA", "HR", "CY", "GI", "GR", "IT", "MK", "VA", "MT", "ME", "PT", "SM", "RS", "SI", "ES" ]
}, regions.easternEurope = {
name: "Eastern Europe",
countries: [ "BY", "BG", "CZ", "GE", "HU", "MD", "PL", "RO", "RU", "SK", "UA" ]
}, regions.westernEurope = {
name: "Western Europe",
countries: [ "AT", "BE", "FR", "DE", "LI", "LU", "MC", "NL", "CH" ]
}, regions.australia = {
name: "Australia",
countries: [ "AU", "NF", "NZ" ]
}, regions.melanesia = {
name: "Melanesia",
countries: [ "FJ", "NC", "PG", "SB", "VU" ]
}, regions.micronesia = {
name: "Micronesia",
countries: [ "GU", "KI", "MH", "FM", "NR", "MP", "PW", "UM" ]
}, regions.polynesia = {
name: "Polynesia",
countries: [ "AS", "CK", "PF", "NU", "PN", "WS", "TK", "TO", "TV", "WF" ]
}, module.exports = regions;
}, function(module, exports, __webpack_require__) {
"use strict";
var _ = __webpack_require__(307), continents = __webpack_require__(774), regions = __webpack_require__(367), countriesAll = __webpack_require__(495), currenciesAll = __webpack_require__(496), languagesAll = __webpack_require__(497), lookup = __webpack_require__(775), getSymbol = __webpack_require__(776);
exports.continents = continents, exports.regions = regions, exports.countries = {
all: countriesAll
}, _.each(countriesAll, function(country) {
exports.countries[country.alpha2] = country, exports.countries[country.alpha3] = country;
}), exports.currencies = {
all: currenciesAll
}, _.each(currenciesAll, function(currency) {
var symbol = getSymbol(currency.code);
"?" == symbol && (symbol = currency.code), currency.symbol = symbol, exports.currencies[currency.code] = currency;
}), exports.languages = {
all: languagesAll
}, _.each(languagesAll, function(language) {
exports.languages[language.alpha2] = language, exports.languages[language.bibliographic] = language, 
exports.languages[language.alpha3] = language;
}), exports.lookup = lookup({
countries: countriesAll,
currencies: currenciesAll,
languages: languagesAll
});
var callingCountries = {
all: []
}, callingCodesAll = _.reduce(countriesAll, function(codes, country) {
return country.countryCallingCodes && country.countryCallingCodes.length && (callingCountries.all.push(country), 
callingCountries[country.alpha2] = country, callingCountries[country.alpha3] = country, 
_.each(country.countryCallingCodes, function(code) {
codes.indexOf(code) == -1 && codes.push(code);
})), codes;
}, []);
delete callingCountries[""], exports.callingCountries = callingCountries, callingCodesAll.sort(function(a, b) {
var parse = function(str) {
return parseInt(str);
}, splitA = _.map(a.split(" "), parse), splitB = _.map(b.split(" "), parse);
return splitA[0] < splitB[0] ? -1 : splitA[0] > splitB[0] ? 1 : void 0 === splitA[1] && void 0 !== splitB[1] ? -1 : void 0 !== splitA[1] && void 0 === splitB[1] ? 1 : splitA[1] < splitB[1] ? -1 : splitA[1] > splitB[1] ? 1 : 0;
}), exports.callingCodes = {
all: callingCodesAll
};
}, , , , , , function(module, exports) {
function isArguments(value) {
return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
}
function isArrayLike(value) {
return null != value && isLength(value.length) && !isFunction(value);
}
function isArrayLikeObject(value) {
return isObjectLike(value) && isArrayLike(value);
}
function isFunction(value) {
var tag = isObject(value) ? objectToString.call(value) : "";
return tag == funcTag || tag == genTag;
}
function isLength(value) {
return "number" == typeof value && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
function isObject(value) {
var type = typeof value;
return !!value && ("object" == type || "function" == type);
}
function isObjectLike(value) {
return !!value && "object" == typeof value;
}
var MAX_SAFE_INTEGER = 9007199254740991, argsTag = "[object Arguments]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty, objectToString = objectProto.toString, propertyIsEnumerable = objectProto.propertyIsEnumerable;
module.exports = isArguments;
}, function(module, exports, __webpack_require__) {
var getNative = __webpack_require__(107), root = __webpack_require__(60), Map = getNative(root, "Map");
module.exports = Map;
}, function(module, exports, __webpack_require__) {
function SetCache(values) {
var index = -1, length = values ? values.length : 0;
for (this.__data__ = new MapCache(); ++index < length; ) this.add(values[index]);
}
var MapCache = __webpack_require__(253), setCacheAdd = __webpack_require__(876), setCacheHas = __webpack_require__(877);
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd, SetCache.prototype.has = setCacheHas, 
module.exports = SetCache;
}, function(module, exports, __webpack_require__) {
function Stack(entries) {
this.__data__ = new ListCache(entries);
}
var ListCache = __webpack_require__(170), stackClear = __webpack_require__(879), stackDelete = __webpack_require__(880), stackGet = __webpack_require__(881), stackHas = __webpack_require__(882), stackSet = __webpack_require__(883);
Stack.prototype.clear = stackClear, Stack.prototype.delete = stackDelete, Stack.prototype.get = stackGet, 
Stack.prototype.has = stackHas, Stack.prototype.set = stackSet, module.exports = Stack;
}, function(module, exports, __webpack_require__) {
var root = __webpack_require__(60), Symbol = root.Symbol;
module.exports = Symbol;
}, function(module, exports, __webpack_require__) {
function baseForOwn(object, iteratee) {
return object && baseFor(object, iteratee, keys);
}
var baseFor = __webpack_require__(823), keys = __webpack_require__(262);
module.exports = baseForOwn;
}, function(module, exports, __webpack_require__) {
function baseGet(object, path) {
path = isKey(path, object) ? [ path ] : castPath(path);
for (var index = 0, length = path.length; null != object && index < length; ) object = object[toKey(path[index++])];
return index && index == length ? object : void 0;
}
var castPath = __webpack_require__(384), isKey = __webpack_require__(173), toKey = __webpack_require__(129);
module.exports = baseGet;
}, function(module, exports, __webpack_require__) {
function baseHas(object, key) {
return null != object && (hasOwnProperty.call(object, key) || "object" == typeof object && key in object && null === getPrototype(object));
}
var getPrototype = __webpack_require__(257), objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty;
module.exports = baseHas;
}, function(module, exports, __webpack_require__) {
function baseIsEqual(value, other, customizer, bitmask, stack) {
return value === other || (null == value || null == other || !isObject(value) && !isObjectLike(other) ? value !== value && other !== other : baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack));
}
var baseIsEqualDeep = __webpack_require__(827), isObject = __webpack_require__(130), isObjectLike = __webpack_require__(108);
module.exports = baseIsEqual;
}, function(module, exports) {
function baseProperty(key) {
return function(object) {
return null == object ? void 0 : object[key];
};
}
module.exports = baseProperty;
}, function(module, exports, __webpack_require__) {
function castPath(value) {
return isArray(value) ? value : stringToPath(value);
}
var isArray = __webpack_require__(42), stringToPath = __webpack_require__(884);
module.exports = castPath;
}, function(module, exports, __webpack_require__) {
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
var isPartial = bitmask & PARTIAL_COMPARE_FLAG, arrLength = array.length, othLength = other.length;
if (arrLength != othLength && !(isPartial && othLength > arrLength)) return !1;
var stacked = stack.get(array);
if (stacked) return stacked == other;
var index = -1, result = !0, seen = bitmask & UNORDERED_COMPARE_FLAG ? new SetCache() : void 0;
for (stack.set(array, other); ++index < arrLength; ) {
var arrValue = array[index], othValue = other[index];
if (customizer) var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
if (void 0 !== compared) {
if (compared) continue;
result = !1;
break;
}
if (seen) {
if (!arraySome(other, function(othValue, othIndex) {
if (!seen.has(othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) return seen.add(othIndex);
})) {
result = !1;
break;
}
} else if (arrValue !== othValue && !equalFunc(arrValue, othValue, customizer, bitmask, stack)) {
result = !1;
break;
}
}
return stack.delete(array), result;
}
var SetCache = __webpack_require__(376), arraySome = __webpack_require__(819), UNORDERED_COMPARE_FLAG = 1, PARTIAL_COMPARE_FLAG = 2;
module.exports = equalArrays;
}, function(module, exports, __webpack_require__) {
function getAllKeysIn(object) {
return baseGetAllKeys(object, keysIn, getSymbolsIn);
}
var baseGetAllKeys = __webpack_require__(824), getSymbolsIn = __webpack_require__(851), keysIn = __webpack_require__(892);
module.exports = getAllKeysIn;
}, function(module, exports, __webpack_require__) {
function indexKeys(object) {
var length = object ? object.length : void 0;
return isLength(length) && (isArray(object) || isString(object) || isArguments(object)) ? baseTimes(length, String) : null;
}
var baseTimes = __webpack_require__(838), isArguments = __webpack_require__(260), isArray = __webpack_require__(42), isLength = __webpack_require__(176), isString = __webpack_require__(392);
module.exports = indexKeys;
}, function(module, exports) {
function isPrototype(value) {
var Ctor = value && value.constructor, proto = "function" == typeof Ctor && Ctor.prototype || objectProto;
return value === proto;
}
var objectProto = Object.prototype;
module.exports = isPrototype;
}, function(module, exports, __webpack_require__) {
function isStrictComparable(value) {
return value === value && !isObject(value);
}
var isObject = __webpack_require__(130);
module.exports = isStrictComparable;
}, function(module, exports) {
function matchesStrictComparable(key, srcValue) {
return function(object) {
return null != object && (object[key] === srcValue && (void 0 !== srcValue || key in Object(object)));
};
}
module.exports = matchesStrictComparable;
}, function(module, exports) {
function toSource(func) {
if (null != func) {
try {
return funcToString.call(func);
} catch (e) {}
try {
return func + "";
} catch (e) {}
}
return "";
}
var funcToString = Function.prototype.toString;
module.exports = toSource;
}, function(module, exports, __webpack_require__) {
function isString(value) {
return "string" == typeof value || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
}
var isArray = __webpack_require__(42), isObjectLike = __webpack_require__(108), stringTag = "[object String]", objectProto = Object.prototype, objectToString = objectProto.toString;
module.exports = isString;
}, function(module, exports, __webpack_require__) {
function reject(collection, predicate) {
var func = isArray(collection) ? arrayFilter : baseFilter;
return predicate = baseIteratee(predicate, 3), func(collection, function(value, index, collection) {
return !predicate(value, index, collection);
});
}
var arrayFilter = __webpack_require__(815), baseFilter = __webpack_require__(821), baseIteratee = __webpack_require__(128), isArray = __webpack_require__(42);
module.exports = reject;
}, , , , , , , [ 1133, 913 ], [ 1138, 921 ], [ 1153, 132, 34 ], [ 1160, 28 ], [ 1161, 70, 134, 267 ], [ 1167, 136, 62, 414, 94, 135, 932, 184, 409, 34 ], [ 1175, 271, 183, 109, 275, 93, 404, 70 ], [ 1177, 410, 268 ], 161, [ 1178, 93, 185, 272 ], [ 1179, 93, 109, 924, 272 ], [ 1181, 62, 19, 134 ], 356, [ 1182, 61, 71, 269 ], [ 1149, 94 ], [ 1187, 61, 181, 34 ], [ 1189, 133, 927, 403, 267, 28, 132 ], [ 1192, 274 ], function(module, exports) {}, [ 1207, 942, 405 ], [ 1208, 28, 93, 70, 62, 414, 935, 134, 273, 184, 186, 34, 277, 276, 925, 930, 61, 71, 185, 109, 275, 183, 270, 938, 406, 408, 72, 182, 407, 271, 136, 94 ], [ 1150, 946, 28, 94, 135, 34 ], function(module, exports, __webpack_require__) {
var isObject = __webpack_require__(190), document = __webpack_require__(95).document, is = isObject(document) && isObject(document.createElement);
module.exports = function(it) {
return is ? document.createElement(it) : {};
};
}, function(module, exports, __webpack_require__) {
var dP = __webpack_require__(137), createDesc = __webpack_require__(282);
module.exports = __webpack_require__(110) ? function(object, key, value) {
return dP.f(object, key, createDesc(1, value));
} : function(object, key, value) {
return object[key] = value, object;
};
}, function(module, exports, __webpack_require__) {
module.exports = !__webpack_require__(110) && !__webpack_require__(189)(function() {
return 7 != Object.defineProperty(__webpack_require__(422)("div"), "a", {
get: function() {
return 7;
}
}).a;
});
}, function(module, exports, __webpack_require__) {
var $keys = __webpack_require__(427), hiddenKeys = __webpack_require__(279).concat("length", "prototype");
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
return $keys(O, hiddenKeys);
};
}, function(module, exports) {
exports.f = Object.getOwnPropertySymbols;
}, function(module, exports, __webpack_require__) {
var has = __webpack_require__(111), toIObject = __webpack_require__(112), arrayIndexOf = __webpack_require__(959)(!1), IE_PROTO = __webpack_require__(428)("IE_PROTO");
module.exports = function(object, names) {
var key, O = toIObject(object), i = 0, result = [];
for (key in O) key != IE_PROTO && has(O, key) && result.push(key);
for (;names.length > i; ) has(O, key = names[i++]) && (~arrayIndexOf(result, key) || result.push(key));
return result;
};
}, function(module, exports, __webpack_require__) {
var shared = __webpack_require__(284)("keys"), uid = __webpack_require__(138);
module.exports = function(key) {
return shared[key] || (shared[key] = uid(key));
};
}, function(module, exports) {
var ceil = Math.ceil, floor = Math.floor;
module.exports = function(it) {
return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
}, function(module, exports, __webpack_require__) {
module.exports = __webpack_require__(988)();
}, function(module, exports) {
"use strict";
function isUndefined(what) {
return void 0 === what;
}
function isFunction(what) {
return "function" == typeof what;
}
function isString(what) {
return "[object String]" === objectPrototype.toString.call(what);
}
function isObject(what) {
return "object" == typeof what && null !== what;
}
function isEmptyObject(what) {
for (var _ in what) return !1;
return !0;
}
function isError(what) {
var toString = objectPrototype.toString.call(what);
return isObject(what) && "[object Error]" === toString || "[object Exception]" === toString || what instanceof Error;
}
function each(obj, callback) {
var i, j;
if (isUndefined(obj.length)) for (i in obj) hasKey(obj, i) && callback.call(null, i, obj[i]); else if (j = obj.length) for (i = 0; i < j; i++) callback.call(null, i, obj[i]);
}
function objectMerge(obj1, obj2) {
return obj2 ? (each(obj2, function(key, value) {
obj1[key] = value;
}), obj1) : obj1;
}
function truncate(str, max) {
return !max || str.length <= max ? str : str.substr(0, max) + "…";
}
function hasKey(object, key) {
return objectPrototype.hasOwnProperty.call(object, key);
}
function joinRegExp(patterns) {
for (var pattern, sources = [], i = 0, len = patterns.length; i < len; i++) pattern = patterns[i], 
isString(pattern) ? sources.push(pattern.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")) : pattern && pattern.source && sources.push(pattern.source);
return new RegExp(sources.join("|"), "i");
}
function urlencode(o) {
var pairs = [];
return each(o, function(key, value) {
pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
}), pairs.join("&");
}
function parseUrl(url) {
var match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
if (!match) return {};
var query = match[6] || "", fragment = match[8] || "";
return {
protocol: match[2],
host: match[4],
path: match[5],
relative: match[5] + query + fragment
};
}
function uuid4() {
var crypto = window.crypto || window.msCrypto;
if (!isUndefined(crypto) && crypto.getRandomValues) {
var arr = new Uint16Array(8);
crypto.getRandomValues(arr), arr[3] = 4095 & arr[3] | 16384, arr[4] = 16383 & arr[4] | 32768;
var pad = function(num) {
for (var v = num.toString(16); v.length < 4; ) v = "0" + v;
return v;
};
return pad(arr[0]) + pad(arr[1]) + pad(arr[2]) + pad(arr[3]) + pad(arr[4]) + pad(arr[5]) + pad(arr[6]) + pad(arr[7]);
}
return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
var r = 16 * Math.random() | 0, v = "x" === c ? r : 3 & r | 8;
return v.toString(16);
});
}
function htmlTreeAsString(elem) {
for (var nextStr, MAX_TRAVERSE_HEIGHT = 5, MAX_OUTPUT_LEN = 80, out = [], height = 0, len = 0, separator = " > ", sepLength = separator.length; elem && height++ < MAX_TRAVERSE_HEIGHT && (nextStr = htmlElementAsString(elem), 
!("html" === nextStr || height > 1 && len + out.length * sepLength + nextStr.length >= MAX_OUTPUT_LEN)); ) out.push(nextStr), 
len += nextStr.length, elem = elem.parentNode;
return out.reverse().join(separator);
}
function htmlElementAsString(elem) {
var className, classes, key, attr, i, out = [];
if (!elem || !elem.tagName) return "";
if (out.push(elem.tagName.toLowerCase()), elem.id && out.push("#" + elem.id), className = elem.className, 
className && isString(className)) for (classes = className.split(" "), i = 0; i < classes.length; i++) out.push("." + classes[i]);
var attrWhitelist = [ "type", "name", "title", "alt" ];
for (i = 0; i < attrWhitelist.length; i++) key = attrWhitelist[i], attr = elem.getAttribute(key), 
attr && out.push("[" + key + '="' + attr + '"]');
return out.join("");
}
var objectPrototype = Object.prototype;
module.exports = {
isUndefined: isUndefined,
isFunction: isFunction,
isString: isString,
isObject: isObject,
isEmptyObject: isEmptyObject,
isError: isError,
each: each,
objectMerge: objectMerge,
truncate: truncate,
hasKey: hasKey,
joinRegExp: joinRegExp,
urlencode: urlencode,
uuid4: uuid4,
htmlTreeAsString: htmlTreeAsString,
htmlElementAsString: htmlElementAsString,
parseUrl: parseUrl
};
}, function(module, exports, __webpack_require__) {
"use strict";
var _get = __webpack_require__(195).default, _inherits = __webpack_require__(196).default, _createClass = __webpack_require__(193).default, _classCallCheck = __webpack_require__(192).default, _defineProperty = __webpack_require__(1008).default, _objectWithoutProperties = __webpack_require__(435).default, _extends = __webpack_require__(194).default, _interopRequireDefault = __webpack_require__(139).default;
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _propTypes = __webpack_require__(430), _propTypes2 = _interopRequireDefault(_propTypes), _classnames2 = __webpack_require__(535), _classnames3 = _interopRequireDefault(_classnames2), _iCheck = "iCheck", _iCheckHelper = _iCheck + "-helper", EnhancedSwitch = function(_React$Component) {
function EnhancedSwitch(props) {
_classCallCheck(this, EnhancedSwitch), _get(Object.getPrototypeOf(EnhancedSwitch.prototype), "constructor", this).call(this, props);
var checked = !1;
checked = "checked" in props ? props.checked : props.defaultChecked, this._mobile = !1, 
this.state = {
checked: checked,
focused: !1,
hovered: !1,
active: !1
};
}
return _inherits(EnhancedSwitch, _React$Component), _createClass(EnhancedSwitch, null, [ {
key: "propTypes",
value: {
inputType: _propTypes2.default.string.isRequired,
checked: _propTypes2.default.bool,
defaultChecked: _propTypes2.default.bool,
label: _propTypes2.default.node,
disabled: _propTypes2.default.bool,
indeterminate: _propTypes2.default.bool,
onChange: _propTypes2.default.func,
onBlur: _propTypes2.default.func,
onFocus: _propTypes2.default.func,
checkboxClass: _propTypes2.default.string,
radioClass: _propTypes2.default.string,
checkedClass: _propTypes2.default.string,
checkedCheckboxClass: _propTypes2.default.string,
checkedRadioClass: _propTypes2.default.string,
uncheckedClass: _propTypes2.default.string,
uncheckedCheckboxClass: _propTypes2.default.string,
uncheckedRadioClass: _propTypes2.default.string,
disabledClass: _propTypes2.default.string,
disabledCheckboxClass: _propTypes2.default.string,
disabledRadioClass: _propTypes2.default.string,
enabledClass: _propTypes2.default.string,
enabledCheckboxClass: _propTypes2.default.string,
enabledRadioClass: _propTypes2.default.string,
indeterminateClass: _propTypes2.default.string,
indeterminateCheckboxClass: _propTypes2.default.string,
indeterminateRadioClass: _propTypes2.default.string,
determinateClass: _propTypes2.default.string,
determinateCheckboxClass: _propTypes2.default.string,
determinateRadioClass: _propTypes2.default.string,
hoverClass: _propTypes2.default.string,
focusClass: _propTypes2.default.string,
activeClass: _propTypes2.default.string,
labelHover: _propTypes2.default.bool,
labelHoverClass: _propTypes2.default.string,
increaseArea: _propTypes2.default.string,
cursor: _propTypes2.default.bool,
inheritClass: _propTypes2.default.bool,
inheritID: _propTypes2.default.bool,
aria: _propTypes2.default.bool,
insert: _propTypes2.default.node,
children: _propTypes2.default.node,
labelClassName: _propTypes2.default.string
},
enumerable: !0
}, {
key: "defaultProps",
value: {
checkboxClass: "icheckbox",
radioClass: "iradio",
checkedClass: "checked",
disabledClass: "disabled",
indeterminateClass: "indeterminate",
hoverClass: "hover",
focusClass: "focus",
activeClass: "active",
labelHover: !0,
labelHoverClass: "hover",
increaseArea: "",
cursor: !1,
inheritClass: !1,
inheritID: !1,
aria: !1
},
enumerable: !0
} ]), _createClass(EnhancedSwitch, [ {
key: "componentDidMount",
value: function componentDidMount() {
"undefined" != typeof navigator && (this._mobile = /ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent)), 
this.adjustStyle(), this.setIndeterminate(), this.forceUpdate();
}
}, {
key: "componentWillReceiveProps",
value: function componentWillReceiveProps(nextProps) {
"checked" in nextProps && this.setState({
checked: nextProps.checked
});
}
}, {
key: "componentDidUpdate",
value: function componentDidUpdate() {
this.adjustStyle(), this.setIndeterminate();
}
}, {
key: "getValue",
value: function getValue() {
return this.refs.checkbox.value;
}
}, {
key: "setChecked",
value: function setChecked(newCheckedValue) {
if (this.props.hasOwnProperty("checked") && this.props.checked !== !1) ; else this.refs.checkbox.checked = newCheckedValue;
}
}, {
key: "setIndeterminate",
value: function setIndeterminate() {
this.props.indeterminate && (this.refs.checkbox.indeterminate = !0);
}
}, {
key: "adjustStyle",
value: function adjustStyle() {
var inputContainer = this.refs.inputContainer, _window$getComputedStyle = window.getComputedStyle(inputContainer), position = _window$getComputedStyle.position;
"static" === position && (inputContainer.style.position = "relative");
}
}, {
key: "isChecked",
value: function isChecked() {
return this.refs.checkbox.checked;
}
}, {
key: "handleChange",
value: function handleChange(e) {
var checked = e.target.checked;
"checked" in this.props || this.setState({
checked: checked
}), this.props.onChange && this.props.onChange(e, checked);
}
}, {
key: "handleBlur",
value: function handleBlur(e) {
this.setState({
focused: !1
}), this.props.onBlur && this.props.onBlur(e);
}
}, {
key: "handleFocus",
value: function handleFocus(e) {
this.setState({
focused: !0
}), this.props.onFocus && this.props.onFocus(e);
}
}, {
key: "handleHelperClick",
value: function handleHelperClick(event) {
if (!this.props.label && !this.props.disabled) {
var newChecked = !this.refs.checkbox.checked;
"checked" in this.props || (this.refs.checkbox.checked = newChecked, this.setState({
checked: newChecked
})), event.preventDefault(), event.stopPropagation(), this.props.onChange && (event.target = this.refs.checkbox, 
this.props.onChange(event, newChecked));
}
}
}, {
key: "render",
value: function render() {
function handleLabelEvent(event) {
if (!disabled) {
var etype = event.type;
"click" === etype || props.labelHover && this.setState({
hovered: !/ut|nd/.test(etype)
}), this._mobile && event.stopPropagation();
}
}
var _classnames, props = this.props, disabled = props.disabled, name = (props.type, 
props.name), value = props.value, indeterminate = (props.label, props.onBlur, props.onFocus, 
props.onMouseUp, props.onMouseDown, props.onMouseLeave, props.onTouchStart, props.onTouchEnd, 
props.className, props.checkboxClass, props.increaseArea, props.inputType, props.radioClass, 
props.checkedClass, props.disabledClass, props.indeterminate), indeterminateClass = props.indeterminateClass, labelClassName = (props.hoverClass, 
props.focusClass, props.activeClass, props.labelHover, props.labelHoverClass, props.labelClassName), aria = (props.inheritClass, 
props.inheritID, props.aria), other = (props.insert, _objectWithoutProperties(props, [ "type", "name", "value", "label", "onBlur", "onFocus", "onMouseUp", "onMouseDown", "onMouseLeave", "onTouchStart", "onTouchEnd", "className", "checkboxClass", "increaseArea", "inputType", "radioClass", "checkedClass", "disabledClass", "indeterminate", "indeterminateClass", "hoverClass", "focusClass", "activeClass", "labelHover", "labelHoverClass", "labelClassName", "inheritClass", "inheritID", "aria", "insert" ])), checked = this.state.checked, area = 0 | ("" + props.increaseArea).replace("%", "");
area < -50 && (area = -50);
var id = props.id, offset = -area + "%", size = 100 + 2 * area + "%", layer = {
position: "absolute",
top: offset,
left: offset,
display: "block",
width: size,
height: size,
margin: 0,
padding: 0,
background: "#fff",
border: 0,
opacity: 0,
cursor: disabled ? "default" : "pointer"
}, hide = void 0;
hide = this._mobile ? {
position: "absolute",
visibility: "hidden"
} : area ? layer : {
position: "absolute",
opacity: 0
}, aria = !!props.aria;
var helper = void 0;
"checkbox" === props.inputType && "undefined" != typeof props.indeterminateCheckboxClass ? indeterminateClass = props.indeterminateCheckboxClass : "radio" === props.inputType && "undefined" != typeof props.indeterminateRadioClass && (indeterminateClass = props.indeterminateRadioClass);
var wrapProps = {
className: (0, _classnames3.default)((_classnames = {}, _defineProperty(_classnames, props.checkboxClass, "checkbox" === props.inputType), 
_defineProperty(_classnames, props.radioClass, "radio" === props.inputType), _defineProperty(_classnames, indeterminateClass, indeterminate), 
_defineProperty(_classnames, props.checkedClass, checked), _defineProperty(_classnames, props.disabledClass, disabled), 
_defineProperty(_classnames, props.hoverClass, this.state.hovered), _defineProperty(_classnames, props.focusClass, this.state.focused), 
_defineProperty(_classnames, props.activeClass, this.state.active), _classnames))
};
aria && (wrapProps.role = props.inputType, wrapProps["aria-labelledby"] = ""), props.inheritClass && (wrapProps.className = (0, 
_classnames3.default)(wrapProps.className, props.className)), props.inheritID && id && (wrapProps.id = _iCheck + "-" + id), 
helper = _react2.default.createElement("ins", {
className: _iCheckHelper,
style: layer,
onClick: this.handleHelperClick.bind(this)
});
var inputElement = _react2.default.createElement("input", _extends({}, other, {
ref: "checkbox",
type: props.inputType,
style: hide,
name: name,
value: value,
defaultChecked: props.defaultChecked,
onChange: this.handleChange.bind(this),
onBlur: this.handleBlur.bind(this),
onFocus: this.handleFocus.bind(this)
})), insertElement = props.insert;
insertElement && !_react2.default.isValidElement(insertElement) && (insertElement = _react2.default.createElement("div", {
dangerouslySetInnerHTML: {
__html: insertElement
}
}));
var inputContainer = _react2.default.createElement("div", _extends({
ref: "inputContainer"
}, wrapProps), inputElement, insertElement, helper), labelElement = props.label;
if (!labelElement) return inputContainer;
_react2.default.isValidElement(labelElement) || (labelElement = _react2.default.createElement("span", {
dangerouslySetInnerHTML: {
__html: labelElement
}
}));
var labelProps = {
onMouseOver: handleLabelEvent.bind(this),
onMouseOut: handleLabelEvent.bind(this),
onTouchStart: handleLabelEvent.bind(this),
onTouchEnd: handleLabelEvent.bind(this)
};
return labelClassName && (labelProps.className = labelClassName), _react2.default.createElement("label", labelProps, inputContainer, labelElement);
}
} ]), EnhancedSwitch;
}(_react2.default.Component);
exports.default = EnhancedSwitch, module.exports = exports.default;
}, function(module, exports, __webpack_require__) {
"use strict";
var _get = __webpack_require__(195).default, _inherits = __webpack_require__(196).default, _createClass = __webpack_require__(193).default, _classCallCheck = __webpack_require__(192).default, _extends = __webpack_require__(194).default, _interopRequireDefault = __webpack_require__(139).default;
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _EnhancedSwitch = __webpack_require__(432), _EnhancedSwitch2 = _interopRequireDefault(_EnhancedSwitch), Radio = function(_React$Component) {
function Radio() {
_classCallCheck(this, Radio), _get(Object.getPrototypeOf(Radio.prototype), "constructor", this).apply(this, arguments);
}
return _inherits(Radio, _React$Component), _createClass(Radio, [ {
key: "getValue",
value: function getValue() {
return this.refs.enhancedSwitch.getValue();
}
}, {
key: "setChecked",
value: function setChecked(newCheckedValue) {
this.refs.enhancedSwitch.setSwitched(newCheckedValue);
}
}, {
key: "isChecked",
value: function isChecked() {
return this.refs.enhancedSwitch.isSwitched();
}
}, {
key: "render",
value: function render() {
var enhancedSwitchProps = {
ref: "enhancedSwitch",
inputType: "radio"
};
return _react2.default.createElement(_EnhancedSwitch2.default, _extends({}, this.props, enhancedSwitchProps));
}
} ]), Radio;
}(_react2.default.Component);
exports.default = Radio, module.exports = exports.default;
}, [ 1134, 1011 ], function(module, exports) {
"use strict";
exports.default = function(obj, keys) {
var target = {};
for (var i in obj) keys.indexOf(i) >= 0 || Object.prototype.hasOwnProperty.call(obj, i) && (target[i] = obj[i]);
return target;
}, exports.__esModule = !0;
}, function(module, exports, __webpack_require__) {
var aFunction = __webpack_require__(1014);
module.exports = function(fn, that, length) {
if (aFunction(fn), void 0 === that) return fn;
switch (length) {
case 1:
return function(a) {
return fn.call(that, a);
};

case 2:
return function(a, b) {
return fn.call(that, a, b);
};

case 3:
return function(a, b, c) {
return fn.call(that, a, b, c);
};
}
return function() {
return fn.apply(that, arguments);
};
};
}, function(module, exports) {
module.exports = function(it) {
if (void 0 == it) throw TypeError("Can't call method on  " + it);
return it;
};
}, 189, function(module, exports, __webpack_require__) {
var cof = __webpack_require__(1016);
module.exports = Object("z").propertyIsEnumerable(0) ? Object : function(it) {
return "String" == cof(it) ? it.split("") : Object(it);
};
}, 190, function(module, exports, __webpack_require__) {
"use strict";
exports.__esModule = !0;
var _react = __webpack_require__(4);
exports.default = _react.PropTypes.shape({
subscribe: _react.PropTypes.func.isRequired,
dispatch: _react.PropTypes.func.isRequired,
getState: _react.PropTypes.func.isRequired
});
}, function(module, exports) {
"use strict";
function warning(message) {
"undefined" != typeof console && "function" == typeof console.error && console.error(message);
try {
throw new Error(message);
} catch (e) {}
}
exports.__esModule = !0, exports.default = warning;
}, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function updateIfElse(predicate, trueUpdates, falseUpdates, object) {
var test = "function" == typeof predicate ? predicate(object) : predicate, updates = test ? trueUpdates : falseUpdates;
return (0, _update2.default)(updates, object);
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _update = __webpack_require__(147), _update2 = _interopRequireDefault(_update), _wrap = __webpack_require__(118), _wrap2 = _interopRequireDefault(_wrap);
exports.default = (0, _wrap2.default)(updateIfElse);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function shallowEqual(object, otherObject) {
var equal = !0;
return (0, _forEach2.default)(otherObject, function(value, key) {
if (value !== object[key]) return equal = !1, !1;
}), equal;
}
function map(iteratee, object) {
var updater = "function" == typeof iteratee ? iteratee : (0, _update2.default)(iteratee), mapper = Array.isArray(object) ? _map2.default : _mapValues2.default, newObject = mapper(object, updater), equal = shallowEqual(object, newObject);
return equal ? object : newObject;
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _update = __webpack_require__(147), _update2 = _interopRequireDefault(_update), _wrap = __webpack_require__(118), _wrap2 = _interopRequireDefault(_wrap), _forEach = __webpack_require__(886), _forEach2 = _interopRequireDefault(_forEach), _map = __webpack_require__(893), _map2 = _interopRequireDefault(_map), _mapValues = __webpack_require__(894), _mapValues2 = _interopRequireDefault(_mapValues);
exports.default = (0, _wrap2.default)(map);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function splitPath(path) {
return Array.isArray(path) ? path : (0, _reject2.default)(path.split("."), function(x) {
return !x;
});
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.default = splitPath;
var _reject = __webpack_require__(393), _reject2 = _interopRequireDefault(_reject);
}, function(module, exports, __webpack_require__) {
"use strict";
function Url() {
this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, 
this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, 
this.path = null, this.href = null;
}
function urlParse(url, parseQueryString, slashesDenoteHost) {
if (url && util.isObject(url) && url instanceof Url) return url;
var u = new Url();
return u.parse(url, parseQueryString, slashesDenoteHost), u;
}
function urlFormat(obj) {
return util.isString(obj) && (obj = urlParse(obj)), obj instanceof Url ? obj.format() : Url.prototype.format.call(obj);
}
function urlResolve(source, relative) {
return urlParse(source, !1, !0).resolve(relative);
}
function urlResolveObject(source, relative) {
return source ? urlParse(source, !1, !0).resolveObject(relative) : relative;
}
var punycode = __webpack_require__(990), util = __webpack_require__(1129);
exports.parse = urlParse, exports.resolve = urlResolve, exports.resolveObject = urlResolveObject, 
exports.format = urlFormat, exports.Url = Url;
var protocolPattern = /^([a-z0-9.+-]+:)/i, portPattern = /:[0-9]*$/, simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, delims = [ "<", ">", '"', "`", " ", "\r", "\n", "\t" ], unwise = [ "{", "}", "|", "\\", "^", "`" ].concat(delims), autoEscape = [ "'" ].concat(unwise), nonHostChars = [ "%", "/", "?", ";", "#" ].concat(autoEscape), hostEndingChars = [ "/", "?", "#" ], hostnameMaxLen = 255, hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/, hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, unsafeProtocol = {
javascript: !0,
"javascript:": !0
}, hostlessProtocol = {
javascript: !0,
"javascript:": !0
}, slashedProtocol = {
http: !0,
https: !0,
ftp: !0,
gopher: !0,
file: !0,
"http:": !0,
"https:": !0,
"ftp:": !0,
"gopher:": !0,
"file:": !0
}, querystring = __webpack_require__(993);
Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
if (!util.isString(url)) throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
var queryIndex = url.indexOf("?"), splitter = queryIndex !== -1 && queryIndex < url.indexOf("#") ? "?" : "#", uSplit = url.split(splitter), slashRegex = /\\/g;
uSplit[0] = uSplit[0].replace(slashRegex, "/"), url = uSplit.join(splitter);
var rest = url;
if (rest = rest.trim(), !slashesDenoteHost && 1 === url.split("#").length) {
var simplePath = simplePathPattern.exec(rest);
if (simplePath) return this.path = rest, this.href = rest, this.pathname = simplePath[1], 
simplePath[2] ? (this.search = simplePath[2], parseQueryString ? this.query = querystring.parse(this.search.substr(1)) : this.query = this.search.substr(1)) : parseQueryString && (this.search = "", 
this.query = {}), this;
}
var proto = protocolPattern.exec(rest);
if (proto) {
proto = proto[0];
var lowerProto = proto.toLowerCase();
this.protocol = lowerProto, rest = rest.substr(proto.length);
}
if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
var slashes = "//" === rest.substr(0, 2);
!slashes || proto && hostlessProtocol[proto] || (rest = rest.substr(2), this.slashes = !0);
}
if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
for (var hostEnd = -1, i = 0; i < hostEndingChars.length; i++) {
var hec = rest.indexOf(hostEndingChars[i]);
hec !== -1 && (hostEnd === -1 || hec < hostEnd) && (hostEnd = hec);
}
var auth, atSign;
atSign = hostEnd === -1 ? rest.lastIndexOf("@") : rest.lastIndexOf("@", hostEnd), 
atSign !== -1 && (auth = rest.slice(0, atSign), rest = rest.slice(atSign + 1), this.auth = decodeURIComponent(auth)), 
hostEnd = -1;
for (var i = 0; i < nonHostChars.length; i++) {
var hec = rest.indexOf(nonHostChars[i]);
hec !== -1 && (hostEnd === -1 || hec < hostEnd) && (hostEnd = hec);
}
hostEnd === -1 && (hostEnd = rest.length), this.host = rest.slice(0, hostEnd), rest = rest.slice(hostEnd), 
this.parseHost(), this.hostname = this.hostname || "";
var ipv6Hostname = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
if (!ipv6Hostname) for (var hostparts = this.hostname.split(/\./), i = 0, l = hostparts.length; i < l; i++) {
var part = hostparts[i];
if (part && !part.match(hostnamePartPattern)) {
for (var newpart = "", j = 0, k = part.length; j < k; j++) newpart += part.charCodeAt(j) > 127 ? "x" : part[j];
if (!newpart.match(hostnamePartPattern)) {
var validParts = hostparts.slice(0, i), notHost = hostparts.slice(i + 1), bit = part.match(hostnamePartStart);
bit && (validParts.push(bit[1]), notHost.unshift(bit[2])), notHost.length && (rest = "/" + notHost.join(".") + rest), 
this.hostname = validParts.join(".");
break;
}
}
}
this.hostname.length > hostnameMaxLen ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), 
ipv6Hostname || (this.hostname = punycode.toASCII(this.hostname));
var p = this.port ? ":" + this.port : "", h = this.hostname || "";
this.host = h + p, this.href += this.host, ipv6Hostname && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), 
"/" !== rest[0] && (rest = "/" + rest));
}
if (!unsafeProtocol[lowerProto]) for (var i = 0, l = autoEscape.length; i < l; i++) {
var ae = autoEscape[i];
if (rest.indexOf(ae) !== -1) {
var esc = encodeURIComponent(ae);
esc === ae && (esc = escape(ae)), rest = rest.split(ae).join(esc);
}
}
var hash = rest.indexOf("#");
hash !== -1 && (this.hash = rest.substr(hash), rest = rest.slice(0, hash));
var qm = rest.indexOf("?");
if (qm !== -1 ? (this.search = rest.substr(qm), this.query = rest.substr(qm + 1), 
parseQueryString && (this.query = querystring.parse(this.query)), rest = rest.slice(0, qm)) : parseQueryString && (this.search = "", 
this.query = {}), rest && (this.pathname = rest), slashedProtocol[lowerProto] && this.hostname && !this.pathname && (this.pathname = "/"), 
this.pathname || this.search) {
var p = this.pathname || "", s = this.search || "";
this.path = p + s;
}
return this.href = this.format(), this;
}, Url.prototype.format = function() {
var auth = this.auth || "";
auth && (auth = encodeURIComponent(auth), auth = auth.replace(/%3A/i, ":"), auth += "@");
var protocol = this.protocol || "", pathname = this.pathname || "", hash = this.hash || "", host = !1, query = "";
this.host ? host = auth + this.host : this.hostname && (host = auth + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]"), 
this.port && (host += ":" + this.port)), this.query && util.isObject(this.query) && Object.keys(this.query).length && (query = querystring.stringify(this.query));
var search = this.search || query && "?" + query || "";
return protocol && ":" !== protocol.substr(-1) && (protocol += ":"), this.slashes || (!protocol || slashedProtocol[protocol]) && host !== !1 ? (host = "//" + (host || ""), 
pathname && "/" !== pathname.charAt(0) && (pathname = "/" + pathname)) : host || (host = ""), 
hash && "#" !== hash.charAt(0) && (hash = "#" + hash), search && "?" !== search.charAt(0) && (search = "?" + search), 
pathname = pathname.replace(/[?#]/g, function(match) {
return encodeURIComponent(match);
}), search = search.replace("#", "%23"), protocol + host + pathname + search + hash;
}, Url.prototype.resolve = function(relative) {
return this.resolveObject(urlParse(relative, !1, !0)).format();
}, Url.prototype.resolveObject = function(relative) {
if (util.isString(relative)) {
var rel = new Url();
rel.parse(relative, !1, !0), relative = rel;
}
for (var result = new Url(), tkeys = Object.keys(this), tk = 0; tk < tkeys.length; tk++) {
var tkey = tkeys[tk];
result[tkey] = this[tkey];
}
if (result.hash = relative.hash, "" === relative.href) return result.href = result.format(), 
result;
if (relative.slashes && !relative.protocol) {
for (var rkeys = Object.keys(relative), rk = 0; rk < rkeys.length; rk++) {
var rkey = rkeys[rk];
"protocol" !== rkey && (result[rkey] = relative[rkey]);
}
return slashedProtocol[result.protocol] && result.hostname && !result.pathname && (result.path = result.pathname = "/"), 
result.href = result.format(), result;
}
if (relative.protocol && relative.protocol !== result.protocol) {
if (!slashedProtocol[relative.protocol]) {
for (var keys = Object.keys(relative), v = 0; v < keys.length; v++) {
var k = keys[v];
result[k] = relative[k];
}
return result.href = result.format(), result;
}
if (result.protocol = relative.protocol, relative.host || hostlessProtocol[relative.protocol]) result.pathname = relative.pathname; else {
for (var relPath = (relative.pathname || "").split("/"); relPath.length && !(relative.host = relPath.shift()); ) ;
relative.host || (relative.host = ""), relative.hostname || (relative.hostname = ""), 
"" !== relPath[0] && relPath.unshift(""), relPath.length < 2 && relPath.unshift(""), 
result.pathname = relPath.join("/");
}
if (result.search = relative.search, result.query = relative.query, result.host = relative.host || "", 
result.auth = relative.auth, result.hostname = relative.hostname || relative.host, 
result.port = relative.port, result.pathname || result.search) {
var p = result.pathname || "", s = result.search || "";
result.path = p + s;
}
return result.slashes = result.slashes || relative.slashes, result.href = result.format(), 
result;
}
var isSourceAbs = result.pathname && "/" === result.pathname.charAt(0), isRelAbs = relative.host || relative.pathname && "/" === relative.pathname.charAt(0), mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname, removeAllDots = mustEndAbs, srcPath = result.pathname && result.pathname.split("/") || [], relPath = relative.pathname && relative.pathname.split("/") || [], psychotic = result.protocol && !slashedProtocol[result.protocol];
if (psychotic && (result.hostname = "", result.port = null, result.host && ("" === srcPath[0] ? srcPath[0] = result.host : srcPath.unshift(result.host)), 
result.host = "", relative.protocol && (relative.hostname = null, relative.port = null, 
relative.host && ("" === relPath[0] ? relPath[0] = relative.host : relPath.unshift(relative.host)), 
relative.host = null), mustEndAbs = mustEndAbs && ("" === relPath[0] || "" === srcPath[0])), 
isRelAbs) result.host = relative.host || "" === relative.host ? relative.host : result.host, 
result.hostname = relative.hostname || "" === relative.hostname ? relative.hostname : result.hostname, 
result.search = relative.search, result.query = relative.query, srcPath = relPath; else if (relPath.length) srcPath || (srcPath = []), 
srcPath.pop(), srcPath = srcPath.concat(relPath), result.search = relative.search, 
result.query = relative.query; else if (!util.isNullOrUndefined(relative.search)) {
if (psychotic) {
result.hostname = result.host = srcPath.shift();
var authInHost = !!(result.host && result.host.indexOf("@") > 0) && result.host.split("@");
authInHost && (result.auth = authInHost.shift(), result.host = result.hostname = authInHost.shift());
}
return result.search = relative.search, result.query = relative.query, util.isNull(result.pathname) && util.isNull(result.search) || (result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "")), 
result.href = result.format(), result;
}
if (!srcPath.length) return result.pathname = null, result.search ? result.path = "/" + result.search : result.path = null, 
result.href = result.format(), result;
for (var last = srcPath.slice(-1)[0], hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && ("." === last || ".." === last) || "" === last, up = 0, i = srcPath.length; i >= 0; i--) last = srcPath[i], 
"." === last ? srcPath.splice(i, 1) : ".." === last ? (srcPath.splice(i, 1), up++) : up && (srcPath.splice(i, 1), 
up--);
if (!mustEndAbs && !removeAllDots) for (;up--; up) srcPath.unshift("..");
!mustEndAbs || "" === srcPath[0] || srcPath[0] && "/" === srcPath[0].charAt(0) || srcPath.unshift(""), 
hasTrailingSlash && "/" !== srcPath.join("/").substr(-1) && srcPath.push("");
var isAbsolute = "" === srcPath[0] || srcPath[0] && "/" === srcPath[0].charAt(0);
if (psychotic) {
result.hostname = result.host = isAbsolute ? "" : srcPath.length ? srcPath.shift() : "";
var authInHost = !!(result.host && result.host.indexOf("@") > 0) && result.host.split("@");
authInHost && (result.auth = authInHost.shift(), result.host = result.hostname = authInHost.shift());
}
return mustEndAbs = mustEndAbs || result.host && srcPath.length, mustEndAbs && !isAbsolute && srcPath.unshift(""), 
srcPath.length ? result.pathname = srcPath.join("/") : (result.pathname = null, 
result.path = null), util.isNull(result.pathname) && util.isNull(result.search) || (result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "")), 
result.auth = relative.auth || result.auth, result.slashes = result.slashes || relative.slashes, 
result.href = result.format(), result;
}, Url.prototype.parseHost = function() {
var host = this.host, port = portPattern.exec(host);
port && (port = port[0], ":" !== port && (this.port = port.substr(1)), host = host.substr(0, host.length - port.length)), 
host && (this.hostname = host);
};
}, , function(module, exports) {
(function(__webpack_amd_options__) {
module.exports = __webpack_amd_options__;
}).call(exports, {});
}, function(module, exports, __webpack_require__) {
(function(global) {
module.exports = global.phq = __webpack_require__(511);
}).call(exports, function() {
return this;
}());
}, function(module, exports) {}, 492, 492, function(module, exports) {
module.exports = [ {
alpha2: "AC",
alpha3: "",
countryCallingCodes: [ "+247" ],
currencies: [ "USD" ],
ioc: "SHP",
languages: [ "eng" ],
name: "Ascension Island",
status: "reserved"
}, {
alpha2: "AD",
alpha3: "AND",
countryCallingCodes: [ "+376" ],
currencies: [ "EUR" ],
ioc: "AND",
languages: [ "cat" ],
name: "Andorra",
status: "assigned"
}, {
alpha2: "AE",
alpha3: "ARE",
countryCallingCodes: [ "+971" ],
currencies: [ "AED" ],
ioc: "UAE",
languages: [ "ara" ],
name: "United Arab Emirates",
status: "assigned"
}, {
alpha2: "AF",
alpha3: "AFG",
countryCallingCodes: [ "+93" ],
currencies: [ "AFN" ],
ioc: "AFG",
languages: [ "pus" ],
name: "Afghanistan",
status: "assigned"
}, {
alpha2: "AG",
alpha3: "ATG",
countryCallingCodes: [ "+1 268" ],
currencies: [ "XCD" ],
ioc: "ANT",
languages: [ "eng" ],
name: "Antigua And Barbuda",
status: "assigned"
}, {
alpha2: "AI",
alpha3: "AIA",
countryCallingCodes: [ "+1 264" ],
currencies: [ "XCD" ],
ioc: "",
languages: [ "eng" ],
name: "Anguilla",
status: "assigned"
}, {
alpha2: "AI",
alpha3: "AFI",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "French Afar and Issas",
status: "deleted"
}, {
alpha2: "AL",
alpha3: "ALB",
countryCallingCodes: [ "+355" ],
currencies: [ "ALL" ],
ioc: "ALB",
languages: [ "sqi" ],
name: "Albania",
status: "assigned"
}, {
alpha2: "AM",
alpha3: "ARM",
countryCallingCodes: [ "+374" ],
currencies: [ "AMD" ],
ioc: "ARM",
languages: [ "hye", "rus" ],
name: "Armenia",
status: "assigned"
}, {
alpha2: "AN",
alpha3: "ANT",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Netherlands Antilles",
status: "deleted"
}, {
alpha2: "AO",
alpha3: "AGO",
countryCallingCodes: [ "+244" ],
currencies: [ "AOA" ],
ioc: "ANG",
languages: [ "por" ],
name: "Angola",
status: "assigned"
}, {
alpha2: "AQ",
alpha3: "ATA",
countryCallingCodes: [ "+672" ],
currencies: [],
ioc: "",
languages: [],
name: "Antarctica",
status: "assigned"
}, {
alpha2: "AR",
alpha3: "ARG",
countryCallingCodes: [ "+54" ],
currencies: [ "ARS" ],
ioc: "ARG",
languages: [ "spa" ],
name: "Argentina",
status: "assigned"
}, {
alpha2: "AS",
alpha3: "ASM",
countryCallingCodes: [ "+1 684" ],
currencies: [ "USD" ],
ioc: "ASA",
languages: [ "eng", "smo" ],
name: "American Samoa",
status: "assigned"
}, {
alpha2: "AT",
alpha3: "AUT",
countryCallingCodes: [ "+43" ],
currencies: [ "EUR" ],
ioc: "AUT",
languages: [ "deu" ],
name: "Austria",
status: "assigned"
}, {
alpha2: "AU",
alpha3: "AUS",
countryCallingCodes: [ "+61" ],
currencies: [ "AUD" ],
ioc: "AUS",
languages: [ "eng" ],
name: "Australia",
status: "assigned"
}, {
alpha2: "AW",
alpha3: "ABW",
countryCallingCodes: [ "+297" ],
currencies: [ "AWG" ],
ioc: "ARU",
languages: [ "nld" ],
name: "Aruba",
status: "assigned"
}, {
alpha2: "AX",
alpha3: "ALA",
countryCallingCodes: [ "+358" ],
currencies: [ "EUR" ],
ioc: "",
languages: [ "swe" ],
name: "Åland Islands",
status: "assigned"
}, {
alpha2: "AZ",
alpha3: "AZE",
countryCallingCodes: [ "+994" ],
currencies: [ "AZN" ],
ioc: "AZE",
languages: [ "aze" ],
name: "Azerbaijan",
status: "assigned"
}, {
alpha2: "BA",
alpha3: "BIH",
countryCallingCodes: [ "+387" ],
currencies: [ "BAM" ],
ioc: "BIH",
languages: [ "bos", "cre", "srp" ],
name: "Bosnia & Herzegovina",
status: "assigned"
}, {
alpha2: "BB",
alpha3: "BRB",
countryCallingCodes: [ "+1 246" ],
currencies: [ "BBD" ],
ioc: "BAR",
languages: [ "eng" ],
name: "Barbados",
status: "assigned"
}, {
alpha2: "BD",
alpha3: "BGD",
countryCallingCodes: [ "+880" ],
currencies: [ "BDT" ],
ioc: "BAN",
languages: [ "ben" ],
name: "Bangladesh",
status: "assigned"
}, {
alpha2: "BE",
alpha3: "BEL",
countryCallingCodes: [ "+32" ],
currencies: [ "EUR" ],
ioc: "BEL",
languages: [ "nld", "fra", "deu" ],
name: "Belgium",
status: "assigned"
}, {
alpha2: "BF",
alpha3: "BFA",
countryCallingCodes: [ "+226" ],
currencies: [ "XOF" ],
ioc: "BUR",
languages: [ "fra" ],
name: "Burkina Faso",
status: "assigned"
}, {
alpha2: "BG",
alpha3: "BGR",
countryCallingCodes: [ "+359" ],
currencies: [ "BGN" ],
ioc: "BUL",
languages: [ "bul" ],
name: "Bulgaria",
status: "assigned"
}, {
alpha2: "BH",
alpha3: "BHR",
countryCallingCodes: [ "+973" ],
currencies: [ "BHD" ],
ioc: "BRN",
languages: [ "ara" ],
name: "Bahrain",
status: "assigned"
}, {
alpha2: "BI",
alpha3: "BDI",
countryCallingCodes: [ "+257" ],
currencies: [ "BIF" ],
ioc: "BDI",
languages: [ "fra" ],
name: "Burundi",
status: "assigned"
}, {
alpha2: "BJ",
alpha3: "BEN",
countryCallingCodes: [ "+229" ],
currencies: [ "XOF" ],
ioc: "BEN",
languages: [ "fra" ],
name: "Benin",
status: "assigned"
}, {
alpha2: "BL",
alpha3: "BLM",
countryCallingCodes: [ "+590" ],
currencies: [ "EUR" ],
ioc: "",
languages: [ "fra" ],
name: "Saint Barthélemy",
status: "assigned"
}, {
alpha2: "BM",
alpha3: "BMU",
countryCallingCodes: [ "+1 441" ],
currencies: [ "BMD" ],
ioc: "BER",
languages: [ "eng" ],
name: "Bermuda",
status: "assigned"
}, {
alpha2: "BN",
alpha3: "BRN",
countryCallingCodes: [ "+673" ],
currencies: [ "BND" ],
ioc: "BRU",
languages: [ "msa", "eng" ],
name: "Brunei Darussalam",
status: "assigned"
}, {
alpha2: "BO",
alpha3: "BOL",
countryCallingCodes: [ "+591" ],
currencies: [ "BOB", "BOV" ],
ioc: "BOL",
languages: [ "spa", "aym", "que" ],
name: "Bolivia, Plurinational State Of",
status: "assigned"
}, {
alpha2: "BQ",
alpha3: "BES",
countryCallingCodes: [ "+599" ],
currencies: [ "USD" ],
ioc: "",
languages: [ "nld" ],
name: "Bonaire, Saint Eustatius And Saba",
status: "assigned"
}, {
alpha2: "BQ",
alpha3: " ATB",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "British Antarctic Territory",
status: "deleted"
}, {
alpha2: "BR",
alpha3: "BRA",
countryCallingCodes: [ "+55" ],
currencies: [ "BRL" ],
ioc: "BRA",
languages: [ "por" ],
name: "Brazil",
status: "assigned"
}, {
alpha2: "BS",
alpha3: "BHS",
countryCallingCodes: [ "+1 242" ],
currencies: [ "BSD" ],
ioc: "BAH",
languages: [ "eng" ],
name: "Bahamas",
status: "assigned"
}, {
alpha2: "BT",
alpha3: "BTN",
countryCallingCodes: [ "+975" ],
currencies: [ "INR", "BTN" ],
ioc: "BHU",
languages: [ "dzo" ],
name: "Bhutan",
status: "assigned"
}, {
alpha2: "BU",
alpha3: "BUR",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Burma",
status: "deleted"
}, {
alpha2: "BV",
alpha3: "BVT",
countryCallingCodes: [],
currencies: [ "NOK" ],
ioc: "",
languages: [],
name: "Bouvet Island",
status: "assigned"
}, {
alpha2: "BW",
alpha3: "BWA",
countryCallingCodes: [ "+267" ],
currencies: [ "BWP" ],
ioc: "BOT",
languages: [ "eng", "tsn" ],
name: "Botswana",
status: "assigned"
}, {
alpha2: "BY",
alpha3: "BLR",
countryCallingCodes: [ "+375" ],
currencies: [ "BYR" ],
ioc: "BLR",
languages: [ "bel", "rus" ],
name: "Belarus",
status: "assigned"
}, {
alpha2: "BY",
alpha3: "BYS",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Byelorussian SSR",
status: "deleted"
}, {
alpha2: "BZ",
alpha3: "BLZ",
countryCallingCodes: [ "+501" ],
currencies: [ "BZD" ],
ioc: "BIZ",
languages: [ "eng" ],
name: "Belize",
status: "assigned"
}, {
alpha2: "CA",
alpha3: "CAN",
countryCallingCodes: [ "+1" ],
currencies: [ "CAD" ],
ioc: "CAN",
languages: [ "eng", "fra" ],
name: "Canada",
status: "assigned"
}, {
alpha2: "CC",
alpha3: "CCK",
countryCallingCodes: [ "+61" ],
currencies: [ "AUD" ],
ioc: "",
languages: [ "eng" ],
name: "Cocos (Keeling) Islands",
status: "assigned"
}, {
alpha2: "CD",
alpha3: "COD",
countryCallingCodes: [ "+243" ],
currencies: [ "CDF" ],
ioc: "COD",
languages: [ "fra", "lin", "kon", "swa" ],
name: "Democratic Republic Of Congo",
status: "assigned"
}, {
alpha2: "CF",
alpha3: "CAF",
countryCallingCodes: [ "+236" ],
currencies: [ "XAF" ],
ioc: "CAF",
languages: [ "fra", "sag" ],
name: "Central African Republic",
status: "assigned"
}, {
alpha2: "CG",
alpha3: "COG",
countryCallingCodes: [ "+242" ],
currencies: [ "XAF" ],
ioc: "CGO",
languages: [ "fra", "lin" ],
name: "Republic Of Congo",
status: "assigned"
}, {
alpha2: "CH",
alpha3: "CHE",
countryCallingCodes: [ "+41" ],
currencies: [ "CHF", "CHE", "CHW" ],
ioc: "SUI",
languages: [ "deu", "fra", "ita", "roh" ],
name: "Switzerland",
status: "assigned"
}, {
alpha2: "CI",
alpha3: "CIV",
countryCallingCodes: [ "+225" ],
currencies: [ "XOF" ],
ioc: "CIV",
languages: [ "fra" ],
name: "Côte d'Ivoire",
status: "assigned"
}, {
alpha2: "CK",
alpha3: "COK",
countryCallingCodes: [ "+682" ],
currencies: [ "NZD" ],
ioc: "COK",
languages: [ "eng", "mri" ],
name: "Cook Islands",
status: "assigned"
}, {
alpha2: "CL",
alpha3: "CHL",
countryCallingCodes: [ "+56" ],
currencies: [ "CLP", "CLF" ],
ioc: "CHI",
languages: [ "spa" ],
name: "Chile",
status: "assigned"
}, {
alpha2: "CM",
alpha3: "CMR",
countryCallingCodes: [ "+237" ],
currencies: [ "XAF" ],
ioc: "CMR",
languages: [ "eng", "fra" ],
name: "Cameroon",
status: "assigned"
}, {
alpha2: "CN",
alpha3: "CHN",
countryCallingCodes: [ "+86" ],
currencies: [ "CNY" ],
ioc: "CHN",
languages: [ "zho" ],
name: "China",
status: "assigned"
}, {
alpha2: "CO",
alpha3: "COL",
countryCallingCodes: [ "+57" ],
currencies: [ "COP", "COU" ],
ioc: "COL",
languages: [ "spa" ],
name: "Colombia",
status: "assigned"
}, {
alpha2: "CP",
alpha3: "",
countryCallingCodes: [],
currencies: [ "EUR" ],
ioc: "",
languages: [],
name: "Clipperton Island",
status: "reserved"
}, {
alpha2: "CR",
alpha3: "CRI",
countryCallingCodes: [ "+506" ],
currencies: [ "CRC" ],
ioc: "CRC",
languages: [ "spa" ],
name: "Costa Rica",
status: "assigned"
}, {
alpha2: "CS",
alpha3: "CSK",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Czechoslovakia",
status: "deleted"
}, {
alpha2: "CS",
alpha3: "SCG",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Serbia and Montenegro",
status: "deleted"
}, {
alpha2: "CT",
alpha3: "CTE",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Canton and Enderbury Islands",
status: "deleted"
}, {
alpha2: "CU",
alpha3: "CUB",
countryCallingCodes: [ "+53" ],
currencies: [ "CUP", "CUC" ],
ioc: "CUB",
languages: [ "spa" ],
name: "Cuba",
status: "assigned"
}, {
alpha2: "CV",
alpha3: "CPV",
countryCallingCodes: [ "+238" ],
currencies: [ "CVE" ],
ioc: "CPV",
languages: [ "por" ],
name: "Cabo Verde",
status: "assigned"
}, {
alpha2: "CW",
alpha3: "CUW",
countryCallingCodes: [ "+599" ],
currencies: [ "ANG" ],
ioc: "",
languages: [ "nld" ],
name: "Curacao",
status: "assigned"
}, {
alpha2: "CX",
alpha3: "CXR",
countryCallingCodes: [ "+61" ],
currencies: [ "AUD" ],
ioc: "",
languages: [ "eng" ],
name: "Christmas Island",
status: "assigned"
}, {
alpha2: "CY",
alpha3: "CYP",
countryCallingCodes: [ "+357" ],
currencies: [ "EUR" ],
ioc: "CYP",
languages: [ "ell", "tur" ],
name: "Cyprus",
status: "assigned"
}, {
alpha2: "CZ",
alpha3: "CZE",
countryCallingCodes: [ "+420" ],
currencies: [ "CZK" ],
ioc: "CZE",
languages: [ "ces" ],
name: "Czech Republic",
status: "assigned"
}, {
alpha2: "DD",
alpha3: "DDR",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "German Democratic Republic",
status: "deleted"
}, {
alpha2: "DE",
alpha3: "DEU",
countryCallingCodes: [ "+49" ],
currencies: [ "EUR" ],
ioc: "GER",
languages: [ "deu" ],
name: "Germany",
status: "assigned"
}, {
alpha2: "DG",
alpha3: "",
countryCallingCodes: [],
currencies: [ "USD" ],
ioc: "",
languages: [],
name: "Diego Garcia",
status: "reserved"
}, {
alpha2: "DJ",
alpha3: "DJI",
countryCallingCodes: [ "+253" ],
currencies: [ "DJF" ],
ioc: "DJI",
languages: [ "ara", "fra" ],
name: "Djibouti",
status: "assigned"
}, {
alpha2: "DK",
alpha3: "DNK",
countryCallingCodes: [ "+45" ],
currencies: [ "DKK" ],
ioc: "DEN",
languages: [ "dan" ],
name: "Denmark",
status: "assigned"
}, {
alpha2: "DM",
alpha3: "DMA",
countryCallingCodes: [ "+1 767" ],
currencies: [ "XCD" ],
ioc: "DMA",
languages: [ "eng" ],
name: "Dominica",
status: "assigned"
}, {
alpha2: "DO",
alpha3: "DOM",
countryCallingCodes: [ "+1 809", "+1 829", "+1 849" ],
currencies: [ "DOP" ],
ioc: "DOM",
languages: [ "spa" ],
name: "Dominican Republic",
status: "assigned"
}, {
alpha2: "DY",
alpha3: "DHY",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Dahomey",
status: "deleted"
}, {
alpha2: "DZ",
alpha3: "DZA",
countryCallingCodes: [ "+213" ],
currencies: [ "DZD" ],
ioc: "ALG",
languages: [ "ara" ],
name: "Algeria",
status: "assigned"
}, {
alpha2: "EA",
alpha3: "",
countryCallingCodes: [],
currencies: [ "EUR" ],
ioc: "",
languages: [],
name: "Ceuta, Mulilla",
status: "reserved"
}, {
alpha2: "EC",
alpha3: "ECU",
countryCallingCodes: [ "+593" ],
currencies: [ "USD" ],
ioc: "ECU",
languages: [ "spa", "que" ],
name: "Ecuador",
status: "assigned"
}, {
alpha2: "EE",
alpha3: "EST",
countryCallingCodes: [ "+372" ],
currencies: [ "EUR" ],
ioc: "EST",
languages: [ "est" ],
name: "Estonia",
status: "assigned"
}, {
alpha2: "EG",
alpha3: "EGY",
countryCallingCodes: [ "+20" ],
currencies: [ "EGP" ],
ioc: "EGY",
languages: [ "ara" ],
name: "Egypt",
status: "assigned"
}, {
alpha2: "EH",
alpha3: "ESH",
countryCallingCodes: [ "+212" ],
currencies: [ "MAD" ],
ioc: "",
languages: [],
name: "Western Sahara",
status: "assigned"
}, {
alpha2: "ER",
alpha3: "ERI",
countryCallingCodes: [ "+291" ],
currencies: [ "ERN" ],
ioc: "ERI",
languages: [ "eng", "ara", "tir" ],
name: "Eritrea",
status: "assigned"
}, {
alpha2: "ES",
alpha3: "ESP",
countryCallingCodes: [ "+34" ],
currencies: [ "EUR" ],
ioc: "ESP",
languages: [ "spa" ],
name: "Spain",
status: "assigned"
}, {
alpha2: "ET",
alpha3: "ETH",
countryCallingCodes: [ "+251" ],
currencies: [ "ETB" ],
ioc: "ETH",
languages: [ "amh" ],
name: "Ethiopia",
status: "assigned"
}, {
alpha2: "EU",
alpha3: "",
countryCallingCodes: [ "+388" ],
currencies: [ "EUR" ],
ioc: "",
languages: [],
name: "European Union",
status: "reserved"
}, {
alpha2: "FI",
alpha3: "FIN",
countryCallingCodes: [ "+358" ],
currencies: [ "EUR" ],
ioc: "FIN",
languages: [ "fin", "swe" ],
name: "Finland",
status: "assigned"
}, {
alpha2: "FJ",
alpha3: "FJI",
countryCallingCodes: [ "+679" ],
currencies: [ "FJD" ],
ioc: "FIJ",
languages: [ "eng", "fij" ],
name: "Fiji",
status: "assigned"
}, {
alpha2: "FK",
alpha3: "FLK",
countryCallingCodes: [ "+500" ],
currencies: [ "FKP" ],
ioc: "",
languages: [ "eng" ],
name: "Falkland Islands",
status: "assigned"
}, {
alpha2: "FM",
alpha3: "FSM",
countryCallingCodes: [ "+691" ],
currencies: [ "USD" ],
ioc: "",
languages: [ "eng" ],
name: "Micronesia, Federated States Of",
status: "assigned"
}, {
alpha2: "FO",
alpha3: "FRO",
countryCallingCodes: [ "+298" ],
currencies: [ "DKK" ],
ioc: "FAI",
languages: [ "fao", "dan" ],
name: "Faroe Islands",
status: "assigned"
}, {
alpha2: "FQ",
alpha3: "ATF",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "French Southern and Antarctic Territories",
status: "deleted"
}, {
alpha2: "FR",
alpha3: "FRA",
countryCallingCodes: [ "+33" ],
currencies: [ "EUR" ],
ioc: "FRA",
languages: [ "fra" ],
name: "France",
status: "assigned"
}, {
alpha2: "FX",
alpha3: "",
countryCallingCodes: [ "+241" ],
currencies: [ "EUR" ],
ioc: "",
languages: [ "fra" ],
name: "France, Metropolitan",
status: "reserved"
}, {
alpha2: "GA",
alpha3: "GAB",
countryCallingCodes: [ "+241" ],
currencies: [ "XAF" ],
ioc: "GAB",
languages: [ "fra" ],
name: "Gabon",
status: "assigned"
}, {
alpha2: "GB",
alpha3: "GBR",
countryCallingCodes: [ "+44" ],
currencies: [ "GBP" ],
ioc: "GBR",
languages: [ "eng", "cor", "gle", "gla", "cym" ],
name: "United Kingdom",
status: "assigned"
}, {
alpha2: "GD",
alpha3: "GRD",
countryCallingCodes: [ "+473" ],
currencies: [ "XCD" ],
ioc: "GRN",
languages: [ "eng" ],
name: "Grenada",
status: "assigned"
}, {
alpha2: "GE",
alpha3: "GEO",
countryCallingCodes: [ "+995" ],
currencies: [ "GEL" ],
ioc: "GEO",
languages: [ "kat" ],
name: "Georgia",
status: "assigned"
}, {
alpha2: "GE",
alpha3: "GEL",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Gilbert and Ellice Islands",
status: "deleted"
}, {
alpha2: "GF",
alpha3: "GUF",
countryCallingCodes: [ "+594" ],
currencies: [ "EUR" ],
ioc: "",
languages: [ "fra" ],
name: "French Guiana",
status: "assigned"
}, {
alpha2: "GG",
alpha3: "GGY",
countryCallingCodes: [ "+44" ],
currencies: [ "GBP" ],
ioc: "GCI",
languages: [ "fra" ],
name: "Guernsey",
status: "assigned"
}, {
alpha2: "GH",
alpha3: "GHA",
countryCallingCodes: [ "+233" ],
currencies: [ "GHS" ],
ioc: "GHA",
languages: [ "eng" ],
name: "Ghana",
status: "assigned"
}, {
alpha2: "GI",
alpha3: "GIB",
countryCallingCodes: [ "+350" ],
currencies: [ "GIP" ],
ioc: "",
languages: [ "eng" ],
name: "Gibraltar",
status: "assigned"
}, {
alpha2: "GL",
alpha3: "GRL",
countryCallingCodes: [ "+299" ],
currencies: [ "DKK" ],
ioc: "",
languages: [ "kal" ],
name: "Greenland",
status: "assigned"
}, {
alpha2: "GM",
alpha3: "GMB",
countryCallingCodes: [ "+220" ],
currencies: [ "GMD" ],
ioc: "GAM",
languages: [ "eng" ],
name: "Gambia",
status: "assigned"
}, {
alpha2: "GN",
alpha3: "GIN",
countryCallingCodes: [ "+224" ],
currencies: [ "GNF" ],
ioc: "GUI",
languages: [ "fra" ],
name: "Guinea",
status: "assigned"
}, {
alpha2: "GP",
alpha3: "GLP",
countryCallingCodes: [ "+590" ],
currencies: [ "EUR" ],
ioc: "",
languages: [ "fra" ],
name: "Guadeloupe",
status: "assigned"
}, {
alpha2: "GQ",
alpha3: "GNQ",
countryCallingCodes: [ "+240" ],
currencies: [ "XAF" ],
ioc: "GEQ",
languages: [ "spa", "fra", "por" ],
name: "Equatorial Guinea",
status: "assigned"
}, {
alpha2: "GR",
alpha3: "GRC",
countryCallingCodes: [ "+30" ],
currencies: [ "EUR" ],
ioc: "GRE",
languages: [ "ell" ],
name: "Greece",
status: "assigned"
}, {
alpha2: "GS",
alpha3: "SGS",
countryCallingCodes: [],
currencies: [ "GBP" ],
ioc: "",
languages: [ "eng" ],
name: "South Georgia And The South Sandwich Islands",
status: "assigned"
}, {
alpha2: "GT",
alpha3: "GTM",
countryCallingCodes: [ "+502" ],
currencies: [ "GTQ" ],
ioc: "GUA",
languages: [ "spa" ],
name: "Guatemala",
status: "assigned"
}, {
alpha2: "GU",
alpha3: "GUM",
countryCallingCodes: [ "+1 671" ],
currencies: [ "USD" ],
ioc: "GUM",
languages: [ "eng" ],
name: "Guam",
status: "assigned"
}, {
alpha2: "GW",
alpha3: "GNB",
countryCallingCodes: [ "+245" ],
currencies: [ "XOF" ],
ioc: "GBS",
languages: [ "por" ],
name: "Guinea-bissau",
status: "assigned"
}, {
alpha2: "GY",
alpha3: "GUY",
countryCallingCodes: [ "+592" ],
currencies: [ "GYD" ],
ioc: "GUY",
languages: [ "eng" ],
name: "Guyana",
status: "assigned"
}, {
alpha2: "HK",
alpha3: "HKG",
countryCallingCodes: [ "+852" ],
currencies: [ "HKD" ],
ioc: "HKG",
languages: [ "zho", "eng" ],
name: "Hong Kong",
status: "assigned"
}, {
alpha2: "HM",
alpha3: "HMD",
countryCallingCodes: [],
currencies: [ "AUD" ],
ioc: "",
languages: [],
name: "Heard Island And McDonald Islands",
status: "assigned"
}, {
alpha2: "HN",
alpha3: "HND",
countryCallingCodes: [ "+504" ],
currencies: [ "HNL" ],
ioc: "HON",
languages: [ "spa" ],
name: "Honduras",
status: "assigned"
}, {
alpha2: "HR",
alpha3: "HRV",
countryCallingCodes: [ "+385" ],
currencies: [ "HRK" ],
ioc: "CRO",
languages: [ "hrv" ],
name: "Croatia",
status: "assigned"
}, {
alpha2: "HT",
alpha3: "HTI",
countryCallingCodes: [ "+509" ],
currencies: [ "HTG", "USD" ],
ioc: "HAI",
languages: [ "fra", "hat" ],
name: "Haiti",
status: "assigned"
}, {
alpha2: "HU",
alpha3: "HUN",
countryCallingCodes: [ "+36" ],
currencies: [ "HUF" ],
ioc: "HUN",
languages: [ "hun" ],
name: "Hungary",
status: "assigned"
}, {
alpha2: "HV",
alpha3: "HVO",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Upper Volta",
status: "deleted"
}, {
alpha2: "IC",
alpha3: "",
countryCallingCodes: [],
currencies: [ "EUR" ],
ioc: "",
languages: [],
name: "Canary Islands",
status: "reserved"
}, {
alpha2: "ID",
alpha3: "IDN",
countryCallingCodes: [ "+62" ],
currencies: [ "IDR" ],
ioc: "INA",
languages: [ "ind" ],
name: "Indonesia",
status: "assigned"
}, {
alpha2: "IE",
alpha3: "IRL",
countryCallingCodes: [ "+353" ],
currencies: [ "EUR" ],
ioc: "IRL",
languages: [ "eng", "gle" ],
name: "Ireland",
status: "assigned"
}, {
alpha2: "IL",
alpha3: "ISR",
countryCallingCodes: [ "+972" ],
currencies: [ "ILS" ],
ioc: "ISR",
languages: [ "heb", "ara", "eng" ],
name: "Israel",
status: "assigned"
}, {
alpha2: "IM",
alpha3: "IMN",
countryCallingCodes: [ "+44" ],
currencies: [ "GBP" ],
ioc: "",
languages: [ "eng", "glv" ],
name: "Isle Of Man",
status: "assigned"
}, {
alpha2: "IN",
alpha3: "IND",
countryCallingCodes: [ "+91" ],
currencies: [ "INR" ],
ioc: "IND",
languages: [ "eng", "hin" ],
name: "India",
status: "assigned"
}, {
alpha2: "IO",
alpha3: "IOT",
countryCallingCodes: [ "+246" ],
currencies: [ "USD" ],
ioc: "",
languages: [ "eng" ],
name: "British Indian Ocean Territory",
status: "assigned"
}, {
alpha2: "IQ",
alpha3: "IRQ",
countryCallingCodes: [ "+964" ],
currencies: [ "IQD" ],
ioc: "IRQ",
languages: [ "ara", "kur" ],
name: "Iraq",
status: "assigned"
}, {
alpha2: "IR",
alpha3: "IRN",
countryCallingCodes: [ "+98" ],
currencies: [ "IRR" ],
ioc: "IRI",
languages: [ "fas" ],
name: "Iran, Islamic Republic Of",
status: "assigned"
}, {
alpha2: "IS",
alpha3: "ISL",
countryCallingCodes: [ "+354" ],
currencies: [ "ISK" ],
ioc: "ISL",
languages: [ "isl" ],
name: "Iceland",
status: "assigned"
}, {
alpha2: "IT",
alpha3: "ITA",
countryCallingCodes: [ "+39" ],
currencies: [ "EUR" ],
ioc: "ITA",
languages: [ "ita" ],
name: "Italy",
status: "assigned"
}, {
alpha2: "JE",
alpha3: "JEY",
countryCallingCodes: [ "+44" ],
currencies: [ "GBP" ],
ioc: "JCI",
languages: [ "eng", "fra" ],
name: "Jersey",
status: "assigned"
}, {
alpha2: "JM",
alpha3: "JAM",
countryCallingCodes: [ "+1 876" ],
currencies: [ "JMD" ],
ioc: "JAM",
languages: [ "eng" ],
name: "Jamaica",
status: "assigned"
}, {
alpha2: "JO",
alpha3: "JOR",
countryCallingCodes: [ "+962" ],
currencies: [ "JOD" ],
ioc: "JOR",
languages: [ "ara" ],
name: "Jordan",
status: "assigned"
}, {
alpha2: "JP",
alpha3: "JPN",
countryCallingCodes: [ "+81" ],
currencies: [ "JPY" ],
ioc: "JPN",
languages: [ "jpn" ],
name: "Japan",
status: "assigned"
}, {
alpha2: "JT",
alpha3: "JTN",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Johnston Island",
status: "deleted"
}, {
alpha2: "KE",
alpha3: "KEN",
countryCallingCodes: [ "+254" ],
currencies: [ "KES" ],
ioc: "KEN",
languages: [ "eng", "swa" ],
name: "Kenya",
status: "assigned"
}, {
alpha2: "KG",
alpha3: "KGZ",
countryCallingCodes: [ "+996" ],
currencies: [ "KGS" ],
ioc: "KGZ",
languages: [ "rus" ],
name: "Kyrgyzstan",
status: "assigned"
}, {
alpha2: "KH",
alpha3: "KHM",
countryCallingCodes: [ "+855" ],
currencies: [ "KHR" ],
ioc: "CAM",
languages: [ "khm" ],
name: "Cambodia",
status: "assigned"
}, {
alpha2: "KI",
alpha3: "KIR",
countryCallingCodes: [ "+686" ],
currencies: [ "AUD" ],
ioc: "KIR",
languages: [ "eng" ],
name: "Kiribati",
status: "assigned"
}, {
alpha2: "KM",
alpha3: "COM",
countryCallingCodes: [ "+269" ],
currencies: [ "KMF" ],
ioc: "COM",
languages: [ "ara", "fra" ],
name: "Comoros",
status: "assigned"
}, {
alpha2: "KN",
alpha3: "KNA",
countryCallingCodes: [ "+1 869" ],
currencies: [ "XCD" ],
ioc: "SKN",
languages: [ "eng" ],
name: "Saint Kitts And Nevis",
status: "assigned"
}, {
alpha2: "KP",
alpha3: "PRK",
countryCallingCodes: [ "+850" ],
currencies: [ "KPW" ],
ioc: "PRK",
languages: [ "kor" ],
name: "Korea, Democratic People's Republic Of",
status: "assigned"
}, {
alpha2: "KR",
alpha3: "KOR",
countryCallingCodes: [ "+82" ],
currencies: [ "KRW" ],
ioc: "KOR",
languages: [ "kor" ],
name: "Korea, Republic Of",
status: "assigned"
}, {
alpha2: "KW",
alpha3: "KWT",
countryCallingCodes: [ "+965" ],
currencies: [ "KWD" ],
ioc: "KUW",
languages: [ "ara" ],
name: "Kuwait",
status: "assigned"
}, {
alpha2: "KY",
alpha3: "CYM",
countryCallingCodes: [ "+1 345" ],
currencies: [ "KYD" ],
ioc: "CAY",
languages: [ "eng" ],
name: "Cayman Islands",
status: "assigned"
}, {
alpha2: "KZ",
alpha3: "KAZ",
countryCallingCodes: [ "+7", "+7 6", "+7 7" ],
currencies: [ "KZT" ],
ioc: "KAZ",
languages: [ "kaz", "rus" ],
name: "Kazakhstan",
status: "assigned"
}, {
alpha2: "LA",
alpha3: "LAO",
countryCallingCodes: [ "+856" ],
currencies: [ "LAK" ],
ioc: "LAO",
languages: [ "lao" ],
name: "Lao People's Democratic Republic",
status: "assigned"
}, {
alpha2: "LB",
alpha3: "LBN",
countryCallingCodes: [ "+961" ],
currencies: [ "LBP" ],
ioc: "LIB",
languages: [ "ara", "hye" ],
name: "Lebanon",
status: "assigned"
}, {
alpha2: "LC",
alpha3: "LCA",
countryCallingCodes: [ "+1 758" ],
currencies: [ "XCD" ],
ioc: "LCA",
languages: [ "eng" ],
name: "Saint Lucia",
status: "assigned"
}, {
alpha2: "LI",
alpha3: "LIE",
countryCallingCodes: [ "+423" ],
currencies: [ "CHF" ],
ioc: "LIE",
languages: [ "deu" ],
name: "Liechtenstein",
status: "assigned"
}, {
alpha2: "LK",
alpha3: "LKA",
countryCallingCodes: [ "+94" ],
currencies: [ "LKR" ],
ioc: "SRI",
languages: [ "sin", "tam" ],
name: "Sri Lanka",
status: "assigned"
}, {
alpha2: "LR",
alpha3: "LBR",
countryCallingCodes: [ "+231" ],
currencies: [ "LRD" ],
ioc: "LBR",
languages: [ "eng" ],
name: "Liberia",
status: "assigned"
}, {
alpha2: "LS",
alpha3: "LSO",
countryCallingCodes: [ "+266" ],
currencies: [ "LSL", "ZAR" ],
ioc: "LES",
languages: [ "eng", "sot" ],
name: "Lesotho",
status: "assigned"
}, {
alpha2: "LT",
alpha3: "LTU",
countryCallingCodes: [ "+370" ],
currencies: [ "EUR" ],
ioc: "LTU",
languages: [ "lit" ],
name: "Lithuania",
status: "assigned"
}, {
alpha2: "LU",
alpha3: "LUX",
countryCallingCodes: [ "+352" ],
currencies: [ "EUR" ],
ioc: "LUX",
languages: [ "fra", "deu", "ltz" ],
name: "Luxembourg",
status: "assigned"
}, {
alpha2: "LV",
alpha3: "LVA",
countryCallingCodes: [ "+371" ],
currencies: [ "EUR" ],
ioc: "LAT",
languages: [ "lav" ],
name: "Latvia",
status: "assigned"
}, {
alpha2: "LY",
alpha3: "LBY",
countryCallingCodes: [ "+218" ],
currencies: [ "LYD" ],
ioc: "LBA",
languages: [ "ara" ],
name: "Libya",
status: "assigned"
}, {
alpha2: "MA",
alpha3: "MAR",
countryCallingCodes: [ "+212" ],
currencies: [ "MAD" ],
ioc: "MAR",
languages: [ "ara" ],
name: "Morocco",
status: "assigned"
}, {
alpha2: "MC",
alpha3: "MCO",
countryCallingCodes: [ "+377" ],
currencies: [ "EUR" ],
ioc: "MON",
languages: [ "fra" ],
name: "Monaco",
status: "assigned"
}, {
alpha2: "MD",
alpha3: "MDA",
countryCallingCodes: [ "+373" ],
currencies: [ "MDL" ],
ioc: "MDA",
languages: [ "ron" ],
name: "Moldova",
status: "assigned"
}, {
alpha2: "ME",
alpha3: "MNE",
countryCallingCodes: [ "+382" ],
currencies: [ "EUR" ],
ioc: "MNE",
languages: [ "mot" ],
name: "Montenegro",
status: "assigned"
}, {
alpha2: "MF",
alpha3: "MAF",
countryCallingCodes: [ "+590" ],
currencies: [ "EUR" ],
ioc: "",
languages: [ "fra" ],
name: "Saint Martin",
status: "assigned"
}, {
alpha2: "MG",
alpha3: "MDG",
countryCallingCodes: [ "+261" ],
currencies: [ "MGA" ],
ioc: "MAD",
languages: [ "fra", "mlg" ],
name: "Madagascar",
status: "assigned"
}, {
alpha2: "MH",
alpha3: "MHL",
countryCallingCodes: [ "+692" ],
currencies: [ "USD" ],
ioc: "MHL",
languages: [ "eng", "mah" ],
name: "Marshall Islands",
status: "assigned"
}, {
alpha2: "MI",
alpha3: "MID",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Midway Islands",
status: "deleted"
}, {
alpha2: "MK",
alpha3: "MKD",
countryCallingCodes: [ "+389" ],
currencies: [ "MKD" ],
ioc: "MKD",
languages: [ "mkd" ],
name: "Macedonia, The Former Yugoslav Republic Of",
status: "assigned"
}, {
alpha2: "ML",
alpha3: "MLI",
countryCallingCodes: [ "+223" ],
currencies: [ "XOF" ],
ioc: "MLI",
languages: [ "fra" ],
name: "Mali",
status: "assigned"
}, {
alpha2: "MM",
alpha3: "MMR",
countryCallingCodes: [ "+95" ],
currencies: [ "MMK" ],
ioc: "MYA",
languages: [ "mya" ],
name: "Myanmar",
status: "assigned"
}, {
alpha2: "MN",
alpha3: "MNG",
countryCallingCodes: [ "+976" ],
currencies: [ "MNT" ],
ioc: "MGL",
languages: [ "mon" ],
name: "Mongolia",
status: "assigned"
}, {
alpha2: "MO",
alpha3: "MAC",
countryCallingCodes: [ "+853" ],
currencies: [ "MOP" ],
ioc: "MAC",
languages: [ "zho", "por" ],
name: "Macao",
status: "assigned"
}, {
alpha2: "MP",
alpha3: "MNP",
countryCallingCodes: [ "+1 670" ],
currencies: [ "USD" ],
ioc: "",
languages: [ "eng" ],
name: "Northern Mariana Islands",
status: "assigned"
}, {
alpha2: "MQ",
alpha3: "MTQ",
countryCallingCodes: [ "+596" ],
currencies: [ "EUR" ],
ioc: "",
languages: [],
name: "Martinique",
status: "assigned"
}, {
alpha2: "MR",
alpha3: "MRT",
countryCallingCodes: [ "+222" ],
currencies: [ "MRO" ],
ioc: "MTN",
languages: [ "ara", "fra" ],
name: "Mauritania",
status: "assigned"
}, {
alpha2: "MS",
alpha3: "MSR",
countryCallingCodes: [ "+1 664" ],
currencies: [ "XCD" ],
ioc: "",
languages: [],
name: "Montserrat",
status: "assigned"
}, {
alpha2: "MT",
alpha3: "MLT",
countryCallingCodes: [ "+356" ],
currencies: [ "EUR" ],
ioc: "MLT",
languages: [ "mlt", "eng" ],
name: "Malta",
status: "assigned"
}, {
alpha2: "MU",
alpha3: "MUS",
countryCallingCodes: [ "+230" ],
currencies: [ "MUR" ],
ioc: "MRI",
languages: [ "eng", "fra" ],
name: "Mauritius",
status: "assigned"
}, {
alpha2: "MV",
alpha3: "MDV",
countryCallingCodes: [ "+960" ],
currencies: [ "MVR" ],
ioc: "MDV",
languages: [ "div" ],
name: "Maldives",
status: "assigned"
}, {
alpha2: "MW",
alpha3: "MWI",
countryCallingCodes: [ "+265" ],
currencies: [ "MWK" ],
ioc: "MAW",
languages: [ "eng", "nya" ],
name: "Malawi",
status: "assigned"
}, {
alpha2: "MX",
alpha3: "MEX",
countryCallingCodes: [ "+52" ],
currencies: [ "MXN", "MXV" ],
ioc: "MEX",
languages: [ "spa" ],
name: "Mexico",
status: "assigned"
}, {
alpha2: "MY",
alpha3: "MYS",
countryCallingCodes: [ "+60" ],
currencies: [ "MYR" ],
ioc: "MAS",
languages: [ "msa", "eng" ],
name: "Malaysia",
status: "assigned"
}, {
alpha2: "MZ",
alpha3: "MOZ",
countryCallingCodes: [ "+258" ],
currencies: [ "MZN" ],
ioc: "MOZ",
languages: [ "por" ],
name: "Mozambique",
status: "assigned"
}, {
alpha2: "NA",
alpha3: "NAM",
countryCallingCodes: [ "+264" ],
currencies: [ "NAD", "ZAR" ],
ioc: "NAM",
languages: [ "eng" ],
name: "Namibia",
status: "assigned"
}, {
alpha2: "NC",
alpha3: "NCL",
countryCallingCodes: [ "+687" ],
currencies: [ "XPF" ],
ioc: "",
languages: [ "fra" ],
name: "New Caledonia",
status: "assigned"
}, {
alpha2: "NE",
alpha3: "NER",
countryCallingCodes: [ "+227" ],
currencies: [ "XOF" ],
ioc: "NIG",
languages: [ "fra" ],
name: "Niger",
status: "assigned"
}, {
alpha2: "NF",
alpha3: "NFK",
countryCallingCodes: [ "+672" ],
currencies: [ "AUD" ],
ioc: "",
languages: [ "eng" ],
name: "Norfolk Island",
status: "assigned"
}, {
alpha2: "NG",
alpha3: "NGA",
countryCallingCodes: [ "+234" ],
currencies: [ "NGN" ],
ioc: "NGR",
languages: [ "eng" ],
name: "Nigeria",
status: "assigned"
}, {
alpha2: "NH",
alpha3: "NHB",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "New Hebrides",
status: "deleted"
}, {
alpha2: "NI",
alpha3: "NIC",
countryCallingCodes: [ "+505" ],
currencies: [ "NIO" ],
ioc: "NCA",
languages: [ "spa" ],
name: "Nicaragua",
status: "assigned"
}, {
alpha2: "NL",
alpha3: "NLD",
countryCallingCodes: [ "+31" ],
currencies: [ "EUR" ],
ioc: "NED",
languages: [ "nld" ],
name: "Netherlands",
status: "assigned"
}, {
alpha2: "NO",
alpha3: "NOR",
countryCallingCodes: [ "+47" ],
currencies: [ "NOK" ],
ioc: "NOR",
languages: [ "nor" ],
name: "Norway",
status: "assigned"
}, {
alpha2: "NP",
alpha3: "NPL",
countryCallingCodes: [ "+977" ],
currencies: [ "NPR" ],
ioc: "NEP",
languages: [ "nep" ],
name: "Nepal",
status: "assigned"
}, {
alpha2: "NQ",
alpha3: "ATN",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Dronning Maud Land",
status: "deleted"
}, {
alpha2: "NR",
alpha3: "NRU",
countryCallingCodes: [ "+674" ],
currencies: [ "AUD" ],
ioc: "NRU",
languages: [ "eng", "nau" ],
name: "Nauru",
status: "assigned"
}, {
alpha2: "NT",
alpha3: "NTZ",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Neutral Zone",
status: "deleted"
}, {
alpha2: "NU",
alpha3: "NIU",
countryCallingCodes: [ "+683" ],
currencies: [ "NZD" ],
ioc: "",
languages: [ "eng" ],
name: "Niue",
status: "assigned"
}, {
alpha2: "NZ",
alpha3: "NZL",
countryCallingCodes: [ "+64" ],
currencies: [ "NZD" ],
ioc: "NZL",
languages: [ "eng" ],
name: "New Zealand",
status: "assigned"
}, {
alpha2: "OM",
alpha3: "OMN",
countryCallingCodes: [ "+968" ],
currencies: [ "OMR" ],
ioc: "OMA",
languages: [ "ara" ],
name: "Oman",
status: "assigned"
}, {
alpha2: "PA",
alpha3: "PAN",
countryCallingCodes: [ "+507" ],
currencies: [ "PAB", "USD" ],
ioc: "PAN",
languages: [ "spa" ],
name: "Panama",
status: "assigned"
}, {
alpha2: "PC",
alpha3: "PCI",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Pacific Islands, Trust Territory of the",
status: "deleted"
}, {
alpha2: "PE",
alpha3: "PER",
countryCallingCodes: [ "+51" ],
currencies: [ "PEN" ],
ioc: "PER",
languages: [ "spa", "aym", "que" ],
name: "Peru",
status: "assigned"
}, {
alpha2: "PF",
alpha3: "PYF",
countryCallingCodes: [ "+689" ],
currencies: [ "XPF" ],
ioc: "",
languages: [ "fra" ],
name: "French Polynesia",
status: "assigned"
}, {
alpha2: "PG",
alpha3: "PNG",
countryCallingCodes: [ "+675" ],
currencies: [ "PGK" ],
ioc: "PNG",
languages: [ "eng" ],
name: "Papua New Guinea",
status: "assigned"
}, {
alpha2: "PH",
alpha3: "PHL",
countryCallingCodes: [ "+63" ],
currencies: [ "PHP" ],
ioc: "PHI",
languages: [ "eng" ],
name: "Philippines",
status: "assigned"
}, {
alpha2: "PK",
alpha3: "PAK",
countryCallingCodes: [ "+92" ],
currencies: [ "PKR" ],
ioc: "PAK",
languages: [ "urd", "eng" ],
name: "Pakistan",
status: "assigned"
}, {
alpha2: "PL",
alpha3: "POL",
countryCallingCodes: [ "+48" ],
currencies: [ "PLN" ],
ioc: "POL",
languages: [ "pol" ],
name: "Poland",
status: "assigned"
}, {
alpha2: "PM",
alpha3: "SPM",
countryCallingCodes: [ "+508" ],
currencies: [ "EUR" ],
ioc: "",
languages: [ "eng" ],
name: "Saint Pierre And Miquelon",
status: "assigned"
}, {
alpha2: "PN",
alpha3: "PCN",
countryCallingCodes: [ "+872" ],
currencies: [ "NZD" ],
ioc: "",
languages: [ "eng" ],
name: "Pitcairn",
status: "assigned"
}, {
alpha2: "PR",
alpha3: "PRI",
countryCallingCodes: [ "+1 787", "+1 939" ],
currencies: [ "USD" ],
ioc: "PUR",
languages: [ "spa", "eng" ],
name: "Puerto Rico",
status: "assigned"
}, {
alpha2: "PS",
alpha3: "PSE",
countryCallingCodes: [ "+970" ],
currencies: [ "JOD", "EGP", "ILS" ],
ioc: "PLE",
languages: [ "ara" ],
name: "Palestinian Territory, Occupied",
status: "assigned"
}, {
alpha2: "PT",
alpha3: "PRT",
countryCallingCodes: [ "+351" ],
currencies: [ "EUR" ],
ioc: "POR",
languages: [ "por" ],
name: "Portugal",
status: "assigned"
}, {
alpha2: "PU",
alpha3: "PUS",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "U.S. Miscellaneous Pacific Islands",
status: "deleted"
}, {
alpha2: "PW",
alpha3: "PLW",
countryCallingCodes: [ "+680" ],
currencies: [ "USD" ],
ioc: "PLW",
languages: [ "eng" ],
name: "Palau",
status: "assigned"
}, {
alpha2: "PY",
alpha3: "PRY",
countryCallingCodes: [ "+595" ],
currencies: [ "PYG" ],
ioc: "PAR",
languages: [ "spa" ],
name: "Paraguay",
status: "assigned"
}, {
alpha2: "PZ",
alpha3: "PCZ",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Panama Canal Zone",
status: "deleted"
}, {
alpha2: "QA",
alpha3: "QAT",
countryCallingCodes: [ "+974" ],
currencies: [ "QAR" ],
ioc: "QAT",
languages: [ "ara" ],
name: "Qatar",
status: "assigned"
}, {
alpha2: "RE",
alpha3: "REU",
countryCallingCodes: [ "+262" ],
currencies: [ "EUR" ],
ioc: "",
languages: [ "fra" ],
name: "Reunion",
status: "assigned"
}, {
alpha2: "RH",
alpha3: "RHO",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Southern Rhodesia",
status: "deleted"
}, {
alpha2: "RO",
alpha3: "ROU",
countryCallingCodes: [ "+40" ],
currencies: [ "RON" ],
ioc: "ROU",
languages: [ "ron" ],
name: "Romania",
status: "assigned"
}, {
alpha2: "RS",
alpha3: "SRB",
countryCallingCodes: [ "+381" ],
currencies: [ "RSD" ],
ioc: "SRB",
languages: [ "srp" ],
name: "Serbia",
status: "assigned"
}, {
alpha2: "RU",
alpha3: "RUS",
countryCallingCodes: [ "+7", "+7 3", "+7 4", "+7 8" ],
currencies: [ "RUB" ],
ioc: "RUS",
languages: [ "rus" ],
name: "Russian Federation",
status: "assigned"
}, {
alpha2: "RW",
alpha3: "RWA",
countryCallingCodes: [ "+250" ],
currencies: [ "RWF" ],
ioc: "RWA",
languages: [ "eng", "fra", "kin" ],
name: "Rwanda",
status: "assigned"
}, {
alpha2: "SA",
alpha3: "SAU",
countryCallingCodes: [ "+966" ],
currencies: [ "SAR" ],
ioc: "KSA",
languages: [ "ara" ],
name: "Saudi Arabia",
status: "assigned"
}, {
alpha2: "SB",
alpha3: "SLB",
countryCallingCodes: [ "+677" ],
currencies: [ "SBD" ],
ioc: "SOL",
languages: [ "eng" ],
name: "Solomon Islands",
status: "assigned"
}, {
alpha2: "SC",
alpha3: "SYC",
countryCallingCodes: [ "+248" ],
currencies: [ "SCR" ],
ioc: "SEY",
languages: [ "eng", "fra" ],
name: "Seychelles",
status: "assigned"
}, {
alpha2: "SD",
alpha3: "SDN",
countryCallingCodes: [ "+249" ],
currencies: [ "SDG" ],
ioc: "SUD",
languages: [ "ara", "eng" ],
name: "Sudan",
status: "assigned"
}, {
alpha2: "SE",
alpha3: "SWE",
countryCallingCodes: [ "+46" ],
currencies: [ "SEK" ],
ioc: "SWE",
languages: [ "swe" ],
name: "Sweden",
status: "assigned"
}, {
alpha2: "SG",
alpha3: "SGP",
countryCallingCodes: [ "+65" ],
currencies: [ "SGD" ],
ioc: "SIN",
languages: [ "eng", "zho", "msa", "tam" ],
name: "Singapore",
status: "assigned"
}, {
alpha2: "SH",
alpha3: "SHN",
countryCallingCodes: [ "+290" ],
currencies: [ "SHP" ],
ioc: "",
languages: [ "eng" ],
name: "Saint Helena, Ascension And Tristan Da Cunha",
status: "assigned"
}, {
alpha2: "SI",
alpha3: "SVN",
countryCallingCodes: [ "+386" ],
currencies: [ "EUR" ],
ioc: "SLO",
languages: [ "slv" ],
name: "Slovenia",
status: "assigned"
}, {
alpha2: "SJ",
alpha3: "SJM",
countryCallingCodes: [ "+47" ],
currencies: [ "NOK" ],
ioc: "",
languages: [],
name: "Svalbard And Jan Mayen",
status: "assigned"
}, {
alpha2: "SK",
alpha3: "SVK",
countryCallingCodes: [ "+421" ],
currencies: [ "EUR" ],
ioc: "SVK",
languages: [ "slk" ],
name: "Slovakia",
status: "assigned"
}, {
alpha2: "SK",
alpha3: "SKM",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Sikkim",
status: "deleted"
}, {
alpha2: "SL",
alpha3: "SLE",
countryCallingCodes: [ "+232" ],
currencies: [ "SLL" ],
ioc: "SLE",
languages: [ "eng" ],
name: "Sierra Leone",
status: "assigned"
}, {
alpha2: "SM",
alpha3: "SMR",
countryCallingCodes: [ "+378" ],
currencies: [ "EUR" ],
ioc: "SMR",
languages: [ "ita" ],
name: "San Marino",
status: "assigned"
}, {
alpha2: "SN",
alpha3: "SEN",
countryCallingCodes: [ "+221" ],
currencies: [ "XOF" ],
ioc: "SEN",
languages: [ "fra" ],
name: "Senegal",
status: "assigned"
}, {
alpha2: "SO",
alpha3: "SOM",
countryCallingCodes: [ "+252" ],
currencies: [ "SOS" ],
ioc: "SOM",
languages: [ "som" ],
name: "Somalia",
status: "assigned"
}, {
alpha2: "SR",
alpha3: "SUR",
countryCallingCodes: [ "+597" ],
currencies: [ "SRD" ],
ioc: "SUR",
languages: [ "nld" ],
name: "Suriname",
status: "assigned"
}, {
alpha2: "SS",
alpha3: "SSD",
countryCallingCodes: [ "+211" ],
currencies: [ "SSP" ],
ioc: "",
languages: [ "eng" ],
name: "South Sudan",
status: "assigned"
}, {
alpha2: "ST",
alpha3: "STP",
countryCallingCodes: [ "+239" ],
currencies: [ "STD" ],
ioc: "STP",
languages: [ "por" ],
name: "Sao Tome and Principe",
status: "assigned"
}, {
alpha2: "SU",
alpha3: "",
countryCallingCodes: [],
currencies: [ "RUB" ],
ioc: "",
languages: [ "rus" ],
name: "USSR",
status: "reserved"
}, {
alpha2: "SV",
alpha3: "SLV",
countryCallingCodes: [ "+503" ],
currencies: [ "USD" ],
ioc: "ESA",
languages: [ "spa" ],
name: "El Salvador",
status: "assigned"
}, {
alpha2: "SX",
alpha3: "SXM",
countryCallingCodes: [ "+1 721" ],
currencies: [ "ANG" ],
ioc: "",
languages: [ "nld" ],
name: "Sint Maarten",
status: "assigned"
}, {
alpha2: "SY",
alpha3: "SYR",
countryCallingCodes: [ "+963" ],
currencies: [ "SYP" ],
ioc: "SYR",
languages: [ "ara" ],
name: "Syrian Arab Republic",
status: "assigned"
}, {
alpha2: "SZ",
alpha3: "SWZ",
countryCallingCodes: [ "+268" ],
currencies: [ "SZL" ],
ioc: "SWZ",
languages: [ "eng", "ssw" ],
name: "Swaziland",
status: "assigned"
}, {
alpha2: "TA",
alpha3: "",
countryCallingCodes: [ "+290" ],
currencies: [ "GBP" ],
ioc: "",
languages: [],
name: "Tristan de Cunha",
status: "reserved"
}, {
alpha2: "TC",
alpha3: "TCA",
countryCallingCodes: [ "+1 649" ],
currencies: [ "USD" ],
ioc: "",
languages: [ "eng" ],
name: "Turks And Caicos Islands",
status: "assigned"
}, {
alpha2: "TD",
alpha3: "TCD",
countryCallingCodes: [ "+235" ],
currencies: [ "XAF" ],
ioc: "CHA",
languages: [ "ara", "fra" ],
name: "Chad",
status: "assigned"
}, {
alpha2: "TF",
alpha3: "ATF",
countryCallingCodes: [],
currencies: [ "EUR" ],
ioc: "",
languages: [ "fra" ],
name: "French Southern Territories",
status: "assigned"
}, {
alpha2: "TG",
alpha3: "TGO",
countryCallingCodes: [ "+228" ],
currencies: [ "XOF" ],
ioc: "TOG",
languages: [ "fra" ],
name: "Togo",
status: "assigned"
}, {
alpha2: "TH",
alpha3: "THA",
countryCallingCodes: [ "+66" ],
currencies: [ "THB" ],
ioc: "THA",
languages: [ "tha" ],
name: "Thailand",
status: "assigned"
}, {
alpha2: "TJ",
alpha3: "TJK",
countryCallingCodes: [ "+992" ],
currencies: [ "TJS" ],
ioc: "TJK",
languages: [ "tgk", "rus" ],
name: "Tajikistan",
status: "assigned"
}, {
alpha2: "TK",
alpha3: "TKL",
countryCallingCodes: [ "+690" ],
currencies: [ "NZD" ],
ioc: "",
languages: [ "eng" ],
name: "Tokelau",
status: "assigned"
}, {
alpha2: "TL",
alpha3: "TLS",
countryCallingCodes: [ "+670" ],
currencies: [ "USD" ],
ioc: "TLS",
languages: [ "por" ],
name: "Timor-Leste, Democratic Republic of",
status: "assigned"
}, {
alpha2: "TM",
alpha3: "TKM",
countryCallingCodes: [ "+993" ],
currencies: [ "TMT" ],
ioc: "TKM",
languages: [ "tuk", "rus" ],
name: "Turkmenistan",
status: "assigned"
}, {
alpha2: "TN",
alpha3: "TUN",
countryCallingCodes: [ "+216" ],
currencies: [ "TND" ],
ioc: "TUN",
languages: [ "ara" ],
name: "Tunisia",
status: "assigned"
}, {
alpha2: "TO",
alpha3: "TON",
countryCallingCodes: [ "+676" ],
currencies: [ "TOP" ],
ioc: "TGA",
languages: [ "eng" ],
name: "Tonga",
status: "assigned"
}, {
alpha2: "TP",
alpha3: "TMP",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "East Timor",
status: "deleted"
}, {
alpha2: "TR",
alpha3: "TUR",
countryCallingCodes: [ "+90" ],
currencies: [ "TRY" ],
ioc: "TUR",
languages: [ "tur" ],
name: "Turkey",
status: "assigned"
}, {
alpha2: "TT",
alpha3: "TTO",
countryCallingCodes: [ "+1 868" ],
currencies: [ "TTD" ],
ioc: "TRI",
languages: [ "eng" ],
name: "Trinidad And Tobago",
status: "assigned"
}, {
alpha2: "TV",
alpha3: "TUV",
countryCallingCodes: [ "+688" ],
currencies: [ "AUD" ],
ioc: "TUV",
languages: [ "eng" ],
name: "Tuvalu",
status: "assigned"
}, {
alpha2: "TW",
alpha3: "TWN",
countryCallingCodes: [ "+886" ],
currencies: [ "TWD" ],
ioc: "TPE",
languages: [ "zho" ],
name: "Taiwan",
status: "assigned"
}, {
alpha2: "TZ",
alpha3: "TZA",
countryCallingCodes: [ "+255" ],
currencies: [ "TZS" ],
ioc: "TAN",
languages: [ "swa", "eng" ],
name: "Tanzania, United Republic Of",
status: "assigned"
}, {
alpha2: "UA",
alpha3: "UKR",
countryCallingCodes: [ "+380" ],
currencies: [ "UAH" ],
ioc: "UKR",
languages: [ "ukr", "rus" ],
name: "Ukraine",
status: "assigned"
}, {
alpha2: "UG",
alpha3: "UGA",
countryCallingCodes: [ "+256" ],
currencies: [ "UGX" ],
ioc: "UGA",
languages: [ "eng", "swa" ],
name: "Uganda",
status: "assigned"
}, {
alpha2: "UK",
alpha3: "",
countryCallingCodes: [],
currencies: [ "GBP" ],
ioc: "",
languages: [ "eng", "cor", "gle", "gla", "cym" ],
name: "United Kingdom",
status: "reserved"
}, {
alpha2: "UM",
alpha3: "UMI",
countryCallingCodes: [ "+1" ],
currencies: [ "USD" ],
ioc: "",
languages: [ "eng" ],
name: "United States Minor Outlying Islands",
status: "assigned"
}, {
alpha2: "US",
alpha3: "USA",
countryCallingCodes: [ "+1" ],
currencies: [ "USD" ],
ioc: "USA",
languages: [ "eng" ],
name: "United States",
status: "assigned"
}, {
alpha2: "UY",
alpha3: "URY",
countryCallingCodes: [ "+598" ],
currencies: [ "UYU", "UYI" ],
ioc: "URU",
languages: [ "spa" ],
name: "Uruguay",
status: "assigned"
}, {
alpha2: "UZ",
alpha3: "UZB",
countryCallingCodes: [ "+998" ],
currencies: [ "UZS" ],
ioc: "UZB",
languages: [ "uzb", "rus" ],
name: "Uzbekistan",
status: "assigned"
}, {
alpha2: "VA",
alpha3: "VAT",
countryCallingCodes: [ "+379", "+39" ],
currencies: [ "EUR" ],
ioc: "",
languages: [ "ita" ],
name: "Vatican City State",
status: "assigned"
}, {
alpha2: "VC",
alpha3: "VCT",
countryCallingCodes: [ "+1 784" ],
currencies: [ "XCD" ],
ioc: "VIN",
languages: [ "eng" ],
name: "Saint Vincent And The Grenadines",
status: "assigned"
}, {
alpha2: "VD",
alpha3: "VDR",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Viet-Nam, Democratic Republic of",
status: "deleted"
}, {
alpha2: "VE",
alpha3: "VEN",
countryCallingCodes: [ "+58" ],
currencies: [ "VEF" ],
ioc: "VEN",
languages: [ "spa" ],
name: "Venezuela, Bolivarian Republic Of",
status: "assigned"
}, {
alpha2: "VG",
alpha3: "VGB",
countryCallingCodes: [ "+1 284" ],
currencies: [ "USD" ],
ioc: "ISV",
languages: [ "eng" ],
name: "Virgin Islands (British)",
status: "assigned"
}, {
alpha2: "VI",
alpha3: "VIR",
countryCallingCodes: [ "+1 340" ],
currencies: [ "USD" ],
ioc: "ISV",
languages: [ "eng" ],
name: "Virgin Islands (US)",
status: "assigned"
}, {
alpha2: "VN",
alpha3: "VNM",
countryCallingCodes: [ "+84" ],
currencies: [ "VND" ],
ioc: "VIE",
languages: [ "vie" ],
name: "Viet Nam",
status: "assigned"
}, {
alpha2: "VU",
alpha3: "VUT",
countryCallingCodes: [ "+678" ],
currencies: [ "VUV" ],
ioc: "VAN",
languages: [ "bis", "eng", "fra" ],
name: "Vanuatu",
status: "assigned"
}, {
alpha2: "WF",
alpha3: "WLF",
countryCallingCodes: [ "+681" ],
currencies: [ "XPF" ],
ioc: "",
languages: [ "fra" ],
name: "Wallis And Futuna",
status: "assigned"
}, {
alpha2: "WK",
alpha3: "WAK",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Wake Island",
status: "deleted"
}, {
alpha2: "WS",
alpha3: "WSM",
countryCallingCodes: [ "+685" ],
currencies: [ "WST" ],
ioc: "SAM",
languages: [ "eng", "smo" ],
name: "Samoa",
status: "assigned"
}, {
alpha2: "XK",
alpha3: "",
countryCallingCodes: [ "+383" ],
currencies: [ "EUR" ],
ioc: "",
languages: [ "sqi", "srp", "bos", "tur", "rom" ],
name: "Kosovo",
status: "user assigned"
}, {
alpha2: "YD",
alpha3: "YMD",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Yemen, Democratic",
status: "deleted"
}, {
alpha2: "YE",
alpha3: "YEM",
countryCallingCodes: [ "+967" ],
currencies: [ "YER" ],
ioc: "YEM",
languages: [ "ara" ],
name: "Yemen",
status: "assigned"
}, {
alpha2: "YT",
alpha3: "MYT",
countryCallingCodes: [ "+262" ],
currencies: [ "EUR" ],
ioc: "",
languages: [ "fra" ],
name: "Mayotte",
status: "assigned"
}, {
alpha2: "YU",
alpha3: "YUG",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Yugoslavia",
status: "deleted"
}, {
alpha2: "ZA",
alpha3: "ZAF",
countryCallingCodes: [ "+27" ],
currencies: [ "ZAR" ],
ioc: "RSA",
languages: [ "afr", "eng", "nbl", "som", "tso", "ven", "xho", "zul" ],
name: "South Africa",
status: "assigned"
}, {
alpha2: "ZM",
alpha3: "ZMB",
countryCallingCodes: [ "+260" ],
currencies: [ "ZMW" ],
ioc: "ZAM",
languages: [ "eng" ],
name: "Zambia",
status: "assigned"
}, {
alpha2: "ZR",
alpha3: "ZAR",
countryCallingCodes: [],
currencies: [],
ioc: "",
languages: [],
name: "Zaire",
status: "deleted"
}, {
alpha2: "ZW",
alpha3: "ZWE",
countryCallingCodes: [ "+263" ],
currencies: [ "USD", "ZAR", "BWP", "GBP", "EUR" ],
ioc: "ZIM",
languages: [ "eng", "sna", "nde" ],
name: "Zimbabwe",
status: "assigned"
} ];
}, function(module, exports) {
module.exports = [ {
code: "AED",
decimals: 2,
name: "United Arab Emirates dirham",
number: "784"
}, {
code: "AFN",
decimals: 2,
name: "Afghan afghani",
number: "971"
}, {
code: "ALL",
decimals: 2,
name: "Albanian lek",
number: "8"
}, {
code: "AMD",
decimals: 2,
name: "Armenian dram",
number: "51"
}, {
code: "ANG",
decimals: 2,
name: "Netherlands Antillean guilder",
number: "532"
}, {
code: "AOA",
decimals: 2,
name: "Angolan kwanza",
number: "973"
}, {
code: "ARS",
decimals: 2,
name: "Argentine peso",
number: "32"
}, {
code: "AUD",
decimals: 2,
name: "Australian dollar",
number: "36"
}, {
code: "AWG",
decimals: 2,
name: "Aruban florin",
number: "533"
}, {
code: "AZN",
decimals: 2,
name: "Azerbaijani manat",
number: "944"
}, {
code: "BAM",
decimals: 2,
name: "Bosnia and Herzegovina convertible mark",
number: "977"
}, {
code: "BBD",
decimals: 2,
name: "Barbados dollar",
number: "52"
}, {
code: "BDT",
decimals: 2,
name: "Bangladeshi taka",
number: "50"
}, {
code: "BGN",
decimals: 2,
name: "Bulgarian lev",
number: "975"
}, {
code: "BHD",
decimals: 3,
name: "Bahraini dinar",
number: "48"
}, {
code: "BIF",
decimals: 0,
name: "Burundian franc",
number: "108"
}, {
code: "BMD",
decimals: 2,
name: "Bermudian dollar (customarily known as Bermuda dollar)",
number: "60"
}, {
code: "BND",
decimals: 2,
name: "Brunei dollar",
number: "96"
}, {
code: "BOB",
decimals: 2,
name: "Boliviano",
number: "68"
}, {
code: "BOV",
decimals: 2,
name: "Bolivian Mvdol (funds code)",
number: "984"
}, {
code: "BRL",
decimals: 2,
name: "Brazilian real",
number: "986"
}, {
code: "BSD",
decimals: 2,
name: "Bahamian dollar",
number: "44"
}, {
code: "BTN",
decimals: 2,
name: "Bhutanese ngultrum",
number: "64"
}, {
code: "BWP",
decimals: 2,
name: "Botswana pula",
number: "72"
}, {
code: "BYR",
decimals: 0,
name: "Belarusian ruble",
number: "974"
}, {
code: "BZD",
decimals: 2,
name: "Belize dollar",
number: "84"
}, {
code: "CAD",
decimals: 2,
name: "Canadian dollar",
number: "124"
}, {
code: "CDF",
decimals: 2,
name: "Congolese franc",
number: "976"
}, {
code: "CHE",
decimals: 2,
name: "WIR Euro (complementary currency)",
number: "947"
}, {
code: "CHF",
decimals: 2,
name: "Swiss franc",
number: "756"
}, {
code: "CHW",
decimals: 2,
name: "WIR Franc (complementary currency)",
number: "948"
}, {
code: "CLF",
decimals: 0,
name: "Unidad de Fomento (funds code)",
number: "990"
}, {
code: "CLP",
decimals: 0,
name: "Chilean peso",
number: "152"
}, {
code: "CNY",
decimals: 2,
name: "Chinese yuan",
number: "156"
}, {
code: "COP",
decimals: 2,
name: "Colombian peso",
number: "170"
}, {
code: "COU",
decimals: 2,
name: "Unidad de Valor Real",
number: "970"
}, {
code: "CRC",
decimals: 2,
name: "Costa Rican colon",
number: "188"
}, {
code: "CUC",
decimals: 2,
name: "Cuban convertible peso",
number: "931"
}, {
code: "CUP",
decimals: 2,
name: "Cuban peso",
number: "192"
}, {
code: "CVE",
decimals: 0,
name: "Cape Verde escudo",
number: "132"
}, {
code: "CZK",
decimals: 2,
name: "Czech koruna",
number: "203"
}, {
code: "DJF",
decimals: 0,
name: "Djiboutian franc",
number: "262"
}, {
code: "DKK",
decimals: 2,
name: "Danish krone",
number: "208"
}, {
code: "DOP",
decimals: 2,
name: "Dominican peso",
number: "214"
}, {
code: "DZD",
decimals: 2,
name: "Algerian dinar",
number: "12"
}, {
code: "EGP",
decimals: 2,
name: "Egyptian pound",
number: "818"
}, {
code: "ERN",
decimals: 2,
name: "Eritrean nakfa",
number: "232"
}, {
code: "ETB",
decimals: 2,
name: "Ethiopian birr",
number: "230"
}, {
code: "EUR",
decimals: 2,
name: "Euro",
number: "978"
}, {
code: "FJD",
decimals: 2,
name: "Fiji dollar",
number: "242"
}, {
code: "FKP",
decimals: 2,
name: "Falkland Islands pound",
number: "238"
}, {
code: "GBP",
decimals: 2,
name: "Pound sterling",
number: "826"
}, {
code: "GEL",
decimals: 2,
name: "Georgian lari",
number: "981"
}, {
code: "GHS",
decimals: 2,
name: "Ghanaian cedi",
number: "936"
}, {
code: "GIP",
decimals: 2,
name: "Gibraltar pound",
number: "292"
}, {
code: "GMD",
decimals: 2,
name: "Gambian dalasi",
number: "270"
}, {
code: "GNF",
decimals: 0,
name: "Guinean franc",
number: "324"
}, {
code: "GTQ",
decimals: 2,
name: "Guatemalan quetzal",
number: "320"
}, {
code: "GYD",
decimals: 2,
name: "Guyanese dollar",
number: "328"
}, {
code: "HKD",
decimals: 2,
name: "Hong Kong dollar",
number: "344"
}, {
code: "HNL",
decimals: 2,
name: "Honduran lempira",
number: "340"
}, {
code: "HRK",
decimals: 2,
name: "Croatian kuna",
number: "191"
}, {
code: "HTG",
decimals: 2,
name: "Haitian gourde",
number: "332"
}, {
code: "HUF",
decimals: 2,
name: "Hungarian forint",
number: "348"
}, {
code: "IDR",
decimals: 2,
name: "Indonesian rupiah",
number: "360"
}, {
code: "ILS",
decimals: 2,
name: "Israeli new shekel",
number: "376"
}, {
code: "INR",
decimals: 2,
name: "Indian rupee",
number: "356"
}, {
code: "IQD",
decimals: 3,
name: "Iraqi dinar",
number: "368"
}, {
code: "IRR",
decimals: 0,
name: "Iranian rial",
number: "364"
}, {
code: "ISK",
decimals: 0,
name: "Icelandic króna",
number: "352"
}, {
code: "JMD",
decimals: 2,
name: "Jamaican dollar",
number: "388"
}, {
code: "JOD",
decimals: 3,
name: "Jordanian dinar",
number: "400"
}, {
code: "JPY",
decimals: 0,
name: "Japanese yen",
number: "392"
}, {
code: "KES",
decimals: 2,
name: "Kenyan shilling",
number: "404"
}, {
code: "KGS",
decimals: 2,
name: "Kyrgyzstani som",
number: "417"
}, {
code: "KHR",
decimals: 2,
name: "Cambodian riel",
number: "116"
}, {
code: "KMF",
decimals: 0,
name: "Comoro franc",
number: "174"
}, {
code: "KPW",
decimals: 0,
name: "North Korean won",
number: "408"
}, {
code: "KRW",
decimals: 0,
name: "South Korean won",
number: "410"
}, {
code: "KWD",
decimals: 3,
name: "Kuwaiti dinar",
number: "414"
}, {
code: "KYD",
decimals: 2,
name: "Cayman Islands dollar",
number: "136"
}, {
code: "KZT",
decimals: 2,
name: "Kazakhstani tenge",
number: "398"
}, {
code: "LAK",
decimals: 0,
name: "Lao kip",
number: "418"
}, {
code: "LBP",
decimals: 0,
name: "Lebanese pound",
number: "422"
}, {
code: "LKR",
decimals: 2,
name: "Sri Lankan rupee",
number: "144"
}, {
code: "LRD",
decimals: 2,
name: "Liberian dollar",
number: "430"
}, {
code: "LSL",
decimals: 2,
name: "Lesotho loti",
number: "426"
}, {
code: "LTL",
decimals: 2,
name: "Lithuanian litas",
number: "440"
}, {
code: "LVL",
decimals: 2,
name: "Latvian lats",
number: "428"
}, {
code: "LYD",
decimals: 3,
name: "Libyan dinar",
number: "434"
}, {
code: "MAD",
decimals: 2,
name: "Moroccan dirham",
number: "504"
}, {
code: "MDL",
decimals: 2,
name: "Moldovan leu",
number: "498"
}, {
code: "MGA",
decimals: 0,
name: "Malagasy ariary",
number: "969"
}, {
code: "MKD",
decimals: 0,
name: "Macedonian denar",
number: "807"
}, {
code: "MMK",
decimals: 0,
name: "Myanma kyat",
number: "104"
}, {
code: "MNT",
decimals: 2,
name: "Mongolian tugrik",
number: "496"
}, {
code: "MOP",
decimals: 2,
name: "Macanese pataca",
number: "446"
}, {
code: "MRO",
decimals: 0,
name: "Mauritanian ouguiya",
number: "478"
}, {
code: "MUR",
decimals: 2,
name: "Mauritian rupee",
number: "480"
}, {
code: "MVR",
decimals: 2,
name: "Maldivian rufiyaa",
number: "462"
}, {
code: "MWK",
decimals: 2,
name: "Malawian kwacha",
number: "454"
}, {
code: "MXN",
decimals: 2,
name: "Mexican peso",
number: "484"
}, {
code: "MXV",
decimals: 2,
name: "Mexican Unidad de Inversion (UDI) (funds code)",
number: "979"
}, {
code: "MYR",
decimals: 2,
name: "Malaysian ringgit",
number: "458"
}, {
code: "MZN",
decimals: 2,
name: "Mozambican metical",
number: "943"
}, {
code: "NAD",
decimals: 2,
name: "Namibian dollar",
number: "516"
}, {
code: "NGN",
decimals: 2,
name: "Nigerian naira",
number: "566"
}, {
code: "NIO",
decimals: 2,
name: "Nicaraguan córdoba",
number: "558"
}, {
code: "NOK",
decimals: 2,
name: "Norwegian krone",
number: "578"
}, {
code: "NPR",
decimals: 2,
name: "Nepalese rupee",
number: "524"
}, {
code: "NZD",
decimals: 2,
name: "New Zealand dollar",
number: "554"
}, {
code: "OMR",
decimals: 3,
name: "Omani rial",
number: "512"
}, {
code: "PAB",
decimals: 2,
name: "Panamanian balboa",
number: "590"
}, {
code: "PEN",
decimals: 2,
name: "Peruvian nuevo sol",
number: "604"
}, {
code: "PGK",
decimals: 2,
name: "Papua New Guinean kina",
number: "598"
}, {
code: "PHP",
decimals: 2,
name: "Philippine peso",
number: "608"
}, {
code: "PKR",
decimals: 2,
name: "Pakistani rupee",
number: "586"
}, {
code: "PLN",
decimals: 2,
name: "Polish złoty",
number: "985"
}, {
code: "PYG",
decimals: 0,
name: "Paraguayan guaraní",
number: "600"
}, {
code: "QAR",
decimals: 2,
name: "Qatari riyal",
number: "634"
}, {
code: "RON",
decimals: 2,
name: "Romanian new leu",
number: "946"
}, {
code: "RSD",
decimals: 2,
name: "Serbian dinar",
number: "941"
}, {
code: "RUB",
decimals: 2,
name: "Russian rouble",
number: "643"
}, {
code: "RWF",
decimals: 0,
name: "Rwandan franc",
number: "646"
}, {
code: "SAR",
decimals: 2,
name: "Saudi riyal",
number: "682"
}, {
code: "SBD",
decimals: 2,
name: "Solomon Islands dollar",
number: "90"
}, {
code: "SCR",
decimals: 2,
name: "Seychelles rupee",
number: "690"
}, {
code: "SDG",
decimals: 2,
name: "Sudanese pound",
number: "938"
}, {
code: "SEK",
decimals: 2,
name: "Swedish krona/kronor",
number: "752"
}, {
code: "SGD",
decimals: 2,
name: "Singapore dollar",
number: "702"
}, {
code: "SHP",
decimals: 2,
name: "Saint Helena pound",
number: "654"
}, {
code: "SLL",
decimals: 0,
name: "Sierra Leonean leone",
number: "694"
}, {
code: "SOS",
decimals: 2,
name: "Somali shilling",
number: "706"
}, {
code: "SRD",
decimals: 2,
name: "Surinamese dollar",
number: "968"
}, {
code: "SSP",
decimals: 2,
name: "South Sudanese pound",
number: "728"
}, {
code: "STD",
decimals: 0,
name: "São Tomé and Príncipe dobra",
number: "678"
}, {
code: "SYP",
decimals: 2,
name: "Syrian pound",
number: "760"
}, {
code: "SZL",
decimals: 2,
name: "Swazi lilangeni",
number: "748"
}, {
code: "THB",
decimals: 2,
name: "Thai baht",
number: "764"
}, {
code: "TJS",
decimals: 2,
name: "Tajikistani somoni",
number: "972"
}, {
code: "TMT",
decimals: 2,
name: "Turkmenistani manat",
number: "934"
}, {
code: "TND",
decimals: 3,
name: "Tunisian dinar",
number: "788"
}, {
code: "TOP",
decimals: 2,
name: "Tongan paʻanga",
number: "776"
}, {
code: "TRY",
decimals: 2,
name: "Turkish lira",
number: "949"
}, {
code: "TTD",
decimals: 2,
name: "Trinidad and Tobago dollar",
number: "780"
}, {
code: "TWD",
decimals: 2,
name: "New Taiwan dollar",
number: "901"
}, {
code: "TZS",
decimals: 2,
name: "Tanzanian shilling",
number: "834"
}, {
code: "UAH",
decimals: 2,
name: "Ukrainian hryvnia",
number: "980"
}, {
code: "UGX",
decimals: 2,
name: "Ugandan shilling",
number: "800"
}, {
code: "USD",
decimals: 2,
name: "United States dollar",
number: "840"
}, {
code: "USN",
decimals: 2,
name: "United States dollar (next day) (funds code)",
number: "997"
}, {
code: "USS",
decimals: 2,
name: "United States dollar (same day) (funds code) (one source[who?] claims it is no longer used, but it is still on the ISO 4217-MA list)",
number: "998"
}, {
code: "UYI",
decimals: 0,
name: "Uruguay Peso en Unidades Indexadas (URUIURUI) (funds code)",
number: "940"
}, {
code: "UYU",
decimals: 2,
name: "Uruguayan peso",
number: "858"
}, {
code: "UZS",
decimals: 2,
name: "Uzbekistan som",
number: "860"
}, {
code: "VEF",
decimals: 2,
name: "Venezuelan bolívar fuerte",
number: "937"
}, {
code: "VND",
decimals: 0,
name: "Vietnamese dong",
number: "704"
}, {
code: "VUV",
decimals: 0,
name: "Vanuatu vatu",
number: "548"
}, {
code: "WST",
decimals: 2,
name: "Samoan tala",
number: "882"
}, {
code: "XAF",
decimals: 0,
name: "CFA franc BEAC",
number: "950"
}, {
code: "XAG",
decimals: null,
name: "Silver (one troy ounce)",
number: "961"
}, {
code: "XAU",
decimals: null,
name: "Gold (one troy ounce)",
number: "959"
}, {
code: "XBA",
decimals: null,
name: "European Composite Unit (EURCO) (bond market unit)",
number: "955"
}, {
code: "XBB",
decimals: null,
name: "European Monetary Unit (E.M.U.-6) (bond market unit)",
number: "956"
}, {
code: "XBC",
decimals: null,
name: "European Unit of Account 9 (E.U.A.-9) (bond market unit)",
number: "957"
}, {
code: "XBD",
decimals: null,
name: "European Unit of Account 17 (E.U.A.-17) (bond market unit)",
number: "958"
}, {
code: "XCD",
decimals: 2,
name: "East Caribbean dollar",
number: "951"
}, {
code: "XDR",
decimals: null,
name: "Special drawing rights",
number: "960"
}, {
code: "XFU",
decimals: null,
name: "UIC franc (special settlement currency)",
number: "Nil"
}, {
code: "XOF",
decimals: 0,
name: "CFA franc BCEAO",
number: "952"
}, {
code: "XPD",
decimals: null,
name: "Palladium (one troy ounce)",
number: "964"
}, {
code: "XPF",
decimals: 0,
name: "CFP franc",
number: "953"
}, {
code: "XPT",
decimals: null,
name: "Platinum (one troy ounce)",
number: "962"
}, {
code: "XTS",
decimals: null,
name: "Code reserved for testing purposes",
number: "963"
}, {
code: "XXX",
decimals: null,
name: "No currency",
number: "999"
}, {
code: "YER",
decimals: 2,
name: "Yemeni rial",
number: "886"
}, {
code: "ZAR",
decimals: 2,
name: "South African rand",
number: "710"
}, {
code: "ZMW",
decimals: 2,
name: "Zambian kwacha",
number: "967"
} ];
}, function(module, exports) {
module.exports = [ {
alpha2: "aa",
alpha3: "aar",
bibliographic: "",
name: "Afar"
}, {
alpha2: "ab",
alpha3: "abk",
bibliographic: "",
name: "Abkhazian"
}, {
alpha2: "",
alpha3: "ace",
bibliographic: "",
name: "Achinese"
}, {
alpha2: "",
alpha3: "ach",
bibliographic: "",
name: "Acoli"
}, {
alpha2: "",
alpha3: "ada",
bibliographic: "",
name: "Adangme"
}, {
alpha2: "",
alpha3: "ady",
bibliographic: "",
name: "Adygei"
}, {
alpha2: "",
alpha3: "ady",
bibliographic: "",
name: "Adyghe"
}, {
alpha2: "",
alpha3: "afa",
bibliographic: "",
name: "Afro-Asiatic languages"
}, {
alpha2: "",
alpha3: "afh",
bibliographic: "",
name: "Afrihili"
}, {
alpha2: "af",
alpha3: "afr",
bibliographic: "",
name: "Afrikaans"
}, {
alpha2: "",
alpha3: "ain",
bibliographic: "",
name: "Ainu"
}, {
alpha2: "ak",
alpha3: "aka",
bibliographic: "",
name: "Akan"
}, {
alpha2: "",
alpha3: "akk",
bibliographic: "",
name: "Akkadian"
}, {
alpha2: "",
alpha3: "ale",
bibliographic: "",
name: "Aleut"
}, {
alpha2: "",
alpha3: "alg",
bibliographic: "",
name: "Algonquian languages"
}, {
alpha2: "",
alpha3: "alt",
bibliographic: "",
name: "Southern Altai"
}, {
alpha2: "am",
alpha3: "amh",
bibliographic: "",
name: "Amharic"
}, {
alpha2: "",
alpha3: "ang",
bibliographic: "",
name: "English, Old (ca.450-1100)"
}, {
alpha2: "",
alpha3: "anp",
bibliographic: "",
name: "Angika"
}, {
alpha2: "",
alpha3: "apa",
bibliographic: "",
name: "Apache languages"
}, {
alpha2: "ar",
alpha3: "ara",
bibliographic: "",
name: "Arabic"
}, {
alpha2: "",
alpha3: "arc",
bibliographic: "",
name: "Imperial Aramaic (700-300 BCE)"
}, {
alpha2: "",
alpha3: "arc",
bibliographic: "",
name: "Official Aramaic (700-300 BCE)"
}, {
alpha2: "an",
alpha3: "arg",
bibliographic: "",
name: "Aragonese"
}, {
alpha2: "",
alpha3: "arn",
bibliographic: "",
name: "Mapuche"
}, {
alpha2: "",
alpha3: "arn",
bibliographic: "",
name: "Mapudungun"
}, {
alpha2: "",
alpha3: "arp",
bibliographic: "",
name: "Arapaho"
}, {
alpha2: "",
alpha3: "art",
bibliographic: "",
name: "Artificial languages"
}, {
alpha2: "",
alpha3: "arw",
bibliographic: "",
name: "Arawak"
}, {
alpha2: "as",
alpha3: "asm",
bibliographic: "",
name: "Assamese"
}, {
alpha2: "",
alpha3: "ast",
bibliographic: "",
name: "Asturian"
}, {
alpha2: "",
alpha3: "ast",
bibliographic: "",
name: "Asturleonese"
}, {
alpha2: "",
alpha3: "ast",
bibliographic: "",
name: "Bable"
}, {
alpha2: "",
alpha3: "ast",
bibliographic: "",
name: "Leonese"
}, {
alpha2: "",
alpha3: "ath",
bibliographic: "",
name: "Athapascan languages"
}, {
alpha2: "",
alpha3: "aus",
bibliographic: "",
name: "Australian languages"
}, {
alpha2: "av",
alpha3: "ava",
bibliographic: "",
name: "Avaric"
}, {
alpha2: "ae",
alpha3: "ave",
bibliographic: "",
name: "Avestan"
}, {
alpha2: "",
alpha3: "awa",
bibliographic: "",
name: "Awadhi"
}, {
alpha2: "ay",
alpha3: "aym",
bibliographic: "",
name: "Aymara"
}, {
alpha2: "az",
alpha3: "aze",
bibliographic: "",
name: "Azerbaijani"
}, {
alpha2: "",
alpha3: "bad",
bibliographic: "",
name: "Banda languages"
}, {
alpha2: "",
alpha3: "bai",
bibliographic: "",
name: "Bamileke languages"
}, {
alpha2: "ba",
alpha3: "bak",
bibliographic: "",
name: "Bashkir"
}, {
alpha2: "",
alpha3: "bal",
bibliographic: "",
name: "Baluchi"
}, {
alpha2: "bm",
alpha3: "bam",
bibliographic: "",
name: "Bambara"
}, {
alpha2: "",
alpha3: "ban",
bibliographic: "",
name: "Balinese"
}, {
alpha2: "",
alpha3: "bas",
bibliographic: "",
name: "Basa"
}, {
alpha2: "",
alpha3: "bat",
bibliographic: "",
name: "Baltic languages"
}, {
alpha2: "",
alpha3: "bej",
bibliographic: "",
name: "Bedawiyet"
}, {
alpha2: "",
alpha3: "bej",
bibliographic: "",
name: "Beja"
}, {
alpha2: "be",
alpha3: "bel",
bibliographic: "",
name: "Belarusian"
}, {
alpha2: "",
alpha3: "bem",
bibliographic: "",
name: "Bemba"
}, {
alpha2: "bn",
alpha3: "ben",
bibliographic: "",
name: "Bengali"
}, {
alpha2: "",
alpha3: "ber",
bibliographic: "",
name: "Berber languages"
}, {
alpha2: "",
alpha3: "bho",
bibliographic: "",
name: "Bhojpuri"
}, {
alpha2: "bh",
alpha3: "bih",
bibliographic: "",
name: "Bihari languages"
}, {
alpha2: "",
alpha3: "bik",
bibliographic: "",
name: "Bikol"
}, {
alpha2: "",
alpha3: "bin",
bibliographic: "",
name: "Bini"
}, {
alpha2: "",
alpha3: "bin",
bibliographic: "",
name: "Edo"
}, {
alpha2: "bi",
alpha3: "bis",
bibliographic: "",
name: "Bislama"
}, {
alpha2: "",
alpha3: "bla",
bibliographic: "",
name: "Siksika"
}, {
alpha2: "",
alpha3: "bnt",
bibliographic: "",
name: "Bantu languages"
}, {
alpha2: "bo",
alpha3: "bod",
bibliographic: "tib",
name: "Tibetan"
}, {
alpha2: "bs",
alpha3: "bos",
bibliographic: "",
name: "Bosnian"
}, {
alpha2: "",
alpha3: "bra",
bibliographic: "",
name: "Braj"
}, {
alpha2: "br",
alpha3: "bre",
bibliographic: "",
name: "Breton"
}, {
alpha2: "",
alpha3: "btk",
bibliographic: "",
name: "Batak languages"
}, {
alpha2: "",
alpha3: "bua",
bibliographic: "",
name: "Buriat"
}, {
alpha2: "",
alpha3: "bug",
bibliographic: "",
name: "Buginese"
}, {
alpha2: "bg",
alpha3: "bul",
bibliographic: "",
name: "Bulgarian"
}, {
alpha2: "",
alpha3: "byn",
bibliographic: "",
name: "Bilin"
}, {
alpha2: "",
alpha3: "byn",
bibliographic: "",
name: "Blin"
}, {
alpha2: "",
alpha3: "cad",
bibliographic: "",
name: "Caddo"
}, {
alpha2: "",
alpha3: "cai",
bibliographic: "",
name: "Central American Indian languages"
}, {
alpha2: "",
alpha3: "car",
bibliographic: "",
name: "Galibi Carib"
}, {
alpha2: "ca",
alpha3: "cat",
bibliographic: "",
name: "Catalan"
}, {
alpha2: "ca",
alpha3: "cat",
bibliographic: "",
name: "Valencian"
}, {
alpha2: "",
alpha3: "cau",
bibliographic: "",
name: "Caucasian languages"
}, {
alpha2: "",
alpha3: "ceb",
bibliographic: "",
name: "Cebuano"
}, {
alpha2: "",
alpha3: "cel",
bibliographic: "",
name: "Celtic languages"
}, {
alpha2: "cs",
alpha3: "ces",
bibliographic: "cze",
name: "Czech"
}, {
alpha2: "ch",
alpha3: "cha",
bibliographic: "",
name: "Chamorro"
}, {
alpha2: "",
alpha3: "chb",
bibliographic: "",
name: "Chibcha"
}, {
alpha2: "ce",
alpha3: "che",
bibliographic: "",
name: "Chechen"
}, {
alpha2: "",
alpha3: "chg",
bibliographic: "",
name: "Chagatai"
}, {
alpha2: "",
alpha3: "chk",
bibliographic: "",
name: "Chuukese"
}, {
alpha2: "",
alpha3: "chm",
bibliographic: "",
name: "Mari"
}, {
alpha2: "",
alpha3: "chn",
bibliographic: "",
name: "Chinook jargon"
}, {
alpha2: "",
alpha3: "cho",
bibliographic: "",
name: "Choctaw"
}, {
alpha2: "",
alpha3: "chp",
bibliographic: "",
name: "Chipewyan"
}, {
alpha2: "",
alpha3: "chp",
bibliographic: "",
name: "Dene Suline"
}, {
alpha2: "",
alpha3: "chr",
bibliographic: "",
name: "Cherokee"
}, {
alpha2: "cu",
alpha3: "chu",
bibliographic: "",
name: "Church Slavic"
}, {
alpha2: "cu",
alpha3: "chu",
bibliographic: "",
name: "Church Slavonic"
}, {
alpha2: "cu",
alpha3: "chu",
bibliographic: "",
name: "Old Bulgarian"
}, {
alpha2: "cu",
alpha3: "chu",
bibliographic: "",
name: "Old Church Slavonic"
}, {
alpha2: "cu",
alpha3: "chu",
bibliographic: "",
name: "Old Slavonic"
}, {
alpha2: "cv",
alpha3: "chv",
bibliographic: "",
name: "Chuvash"
}, {
alpha2: "",
alpha3: "chy",
bibliographic: "",
name: "Cheyenne"
}, {
alpha2: "",
alpha3: "cmc",
bibliographic: "",
name: "Chamic languages"
}, {
alpha2: "",
alpha3: "cop",
bibliographic: "",
name: "Coptic"
}, {
alpha2: "kw",
alpha3: "cor",
bibliographic: "",
name: "Cornish"
}, {
alpha2: "co",
alpha3: "cos",
bibliographic: "",
name: "Corsican"
}, {
alpha2: "",
alpha3: "cpe",
bibliographic: "",
name: "Creoles and pidgins, English based"
}, {
alpha2: "",
alpha3: "cpf",
bibliographic: "",
name: "Creoles and pidgins, French-based"
}, {
alpha2: "",
alpha3: "cpp",
bibliographic: "",
name: "Creoles and pidgins, Portuguese-based"
}, {
alpha2: "cr",
alpha3: "cre",
bibliographic: "",
name: "Cree"
}, {
alpha2: "",
alpha3: "crh",
bibliographic: "",
name: "Crimean Tatar"
}, {
alpha2: "",
alpha3: "crh",
bibliographic: "",
name: "Crimean Turkish"
}, {
alpha2: "",
alpha3: "crp",
bibliographic: "",
name: "Creoles and pidgins"
}, {
alpha2: "",
alpha3: "csb",
bibliographic: "",
name: "Kashubian"
}, {
alpha2: "",
alpha3: "cus",
bibliographic: "",
name: "Cushitic languages"
}, {
alpha2: "cy",
alpha3: "cym",
bibliographic: "wel",
name: "Welsh"
}, {
alpha2: "",
alpha3: "dak",
bibliographic: "",
name: "Dakota"
}, {
alpha2: "da",
alpha3: "dan",
bibliographic: "",
name: "Danish"
}, {
alpha2: "",
alpha3: "dar",
bibliographic: "",
name: "Dargwa"
}, {
alpha2: "",
alpha3: "day",
bibliographic: "",
name: "Land Dayak languages"
}, {
alpha2: "",
alpha3: "del",
bibliographic: "",
name: "Delaware"
}, {
alpha2: "",
alpha3: "den",
bibliographic: "",
name: "Slave (Athapascan)"
}, {
alpha2: "de",
alpha3: "deu",
bibliographic: "ger",
name: "German"
}, {
alpha2: "",
alpha3: "dgr",
bibliographic: "",
name: "Dogrib"
}, {
alpha2: "",
alpha3: "din",
bibliographic: "",
name: "Dinka"
}, {
alpha2: "dv",
alpha3: "div",
bibliographic: "",
name: "Dhivehi"
}, {
alpha2: "dv",
alpha3: "div",
bibliographic: "",
name: "Divehi"
}, {
alpha2: "dv",
alpha3: "div",
bibliographic: "",
name: "Maldivian"
}, {
alpha2: "",
alpha3: "doi",
bibliographic: "",
name: "Dogri"
}, {
alpha2: "",
alpha3: "dra",
bibliographic: "",
name: "Dravidian languages"
}, {
alpha2: "",
alpha3: "dsb",
bibliographic: "",
name: "Lower Sorbian"
}, {
alpha2: "",
alpha3: "dua",
bibliographic: "",
name: "Duala"
}, {
alpha2: "",
alpha3: "dum",
bibliographic: "",
name: "Dutch, Middle (ca.1050-1350)"
}, {
alpha2: "",
alpha3: "dyu",
bibliographic: "",
name: "Dyula"
}, {
alpha2: "dz",
alpha3: "dzo",
bibliographic: "",
name: "Dzongkha"
}, {
alpha2: "",
alpha3: "efi",
bibliographic: "",
name: "Efik"
}, {
alpha2: "",
alpha3: "egy",
bibliographic: "",
name: "Egyptian (Ancient)"
}, {
alpha2: "",
alpha3: "eka",
bibliographic: "",
name: "Ekajuk"
}, {
alpha2: "el",
alpha3: "ell",
bibliographic: "gre",
name: "Greek, Modern (1453-)"
}, {
alpha2: "",
alpha3: "elx",
bibliographic: "",
name: "Elamite"
}, {
alpha2: "en",
alpha3: "eng",
bibliographic: "",
name: "English"
}, {
alpha2: "",
alpha3: "enm",
bibliographic: "",
name: "English, Middle (1100-1500)"
}, {
alpha2: "eo",
alpha3: "epo",
bibliographic: "",
name: "Esperanto"
}, {
alpha2: "et",
alpha3: "est",
bibliographic: "",
name: "Estonian"
}, {
alpha2: "eu",
alpha3: "eus",
bibliographic: "baq",
name: "Basque"
}, {
alpha2: "ee",
alpha3: "ewe",
bibliographic: "",
name: "Ewe"
}, {
alpha2: "",
alpha3: "ewo",
bibliographic: "",
name: "Ewondo"
}, {
alpha2: "",
alpha3: "fan",
bibliographic: "",
name: "Fang"
}, {
alpha2: "fo",
alpha3: "fao",
bibliographic: "",
name: "Faroese"
}, {
alpha2: "fa",
alpha3: "fas",
bibliographic: "per",
name: "Persian"
}, {
alpha2: "",
alpha3: "fat",
bibliographic: "",
name: "Fanti"
}, {
alpha2: "fj",
alpha3: "fij",
bibliographic: "",
name: "Fijian"
}, {
alpha2: "",
alpha3: "fil",
bibliographic: "",
name: "Filipino"
}, {
alpha2: "",
alpha3: "fil",
bibliographic: "",
name: "Pilipino"
}, {
alpha2: "fi",
alpha3: "fin",
bibliographic: "",
name: "Finnish"
}, {
alpha2: "",
alpha3: "fiu",
bibliographic: "",
name: "Finno-Ugrian languages"
}, {
alpha2: "",
alpha3: "fon",
bibliographic: "",
name: "Fon"
}, {
alpha2: "fr",
alpha3: "fra",
bibliographic: "fre",
name: "French"
}, {
alpha2: "",
alpha3: "frm",
bibliographic: "",
name: "French, Middle (ca.1400-1600)"
}, {
alpha2: "",
alpha3: "fro",
bibliographic: "",
name: "French, Old (842-ca.1400)"
}, {
alpha2: "",
alpha3: "frr",
bibliographic: "",
name: "Northern Frisian"
}, {
alpha2: "",
alpha3: "frs",
bibliographic: "",
name: "Eastern Frisian"
}, {
alpha2: "fy",
alpha3: "fry",
bibliographic: "",
name: "Western Frisian"
}, {
alpha2: "ff",
alpha3: "ful",
bibliographic: "",
name: "Fulah"
}, {
alpha2: "",
alpha3: "fur",
bibliographic: "",
name: "Friulian"
}, {
alpha2: "",
alpha3: "gaa",
bibliographic: "",
name: "Ga"
}, {
alpha2: "",
alpha3: "gay",
bibliographic: "",
name: "Gayo"
}, {
alpha2: "",
alpha3: "gba",
bibliographic: "",
name: "Gbaya"
}, {
alpha2: "",
alpha3: "gem",
bibliographic: "",
name: "Germanic languages"
}, {
alpha2: "",
alpha3: "gez",
bibliographic: "",
name: "Geez"
}, {
alpha2: "",
alpha3: "gil",
bibliographic: "",
name: "Gilbertese"
}, {
alpha2: "gd",
alpha3: "gla",
bibliographic: "",
name: "Gaelic"
}, {
alpha2: "gd",
alpha3: "gla",
bibliographic: "",
name: "Scottish Gaelic"
}, {
alpha2: "ga",
alpha3: "gle",
bibliographic: "",
name: "Irish"
}, {
alpha2: "gl",
alpha3: "glg",
bibliographic: "",
name: "Galician"
}, {
alpha2: "gv",
alpha3: "glv",
bibliographic: "",
name: "Manx"
}, {
alpha2: "",
alpha3: "gmh",
bibliographic: "",
name: "German, Middle High (ca.1050-1500)"
}, {
alpha2: "",
alpha3: "goh",
bibliographic: "",
name: "German, Old High (ca.750-1050)"
}, {
alpha2: "",
alpha3: "gon",
bibliographic: "",
name: "Gondi"
}, {
alpha2: "",
alpha3: "gor",
bibliographic: "",
name: "Gorontalo"
}, {
alpha2: "",
alpha3: "got",
bibliographic: "",
name: "Gothic"
}, {
alpha2: "",
alpha3: "grb",
bibliographic: "",
name: "Grebo"
}, {
alpha2: "",
alpha3: "grc",
bibliographic: "",
name: "Greek, Ancient (to 1453)"
}, {
alpha2: "gn",
alpha3: "grn",
bibliographic: "",
name: "Guarani"
}, {
alpha2: "",
alpha3: "gsw",
bibliographic: "",
name: "Alemannic"
}, {
alpha2: "",
alpha3: "gsw",
bibliographic: "",
name: "Alsatian"
}, {
alpha2: "",
alpha3: "gsw",
bibliographic: "",
name: "Swiss German"
}, {
alpha2: "gu",
alpha3: "guj",
bibliographic: "",
name: "Gujarati"
}, {
alpha2: "",
alpha3: "gwi",
bibliographic: "",
name: "Gwich'in"
}, {
alpha2: "",
alpha3: "hai",
bibliographic: "",
name: "Haida"
}, {
alpha2: "ht",
alpha3: "hat",
bibliographic: "",
name: "Haitian"
}, {
alpha2: "ht",
alpha3: "hat",
bibliographic: "",
name: "Haitian Creole"
}, {
alpha2: "ha",
alpha3: "hau",
bibliographic: "",
name: "Hausa"
}, {
alpha2: "",
alpha3: "haw",
bibliographic: "",
name: "Hawaiian"
}, {
alpha2: "he",
alpha3: "heb",
bibliographic: "",
name: "Hebrew"
}, {
alpha2: "hz",
alpha3: "her",
bibliographic: "",
name: "Herero"
}, {
alpha2: "",
alpha3: "hil",
bibliographic: "",
name: "Hiligaynon"
}, {
alpha2: "",
alpha3: "him",
bibliographic: "",
name: "Himachali languages"
}, {
alpha2: "",
alpha3: "him",
bibliographic: "",
name: "Western Pahari languages"
}, {
alpha2: "hi",
alpha3: "hin",
bibliographic: "",
name: "Hindi"
}, {
alpha2: "",
alpha3: "hit",
bibliographic: "",
name: "Hittite"
}, {
alpha2: "",
alpha3: "hmn",
bibliographic: "",
name: "Hmong"
}, {
alpha2: "",
alpha3: "hmn",
bibliographic: "",
name: "Mong"
}, {
alpha2: "ho",
alpha3: "hmo",
bibliographic: "",
name: "Hiri Motu"
}, {
alpha2: "hr",
alpha3: "hrv",
bibliographic: "",
name: "Croatian"
}, {
alpha2: "",
alpha3: "hsb",
bibliographic: "",
name: "Upper Sorbian"
}, {
alpha2: "hu",
alpha3: "hun",
bibliographic: "",
name: "Hungarian"
}, {
alpha2: "",
alpha3: "hup",
bibliographic: "",
name: "Hupa"
}, {
alpha2: "hy",
alpha3: "hye",
bibliographic: "arm",
name: "Armenian"
}, {
alpha2: "",
alpha3: "iba",
bibliographic: "",
name: "Iban"
}, {
alpha2: "ig",
alpha3: "ibo",
bibliographic: "",
name: "Igbo"
}, {
alpha2: "io",
alpha3: "ido",
bibliographic: "",
name: "Ido"
}, {
alpha2: "ii",
alpha3: "iii",
bibliographic: "",
name: "Nuosu"
}, {
alpha2: "ii",
alpha3: "iii",
bibliographic: "",
name: "Sichuan Yi"
}, {
alpha2: "",
alpha3: "ijo",
bibliographic: "",
name: "Ijo languages"
}, {
alpha2: "iu",
alpha3: "iku",
bibliographic: "",
name: "Inuktitut"
}, {
alpha2: "ie",
alpha3: "ile",
bibliographic: "",
name: "Interlingue"
}, {
alpha2: "ie",
alpha3: "ile",
bibliographic: "",
name: "Occidental"
}, {
alpha2: "",
alpha3: "ilo",
bibliographic: "",
name: "Iloko"
}, {
alpha2: "ia",
alpha3: "ina",
bibliographic: "",
name: "Interlingua (International Auxiliary Language Association)"
}, {
alpha2: "",
alpha3: "inc",
bibliographic: "",
name: "Indic languages"
}, {
alpha2: "id",
alpha3: "ind",
bibliographic: "",
name: "Indonesian"
}, {
alpha2: "",
alpha3: "ine",
bibliographic: "",
name: "Indo-European languages"
}, {
alpha2: "",
alpha3: "inh",
bibliographic: "",
name: "Ingush"
}, {
alpha2: "ik",
alpha3: "ipk",
bibliographic: "",
name: "Inupiaq"
}, {
alpha2: "",
alpha3: "ira",
bibliographic: "",
name: "Iranian languages"
}, {
alpha2: "",
alpha3: "iro",
bibliographic: "",
name: "Iroquoian languages"
}, {
alpha2: "is",
alpha3: "isl",
bibliographic: "ice",
name: "Icelandic"
}, {
alpha2: "it",
alpha3: "ita",
bibliographic: "",
name: "Italian"
}, {
alpha2: "jv",
alpha3: "jav",
bibliographic: "",
name: "Javanese"
}, {
alpha2: "",
alpha3: "jbo",
bibliographic: "",
name: "Lojban"
}, {
alpha2: "ja",
alpha3: "jpn",
bibliographic: "",
name: "Japanese"
}, {
alpha2: "",
alpha3: "jpr",
bibliographic: "",
name: "Judeo-Persian"
}, {
alpha2: "",
alpha3: "jrb",
bibliographic: "",
name: "Judeo-Arabic"
}, {
alpha2: "",
alpha3: "kaa",
bibliographic: "",
name: "Kara-Kalpak"
}, {
alpha2: "",
alpha3: "kab",
bibliographic: "",
name: "Kabyle"
}, {
alpha2: "",
alpha3: "kac",
bibliographic: "",
name: "Jingpho"
}, {
alpha2: "",
alpha3: "kac",
bibliographic: "",
name: "Kachin"
}, {
alpha2: "kl",
alpha3: "kal",
bibliographic: "",
name: "Greenlandic"
}, {
alpha2: "kl",
alpha3: "kal",
bibliographic: "",
name: "Kalaallisut"
}, {
alpha2: "",
alpha3: "kam",
bibliographic: "",
name: "Kamba"
}, {
alpha2: "kn",
alpha3: "kan",
bibliographic: "",
name: "Kannada"
}, {
alpha2: "",
alpha3: "kar",
bibliographic: "",
name: "Karen languages"
}, {
alpha2: "ks",
alpha3: "kas",
bibliographic: "",
name: "Kashmiri"
}, {
alpha2: "ka",
alpha3: "kat",
bibliographic: "geo",
name: "Georgian"
}, {
alpha2: "kr",
alpha3: "kau",
bibliographic: "",
name: "Kanuri"
}, {
alpha2: "",
alpha3: "kaw",
bibliographic: "",
name: "Kawi"
}, {
alpha2: "kk",
alpha3: "kaz",
bibliographic: "",
name: "Kazakh"
}, {
alpha2: "",
alpha3: "kbd",
bibliographic: "",
name: "Kabardian"
}, {
alpha2: "",
alpha3: "kha",
bibliographic: "",
name: "Khasi"
}, {
alpha2: "",
alpha3: "khi",
bibliographic: "",
name: "Khoisan languages"
}, {
alpha2: "km",
alpha3: "khm",
bibliographic: "",
name: "Central Khmer"
}, {
alpha2: "",
alpha3: "kho",
bibliographic: "",
name: "Khotanese"
}, {
alpha2: "",
alpha3: "kho",
bibliographic: "",
name: "Sakan"
}, {
alpha2: "ki",
alpha3: "kik",
bibliographic: "",
name: "Gikuyu"
}, {
alpha2: "ki",
alpha3: "kik",
bibliographic: "",
name: "Kikuyu"
}, {
alpha2: "rw",
alpha3: "kin",
bibliographic: "",
name: "Kinyarwanda"
}, {
alpha2: "ky",
alpha3: "kir",
bibliographic: "",
name: "Kirghiz"
}, {
alpha2: "ky",
alpha3: "kir",
bibliographic: "",
name: "Kyrgyz"
}, {
alpha2: "",
alpha3: "kmb",
bibliographic: "",
name: "Kimbundu"
}, {
alpha2: "",
alpha3: "kok",
bibliographic: "",
name: "Konkani"
}, {
alpha2: "kv",
alpha3: "kom",
bibliographic: "",
name: "Komi"
}, {
alpha2: "kg",
alpha3: "kon",
bibliographic: "",
name: "Kongo"
}, {
alpha2: "ko",
alpha3: "kor",
bibliographic: "",
name: "Korean"
}, {
alpha2: "",
alpha3: "kos",
bibliographic: "",
name: "Kosraean"
}, {
alpha2: "",
alpha3: "kpe",
bibliographic: "",
name: "Kpelle"
}, {
alpha2: "",
alpha3: "krc",
bibliographic: "",
name: "Karachay-Balkar"
}, {
alpha2: "",
alpha3: "krl",
bibliographic: "",
name: "Karelian"
}, {
alpha2: "",
alpha3: "kro",
bibliographic: "",
name: "Kru languages"
}, {
alpha2: "",
alpha3: "kru",
bibliographic: "",
name: "Kurukh"
}, {
alpha2: "kj",
alpha3: "kua",
bibliographic: "",
name: "Kuanyama"
}, {
alpha2: "kj",
alpha3: "kua",
bibliographic: "",
name: "Kwanyama"
}, {
alpha2: "",
alpha3: "kum",
bibliographic: "",
name: "Kumyk"
}, {
alpha2: "ku",
alpha3: "kur",
bibliographic: "",
name: "Kurdish"
}, {
alpha2: "",
alpha3: "kut",
bibliographic: "",
name: "Kutenai"
}, {
alpha2: "",
alpha3: "lad",
bibliographic: "",
name: "Ladino"
}, {
alpha2: "",
alpha3: "lah",
bibliographic: "",
name: "Lahnda"
}, {
alpha2: "",
alpha3: "lam",
bibliographic: "",
name: "Lamba"
}, {
alpha2: "lo",
alpha3: "lao",
bibliographic: "",
name: "Lao"
}, {
alpha2: "la",
alpha3: "lat",
bibliographic: "",
name: "Latin"
}, {
alpha2: "lv",
alpha3: "lav",
bibliographic: "",
name: "Latvian"
}, {
alpha2: "",
alpha3: "lez",
bibliographic: "",
name: "Lezghian"
}, {
alpha2: "li",
alpha3: "lim",
bibliographic: "",
name: "Limburgan"
}, {
alpha2: "li",
alpha3: "lim",
bibliographic: "",
name: "Limburger"
}, {
alpha2: "li",
alpha3: "lim",
bibliographic: "",
name: "Limburgish"
}, {
alpha2: "ln",
alpha3: "lin",
bibliographic: "",
name: "Lingala"
}, {
alpha2: "lt",
alpha3: "lit",
bibliographic: "",
name: "Lithuanian"
}, {
alpha2: "",
alpha3: "lol",
bibliographic: "",
name: "Mongo"
}, {
alpha2: "",
alpha3: "loz",
bibliographic: "",
name: "Lozi"
}, {
alpha2: "lb",
alpha3: "ltz",
bibliographic: "",
name: "Letzeburgesch"
}, {
alpha2: "lb",
alpha3: "ltz",
bibliographic: "",
name: "Luxembourgish"
}, {
alpha2: "",
alpha3: "lua",
bibliographic: "",
name: "Luba-Lulua"
}, {
alpha2: "lu",
alpha3: "lub",
bibliographic: "",
name: "Luba-Katanga"
}, {
alpha2: "lg",
alpha3: "lug",
bibliographic: "",
name: "Ganda"
}, {
alpha2: "",
alpha3: "lui",
bibliographic: "",
name: "Luiseno"
}, {
alpha2: "",
alpha3: "lun",
bibliographic: "",
name: "Lunda"
}, {
alpha2: "",
alpha3: "luo",
bibliographic: "",
name: "Luo (Kenya and Tanzania)"
}, {
alpha2: "",
alpha3: "lus",
bibliographic: "",
name: "Lushai"
}, {
alpha2: "",
alpha3: "mad",
bibliographic: "",
name: "Madurese"
}, {
alpha2: "",
alpha3: "mag",
bibliographic: "",
name: "Magahi"
}, {
alpha2: "mh",
alpha3: "mah",
bibliographic: "",
name: "Marshallese"
}, {
alpha2: "",
alpha3: "mai",
bibliographic: "",
name: "Maithili"
}, {
alpha2: "",
alpha3: "mak",
bibliographic: "",
name: "Makasar"
}, {
alpha2: "ml",
alpha3: "mal",
bibliographic: "",
name: "Malayalam"
}, {
alpha2: "",
alpha3: "man",
bibliographic: "",
name: "Mandingo"
}, {
alpha2: "",
alpha3: "map",
bibliographic: "",
name: "Austronesian languages"
}, {
alpha2: "mr",
alpha3: "mar",
bibliographic: "",
name: "Marathi"
}, {
alpha2: "",
alpha3: "mas",
bibliographic: "",
name: "Masai"
}, {
alpha2: "",
alpha3: "mdf",
bibliographic: "",
name: "Moksha"
}, {
alpha2: "",
alpha3: "mdr",
bibliographic: "",
name: "Mandar"
}, {
alpha2: "",
alpha3: "men",
bibliographic: "",
name: "Mende"
}, {
alpha2: "",
alpha3: "mga",
bibliographic: "",
name: "Irish, Middle (900-1200)"
}, {
alpha2: "",
alpha3: "mic",
bibliographic: "",
name: "Mi'kmaq"
}, {
alpha2: "",
alpha3: "mic",
bibliographic: "",
name: "Micmac"
}, {
alpha2: "",
alpha3: "min",
bibliographic: "",
name: "Minangkabau"
}, {
alpha2: "",
alpha3: "mis",
bibliographic: "",
name: "Uncoded languages"
}, {
alpha2: "mk",
alpha3: "mkd",
bibliographic: "mac",
name: "Macedonian"
}, {
alpha2: "",
alpha3: "mkh",
bibliographic: "",
name: "Mon-Khmer languages"
}, {
alpha2: "mg",
alpha3: "mlg",
bibliographic: "",
name: "Malagasy"
}, {
alpha2: "mt",
alpha3: "mlt",
bibliographic: "",
name: "Maltese"
}, {
alpha2: "",
alpha3: "mnc",
bibliographic: "",
name: "Manchu"
}, {
alpha2: "",
alpha3: "mni",
bibliographic: "",
name: "Manipuri"
}, {
alpha2: "",
alpha3: "mno",
bibliographic: "",
name: "Manobo languages"
}, {
alpha2: "",
alpha3: "moh",
bibliographic: "",
name: "Mohawk"
}, {
alpha2: "mn",
alpha3: "mon",
bibliographic: "",
name: "Mongolian"
}, {
alpha2: "",
alpha3: "mos",
bibliographic: "",
name: "Mossi"
}, {
alpha2: "",
alpha3: "mot",
bibliographic: "",
name: "Montenegrin"
}, {
alpha2: "mi",
alpha3: "mri",
bibliographic: "mao",
name: "Maori"
}, {
alpha2: "ms",
alpha3: "msa",
bibliographic: "may",
name: "Malay"
}, {
alpha2: "",
alpha3: "mul",
bibliographic: "",
name: "Multiple languages"
}, {
alpha2: "",
alpha3: "mun",
bibliographic: "",
name: "Munda languages"
}, {
alpha2: "",
alpha3: "mus",
bibliographic: "",
name: "Creek"
}, {
alpha2: "",
alpha3: "mwl",
bibliographic: "",
name: "Mirandese"
}, {
alpha2: "",
alpha3: "mwr",
bibliographic: "",
name: "Marwari"
}, {
alpha2: "my",
alpha3: "mya",
bibliographic: "bur",
name: "Burmese"
}, {
alpha2: "",
alpha3: "myn",
bibliographic: "",
name: "Mayan languages"
}, {
alpha2: "",
alpha3: "myv",
bibliographic: "",
name: "Erzya"
}, {
alpha2: "",
alpha3: "nah",
bibliographic: "",
name: "Nahuatl languages"
}, {
alpha2: "",
alpha3: "nai",
bibliographic: "",
name: "North American Indian languages"
}, {
alpha2: "",
alpha3: "nap",
bibliographic: "",
name: "Neapolitan"
}, {
alpha2: "na",
alpha3: "nau",
bibliographic: "",
name: "Nauru"
}, {
alpha2: "nv",
alpha3: "nav",
bibliographic: "",
name: "Navaho"
}, {
alpha2: "nv",
alpha3: "nav",
bibliographic: "",
name: "Navajo"
}, {
alpha2: "nr",
alpha3: "nbl",
bibliographic: "",
name: "Ndebele, South"
}, {
alpha2: "nr",
alpha3: "nbl",
bibliographic: "",
name: "South Ndebele"
}, {
alpha2: "nd",
alpha3: "nde",
bibliographic: "",
name: "Ndebele, North"
}, {
alpha2: "nd",
alpha3: "nde",
bibliographic: "",
name: "North Ndebele"
}, {
alpha2: "ng",
alpha3: "ndo",
bibliographic: "",
name: "Ndonga"
}, {
alpha2: "",
alpha3: "nds",
bibliographic: "",
name: "German, Low"
}, {
alpha2: "",
alpha3: "nds",
bibliographic: "",
name: "Low German"
}, {
alpha2: "",
alpha3: "nds",
bibliographic: "",
name: "Low Saxon"
}, {
alpha2: "",
alpha3: "nds",
bibliographic: "",
name: "Saxon, Low"
}, {
alpha2: "ne",
alpha3: "nep",
bibliographic: "",
name: "Nepali"
}, {
alpha2: "",
alpha3: "new",
bibliographic: "",
name: "Nepal Bhasa"
}, {
alpha2: "",
alpha3: "new",
bibliographic: "",
name: "Newari"
}, {
alpha2: "",
alpha3: "nia",
bibliographic: "",
name: "Nias"
}, {
alpha2: "",
alpha3: "nic",
bibliographic: "",
name: "Niger-Kordofanian languages"
}, {
alpha2: "",
alpha3: "niu",
bibliographic: "",
name: "Niuean"
}, {
alpha2: "nl",
alpha3: "nld",
bibliographic: "dut",
name: "Dutch"
}, {
alpha2: "nl",
alpha3: "nld",
bibliographic: "dut",
name: "Flemish"
}, {
alpha2: "nn",
alpha3: "nno",
bibliographic: "",
name: "Norwegian Nynorsk"
}, {
alpha2: "nn",
alpha3: "nno",
bibliographic: "",
name: "Nynorsk, Norwegian"
}, {
alpha2: "nb",
alpha3: "nob",
bibliographic: "",
name: "Bokmål, Norwegian"
}, {
alpha2: "nb",
alpha3: "nob",
bibliographic: "",
name: "Norwegian Bokmål"
}, {
alpha2: "",
alpha3: "nog",
bibliographic: "",
name: "Nogai"
}, {
alpha2: "",
alpha3: "non",
bibliographic: "",
name: "Norse, Old"
}, {
alpha2: "no",
alpha3: "nor",
bibliographic: "",
name: "Norwegian"
}, {
alpha2: "",
alpha3: "nqo",
bibliographic: "",
name: "N'Ko"
}, {
alpha2: "",
alpha3: "nso",
bibliographic: "",
name: "Northern Sotho"
}, {
alpha2: "",
alpha3: "nso",
bibliographic: "",
name: "Pedi"
}, {
alpha2: "",
alpha3: "nso",
bibliographic: "",
name: "Sepedi"
}, {
alpha2: "",
alpha3: "nso",
bibliographic: "",
name: "Sotho, Northern"
}, {
alpha2: "",
alpha3: "nub",
bibliographic: "",
name: "Nubian languages"
}, {
alpha2: "",
alpha3: "nwc",
bibliographic: "",
name: "Classical Nepal Bhasa"
}, {
alpha2: "",
alpha3: "nwc",
bibliographic: "",
name: "Classical Newari"
}, {
alpha2: "",
alpha3: "nwc",
bibliographic: "",
name: "Old Newari"
}, {
alpha2: "ny",
alpha3: "nya",
bibliographic: "",
name: "Chewa"
}, {
alpha2: "ny",
alpha3: "nya",
bibliographic: "",
name: "Chichewa"
}, {
alpha2: "ny",
alpha3: "nya",
bibliographic: "",
name: "Nyanja"
}, {
alpha2: "",
alpha3: "nym",
bibliographic: "",
name: "Nyamwezi"
}, {
alpha2: "",
alpha3: "nyn",
bibliographic: "",
name: "Nyankole"
}, {
alpha2: "",
alpha3: "nyo",
bibliographic: "",
name: "Nyoro"
}, {
alpha2: "",
alpha3: "nzi",
bibliographic: "",
name: "Nzima"
}, {
alpha2: "oc",
alpha3: "oci",
bibliographic: "",
name: "Occitan (post 1500)"
}, {
alpha2: "oj",
alpha3: "oji",
bibliographic: "",
name: "Ojibwa"
}, {
alpha2: "or",
alpha3: "ori",
bibliographic: "",
name: "Oriya"
}, {
alpha2: "om",
alpha3: "orm",
bibliographic: "",
name: "Oromo"
}, {
alpha2: "",
alpha3: "osa",
bibliographic: "",
name: "Osage"
}, {
alpha2: "os",
alpha3: "oss",
bibliographic: "",
name: "Ossetian"
}, {
alpha2: "os",
alpha3: "oss",
bibliographic: "",
name: "Ossetic"
}, {
alpha2: "",
alpha3: "ota",
bibliographic: "",
name: "Turkish, Ottoman (1500-1928)"
}, {
alpha2: "",
alpha3: "oto",
bibliographic: "",
name: "Otomian languages"
}, {
alpha2: "",
alpha3: "paa",
bibliographic: "",
name: "Papuan languages"
}, {
alpha2: "",
alpha3: "pag",
bibliographic: "",
name: "Pangasinan"
}, {
alpha2: "",
alpha3: "pal",
bibliographic: "",
name: "Pahlavi"
}, {
alpha2: "",
alpha3: "pam",
bibliographic: "",
name: "Kapampangan"
}, {
alpha2: "",
alpha3: "pam",
bibliographic: "",
name: "Pampanga"
}, {
alpha2: "pa",
alpha3: "pan",
bibliographic: "",
name: "Panjabi"
}, {
alpha2: "pa",
alpha3: "pan",
bibliographic: "",
name: "Punjabi"
}, {
alpha2: "",
alpha3: "pap",
bibliographic: "",
name: "Papiamento"
}, {
alpha2: "",
alpha3: "pau",
bibliographic: "",
name: "Palauan"
}, {
alpha2: "",
alpha3: "peo",
bibliographic: "",
name: "Persian, Old (ca.600-400 B.C.)"
}, {
alpha2: "",
alpha3: "phi",
bibliographic: "",
name: "Philippine languages"
}, {
alpha2: "",
alpha3: "phn",
bibliographic: "",
name: "Phoenician"
}, {
alpha2: "pi",
alpha3: "pli",
bibliographic: "",
name: "Pali"
}, {
alpha2: "pl",
alpha3: "pol",
bibliographic: "",
name: "Polish"
}, {
alpha2: "",
alpha3: "pon",
bibliographic: "",
name: "Pohnpeian"
}, {
alpha2: "pt",
alpha3: "por",
bibliographic: "",
name: "Portuguese"
}, {
alpha2: "",
alpha3: "pra",
bibliographic: "",
name: "Prakrit languages"
}, {
alpha2: "",
alpha3: "pro",
bibliographic: "",
name: "Occitan, Old (to 1500)"
}, {
alpha2: "",
alpha3: "pro",
bibliographic: "",
name: "Provençal, Old (to 1500)"
}, {
alpha2: "ps",
alpha3: "pus",
bibliographic: "",
name: "Pashto"
}, {
alpha2: "ps",
alpha3: "pus",
bibliographic: "",
name: "Pushto"
}, {
alpha2: "qu",
alpha3: "que",
bibliographic: "",
name: "Quechua"
}, {
alpha2: "",
alpha3: "raj",
bibliographic: "",
name: "Rajasthani"
}, {
alpha2: "",
alpha3: "rap",
bibliographic: "",
name: "Rapanui"
}, {
alpha2: "",
alpha3: "rar",
bibliographic: "",
name: "Cook Islands Maori"
}, {
alpha2: "",
alpha3: "rar",
bibliographic: "",
name: "Rarotongan"
}, {
alpha2: "",
alpha3: "roa",
bibliographic: "",
name: "Romance languages"
}, {
alpha2: "rm",
alpha3: "roh",
bibliographic: "",
name: "Romansh"
}, {
alpha2: "",
alpha3: "rom",
bibliographic: "",
name: "Romany"
}, {
alpha2: "ro",
alpha3: "ron",
bibliographic: "rum",
name: "Moldavian"
}, {
alpha2: "ro",
alpha3: "ron",
bibliographic: "rum",
name: "Romanian"
}, {
alpha2: "rn",
alpha3: "run",
bibliographic: "",
name: "Rundi"
}, {
alpha2: "",
alpha3: "rup",
bibliographic: "",
name: "Aromanian"
}, {
alpha2: "",
alpha3: "rup",
bibliographic: "",
name: "Arumanian"
}, {
alpha2: "",
alpha3: "rup",
bibliographic: "",
name: "Macedo-Romanian"
}, {
alpha2: "ru",
alpha3: "rus",
bibliographic: "",
name: "Russian"
}, {
alpha2: "",
alpha3: "sad",
bibliographic: "",
name: "Sandawe"
}, {
alpha2: "sg",
alpha3: "sag",
bibliographic: "",
name: "Sango"
}, {
alpha2: "",
alpha3: "sah",
bibliographic: "",
name: "Yakut"
}, {
alpha2: "",
alpha3: "sai",
bibliographic: "",
name: "South American Indian languages"
}, {
alpha2: "",
alpha3: "sal",
bibliographic: "",
name: "Salishan languages"
}, {
alpha2: "",
alpha3: "sam",
bibliographic: "",
name: "Samaritan Aramaic"
}, {
alpha2: "sa",
alpha3: "san",
bibliographic: "",
name: "Sanskrit"
}, {
alpha2: "",
alpha3: "sas",
bibliographic: "",
name: "Sasak"
}, {
alpha2: "",
alpha3: "sat",
bibliographic: "",
name: "Santali"
}, {
alpha2: "",
alpha3: "scn",
bibliographic: "",
name: "Sicilian"
}, {
alpha2: "",
alpha3: "sco",
bibliographic: "",
name: "Scots"
}, {
alpha2: "",
alpha3: "sel",
bibliographic: "",
name: "Selkup"
}, {
alpha2: "",
alpha3: "sem",
bibliographic: "",
name: "Semitic languages"
}, {
alpha2: "",
alpha3: "sga",
bibliographic: "",
name: "Irish, Old (to 900)"
}, {
alpha2: "",
alpha3: "sgn",
bibliographic: "",
name: "Sign Languages"
}, {
alpha2: "",
alpha3: "shn",
bibliographic: "",
name: "Shan"
}, {
alpha2: "",
alpha3: "sid",
bibliographic: "",
name: "Sidamo"
}, {
alpha2: "si",
alpha3: "sin",
bibliographic: "",
name: "Sinhala"
}, {
alpha2: "si",
alpha3: "sin",
bibliographic: "",
name: "Sinhalese"
}, {
alpha2: "",
alpha3: "sio",
bibliographic: "",
name: "Siouan languages"
}, {
alpha2: "",
alpha3: "sit",
bibliographic: "",
name: "Sino-Tibetan languages"
}, {
alpha2: "",
alpha3: "sla",
bibliographic: "",
name: "Slavic languages"
}, {
alpha2: "sk",
alpha3: "slk",
bibliographic: "slo",
name: "Slovak"
}, {
alpha2: "sl",
alpha3: "slv",
bibliographic: "",
name: "Slovenian"
}, {
alpha2: "",
alpha3: "sma",
bibliographic: "",
name: "Southern Sami"
}, {
alpha2: "se",
alpha3: "sme",
bibliographic: "",
name: "Northern Sami"
}, {
alpha2: "",
alpha3: "smi",
bibliographic: "",
name: "Sami languages"
}, {
alpha2: "",
alpha3: "smj",
bibliographic: "",
name: "Lule Sami"
}, {
alpha2: "",
alpha3: "smn",
bibliographic: "",
name: "Inari Sami"
}, {
alpha2: "sm",
alpha3: "smo",
bibliographic: "",
name: "Samoan"
}, {
alpha2: "",
alpha3: "sms",
bibliographic: "",
name: "Skolt Sami"
}, {
alpha2: "sn",
alpha3: "sna",
bibliographic: "",
name: "Shona"
}, {
alpha2: "sd",
alpha3: "snd",
bibliographic: "",
name: "Sindhi"
}, {
alpha2: "",
alpha3: "snk",
bibliographic: "",
name: "Soninke"
}, {
alpha2: "",
alpha3: "sog",
bibliographic: "",
name: "Sogdian"
}, {
alpha2: "so",
alpha3: "som",
bibliographic: "",
name: "Somali"
}, {
alpha2: "",
alpha3: "son",
bibliographic: "",
name: "Songhai languages"
}, {
alpha2: "st",
alpha3: "sot",
bibliographic: "",
name: "Sotho, Southern"
}, {
alpha2: "es",
alpha3: "spa",
bibliographic: "",
name: "Castilian"
}, {
alpha2: "es",
alpha3: "spa",
bibliographic: "",
name: "Spanish"
}, {
alpha2: "sq",
alpha3: "sqi",
bibliographic: "alb",
name: "Albanian"
}, {
alpha2: "sc",
alpha3: "srd",
bibliographic: "",
name: "Sardinian"
}, {
alpha2: "",
alpha3: "srn",
bibliographic: "",
name: "Sranan Tongo"
}, {
alpha2: "sr",
alpha3: "srp",
bibliographic: "",
name: "Serbian"
}, {
alpha2: "",
alpha3: "srr",
bibliographic: "",
name: "Serer"
}, {
alpha2: "",
alpha3: "ssa",
bibliographic: "",
name: "Nilo-Saharan languages"
}, {
alpha2: "ss",
alpha3: "ssw",
bibliographic: "",
name: "Swati"
}, {
alpha2: "",
alpha3: "suk",
bibliographic: "",
name: "Sukuma"
}, {
alpha2: "su",
alpha3: "sun",
bibliographic: "",
name: "Sundanese"
}, {
alpha2: "",
alpha3: "sus",
bibliographic: "",
name: "Susu"
}, {
alpha2: "",
alpha3: "sux",
bibliographic: "",
name: "Sumerian"
}, {
alpha2: "sw",
alpha3: "swa",
bibliographic: "",
name: "Swahili"
}, {
alpha2: "sv",
alpha3: "swe",
bibliographic: "",
name: "Swedish"
}, {
alpha2: "",
alpha3: "syc",
bibliographic: "",
name: "Classical Syriac"
}, {
alpha2: "",
alpha3: "syr",
bibliographic: "",
name: "Syriac"
}, {
alpha2: "ty",
alpha3: "tah",
bibliographic: "",
name: "Tahitian"
}, {
alpha2: "",
alpha3: "tai",
bibliographic: "",
name: "Tai languages"
}, {
alpha2: "ta",
alpha3: "tam",
bibliographic: "",
name: "Tamil"
}, {
alpha2: "tt",
alpha3: "tat",
bibliographic: "",
name: "Tatar"
}, {
alpha2: "te",
alpha3: "tel",
bibliographic: "",
name: "Telugu"
}, {
alpha2: "",
alpha3: "tem",
bibliographic: "",
name: "Timne"
}, {
alpha2: "",
alpha3: "ter",
bibliographic: "",
name: "Tereno"
}, {
alpha2: "",
alpha3: "tet",
bibliographic: "",
name: "Tetum"
}, {
alpha2: "tg",
alpha3: "tgk",
bibliographic: "",
name: "Tajik"
}, {
alpha2: "tl",
alpha3: "tgl",
bibliographic: "",
name: "Tagalog"
}, {
alpha2: "th",
alpha3: "tha",
bibliographic: "",
name: "Thai"
}, {
alpha2: "",
alpha3: "tig",
bibliographic: "",
name: "Tigre"
}, {
alpha2: "ti",
alpha3: "tir",
bibliographic: "",
name: "Tigrinya"
}, {
alpha2: "",
alpha3: "tiv",
bibliographic: "",
name: "Tiv"
}, {
alpha2: "",
alpha3: "tkl",
bibliographic: "",
name: "Tokelau"
}, {
alpha2: "",
alpha3: "tlh",
bibliographic: "",
name: "Klingon"
}, {
alpha2: "",
alpha3: "tlh",
bibliographic: "",
name: "tlhIngan-Hol"
}, {
alpha2: "",
alpha3: "tli",
bibliographic: "",
name: "Tlingit"
}, {
alpha2: "",
alpha3: "tmh",
bibliographic: "",
name: "Tamashek"
}, {
alpha2: "",
alpha3: "tog",
bibliographic: "",
name: "Tonga (Nyasa)"
}, {
alpha2: "to",
alpha3: "ton",
bibliographic: "",
name: "Tonga (Tonga Islands)"
}, {
alpha2: "",
alpha3: "tpi",
bibliographic: "",
name: "Tok Pisin"
}, {
alpha2: "",
alpha3: "tsi",
bibliographic: "",
name: "Tsimshian"
}, {
alpha2: "tn",
alpha3: "tsn",
bibliographic: "",
name: "Tswana"
}, {
alpha2: "ts",
alpha3: "tso",
bibliographic: "",
name: "Tsonga"
}, {
alpha2: "tk",
alpha3: "tuk",
bibliographic: "",
name: "Turkmen"
}, {
alpha2: "",
alpha3: "tum",
bibliographic: "",
name: "Tumbuka"
}, {
alpha2: "",
alpha3: "tup",
bibliographic: "",
name: "Tupi languages"
}, {
alpha2: "tr",
alpha3: "tur",
bibliographic: "",
name: "Turkish"
}, {
alpha2: "",
alpha3: "tut",
bibliographic: "",
name: "Altaic languages"
}, {
alpha2: "",
alpha3: "tvl",
bibliographic: "",
name: "Tuvalu"
}, {
alpha2: "tw",
alpha3: "twi",
bibliographic: "",
name: "Twi"
}, {
alpha2: "",
alpha3: "tyv",
bibliographic: "",
name: "Tuvinian"
}, {
alpha2: "",
alpha3: "udm",
bibliographic: "",
name: "Udmurt"
}, {
alpha2: "",
alpha3: "uga",
bibliographic: "",
name: "Ugaritic"
}, {
alpha2: "ug",
alpha3: "uig",
bibliographic: "",
name: "Uighur"
}, {
alpha2: "ug",
alpha3: "uig",
bibliographic: "",
name: "Uyghur"
}, {
alpha2: "uk",
alpha3: "ukr",
bibliographic: "",
name: "Ukrainian"
}, {
alpha2: "",
alpha3: "umb",
bibliographic: "",
name: "Umbundu"
}, {
alpha2: "",
alpha3: "und",
bibliographic: "",
name: "Undetermined"
}, {
alpha2: "ur",
alpha3: "urd",
bibliographic: "",
name: "Urdu"
}, {
alpha2: "uz",
alpha3: "uzb",
bibliographic: "",
name: "Uzbek"
}, {
alpha2: "",
alpha3: "vai",
bibliographic: "",
name: "Vai"
}, {
alpha2: "ve",
alpha3: "ven",
bibliographic: "",
name: "Venda"
}, {
alpha2: "vi",
alpha3: "vie",
bibliographic: "",
name: "Vietnamese"
}, {
alpha2: "vo",
alpha3: "vol",
bibliographic: "",
name: "Volapük"
}, {
alpha2: "",
alpha3: "vot",
bibliographic: "",
name: "Votic"
}, {
alpha2: "",
alpha3: "wak",
bibliographic: "",
name: "Wakashan languages"
}, {
alpha2: "",
alpha3: "wal",
bibliographic: "",
name: "Wolaitta"
}, {
alpha2: "",
alpha3: "wal",
bibliographic: "",
name: "Wolaytta"
}, {
alpha2: "",
alpha3: "war",
bibliographic: "",
name: "Waray"
}, {
alpha2: "",
alpha3: "was",
bibliographic: "",
name: "Washo"
}, {
alpha2: "",
alpha3: "wen",
bibliographic: "",
name: "Sorbian languages"
}, {
alpha2: "wa",
alpha3: "wln",
bibliographic: "",
name: "Walloon"
}, {
alpha2: "wo",
alpha3: "wol",
bibliographic: "",
name: "Wolof"
}, {
alpha2: "",
alpha3: "xal",
bibliographic: "",
name: "Kalmyk"
}, {
alpha2: "",
alpha3: "xal",
bibliographic: "",
name: "Oirat"
}, {
alpha2: "xh",
alpha3: "xho",
bibliographic: "",
name: "Xhosa"
}, {
alpha2: "",
alpha3: "yao",
bibliographic: "",
name: "Yao"
}, {
alpha2: "",
alpha3: "yap",
bibliographic: "",
name: "Yapese"
}, {
alpha2: "yi",
alpha3: "yid",
bibliographic: "",
name: "Yiddish"
}, {
alpha2: "yo",
alpha3: "yor",
bibliographic: "",
name: "Yoruba"
}, {
alpha2: "",
alpha3: "ypk",
bibliographic: "",
name: "Yupik languages"
}, {
alpha2: "",
alpha3: "zap",
bibliographic: "",
name: "Zapotec"
}, {
alpha2: "",
alpha3: "zbl",
bibliographic: "",
name: "Bliss"
}, {
alpha2: "",
alpha3: "zbl",
bibliographic: "",
name: "Blissymbolics"
}, {
alpha2: "",
alpha3: "zbl",
bibliographic: "",
name: "Blissymbols"
}, {
alpha2: "",
alpha3: "zen",
bibliographic: "",
name: "Zenaga"
}, {
alpha2: "",
alpha3: "zgh",
bibliographic: "",
name: "Standard Moroccan Tamazight"
}, {
alpha2: "za",
alpha3: "zha",
bibliographic: "",
name: "Chuang"
}, {
alpha2: "za",
alpha3: "zha",
bibliographic: "",
name: "Zhuang"
}, {
alpha2: "zh",
alpha3: "zho",
bibliographic: "chi",
name: "Chinese"
}, {
alpha2: "",
alpha3: "znd",
bibliographic: "",
name: "Zande languages"
}, {
alpha2: "zu",
alpha3: "zul",
bibliographic: "",
name: "Zulu"
}, {
alpha2: "",
alpha3: "zun",
bibliographic: "",
name: "Zuni"
}, {
alpha2: "",
alpha3: "zxx",
bibliographic: "",
name: "No linguistic content"
}, {
alpha2: "",
alpha3: "zxx",
bibliographic: "",
name: "Not applicable"
}, {
alpha2: "",
alpha3: "zza",
bibliographic: "",
name: "Dimili"
}, {
alpha2: "",
alpha3: "zza",
bibliographic: "",
name: "Dimli"
}, {
alpha2: "",
alpha3: "zza",
bibliographic: "",
name: "Kirdki"
}, {
alpha2: "",
alpha3: "zza",
bibliographic: "",
name: "Kirmanjki"
}, {
alpha2: "",
alpha3: "zza",
bibliographic: "",
name: "Zaza"
}, {
alpha2: "",
alpha3: "zza",
bibliographic: "",
name: "Zazaki"
} ];
}, , function(module, exports) {
module.exports = [ "Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers", "Africa/Asmara", "Africa/Bamako", "Africa/Bangui", "Africa/Banjul", "Africa/Bissau", "Africa/Blantyre", "Africa/Brazzaville", "Africa/Bujumbura", "Africa/Cairo", "Africa/Casablanca", "Africa/Ceuta", "Africa/Conakry", "Africa/Dakar", "Africa/Dar_es_Salaam", "Africa/Djibouti", "Africa/Douala", "Africa/El_Aaiun", "Africa/Freetown", "Africa/Gaborone", "Africa/Harare", "Africa/Johannesburg", "Africa/Juba", "Africa/Kampala", "Africa/Khartoum", "Africa/Kigali", "Africa/Kinshasa", "Africa/Lagos", "Africa/Libreville", "Africa/Lome", "Africa/Luanda", "Africa/Lubumbashi", "Africa/Lusaka", "Africa/Malabo", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane", "Africa/Mogadishu", "Africa/Monrovia", "Africa/Nairobi", "Africa/Ndjamena", "Africa/Niamey", "Africa/Nouakchott", "Africa/Ouagadougou", "Africa/Porto-Novo", "Africa/Sao_Tome", "Africa/Tripoli", "Africa/Tunis", "Africa/Windhoek", "America/Adak", "America/Anchorage", "America/Anguilla", "America/Antigua", "America/Araguaina", "America/Argentina/Buenos_Aires", "America/Argentina/Catamarca", "America/Argentina/Cordoba", "America/Argentina/Jujuy", "America/Argentina/La_Rioja", "America/Argentina/Mendoza", "America/Argentina/Rio_Gallegos", "America/Argentina/Salta", "America/Argentina/San_Juan", "America/Argentina/San_Luis", "America/Argentina/Tucuman", "America/Argentina/Ushuaia", "America/Aruba", "America/Asuncion", "America/Atikokan", "America/Bahia", "America/Bahia_Banderas", "America/Barbados", "America/Belem", "America/Belize", "America/Blanc-Sablon", "America/Boa_Vista", "America/Bogota", "America/Boise", "America/Cambridge_Bay", "America/Campo_Grande", "America/Cancun", "America/Caracas", "America/Cayenne", "America/Cayman", "America/Chicago", "America/Chihuahua", "America/Costa_Rica", "America/Creston", "America/Cuiaba", "America/Curacao", "America/Danmarkshavn", "America/Dawson", "America/Dawson_Creek", "America/Denver", "America/Detroit", "America/Dominica", "America/Edmonton", "America/Eirunepe", "America/El_Salvador", "America/Fort_Nelson", "America/Fortaleza", "America/Glace_Bay", "America/Godthab", "America/Goose_Bay", "America/Grand_Turk", "America/Grenada", "America/Guadeloupe", "America/Guatemala", "America/Guayaquil", "America/Guyana", "America/Halifax", "America/Havana", "America/Hermosillo", "America/Indiana/Indianapolis", "America/Indiana/Knox", "America/Indiana/Marengo", "America/Indiana/Petersburg", "America/Indiana/Tell_City", "America/Indiana/Vevay", "America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Inuvik", "America/Iqaluit", "America/Jamaica", "America/Juneau", "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/Kralendijk", "America/La_Paz", "America/Lima", "America/Los_Angeles", "America/Lower_Princes", "America/Maceio", "America/Managua", "America/Manaus", "America/Marigot", "America/Martinique", "America/Matamoros", "America/Mazatlan", "America/Menominee", "America/Merida", "America/Metlakatla", "America/Mexico_City", "America/Miquelon", "America/Moncton", "America/Monterrey", "America/Montevideo", "America/Montserrat", "America/Nassau", "America/New_York", "America/Nipigon", "America/Nome", "America/Noronha", "America/North_Dakota/Beulah", "America/North_Dakota/Center", "America/North_Dakota/New_Salem", "America/Ojinaga", "America/Panama", "America/Pangnirtung", "America/Paramaribo", "America/Phoenix", "America/Port-au-Prince", "America/Port_of_Spain", "America/Porto_Velho", "America/Puerto_Rico", "America/Rainy_River", "America/Rankin_Inlet", "America/Recife", "America/Regina", "America/Resolute", "America/Rio_Branco", "America/Santa_Isabel", "America/Santarem", "America/Santiago", "America/Santo_Domingo", "America/Sao_Paulo", "America/Scoresbysund", "America/Sitka", "America/St_Barthelemy", "America/St_Johns", "America/St_Kitts", "America/St_Lucia", "America/St_Thomas", "America/St_Vincent", "America/Swift_Current", "America/Tegucigalpa", "America/Thule", "America/Thunder_Bay", "America/Tijuana", "America/Toronto", "America/Tortola", "America/Vancouver", "America/Whitehorse", "America/Winnipeg", "America/Yakutat", "America/Yellowknife", "Antarctica/Casey", "Antarctica/Davis", "Antarctica/DumontDUrville", "Antarctica/Macquarie", "Antarctica/Mawson", "Antarctica/McMurdo", "Antarctica/Palmer", "Antarctica/Rothera", "Antarctica/Syowa", "Antarctica/Troll", "Antarctica/Vostok", "Arctic/Longyearbyen", "Asia/Aden", "Asia/Almaty", "Asia/Amman", "Asia/Anadyr", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Baghdad", "Asia/Bahrain", "Asia/Baku", "Asia/Bangkok", "Asia/Beirut", "Asia/Bishkek", "Asia/Brunei", "Asia/Chita", "Asia/Choibalsan", "Asia/Colombo", "Asia/Damascus", "Asia/Dhaka", "Asia/Dili", "Asia/Dubai", "Asia/Dushanbe", "Asia/Gaza", "Asia/Hebron", "Asia/Ho_Chi_Minh", "Asia/Hong_Kong", "Asia/Hovd", "Asia/Irkutsk", "Asia/Jakarta", "Asia/Jayapura", "Asia/Jerusalem", "Asia/Kabul", "Asia/Kamchatka", "Asia/Karachi", "Asia/Kathmandu", "Asia/Khandyga", "Asia/Kolkata", "Asia/Krasnoyarsk", "Asia/Kuala_Lumpur", "Asia/Kuching", "Asia/Kuwait", "Asia/Macau", "Asia/Magadan", "Asia/Makassar", "Asia/Manila", "Asia/Muscat", "Asia/Nicosia", "Asia/Novokuznetsk", "Asia/Novosibirsk", "Asia/Omsk", "Asia/Oral", "Asia/Phnom_Penh", "Asia/Pontianak", "Asia/Pyongyang", "Asia/Qatar", "Asia/Qyzylorda", "Asia/Rangoon", "Asia/Riyadh", "Asia/Sakhalin", "Asia/Samarkand", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Srednekolymsk", "Asia/Taipei", "Asia/Tashkent", "Asia/Tbilisi", "Asia/Tehran", "Asia/Thimphu", "Asia/Tokyo", "Asia/Ulaanbaatar", "Asia/Urumqi", "Asia/Ust-Nera", "Asia/Vientiane", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yekaterinburg", "Asia/Yerevan", "Atlantic/Azores", "Atlantic/Bermuda", "Atlantic/Canary", "Atlantic/Cape_Verde", "Atlantic/Faroe", "Atlantic/Madeira", "Atlantic/Reykjavik", "Atlantic/South_Georgia", "Atlantic/St_Helena", "Atlantic/Stanley", "Australia/Adelaide", "Australia/Brisbane", "Australia/Broken_Hill", "Australia/Currie", "Australia/Darwin", "Australia/Eucla", "Australia/Hobart", "Australia/Lindeman", "Australia/Lord_Howe", "Australia/Melbourne", "Australia/Perth", "Australia/Sydney", "Canada/Atlantic", "Canada/Central", "Canada/Eastern", "Canada/Mountain", "Canada/Newfoundland", "Canada/Pacific", "Europe/Amsterdam", "Europe/Andorra", "Europe/Athens", "Europe/Belgrade", "Europe/Berlin", "Europe/Bratislava", "Europe/Brussels", "Europe/Bucharest", "Europe/Budapest", "Europe/Busingen", "Europe/Chisinau", "Europe/Copenhagen", "Europe/Dublin", "Europe/Gibraltar", "Europe/Guernsey", "Europe/Helsinki", "Europe/Isle_of_Man", "Europe/Istanbul", "Europe/Jersey", "Europe/Kaliningrad", "Europe/Kiev", "Europe/Lisbon", "Europe/Ljubljana", "Europe/London", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Mariehamn", "Europe/Minsk", "Europe/Monaco", "Europe/Moscow", "Europe/Oslo", "Europe/Paris", "Europe/Podgorica", "Europe/Prague", "Europe/Riga", "Europe/Rome", "Europe/Samara", "Europe/San_Marino", "Europe/Sarajevo", "Europe/Simferopol", "Europe/Skopje", "Europe/Sofia", "Europe/Stockholm", "Europe/Tallinn", "Europe/Tirane", "Europe/Uzhgorod", "Europe/Vaduz", "Europe/Vatican", "Europe/Vienna", "Europe/Vilnius", "Europe/Volgograd", "Europe/Warsaw", "Europe/Zagreb", "Europe/Zaporozhye", "Europe/Zurich", "GMT", "Indian/Antananarivo", "Indian/Chagos", "Indian/Christmas", "Indian/Cocos", "Indian/Comoro", "Indian/Kerguelen", "Indian/Mahe", "Indian/Maldives", "Indian/Mauritius", "Indian/Mayotte", "Indian/Reunion", "Pacific/Apia", "Pacific/Auckland", "Pacific/Bougainville", "Pacific/Chatham", "Pacific/Chuuk", "Pacific/Easter", "Pacific/Efate", "Pacific/Enderbury", "Pacific/Fakaofo", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Galapagos", "Pacific/Gambier", "Pacific/Guadalcanal", "Pacific/Guam", "Pacific/Honolulu", "Pacific/Johnston", "Pacific/Kiritimati", "Pacific/Kosrae", "Pacific/Kwajalein", "Pacific/Majuro", "Pacific/Marquesas", "Pacific/Midway", "Pacific/Nauru", "Pacific/Niue", "Pacific/Norfolk", "Pacific/Noumea", "Pacific/Pago_Pago", "Pacific/Palau", "Pacific/Pitcairn", "Pacific/Pohnpei", "Pacific/Port_Moresby", "Pacific/Rarotonga", "Pacific/Saipan", "Pacific/Tahiti", "Pacific/Tarawa", "Pacific/Tongatapu", "Pacific/Wake", "Pacific/Wallis", "US/Alaska", "US/Arizona", "US/Central", "US/Eastern", "US/Hawaii", "US/Mountain", "US/Pacific", "UTC" ];
}, , function(module, exports, __webpack_require__) {
var __WEBPACK_AMD_DEFINE_RESULT__;
(function(module, global) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
var _keys = __webpack_require__(910), _keys2 = _interopRequireDefault(_keys), _create = __webpack_require__(400), _create2 = _interopRequireDefault(_create), _getOwnPropertySymbols = __webpack_require__(909), _getOwnPropertySymbols2 = _interopRequireDefault(_getOwnPropertySymbols), _getPrototypeOf = __webpack_require__(131), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _typeof2 = __webpack_require__(265), _typeof3 = _interopRequireDefault(_typeof2);
(function() {
function addMapEntry(map, pair) {
return map.set(pair[0], pair[1]), map;
}
function addSetEntry(set, value) {
return set.add(value), set;
}
function arrayEach(array, iteratee) {
for (var index = -1, length = array.length; ++index < length && iteratee(array[index], index, array) !== !1; ) ;
return array;
}
function arrayMap(array, iteratee) {
for (var index = -1, length = array.length, result = Array(length); ++index < length; ) result[index] = iteratee(array[index], index, array);
return result;
}
function arrayReduce(array, iteratee, accumulator, initAccum) {
var index = -1, length = array.length;
for (initAccum && length && (accumulator = array[++index]); ++index < length; ) accumulator = iteratee(accumulator, array[index], index, array);
return accumulator;
}
function arraySome(array, predicate) {
for (var index = -1, length = array.length; ++index < length; ) if (predicate(array[index], index, array)) return !0;
return !1;
}
function baseIndexOf(array, value, fromIndex) {
if (value !== value) return indexOfNaN(array, fromIndex);
for (var index = fromIndex - 1, length = array.length; ++index < length; ) if (array[index] === value) return index;
return -1;
}
function baseTimes(n, iteratee) {
for (var index = -1, result = Array(n); ++index < n; ) result[index] = iteratee(index);
return result;
}
function baseToPairs(object, props) {
return arrayMap(props, function(key) {
return [ key, object[key] ];
});
}
function charsStartIndex(strSymbols, chrSymbols) {
for (var index = -1, length = strSymbols.length; ++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1; ) ;
return index;
}
function charsEndIndex(strSymbols, chrSymbols) {
for (var index = strSymbols.length; index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1; ) ;
return index;
}
function checkGlobal(value) {
return value && value.Object === Object ? value : null;
}
function indexOfNaN(array, fromIndex, fromRight) {
for (var length = array.length, index = fromIndex + (fromRight ? 0 : -1); fromRight ? index-- : ++index < length; ) {
var other = array[index];
if (other !== other) return index;
}
return -1;
}
function isHostObject(value) {
var result = !1;
if (null != value && "function" != typeof value.toString) try {
result = !!(value + "");
} catch (e) {}
return result;
}
function isIndex(value, length) {
return value = "number" == typeof value || reIsUint.test(value) ? +value : -1, length = null == length ? MAX_SAFE_INTEGER : length, 
value > -1 && value % 1 == 0 && value < length;
}
function mapToArray(map) {
var index = -1, result = Array(map.size);
return map.forEach(function(value, key) {
result[++index] = [ key, value ];
}), result;
}
function setToArray(set) {
var index = -1, result = Array(set.size);
return set.forEach(function(value) {
result[++index] = value;
}), result;
}
function stringToArray(string) {
return string.match(reComplexSymbol);
}
function lodash() {}
function Hash() {}
function hashDelete(hash, key) {
return hashHas(hash, key) && delete hash[key];
}
function hashGet(hash, key) {
if (nativeCreate) {
var result = hash[key];
return result === HASH_UNDEFINED ? undefined : result;
}
return hasOwnProperty.call(hash, key) ? hash[key] : undefined;
}
function hashHas(hash, key) {
return nativeCreate ? hash[key] !== undefined : hasOwnProperty.call(hash, key);
}
function hashSet(hash, key, value) {
hash[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
}
function MapCache(values) {
var index = -1, length = values ? values.length : 0;
for (this.clear(); ++index < length; ) {
var entry = values[index];
this.set(entry[0], entry[1]);
}
}
function mapClear() {
this.__data__ = {
hash: new Hash(),
map: Map ? new Map() : [],
string: new Hash()
};
}
function mapDelete(key) {
var data = this.__data__;
return isKeyable(key) ? hashDelete("string" == typeof key ? data.string : data.hash, key) : Map ? data.map.delete(key) : assocDelete(data.map, key);
}
function mapGet(key) {
var data = this.__data__;
return isKeyable(key) ? hashGet("string" == typeof key ? data.string : data.hash, key) : Map ? data.map.get(key) : assocGet(data.map, key);
}
function mapHas(key) {
var data = this.__data__;
return isKeyable(key) ? hashHas("string" == typeof key ? data.string : data.hash, key) : Map ? data.map.has(key) : assocHas(data.map, key);
}
function mapSet(key, value) {
var data = this.__data__;
return isKeyable(key) ? hashSet("string" == typeof key ? data.string : data.hash, key, value) : Map ? data.map.set(key, value) : assocSet(data.map, key, value), 
this;
}
function Stack(values) {
var index = -1, length = values ? values.length : 0;
for (this.clear(); ++index < length; ) {
var entry = values[index];
this.set(entry[0], entry[1]);
}
}
function stackClear() {
this.__data__ = {
array: [],
map: null
};
}
function stackDelete(key) {
var data = this.__data__, array = data.array;
return array ? assocDelete(array, key) : data.map.delete(key);
}
function stackGet(key) {
var data = this.__data__, array = data.array;
return array ? assocGet(array, key) : data.map.get(key);
}
function stackHas(key) {
var data = this.__data__, array = data.array;
return array ? assocHas(array, key) : data.map.has(key);
}
function stackSet(key, value) {
var data = this.__data__, array = data.array;
array && (array.length < LARGE_ARRAY_SIZE - 1 ? assocSet(array, key, value) : (data.array = null, 
data.map = new MapCache(array)));
var map = data.map;
return map && map.set(key, value), this;
}
function assocDelete(array, key) {
var index = assocIndexOf(array, key);
if (index < 0) return !1;
var lastIndex = array.length - 1;
return index == lastIndex ? array.pop() : splice.call(array, index, 1), !0;
}
function assocGet(array, key) {
var index = assocIndexOf(array, key);
return index < 0 ? undefined : array[index][1];
}
function assocHas(array, key) {
return assocIndexOf(array, key) > -1;
}
function assocIndexOf(array, key) {
for (var length = array.length; length--; ) if (eq(array[length][0], key)) return length;
return -1;
}
function assocSet(array, key, value) {
var index = assocIndexOf(array, key);
index < 0 ? array.push([ key, value ]) : array[index][1] = value;
}
function assignValue(object, key, value) {
var objValue = object[key];
hasOwnProperty.call(object, key) && eq(objValue, value) && (value !== undefined || key in object) || (object[key] = value);
}
function baseAssign(object, source) {
return object && copyObject(source, keys(source), object);
}
function baseCastPath(value) {
return isArray(value) ? value : stringToPath(value);
}
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
var result;
if (customizer && (result = object ? customizer(value, key, object, stack) : customizer(value)), 
result !== undefined) return result;
if (!isObject(value)) return value;
var isArr = isArray(value);
if (isArr) {
if (result = initCloneArray(value), !isDeep) return copyArray(value, result);
} else {
var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
if (isBuffer(value)) return cloneBuffer(value, isDeep);
if (tag == objectTag || tag == argsTag || isFunc && !object) {
if (isHostObject(value)) return object ? value : {};
if (result = initCloneObject(isFunc ? {} : value), !isDeep) return result = baseAssign(result, value), 
isFull ? copySymbols(value, result) : result;
} else {
if (!cloneableTags[tag]) return object ? value : {};
result = initCloneByTag(value, tag, isDeep);
}
}
stack || (stack = new Stack());
var stacked = stack.get(value);
return stacked ? stacked : (stack.set(value, result), (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
}), isFull && !isArr ? copySymbols(value, result) : result);
}
function baseCreate(proto) {
return isObject(proto) ? objectCreate(proto) : {};
}
function baseForOwn(object, iteratee) {
return object && baseFor(object, iteratee, keys);
}
function baseGet(object, path) {
path = isKey(path, object) ? [ path + "" ] : baseCastPath(path);
for (var index = 0, length = path.length; null != object && index < length; ) object = object[path[index++]];
return index && index == length ? object : undefined;
}
function baseHas(object, key) {
return hasOwnProperty.call(object, key) || "object" == ("undefined" == typeof object ? "undefined" : (0, 
_typeof3.default)(object)) && key in object && null === getPrototypeOf(object);
}
function baseHasIn(object, key) {
return key in Object(object);
}
function baseIsEqual(value, other, customizer, bitmask, stack) {
return value === other || (null == value || null == other || !isObject(value) && !isObjectLike(other) ? value !== value && other !== other : baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack));
}
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
var objIsArr = isArray(object), othIsArr = isArray(other), objTag = arrayTag, othTag = arrayTag;
objIsArr || (objTag = getTag(object), objTag = objTag == argsTag ? objectTag : objTag), 
othIsArr || (othTag = getTag(other), othTag = othTag == argsTag ? objectTag : othTag);
var objIsObj = objTag == objectTag && !isHostObject(object), othIsObj = othTag == objectTag && !isHostObject(other), isSameTag = objTag == othTag;
if (isSameTag && !objIsObj) return stack || (stack = new Stack()), objIsArr || isTypedArray(object) ? equalArrays(object, other, equalFunc, customizer, bitmask, stack) : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
if (objIsWrapped || othIsWrapped) return stack || (stack = new Stack()), equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, bitmask, stack);
}
return !!isSameTag && (stack || (stack = new Stack()), equalObjects(object, other, equalFunc, customizer, bitmask, stack));
}
function baseIsMatch(object, source, matchData, customizer) {
var index = matchData.length, length = index, noCustomizer = !customizer;
if (null == object) return !length;
for (object = Object(object); index--; ) {
var data = matchData[index];
if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) return !1;
}
for (;++index < length; ) {
data = matchData[index];
var key = data[0], objValue = object[key], srcValue = data[1];
if (noCustomizer && data[2]) {
if (objValue === undefined && !(key in object)) return !1;
} else {
var stack = new Stack(), result = customizer ? customizer(objValue, srcValue, key, object, source, stack) : undefined;
if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack) : result)) return !1;
}
}
return !0;
}
function baseIteratee(value) {
var type = "undefined" == typeof value ? "undefined" : (0, _typeof3.default)(value);
return "function" == type ? value : null == value ? identity : "object" == type ? isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value) : property(value);
}
function baseKeys(object) {
return nativeKeys(Object(object));
}
function baseMap(collection, iteratee) {
var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
return baseEach(collection, function(value, key, collection) {
result[++index] = iteratee(value, key, collection);
}), result;
}
function baseMatches(source) {
var matchData = getMatchData(source);
if (1 == matchData.length && matchData[0][2]) {
var key = matchData[0][0], value = matchData[0][1];
return function(object) {
return null != object && (object[key] === value && (value !== undefined || key in Object(object)));
};
}
return function(object) {
return object === source || baseIsMatch(object, source, matchData);
};
}
function baseMatchesProperty(path, srcValue) {
return function(object) {
var objValue = get(object, path);
return objValue === undefined && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
};
}
function baseProperty(key) {
return function(object) {
return null == object ? undefined : object[key];
};
}
function basePropertyDeep(path) {
return function(object) {
return baseGet(object, path);
};
}
function baseSlice(array, start, end) {
var index = -1, length = array.length;
start < 0 && (start = -start > length ? 0 : length + start), end = end > length ? length : end, 
end < 0 && (end += length), length = start > end ? 0 : end - start >>> 0, start >>>= 0;
for (var result = Array(length); ++index < length; ) result[index] = array[index + start];
return result;
}
function cloneBuffer(buffer, isDeep) {
if (isDeep) return buffer.slice();
var result = new buffer.constructor(buffer.length);
return buffer.copy(result), result;
}
function cloneArrayBuffer(arrayBuffer) {
var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
return new Uint8Array(result).set(new Uint8Array(arrayBuffer)), result;
}
function cloneMap(map) {
return arrayReduce(mapToArray(map), addMapEntry, new map.constructor());
}
function cloneRegExp(regexp) {
var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
return result.lastIndex = regexp.lastIndex, result;
}
function cloneSet(set) {
return arrayReduce(setToArray(set), addSetEntry, new set.constructor());
}
function cloneSymbol(symbol) {
return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}
function cloneTypedArray(typedArray, isDeep) {
var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
function copyArray(source, array) {
var index = -1, length = source.length;
for (array || (array = Array(length)); ++index < length; ) array[index] = source[index];
return array;
}
function copyObject(source, props, object) {
return copyObjectWith(source, props, object);
}
function copyObjectWith(source, props, object, customizer) {
object || (object = {});
for (var index = -1, length = props.length; ++index < length; ) {
var key = props[index], newValue = customizer ? customizer(object[key], source[key], key, object, source) : source[key];
assignValue(object, key, newValue);
}
return object;
}
function copySymbols(source, object) {
return copyObject(source, getSymbols(source), object);
}
function createBaseEach(eachFunc, fromRight) {
return function(collection, iteratee) {
if (null == collection) return collection;
if (!isArrayLike(collection)) return eachFunc(collection, iteratee);
for (var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection); (fromRight ? index-- : ++index < length) && iteratee(iterable[index], index, iterable) !== !1; ) ;
return collection;
};
}
function createBaseFor(fromRight) {
return function(object, iteratee, keysFunc) {
for (var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length; length--; ) {
var key = props[fromRight ? length : ++index];
if (iteratee(iterable[key], key, iterable) === !1) break;
}
return object;
};
}
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
var index = -1, isPartial = bitmask & PARTIAL_COMPARE_FLAG, isUnordered = bitmask & UNORDERED_COMPARE_FLAG, arrLength = array.length, othLength = other.length;
if (arrLength != othLength && !(isPartial && othLength > arrLength)) return !1;
var stacked = stack.get(array);
if (stacked) return stacked == other;
var result = !0;
for (stack.set(array, other); ++index < arrLength; ) {
var arrValue = array[index], othValue = other[index];
if (customizer) var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
if (compared !== undefined) {
if (compared) continue;
result = !1;
break;
}
if (isUnordered) {
if (!arraySome(other, function(othValue) {
return arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack);
})) {
result = !1;
break;
}
} else if (arrValue !== othValue && !equalFunc(arrValue, othValue, customizer, bitmask, stack)) {
result = !1;
break;
}
}
return stack.delete(array), result;
}
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
switch (tag) {
case arrayBufferTag:
return !(object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other)));

case boolTag:
case dateTag:
return +object == +other;

case errorTag:
return object.name == other.name && object.message == other.message;

case numberTag:
return object != +object ? other != +other : object == +other;

case regexpTag:
case stringTag:
return object == other + "";

case mapTag:
var convert = mapToArray;

case setTag:
var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
if (convert || (convert = setToArray), object.size != other.size && !isPartial) return !1;
var stacked = stack.get(object);
return stacked ? stacked == other : equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask | UNORDERED_COMPARE_FLAG, stack.set(object, other));

case symbolTag:
if (symbolValueOf) return symbolValueOf.call(object) == symbolValueOf.call(other);
}
return !1;
}
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
var isPartial = bitmask & PARTIAL_COMPARE_FLAG, objProps = keys(object), objLength = objProps.length, othProps = keys(other), othLength = othProps.length;
if (objLength != othLength && !isPartial) return !1;
for (var index = objLength; index--; ) {
var key = objProps[index];
if (!(isPartial ? key in other : baseHas(other, key))) return !1;
}
var stacked = stack.get(object);
if (stacked) return stacked == other;
var result = !0;
stack.set(object, other);
for (var skipCtor = isPartial; ++index < objLength; ) {
key = objProps[index];
var objValue = object[key], othValue = other[key];
if (customizer) var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack) : compared)) {
result = !1;
break;
}
skipCtor || (skipCtor = "constructor" == key);
}
if (result && !skipCtor) {
var objCtor = object.constructor, othCtor = other.constructor;
objCtor != othCtor && "constructor" in object && "constructor" in other && !("function" == typeof objCtor && objCtor instanceof objCtor && "function" == typeof othCtor && othCtor instanceof othCtor) && (result = !1);
}
return stack.delete(object), result;
}
function getIteratee() {
var result = lodash.iteratee || iteratee;
return result = result === iteratee ? baseIteratee : result, arguments.length ? result(arguments[0], arguments[1]) : result;
}
function getMatchData(object) {
for (var result = toPairs(object), length = result.length; length--; ) result[length][2] = isStrictComparable(result[length][1]);
return result;
}
function getNative(object, key) {
var value = object[key];
return isNative(value) ? value : undefined;
}
function getTag(value) {
return objectToString.call(value);
}
function hasPath(object, path, hasFunc) {
if (null == object) return !1;
var result = hasFunc(object, path);
result || isKey(path) || (path = baseCastPath(path), object = parent(object, path), 
null != object && (path = last(path), result = hasFunc(object, path)));
var length = object ? object.length : undefined;
return result || !!length && isLength(length) && isIndex(path, length) && (isArray(object) || isString(object) || isArguments(object));
}
function initCloneArray(array) {
var length = array.length, result = array.constructor(length);
return length && "string" == typeof array[0] && hasOwnProperty.call(array, "index") && (result.index = array.index, 
result.input = array.input), result;
}
function initCloneObject(object) {
return "function" != typeof object.constructor || isPrototype(object) ? {} : baseCreate(getPrototypeOf(object));
}
function initCloneByTag(object, tag, isDeep) {
var Ctor = object.constructor;
switch (tag) {
case arrayBufferTag:
return cloneArrayBuffer(object);

case boolTag:
case dateTag:
return new Ctor((+object));

case float32Tag:
case float64Tag:
case int8Tag:
case int16Tag:
case int32Tag:
case uint8Tag:
case uint8ClampedTag:
case uint16Tag:
case uint32Tag:
return cloneTypedArray(object, isDeep);

case mapTag:
return cloneMap(object);

case numberTag:
case stringTag:
return new Ctor(object);

case regexpTag:
return cloneRegExp(object);

case setTag:
return cloneSet(object);

case symbolTag:
return cloneSymbol(object);
}
}
function indexKeys(object) {
var length = object ? object.length : undefined;
return isLength(length) && (isArray(object) || isString(object) || isArguments(object)) ? baseTimes(length, String) : null;
}
function isKey(value, object) {
return "number" == typeof value || !isArray(value) && (reIsPlainProp.test(value) || !reIsDeepProp.test(value) || null != object && value in Object(object));
}
function isKeyable(value) {
var type = "undefined" == typeof value ? "undefined" : (0, _typeof3.default)(value);
return "number" == type || "boolean" == type || "string" == type && "__proto__" != value || null == value;
}
function isPrototype(value) {
var Ctor = value && value.constructor, proto = "function" == typeof Ctor && Ctor.prototype || objectProto;
return value === proto;
}
function isStrictComparable(value) {
return value === value && !isObject(value);
}
function parent(object, path) {
return 1 == path.length ? object : get(object, baseSlice(path, 0, -1));
}
function stringToPath(string) {
var result = [];
return toString(string).replace(rePropName, function(match, number, quote, string) {
result.push(quote ? string.replace(reEscapeChar, "$1") : number || match);
}), result;
}
function fromPairs(pairs) {
for (var index = -1, length = pairs ? pairs.length : 0, result = {}; ++index < length; ) {
var pair = pairs[index];
result[pair[0]] = pair[1];
}
return result;
}
function indexOf(array, value, fromIndex) {
var length = array ? array.length : 0;
return length ? (fromIndex = toInteger(fromIndex), fromIndex < 0 && (fromIndex = nativeMax(length + fromIndex, 0)), 
baseIndexOf(array, value, fromIndex)) : -1;
}
function last(array) {
var length = array ? array.length : 0;
return length ? array[length - 1] : undefined;
}
function map(collection, iteratee) {
var func = isArray(collection) ? arrayMap : baseMap;
return func(collection, getIteratee(iteratee, 3));
}
function eq(value, other) {
return value === other || value !== value && other !== other;
}
function isArguments(value) {
return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
}
function isArrayLike(value) {
return null != value && isLength(getLength(value)) && !isFunction(value);
}
function isArrayLikeObject(value) {
return isObjectLike(value) && isArrayLike(value);
}
function isFunction(value) {
var tag = isObject(value) ? objectToString.call(value) : "";
return tag == funcTag || tag == genTag;
}
function isLength(value) {
return "number" == typeof value && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
function isObject(value) {
var type = "undefined" == typeof value ? "undefined" : (0, _typeof3.default)(value);
return !!value && ("object" == type || "function" == type);
}
function isObjectLike(value) {
return !!value && "object" == ("undefined" == typeof value ? "undefined" : (0, _typeof3.default)(value));
}
function isNative(value) {
return null != value && (isFunction(value) ? reIsNative.test(funcToString.call(value)) : isObjectLike(value) && (isHostObject(value) ? reIsNative : reIsHostCtor).test(value));
}
function isString(value) {
return "string" == typeof value || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
}
function isSymbol(value) {
return "symbol" == ("undefined" == typeof value ? "undefined" : (0, _typeof3.default)(value)) || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
function isTypedArray(value) {
return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}
function toInteger(value) {
if (!value) return 0 === value ? value : 0;
if (value = toNumber(value), value === INFINITY || value === -INFINITY) {
var sign = value < 0 ? -1 : 1;
return sign * MAX_INTEGER;
}
var remainder = value % 1;
return value === value ? remainder ? value - remainder : value : 0;
}
function toNumber(value) {
if (isObject(value)) {
var other = isFunction(value.valueOf) ? value.valueOf() : value;
value = isObject(other) ? other + "" : other;
}
if ("string" != typeof value) return 0 === value ? value : +value;
value = value.replace(reTrim, "");
var isBinary = reIsBinary.test(value);
return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
function toString(value) {
if ("string" == typeof value) return value;
if (null == value) return "";
if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
var result = value + "";
return "0" == result && 1 / value == -INFINITY ? "-0" : result;
}
function get(object, path, defaultValue) {
var result = null == object ? undefined : baseGet(object, path);
return result === undefined ? defaultValue : result;
}
function hasIn(object, path) {
return hasPath(object, path, baseHasIn);
}
function keys(object) {
var isProto = isPrototype(object);
if (!isProto && !isArrayLike(object)) return baseKeys(object);
var indexes = indexKeys(object), skipIndexes = !!indexes, result = indexes || [], length = result.length;
for (var key in object) !baseHas(object, key) || skipIndexes && ("length" == key || isIndex(key, length)) || isProto && "constructor" == key || result.push(key);
return result;
}
function toPairs(object) {
return baseToPairs(object, keys(object));
}
function trim(string, chars, guard) {
if (string = toString(string), !string) return string;
if (guard || chars === undefined) return string.replace(reTrim, "");
if (chars += "", !chars) return string;
var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars);
return strSymbols.slice(charsStartIndex(strSymbols, chrSymbols), charsEndIndex(strSymbols, chrSymbols) + 1).join("");
}
function constant(value) {
return function() {
return value;
};
}
function identity(value) {
return value;
}
function iteratee(func) {
return baseIteratee("function" == typeof func ? func : baseClone(func, !0));
}
function property(path) {
return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
}
var undefined, VERSION = "4.6.1", LARGE_ARRAY_SIZE = 200, HASH_UNDEFINED = "__lodash_hash_undefined__", UNORDERED_COMPARE_FLAG = 1, PARTIAL_COMPARE_FLAG = 2, INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 1.7976931348623157e308, NAN = NaN, argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", weakMapTag = "[object WeakMap]", arrayBufferTag = "[object ArrayBuffer]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]", reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g, reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reTrim = /^\s+|\s+$/g, reEscapeChar = /\\(\\)?/g, reFlags = /\w*$/, reIsBadHex = /^[-+]0x[0-9a-f]+$/i, reIsBinary = /^0b[01]+$/i, reIsHostCtor = /^\[object .+?Constructor\]$/, reIsOctal = /^0o[0-7]+$/i, reIsUint = /^(?:0|[1-9]\d*)$/, rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f\\ufe20-\\ufe23", rsComboSymbolsRange = "\\u20d0-\\u20f0", rsVarRange = "\\ufe0e\\ufe0f", rsAstral = "[" + rsAstralRange + "]", rsCombo = "[" + rsComboMarksRange + rsComboSymbolsRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsZWJ = "\\u200d", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [ rsNonAstral, rsRegional, rsSurrPair ].join("|") + ")" + rsOptVar + reOptMod + ")*", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsSymbol = "(?:" + [ rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral ].join("|") + ")", reComplexSymbol = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g"), typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = !0, 
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = !1;
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = !0, 
cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = !1;
var objectTypes = {
"function": !0,
object: !0
}, freeParseInt = parseInt, freeExports = objectTypes[(0, _typeof3.default)(exports)] && exports && !exports.nodeType ? exports : undefined, freeModule = objectTypes[(0, 
_typeof3.default)(module)] && module && !module.nodeType ? module : undefined, moduleExports = freeModule && freeModule.exports === freeExports ? freeExports : undefined, freeGlobal = checkGlobal(freeExports && freeModule && "object" == ("undefined" == typeof global ? "undefined" : (0, 
_typeof3.default)(global)) && global), freeSelf = checkGlobal(objectTypes["undefined" == typeof self ? "undefined" : (0, 
_typeof3.default)(self)] && self), freeWindow = checkGlobal(objectTypes["undefined" == typeof window ? "undefined" : (0, 
_typeof3.default)(window)] && window), thisGlobal = checkGlobal(objectTypes[(0, 
_typeof3.default)(this)] && this), root = freeGlobal || freeWindow !== (thisGlobal && thisGlobal.window) && freeWindow || freeSelf || thisGlobal || Function("return this")(), arrayProto = Array.prototype, objectProto = Object.prototype, funcToString = Function.prototype.toString, hasOwnProperty = objectProto.hasOwnProperty, objectToString = objectProto.toString, reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), Buffer = moduleExports ? root.Buffer : undefined, _Symbol = root.Symbol, Uint8Array = root.Uint8Array, getPrototypeOf = _getPrototypeOf2.default, getOwnPropertySymbols = _getOwnPropertySymbols2.default, objectCreate = _create2.default, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, nativeKeys = _keys2.default, nativeMax = Math.max, Map = getNative(root, "Map"), Set = getNative(root, "Set"), WeakMap = getNative(root, "WeakMap"), nativeCreate = getNative(Object, "create"), mapCtorString = Map ? funcToString.call(Map) : "", setCtorString = Set ? funcToString.call(Set) : "", weakMapCtorString = WeakMap ? funcToString.call(WeakMap) : "", symbolProto = _Symbol ? _Symbol.prototype : undefined, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined, symbolToString = symbolProto ? symbolProto.toString : undefined, baseEach = createBaseEach(baseForOwn), baseFor = createBaseFor(), getLength = baseProperty("length"), getSymbols = getOwnPropertySymbols || function() {
return [];
};
(Map && getTag(new Map()) != mapTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) && (getTag = function getTag(value) {
var result = objectToString.call(value), Ctor = result == objectTag ? value.constructor : null, ctorString = "function" == typeof Ctor ? funcToString.call(Ctor) : "";
if (ctorString) switch (ctorString) {
case mapCtorString:
return mapTag;

case setCtorString:
return setTag;

case weakMapCtorString:
return weakMapTag;
}
return result;
});
var isArray = Array.isArray, isBuffer = Buffer ? function(value) {
return value instanceof Buffer;
} : constant(!1);
Hash.prototype = nativeCreate ? nativeCreate(null) : objectProto, MapCache.prototype.clear = mapClear, 
MapCache.prototype.delete = mapDelete, MapCache.prototype.get = mapGet, MapCache.prototype.has = mapHas, 
MapCache.prototype.set = mapSet, Stack.prototype.clear = stackClear, Stack.prototype.delete = stackDelete, 
Stack.prototype.get = stackGet, Stack.prototype.has = stackHas, Stack.prototype.set = stackSet, 
lodash.constant = constant, lodash.fromPairs = fromPairs, lodash.iteratee = iteratee, 
lodash.keys = keys, lodash.map = map, lodash.property = property, lodash.toPairs = toPairs, 
lodash.eq = eq, lodash.get = get, lodash.hasIn = hasIn, lodash.identity = identity, 
lodash.indexOf = indexOf, lodash.isArguments = isArguments, lodash.isArray = isArray, 
lodash.isArrayLike = isArrayLike, lodash.isArrayLikeObject = isArrayLikeObject, 
lodash.isBuffer = isBuffer, lodash.isFunction = isFunction, lodash.isLength = isLength, 
lodash.isNative = isNative, lodash.isObject = isObject, lodash.isObjectLike = isObjectLike, 
lodash.isString = isString, lodash.isSymbol = isSymbol, lodash.isTypedArray = isTypedArray, 
lodash.last = last, lodash.toInteger = toInteger, lodash.toNumber = toNumber, lodash.toString = toString, 
lodash.trim = trim, lodash.VERSION = VERSION, (freeWindow || freeSelf || {})._ = lodash, 
"object" == (0, _typeof3.default)(__webpack_require__(490)) && __webpack_require__(490) ? (__WEBPACK_AMD_DEFINE_RESULT__ = function() {
return lodash;
}.call(exports, __webpack_require__, exports, module), !(__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))) : freeExports && freeModule ? (moduleExports && ((freeModule.exports = lodash)._ = lodash), 
freeExports._ = lodash) : root._ = lodash;
}).call(void 0);
}).call(exports, __webpack_require__(119)(module), function() {
return this;
}());
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _getPrototypeOf = __webpack_require__(131), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(91), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(92), _createClass3 = _interopRequireDefault(_createClass2), _possibleConstructorReturn2 = __webpack_require__(180), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(179), _inherits3 = _interopRequireDefault(_inherits2), _base = (__webpack_require__(97), 
__webpack_require__(150), __webpack_require__(149), __webpack_require__(252), __webpack_require__(148)), _base2 = _interopRequireDefault(_base), Accounts = function(_BaseEndpoint) {
function Accounts() {
return (0, _classCallCheck3.default)(this, Accounts), (0, _possibleConstructorReturn3.default)(this, (Accounts.__proto__ || (0, 
_getPrototypeOf2.default)(Accounts)).apply(this, arguments));
}
return (0, _inherits3.default)(Accounts, _BaseEndpoint), (0, _createClass3.default)(Accounts, [ {
key: "account",
value: function account() {
var user = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "self";
return this.client.get("/v1/accounts/" + user + "/");
}
}, {
key: "subscriptions",
value: function subscriptions() {
var user = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "self";
return this.client.get("/v1/accounts/" + user + "/subscriptions/");
}
} ]), Accounts;
}(_base2.default);
exports.default = Accounts;
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _promise = __webpack_require__(264), _promise2 = _interopRequireDefault(_promise), _createClass2 = __webpack_require__(92), _createClass3 = _interopRequireDefault(_createClass2), _getPrototypeOf = __webpack_require__(131), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(91), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _possibleConstructorReturn2 = __webpack_require__(180), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(179), _inherits3 = _interopRequireDefault(_inherits2), _resultset = (__webpack_require__(97), 
__webpack_require__(150)), _schemas = __webpack_require__(149), _base = __webpack_require__(148), _base2 = _interopRequireDefault(_base), EventResultSet = function(_ResultSet) {
function EventResultSet() {
return (0, _classCallCheck3.default)(this, EventResultSet), (0, _possibleConstructorReturn3.default)(this, (EventResultSet.__proto__ || (0, 
_getPrototypeOf2.default)(EventResultSet)).apply(this, arguments));
}
return (0, _inherits3.default)(EventResultSet, _ResultSet), EventResultSet;
}(_resultset.ResultSet), CalendarResultSet = function(_ResultSet2) {
function CalendarResultSet() {
return (0, _classCallCheck3.default)(this, CalendarResultSet), (0, _possibleConstructorReturn3.default)(this, (CalendarResultSet.__proto__ || (0, 
_getPrototypeOf2.default)(CalendarResultSet)).apply(this, arguments));
}
return (0, _inherits3.default)(CalendarResultSet, _ResultSet2), CalendarResultSet;
}(_resultset.ResultSet), Events = function(_BaseEndpoint) {
function Events(client, accountId) {
(0, _classCallCheck3.default)(this, Events);
var _this3 = (0, _possibleConstructorReturn3.default)(this, (Events.__proto__ || (0, 
_getPrototypeOf2.default)(Events)).call(this, client));
return _this3.schema = _schemas.EventSchema, _this3.arrayOptions = [ "category", "sort", "rank_level", "label", "within", "country" ], 
_this3.integerOptions = [ "limit", "offset", "rank_level" ], _this3.accountId = accountId, 
_this3;
}
return (0, _inherits3.default)(Events, _BaseEndpoint), (0, _createClass3.default)(Events, [ {
key: "search",
value: function search(options) {
options = options || {};
var validate = this.validate(options);
return validate.valid ? this.client.get("/v1/events/", EventResultSet, options) : new _promise2.default(function(resolve, reject) {
return reject(validate.errors[0]);
});
}
}, {
key: "calendar",
value: function calendar(options) {
options = options || {};
var validate = this.validate(options);
return validate.valid ? this.client.get(this.build_url("v1", "/events/calendar/"), CalendarResultSet, options) : new _promise2.default(function(resolve, reject) {
return reject(validate.errors[0]);
});
}
}, {
key: "for_account",
value: function for_account(id) {
return new Events(this.client, id);
}
} ]), Events;
}(_base2.default);
exports.default = Events;
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _promise = __webpack_require__(264), _promise2 = _interopRequireDefault(_promise), _createClass2 = __webpack_require__(92), _createClass3 = _interopRequireDefault(_createClass2), _getPrototypeOf = __webpack_require__(131), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(91), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _possibleConstructorReturn2 = __webpack_require__(180), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(179), _inherits3 = _interopRequireDefault(_inherits2), _resultset = (__webpack_require__(97), 
__webpack_require__(150)), _schemas = __webpack_require__(149), _base = __webpack_require__(148), _base2 = _interopRequireDefault(_base), PlaceResultSet = function(_ResultSet) {
function PlaceResultSet() {
return (0, _classCallCheck3.default)(this, PlaceResultSet), (0, _possibleConstructorReturn3.default)(this, (PlaceResultSet.__proto__ || (0, 
_getPrototypeOf2.default)(PlaceResultSet)).apply(this, arguments));
}
return (0, _inherits3.default)(PlaceResultSet, _ResultSet), PlaceResultSet;
}(_resultset.ResultSet), Places = function(_BaseEndpoint) {
function Places(client) {
(0, _classCallCheck3.default)(this, Places);
var _this2 = (0, _possibleConstructorReturn3.default)(this, (Places.__proto__ || (0, 
_getPrototypeOf2.default)(Places)).call(this, client));
return _this2.schema = _schemas.PlaceSchema, _this2.arrayOptions = [ "id", "country", "type" ], 
_this2.integerOptions = [ "limit" ], _this2;
}
return (0, _inherits3.default)(Places, _BaseEndpoint), (0, _createClass3.default)(Places, [ {
key: "search",
value: function search(options) {
options = options || {};
var validate = this.validate(options);
return validate.valid ? this.get("v1", "/places/", PlaceResultSet, options) : new _promise2.default(function(resolve, reject) {
return reject(validate.errors[0]);
});
}
} ]), Places;
}(_base2.default);
exports.default = Places;
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _createClass2 = __webpack_require__(92), _createClass3 = _interopRequireDefault(_createClass2), _getPrototypeOf = __webpack_require__(131), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(91), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _possibleConstructorReturn2 = __webpack_require__(180), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(179), _inherits3 = _interopRequireDefault(_inherits2), _resultset = (__webpack_require__(97), 
__webpack_require__(150)), _base = (__webpack_require__(149), __webpack_require__(252), 
__webpack_require__(148)), _base2 = _interopRequireDefault(_base), MembershipResultSet = function(_ResultSet) {
function MembershipResultSet() {
return (0, _classCallCheck3.default)(this, MembershipResultSet), (0, _possibleConstructorReturn3.default)(this, (MembershipResultSet.__proto__ || (0, 
_getPrototypeOf2.default)(MembershipResultSet)).apply(this, arguments));
}
return (0, _inherits3.default)(MembershipResultSet, _ResultSet), MembershipResultSet;
}(_resultset.ResultSet), Users = function(_BaseEndpoint) {
function Users() {
return (0, _classCallCheck3.default)(this, Users), (0, _possibleConstructorReturn3.default)(this, (Users.__proto__ || (0, 
_getPrototypeOf2.default)(Users)).apply(this, arguments));
}
return (0, _inherits3.default)(Users, _BaseEndpoint), (0, _createClass3.default)(Users, [ {
key: "user",
value: function user() {
var _user = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "self";
return this.client.get("/v1/users/" + _user + "/");
}
}, {
key: "memberships",
value: function memberships() {
var user = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "self";
return this.client.get("/v1/users/" + user + "/memberships/", MembershipResultSet);
}
} ]), Users;
}(_base2.default);
exports.default = Users;
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireWildcard(obj) {
if (obj && obj.__esModule) return obj;
var newObj = {};
if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
return newObj.default = obj, newObj;
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.places = exports.time = exports.ui = exports.event = exports.background = exports.user = void 0;
var _user = __webpack_require__(510), user = _interopRequireWildcard(_user), _background = __webpack_require__(507), background = _interopRequireWildcard(_background), _event = __webpack_require__(207), event = _interopRequireWildcard(_event), _ui = __webpack_require__(312), ui = _interopRequireWildcard(_ui), _time = __webpack_require__(509), time = _interopRequireWildcard(_time), _places = __webpack_require__(508), places = _interopRequireWildcard(_places);
exports.user = user, exports.background = background, exports.event = event, exports.ui = ui, 
exports.time = time, exports.places = places;
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function updateBackgroundsCompleted(options, results) {
return function(dispatch, getState) {
dispatch({
type: UPDATE_BACKGROUNDS_COMPLETED,
options: options,
results: results.results
}), dispatch(cacheBackgrounds());
};
}
function updateBackgroundsFailed(options, msg) {
return {
type: UPDATE_BACKGROUNDS_FAILED
};
}
function cacheBackgroundCompleted(day, success) {
return {
type: CACHE_BACKGROUND_COMPLETED,
day: day,
success: success
};
}
function cacheBackgrounds() {
return function(dispatch, getState) {
var items = getState().backgrounds.items, unCachedItems = _utils._.omitBy(items, function(v, k) {
return v.cached;
});
if (unCachedItems) {
var tasks = _utils._.map(unCachedItems, function(day, k) {
return function(cb) {
return _async2.default.parallelLimit(_utils._.map(day.items, function(item) {
return function(cb) {
var i = new _utils.ImageElement(), handler = function handler(e) {
i.removeEventListener("load", handler, !1), cb(null, !0);
}, errorHandler = function errorHandler(e) {
cb(null, !1);
};
i.addEventListener("load", handler, !1), i.addEventListener("error", errorHandler, !1), 
i.src = item.url;
};
}), 3, function(err, results) {
var success = _utils._.reduce(results, function(success, value) {
return success && value;
});
_utils._.async(dispatch, cacheBackgroundCompleted, k, success);
}), cb(null);
};
});
_async2.default.series(tasks);
}
};
}
function updateBackgrounds(options) {
return options = options || {}, function(dispatch, getState) {
var url = _utils.config.focus.url + _utils.config.focus.feed;
fetch(url, {
method: "get"
}).then(function(response) {
return response.json();
}).then(function(results) {
return dispatch(updateBackgroundsCompleted(options, results));
}).catch(function(err) {
return dispatch(updateBackgroundsFailed(err));
});
};
}
function shouldUpdateBackgrounds(backgrounds) {
if (backgrounds.lastCheckStatus !== !0 || null == backgrounds.lastCheck) return log.debug("shouldUpdateBackgrounds - no lastCheck"), 
!0;
var lastCheck = _moment2.default.duration((0, _moment2.default)().diff((0, _moment2.default)(backgrounds.lastCheck)));
return lastCheck.asDays() > 2 ? (log.debug("shouldUpdateBackgrounds.lastCheck", parseFloat(lastCheck.asHours()).toFixed(2) + " hours ago"), 
!0) : !!_mixins.BackgroundMixin.isFallBack(backgrounds) && (log.debug("shouldUpdateBackgrounds - using fallback"), 
!0);
}
function updateBackgroundsIfRequired(options) {
return function(dispatch, getState) {
return shouldUpdateBackgrounds(options.backgrounds) ? dispatch(updateBackgrounds()) : void log.debug("updateBackgroundsIfRequired - not required");
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.CACHE_BACKGROUND_COMPLETED = exports.UPDATE_BACKGROUNDS_COMPLETED = exports.UPDATE_BACKGROUNDS_FAILED = void 0, 
exports.updateBackgroundsCompleted = updateBackgroundsCompleted, exports.updateBackgroundsFailed = updateBackgroundsFailed, 
exports.cacheBackgroundCompleted = cacheBackgroundCompleted, exports.cacheBackgrounds = cacheBackgrounds, 
exports.updateBackgrounds = updateBackgrounds, exports.updateBackgroundsIfRequired = updateBackgroundsIfRequired;
var _mixins = __webpack_require__(29), _async = __webpack_require__(310), _async2 = _interopRequireDefault(_async), _moment = __webpack_require__(25), _moment2 = _interopRequireDefault(_moment), _utils = __webpack_require__(17), UPDATE_BACKGROUNDS_FAILED = exports.UPDATE_BACKGROUNDS_FAILED = "UPDATE_BACKGROUNDS_FAILED", UPDATE_BACKGROUNDS_COMPLETED = exports.UPDATE_BACKGROUNDS_COMPLETED = "UPDATE_BACKGROUNDS_COMPLETED", CACHE_BACKGROUND_COMPLETED = exports.CACHE_BACKGROUND_COMPLETED = "CACHE_BACKGROUND_COMPLETED";
__webpack_require__(369).polyfill(), __webpack_require__(798);
var log = _utils.logger.getLogger("actions.background");
log.setLevel("DEBUG");
}, function(module, exports, __webpack_require__) {
"use strict";
function search(q) {
return q && q.trim().length > 0 ? function(dispatch, getState) {
var uri = _utils.config.focus.url + _utils.config.focus.places + "?q=" + q, state = getState();
fetch(uri, {
method: "get",
headers: {
Authorization: "Bearer " + state.user.token
}
}).then(function(response) {
return response.json();
}).then(function(data) {
var results = _utils._.map(data.results, function(item) {
var value = item.id + "|" + item.name + "|" + item.country;
return {
label: item.name,
region: item.region,
country: item.country,
value: value
};
});
dispatch({
type: PLACES_SEARCH_COMPLETED,
results: results
});
}).catch(function(err) {});
} : {
type: null
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.PLACES_SEARCH_COMPLETED = void 0, exports.search = search;
var _utils = __webpack_require__(17), PLACES_SEARCH_COMPLETED = exports.PLACES_SEARCH_COMPLETED = "PLACES_SEARCH_COMPLETED";
}, function(module, exports) {
"use strict";
function updateTime(time) {
return {
type: UPDATE_TIME,
time: time
};
}
function addDay(day) {
return {
type: ADJUST_DAY,
add_days: day
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.updateTime = updateTime, exports.addDay = addDay;
var UPDATE_TIME = exports.UPDATE_TIME = "UPDATE_TIME", ADJUST_DAY = exports.ADJUST_DAY = "ADJUST_DAY";
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function updateDefaultOrg(id) {
return function(dispatch, getState) {
dispatch({
type: UPDATE_DEFAULT_ORG,
id: id
}), dispatch((0, _event.updateEvents)({
reset: !0
}));
};
}
function updateTimeFormat(enableTwelveHours) {
return function(dispatch, getState) {
dispatch({
type: UPDATE_TIME_FORMAT,
enableTwelveHours: enableTwelveHours
});
};
}
function updateLocation(location) {
return function(dispatch, getState) {
dispatch({
type: UPDATE_LOCATION,
location: location
});
var options = {
reset: !0
};
dispatch((0, _event.updateEvents)(options));
};
}
function dispatchError(dispatch) {
var isRefresh = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], err = arguments[2];
"function" != typeof dispatch && log.error("dispatchError called with incorrect args"), 
isRefresh || (log.error(err, err.lineNumber), 401 == err.code && dispatch({
type: LOGIN_INVALID_AUTHENTICATION,
err: err
}), 402 == err.code && dispatch({
type: LOGIN_INVALID_PAYMENT_REQUIRED,
err: err
}), dispatch({
type: LOGIN_INVALID_REQUEST,
err: err
}), dispatch(actions.ui.closePopups()));
}
function updateSubscriptions(token, orgIds) {
var isRefresh = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
return function(dispatch, getState) {
var _updateEvents = _utils._.debounce(function() {
dispatch((0, _event.updateEvents)({}));
}, 50);
_utils._.each(orgIds, function(id) {
var c = new _client2.default({
access_token: token,
endpoint: _utils.config.phq.url
});
c.accounts.subscriptions(id).then(function(data) {
dispatch({
type: UPDATE_SUBSCRIPTIONS,
id: id,
subscriptions: data
});
var state = getState();
1 != _utils._.size(state.user.orgs) || isRefresh || _updateEvents();
}).catch(_utils._.partial(dispatchError, dispatch, isRefresh));
});
};
}
function login(token) {
var isRefresh = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
return function(dispatch, getState) {
dispatch({
type: LOGIN_COMPLETED,
token: token
});
var c = new _client2.default({
access_token: token,
endpoint: _utils.config.phq.url
});
c.users.memberships().then(function(data) {
var orgs = _utils._.keyBy(data.toArray(), function(item) {
return item.account.id;
}), default_org = isRefresh ? getState().user.default_org : null;
dispatch({
type: UPDATE_ORGS,
orgs: orgs,
default_org: default_org
}), dispatch(updateSubscriptions(token, _utils._.keys(orgs), isRefresh = isRefresh));
}).catch(_utils._.partial(dispatchError, dispatch, isRefresh)), isRefresh || c.users.user().then(function(data) {
return dispatch({
type: UPDATE_USER,
account: data,
token: token
}), data.place && data.place.hasOwnProperty("id") && data.place.id ? void dispatch(updateLocation({
name: data.place.name,
tz: data.timezone,
country: data.place.country,
countryCode: data.place.country_alpha2,
id: data.place.id,
geolocated: !1
})) : geolocate({
force: !0
});
}).catch(_utils._.partial(dispatchError, dispatch, isRefresh));
};
}
function geolocate() {
arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
return function(dispatch, getState) {
"undefined" != typeof window && dispatch(updateLocation(guestDefaultLocation));
};
}
function guest() {
return function(dispatch, getState) {
dispatch({
type: LOGIN_GUEST
}), dispatch((0, _event.updateEventsCompleted)({
reset: !0
}, [])), dispatch((0, _ui.closePopups)()), dispatch((0, _ui.resetTimeline)());
};
}
function partialGuest() {
return function(dispatch, getState) {
dispatch({
type: LOGIN_PARTIAL_GUEST
}), dispatch((0, _ui.closePopups)()), dispatch((0, _ui.resetTimeline)());
};
}
function updateUserIfRequired(options) {
return function(dispatch, getState) {
return options.user.guest ? void log.debug("updateUserIfRequired - not required") : dispatch(partialGuest());
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.LOGIN_INVALID_PAYMENT_REQUIRED = exports.LOGIN_INVALID_REQUEST = exports.LOGIN_INVALID_AUTHENTICATION = exports.UPDATE_USER = exports.UPDATE_SUBSCRIPTIONS = exports.UPDATE_TIME_FORMAT = exports.UPDATE_DEFAULT_ORG = exports.UPDATE_ORGS = exports.UPDATE_LOCATION = exports.LOGIN_COMPLETED = exports.LOGIN_PARTIAL_GUEST = exports.LOGIN_GUEST = void 0, 
exports.updateDefaultOrg = updateDefaultOrg, exports.updateTimeFormat = updateTimeFormat, 
exports.updateLocation = updateLocation, exports.updateSubscriptions = updateSubscriptions, 
exports.login = login, exports.geolocate = geolocate, exports.guest = guest, exports.updateUserIfRequired = updateUserIfRequired;
var _utils = __webpack_require__(17), _ui = __webpack_require__(312), _event = __webpack_require__(207), _client = __webpack_require__(311), _client2 = _interopRequireDefault(_client), log = _utils.logger.getLogger("actions.user");
log.setLevel("DEBUG");
var LOGIN_GUEST = exports.LOGIN_GUEST = "LOGIN_GUEST", LOGIN_PARTIAL_GUEST = exports.LOGIN_PARTIAL_GUEST = "LOGIN_PARTIAL_TEMP", LOGIN_COMPLETED = exports.LOGIN_COMPLETED = "LOGIN_COMPLETED", UPDATE_LOCATION = exports.UPDATE_LOCATION = "UPDATE_LOCATION", UPDATE_ORGS = exports.UPDATE_ORGS = "UPDATE_ORGS", UPDATE_DEFAULT_ORG = exports.UPDATE_DEFAULT_ORG = "UPDATE_DEFAULT_ORG", UPDATE_TIME_FORMAT = exports.UPDATE_TIME_FORMAT = "UPDATE_TIME_FORMAT", UPDATE_SUBSCRIPTIONS = exports.UPDATE_SUBSCRIPTIONS = "UPDATE_SUBSCRIPTIONS", UPDATE_USER = exports.UPDATE_USER = "UPDATE_USER", LOGIN_INVALID_AUTHENTICATION = exports.LOGIN_INVALID_AUTHENTICATION = "LOGIN_INVALID_AUTHENTICATION", LOGIN_INVALID_REQUEST = exports.LOGIN_INVALID_REQUEST = "LOGIN_INVALID_REQUEST", LOGIN_INVALID_PAYMENT_REQUIRED = exports.LOGIN_INVALID_PAYMENT_REQUIRED = "LOGIN_INVALID_PAYMENT_REQUIRED", guestDefaultLocation = {
id: "5391959",
name: "San Francisco",
country: "United States",
countryCode: null,
geolocated: !0
};
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireWildcard(obj) {
if (obj && obj.__esModule) return obj;
var newObj = {};
if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
return newObj.default = obj, newObj;
}
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
var _stringify = __webpack_require__(317), _stringify2 = _interopRequireDefault(_stringify), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactDom = __webpack_require__(114), _reducers = __webpack_require__(314), _reducers2 = _interopRequireDefault(_reducers), _config = __webpack_require__(56), _config2 = _interopRequireDefault(_config), _actions = __webpack_require__(36), actions = _interopRequireWildcard(_actions), _utils = __webpack_require__(17), _reduxLocalstorage = __webpack_require__(1107), _reduxLocalstorage2 = _interopRequireDefault(_reduxLocalstorage), _redux = __webpack_require__(146), _reactRedux = __webpack_require__(35), _app = __webpack_require__(512), _store = __webpack_require__(525), _moment = __webpack_require__(25), _moment2 = _interopRequireDefault(_moment), _momentTimezone = __webpack_require__(394), _ravenJs = (_interopRequireDefault(_momentTimezone), 
__webpack_require__(997)), _ravenJs2 = _interopRequireDefault(_ravenJs), _reduxThunk = __webpack_require__(1111), _reduxThunk2 = _interopRequireDefault(_reduxThunk), _reduxPromise = __webpack_require__(1110), _reduxPromise2 = _interopRequireDefault(_reduxPromise);
__webpack_require__(494), __webpack_require__(493);
var YouAreI = __webpack_require__(309);
_ravenJs2.default.config(_config2.default.raven.dsn, _config2.default.raven.config), 
(0, _utils.loadHeapAnalyticsScript)(), _utils.isInExtension && setInterval(function() {
var now = new _moment2.default();
store.dispatch(actions.time.updateTime(now.format("YYYY-MM-DDTHH:mm:00Z")));
}, 5e3), window && (window.actionHistory = []);
var actionHistoryMiddleware = function actionHistoryMiddleware(store) {
return function(next) {
return function(action) {
var a = null;
return a = "UPDATE_EVENTS_COMPLETED" == action.type ? {
type: action.type
} : action, window.actionHistory.push(a), window.actionHistory.length > 10 && (window.actionHistory = _utils._.takeRight(window.actionHistory, 5)), 
next(action);
};
};
}, createPersistentStore = (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk2.default, _reduxPromise2.default, actionHistoryMiddleware, _utils.loggerMiddleware), (0, 
_reduxLocalstorage2.default)([ "user", "backgrounds", "events" ], {
key: "predicthq.app"
}))(_redux.createStore), store = createPersistentStore(_reducers2.default, _store.defaultState), errorHandler = function errorHandler(e) {
var data = _utils._.cloneDeep(store.getState());
try {
data.countries = [], data.timezones = [], data.events.items = {}, data.backgrounds.items = {};
} catch (err) {}
var version = null;
try {
version = chrome.runtime.getManifest().version;
} catch (err) {}
_ravenJs2.default.captureException(e, {
extra: {
version: version,
actions: window.actionHistory,
state: (0, _stringify2.default)(data),
error_args: arguments
}
});
};
_utils.isInExtension && (window.onerror = errorHandler);
var rootElement = document.getElementById("app");
(0, _reactDom.render)(_react2.default.createElement(_reactRedux.Provider, {
store: store
}, _react2.default.createElement(_app.PredictHQApp, null)), rootElement);
var uri = new YouAreI(window.location.href);
if (uri.fragment() && uri.fragment().indexOf("access_token") >= 0) {
var fragment = new YouAreI("https://predicthq.com/?" + uri.fragment()).query_get(), token = fragment.access_token;
store.dispatch(actions.user.login(token)), _utils.isInExtension && (window.location.hash = "");
}
uri.query_get().hasOwnProperty("update") && store.dispatch(actions.ui.upgrade(uri.query_get())), 
uri.query_get().hasOwnProperty("error_test") && store.dispatch({
type: "LOGIN_INVALID_REQUEST",
err: ""
}), uri.fragment() && uri.fragment().indexOf("error_description") >= 0 && store.dispatch({
type: "LOGIN_INVALID_REQUEST",
err: uri.fragment()
}), setTimeout(function() {
"undefined" == typeof fetch && (alert("You are using an out of date version of Google Chrome, you will need to update in order to use this extension!"), 
window.location.href = "https://www.google.com/chrome/");
var state = store.getState();
store.dispatch(actions.background.updateBackgroundsIfRequired({
backgrounds: state.backgrounds
})), null == state.user.location ? store.dispatch(actions.user.geolocate()) : (store.dispatch(actions.event.updateEventsIfRequired({
events: state.events,
user: state.user
})), setTimeout(function() {
store.dispatch(actions.user.updateUserIfRequired({
user: state.user
}));
}, 1e3));
}, 0);
var closeModals = function closeModals(target, e) {
store.getState();
e.target.id === target && store.dispatch(actions.ui.closePopups());
};
if (_utils._.each([ "footer-fade", "app", "welcome", "hexagon" ], function(i) {
var elem = document.getElementById(i);
elem && (elem.onclick = function(e) {
closeModals(i, e);
});
}), document) {
var KeyPress = function KeyPress(e) {
var evtobj = window.event ? event : e;
120 == evtobj.keyCode && evtobj.ctrlKey && setTimeout(function() {
throw "User Triggered";
}), 119 == evtobj.keyCode && evtobj.ctrlKey && store.dispatch(actions.ui.inputStateFromSentry());
};
document.onkeydown = KeyPress;
}
exports.store = store;
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireWildcard(obj) {
if (obj && obj.__esModule) return obj;
var newObj = {};
if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
return newObj.default = obj, newObj;
}
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.PredictHQApp = void 0;
var _stringify = __webpack_require__(317), _stringify2 = _interopRequireDefault(_stringify), _getPrototypeOf = __webpack_require__(20), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(21), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(27), _createClass3 = _interopRequireDefault(_createClass2), _possibleConstructorReturn2 = __webpack_require__(23), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(22), _inherits3 = _interopRequireDefault(_inherits2), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactRedux = __webpack_require__(35), _actions = __webpack_require__(36), actions = _interopRequireWildcard(_actions), _reactMixin = __webpack_require__(43), _reactMixin2 = _interopRequireDefault(_reactMixin), _moment = __webpack_require__(25), _utils = (_interopRequireDefault(_moment), 
__webpack_require__(17)), _shared = __webpack_require__(26), _footer = __webpack_require__(517), _footer2 = _interopRequireDefault(_footer), _profile = __webpack_require__(521), _profile2 = _interopRequireDefault(_profile), _oauthForm = __webpack_require__(519), _oauthForm2 = _interopRequireDefault(_oauthForm), _signupPopup = __webpack_require__(522), _signupPopup2 = _interopRequireDefault(_signupPopup), _eventTimeline = __webpack_require__(516), _eventTimeline2 = _interopRequireDefault(_eventTimeline), _backgroundEvent = __webpack_require__(513), _backgroundEvent2 = _interopRequireDefault(_backgroundEvent), _location = __webpack_require__(518), _location2 = _interopRequireDefault(_location), _welcome = __webpack_require__(524), _welcome2 = _interopRequireDefault(_welcome), _dayMover = __webpack_require__(514), _dayMover2 = _interopRequireDefault(_dayMover), _orgPopup = __webpack_require__(520), _orgPopup2 = _interopRequireDefault(_orgPopup), _upgradeMsg = __webpack_require__(523), _upgradeMsg2 = _interopRequireDefault(_upgradeMsg), _errorMsg = __webpack_require__(515), _errorMsg2 = _interopRequireDefault(_errorMsg), _mixins = __webpack_require__(29), log = _utils.logger.getLogger("app");
_utils.isInExtension || log.setLevel("DEBUG");
var App = function(_PureRenderComponent) {
function App() {
return (0, _classCallCheck3.default)(this, App), (0, _possibleConstructorReturn3.default)(this, (App.__proto__ || (0, 
_getPrototypeOf2.default)(App)).apply(this, arguments));
}
return (0, _inherits3.default)(App, _PureRenderComponent), (0, _createClass3.default)(App, [ {
key: "handleSentryErrorState",
value: function handleSentryErrorState(e) {
var value = JSON.parse(e.target.value);
this.props.dispatch(actions.ui.replaceState(value));
}
}, {
key: "render",
value: function render() {
log.debug("render", this.props);
var time = this.getTimeWithExtraOffset(), bg = this.getBackground(this.props.backgrounds, time);
if ("undefined" != typeof document) {
var _background = (document.getElementById("background-overlay"), document.getElementById("background")), bgUrl = bg.url;
0 == window.location.search.indexOf("?bg=") && (bgUrl = window.location.search.replace("?bg=", "")), 
log.debug("bg", bgUrl), _background.style.cssText = 'background-image: url("' + bgUrl + '");';
}
if (this.props.user.invalid_login) {
background.style.cssText = 'background-image: url("fallback/error-500.jpg"); opacity:0.5;';
var backgroundOverlayBot = document.getElementById("background-overlay-bot");
if (backgroundOverlayBot.style.cssText = "height:65px; opacity:0.8; top:auto;", 
this.props.user.hasOwnProperty("invalid_msg")) {
var invalid_msg = this.props.user.invalid_msg;
setTimeout(function() {
throw "Invalid login: " + (0, _stringify2.default)(invalid_msg);
});
}
return _react2.default.createElement("div", null, _react2.default.createElement(_errorMsg2.default, null), _react2.default.createElement(_footer2.default, null));
}
if (this.props.ui_state.hasOwnProperty("input_state_from_sentry")) return _react2.default.createElement("div", {
className: "error-state-input"
}, _react2.default.createElement("h3", null, "Debug - Input Sentry Error State or hit Refresh (F5) to ignore:"), _react2.default.createElement("textarea", {
onChange: this.handleSentryErrorState.bind(this)
}));
var user = this.props.user;
if (!(0 != user.guest || user.account && user.account.hasOwnProperty("id"))) {
if ("undefined" != typeof document) {
var _background2 = document.getElementById("background"), fb = this.props.backgrounds.fallback[0];
_background2.style.backgroundImage = 'url("fallback/' + fb + '")';
}
return _react2.default.createElement("div", null, _react2.default.createElement(_welcome2.default, {
user: this.props.user,
time: this.props.time,
events: this.props.events
}), _react2.default.createElement(_oauthForm2.default, null), _react2.default.createElement(_footer2.default, null));
}
return this.props.user.orgs && _utils._.size(this.props.user.orgs) > 1 && null == this.props.user.default_org && this.props.dispatch(actions.ui.showOrgPopup(!0)), 
_react2.default.createElement("div", null, _react2.default.createElement(_upgradeMsg2.default, {
upgrade: this.props.ui_state.upgrade
}), _react2.default.createElement(_welcome2.default, {
user: this.props.user,
time: this.props.time,
events: this.props.events
}), _react2.default.createElement(_dayMover2.default, {
user: this.props.user,
time: this.props.time,
time_extra: this.props.time_extra
}), _react2.default.createElement(_eventTimeline2.default, {
popup_day: this.props.ui_state.popup_day,
time: this.props.time,
current_day: this.props.ui_state.current_day,
events: this.props.events,
user: this.props.user
}), _react2.default.createElement(_location2.default, {
popup_is_open: this.props.ui_state.popup_location,
user: this.props.user,
places: this.props.places,
timezones: this.props.timezones,
countries: this.props.countries
}), _react2.default.createElement(_backgroundEvent2.default, {
popup_is_open: this.props.ui_state.popup_background_event,
bg_event: bg,
user: this.props.user
}), _react2.default.createElement(_signupPopup2.default, {
user: this.props.user,
popup_is_open: this.props.ui_state.popup_signup_for_more_events
}), _react2.default.createElement(_profile2.default, {
popup_is_open: this.props.ui_state.popup_profile,
user: this.props.user
}), _react2.default.createElement(_orgPopup2.default, {
popup_is_open: this.props.ui_state.popup_org_picker,
user: this.props.user,
orgs: this.props.user.orgs
}), _react2.default.createElement(_oauthForm2.default, null), _react2.default.createElement(_footer2.default, null));
}
} ]), App;
}(_shared.PureRenderComponent);
_reactMixin2.default.onClass(App, _mixins.CommonMixin), _reactMixin2.default.onClass(App, _mixins.BackgroundMixin);
exports.PredictHQApp = (0, _reactRedux.connect)(function(state) {
return state;
})(App);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireWildcard(obj) {
if (obj && obj.__esModule) return obj;
var newObj = {};
if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
return newObj.default = obj, newObj;
}
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _getPrototypeOf = __webpack_require__(20), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(21), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(27), _createClass3 = _interopRequireDefault(_createClass2), _possibleConstructorReturn2 = __webpack_require__(23), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(22), _inherits3 = _interopRequireDefault(_inherits2), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactRedux = __webpack_require__(35), _reactMixin = __webpack_require__(43), _reactMixin2 = _interopRequireDefault(_reactMixin), _shared = __webpack_require__(26), _mixins = __webpack_require__(29), _utils = __webpack_require__(17), _actions = __webpack_require__(36), actions = _interopRequireWildcard(_actions), _event = __webpack_require__(313), _event2 = _interopRequireDefault(_event), BackgroundEvent = function(_PureRenderComponent) {
function BackgroundEvent() {
return (0, _classCallCheck3.default)(this, BackgroundEvent), (0, _possibleConstructorReturn3.default)(this, (BackgroundEvent.__proto__ || (0, 
_getPrototypeOf2.default)(BackgroundEvent)).apply(this, arguments));
}
return (0, _inherits3.default)(BackgroundEvent, _PureRenderComponent), (0, _createClass3.default)(BackgroundEvent, [ {
key: "handleMetaClick",
value: function handleMetaClick(e) {
e.preventDefault(), this.props.dispatch(actions.ui.showBackgroundEventPopup(!this.props.popup_is_open));
}
}, {
key: "render",
value: function render() {
var bgEvent = _utils._.clone(this.props.bg_event);
if (!bgEvent.hasOwnProperty("phq_event_id")) return _react2.default.createElement("div", null);
bgEvent.id = bgEvent.phq_event_id;
var popup = null;
if (this.props.popup_is_open) {
popup = _react2.default.createElement("div", {
className: "background-event-popup popup menu"
}, _react2.default.createElement("div", {
onClick: this.handleClosePopupClick.bind(this),
className: "x"
}), _react2.default.createElement("div", {
className: "popup-header"
}, "Today's Feature Image Event"), _react2.default.createElement("div", {
className: "popup-body"
}, _react2.default.createElement(_event2.default, {
showDetailed: !0,
event: bgEvent
})), _react2.default.createElement("div", {
className: "popup-footer"
}, _react2.default.createElement("div", {
onClick: this.handleEventClick.bind(this, bgEvent.id).bind(this),
className: "btn strong"
}, "View more details")));
}
var attribution = null;
return bgEvent.hasOwnProperty("attribution") && (attribution = _react2.default.createElement("p", {
className: "attribution"
}, bgEvent.attribution)), _react2.default.createElement("div", {
className: "meta"
}, popup, _react2.default.createElement("div", {
className: "meta-wrap",
onClick: this.handleMetaClick.bind(this)
}, _react2.default.createElement(_event2.default, {
event: bgEvent,
onClick: this.handleMetaClick.bind(this)
})), attribution);
}
} ]), BackgroundEvent;
}(_shared.PureRenderComponent);
BackgroundEvent.propTypes = {
bg_event: _react2.default.PropTypes.object.isRequired,
popup_is_open: _react2.default.PropTypes.bool.isRequired
}, _reactMixin2.default.onClass(BackgroundEvent, _mixins.CommonMixin), exports.default = (0, 
_reactRedux.connect)()(BackgroundEvent);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireWildcard(obj) {
if (obj && obj.__esModule) return obj;
var newObj = {};
if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
return newObj.default = obj, newObj;
}
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _getPrototypeOf = __webpack_require__(20), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(21), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(27), _createClass3 = _interopRequireDefault(_createClass2), _possibleConstructorReturn2 = __webpack_require__(23), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(22), _inherits3 = _interopRequireDefault(_inherits2), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactRedux = __webpack_require__(35), _reactMixin = __webpack_require__(43), _reactMixin2 = _interopRequireDefault(_reactMixin), _shared = __webpack_require__(26), _mixins = __webpack_require__(29), _actions = __webpack_require__(36), actions = _interopRequireWildcard(_actions), DayMover = function(_PureRenderComponent) {
function DayMover() {
return (0, _classCallCheck3.default)(this, DayMover), (0, _possibleConstructorReturn3.default)(this, (DayMover.__proto__ || (0, 
_getPrototypeOf2.default)(DayMover)).apply(this, arguments));
}
return (0, _inherits3.default)(DayMover, _PureRenderComponent), (0, _createClass3.default)(DayMover, [ {
key: "handleDayMoverClick",
value: function handleDayMoverClick(days) {
this.props.dispatch(actions.time.addDay(days));
}
}, {
key: "render",
value: function render() {
if (!(this.props.user.account && this.props.user.account.email.indexOf("predicthq.com") >= 0)) return _react2.default.createElement("div", null);
var time = this.getTimeWithExtraOffset();
return _react2.default.createElement("div", {
className: "dayMover"
}, _react2.default.createElement("div", {
onClick: this.handleDayMoverClick.bind(this, -1),
className: "btn prev"
}), _react2.default.createElement("div", {
className: "today"
}, time.format("YYYY-MM-DD")), _react2.default.createElement("div", {
onClick: this.handleDayMoverClick.bind(this, 1),
className: "btn next"
}));
}
} ]), DayMover;
}(_shared.PureRenderComponent);
DayMover.propTypes = {
user: _react2.default.PropTypes.object.isRequired
}, _reactMixin2.default.onClass(DayMover, _mixins.CommonMixin), exports.default = (0, 
_reactRedux.connect)()(DayMover);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireWildcard(obj) {
if (obj && obj.__esModule) return obj;
var newObj = {};
if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
return newObj.default = obj, newObj;
}
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _getPrototypeOf = __webpack_require__(20), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(21), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(27), _createClass3 = _interopRequireDefault(_createClass2), _possibleConstructorReturn2 = __webpack_require__(23), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(22), _inherits3 = _interopRequireDefault(_inherits2), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactRedux = __webpack_require__(35), _reactMixin = __webpack_require__(43), _reactMixin2 = _interopRequireDefault(_reactMixin), _shared = __webpack_require__(26), _mixins = __webpack_require__(29), _config = (__webpack_require__(17), 
__webpack_require__(56)), _actions = (_interopRequireDefault(_config), __webpack_require__(36)), ErrorMsg = (_interopRequireWildcard(_actions), 
function(_PureRenderComponent) {
function ErrorMsg() {
return (0, _classCallCheck3.default)(this, ErrorMsg), (0, _possibleConstructorReturn3.default)(this, (ErrorMsg.__proto__ || (0, 
_getPrototypeOf2.default)(ErrorMsg)).apply(this, arguments));
}
return (0, _inherits3.default)(ErrorMsg, _PureRenderComponent), (0, _createClass3.default)(ErrorMsg, [ {
key: "handleTryAgainClick",
value: function handleTryAgainClick(e) {
e.preventDefault(), localStorage.removeItem("predicthq.app"), window.location.href = window.location.href.split("?")[0].split("#")[0];
}
}, {
key: "render",
value: function render() {
return _react2.default.createElement("div", {
className: "error-msg"
}, _react2.default.createElement("h1", null, "Well, we didn’t predict that..."), _react2.default.createElement("p", null, "Looks like something went wrong with your login, please", _react2.default.createElement("a", {
href: "#",
onClick: this.handleTryAgainClick.bind(this)
}, " try again"), " or", _react2.default.createElement("a", {
href: "https://www.predicthq.com/contact",
target: "_blank"
}, " contact us"), " if the problem persists."), _react2.default.createElement("div", {
onClick: this.handleTryAgainClick.bind(this),
className: "btn strong xl"
}, "Try again"));
}
} ]), ErrorMsg;
}(_shared.PureRenderComponent));
ErrorMsg.propTypes = {}, _reactMixin2.default.onClass(ErrorMsg, _mixins.CommonMixin), 
exports.default = (0, _reactRedux.connect)()(ErrorMsg);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireWildcard(obj) {
if (obj && obj.__esModule) return obj;
var newObj = {};
if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
return newObj.default = obj, newObj;
}
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _getPrototypeOf = __webpack_require__(20), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(21), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(27), _createClass3 = _interopRequireDefault(_createClass2), _possibleConstructorReturn2 = __webpack_require__(23), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(22), _inherits3 = _interopRequireDefault(_inherits2), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactRedux = __webpack_require__(35), _reactMixin = __webpack_require__(43), _reactMixin2 = _interopRequireDefault(_reactMixin), _shared = __webpack_require__(26), _mixins = __webpack_require__(29), _config = __webpack_require__(56), _config2 = _interopRequireDefault(_config), _utils = __webpack_require__(17), _reactAddonsCssTransitionGroup = __webpack_require__(286), _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup), _actions = __webpack_require__(36), actions = _interopRequireWildcard(_actions), _index = __webpack_require__(315), _event = __webpack_require__(313), _event2 = _interopRequireDefault(_event), EventTimeline = function(_PureRenderComponent) {
function EventTimeline() {
return (0, _classCallCheck3.default)(this, EventTimeline), (0, _possibleConstructorReturn3.default)(this, (EventTimeline.__proto__ || (0, 
_getPrototypeOf2.default)(EventTimeline)).apply(this, arguments));
}
return (0, _inherits3.default)(EventTimeline, _PureRenderComponent), (0, _createClass3.default)(EventTimeline, [ {
key: "handleEventDayClick",
value: function handleEventDayClick(key, e) {
var classes = e.target.attributes.getNamedItem("class").value;
0 != classes.indexOf("phq") && 0 != classes.indexOf("day") || this.props.dispatch(actions.ui.selectPopupDay(key));
}
}, {
key: "handleEventViewAllClick",
value: function handleEventViewAllClick(key) {
if (this.props.user.guest) this.props.dispatch(actions.ui.showSignUpForMoreEventsPopup(!0)); else {
var categories = _config2.default.event.categories.join(","), tracking = "utm_source=chrome&utm_medium=extension&utm_campaign=event.view_all", url = "https://app.predicthq.com/events/?sort=rank&categories=" + categories + "&ranks=level2,level3,level4,level5&from=" + key + "&to=" + key + "&places=" + this.props.user.location.id + "&" + tracking;
window.open(url, "_blank");
}
}
}, {
key: "renderEventPopup",
value: function renderEventPopup(key) {
var popup_day = this.props.popup_day;
if (key == popup_day) {
var events = this.props.events.items[popup_day];
if (null == events) {
var self = this;
return setTimeout(function() {
self.props.dispatch(actions.ui.selectPopupDay(null));
}), _react2.default.createElement("div", null);
}
var event_list = _utils._.map(events.top_events.results, function(event) {
return _react2.default.createElement(_event2.default, {
key: event.id,
event: event
});
}), freeTrialButton = _react2.default.createElement("a", {
href: _config2.default.phq.signUpUrl,
className: "btn free-trial"
}, "Free Trial");
return _react2.default.createElement("div", {
className: "event-alert-popup popup menu"
}, _react2.default.createElement("div", {
onClick: this.handleClosePopupClick.bind(this),
className: "x"
}), _react2.default.createElement("div", {
className: "popup-header"
}, _react2.default.createElement("div", {
className: "event-alert-title"
}, "EVENT ALERTS")), _react2.default.createElement("div", {
className: "event-alerts-list"
}, event_list), _react2.default.createElement("div", {
className: "event-alerts-footer popup-footer"
}, _react2.default.createElement("p", {
onClick: this.handleEventViewAllClick.bind(this, key),
className: "view-all"
}, "View all ", events.count, " ", _utils._.pluralize("event", events.count)), this.props.user.guest ? freeTrialButton : null));
}
}
}, {
key: "getAllowedDaysAhead",
value: function getAllowedDaysAhead() {
var guest = 4;
if (this.props.user.orgs) {
var org = (0, _index.getActiveOrg)(this.props.user);
if (org && org.hasOwnProperty("subscriptions") && org.subscriptions.hasOwnProperty("app_subscription")) {
if (null == org.subscriptions.app_subscription) return guest;
var visibility = org.subscriptions.app_subscription.quotas.visibility;
return null == visibility ? 999 : visibility;
}
}
return guest;
}
}, {
key: "handleEventTimelineArrowClick",
value: function handleEventTimelineArrowClick(direction) {
var allowedDaysAhead = this.getAllowedDaysAhead();
console.info("allowedDaysAhead", allowedDaysAhead);
var daysAhead = Math.round((moment(this.props.current_day).diff(moment(), "hours") + 1) / 24);
return daysAhead += "prev" == direction ? -1 : 1, Math.abs(daysAhead) > allowedDaysAhead ? void this.props.dispatch(actions.ui.showSignUpForMoreEventsPopup(!0)) : (this.props.popup_day && this.props.dispatch(actions.ui.selectPopupDay(null)), 
void ("prev" == direction ? this.props.dispatch(actions.ui.moveTimelineBackwards()) : this.props.dispatch(actions.ui.moveTimelineForwards())));
}
}, {
key: "renderTimelineArrow",
value: function renderTimelineArrow(direction) {
return _react2.default.createElement("div", {
onClick: this.handleEventTimelineArrowClick.bind(this, direction),
className: "timeline-" + direction
});
}
}, {
key: "render",
value: function render() {
var _this2 = this, events = this.props.events, time = moment(this.props.time), current_day = this.getTimeWithUserZone(this.props.current_day), start = current_day.clone().subtract(4, "days"), timeline = _utils._.map(_utils._.range(0, 7), function() {
var day = start.add(1, "days"), key = day.format("YYYY-MM-DD"), day_events = events.items.hasOwnProperty(key) ? events.items[key] : {
count: 0
}, popup = _this2.renderEventPopup(key), clickHandler = day_events.count > 0 ? _this2.handleEventDayClick.bind(_this2, key) : null, topRankLevelLabel = _utils._.findLastIndex(_utils._.values(day_events.rank_levels), function(item) {
return item > 0;
}) + 1;
topRankLevelLabel = 0 == topRankLevelLabel ? "empty" : "phq" + topRankLevelLabel;
var eventCount = _utils._.pluralize("event", day_events.count, !0), dayPeriodLabel = time.format("MMM") == day.format("MMM") ? day.format("ddd Do") : day.format("ddd Do MMM");
return _react2.default.createElement("div", {
className: "day",
key: key
}, _react2.default.createElement("div", {
onClick: clickHandler,
className: "day-marker " + topRankLevelLabel
}, _react2.default.createElement("span", {
className: "phq"
}), popup), _react2.default.createElement("h3", {
onClick: clickHandler,
className: "day-period"
}, dayPeriodLabel), _react2.default.createElement("p", {
className: "day-count"
}, eventCount));
}), next = this.renderTimelineArrow("next"), previous = this.renderTimelineArrow("prev");
return _react2.default.createElement("div", {
className: "event-timeline"
}, _react2.default.createElement("div", {
className: "event-line"
}), _react2.default.createElement("div", {
className: "event-days"
}, _react2.default.createElement(_reactAddonsCssTransitionGroup2.default, {
transitionName: "tt",
transitionEnterTimeout: 800,
transitionLeaveTimeout: 600
}, timeline)), previous, next);
}
} ]), EventTimeline;
}(_shared.PureRenderComponent);
_reactMixin2.default.onClass(EventTimeline, _mixins.CommonMixin), exports.default = (0, 
_reactRedux.connect)()(EventTimeline);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _getPrototypeOf = __webpack_require__(20), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(21), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(27), _createClass3 = _interopRequireDefault(_createClass2), _possibleConstructorReturn2 = __webpack_require__(23), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(22), _inherits3 = _interopRequireDefault(_inherits2), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _shared = __webpack_require__(26), _class = function(_PureRenderComponent) {
function _class() {
return (0, _classCallCheck3.default)(this, _class), (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || (0, 
_getPrototypeOf2.default)(_class)).apply(this, arguments));
}
return (0, _inherits3.default)(_class, _PureRenderComponent), (0, _createClass3.default)(_class, [ {
key: "render",
value: function render() {
return _react2.default.createElement("div", {
className: "footer"
}, _react2.default.createElement("div", {
className: "powered-by"
}, "Powered by ", _react2.default.createElement("a", {
href: "https://www.predicthq.com?utm_source=chrome&utm_medium=extension&utm_campaign=powered_by",
target: "_blank",
className: "logo"
})));
}
} ]), _class;
}(_shared.PureRenderComponent);
exports.default = _class;
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireWildcard(obj) {
if (obj && obj.__esModule) return obj;
var newObj = {};
if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
return newObj.default = obj, newObj;
}
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _slicedToArray2 = __webpack_require__(534), _slicedToArray3 = _interopRequireDefault(_slicedToArray2), _getPrototypeOf = __webpack_require__(20), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(21), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(27), _createClass3 = _interopRequireDefault(_createClass2), _possibleConstructorReturn2 = __webpack_require__(23), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(22), _inherits3 = _interopRequireDefault(_inherits2), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactRedux = __webpack_require__(35), _reactMixin = __webpack_require__(43), _reactMixin2 = _interopRequireDefault(_reactMixin), _shared = __webpack_require__(26), _mixins = __webpack_require__(29);
__webpack_require__(492);
var _reactIcheck = __webpack_require__(1003), _config = __webpack_require__(56), _actions = (_interopRequireDefault(_config), 
__webpack_require__(36)), actions = _interopRequireWildcard(_actions), _utils = __webpack_require__(17), _reactSelectize = __webpack_require__(445), Location = function(_PureRenderComponent) {
function Location() {
return (0, _classCallCheck3.default)(this, Location), (0, _possibleConstructorReturn3.default)(this, (Location.__proto__ || (0, 
_getPrototypeOf2.default)(Location)).apply(this, arguments));
}
return (0, _inherits3.default)(Location, _PureRenderComponent), (0, _createClass3.default)(Location, [ {
key: "handleLocationClick",
value: function handleLocationClick() {
this.props.dispatch(actions.ui.showLocationPopup(!this.props.popup_is_open));
}
}, {
key: "handleCountryChange",
value: function handleCountryChange(selected) {
var _selected$value$split = selected.value.split("|"), _selected$value$split2 = (0, 
_slicedToArray3.default)(_selected$value$split, 2), countryCode = _selected$value$split2[0], country = _selected$value$split2[1], location = {
name: null,
country: country,
countryCode: countryCode,
id: null
};
this.props.dispatch(actions.user.updateLocation(location));
}
}, {
key: "handleLocationChange",
value: function handleLocationChange(selected) {
var _selected$value$split3 = selected.value.split("|"), _selected$value$split4 = (0, 
_slicedToArray3.default)(_selected$value$split3, 3), id = _selected$value$split4[0], name = _selected$value$split4[1], country = _selected$value$split4[2], location = {
id: id,
name: name,
country: country,
countryCode: null
};
this.props.dispatch(actions.user.updateLocation(location)), this.props.dispatch(actions.ui.closePopups());
}
}, {
key: "handleTimezoneChange",
value: function handleTimezoneChange(selected) {
var tz = selected.value, location = {
tz: tz
};
this.props.dispatch(actions.user.updateLocation(location));
}
}, {
key: "handleTimeFormatChange",
value: function handleTimeFormatChange(enableTwelveHours) {
this.props.dispatch(actions.user.updateTimeFormat(enableTwelveHours));
}
}, {
key: "renderLocationSelect",
value: function renderLocationSelect() {
var myLocation = this.getMyLocationAsLabel(), self = this;
return _react2.default.createElement(_reactSelectize.SimpleSelect, {
placeholder: myLocation,
onValueChange: this.handleLocationChange.bind(this),
onSearchChange: function onSearchChange(q) {
q.length > 0 && self.props.dispatch(actions.places.search(q));
},
filterOptions: function filterOptions(results, search) {
return _utils._.filter(results, function(item) {
return console.info(item.label, search), _utils._.clean(item.label).indexOf(_utils._.clean(search)) > -1;
});
},
options: this.props.places.search,
renderOption: function renderOption(item) {
return _react2.default.createElement("div", {
className: "simple-option",
style: {
fontSize: 12
}
}, _react2.default.createElement("div", null, _react2.default.createElement("div", null, _react2.default.createElement("b", null, item.label)), _react2.default.createElement("div", null, item.region, ", ", item.country)));
}
});
}
}, {
key: "render",
value: function render() {
if (!this.props.user.location) return _react2.default.createElement("div", null);
var myLocation = this.getMyLocationAsLabel(), tz = (this.props.user.location.country, 
this.props.user.location.tz), locationPopup = null, now = moment().utc(), locationSelect = this.renderLocationSelect();
if (this.props.popup_is_open) {
var trialInfo = null, placeholder = tz ? tz.replace(/\_/g, " ") + " - " + now.tz(tz).format("h:mma") : null, isTwelveHourEnabled = this.props.user.hasOwnProperty("twelveHourClock") && this.props.user.twelveHourClock;
locationPopup = _react2.default.createElement("div", {
className: "location-popup popup menu " + (this.props.user.guest ? "" : "no-footer")
}, _react2.default.createElement("div", {
onClick: this.handleClosePopupClick.bind(this),
className: "x"
}), _react2.default.createElement("div", {
className: "popup-body"
}, _react2.default.createElement("ul", {
className: "form-row"
}, _react2.default.createElement("li", null, _react2.default.createElement("label", null, "I'm mostly based in"), locationSelect), _react2.default.createElement("li", null, _react2.default.createElement("label", null, "Time zone"), _react2.default.createElement(_reactSelectize.SimpleSelect, {
placeholder: placeholder,
onValueChange: this.handleTimezoneChange.bind(this),
options: _utils._.map(this.props.timezones, function(t) {
return {
label: t.replace(/\_/g, " "),
value: t
};
})
})), _react2.default.createElement("li", {
className: "time-format"
}, _react2.default.createElement("label", null, "Time format display: "), _react2.default.createElement(_reactIcheck.Radio, {
onChange: this.handleTimeFormatChange.bind(this, !0),
checked: isTwelveHourEnabled,
name: "time",
radioClass: "iradio",
label: " 12hr",
value: "1"
}), _react2.default.createElement(_reactIcheck.Radio, {
name: "time",
onChange: this.handleTimeFormatChange.bind(this, !1),
checked: !isTwelveHourEnabled,
radioClass: "iradio",
label: " 24hr",
value: "0"
})))), trialInfo);
}
return _react2.default.createElement("div", null, locationPopup, _react2.default.createElement("div", {
onClick: this.handleLocationClick.bind(this),
className: "menu-holder my-location"
}, _react2.default.createElement("div", {
className: "menu-trigger city-country"
}, myLocation)));
}
} ]), Location;
}(_shared.PureRenderComponent);
Location.propTypes = {
popup_is_open: _react2.default.PropTypes.bool.isRequired,
user: _react2.default.PropTypes.object.isRequired,
countries: _react2.default.PropTypes.array.isRequired
}, _reactMixin2.default.onClass(Location, _mixins.CommonMixin), exports.default = (0, 
_reactRedux.connect)()(Location);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _getPrototypeOf = __webpack_require__(20), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(21), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(27), _createClass3 = _interopRequireDefault(_createClass2), _possibleConstructorReturn2 = __webpack_require__(23), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(22), _inherits3 = _interopRequireDefault(_inherits2), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _shared = __webpack_require__(26), _config = __webpack_require__(56), _config2 = _interopRequireDefault(_config), _class = function(_PureRenderComponent) {
function _class() {
return (0, _classCallCheck3.default)(this, _class), (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || (0, 
_getPrototypeOf2.default)(_class)).apply(this, arguments));
}
return (0, _inherits3.default)(_class, _PureRenderComponent), (0, _createClass3.default)(_class, [ {
key: "render",
value: function render() {
return _react2.default.createElement("form", {
id: "login",
method: "GET",
action: _config2.default.oauth.target + "/oauth2/authorize/"
}, _react2.default.createElement("input", {
type: "hidden",
name: "utm_source",
value: "chrome"
}), _react2.default.createElement("input", {
type: "hidden",
name: "utm_medium",
value: "extension"
}), _react2.default.createElement("input", {
type: "hidden",
name: "utm_campaign",
value: "oauth"
}), _react2.default.createElement("input", {
type: "hidden",
name: "client_id",
value: _config2.default.oauth.clientId
}), _react2.default.createElement("input", {
type: "hidden",
name: "scope",
value: _config2.default.oauth.scope
}), _react2.default.createElement("input", {
type: "hidden",
name: "redirect_uri",
value: _config2.default.oauth.redirectUri
}), _react2.default.createElement("input", {
type: "hidden",
name: "response_type",
value: _config2.default.oauth.responseType
}), _react2.default.createElement("input", {
id: "hint",
type: "hidden",
name: "hint",
value: "Login"
}));
}
} ]), _class;
}(_shared.PureRenderComponent);
exports.default = _class;
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireWildcard(obj) {
if (obj && obj.__esModule) return obj;
var newObj = {};
if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
return newObj.default = obj, newObj;
}
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _getPrototypeOf = __webpack_require__(20), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(21), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(27), _createClass3 = _interopRequireDefault(_createClass2), _possibleConstructorReturn2 = __webpack_require__(23), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(22), _inherits3 = _interopRequireDefault(_inherits2), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactRedux = __webpack_require__(35), _reactMixin = __webpack_require__(43), _reactMixin2 = _interopRequireDefault(_reactMixin), _shared = __webpack_require__(26), _mixins = __webpack_require__(29), _actions = __webpack_require__(36), actions = _interopRequireWildcard(_actions), OrgPopup = function(_PureRenderComponent) {
function OrgPopup() {
return (0, _classCallCheck3.default)(this, OrgPopup), (0, _possibleConstructorReturn3.default)(this, (OrgPopup.__proto__ || (0, 
_getPrototypeOf2.default)(OrgPopup)).apply(this, arguments));
}
return (0, _inherits3.default)(OrgPopup, _PureRenderComponent), (0, _createClass3.default)(OrgPopup, [ {
key: "handleOrgClick",
value: function handleOrgClick(id) {
this.props.dispatch(actions.user.updateDefaultOrg(id)), this.props.dispatch(actions.ui.showOrgPopup(!1));
}
}, {
key: "handleCloseOrgPopupClick",
value: function handleCloseOrgPopupClick() {
this.props.dispatch(actions.ui.showOrgPopup(!1));
}
}, {
key: "renderOrg",
value: function renderOrg(org) {
var industry = null;
return org.account.industry && org.account.industry.hasOwnProperty("name") && (industry = _react2.default.createElement("span", {
className: "industry"
}, org.account.industry.name)), _react2.default.createElement("div", {
className: "organization",
onClick: this.handleOrgClick.bind(this, org.account.id),
key: org.account.id
}, _react2.default.createElement("img", {
src: "https://cdn-avatars.predicthq.com/avatars/accounts/" + org.account.id + "/64x64/"
}), _react2.default.createElement("div", {
className: "organization-info"
}, _react2.default.createElement("h3", null, org.account.name), _react2.default.createElement("p", {
className: "desc"
}, org.account.description), industry));
}
}, {
key: "render",
value: function render() {
if (!this.props.popup_is_open) return _react2.default.createElement("div", null);
var closeButton = null;
return null != this.props.user.default_org && (closeButton = _react2.default.createElement("div", {
onClick: this.handleCloseOrgPopupClick.bind(this),
className: "x"
})), _react2.default.createElement("div", null, _react2.default.createElement("div", {
className: "modal-overlay"
}), _react2.default.createElement("div", {
className: "popup org-picker"
}, _react2.default.createElement("div", {
className: "popup-header"
}, _react2.default.createElement("b", null, "Select Organisation"), closeButton), _react2.default.createElement("div", {
className: "popup-body"
}, _.map(this.props.orgs, this.renderOrg.bind(this)))));
}
} ]), OrgPopup;
}(_shared.PureRenderComponent);
OrgPopup.propTypes = {
popup_is_open: _react2.default.PropTypes.bool.isRequired,
user: _react2.default.PropTypes.object.isRequired
}, _reactMixin2.default.onClass(OrgPopup, _mixins.CommonMixin), exports.default = (0, 
_reactRedux.connect)()(OrgPopup);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireWildcard(obj) {
if (obj && obj.__esModule) return obj;
var newObj = {};
if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
return newObj.default = obj, newObj;
}
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _getPrototypeOf = __webpack_require__(20), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(21), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(27), _createClass3 = _interopRequireDefault(_createClass2), _possibleConstructorReturn2 = __webpack_require__(23), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(22), _inherits3 = _interopRequireDefault(_inherits2), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactRedux = __webpack_require__(35), _reactMixin = __webpack_require__(43), _reactMixin2 = _interopRequireDefault(_reactMixin), _shared = __webpack_require__(26), _mixins = __webpack_require__(29), _actions = __webpack_require__(36), actions = _interopRequireWildcard(_actions), Profile = function(_PureRenderComponent) {
function Profile() {
return (0, _classCallCheck3.default)(this, Profile), (0, _possibleConstructorReturn3.default)(this, (Profile.__proto__ || (0, 
_getPrototypeOf2.default)(Profile)).apply(this, arguments));
}
return (0, _inherits3.default)(Profile, _PureRenderComponent), (0, _createClass3.default)(Profile, [ {
key: "handleProfileClick",
value: function handleProfileClick() {
1 == this.props.user.guest ? this.props.dispatch(actions.ui.showSignUpForMoreEventsPopup(!0)) : this.props.dispatch(actions.ui.showProfilePopup(!this.props.popup_is_open));
}
}, {
key: "handleLogout",
value: function handleLogout(e) {
e.preventDefault(), this.props.dispatch(actions.user.guest());
}
}, {
key: "handleSwitchOrgClick",
value: function handleSwitchOrgClick(e) {
e.preventDefault(), this.props.dispatch(actions.ui.showOrgPopup(!0));
}
}, {
key: "render",
value: function render() {
var profileLink = null;
if (1 == this.props.user.guest) profileLink = _react2.default.createElement("div", {
className: "profile",
onClick: this.handleProfileClick.bind(this)
}, _react2.default.createElement("div", {
className: "guest"
})); else {
var avatarProfile = _react2.default.createElement("div", {
className: "initial"
}, _react2.default.createElement("p", null, this.props.user.account.first_name ? this.props.user.account.first_name[0] : "", this.props.user.account.last_name ? this.props.user.account.last_name[0] : ""));
if (this.props.user.account.avatar_url) {
var avatarUrl = "https://cdn-avatars.predicthq.com/v1/avatars/users/" + this.props.user.account.id + "/128x128/";
avatarProfile = _react2.default.createElement("img", {
src: "" + avatarUrl
});
}
profileLink = _react2.default.createElement("div", {
className: "profile",
onClick: this.handleProfileClick.bind(this)
}, avatarProfile);
}
if (!this.props.popup_is_open) return profileLink;
var defaultOrganisation = null;
return this.props.user.default_org && (defaultOrganisation = _react2.default.createElement("span", {
className: "h5"
}, this.props.user.orgs[this.props.user.default_org].account.name)), _react2.default.createElement("div", null, profileLink, _react2.default.createElement("div", {
className: "profile",
onClick: this.handleProfileClick.bind(this)
}), _react2.default.createElement("div", {
className: "profile-popup popup"
}, _react2.default.createElement("div", {
className: "popup-header"
}, _react2.default.createElement("div", {
className: "name"
}, this.props.user.account.first_name, " ", this.props.user.account.last_name), defaultOrganisation), _react2.default.createElement("div", {
className: "popup-body"
}, _react2.default.createElement("ul", null, _react2.default.createElement("li", null, _react2.default.createElement("a", {
href: "https://app.predicthq.com"
}, "Web App")), _react2.default.createElement("li", null, _react2.default.createElement("a", {
href: "https://app.predicthq.com/my/"
}, "My account")), _react2.default.createElement("li", null, _react2.default.createElement("a", {
href: "https://app.predicthq.com/settings/"
}, "Settings")), _react2.default.createElement("li", null, _react2.default.createElement("a", {
href: "https://support.predicthq.com"
}, "Support")), _react2.default.createElement("li", null, _react2.default.createElement("a", {
href: "https://www.predicthq.com/why"
}, "About PredictHQ")))), _react2.default.createElement("div", {
className: "switch-org"
}, _react2.default.createElement("ul", null, _react2.default.createElement("li", null, _react2.default.createElement("a", {
href: "#",
onClick: this.handleSwitchOrgClick.bind(this)
}, "Switch organisation")))), _react2.default.createElement("div", {
className: "popup-footer"
}, _react2.default.createElement("a", {
href: "#",
onClick: this.handleLogout.bind(this)
}, "Logout"))));
}
} ]), Profile;
}(_shared.PureRenderComponent);
Profile.propTypes = {
popup_is_open: _react2.default.PropTypes.bool.isRequired,
user: _react2.default.PropTypes.object.isRequired
}, _reactMixin2.default.onClass(Profile, _mixins.CommonMixin), exports.default = (0, 
_reactRedux.connect)()(Profile);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _getPrototypeOf = __webpack_require__(20), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(21), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(27), _createClass3 = _interopRequireDefault(_createClass2), _possibleConstructorReturn2 = __webpack_require__(23), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(22), _inherits3 = _interopRequireDefault(_inherits2), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactRedux = __webpack_require__(35), _reactMixin = __webpack_require__(43), _reactMixin2 = _interopRequireDefault(_reactMixin), _config = __webpack_require__(56), _config2 = _interopRequireDefault(_config), _shared = __webpack_require__(26), _mixins = __webpack_require__(29), _index = __webpack_require__(315), SignUpPopup = function(_PureRenderComponent) {
function SignUpPopup() {
return (0, _classCallCheck3.default)(this, SignUpPopup), (0, _possibleConstructorReturn3.default)(this, (SignUpPopup.__proto__ || (0, 
_getPrototypeOf2.default)(SignUpPopup)).apply(this, arguments));
}
return (0, _inherits3.default)(SignUpPopup, _PureRenderComponent), (0, _createClass3.default)(SignUpPopup, [ {
key: "handleViewPlanClick",
value: function handleViewPlanClick() {
var url = "https://www.predicthq.com/pricing/app", org = (0, _index.getActiveOrg)(this.props.user);
org && org.groups.indexOf("admin") >= 0 && (url = "https://app.predicthq.com/org/plan/app"), 
window.open(url, "_blank");
}
}, {
key: "render",
value: function render() {
if (!this.props.popup_is_open) return _react2.default.createElement("div", null);
if (!this.props.user.guest) {
var msg = _react2.default.createElement("p", null, "To get more event visibility, please upgrade your web app plan."), org = (0, 
_index.getActiveOrg)(this.props.user);
return org && !org.subscriptions.hasOwnProperty("app_subscription") && (msg = _react2.default.createElement("p", null, "Please select a web app plan to get more event visibility. We recommend trialing our Premium plan which has the greatest visibility. All web app plans are totally free of charge until the end of our ", _react2.default.createElement("a", {
href: "https://www.predicthq.com/blog/web-app-free-trial-for-our-entire-beta-period/",
target: "_blank"
}, "Beta period"), ".")), _react2.default.createElement("div", null, _react2.default.createElement("div", {
className: "modal-overlay"
}), _react2.default.createElement("div", {
className: "popup signup-for-more-events"
}, _react2.default.createElement("div", {
onClick: this.handleClosePopupClick.bind(this),
className: "x"
}), _react2.default.createElement("div", {
className: "popup-body"
}, _react2.default.createElement("h1", null, "Upgrade to see more"), msg, _react2.default.createElement("div", {
onClick: this.handleViewPlanClick.bind(this),
className: "btn lg strong pink free-trial"
}, "View Plans"))));
}
return _react2.default.createElement("div", null, _react2.default.createElement("div", {
className: "modal-overlay"
}), _react2.default.createElement("div", {
className: "popup signup-for-more-events"
}, _react2.default.createElement("div", {
onClick: this.handleClosePopupClick.bind(this),
className: "x"
}), _react2.default.createElement("div", {
className: "popup-body"
}, _react2.default.createElement("h1", null, "Sign up to see more"), _react2.default.createElement("p", null, "PredictHQ is an event intelligence platform that combines real world events into one global source of truth to help businesses better understand demand and plan for the future."), _react2.default.createElement("p", null, "If you’re keen to see more events in the future or past, sign up for an API license and use our Control Center search or API to see more events."), _react2.default.createElement("a", {
href: _config2.default.phq.signUpUrl,
className: "btn lg strong pink free-trial"
}, "Try for free"), _react2.default.createElement("a", {
className: "continue-as-guest",
href: "#",
onClick: this.handleClosePopupClick.bind(this)
}, "No thanks, continue as is")), _react2.default.createElement("div", {
className: "popup-footer"
}, _react2.default.createElement("div", {
className: "popup-footer-left"
}, _react2.default.createElement("p", null, "Already have a PredictHQ Account? "), _react2.default.createElement("a", {
href: _config2.default.phq.controlCentreUrl,
className: "btn strong"
}, "Login")), _react2.default.createElement("div", {
className: "popup-footer-right"
}))));
}
} ]), SignUpPopup;
}(_shared.PureRenderComponent);
SignUpPopup.propTypes = {
user: _react2.default.PropTypes.object,
popup_is_open: _react2.default.PropTypes.bool.isRequired
}, _reactMixin2.default.onClass(SignUpPopup, _mixins.CommonMixin), exports.default = (0, 
_reactRedux.connect)()(SignUpPopup);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireWildcard(obj) {
if (obj && obj.__esModule) return obj;
var newObj = {};
if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
return newObj.default = obj, newObj;
}
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _getPrototypeOf = __webpack_require__(20), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(21), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(27), _createClass3 = _interopRequireDefault(_createClass2), _possibleConstructorReturn2 = __webpack_require__(23), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(22), _inherits3 = _interopRequireDefault(_inherits2), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactRedux = __webpack_require__(35), _reactMixin = __webpack_require__(43), _reactMixin2 = _interopRequireDefault(_reactMixin), _shared = __webpack_require__(26), _mixins = __webpack_require__(29), _utils = __webpack_require__(17), _config = __webpack_require__(56), _config2 = _interopRequireDefault(_config), _actions = __webpack_require__(36), actions = _interopRequireWildcard(_actions), UpgradeMsg = function(_PureRenderComponent) {
function UpgradeMsg() {
return (0, _classCallCheck3.default)(this, UpgradeMsg), (0, _possibleConstructorReturn3.default)(this, (UpgradeMsg.__proto__ || (0, 
_getPrototypeOf2.default)(UpgradeMsg)).apply(this, arguments));
}
return (0, _inherits3.default)(UpgradeMsg, _PureRenderComponent), (0, _createClass3.default)(UpgradeMsg, [ {
key: "handleCloseUpgradeMsgClick",
value: function handleCloseUpgradeMsgClick() {
this.props.dispatch(actions.ui.removeUpgradeMsg());
}
}, {
key: "handleOfferFeedbackClick",
value: function handleOfferFeedbackClick() {
window.location.href = "https://www.predicthq.com/blog/focus-general-feedback/";
}
}, {
key: "render",
value: function render() {
if (!this.props.upgrade || null == this.props.upgrade.details) return _react2.default.createElement("div", null);
var upgrades = null;
return _config2.default.upgrades.hasOwnProperty(this.props.upgrade.details.now) && (upgrades = _config2.default.upgrades[this.props.upgrade.details.now], 
upgrades = _react2.default.createElement("div", null, _react2.default.createElement("h4", null, "What's new"), _react2.default.createElement("ul", null, _utils._.map(upgrades, function(msg, n) {
return _react2.default.createElement("li", {
key: n,
dangerouslySetInnerHTML: {
__html: msg
}
});
})))), _react2.default.createElement("div", {
className: "popup upgrade"
}, _react2.default.createElement("div", {
className: "popup-header"
}, "FOCUS Updated", _react2.default.createElement("div", {
onClick: this.handleCloseUpgradeMsgClick.bind(this),
className: "x"
})), _react2.default.createElement("div", {
className: "popup-body"
}, _react2.default.createElement("p", null, "Hi there, we just updated from ", _react2.default.createElement("b", null, this.props.upgrade.details.prev), " to ", _react2.default.createElement("b", null, this.props.upgrade.details.now), _react2.default.createElement("br", null), "Stay Ahead of the Curve with PredictHQ."), upgrades, _react2.default.createElement("div", {
onClick: this.handleCloseUpgradeMsgClick.bind(this),
className: "btn pink "
}, "Ok, got it!"), _react2.default.createElement("div", {
onClick: this.handleOfferFeedbackClick.bind(this),
className: "btn feedback "
}, "Offer feedback")));
}
} ]), UpgradeMsg;
}(_shared.PureRenderComponent);
UpgradeMsg.propTypes = {
upgrade: _react2.default.PropTypes.object
}, _reactMixin2.default.onClass(UpgradeMsg, _mixins.CommonMixin), exports.default = (0, 
_reactRedux.connect)()(UpgradeMsg);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireWildcard(obj) {
if (obj && obj.__esModule) return obj;
var newObj = {};
if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
return newObj.default = obj, newObj;
}
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _getPrototypeOf = __webpack_require__(20), _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf), _classCallCheck2 = __webpack_require__(21), _classCallCheck3 = _interopRequireDefault(_classCallCheck2), _createClass2 = __webpack_require__(27), _createClass3 = _interopRequireDefault(_createClass2), _possibleConstructorReturn2 = __webpack_require__(23), _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2), _inherits2 = __webpack_require__(22), _inherits3 = _interopRequireDefault(_inherits2), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactRedux = __webpack_require__(35), _reactMixin = __webpack_require__(43), _reactMixin2 = _interopRequireDefault(_reactMixin), _shared = __webpack_require__(26), _mixins = __webpack_require__(29), _utils = __webpack_require__(17), _actions = __webpack_require__(36), actions = _interopRequireWildcard(_actions), Welcome = function(_PureRenderComponent) {
function Welcome() {
return (0, _classCallCheck3.default)(this, Welcome), (0, _possibleConstructorReturn3.default)(this, (Welcome.__proto__ || (0, 
_getPrototypeOf2.default)(Welcome)).apply(this, arguments));
}
return (0, _inherits3.default)(Welcome, _PureRenderComponent), (0, _createClass3.default)(Welcome, [ {
key: "getGreetingTime",
value: function getGreetingTime(m) {
if (m && m.isValid()) {
var split_afternoon = 12, split_evening = 17, currentHour = parseFloat(m.format("HH"));
return currentHour >= split_afternoon && currentHour <= split_evening ? "afternoon" : currentHour >= split_evening ? "evening" : "morning";
}
}
}, {
key: "isOnSystemTimeZone",
value: function isOnSystemTimeZone() {
return !(null != this.props.user.location && this.props.user.location.hasOwnProperty("tz") && this.props.user.location.hasOwnProperty("tzSystem") && this.props.user.location.tz != this.props.user.location.tzSystem);
}
}, {
key: "handleTimeClick",
value: function handleTimeClick() {
this.props.dispatch(actions.ui.resetTimeline());
}
}, {
key: "renderTimeAndLocation",
value: function renderTimeAndLocation(twelveHourEnabled) {
var currentTime = this.getTimeWithUserZone(this.props.time), time = currentTime.format(twelveHourEnabled ? "h:mm" : "H:mm"), timePrefix = twelveHourEnabled ? currentTime.format("A") : "", date = currentTime.format("ddd Do MMM");
return _react2.default.createElement("div", {
className: "hexagon-container"
}, _react2.default.createElement("div", {
id: "hexagon",
className: "hexagon"
}, _react2.default.createElement("div", {
onClick: this.handleTimeClick.bind(this),
className: "date"
}, date), _react2.default.createElement("div", {
onClick: this.handleTimeClick.bind(this),
className: "time " + (twelveHourEnabled ? "time-12" : "")
}, time, " ", _react2.default.createElement("span", {
className: "time-prefix"
}, timePrefix)), _react2.default.createElement("div", {
className: "timezone"
}, this.isOnSystemTimeZone() ? "" : this.getCurrentTimeZone())), _react2.default.createElement("div", {
className: "shadow"
}));
}
}, {
key: "handleGuestClick",
value: function handleGuestClick() {
this.props.dispatch(actions.user.guest());
}
}, {
key: "render",
value: function render() {
var _this2 = this, user = this.props.user, twelveHourEnabled = this.props.user.hasOwnProperty("twelveHourClock") && this.props.user.twelveHourClock, timeAndLocation = this.renderTimeAndLocation(twelveHourEnabled), greeting = this.getGreetingTime(moment(this.props.time)), yesterday = moment(this.props.time).subtract(1, "days"), futureDays = _utils._.filter(_utils._.keys(this.props.events.items), function(d) {
return moment(d).isAfter(yesterday);
}), eventTotal = _utils._.reduce(futureDays, function(sum, d) {
return _this2.props.events.items[d].count + sum;
}, 0);
return user.account ? _react2.default.createElement("div", {
id: "welcome",
className: "welcome"
}, _react2.default.createElement("div", {
className: "shadow-text"
}), _react2.default.createElement("h1", null, "Good ", greeting, ", ", user.account.first_name), _react2.default.createElement("h2", null, _react2.default.createElement("strong", null, eventTotal), " event alerts in", _react2.default.createElement("strong", null, " ", this.getMyLocationAsLabel(!0)), _react2.default.createElement("span", null, " to focus on")), timeAndLocation) : 0 == user.guest ? _react2.default.createElement("div", {
id: "welcome",
className: "welcome"
}, _react2.default.createElement("div", {
className: "greeting"
}, _react2.default.createElement("div", {
className: "Focus"
}), _react2.default.createElement("h1", null, "Welcome. Let's get started"), _react2.default.createElement("div", {
className: "sign-up-box"
}, _react2.default.createElement("div", {
className: "content"
}, _react2.default.createElement("div", {
onClick: this.handleSignupClick.bind(this),
className: "btn xl strong pink"
}, "Sign up for free"), _react2.default.createElement("div", {
onClick: this.handleGuestClick.bind(this),
className: "btn xl"
}, "Continue without an account")), _react2.default.createElement("footer", null, _react2.default.createElement("p", null, "Already have a PredictHQ Account?"), _react2.default.createElement("div", {
onClick: this.handleLoginClick.bind(this),
className: "btn strong"
}, "Login"))))) : _react2.default.createElement("div", {
id: "welcome",
className: "welcome"
}, _react2.default.createElement("h1", {
className: "msg"
}, "Good ", greeting), _react2.default.createElement("h2", null, _react2.default.createElement("strong", null, eventTotal), " event alerts in ", _react2.default.createElement("strong", null, this.getMyLocationAsLabel(!0)), " to focus on"), timeAndLocation);
}
} ]), Welcome;
}(_shared.PureRenderComponent);
_reactMixin2.default.onClass(Welcome, _mixins.CommonMixin), exports.default = (0, 
_reactRedux.connect)()(Welcome);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.defaultState = void 0;
var _utils = __webpack_require__(17), _redux = __webpack_require__(146), _index = __webpack_require__(314), _index2 = _interopRequireDefault(_index), _moment = __webpack_require__(25), _moment2 = _interopRequireDefault(_moment), _countryData = __webpack_require__(368), _timezones = __webpack_require__(499), _timezones2 = _interopRequireDefault(_timezones), countryList = _utils._.map(_countryData.countries.all, function(item) {
return [ item.alpha2, item.name ];
}), defaultState = {
user: {
guest: !0,
account: null,
orgs: null,
default_org: null,
token: null,
location: null,
default_location: null,
invalid_login: null,
lastCheck: null,
lastCheckStatus: null,
twelveHourClock: null
},
timezones: _timezones2.default,
countries: [ [ "", "" ] ].concat(countryList),
places: {
search: []
},
ui_state: {
popup_day: !1,
popup_org_picker: !1,
popup_profile: !1,
popup_location: !1,
popup_background_event: !1,
popup_signup_for_more_events: !1,
current_day: (0, _moment2.default)().format(),
upgrade: null
},
events: {
lastCheck: null,
lastCheckStatus: null,
items: {}
},
tasks: [],
backgrounds: {
lastCheck: null,
lastCheckStatus: null,
items: {},
fallback: [ "bg.jpg" ]
},
time: (0, _moment2.default)().format(),
time_extra: 0
};
(0, _redux.createStore)(_index2.default, defaultState);
exports.defaultState = defaultState;
}, , function(module, exports, __webpack_require__) {
module.exports = {
"default": __webpack_require__(537),
__esModule: !0
};
}, function(module, exports, __webpack_require__) {
module.exports = {
"default": __webpack_require__(538),
__esModule: !0
};
}, [ 1133, 540 ], [ 1136, 543 ], [ 1137, 544 ], [ 1138, 545 ], function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
exports.__esModule = !0;
var _defineProperty = __webpack_require__(318), _defineProperty2 = _interopRequireDefault(_defineProperty);
exports.default = function(obj, key, value) {
return key in obj ? (0, _defineProperty2.default)(obj, key, {
value: value,
enumerable: !0,
configurable: !0,
writable: !0
}) : obj[key] = value, obj;
};
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
exports.__esModule = !0;
var _isIterable2 = __webpack_require__(528), _isIterable3 = _interopRequireDefault(_isIterable2), _getIterator2 = __webpack_require__(527), _getIterator3 = _interopRequireDefault(_getIterator2);
exports.default = function() {
function sliceIterator(arr, i) {
var _arr = [], _n = !0, _d = !1, _e = void 0;
try {
for (var _s, _i = (0, _getIterator3.default)(arr); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), 
!i || _arr.length !== i); _n = !0) ;
} catch (err) {
_d = !0, _e = err;
} finally {
try {
!_n && _i.return && _i.return();
} finally {
if (_d) throw _e;
}
}
return _arr;
}
return function(arr, i) {
if (Array.isArray(arr)) return arr;
if ((0, _isIterable3.default)(Object(arr))) return sliceIterator(arr, i);
throw new TypeError("Invalid attempt to destructure non-iterable instance");
};
}();
}, function(module, exports, __webpack_require__) {
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
/*!
	  Copyright (c) 2017 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
!function() {
"use strict";
function classNames() {
for (var classes = [], i = 0; i < arguments.length; i++) {
var arg = arguments[i];
if (arg) {
var argType = typeof arg;
if ("string" === argType || "number" === argType) classes.push(arg); else if (Array.isArray(arg) && arg.length) {
var inner = classNames.apply(null, arg);
inner && classes.push(inner);
} else if ("object" === argType) for (var key in arg) hasOwn.call(arg, key) && arg[key] && classes.push(key);
}
}
return classes.join(" ");
}
var hasOwn = {}.hasOwnProperty;
"undefined" != typeof module && module.exports ? (classNames.default = classNames, 
module.exports = classNames) : (__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
return classNames;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), !(void 0 !== __WEBPACK_AMD_DEFINE_RESULT__ && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)));
}();
}, , function(module, exports, __webpack_require__) {
__webpack_require__(223), __webpack_require__(222), module.exports = __webpack_require__(564);
}, function(module, exports, __webpack_require__) {
__webpack_require__(223), __webpack_require__(222), module.exports = __webpack_require__(565);
}, function(module, exports, __webpack_require__) {
var core = __webpack_require__(30), $JSON = core.JSON || (core.JSON = {
stringify: JSON.stringify
});
module.exports = function stringify(it) {
return $JSON.stringify.apply($JSON, arguments);
};
}, [ 1142, 567, 30 ], [ 1143, 568, 30 ], [ 1144, 569, 30 ], [ 1145, 570, 30 ], [ 1146, 572, 571, 573, 574, 30 ], [ 1147, 222, 223, 221 ], 24, function(module, exports) {
module.exports = function() {};
}, [ 1152, 102, 562, 561 ], [ 1157, 212, 327, 213 ], [ 1160, 65 ], [ 1162, 208 ], [ 1164, 208 ], [ 1166, 211, 152, 214, 100, 57 ], 344, [ 1169, 153, 101, 78, 79, 120 ], [ 1174, 79, 98, 212, 77 ], [ 1176, 102, 326 ], [ 1181, 99, 30, 120 ], [ 1183, 101, 98, 321, 325 ], [ 1188, 217, 209 ], [ 1190, 217 ], [ 1192, 217 ], [ 1199, 320, 57, 121, 30 ], function(module, exports, __webpack_require__) {
var anObject = __webpack_require__(98), get = __webpack_require__(563);
module.exports = __webpack_require__(30).getIterator = function(it) {
var iterFn = get(it);
if ("function" != typeof iterFn) throw TypeError(it + " is not iterable!");
return anObject(iterFn.call(it));
};
}, function(module, exports, __webpack_require__) {
var classof = __webpack_require__(320), ITERATOR = __webpack_require__(57)("iterator"), Iterators = __webpack_require__(121);
module.exports = __webpack_require__(30).isIterable = function(it) {
var O = Object(it);
return void 0 !== O[ITERATOR] || "@@iterator" in O || Iterators.hasOwnProperty(classof(O));
};
}, [ 1200, 547, 554, 121, 102, 324 ], [ 1201, 99, 211 ], [ 1202, 99, 77, 79 ], [ 1203, 218, 328, 558 ], [ 1205, 99, 559 ], 418, [ 1208, 65, 78, 77, 99, 330, 555, 120, 216, 214, 153, 57, 221, 220, 549, 552, 98, 101, 218, 102, 219, 152, 211, 557, 325, 327, 79, 212, 326, 213, 151, 100 ], [ 1211, 220 ], [ 1212, 220 ], , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
"use strict";
var _ = __webpack_require__(307), regions = __webpack_require__(367), continents = {};
continents.asia = {
name: "Asia",
regions: [ "centralAsia", "southernAsia", "southeastAsia", "eastAsia", "westernAsia" ],
countries: _.flatten([ regions.centralAsia.countries, regions.southernAsia.countries, regions.southeastAsia.countries, regions.eastAsia.countries, regions.westernAsia.countries ]).sort()
}, continents.africa = {
name: "Africa",
regions: [ "centralAfrica", "northAfrica", "southernAfrica", "eastAfrica", "westAfrica" ],
countries: _.flatten([ regions.centralAfrica.countries, regions.northAfrica.countries, regions.southernAfrica.countries, regions.eastAfrica.countries, regions.westAfrica.countries ]).sort()
}, continents.northAmerica = {
name: "North America",
regions: [ "centralAmerica", "northernAmerica", "caribbean" ],
countries: _.flatten([ regions.centralAmerica.countries, regions.northernAmerica.countries, regions.caribbean.countries ]).sort()
}, continents.southAmerica = {
name: "South America",
regions: [ "southAmerica" ],
countries: _.flatten([ regions.southAmerica.countries ]).sort()
}, continents.antartica = {
name: "Antartica",
regions: [ "antartica" ],
countries: _.flatten([ regions.antartica.countries ]).sort()
}, continents.europe = {
name: "Europe",
regions: [ "northernEurope", "southernEurope", "easternEurope", "westernEurope" ],
countries: _.flatten([ regions.northernEurope.countries, regions.southernEurope.countries, regions.easternEurope.countries, regions.westernEurope.countries ]).sort()
}, continents.oceania = {
name: "Oceania",
regions: [ "australia", "melanesia", "micronesia", "polynesia" ],
countries: _.flatten([ regions.australia.countries, regions.melanesia.countries, regions.micronesia.countries, regions.polynesia.countries ]).sort()
}, module.exports = continents;
}, function(module, exports, __webpack_require__) {
function init(o) {
return {
countries: search.bind(null, o.countries),
currencies: search.bind(null, o.currencies),
languages: search.bind(null, o.languages)
};
}
function search(data, query) {
var q = _.pairs(query);
return data.filter(function(d) {
return q.filter(function(v) {
var prop = d[v[0]];
return _.isArray(prop) ? prop.indexOf(v[1]) >= 0 : prop == v[1];
}).length == q.length;
});
}
var _ = __webpack_require__(307);
module.exports = init;
}, function(module, exports, __webpack_require__) {
function mapSymbol(currencyCode) {
return map.hasOwnProperty(currencyCode) ? map[currencyCode] : "?";
}
module.exports = mapSymbol;
var map = __webpack_require__(777);
}, function(module, exports) {
module.exports = {
ALL: "L",
AFN: "؋",
ARS: "$",
AWG: "ƒ",
AUD: "$",
AZN: "₼",
BSD: "$",
BBD: "$",
BYR: "p.",
BZD: "BZ$",
BMD: "$",
BOB: "Bs.",
BAM: "KM",
BWP: "P",
BGN: "лв",
BRL: "R$",
BND: "$",
KHR: "៛",
CAD: "$",
KYD: "$",
CLP: "$",
CNY: "¥",
COP: "$",
CRC: "₡",
HRK: "kn",
CUP: "₱",
CZK: "Kč",
DKK: "kr",
DOP: "RD$",
XCD: "$",
EGP: "£",
SVC: "$",
EEK: "kr",
EUR: "€",
FKP: "£",
FJD: "$",
GHC: "¢",
GIP: "£",
GTQ: "Q",
GGP: "£",
GYD: "$",
HNL: "L",
HKD: "$",
HUF: "Ft",
ISK: "kr",
INR: "₹",
IDR: "Rp",
IRR: "﷼",
IMP: "£",
ILS: "₪",
JMD: "J$",
JPY: "¥",
JEP: "£",
KES: "KSh",
KZT: "лв",
KPW: "₩",
KRW: "₩",
KGS: "лв",
LAK: "₭",
LVL: "Ls",
LBP: "£",
LRD: "$",
LTL: "Lt",
MKD: "ден",
MYR: "RM",
MUR: "₨",
MXN: "$",
MNT: "₮",
MZN: "MT",
NAD: "$",
NPR: "₨",
ANG: "ƒ",
NZD: "$",
NIO: "C$",
NGN: "₦",
NOK: "kr",
OMR: "﷼",
PKR: "₨",
PAB: "B/.",
PYG: "Gs",
PEN: "S/.",
PHP: "₱",
PLN: "zł",
QAR: "﷼",
RON: "lei",
RUB: "₽",
SHP: "£",
SAR: "﷼",
RSD: "Дин.",
SCR: "₨",
SGD: "$",
SBD: "$",
SOS: "S",
ZAR: "R",
LKR: "₨",
SEK: "kr",
CHF: "CHF",
SRD: "$",
SYP: "£",
TZS: "TSh",
TWD: "NT$",
THB: "฿",
TTD: "TT$",
TRY: "",
TRL: "₤",
TVD: "$",
UGX: "USh",
UAH: "₴",
GBP: "£",
USD: "$",
UYU: "$U",
UZS: "лв",
VEF: "Bs",
VND: "₫",
YER: "﷼",
ZWD: "Z$"
};
}, function(module, exports, __webpack_require__) {
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;
// @license MIT
!function(name, definition) {
"undefined" != typeof module && module.exports ? module.exports = definition() : (__WEBPACK_AMD_DEFINE_FACTORY__ = definition, 
__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module) : __WEBPACK_AMD_DEFINE_FACTORY__, 
!(void 0 !== __WEBPACK_AMD_DEFINE_RESULT__ && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)));
}("Diacritics", function() {
for (var output = {
map: {}
}, reference = [ {
base: " ",
letters: " "
}, {
base: "A",
letters: "AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"
}, {
base: "AA",
letters: "Ꜳ"
}, {
base: "AE",
letters: "ÆǼǢ"
}, {
base: "AO",
letters: "Ꜵ"
}, {
base: "AU",
letters: "Ꜷ"
}, {
base: "AV",
letters: "ꜸꜺ"
}, {
base: "AY",
letters: "Ꜽ"
}, {
base: "B",
letters: "BⒷＢḂḄḆɃƂƁ"
}, {
base: "C",
letters: "CⒸＣĆĈĊČÇḈƇȻꜾ"
}, {
base: "D",
letters: "DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ"
}, {
base: "DZ",
letters: "ǱǄ"
}, {
base: "Dz",
letters: "ǲǅ"
}, {
base: "E",
letters: "EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ"
}, {
base: "F",
letters: "FⒻＦḞƑꝻ"
}, {
base: "G",
letters: "GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ"
}, {
base: "H",
letters: "HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"
}, {
base: "I",
letters: "IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"
}, {
base: "J",
letters: "JⒿＪĴɈ"
}, {
base: "K",
letters: "KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"
}, {
base: "L",
letters: "LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"
}, {
base: "LJ",
letters: "Ǉ"
}, {
base: "Lj",
letters: "ǈ"
}, {
base: "M",
letters: "MⓂＭḾṀṂⱮƜ"
}, {
base: "N",
letters: "NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ"
}, {
base: "NJ",
letters: "Ǌ"
}, {
base: "Nj",
letters: "ǋ"
}, {
base: "O",
letters: "OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"
}, {
base: "OI",
letters: "Ƣ"
}, {
base: "OO",
letters: "Ꝏ"
}, {
base: "OU",
letters: "Ȣ"
}, {
base: "P",
letters: "PⓅＰṔṖƤⱣꝐꝒꝔ"
}, {
base: "Q",
letters: "QⓆＱꝖꝘɊ"
}, {
base: "R",
letters: "RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ"
}, {
base: "S",
letters: "SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"
}, {
base: "T",
letters: "TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"
}, {
base: "Th",
letters: "Þ"
}, {
base: "TZ",
letters: "Ꜩ"
}, {
base: "U",
letters: "UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"
}, {
base: "V",
letters: "VⓋＶṼṾƲꝞɅ"
}, {
base: "VY",
letters: "Ꝡ"
}, {
base: "W",
letters: "WⓌＷẀẂŴẆẄẈⱲ"
}, {
base: "X",
letters: "XⓍＸẊẌ"
}, {
base: "Y",
letters: "YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"
}, {
base: "Z",
letters: "ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"
}, {
base: "a",
letters: "aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐɑ"
}, {
base: "aa",
letters: "ꜳ"
}, {
base: "ae",
letters: "æǽǣ"
}, {
base: "ao",
letters: "ꜵ"
}, {
base: "au",
letters: "ꜷ"
}, {
base: "av",
letters: "ꜹꜻ"
}, {
base: "ay",
letters: "ꜽ"
}, {
base: "b",
letters: "bⓑｂḃḅḇƀƃɓ"
}, {
base: "c",
letters: "cⓒｃćĉċčçḉƈȼꜿↄ"
}, {
base: "d",
letters: "dⓓｄḋďḍḑḓḏđƌɖɗꝺ"
}, {
base: "dz",
letters: "ǳǆ"
}, {
base: "e",
letters: "eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ"
}, {
base: "f",
letters: "fⓕｆḟƒꝼ"
}, {
base: "ff",
letters: "ﬀ"
}, {
base: "fi",
letters: "ﬁ"
}, {
base: "fl",
letters: "ﬂ"
}, {
base: "ffi",
letters: "ﬃ"
}, {
base: "ffl",
letters: "ﬄ"
}, {
base: "g",
letters: "gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ"
}, {
base: "h",
letters: "hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"
}, {
base: "hv",
letters: "ƕ"
}, {
base: "i",
letters: "iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"
}, {
base: "j",
letters: "jⓙｊĵǰɉ"
}, {
base: "k",
letters: "kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"
}, {
base: "l",
letters: "lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ"
}, {
base: "lj",
letters: "ǉ"
}, {
base: "m",
letters: "mⓜｍḿṁṃɱɯ"
}, {
base: "n",
letters: "nñnⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥлԉ"
}, {
base: "nj",
letters: "ǌ"
}, {
base: "o",
letters: "߀oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ"
}, {
base: "oe",
letters: "Œœ"
}, {
base: "oi",
letters: "ƣ"
}, {
base: "ou",
letters: "ȣ"
}, {
base: "oo",
letters: "ꝏ"
}, {
base: "p",
letters: "pⓟｐṕṗƥᵽꝑꝓꝕ"
}, {
base: "q",
letters: "qⓠｑɋꝗꝙ"
}, {
base: "r",
letters: "rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"
}, {
base: "s",
letters: "sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ"
}, {
base: "ss",
letters: "ß"
}, {
base: "t",
letters: "tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"
}, {
base: "th",
letters: "þ"
}, {
base: "tz",
letters: "ꜩ"
}, {
base: "u",
letters: "uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"
}, {
base: "v",
letters: "vⓥｖṽṿʋꝟʌ"
}, {
base: "vy",
letters: "ꝡ"
}, {
base: "w",
letters: "wⓦｗẁẃŵẇẅẘẉⱳ"
}, {
base: "x",
letters: "xⓧｘẋẍ"
}, {
base: "y",
letters: "yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"
}, {
base: "z",
letters: "zⓩｚźẑżžẓẕƶȥɀⱬꝣ"
} ], i = 0, refLength = reference.length; i < refLength; i++) for (var letters = reference[i].letters.split(""), j = 0, letLength = letters.length; j < letLength; j++) output.map[letters[j]] = reference[i].base;
return output.clean = function(input) {
if (!input || !input.length || input.length < 1) return "";
for (var letter, string = "", letters = input.split(""), index = 0, length = letters.length; index < length; index++) letter = letters[index], 
string += letter in output.map ? output.map[letter] : letter;
return string;
}, output;
});
}, function(module, exports, __webpack_require__) {
(function(process) {
"use strict";
module.exports = {
config: function(options) {
var path = ".env", encoding = "utf8", silent = !1;
options && (options.silent && (silent = options.silent), options.path && (path = options.path), 
options.encoding && (encoding = options.encoding));
try {
var parsedObj = this.parse(fs.readFileSync(path, {
encoding: encoding
}));
return Object.keys(parsedObj).forEach(function(key) {
process.env[key] = process.env[key] || parsedObj[key];
}), parsedObj;
} catch (e) {
return silent || console.error(e), !1;
}
},
parse: function(src) {
var obj = {};
return src.toString().split("\n").forEach(function(line) {
var keyValueArr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
if (null != keyValueArr) {
var key = keyValueArr[1], value = keyValueArr[2] ? keyValueArr[2] : "", len = value ? value.length : 0;
len > 0 && '"' === value.charAt(0) && '"' === value.charAt(len - 1) && (value = value.replace(/\\n/gm, "\n")), 
value = value.replace(/(^['"]|['"]$)/g, "").trim(), obj[key] = value;
}
}), obj;
}
}, module.exports.load = module.exports.config;
}).call(exports, __webpack_require__(74));
}, , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function isValidKey(key) {
return validKeys.indexOf(key) > -1;
}
function isFSA(action) {
return _lodashIsplainobject2.default(action) && "undefined" != typeof action.type && Object.keys(action).every(isValidKey);
}
function isError(action) {
return action.error === !0;
}
exports.__esModule = !0, exports.isFSA = isFSA, exports.isError = isError;
var _lodashIsplainobject = __webpack_require__(804), _lodashIsplainobject2 = _interopRequireDefault(_lodashIsplainobject), validKeys = [ "type", "payload", "error", "meta" ];
}, function(module, exports) {
"use strict";
var REACT_STATICS = {
childContextTypes: !0,
contextTypes: !0,
defaultProps: !0,
displayName: !0,
getDefaultProps: !0,
mixins: !0,
propTypes: !0,
type: !0
}, KNOWN_STATICS = {
name: !0,
length: !0,
prototype: !0,
caller: !0,
arguments: !0,
arity: !0
}, isGetOwnPropertySymbolsAvailable = "function" == typeof Object.getOwnPropertySymbols;
module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, customStatics) {
if ("string" != typeof sourceComponent) {
var keys = Object.getOwnPropertyNames(sourceComponent);
isGetOwnPropertySymbolsAvailable && (keys = keys.concat(Object.getOwnPropertySymbols(sourceComponent)));
for (var i = 0; i < keys.length; ++i) if (!(REACT_STATICS[keys[i]] || KNOWN_STATICS[keys[i]] || customStatics && customStatics[keys[i]])) try {
targetComponent[keys[i]] = sourceComponent[keys[i]];
} catch (error) {}
}
return targetComponent;
};
}, function(module, exports, __webpack_require__) {
"use strict";
var invariant = function(condition, format, a, b, c, d, e, f) {
if (!condition) {
var error;
if (void 0 === format) error = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."); else {
var args = [ a, b, c, d, e, f ], argIndex = 0;
error = new Error(format.replace(/%s/g, function() {
return args[argIndex++];
})), error.name = "Invariant Violation";
}
throw error.framesToPop = 1, error;
}
};
module.exports = invariant;
}, function(module, exports, __webpack_require__) {
__webpack_require__(1130), module.exports = self.fetch.bind(self);
}, function(module, exports, __webpack_require__) {
"use strict";
function testSchema(instance, options, ctx, schema) {
return this.validateSchema(instance, schema, options, ctx).valid;
}
function testAdditionalProperty(instance, schema, options, ctx, property, result) {
if (!schema.properties || void 0 === schema.properties[property]) if (schema.additionalProperties === !1) result.addError({
name: "additionalProperties",
argument: property,
message: "additionalProperty " + JSON.stringify(property) + " exists in instance when not allowed"
}); else {
var additionalProperties = schema.additionalProperties || {}, res = this.validateSchema(instance[property], additionalProperties, options, ctx.makeChild(additionalProperties, property));
res.instance !== result.instance[property] && (result.instance[property] = res.instance), 
result.importErrors(res);
}
}
function testArrays(v, i, a) {
var j, len = a.length;
for (j = i + 1, len; j < len; j++) if (helpers.deepCompareStrict(v, a[j])) return !1;
return !0;
}
var helpers = __webpack_require__(127), ValidatorResult = helpers.ValidatorResult, SchemaError = helpers.SchemaError, attribute = {};
attribute.ignoreProperties = {
id: !0,
"default": !0,
description: !0,
title: !0,
exclusiveMinimum: !0,
exclusiveMaximum: !0,
additionalItems: !0,
$schema: !0,
$ref: !0,
"extends": !0
};
var validators = attribute.validators = {};
validators.type = function validateType(instance, schema, options, ctx) {
if (void 0 === instance) return null;
var result = new ValidatorResult(instance, schema, options, ctx), types = schema.type instanceof Array ? schema.type : [ schema.type ];
if (!types.some(this.testType.bind(this, instance, schema, options, ctx))) {
var list = types.map(function(v) {
return v.id && "<" + v.id + ">" || v + "";
});
result.addError({
name: "type",
argument: list,
message: "is not of a type(s) " + list
});
}
return result;
}, validators.anyOf = function validateAnyOf(instance, schema, options, ctx) {
if (void 0 === instance) return null;
var result = new ValidatorResult(instance, schema, options, ctx);
if (!(schema.anyOf instanceof Array)) throw new SchemaError("anyOf must be an array");
if (!schema.anyOf.some(testSchema.bind(this, instance, options, ctx))) {
var list = schema.anyOf.map(function(v, i) {
return v.id && "<" + v.id + ">" || v.title && JSON.stringify(v.title) || v.$ref && "<" + v.$ref + ">" || "[subschema " + i + "]";
});
result.addError({
name: "anyOf",
argument: list,
message: "is not any of " + list.join(",")
});
}
return result;
}, validators.allOf = function validateAllOf(instance, schema, options, ctx) {
if (void 0 === instance) return null;
if (!(schema.allOf instanceof Array)) throw new SchemaError("allOf must be an array");
var result = new ValidatorResult(instance, schema, options, ctx), self = this;
return schema.allOf.forEach(function(v, i) {
var valid = self.validateSchema(instance, v, options, ctx);
if (!valid.valid) {
var msg = v.id && "<" + v.id + ">" || v.title && JSON.stringify(v.title) || v.$ref && "<" + v.$ref + ">" || "[subschema " + i + "]";
result.addError({
name: "allOf",
argument: {
id: msg,
length: valid.errors.length,
valid: valid
},
message: "does not match allOf schema " + msg + " with " + valid.errors.length + " error[s]:"
}), result.importErrors(valid);
}
}), result;
}, validators.oneOf = function validateOneOf(instance, schema, options, ctx) {
if (void 0 === instance) return null;
if (!(schema.oneOf instanceof Array)) throw new SchemaError("oneOf must be an array");
var result = new ValidatorResult(instance, schema, options, ctx), count = schema.oneOf.filter(testSchema.bind(this, instance, options, ctx)).length, list = schema.oneOf.map(function(v, i) {
return v.id && "<" + v.id + ">" || v.title && JSON.stringify(v.title) || v.$ref && "<" + v.$ref + ">" || "[subschema " + i + "]";
});
return 1 !== count && result.addError({
name: "oneOf",
argument: list,
message: "is not exactly one from " + list.join(",")
}), result;
}, validators.properties = function validateProperties(instance, schema, options, ctx) {
if (void 0 !== instance && instance instanceof Object) {
var result = new ValidatorResult(instance, schema, options, ctx), properties = schema.properties || {};
for (var property in properties) {
var prop = (instance || void 0) && instance[property], res = this.validateSchema(prop, properties[property], options, ctx.makeChild(properties[property], property));
res.instance !== result.instance[property] && (result.instance[property] = res.instance), 
result.importErrors(res);
}
return result;
}
}, validators.patternProperties = function validatePatternProperties(instance, schema, options, ctx) {
if (void 0 !== instance && this.types.object(instance)) {
var result = new ValidatorResult(instance, schema, options, ctx), patternProperties = schema.patternProperties || {};
for (var property in instance) {
var test = !0;
for (var pattern in patternProperties) {
var expr = new RegExp(pattern);
if (expr.test(property)) {
test = !1;
var res = this.validateSchema(instance[property], patternProperties[pattern], options, ctx.makeChild(patternProperties[pattern], property));
res.instance !== result.instance[property] && (result.instance[property] = res.instance), 
result.importErrors(res);
}
}
test && testAdditionalProperty.call(this, instance, schema, options, ctx, property, result);
}
return result;
}
}, validators.additionalProperties = function validateAdditionalProperties(instance, schema, options, ctx) {
if (void 0 !== instance && this.types.object(instance)) {
if (schema.patternProperties) return null;
var result = new ValidatorResult(instance, schema, options, ctx);
for (var property in instance) testAdditionalProperty.call(this, instance, schema, options, ctx, property, result);
return result;
}
}, validators.minProperties = function validateMinProperties(instance, schema, options, ctx) {
if (!instance || "object" != typeof instance) return null;
var result = new ValidatorResult(instance, schema, options, ctx), keys = Object.keys(instance);
return keys.length >= schema.minProperties || result.addError({
name: "minProperties",
argument: schema.minProperties,
message: "does not meet minimum property length of " + schema.minProperties
}), result;
}, validators.maxProperties = function validateMaxProperties(instance, schema, options, ctx) {
if (!instance || "object" != typeof instance) return null;
var result = new ValidatorResult(instance, schema, options, ctx), keys = Object.keys(instance);
return keys.length <= schema.maxProperties || result.addError({
name: "maxProperties",
argument: schema.maxProperties,
message: "does not meet maximum property length of " + schema.maxProperties
}), result;
}, validators.items = function validateItems(instance, schema, options, ctx) {
if (!(instance instanceof Array)) return null;
var self = this, result = new ValidatorResult(instance, schema, options, ctx);
return void 0 !== instance && schema.items ? (instance.every(function(value, i) {
var items = schema.items instanceof Array ? schema.items[i] || schema.additionalItems : schema.items;
if (void 0 === items) return !0;
if (items === !1) return result.addError({
name: "items",
message: "additionalItems not permitted"
}), !1;
var res = self.validateSchema(value, items, options, ctx.makeChild(items, i));
return res.instance !== result.instance[i] && (result.instance[i] = res.instance), 
result.importErrors(res), !0;
}), result) : result;
}, validators.minimum = function validateMinimum(instance, schema, options, ctx) {
if ("number" != typeof instance) return null;
var result = new ValidatorResult(instance, schema, options, ctx), valid = !0;
return valid = schema.exclusiveMinimum && schema.exclusiveMinimum === !0 ? instance > schema.minimum : instance >= schema.minimum, 
valid || result.addError({
name: "minimum",
argument: schema.minimum,
message: "must have a minimum value of " + schema.minimum
}), result;
}, validators.maximum = function validateMaximum(instance, schema, options, ctx) {
if ("number" != typeof instance) return null;
var valid, result = new ValidatorResult(instance, schema, options, ctx);
return valid = schema.exclusiveMaximum && schema.exclusiveMaximum === !0 ? instance < schema.maximum : instance <= schema.maximum, 
valid || result.addError({
name: "maximum",
argument: schema.maximum,
message: "must have a maximum value of " + schema.maximum
}), result;
}, validators.divisibleBy = function validateDivisibleBy(instance, schema, options, ctx) {
if ("number" != typeof instance) return null;
if (0 == schema.divisibleBy) throw new SchemaError("divisibleBy cannot be zero");
var result = new ValidatorResult(instance, schema, options, ctx);
return instance / schema.divisibleBy % 1 && result.addError({
name: "divisibleBy",
argument: schema.divisibleBy,
message: "is not divisible by (multiple of) " + JSON.stringify(schema.divisibleBy)
}), result;
}, validators.multipleOf = function validateMultipleOf(instance, schema, options, ctx) {
if ("number" != typeof instance) return null;
if (0 == schema.multipleOf) throw new SchemaError("multipleOf cannot be zero");
var result = new ValidatorResult(instance, schema, options, ctx);
return instance / schema.multipleOf % 1 && result.addError({
name: "multipleOf",
argument: schema.multipleOf,
message: "is not a multiple of (divisible by) " + JSON.stringify(schema.multipleOf)
}), result;
}, validators.required = function validateRequired(instance, schema, options, ctx) {
var result = new ValidatorResult(instance, schema, options, ctx);
return void 0 === instance && schema.required === !0 ? result.addError({
name: "required",
message: "is required"
}) : instance && "object" == typeof instance && Array.isArray(schema.required) && schema.required.forEach(function(n) {
void 0 === instance[n] && result.addError({
name: "required",
argument: n,
message: "requires property " + JSON.stringify(n)
});
}), result;
}, validators.pattern = function validatePattern(instance, schema, options, ctx) {
if ("string" != typeof instance) return null;
var result = new ValidatorResult(instance, schema, options, ctx);
return instance.match(schema.pattern) || result.addError({
name: "pattern",
argument: schema.pattern,
message: "does not match pattern " + JSON.stringify(schema.pattern)
}), result;
}, validators.format = function validateFormat(instance, schema, options, ctx) {
var result = new ValidatorResult(instance, schema, options, ctx);
return result.disableFormat || helpers.isFormat(instance, schema.format, this) || result.addError({
name: "format",
argument: schema.format,
message: "does not conform to the " + JSON.stringify(schema.format) + " format"
}), result;
}, validators.minLength = function validateMinLength(instance, schema, options, ctx) {
if ("string" != typeof instance) return null;
var result = new ValidatorResult(instance, schema, options, ctx);
return instance.length >= schema.minLength || result.addError({
name: "minLength",
argument: schema.minLength,
message: "does not meet minimum length of " + schema.minLength
}), result;
}, validators.maxLength = function validateMaxLength(instance, schema, options, ctx) {
if ("string" != typeof instance) return null;
var result = new ValidatorResult(instance, schema, options, ctx);
return instance.length <= schema.maxLength || result.addError({
name: "maxLength",
argument: schema.maxLength,
message: "does not meet maximum length of " + schema.maxLength
}), result;
}, validators.minItems = function validateMinItems(instance, schema, options, ctx) {
if (!(instance instanceof Array)) return null;
var result = new ValidatorResult(instance, schema, options, ctx);
return instance.length >= schema.minItems || result.addError({
name: "minItems",
argument: schema.minItems,
message: "does not meet minimum length of " + schema.minItems
}), result;
}, validators.maxItems = function validateMaxItems(instance, schema, options, ctx) {
if (!(instance instanceof Array)) return null;
var result = new ValidatorResult(instance, schema, options, ctx);
return instance.length <= schema.maxItems || result.addError({
name: "maxItems",
argument: schema.maxItems,
message: "does not meet maximum length of " + schema.maxItems
}), result;
}, validators.uniqueItems = function validateUniqueItems(instance, schema, options, ctx) {
function testArrays(v, i, a) {
for (var j = i + 1; j < a.length; j++) if (helpers.deepCompareStrict(v, a[j])) return !1;
return !0;
}
var result = new ValidatorResult(instance, schema, options, ctx);
return instance instanceof Array ? (instance.every(testArrays) || result.addError({
name: "uniqueItems",
message: "contains duplicate item"
}), result) : result;
}, validators.uniqueItems = function validateUniqueItems(instance, schema, options, ctx) {
if (!(instance instanceof Array)) return null;
var result = new ValidatorResult(instance, schema, options, ctx);
return instance.every(testArrays) || result.addError({
name: "uniqueItems",
message: "contains duplicate item"
}), result;
}, validators.dependencies = function validateDependencies(instance, schema, options, ctx) {
if (!instance || "object" != typeof instance) return null;
var result = new ValidatorResult(instance, schema, options, ctx);
for (var property in schema.dependencies) if (void 0 !== instance[property]) {
var dep = schema.dependencies[property], childContext = ctx.makeChild(dep, property);
if ("string" == typeof dep && (dep = [ dep ]), dep instanceof Array) dep.forEach(function(prop) {
void 0 === instance[prop] && result.addError({
name: "dependencies",
argument: childContext.propertyPath,
message: "property " + prop + " not found, required by " + childContext.propertyPath
});
}); else {
var res = this.validateSchema(instance, dep, options, childContext);
result.instance !== res.instance && (result.instance = res.instance), res && res.errors.length && (result.addError({
name: "dependencies",
argument: childContext.propertyPath,
message: "does not meet dependency required by " + childContext.propertyPath
}), result.importErrors(res));
}
}
return result;
}, validators.enum = function validateEnum(instance, schema, options, ctx) {
if (!(schema.enum instanceof Array)) throw new SchemaError("enum expects an array", schema);
if (void 0 === instance) return null;
var result = new ValidatorResult(instance, schema, options, ctx);
return schema.enum.some(helpers.deepCompareStrict.bind(null, instance)) || result.addError({
name: "enum",
argument: schema.enum,
message: "is not one of enum values: " + schema.enum.join(",")
}), result;
}, validators.not = validators.disallow = function validateNot(instance, schema, options, ctx) {
var self = this;
if (void 0 === instance) return null;
var result = new ValidatorResult(instance, schema, options, ctx), notTypes = schema.not || schema.disallow;
return notTypes ? (notTypes instanceof Array || (notTypes = [ notTypes ]), notTypes.forEach(function(type) {
if (self.testType(instance, schema, options, ctx, type)) {
var schemaId = type && type.id && "<" + type.id + ">" || type;
result.addError({
name: "not",
argument: schemaId,
message: "is of prohibited type " + schemaId
});
}
}), result) : null;
}, module.exports = attribute;
}, function(module, exports, __webpack_require__) {
"use strict";
var urilib = __webpack_require__(488), attribute = __webpack_require__(799), helpers = __webpack_require__(127), ValidatorResult = helpers.ValidatorResult, SchemaError = helpers.SchemaError, SchemaContext = helpers.SchemaContext, Validator = function Validator() {
this.customFormats = Object.create(Validator.prototype.customFormats), this.schemas = {}, 
this.unresolvedRefs = [], this.types = Object.create(types), this.attributes = Object.create(attribute.validators);
};
Validator.prototype.customFormats = {}, Validator.prototype.schemas = null, Validator.prototype.types = null, 
Validator.prototype.attributes = null, Validator.prototype.unresolvedRefs = null, 
Validator.prototype.addSchema = function addSchema(schema, uri) {
if (!schema) return null;
var ourUri = uri || schema.id;
return this.addSubSchema(ourUri, schema), ourUri && (this.schemas[ourUri] = schema), 
this.schemas[ourUri];
}, Validator.prototype.addSubSchema = function addSubSchema(baseuri, schema) {
if (schema && "object" == typeof schema) {
if (schema.$ref) {
var resolvedUri = urilib.resolve(baseuri, schema.$ref);
return void (void 0 === this.schemas[resolvedUri] && (this.schemas[resolvedUri] = null, 
this.unresolvedRefs.push(resolvedUri)));
}
var ourUri = schema.id && urilib.resolve(baseuri, schema.id), ourBase = ourUri || baseuri;
if (ourUri) {
if (this.schemas[ourUri]) {
if (!helpers.deepCompareStrict(this.schemas[ourUri], schema)) throw new Error("Schema <" + schema + "> already exists with different definition");
return this.schemas[ourUri];
}
this.schemas[ourUri] = schema;
var documentUri = ourUri.replace(/^([^#]*)#$/, "$1");
this.schemas[documentUri] = schema;
}
return this.addSubSchemaArray(ourBase, schema.items instanceof Array ? schema.items : [ schema.items ]), 
this.addSubSchemaArray(ourBase, schema.extends instanceof Array ? schema.extends : [ schema.extends ]), 
this.addSubSchema(ourBase, schema.additionalItems), this.addSubSchemaObject(ourBase, schema.properties), 
this.addSubSchema(ourBase, schema.additionalProperties), this.addSubSchemaObject(ourBase, schema.definitions), 
this.addSubSchemaObject(ourBase, schema.patternProperties), this.addSubSchemaObject(ourBase, schema.dependencies), 
this.addSubSchemaArray(ourBase, schema.disallow), this.addSubSchemaArray(ourBase, schema.allOf), 
this.addSubSchemaArray(ourBase, schema.anyOf), this.addSubSchemaArray(ourBase, schema.oneOf), 
this.addSubSchema(ourBase, schema.not), this.schemas[ourUri];
}
}, Validator.prototype.addSubSchemaArray = function addSubSchemaArray(baseuri, schemas) {
if (schemas instanceof Array) for (var i = 0; i < schemas.length; i++) this.addSubSchema(baseuri, schemas[i]);
}, Validator.prototype.addSubSchemaObject = function addSubSchemaArray(baseuri, schemas) {
if (schemas && "object" == typeof schemas) for (var p in schemas) this.addSubSchema(baseuri, schemas[p]);
}, Validator.prototype.setSchemas = function setSchemas(schemas) {
this.schemas = schemas;
}, Validator.prototype.getSchema = function getSchema(urn) {
return this.schemas[urn];
}, Validator.prototype.validate = function validate(instance, schema, options, ctx) {
options || (options = {});
var propertyName = options.propertyName || "instance", base = urilib.resolve(options.base || "/", schema.id || "");
if (ctx || (ctx = new SchemaContext(schema, options, propertyName, base, Object.create(this.schemas)), 
ctx.schemas[base] || (ctx.schemas[base] = schema)), schema) {
var result = this.validateSchema(instance, schema, options, ctx);
if (!result) throw new Error("Result undefined");
return result;
}
throw new SchemaError("no schema specified", schema);
}, Validator.prototype.validateSchema = function validateSchema(instance, schema, options, ctx) {
function shouldResolve(schema) {
var ref = "string" == typeof schema ? schema : schema.$ref;
return "string" == typeof ref && ref;
}
function resolve(schema, ctx) {
var ref;
return (ref = shouldResolve(schema)) ? self.resolve(schema, ref, ctx).subschema : schema;
}
var self = this, result = new ValidatorResult(instance, schema, options, ctx);
if (!schema) throw new Error("schema is undefined");
schema.extends && (schema.extends instanceof Array ? schema.extends.forEach(function(s) {
schema = helpers.deepMerge(schema, resolve(s, ctx));
}) : schema = helpers.deepMerge(schema, resolve(schema.extends, ctx)));
var switchSchema;
if (switchSchema = shouldResolve(schema)) {
var resolved = this.resolve(schema, switchSchema, ctx), subctx = new SchemaContext(resolved.subschema, options, ctx.propertyPath, resolved.switchSchema, ctx.schemas);
return this.validateSchema(instance, resolved.subschema, options, subctx);
}
var skipAttributes = options && options.skipAttributes || [];
for (var key in schema) if (!attribute.ignoreProperties[key] && skipAttributes.indexOf(key) < 0) {
var validatorErr = null, validator = self.attributes[key];
if (validator) validatorErr = validator.call(self, instance, schema, options, ctx); else if (options.allowUnknownAttributes === !1) throw new SchemaError("Unsupported attribute: " + key, schema);
validatorErr && result.importErrors(validatorErr);
}
if ("function" == typeof options.rewrite) {
var value = options.rewrite.call(this, instance, schema, options, ctx);
result.instance = value;
}
return result;
}, Validator.prototype.resolve = function resolve(schema, switchSchema, ctx) {
if (switchSchema = ctx.resolve(switchSchema), ctx.schemas[switchSchema]) return {
subschema: ctx.schemas[switchSchema],
switchSchema: switchSchema
};
var parsed = urilib.parse(switchSchema), fragment = parsed && parsed.hash, document = fragment && fragment.length && switchSchema.substr(0, switchSchema.length - fragment.length);
if (!document || !ctx.schemas[document]) throw new SchemaError("no such schema <" + switchSchema + ">", schema);
var subschema = helpers.objectGetPath(ctx.schemas[document], fragment.substr(1));
if (void 0 === subschema) throw new SchemaError("no such schema " + fragment + " located in <" + document + ">", schema);
return {
subschema: subschema,
switchSchema: switchSchema
};
}, Validator.prototype.testType = function validateType(instance, schema, options, ctx, type) {
if ("function" == typeof this.types[type]) return this.types[type].call(this, instance);
if (type && "object" == typeof type) {
var res = this.validateSchema(instance, type, options, ctx);
return void 0 === res || !(res && res.errors.length);
}
return !0;
};
var types = Validator.prototype.types = {};
types.string = function testString(instance) {
return "string" == typeof instance;
}, types.number = function testNumber(instance) {
return "number" == typeof instance && isFinite(instance);
}, types.integer = function testInteger(instance) {
return "number" == typeof instance && instance % 1 === 0;
}, types.boolean = function testBoolean(instance) {
return "boolean" == typeof instance;
}, types.array = function testArray(instance) {
return instance instanceof Array;
}, types.null = function testNull(instance) {
return null === instance;
}, types.date = function testDate(instance) {
return instance instanceof Date;
}, types.any = function testAny(instance) {
return !0;
}, types.object = function testObject(instance) {
return instance && "object" == typeof instance && !(instance instanceof Array) && !(instance instanceof Date);
}, module.exports = Validator;
}, function(module, exports, __webpack_require__) {
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
!function(root, factory) {
__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(263) ], __WEBPACK_AMD_DEFINE_FACTORY__ = factory, 
__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__, 
!(void 0 !== __WEBPACK_AMD_DEFINE_RESULT__ && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}(this, function(_, undefined) {
function includes(haystack, needle) {
var f = _.include || _.includes;
return f(haystack, needle);
}
var plurals = [], singulars = [], uncountables = [], inflector = {
gsub: function(word, rule, replacement) {
var pattern = new RegExp(rule.source || rule, "gi");
return pattern.test(word) ? word.replace(pattern, replacement) : null;
},
plural: function(rule, replacement) {
plurals.unshift([ rule, replacement ]);
},
pluralize: function(word, count, includeNumber) {
var result;
if (count !== undefined) count = parseFloat(count), result = 1 === count ? this.singularize(word) : this.pluralize(word), 
result = includeNumber ? [ count, result ].join(" ") : result; else {
if (includes(uncountables, word)) return word;
result = word, _(plurals).find(function(rule) {
var gsub = this.gsub(word, rule[0], rule[1]);
return !!gsub && (result = gsub);
}.bind(this));
}
return result;
},
singular: function(rule, replacement) {
singulars.unshift([ rule, replacement ]);
},
singularize: function(word) {
if (includes(uncountables, word)) return word;
var result = word;
return _(singulars).find(function(rule) {
var gsub = this.gsub(word, rule[0], rule[1]);
return !!gsub && (result = gsub);
}.bind(this)), result;
},
irregular: function(singular, plural) {
this.plural("\\b" + singular + "\\b", plural), this.singular("\\b" + plural + "\\b", singular);
},
uncountable: function(word) {
uncountables.unshift(word);
},
ordinalize: function(number) {
if (isNaN(number)) return number;
number = number.toString();
var lastDigit = number.slice(-1), lastTwoDigits = number.slice(-2);
if ("11" === lastTwoDigits || "12" === lastTwoDigits || "13" === lastTwoDigits) return number + "th";
switch (lastDigit) {
case "1":
return number + "st";

case "2":
return number + "nd";

case "3":
return number + "rd";

default:
return number + "th";
}
},
titleize: function(words) {
return "string" != typeof words ? words : words.replace(/\S+/g, function(word) {
return word.charAt(0).toUpperCase() + word.slice(1);
});
},
resetInflections: function() {
return plurals = [], singulars = [], uncountables = [], this.plural(/$/, "s"), this.plural(/s$/, "s"), 
this.plural(/^(ax|test)is$/, "$1es"), this.plural(/(octop|vir)us$/, "$1i"), this.plural(/(octop|vir)i$/, "$1i"), 
this.plural(/(alias|status)$/, "$1es"), this.plural(/(bu)s$/, "$1ses"), this.plural(/(buffal|tomat)o$/, "$1oes"), 
this.plural(/([ti])um$/, "$1a"), this.plural(/([ti])a$/, "$1a"), this.plural(/sis$/, "ses"), 
this.plural(/(?:([^f])fe|([lr])?f)$/, "$1$2ves"), this.plural(/(hive)$/, "$1s"), 
this.plural(/([^aeiouy]|qu)y$/, "$1ies"), this.plural(/(x|ch|ss|sh)$/, "$1es"), 
this.plural(/(matr|vert|ind)(?:ix|ex)$/, "$1ices"), this.plural(/(m|l)ouse$/, "$1ice"), 
this.plural(/(m|l)ice$/, "$1ice"), this.plural(/^(ox)$/, "$1en"), this.plural(/^(oxen)$/, "$1"), 
this.plural(/(quiz)$/, "$1zes"), this.singular(/s$/, ""), this.singular(/(ss)$/, "$1"), 
this.singular(/(n)ews$/, "$1ews"), this.singular(/([ti])a$/, "$1um"), this.singular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/, "$1$2sis"), 
this.singular(/(^analy)(sis|ses)$/, "$1sis"), this.singular(/([^f])ves$/, "$1fe"), 
this.singular(/(hive)s$/, "$1"), this.singular(/(tive)s$/, "$1"), this.singular(/([lrae])ves$/, "$1f"), 
this.singular(/([^aeiouy]|qu)ies$/, "$1y"), this.singular(/(s)eries$/, "$1eries"), 
this.singular(/(m)ovies$/, "$1ovie"), this.singular(/(x|ch|ss|sh)es$/, "$1"), this.singular(/(m|l)ice$/, "$1ouse"), 
this.singular(/(bus)(es)?$/, "$1"), this.singular(/(o)es$/, "$1"), this.singular(/(shoe)s$/, "$1"), 
this.singular(/(cris|test)(is|es)$/, "$1is"), this.singular(/^(a)x[ie]s$/, "$1xis"), 
this.singular(/(octop|vir)(us|i)$/, "$1us"), this.singular(/(alias|status)(es)?$/, "$1"), 
this.singular(/^(ox)en/, "$1"), this.singular(/(vert|ind)ices$/, "$1ex"), this.singular(/(matr)ices$/, "$1ix"), 
this.singular(/(quiz)zes$/, "$1"), this.singular(/(database)s$/, "$1"), this.irregular("person", "people"), 
this.irregular("man", "men"), this.irregular("child", "children"), this.irregular("sex", "sexes"), 
this.irregular("move", "moves"), this.irregular("cow", "kine"), this.irregular("zombie", "zombies"), 
this.uncountable("equipment"), this.uncountable("information"), this.uncountable("rice"), 
this.uncountable("money"), this.uncountable("species"), this.uncountable("series"), 
this.uncountable("fish"), this.uncountable("sheep"), this.uncountable("jeans"), 
this.uncountable("moose"), this.uncountable("deer"), this.uncountable("news"), this.uncountable("music"), 
this;
}
};
return _.mixin(inflector.resetInflections()), inflector;
});
}, function(module, exports) {
function createBaseFor(fromRight) {
return function(object, iteratee, keysFunc) {
for (var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length; length--; ) {
var key = props[fromRight ? length : ++index];
if (iteratee(iterable[key], key, iterable) === !1) break;
}
return object;
};
}
var baseFor = createBaseFor();
module.exports = baseFor;
}, function(module, exports) {
function isObjectLike(value) {
return !!value && "object" == typeof value;
}
function getNative(object, key) {
var value = null == object ? void 0 : object[key];
return isNative(value) ? value : void 0;
}
function isLength(value) {
return "number" == typeof value && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
function isFunction(value) {
return isObject(value) && objToString.call(value) == funcTag;
}
function isObject(value) {
var type = typeof value;
return !!value && ("object" == type || "function" == type);
}
function isNative(value) {
return null != value && (isFunction(value) ? reIsNative.test(fnToString.call(value)) : isObjectLike(value) && reIsHostCtor.test(value));
}
var arrayTag = "[object Array]", funcTag = "[object Function]", reIsHostCtor = /^\[object .+?Constructor\]$/, objectProto = Object.prototype, fnToString = Function.prototype.toString, hasOwnProperty = objectProto.hasOwnProperty, objToString = objectProto.toString, reIsNative = RegExp("^" + fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), nativeIsArray = getNative(Array, "isArray"), MAX_SAFE_INTEGER = 9007199254740991, isArray = nativeIsArray || function(value) {
return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};
module.exports = isArray;
}, function(module, exports, __webpack_require__) {
function isObjectLike(value) {
return !!value && "object" == typeof value;
}
function baseForIn(object, iteratee) {
return baseFor(object, iteratee, keysIn);
}
function isPlainObject(value) {
var Ctor;
if (!isObjectLike(value) || objToString.call(value) != objectTag || isArguments(value) || !hasOwnProperty.call(value, "constructor") && (Ctor = value.constructor, 
"function" == typeof Ctor && !(Ctor instanceof Ctor))) return !1;
var result;
return baseForIn(value, function(subValue, key) {
result = key;
}), void 0 === result || hasOwnProperty.call(value, result);
}
var baseFor = __webpack_require__(802), isArguments = __webpack_require__(374), keysIn = __webpack_require__(805), objectTag = "[object Object]", objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty, objToString = objectProto.toString;
module.exports = isPlainObject;
}, function(module, exports, __webpack_require__) {
function isIndex(value, length) {
return value = "number" == typeof value || reIsUint.test(value) ? +value : -1, length = null == length ? MAX_SAFE_INTEGER : length, 
value > -1 && value % 1 == 0 && value < length;
}
function isLength(value) {
return "number" == typeof value && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
function isObject(value) {
var type = typeof value;
return !!value && ("object" == type || "function" == type);
}
function keysIn(object) {
if (null == object) return [];
isObject(object) || (object = Object(object));
var length = object.length;
length = length && isLength(length) && (isArray(object) || isArguments(object)) && length || 0;
for (var Ctor = object.constructor, index = -1, isProto = "function" == typeof Ctor && Ctor.prototype === object, result = Array(length), skipIndexes = length > 0; ++index < length; ) result[index] = index + "";
for (var key in object) skipIndexes && isIndex(key, length) || "constructor" == key && (isProto || !hasOwnProperty.call(object, key)) || result.push(key);
return result;
}
var isArguments = __webpack_require__(374), isArray = __webpack_require__(803), reIsUint = /^\d+$/, objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty, MAX_SAFE_INTEGER = 9007199254740991;
module.exports = keysIn;
}, function(module, exports, __webpack_require__) {
var getNative = __webpack_require__(107), root = __webpack_require__(60), DataView = getNative(root, "DataView");
module.exports = DataView;
}, function(module, exports, __webpack_require__) {
function Hash(entries) {
var index = -1, length = entries ? entries.length : 0;
for (this.clear(); ++index < length; ) {
var entry = entries[index];
this.set(entry[0], entry[1]);
}
}
var hashClear = __webpack_require__(855), hashDelete = __webpack_require__(856), hashGet = __webpack_require__(857), hashHas = __webpack_require__(858), hashSet = __webpack_require__(859);
Hash.prototype.clear = hashClear, Hash.prototype.delete = hashDelete, Hash.prototype.get = hashGet, 
Hash.prototype.has = hashHas, Hash.prototype.set = hashSet, module.exports = Hash;
}, function(module, exports, __webpack_require__) {
var getNative = __webpack_require__(107), root = __webpack_require__(60), Promise = getNative(root, "Promise");
module.exports = Promise;
}, function(module, exports, __webpack_require__) {
var root = __webpack_require__(60), Reflect = root.Reflect;
module.exports = Reflect;
}, function(module, exports, __webpack_require__) {
var getNative = __webpack_require__(107), root = __webpack_require__(60), Set = getNative(root, "Set");
module.exports = Set;
}, function(module, exports, __webpack_require__) {
var root = __webpack_require__(60), Uint8Array = root.Uint8Array;
module.exports = Uint8Array;
}, function(module, exports, __webpack_require__) {
var getNative = __webpack_require__(107), root = __webpack_require__(60), WeakMap = getNative(root, "WeakMap");
module.exports = WeakMap;
}, function(module, exports) {
function apply(func, thisArg, args) {
var length = args.length;
switch (length) {
case 0:
return func.call(thisArg);

case 1:
return func.call(thisArg, args[0]);

case 2:
return func.call(thisArg, args[0], args[1]);

case 3:
return func.call(thisArg, args[0], args[1], args[2]);
}
return func.apply(thisArg, args);
}
module.exports = apply;
}, function(module, exports) {
function arrayEach(array, iteratee) {
for (var index = -1, length = array ? array.length : 0; ++index < length && iteratee(array[index], index, array) !== !1; ) ;
return array;
}
module.exports = arrayEach;
}, function(module, exports) {
function arrayFilter(array, predicate) {
for (var index = -1, length = array ? array.length : 0, resIndex = 0, result = []; ++index < length; ) {
var value = array[index];
predicate(value, index, array) && (result[resIndex++] = value);
}
return result;
}
module.exports = arrayFilter;
}, function(module, exports, __webpack_require__) {
function arrayIncludes(array, value) {
var length = array ? array.length : 0;
return !!length && baseIndexOf(array, value, 0) > -1;
}
var baseIndexOf = __webpack_require__(826);
module.exports = arrayIncludes;
}, function(module, exports) {
function arrayIncludesWith(array, value, comparator) {
for (var index = -1, length = array ? array.length : 0; ++index < length; ) if (comparator(value, array[index])) return !0;
return !1;
}
module.exports = arrayIncludesWith;
}, function(module, exports) {
function arrayReduce(array, iteratee, accumulator, initAccum) {
var index = -1, length = array ? array.length : 0;
for (initAccum && length && (accumulator = array[++index]); ++index < length; ) accumulator = iteratee(accumulator, array[index], index, array);
return accumulator;
}
module.exports = arrayReduce;
}, function(module, exports) {
function arraySome(array, predicate) {
for (var index = -1, length = array ? array.length : 0; ++index < length; ) if (predicate(array[index], index, array)) return !0;
return !1;
}
module.exports = arraySome;
}, function(module, exports, __webpack_require__) {
function baseDifference(array, values, iteratee, comparator) {
var index = -1, includes = arrayIncludes, isCommon = !0, length = array.length, result = [], valuesLength = values.length;
if (!length) return result;
iteratee && (values = arrayMap(values, baseUnary(iteratee))), comparator ? (includes = arrayIncludesWith, 
isCommon = !1) : values.length >= LARGE_ARRAY_SIZE && (includes = cacheHas, isCommon = !1, 
values = new SetCache(values));
outer: for (;++index < length; ) {
var value = array[index], computed = iteratee ? iteratee(value) : value;
if (value = comparator || 0 !== value ? value : 0, isCommon && computed === computed) {
for (var valuesIndex = valuesLength; valuesIndex--; ) if (values[valuesIndex] === computed) continue outer;
result.push(value);
} else includes(values, computed, comparator) || result.push(value);
}
return result;
}
var SetCache = __webpack_require__(376), arrayIncludes = __webpack_require__(816), arrayIncludesWith = __webpack_require__(817), arrayMap = __webpack_require__(254), baseUnary = __webpack_require__(840), cacheHas = __webpack_require__(841), LARGE_ARRAY_SIZE = 200;
module.exports = baseDifference;
}, function(module, exports, __webpack_require__) {
function baseFilter(collection, predicate) {
var result = [];
return baseEach(collection, function(value, index, collection) {
predicate(value, index, collection) && result.push(value);
}), result;
}
var baseEach = __webpack_require__(256);
module.exports = baseFilter;
}, function(module, exports, __webpack_require__) {
function baseFlatten(array, depth, predicate, isStrict, result) {
var index = -1, length = array.length;
for (predicate || (predicate = isFlattenable), result || (result = []); ++index < length; ) {
var value = array[index];
depth > 0 && predicate(value) ? depth > 1 ? baseFlatten(value, depth - 1, predicate, isStrict, result) : arrayPush(result, value) : isStrict || (result[result.length] = value);
}
return result;
}
var arrayPush = __webpack_require__(255), isFlattenable = __webpack_require__(861);
module.exports = baseFlatten;
}, function(module, exports, __webpack_require__) {
var createBaseFor = __webpack_require__(845), baseFor = createBaseFor();
module.exports = baseFor;
}, function(module, exports, __webpack_require__) {
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
var result = keysFunc(object);
return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}
var arrayPush = __webpack_require__(255), isArray = __webpack_require__(42);
module.exports = baseGetAllKeys;
}, function(module, exports) {
function baseHasIn(object, key) {
return null != object && key in Object(object);
}
module.exports = baseHasIn;
}, function(module, exports, __webpack_require__) {
function baseIndexOf(array, value, fromIndex) {
if (value !== value) return indexOfNaN(array, fromIndex);
for (var index = fromIndex - 1, length = array.length; ++index < length; ) if (array[index] === value) return index;
return -1;
}
var indexOfNaN = __webpack_require__(860);
module.exports = baseIndexOf;
}, function(module, exports, __webpack_require__) {
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
var objIsArr = isArray(object), othIsArr = isArray(other), objTag = arrayTag, othTag = arrayTag;
objIsArr || (objTag = getTag(object), objTag = objTag == argsTag ? objectTag : objTag), 
othIsArr || (othTag = getTag(other), othTag = othTag == argsTag ? objectTag : othTag);
var objIsObj = objTag == objectTag && !isHostObject(object), othIsObj = othTag == objectTag && !isHostObject(other), isSameTag = objTag == othTag;
if (isSameTag && !objIsObj) return stack || (stack = new Stack()), objIsArr || isTypedArray(object) ? equalArrays(object, other, equalFunc, customizer, bitmask, stack) : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
if (objIsWrapped || othIsWrapped) {
var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
return stack || (stack = new Stack()), equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
}
}
return !!isSameTag && (stack || (stack = new Stack()), equalObjects(object, other, equalFunc, customizer, bitmask, stack));
}
var Stack = __webpack_require__(377), equalArrays = __webpack_require__(385), equalByTag = __webpack_require__(846), equalObjects = __webpack_require__(847), getTag = __webpack_require__(852), isArray = __webpack_require__(42), isHostObject = __webpack_require__(258), isTypedArray = __webpack_require__(891), PARTIAL_COMPARE_FLAG = 2, argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]", objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty;
module.exports = baseIsEqualDeep;
}, function(module, exports, __webpack_require__) {
function baseIsMatch(object, source, matchData, customizer) {
var index = matchData.length, length = index, noCustomizer = !customizer;
if (null == object) return !length;
for (object = Object(object); index--; ) {
var data = matchData[index];
if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) return !1;
}
for (;++index < length; ) {
data = matchData[index];
var key = data[0], objValue = object[key], srcValue = data[1];
if (noCustomizer && data[2]) {
if (void 0 === objValue && !(key in object)) return !1;
} else {
var stack = new Stack();
if (customizer) var result = customizer(objValue, srcValue, key, object, source, stack);
if (!(void 0 === result ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack) : result)) return !1;
}
}
return !0;
}
var Stack = __webpack_require__(377), baseIsEqual = __webpack_require__(382), UNORDERED_COMPARE_FLAG = 1, PARTIAL_COMPARE_FLAG = 2;
module.exports = baseIsMatch;
}, function(module, exports, __webpack_require__) {
function baseIsNative(value) {
if (!isObject(value) || isMasked(value)) return !1;
var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
return pattern.test(toSource(value));
}
var isFunction = __webpack_require__(261), isHostObject = __webpack_require__(258), isMasked = __webpack_require__(863), isObject = __webpack_require__(130), toSource = __webpack_require__(391), reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reIsHostCtor = /^\[object .+?Constructor\]$/, objectProto = Object.prototype, funcToString = Function.prototype.toString, hasOwnProperty = objectProto.hasOwnProperty, reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
module.exports = baseIsNative;
}, function(module, exports) {
function baseKeys(object) {
return nativeKeys(Object(object));
}
var nativeKeys = Object.keys;
module.exports = baseKeys;
}, function(module, exports, __webpack_require__) {
function baseKeysIn(object) {
object = null == object ? object : Object(object);
var result = [];
for (var key in object) result.push(key);
return result;
}
var Reflect = __webpack_require__(809), iteratorToArray = __webpack_require__(864), objectProto = Object.prototype, enumerate = Reflect ? Reflect.enumerate : void 0, propertyIsEnumerable = objectProto.propertyIsEnumerable;
enumerate && !propertyIsEnumerable.call({
valueOf: 1
}, "valueOf") && (baseKeysIn = function(object) {
return iteratorToArray(enumerate(object));
}), module.exports = baseKeysIn;
}, function(module, exports, __webpack_require__) {
function baseMap(collection, iteratee) {
var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
return baseEach(collection, function(value, key, collection) {
result[++index] = iteratee(value, key, collection);
}), result;
}
var baseEach = __webpack_require__(256), isArrayLike = __webpack_require__(175);
module.exports = baseMap;
}, function(module, exports, __webpack_require__) {
function baseMatches(source) {
var matchData = getMatchData(source);
return 1 == matchData.length && matchData[0][2] ? matchesStrictComparable(matchData[0][0], matchData[0][1]) : function(object) {
return object === source || baseIsMatch(object, source, matchData);
};
}
var baseIsMatch = __webpack_require__(828), getMatchData = __webpack_require__(849), matchesStrictComparable = __webpack_require__(390);
module.exports = baseMatches;
}, function(module, exports, __webpack_require__) {
function baseMatchesProperty(path, srcValue) {
return isKey(path) && isStrictComparable(srcValue) ? matchesStrictComparable(toKey(path), srcValue) : function(object) {
var objValue = get(object, path);
return void 0 === objValue && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, void 0, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
};
}
var baseIsEqual = __webpack_require__(382), get = __webpack_require__(887), hasIn = __webpack_require__(888), isKey = __webpack_require__(173), isStrictComparable = __webpack_require__(389), matchesStrictComparable = __webpack_require__(390), toKey = __webpack_require__(129), UNORDERED_COMPARE_FLAG = 1, PARTIAL_COMPARE_FLAG = 2;
module.exports = baseMatchesProperty;
}, function(module, exports, __webpack_require__) {
function basePick(object, props) {
return object = Object(object), arrayReduce(props, function(result, key) {
return key in object && (result[key] = object[key]), result;
}, {});
}
var arrayReduce = __webpack_require__(818);
module.exports = basePick;
}, function(module, exports, __webpack_require__) {
function basePickBy(object, predicate) {
for (var index = -1, props = getAllKeysIn(object), length = props.length, result = {}; ++index < length; ) {
var key = props[index], value = object[key];
predicate(value, key) && (result[key] = value);
}
return result;
}
var getAllKeysIn = __webpack_require__(386);
module.exports = basePickBy;
}, function(module, exports, __webpack_require__) {
function basePropertyDeep(path) {
return function(object) {
return baseGet(object, path);
};
}
var baseGet = __webpack_require__(380);
module.exports = basePropertyDeep;
}, function(module, exports) {
function baseTimes(n, iteratee) {
for (var index = -1, result = Array(n); ++index < n; ) result[index] = iteratee(index);
return result;
}
module.exports = baseTimes;
}, function(module, exports, __webpack_require__) {
function baseToString(value) {
if ("string" == typeof value) return value;
if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
var result = value + "";
return "0" == result && 1 / value == -INFINITY ? "-0" : result;
}
var Symbol = __webpack_require__(378), isSymbol = __webpack_require__(178), INFINITY = 1 / 0, symbolProto = Symbol ? Symbol.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
module.exports = baseToString;
}, function(module, exports) {
function baseUnary(func) {
return function(value) {
return func(value);
};
}
module.exports = baseUnary;
}, function(module, exports) {
function cacheHas(cache, key) {
return cache.has(key);
}
module.exports = cacheHas;
}, function(module, exports) {
function checkGlobal(value) {
return value && value.Object === Object ? value : null;
}
module.exports = checkGlobal;
}, function(module, exports, __webpack_require__) {
var root = __webpack_require__(60), coreJsData = root["__core-js_shared__"];
module.exports = coreJsData;
}, function(module, exports, __webpack_require__) {
function createBaseEach(eachFunc, fromRight) {
return function(collection, iteratee) {
if (null == collection) return collection;
if (!isArrayLike(collection)) return eachFunc(collection, iteratee);
for (var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection); (fromRight ? index-- : ++index < length) && iteratee(iterable[index], index, iterable) !== !1; ) ;
return collection;
};
}
var isArrayLike = __webpack_require__(175);
module.exports = createBaseEach;
}, function(module, exports) {
function createBaseFor(fromRight) {
return function(object, iteratee, keysFunc) {
for (var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length; length--; ) {
var key = props[fromRight ? length : ++index];
if (iteratee(iterable[key], key, iterable) === !1) break;
}
return object;
};
}
module.exports = createBaseFor;
}, function(module, exports, __webpack_require__) {
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
switch (tag) {
case dataViewTag:
if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) return !1;
object = object.buffer, other = other.buffer;

case arrayBufferTag:
return !(object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other)));

case boolTag:
case dateTag:
return +object == +other;

case errorTag:
return object.name == other.name && object.message == other.message;

case numberTag:
return object != +object ? other != +other : object == +other;

case regexpTag:
case stringTag:
return object == other + "";

case mapTag:
var convert = mapToArray;

case setTag:
var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
if (convert || (convert = setToArray), object.size != other.size && !isPartial) return !1;
var stacked = stack.get(object);
return stacked ? stacked == other : (bitmask |= UNORDERED_COMPARE_FLAG, stack.set(object, other), 
equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack));

case symbolTag:
if (symbolValueOf) return symbolValueOf.call(object) == symbolValueOf.call(other);
}
return !1;
}
var Symbol = __webpack_require__(378), Uint8Array = __webpack_require__(811), equalArrays = __webpack_require__(385), mapToArray = __webpack_require__(875), setToArray = __webpack_require__(878), UNORDERED_COMPARE_FLAG = 1, PARTIAL_COMPARE_FLAG = 2, boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", mapTag = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", symbolProto = Symbol ? Symbol.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
module.exports = equalByTag;
}, function(module, exports, __webpack_require__) {
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
var isPartial = bitmask & PARTIAL_COMPARE_FLAG, objProps = keys(object), objLength = objProps.length, othProps = keys(other), othLength = othProps.length;
if (objLength != othLength && !isPartial) return !1;
for (var index = objLength; index--; ) {
var key = objProps[index];
if (!(isPartial ? key in other : baseHas(other, key))) return !1;
}
var stacked = stack.get(object);
if (stacked) return stacked == other;
var result = !0;
stack.set(object, other);
for (var skipCtor = isPartial; ++index < objLength; ) {
key = objProps[index];
var objValue = object[key], othValue = other[key];
if (customizer) var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
if (!(void 0 === compared ? objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack) : compared)) {
result = !1;
break;
}
skipCtor || (skipCtor = "constructor" == key);
}
if (result && !skipCtor) {
var objCtor = object.constructor, othCtor = other.constructor;
objCtor != othCtor && "constructor" in object && "constructor" in other && !("function" == typeof objCtor && objCtor instanceof objCtor && "function" == typeof othCtor && othCtor instanceof othCtor) && (result = !1);
}
return stack.delete(object), result;
}
var baseHas = __webpack_require__(381), keys = __webpack_require__(262), PARTIAL_COMPARE_FLAG = 2;
module.exports = equalObjects;
}, function(module, exports, __webpack_require__) {
var baseProperty = __webpack_require__(383), getLength = baseProperty("length");
module.exports = getLength;
}, function(module, exports, __webpack_require__) {
function getMatchData(object) {
for (var result = keys(object), length = result.length; length--; ) {
var key = result[length], value = object[key];
result[length] = [ key, value, isStrictComparable(value) ];
}
return result;
}
var isStrictComparable = __webpack_require__(389), keys = __webpack_require__(262);
module.exports = getMatchData;
}, function(module, exports, __webpack_require__) {
function getSymbols(object) {
return getOwnPropertySymbols(Object(object));
}
var stubArray = __webpack_require__(900), getOwnPropertySymbols = Object.getOwnPropertySymbols;
getOwnPropertySymbols || (getSymbols = stubArray), module.exports = getSymbols;
}, function(module, exports, __webpack_require__) {
var arrayPush = __webpack_require__(255), getPrototype = __webpack_require__(257), getSymbols = __webpack_require__(850), getOwnPropertySymbols = Object.getOwnPropertySymbols, getSymbolsIn = getOwnPropertySymbols ? function(object) {
for (var result = []; object; ) arrayPush(result, getSymbols(object)), object = getPrototype(object);
return result;
} : getSymbols;
module.exports = getSymbolsIn;
}, function(module, exports, __webpack_require__) {
function getTag(value) {
return objectToString.call(value);
}
var DataView = __webpack_require__(806), Map = __webpack_require__(375), Promise = __webpack_require__(808), Set = __webpack_require__(810), WeakMap = __webpack_require__(812), toSource = __webpack_require__(391), mapTag = "[object Map]", objectTag = "[object Object]", promiseTag = "[object Promise]", setTag = "[object Set]", weakMapTag = "[object WeakMap]", dataViewTag = "[object DataView]", objectProto = Object.prototype, objectToString = objectProto.toString, dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
(DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) && (getTag = function(value) {
var result = objectToString.call(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : void 0;
if (ctorString) switch (ctorString) {
case dataViewCtorString:
return dataViewTag;

case mapCtorString:
return mapTag;

case promiseCtorString:
return promiseTag;

case setCtorString:
return setTag;

case weakMapCtorString:
return weakMapTag;
}
return result;
}), module.exports = getTag;
}, function(module, exports) {
function getValue(object, key) {
return null == object ? void 0 : object[key];
}
module.exports = getValue;
}, function(module, exports, __webpack_require__) {
function hasPath(object, path, hasFunc) {
path = isKey(path, object) ? [ path ] : castPath(path);
for (var result, index = -1, length = path.length; ++index < length; ) {
var key = toKey(path[index]);
if (!(result = null != object && hasFunc(object, key))) break;
object = object[key];
}
if (result) return result;
var length = object ? object.length : 0;
return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isString(object) || isArguments(object));
}
var castPath = __webpack_require__(384), isArguments = __webpack_require__(260), isArray = __webpack_require__(42), isIndex = __webpack_require__(259), isKey = __webpack_require__(173), isLength = __webpack_require__(176), isString = __webpack_require__(392), toKey = __webpack_require__(129);
module.exports = hasPath;
}, function(module, exports, __webpack_require__) {
function hashClear() {
this.__data__ = nativeCreate ? nativeCreate(null) : {};
}
var nativeCreate = __webpack_require__(174);
module.exports = hashClear;
}, function(module, exports) {
function hashDelete(key) {
return this.has(key) && delete this.__data__[key];
}
module.exports = hashDelete;
}, function(module, exports, __webpack_require__) {
function hashGet(key) {
var data = this.__data__;
if (nativeCreate) {
var result = data[key];
return result === HASH_UNDEFINED ? void 0 : result;
}
return hasOwnProperty.call(data, key) ? data[key] : void 0;
}
var nativeCreate = __webpack_require__(174), HASH_UNDEFINED = "__lodash_hash_undefined__", objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty;
module.exports = hashGet;
}, function(module, exports, __webpack_require__) {
function hashHas(key) {
var data = this.__data__;
return nativeCreate ? void 0 !== data[key] : hasOwnProperty.call(data, key);
}
var nativeCreate = __webpack_require__(174), objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty;
module.exports = hashHas;
}, function(module, exports, __webpack_require__) {
function hashSet(key, value) {
var data = this.__data__;
return data[key] = nativeCreate && void 0 === value ? HASH_UNDEFINED : value, this;
}
var nativeCreate = __webpack_require__(174), HASH_UNDEFINED = "__lodash_hash_undefined__";
module.exports = hashSet;
}, function(module, exports) {
function indexOfNaN(array, fromIndex, fromRight) {
for (var length = array.length, index = fromIndex + (fromRight ? 1 : -1); fromRight ? index-- : ++index < length; ) {
var other = array[index];
if (other !== other) return index;
}
return -1;
}
module.exports = indexOfNaN;
}, function(module, exports, __webpack_require__) {
function isFlattenable(value) {
return isArray(value) || isArguments(value);
}
var isArguments = __webpack_require__(260), isArray = __webpack_require__(42);
module.exports = isFlattenable;
}, function(module, exports) {
function isKeyable(value) {
var type = typeof value;
return "string" == type || "number" == type || "symbol" == type || "boolean" == type ? "__proto__" !== value : null === value;
}
module.exports = isKeyable;
}, function(module, exports, __webpack_require__) {
function isMasked(func) {
return !!maskSrcKey && maskSrcKey in func;
}
var coreJsData = __webpack_require__(843), maskSrcKey = function() {
var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
return uid ? "Symbol(src)_1." + uid : "";
}();
module.exports = isMasked;
}, function(module, exports) {
function iteratorToArray(iterator) {
for (var data, result = []; !(data = iterator.next()).done; ) result.push(data.value);
return result;
}
module.exports = iteratorToArray;
}, function(module, exports) {
function listCacheClear() {
this.__data__ = [];
}
module.exports = listCacheClear;
}, function(module, exports, __webpack_require__) {
function listCacheDelete(key) {
var data = this.__data__, index = assocIndexOf(data, key);
if (index < 0) return !1;
var lastIndex = data.length - 1;
return index == lastIndex ? data.pop() : splice.call(data, index, 1), !0;
}
var assocIndexOf = __webpack_require__(171), arrayProto = Array.prototype, splice = arrayProto.splice;
module.exports = listCacheDelete;
}, function(module, exports, __webpack_require__) {
function listCacheGet(key) {
var data = this.__data__, index = assocIndexOf(data, key);
return index < 0 ? void 0 : data[index][1];
}
var assocIndexOf = __webpack_require__(171);
module.exports = listCacheGet;
}, function(module, exports, __webpack_require__) {
function listCacheHas(key) {
return assocIndexOf(this.__data__, key) > -1;
}
var assocIndexOf = __webpack_require__(171);
module.exports = listCacheHas;
}, function(module, exports, __webpack_require__) {
function listCacheSet(key, value) {
var data = this.__data__, index = assocIndexOf(data, key);
return index < 0 ? data.push([ key, value ]) : data[index][1] = value, this;
}
var assocIndexOf = __webpack_require__(171);
module.exports = listCacheSet;
}, function(module, exports, __webpack_require__) {
function mapCacheClear() {
this.__data__ = {
hash: new Hash(),
map: new (Map || ListCache)(),
string: new Hash()
};
}
var Hash = __webpack_require__(807), ListCache = __webpack_require__(170), Map = __webpack_require__(375);
module.exports = mapCacheClear;
}, function(module, exports, __webpack_require__) {
function mapCacheDelete(key) {
return getMapData(this, key).delete(key);
}
var getMapData = __webpack_require__(172);
module.exports = mapCacheDelete;
}, function(module, exports, __webpack_require__) {
function mapCacheGet(key) {
return getMapData(this, key).get(key);
}
var getMapData = __webpack_require__(172);
module.exports = mapCacheGet;
}, function(module, exports, __webpack_require__) {
function mapCacheHas(key) {
return getMapData(this, key).has(key);
}
var getMapData = __webpack_require__(172);
module.exports = mapCacheHas;
}, function(module, exports, __webpack_require__) {
function mapCacheSet(key, value) {
return getMapData(this, key).set(key, value), this;
}
var getMapData = __webpack_require__(172);
module.exports = mapCacheSet;
}, function(module, exports) {
function mapToArray(map) {
var index = -1, result = Array(map.size);
return map.forEach(function(value, key) {
result[++index] = [ key, value ];
}), result;
}
module.exports = mapToArray;
}, function(module, exports) {
function setCacheAdd(value) {
return this.__data__.set(value, HASH_UNDEFINED), this;
}
var HASH_UNDEFINED = "__lodash_hash_undefined__";
module.exports = setCacheAdd;
}, function(module, exports) {
function setCacheHas(value) {
return this.__data__.has(value);
}
module.exports = setCacheHas;
}, function(module, exports) {
function setToArray(set) {
var index = -1, result = Array(set.size);
return set.forEach(function(value) {
result[++index] = value;
}), result;
}
module.exports = setToArray;
}, function(module, exports, __webpack_require__) {
function stackClear() {
this.__data__ = new ListCache();
}
var ListCache = __webpack_require__(170);
module.exports = stackClear;
}, function(module, exports) {
function stackDelete(key) {
return this.__data__.delete(key);
}
module.exports = stackDelete;
}, function(module, exports) {
function stackGet(key) {
return this.__data__.get(key);
}
module.exports = stackGet;
}, function(module, exports) {
function stackHas(key) {
return this.__data__.has(key);
}
module.exports = stackHas;
}, function(module, exports, __webpack_require__) {
function stackSet(key, value) {
var cache = this.__data__;
return cache instanceof ListCache && cache.__data__.length == LARGE_ARRAY_SIZE && (cache = this.__data__ = new MapCache(cache.__data__)), 
cache.set(key, value), this;
}
var ListCache = __webpack_require__(170), MapCache = __webpack_require__(253), LARGE_ARRAY_SIZE = 200;
module.exports = stackSet;
}, function(module, exports, __webpack_require__) {
var memoize = __webpack_require__(895), toString = __webpack_require__(904), rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g, reEscapeChar = /\\(\\)?/g, stringToPath = memoize(function(string) {
var result = [];
return toString(string).replace(rePropName, function(match, number, quote, string) {
result.push(quote ? string.replace(reEscapeChar, "$1") : number || match);
}), result;
});
module.exports = stringToPath;
}, function(module, exports) {
function eq(value, other) {
return value === other || value !== value && other !== other;
}
module.exports = eq;
}, function(module, exports, __webpack_require__) {
function forEach(collection, iteratee) {
var func = isArray(collection) ? arrayEach : baseEach;
return func(collection, baseIteratee(iteratee, 3));
}
var arrayEach = __webpack_require__(814), baseEach = __webpack_require__(256), baseIteratee = __webpack_require__(128), isArray = __webpack_require__(42);
module.exports = forEach;
}, function(module, exports, __webpack_require__) {
function get(object, path, defaultValue) {
var result = null == object ? void 0 : baseGet(object, path);
return void 0 === result ? defaultValue : result;
}
var baseGet = __webpack_require__(380);
module.exports = get;
}, function(module, exports, __webpack_require__) {
function hasIn(object, path) {
return null != object && hasPath(object, path, baseHasIn);
}
var baseHasIn = __webpack_require__(825), hasPath = __webpack_require__(854);
module.exports = hasIn;
}, function(module, exports) {
function identity(value) {
return value;
}
module.exports = identity;
}, function(module, exports, __webpack_require__) {
function isArrayLikeObject(value) {
return isObjectLike(value) && isArrayLike(value);
}
var isArrayLike = __webpack_require__(175), isObjectLike = __webpack_require__(108);
module.exports = isArrayLikeObject;
}, function(module, exports, __webpack_require__) {
function isTypedArray(value) {
return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}
var isLength = __webpack_require__(176), isObjectLike = __webpack_require__(108), argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", weakMapTag = "[object WeakMap]", arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]", typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = !0, 
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = !1;
var objectProto = Object.prototype, objectToString = objectProto.toString;
module.exports = isTypedArray;
}, function(module, exports, __webpack_require__) {
function keysIn(object) {
for (var index = -1, isProto = isPrototype(object), props = baseKeysIn(object), propsLength = props.length, indexes = indexKeys(object), skipIndexes = !!indexes, result = indexes || [], length = result.length; ++index < propsLength; ) {
var key = props[index];
skipIndexes && ("length" == key || isIndex(key, length)) || "constructor" == key && (isProto || !hasOwnProperty.call(object, key)) || result.push(key);
}
return result;
}
var baseKeysIn = __webpack_require__(831), indexKeys = __webpack_require__(387), isIndex = __webpack_require__(259), isPrototype = __webpack_require__(388), objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty;
module.exports = keysIn;
}, function(module, exports, __webpack_require__) {
function map(collection, iteratee) {
var func = isArray(collection) ? arrayMap : baseMap;
return func(collection, baseIteratee(iteratee, 3));
}
var arrayMap = __webpack_require__(254), baseIteratee = __webpack_require__(128), baseMap = __webpack_require__(832), isArray = __webpack_require__(42);
module.exports = map;
}, function(module, exports, __webpack_require__) {
function mapValues(object, iteratee) {
var result = {};
return iteratee = baseIteratee(iteratee, 3), baseForOwn(object, function(value, key, object) {
result[key] = iteratee(value, key, object);
}), result;
}
var baseForOwn = __webpack_require__(379), baseIteratee = __webpack_require__(128);
module.exports = mapValues;
}, function(module, exports, __webpack_require__) {
function memoize(func, resolver) {
if ("function" != typeof func || resolver && "function" != typeof resolver) throw new TypeError(FUNC_ERROR_TEXT);
var memoized = function() {
var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
if (cache.has(key)) return cache.get(key);
var result = func.apply(this, args);
return memoized.cache = cache.set(key, result), result;
};
return memoized.cache = new (memoize.Cache || MapCache)(), memoized;
}
var MapCache = __webpack_require__(253), FUNC_ERROR_TEXT = "Expected a function";
memoize.Cache = MapCache, module.exports = memoize;
}, function(module, exports, __webpack_require__) {
var arrayMap = __webpack_require__(254), baseDifference = __webpack_require__(820), baseFlatten = __webpack_require__(822), basePick = __webpack_require__(835), getAllKeysIn = __webpack_require__(386), rest = __webpack_require__(899), toKey = __webpack_require__(129), omit = rest(function(object, props) {
return null == object ? {} : (props = arrayMap(baseFlatten(props, 1), toKey), basePick(object, baseDifference(getAllKeysIn(object), props)));
});
module.exports = omit;
}, function(module, exports, __webpack_require__) {
function omitBy(object, predicate) {
return predicate = baseIteratee(predicate), basePickBy(object, function(value, key) {
return !predicate(value, key);
});
}
var baseIteratee = __webpack_require__(128), basePickBy = __webpack_require__(836);
module.exports = omitBy;
}, function(module, exports, __webpack_require__) {
function property(path) {
return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}
var baseProperty = __webpack_require__(383), basePropertyDeep = __webpack_require__(837), isKey = __webpack_require__(173), toKey = __webpack_require__(129);
module.exports = property;
}, function(module, exports, __webpack_require__) {
function rest(func, start) {
if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
return start = nativeMax(void 0 === start ? func.length - 1 : toInteger(start), 0), 
function() {
for (var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length); ++index < length; ) array[index] = args[start + index];
switch (start) {
case 0:
return func.call(this, array);

case 1:
return func.call(this, args[0], array);

case 2:
return func.call(this, args[0], args[1], array);
}
var otherArgs = Array(start + 1);
for (index = -1; ++index < start; ) otherArgs[index] = args[index];
return otherArgs[start] = array, apply(func, this, otherArgs);
};
}
var apply = __webpack_require__(813), toInteger = __webpack_require__(902), FUNC_ERROR_TEXT = "Expected a function", nativeMax = Math.max;
module.exports = rest;
}, function(module, exports) {
function stubArray() {
return [];
}
module.exports = stubArray;
}, function(module, exports, __webpack_require__) {
function toFinite(value) {
if (!value) return 0 === value ? value : 0;
if (value = toNumber(value), value === INFINITY || value === -INFINITY) {
var sign = value < 0 ? -1 : 1;
return sign * MAX_INTEGER;
}
return value === value ? value : 0;
}
var toNumber = __webpack_require__(903), INFINITY = 1 / 0, MAX_INTEGER = 1.7976931348623157e308;
module.exports = toFinite;
}, function(module, exports, __webpack_require__) {
function toInteger(value) {
var result = toFinite(value), remainder = result % 1;
return result === result ? remainder ? result - remainder : result : 0;
}
var toFinite = __webpack_require__(901);
module.exports = toInteger;
}, function(module, exports, __webpack_require__) {
function toNumber(value) {
if ("number" == typeof value) return value;
if (isSymbol(value)) return NAN;
if (isObject(value)) {
var other = isFunction(value.valueOf) ? value.valueOf() : value;
value = isObject(other) ? other + "" : other;
}
if ("string" != typeof value) return 0 === value ? value : +value;
value = value.replace(reTrim, "");
var isBinary = reIsBinary.test(value);
return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var isFunction = __webpack_require__(261), isObject = __webpack_require__(130), isSymbol = __webpack_require__(178), NAN = NaN, reTrim = /^\s+|\s+$/g, reIsBadHex = /^[-+]0x[0-9a-f]+$/i, reIsBinary = /^0b[01]+$/i, reIsOctal = /^0o[0-7]+$/i, freeParseInt = parseInt;
module.exports = toNumber;
}, function(module, exports, __webpack_require__) {
function toString(value) {
return null == value ? "" : baseToString(value);
}
var baseToString = __webpack_require__(839);
module.exports = toString;
}, function(module, exports, __webpack_require__) {
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;
!function(root, definition) {
"use strict";
__WEBPACK_AMD_DEFINE_FACTORY__ = definition, __WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module) : __WEBPACK_AMD_DEFINE_FACTORY__, 
!(void 0 !== __WEBPACK_AMD_DEFINE_RESULT__ && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}(this, function() {
"use strict";
function realMethod(methodName) {
return typeof console !== undefinedType && (void 0 !== console[methodName] ? bindMethod(console, methodName) : void 0 !== console.log ? bindMethod(console, "log") : noop);
}
function bindMethod(obj, methodName) {
var method = obj[methodName];
if ("function" == typeof method.bind) return method.bind(obj);
try {
return Function.prototype.bind.call(method, obj);
} catch (e) {
return function() {
return Function.prototype.apply.apply(method, [ obj, arguments ]);
};
}
}
function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
return function() {
typeof console !== undefinedType && (replaceLoggingMethods.call(this, level, loggerName), 
this[methodName].apply(this, arguments));
};
}
function replaceLoggingMethods(level, loggerName) {
for (var i = 0; i < logMethods.length; i++) {
var methodName = logMethods[i];
this[methodName] = i < level ? noop : this.methodFactory(methodName, level, loggerName);
}
}
function defaultMethodFactory(methodName, level, loggerName) {
return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
}
function Logger(name, defaultLevel, factory) {
function persistLevelIfPossible(levelNum) {
var levelName = (logMethods[levelNum] || "silent").toUpperCase();
try {
return void (window.localStorage[storageKey] = levelName);
} catch (ignore) {}
try {
window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
} catch (ignore) {}
}
function getPersistedLevel() {
var storedLevel;
try {
storedLevel = window.localStorage[storageKey];
} catch (ignore) {}
if (typeof storedLevel === undefinedType) try {
var cookie = window.document.cookie, location = cookie.indexOf(encodeURIComponent(storageKey) + "=");
location && (storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1]);
} catch (ignore) {}
return void 0 === self.levels[storedLevel] && (storedLevel = void 0), storedLevel;
}
var currentLevel, self = this, storageKey = "loglevel";
name && (storageKey += ":" + name), self.levels = {
TRACE: 0,
DEBUG: 1,
INFO: 2,
WARN: 3,
ERROR: 4,
SILENT: 5
}, self.methodFactory = factory || defaultMethodFactory, self.getLevel = function() {
return currentLevel;
}, self.setLevel = function(level, persist) {
if ("string" == typeof level && void 0 !== self.levels[level.toUpperCase()] && (level = self.levels[level.toUpperCase()]), 
!("number" == typeof level && level >= 0 && level <= self.levels.SILENT)) throw "log.setLevel() called with invalid level: " + level;
if (currentLevel = level, persist !== !1 && persistLevelIfPossible(level), replaceLoggingMethods.call(self, level, name), 
typeof console === undefinedType && level < self.levels.SILENT) return "No console available for logging";
}, self.setDefaultLevel = function(level) {
getPersistedLevel() || self.setLevel(level, !1);
}, self.enableAll = function(persist) {
self.setLevel(self.levels.TRACE, persist);
}, self.disableAll = function(persist) {
self.setLevel(self.levels.SILENT, persist);
};
var initialLevel = getPersistedLevel();
null == initialLevel && (initialLevel = null == defaultLevel ? "WARN" : defaultLevel), 
self.setLevel(initialLevel, !1);
}
var noop = function() {}, undefinedType = "undefined", logMethods = [ "trace", "debug", "info", "warn", "error" ], defaultLogger = new Logger(), _loggersByName = {};
defaultLogger.getLogger = function getLogger(name) {
if ("string" != typeof name || "" === name) throw new TypeError("You must supply a name when creating a logger.");
var logger = _loggersByName[name];
return logger || (logger = _loggersByName[name] = new Logger(name, defaultLogger.getLevel(), defaultLogger.methodFactory)), 
logger;
};
var _log = typeof window !== undefinedType ? window.log : void 0;
return defaultLogger.noConflict = function() {
return typeof window !== undefinedType && window.log === defaultLogger && (window.log = _log), 
defaultLogger;
}, defaultLogger;
});
}, , , [ 1134, 914 ], function(module, exports, __webpack_require__) {
module.exports = {
"default": __webpack_require__(915),
__esModule: !0
};
}, function(module, exports, __webpack_require__) {
module.exports = {
"default": __webpack_require__(917),
__esModule: !0
};
}, [ 1136, 918 ], [ 1137, 920 ], [ 1142, 947, 19 ], [ 1143, 948, 19 ], function(module, exports, __webpack_require__) {
__webpack_require__(420), module.exports = __webpack_require__(19).Object.getOwnPropertySymbols;
}, [ 1144, 949, 19 ], function(module, exports, __webpack_require__) {
__webpack_require__(950), module.exports = __webpack_require__(19).Object.keys;
}, [ 1145, 951, 19 ], function(module, exports, __webpack_require__) {
__webpack_require__(418), __webpack_require__(419), __webpack_require__(421), __webpack_require__(952), 
__webpack_require__(953), __webpack_require__(954), module.exports = __webpack_require__(19).Promise;
}, [ 1146, 420, 418, 955, 956, 19 ], [ 1147, 419, 421, 277 ], 547, 80, [ 1152, 109, 417, 943 ], [ 1157, 182, 408, 271 ], [ 1158, 133, 931, 929, 61, 417, 945 ], 341, [ 1162, 132 ], [ 1163, 135, 34 ], [ 1164, 132 ], [ 1165, 61 ], [ 1166, 270, 183, 184, 94, 34 ], [ 1168, 34 ], 344, [ 1169, 186, 71, 93, 72, 134 ], [ 1170, 28, 416, 132 ], [ 1174, 72, 61, 182, 70 ], [ 1176, 109, 407 ], function(module, exports, __webpack_require__) {
var hide = __webpack_require__(94);
module.exports = function(target, src, safe) {
for (var key in src) safe && target[key] ? target[key] = src[key] : hide(target, key, src[key]);
return target;
};
}, [ 1183, 71, 61, 133, 406 ], function(module, exports, __webpack_require__) {
"use strict";
var global = __webpack_require__(28), core = __webpack_require__(19), dP = __webpack_require__(72), DESCRIPTORS = __webpack_require__(70), SPECIES = __webpack_require__(34)("species");
module.exports = function(KEY) {
var C = "function" == typeof core[KEY] ? core[KEY] : global[KEY];
DESCRIPTORS && C && !C[SPECIES] && dP.f(C, SPECIES, {
configurable: !0,
get: function() {
return this;
}
});
};
}, [ 1188, 274, 266 ], [ 1190, 274 ], [ 1195, 28 ], [ 1199, 402, 34, 135, 19 ], [ 1200, 922, 934, 135, 109, 405 ], [ 1201, 62, 270 ], [ 1202, 62, 70, 72 ], [ 1203, 185, 409, 411 ], [ 1204, 185, 182, 411 ], [ 1205, 62, 940 ], [ 1206, 136, 28, 133, 402, 62, 71, 181, 923, 926, 415, 416, 936, 269, 412, 944, 413, 34, 939, 184, 941, 19, 933 ], [ 1209, 62, 19, 28, 415, 413 ], [ 1210, 62, 269, 412 ], [ 1211, 276 ], [ 1212, 276 ], function(module, exports, __webpack_require__) {
__webpack_require__(979), __webpack_require__(978), module.exports = __webpack_require__(188).Symbol;
}, function(module, exports) {
module.exports = function(it) {
if ("function" != typeof it) throw TypeError(it + " is not a function!");
return it;
};
}, function(module, exports, __webpack_require__) {
var toIObject = __webpack_require__(112), toLength = __webpack_require__(977), toIndex = __webpack_require__(976);
module.exports = function(IS_INCLUDES) {
return function($this, el, fromIndex) {
var value, O = toIObject($this), length = toLength(O.length), index = toIndex(fromIndex, length);
if (IS_INCLUDES && el != el) {
for (;length > index; ) if (value = O[index++], value != value) return !0;
} else for (;length > index; index++) if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index;
return !IS_INCLUDES && -1;
};
};
}, function(module, exports, __webpack_require__) {
var cof = __webpack_require__(278), TAG = __webpack_require__(191)("toStringTag"), ARG = "Arguments" == cof(function() {
return arguments;
}()), tryGet = function(it, key) {
try {
return it[key];
} catch (e) {}
};
module.exports = function(it) {
var O, T, B;
return void 0 === it ? "Undefined" : null === it ? "Null" : "string" == typeof (T = tryGet(O = Object(it), TAG)) ? T : ARG ? cof(O) : "Object" == (B = cof(O)) && "function" == typeof O.callee ? "Arguments" : B;
};
}, function(module, exports, __webpack_require__) {
var aFunction = __webpack_require__(958);
module.exports = function(fn, that, length) {
if (aFunction(fn), void 0 === that) return fn;
switch (length) {
case 1:
return function(a) {
return fn.call(that, a);
};

case 2:
return function(a, b) {
return fn.call(that, a, b);
};

case 3:
return function(a, b, c) {
return fn.call(that, a, b, c);
};
}
return function() {
return fn.apply(that, arguments);
};
};
}, 437, function(module, exports, __webpack_require__) {
var getKeys = __webpack_require__(280), gOPS = __webpack_require__(426), pIE = __webpack_require__(281);
module.exports = function(it) {
var result = getKeys(it), getSymbols = gOPS.f;
if (getSymbols) for (var key, symbols = getSymbols(it), isEnum = pIE.f, i = 0; symbols.length > i; ) isEnum.call(it, key = symbols[i++]) && result.push(key);
return result;
};
}, function(module, exports, __webpack_require__) {
var global = __webpack_require__(95), core = __webpack_require__(188), hide = __webpack_require__(423), redefine = __webpack_require__(283), ctx = __webpack_require__(961), PROTOTYPE = "prototype", $export = function(type, name, source) {
var key, own, out, exp, IS_FORCED = type & $export.F, IS_GLOBAL = type & $export.G, IS_STATIC = type & $export.S, IS_PROTO = type & $export.P, IS_BIND = type & $export.B, target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE], exports = IS_GLOBAL ? core : core[name] || (core[name] = {}), expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
IS_GLOBAL && (source = name);
for (key in source) own = !IS_FORCED && target && void 0 !== target[key], out = (own ? target : source)[key], 
exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && "function" == typeof out ? ctx(Function.call, out) : out, 
target && redefine(target, key, out, type & $export.U), exports[key] != out && hide(exports, key, exp), 
IS_PROTO && expProto[key] != out && (expProto[key] = out);
};
global.core = core, $export.F = 1, $export.G = 2, $export.S = 4, $export.P = 8, 
$export.B = 16, $export.W = 32, $export.U = 64, $export.R = 128, module.exports = $export;
}, function(module, exports, __webpack_require__) {
module.exports = __webpack_require__(95).document && document.documentElement;
}, function(module, exports, __webpack_require__) {
var cof = __webpack_require__(278);
module.exports = Object("z").propertyIsEnumerable(0) ? Object : function(it) {
return "String" == cof(it) ? it.split("") : Object(it);
};
}, function(module, exports, __webpack_require__) {
var cof = __webpack_require__(278);
module.exports = Array.isArray || function isArray(arg) {
return "Array" == cof(arg);
};
}, function(module, exports, __webpack_require__) {
var getKeys = __webpack_require__(280), toIObject = __webpack_require__(112);
module.exports = function(object, el) {
for (var key, O = toIObject(object), keys = getKeys(O), length = keys.length, index = 0; length > index; ) if (O[key = keys[index++]] === el) return key;
};
}, function(module, exports) {
module.exports = !1;
}, function(module, exports, __webpack_require__) {
var META = __webpack_require__(138)("meta"), isObject = __webpack_require__(190), has = __webpack_require__(111), setDesc = __webpack_require__(137).f, id = 0, isExtensible = Object.isExtensible || function() {
return !0;
}, FREEZE = !__webpack_require__(189)(function() {
return isExtensible(Object.preventExtensions({}));
}), setMeta = function(it) {
setDesc(it, META, {
value: {
i: "O" + ++id,
w: {}
}
});
}, fastKey = function(it, create) {
if (!isObject(it)) return "symbol" == typeof it ? it : ("string" == typeof it ? "S" : "P") + it;
if (!has(it, META)) {
if (!isExtensible(it)) return "F";
if (!create) return "E";
setMeta(it);
}
return it[META].i;
}, getWeak = function(it, create) {
if (!has(it, META)) {
if (!isExtensible(it)) return !0;
if (!create) return !1;
setMeta(it);
}
return it[META].w;
}, onFreeze = function(it) {
return FREEZE && meta.NEED && isExtensible(it) && !has(it, META) && setMeta(it), 
it;
}, meta = module.exports = {
KEY: META,
NEED: !1,
fastKey: fastKey,
getWeak: getWeak,
onFreeze: onFreeze
};
}, function(module, exports, __webpack_require__) {
var anObject = __webpack_require__(187), dPs = __webpack_require__(972), enumBugKeys = __webpack_require__(279), IE_PROTO = __webpack_require__(428)("IE_PROTO"), Empty = function() {}, PROTOTYPE = "prototype", createDict = function() {
var iframeDocument, iframe = __webpack_require__(422)("iframe"), i = enumBugKeys.length, gt = ">";
for (iframe.style.display = "none", __webpack_require__(965).appendChild(iframe), 
iframe.src = "javascript:", iframeDocument = iframe.contentWindow.document, iframeDocument.open(), 
iframeDocument.write("<script>document.F=Object</script" + gt), iframeDocument.close(), 
createDict = iframeDocument.F; i--; ) delete createDict[PROTOTYPE][enumBugKeys[i]];
return createDict();
};
module.exports = Object.create || function create(O, Properties) {
var result;
return null !== O ? (Empty[PROTOTYPE] = anObject(O), result = new Empty(), Empty[PROTOTYPE] = null, 
result[IE_PROTO] = O) : result = createDict(), void 0 === Properties ? result : dPs(result, Properties);
};
}, function(module, exports, __webpack_require__) {
var dP = __webpack_require__(137), anObject = __webpack_require__(187), getKeys = __webpack_require__(280);
module.exports = __webpack_require__(110) ? Object.defineProperties : function defineProperties(O, Properties) {
anObject(O);
for (var P, keys = getKeys(Properties), length = keys.length, i = 0; length > i; ) dP.f(O, P = keys[i++], Properties[P]);
return O;
};
}, function(module, exports, __webpack_require__) {
var pIE = __webpack_require__(281), createDesc = __webpack_require__(282), toIObject = __webpack_require__(112), toPrimitive = __webpack_require__(285), has = __webpack_require__(111), IE8_DOM_DEFINE = __webpack_require__(424), gOPD = Object.getOwnPropertyDescriptor;
exports.f = __webpack_require__(110) ? gOPD : function getOwnPropertyDescriptor(O, P) {
if (O = toIObject(O), P = toPrimitive(P, !0), IE8_DOM_DEFINE) try {
return gOPD(O, P);
} catch (e) {}
if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};
}, function(module, exports, __webpack_require__) {
var toIObject = __webpack_require__(112), gOPN = __webpack_require__(425).f, toString = {}.toString, windowNames = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], getWindowNames = function(it) {
try {
return gOPN.f(it);
} catch (e) {
return windowNames.slice();
}
};
module.exports.f = function getOwnPropertyNames(it) {
return windowNames && "[object Window]" == toString.call(it) ? getWindowNames(it) : gOPN(toIObject(it));
};
}, function(module, exports, __webpack_require__) {
var def = __webpack_require__(137).f, has = __webpack_require__(111), TAG = __webpack_require__(191)("toStringTag");
module.exports = function(it, tag, stat) {
it && !has(it = stat ? it : it.prototype, TAG) && def(it, TAG, {
configurable: !0,
value: tag
});
};
}, function(module, exports, __webpack_require__) {
var toInteger = __webpack_require__(429), max = Math.max, min = Math.min;
module.exports = function(index, length) {
return index = toInteger(index), index < 0 ? max(index + length, 0) : min(index, length);
};
}, function(module, exports, __webpack_require__) {
var toInteger = __webpack_require__(429), min = Math.min;
module.exports = function(it) {
return it > 0 ? min(toInteger(it), 9007199254740991) : 0;
};
}, function(module, exports, __webpack_require__) {
"use strict";
var classof = __webpack_require__(960), test = {};
test[__webpack_require__(191)("toStringTag")] = "z", test + "" != "[object z]" && __webpack_require__(283)(Object.prototype, "toString", function toString() {
return "[object " + classof(this) + "]";
}, !0);
}, function(module, exports, __webpack_require__) {
"use strict";
var global = __webpack_require__(95), core = __webpack_require__(188), has = __webpack_require__(111), DESCRIPTORS = __webpack_require__(110), $export = __webpack_require__(964), redefine = __webpack_require__(283), META = __webpack_require__(970).KEY, $fails = __webpack_require__(189), shared = __webpack_require__(284), setToStringTag = __webpack_require__(975), uid = __webpack_require__(138), wks = __webpack_require__(191), keyOf = __webpack_require__(968), enumKeys = __webpack_require__(963), isArray = __webpack_require__(967), anObject = __webpack_require__(187), toIObject = __webpack_require__(112), toPrimitive = __webpack_require__(285), createDesc = __webpack_require__(282), _create = __webpack_require__(971), gOPNExt = __webpack_require__(974), $GOPD = __webpack_require__(973), $DP = __webpack_require__(137), gOPD = $GOPD.f, dP = $DP.f, gOPN = gOPNExt.f, $Symbol = global.Symbol, $JSON = global.JSON, _stringify = $JSON && $JSON.stringify, setter = !1, HIDDEN = wks("_hidden"), isEnum = {}.propertyIsEnumerable, SymbolRegistry = shared("symbol-registry"), AllSymbols = shared("symbols"), ObjectProto = Object.prototype, USE_NATIVE = "function" == typeof $Symbol, QObject = global.QObject, setSymbolDesc = DESCRIPTORS && $fails(function() {
return 7 != _create(dP({}, "a", {
get: function() {
return dP(this, "a", {
value: 7
}).a;
}
})).a;
}) ? function(it, key, D) {
var protoDesc = gOPD(ObjectProto, key);
protoDesc && delete ObjectProto[key], dP(it, key, D), protoDesc && it !== ObjectProto && dP(ObjectProto, key, protoDesc);
} : dP, wrap = function(tag) {
var sym = AllSymbols[tag] = _create($Symbol.prototype);
return sym._k = tag, DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
configurable: !0,
set: function(value) {
has(this, HIDDEN) && has(this[HIDDEN], tag) && (this[HIDDEN][tag] = !1), setSymbolDesc(this, tag, createDesc(1, value));
}
}), sym;
}, isSymbol = function(it) {
return "symbol" == typeof it;
}, $defineProperty = function defineProperty(it, key, D) {
return anObject(it), key = toPrimitive(key, !0), anObject(D), has(AllSymbols, key) ? (D.enumerable ? (has(it, HIDDEN) && it[HIDDEN][key] && (it[HIDDEN][key] = !1), 
D = _create(D, {
enumerable: createDesc(0, !1)
})) : (has(it, HIDDEN) || dP(it, HIDDEN, createDesc(1, {})), it[HIDDEN][key] = !0), 
setSymbolDesc(it, key, D)) : dP(it, key, D);
}, $defineProperties = function defineProperties(it, P) {
anObject(it);
for (var key, keys = enumKeys(P = toIObject(P)), i = 0, l = keys.length; l > i; ) $defineProperty(it, key = keys[i++], P[key]);
return it;
}, $create = function create(it, P) {
return void 0 === P ? _create(it) : $defineProperties(_create(it), P);
}, $propertyIsEnumerable = function propertyIsEnumerable(key) {
var E = isEnum.call(this, key = toPrimitive(key, !0));
return !(E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]) || E;
}, $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
var D = gOPD(it = toIObject(it), key = toPrimitive(key, !0));
return !D || !has(AllSymbols, key) || has(it, HIDDEN) && it[HIDDEN][key] || (D.enumerable = !0), 
D;
}, $getOwnPropertyNames = function getOwnPropertyNames(it) {
for (var key, names = gOPN(toIObject(it)), result = [], i = 0; names.length > i; ) has(AllSymbols, key = names[i++]) || key == HIDDEN || key == META || result.push(key);
return result;
}, $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
for (var key, names = gOPN(toIObject(it)), result = [], i = 0; names.length > i; ) has(AllSymbols, key = names[i++]) && result.push(AllSymbols[key]);
return result;
}, $stringify = function stringify(it) {
if (void 0 !== it && !isSymbol(it)) {
for (var replacer, $replacer, args = [ it ], i = 1; arguments.length > i; ) args.push(arguments[i++]);
return replacer = args[1], "function" == typeof replacer && ($replacer = replacer), 
!$replacer && isArray(replacer) || (replacer = function(key, value) {
if ($replacer && (value = $replacer.call(this, key, value)), !isSymbol(value)) return value;
}), args[1] = replacer, _stringify.apply($JSON, args);
}
}, BUGGY_JSON = $fails(function() {
var S = $Symbol();
return "[null]" != _stringify([ S ]) || "{}" != _stringify({
a: S
}) || "{}" != _stringify(Object(S));
});
USE_NATIVE || ($Symbol = function Symbol() {
if (isSymbol(this)) throw TypeError("Symbol is not a constructor");
return wrap(uid(arguments.length > 0 ? arguments[0] : void 0));
}, redefine($Symbol.prototype, "toString", function toString() {
return this._k;
}), isSymbol = function(it) {
return it instanceof $Symbol;
}, $GOPD.f = $getOwnPropertyDescriptor, $DP.f = $defineProperty, __webpack_require__(425).f = gOPNExt.f = $getOwnPropertyNames, 
__webpack_require__(281).f = $propertyIsEnumerable, __webpack_require__(426).f = $getOwnPropertySymbols, 
DESCRIPTORS && !__webpack_require__(969) && redefine(ObjectProto, "propertyIsEnumerable", $propertyIsEnumerable, !0)), 
$export($export.G + $export.W + $export.F * !USE_NATIVE, {
Symbol: $Symbol
});
for (var symbols = "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), i = 0; symbols.length > i; ) {
var key = symbols[i++], Wrapper = core.Symbol, sym = wks(key);
key in Wrapper || dP(Wrapper, key, {
value: USE_NATIVE ? sym : wrap(sym)
});
}
QObject && QObject.prototype && QObject.prototype.findChild || (setter = !0), $export($export.S + $export.F * !USE_NATIVE, "Symbol", {
"for": function(key) {
return has(SymbolRegistry, key += "") ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
},
keyFor: function keyFor(key) {
return keyOf(SymbolRegistry, key);
},
useSetter: function() {
setter = !0;
},
useSimple: function() {
setter = !1;
}
}), $export($export.S + $export.F * !USE_NATIVE, "Object", {
create: $create,
defineProperty: $defineProperty,
defineProperties: $defineProperties,
getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
getOwnPropertyNames: $getOwnPropertyNames,
getOwnPropertySymbols: $getOwnPropertySymbols
}), $JSON && $export($export.S + $export.F * (!USE_NATIVE || BUGGY_JSON), "JSON", {
stringify: $stringify
}), setToStringTag($Symbol, "Symbol"), setToStringTag(Math, "Math", !0), setToStringTag(global.JSON, "JSON", !0);
}, function(module, exports, __webpack_require__) {
var __WEBPACK_AMD_DEFINE_RESULT__;
(function(process, global, module) {
/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
	 * @version   3.1.2
	 */
(function() {
"use strict";
function lib$es6$promise$utils$$objectOrFunction(x) {
return "function" == typeof x || "object" == typeof x && null !== x;
}
function lib$es6$promise$utils$$isFunction(x) {
return "function" == typeof x;
}
function lib$es6$promise$asap$$setScheduler(scheduleFn) {
lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
}
function lib$es6$promise$asap$$setAsap(asapFn) {
lib$es6$promise$asap$$asap = asapFn;
}
function lib$es6$promise$asap$$useNextTick() {
return function() {
process.nextTick(lib$es6$promise$asap$$flush);
};
}
function lib$es6$promise$asap$$useVertxTimer() {
return function() {
lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
};
}
function lib$es6$promise$asap$$useMutationObserver() {
var iterations = 0, observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush), node = document.createTextNode("");
return observer.observe(node, {
characterData: !0
}), function() {
node.data = iterations = ++iterations % 2;
};
}
function lib$es6$promise$asap$$useMessageChannel() {
var channel = new MessageChannel();
return channel.port1.onmessage = lib$es6$promise$asap$$flush, function() {
channel.port2.postMessage(0);
};
}
function lib$es6$promise$asap$$useSetTimeout() {
return function() {
setTimeout(lib$es6$promise$asap$$flush, 1);
};
}
function lib$es6$promise$asap$$flush() {
for (var i = 0; i < lib$es6$promise$asap$$len; i += 2) {
var callback = lib$es6$promise$asap$$queue[i], arg = lib$es6$promise$asap$$queue[i + 1];
callback(arg), lib$es6$promise$asap$$queue[i] = void 0, lib$es6$promise$asap$$queue[i + 1] = void 0;
}
lib$es6$promise$asap$$len = 0;
}
function lib$es6$promise$asap$$attemptVertx() {
try {
var vertx = __webpack_require__(1132);
return lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext, 
lib$es6$promise$asap$$useVertxTimer();
} catch (e) {
return lib$es6$promise$asap$$useSetTimeout();
}
}
function lib$es6$promise$then$$then(onFulfillment, onRejection) {
var parent = this, state = parent._state;
if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) return this;
var child = new this.constructor(lib$es6$promise$$internal$$noop), result = parent._result;
if (state) {
var callback = arguments[state - 1];
lib$es6$promise$asap$$asap(function() {
lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
});
} else lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
return child;
}
function lib$es6$promise$promise$resolve$$resolve(object) {
var Constructor = this;
if (object && "object" == typeof object && object.constructor === Constructor) return object;
var promise = new Constructor(lib$es6$promise$$internal$$noop);
return lib$es6$promise$$internal$$resolve(promise, object), promise;
}
function lib$es6$promise$$internal$$noop() {}
function lib$es6$promise$$internal$$selfFulfillment() {
return new TypeError("You cannot resolve a promise with itself");
}
function lib$es6$promise$$internal$$cannotReturnOwn() {
return new TypeError("A promises callback cannot return that same promise.");
}
function lib$es6$promise$$internal$$getThen(promise) {
try {
return promise.then;
} catch (error) {
return lib$es6$promise$$internal$$GET_THEN_ERROR.error = error, lib$es6$promise$$internal$$GET_THEN_ERROR;
}
}
function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
try {
then.call(value, fulfillmentHandler, rejectionHandler);
} catch (e) {
return e;
}
}
function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
lib$es6$promise$asap$$asap(function(promise) {
var sealed = !1, error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
sealed || (sealed = !0, thenable !== value ? lib$es6$promise$$internal$$resolve(promise, value) : lib$es6$promise$$internal$$fulfill(promise, value));
}, function(reason) {
sealed || (sealed = !0, lib$es6$promise$$internal$$reject(promise, reason));
}, "Settle: " + (promise._label || " unknown promise"));
!sealed && error && (sealed = !0, lib$es6$promise$$internal$$reject(promise, error));
}, promise);
}
function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
thenable._state === lib$es6$promise$$internal$$FULFILLED ? lib$es6$promise$$internal$$fulfill(promise, thenable._result) : thenable._state === lib$es6$promise$$internal$$REJECTED ? lib$es6$promise$$internal$$reject(promise, thenable._result) : lib$es6$promise$$internal$$subscribe(thenable, void 0, function(value) {
lib$es6$promise$$internal$$resolve(promise, value);
}, function(reason) {
lib$es6$promise$$internal$$reject(promise, reason);
});
}
function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable, then) {
maybeThenable.constructor === promise.constructor && then === lib$es6$promise$then$$default && constructor.resolve === lib$es6$promise$promise$resolve$$default ? lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable) : then === lib$es6$promise$$internal$$GET_THEN_ERROR ? lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error) : void 0 === then ? lib$es6$promise$$internal$$fulfill(promise, maybeThenable) : lib$es6$promise$utils$$isFunction(then) ? lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then) : lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
}
function lib$es6$promise$$internal$$resolve(promise, value) {
promise === value ? lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment()) : lib$es6$promise$utils$$objectOrFunction(value) ? lib$es6$promise$$internal$$handleMaybeThenable(promise, value, lib$es6$promise$$internal$$getThen(value)) : lib$es6$promise$$internal$$fulfill(promise, value);
}
function lib$es6$promise$$internal$$publishRejection(promise) {
promise._onerror && promise._onerror(promise._result), lib$es6$promise$$internal$$publish(promise);
}
function lib$es6$promise$$internal$$fulfill(promise, value) {
promise._state === lib$es6$promise$$internal$$PENDING && (promise._result = value, 
promise._state = lib$es6$promise$$internal$$FULFILLED, 0 !== promise._subscribers.length && lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise));
}
function lib$es6$promise$$internal$$reject(promise, reason) {
promise._state === lib$es6$promise$$internal$$PENDING && (promise._state = lib$es6$promise$$internal$$REJECTED, 
promise._result = reason, lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise));
}
function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
var subscribers = parent._subscribers, length = subscribers.length;
parent._onerror = null, subscribers[length] = child, subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment, 
subscribers[length + lib$es6$promise$$internal$$REJECTED] = onRejection, 0 === length && parent._state && lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
}
function lib$es6$promise$$internal$$publish(promise) {
var subscribers = promise._subscribers, settled = promise._state;
if (0 !== subscribers.length) {
for (var child, callback, detail = promise._result, i = 0; i < subscribers.length; i += 3) child = subscribers[i], 
callback = subscribers[i + settled], child ? lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail) : callback(detail);
promise._subscribers.length = 0;
}
}
function lib$es6$promise$$internal$$ErrorObject() {
this.error = null;
}
function lib$es6$promise$$internal$$tryCatch(callback, detail) {
try {
return callback(detail);
} catch (e) {
return lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e, lib$es6$promise$$internal$$TRY_CATCH_ERROR;
}
}
function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
var value, error, succeeded, failed, hasCallback = lib$es6$promise$utils$$isFunction(callback);
if (hasCallback) {
if (value = lib$es6$promise$$internal$$tryCatch(callback, detail), value === lib$es6$promise$$internal$$TRY_CATCH_ERROR ? (failed = !0, 
error = value.error, value = null) : succeeded = !0, promise === value) return void lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
} else value = detail, succeeded = !0;
promise._state !== lib$es6$promise$$internal$$PENDING || (hasCallback && succeeded ? lib$es6$promise$$internal$$resolve(promise, value) : failed ? lib$es6$promise$$internal$$reject(promise, error) : settled === lib$es6$promise$$internal$$FULFILLED ? lib$es6$promise$$internal$$fulfill(promise, value) : settled === lib$es6$promise$$internal$$REJECTED && lib$es6$promise$$internal$$reject(promise, value));
}
function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
try {
resolver(function resolvePromise(value) {
lib$es6$promise$$internal$$resolve(promise, value);
}, function rejectPromise(reason) {
lib$es6$promise$$internal$$reject(promise, reason);
});
} catch (e) {
lib$es6$promise$$internal$$reject(promise, e);
}
}
function lib$es6$promise$promise$all$$all(entries) {
return new lib$es6$promise$enumerator$$default(this, entries).promise;
}
function lib$es6$promise$promise$race$$race(entries) {
function onFulfillment(value) {
lib$es6$promise$$internal$$resolve(promise, value);
}
function onRejection(reason) {
lib$es6$promise$$internal$$reject(promise, reason);
}
var Constructor = this, promise = new Constructor(lib$es6$promise$$internal$$noop);
if (!lib$es6$promise$utils$$isArray(entries)) return lib$es6$promise$$internal$$reject(promise, new TypeError("You must pass an array to race.")), 
promise;
for (var length = entries.length, i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), void 0, onFulfillment, onRejection);
return promise;
}
function lib$es6$promise$promise$reject$$reject(reason) {
var Constructor = this, promise = new Constructor(lib$es6$promise$$internal$$noop);
return lib$es6$promise$$internal$$reject(promise, reason), promise;
}
function lib$es6$promise$promise$$needsResolver() {
throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
}
function lib$es6$promise$promise$$needsNew() {
throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}
function lib$es6$promise$promise$$Promise(resolver) {
this._id = lib$es6$promise$promise$$counter++, this._state = void 0, this._result = void 0, 
this._subscribers = [], lib$es6$promise$$internal$$noop !== resolver && ("function" != typeof resolver && lib$es6$promise$promise$$needsResolver(), 
this instanceof lib$es6$promise$promise$$Promise ? lib$es6$promise$$internal$$initializePromise(this, resolver) : lib$es6$promise$promise$$needsNew());
}
function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
this._instanceConstructor = Constructor, this.promise = new Constructor(lib$es6$promise$$internal$$noop), 
Array.isArray(input) ? (this._input = input, this.length = input.length, this._remaining = input.length, 
this._result = new Array(this.length), 0 === this.length ? lib$es6$promise$$internal$$fulfill(this.promise, this._result) : (this.length = this.length || 0, 
this._enumerate(), 0 === this._remaining && lib$es6$promise$$internal$$fulfill(this.promise, this._result))) : lib$es6$promise$$internal$$reject(this.promise, this._validationError());
}
function lib$es6$promise$polyfill$$polyfill() {
var local;
if ("undefined" != typeof global) local = global; else if ("undefined" != typeof self) local = self; else try {
local = Function("return this")();
} catch (e) {
throw new Error("polyfill failed because global object is unavailable in this environment");
}
var P = local.Promise;
P && "[object Promise]" === Object.prototype.toString.call(P.resolve()) && !P.cast || (local.Promise = lib$es6$promise$promise$$default);
}
var lib$es6$promise$utils$$_isArray;
lib$es6$promise$utils$$_isArray = Array.isArray ? Array.isArray : function(x) {
return "[object Array]" === Object.prototype.toString.call(x);
};
var lib$es6$promise$asap$$vertxNext, lib$es6$promise$asap$$customSchedulerFn, lib$es6$promise$asap$$scheduleFlush, lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray, lib$es6$promise$asap$$len = 0, lib$es6$promise$asap$$asap = function asap(callback, arg) {
lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback, lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg, 
lib$es6$promise$asap$$len += 2, 2 === lib$es6$promise$asap$$len && (lib$es6$promise$asap$$customSchedulerFn ? lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush) : lib$es6$promise$asap$$scheduleFlush());
}, lib$es6$promise$asap$$browserWindow = "undefined" != typeof window ? window : void 0, lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {}, lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver, lib$es6$promise$asap$$isNode = "undefined" != typeof process && "[object process]" === {}.toString.call(process), lib$es6$promise$asap$$isWorker = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel, lib$es6$promise$asap$$queue = new Array(1e3);
lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$isNode ? lib$es6$promise$asap$$useNextTick() : lib$es6$promise$asap$$BrowserMutationObserver ? lib$es6$promise$asap$$useMutationObserver() : lib$es6$promise$asap$$isWorker ? lib$es6$promise$asap$$useMessageChannel() : void 0 === lib$es6$promise$asap$$browserWindow ? lib$es6$promise$asap$$attemptVertx() : lib$es6$promise$asap$$useSetTimeout();
var lib$es6$promise$then$$default = lib$es6$promise$then$$then, lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve, lib$es6$promise$$internal$$PENDING = void 0, lib$es6$promise$$internal$$FULFILLED = 1, lib$es6$promise$$internal$$REJECTED = 2, lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject(), lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject(), lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all, lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race, lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject, lib$es6$promise$promise$$counter = 0, lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default, lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default, 
lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default, 
lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default, 
lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler, 
lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap, lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap, 
lib$es6$promise$promise$$Promise.prototype = {
constructor: lib$es6$promise$promise$$Promise,
then: lib$es6$promise$then$$default,
"catch": function(onRejection) {
return this.then(null, onRejection);
}
};
var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
return new Error("Array Methods must be provided an Array");
}, lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
for (var length = this.length, input = this._input, i = 0; this._state === lib$es6$promise$$internal$$PENDING && i < length; i++) this._eachEntry(input[i], i);
}, lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
var c = this._instanceConstructor, resolve = c.resolve;
if (resolve === lib$es6$promise$promise$resolve$$default) {
var then = lib$es6$promise$$internal$$getThen(entry);
if (then === lib$es6$promise$then$$default && entry._state !== lib$es6$promise$$internal$$PENDING) this._settledAt(entry._state, i, entry._result); else if ("function" != typeof then) this._remaining--, 
this._result[i] = entry; else if (c === lib$es6$promise$promise$$default) {
var promise = new c(lib$es6$promise$$internal$$noop);
lib$es6$promise$$internal$$handleMaybeThenable(promise, entry, then), this._willSettleAt(promise, i);
} else this._willSettleAt(new c(function(resolve) {
resolve(entry);
}), i);
} else this._willSettleAt(resolve(entry), i);
}, lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
var promise = this.promise;
promise._state === lib$es6$promise$$internal$$PENDING && (this._remaining--, state === lib$es6$promise$$internal$$REJECTED ? lib$es6$promise$$internal$$reject(promise, value) : this._result[i] = value), 
0 === this._remaining && lib$es6$promise$$internal$$fulfill(promise, this._result);
}, lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
var enumerator = this;
lib$es6$promise$$internal$$subscribe(promise, void 0, function(value) {
enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
}, function(reason) {
enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
});
};
var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill, lib$es6$promise$umd$$ES6Promise = {
Promise: lib$es6$promise$promise$$default,
polyfill: lib$es6$promise$polyfill$$default
};
__webpack_require__(489).amd ? (__WEBPACK_AMD_DEFINE_RESULT__ = function() {
return lib$es6$promise$umd$$ES6Promise;
}.call(exports, __webpack_require__, exports, module), !(void 0 !== __WEBPACK_AMD_DEFINE_RESULT__ && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))) : "undefined" != typeof module && module.exports ? module.exports = lib$es6$promise$umd$$ES6Promise : "undefined" != typeof this && (this.ES6Promise = lib$es6$promise$umd$$ES6Promise), 
lib$es6$promise$polyfill$$default();
}).call(this);
}).call(exports, __webpack_require__(74), function() {
return this;
}(), __webpack_require__(119)(module));
}, function(module, exports, __webpack_require__) {
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;
!function(root, definition) {
"use strict";
"object" == typeof module && module.exports ? module.exports = definition() : (__WEBPACK_AMD_DEFINE_FACTORY__ = definition, 
__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module) : __WEBPACK_AMD_DEFINE_FACTORY__, 
!(void 0 !== __WEBPACK_AMD_DEFINE_RESULT__ && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)));
}(this, function() {
"use strict";
function realMethod(methodName) {
return typeof console !== undefinedType && (void 0 !== console[methodName] ? bindMethod(console, methodName) : void 0 !== console.log ? bindMethod(console, "log") : noop);
}
function bindMethod(obj, methodName) {
var method = obj[methodName];
if ("function" == typeof method.bind) return method.bind(obj);
try {
return Function.prototype.bind.call(method, obj);
} catch (e) {
return function() {
return Function.prototype.apply.apply(method, [ obj, arguments ]);
};
}
}
function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
return function() {
typeof console !== undefinedType && (replaceLoggingMethods.call(this, level, loggerName), 
this[methodName].apply(this, arguments));
};
}
function replaceLoggingMethods(level, loggerName) {
for (var i = 0; i < logMethods.length; i++) {
var methodName = logMethods[i];
this[methodName] = i < level ? noop : this.methodFactory(methodName, level, loggerName);
}
}
function defaultMethodFactory(methodName, level, loggerName) {
return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
}
function Logger(name, defaultLevel, factory) {
function persistLevelIfPossible(levelNum) {
var levelName = (logMethods[levelNum] || "silent").toUpperCase();
try {
return void (window.localStorage[storageKey] = levelName);
} catch (ignore) {}
try {
window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
} catch (ignore) {}
}
function getPersistedLevel() {
var storedLevel;
try {
storedLevel = window.localStorage[storageKey];
} catch (ignore) {}
if (typeof storedLevel === undefinedType) try {
var cookie = window.document.cookie, location = cookie.indexOf(encodeURIComponent(storageKey) + "=");
location && (storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1]);
} catch (ignore) {}
return void 0 === self.levels[storedLevel] && (storedLevel = void 0), storedLevel;
}
var currentLevel, self = this, storageKey = "loglevel";
name && (storageKey += ":" + name), self.levels = {
TRACE: 0,
DEBUG: 1,
INFO: 2,
WARN: 3,
ERROR: 4,
SILENT: 5
}, self.methodFactory = factory || defaultMethodFactory, self.getLevel = function() {
return currentLevel;
}, self.setLevel = function(level, persist) {
if ("string" == typeof level && void 0 !== self.levels[level.toUpperCase()] && (level = self.levels[level.toUpperCase()]), 
!("number" == typeof level && level >= 0 && level <= self.levels.SILENT)) throw "log.setLevel() called with invalid level: " + level;
if (currentLevel = level, persist !== !1 && persistLevelIfPossible(level), replaceLoggingMethods.call(self, level, name), 
typeof console === undefinedType && level < self.levels.SILENT) return "No console available for logging";
}, self.setDefaultLevel = function(level) {
getPersistedLevel() || self.setLevel(level, !1);
}, self.enableAll = function(persist) {
self.setLevel(self.levels.TRACE, persist);
}, self.disableAll = function(persist) {
self.setLevel(self.levels.SILENT, persist);
};
var initialLevel = getPersistedLevel();
null == initialLevel && (initialLevel = null == defaultLevel ? "WARN" : defaultLevel), 
self.setLevel(initialLevel, !1);
}
var noop = function() {}, undefinedType = "undefined", logMethods = [ "trace", "debug", "info", "warn", "error" ], defaultLogger = new Logger(), _loggersByName = {};
defaultLogger.getLogger = function getLogger(name) {
if ("string" != typeof name || "" === name) throw new TypeError("You must supply a name when creating a logger.");
var logger = _loggersByName[name];
return logger || (logger = _loggersByName[name] = new Logger(name, defaultLogger.getLevel(), defaultLogger.methodFactory)), 
logger;
};
var _log = typeof window !== undefinedType ? window.log : void 0;
return defaultLogger.noConflict = function() {
return typeof window !== undefinedType && window.log === defaultLogger && (window.log = _log), 
defaultLogger;
}, defaultLogger;
});
}, function(module, exports) {
!function(self) {
"use strict";
function normalizeName(name) {
if ("string" != typeof name && (name = String(name)), /[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) throw new TypeError("Invalid character in header field name");
return name.toLowerCase();
}
function normalizeValue(value) {
return "string" != typeof value && (value = String(value)), value;
}
function Headers(headers) {
this.map = {}, headers instanceof Headers ? headers.forEach(function(value, name) {
this.append(name, value);
}, this) : headers && Object.getOwnPropertyNames(headers).forEach(function(name) {
this.append(name, headers[name]);
}, this);
}
function consumed(body) {
return body.bodyUsed ? Promise.reject(new TypeError("Already read")) : void (body.bodyUsed = !0);
}
function fileReaderReady(reader) {
return new Promise(function(resolve, reject) {
reader.onload = function() {
resolve(reader.result);
}, reader.onerror = function() {
reject(reader.error);
};
});
}
function readBlobAsArrayBuffer(blob) {
var reader = new FileReader();
return reader.readAsArrayBuffer(blob), fileReaderReady(reader);
}
function readBlobAsText(blob) {
var reader = new FileReader();
return reader.readAsText(blob), fileReaderReady(reader);
}
function Body() {
return this.bodyUsed = !1, this._initBody = function(body) {
if (this._bodyInit = body, "string" == typeof body) this._bodyText = body; else if (support.blob && Blob.prototype.isPrototypeOf(body)) this._bodyBlob = body; else if (support.formData && FormData.prototype.isPrototypeOf(body)) this._bodyFormData = body; else if (body) {
if (!support.arrayBuffer || !ArrayBuffer.prototype.isPrototypeOf(body)) throw new Error("unsupported BodyInit type");
} else this._bodyText = "";
this.headers.get("content-type") || ("string" == typeof body ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type && this.headers.set("content-type", this._bodyBlob.type));
}, support.blob ? (this.blob = function() {
var rejected = consumed(this);
if (rejected) return rejected;
if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
if (this._bodyFormData) throw new Error("could not read FormData body as blob");
return Promise.resolve(new Blob([ this._bodyText ]));
}, this.arrayBuffer = function() {
return this.blob().then(readBlobAsArrayBuffer);
}, this.text = function() {
var rejected = consumed(this);
if (rejected) return rejected;
if (this._bodyBlob) return readBlobAsText(this._bodyBlob);
if (this._bodyFormData) throw new Error("could not read FormData body as text");
return Promise.resolve(this._bodyText);
}) : this.text = function() {
var rejected = consumed(this);
return rejected ? rejected : Promise.resolve(this._bodyText);
}, support.formData && (this.formData = function() {
return this.text().then(decode);
}), this.json = function() {
return this.text().then(JSON.parse);
}, this;
}
function normalizeMethod(method) {
var upcased = method.toUpperCase();
return methods.indexOf(upcased) > -1 ? upcased : method;
}
function Request(input, options) {
options = options || {};
var body = options.body;
if (Request.prototype.isPrototypeOf(input)) {
if (input.bodyUsed) throw new TypeError("Already read");
this.url = input.url, this.credentials = input.credentials, options.headers || (this.headers = new Headers(input.headers)), 
this.method = input.method, this.mode = input.mode, body || (body = input._bodyInit, 
input.bodyUsed = !0);
} else this.url = input;
if (this.credentials = options.credentials || this.credentials || "omit", !options.headers && this.headers || (this.headers = new Headers(options.headers)), 
this.method = normalizeMethod(options.method || this.method || "GET"), this.mode = options.mode || this.mode || null, 
this.referrer = null, ("GET" === this.method || "HEAD" === this.method) && body) throw new TypeError("Body not allowed for GET or HEAD requests");
this._initBody(body);
}
function decode(body) {
var form = new FormData();
return body.trim().split("&").forEach(function(bytes) {
if (bytes) {
var split = bytes.split("="), name = split.shift().replace(/\+/g, " "), value = split.join("=").replace(/\+/g, " ");
form.append(decodeURIComponent(name), decodeURIComponent(value));
}
}), form;
}
function headers(xhr) {
var head = new Headers(), pairs = (xhr.getAllResponseHeaders() || "").trim().split("\n");
return pairs.forEach(function(header) {
var split = header.trim().split(":"), key = split.shift().trim(), value = split.join(":").trim();
head.append(key, value);
}), head;
}
function Response(bodyInit, options) {
options || (options = {}), this.type = "default", this.status = options.status, 
this.ok = this.status >= 200 && this.status < 300, this.statusText = options.statusText, 
this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers), 
this.url = options.url || "", this._initBody(bodyInit);
}
if (!self.fetch) {
Headers.prototype.append = function(name, value) {
name = normalizeName(name), value = normalizeValue(value);
var list = this.map[name];
list || (list = [], this.map[name] = list), list.push(value);
}, Headers.prototype.delete = function(name) {
delete this.map[normalizeName(name)];
}, Headers.prototype.get = function(name) {
var values = this.map[normalizeName(name)];
return values ? values[0] : null;
}, Headers.prototype.getAll = function(name) {
return this.map[normalizeName(name)] || [];
}, Headers.prototype.has = function(name) {
return this.map.hasOwnProperty(normalizeName(name));
}, Headers.prototype.set = function(name, value) {
this.map[normalizeName(name)] = [ normalizeValue(value) ];
}, Headers.prototype.forEach = function(callback, thisArg) {
Object.getOwnPropertyNames(this.map).forEach(function(name) {
this.map[name].forEach(function(value) {
callback.call(thisArg, value, name, this);
}, this);
}, this);
};
var support = {
blob: "FileReader" in self && "Blob" in self && function() {
try {
return new Blob(), !0;
} catch (e) {
return !1;
}
}(),
formData: "FormData" in self,
arrayBuffer: "ArrayBuffer" in self
}, methods = [ "DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT" ];
Request.prototype.clone = function() {
return new Request(this);
}, Body.call(Request.prototype), Body.call(Response.prototype), Response.prototype.clone = function() {
return new Response(this._bodyInit, {
status: this.status,
statusText: this.statusText,
headers: new Headers(this.headers),
url: this.url
});
}, Response.error = function() {
var response = new Response(null, {
status: 0,
statusText: ""
});
return response.type = "error", response;
};
var redirectStatuses = [ 301, 302, 303, 307, 308 ];
Response.redirect = function(url, status) {
if (redirectStatuses.indexOf(status) === -1) throw new RangeError("Invalid status code");
return new Response(null, {
status: status,
headers: {
location: url
}
});
}, self.Headers = Headers, self.Request = Request, self.Response = Response, self.fetch = function(input, init) {
return new Promise(function(resolve, reject) {
function responseURL() {
return "responseURL" in xhr ? xhr.responseURL : /^X-Request-URL:/m.test(xhr.getAllResponseHeaders()) ? xhr.getResponseHeader("X-Request-URL") : void 0;
}
var request;
request = Request.prototype.isPrototypeOf(input) && !init ? input : new Request(input, init);
var xhr = new XMLHttpRequest();
xhr.onload = function() {
var status = 1223 === xhr.status ? 204 : xhr.status;
if (status < 100 || status > 599) return void reject(new TypeError("Network request failed"));
var options = {
status: status,
statusText: xhr.statusText,
headers: headers(xhr),
url: responseURL()
}, body = "response" in xhr ? xhr.response : xhr.responseText;
resolve(new Response(body, options));
}, xhr.onerror = function() {
reject(new TypeError("Network request failed"));
}, xhr.ontimeout = function() {
reject(new TypeError("Network request failed"));
}, xhr.open(request.method, request.url, !0), "include" === request.credentials && (xhr.withCredentials = !0), 
"responseType" in xhr && support.blob && (xhr.responseType = "blob"), request.headers.forEach(function(value, name) {
xhr.setRequestHeader(name, value);
}), xhr.send("undefined" == typeof request._bodyInit ? null : request._bodyInit);
});
}, self.fetch.polyfill = !0;
}
}("undefined" != typeof self ? self : this);
}, , , , , , function(module, exports, __webpack_require__) {
"use strict";
function emptyFunction() {}
function emptyFunctionWithReset() {}
var ReactPropTypesSecret = __webpack_require__(989);
emptyFunctionWithReset.resetWarningCache = emptyFunction, module.exports = function() {
function shim(props, propName, componentName, location, propFullName, secret) {
if (secret !== ReactPropTypesSecret) {
var err = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
throw err.name = "Invariant Violation", err;
}
}
function getShim() {
return shim;
}
shim.isRequired = shim;
var ReactPropTypes = {
array: shim,
bool: shim,
func: shim,
number: shim,
object: shim,
string: shim,
symbol: shim,
any: shim,
arrayOf: getShim,
element: shim,
elementType: shim,
instanceOf: getShim,
node: shim,
objectOf: getShim,
oneOf: getShim,
oneOfType: getShim,
shape: getShim,
exact: getShim,
checkPropTypes: emptyFunctionWithReset,
resetWarningCache: emptyFunction
};
return ReactPropTypes.PropTypes = ReactPropTypes, ReactPropTypes;
};
}, function(module, exports) {
"use strict";
var ReactPropTypesSecret = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
module.exports = ReactPropTypesSecret;
}, function(module, exports, __webpack_require__) {
var __WEBPACK_AMD_DEFINE_RESULT__;
(function(module, global) {
!function(root) {
function error(type) {
throw new RangeError(errors[type]);
}
function map(array, fn) {
for (var length = array.length, result = []; length--; ) result[length] = fn(array[length]);
return result;
}
function mapDomain(string, fn) {
var parts = string.split("@"), result = "";
parts.length > 1 && (result = parts[0] + "@", string = parts[1]), string = string.replace(regexSeparators, ".");
var labels = string.split("."), encoded = map(labels, fn).join(".");
return result + encoded;
}
function ucs2decode(string) {
for (var value, extra, output = [], counter = 0, length = string.length; counter < length; ) value = string.charCodeAt(counter++), 
value >= 55296 && value <= 56319 && counter < length ? (extra = string.charCodeAt(counter++), 
56320 == (64512 & extra) ? output.push(((1023 & value) << 10) + (1023 & extra) + 65536) : (output.push(value), 
counter--)) : output.push(value);
return output;
}
function ucs2encode(array) {
return map(array, function(value) {
var output = "";
return value > 65535 && (value -= 65536, output += stringFromCharCode(value >>> 10 & 1023 | 55296), 
value = 56320 | 1023 & value), output += stringFromCharCode(value);
}).join("");
}
function basicToDigit(codePoint) {
return codePoint - 48 < 10 ? codePoint - 22 : codePoint - 65 < 26 ? codePoint - 65 : codePoint - 97 < 26 ? codePoint - 97 : base;
}
function digitToBasic(digit, flag) {
return digit + 22 + 75 * (digit < 26) - ((0 != flag) << 5);
}
function adapt(delta, numPoints, firstTime) {
var k = 0;
for (delta = firstTime ? floor(delta / damp) : delta >> 1, delta += floor(delta / numPoints); delta > baseMinusTMin * tMax >> 1; k += base) delta = floor(delta / baseMinusTMin);
return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
}
function decode(input) {
var out, basic, j, index, oldi, w, k, digit, t, baseMinusT, output = [], inputLength = input.length, i = 0, n = initialN, bias = initialBias;
for (basic = input.lastIndexOf(delimiter), basic < 0 && (basic = 0), j = 0; j < basic; ++j) input.charCodeAt(j) >= 128 && error("not-basic"), 
output.push(input.charCodeAt(j));
for (index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
for (oldi = i, w = 1, k = base; index >= inputLength && error("invalid-input"), 
digit = basicToDigit(input.charCodeAt(index++)), (digit >= base || digit > floor((maxInt - i) / w)) && error("overflow"), 
i += digit * w, t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias, !(digit < t); k += base) baseMinusT = base - t, 
w > floor(maxInt / baseMinusT) && error("overflow"), w *= baseMinusT;
out = output.length + 1, bias = adapt(i - oldi, out, 0 == oldi), floor(i / out) > maxInt - n && error("overflow"), 
n += floor(i / out), i %= out, output.splice(i++, 0, n);
}
return ucs2encode(output);
}
function encode(input) {
var n, delta, handledCPCount, basicLength, bias, j, m, q, k, t, currentValue, inputLength, handledCPCountPlusOne, baseMinusT, qMinusT, output = [];
for (input = ucs2decode(input), inputLength = input.length, n = initialN, delta = 0, 
bias = initialBias, j = 0; j < inputLength; ++j) currentValue = input[j], currentValue < 128 && output.push(stringFromCharCode(currentValue));
for (handledCPCount = basicLength = output.length, basicLength && output.push(delimiter); handledCPCount < inputLength; ) {
for (m = maxInt, j = 0; j < inputLength; ++j) currentValue = input[j], currentValue >= n && currentValue < m && (m = currentValue);
for (handledCPCountPlusOne = handledCPCount + 1, m - n > floor((maxInt - delta) / handledCPCountPlusOne) && error("overflow"), 
delta += (m - n) * handledCPCountPlusOne, n = m, j = 0; j < inputLength; ++j) if (currentValue = input[j], 
currentValue < n && ++delta > maxInt && error("overflow"), currentValue == n) {
for (q = delta, k = base; t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias, 
!(q < t); k += base) qMinusT = q - t, baseMinusT = base - t, output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))), 
q = floor(qMinusT / baseMinusT);
output.push(stringFromCharCode(digitToBasic(q, 0))), bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength), 
delta = 0, ++handledCPCount;
}
++delta, ++n;
}
return output.join("");
}
function toUnicode(input) {
return mapDomain(input, function(string) {
return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
});
}
function toASCII(input) {
return mapDomain(input, function(string) {
return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
});
}
var freeGlobal = ("object" == typeof exports && exports && !exports.nodeType && exports, 
"object" == typeof module && module && !module.nodeType && module, "object" == typeof global && global);
freeGlobal.global !== freeGlobal && freeGlobal.window !== freeGlobal && freeGlobal.self !== freeGlobal || (root = freeGlobal);
var punycode, maxInt = 2147483647, base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, delimiter = "-", regexPunycode = /^xn--/, regexNonASCII = /[^\x20-\x7E]/, regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, errors = {
overflow: "Overflow: input needs wider integers to process",
"not-basic": "Illegal input >= 0x80 (not a basic code point)",
"invalid-input": "Invalid input"
}, baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode;
punycode = {
version: "1.4.1",
ucs2: {
decode: ucs2decode,
encode: ucs2encode
},
decode: decode,
encode: encode,
toASCII: toASCII,
toUnicode: toUnicode
}, __WEBPACK_AMD_DEFINE_RESULT__ = function() {
return punycode;
}.call(exports, __webpack_require__, exports, module), !(void 0 !== __WEBPACK_AMD_DEFINE_RESULT__ && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}(this);
}).call(exports, __webpack_require__(119)(module), function() {
return this;
}());
}, function(module, exports) {
"use strict";
function hasOwnProperty(obj, prop) {
return Object.prototype.hasOwnProperty.call(obj, prop);
}
module.exports = function(qs, sep, eq, options) {
sep = sep || "&", eq = eq || "=";
var obj = {};
if ("string" != typeof qs || 0 === qs.length) return obj;
var regexp = /\+/g;
qs = qs.split(sep);
var maxKeys = 1e3;
options && "number" == typeof options.maxKeys && (maxKeys = options.maxKeys);
var len = qs.length;
maxKeys > 0 && len > maxKeys && (len = maxKeys);
for (var i = 0; i < len; ++i) {
var kstr, vstr, k, v, x = qs[i].replace(regexp, "%20"), idx = x.indexOf(eq);
idx >= 0 ? (kstr = x.substr(0, idx), vstr = x.substr(idx + 1)) : (kstr = x, vstr = ""), 
k = decodeURIComponent(kstr), v = decodeURIComponent(vstr), hasOwnProperty(obj, k) ? Array.isArray(obj[k]) ? obj[k].push(v) : obj[k] = [ obj[k], v ] : obj[k] = v;
}
return obj;
};
}, function(module, exports) {
"use strict";
var stringifyPrimitive = function(v) {
switch (typeof v) {
case "string":
return v;

case "boolean":
return v ? "true" : "false";

case "number":
return isFinite(v) ? v : "";

default:
return "";
}
};
module.exports = function(obj, sep, eq, name) {
return sep = sep || "&", eq = eq || "=", null === obj && (obj = void 0), "object" == typeof obj ? Object.keys(obj).map(function(k) {
var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
return Array.isArray(obj[k]) ? obj[k].map(function(v) {
return ks + encodeURIComponent(stringifyPrimitive(v));
}).join(sep) : ks + encodeURIComponent(stringifyPrimitive(obj[k]));
}).join(sep) : name ? encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj)) : "";
};
}, function(module, exports, __webpack_require__) {
"use strict";
exports.decode = exports.parse = __webpack_require__(991), exports.encode = exports.stringify = __webpack_require__(992);
}, function(module, exports) {
"use strict";
function RavenConfigError(message) {
this.name = "RavenConfigError", this.message = message;
}
RavenConfigError.prototype = new Error(), RavenConfigError.prototype.constructor = RavenConfigError, 
module.exports = RavenConfigError;
}, function(module, exports) {
"use strict";
var wrapMethod = function(console, level, callback) {
var originalConsoleLevel = console[level], originalConsole = console;
if (level in console) {
var sentryLevel = "warn" === level ? "warning" : level;
console[level] = function() {
var args = [].slice.call(arguments), msg = "" + args.join(" "), data = {
level: sentryLevel,
logger: "console",
extra: {
arguments: args
}
};
callback && callback(msg, data), originalConsoleLevel && Function.prototype.apply.call(originalConsoleLevel, originalConsole, args);
};
}
};
module.exports = {
wrapMethod: wrapMethod
};
}, function(module, exports, __webpack_require__) {
"use strict";
function now() {
return +new Date();
}
function Raven() {
this._hasJSON = !("object" != typeof JSON || !JSON.stringify), this._hasDocument = "undefined" != typeof document, 
this._lastCapturedException = null, this._lastEventId = null, this._globalServer = null, 
this._globalKey = null, this._globalProject = null, this._globalContext = {}, this._globalOptions = {
logger: "javascript",
ignoreErrors: [],
ignoreUrls: [],
whitelistUrls: [],
includePaths: [],
crossOrigin: "anonymous",
collectWindowErrors: !0,
maxMessageLength: 0,
stackTraceLimit: 50
}, this._ignoreOnError = 0, this._isRavenInstalled = !1, this._originalErrorStackTraceLimit = Error.stackTraceLimit, 
this._originalConsole = window.console || {}, this._originalConsoleMethods = {}, 
this._plugins = [], this._startTime = now(), this._wrappedBuiltIns = [], this._breadcrumbs = [], 
this._breadcrumbLimit = 20, this._lastCapturedEvent = null, this._keypressTimeout, 
this._location = window.location, this._lastHref = this._location && this._location.href;
for (var method in this._originalConsole) this._originalConsoleMethods[method] = this._originalConsole[method];
}
var TraceKit = __webpack_require__(998), RavenConfigError = __webpack_require__(994), utils = __webpack_require__(431), isFunction = utils.isFunction, isUndefined = utils.isUndefined, isError = utils.isError, isEmptyObject = utils.isEmptyObject, hasKey = utils.hasKey, joinRegExp = utils.joinRegExp, each = utils.each, objectMerge = utils.objectMerge, truncate = utils.truncate, urlencode = utils.urlencode, uuid4 = utils.uuid4, htmlTreeAsString = utils.htmlTreeAsString, parseUrl = utils.parseUrl, isString = utils.isString, wrapConsoleMethod = __webpack_require__(995).wrapMethod, dsnKeys = "source protocol user pass host port path".split(" "), dsnPattern = /^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w\.-]+)(?::(\d+))?(\/.*)/;
Raven.prototype = {
VERSION: "3.2.0",
debug: !1,
TraceKit: TraceKit,
config: function(dsn, options) {
var self = this;
if (this._globalServer) return this._logDebug("error", "Error: Raven has already been configured"), 
this;
if (!dsn) return this;
options && each(options, function(key, value) {
"tags" === key || "extra" === key ? self._globalContext[key] = value : self._globalOptions[key] = value;
});
var uri = this._parseDSN(dsn), lastSlash = uri.path.lastIndexOf("/"), path = uri.path.substr(1, lastSlash);
return this._dsn = dsn, this._globalOptions.ignoreErrors.push(/^Script error\.?$/), 
this._globalOptions.ignoreErrors.push(/^Javascript error: Script error\.? on line 0$/), 
this._globalOptions.ignoreErrors = joinRegExp(this._globalOptions.ignoreErrors), 
this._globalOptions.ignoreUrls = !!this._globalOptions.ignoreUrls.length && joinRegExp(this._globalOptions.ignoreUrls), 
this._globalOptions.whitelistUrls = !!this._globalOptions.whitelistUrls.length && joinRegExp(this._globalOptions.whitelistUrls), 
this._globalOptions.includePaths = joinRegExp(this._globalOptions.includePaths), 
this._globalKey = uri.user, this._globalSecret = uri.pass && uri.pass.substr(1), 
this._globalProject = uri.path.substr(lastSlash + 1), this._globalServer = this._getGlobalServer(uri), 
this._globalEndpoint = this._globalServer + "/" + path + "api/" + this._globalProject + "/store/", 
TraceKit.collectWindowErrors = !!this._globalOptions.collectWindowErrors, this;
},
install: function() {
var self = this;
return this.isSetup() && !this._isRavenInstalled && (TraceKit.report.subscribe(function() {
self._handleOnErrorStackInfo.apply(self, arguments);
}), this._wrapBuiltIns(), this._drainPlugins(), this._isRavenInstalled = !0), Error.stackTraceLimit = this._globalOptions.stackTraceLimit, 
this;
},
context: function(options, func, args) {
return isFunction(options) && (args = func || [], func = options, options = void 0), 
this.wrap(options, func).apply(this, args);
},
wrap: function(options, func, _before) {
function wrapped() {
var args = [], i = arguments.length, deep = !options || options && options.deep !== !1;
for (_before && isFunction(_before) && _before.apply(this, arguments); i--; ) args[i] = deep ? self.wrap(options, arguments[i]) : arguments[i];
try {
return func.apply(this, args);
} catch (e) {
throw self._ignoreNextOnError(), self.captureException(e, options), e;
}
}
var self = this;
if (isUndefined(func) && !isFunction(options)) return options;
if (isFunction(options) && (func = options, options = void 0), !isFunction(func)) return func;
try {
if (func.__raven__) return func;
} catch (e) {
return func;
}
if (func.__raven_wrapper__) return func.__raven_wrapper__;
for (var property in func) hasKey(func, property) && (wrapped[property] = func[property]);
return wrapped.prototype = func.prototype, func.__raven_wrapper__ = wrapped, wrapped.__raven__ = !0, 
wrapped.__inner__ = func, wrapped;
},
uninstall: function() {
return TraceKit.report.uninstall(), this._restoreBuiltIns(), Error.stackTraceLimit = this._originalErrorStackTraceLimit, 
this._isRavenInstalled = !1, this;
},
captureException: function(ex, options) {
if (!isError(ex)) return this.captureMessage(ex, options);
this._lastCapturedException = ex;
try {
var stack = TraceKit.computeStackTrace(ex);
this._handleStackInfo(stack, options);
} catch (ex1) {
if (ex !== ex1) throw ex1;
}
return this;
},
captureMessage: function(msg, options) {
if (!this._globalOptions.ignoreErrors.test || !this._globalOptions.ignoreErrors.test(msg)) return this._send(objectMerge({
message: msg + ""
}, options)), this;
},
captureBreadcrumb: function(obj) {
var crumb = objectMerge({
timestamp: now() / 1e3
}, obj);
this._breadcrumbs.push(crumb), this._breadcrumbs.length > this._breadcrumbLimit && this._breadcrumbs.shift();
},
addPlugin: function(plugin) {
var pluginArgs = Array.prototype.slice.call(arguments, 1);
return this._plugins.push([ plugin, pluginArgs ]), this._isRavenInstalled && this._drainPlugins(), 
this;
},
setUserContext: function(user) {
return this._globalContext.user = user, this;
},
setExtraContext: function(extra) {
return this._mergeContext("extra", extra), this;
},
setTagsContext: function(tags) {
return this._mergeContext("tags", tags), this;
},
clearContext: function() {
return this._globalContext = {}, this;
},
getContext: function() {
return JSON.parse(JSON.stringify(this._globalContext));
},
setRelease: function(release) {
return this._globalOptions.release = release, this;
},
setDataCallback: function(callback) {
var original = this._globalOptions.dataCallback;
return this._globalOptions.dataCallback = isFunction(callback) ? function(data) {
return callback(data, original);
} : callback, this;
},
setShouldSendCallback: function(callback) {
var original = this._globalOptions.shouldSendCallback;
return this._globalOptions.shouldSendCallback = isFunction(callback) ? function(data) {
return callback(data, original);
} : callback, this;
},
setTransport: function(transport) {
return this._globalOptions.transport = transport, this;
},
lastException: function() {
return this._lastCapturedException;
},
lastEventId: function() {
return this._lastEventId;
},
isSetup: function() {
return !!this._hasJSON && (!!this._globalServer || (this.ravenNotConfiguredError || (this.ravenNotConfiguredError = !0, 
this._logDebug("error", "Error: Raven has not been configured.")), !1));
},
afterLoad: function() {
var RavenConfig = window.RavenConfig;
RavenConfig && this.config(RavenConfig.dsn, RavenConfig.config).install();
},
showReportDialog: function(options) {
if (window.document) {
options = options || {};
var lastEventId = options.eventId || this.lastEventId();
if (!lastEventId) throw new RavenConfigError("Missing eventId");
var dsn = options.dsn || this._dsn;
if (!dsn) throw new RavenConfigError("Missing DSN");
var encode = encodeURIComponent, qs = "";
qs += "?eventId=" + encode(lastEventId), qs += "&dsn=" + encode(dsn);
var user = options.user || this._globalContext.user;
user && (user.name && (qs += "&name=" + encode(user.name)), user.email && (qs += "&email=" + encode(user.email)));
var globalServer = this._getGlobalServer(this._parseDSN(dsn)), script = document.createElement("script");
script.async = !0, script.src = globalServer + "/api/embed/error-page/" + qs, (document.head || document.body).appendChild(script);
}
},
_ignoreNextOnError: function() {
var self = this;
this._ignoreOnError += 1, setTimeout(function() {
self._ignoreOnError -= 1;
});
},
_triggerEvent: function(eventType, options) {
var evt, key;
if (this._hasDocument) {
options = options || {}, eventType = "raven" + eventType.substr(0, 1).toUpperCase() + eventType.substr(1), 
document.createEvent ? (evt = document.createEvent("HTMLEvents"), evt.initEvent(eventType, !0, !0)) : (evt = document.createEventObject(), 
evt.eventType = eventType);
for (key in options) hasKey(options, key) && (evt[key] = options[key]);
if (document.createEvent) document.dispatchEvent(evt); else try {
document.fireEvent("on" + evt.eventType.toLowerCase(), evt);
} catch (e) {}
}
},
_breadcrumbEventHandler: function(evtName) {
var self = this;
return function(evt) {
if (self._keypressTimeout = null, self._lastCapturedEvent !== evt) {
self._lastCapturedEvent = evt;
var target, elem = evt.target;
try {
target = htmlTreeAsString(elem);
} catch (e) {
target = "<unknown>";
}
self.captureBreadcrumb({
category: "ui." + evtName,
message: target
});
}
};
},
_keypressEventHandler: function() {
var self = this, debounceDuration = 1e3;
return function(evt) {
var target = evt.target, tagName = target && target.tagName;
if (tagName && ("INPUT" === tagName || "TEXTAREA" === tagName)) {
var timeout = self._keypressTimeout;
timeout || self._breadcrumbEventHandler("input")(evt), clearTimeout(timeout), self._keypressTimeout = setTimeout(function() {
self._keypressTimeout = null;
}, debounceDuration);
}
};
},
_captureUrlChange: function(from, to) {
var parsedLoc = parseUrl(this._location.href), parsedTo = parseUrl(to), parsedFrom = parseUrl(from);
this._lastHref = to, parsedLoc.protocol === parsedTo.protocol && parsedLoc.host === parsedTo.host && (to = parsedTo.relative), 
parsedLoc.protocol === parsedFrom.protocol && parsedLoc.host === parsedFrom.host && (from = parsedFrom.relative), 
this.captureBreadcrumb({
category: "navigation",
data: {
to: to,
from: from
}
});
},
_wrapBuiltIns: function() {
function fill(obj, name, replacement, noUndo) {
var orig = obj[name];
obj[name] = replacement(orig), noUndo || self._wrappedBuiltIns.push([ obj, name, orig ]);
}
function wrapTimeFn(orig) {
return function(fn, t) {
for (var args = new Array(arguments.length), i = 0; i < args.length; ++i) args[i] = arguments[i];
var originalCallback = args[0];
return isFunction(originalCallback) && (args[0] = self.wrap(originalCallback)), 
orig.apply ? orig.apply(this, args) : orig(args[0], args[1]);
};
}
function wrapEventTarget(global) {
var proto = window[global] && window[global].prototype;
proto && proto.hasOwnProperty && proto.hasOwnProperty("addEventListener") && (fill(proto, "addEventListener", function(orig) {
return function(evtName, fn, capture, secure) {
try {
fn && fn.handleEvent && (fn.handleEvent = self.wrap(fn.handleEvent));
} catch (err) {}
var before;
return "EventTarget" !== global && "Node" !== global || ("click" === evtName ? before = self._breadcrumbEventHandler(evtName) : "keypress" === evtName && (before = self._keypressEventHandler())), 
orig.call(this, evtName, self.wrap(fn, void 0, before), capture, secure);
};
}), fill(proto, "removeEventListener", function(orig) {
return function(evt, fn, capture, secure) {
return fn = fn && (fn.__raven_wrapper__ ? fn.__raven_wrapper__ : fn), orig.call(this, evt, fn, capture, secure);
};
}));
}
function wrapProp(prop, xhr) {
prop in xhr && isFunction(xhr[prop]) && fill(xhr, prop, function(orig) {
return self.wrap(orig);
}, !0);
}
var self = this;
fill(window, "setTimeout", wrapTimeFn), fill(window, "setInterval", wrapTimeFn), 
window.requestAnimationFrame && fill(window, "requestAnimationFrame", function(orig) {
return function(cb) {
return orig(self.wrap(cb));
};
}), this._hasDocument && (document.addEventListener ? (document.addEventListener("click", self._breadcrumbEventHandler("click"), !1), 
document.addEventListener("keypress", self._keypressEventHandler(), !1)) : (document.attachEvent("onclick", self._breadcrumbEventHandler("click")), 
document.attachEvent("onkeypress", self._keypressEventHandler())));
for (var eventTargets = [ "EventTarget", "Window", "Node", "ApplicationCache", "AudioTrackList", "ChannelMergerNode", "CryptoOperation", "EventSource", "FileReader", "HTMLUnknownElement", "IDBDatabase", "IDBRequest", "IDBTransaction", "KeyOperation", "MediaController", "MessagePort", "ModalWindow", "Notification", "SVGElementInstance", "Screen", "TextTrack", "TextTrackCue", "TextTrackList", "WebSocket", "WebSocketWorker", "Worker", "XMLHttpRequest", "XMLHttpRequestEventTarget", "XMLHttpRequestUpload" ], i = 0; i < eventTargets.length; i++) wrapEventTarget(eventTargets[i]);
if ("XMLHttpRequest" in window) {
var xhrproto = XMLHttpRequest.prototype;
fill(xhrproto, "open", function(origOpen) {
return function(method, url) {
return isString(url) && url.indexOf(self._globalKey) === -1 && (this.__raven_xhr = {
method: method,
url: url,
status_code: null
}), origOpen.apply(this, arguments);
};
}), fill(xhrproto, "send", function(origSend) {
return function(data) {
function onreadystatechangeHandler() {
if (xhr.__raven_xhr && (1 === xhr.readyState || 4 === xhr.readyState)) {
try {
xhr.__raven_xhr.status_code = xhr.status;
} catch (e) {}
self.captureBreadcrumb({
type: "http",
category: "xhr",
data: xhr.__raven_xhr
});
}
}
for (var xhr = this, props = [ "onload", "onerror", "onprogress" ], j = 0; j < props.length; j++) wrapProp(props[j], xhr);
return "onreadystatechange" in xhr && isFunction(xhr.onreadystatechange) ? fill(xhr, "onreadystatechange", function(orig) {
return self.wrap(orig, void 0, onreadystatechangeHandler);
}, !0) : xhr.onreadystatechange = onreadystatechangeHandler, origSend.apply(this, arguments);
};
});
}
var chrome = window.chrome, isChromePackagedApp = chrome && chrome.app && chrome.app.runtime, hasPushState = !isChromePackagedApp && window.history && history.pushState;
if (hasPushState) {
var oldOnPopState = window.onpopstate;
window.onpopstate = function() {
var currentHref = self._location.href;
if (self._captureUrlChange(self._lastHref, currentHref), oldOnPopState) return oldOnPopState.apply(this, arguments);
}, fill(history, "pushState", function(origPushState) {
return function() {
var url = arguments.length > 2 ? arguments[2] : void 0;
return url && self._captureUrlChange(self._lastHref, url + ""), origPushState.apply(this, arguments);
};
});
}
var consoleMethodCallback = function(msg, data) {
self.captureBreadcrumb({
message: msg,
level: data.level,
category: "console"
});
};
"console" in window && console.log && each([ "debug", "info", "warn", "error", "log" ], function(_, level) {
wrapConsoleMethod(console, level, consoleMethodCallback);
});
var $ = window.jQuery || window.$;
$ && $.fn && $.fn.ready && fill($.fn, "ready", function(orig) {
return function(fn) {
return orig.call(this, self.wrap(fn));
};
});
},
_restoreBuiltIns: function() {
for (var builtin; this._wrappedBuiltIns.length; ) {
builtin = this._wrappedBuiltIns.shift();
var obj = builtin[0], name = builtin[1], orig = builtin[2];
obj[name] = orig;
}
},
_drainPlugins: function() {
var self = this;
each(this._plugins, function(_, plugin) {
var installer = plugin[0], args = plugin[1];
installer.apply(self, [ self ].concat(args));
});
},
_parseDSN: function(str) {
var m = dsnPattern.exec(str), dsn = {}, i = 7;
try {
for (;i--; ) dsn[dsnKeys[i]] = m[i] || "";
} catch (e) {
throw new RavenConfigError("Invalid DSN: " + str);
}
if (dsn.pass && !this._globalOptions.allowSecretKey) throw new RavenConfigError("Do not specify your secret key in the DSN. See: http://bit.ly/raven-secret-key");
return dsn;
},
_getGlobalServer: function(uri) {
var globalServer = "//" + uri.host + (uri.port ? ":" + uri.port : "");
return uri.protocol && (globalServer = uri.protocol + ":" + globalServer), globalServer;
},
_handleOnErrorStackInfo: function() {
this._ignoreOnError || this._handleStackInfo.apply(this, arguments);
},
_handleStackInfo: function(stackInfo, options) {
var self = this, frames = [];
stackInfo.stack && stackInfo.stack.length && each(stackInfo.stack, function(i, stack) {
var frame = self._normalizeFrame(stack);
frame && frames.push(frame);
}), this._triggerEvent("handle", {
stackInfo: stackInfo,
options: options
}), this._processException(stackInfo.name, stackInfo.message, stackInfo.url, stackInfo.lineno, frames.slice(0, this._globalOptions.stackTraceLimit), options);
},
_normalizeFrame: function(frame) {
if (frame.url) {
var normalized = {
filename: frame.url,
lineno: frame.line,
colno: frame.column,
"function": frame.func || "?"
};
return normalized.in_app = !(this._globalOptions.includePaths.test && !this._globalOptions.includePaths.test(normalized.filename) || /(Raven|TraceKit)\./.test(normalized.function) || /raven\.(min\.)?js$/.test(normalized.filename)), 
normalized;
}
},
_processException: function(type, message, fileurl, lineno, frames, options) {
var stacktrace;
if ((!this._globalOptions.ignoreErrors.test || !this._globalOptions.ignoreErrors.test(message)) && (message += "", 
frames && frames.length ? (fileurl = frames[0].filename || fileurl, frames.reverse(), 
stacktrace = {
frames: frames
}) : fileurl && (stacktrace = {
frames: [ {
filename: fileurl,
lineno: lineno,
in_app: !0
} ]
}), (!this._globalOptions.ignoreUrls.test || !this._globalOptions.ignoreUrls.test(fileurl)) && (!this._globalOptions.whitelistUrls.test || this._globalOptions.whitelistUrls.test(fileurl)))) {
var data = objectMerge({
exception: {
values: [ {
type: type,
value: message,
stacktrace: stacktrace
} ]
},
culprit: fileurl
}, options);
this._send(data);
}
},
_trimPacket: function(data) {
var max = this._globalOptions.maxMessageLength;
if (data.message = truncate(data.message, max), data.exception) {
var exception = data.exception.values[0];
exception.value = truncate(exception.value, max);
}
return data;
},
_getHttpData: function() {
if (this._hasDocument && document.location && document.location.href) {
var httpData = {
headers: {
"User-Agent": navigator.userAgent
}
};
return httpData.url = document.location.href, document.referrer && (httpData.headers.Referer = document.referrer), 
httpData;
}
},
_send: function(data) {
var self = this, globalOptions = this._globalOptions, baseData = {
project: this._globalProject,
logger: globalOptions.logger,
platform: "javascript"
}, httpData = this._getHttpData();
if (httpData && (baseData.request = httpData), data = objectMerge(baseData, data), 
data.tags = objectMerge(objectMerge({}, this._globalContext.tags), data.tags), data.extra = objectMerge(objectMerge({}, this._globalContext.extra), data.extra), 
data.extra["session:duration"] = now() - this._startTime, this._breadcrumbs && this._breadcrumbs.length > 0 && (data.breadcrumbs = {
values: [].slice.call(this._breadcrumbs, 0)
}), isEmptyObject(data.tags) && delete data.tags, this._globalContext.user && (data.user = this._globalContext.user), 
globalOptions.release && (data.release = globalOptions.release), globalOptions.serverName && (data.server_name = globalOptions.serverName), 
isFunction(globalOptions.dataCallback) && (data = globalOptions.dataCallback(data) || data), 
data && !isEmptyObject(data) && (!isFunction(globalOptions.shouldSendCallback) || globalOptions.shouldSendCallback(data)) && (this._lastEventId = data.event_id || (data.event_id = uuid4()), 
data = this._trimPacket(data), this._logDebug("debug", "Raven about to send:", data), 
this.isSetup())) {
var auth = {
sentry_version: "7",
sentry_client: "raven-js/" + this.VERSION,
sentry_key: this._globalKey
};
this._globalSecret && (auth.sentry_secret = this._globalSecret);
var exception = data.exception && data.exception.values[0];
this.captureBreadcrumb({
category: "sentry",
message: exception ? (exception.type ? exception.type + ": " : "") + exception.message : data.message,
event_id: data.event_id,
level: data.level || "error"
});
var url = this._globalEndpoint;
(globalOptions.transport || this._makeRequest).call(this, {
url: url,
auth: auth,
data: data,
options: globalOptions,
onSuccess: function success() {
self._triggerEvent("success", {
data: data,
src: url
});
},
onError: function failure() {
self._triggerEvent("failure", {
data: data,
src: url
});
}
});
}
},
_makeRequest: function(opts) {
function handler() {
200 === request.status ? opts.onSuccess && opts.onSuccess() : opts.onError && opts.onError();
}
var request = new XMLHttpRequest(), hasCORS = "withCredentials" in request || "undefined" != typeof XDomainRequest;
if (hasCORS) {
var url = opts.url;
"withCredentials" in request ? request.onreadystatechange = function() {
4 === request.readyState && handler();
} : (request = new XDomainRequest(), url = url.replace(/^https?:/, ""), request.onload = handler), 
request.open("POST", url + "?" + urlencode(opts.auth)), request.send(JSON.stringify(opts.data));
}
},
_logDebug: function(level) {
this._originalConsoleMethods[level] && this.debug && Function.prototype.apply.call(this._originalConsoleMethods[level], this._originalConsole, [].slice.call(arguments, 1));
},
_mergeContext: function(key, context) {
isUndefined(context) ? delete this._globalContext[key] : this._globalContext[key] = objectMerge(this._globalContext[key] || {}, context);
}
}, Raven.prototype.setUser = Raven.prototype.setUserContext, Raven.prototype.setReleaseContext = Raven.prototype.setRelease, 
module.exports = Raven;
}, function(module, exports, __webpack_require__) {
"use strict";
var RavenConstructor = __webpack_require__(996), _Raven = window.Raven, Raven = new RavenConstructor();
Raven.noConflict = function() {
return window.Raven = _Raven, Raven;
}, Raven.afterLoad(), module.exports = Raven;
}, function(module, exports, __webpack_require__) {
"use strict";
function getLocationHref() {
return "undefined" == typeof document ? "" : document.location.href;
}
var utils = __webpack_require__(431), hasKey = utils.hasKey, isString = utils.isString, isUndefined = utils.isUndefined, TraceKit = {
collectWindowErrors: !0,
debug: !1
}, _slice = [].slice, UNKNOWN_FUNCTION = "?", ERROR_TYPES_RE = /^(?:Uncaught (?:exception: )?)?((?:Eval|Internal|Range|Reference|Syntax|Type|URI)Error): ?(.*)$/;
TraceKit.report = function reportModuleWrapper() {
function subscribe(handler) {
installGlobalHandler(), handlers.push(handler);
}
function unsubscribe(handler) {
for (var i = handlers.length - 1; i >= 0; --i) handlers[i] === handler && handlers.splice(i, 1);
}
function unsubscribeAll() {
uninstallGlobalHandler(), handlers = [];
}
function notifyHandlers(stack, isWindowError) {
var exception = null;
if (!isWindowError || TraceKit.collectWindowErrors) {
for (var i in handlers) if (hasKey(handlers, i)) try {
handlers[i].apply(null, [ stack ].concat(_slice.call(arguments, 2)));
} catch (inner) {
exception = inner;
}
if (exception) throw exception;
}
}
function traceKitWindowOnError(message, url, lineNo, colNo, ex) {
var stack = null;
if (lastExceptionStack) TraceKit.computeStackTrace.augmentStackTraceWithInitialElement(lastExceptionStack, url, lineNo, message), 
processLastException(); else if (ex) stack = TraceKit.computeStackTrace(ex), notifyHandlers(stack, !0); else {
var groups, location = {
url: url,
line: lineNo,
column: colNo
}, name = void 0, msg = message;
if (isString(message)) {
var groups = message.match(ERROR_TYPES_RE);
groups && (name = groups[1], msg = groups[2]);
}
location.func = UNKNOWN_FUNCTION, stack = {
name: name,
message: msg,
url: getLocationHref(),
stack: [ location ]
}, notifyHandlers(stack, !0);
}
return !!_oldOnerrorHandler && _oldOnerrorHandler.apply(this, arguments);
}
function installGlobalHandler() {
_onErrorHandlerInstalled || (_oldOnerrorHandler = window.onerror, window.onerror = traceKitWindowOnError, 
_onErrorHandlerInstalled = !0);
}
function uninstallGlobalHandler() {
_onErrorHandlerInstalled && (window.onerror = _oldOnerrorHandler, _onErrorHandlerInstalled = !1, 
_oldOnerrorHandler = void 0);
}
function processLastException() {
var _lastExceptionStack = lastExceptionStack, _lastArgs = lastArgs;
lastArgs = null, lastExceptionStack = null, lastException = null, notifyHandlers.apply(null, [ _lastExceptionStack, !1 ].concat(_lastArgs));
}
function report(ex, rethrow) {
var args = _slice.call(arguments, 1);
if (lastExceptionStack) {
if (lastException === ex) return;
processLastException();
}
var stack = TraceKit.computeStackTrace(ex);
if (lastExceptionStack = stack, lastException = ex, lastArgs = args, window.setTimeout(function() {
lastException === ex && processLastException();
}, stack.incomplete ? 2e3 : 0), rethrow !== !1) throw ex;
}
var _oldOnerrorHandler, _onErrorHandlerInstalled, handlers = [], lastArgs = null, lastException = null, lastExceptionStack = null;
return report.subscribe = subscribe, report.unsubscribe = unsubscribe, report.uninstall = unsubscribeAll, 
report;
}(), TraceKit.computeStackTrace = function computeStackTraceWrapper() {
function computeStackTraceFromStackProp(ex) {
if (!isUndefined(ex.stack) && ex.stack) {
for (var parts, element, chrome = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|<anonymous>).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i, gecko = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|\[native).*?)(?::(\d+))?(?::(\d+))?\s*$/i, winjs = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:ms-appx|https?|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i, lines = ex.stack.split("\n"), stack = [], i = (/^(.*) is undefined$/.exec(ex.message), 
0), j = lines.length; i < j; ++i) {
if (parts = chrome.exec(lines[i])) {
var isNative = parts[2] && parts[2].indexOf("native") !== -1;
element = {
url: isNative ? null : parts[2],
func: parts[1] || UNKNOWN_FUNCTION,
args: isNative ? [ parts[2] ] : [],
line: parts[3] ? +parts[3] : null,
column: parts[4] ? +parts[4] : null
};
} else if (parts = winjs.exec(lines[i])) element = {
url: parts[2],
func: parts[1] || UNKNOWN_FUNCTION,
args: [],
line: +parts[3],
column: parts[4] ? +parts[4] : null
}; else {
if (!(parts = gecko.exec(lines[i]))) continue;
element = {
url: parts[3],
func: parts[1] || UNKNOWN_FUNCTION,
args: parts[2] ? parts[2].split(",") : [],
line: parts[4] ? +parts[4] : null,
column: parts[5] ? +parts[5] : null
};
}
!element.func && element.line && (element.func = UNKNOWN_FUNCTION), stack.push(element);
}
return stack.length ? (stack[0].column || isUndefined(ex.columnNumber) || (stack[0].column = ex.columnNumber + 1), 
{
name: ex.name,
message: ex.message,
url: getLocationHref(),
stack: stack
}) : null;
}
}
function computeStackTraceFromStacktraceProp(ex) {
var stacktrace = ex.stacktrace;
if (!isUndefined(ex.stacktrace) && ex.stacktrace) {
for (var parts, opera10Regex = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i, opera11Regex = / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^\)]+))\((.*)\))? in (.*):\s*$/i, lines = stacktrace.split("\n"), stack = [], line = 0; line < lines.length; line += 2) {
var element = null;
(parts = opera10Regex.exec(lines[line])) ? element = {
url: parts[2],
line: +parts[1],
column: null,
func: parts[3],
args: []
} : (parts = opera11Regex.exec(lines[line])) && (element = {
url: parts[6],
line: +parts[1],
column: +parts[2],
func: parts[3] || parts[4],
args: parts[5] ? parts[5].split(",") : []
}), element && (!element.func && element.line && (element.func = UNKNOWN_FUNCTION), 
stack.push(element));
}
return stack.length ? {
name: ex.name,
message: ex.message,
url: getLocationHref(),
stack: stack
} : null;
}
}
function computeStackTraceFromOperaMultiLineMessage(ex) {
var lines = ex.message.split("\n");
if (lines.length < 4) return null;
for (var parts, lineRE1 = /^\s*Line (\d+) of linked script ((?:file|https?|blob)\S+)(?:: in function (\S+))?\s*$/i, lineRE2 = /^\s*Line (\d+) of inline#(\d+) script in ((?:file|https?|blob)\S+)(?:: in function (\S+))?\s*$/i, lineRE3 = /^\s*Line (\d+) of function script\s*$/i, stack = [], line = (document.getElementsByTagName("script"), 
2); line < lines.length; line += 2) {
var item = null;
if (parts = lineRE1.exec(lines[line])) item = {
url: parts[2],
func: parts[3],
args: [],
line: +parts[1],
column: null
}; else if (parts = lineRE2.exec(lines[line])) {
item = {
url: parts[3],
func: parts[4],
args: [],
line: +parts[1],
column: null
};
+parts[1];
} else if (parts = lineRE3.exec(lines[line])) {
var url = window.location.href.replace(/#.*$/, "");
item = {
url: url,
func: "",
args: [],
line: parts[1],
column: null
};
}
item && (item.func || (item.func = UNKNOWN_FUNCTION), stack.push(item));
}
return stack.length ? {
name: ex.name,
message: lines[0],
url: getLocationHref(),
stack: stack
} : null;
}
function augmentStackTraceWithInitialElement(stackInfo, url, lineNo, message) {
var initial = {
url: url,
line: lineNo
};
if (initial.url && initial.line) {
if (stackInfo.incomplete = !1, initial.func || (initial.func = UNKNOWN_FUNCTION), 
stackInfo.stack.length > 0 && stackInfo.stack[0].url === initial.url) {
if (stackInfo.stack[0].line === initial.line) return !1;
if (!stackInfo.stack[0].line && stackInfo.stack[0].func === initial.func) return stackInfo.stack[0].line = initial.line, 
!1;
}
return stackInfo.stack.unshift(initial), stackInfo.partial = !0, !0;
}
return stackInfo.incomplete = !0, !1;
}
function computeStackTraceByWalkingCallerChain(ex, depth) {
for (var parts, item, functionName = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i, stack = [], funcs = {}, recursion = !1, curr = computeStackTraceByWalkingCallerChain.caller; curr && !recursion; curr = curr.caller) if (curr !== computeStackTrace && curr !== TraceKit.report) {
if (item = {
url: null,
func: UNKNOWN_FUNCTION,
line: null,
column: null
}, curr.name ? item.func = curr.name : (parts = functionName.exec(curr.toString())) && (item.func = parts[1]), 
"undefined" == typeof item.func) try {
item.func = parts.input.substring(0, parts.input.indexOf("{"));
} catch (e) {}
funcs["" + curr] ? recursion = !0 : funcs["" + curr] = !0, stack.push(item);
}
depth && stack.splice(0, depth);
var result = {
name: ex.name,
message: ex.message,
url: getLocationHref(),
stack: stack
};
return augmentStackTraceWithInitialElement(result, ex.sourceURL || ex.fileName, ex.line || ex.lineNumber, ex.message || ex.description), 
result;
}
function computeStackTrace(ex, depth) {
var stack = null;
depth = null == depth ? 0 : +depth;
try {
if (stack = computeStackTraceFromStacktraceProp(ex)) return stack;
} catch (e) {
if (TraceKit.debug) throw e;
}
try {
if (stack = computeStackTraceFromStackProp(ex)) return stack;
} catch (e) {
if (TraceKit.debug) throw e;
}
try {
if (stack = computeStackTraceFromOperaMultiLineMessage(ex)) return stack;
} catch (e) {
if (TraceKit.debug) throw e;
}
try {
if (stack = computeStackTraceByWalkingCallerChain(ex, depth + 1)) return stack;
} catch (e) {
if (TraceKit.debug) throw e;
}
return {
name: ex.name,
message: ex.message,
url: getLocationHref()
};
}
return computeStackTrace.augmentStackTraceWithInitialElement = augmentStackTraceWithInitialElement, 
computeStackTrace.computeStackTraceFromStackProp = computeStackTraceFromStackProp, 
computeStackTrace;
}(), module.exports = TraceKit;
}, function(module, exports, __webpack_require__) {
module.exports = __webpack_require__(1052);
}, , function(module, exports, __webpack_require__) {
"use strict";
var _get = __webpack_require__(195).default, _inherits = __webpack_require__(196).default, _createClass = __webpack_require__(193).default, _classCallCheck = __webpack_require__(192).default, _extends = __webpack_require__(194).default, _interopRequireDefault = __webpack_require__(139).default;
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _EnhancedSwitch = __webpack_require__(432), _EnhancedSwitch2 = _interopRequireDefault(_EnhancedSwitch), Checkbox = function(_React$Component) {
function Checkbox(props) {
_classCallCheck(this, Checkbox), _get(Object.getPrototypeOf(Checkbox.prototype), "constructor", this).call(this, props), 
this.state = {};
}
return _inherits(Checkbox, _React$Component), _createClass(Checkbox, [ {
key: "getValue",
value: function getValue() {
return this.refs.enhancedSwitch.getValue();
}
}, {
key: "setChecked",
value: function setChecked(newCheckedValue) {
this.refs.enhancedSwitch.setChecked(newCheckedValue);
}
}, {
key: "isChecked",
value: function isChecked() {
return this.refs.enhancedSwitch.isChecked();
}
}, {
key: "render",
value: function render() {
return _react2.default.createElement(_EnhancedSwitch2.default, _extends({
ref: "enhancedSwitch"
}, this.props, {
inputType: "checkbox"
}));
}
} ]), Checkbox;
}(_react2.default.Component);
exports.default = Checkbox, module.exports = exports.default;
}, function(module, exports, __webpack_require__) {
"use strict";
var _get = __webpack_require__(195).default, _inherits = __webpack_require__(196).default, _createClass = __webpack_require__(193).default, _classCallCheck = __webpack_require__(192).default, _objectWithoutProperties = __webpack_require__(435).default, _extends = __webpack_require__(194).default, _interopRequireDefault = __webpack_require__(139).default;
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _propTypes = __webpack_require__(430), _propTypes2 = _interopRequireDefault(_propTypes), _Radio = __webpack_require__(433), _Radio2 = _interopRequireDefault(_Radio), RadioGroup = function(_React$Component) {
function RadioGroup(props) {
_classCallCheck(this, RadioGroup), _get(Object.getPrototypeOf(RadioGroup.prototype), "constructor", this).call(this, props), 
this.state = {
numberCheckedRadioButtons: 0,
value: this.props.value || this.props.defaultValue || ""
};
}
return _inherits(RadioGroup, _React$Component), _createClass(RadioGroup, null, [ {
key: "propTypes",
value: {
name: _propTypes2.default.string.isRequired,
defaultValue: _propTypes2.default.string,
value: _propTypes2.default.string,
onChange: _propTypes2.default.func,
children: _propTypes2.default.node,
className: _propTypes2.default.string
},
enumerable: !0
} ]), _createClass(RadioGroup, [ {
key: "componentWillMount",
value: function componentWillMount() {
var _this = this, cnt = 0;
_react2.default.Children.forEach(this.props.children, function(option) {
_this.hasCheckAttribute(option) && cnt++;
}, this), this.setState({
numberCheckedRadioButtons: cnt
});
}
}, {
key: "componentWillReceiveProps",
value: function componentWillReceiveProps(nextProps) {
nextProps.hasOwnProperty("value") && this.setState({
value: nextProps.value
});
}
}, {
key: "getValue",
value: function getValue() {
return this.state.value;
}
}, {
key: "setValue",
value: function setValue(newValue) {
this.updateRadioButtons(newValue);
}
}, {
key: "clearValue",
value: function clearValue() {
this.setValue("");
}
}, {
key: "hasCheckAttribute",
value: function hasCheckAttribute(radioButton) {
return radioButton.props.hasOwnProperty("checked") && radioButton.props.checked;
}
}, {
key: "updateRadioButtons",
value: function updateRadioButtons(newValue) {
if (0 === this.state.numberCheckedRadioButtons) this.setState({
value: newValue
}); else ;
}
}, {
key: "handleChange",
value: function handleChange(e) {
var newValue = e.target.value;
this.updateRadioButtons(newValue), 0 === this.state.numberCheckedRadioButtons && this.props.onChange && this.props.onChange(e, newValue);
}
}, {
key: "render",
value: function render() {
var _this2 = this, options = _react2.default.Children.map(this.props.children, function(option) {
var _option$props = option.props, other = (_option$props.name, _option$props.value, 
_option$props.label, _option$props.onChange, _objectWithoutProperties(_option$props, [ "name", "value", "label", "onChange" ]));
return _react2.default.createElement(_Radio2.default, _extends({}, other, {
ref: option.props.value,
name: _this2.props.name,
key: option.props.value,
value: option.props.value,
label: option.props.label,
onChange: _this2.handleChange.bind(_this2),
checked: option.props.value === _this2.state.value
}));
}, this);
return _react2.default.createElement("div", {
className: this.props.className
}, options);
}
} ]), RadioGroup;
}(_react2.default.Component);
exports.default = RadioGroup, module.exports = exports.default;
}, function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireDefault = __webpack_require__(139).default;
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _Checkbox = __webpack_require__(1001), _Checkbox2 = _interopRequireDefault(_Checkbox), _Radio = __webpack_require__(433), _Radio2 = _interopRequireDefault(_Radio), _RadioGroup = __webpack_require__(1002), _RadioGroup2 = _interopRequireDefault(_RadioGroup);
exports.default = {
Checkbox: _Checkbox2.default,
Radio: _Radio2.default,
RadioGroup: _RadioGroup2.default
}, module.exports = exports.default;
}, function(module, exports, __webpack_require__) {
module.exports = {
"default": __webpack_require__(1009),
__esModule: !0
};
}, [ 1133, 1010 ], function(module, exports, __webpack_require__) {
module.exports = {
"default": __webpack_require__(1012),
__esModule: !0
};
}, [ 1136, 1013 ], function(module, exports, __webpack_require__) {
"use strict";
var _Object$defineProperty = __webpack_require__(434).default;
exports.default = function(obj, key, value) {
return key in obj ? _Object$defineProperty(obj, key, {
value: value,
enumerable: !0,
configurable: !0,
writable: !0
}) : obj[key] = value, obj;
}, exports.__esModule = !0;
}, function(module, exports, __webpack_require__) {
__webpack_require__(1023), module.exports = __webpack_require__(197).Object.assign;
}, function(module, exports, __webpack_require__) {
var $ = __webpack_require__(140);
module.exports = function create(P, D) {
return $.create(P, D);
};
}, function(module, exports, __webpack_require__) {
var $ = __webpack_require__(140);
module.exports = function defineProperty(it, key, desc) {
return $.setDesc(it, key, desc);
};
}, function(module, exports, __webpack_require__) {
var $ = __webpack_require__(140);
__webpack_require__(1024), module.exports = function getOwnPropertyDescriptor(it, key) {
return $.getDesc(it, key);
};
}, function(module, exports, __webpack_require__) {
__webpack_require__(1025), module.exports = __webpack_require__(197).Object.setPrototypeOf;
}, 958, function(module, exports, __webpack_require__) {
var isObject = __webpack_require__(440);
module.exports = function(it) {
if (!isObject(it)) throw TypeError(it + " is not an object!");
return it;
};
}, 278, 95, function(module, exports, __webpack_require__) {
var $ = __webpack_require__(140), toObject = __webpack_require__(1022), IObject = __webpack_require__(439);
module.exports = __webpack_require__(438)(function() {
var a = Object.assign, A = {}, B = {}, S = Symbol(), K = "abcdefghijklmnopqrst";
return A[S] = 7, K.split("").forEach(function(k) {
B[k] = k;
}), 7 != a({}, A)[S] || Object.keys(a({}, B)).join("") != K;
}) ? function assign(target, source) {
for (var T = toObject(target), $$ = arguments, $$len = $$.length, index = 1, getKeys = $.getKeys, getSymbols = $.getSymbols, isEnum = $.isEnum; $$len > index; ) for (var key, S = IObject($$[index++]), keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S), length = keys.length, j = 0; length > j; ) isEnum.call(S, key = keys[j++]) && (T[key] = S[key]);
return T;
} : Object.assign;
}, function(module, exports, __webpack_require__) {
var $export = __webpack_require__(287), core = __webpack_require__(197), fails = __webpack_require__(438);
module.exports = function(KEY, exec) {
var fn = (core.Object || {})[KEY] || Object[KEY], exp = {};
exp[KEY] = exec(fn), $export($export.S + $export.F * fails(function() {
fn(1);
}), "Object", exp);
};
}, function(module, exports, __webpack_require__) {
var getDesc = __webpack_require__(140).getDesc, isObject = __webpack_require__(440), anObject = __webpack_require__(1015), check = function(O, proto) {
if (anObject(O), !isObject(proto) && null !== proto) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
set: Object.setPrototypeOf || ("__proto__" in {} ? function(test, buggy, set) {
try {
set = __webpack_require__(436)(Function.call, getDesc(Object.prototype, "__proto__").set, 2), 
set(test, []), buggy = !(test instanceof Array);
} catch (e) {
buggy = !0;
}
return function setPrototypeOf(O, proto) {
return check(O, proto), buggy ? O.__proto__ = proto : set(O, proto), O;
};
}({}, !1) : void 0),
check: check
};
}, function(module, exports, __webpack_require__) {
var IObject = __webpack_require__(439), defined = __webpack_require__(437);
module.exports = function(it) {
return IObject(defined(it));
};
}, function(module, exports, __webpack_require__) {
var defined = __webpack_require__(437);
module.exports = function(it) {
return Object(defined(it));
};
}, function(module, exports, __webpack_require__) {
var $export = __webpack_require__(287);
$export($export.S + $export.F, "Object", {
assign: __webpack_require__(1018)
});
}, function(module, exports, __webpack_require__) {
var toIObject = __webpack_require__(1021);
__webpack_require__(1019)("getOwnPropertyDescriptor", function($getOwnPropertyDescriptor) {
return function getOwnPropertyDescriptor(it, key) {
return $getOwnPropertyDescriptor(toIObject(it), key);
};
});
}, function(module, exports, __webpack_require__) {
var $export = __webpack_require__(287);
$export($export.S, "Object", {
setPrototypeOf: __webpack_require__(1020).set
});
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function _classCallCheck(instance, Constructor) {
if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _possibleConstructorReturn(self, call) {
if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !call || "object" != typeof call && "function" != typeof call ? self : call;
}
function _inherits(subClass, superClass) {
if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
subClass.prototype = Object.create(superClass && superClass.prototype, {
constructor: {
value: subClass,
enumerable: !1,
writable: !0,
configurable: !0
}
}), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
}
exports.__esModule = !0, exports.default = void 0;
var _react = __webpack_require__(4), _storeShape = __webpack_require__(441), _storeShape2 = _interopRequireDefault(_storeShape), _warning = __webpack_require__(442), Provider = (_interopRequireDefault(_warning), 
function(_Component) {
function Provider(props, context) {
_classCallCheck(this, Provider);
var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));
return _this.store = props.store, _this;
}
return _inherits(Provider, _Component), Provider.prototype.getChildContext = function getChildContext() {
return {
store: this.store
};
}, Provider.prototype.render = function render() {
var children = this.props.children;
return _react.Children.only(children);
}, Provider;
}(_react.Component));
exports.default = Provider, Provider.propTypes = {
store: _storeShape2.default.isRequired,
children: _react.PropTypes.element.isRequired
}, Provider.childContextTypes = {
store: _storeShape2.default.isRequired
};
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function _classCallCheck(instance, Constructor) {
if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _possibleConstructorReturn(self, call) {
if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !call || "object" != typeof call && "function" != typeof call ? self : call;
}
function _inherits(subClass, superClass) {
if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
subClass.prototype = Object.create(superClass && superClass.prototype, {
constructor: {
value: subClass,
enumerable: !1,
writable: !0,
configurable: !0
}
}), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
}
function getDisplayName(WrappedComponent) {
return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
function tryCatch(fn, ctx) {
try {
return fn.apply(ctx);
} catch (e) {
return errorObject.value = e, errorObject;
}
}
function connect(mapStateToProps, mapDispatchToProps, mergeProps) {
var options = arguments.length <= 3 || void 0 === arguments[3] ? {} : arguments[3], shouldSubscribe = Boolean(mapStateToProps), mapState = mapStateToProps || defaultMapStateToProps, mapDispatch = void 0;
mapDispatch = "function" == typeof mapDispatchToProps ? mapDispatchToProps : mapDispatchToProps ? (0, 
_wrapActionCreators2.default)(mapDispatchToProps) : defaultMapDispatchToProps;
var finalMergeProps = mergeProps || defaultMergeProps, _options$pure = options.pure, pure = void 0 === _options$pure || _options$pure, _options$withRef = options.withRef, withRef = void 0 !== _options$withRef && _options$withRef, checkMergedEquals = pure && finalMergeProps !== defaultMergeProps, version = nextVersion++;
return function wrapWithConnect(WrappedComponent) {
function computeMergedProps(stateProps, dispatchProps, parentProps) {
var mergedProps = finalMergeProps(stateProps, dispatchProps, parentProps);
return mergedProps;
}
var connectDisplayName = "Connect(" + getDisplayName(WrappedComponent) + ")", Connect = function(_Component) {
function Connect(props, context) {
_classCallCheck(this, Connect);
var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));
_this.version = version, _this.store = props.store || context.store, (0, _invariant2.default)(_this.store, 'Could not find "store" in either the context or ' + ('props of "' + connectDisplayName + '". ') + "Either wrap the root component in a <Provider>, " + ('or explicitly pass "store" as a prop to "' + connectDisplayName + '".'));
var storeState = _this.store.getState();
return _this.state = {
storeState: storeState
}, _this.clearCache(), _this;
}
return _inherits(Connect, _Component), Connect.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
return !pure || this.haveOwnPropsChanged || this.hasStoreStateChanged;
}, Connect.prototype.computeStateProps = function computeStateProps(store, props) {
if (!this.finalMapStateToProps) return this.configureFinalMapState(store, props);
var state = store.getState(), stateProps = this.doStatePropsDependOnOwnProps ? this.finalMapStateToProps(state, props) : this.finalMapStateToProps(state);
return stateProps;
}, Connect.prototype.configureFinalMapState = function configureFinalMapState(store, props) {
var mappedState = mapState(store.getState(), props), isFactory = "function" == typeof mappedState;
return this.finalMapStateToProps = isFactory ? mappedState : mapState, this.doStatePropsDependOnOwnProps = 1 !== this.finalMapStateToProps.length, 
isFactory ? this.computeStateProps(store, props) : mappedState;
}, Connect.prototype.computeDispatchProps = function computeDispatchProps(store, props) {
if (!this.finalMapDispatchToProps) return this.configureFinalMapDispatch(store, props);
var dispatch = store.dispatch, dispatchProps = this.doDispatchPropsDependOnOwnProps ? this.finalMapDispatchToProps(dispatch, props) : this.finalMapDispatchToProps(dispatch);
return dispatchProps;
}, Connect.prototype.configureFinalMapDispatch = function configureFinalMapDispatch(store, props) {
var mappedDispatch = mapDispatch(store.dispatch, props), isFactory = "function" == typeof mappedDispatch;
return this.finalMapDispatchToProps = isFactory ? mappedDispatch : mapDispatch, 
this.doDispatchPropsDependOnOwnProps = 1 !== this.finalMapDispatchToProps.length, 
isFactory ? this.computeDispatchProps(store, props) : mappedDispatch;
}, Connect.prototype.updateStatePropsIfNeeded = function updateStatePropsIfNeeded() {
var nextStateProps = this.computeStateProps(this.store, this.props);
return (!this.stateProps || !(0, _shallowEqual2.default)(nextStateProps, this.stateProps)) && (this.stateProps = nextStateProps, 
!0);
}, Connect.prototype.updateDispatchPropsIfNeeded = function updateDispatchPropsIfNeeded() {
var nextDispatchProps = this.computeDispatchProps(this.store, this.props);
return (!this.dispatchProps || !(0, _shallowEqual2.default)(nextDispatchProps, this.dispatchProps)) && (this.dispatchProps = nextDispatchProps, 
!0);
}, Connect.prototype.updateMergedPropsIfNeeded = function updateMergedPropsIfNeeded() {
var nextMergedProps = computeMergedProps(this.stateProps, this.dispatchProps, this.props);
return !(this.mergedProps && checkMergedEquals && (0, _shallowEqual2.default)(nextMergedProps, this.mergedProps)) && (this.mergedProps = nextMergedProps, 
!0);
}, Connect.prototype.isSubscribed = function isSubscribed() {
return "function" == typeof this.unsubscribe;
}, Connect.prototype.trySubscribe = function trySubscribe() {
shouldSubscribe && !this.unsubscribe && (this.unsubscribe = this.store.subscribe(this.handleChange.bind(this)), 
this.handleChange());
}, Connect.prototype.tryUnsubscribe = function tryUnsubscribe() {
this.unsubscribe && (this.unsubscribe(), this.unsubscribe = null);
}, Connect.prototype.componentDidMount = function componentDidMount() {
this.trySubscribe();
}, Connect.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
pure && (0, _shallowEqual2.default)(nextProps, this.props) || (this.haveOwnPropsChanged = !0);
}, Connect.prototype.componentWillUnmount = function componentWillUnmount() {
this.tryUnsubscribe(), this.clearCache();
}, Connect.prototype.clearCache = function clearCache() {
this.dispatchProps = null, this.stateProps = null, this.mergedProps = null, this.haveOwnPropsChanged = !0, 
this.hasStoreStateChanged = !0, this.haveStatePropsBeenPrecalculated = !1, this.statePropsPrecalculationError = null, 
this.renderedElement = null, this.finalMapDispatchToProps = null, this.finalMapStateToProps = null;
}, Connect.prototype.handleChange = function handleChange() {
if (this.unsubscribe) {
var storeState = this.store.getState(), prevStoreState = this.state.storeState;
if (!pure || prevStoreState !== storeState) {
if (pure && !this.doStatePropsDependOnOwnProps) {
var haveStatePropsChanged = tryCatch(this.updateStatePropsIfNeeded, this);
if (!haveStatePropsChanged) return;
haveStatePropsChanged === errorObject && (this.statePropsPrecalculationError = errorObject.value), 
this.haveStatePropsBeenPrecalculated = !0;
}
this.hasStoreStateChanged = !0, this.setState({
storeState: storeState
});
}
}
}, Connect.prototype.getWrappedInstance = function getWrappedInstance() {
return (0, _invariant2.default)(withRef, "To access the wrapped instance, you need to specify { withRef: true } as the fourth argument of the connect() call."), 
this.refs.wrappedInstance;
}, Connect.prototype.render = function render() {
var haveOwnPropsChanged = this.haveOwnPropsChanged, hasStoreStateChanged = this.hasStoreStateChanged, haveStatePropsBeenPrecalculated = this.haveStatePropsBeenPrecalculated, statePropsPrecalculationError = this.statePropsPrecalculationError, renderedElement = this.renderedElement;
if (this.haveOwnPropsChanged = !1, this.hasStoreStateChanged = !1, this.haveStatePropsBeenPrecalculated = !1, 
this.statePropsPrecalculationError = null, statePropsPrecalculationError) throw statePropsPrecalculationError;
var shouldUpdateStateProps = !0, shouldUpdateDispatchProps = !0;
pure && renderedElement && (shouldUpdateStateProps = hasStoreStateChanged || haveOwnPropsChanged && this.doStatePropsDependOnOwnProps, 
shouldUpdateDispatchProps = haveOwnPropsChanged && this.doDispatchPropsDependOnOwnProps);
var haveStatePropsChanged = !1, haveDispatchPropsChanged = !1;
haveStatePropsBeenPrecalculated ? haveStatePropsChanged = !0 : shouldUpdateStateProps && (haveStatePropsChanged = this.updateStatePropsIfNeeded()), 
shouldUpdateDispatchProps && (haveDispatchPropsChanged = this.updateDispatchPropsIfNeeded());
var haveMergedPropsChanged = !0;
return haveMergedPropsChanged = !!(haveStatePropsChanged || haveDispatchPropsChanged || haveOwnPropsChanged) && this.updateMergedPropsIfNeeded(), 
!haveMergedPropsChanged && renderedElement ? renderedElement : (withRef ? this.renderedElement = (0, 
_react.createElement)(WrappedComponent, _extends({}, this.mergedProps, {
ref: "wrappedInstance"
})) : this.renderedElement = (0, _react.createElement)(WrappedComponent, this.mergedProps), 
this.renderedElement);
}, Connect;
}(_react.Component);
return Connect.displayName = connectDisplayName, Connect.WrappedComponent = WrappedComponent, 
Connect.contextTypes = {
store: _storeShape2.default
}, Connect.propTypes = {
store: _storeShape2.default
}, (0, _hoistNonReactStatics2.default)(Connect, WrappedComponent);
};
}
var _extends = Object.assign || function(target) {
for (var i = 1; i < arguments.length; i++) {
var source = arguments[i];
for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
}
return target;
};
exports.__esModule = !0, exports.default = connect;
var _react = __webpack_require__(4), _storeShape = __webpack_require__(441), _storeShape2 = _interopRequireDefault(_storeShape), _shallowEqual = __webpack_require__(1028), _shallowEqual2 = _interopRequireDefault(_shallowEqual), _wrapActionCreators = __webpack_require__(1029), _wrapActionCreators2 = _interopRequireDefault(_wrapActionCreators), _warning = __webpack_require__(442), _isPlainObject = (_interopRequireDefault(_warning), 
__webpack_require__(177)), _hoistNonReactStatics = (_interopRequireDefault(_isPlainObject), 
__webpack_require__(796)), _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics), _invariant = __webpack_require__(797), _invariant2 = _interopRequireDefault(_invariant), defaultMapStateToProps = function defaultMapStateToProps(state) {
return {};
}, defaultMapDispatchToProps = function defaultMapDispatchToProps(dispatch) {
return {
dispatch: dispatch
};
}, defaultMergeProps = function defaultMergeProps(stateProps, dispatchProps, parentProps) {
return _extends({}, parentProps, stateProps, dispatchProps);
}, errorObject = {
value: null
}, nextVersion = 0;
}, function(module, exports) {
"use strict";
function shallowEqual(objA, objB) {
if (objA === objB) return !0;
var keysA = Object.keys(objA), keysB = Object.keys(objB);
if (keysA.length !== keysB.length) return !1;
for (var hasOwn = Object.prototype.hasOwnProperty, i = 0; i < keysA.length; i++) if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) return !1;
return !0;
}
exports.__esModule = !0, exports.default = shallowEqual;
}, function(module, exports, __webpack_require__) {
"use strict";
function wrapActionCreators(actionCreators) {
return function(dispatch) {
return (0, _redux.bindActionCreators)(actionCreators, dispatch);
};
}
exports.__esModule = !0, exports.default = wrapActionCreators;
var _redux = __webpack_require__(146);
}, , , , , , , , , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
"use strict";
var shallowCompare = __webpack_require__(481), ReactComponentWithPureRenderMixin = {
shouldComponentUpdate: function(nextProps, nextState) {
return shallowCompare(this, nextProps, nextState);
}
};
module.exports = ReactComponentWithPureRenderMixin;
}, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function createSlicer(paths) {
switch ((0, _utilTypeOfJs2.default)(paths)) {
case "void":
return function(state) {
return state;
};

case "string":
return function(state) {
return (0, _getSubsetJs2.default)(state, [ paths ]);
};

case "array":
return function(state) {
return (0, _getSubsetJs2.default)(state, paths);
};

default:
return console.error("Invalid paths argument, should be of type String, Array or Void");
}
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.default = createSlicer;
var _getSubsetJs = __webpack_require__(1106), _getSubsetJs2 = _interopRequireDefault(_getSubsetJs), _utilTypeOfJs = __webpack_require__(1109), _utilTypeOfJs2 = _interopRequireDefault(_utilTypeOfJs);
module.exports = exports.default;
}, function(module, exports) {
"use strict";
function getSubset(obj, paths) {
var subset = {};
return paths.forEach(function(key) {
var slice = obj[key];
slice && (subset[key] = slice);
}), subset;
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.default = getSubset, module.exports = exports.default;
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function persistState(paths, config) {
var cfg = _extends({
key: "redux",
merge: _utilMergeStateJs2.default,
slicer: _createSlicerJs2.default,
serialize: JSON.stringify,
deserialize: JSON.parse
}, config), key = cfg.key, merge = cfg.merge, slicer = cfg.slicer, serialize = cfg.serialize, deserialize = cfg.deserialize;
return function(next) {
return function(reducer, initialState, enhancer) {
"function" == typeof initialState && "undefined" == typeof enhancer && (enhancer = initialState, 
initialState = void 0);
var persistedState = void 0, finalInitialState = void 0;
try {
persistedState = deserialize(localStorage.getItem(key)), finalInitialState = merge(initialState, persistedState);
} catch (e) {
console.warn("Failed to retrieve initialize state from localStorage:", e);
}
var store = next(reducer, finalInitialState, enhancer), slicerFn = slicer(paths);
return store.subscribe(function() {
var state = store.getState(), subset = slicerFn(state);
try {
localStorage.setItem(key, serialize(subset));
} catch (e) {
console.warn("Unable to persist state to localStorage:", e);
}
}), store;
};
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _extends = Object.assign || function(target) {
for (var i = 1; i < arguments.length; i++) {
var source = arguments[i];
for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
}
return target;
};
exports.default = persistState;
var _createSlicerJs = __webpack_require__(1105), _createSlicerJs2 = _interopRequireDefault(_createSlicerJs), _utilMergeStateJs = __webpack_require__(1108), _utilMergeStateJs2 = _interopRequireDefault(_utilMergeStateJs);
module.exports = exports.default;
}, function(module, exports) {
"use strict";
function mergeState(initialState, persistedState) {
return persistedState ? _extends({}, initialState, persistedState) : initialState;
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _extends = Object.assign || function(target) {
for (var i = 1; i < arguments.length; i++) {
var source = arguments[i];
for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
}
return target;
};
exports.default = mergeState, module.exports = exports.default;
}, function(module, exports) {
"use strict";
function typeOf(thing) {
return thing ? _isArray(thing) ? thing.length ? "array" : "void" : typeof thing : "void";
}
Object.defineProperty(exports, "__esModule", {
value: !0
}), exports.default = typeOf;
var _isArray = Array.isArray || (Array.isArray = function(a) {
return "" + a !== a && "[object Array]" === {}.toString.call(a);
});
module.exports = exports.default;
}, function(module, exports, __webpack_require__) {
"use strict";
function isPromise(val) {
return val && "function" == typeof val.then;
}
function promiseMiddleware(_ref) {
var dispatch = _ref.dispatch;
return function(next) {
return function(action) {
return _fluxStandardAction.isFSA(action) ? isPromise(action.payload) ? action.payload.then(function(result) {
return dispatch(_extends({}, action, {
payload: result
}));
}, function(error) {
return dispatch(_extends({}, action, {
payload: error,
error: !0
}));
}) : next(action) : isPromise(action) ? action.then(dispatch) : next(action);
};
};
}
exports.__esModule = !0;
var _extends = Object.assign || function(target) {
for (var i = 1; i < arguments.length; i++) {
var source = arguments[i];
for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
}
return target;
};
exports.default = promiseMiddleware;
var _fluxStandardAction = __webpack_require__(795);
module.exports = exports.default;
}, function(module, exports) {
"use strict";
function createThunkMiddleware(extraArgument) {
return function(_ref) {
var dispatch = _ref.dispatch, getState = _ref.getState;
return function(next) {
return function(action) {
return "function" == typeof action ? action(dispatch, getState, extraArgument) : next(action);
};
};
};
}
exports.__esModule = !0;
var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware, exports.default = thunk;
}, , , , function(module, exports) {
"use strict";
function _toConsumableArray(arr) {
if (Array.isArray(arr)) {
for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
return arr2;
}
return Array.from(arr);
}
function defaultEqualityCheck(a, b) {
return a === b;
}
function defaultMemoize(func) {
var equalityCheck = arguments.length <= 1 || void 0 === arguments[1] ? defaultEqualityCheck : arguments[1], lastArgs = null, lastResult = null;
return function() {
for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
return null !== lastArgs && lastArgs.length === args.length && args.every(function(value, index) {
return equalityCheck(value, lastArgs[index]);
}) || (lastResult = func.apply(void 0, args)), lastArgs = args, lastResult;
};
}
function getDependencies(funcs) {
var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;
if (!dependencies.every(function(dep) {
return "function" == typeof dep;
})) {
var dependencyTypes = dependencies.map(function(dep) {
return typeof dep;
}).join(", ");
throw new Error("Selector creators expect all input-selectors to be functions, " + ("instead received the following types: [" + dependencyTypes + "]"));
}
return dependencies;
}
function createSelectorCreator(memoize) {
for (var _len2 = arguments.length, memoizeOptions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) memoizeOptions[_key2 - 1] = arguments[_key2];
return function() {
for (var _len3 = arguments.length, funcs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) funcs[_key3] = arguments[_key3];
var recomputations = 0, resultFunc = funcs.pop(), dependencies = getDependencies(funcs), memoizedResultFunc = memoize.apply(void 0, [ function() {
return recomputations++, resultFunc.apply(void 0, arguments);
} ].concat(memoizeOptions)), selector = function selector(state, props) {
for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) args[_key4 - 2] = arguments[_key4];
var params = dependencies.map(function(dependency) {
return dependency.apply(void 0, [ state, props ].concat(args));
});
return memoizedResultFunc.apply(void 0, _toConsumableArray(params));
};
return selector.resultFunc = resultFunc, selector.recomputations = function() {
return recomputations;
}, selector.resetRecomputations = function() {
return recomputations = 0;
}, selector;
};
}
function createStructuredSelector(selectors) {
var selectorCreator = arguments.length <= 1 || void 0 === arguments[1] ? createSelector : arguments[1];
if ("object" != typeof selectors) throw new Error("createStructuredSelector expects first argument to be an object where each property is a selector, instead received a " + typeof selectors);
var objectKeys = Object.keys(selectors);
return selectorCreator(objectKeys.map(function(key) {
return selectors[key];
}), function() {
for (var _len5 = arguments.length, values = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) values[_key5] = arguments[_key5];
return values.reduce(function(composition, value, index) {
return composition[objectKeys[index]] = value, composition;
}, {});
});
}
exports.__esModule = !0, exports.defaultMemoize = defaultMemoize, exports.createSelectorCreator = createSelectorCreator, 
exports.createStructuredSelector = createStructuredSelector;
var createSelector = exports.createSelector = createSelectorCreator(defaultMemoize);
}, function(module, exports) {
function objToStr(x) {
return Object.prototype.toString.call(x);
}
function returner(x) {
return x;
}
function wrapIfFunction(thing) {
return "function" != typeof thing ? thing : function() {
return thing.apply(this, arguments);
};
}
function setNonEnumerable(target, key, value) {
key in target ? target[key] = value : Object.defineProperty(target, key, {
value: value,
writable: !0,
configurable: !0
});
}
function defaultNonFunctionProperty(left, right, key) {
if (void 0 !== left && void 0 !== right) {
var getTypeName = function(obj) {
return obj && obj.constructor && obj.constructor.name ? obj.constructor.name : objToStr(obj).slice(8, -1);
};
throw new TypeError("Cannot mixin key " + key + " because it is provided by multiple sources, and the types are " + getTypeName(left) + " and " + getTypeName(right));
}
return void 0 === left ? right : left;
}
function assertObject(obj, obj2) {
var type = objToStr(obj);
if ("[object Object]" !== type) {
var displayType = obj.constructor ? obj.constructor.name : "Unknown", displayType2 = obj2.constructor ? obj2.constructor.name : "Unknown";
throw new Error("cannot merge returned value of type " + displayType + " with an " + displayType2);
}
}
var mixins = module.exports = function makeMixinFunction(rules, _opts) {
var opts = _opts || {};
return opts.unknownFunction || (opts.unknownFunction = mixins.ONCE), opts.nonFunctionProperty || (opts.nonFunctionProperty = defaultNonFunctionProperty), 
function applyMixin(source, mixin) {
Object.keys(mixin).forEach(function(key) {
var left = source[key], right = mixin[key], rule = rules[key];
if (void 0 !== left || void 0 !== right) {
if (rule) {
var fn = rule(left, right, key);
return void setNonEnumerable(source, key, wrapIfFunction(fn));
}
var leftIsFn = "function" == typeof left, rightIsFn = "function" == typeof right;
return leftIsFn && void 0 === right || rightIsFn && void 0 === left || leftIsFn && rightIsFn ? void setNonEnumerable(source, key, wrapIfFunction(opts.unknownFunction(left, right, key))) : void (source[key] = opts.nonFunctionProperty(left, right, key));
}
});
};
};
mixins._mergeObjects = function(obj1, obj2) {
if (Array.isArray(obj1) && Array.isArray(obj2)) return obj1.concat(obj2);
assertObject(obj1, obj2), assertObject(obj2, obj1);
var result = {};
return Object.keys(obj1).forEach(function(k) {
if (Object.prototype.hasOwnProperty.call(obj2, k)) throw new Error("cannot merge returns because both have the " + JSON.stringify(k) + " key");
result[k] = obj1[k];
}), Object.keys(obj2).forEach(function(k) {
result[k] = obj2[k];
}), result;
}, mixins.ONCE = function(left, right, key) {
if (left && right) throw new TypeError("Cannot mixin " + key + " because it has a unique constraint.");
return left || right;
}, mixins.MANY = function(left, right, key) {
return function() {
return right && right.apply(this, arguments), left ? left.apply(this, arguments) : void 0;
};
}, mixins.MANY_MERGED_LOOSE = function(left, right, key) {
return left && right ? mixins._mergeObjects(left, right) : left || right;
}, mixins.MANY_MERGED = function(left, right, key) {
return function() {
var res1 = right && right.apply(this, arguments), res2 = left && left.apply(this, arguments);
return res1 && res2 ? mixins._mergeObjects(res1, res2) : res2 || res1;
};
}, mixins.REDUCE_LEFT = function(_left, _right, key) {
var left = _left || returner, right = _right || returner;
return function() {
return right.call(this, left.apply(this, arguments));
};
}, mixins.REDUCE_RIGHT = function(_left, _right, key) {
var left = _left || returner, right = _right || returner;
return function() {
return left.call(this, right.apply(this, arguments));
};
};
}, , , , function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function constant(value) {
var frozen = (0, _freeze2.default)(value);
return function() {
return frozen;
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _freeze = __webpack_require__(308), _freeze2 = _interopRequireDefault(_freeze);
exports.default = constant;
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _ifElse = __webpack_require__(485), _ifElse2 = _interopRequireDefault(_ifElse), _curry = __webpack_require__(117), _curry2 = _interopRequireDefault(_curry);
exports.default = (0, _curry2.default)(function(predicate, trueUpdates, object) {
return (0, _ifElse2.default)(predicate, trueUpdates, function(x) {
return x;
}, object);
});
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
var _constant = __webpack_require__(1120), _constant2 = _interopRequireDefault(_constant), _freeze = __webpack_require__(308), _freeze2 = _interopRequireDefault(_freeze), _is = __webpack_require__(1123), _is2 = _interopRequireDefault(_is), _if2 = __webpack_require__(1121), _if3 = _interopRequireDefault(_if2), _ifElse = __webpack_require__(485), _ifElse2 = _interopRequireDefault(_ifElse), _map = __webpack_require__(486), _map2 = _interopRequireDefault(_map), _omit = __webpack_require__(1124), _omit2 = _interopRequireDefault(_omit), _omitBy = __webpack_require__(1125), _omitBy2 = _interopRequireDefault(_omitBy), _reject = __webpack_require__(1126), _reject2 = _interopRequireDefault(_reject), _update = __webpack_require__(147), _update2 = _interopRequireDefault(_update), _updateIn = __webpack_require__(1127), _updateIn2 = _interopRequireDefault(_updateIn), _withDefault = __webpack_require__(1128), _withDefault2 = _interopRequireDefault(_withDefault), _curry = __webpack_require__(117), u = _update2.default;
u._ = _curry._, u.constant = _constant2.default, u.if = _if3.default, u.ifElse = _ifElse2.default, 
u.is = _is2.default, u.freeze = _freeze2.default, u.map = _map2.default, u.omit = _omit2.default, 
u.omitBy = _omitBy2.default, u.reject = _reject2.default, u.update = _update2.default, 
u.updateIn = _updateIn2.default, u.withDefault = _withDefault2.default, module.exports = u;
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function is(path, predicate, object) {
for (var parts = (0, _splitPath2.default)(path), rest = object, i = 0; i < parts.length; ++i) {
if ("undefined" == typeof rest) return !1;
var part = parts[i];
rest = rest[part];
}
return "function" == typeof predicate ? predicate(rest) : predicate === rest;
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _splitPath = __webpack_require__(487), _splitPath2 = _interopRequireDefault(_splitPath), _curry = __webpack_require__(117), _curry2 = _interopRequireDefault(_curry);
exports.default = (0, _curry2.default)(is);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function omit(predicate, collection) {
return (0, _omit3.default)(collection, predicate);
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _omit2 = __webpack_require__(896), _omit3 = _interopRequireDefault(_omit2), _wrap = __webpack_require__(118), _wrap2 = _interopRequireDefault(_wrap);
exports.default = (0, _wrap2.default)(omit);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function omitBy(predicate, collection) {
return (0, _omitBy3.default)(collection, predicate);
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _omitBy2 = __webpack_require__(897), _omitBy3 = _interopRequireDefault(_omitBy2), _wrap = __webpack_require__(118), _wrap2 = _interopRequireDefault(_wrap);
exports.default = (0, _wrap2.default)(omitBy);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function reject(predicate, collection) {
var result = (0, _reject3.default)(collection, predicate), equal = collection.length === result.length;
return equal ? collection : result;
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _reject2 = __webpack_require__(393), _reject3 = _interopRequireDefault(_reject2), _wrap = __webpack_require__(118), _wrap2 = _interopRequireDefault(_wrap);
exports.default = (0, _wrap2.default)(reject);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function _defineProperty(obj, key, value) {
return key in obj ? Object.defineProperty(obj, key, {
value: value,
enumerable: !0,
configurable: !0,
writable: !0
}) : obj[key] = value, obj;
}
function reducePath(acc, key) {
return key === wildcard ? function(value) {
return Object.prototype.hasOwnProperty.call(value, wildcard) ? (0, _update3.default)(_defineProperty({}, wildcard, acc), value) : (0, 
_map2.default)(acc, value);
} : _defineProperty({}, key, acc);
}
function updateIn(path, value, object) {
var parts = (0, _splitPath2.default)(path), updates = parts.reduceRight(reducePath, value);
return (0, _update3.default)(updates, object);
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _curry = __webpack_require__(117), _curry2 = _interopRequireDefault(_curry), _update2 = __webpack_require__(147), _update3 = _interopRequireDefault(_update2), _map = __webpack_require__(486), _map2 = _interopRequireDefault(_map), _splitPath = __webpack_require__(487), _splitPath2 = _interopRequireDefault(_splitPath), wildcard = "*";
exports.default = (0, _curry2.default)(updateIn);
}, function(module, exports, __webpack_require__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
function withDefault(defaultValue, updates, object) {
return "undefined" == typeof object ? (0, _update2.default)(updates, defaultValue) : (0, 
_update2.default)(updates, object);
}
Object.defineProperty(exports, "__esModule", {
value: !0
});
var _update = __webpack_require__(147), _update2 = _interopRequireDefault(_update), _curry = __webpack_require__(117), _curry2 = _interopRequireDefault(_curry);
exports.default = (0, _curry2.default)(withDefault);
}, function(module, exports) {
"use strict";
module.exports = {
isString: function(arg) {
return "string" == typeof arg;
},
isObject: function(arg) {
return "object" == typeof arg && null !== arg;
},
isNull: function(arg) {
return null === arg;
},
isNullOrUndefined: function(arg) {
return null == arg;
}
};
}, function(module, exports, __webpack_require__) {
!function(global, factory) {
factory(exports);
}(this, function(exports) {
"use strict";
function isDataView(obj) {
return obj && DataView.prototype.isPrototypeOf(obj);
}
function normalizeName(name) {
if ("string" != typeof name && (name = String(name)), /[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) throw new TypeError("Invalid character in header field name");
return name.toLowerCase();
}
function normalizeValue(value) {
return "string" != typeof value && (value = String(value)), value;
}
function iteratorFor(items) {
var iterator = {
next: function() {
var value = items.shift();
return {
done: void 0 === value,
value: value
};
}
};
return support.iterable && (iterator[Symbol.iterator] = function() {
return iterator;
}), iterator;
}
function Headers(headers) {
this.map = {}, headers instanceof Headers ? headers.forEach(function(value, name) {
this.append(name, value);
}, this) : Array.isArray(headers) ? headers.forEach(function(header) {
this.append(header[0], header[1]);
}, this) : headers && Object.getOwnPropertyNames(headers).forEach(function(name) {
this.append(name, headers[name]);
}, this);
}
function consumed(body) {
return body.bodyUsed ? Promise.reject(new TypeError("Already read")) : void (body.bodyUsed = !0);
}
function fileReaderReady(reader) {
return new Promise(function(resolve, reject) {
reader.onload = function() {
resolve(reader.result);
}, reader.onerror = function() {
reject(reader.error);
};
});
}
function readBlobAsArrayBuffer(blob) {
var reader = new FileReader(), promise = fileReaderReady(reader);
return reader.readAsArrayBuffer(blob), promise;
}
function readBlobAsText(blob) {
var reader = new FileReader(), promise = fileReaderReady(reader);
return reader.readAsText(blob), promise;
}
function readArrayBufferAsText(buf) {
for (var view = new Uint8Array(buf), chars = new Array(view.length), i = 0; i < view.length; i++) chars[i] = String.fromCharCode(view[i]);
return chars.join("");
}
function bufferClone(buf) {
if (buf.slice) return buf.slice(0);
var view = new Uint8Array(buf.byteLength);
return view.set(new Uint8Array(buf)), view.buffer;
}
function Body() {
return this.bodyUsed = !1, this._initBody = function(body) {
this._bodyInit = body, body ? "string" == typeof body ? this._bodyText = body : support.blob && Blob.prototype.isPrototypeOf(body) ? this._bodyBlob = body : support.formData && FormData.prototype.isPrototypeOf(body) ? this._bodyFormData = body : support.searchParams && URLSearchParams.prototype.isPrototypeOf(body) ? this._bodyText = body.toString() : support.arrayBuffer && support.blob && isDataView(body) ? (this._bodyArrayBuffer = bufferClone(body.buffer), 
this._bodyInit = new Blob([ this._bodyArrayBuffer ])) : support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body)) ? this._bodyArrayBuffer = bufferClone(body) : this._bodyText = body = Object.prototype.toString.call(body) : this._bodyText = "", 
this.headers.get("content-type") || ("string" == typeof body ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : support.searchParams && URLSearchParams.prototype.isPrototypeOf(body) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
}, support.blob && (this.blob = function() {
var rejected = consumed(this);
if (rejected) return rejected;
if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
if (this._bodyArrayBuffer) return Promise.resolve(new Blob([ this._bodyArrayBuffer ]));
if (this._bodyFormData) throw new Error("could not read FormData body as blob");
return Promise.resolve(new Blob([ this._bodyText ]));
}, this.arrayBuffer = function() {
return this._bodyArrayBuffer ? consumed(this) || Promise.resolve(this._bodyArrayBuffer) : this.blob().then(readBlobAsArrayBuffer);
}), this.text = function() {
var rejected = consumed(this);
if (rejected) return rejected;
if (this._bodyBlob) return readBlobAsText(this._bodyBlob);
if (this._bodyArrayBuffer) return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
if (this._bodyFormData) throw new Error("could not read FormData body as text");
return Promise.resolve(this._bodyText);
}, support.formData && (this.formData = function() {
return this.text().then(decode);
}), this.json = function() {
return this.text().then(JSON.parse);
}, this;
}
function normalizeMethod(method) {
var upcased = method.toUpperCase();
return methods.indexOf(upcased) > -1 ? upcased : method;
}
function Request(input, options) {
options = options || {};
var body = options.body;
if (input instanceof Request) {
if (input.bodyUsed) throw new TypeError("Already read");
this.url = input.url, this.credentials = input.credentials, options.headers || (this.headers = new Headers(input.headers)), 
this.method = input.method, this.mode = input.mode, this.signal = input.signal, 
body || null == input._bodyInit || (body = input._bodyInit, input.bodyUsed = !0);
} else this.url = String(input);
if (this.credentials = options.credentials || this.credentials || "same-origin", 
!options.headers && this.headers || (this.headers = new Headers(options.headers)), 
this.method = normalizeMethod(options.method || this.method || "GET"), this.mode = options.mode || this.mode || null, 
this.signal = options.signal || this.signal, this.referrer = null, ("GET" === this.method || "HEAD" === this.method) && body) throw new TypeError("Body not allowed for GET or HEAD requests");
this._initBody(body);
}
function decode(body) {
var form = new FormData();
return body.trim().split("&").forEach(function(bytes) {
if (bytes) {
var split = bytes.split("="), name = split.shift().replace(/\+/g, " "), value = split.join("=").replace(/\+/g, " ");
form.append(decodeURIComponent(name), decodeURIComponent(value));
}
}), form;
}
function parseHeaders(rawHeaders) {
var headers = new Headers(), preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
return preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
var parts = line.split(":"), key = parts.shift().trim();
if (key) {
var value = parts.join(":").trim();
headers.append(key, value);
}
}), headers;
}
function Response(bodyInit, options) {
options || (options = {}), this.type = "default", this.status = void 0 === options.status ? 200 : options.status, 
this.ok = this.status >= 200 && this.status < 300, this.statusText = "statusText" in options ? options.statusText : "OK", 
this.headers = new Headers(options.headers), this.url = options.url || "", this._initBody(bodyInit);
}
function fetch(input, init) {
return new Promise(function(resolve, reject) {
function abortXhr() {
xhr.abort();
}
var request = new Request(input, init);
if (request.signal && request.signal.aborted) return reject(new exports.DOMException("Aborted", "AbortError"));
var xhr = new XMLHttpRequest();
xhr.onload = function() {
var options = {
status: xhr.status,
statusText: xhr.statusText,
headers: parseHeaders(xhr.getAllResponseHeaders() || "")
};
options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
var body = "response" in xhr ? xhr.response : xhr.responseText;
resolve(new Response(body, options));
}, xhr.onerror = function() {
reject(new TypeError("Network request failed"));
}, xhr.ontimeout = function() {
reject(new TypeError("Network request failed"));
}, xhr.onabort = function() {
reject(new exports.DOMException("Aborted", "AbortError"));
}, xhr.open(request.method, request.url, !0), "include" === request.credentials ? xhr.withCredentials = !0 : "omit" === request.credentials && (xhr.withCredentials = !1), 
"responseType" in xhr && support.blob && (xhr.responseType = "blob"), request.headers.forEach(function(value, name) {
xhr.setRequestHeader(name, value);
}), request.signal && (request.signal.addEventListener("abort", abortXhr), xhr.onreadystatechange = function() {
4 === xhr.readyState && request.signal.removeEventListener("abort", abortXhr);
}), xhr.send("undefined" == typeof request._bodyInit ? null : request._bodyInit);
});
}
var support = {
searchParams: "URLSearchParams" in self,
iterable: "Symbol" in self && "iterator" in Symbol,
blob: "FileReader" in self && "Blob" in self && function() {
try {
return new Blob(), !0;
} catch (e) {
return !1;
}
}(),
formData: "FormData" in self,
arrayBuffer: "ArrayBuffer" in self
};
if (support.arrayBuffer) var viewClasses = [ "[object Int8Array]", "[object Uint8Array]", "[object Uint8ClampedArray]", "[object Int16Array]", "[object Uint16Array]", "[object Int32Array]", "[object Uint32Array]", "[object Float32Array]", "[object Float64Array]" ], isArrayBufferView = ArrayBuffer.isView || function(obj) {
return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
};
Headers.prototype.append = function(name, value) {
name = normalizeName(name), value = normalizeValue(value);
var oldValue = this.map[name];
this.map[name] = oldValue ? oldValue + ", " + value : value;
}, Headers.prototype.delete = function(name) {
delete this.map[normalizeName(name)];
}, Headers.prototype.get = function(name) {
return name = normalizeName(name), this.has(name) ? this.map[name] : null;
}, Headers.prototype.has = function(name) {
return this.map.hasOwnProperty(normalizeName(name));
}, Headers.prototype.set = function(name, value) {
this.map[normalizeName(name)] = normalizeValue(value);
}, Headers.prototype.forEach = function(callback, thisArg) {
for (var name in this.map) this.map.hasOwnProperty(name) && callback.call(thisArg, this.map[name], name, this);
}, Headers.prototype.keys = function() {
var items = [];
return this.forEach(function(value, name) {
items.push(name);
}), iteratorFor(items);
}, Headers.prototype.values = function() {
var items = [];
return this.forEach(function(value) {
items.push(value);
}), iteratorFor(items);
}, Headers.prototype.entries = function() {
var items = [];
return this.forEach(function(value, name) {
items.push([ name, value ]);
}), iteratorFor(items);
}, support.iterable && (Headers.prototype[Symbol.iterator] = Headers.prototype.entries);
var methods = [ "DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT" ];
Request.prototype.clone = function() {
return new Request(this, {
body: this._bodyInit
});
}, Body.call(Request.prototype), Body.call(Response.prototype), Response.prototype.clone = function() {
return new Response(this._bodyInit, {
status: this.status,
statusText: this.statusText,
headers: new Headers(this.headers),
url: this.url
});
}, Response.error = function() {
var response = new Response(null, {
status: 0,
statusText: ""
});
return response.type = "error", response;
};
var redirectStatuses = [ 301, 302, 303, 307, 308 ];
Response.redirect = function(url, status) {
if (redirectStatuses.indexOf(status) === -1) throw new RangeError("Invalid status code");
return new Response(null, {
status: status,
headers: {
location: url
}
});
}, exports.DOMException = self.DOMException;
try {
new exports.DOMException();
} catch (err) {
exports.DOMException = function(message, name) {
this.message = message, this.name = name;
var error = Error(message);
this.stack = error.stack;
}, exports.DOMException.prototype = Object.create(Error.prototype), exports.DOMException.prototype.constructor = exports.DOMException;
}
fetch.polyfill = !0, self.fetch || (self.fetch = fetch, self.Headers = Headers, 
self.Request = Request, self.Response = Response), exports.Headers = Headers, exports.Request = Request, 
exports.Response = Response, exports.fetch = fetch, Object.defineProperty(exports, "__esModule", {
value: !0
});
});
}, , 1131, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
module.exports = {
"default": __webpack_require__(__webpack_module_template_argument_0__),
__esModule: !0
};
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
module.exports = {
"default": __webpack_require__(__webpack_module_template_argument_0__),
__esModule: !0
};
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
module.exports = {
"default": __webpack_require__(__webpack_module_template_argument_0__),
__esModule: !0
};
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
module.exports = {
"default": __webpack_require__(__webpack_module_template_argument_0__),
__esModule: !0
};
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
module.exports = {
"default": __webpack_require__(__webpack_module_template_argument_0__),
__esModule: !0
};
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
module.exports = {
"default": __webpack_require__(__webpack_module_template_argument_0__),
__esModule: !0
};
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
exports.__esModule = !0;
var _defineProperty = __webpack_require__(__webpack_module_template_argument_0__), _defineProperty2 = _interopRequireDefault(_defineProperty);
exports.default = function() {
function defineProperties(target, props) {
for (var i = 0; i < props.length; i++) {
var descriptor = props[i];
descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
"value" in descriptor && (descriptor.writable = !0), (0, _defineProperty2.default)(target, descriptor.key, descriptor);
}
}
return function(Constructor, protoProps, staticProps) {
return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), 
Constructor;
};
}();
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
exports.__esModule = !0;
var _setPrototypeOf = __webpack_require__(__webpack_module_template_argument_0__), _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf), _create = __webpack_require__(__webpack_module_template_argument_1__), _create2 = _interopRequireDefault(_create), _typeof2 = __webpack_require__(__webpack_module_template_argument_2__), _typeof3 = _interopRequireDefault(_typeof2);
exports.default = function(subClass, superClass) {
if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + ("undefined" == typeof superClass ? "undefined" : (0, 
_typeof3.default)(superClass)));
subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
constructor: {
value: subClass,
enumerable: !1,
writable: !0,
configurable: !0
}
}), superClass && (_setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass);
};
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
"use strict";
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
exports.__esModule = !0;
var _typeof2 = __webpack_require__(__webpack_module_template_argument_0__), _typeof3 = _interopRequireDefault(_typeof2);
exports.default = function(self, call) {
if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !call || "object" !== ("undefined" == typeof call ? "undefined" : (0, _typeof3.default)(call)) && "function" != typeof call ? self : call;
};
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {
__webpack_require__(__webpack_module_template_argument_0__);
var $Object = __webpack_require__(__webpack_module_template_argument_1__).Object;
module.exports = function create(P, D) {
return $Object.create(P, D);
};
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {
__webpack_require__(__webpack_module_template_argument_0__);
var $Object = __webpack_require__(__webpack_module_template_argument_1__).Object;
module.exports = function defineProperty(it, key, desc) {
return $Object.defineProperty(it, key, desc);
};
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {
__webpack_require__(__webpack_module_template_argument_0__), module.exports = __webpack_require__(__webpack_module_template_argument_1__).Object.getPrototypeOf;
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {
__webpack_require__(__webpack_module_template_argument_0__), module.exports = __webpack_require__(__webpack_module_template_argument_1__).Object.setPrototypeOf;
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__, __webpack_module_template_argument_3__, __webpack_module_template_argument_4__) {
__webpack_require__(__webpack_module_template_argument_0__), __webpack_require__(__webpack_module_template_argument_1__), 
__webpack_require__(__webpack_module_template_argument_2__), __webpack_require__(__webpack_module_template_argument_3__), 
module.exports = __webpack_require__(__webpack_module_template_argument_4__).Symbol;
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__) {
__webpack_require__(__webpack_module_template_argument_0__), __webpack_require__(__webpack_module_template_argument_1__), 
module.exports = __webpack_require__(__webpack_module_template_argument_2__).f("iterator");
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__, __webpack_module_template_argument_3__, __webpack_module_template_argument_4__) {
var global = __webpack_require__(__webpack_module_template_argument_0__), core = __webpack_require__(__webpack_module_template_argument_1__), ctx = __webpack_require__(__webpack_module_template_argument_2__), hide = __webpack_require__(__webpack_module_template_argument_3__), has = __webpack_require__(__webpack_module_template_argument_4__), PROTOTYPE = "prototype", $export = function(type, name, source) {
var key, own, out, IS_FORCED = type & $export.F, IS_GLOBAL = type & $export.G, IS_STATIC = type & $export.S, IS_PROTO = type & $export.P, IS_BIND = type & $export.B, IS_WRAP = type & $export.W, exports = IS_GLOBAL ? core : core[name] || (core[name] = {}), expProto = exports[PROTOTYPE], target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
IS_GLOBAL && (source = name);
for (key in source) own = !IS_FORCED && target && void 0 !== target[key], own && has(exports, key) || (out = own ? target[key] : source[key], 
exports[key] = IS_GLOBAL && "function" != typeof target[key] ? source[key] : IS_BIND && own ? ctx(out, global) : IS_WRAP && target[key] == out ? function(C) {
var F = function(a, b, c) {
if (this instanceof C) {
switch (arguments.length) {
case 0:
return new C();

case 1:
return new C(a);

case 2:
return new C(a, b);
}
return new C(a, b, c);
}
return C.apply(this, arguments);
};
return F[PROTOTYPE] = C[PROTOTYPE], F;
}(out) : IS_PROTO && "function" == typeof out ? ctx(Function.call, out) : out, IS_PROTO && ((exports.virtual || (exports.virtual = {}))[key] = out, 
type & $export.R && expProto && !expProto[key] && hide(expProto, key, out)));
};
$export.F = 1, $export.G = 2, $export.S = 4, $export.P = 8, $export.B = 16, $export.W = 32, 
$export.U = 64, $export.R = 128, module.exports = $export;
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
module.exports = __webpack_require__(__webpack_module_template_argument_0__);
}, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__, __webpack_module_template_argument_3__, __webpack_module_template_argument_4__) {
__webpack_require__(__webpack_module_template_argument_0__);
for (var global = __webpack_require__(__webpack_module_template_argument_1__), hide = __webpack_require__(__webpack_module_template_argument_2__), Iterators = __webpack_require__(__webpack_module_template_argument_3__), TO_STRING_TAG = __webpack_require__(__webpack_module_template_argument_4__)("toStringTag"), DOMIterables = "CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","), i = 0; i < DOMIterables.length; i++) {
var NAME = DOMIterables[i], Collection = global[NAME], proto = Collection && Collection.prototype;
proto && !proto[TO_STRING_TAG] && hide(proto, TO_STRING_TAG, NAME), Iterators[NAME] = Iterators.Array;
}
} ]);
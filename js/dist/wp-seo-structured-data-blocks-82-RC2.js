yoastWebpackJsonp([10],{

/***/ 10:
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ 102:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(13);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ 103:
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ 114:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(248);
var invariant = __webpack_require__(264);
var ReactPropTypesSecret = __webpack_require__(115);

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
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
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ 115:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(13),
    getRawTag = __webpack_require__(102),
    objectToString = __webpack_require__(103);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(6);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ 1431:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _block = __webpack_require__(1432);

var _block2 = _interopRequireDefault(_block);

var _block3 = __webpack_require__(1436);

var _block4 = _interopRequireDefault(_block3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _block2.default)();
(0, _block4.default)();

/***/ }),

/***/ 1432:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _i18n = __webpack_require__(8);

var _HowTo = __webpack_require__(1433);

var _HowTo2 = _interopRequireDefault(_HowTo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* External dependencies */
var registerBlockType = window.wp.blocks.registerBlockType;

/* Internal dependencies */

var attributes = {
	title: {
		type: "array",
		source: "children",
		selector: ".schema-how-to-title"
	},
	jsonTitle: {
		type: "string"
	},
	hasDuration: {
		type: "boolean"
	},
	days: {
		type: "number"
	},
	hours: {
		type: "number"
	},
	minutes: {
		type: "number"
	},
	description: {
		type: "array",
		source: "children",
		selector: ".schema-how-to-description"
	},
	jsonDescription: {
		type: "string"
	},
	steps: {
		type: "array"
	},
	additionalListCssClasses: {
		type: "string"
	},
	unorderedList: {
		type: "boolean"
	},
	headingID: {
		type: "string"
	}
};

exports.default = function () {
	registerBlockType("yoast/how-to-block", {
		title: (0, _i18n.__)("How-to", "wordpress-seo"),
		description: (0, _i18n.__)("Create a How-to guide in an SEO-friendly way. You can only use one How-to block per post.", "wordpress-seo"),
		icon: "editor-ol",
		category: "yoast-structured-data-blocks",
		keywords: [(0, _i18n.__)("How-to", "wordpress-seo"), (0, _i18n.__)("How to", "wordpress-seo")],
		// Allow only one How-To block per post.
		supports: {
			multiple: false
		},
		// Block attributes - decides what to save and how to parse it from and to HTML.
		attributes: attributes,

		/**
   * The edit function describes the structure of your block in the context of the editor.
   * This represents what the editor will render when the block is used.
   *
   * The "edit" property must be a valid function.
   *
   * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
   * @returns {Component} The editor component.
   */
		edit: function edit(_ref) {
			var attributes = _ref.attributes,
			    setAttributes = _ref.setAttributes,
			    className = _ref.className;

			// Because setAttributes is quite slow right after a block has been added we fake having a single step.
			if (!attributes.steps || attributes.steps.length === 0) {
				attributes.steps = [{ id: _HowTo2.default.generateId("how-to-step"), name: [], text: [] }];
			}

			return yoast._wp.element.createElement(_HowTo2.default, { attributes: attributes, setAttributes: setAttributes, className: className });
		},

		/**
   * The save function defines the way in which the different attributes should be combined
   * into the final markup, which is then serialized by Gutenberg into post_content.
   *
   * The "save" property must be specified and must be a valid function.
   *
   * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
   * @returns {Component} The display component.
   */
		// eslint-disable-next-line react/display-name
		save: function save(_ref2) {
			var attributes = _ref2.attributes;

			return yoast._wp.element.createElement(_HowTo2.default.Content, attributes);
		}
	});
};

/***/ }),

/***/ 1433:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _HowToStep = __webpack_require__(1434);

var _HowToStep2 = _interopRequireDefault(_HowToStep);

var _isUndefined = __webpack_require__(15);

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _styledComponents = __webpack_require__(5);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _i18n = __webpack_require__(8);

var _toString = __webpack_require__(84);

var _toString2 = _interopRequireDefault(_toString);

var _stringHelpers = __webpack_require__(346);

var _buildDurationString = __webpack_require__(1435);

var _buildDurationString2 = _interopRequireDefault(_buildDurationString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* External dependencies */


/* Internal dependencies */


var _window$wp$editor = window.wp.editor,
    RichText = _window$wp$editor.RichText,
    InspectorControls = _window$wp$editor.InspectorControls;
var _window$wp$components = window.wp.components,
    IconButton = _window$wp$components.IconButton,
    PanelBody = _window$wp$components.PanelBody,
    TextControl = _window$wp$components.TextControl,
    ToggleControl = _window$wp$components.ToggleControl;
var _window$wp$element = window.wp.element,
    Component = _window$wp$element.Component,
    renderToString = _window$wp$element.renderToString;

/**
 * Modified Text Control to provide a better layout experience.
 *
 * @returns {ReactElement} The TextControl with additional spacing below.
 */

var SpacedTextControl = (0, _styledComponents2.default)(TextControl).withConfig({
	displayName: "HowTo__SpacedTextControl"
})(["&&&{margin-bottom:32px;}"]);

/**
 * A How-to block component.
 */

var HowTo = function (_Component) {
	_inherits(HowTo, _Component);

	/**
  * Constructs a HowTo editor component.
  *
  * @param {Object} props This component's properties.
  *
  * @returns {void}
  */
	function HowTo(props) {
		_classCallCheck(this, HowTo);

		var _this = _possibleConstructorReturn(this, (HowTo.__proto__ || Object.getPrototypeOf(HowTo)).call(this, props));

		_this.state = { focus: "" };

		_this.changeStep = _this.changeStep.bind(_this);
		_this.insertStep = _this.insertStep.bind(_this);
		_this.removeStep = _this.removeStep.bind(_this);
		_this.swapSteps = _this.swapSteps.bind(_this);
		_this.setFocus = _this.setFocus.bind(_this);
		_this.addCSSClasses = _this.addCSSClasses.bind(_this);
		_this.getListTypeHelp = _this.getListTypeHelp.bind(_this);
		_this.toggleListType = _this.toggleListType.bind(_this);
		_this.updateHeadingID = _this.updateHeadingID.bind(_this);

		_this.editorRefs = {};
		return _this;
	}

	/**
  * Generates a pseudo-unique id.
  *
  * @param {string} [prefix] The prefix to use.
  *
  * @returns {string} A pseudo-unique string, consisting of the optional prefix + the curent time in milliseconds.
  */


	_createClass(HowTo, [{
		key: "changeStep",


		/**
   * Replaces the How-to step with the given index.
   *
   * @param {array}  newName      The new step-name.
   * @param {array}  newText      The new step-text.
   * @param {array}  previousName The previous step-name.
   * @param {array}  previousText The previous step-text.
   * @param {number} index        The index of the step that needs to be changed.
   *
   * @returns {void}
   */
		value: function changeStep(newName, newText, previousName, previousText, index) {
			var steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];

			// If the index exceeds the number of steps, don't change anything.
			if (index >= steps.length) {
				return;
			}

			/*
    * Because the DOM re-uses input elements, the changeStep function was triggered when removing/inserting/swapping
    * input elements. We need to check for such events, and return early if the changeStep was called without any
    * user changes to the input field, but because the underlying input elements moved around in the DOM.
    *
    * In essence, when the name at the current index does not match the name that was in the input field previously,
    * the changeStep was triggered by input fields moving in the DOM.
    */
			if (steps[index].name !== previousName || steps[index].text !== previousText) {
				return;
			}

			// Rebuild the step with the newly made changes.
			steps[index] = {
				id: steps[index].id,
				name: newName,
				text: newText,
				jsonName: (0, _stringHelpers.stripHTML)(renderToString(newName)),
				jsonText: (0, _stringHelpers.stripHTML)(renderToString(newText))
			};

			var imageSrc = _HowToStep2.default.getImageSrc(newText);

			if (imageSrc) {
				steps[index].jsonImageSrc = imageSrc;
			}

			this.props.setAttributes({ steps: steps });
		}

		/**
   * Inserts an empty step into a how-to block at the given index.
   *
   * @param {number} [index]      The index of the step after which a new step should be added.
   * @param {string} [name]       The name of the new step.
   * @param {string} [text]       The text of the new step.
   * @param {bool}   [focus=true] Whether or not to focus the new step.
   *
   * @returns {void}
   */

	}, {
		key: "insertStep",
		value: function insertStep(index) {
			var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
			var text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
			var focus = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

			var steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];

			if ((0, _isUndefined2.default)(index)) {
				index = steps.length - 1;
			}

			var lastIndex = steps.length - 1;
			while (lastIndex > index) {
				this.editorRefs[lastIndex + 1 + ":name"] = this.editorRefs[lastIndex + ":name"];
				this.editorRefs[lastIndex + 1 + ":text"] = this.editorRefs[lastIndex + ":text"];
				lastIndex--;
			}

			steps.splice(index + 1, 0, {
				id: HowTo.generateId("how-to-step"),
				name: name,
				text: text,
				jsonName: "",
				jsonText: ""
			});

			this.props.setAttributes({ steps: steps });

			if (focus) {
				setTimeout(this.setFocus.bind(this, index + 1 + ":name"));
			}
		}

		/**
   * Swaps two steps in the how-to block.
   *
   * @param {number} index1 The index of the first block.
   * @param {number} index2 The index of the second block.
   *
   * @returns {void}
   */

	}, {
		key: "swapSteps",
		value: function swapSteps(index1, index2) {
			var steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];
			var step = steps[index1];

			steps[index1] = steps[index2];
			steps[index2] = step;

			var NameEditorRef = this.editorRefs[index1 + ":name"];
			this.editorRefs[index1 + ":name"] = this.editorRefs[index2 + ":name"];
			this.editorRefs[index2 + ":name"] = NameEditorRef;

			var TextEditorRef = this.editorRefs[index1 + ":text"];
			this.editorRefs[index1 + ":text"] = this.editorRefs[index2 + ":text"];
			this.editorRefs[index2 + ":text"] = TextEditorRef;

			this.props.setAttributes({ steps: steps });

			var _state$focus$split = this.state.focus.split(":"),
			    _state$focus$split2 = _slicedToArray(_state$focus$split, 2),
			    focusIndex = _state$focus$split2[0],
			    subElement = _state$focus$split2[1];

			if (focusIndex === "" + index1) {
				this.setFocus(index2 + ":" + subElement);
			}

			if (focusIndex === "" + index2) {
				this.setFocus(index1 + ":" + subElement);
			}
		}

		/**
   * Removes a step from a how-to block.
   *
   * @param {number} index The index of the step that needs to be removed.
   *
   * @returns {void}
   */

	}, {
		key: "removeStep",
		value: function removeStep(index) {
			var steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];

			steps.splice(index, 1);
			this.props.setAttributes({ steps: steps });

			delete this.editorRefs[index + ":name"];
			delete this.editorRefs[index + ":text"];

			var nextIndex = index + 1;
			while (this.editorRefs[nextIndex + ":name"] || this.editorRefs[nextIndex + ":text"]) {
				this.editorRefs[nextIndex - 1 + ":name"] = this.editorRefs[nextIndex + ":name"];
				this.editorRefs[nextIndex - 1 + ":text"] = this.editorRefs[nextIndex + ":text"];
				nextIndex++;
			}

			var indexToRemove = steps.length;
			delete this.editorRefs[indexToRemove + ":name"];
			delete this.editorRefs[indexToRemove + ":text"];

			var fieldToFocus = "description";
			if (this.editorRefs[index + ":name"]) {
				fieldToFocus = index + ":name";
			} else if (this.editorRefs[index - 1 + ":text"]) {
				fieldToFocus = index - 1 + ":text";
			}

			this.setFocus(fieldToFocus);
		}

		/**
   * Sets the focus to a specific step in the How-to block.
   *
   * @param {number|string} elementToFocus The element to focus, either the index of the step that should be in focus or name of the input.
   *
   * @returns {void}
   */

	}, {
		key: "setFocus",
		value: function setFocus(elementToFocus) {
			if (elementToFocus === this.state.focus) {
				return;
			}

			this.setState({ focus: elementToFocus });

			if (this.editorRefs[elementToFocus]) {
				this.editorRefs[elementToFocus].focus();
			}
		}

		/**
   * Returns an array of How-to step components to be rendered on screen.
   *
   * @returns {Component[]} The step components.
   */

	}, {
		key: "getSteps",
		value: function getSteps() {
			var _this2 = this;

			if (!this.props.attributes.steps) {
				return null;
			}

			var _state$focus$split3 = this.state.focus.split(":"),
			    _state$focus$split4 = _slicedToArray(_state$focus$split3, 2),
			    focusIndex = _state$focus$split4[0],
			    subElement = _state$focus$split4[1];

			return this.props.attributes.steps.map(function (step, index) {
				return yoast._wp.element.createElement(_HowToStep2.default, {
					key: step.id,
					step: step,
					index: index,
					editorRef: function editorRef(part, ref) {
						_this2.editorRefs[index + ":" + part] = ref;
					},
					onChange: function onChange(newName, newText, previousName, previousText) {
						return _this2.changeStep(newName, newText, previousName, previousText, index);
					},
					insertStep: function insertStep() {
						return _this2.insertStep(index);
					},
					removeStep: function removeStep() {
						return _this2.removeStep(index);
					},
					onFocus: function onFocus(elementToFocus) {
						return _this2.setFocus(index + ":" + elementToFocus);
					},
					subElement: subElement,
					onMoveUp: function onMoveUp() {
						return _this2.swapSteps(index, index - 1);
					},
					onMoveDown: function onMoveDown() {
						return _this2.swapSteps(index, index + 1);
					},
					isFirst: index === 0,
					isLast: index === _this2.props.attributes.steps.length - 1,
					isSelected: focusIndex === "" + index,
					isUnorderedList: _this2.props.attributes.unorderedList
				});
			});
		}

		/**
   * Formats the time in the input fields by removing leading zeros.
   *
   * @param {number} duration    The duration as entered by the user.
   * @param {number} maxDuration Optional. The max duration a field can have.
   *
   * @returns {number} The formatted duration.
   */

	}, {
		key: "formatDuration",
		value: function formatDuration(duration) {
			var maxDuration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (duration === "") {
				return "";
			}

			var newDuration = duration.replace(/^[0]+/, "");
			if (newDuration === "") {
				return 0;
			}

			if (maxDuration !== null) {
				return Math.min(Math.max(0, parseInt(newDuration, 10)), maxDuration);
			}

			return Math.max(0, parseInt(newDuration, 10));
		}

		/**
   * Returns a component to manage this how-to block's duration.
   *
   * @returns {Component} The duration editor component.
   */

	}, {
		key: "getDuration",
		value: function getDuration() {
			var _this3 = this;

			var _props = this.props,
			    attributes = _props.attributes,
			    setAttributes = _props.setAttributes;


			if (!attributes.hasDuration) {
				return yoast._wp.element.createElement(
					IconButton,
					{
						icon: "insert",
						onClick: function onClick() {
							return setAttributes({ hasDuration: true });
						},
						className: "schema-how-to-duration-button editor-inserter__toggle"
					},
					(0, _i18n.__)("Add total time", "wordpress-seo")
				);
			}

			return yoast._wp.element.createElement(
				"fieldset",
				{ className: "schema-how-to-duration" },
				yoast._wp.element.createElement(
					"legend",
					{
						className: "schema-how-to-duration-legend"
					},
					(0, _i18n.__)("Time needed:", "wordpress-seo")
				),
				yoast._wp.element.createElement(
					"label",
					{
						htmlFor: "schema-how-to-duration-days",
						className: "screen-reader-text"
					},
					(0, _i18n.__)("days", "wordpress-seo")
				),
				yoast._wp.element.createElement("input", {
					id: "schema-how-to-duration-days",
					className: "schema-how-to-duration-input",
					type: "number",
					value: attributes.days,
					onFocus: function onFocus() {
						return _this3.setFocus("days");
					},
					onChange: function onChange(event) {
						var newValue = _this3.formatDuration(event.target.value);
						setAttributes({ days: (0, _toString2.default)(newValue) });
					},
					placeholder: "DD"
				}),
				yoast._wp.element.createElement(
					"label",
					{
						htmlFor: "schema-how-to-duration-hours",
						className: "screen-reader-text"
					},
					(0, _i18n.__)("hours", "wordpress-seo")
				),
				yoast._wp.element.createElement("input", {
					id: "schema-how-to-duration-hours",
					className: "schema-how-to-duration-input",
					type: "number",
					value: attributes.hours,
					onFocus: function onFocus() {
						return _this3.setFocus("hours");
					},
					placeholder: "HH",
					onChange: function onChange(event) {
						var newValue = _this3.formatDuration(event.target.value, 23);
						setAttributes({ hours: (0, _toString2.default)(newValue) });
					}
				}),
				yoast._wp.element.createElement(
					"span",
					{ "aria-hidden": "true" },
					":"
				),
				yoast._wp.element.createElement(
					"label",
					{
						htmlFor: "schema-how-to-duration-minutes",
						className: "screen-reader-text"
					},
					(0, _i18n.__)("minutes", "wordpress-seo")
				),
				yoast._wp.element.createElement("input", {
					id: "schema-how-to-duration-minutes",
					className: "schema-how-to-duration-input",
					type: "number",
					value: attributes.minutes,
					onFocus: function onFocus() {
						return _this3.setFocus("minutes");
					},
					onChange: function onChange(event) {
						var newValue = _this3.formatDuration(event.target.value, 59);
						setAttributes({ minutes: (0, _toString2.default)(newValue) });
					},
					placeholder: "MM"
				}),
				yoast._wp.element.createElement(IconButton, {
					className: "schema-how-to-duration-button editor-inserter__toggle",
					icon: "trash",
					label: (0, _i18n.__)("Delete total time", "wordpress-seo"),
					onClick: function onClick() {
						return setAttributes({ hasDuration: false });
					}
				})
			);
		}

		/**
   * Returns the component to be used to render
   * the How-to block on Wordpress (e.g. not in the editor).
   *
   * @param {object} props the attributes of the How-to block.
   *
   * @returns {Component} The component representing a How-to block.
   */

	}, {
		key: "getAddStepButton",


		/**
   * A button to add a step to the front of the list.
   *
   * @returns {Component} a button to add a step
   */
		value: function getAddStepButton() {
			var _this4 = this;

			return yoast._wp.element.createElement(
				IconButton,
				{
					icon: "insert",
					onClick: function onClick() {
						return _this4.insertStep();
					},
					className: "editor-inserter__toggle"
				},
				(0, _i18n.__)("Add step", "wordpress-seo")
			);
		}

		/**
   * Adds CSS classes to this how-to block"s list.
   *
   * @param {string} value The additional css classes.
   *
   * @returns {void}
   */

	}, {
		key: "addCSSClasses",
		value: function addCSSClasses(value) {
			this.props.setAttributes({ additionalListCssClasses: value });
		}

		/**
   * Toggles the list type of this how-to block.
   *
   * @param {boolean} checked Whether or not the list is unordered.
   *
   * @returns {void}
   */

	}, {
		key: "toggleListType",
		value: function toggleListType(checked) {
			this.props.setAttributes({ unorderedList: checked });
		}

		/**
   * Changes the heading's ID.
   *
   * @param {string} headingID The header's new ID.
   *
   * @returns {void}
   */

	}, {
		key: "updateHeadingID",
		value: function updateHeadingID(headingID) {
			this.props.setAttributes({ headingID: headingID });
		}

		/**
   * Returns the help text for this how-to block"s list type.
   *
   * @param {boolean} checked Whether or not the list is unordered.
   *
   * @returns {string} The list type help string.
   */

	}, {
		key: "getListTypeHelp",
		value: function getListTypeHelp(checked) {
			return checked ? (0, _i18n.__)("Showing step items as an unordered list", "wordpress-seo") : (0, _i18n.__)("Showing step items as an ordered list.", "wordpress-seo");
		}

		/**
   * Adds controls to the editor sidebar to control the given parameters.
   *
   * @param {boolean} unorderedList     Whether to show the list as an unordered list.
   * @param {string}  additionalClasses The additional CSS classes to add to the list.
   * @param {string}  headingID         The heading's ID.
   *
   * @returns {Component} The controls to add to the sidebar.
   */

	}, {
		key: "getSidebar",
		value: function getSidebar(unorderedList, additionalClasses, headingID) {
			return yoast._wp.element.createElement(
				InspectorControls,
				null,
				yoast._wp.element.createElement(
					PanelBody,
					{ title: (0, _i18n.__)("Settings", "wordpress-seo"), className: "blocks-font-size" },
					yoast._wp.element.createElement(SpacedTextControl, {
						label: (0, _i18n.__)("HTML ID to apply to the title", "wordpress-seo"),
						value: headingID,
						onChange: this.updateHeadingID,
						help: (0, _i18n.__)("Optional. This can give you better control over the styling of the heading.", "wordpress-seo")
					}),
					yoast._wp.element.createElement(SpacedTextControl, {
						label: (0, _i18n.__)("CSS class(es) to apply to the steps", "wordpress-seo"),
						value: additionalClasses,
						onChange: this.addCSSClasses,
						help: (0, _i18n.__)("Optional. This can give you better control over the styling of the steps.", "wordpress-seo")
					}),
					yoast._wp.element.createElement(ToggleControl, {
						label: (0, _i18n.__)("Unordered list", "wordpress-seo"),
						checked: unorderedList,
						onChange: this.toggleListType,
						help: this.getListTypeHelp
					})
				)
			);
		}

		/**
   * Renders this component.
   *
   * @returns {Component} The how-to block editor.
   */

	}, {
		key: "render",
		value: function render() {
			var _this5 = this;

			var _props2 = this.props,
			    attributes = _props2.attributes,
			    setAttributes = _props2.setAttributes,
			    className = _props2.className;


			var classNames = ["schema-how-to", className].filter(function (item) {
				return item;
			}).join(" ");
			var listClassNames = ["schema-how-to-steps", attributes.additionalListCssClasses].filter(function (item) {
				return item;
			}).join(" ");

			return yoast._wp.element.createElement(
				"div",
				{ className: classNames },
				yoast._wp.element.createElement(RichText, {
					tagName: "strong",
					id: attributes.headingID,
					className: "schema-how-to-title",
					value: attributes.title,
					isSelected: this.state.focus === "title",
					setFocusedElement: function setFocusedElement() {
						return _this5.setFocus("title");
					},
					onChange: function onChange(title) {
						return setAttributes({ title: title, jsonTitle: (0, _stringHelpers.stripHTML)(renderToString(title)) });
					},
					onSetup: function onSetup(ref) {
						_this5.editorRefs.title = ref;
					},
					placeholder: (0, _i18n.__)("Enter a title for your instructions", "wordpress-seo"),
					keepPlaceholderOnFocus: true
				}),
				this.getDuration(),
				yoast._wp.element.createElement(RichText, {
					tagName: "p",
					className: "schema-how-to-description",
					value: attributes.description,
					isSelected: this.state.focus === "description",
					setFocusedElement: function setFocusedElement() {
						return _this5.setFocus("description");
					},
					onChange: function onChange(description) {
						return setAttributes({ description: description, jsonDescription: (0, _stringHelpers.stripHTML)(renderToString(description)) });
					},
					onSetup: function onSetup(ref) {
						_this5.editorRefs.description = ref;
					},
					placeholder: (0, _i18n.__)("Enter a description", "wordpress-seo"),
					keepPlaceholderOnFocus: true
				}),
				yoast._wp.element.createElement(
					"ul",
					{ className: listClassNames },
					this.getSteps()
				),
				yoast._wp.element.createElement(
					"div",
					{ className: "schema-how-to-buttons" },
					this.getAddStepButton()
				),
				this.getSidebar(attributes.unorderedList, attributes.additionalListCssClasses, attributes.headingID)
			);
		}
	}], [{
		key: "generateId",
		value: function generateId(prefix) {
			return prefix + "-" + new Date().getTime();
		}
	}, {
		key: "Content",
		value: function Content(props) {
			var steps = props.steps,
			    title = props.title,
			    hasDuration = props.hasDuration,
			    days = props.days,
			    hours = props.hours,
			    minutes = props.minutes,
			    description = props.description,
			    unorderedList = props.unorderedList,
			    additionalListCssClasses = props.additionalListCssClasses,
			    className = props.className,
			    headingID = props.headingID;


			steps = steps ? steps.map(function (step) {
				return yoast._wp.element.createElement(_HowToStep2.default.Content, _extends({}, step, {
					key: step.id
				}));
			}) : null;

			var classNames = ["schema-how-to", className].filter(function (item) {
				return item;
			}).join(" ");
			var listClassNames = ["schema-how-to-steps", additionalListCssClasses].filter(function (item) {
				return item;
			}).join(" ");
			var contentHeadingID = headingID ? headingID : (0, _stringHelpers.stripHTML)(renderToString(title)).toLowerCase();

			var timeString = (0, _buildDurationString2.default)({ days: days, hours: hours, minutes: minutes });

			return yoast._wp.element.createElement(
				"div",
				{ className: classNames },
				yoast._wp.element.createElement(RichText.Content, {
					tagName: "strong",
					className: "schema-how-to-title",
					value: title,
					id: contentHeadingID.replace(/\s+/g, "-")
				}),
				hasDuration && typeof timeString === "string" && timeString.length > 0 && yoast._wp.element.createElement(
					"p",
					{ className: "schema-how-to-total-time" },
					(0, _i18n.__)("Time needed:", "wordpress-seo"),
					"\xA0",
					timeString,
					"."
				),
				yoast._wp.element.createElement(RichText.Content, {
					tagName: "p",
					className: "schema-how-to-description",
					value: description
				}),
				unorderedList ? yoast._wp.element.createElement(
					"ul",
					{ className: listClassNames },
					steps
				) : yoast._wp.element.createElement(
					"ol",
					{ className: listClassNames },
					steps
				)
			);
		}
	}]);

	return HowTo;
}(Component);

exports.default = HowTo;


HowTo.propTypes = {
	attributes: _propTypes2.default.object.isRequired,
	setAttributes: _propTypes2.default.func.isRequired,
	className: _propTypes2.default.string
};

/***/ }),

/***/ 1434:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _i18n = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* External dependencies */


var Component = window.wp.element.Component;
var IconButton = window.wp.components.IconButton;
var _window$wp$editor = window.wp.editor,
    RichText = _window$wp$editor.RichText,
    MediaUpload = _window$wp$editor.MediaUpload;

/**
 * A How-to step within a How-to block.
 */

var HowToStep = function (_Component) {
	_inherits(HowToStep, _Component);

	/**
  * Constructs a HowToStep editor component.
  *
  * @param {Object} props This component's properties.
  *
  * @returns {void}
  */
	function HowToStep(props) {
		_classCallCheck(this, HowToStep);

		var _this = _possibleConstructorReturn(this, (HowToStep.__proto__ || Object.getPrototypeOf(HowToStep)).call(this, props));

		_this.onSelectImage = _this.onSelectImage.bind(_this);
		return _this;
	}

	/**
  * The insert and remove step buttons.
  *
  * @returns {Component} The buttons.
  */


	_createClass(HowToStep, [{
		key: "getButtons",
		value: function getButtons() {
			var _props = this.props,
			    step = _props.step,
			    removeStep = _props.removeStep,
			    insertStep = _props.insertStep;


			return yoast._wp.element.createElement(
				"div",
				{ className: "schema-how-to-step-button-container" },
				!HowToStep.getImageSrc(step.text) && yoast._wp.element.createElement(MediaUpload, {
					onSelect: this.onSelectImage,
					type: "image",
					value: step.id,
					render: function render(_ref) {
						var open = _ref.open;
						return yoast._wp.element.createElement(
							IconButton,
							{
								className: "schema-how-to-step-button editor-inserter__toggle how-to-step-add-media",
								icon: "insert",
								onClick: open
							},
							(0, _i18n.__)("Add image", "wordpress-seo")
						);
					}
				}),
				yoast._wp.element.createElement(IconButton, {
					className: "schema-how-to-step-button editor-inserter__toggle",
					icon: "trash",
					label: (0, _i18n.__)("Delete step", "wordpress-seo"),
					onClick: removeStep
				}),
				yoast._wp.element.createElement(IconButton, {
					className: "schema-how-to-step-button editor-inserter__toggle",
					icon: "insert",
					label: (0, _i18n.__)("Insert step", "wordpress-seo"),
					onClick: insertStep
				})
			);
		}

		/**
   * The mover buttons.
   *
   * @returns {Component} the buttons.
   */

	}, {
		key: "getMover",
		value: function getMover() {
			return yoast._wp.element.createElement(
				"div",
				{ className: "schema-how-to-step-mover" },
				!this.props.isFirst && yoast._wp.element.createElement(IconButton, {
					className: "editor-block-mover__control",
					onClick: this.props.onMoveUp,
					icon: "arrow-up-alt2",
					label: (0, _i18n.__)("Move step up", "wordpress-seo")
				}),
				!this.props.isLast && yoast._wp.element.createElement(IconButton, {
					className: "editor-block-mover__control",
					onClick: this.props.isLast ? null : this.props.onMoveDown,
					icon: "arrow-down-alt2",
					label: (0, _i18n.__)("Move step down", "wordpress-seo")
				})
			);
		}

		/**
   * Callback when an image from the media library has been selected.
   *
   * @param {Object} media The selected image.
   *
   * @returns {void}
   */

	}, {
		key: "onSelectImage",
		value: function onSelectImage(media) {
			var _props$step = this.props.step,
			    name = _props$step.name,
			    text = _props$step.text;


			var newText = text.slice();
			var image = yoast._wp.element.createElement("img", { key: media.id, alt: media.alt, src: media.url });

			if (newText.push) {
				newText.push(image);
			} else {
				newText = [newText, image];
			}

			this.props.onChange(name, newText, name, text);
		}

		/**
   * Returns the image src from step contents.
   *
   * @param {array} contents The step contents.
   *
   * @returns {string|boolean} The image src or false if none is found.
   */

	}, {
		key: "render",


		/**
   * Renders this component.
   *
   * @returns {Component} The how-to step editor.
   */
		value: function render() {
			var _props2 = this.props,
			    index = _props2.index,
			    step = _props2.step,
			    _onChange = _props2.onChange,
			    onFocus = _props2.onFocus,
			    isSelected = _props2.isSelected,
			    subElement = _props2.subElement,
			    editorRef = _props2.editorRef,
			    isUnorderedList = _props2.isUnorderedList;
			var id = step.id,
			    name = step.name,
			    text = step.text;


			return yoast._wp.element.createElement(
				"li",
				{ className: "schema-how-to-step", key: id },
				yoast._wp.element.createElement(
					"span",
					{ className: "schema-how-to-step-number" },
					isUnorderedList ? "•" : index + 1 + "."
				),
				yoast._wp.element.createElement(RichText, {
					className: "schema-how-to-step-name",
					tagName: "strong",
					onSetup: function onSetup(ref) {
						return editorRef("name", ref);
					},
					key: id + "-name",
					value: name,
					onChange: function onChange(value) {
						return _onChange(value, text, name, text);
					},
					isSelected: isSelected && subElement === "name",
					placeholder: (0, _i18n.__)("Enter a step title", "wordpress-seo"),
					setFocusedElement: function setFocusedElement() {
						return onFocus("name");
					},
					keepPlaceholderOnFocus: true
				}),
				yoast._wp.element.createElement(RichText, {
					className: "schema-how-to-step-text",
					tagName: "p",
					onSetup: function onSetup(ref) {
						return editorRef("text", ref);
					},
					key: id + "-text",
					value: text,
					onChange: function onChange(value) {
						return _onChange(name, value, name, text);
					},
					isSelected: isSelected && subElement === "text",
					placeholder: (0, _i18n.__)("Enter a step description", "wordpress-seo"),
					setFocusedElement: function setFocusedElement() {
						return onFocus("text");
					},
					keepPlaceholderOnFocus: true
				}),
				isSelected && this.getMover(),
				isSelected && this.getButtons()
			);
		}
	}], [{
		key: "getImageSrc",
		value: function getImageSrc(contents) {
			if (!contents || !contents.filter) {
				return false;
			}

			var image = contents.filter(function (node) {
				return node && node.type && node.type === "img";
			})[0];

			if (!image) {
				return false;
			}

			return image.props.src;
		}

		/**
   * Returns the component of the given How-to step to be rendered in a WordPress post
   * (e.g. not in the editor).
   *
   * @param {object} step The how-to step.
   *
   * @returns {Component} The component to be rendered.
   */

	}, {
		key: "Content",
		value: function Content(step) {
			return yoast._wp.element.createElement(
				"li",
				{ className: "schema-how-to-step", key: step.id },
				yoast._wp.element.createElement(RichText.Content, {
					tagName: "strong",
					className: "schema-how-to-step-name",
					key: step.id + "-name",
					value: step.name
				}),
				yoast._wp.element.createElement(RichText.Content, {
					tagName: "p",
					className: "schema-how-to-step-text",
					key: step.id + "-text",
					value: step.text
				})
			);
		}
	}]);

	return HowToStep;
}(Component);

exports.default = HowToStep;


HowToStep.propTypes = {
	index: _propTypes2.default.number.isRequired,
	step: _propTypes2.default.object.isRequired,
	onChange: _propTypes2.default.func.isRequired,
	insertStep: _propTypes2.default.func.isRequired,
	removeStep: _propTypes2.default.func.isRequired,
	onFocus: _propTypes2.default.func.isRequired,
	editorRef: _propTypes2.default.func.isRequired,
	onMoveUp: _propTypes2.default.func.isRequired,
	onMoveDown: _propTypes2.default.func.isRequired,
	subElement: _propTypes2.default.string,
	isSelected: _propTypes2.default.bool,
	isFirst: _propTypes2.default.bool,
	isLast: _propTypes2.default.bool,
	isUnorderedList: _propTypes2.default.bool
};

/***/ }),

/***/ 1435:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = buildDurationString;

var _i18n = __webpack_require__(8);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* External dependencies */


/**
 * Tries to parse a string to an int and returns a default if it does not produce a valid number.
 *
 * @param {string} string           String to parse to an integer.
 * @param {number} [defaultInteger] Default value if the parse does not return a valid number.
 *
 * @returns {number} The parsed number or default.
 */
function parseIntDefault(string) {
	var defaultInteger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	return parseInt(string, 10) || defaultInteger;
}

/**
 * Transforms the durations into a translated string containing the count, and either singular or plural unit.
 *
 * For example (in en-US): If durations.days is 1, it returns "1 day". If durations.days is 2, it returns "2 days".
 *
 * @param {Object} durations         The duration values.
 * @param {number} durations.days    Number of days.
 * @param {number} durations.hours   Number of hours.
 * @param {number} durations.minutes Number of minutes.
 *
 * @returns {Array} Array of pluralized durations.
 */
function transformDurationsToStrings(_ref) {
	var days = _ref.days,
	    hours = _ref.hours,
	    minutes = _ref.minutes;

	var strings = [];
	if (days !== 0) {
		strings.push((0, _i18n.sprintf)((0, _i18n._n)("%d day", "%d days", days, "wordpress-seo"), days));
	}
	if (hours !== 0) {
		strings.push((0, _i18n.sprintf)((0, _i18n._n)("%d hour", "%d hours", hours, "wordpress-seo"), hours));
	}
	if (minutes !== 0) {
		strings.push((0, _i18n.sprintf)((0, _i18n._n)("%d minute", "%d minutes", minutes, "wordpress-seo"), minutes));
	}
	return strings;
}

/**
 * Formats the durations into a translated string.
 *
 * @param {Object} durations         The duration values.
 * @param {string} durations.days    Number of days.
 * @param {string} durations.hours   Number of hours.
 * @param {string} durations.minutes Number of minutes.
 *
 * @returns {string} Formatted duration.
 */
function buildDurationString(durations) {
	var elements = transformDurationsToStrings({
		days: parseIntDefault(durations.days),
		hours: parseIntDefault(durations.hours),
		minutes: parseIntDefault(durations.minutes)
	});

	if (elements.length === 1) {
		return elements[0];
	}
	if (elements.length === 2) {
		return _i18n.sprintf.apply(undefined, [
		/* Translators: %s expands to a unit of time (e.g. 1 day) */
		(0, _i18n.__)("%s and %s", "wordpress-seo")].concat(_toConsumableArray(elements)));
	}
	if (elements.length === 3) {
		return _i18n.sprintf.apply(undefined, [
		/* Translators: %s expands to a unit of time (e.g. 1 day) */
		(0, _i18n.__)("%s, %s and %s", "wordpress-seo")].concat(_toConsumableArray(elements)));
	}
	return "";
}

/***/ }),

/***/ 1436:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _i18n = __webpack_require__(8);

var _FAQ = __webpack_require__(1437);

var _FAQ2 = _interopRequireDefault(_FAQ);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registerBlockType = window.wp.blocks.registerBlockType;

/* Internal dependencies */
/* External dependencies */

exports.default = function () {
	registerBlockType("yoast/faq-block", {
		title: (0, _i18n.__)("FAQ", "wordpress-seo"),
		description: (0, _i18n.__)("List your Frequently Asked Questions in an SEO-friendly way. You can only use one FAQ block per post.", "wordpress-seo"),
		icon: "editor-ul",
		category: "yoast-structured-data-blocks",
		keywords: [(0, _i18n.__)("FAQ", "wordpress-seo"), (0, _i18n.__)("Frequently Asked Questions", "wordpress-seo")],
		// Allow only one FAQ block per post.
		supports: {
			multiple: false
		},
		// Block attributes - decides what to save and how to parse it from and to HTML.
		attributes: {
			title: {
				type: "array",
				source: "children",
				selector: ".schema-faq-title"
			},
			jsonTitle: {
				type: "string"
			},
			questions: {
				type: "array"
			},
			additionalListCssClasses: {
				type: "string"
			}
		},

		/**
   * The edit function describes the structure of your block in the context of the editor.
   * This represents what the editor will render when the block is used.
   *
   * The "edit" property must be a valid function.
   *
   * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
   * @returns {Component} The editor component.
   */
		edit: function edit(_ref) {
			var attributes = _ref.attributes,
			    setAttributes = _ref.setAttributes,
			    className = _ref.className;

			// Because setAttributes is quite slow right after a block has been added we fake having a single step.
			if (!attributes.questions || attributes.questions.length === 0) {
				attributes.questions = [{ id: _FAQ2.default.generateId("faq-question"), question: [], answer: [] }];
			}

			return yoast._wp.element.createElement(_FAQ2.default, { attributes: attributes, setAttributes: setAttributes, className: className });
		},

		/**
   * The save function defines the way in which the different attributes should be combined
   * into the final markup, which is then serialized by Gutenberg into post_content.
   *
   * The "save" property must be specified and must be a valid function.
   *
   * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
   * @returns {Component} The display component.
   */
		// eslint-disable-next-line react/display-name
		save: function save(_ref2) {
			var attributes = _ref2.attributes;

			return yoast._wp.element.createElement(_FAQ2.default.Content, attributes);
		}
	});
};

/***/ }),

/***/ 1437:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _isUndefined = __webpack_require__(15);

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _i18n = __webpack_require__(8);

var _Question = __webpack_require__(1438);

var _Question2 = _interopRequireDefault(_Question);

var _stringHelpers = __webpack_require__(346);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* External dependencies */


/* Internal dependencies */


var RichText = window.wp.editor.RichText;
var IconButton = window.wp.components.IconButton;
var _window$wp$element = window.wp.element,
    Component = _window$wp$element.Component,
    renderToString = _window$wp$element.renderToString;

/**
 * A FAQ block component.
 */

var FAQ = function (_Component) {
	_inherits(FAQ, _Component);

	/**
  * Constructs a FAQ editor component.
  *
  * @param {Object} props This component's properties.
  *
  * @returns {void}
  */
	function FAQ(props) {
		_classCallCheck(this, FAQ);

		var _this = _possibleConstructorReturn(this, (FAQ.__proto__ || Object.getPrototypeOf(FAQ)).call(this, props));

		_this.state = { focus: "" };

		_this.changeQuestion = _this.changeQuestion.bind(_this);
		_this.insertQuestion = _this.insertQuestion.bind(_this);
		_this.removeQuestion = _this.removeQuestion.bind(_this);
		_this.swapQuestions = _this.swapQuestions.bind(_this);

		_this.setFocus = _this.setFocus.bind(_this);

		_this.editorRefs = {};
		return _this;
	}

	/**
  * Generates a pseudo-unique" id.
  *
  * @param {string} prefix An (optional) prefix to use.
  *
  * @returns {string} A pseudo-unique string, consisting of the optional prefix + the curent time in milliseconds.
  */


	_createClass(FAQ, [{
		key: "changeQuestion",


		/**
   * Replaces the FAQ Question with the given index.
   *
   * @param {array|string} newQuestion      The new contents of the question.
   * @param {array|string} newAnswer        The new contents of the answer to this question.
   * @param {array}        previousQuestion The old question.
   * @param {array}        previousAnswer   The old answer.
   * @param {number}       index            The index of the question that needs to be changed.
   *
   * @returns {void}
   */
		value: function changeQuestion(newQuestion, newAnswer, previousQuestion, previousAnswer, index) {
			var questions = this.props.attributes.questions ? this.props.attributes.questions.slice() : [];

			if (index >= questions.length) {
				return;
			}

			if (questions[index].question !== previousQuestion || questions[index].answer !== previousAnswer) {
				return;
			}

			questions[index] = {
				id: questions[index].id,
				question: newQuestion,
				answer: newAnswer,
				jsonQuestion: (0, _stringHelpers.stripHTML)(renderToString(newQuestion)),
				jsonAnswer: (0, _stringHelpers.stripHTML)(renderToString(newAnswer))
			};

			var imageSrc = _Question2.default.getImageSrc(newAnswer);
			if (imageSrc) {
				questions[index].jsonImageSrc = imageSrc;
			}

			this.props.setAttributes({ questions: questions });
		}

		/**
   * Inserts an empty Question into a FAQ block at the given index.
   *
   * @param {number}       [index]      The index of the Question after which a new Question should be added.
   * @param {array|string} [question]   The question of the new Question.
   * @param {array|string} [answer]     The answer of the new Question.
   * @param {bool}         [focus=true] Whether or not to focus the new Question.
   *
   * @returns {void}
   */

	}, {
		key: "insertQuestion",
		value: function insertQuestion(index) {
			var question = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
			var answer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
			var focus = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

			var questions = this.props.attributes.questions ? this.props.attributes.questions.slice() : [];

			if ((0, _isUndefined2.default)(index)) {
				index = questions.length - 1;
			}

			var lastIndex = questions.length - 1;
			while (lastIndex > index) {
				this.editorRefs[lastIndex + 1 + ":question"] = this.editorRefs[lastIndex + ":question"];
				this.editorRefs[lastIndex + 1 + ":answer"] = this.editorRefs[lastIndex + ":answer"];
				lastIndex--;
			}

			questions.splice(index + 1, 0, {
				id: FAQ.generateId("faq-question"),
				question: question,
				answer: answer,
				jsonQuestion: "",
				jsonAnswer: ""
			});

			this.props.setAttributes({ questions: questions });

			if (focus) {
				setTimeout(this.setFocus.bind(this, index + 1 + ":question"));
			}
		}

		/**
   * Swaps two questions in the FAQ block.
   *
   * @param {number} index1 The index of the first question.
   * @param {number} index2 The index of the second question.
   *
   * @returns {void}
   */

	}, {
		key: "swapQuestions",
		value: function swapQuestions(index1, index2) {
			var questions = this.props.attributes.questions ? this.props.attributes.questions.slice() : [];
			var question = questions[index1];

			questions[index1] = questions[index2];
			questions[index2] = question;

			var QuestionEditorRef = this.editorRefs[index1 + ":question"];
			this.editorRefs[index1 + ":question"] = this.editorRefs[index2 + ":question"];
			this.editorRefs[index2 + ":question"] = QuestionEditorRef;
			var AnswerEditorRef = this.editorRefs[index1 + ":answer"];
			this.editorRefs[index1 + ":answer"] = this.editorRefs[index2 + ":answer"];
			this.editorRefs[index2 + ":answer"] = AnswerEditorRef;

			this.props.setAttributes({ questions: questions });

			var _state$focus$split = this.state.focus.split(":"),
			    _state$focus$split2 = _slicedToArray(_state$focus$split, 2),
			    focusIndex = _state$focus$split2[0],
			    subElement = _state$focus$split2[1];

			if (focusIndex === "" + index1) {
				this.setFocus(index2 + ":" + subElement);
			} else if (focusIndex === "" + index2) {
				this.setFocus(index1 + ":" + subElement);
			}
		}

		/**
   * Removes a Question from a FAQ block.
   *
   * @param {number} index The index of the Question that needs to be removed.
   *
   * @returns {void}
   */

	}, {
		key: "removeQuestion",
		value: function removeQuestion(index) {
			var questions = this.props.attributes.questions ? this.props.attributes.questions.slice() : [];

			questions.splice(index, 1);
			this.props.setAttributes({ questions: questions });

			delete this.editorRefs[index + ":question"];
			delete this.editorRefs[index + ":answer"];

			var nextIndex = index + 1;
			while (this.editorRefs[nextIndex + ":question"] || this.editorRefs[nextIndex + ":answer"]) {
				this.editorRefs[nextIndex - 1 + ":question"] = this.editorRefs[nextIndex + ":question"];
				this.editorRefs[nextIndex - 1 + ":answer"] = this.editorRefs[nextIndex + ":answer"];
				nextIndex++;
			}

			var deletedIndex = questions.length;
			delete this.editorRefs[deletedIndex + ":question"];
			delete this.editorRefs[deletedIndex + ":answer"];

			var fieldToFocus = "title";
			if (this.editorRefs[index + ":question"]) {
				fieldToFocus = index + ":question";
			} else if (this.editorRefs[index - 1 + ":answer"]) {
				fieldToFocus = index - 1 + ":answer";
			}

			this.setFocus(fieldToFocus);
		}
		/**
   * Sets the focus to a specific QA pair in the FAQ block.
   *
   * @param {number|string} elementToFocus The element to focus, either the index of the Question that should be in focus or name of the input.
   *
   * @returns {void}
   */

	}, {
		key: "setFocus",
		value: function setFocus(elementToFocus) {
			if (elementToFocus === this.state.focus) {
				return;
			}

			this.setState({ focus: elementToFocus });

			if (this.editorRefs[elementToFocus]) {
				this.editorRefs[elementToFocus].focus();
			}
		}

		/**
   * Retrieves a button to add a step to the front of the list.
   *
   * @returns {Component} The button for adding add a step.
   */

	}, {
		key: "getAddQuestionButton",
		value: function getAddQuestionButton() {
			var _this2 = this;

			return yoast._wp.element.createElement(
				IconButton,
				{
					icon: "insert",
					onClick: function onClick() {
						return _this2.insertQuestion();
					},
					className: "editor-inserter__toggle"
				},
				(0, _i18n.__)("Add question", "wordpress-seo")
			);
		}

		/**
   * Retrieves a list of questions.
   *
   * @returns {array} List of questions.
   */

	}, {
		key: "getQuestions",
		value: function getQuestions() {
			var _this3 = this;

			var attributes = this.props.attributes;


			if (!attributes.questions) {
				return null;
			}

			var _state$focus$split3 = this.state.focus.split(":"),
			    _state$focus$split4 = _slicedToArray(_state$focus$split3, 2),
			    focusIndex = _state$focus$split4[0],
			    subElement = _state$focus$split4[1];

			return attributes.questions.map(function (question, index) {
				return yoast._wp.element.createElement(_Question2.default, {
					key: question.id,
					attributes: question,
					insertQuestion: function insertQuestion() {
						return _this3.insertQuestion(index);
					},
					removeQuestion: function removeQuestion() {
						return _this3.removeQuestion(index);
					},
					editorRef: function editorRef(part, ref) {
						_this3.editorRefs[index + ":" + part] = ref;
					},
					onChange: function onChange(question, answer, prevQuestion, prevAnswer) {
						return _this3.changeQuestion(question, answer, prevQuestion, prevAnswer, index);
					},
					onFocus: function onFocus(part) {
						return _this3.setFocus(index + ":" + part);
					},
					isSelected: focusIndex === "" + index,
					subElement: subElement,
					onMoveUp: function onMoveUp() {
						return _this3.swapQuestions(index, index - 1);
					},
					onMoveDown: function onMoveDown() {
						return _this3.swapQuestions(index, index + 1);
					},
					isFirst: index === 0,
					isLast: index === attributes.questions.length - 1
				});
			});
		}

		/**
   * Returns the component to be used to render
   * the FAQ block on Wordpress (e.g. not in the editor).
   *
   * @param {object} attributes The attributes of the FAQ block.
   *
   * @returns {Component} The component representing a FAQ block.
   */

	}, {
		key: "render",


		/**
   * Renders this component.
   *
   * @returns {Component} The FAQ block editor.
   */
		value: function render() {
			var _this4 = this;

			var _props = this.props,
			    attributes = _props.attributes,
			    setAttributes = _props.setAttributes,
			    className = _props.className;


			var classNames = ["schema-faq", className].filter(function (i) {
				return i;
			}).join(" ");

			return yoast._wp.element.createElement(
				"div",
				{ className: classNames },
				yoast._wp.element.createElement(RichText, {
					tagName: "strong",
					className: "schema-faq-title",
					value: attributes.title,
					isSelected: this.state.focus === "title",
					setFocusedElement: function setFocusedElement() {
						return _this4.setFocus("title");
					},
					onChange: function onChange(title) {
						return setAttributes({ title: title, jsonTitle: (0, _stringHelpers.stripHTML)(renderToString(title)) });
					},
					onSetup: function onSetup(ref) {
						_this4.editorRefs.title = ref;
					},
					placeholder: (0, _i18n.__)("Enter a title for your FAQ section", "wordpress-seo"),
					keepPlaceholderOnFocus: true
				}),
				yoast._wp.element.createElement(
					"div",
					null,
					this.getQuestions()
				),
				yoast._wp.element.createElement(
					"div",
					{ className: "schema-faq-buttons" },
					this.getAddQuestionButton()
				)
			);
		}
	}], [{
		key: "generateId",
		value: function generateId(prefix) {
			return prefix + "-" + new Date().getTime();
		}
	}, {
		key: "Content",
		value: function Content(attributes) {
			var title = attributes.title,
			    questions = attributes.questions,
			    className = attributes.className;


			var questionList = questions ? questions.map(function (question) {
				return yoast._wp.element.createElement(_Question2.default.Content, question);
			}) : null;

			var classNames = ["schema-faq", className].filter(function (i) {
				return i;
			}).join(" ");

			return yoast._wp.element.createElement(
				"div",
				{ className: classNames },
				yoast._wp.element.createElement(RichText.Content, {
					tagName: "strong",
					className: "schema-faq-title",
					value: title,
					id: (0, _stringHelpers.stripHTML)(renderToString(title)).toLowerCase().replace(/\s+/g, "-")
				}),
				questionList
			);
		}
	}]);

	return FAQ;
}(Component);

exports.default = FAQ;


FAQ.propTypes = {
	attributes: _propTypes2.default.object.isRequired,
	setAttributes: _propTypes2.default.func.isRequired,
	className: _propTypes2.default.string
};

/***/ }),

/***/ 1438:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _i18n = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* External dependencies */


var Component = window.wp.element.Component;
var IconButton = window.wp.components.IconButton;
var _window$wp$editor = window.wp.editor,
    RichText = _window$wp$editor.RichText,
    MediaUpload = _window$wp$editor.MediaUpload;

/**
 * A Question and answer pair within a FAQ block.
 */

var Question = function (_Component) {
	_inherits(Question, _Component);

	function Question() {
		_classCallCheck(this, Question);

		return _possibleConstructorReturn(this, (Question.__proto__ || Object.getPrototypeOf(Question)).apply(this, arguments));
	}

	_createClass(Question, [{
		key: "getButtons",


		/**
   * The insert and remove question buttons.
   *
   * @returns {Component} The buttons.
   */
		value: function getButtons() {
			var _this2 = this;

			var _props = this.props,
			    attributes = _props.attributes,
			    removeQuestion = _props.removeQuestion,
			    insertQuestion = _props.insertQuestion;


			return yoast._wp.element.createElement(
				"div",
				{ className: "schema-faq-question-button-container" },
				yoast._wp.element.createElement(MediaUpload, {
					onSelect: function onSelect(media) {
						return _this2.onSelectImage(media);
					},
					type: "image",
					value: attributes.id,
					render: function render(_ref) {
						var open = _ref.open;
						return yoast._wp.element.createElement(
							IconButton,
							{
								className: "schema-faq-question-button editor-inserter__toggle faq-question-add-media",
								icon: "insert",
								onClick: open
							},
							(0, _i18n.__)("Add image", "wordpress-seo")
						);
					}
				}),
				yoast._wp.element.createElement(IconButton, {
					className: "schema-faq-question-button editor-inserter__toggle",
					icon: "trash",
					label: (0, _i18n.__)("Delete question", "wordpress-seo"),
					onClick: removeQuestion
				}),
				yoast._wp.element.createElement(IconButton, {
					className: "schema-faq-question-button editor-inserter__toggle",
					icon: "insert",
					label: (0, _i18n.__)("Insert question", "wordpress-seo"),
					onClick: insertQuestion
				})
			);
		}

		/**
   * The mover buttons.
   *
   * @returns {Component} The buttons.
   */

	}, {
		key: "getMover",
		value: function getMover() {
			return yoast._wp.element.createElement(
				"div",
				{ className: "schema-faq-question-mover" },
				!this.props.isFirst && yoast._wp.element.createElement(IconButton, {
					className: "editor-block-mover__control",
					onClick: this.props.onMoveUp,
					icon: "arrow-up-alt2",
					label: (0, _i18n.__)("Move question up", "wordpress-seo")
				}),
				!this.props.isLast && yoast._wp.element.createElement(IconButton, {
					className: "editor-block-mover__control",
					onClick: this.props.onMoveDown,
					icon: "arrow-down-alt2",
					label: (0, _i18n.__)("Move question down", "wordpress-seo")
				})
			);
		}

		/**
   * Callback when an image from the media library has been selected.
   *
   * @param {Object} media The selected image.
   *
   * @returns {void}
   */

	}, {
		key: "onSelectImage",
		value: function onSelectImage(media) {
			var _props$attributes = this.props.attributes,
			    question = _props$attributes.question,
			    answer = _props$attributes.answer;


			var newAnswer = answer.slice();
			var image = yoast._wp.element.createElement("img", { key: media.id, alt: media.alt, src: media.url });

			if (newAnswer.push) {
				newAnswer.push(image);
			} else {
				newAnswer = [newAnswer, image];
			}

			this.props.onChange(question, newAnswer, question, answer);
		}

		/**
   * Returns the image src from step contents.
   *
   * @param {array} contents The step contents.
   *
   * @returns {string|boolean} The image src or false if none is found.
   */

	}, {
		key: "render",


		/**
   * Renders this component.
   *
   * @returns {Component} The how-to step editor.
   */
		value: function render() {
			var _props2 = this.props,
			    subElement = _props2.subElement,
			    attributes = _props2.attributes,
			    _onChange = _props2.onChange,
			    onFocus = _props2.onFocus,
			    isSelected = _props2.isSelected,
			    editorRef = _props2.editorRef;
			var id = attributes.id,
			    question = attributes.question,
			    answer = attributes.answer;


			return yoast._wp.element.createElement(
				"div",
				{ className: "schema-faq-question", key: id },
				yoast._wp.element.createElement(RichText, {
					className: "schema-faq-question-question",
					tagName: "strong",
					onSetup: function onSetup(ref) {
						return editorRef("question", ref);
					},
					key: id + "-question",
					value: question,
					onChange: function onChange(value) {
						return _onChange(value, answer, question, answer);
					},
					isSelected: isSelected && subElement === "question",
					setFocusedElement: function setFocusedElement() {
						return onFocus("question");
					},
					placeholder: (0, _i18n.__)("Enter a question", "wordpress-seo"),
					keepPlaceholderOnFocus: true
				}),
				yoast._wp.element.createElement(RichText, {
					className: "schema-faq-question-answer",
					tagName: "p",
					onSetup: function onSetup(ref) {
						return editorRef("answer", ref);
					},
					key: id + "-answer",
					value: answer,
					onChange: function onChange(value) {
						return _onChange(question, value, question, answer);
					},
					isSelected: isSelected && subElement === "answer",
					setFocusedElement: function setFocusedElement() {
						return onFocus("answer");
					},
					placeholder: (0, _i18n.__)("Enter the answer to the question", "wordpress-seo"),
					keepPlaceholderOnFocus: true
				}),
				isSelected && this.getButtons(),
				isSelected && this.getMover()
			);
		}
	}], [{
		key: "getImageSrc",
		value: function getImageSrc(contents) {
			if (!contents || !contents.filter) {
				return false;
			}

			var image = contents.filter(function (node) {
				return node && node.type && node.type === "img";
			})[0];

			if (!image) {
				return false;
			}

			return image.props.src;
		}

		/**
   * Returns the component of the given question and answer to be rendered in a WordPress post
   * (e.g. not in the editor).
   *
   * @param {object} question The question and its answer.
   *
   * @returns {Component} The component to be rendered.
   */

	}, {
		key: "Content",
		value: function Content(question) {
			return yoast._wp.element.createElement(
				"div",
				{ className: "schema-faq-question", key: question.id },
				yoast._wp.element.createElement(RichText.Content, {
					tagName: "strong",
					className: "schema-faq-question-question",
					key: question.id + "-question",
					value: question.question
				}),
				yoast._wp.element.createElement(RichText.Content, {
					tagName: "p",
					className: "schema-faq-question-answer",
					key: question.id + "-answer",
					value: question.answer
				})
			);
		}
	}]);

	return Question;
}(Component);

exports.default = Question;


Question.propTypes = {
	attributes: _propTypes2.default.object.isRequired,
	onChange: _propTypes2.default.func.isRequired,
	insertQuestion: _propTypes2.default.func.isRequired,
	removeQuestion: _propTypes2.default.func.isRequired,
	onFocus: _propTypes2.default.func.isRequired,
	editorRef: _propTypes2.default.func.isRequired,
	onMoveUp: _propTypes2.default.func.isRequired,
	onMoveDown: _propTypes2.default.func.isRequired,
	subElement: _propTypes2.default.string,
	focus: _propTypes2.default.string,
	isSelected: _propTypes2.default.bool,
	isFirst: _propTypes2.default.bool,
	isLast: _propTypes2.default.bool
};

/***/ }),

/***/ 15:
/***/ (function(module, exports) {

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

module.exports = isUndefined;


/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(114)();
}


/***/ }),

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(12),
    isObjectLike = __webpack_require__(10);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ 346:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.firstToUpperCase = firstToUpperCase;
exports.stripHTML = stripHTML;
/**
 * Capitalize the first letter of a string.
 *
 * @param   {string} string The string to capitalize.
 *
 * @returns {string}        The string with the first letter capitalized.
 */
function firstToUpperCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Strips HTML from a string.
 *
 * @param {string} string  The string to strip HTML from.
 *
 * @returns {string} The string with HTML stripped.
 */
function stripHTML(string) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = string;
  return tmp.textContent || tmp.innerText || "";
}

/***/ }),

/***/ 44:
/***/ (function(module, exports) {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),

/***/ 5:
/***/ (function(module, exports) {

module.exports = window.yoast.styledComponents;

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(73);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ 73:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),

/***/ 8:
/***/ (function(module, exports) {

module.exports = window.yoast._wp.i18n;

/***/ }),

/***/ 84:
/***/ (function(module, exports, __webpack_require__) {

var baseToString = __webpack_require__(92);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),

/***/ 92:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(13),
    arrayMap = __webpack_require__(44),
    isArray = __webpack_require__(3),
    isSymbol = __webpack_require__(20);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ })

},[1431]);
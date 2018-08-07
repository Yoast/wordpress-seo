yoastWebpackJsonp([10],{

/***/ 1043:
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

/***/ 2021:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _block = __webpack_require__(2022);

var _block2 = _interopRequireDefault(_block);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _block2.default)();

/***/ }),

/***/ 2022:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _HowTo = __webpack_require__(2023);

var _HowTo2 = _interopRequireDefault(_HowTo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __ = window.wp.i18n.__;
var registerBlockType = window.wp.blocks.registerBlockType;

exports.default = function () {
	registerBlockType("yoast/how-to-block", {
		// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
		title: __("How-to", "wordpress-seo"),
		icon: "editor-ol",
		category: "yoast-structured-data-blocks",
		keywords: [__("How-to", "wordpress-seo"), __("How to", "wordpress-seo")],
		// Block attributes - decides what to save and how to parse it from and to HTML.
		attributes: {
			title: {
				type: "array",
				source: "children",
				selector: ".schema-how-to-title"
			},
			hasDuration: {
				type: "boolean"
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
			steps: {
				type: "array"
			},
			additionalListCssClasses: {
				type: "string"
			},
			unorderedList: {
				type: "boolean"
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
			if (!attributes.steps || attributes.steps.length === 0) {
				attributes.steps = [{ id: _HowTo2.default.generateId("how-to-step"), contents: [] }];
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
		save: function save(_ref2) {
			var attributes = _ref2.attributes,
			    className = _ref2.className;

			return _HowTo2.default.getContent(attributes, className);
		}
	});
};

/***/ }),

/***/ 2023:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(24);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _HowToStep = __webpack_require__(2024);

var _HowToStep2 = _interopRequireDefault(_HowToStep);

var _stringHelpers = __webpack_require__(1043);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __ = window.wp.i18n.__;
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
var Fragment = window.wp.element.Fragment;

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

		_this.state = { focus: null };

		_this.changeStep = _this.changeStep.bind(_this);
		_this.insertStep = _this.insertStep.bind(_this);
		_this.removeStep = _this.removeStep.bind(_this);
		_this.swapSteps = _this.swapSteps.bind(_this);
		_this.setFocus = _this.setFocus.bind(_this);
		_this.addCSSClasses = _this.addCSSClasses.bind(_this);
		_this.getListTypeHelp = _this.getListTypeHelp.bind(_this);
		_this.toggleListType = _this.toggleListType.bind(_this);

		_this.editorRefs = {};
		return _this;
	}

	/**
  * Generates a pseudo-unique" id.
  *
  * @param {string} prefix an (optional) prefix to use.
  *
  * @returns {string} a pseudo-unique string, consisting of the optional prefix + the curent time in milliseconds.
  */


	_createClass(HowTo, [{
		key: "changeStep",


		/**
   * Replaces the How-to step with the given index.
   *
   * @param {array|string} newContents The new contents of the step.
   * @param {number}       index       The index of the step that needs to be replaced.
   *
   * @returns {void}
   */
		value: function changeStep(newContents, index) {
			var steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];

			if (index >= steps.length) {
				return;
			}

			steps[index].contents = newContents;
			this.props.setAttributes({ steps: steps });
		}

		/**
   * Inserts an empty step into a how-to block at the given index.
   *
   * @param {number}       [index]      The index of the step after which a new step should be added.
   * @param {array|string} [contents]   The contents of the new step.
   * @param {bool}         [focus=true] Whether or not to focus the new step.
   *
   * @returns {void}
   */

	}, {
		key: "insertStep",
		value: function insertStep(index) {
			var contents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
			var focus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			var steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];

			if (!index) {
				index = steps.length - 1;
			}

			steps.splice(index + 1, 0, { id: HowTo.generateId("how-to-step"), contents: contents });
			this.props.setAttributes({ steps: steps });

			if (focus) {
				setTimeout(this.setFocus.bind(this, index + 1));
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

			var stepEditorRef = this.editorRefs[index1];
			this.editorRefs[index1] = this.editorRefs[index2];
			this.editorRefs[index2] = stepEditorRef;

			this.props.setAttributes({ steps: steps });

			if (this.state.focus === index1) {
				this.setFocus(index2);
			} else if (this.state.focus === index2) {
				this.setFocus(index1);
			}
		}

		/**
   * Removes a step from a how-to block.
   *
   * @param {number} index the index of the step that needs to be removed.
   *
   * @returns {void}
   */

	}, {
		key: "removeStep",
		value: function removeStep(index) {
			var steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];
			steps.splice(index, 1);
			this.props.setAttributes({ steps: steps });
			if (index > 0) {
				this.setFocus(index - 1);
			} else {
				this.setFocus("description");
			}
		}

		/**
   * Sets the focus to a specific step in the How-to block.
   *
   * @param {number|string} focus the element to focus, either the index of the step that should be in focus or name of the input.
   *
   * @returns {void}
   */

	}, {
		key: "setFocus",
		value: function setFocus(focus) {
			this.setState({ focus: focus });

			if (this.editorRefs[focus]) {
				this.editorRefs[focus].focus();
			}
		}

		/**
   * Returns an array of How-to step components, to be rendered on screen.
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

			return this.props.attributes.steps.map(function (step, index) {
				return yoast._wp.element.createElement(_HowToStep2.default, {
					key: step.id,
					step: step,
					index: index,
					editorRef: function editorRef(ref) {
						_this2.editorRefs[index] = ref;
					},
					onChange: function onChange(newStepContents) {
						return _this2.changeStep(newStepContents, index);
					},
					insertStep: function insertStep(contents) {
						return _this2.insertStep(index, contents);
					},
					removeStep: function removeStep() {
						return _this2.removeStep(index);
					},
					onFocus: function onFocus() {
						return _this2.setFocus(index);
					},
					onMoveUp: function onMoveUp() {
						return _this2.swapSteps(index, index - 1);
					},
					onMoveDown: function onMoveDown() {
						return _this2.swapSteps(index, index + 1);
					},
					isFirst: index === 0,
					isLast: index === _this2.props.attributes.steps.length - 1,
					isSelected: _this2.state.focus === index
				});
			});
		}

		/**
   * Returns a component to manage this how-to block"s duration.
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
					__("Add total time", "wordpress-seo")
				);
			}

			return yoast._wp.element.createElement(
				"div",
				{ className: "schema-how-to-duration" },
				yoast._wp.element.createElement(
					"span",
					null,
					__("Total time:", "wordpress-seo"),
					"\xA0"
				),
				yoast._wp.element.createElement("input", {
					className: "schema-how-to-duration-input",
					type: "number",
					value: attributes.hours,
					min: "0",
					onFocus: function onFocus() {
						return _this3.setFocus("hours");
					},
					onChange: function onChange(event) {
						return setAttributes({ hours: event.target.value });
					},
					placeholder: "HH" }),
				yoast._wp.element.createElement(
					"span",
					null,
					":"
				),
				yoast._wp.element.createElement("input", {
					className: "schema-how-to-duration-input",
					type: "number",
					min: "0",
					max: "59",
					value: attributes.minutes,
					onFocus: function onFocus() {
						return _this3.setFocus("minutes");
					},
					onChange: function onChange(event) {
						return setAttributes({ minutes: event.target.value });
					},
					placeholder: "MM" }),
				yoast._wp.element.createElement(IconButton, {
					className: "schema-how-to-duration-button editor-inserter__toggle",
					icon: "trash",
					label: __("Delete total time", "wordpress-seo"),
					onClick: function onClick() {
						return setAttributes({ hasDuration: false });
					}
				})
			);
		}

		/**
   * Serializes a How-to block into a JSON-LD representation.
   *
   * @param {object} attributes the attributes of the How-to block.
   *
   * @returns {object} the JSON-LD representation of this How-to block.
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
				__("Add step", "wordpress-seo")
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
   * Returns the help text for this how-to block"s list type.
   *
   * @param  {boolean} checked Whether or not the list is unordered.
   *
   * @returns {string} The list type help string.
   */

	}, {
		key: "getListTypeHelp",
		value: function getListTypeHelp(checked) {
			return checked ? __("Showing step items as an unordered list", "wordpress-seo") : __("Showing step items as an ordered list.", "wordpress-seo");
		}

		/**
   * Adds controls to the editor sidebar to control the given parameters.
   * @param {boolean} unorderedList whether to show the list as an unordered list.
   * @param {string} additionalClasses the additional CSS classes to add to the list.
   * @returns {Component} the controls to add to the sidebar.
   */

	}, {
		key: "getSidebar",
		value: function getSidebar(unorderedList, additionalClasses) {
			return yoast._wp.element.createElement(
				InspectorControls,
				null,
				yoast._wp.element.createElement(
					PanelBody,
					{ title: __("Settings", "wordpress-seo"), className: "blocks-font-size" },
					yoast._wp.element.createElement(TextControl, {
						label: __("Additional CSS Classes for list", "wordpress-seo"),
						value: additionalClasses,
						onChange: this.addCSSClasses,
						help: __("CSS classes to add to the list of steps (excluding the how-to header)", "wordpress-seo")
					}),
					yoast._wp.element.createElement(ToggleControl, {
						label: __("Unordered list", "wordpress-seo"),
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


			return yoast._wp.element.createElement(
				"div",
				{ className: "schema-how-to " + className },
				yoast._wp.element.createElement(RichText, {
					tagName: "h2",
					className: "schema-how-to-title",
					value: attributes.title,
					isSelected: this.state.focus === "title",
					setFocusedElement: function setFocusedElement() {
						return _this5.setFocus("title");
					},
					onChange: function onChange(title) {
						return setAttributes({ title: title });
					},
					onSetup: function onSetup(ref) {
						_this5.editorRefs.title = ref;
					},
					placeholder: __("Enter a title for your instructions", "wordpress-seo"),
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
						return setAttributes({ description: description });
					},
					onSetup: function onSetup(ref) {
						_this5.editorRefs.description = ref;
					},
					placeholder: __("Enter a description", "wordpress-seo"),
					keepPlaceholderOnFocus: true
				}),
				yoast._wp.element.createElement(
					"ul",
					{ className: "schema-how-to-steps " + attributes.additionalListCssClasses },
					this.getSteps()
				),
				yoast._wp.element.createElement(
					"div",
					{ className: "schema-how-to-buttons" },
					this.getAddStepButton()
				),
				this.getSidebar(attributes.unorderedList, attributes.additionalListCssClasses)
			);
		}
	}], [{
		key: "generateId",
		value: function generateId(prefix) {
			return prefix + "-" + new Date().getTime();
		}
	}, {
		key: "toJSONLD",
		value: function toJSONLD(attributes) {
			var jsonLD = {
				"@context": "http://schema.org",
				"@type": "HowTo",
				name: (0, _stringHelpers.stripHTML)(renderToString(attributes.title))
			};

			if (attributes.hasDuration) {
				jsonLD.totalTime = "PT" + (attributes.hours || 0) + "H" + (attributes.minutes || 0) + "M";
			}
			if (attributes.description && attributes.description.length > 0) {
				jsonLD.description = (0, _stringHelpers.stripHTML)(renderToString(attributes.description));
			}
			if (attributes.steps && attributes.steps.length > 0) {
				jsonLD.step = attributes.steps.map(function (step, index) {
					return _HowToStep2.default.toJSONLD(step, index);
				});
			}

			return jsonLD;
		}

		/**
   * Renders a JSON-LD representation of this How-to block.
   *
   * @param {object} attributes the attributes of the How-to block.
   *
   * @returns {Component} the JSON-LD representation, wrapped in a script tag of type "application/ld+json".
   */

	}, {
		key: "renderJSONLD",
		value: function renderJSONLD(attributes) {
			var stringified = JSON.stringify(this.toJSONLD(attributes), null, 3);

			/*
    * Gutenberg uses a slightly different JSON stringifier,
    * Combined with the fact that Gutenberg compares the stringified JSONs
    * By replacing all subsequent whitespaces with one space means that
    * Everything breaks when encountering "[ {" instead of "[{" etc.
    */
			stringified = stringified.replace(/\[[\s]+\{/g, "[{");

			return yoast._wp.element.createElement(
				"script",
				{ type: "application/ld+json" },
				stringified
			);
		}

		/**
   * Returns the component to be used to render
   * the How-to block on Wordpress (e.g. not in the editor).
   *
   * @param {object} attributes the attributes of the How-to block
   * @param {string} className  the class to apply to the root component.
   *
   * @returns {Component} the component representing a How-to block
   */

	}, {
		key: "getContent",
		value: function getContent(attributes, className) {
			var steps = attributes.steps,
			    title = attributes.title,
			    hours = attributes.hours,
			    minutes = attributes.minutes,
			    description = attributes.description,
			    unorderedList = attributes.unorderedList,
			    additionalListCssClasses = attributes.additionalListCssClasses;


			steps = steps ? steps.map(function (step) {
				return _HowToStep2.default.getContent(step);
			}) : null;

			return yoast._wp.element.createElement(
				Fragment,
				null,
				this.renderJSONLD(attributes),
				yoast._wp.element.createElement(
					"div",
					{ className: "schema-how-to " + className },
					yoast._wp.element.createElement(RichText.Content, {
						tagName: "h2",
						className: "schema-how-to-title",
						value: title,
						id: (0, _stringHelpers.stripHTML)(renderToString(title)).toLowerCase().replace(/\s+/g, "-")
					}),
					attributes.hasDuration && yoast._wp.element.createElement(
						"p",
						{ className: "schema-how-to-total-time" },
						__("Total time:", "wordpress-seo"),
						"\xA0",
						hours || 0,
						":",
						("00" + (minutes || 0)).slice(-2)
					),
					yoast._wp.element.createElement(RichText.Content, {
						tagName: "p",
						className: "schema-how-to-description",
						value: description
					}),
					unorderedList ? yoast._wp.element.createElement(
						"ul",
						{ className: "schema-how-to-steps " + additionalListCssClasses },
						steps
					) : yoast._wp.element.createElement(
						"ol",
						{ className: "schema-how-to-steps " + additionalListCssClasses },
						steps
					)
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

/***/ 2024:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(24);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _stringHelpers = __webpack_require__(1043);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _window$wp$element = window.wp.element,
    Component = _window$wp$element.Component,
    renderToString = _window$wp$element.renderToString;
var __ = window.wp.i18n.__;
var IconButton = window.wp.components.IconButton;
var _window$wp$editor = window.wp.editor,
    RichText = _window$wp$editor.RichText,
    MediaUpload = _window$wp$editor.MediaUpload;
var getBlockContent = window.wp.blocks.getBlockContent;

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

		_this.onSplit = _this.onSplit.bind(_this);
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
				!HowToStep.getImageSrc(step.contents) && yoast._wp.element.createElement(MediaUpload, {
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
							__("Add image", "wordpress-seo")
						);
					}
				}),
				yoast._wp.element.createElement(IconButton, {
					className: "schema-how-to-step-button editor-inserter__toggle",
					icon: "trash",
					label: __("Delete step", "wordpress-seo"),
					onClick: removeStep
				}),
				yoast._wp.element.createElement(IconButton, {
					className: "schema-how-to-step-button editor-inserter__toggle",
					icon: "insert",
					label: __("Insert step", "wordpress-seo"),
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
					label: __("Move step up", "wordpress-seo")
				}),
				!this.props.isLast && yoast._wp.element.createElement(IconButton, {
					className: "editor-block-mover__control",
					onClick: this.props.isLast ? null : this.props.onMoveDown,
					icon: "arrow-down-alt2",
					label: __("Move step down", "wordpress-seo")
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
			var contents = this.props.step.contents.slice();
			var image = yoast._wp.element.createElement("img", { key: media.id, alt: media.alt, src: media.url });

			if (contents.push) {
				contents.push(image);
			} else {
				contents = [contents, image];
			}

			this.props.onChange(contents);
		}

		/**
   * Splits this step into multiple steps.
   *
   * @param {array}        before The content before the split.
   * @param {array|string} after  The content after the split.
   * @param {WPBlock[]}    blocks The blocks that should be inserted at the split.
   *
   * @returns {void}
   */

	}, {
		key: "onSplit",
		value: function onSplit(before, after) {
			var newSteps = [];

			for (var _len = arguments.length, blocks = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
				blocks[_key - 2] = arguments[_key];
			}

			for (var i = 0; i < blocks.length; i++) {
				var block = blocks[i];

				// If list blocks are inserted split them into their values.
				if (block.name === "core/list") {
					newSteps = newSteps.concat(block.attributes.values.map(function (value) {
						return value.props.children;
					}));
					continue;
				}

				// Otherwise add the block.
				newSteps.push(getBlockContent(block));
			}

			if (after) {
				newSteps.push(after);
			}

			// If there"s no before then the first new step is this step.
			if (!before) {
				before = newSteps.pop();
			}

			this.props.onChange(before);

			newSteps.forEach(this.props.insertStep);
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
			    onChange = _props2.onChange,
			    onFocus = _props2.onFocus,
			    isSelected = _props2.isSelected,
			    editorRef = _props2.editorRef;
			var id = step.id,
			    contents = step.contents;


			return yoast._wp.element.createElement(
				"li",
				{ className: "schema-how-to-step", onFocus: onFocus },
				yoast._wp.element.createElement(
					"span",
					{ className: "schema-how-to-step-number" },
					index + 1,
					"."
				),
				yoast._wp.element.createElement(RichText, {
					onSetup: editorRef,
					key: id,
					value: contents,
					onChange: onChange,
					isSelected: isSelected,
					onSplit: this.onSplit,
					placeholder: __("Enter a step description", "wordpress-seo"),
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
   * Generates a JSON-LD representation of the given How-to step.
   *
   * @param {object} step          The how-to step.
   * @param {string} step.contents The text of the How-to step.
   * @param {number} index         The index of the step in the How-to block (or section).
   *
   * @returns {Object} the JSON-LD representation of the given step.
   */

	}, {
		key: "toJSONLD",
		value: function toJSONLD(step, index) {
			var jsonLD = {
				"@type": "HowToStep",
				position: (index + 1).toString(),
				text: (0, _stringHelpers.stripHTML)(renderToString(step.contents))
			};
			var imageSrc = HowToStep.getImageSrc(step.contents);

			if (imageSrc) {
				jsonLD.associatedMedia = {
					"@type": "ImageObject",
					contentUrl: imageSrc
				};
			}

			return jsonLD;
		}

		/**
   * Returns the component of the given How-to step to be rendered in a WordPress post
   * (e.g. not in the editor).
   *
   * @param {object} step The how-to step.
   *
   * @returns {Component} the component to be rendered.
   */

	}, {
		key: "getContent",
		value: function getContent(step) {
			return yoast._wp.element.createElement(RichText.Content, {
				tagName: "li",
				className: "schema-how-to-step",
				key: step.id,
				value: step.contents
			});
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

	isSelected: _propTypes2.default.bool,
	isFirst: _propTypes2.default.bool,
	isLast: _propTypes2.default.bool
};

/***/ }),

/***/ 24:
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
  module.exports = __webpack_require__(386)();
}


/***/ }),

/***/ 386:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(548);
var invariant = __webpack_require__(1017);
var ReactPropTypesSecret = __webpack_require__(387);

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

/***/ 387:
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


/***/ })

},[2021]);
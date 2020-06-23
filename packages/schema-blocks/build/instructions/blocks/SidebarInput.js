"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var element_1 = require("@wordpress/element");
var components_1 = require("@wordpress/components");
var BlockInstruction_1 = __importDefault(require("../../core/blocks/BlockInstruction"));
var SidebarBase_1 = __importDefault(require("./abstract/SidebarBase"));
/**
 * Sidebar input instruction
 */
var SidebarInput = /** @class */ (function (_super) {
    __extends(SidebarInput, _super);
    function SidebarInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Renders the sidebar.
     *
     * @param props The render props.
     * @param i     The number sidebar element this is.
     *
     * @returns The sidebar element.
     */
    SidebarInput.prototype.sidebar = function (props, i) {
        var _this = this;
        var attributes = {
            label: this.options.label,
            value: props.attributes[this.options.name],
            onChange: function (value) {
                var _a;
                return props.setAttributes((_a = {}, _a[_this.options.name] = _this.options.type === "number" ? parseInt(value, 10) : value, _a));
            },
            key: i,
        };
        if (this.options.help) {
            attributes.help = this.options.help;
        }
        if (this.options.type) {
            attributes.type = this.options.type;
        }
        return element_1.createElement(components_1.TextControl, attributes);
    };
    /**
     * Adds the sidebar input to the block configuration.
     *
     * @returns The block configuration.
     */
    SidebarInput.prototype.configuration = function () {
        var _a;
        return {
            attributes: (_a = {},
                _a[this.options.name] = {
                    type: this.options.type === "number" ? "number" : "string",
                },
                _a),
        };
    };
    /**
     * Renders the value of a sidebar input.
     *
     * @param props The render props.
     *
     * @returns The value of the sidebar input.
     */
    SidebarInput.prototype.value = function (props) {
        return props.attributes[this.options.name] || this.options.default || "";
    };
    return SidebarInput;
}(SidebarBase_1.default));
BlockInstruction_1.default.register("sidebar-input", SidebarInput);

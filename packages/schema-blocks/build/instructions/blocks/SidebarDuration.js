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
var moment_1 = __importDefault(require("moment"));
var element_1 = require("@wordpress/element");
var components_1 = require("@wordpress/components");
var BlockInstruction_1 = __importDefault(require("../../core/blocks/BlockInstruction"));
var SidebarBase_1 = __importDefault(require("./abstract/SidebarBase"));
var i18n_1 = require("@wordpress/i18n");
/**
 * Updates a duration.
 *
 * @param props    The props.
 * @param name     The attribute name.
 * @param duration The duration.
 */
function updateDuration(props, name, duration) {
    var _a, _b;
    if (!duration.isValid() || duration.asMinutes() === 0) {
        props.setAttributes((_a = {}, _a[name] = null, _a));
        return;
    }
    props.setAttributes((_b = {}, _b[name] = duration.toISOString(), _b));
}
/**
 * Sidebar input instruction
 */
var SidebarDuration = /** @class */ (function (_super) {
    __extends(SidebarDuration, _super);
    function SidebarDuration() {
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
    SidebarDuration.prototype.sidebar = function (props, i) {
        var _this = this;
        var labelPrefix = "", duration = moment_1.default.duration(NaN);
        if (typeof props.attributes[this.options.name] === "string") {
            duration = moment_1.default.duration(props.attributes[this.options.name]);
        }
        else if (typeof this.options.default === "string") {
            duration = moment_1.default.duration(this.options.default);
        }
        if (typeof this.options.label === "string") {
            labelPrefix = this.options.label + " ";
        }
        var hours = Math.floor(duration.asHours());
        var minutes = duration.minutes();
        var hourAttributes = {
            label: labelPrefix + i18n_1.__("hours", "wordpress-seo"),
            value: isNaN(hours) || hours === 0 ? "" : hours,
            onChange: function (value) {
                var newDuration = moment_1.default.duration({ hours: parseInt(value, 10), minutes: minutes || 0 });
                updateDuration(props, _this.options.name, newDuration);
            },
            type: "number",
        };
        var minuteAttributes = {
            label: labelPrefix + i18n_1.__("minutes", "wordpress-seo"),
            value: isNaN(minutes) || minutes === 0 ? "" : minutes,
            onChange: function (value) {
                var newDuration = moment_1.default.duration({ hours: hours || 0, minutes: parseInt(value, 10) });
                updateDuration(props, _this.options.name, newDuration);
            },
            type: "number",
        };
        if (this.options.help) {
            hourAttributes.help = this.options.help;
            minuteAttributes.help = this.options.help;
        }
        return element_1.createElement(element_1.Fragment, { key: i }, [
            element_1.createElement(components_1.TextControl, hourAttributes),
            element_1.createElement(components_1.TextControl, minuteAttributes),
        ]);
    };
    /**
     * Adds the sidebar input to the block configuration.
     *
     * @returns The block configuration.
     */
    SidebarDuration.prototype.configuration = function () {
        var _a;
        return {
            attributes: (_a = {},
                _a[this.options.name] = {
                    type: "string",
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
    SidebarDuration.prototype.value = function (props) {
        var duration = moment_1.default.duration(NaN);
        if (typeof props.attributes[this.options.name] === "string") {
            duration = moment_1.default.duration(props.attributes[this.options.name]);
        }
        else if (typeof this.options.default === "string") {
            duration = moment_1.default.duration(this.options.default);
        }
        if (!duration.isValid()) {
            return "";
        }
        return duration.humanize();
    };
    return SidebarDuration;
}(SidebarBase_1.default));
BlockInstruction_1.default.register("sidebar-duration", SidebarDuration);

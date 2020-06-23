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
var BlockInstruction_1 = __importDefault(require("../../core/blocks/BlockInstruction"));
/**
 * ClassName instruction.
 */
var ClassName = /** @class */ (function (_super) {
    __extends(ClassName, _super);
    function ClassName() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Renders the class name
     *
     * @param props The render props.
     *
     * @returns The class name.
     */
    ClassName.prototype.edit = function (props) {
        return props.className;
    };
    return ClassName;
}(BlockInstruction_1.default));
BlockInstruction_1.default.register("class-name", ClassName);

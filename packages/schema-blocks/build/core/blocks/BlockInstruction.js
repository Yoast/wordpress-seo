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
var Instruction_1 = __importDefault(require("../Instruction"));
/**
 * BlockInstruction class.
 */
var BlockInstruction = /** @class */ (function (_super) {
    __extends(BlockInstruction, _super);
    function BlockInstruction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    /**
     * Renders editing the element.
     *
     * @param props} props The props.
     * @param leaf  The leaf being rendered.
     * @param i      The number the rendered element is of it's parent.
     *
     * @returns {JSX.Element} The element to render.
     */
    BlockInstruction.prototype.save = function (props, leaf, i) {
        return null;
    };
    /**
     * Renders saving the element.
     *
     * @param props} props The props.
     * @param leaf  The leaf being rendered.
     * @param i      The number the rendered element is of it's parent.
     *
     * @returns {JSX.Element} The element to render.
     */
    BlockInstruction.prototype.edit = function (props, leaf, i) {
        return null;
    };
    /**
     * Renders the sidebar.
     *
     * @param props The props.
     * @param i      The number the rendered element is of it's parent.
     *
     * @returns The sidebar element to render.
     */
    BlockInstruction.prototype.sidebar = function (props, i) {
        return null;
    };
    /* eslint-enable @typescript-eslint/no-unused-vars */
    /**
     * Returns the configuration of this instruction.
     *
     * @returns The configuration.
     */
    BlockInstruction.prototype.configuration = function () {
        return {};
    };
    return BlockInstruction;
}(Instruction_1.default));
exports.default = BlockInstruction;

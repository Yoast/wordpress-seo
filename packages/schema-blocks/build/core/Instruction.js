"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Abstract instruction class.
 */
var Instruction = /** @class */ (function () {
    /**
     * Creates a render instruction.
     *
     * @param id      The id.
     * @param options The options.
     */
    function Instruction(id, options) {
        this.id = id;
        this.options = options;
    }
    /**
     * Returns the configuration of this instruction.
     *
     * @returns The configuration.
     */
    Instruction.prototype.configuration = function () {
        return {};
    };
    /**
     * Returns whether or not this instruction should be included in the tree.
     *
     * @returns Whether or not to render this instruction.
     */
    Instruction.prototype.renderable = function () {
        return true;
    };
    /**
     * Register a new instruction.
     *
     * @param this        This.
     * @param name        The name of the instruction.
     * @param instruction The instruction class.
     *
     * @returns {void}
     */
    Instruction.register = function (name, instruction) {
        if (typeof this.registeredInstructions === "undefined") {
            this.registeredInstructions = {};
        }
        this.registeredInstructions[name] = instruction;
    };
    /**
     * Creates an instruction instance.
     *
     * @param this    This.
     * @param name    The name of the instruction.
     * @param id      The id of the instance.
     * @param options The options of the instance.
     *
     * @returns The instruction instance.
     */
    Instruction.create = function (name, id, options) {
        if (options === void 0) { options = {}; }
        if (typeof this.registeredInstructions === "undefined") {
            this.registeredInstructions = {};
        }
        var klass = this.registeredInstructions[name];
        if (!klass) {
            console.error("Invalid instruction: ", name);
        }
        return new klass(id, options);
    };
    return Instruction;
}());
exports.default = Instruction;

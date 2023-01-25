import { InstructionOptions } from "../Instruction";
import BlockInstruction from "./BlockInstruction";

export type BlockInstructionClass = {
	new( id: number, options: InstructionOptions ): BlockInstruction;
	options: InstructionOptions;
};

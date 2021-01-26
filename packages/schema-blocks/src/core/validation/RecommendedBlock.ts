import { InstructionOptions } from "../Instruction";
import { SuggestedBlockProperties } from "./SuggestedBlockDefinition";

/**
 * Defines a recommended innerblock.
 */
export type RecommendedBlock = InstructionOptions & SuggestedBlockProperties & {
	name: string;
	warning?: string;
}

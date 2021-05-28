import { InstructionOptions } from "../Instruction";
import { SuggestedBlockProperties } from "./SuggestedBlockProperties";

/**
 * Defines a recommended innerblock.
 */
export type RecommendedBlock = InstructionOptions & SuggestedBlockProperties & {
	name: string;
	warning?: string;
}

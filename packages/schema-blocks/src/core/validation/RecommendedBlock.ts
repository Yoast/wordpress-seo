import { InstructionOptions } from "../Instruction";
import { SuggestedBlockProperties } from "./SuggestedBlockProperties";
import { RequiredBlockOption } from "./RequiredBlockOption";

/**
 * Defines a recommended innerblock.
 */
export type RecommendedBlock = InstructionOptions & SuggestedBlockProperties & {
	name: string;
	warning?: string;
	option: RequiredBlockOption;
}

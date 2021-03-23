import { InstructionOptions } from "../Instruction";
import { RequiredBlockOption } from "./RequiredBlockOption";
import { SuggestedBlockProperties } from "./SuggestedBlockProperties";

/**
 * Defines a recommended innerblock.
 */
export type RecommendedBlock = InstructionOptions & SuggestedBlockProperties & {
	name: string;
	warning?: string;
	option: RequiredBlockOption;
}

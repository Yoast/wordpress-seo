import { RequiredBlockOption } from ".";
import { SuggestedBlockDefinition } from "./SuggestedBlockDefinition";

/**
 * Defines a required innerblock.
 */
export class RequiredBlock implements SuggestedBlockDefinition {
	name: string;
	warning?: string
	option: RequiredBlockOption;
}

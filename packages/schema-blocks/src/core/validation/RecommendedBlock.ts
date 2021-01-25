import { SuggestedBlockDefinition } from "./SuggestedBlockDefinition";

/**
 * Defines a recommended innerblock.
 */
export class RecommendedBlock implements SuggestedBlockDefinition {
	name: string;
	warning?: string
}

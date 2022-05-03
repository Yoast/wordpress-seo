import { TemplateArray } from "@wordpress/blocks";
import { RecommendedBlock, RequiredBlock } from "../../core/validation";
import { InstructionObject, InstructionOptions } from "../../core/Instruction";

export type InnerBlocksInstructionOptions = InstructionOptions & {
	allowedBlocks: string[];
	template: TemplateArray;
	appender: string | false ;
	appenderLabel: string;
	requiredBlocks: RequiredBlock[];
	recommendedBlocks: RecommendedBlock[];
	warnings: InstructionObject;
};

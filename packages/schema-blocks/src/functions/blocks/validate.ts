import { Block } from "@wordpress/block-editor";

export type BlockValidationResult {
    valid: boolean,
    message: string,
};

export default function validate(blocks: Block[]): Record<string, BlockValidationResult> {

}

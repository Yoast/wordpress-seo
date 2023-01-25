import { BlockInstance } from "@wordpress/blocks";

// Reason: this type is inherited from WordPress
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type WarningBlockAttributes = Record<string, any> & {
	removedBlock: BlockInstance;
	isRequired: boolean;
	warningText: string;
};

import { BlockConfiguration } from "@wordpress/blocks";

/*
 * Adds the `variations` property to the BlockConfiguration type.
 *
 * See https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#variations-optional
 * for other options.
 */
export type BlockVariation = {
	name?: string;
	title?: string;
	description?: string;
	icon?: string | object;
	isDefault?: boolean;
	innerBlocks?: string[];
};

export type ExtendedBlockConfiguration = BlockConfiguration & {
	variations: BlockVariation[];
};

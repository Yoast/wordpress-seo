import { BlockConfiguration } from "@wordpress/blocks";
import { edit } from "./edit";

export const WarningBlock: BlockConfiguration = {
	/**
	 * The title. It's not translatable, since we don't want to show the warning block in the block inserter.
	 */
	title: "Warning",

	/**
	 * The category is there to help users browse and discover blocks.
	 * We actually don't want the warning block to be discoverable, but category is not optional.
	 */
	category: "common",

	/**
	 * The attributes.
	 */
	attributes: {
		removedBlock: {
			type: "object",
		},
		warningText: {
			type: "string",
		},
		isRequired: {
			type: "boolean",
		},
	},

	/**
	 * Make sure that users cannot add this block manually.
	 */
	supports: {
		inserter: false,
	},

	/**
	 * Renders editing the warning block.
	 *
	 * @param props The properties.
	 *
	 * @return The rendered component.
	 */
	edit,

	/**
	 * Renders null, because the warning block isn't output on the frontend.
	 *
	 * @return null
	 */
	save(): JSX.Element {
		return null;
	},
};

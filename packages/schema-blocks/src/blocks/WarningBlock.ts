import { __ } from "@wordpress/i18n";
import { BlockConfiguration } from "@wordpress/blocks";
import { createElement } from "@wordpress/element";
import { RenderEditProps } from "../core/blocks/BlockDefinition";

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
			type: "string",
		},
		removedAttributes: {
			type: "object",
		},
		warningText: {
			type: "string",
		},
		required: {
			type: "boolean",
		},
	},

	/**
	 * Makes sure users cannot select this block.
	 */
	// Parent: [ '' ],

	/**
	 * Renders editing the warning block.
	 *
	 * @param props The properties.
	 *
	 * @return The rendered component.
	 */
	edit( props: RenderEditProps ): JSX.Element {
		const { attributes: { removedBlock, removedAttributes, warningText, required } } = {
			attributes: {
				removedBlock: "Recipe",
				removedAttributes: {},
				warningText: "You have removed the Recipe block, but this is a required block for Schema output. Do you want this?",
				required: true,
			},
		};

		return createElement(
			"div",
			{
				className: [ "yoast-warning-block", required ? "required" : "recommended" ].join( " " ),
			},
			[
				createElement(
					"p",
					{
						className: "yoast-warning-block-message",
					},
					warningText,
				),
				createElement(
					"div",
					{},
					[
						createElement(
							"button",
							{},
							__( "Yes" ),
						),
						createElement(
							"button",
							{},
							__( "No, please undo this" ),
						),
					],
				),
			],
		);
	},

	/**
	 * Renders null, because the warning block isn't output on the frontend.
	 *
	 * @return null
	 */
	save(): JSX.Element {
		return null;
	},
};

import { __ } from "@wordpress/i18n";
import { BlockConfiguration } from "@wordpress/blocks";
import { createElement } from "@wordpress/element";
import { RenderEditProps } from "../core/blocks/BlockDefinition";

export const WarningBlock: BlockConfiguration = {
	/**
	 * This is the display title for your block, which can be translated with `i18n` functions.
	 * The block inserter will show this name.
	 */
	title: __( "Warning", "warning" ),

	/**
	 * Blocks are grouped into categories to help users browse and discover them.
	 * The categories provided by core are `common`, `embed`, `formatting`, `layout` and `widgets`.
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

	// Make sure users cannot select this block.
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

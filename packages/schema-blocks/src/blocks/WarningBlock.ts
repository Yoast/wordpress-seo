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
		const { attributes: { removedBlock, removedAttributes } } = props;

		return createElement(
			"div",
			{
				style: {
					background: "#F8EBEA",
					border: "#CD423B solid",
					"border-width": "0 0 0 4px",
					padding: "16px",
					"font-size": "13",
					"font-family": "Arial, Roboto-Regular, HelveticaNeue, sans-serif",
				},
			},
			[
				createElement(
					"p",
					{
						style: {
							margin: "0",
							"font-family": "Arial, Roboto-Regular, HelveticaNeue, sans-serif",
						},
					},
					`You've just removed the ${ removedBlock }, which is required for Schema output.
			Now your Post title is used as ${ removedBlock }. Do you want this?`,
				),
				createElement(
					"div",
					{
						style: {
							"text-align": "right",
							"padding-top": "8px",
						},
					},
					[
						createElement(
							"button",
							{
								style: {
									"margin-right": "24px",
									background: "none",
									border: "none",
									"text-decoration": "underline",
									color: "#0073aa",
								},
							},
							"Yes",
						),
						createElement(
							"button",
							{
								style: {
									background: "none",
									border: "none",
									"text-decoration": "underline",
									color: "#0073aa",
								},
							},
							"No, please undo this",
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

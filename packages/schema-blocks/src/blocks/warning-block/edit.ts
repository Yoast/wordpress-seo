import { createElement } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { restoreBlock } from "./restoreBlock";
import { RenderEditProps } from "../../core/blocks/BlockDefinition";

/**
 * Renders the edit of the warning block.
 */
export function edit( props: RenderEditProps ): JSX.Element {
	const { attributes: { removedBlock, removedAttributes, warningText, required } } = {
		attributes: {
			removedBlock: "core/paragraph",
			removedAttributes: { content: "test" },
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
						__( "Yes", "wordpress-seo" ),
					),
					createElement(
						"button",
						{
							onClick: () => {
								restoreBlock( removedBlock, removedAttributes );
							},
						},
						__( "No, please undo this", "wordpress-seo" ),
					),
				],
			),
		],
	);
}



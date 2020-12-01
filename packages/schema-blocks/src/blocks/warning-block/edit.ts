import { createElement } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import restoreBlock from "./restoreBlock";
import removeBlock from "./removeBlock";
import { RenderEditProps } from "../../core/blocks/BlockDefinition";

/**
 * Renders the edit of the warning block.
 *
 * @param {RenderEditProps} props The render edit props of this block.
 *
 * @returns {JSX.Element} The React element.
 */
export function edit( props: RenderEditProps ): JSX.Element {
	const { clientId } = props;

	const { removedBlock, removedAttributes, warningText, isRequired } = props.attributes;

	return createElement(
		"div",
		{
			key: "warning-div",
			className: [ "yoast-warning-block", isRequired ? "required" : "recommended" ].join( " " ),
		},
		[
			createElement(
				"p",
				{
					key: "warning-paragraph",
					className: "yoast-warning-block-message",
					dangerouslySetInnerHTML: {
						__html: warningText,
					},
				},
			),
			createElement(
				"div",
				{
					key: "buttons-div",
				},
				[
					createElement(
						"button",
						{
							key: "button-yes",
							onClick: () => {
								removeBlock( clientId );
							},
						},
						__( "Yes", "wordpress-seo" ),
					),
					createElement(
						"button",
						{
							key: "button-no",
							onClick: () => {
								restoreBlock( clientId, removedBlock as string, removedAttributes as object );
							},
						},
						__( "No, please undo this", "wordpress-seo" ),
					),
				],
			),
		],
	);
}



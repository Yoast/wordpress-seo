import {__} from "@wordpress/i18n";
import { BlockConfiguration } from "@wordpress/blocks";
import { createElement } from "@wordpress/element";
import {RenderEditProps} from "../core/blocks/BlockDefinition";

export const WarningBlock:BlockConfiguration = {
	/**
	 * This is the display title for your block, which can be translated with `i18n` functions.
	 * The block inserter will show this name.
	 */
	title: __( 'Warning', 'warning' ),

	/**
	 * Blocks are grouped into categories to help users browse and discover them.
	 * The categories provided by core are `common`, `embed`, `formatting`, `layout` and `widgets`.
	 */
	category: 'common',

	/**
	 * The attributes.
	 */
	attributes: {
		message: {
			type: 'string',
			source: 'text',
			selector: 'div',
		},
	},

	// Make sure users cannot select this block.
	//parent: [ '' ],

	/**
	 * Renders editing the warning block.
	 */
	edit( props: RenderEditProps ): JSX.Element {
		return createElement(
			'div',
			{'name': 'block'},
			'You\'ve just removed the Recipe name, which is required for Schema output. Now your Post title is used as Recipe name. Do you want this?'
		);

	},

	/**
	 * Renders null, because the warning block isn't output on the frontend.
	 */
	save(): JSX.Element {
		return null;
	}
};

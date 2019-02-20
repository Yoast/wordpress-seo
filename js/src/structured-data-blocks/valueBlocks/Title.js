/* External dependencies */
import { Component } from "react";
import PropTypes from "prop-types";
import { InnerBlocks } from "@wordpress/editor";

/**
 * Represents a Title block within the schema blocks.
 */
export default class Title extends Component {

	/**
	 * Renders the title block for the block editor.
	 *
	 * @returns {ReactElement} The rendered title edit.
	 */
	render() {
		return (
			<InnerBlocks
				allowedBlocks={ [ "core/heading" ] }
				templateLock={ true }
				template={ [ [ "core/heading", {}, [] ] ] }
			/>
		);
	}

	/**
	 * Renders the title block for the front end.
	 *
	 * @returns {ReactElement} The rendered HTML for the frontend.
	 */
	static Content() {
		return <InnerBlocks.Content />;
	}
}

Title.propTypes = {
	setAttributes: PropTypes.func.isRequired,
};

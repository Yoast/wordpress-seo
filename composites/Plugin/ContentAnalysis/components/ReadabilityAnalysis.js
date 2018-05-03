// External dependencies.
import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";

// Internal dependencies.
import HelpText, { helpTextPropType } from "../../Shared/components/HelpText";
import LanguageNotice, { languageNoticePropType } from "../../Shared/components/LanguageNotice";
import ContentAnalysis, { contentAnalysisPropType } from "./ContentAnalysis";

export default class ReadabilityAnalysis extends PureComponent {
	/**
	 * Creates the ReadabilityAnalysis component.
	 *
	 * @param {Object} props The passed props.
	 *
	 * @returns {ReactElement} The ReadabilityAnalysis component.
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * Renders the seo analysis.
	 *
	 * @returns {ReactElement} The rendered seo analysis.
	 */
	render() {
		const { helpText, languageNotice, contentAnalysis } = this.props;

		return (
			<Fragment>
				<HelpText { ...helpText } />
				<LanguageNotice { ...languageNotice } />
				<ContentAnalysis { ...contentAnalysis } />
			</Fragment>
		);
	}
}

ReadabilityAnalysis.propTypes = {
	helpText: PropTypes.shape( helpTextPropType ),
	languageNotice: PropTypes.shape( languageNoticePropType ),
	contentAnalysis: PropTypes.shape( contentAnalysisPropType ),
};

ReadabilityAnalysis.defaultProps = {
};

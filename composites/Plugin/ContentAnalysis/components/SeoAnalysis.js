// External dependencies.
import React, { PureComponent, Fragment } from "react";

// Internal dependencies.
import HelpText, { HelpTextPropType } from "../../Shared/components/HelpText";
import Separator from "../../Shared/components/Separator";
import KeywordInput, { KeywordInputPropType } from "../../Shared/components/KeywordInput";
import ContentAnalysis, { ContentAnalysisPropType } from "./ContentAnalysis";

export default class SeoAnalysis extends PureComponent {
	/**
	 * Creates the SeoAnalysis component.
	 *
	 * @param {Object} props The passed props.
	 *
	 * @returns {ReactElement} The SeoAnalysis component.
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
		const { helpText, keywordInput, contentAnalysis } = this.props;

		return (
			<Fragment>
				<HelpText text={ helpText } />
				<Separator />
				<KeywordInput { ...keywordInput } />
				<ContentAnalysis { ...contentAnalysis } />
			</Fragment>
		);
	}
}

SeoAnalysis.propTypes = {
	helpText: HelpTextPropType,
	keywordInput: KeywordInputPropType,
	contentAnalysis: ContentAnalysisPropType,
};

SeoAnalysis.defaultProps = {
};

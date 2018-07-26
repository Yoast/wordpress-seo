import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Results from "./Results";
import UpsellBox from "../UpsellBox";
import { Collapsible } from "yoast-components/composites/Plugin/Shared/components/Collapsible";
import KeywordInput from "yoast-components/composites/Plugin/Shared/components/KeywordInput";
import { setActiveKeyword } from "../../redux/actions/activeKeyword";

/**
 * Redux container for the seo analysis.
 */
class SeoAnalysis extends React.Component {
	render() {
		return (
			<React.Fragment>
				<Collapsible
					title="Focus keyword analysis"
				>
					<KeywordInput
						id="focus-keyword-input"
						label="Focus keyword"
						keyword={ this.props.keyword }
						onChange={ this.props.onKeywordChange }
					/>
					<Results
						showLanguageNotice={ false }
						results={ this.props.results }
						marksButtonClassName="yoast-tooltip yoast-tooltip-s"
						marksButtonStatus={ this.props.marksButtonStatus }
					/>
				</Collapsible>
				<Collapsible
					title="Add another keyword"
				>
					<UpsellBox
						benefits={ this.props.upsell.benefits }
						infoParagraphs={ this.props.upsell.infoParagraphs }
						upsellButtonText={ this.props.upsell.buttonText }
						upsellButton={ {
							href: this.props.upsell.buttonLink,
							className: "button button-primary",
							"aria-labelledby": "label-id",
						} }
						upsellButtonLabel={ this.props.upsell.buttonLabel }
					/>
				</Collapsible>
			</React.Fragment>
		);
	}
}

SeoAnalysis.propTypes = {
	results: PropTypes.array,
	marksButtonStatus: PropTypes.string,
	hideMarksButtons: PropTypes.bool,
	upsell: PropTypes.shape( {
		benefits: PropTypes.array,
		infoParagraphs: PropTypes.array,
		buttonLink: PropTypes.string,
		buttonText: PropTypes.string,
		buttonLabel: PropTypes.string,
	} ),
};

/**
 * Maps redux state to SeoAnalysis props.
 *
 * @param {Object} state The redux state.
 * @param {Object} ownProps The component's props.
 *
 * @returns {Object} Props that should be passed to SeoAnalysis.
 */
function mapStateToProps( state, ownProps ) {
	const marksButtonStatus = ownProps.hideMarksButtons ? "disabled" : state.marksButtonStatus;

	let results = null;
	let keyword = state.activeKeyword;
	if( state.analysis.seo[ state.activeKeyword ] ) {
		results = state.analysis.seo[ state.activeKeyword ].results;
	}

	return {
		results,
		keyword,
		marksButtonStatus: marksButtonStatus,
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		onKeywordChange: ( value ) => {
			dispatch( setActiveKeyword( value ) );
		},
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( SeoAnalysis );

import SEOAssessor from "../seoAssessor.js";
import MetaDescriptionLengthAssessment from "../../assessments/seo/MetaDescriptionLengthAssessment.js";
import TextLengthAssessment from "../../assessments/seo/TextLengthAssessment.js";
import PageTitleWidthAssessment from "../../assessments/seo/PageTitleWidthAssessment.js";
import SlugKeywordAssessment from "../../assessments/seo/UrlKeywordAssessment.js";
import SubHeadingsKeywordAssessment from "../../assessments/seo/SubHeadingsKeywordAssessment.js";

/**
 * The CornerstoneSEOAssessor class is used for the SEO analysis for cornerstone content.
 */
export default class CornerstoneSEOAssessor extends SEOAssessor {
	/**
	 * Creates a new CornerstoneSEOAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "cornerstoneSEOAssessor";

		this.addAssessment( "metaDescriptionLength", new MetaDescriptionLengthAssessment( {
			scores: { tooLong: 3, tooShort: 3 },
		} ) );
		this.addAssessment( "textLength", new TextLengthAssessment( {
			recommendedMinimum: 900,
			slightlyBelowMinimum: 400,
			belowMinimum: 300,
			scores: { belowMinimum: -20, farBelowMinimum: -20 },
			cornerstoneContent: true,
		} ) );
		this.addAssessment( "titleWidth", new PageTitleWidthAssessment( {
			scores: { widthTooShort: 9 },
		}, true ) );
		this.addAssessment( "slugKeyword", new SlugKeywordAssessment( {
			scores: { okay: 3 },
		} ) );
		this.addAssessment( "subheadingsKeyword", new SubHeadingsKeywordAssessment( {
			cornerstoneContent: true,
			parameters: { recommendedMaximumLength: 250 },
		} ) );
	}
}

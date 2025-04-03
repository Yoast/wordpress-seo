import SEOAssessor from "../seoAssessor";
import MetaDescriptionLengthAssessment from "../../assessments/seo/MetaDescriptionLengthAssessment";
import KeyphraseInImagesAssessment from "../../assessments/seo/KeyphraseInImageTextAssessment";
import TextLengthAssessment from "../../assessments/seo/TextLengthAssessment";
import OutboundLinksAssessment from "../../assessments/seo/OutboundLinksAssessment";
import PageTitleWidthAssessment from "../../assessments/seo/PageTitleWidthAssessment";
import SlugKeywordAssessment from "../../assessments/seo/UrlKeywordAssessment";

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
		this.addAssessment( "imageKeyphrase", new KeyphraseInImagesAssessment( {
			scores: { withAltNonKeyword: 3, withAlt: 3, noAlt: 3 },
		} ) );
		this.addAssessment( "textLength", new TextLengthAssessment( {
			recommendedMinimum: 900,
			slightlyBelowMinimum: 400,
			belowMinimum: 300,
			scores: { belowMinimum: -20, farBelowMinimum: -20 },
			cornerstoneContent: true,
		} ) );
		this.addAssessment( "externalLinks", new OutboundLinksAssessment( {
			scores: { noLinks: 3 },
		} ) );
		this.addAssessment( "titleWidth", new PageTitleWidthAssessment( {
			scores: { widthTooShort: 9 },
		}, true ) );
		this.addAssessment( "slugKeyword", new SlugKeywordAssessment( {
			scores: { okay: 3 },
		} ) );
	}
}

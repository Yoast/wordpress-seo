import { selectorsFactory } from "@yoast/social-metadata-forms";

const socialSelectors = selectorsFactory( "socialReducer" );

const fallbackSelectors = {

	getTitleFallback: state => state.analysisData.snippet.title,

	getDescriptionFallback: state => state.analysisData.snippet.description,

	getImageUrlFallback: state => state.settings.socialpreviews.sideWideImage,

};

export { socialSelectors, fallbackSelectors };

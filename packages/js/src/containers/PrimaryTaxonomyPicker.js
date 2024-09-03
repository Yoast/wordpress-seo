import {
	withSelect,
	withDispatch,
} from "@wordpress/data";
import { compose } from "@wordpress/compose";
import PrimaryTaxonomyPicker from "../components/PrimaryTaxonomyPicker";

export default compose( [
	withSelect( ( select, props ) => {
		const editorData = select( "core/editor" );
		const yoastData = select( "yoast-seo/editor" );

		const { taxonomy } = props;

		const selectedTermIds = editorData.getEditedPostAttribute( taxonomy.restBase ) || [];

		return {
			selectedTermIds,
			primaryTaxonomyId: yoastData.getPrimaryTaxonomyId( taxonomy.name ),
			learnMoreLink: yoastData.selectLink( "https://yoa.st/primary-category-more" ),
		};
	} ),
	withDispatch( dispatch => {
		const {
			setPrimaryTaxonomyId,
			updateReplacementVariable,
		} = dispatch( "yoast-seo/editor" );

		return {
			setPrimaryTaxonomyId,
			updateReplacementVariable,
		};
	} ),
] )( PrimaryTaxonomyPicker );

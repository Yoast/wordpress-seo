import PropTypes from "prop-types";

import { ContentTypePropTypes } from "../../../prop-types";
import Page from "../../page";
import SingleSettings from "./single-settings";
import ArchiveSettings from "./archive-settings";

/**
 * @param {Object} props Props object.
 * @param {ContentTypeOptions} props.options Options for content type.
 * @param {string} props.contentTypeKey Key of content type in content types object in Redux store.
 * @returns {JSX.Element} Content Type Page component.
 */
const ContentType = ( { options, contentTypeKey } ) => {
	const {
		label,
		hasSinglePage,
		hasArchive,
	} = options;
	return (
		<Page title={ label }>
			{ hasSinglePage && <SingleSettings options={ options } contentTypeKey={ contentTypeKey } /> }
			{ hasArchive && <ArchiveSettings options={ options } contentTypeKey={ contentTypeKey } /> }
		</Page>
	);
};

ContentType.propTypes = {
	options: ContentTypePropTypes.options.isRequired,
	contentTypeKey: PropTypes.string.isRequired,
};

export default ContentType;

import PropTypes from "prop-types";
import { useDispatch, useSelect } from "@wordpress/data";
import { Slot } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { HelpText } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";
import { SEO_STORE_NAME } from "@yoast/seo-store";

import MetaboxCollapsible from "../../components/MetaboxCollapsible";
import CornerstoneToggle from "../../components/CornerstoneToggle";

const LearnMoreLink = makeOutboundLink();

/**
 * Renders the 'Cornerstone content' collapsible.
 *
 * @param {string} cornerstoneContentInfoLink A URL to a page to read more about cornerstone content.
 *
 * @returns {JSX.Element} The collapsible cornerstone toggle component.
 */
const CornerstoneContent = ( { cornerstoneContentInfoLink } ) => {
	const isCornerstone  = useSelect( select => select( SEO_STORE_NAME ).selectIsCornerstone() );
	const { updateIsCornerstone } = useDispatch( SEO_STORE_NAME );

	return (
		<MetaboxCollapsible
			id="yoast-cornerstone-collapsible-metabox"
			title={ __( "Cornerstone content", "wordpress-seo" ) }
		>
			<HelpText>
				{ __( "Cornerstone content should be the most important and extensive articles on your site.", "wordpress-seo" ) + " " }
				<LearnMoreLink href={ cornerstoneContentInfoLink }>
					{ __( "Learn more about Cornerstone Content.", "wordpress-seo" ) }
				</LearnMoreLink>
			</HelpText>
			<CornerstoneToggle
				id="yoast-cornerstone-metabox"
				isEnabled={ isCornerstone }
				onToggle={ updateIsCornerstone }
			/>
			<Slot name="YoastAfterCornerstoneToggle" />
		</MetaboxCollapsible>
	);
};

CornerstoneContent.propTypes = {
	cornerstoneContentInfoLink: PropTypes.string.isRequired,
};

export default CornerstoneContent;

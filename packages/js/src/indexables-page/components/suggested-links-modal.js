import PropTypes from "prop-types";
import { Badge } from "@yoast/ui-library";
import { IndexableLinkCount } from "../indexables-page";
import { IndexableTitleLink } from "../indexables-page";

/* eslint-disable camelcase */
/**
 * Returns the content of the modal to be shown when 'Add links' button is clicked.
 *
 * @param {object} suggestedLinksModalContent The data used in the modal.
 * @param {JSX.node} children The React children.

 * @returns {WPElement} A modal showing either the links suggestions.
 */
const SuggestedLinksModal = ( { suggestedLinksModalContent, children } ) => {
	return (
		<div className="yst-grid yst-grid-cols-1">
			<h3 className="yst-mb-4 yst-text-xl yst-text-gray-900 yst-font-medium">
				Add incoming links
				<Badge
					variant="upsell"
					className="yst-text-[10px] yst-text-amber-900 yst-font-semibold yst-h-4 yst-ml-2"
				>
					Premium
				</Badge>
			</h3>
			<h4 className="yst-mb-2 yst-text-base yst-text-gray-900 yst-font-medium">
				To:
			</h4>
			<div className="yst-flex yst-text-gray-700 yst-mb-6 yst-items-center">
				<IndexableLinkCount count={ parseInt( suggestedLinksModalContent.incomingLinksCount, 10 ) } />
				<IndexableTitleLink
					indexable={
						{
							permalink: suggestedLinksModalContent.permalink,
							breadcrumb_title: suggestedLinksModalContent.breadcrumbTitle,
							object_sub_type: null,
						}
					}
					showType={ false }
				/>
			</div>
			<h4 className="yst-mb-2 yst-text-base yst-text-gray-900 yst-font-medium">
				From suggested posts:
			</h4>
			{ children }
		</div>
	);
};

SuggestedLinksModal.propTypes = {
	suggestedLinksModalContent: PropTypes.object,
	children: PropTypes.node,
};

/* eslint-enable camelcase */
export default SuggestedLinksModal;

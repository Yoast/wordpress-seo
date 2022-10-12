/* global wpseoIndexablesPageData */
import PropTypes from "prop-types";
import { IndexableLinkCount } from "../indexables-page";
import { IndexableTitleLink } from "./indexable-title-link";
import SvgIcon from "../../../../components/src/SvgIcon";
import { range } from "lodash";
import { __, sprintf } from "@wordpress/i18n";
import { ArrowNarrowRightIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { Alert, Badge, Button } from "@yoast/ui-library";
import { addLinkToString } from "../../helpers/stringHelpers";

/* eslint-disable camelcase */
/**
 * Returns the content of the modal to be shown when 'Add links' button is clicked.
 *
 * @param {object} suggestedLinksModalData The data used in the modal.
 * @param {boolean} isPremium Wether is Yoast SEO Premium installed or not.

 * @param {JSX.node} children The React children.

 * @returns {WPElement} A modal showing either the links suggestions.
 */
const SuggestedLinksModalContent = ( { suggestedLinksModalData, isPremium, children } ) => {
	return (
		<div className="yst-grid yst-grid-cols-1">
			<h3 className="yst-mb-4 yst-text-xl yst-text-gray-900 yst-font-medium">
				Add incoming links
				{ ( ! isPremium ) && <Badge
					variant="upsell"
					className="yst-text-[10px] yst-text-amber-900 yst-font-semibold yst-h-4 yst-ml-2"
				>
					Premium
				</Badge> }
			</h3>
			<h4 className="yst-mb-2 yst-text-base yst-text-gray-900 yst-font-medium">
				To:
			</h4>
			<div className="yst-flex yst-text-gray-700 yst-mb-6 yst-items-center">
				<IndexableLinkCount count={ parseInt( suggestedLinksModalData.incomingLinksCount, 10 ) } />
				<IndexableTitleLink
					indexable={
						{
							permalink: suggestedLinksModalData.permalink,
							breadcrumb_title: suggestedLinksModalData.breadcrumbTitle,
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

SuggestedLinksModalContent.propTypes = {
	suggestedLinksModalData: PropTypes.object,
	isPremium: PropTypes.bool,
	children: PropTypes.node,
};

/**
 * Renders the content of the modal.
 *
 * @param {boolean} isLinkSuggestionsEnabled Wether the link suggestion feature is enabled or not.
 * @param {boolean} isPremium                Wether is Yoast SEO Premium installed or not.
 * @param {object}  suggestedLinksModalData  The data used in the modal.

 * @param {JSX.node} children The React children.

 * @returns {WPElement} A modal showing either the links suggestions.
 */
const SuggestedLinksModal = ( { isLinkSuggestionsEnabled, isPremium, suggestedLinksModalData } ) => {
	if ( suggestedLinksModalData === null ) {
		return <SvgIcon icon="loading-spinner" />;
	}

	if ( suggestedLinksModalData.error !== null ) {
		return (
			<Alert variant="error">
				{
					sprintf(
						// Translators: %s expands to the error message.
						__( "An error occurred while fetching the suggested links list: %s", "wordpress-seo" ),
						suggestedLinksModalData.error
					)
				}
			</Alert>
		);
	}
	if ( ! isLinkSuggestionsEnabled ) {
		return <SuggestedLinksModalContent suggestedLinksModalData={ suggestedLinksModalData } isPremium={ isPremium }>
			<Alert>
				{
					addLinkToString(
						// translators: %1$s and %2$s are replaced by opening and closing anchor tags.
						sprintf(
							__( "You've disabled the 'Link suggestions' feature. " +
								"Enable this feature on the %1$sFeatures tab%2$s if you want to see suggested posts to link from.", "wordpress-seo" ),
							"<a>",
							"</a>" ),
						"/wp-admin/admin.php?page=wpseo_dashboard#top#features"
					)
				}
			</Alert>
		</SuggestedLinksModalContent>;
	}

	if ( ! isPremium ) {
		return (
			<SuggestedLinksModalContent suggestedLinksModalData={ suggestedLinksModalData } isPremium={ isPremium }>
				<div className="yst-mb-3.5 yst-text-justify">
					{
						addLinkToString(
							// translators: %1$s and %2$s are replaced by opening and closing anchor tags.
							sprintf(
								__( "Get relevant internal linking suggestions with Yoast SEO Premium! " +
									"This feature will show you posts on your site with similar content that might be interesting to link from. " +
									"%1$sRead more about how internal linking can improve your site structure%2$s.", "wordpress-seo" ),
								"<a>",
								"</a>" ),
							wpseoIndexablesPageData.shortlinks.internalLinks
						)
					}
				</div>
				<div className="yst-grow-0 yst-mb-4">
					<Button
						id="indexables-page-suggested-links-upsell-button"
						type="button"
						as="a"
						href={ wpseoIndexablesPageData.shortlinks.getPremium }
						variant="upsell"
						className="yst-text-gray-800"
						target="_blank"
					>
						{ __( "Unlock with Premium!", "wordpress-seo" ) }
						<span className="yst-sr-only">
							{
								__( "(Opens in a new browser tab)", "wordpress-seo" )
							}
						</span>
						<ArrowNarrowRightIcon
							className="yst-ml-2 yst-h-5 yst-w-5 yst-text-yellow-900"
						/>
					</Button>
				</div>
				<ul className="yst-divide-y yst-divide-gray-200">
					{ range( 1, 6 ).map( ( elem, idx ) => {
						return <li
							key={ `suggested-${idx}` }
							className="yst-my-0 yst-max-w-none yst-font-medium yst-text-gray-400 yst-flex yst-flex-row yst-items-center yst-gap-3 yst-h-14"
						>
							<span className=" yst-flex yst-grow">
								{ `Suggested post to link from ${elem}` }
								<ExternalLinkIcon className="yst-h-4 yst-w- yst-ml-2" />
							</span>
							<Button className="yst-items-end" variant="secondary" disabled={ true }>{ __( "Edit", "wordpress-seo" ) }</Button>
						</li>;
					} )
					}
				</ul>
			</SuggestedLinksModalContent>
		);
	}

	if ( suggestedLinksModalData.linksList.length === 0 ) {
		return <SuggestedLinksModalContent suggestedLinksModalData={ suggestedLinksModalData } isPremium={ isPremium }>
			<p className="yst-italic yst-mb-2">No suggestions available</p>
		</SuggestedLinksModalContent>;
	}

	return (
		<SuggestedLinksModalContent suggestedLinksModalData={ suggestedLinksModalData } isPremium={ isPremium }>
			<ul className="yst-divide-y yst-divide-gray-200">
				{
					suggestedLinksModalData.linksList.map( ( link, idx ) => {
						return <li
							key={ `suggested-${idx}` }
							className="yst-my-0 yst-max-w-none yst-font-medium yst-text-gray-700 yst-flex yst-flex-row yst-items-center yst-gap-3 yst-h-14"
						>
							<span className=" yst-flex yst-grow">
								<IndexableTitleLink showType={ false } indexable={ link } />
							</span>
							<Button
								className="yst-items-end yst-text-gray-700"
								type="button"
								as="a"
								href={ "/wp-admin/post.php?action=edit&post=" + link.object_id }
								target="_blank"
								rel="noopener noreferrer"
								variant="secondary"
							>
								{ __( "Edit", "wordpress-seo" ) }
							</Button>
						</li>;
					}
					)
				}
			</ul>
		</SuggestedLinksModalContent>
	);
};

SuggestedLinksModal.propTypes = {
	isLinkSuggestionsEnabled: PropTypes.bool,
	isPremium: PropTypes.bool,
	suggestedLinksModalData: PropTypes.shape( {
		linksList: PropTypes.arrayOf( PropTypes.object ),
		error: PropTypes.string,
	} ),
};

/* eslint-enable camelcase */
export default SuggestedLinksModal;

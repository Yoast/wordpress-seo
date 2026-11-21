import { __ } from "@wordpress/i18n";
import SearchIcon from "@heroicons/react/outline/SearchIcon";
import { Button } from "@yoast/ui-library";

/**
 * Renders the "Discover related keyphrases" button.
 *
 * When logged in the button triggers the modal directly.
 * When not logged in it opens the SEMrush OAuth popup first.
 *
 * @param {Object} props Component props.
 * @param {boolean} [props.isLoggedIn=false] Whether a user has logged into their Semrush account.
 * @param {string} props.location The location of the button, either "metabox" or "sidebar".
 * @param {Function} props.onModalOpen The function to call when the modal should be opened.
 * @param {Function} props.onLinkClick The function to call when the link is clicked.
 *
 * @returns {JSX.Element} The "Discover related keyphrases" button.
 */
export const RelatedKeyphraseButton = ( { isLoggedIn = false, location, onModalOpen, onLinkClick } ) => {
	const buttonProps = isLoggedIn
		? { onClick: onModalOpen }
		: {
			as: "a",
			href: "https://oauth.semrush.com/oauth2/authorize?" +
				"ref=1513012826&client_id=yoast&redirect_uri=https%3A%2F%2Foauth.semrush.com%2Foauth2%2Fyoast%2Fsuccess&" +
				"response_type=code&scope=user.id",
			onClick: onLinkClick,
		};

	return (
		<div className={ "yoast" }>
			<Button
				variant="secondary"
				id={ `yoast-get-related-keyphrases-${location}` }
				className={ "yst-gap-1.5 yst-mt-0" }
				{ ...buttonProps }
			>
				<SearchIcon className="yst-w-4 yst-h-4 yst-text-slate-400" />
				{ __( "Discover related keyphrases", "wordpress-seo" ) }
				{ ! isLoggedIn && (
					<span className="screen-reader-text">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				) }
			</Button>
		</div>
	);
};

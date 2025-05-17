import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";
import { ReactComponent as FacebookIcon } from "../../images/icon-facebook.svg";
import { ReactComponent as TwitterIcon } from "../../images/x-logo.svg";

/**
 * Renders the PostPublish Yoast integration.
 *
 * @returns {wp.Element} The PostPublish panel.
 */
export default function PostPublish( { permalink } ) {
	const encodedUrl = encodeURI( permalink );

	return <Fragment>
		<div>
			{ __( "Share your post!", "wordpress-seo" ) }
		</div>
		<ul className="yoast-seo-social-share-buttons">
			<li>
				<a href={ "https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl } target="_blank" rel="noopener noreferrer">
					<FacebookIcon />
					{ __( "Facebook", "wordpress-seo" ) }
					<span className="screen-reader-text">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</a>
			</li>
			<li>
				<a href={ "https://twitter.com/share?url=" + encodedUrl } target="_blank" rel="noopener noreferrer" className="x-share">
					<TwitterIcon />
					{ __( "X", "wordpress-seo" ) }
					<span className="screen-reader-text">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</a>
			</li>
		</ul>
	</Fragment>;
}

PostPublish.propTypes = {
	permalink: PropTypes.string.isRequired,
};

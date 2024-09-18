import PropTypes from "prop-types";
import classNames from "classnames";
import { __ } from "@wordpress/i18n";

/**
 * Renders the notice component.
 *
 * @param {string} type The title of the notice.
 * @param {string} children The content of the notice.
 *
 * @returns {React.Component} The Notice.
 */
export default function Notice( { title, children } ) {

	return (
		<div className={ classNames( "yst-p-4 yst-rounded-md yoast-new-dashboard-notice" ) }>
			<div className={ classNames( "yst-flex yst-flex-row yst-items-center" ) }>
				<span className="yoast-icon" />
				<h4 className="yst-font-semibold">{ title }</h4>
				<button type="button" class="notice-dismiss yst-relative yst-ml-auto">
					<span className="screen-reader-text">
					{
						/* translators: Hidden accessibility text. */
						__( "Dismiss this notice.", "wordpress-seo" )
					}
					</span>
					</button>
			</div>
			<p className="yst-flex-1 yst-text-sm">
				{ children }
			</p>
		</div>
	);
}

Notice.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.string.isRequired,
};
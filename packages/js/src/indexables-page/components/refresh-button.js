import PropTypes from "prop-types";
import { RefreshIcon } from "@heroicons/react/outline";
import { __, _n, sprintf } from "@wordpress/i18n";

/**
 * Renders the refresh button together with the time elapsed from the last refresh.
 *
 * @param {object} indexable The indexable.
 *
 * @returns {WPElement} A div with the refresh button and the time elapsed since last refresh.
 */
export function RefreshButton( { onClickCallback, lastRefreshTime } ) {
	return (
		<div className="yst-max-w-7xl yst-text-right yst-gap-6 yst-mb-4">
			<span className="yst-italic">
				{
					// translators: %d is the number of minutes since the last refresh.
					sprintf(
						_n( "Last refreshed: %d min ago", "Last refreshed: %d mins ago", lastRefreshTime, "wordpress-seo" ),
						lastRefreshTime
					)
				}
			</span>
			<button
				type="button"
				onClick={ onClickCallback }
				className={ "yst-ml-6 yst-font-medium yst-text-indigo-600 hover:yst-text-indigo-500 focus:yst-ring-indigo-500 focus:yst-shadow-none focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-offset-[#f0f0f1] yst-rounded-lg yst-py-2 yst-px-3" }
			>
				<RefreshIcon className="yst-inline-block yst-align-text-bottom yst-mr-1 yst-h-4 yst-w-4" />
				{ __( "Refresh data", "wordpress-seo" ) }
			</button>
		</div>
	);
}

RefreshButton.propTypes = {
	onClickCallback: PropTypes.func.isRequired,
	lastRefreshTime: PropTypes.number.isRequired,
};

export default RefreshButton;


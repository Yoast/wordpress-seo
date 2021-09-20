import classNames from "classnames";
import { PlusIcon } from "@heroicons/react/solid";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * The ShowMore Component.
 * @param {string} className The additional classes.
 * @param {function} nextPage Callback for when the user clicks on the nextPage button.
 * @returns {*} The ShowMore Component.
 */
export default function ShowMore( { className, requestMore, moreAvailable } ) {
	return (
		<div
			className={ classNames(
				"yst-text-center",
				className,
			) }
			aria-label={ __( "Show more", "admin-ui" ) }
		>
			{ moreAvailable &&
				<button
					className="yst-button yst-button--secondary yst-button--undefined"
					onClick={ requestMore }
				>
					<PlusIcon className="yst--ml-1 yst-mr-1 yst-h-5 yst-w-5 yst-text-gray-400" />
					<span className="yst-my-auto">{ __( "Show more results", "admin-ui" ) }</span>
				</button>
			}
			{ moreAvailable === false &&
				<span
					className="yst-text-sm yst-text-gray-500"
				>
					{ __( "You've reached the end of the results.", "admin-ui" ) }
				</span>
			}
		</div>
	);
}

ShowMore.propTypes = {
	className: PropTypes.string,
	requestMore: PropTypes.func.isRequired,
	moreAvailable: PropTypes.bool,
};

ShowMore.defaultProps = {
	className: "",
	moreAvailable: true,
};

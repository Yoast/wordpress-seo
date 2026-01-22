import classNames from "classnames";
import PropTypes from "prop-types";
import { Paper } from "@yoast/ui-library";

/**
 * Renders the upsell notice component.
 *
 * @param {React.ReactNode} children The content of the alert.
 * @param {string} [className=""] The class name for the alert.
 * @returns {JSX.Element} The Alert.
 */
export default function UpsellNotice( { children, className = "" } ) {
	return (
		<Paper className={ classNames( "yst-flex yst-px-4 yst-py-4 yst-rounded-md yst-max-w-xl yst-border yst-border-primary-200", className ) }>
			<div className="yst-flex-1 yst-text-sm yst-font-normal">
				{ children }
			</div>
		</Paper>
	);
}

UpsellNotice.propTypes = {
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ).isRequired,
	className: PropTypes.string,
};

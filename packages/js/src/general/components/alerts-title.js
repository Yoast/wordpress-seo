import { useContext } from "@wordpress/element";
import PropTypes from "prop-types";
import classNames from "classnames";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { Title } from "@yoast/ui-library";
import { AlertsContext } from "../contexts/alerts-context";

/**
 *
 * @param {string} title The title of alerts.
 * @param {number} counts The count of the alerts.
 * @param {JSX.Node} children The children.
 *
 * @returns {JSX.Element} The alert title element.
 */
export const AlertsTitle = ( {
	title,
	counts = 0,
	children = null,
} ) => {
	const { Icon = ExclamationCircleIcon, iconClass = "" } = useContext( AlertsContext );

	return (
		<div>
			<div className="yst-flex yst-justify-between yst-gap-2 yst-items-center">
				<Icon className={ classNames( "yst-w-6 yst-h-6", iconClass ) } />
				<Title className="yst-grow" as="h2" size="2">{ title } { `(${ counts })` }</Title>
			</div>
			{ children }
		</div>
	);
};

AlertsTitle.propTypes = {
	title: PropTypes.string,
	counts: PropTypes.number,
	children: PropTypes.node,
};

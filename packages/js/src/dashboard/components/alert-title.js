import { useContext } from "@wordpress/element";
import PropTypes from "prop-types";
import classNames from "classnames";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { Title } from "@yoast/ui-library";
import { AlertsContext } from "../routes/alert-center";

/**
 *
 * @param {string} title The title of alerts.
 * @param {number} counts The count of the alerts.
 *
 * @returns {JSX.Element} The alert title element.
 */
export const AlertTitle = ( {
	title,
	counts = 0,
} ) => {
	const { Icon = ExclamationCircleIcon, iconClass = "" } = useContext( AlertsContext );

	return (
		<div className="yst-flex yst-justify-between yst-gap-2 yst-items-center">
			<Icon className={ classNames( "yst-w-6 yst-h-6", iconClass ) } />
			<Title className="yst-grow" as="h3" size="2">{ title } { counts > 0 && `(${counts})` }</Title>
		</div>
	);
};

AlertTitle.propTypes = {
	title: PropTypes.string,
	counts: PropTypes.number,
};

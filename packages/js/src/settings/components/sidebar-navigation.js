import { SidebarNavigation } from "@yoast/ui-library";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const PureSubmenuItem = SidebarNavigation.SubmenuItem;

/**
 * @param {Object} props The props.
 * @param {string} to The path to link to.
 * @returns {JSX.Element} The submenu item element.
 */
const SubmenuItem = ( { to, ...props } ) => <PureSubmenuItem as={ Link } pathProp="to" id={ `route:${ to }` } to={ to } { ...props } />;

SubmenuItem.propTypes = {
	to: PropTypes.string.isRequired,
};

SidebarNavigation.SubmenuItem = SubmenuItem;

export default SidebarNavigation;

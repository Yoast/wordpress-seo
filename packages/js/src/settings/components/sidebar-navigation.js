import { SidebarNavigation } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const PureSubmenuItem = SidebarNavigation.SubmenuItem;

/**
 * @param {Object} props The props.
 * @param {string} to The path to link to.
 * @param {string} [idSuffix] Extra id suffix. Can prevent double IDs on the page.
 * @returns {JSX.Element} The submenu item element.
 */
const SubmenuItem = ( { to, idSuffix = "", ...props } ) => (
	<PureSubmenuItem as={ Link } pathProp="to" id={ `link-${ to }${ idSuffix }` } to={ to } { ...props } />
);

SubmenuItem.propTypes = {
	to: PropTypes.string.isRequired,
	idSuffix: PropTypes.string,
};

SidebarNavigation.SubmenuItem = SubmenuItem;

export default SidebarNavigation;

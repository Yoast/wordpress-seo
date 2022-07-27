import { SidebarNavigation } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { replace } from "lodash";
import { useMemo } from "@wordpress/element";
import { Link } from "react-router-dom";

const PureSubmenuItem = SidebarNavigation.SubmenuItem;

/**
 * @param {Object} props The props.
 * @param {string} to The path to link to.
 * @param {string} [idSuffix] Extra id suffix. Can prevent double IDs on the page.
 * @returns {JSX.Element} The submenu item element.
 */
const SubmenuItem = ( { to, idSuffix = "", ...props } ) => {
	const id = useMemo( () => replace( replace( `link-${to}`, "/", "-" ), "--", "-" ), [ to ] );
	return <PureSubmenuItem as={ Link } pathProp="to" id={ `${ id }${ idSuffix && `-${ idSuffix }` }` } to={ to } { ...props } />;
};

SubmenuItem.propTypes = {
	to: PropTypes.string.isRequired,
	idSuffix: PropTypes.string,
};

SidebarNavigation.SubmenuItem = SubmenuItem;

export default SidebarNavigation;

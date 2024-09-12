import { useMemo } from "@wordpress/element";
import { SidebarNavigation } from "@yoast/ui-library";
import { replace } from "lodash";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * @param {Object} props The props.
 * @param {string} to The path to link to.
 * @param {string} [idSuffix] Extra id suffix. Can prevent double IDs on the page.
 * @returns {JSX.Element} The submenu item element.
 */
export const MenuItemLink = ( { to, idSuffix = "", ...props } ) => {
	const id = useMemo( () => replace( replace( `link-${ to }`, "/", "-" ), "--", "-" ), [ to ] );
	return <SidebarNavigation.SubmenuItem as={ Link } pathProp="to" id={ `${ id }${ idSuffix }` } to={ to } { ...props } />;
};

MenuItemLink.propTypes = {
	to: PropTypes.string.isRequired,
	idSuffix: PropTypes.string,
};

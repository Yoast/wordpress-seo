import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import { useNavigationContext } from "./index";

/**
 * @param {JSX.node} label The label.
 * @param {JSX.ElementClass} [as] The field component.
 * @param {string} [pathProp] The key of the path in the props. Defaults to `href`.
 * @param {Object} [props] Extra props.
 * @returns {JSX.Element} The submenu item element.
 */
const SubmenuItem = ( { as: Component = "a", pathProp = "href", label, icon: Icon = null, ...props } ) => {
	const { activePath, setMobileMenuOpen } = useNavigationContext();

	const handleClick = useCallback( () => setMobileMenuOpen( false ), [ setMobileMenuOpen ] );

	return (
		<li className="yst-m-0 yst-pb-1">
			<Component
				className={ classNames(
					"yst-group yst-flex yst-items-center yst-px-3 yst-py-2 yst-text-sm yst-font-medium yst-rounded-md yst-no-underline focus:yst-outline-none focus:yst-ring-1 focus:yst-ring-offset-1 focus:yst-ring-offset-transparent focus:yst-ring-primary-500",
					activePath === props[ pathProp ]
						? "yst-bg-slate-200 yst-text-slate-900"
						: "yst-text-slate-600 hover:yst-text-slate-900 hover:yst-bg-slate-50",
				) }
				aria-current={ activePath === props[ pathProp ] ? "page" : null }
				onClick={ handleClick }
				{ ...props }
			>
				<span className="yst-flex yst-items-center yst-gap-3">
					{ Icon &&
						<Icon className="yst-flex-shrink-0 yst--ml-1 yst-h-6 yst-w-6 yst-text-slate-400 group-hover:yst-text-slate-500" />
					}
					{ label }
				</span>
			</Component>
		</li>
	);
};

SubmenuItem.propTypes = {
	as: PropTypes.elementType,
	pathProp: PropTypes.string,
	label: PropTypes.node.isRequired,
	isActive: PropTypes.bool,
};

export default SubmenuItem;

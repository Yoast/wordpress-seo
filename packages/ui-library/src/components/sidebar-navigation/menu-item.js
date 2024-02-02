import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import { useToggleState } from "../../hooks";

/**
 * @param {string} label The label.
 * @param {JSX.Element} [icon] Optional icon to put before the label.
 * @param {JSX.node} [children] Optional sub menu.
 * @param {boolean} [defaultOpen] Whether the sub menu starts opened.
 * @param {Object} [props] Extra props.
 * @returns {JSX.Element} The menu item element.
 */
const MenuItem = ( { label, icon: Icon = null, children = null, defaultOpen = true, ...props } ) => {
	const [ isOpen, toggleOpen ] = useToggleState( defaultOpen );
	const ChevronIcon = isOpen ? ChevronUpIcon : ChevronDownIcon;

	return (
		<div>
			<button
				type="button"
				className="yst-group yst-flex yst-w-full yst-items-center yst-justify-between yst-gap-3 yst-px-3 yst-py-2 yst-text-sm yst-font-medium yst-text-slate-800 yst-rounded-md yst-no-underline hover:yst-text-slate-900 hover:yst-bg-slate-50 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-primary-500"
				onClick={ toggleOpen }
				aria-expanded={ isOpen }
				{ ...props }
			>
				<span className="yst-flex yst-items-center yst-gap-3">
					{ Icon &&
						<Icon className="yst-flex-shrink-0 yst--ml-1 yst-h-6 yst-w-6 yst-text-slate-400 group-hover:yst-text-slate-500" />
					}
					{ label }
				</span>
				<ChevronIcon className="yst-h-4 yst-w-4 yst-text-slate-400 group-hover:yst-text-slate-500 yst-stroke-3" />
			</button>
			{ isOpen && children && <ul className="yst-ml-8 yst-mt-1 yst-space-y-1">
				{ children }
			</ul> }
		</div>
	);
};

MenuItem.propTypes = {
	label: PropTypes.string.isRequired,
	icon: PropTypes.elementType,
	defaultOpen: PropTypes.bool,
	children: PropTypes.node,
};

export default MenuItem;

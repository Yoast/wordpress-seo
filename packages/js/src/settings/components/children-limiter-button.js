import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useSvgAria } from "@yoast/ui-library";

/**
 * Renders a more/less button for the ChildrenLimiter component with history tracking to avoid collapsing on mount.
 *
 * @param {boolean} show Whether the extra children are shown.
 * @param {function} toggle Function to toggle showing the extra children.
 * @param {object} ariaProps ARIA properties for accessibility.
 * @param {string} id Unique identifier for the button.
 * @param {string[]} history The history of expanded/collapsed states.
 * @param {function} removeFromHistory Function to remove the id from history.
 * @param {function} addToHistory Function to add the id to history.
 * @returns {JSX.Element} The more/less button.
 */
export const ChildrenLimiterButton = ( { show, toggle, ariaProps, id, history, removeFromHistory, addToHistory } ) => {
	const ChevronIcon = history.includes( id ) ? ChevronUpIcon : ChevronDownIcon;
	const svgAriaProps = useSvgAria( false );

	const handleOnClick = useCallback( () => {
		if ( history.includes( id ) ) {
			removeFromHistory( id );
			if ( show ) {
				toggle();
			}
		} else {
			addToHistory( id );
			if ( ! show ) {
				toggle();
			}
		}
	}, [ show, toggle, history, id, removeFromHistory, addToHistory ] );

	return (
		<div className="yst-relative">
			<hr className="yst-absolute yst-inset-x-0 yst-top-1/2 yst-bg-slate-200" />
			<button
				type="button"
				className="yst-relative yst-flex yst-items-center yst-gap-1.5 yst-px-2.5 yst-py-1 yst-mx-auto yst-text-xs yst-font-medium yst-text-slate-700 yst-bg-slate-50 yst-rounded-full yst-border yst-border-slate-300 hover:yst-bg-white hover:yst-text-slate-800 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-primary-500 focus:yst-ring-offset-2"
				onClick={ handleOnClick }
				{ ...ariaProps }
			>
				{ history.includes( id ) ? __( "Show less", "wordpress-seo" ) : __( "Show more", "wordpress-seo" ) }
				<ChevronIcon
					className="yst-h-4 yst-w-4 yst-flex-shrink-0 yst-text-slate-400 group-hover:yst-text-slate-500 yst-stroke-3"
					{ ...svgAriaProps }
				/>
			</button>
		</div>
	);
};

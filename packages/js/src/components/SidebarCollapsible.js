/* eslint-disable complexity */
import { useCallback, useEffect, useRef, useState } from "@wordpress/element";
import { BetaBadge, SvgIcon } from "@yoast/components";

/**
 * Sidebar Collapsible component with default padding and separator.
 *
 * @param {Object} props Component props.
 * @param {string} props.title The main title.
 * @param {React.ReactNode} props.children The collapsible content.
 * @param {?string} [props.id=null] The id of the collapsible wrapper.
 * @param {?{icon: string, color: ?string, size: ?string}} [props.prefixIcon=null] The icon object for the prefix.
 * @param {string} [props.subTitle=""] The subtitle.
 * @param {boolean} [props.hasBetaBadgeLabel=false] Whether to show the beta badge.
 * @param {boolean} [props.hasNewBadgeLabel=false] Whether to show the new badge.
 * @param {?string} [props.buttonId=null] The button id.
 * @param {Function} [props.renderNewBadgeLabel] Function to render a "New" badge label.
 * @param {boolean} [props.initialIsOpen=false] Whether the collapsible should be initially open.
 *
 * @returns {JSX.Element} The element.
 */
const SidebarCollapsible = ( {
	title,
	children,
	id = null,
	prefixIcon = null,
	subTitle = "",
	hasBetaBadgeLabel = false,
	hasNewBadgeLabel = false,
	buttonId = null,
	renderNewBadgeLabel = () => {},
	initialIsOpen = false,
} ) => {
	const [ isOpen, toggleOpen ] = useState( initialIsOpen );
	const buttonRef = useRef( null );

	useEffect( () => {
		if ( initialIsOpen && buttonRef.current ) {
			buttonRef.current.focus();
		}
	}, [] );

	/**
	 * Toggles the SidebarCollapsible open and closed state.
	 *
	 * @returns {void}
	 */
	const handleClick = useCallback( () => {
		toggleOpen( currentIsOpen => ! currentIsOpen );
	}, [ toggleOpen ] );

	return <div id={ id } className={ `yoast components-panel__body ${ isOpen ? "is-opened" : "" }` }>
		<h2 className="components-panel__body-title">
			<button
				ref={ buttonRef }
				onClick={ handleClick }
				className="components-button components-panel__body-toggle"
				type="button"
				id={ buttonId }
			>
				<span
					className="yoast-icon-span"
					style={ { fill: `${ prefixIcon && prefixIcon.color || "" }` } }
				>
					{
						prefixIcon && <SvgIcon
							icon={ prefixIcon.icon }
							color={ prefixIcon.color }
							size={ prefixIcon.size }
						/>
					}
				</span>
				{ ! hasNewBadgeLabel &&
					<>
						<span className="yoast-title-container">
							<div className="yoast-title">{ title }</div>
							{ subTitle && <div className="yoast-subtitle">{ subTitle }</div> }
						</span>
						{ hasBetaBadgeLabel && <BetaBadge /> }
					</>
				}
				{ hasNewBadgeLabel &&
					<div className="yst-flex-grow yst-flex yst-items-center yst-gap-2">
						<span className="yst-overflow-x-hidden yst-leading-normal">
							<div className="yoast-title">{ title }</div>
							{ subTitle && <div className="yoast-subtitle">{ subTitle }</div> }
						</span>
						{ renderNewBadgeLabel() }
					</div>
				}
				<span className="yoast-chevron" aria-hidden="true" />
			</button>
		</h2>
		{ isOpen && children }
	</div>;
};

export default SidebarCollapsible;

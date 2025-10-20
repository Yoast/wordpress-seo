/* eslint-disable complexity */
import { useCallback, useState } from "@wordpress/element";
import { BetaBadge, SvgIcon } from "@yoast/components";

import PropTypes from "prop-types";

/**
 * Sidebar Collapsible component with default padding and separator.
 *
 * @param {string} title The main title.
 * @param {React.ReactNode} children The collapsible content.
 * @param {?{icon: string, color: ?string, size: ?string}} [prefixIcon=null] The icon object for the prefix.
 * @param {string} [subTitle=""] The subtitle.
 * @param {boolean} [hasBetaBadgeLabel=false] Whether to show the beta badge.
 * @param {boolean} [hasNewBadgeLabel=false] Whether to show the new badge.
 * @param {?string} [buttonId=null] The button id.
 * @param {Function} [renderNewBadgeLabel] Function to render a "New" badge label.
 *
 * @returns {JSX.Element} The element.
 */
const SidebarCollapsible = ( {
	title,
	children,
	prefixIcon = null,
	subTitle = "",
	hasBetaBadgeLabel = false,
	hasNewBadgeLabel = false,
	buttonId = null,
	renderNewBadgeLabel = () => {},
} ) => {
	const [ isOpen, toggleOpen ] = useState( false );

	/**
	 * Toggles the SidebarCollapsible open and closed state.
	 *
	 * @returns {void}
	 */
	const handleClick = useCallback( () => {
		toggleOpen( currentIsOpen => ! currentIsOpen );
	}, [ toggleOpen ] );

	return <div className={ `yoast components-panel__body ${ isOpen ? "is-opened" : "" }` }>
		<h2 className="components-panel__body-title">
			<button
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

SidebarCollapsible.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.oneOfType( [
		PropTypes.node,
		PropTypes.arrayOf( PropTypes.node ),
	] ).isRequired,
	prefixIcon: PropTypes.object,
	subTitle: PropTypes.string,
	hasBetaBadgeLabel: PropTypes.bool,
	hasNewBadgeLabel: PropTypes.bool,
	buttonId: PropTypes.string,
	renderNewBadgeLabel: PropTypes.func,
};

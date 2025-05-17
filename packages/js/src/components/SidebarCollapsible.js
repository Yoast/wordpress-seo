import { useState } from "@wordpress/element";
import { BetaBadge, SvgIcon } from "@yoast/components";
import PropTypes from "prop-types";
/* eslint-disable complexity */

/**
 * Sidebar Collapsible component with default padding and separator
 *
 * @param {Object} props The properties for the component.
 *
 * @returns {wp.Element} The Collapsible component.
 */
const SidebarCollapsible = ( props ) => {
	const [ isOpen, toggleOpen ] = useState( false );

	const {
		prefixIcon,
	} = props;

	/**
	 * Toggles the SidebarCollapsible open and closed state.
	 *
	 * @returns {void}
	 */
	function handleClick() {
		toggleOpen( ! isOpen );
	}

	return <div className={ `yoast components-panel__body ${ isOpen ? "is-opened" : "" }` }>
		<h2 className="components-panel__body-title">
			<button
				onClick={ handleClick }
				className="components-button components-panel__body-toggle"
				type="button"
				id={ props.buttonId }
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
				<span className="yoast-title-container">
					<div className="yoast-title">{ props.title }</div>
					<div className="yoast-subtitle">{ props.subTitle }</div>
				</span>
				{ props.hasBetaBadgeLabel && <BetaBadge /> }
				<span className="yoast-chevron" aria-hidden="true" />
			</button>
		</h2>
		{ isOpen && props.children }
	</div>;
};
/* eslint-enable complexity */

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
	buttonId: PropTypes.string,
};

SidebarCollapsible.defaultProps = {
	prefixIcon: null,
	subTitle: "",
	hasBetaBadgeLabel: false,
	buttonId: null,
};

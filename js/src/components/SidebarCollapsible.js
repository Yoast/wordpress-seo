import { useState } from "@wordpress/element";
import { SvgIcon } from "@yoast/components";

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
		prefixIconCollapsed,
	} = props;

	return <div className={ `components-panel__body ${ isOpen ? "is-opened" : "" }` }>
		<h2 className="components-panel__body-title">
			<button
				onClick={ () => toggleOpen( ! isOpen ) }
				className="components-button components-panel__body-toggle"
				style={ { fill: `${ prefixIcon && prefixIcon.color || "" }` } }
			>
				<span className="yoast-icon-span">
					{
						isOpen && prefixIcon && <SvgIcon
							icon={ prefixIcon.icon }
							color={ prefixIcon.color }
							size={ prefixIcon.size }
						/>
					}
					{
						! isOpen && prefixIconCollapsed && <SvgIcon
							icon={ prefixIconCollapsed.icon }
							color={ prefixIconCollapsed.color }
							size={ prefixIconCollapsed.size }
						/>
					}
				</span>
				<span className="yoast-title-container">
					<div className="yoast-title">{ props.title }</div>
					<div className="yoast-subtitle">{ props.subTitle }</div>
				</span>
				<span aria-hidden="true">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						className="components-panel__arrow"
						role="img"
						aria-hidden="true" focusable="false"
					>
						{
							isOpen
								? <path d="M12 8l-6 5.4 1 1.2 5-4.6 5 4.6 1-1.2z" />
								: <path d="M17 9.4L12 14 7 9.4l-1 1.2 6 5.4 6-5.4z" />
						}
					</svg>
				</span>
			</button>
		</h2>
		{ isOpen && props.children }
	</div>;
};

export default SidebarCollapsible;

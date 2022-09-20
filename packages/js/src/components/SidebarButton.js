import { SvgIcon } from "@yoast/components";
import PropTypes from "prop-types";

/**
 * Sidebar Collapsible component with default padding and separator
 *
 * @param {Object} props The properties for the component.
 *
 * @returns {wp.Element} The Collapsible component.
 */
const SidebarButton = ( props ) => {
	return <div className="yoast components-panel__body">
		<h2 className="components-panel__body-title">
			<button
				id={ props.id }
				onClick={ props.onClick }
				className="components-button components-panel__body-toggle"
			>
				{ props.prefixIcon && ( <span
					className="yoast-icon-span"
					style={ { fill: `${ props.prefixIcon && props.prefixIcon.color || "" }` } }
				>
					{
						 <SvgIcon
							size={ props.prefixIcon.size }
							icon={ props.prefixIcon.icon }
						 />
					}
				</span> ) }

				<span className="yoast-title-container">
					<div className="yoast-title">{ props.title }</div>
					<div className="yoast-subtitle">{ props.subTitle }</div>
				</span>
				{ props.children }
				{
					props.suffixIcon && <SvgIcon
						size={ props.suffixIcon.size }
						icon={ props.suffixIcon.icon }
					/>
				}
			</button>
		</h2>
	</div>;
};

export default SidebarButton;

SidebarButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	id: PropTypes.string,
	subTitle: PropTypes.string,
	suffixIcon: PropTypes.object,
	prefixIcon: PropTypes.object,
	children: PropTypes.node,
};

SidebarButton.defaultProps = {
	id: "",
	suffixIcon: null,
	prefixIcon: null,
	subTitle: "",
	children: null,
};

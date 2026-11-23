/* eslint-disable complexity */
import { SvgIcon } from "@yoast/components";

/**
 * Sidebar Collapsible component with default padding and separator.
 *
 * @param {Object} props Component props.
 * @param {Function} props.onClick The click handler.
 * @param {string} props.title The button title.
 * @param {string} [props.id=""] The button id.
 * @param {string} [props.subTitle=""] The subtitle.
 * @param {Object} [props.suffixIcon=null] The suffix icon object.
 * @param {JSX.Element} [props.SuffixHeroIcon=null] Optional hero icon component.
 * @param {Object} [props.prefixIcon=null] The prefix icon object.
 * @param {React.ReactNode} [props.children=null] Optional children.
 *
 * @returns {JSX.Element} The Collapsible component.
 */
const SidebarButton = ( {
	onClick,
	title,
	id = "",
	subTitle = "",
	suffixIcon = null,
	SuffixHeroIcon = null,
	prefixIcon = null,
	children = null,
} ) => {
	return <div className="yoast components-panel__body">
		<h2 className="components-panel__body-title">
			<button
				id={ id }
				onClick={ onClick }
				className="components-button components-panel__body-toggle"
				type="button"
			>
				{ prefixIcon && ( <span
					className="yoast-icon-span"
					style={ { fill: `${ prefixIcon && prefixIcon.color || "" }` } }
				>
					{
						<SvgIcon
							size={ prefixIcon.size }
							icon={ prefixIcon.icon }
						/>
					}
				</span> ) }

				<span className="yoast-title-container">
					<div className="yoast-title">{ title }</div>
					<div className="yoast-subtitle">{ subTitle }</div>
				</span>
				{ children }
				{
					suffixIcon && <SvgIcon
						size={ suffixIcon.size }
						icon={ suffixIcon.icon }
					/>
				}
				{ SuffixHeroIcon }
			</button>
		</h2>
	</div>;
};

export default SidebarButton;

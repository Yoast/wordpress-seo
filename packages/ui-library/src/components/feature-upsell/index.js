import { LockOpenIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import PropTypes from "prop-types";
import Button from "../../elements/button";
import { useSvgAria } from "../../hooks";

const classNameMap = {
	variant: {
		"default": "yst-feature-upsell--default",
		card: "yst-feature-upsell--card",
	},
};

/**
 * @param {JSX.node} children The children/content.
 * @param {boolean} [shouldUpsell] Whether to show the upsell.
 * @param {string} [className] Extra classname for the parent. Add your content padding here.
 * @param {string} [variant] The variant. See `classNameMap.variant`.
 * @param {string} [cardLink] The card' URL to link to. Required if the variant is `card`.
 * @param {string} [cardText] The card' button text. Used when the variant is `card`.
 * @param {Object} [cardProps] Any extra card/button props.
 * @returns {JSX.Element} The feature or the upsell around the feature.
 */
const FeatureUpsell = ( { children, shouldUpsell = true, className = "", variant = "default", cardLink = "", cardText = "", ...cardProps } ) => {
	const svgAriaProps = useSvgAria();

	if ( ! shouldUpsell ) {
		return children;
	}

	if ( variant === "card" ) {
		return (
			<div className={ classNames( "yst-feature-upsell", classNameMap.variant[ variant ], className ) }>
				<div className="yst-space-y-8 yst-grayscale">
					{ children }
				</div>
				<div
					className="yst-absolute yst-inset-0 yst-z-10 yst-bg-white yst-bg-opacity-50 yst-ring-1 yst-ring-black yst-ring-opacity-5 yst-shadow-lg yst-rounded-md"
				/>
				<div className="yst-absolute yst-inset-0 yst-z-20 yst-flex yst-items-center yst-justify-center">
					<Button
						as="a"
						className="yst-gap-2 yst-shadow-lg yst-shadow-amber-700/30"
						variant="upsell"
						href={ cardLink }
						target="_blank"
						rel="noopener"
						{ ...cardProps }
					>
						<LockOpenIcon className="yst-w-5 yst-h-5 yst--ml-1 yst-shrink-0" { ...svgAriaProps } />
						{ cardText }
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className={ classNames( "yst-feature-upsell", classNameMap.variant[ variant ], className ) }>
			{ children }
			<div className="yst-absolute yst-inset-0 yst-bg-white yst-bg-opacity-50 yst-z-10" />
		</div>
	);
};

FeatureUpsell.propTypes = {
	children: PropTypes.node.isRequired,
	shouldUpsell: PropTypes.bool,
	className: PropTypes.string,
	variant: PropTypes.oneOf( Object.keys( classNameMap.variant ) ),
	cardLink: PropTypes.string,
	cardText: PropTypes.string,
};

export default FeatureUpsell;

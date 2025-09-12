import { LockClosedIcon } from "@heroicons/react/solid";
import { __ } from "@wordpress/i18n";
import { SvgIcon } from "@yoast/components";
import { Badge, useSvgAria } from "@yoast/ui-library";
import PropTypes from "prop-types";

import { AddBlockButton } from "./AddBlockButton";

/**
 * ContentBlock component that renders individual content block inside the Yoast content blocks tab.
 *
 * @param {Object} props Component props.
 * @param {string} props.blockName The name of the block.
 * @param {boolean} props.isPremiumBlock Whether the block is a premium block.
 * @param {boolean} props.hasNewBadgeLabel Whether the block is newly introduced.
 * @returns {JSX.Element} The ContentBlock component.
 */
export const ContentBlock = ( { blockName, isPremiumBlock, hasNewBadgeLabel } ) => {
	console.log( { isPremiumBlock, blockName } );
	const svgAriaProps = useSvgAria();

	return (
		<>
			<hr style={ { borderTop: "0" } } />
			<div className="yst-flex yst-items-center">
				<div className="yst-flex yst-items-center yst-flex-grow yst-p-0 yst-gap-2">
					<SvgIcon icon="circle" size="4px" />
					<span className="yst-ms-1 yst-font-medium">{ blockName }</span>
					{ hasNewBadgeLabel && <div className="yst-root">
						<Badge variant="info" size="small">{ __( "New", "wordpress-seo" ) }</Badge>
					</div>
					}
				</div>
				<div className="yst-relative yst-inline-block">
					<AddBlockButton isPremiumBlock={ isPremiumBlock } />
					{ isPremiumBlock &&
						<div className="yst-root">
							<Badge className="yst-absolute yst-p-0.5 yst--end-[6.5px] yst--top-[6.5px]" size="small" variant="upsell">
								<LockClosedIcon className="yst-w-2.5 yst-h-2.5 yst-shrink-0" { ...svgAriaProps } />
							</Badge>
						</div>
					}
				</div>
			</div>
		</>
	);
};

ContentBlock.propTypes = {
	blockName: PropTypes.string.isRequired,
	isPremiumBlock: PropTypes.bool.isRequired,
	hasNewBadgeLabel: PropTypes.bool.isRequired,
};

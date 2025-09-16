import { LockClosedIcon } from "@heroicons/react/solid";
import { CheckIcon } from "@heroicons/react/outline";
import { useSelect } from "@wordpress/data";
import { useEffect, useMemo, useState } from "@wordpress/element";
import { SvgIcon } from "@yoast/components";
import { Badge, useSvgAria } from "@yoast/ui-library";
import PropTypes from "prop-types";

import { AddBlockButton } from "./AddBlockButton";

/**
 * ContentBlock component that renders individual content block inside the Yoast content blocks tab.
 *
 * @param {Object} props Component props.
 * @param {string} props.blockTitle The title of the block to display.
 * @param {string} props.blockName The name of the block to insert.
 * @param {boolean} props.isPremiumBlock Whether the block is a premium block.
 * @param {boolean} props.hasNewBadgeLabel Whether the block is newly introduced.
 * @param {Function} props.renderNewBadgeLabel Function to render the "New" badge label.
 * @returns {JSX.Element} The ContentBlock component.
 */
export const ContentBlock = ( { blockTitle, blockName, isPremiumBlock, hasNewBadgeLabel, renderNewBadgeLabel } ) => {
	const { isPremium, addedBlock } = useSelect( select => ( {
		isPremium: select( "yoast-seo/editor" ).getIsPremium(),
		addedBlock: select( "core/block-editor" ).getBlocksByName( blockName ),
	} ), [ blockName ] );

	const svgAriaProps = useSvgAria();
	const showUpsellBadge = useMemo( () => isPremiumBlock && ! isPremium, [ isPremiumBlock, isPremium ] );
	const [ isBlockPresent, setIsBlockPresent ] = useState( false );

	useEffect( () => {
		// If no block is found, set isBlockAdded to false.
		if ( addedBlock.length === 0 ) {
			setIsBlockPresent( false );
		} else {
			/*
			 This is also to make sure the button shows the check icon if the block is already present
			 on the initial render or when the block is added via different means.
			 */
			setIsBlockPresent( true );
		}
	}, [ addedBlock ] );

	return (
		<>
			<hr className="yst-border-t-slate-200 yst-mx-0 yst-w-auto yst-my-5" />
			<div className="yst-flex yst-items-center">
				<div className="yst-flex yst-items-center yst-flex-grow yst-p-0 yst-gap-2 yst-ms-2">
					<SvgIcon icon="circle" size="4px" />
					<span className="yst-font-medium">{ blockTitle }</span>
					{ hasNewBadgeLabel && renderNewBadgeLabel() }
				</div>
				{ ! isBlockPresent &&
					<div
						className="yst-relative yst-inline-block"
					>
						<AddBlockButton
							showUpsellBadge={ showUpsellBadge }
							blockName={ blockName }
						/>
						{ showUpsellBadge &&
							<div className="yst-root">
								<Badge className="yst-absolute yst-p-0.5 yst--end-[6.5px] yst--top-[6.5px]" size="small" variant="upsell">
									<LockClosedIcon className="yst-w-2.5 yst-h-2.5 yst-shrink-0" { ...svgAriaProps } />
								</Badge>
							</div>
						}
					</div>
				}
				{ isBlockPresent &&
					<div className="yst-flex yst-flex-row yst-justify-center yst-items-center yst-p-1.5 yst-gap-1.5">
						<CheckIcon className="yst-h-4 yst-w-4 yst-stroke-green-600" />
					</div>
				}
			</div>
		</>
	);
};

ContentBlock.propTypes = {
	blockTitle: PropTypes.string.isRequired,
	blockName: PropTypes.string.isRequired,
	isPremiumBlock: PropTypes.bool.isRequired,
	hasNewBadgeLabel: PropTypes.bool.isRequired,
	renderNewBadgeLabel: PropTypes.func.isRequired,
};

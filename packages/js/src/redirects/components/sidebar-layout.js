import classNames from "classnames";
import PropTypes from "prop-types";
import { useSelectRedirects } from "../hooks";
import { Button } from "@yoast/ui-library";
import { LockClosedIcon } from "@heroicons/react/outline";

/**
 * Layout component for pages with a sidebar and main content.
 *
 * @param {string} [contentClassName] Extra class name for the children container.
 * @param {JSX.node} children The children.
 * @returns {JSX.Element} The element.
 */

export const SidebarLayout = ( { contentClassName, children } ) => {
	const isPremium = useSelectRedirects( "selectPreference", [], "isPremium" );
	const upsellLink = useSelectRedirects( "selectLink", [], "https://yoa.st/redirect-manager-upsell" );

	return (
		<div className="yst-flex yst-gap-6 xl:yst-flex-row yst-flex-col relative">
			<div className={ classNames( "yst-@container yst-flex yst-flex-grow yst-flex-col", contentClassName ) }>
				{ children }
				{ ! isPremium && (
					<div className="yst-fixed yst-inset-0 yst-z-50 yst-overflow-hidden">
						<div className="yst-absolute yst-inset-0 yst-bg-[#64748B] yst-opacity-75 yst-backdrop-blur-sm" />

						<div className="yst-absolute yst-top-1/2 yst-flex yst-items-center yst-justify-center yst-w-full">
							<Button
								as="a"
								href={ upsellLink }
								target="_blank"
								variant="upsell"
								size="large"
								className="yst-flex yst-gap-1.5"
							>
								<LockClosedIcon className="yst-w-4 yst-h-4" />
								<span>Unlock with Premium</span>
							</Button>
						</div>
					</div>
				) }
			</div>
		</div>
	);
};

SidebarLayout.propTypes = {
	contentClassName: PropTypes.string,
	children: PropTypes.node,
};


SidebarLayout.propTypes = {
	contentClassName: PropTypes.string,
	children: PropTypes.node,
};

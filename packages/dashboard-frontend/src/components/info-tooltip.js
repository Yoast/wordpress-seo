import { TooltipContainer, TooltipTrigger, TooltipWithContext } from "@yoast/ui-library";
import { InformationCircleIcon } from "@heroicons/react/outline";

/**
 * The info tooltip component.
 *
 * @param {React.ReactNode} children The tooltip content.
 *
 * @returns {JSX.Element} The element.
 */
export const InfoTooltip = ( { children } ) => (
	<TooltipContainer as="div" className="yst-h-fit yst-leading-[0]">
		<TooltipTrigger>
			<InformationCircleIcon className="yst-w-5 yst-h-5 yst-text-slate-400" />
		</TooltipTrigger>
		<TooltipWithContext variant="light" className="yst-leading-normal yst-max-w-80 yst-p-4 yst-shadow-md" position="left">
			{ children }
		</TooltipWithContext>
	</TooltipContainer>
);

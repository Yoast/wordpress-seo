import { TooltipContainer, TooltipTrigger, TooltipWithContext } from "@yoast/ui-library";
import { InformationCircleIcon } from "@heroicons/react/outline";

/**
 * The info tooltip component.
 *
 * @param {ReactNode} children The tooltip content.
 *
 * @returns {JSX.Element} The element.
 */
export const InfoTooltip = ( { children } ) => (
	<TooltipContainer>
		<TooltipTrigger>
			<InformationCircleIcon className="yst-w-5 yst-h-5 yst-text-slate-400" />
		</TooltipTrigger>
		<TooltipWithContext variant="light" className="yst-max-w-80 yst-p-4" position="left">
			{ children }
		</TooltipWithContext>
	</TooltipContainer>
);

import { Button } from "@yoast/ui-library";
import { TrashIcon, PlusIcon, ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { useCallback } from "@wordpress/element";

/**
 * CallToActionButton component.
 *
 * @param {string} type The type of call to action: add,link,delete,default.
 * @param {string} label The label for the button.
 * @param {Function} onClick The onClick handler for the button.
 * @param {string} href The URL to navigate to (for external links).
 * @param {string} taskId The ID of the task associated with the button.
 * @param {boolean} [disabled=false] Whether the button is disabled.
 * @param {boolean} [isLoading=false] Whether the button is in a loading state.
 *
 * @returns {JSX.Element} The CallToActionButton component.
 */
export const CallToActionButton = ( { type, label, href, onClick, taskId, disabled = false, isLoading }  ) => {
	const buttonProps = {
		variant: "primary",
		id: `cta-button-${ taskId }`,
		className: "yst-flex yst-items-center yst-gap-1",
		disabled,
		isLoading,
	};

	const handleOnClick = useCallback( () => {
		if ( onClick ) {
			onClick( taskId );
		}
	}, [ onClick, taskId ] );

	if ( [ "link", "add" ].includes( type ) && href ) {
		buttonProps.href = href;
	} else {
		buttonProps.onClick = handleOnClick;
	}

	if ( type === "add" ) {
		return <Button
			{ ...buttonProps }
			as={ disabled ? "button" : "a" }
		>
			<PlusIcon className="yst-w-4 yst-text-white"  />
			{ label }
		</Button>;
	}

	if ( type === "delete" ) {
		return <Button { ...buttonProps } variant="error">
			<TrashIcon className="yst-w-4 yst-text-white" />
			{ label }
		</Button>;
	}

	if ( type === "link" ) {
		return <Button
			{ ...buttonProps }
			as={ disabled ? "button" : "a" }
		>
			{ label }
			<ArrowNarrowRightIcon className="yst-w-4 yst-text-white rtl:yst-rotate-180" />
		</Button>;
	}

	return <Button { ...buttonProps }>
		{ label }
	</Button>;
};



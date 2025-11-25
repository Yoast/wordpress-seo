import { Button } from "@yoast/ui-library";
import { TrashIcon, PlusIcon, ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Gets the button properties based on the type and other parameters.
 *
 * @param {string} type The type of button: add, link, delete, default.
 * @param {Function} handleOnClick The onClick handler for the button.
 * @param {string} href The URL to navigate to (for external links).
 * @param {string} taskId The ID of the task associated with the button.
 * @param {boolean} disabled Whether the button is disabled.
 * @param {boolean} isLoading Whether the button is in a loading state.
 *
 * @returns {{variant: string, id: string, className: string, disabled, isLoading}} The button properties.
 */
const getButtonProps = ( type, handleOnClick, href, taskId, disabled, isLoading ) => {
	// Always set isLoading to false for "link" or "add" type buttons.
	const effectiveIsLoading = ( type === "link" || type === "add" ) ? false : isLoading;

	const buttonProps = {
		variant: "primary",
		id: `cta-button-${ taskId }`,
		// When loading, don't add a gap as the spinner already adds a gap.
		className: effectiveIsLoading ? "yst-flex yst-items-center" : "yst-flex yst-items-center yst-gap-1",
		disabled,
		isLoading: effectiveIsLoading,
	};

	if ( type === "link" && href ) {
		buttonProps.href = href;
	} else {
		buttonProps.onClick = handleOnClick;
	}

	return buttonProps;
};

/**
 * CallToActionButton component.
 *
 * @param {string} type The type of call to action: add, link, delete, default.
 * @param {string} label The label for the button.
 * @param {Function} onClick The onClick handler for the button.
 * @param {string} href The URL to navigate to (for external links).
 * @param {string} taskId The ID of the task associated with the button.
 * @param {boolean} [disabled=false] Whether the button is disabled.
 * @param {boolean} [isLoading=false] Whether the button is in a loading state.
 *
 * @returns {JSX.Element} The CallToActionButton component.
 */
export const CallToActionButton = ( { type, label, href, onClick, taskId, disabled = false, isLoading = false }  ) => {
	const handleOnClick = useCallback( () => {
		if ( onClick ) {
			onClick( taskId );
		}
	}, [ onClick, taskId ] );

	const buttonProps = getButtonProps( type, handleOnClick, href, taskId, disabled, isLoading );

	if ( type === "add" ) {
		return <Button { ...buttonProps }>
			<PlusIcon className="yst-w-4 yst-text-white"  />
			{ label }
		</Button>;
	}

	if ( type === "delete" ) {
		return <Button { ...buttonProps } variant="error">
			{ isLoading ? null : <TrashIcon className="yst-w-4 yst-text-white" /> }
			{ isLoading ? __( "Deleting…", "wordpress-seo" ) : label }
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
		{ isLoading ? __( "Generating…", "wordpress-seo" ) : label }
	</Button>;
};



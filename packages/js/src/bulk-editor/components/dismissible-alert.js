import SolidXIcon from "@heroicons/react/solid/XIcon";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, useSvgAria } from "@yoast/ui-library";
import classNames from "classnames";

/**
 * An alert with a dismiss (X) button in its top-end corner, shared by the notices in the bulk-actions band.
 *
 * @param {Object}   props                        The props.
 * @param {string}   [props.variant]              The alert variant.
 * @param {string}   [props.role]                 The alert role.
 * @param {string}   [props.className]            Extra class names for the alert.
 * @param {Function} props.onDismiss              Dismisses the notice.
 * @param {Object}   [props.focusAfterDismissRef] Ref whose first focusable descendant receives focus before dismissal,
 *                                                preventing the aria-hidden warning from react-animate-height when
 *                                                focus stays inside the collapsing container.
 * @param {JSX.node} props.children               The notice content.
 *
 * @returns {JSX.Element} The dismissible alert.
 */
export const DismissibleAlert = ( { variant = "info", role = "status", className = "", onDismiss, focusAfterDismissRef, children } ) => {
	const svgAriaProps = useSvgAria();

	const handleDismiss = useCallback( () => {
		focusAfterDismissRef?.current?.querySelector( 'input, button, [href], [tabindex]:not([tabindex="-1"])' )?.focus();
		onDismiss();
	}, [ focusAfterDismissRef, onDismiss ] );

	return (
		// The top margin separates this notice from the truncation notice above it; it cancels out when
		// nothing precedes it in the notices region (the truncation notice renders null when it does not apply).
		<Alert variant={ variant } as="div" role={ role } className={ classNames( "yst-mt-2 first:yst-mt-0 yst-rounded-none yst-relative", className ) }>
			{ children }
			<button
				type="button"
				className="yst-absolute yst-end-4 yst-top-4 yst-text-current hover:yst-opacity-75 yst-cursor-pointer"
				onClick={ handleDismiss }
				aria-label={ __( "Dismiss", "wordpress-seo" ) }
			>
				<SolidXIcon className="yst-h-5 yst-w-5" { ...svgAriaProps } />
			</button>
		</Alert>
	);
};

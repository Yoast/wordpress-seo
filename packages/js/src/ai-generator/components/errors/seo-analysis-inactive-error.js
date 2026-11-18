import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, Button, useModalContext } from "@yoast/ui-library";
import { Body, title } from "./messages/seo-analysis-inactive";

/**
 * @returns {JSX.Element} The element.
 */
export const SeoAnalysisInactiveError = () => {
	const handleRefresh = useCallback( () => {
		window.location.reload();
	}, [] );

	const { onClose } = useModalContext();

	return (
		<>
			<Alert variant="error">
				<span className="yst-block yst-font-medium">{ title }</span>
				<Body />
			</Alert>
			<div className="yst-mt-6 yst-mb-1 yst-flex yst-space-x-3 rtl:yst-space-x-reverse yst-place-content-end">
				<Button variant="secondary" onClick={ onClose }>
					{ __( "Close", "wordpress-seo" ) }
				</Button>
				<Button className="yst-revoke-button" variant="primary" onClick={ handleRefresh }>
					{ __( "Refresh page", "wordpress-seo" ) }
				</Button>
			</div>
		</>
	);
};

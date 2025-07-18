import { Toast, Button, useSvgAria, useToggleState } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { useSelectGeneralPage } from "../hooks";
import { useCallback, useEffect } from "@wordpress/element";

/**
 * Shows only once.
 *
 * @returns {JSX.Element} The LLM txt opt-in notification component.
 */
export const LlmTxtOptInNotification = () => {
	const llmTxtNotificationSeen = useSelectGeneralPage( "selectPreference", [], "llmTxtNotificationSeen" );
	const llmTxtEnabled = useSelectGeneralPage( "selectPreference", [], "llmTxtEnabled" );

	if ( llmTxtEnabled || llmTxtNotificationSeen || sessionStorage === null ) {
		return null;
	}

	const svgAriaProps = useSvgAria();
	const llmTxtSettingsUrl = useSelectGeneralPage( "selectAdminLink", [],  "?page=wpseo_page_settings#/llms-txt" );

	const [ isVisible, toggleIsVisible, setIsVisible ] = useToggleState( false );
	useEffect( () => {
		// For the transition to take place.
		toggleIsVisible();
	}, [] );

	const handleShow = useCallback( () => {
		sessionStorage?.setItem( "yoast-highlight-setting", "llm-txt" );
		window.location.href = llmTxtSettingsUrl;
	}, [ llmTxtSettingsUrl ] );

	return <Toast
		id="llmt-txt-toast"
		isVisible={ isVisible }
		className="yst-w-96"
		position="bottom-left"
		setIsVisible={ setIsVisible }
	>
		<>
			<div className="yst-flex yst-gap-3">
				<div className="yst-flex-shrink-0">
					<YoastIcon className="yst-w-5 yst-h-5 yst-fill-primary-500" { ...svgAriaProps } />
				</div>
				<div className="yst-flex-1">
					<Toast.Title title={  __( "New: Prepare your site for AI-driven discovery!", "wordpress-seo" ) } className="yst-mb-1" />
					<p>
						{  __( "Automatically generate an llms.txt file that highlights key content for AI systems.", "wordpress-seo" ) }
					</p>
				</div>
				<div>
					<Toast.Close dismissScreenReaderLabel={ __( "Dismiss", "wordpress-seo" ) } />
				</div>
			</div>
			<div className="yst-flex yst-gap-3 yst-justify-end yst-mt-3">
				<Button size="small" variant="tertiary" onClick={ toggleIsVisible }>{ __( "Dismiss", "wordpress-seo" ) }</Button>
				<Button size="small" className="yst-gap-1" onClick={ handleShow }>
					{ __( "Show me", "wordpress-seo" ) }
					<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 rtl:yst-rotate-180" { ...svgAriaProps } />
				</Button>
			</div>
		</>
	</Toast>;
};

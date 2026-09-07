import ArrowNarrowRightIcon from "@heroicons/react/outline/ArrowNarrowRightIcon";
import { useDispatch } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, ModalNotification, useModalNotificationContext, useSvgAria } from "@yoast/ui-library";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";
import { TOUR_OPT_IN_KEY } from "../../bulk-editor/constants";
import { STORE_NAME } from "../constants";
import { useSelectGeneralPage } from "../hooks";
import { ROUTES } from "../routes";

// The bulk editor admin page the tour runs on, resolved against the admin URL for the "Show me" navigation.
const BULK_EDITOR_LINK = "admin.php?page=wpseo_page_bulk_edit";

/**
 * Checks whether the WP admin sidebar is expanded, to offset the notification clear of it.
 *
 * @returns {boolean} True if the admin sidebar is expanded or absent.
 */
const isAdminSidebarExpanded = () => {
	const adminMenuWrap = document.getElementById( "adminmenuwrap" );
	return ! adminMenuWrap || adminMenuWrap.offsetWidth > 100;
};

/**
 * The Dismiss / Show me buttons for the entry notification.
 *
 * @param {Object} props              The props.
 * @param {string} props.bulkEditorUrl The bulk editor URL the "Show me" button opens.
 *
 * @returns {JSX.Element} The buttons.
 */
const NotificationButtons = ( { bulkEditorUrl } ) => {
	const { handleDismiss } = useModalNotificationContext();
	const svgAriaProps = useSvgAria();

	// A full-page navigation to the bulk editor, where the guided tour runs.
	const handleShow = useCallback( () => {
		window.location.href = bulkEditorUrl;
	}, [ bulkEditorUrl ] );

	return <div className="yst-flex yst-gap-3 yst-justify-end yst-mt-3">
		<Button size="small" variant="tertiary" onClick={ handleDismiss }>{ __( "Dismiss", "wordpress-seo" ) }</Button>
		<Button size="small" className="yst-gap-1" onClick={ handleShow }>
			{ __( "Show me", "wordpress-seo" ) }
			<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 rtl:yst-rotate-180" { ...svgAriaProps } />
		</Button>
	</div>;
};

/**
 * The bulk editor guided-tour entry notification, shown on the General page.
 *
 * It points first-time users to the bulk editor, where the step-by-step tour runs. Dismissing it marks the tour
 * seen (so it never returns); "Show me" navigates to the bulk editor page.
 *
 * @returns {JSX.Element|null} The notification, or nothing when it has been seen or on the first-time configuration.
 */
export const BulkEditorTourNotification = () => {
	const { setOptInNotificationSeen, hideOptInNotification } = useDispatch( STORE_NAME );
	const svgAriaProps = useSvgAria();
	const { pathname } = useLocation();
	const isSeen = useSelectGeneralPage( "selectIsOptInNotificationSeen", [], TOUR_OPT_IN_KEY );
	const isRtl = useSelectGeneralPage( "selectPreference", [], "isRtl" );
	const bulkEditorUrl = useSelectGeneralPage( "selectAdminLink", [], BULK_EDITOR_LINK );

	// Dismissing (close button or Dismiss) ends the tour: persist it seen, then hide for the current session.
	const onClose = useCallback( () => {
		setOptInNotificationSeen( TOUR_OPT_IN_KEY );
		hideOptInNotification( TOUR_OPT_IN_KEY );
	}, [ setOptInNotificationSeen, hideOptInNotification ] );

	const isOpen = ! isSeen && pathname !== ROUTES.firstTimeConfiguration;
	if ( ! isOpen ) {
		return null;
	}

	let positionClass;
	if ( isAdminSidebarExpanded() ) {
		positionClass = "md:yst-start-40 rtl:md:yst-start-44";
	} else if ( isRtl ) {
		positionClass = "md:yst-start-[3.25rem]";
	} else {
		positionClass = "md:yst-start-10";
	}

	return <ModalNotification
		isOpen={ isOpen }
		onClose={ onClose }
		className={ classNames( "yst-z-[9999]", positionClass ) }
		position={ isRtl ? "bottom-right" : "bottom-left" }
		aria-label={
			/* translators: Hidden accessibility text. */
			__( "New: Work faster with bulk updates", "wordpress-seo" ) }
	>
		<ModalNotification.Panel className="yst-w-96">
			<div className="yst-flex yst-gap-3">
				<div className="yst-flex-shrink-0">
					<YoastIcon className="yst-w-5 yst-h-5 yst-fill-primary-500" { ...svgAriaProps } />
				</div>
				<div className="yst-flex-1">
					<ModalNotification.Title title={ __( "New: Work faster with bulk updates", "wordpress-seo" ) } className="yst-mb-1" />
					<ModalNotification.Message
						message={ __( "Use the Bulk Editor to get AI-generated, SEO-friendly titles and descriptions in seconds.", "wordpress-seo" ) }
					/>
				</div>
				<div>
					<ModalNotification.Close dismissScreenReaderLabel={ __( "Dismiss", "wordpress-seo" ) } />
				</div>
			</div>
			<NotificationButtons bulkEditorUrl={ bulkEditorUrl } />
		</ModalNotification.Panel>
	</ModalNotification>;
};

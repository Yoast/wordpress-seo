import { ModalNotification, Button, useSvgAria, useModalNotificationContext } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";
import ArrowNarrowRightIcon from "@heroicons/react/outline/esm/ArrowNarrowRightIcon";
import classNames from "classnames";
import { useCallback, useEffect } from "@wordpress/element";
import { STORE_NAME } from "../constants";
import { useDispatch } from "@wordpress/data";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";
import PropTypes from "prop-types";
import { useSelectGeneralPage } from "../hooks";

/**
 * Checks whether the WP admin sidebar is expanded (not collapsed).
 * When collapsed, the sidebar is ~36px wide; when expanded, ~160px.
 *
 * @returns {boolean} True if the admin sidebar is expanded or absent.
 */
const isAdminSidebarExpanded = () => {
	const adminmenuWrap = document.getElementById( "adminmenuwrap" );
	return ! adminmenuWrap || adminmenuWrap.offsetWidth > 100;
};

/**
 * The buttons for the task list opt-in notification.
 * Uses the ModalNotification context for dismissal.
 *
 * @returns {JSX.Element} The buttons.
 */
const NotificationButtons = () => {
	const { handleDismiss } = useModalNotificationContext();
	const svgAriaProps = useSvgAria();
	const taskListpath = ROUTES.taskList;
	const navigate = useNavigate();
	const { hideOptInNotification } = useDispatch( STORE_NAME );

	const handleShow = useCallback( async() => {
		hideOptInNotification( "task_list" );
		handleDismiss();
		navigate( taskListpath );
	}, [ taskListpath, navigate ] );

	return <div className="yst-flex yst-gap-3 yst-justify-end yst-mt-3">
		<Button size="small" variant="tertiary" onClick={ handleDismiss }>{ __( "Dismiss", "wordpress-seo" ) }</Button>
		<Button size="small" className="yst-gap-1" onClick={ handleShow }>
			{ __( "Show me", "wordpress-seo" ) }
			<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 rtl:yst-rotate-180" { ...svgAriaProps } />
		</Button>
	</div>;
};

/**
 * The task list opt-in notification component.
 * Uses ModalNotification for accessible focus management and modal behavior.
 *
 * @param {Object} props The component props.
 * @param {boolean} props.isOpen Whether the notification is open.
 * @param {Function} props.onClose Function to call when the notification should close.
 *
 * @returns {JSX.Element} The task list opt-in notification component.
 */
export const TaskListOptInNotification = ( { isOpen, onClose } ) => {
	const { setOptInNotificationSeen, hideOptInNotification } = useDispatch( STORE_NAME );
	const svgAriaProps = useSvgAria();

	useEffect( () => {
		// Mark the notification as seen when mounting.
		setOptInNotificationSeen( "task_list" );

		return () => {
			// Hide the notification when unmounting when switching to the FTC tab.
			hideOptInNotification( "task_list" );
		};
	}, [] );

	const isRtl = useSelectGeneralPage( "selectPreference", [], "isRtl" );

	let notificationPositionClass;

	if ( isAdminSidebarExpanded() ) {
		notificationPositionClass = "md:yst-start-40 rtl:md:yst-start-44";
	} else if ( isRtl ) {
		notificationPositionClass = "md:yst-start-[3.25rem]";
	} else {
		notificationPositionClass = "md:yst-start-10";
	}

	return <ModalNotification
		isOpen={ isOpen }
		onClose={ onClose }
		className={ classNames( "yst-z-[9999]", notificationPositionClass ) }
		position={ isRtl ? "bottom-right" : "bottom-left" }
		aria-label={ __( "New: Your SEO Task list", "wordpress-seo" ) }
	>
		<ModalNotification.Panel className="yst-w-96">
			<div className="yst-flex yst-gap-3">
				<div className="yst-flex-shrink-0">
					<YoastIcon className="yst-w-5 yst-h-5 yst-fill-primary-500" { ...svgAriaProps } />
				</div>
				<div className="yst-flex-1">
					<ModalNotification.Title title={ __( "New: Your SEO Task list", "wordpress-seo" ) } className="yst-mb-1" />
					<ModalNotification.Message message={ __( "Stay on top of SEO with a clear task list tailored to your site.", "wordpress-seo" ) } />
				</div>
				<div>
					<ModalNotification.Close dismissScreenReaderLabel={ __( "Dismiss", "wordpress-seo" ) } />
				</div>
			</div>
			<NotificationButtons />
		</ModalNotification.Panel>
	</ModalNotification>;
};

TaskListOptInNotification.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

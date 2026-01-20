import { Toast, Button, useSvgAria, useToggleState, useToastContext } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { useCallback, useEffect } from "@wordpress/element";
import { STORE_NAME } from "../constants";
import { useDispatch } from "@wordpress/data";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

/**
 * The buttons for the LLM txt opt-in notification.
 * Used for the toast context.
 *
 * @returns {JSX.Element} The buttons.
 */
const NotificationButtons = () => {
	const { handleDismiss } = useToastContext();
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
 * The LLM txt opt-in notification component.
 *
 * @returns {JSX.Element} The LLM txt opt-in notification component.
 */
export const TaskListOptInNotification = () => {
	const { setOptInNotificationSeen, hideOptInNotification } = useDispatch( STORE_NAME );
	const svgAriaProps = useSvgAria();
	const [ isVisible, toggleIsVisible, setIsVisible ] = useToggleState( false );

	const onDismiss = useCallback( () => {
		hideOptInNotification( "task_list" );
	}, [ hideOptInNotification ] );

	useEffect( () => {
		// Mark the notification as seen when mounting.
		setOptInNotificationSeen( "task_list" );

		// For the transition to take place.
		toggleIsVisible();

		return () => {
			// Hide the notification when unmounting when switching to the FTC tab.
			hideOptInNotification( "task_list" );
		};
	}, [] );

	return <Toast
		id="yoast_wpseo_task_list_opt_in_notification"
		isVisible={ isVisible }
		className="yst-w-96"
		position="bottom-left"
		setIsVisible={ setIsVisible }
		onDismiss={ onDismiss }
	>
		<>
			<div className="yst-flex yst-gap-3">
				<div className="yst-flex-shrink-0">
					<YoastIcon className="yst-w-5 yst-h-5 yst-fill-primary-500" { ...svgAriaProps } />
				</div>
				<div className="yst-flex-1">
					<Toast.Title title={  __( "New: Your SEO Task list", "wordpress-seo" ) } className="yst-mb-1" />
					<p>
						{  __( "Stay on top of SEO with a clear task list tailored to your site.", "wordpress-seo" ) }
					</p>
				</div>
				<div>
					<Toast.Close dismissScreenReaderLabel={ __( "Dismiss", "wordpress-seo" ) } />
				</div>
			</div>
			<NotificationButtons />
		</>
	</Toast>;
};

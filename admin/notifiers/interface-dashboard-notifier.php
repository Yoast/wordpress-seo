<?php

interface WPSEO_Dashboard_Notifier {

	/**
	 * Handles the notificatier object.
	 *
	 * @param Yoast_Notification_Center $notification_Center The notification center object.
	 *
	 * @return void
	 */
	public function notify( Yoast_Notification_Center $notification_Center );

}
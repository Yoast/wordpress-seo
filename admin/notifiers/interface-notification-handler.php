<?php

interface WPSEO_Notification_Handler {

	/**
	 * Handles the notification object.
	 *
	 * @param Yoast_Notification_Center $notification_Center The notification center object.
	 *
	 * @return void
	 */
	public function handle( Yoast_Notification_Center $notification_Center );

}
<?php

namespace Yoast\WP\SEO\Presenters\Admin;

use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Class Auto_Update_Notification_Presenter.
 *
 * @deprecated 19.8
 * @codeCoverageIgnore
 */
class Auto_Update_Notification_Presenter extends Abstract_Presenter {

	/**
	 * Returns the notification as an HTML string.
	 *
	 * @deprecated 19.8
	 * @codeCoverageIgnore
	 *
	 * @return string The notification in an HTML string representation.
	 */
	public function present() {
		\_deprecated_function( __METHOD__, 'WPSEO 19.8' );

		return '';
	}

	/**
	 * Returns the message to show.
	 *
	 * @deprecated 19.8
	 * @codeCoverageIgnore
	 *
	 * @return string The message.
	 */
	protected function get_message() {
		\_deprecated_function( __METHOD__, 'WPSEO 19.8' );

		return '';
	}
}

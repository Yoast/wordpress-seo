<?php

namespace Yoast\WP\SEO\Presenters\Admin;

use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Class Auto_Update_Notification_Presenter.
 */
class Auto_Update_Notification_Presenter extends Abstract_Presenter {

	/**
	 * Returns the notification as an HTML string.
	 *
	 * @return string The notification in an HTML string representation.
	 */
	public function present() {
		$notification_text  = '<p>';
		$notification_text .= \sprintf(
			/* Translators: %1$s expands to an opening anchor tag for a link leading to the Plugins page, %2$s expands to a closing anchor tag. */
			\esc_html__(
				'We see that you enabled automatic updates for WordPress. We recommend that you do this for Yoast SEO as well. This way we can guarantee that WordPress and Yoast SEO will continue to run smoothly together. %1$sGo to your plugins overview to enable auto-updates for Yoast SEO.%2$s',
				'wordpress-seo'
			),
			'<a href="' . \esc_url( \get_admin_url( null, 'plugins.php' ) ). '">',
			'</a>'
		);
		$notification_text .= '</p>';

		return $notification_text;
	}
}

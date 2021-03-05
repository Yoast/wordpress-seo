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
			/* Translators: %1$s expands to 'Yoast SEO', %2$s to an opening anchor tag for a link leading to the Plugins page, and %3$s to a closing anchor tag. */
			\esc_html__(
				'We see that you enabled automatic updates for WordPress. We recommend that you do this for %1$s as well. This way we can guarantee that WordPress and %1$s will continue to run smoothly together. %2$sGo to your plugins overview to enable auto-updates for %1$s.%3$s',
				'wordpress-seo'
			),
			'Yoast SEO',
			'<a href="' . \esc_url( \get_admin_url( null, 'plugins.php' ) ) . '">',
			'</a>'
		);
		$notification_text .= '</p>';

		return $notification_text;
	}
}

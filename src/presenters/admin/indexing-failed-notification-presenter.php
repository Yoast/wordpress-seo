<?php

namespace Yoast\WP\SEO\Presenters\Admin;

use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Class Indexing_Permalink_Presenter
 *
 * @package Yoast\WP\SEO\Presenters\Notifications
 */
class Indexing_Failed_Notification_Presenter extends Abstract_Presenter {

	/**
	 * @inheritDoc
	 */
	public function present() {
		$notification_text  = '<p>';
		$notification_text .= sprintf(
			/* Translators: %1$s expands to an opening anchor tag for a link leading to the Yoast SEO tools page, %2$s expands to a closing anchor tag. */
			\esc_html__( 'Something has gone wrong and we couldn\'t complete the optimization of your SEO data. Please %1$sre-start the process%2$s.', 'wordpress-seo' ),
			'<a href="' . \get_admin_url( null, 'admin.php?page=wpseo_tools' ) . '">',
			'</a>'
		);
		$notification_text .= '</p>';

		return $notification_text;
	}
}

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
	 * Whether we are in Premium.
	 * (The text in the notification changes a bit depending on whether we are in Premium).
	 *
	 * @var bool
	 */
	protected $is_premium;

	/**
	 * Indexing_Failed_Notification_Presenter constructor.
	 *
	 * @param boolean $is_premium Whether we are in premium or not.
	 */
	public function __construct( $is_premium ) {
		$this->is_premium = $is_premium;
	}

	/**
	 * Returns the notification as an HTML string.
	 *
	 * @return string The notification in an HTML string representation.
	 */
	public function present() {
		$notification_text  = '<p>';
		$notification_text .= sprintf(
			/* Translators: %1$s expands to an opening anchor tag for a link leading to the Yoast SEO tools page, %2$s expands to a closing anchor tag. */
			\esc_html__( 'Something has gone wrong and we couldn\'t complete the optimization of your SEO data. Please %1$sre-start the process%2$s.', 'wordpress-seo' ),
			'<a href="' . \get_admin_url( null, 'admin.php?page=wpseo_tools' ) . '">',
			'</a>'
		);
		if ( $this->is_premium ) {
			$notification_text .= ' ';
			$notification_text .= \esc_html__( 'If the problem persists, please contact support.', 'wordpress-seo' );
		}
		$notification_text .= '</p>';

		return $notification_text;
	}
}

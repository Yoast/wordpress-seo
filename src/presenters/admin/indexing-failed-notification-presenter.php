<?php

namespace Yoast\WP\SEO\Presenters\Admin;

use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Class Indexing_Failed_Notification_Presenter.
 *
 * @package Yoast\WP\SEO\Presenters\Notifications
 */
class Indexing_Failed_Notification_Presenter extends Abstract_Presenter {

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	protected $product_helper;

	/**
	 * Indexing_Failed_Notification_Presenter constructor.
	 *
	 * @param Product_Helper $product_helper The product helper.
	 */
	public function __construct( $product_helper ) {
		$this->product_helper = $product_helper;
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
		if ( $this->product_helper->is_premium() ) {
			$notification_text .= ' ';
			$notification_text .= \esc_html__( 'If the problem persists, please contact support.', 'wordpress-seo' );
		}
		$notification_text .= '</p>';

		return $notification_text;
	}
}

<?php

namespace Yoast\WP\SEO\Presenters\Admin;

use WPSEO_Addon_Manager;
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
	 * The license manager.
	 *
	 * @var WPSEO_Addon_Manager
	 */
	protected $class_addon_manager;

	/**
	 * Indexing_Failed_Notification_Presenter constructor.
	 *
	 * @param Product_Helper      $product_helper      The product helper.
	 * @param WPSEO_Addon_Manager $class_addon_manager The license manager.
	 */
	public function __construct( $product_helper, $class_addon_manager ) {
		$this->class_addon_manager = $class_addon_manager;
		$this->product_helper      = $product_helper;
	}

	/**
	 * Returns the notification as an HTML string.
	 *
	 * @return string The notification in an HTML string representation.
	 */
	public function present() {
		$notification_text  = '<p>';
		$notification_text .= \sprintf(
			/* Translators: %1$s expands to an opening anchor tag for a link leading to the Yoast SEO tools page, %2$s expands to a closing anchor tag. */
			\esc_html__( 'Something has gone wrong and we couldn\'t complete the optimization of your SEO data. Please %1$sre-start the process%2$s.', 'wordpress-seo' ),
			'<a href="' . \get_admin_url( null, 'admin.php?page=wpseo_tools' ) . '">',
			'</a>'
		);
		if ( $this->product_helper->is_premium() ) {
			if ( $this->has_premium_license() ) {
				$notification_text .= ' ';
				$notification_text .= \esc_html__('If the problem persists, please contact support.', 'wordpress-seo');
			} else {
				// no premium license
				$notification_text = \sprintf(
					\esc_html__( 'Oops, something has gone wrong and we couldn\'t complete the optimization of your SEO data. Please make sure your license is active in MyYoast by completing %1$sthe provided steps here%2$s.',
						'wordpress-seo',
						'<a href="'. \esc_url( $this->short_link_helper->get( 'https://yoa.st/3wv' ) ) . '">',
						'</a>'
					);

			}
		}
		$notification_text .= '</p>';

		return $notification_text;
	}

	protected function has_premium_license() {
		return $this->class_addon_manager->has_valid_subscription( WPSEO_Addon_Manager::PREMIUM_SLUG );
	}
}

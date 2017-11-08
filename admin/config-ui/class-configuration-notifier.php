<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Represents the logic for showing the notification.
 */
class WPSEO_Configuration_Notifier {

	/**
	 * Returns the content of the notification.
	 *
	 * @return string
	 */
	public function notify() {
		$notification  = '<div class="yoast-container yoast-container__configuration-wizard">';
		$notification .= '<a href="/wp-admin/admin.php?page=wpseo_dashboard&amp;yoast_promo_hide_premium_upsell_admin_block=1" style="" class="alignright"><span class="screen-reader-text">Dismiss this item.</span><span class="dashicons dashicons-no-alt"></span></a>';
		$notification .= '<h3>' . esc_html__( 'First-time SEO configuration', 'wordpress-seo' ) . '</h3>';
		$notification .= '<p>';
		$notification .= sprintf(
			esc_html__( 'Get started quickly with the %1$s %2$sconfiguration wizard%3$s!', 'wordpress-seo' ),
			'Yoast SEO',
			'<a href="' . esc_url( admin_url( 'admin.php?page=' . WPSEO_Configuration_Page::PAGE_IDENTIFIER ) ) . '">',
			'</a>'
		);
		$notification .= '</p>';
		$notification .= '</div>';

		return $notification;
	}
}

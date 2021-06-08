<?php
namespace Yoast\WP\SEO\Presenters\Admin;

use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Notification to show when indexing failed because of a non-activated license.
 */
class License_Inactive_Notification_Presenter extends Abstract_Presenter {

	/**
	 * The URL to activate the license.
	 *
	 * @var string
	 */
	protected $activate_license_url;

	/**
	 * License_Inactive_Notification_Presenter constructor.
	 *
	 * @param string $activate_license_url The URL to activate the license.
	 */
	public function __construct( $activate_license_url ) {
		$this->activate_license_url = $activate_license_url;
	}

	/**
	 * Returns the notification as a HTML-string.
	 *
	 * @return string The notification.
	 */
	public function present() {
		return \sprintf(
			/* Translators: %1$s expands to an opening anchor tag for a link leading to the plugin activation page on MyYoast, %2$s expands to a closing anchor tag. */
			\esc_html__( 'Oops, something has gone wrong and we couldn\'t complete the optimization of your SEO data. Please make sure your license is active in MyYoast by completing %1$sthe provided steps here%2$s.',
				'wordpress-seo'
			),
			'<a href="' . \esc_url( $this->activate_license_url ) . '">',
			'</a>'
		);
	}
}

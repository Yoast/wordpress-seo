<?php
/**
 * Presenter class for the indexation warning.
 *
 * @package Yoast\YoastSEO\Presenters\Admin
 */

namespace Yoast\WP\SEO\Presenters\Admin;

use WPSEO_Shortlinker;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Migration_Error_Presenter class.
 */
class Migration_Error_Presenter extends Abstract_Presenter {

	/**
	 * Presents the warning that your site's content is not fully indexed.
	 *
	 * @return string The warning HTML.
	 */
	public function present() {
		$message = \sprintf(
			/* translators: %s: Yoast SEO. */
			\esc_html__( '%s was unable to create the database tables required and as such will not function correctly.', 'wordpress-seo' ),
			'Yoast SEO'
		);
		$support = \sprintf(
			/* translators: %1$s: link to help article about solving table issue. %2$s: is anchor closing. */
			esc_html__( 'Please read %1$sthis help article%2$s to find out how to resolve this problem.', 'wordpress-seo' ),
			'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/3-6' ) . '">',
			'</a>'
		);

		return \sprintf(
			'<div class="notice notice-error">' .
				'<p>%1$s</p>' .
				'<p>%2$s</p>' .
			'</div>',
			$message,
			$support
		);
	}
}

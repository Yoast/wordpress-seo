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
	 * Holds the migration error.
	 *
	 * The array holds the following values if filled:
	 * - int|false $time    The timestamp.
	 * - string    $version The Yoast SEO version.
	 * - string    $message The error message.
	 *
	 * @var array
	 */
	protected $migration_error;

	/**
	 * Migration_Error_Presenter constructor.
	 *
	 * @param array $migration_error The migration error.
	 */
	public function __construct( $migration_error ) {
		$this->migration_error = $migration_error;
	}

	/**
	 * Presents the migration error that occurred.
	 *
	 * @return string The error HTML.
	 */
	public function present() {
		$message    = \sprintf(
			/* translators: %s: Yoast SEO. */
			\esc_html__( '%s had problems creating the database tables needed to speed up your site.', 'wordpress-seo' ),
			'Yoast SEO'
		);
		$support    = \sprintf(
			/* translators: %1$s: link to help article about solving table issue. %2$s: is anchor closing. */
			esc_html__( 'Please read %1$sthis help article%2$s to find out how to resolve this problem.', 'wordpress-seo' ),
			'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/3-6' ) . '">',
			'</a>'
		);
		$reassurance    = \sprintf(
		/* translators: %s: Yoast SEO. */
			\esc_html__( 'Your site will continue to work normally, but won\'t take full advantage of %s.', 'wordpress-seo' ),
			'Yoast SEO'
		);

		$debug_info = \sprintf(
			'<details><summary>%1$s</summary><p>%2$s</p></details>',
			\esc_html__( 'Show debug information', 'wordpress-seo' ),
			\esc_html( $this->migration_error['message'] )
		);

		return \sprintf(
			'<div class="notice notice-error"><p>%1$s</p><p>%2$s</p><p>%3$s</p>%4$s</div>',
			$message,
			$support,
			$reassurance,
			$debug_info
		);
	}
}

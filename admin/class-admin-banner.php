<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Admin_Banner.
 */
class WPSEO_Admin_Banner implements WPSEO_WordPress_Integration {
	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'admin_notices', array( $this, 'banner' ) );
	}

	/**
	 * Renders the admin banner.
	 */
	public function banner() {
		if ( isset( $_GET['yst_dismiss_bf'] ) ) {
			WPSEO_Options::set( 'bf_banner_2019_dismissed', $_GET['yst_dismiss_bf'] === '1' );
		}

		if ( ! $this->should_run_banner() ) {
			return;
		}

		$close_url = add_query_arg( array( 'yst_dismiss_bf' => 1 ) );

		?>
		<div class="yoast_bf_sale">
			<a class="close" href="<?php echo esc_url( $close_url ); ?>" aria-label="Dismiss the Yoast Black Friday Banner">X</a>
			<a class="target" href="<?php echo esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/bf-sale-2019' ) ); ?>"></a>
		</div>
		<?php
	}

	/**
	 * Determines whether the banner should be shown or not.
	 *
	 * @return bool True if it should be shown, false if not.
	 */
	private function should_run_banner() {
		if ( WPSEO_Utils::is_yoast_seo_premium() ) {
			return false;
		}

		if ( WPSEO_Options::get( 'bf_banner_2019_dismissed' ) ) {
			return false;
		}

		$time = time();

		// 1574938800 is November 28th 12:00 CET.
		// 1575381600 is December 3rd 15:00 CET.
		if ( $time >= 1574938800 && $time < 1575381600 ) {
			return true;
		}

		return false;
	}
}

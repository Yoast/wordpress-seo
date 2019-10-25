<?php


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
	 * Render the admin banner.
	 */
	public function banner() {
		if ( isset( $_GET['yst_dismiss_bf'] ) ) {
			if ( $_GET['yst_dismiss_bf'] === '1' ) {
				WPSEO_Options::set( 'bf_banner_2019_dismissed', true );
			}
			if ( $_GET['yst_dismiss_bf'] === '0' ) {
				WPSEO_Options::set( 'bf_banner_2019_dismissed', false );
			}
		}

		if ( WPSEO_Options::get( 'bf_banner_2019_dismissed' ) ) {
			return;
		}

		$close_url = add_query_arg( array( 'yst_dismiss_bf' => 1 ) );
		?>
        <div class="yoast_bf_sale">
            <a class="close" href="<?php echo $close_url; ?>" aria-label="Dismiss the Yoast Black Friday Banner">X</a>
            <a class="target" href="https://yoa.st/bf-sale-2019"></a>
        </div>
		<?php
	}
}
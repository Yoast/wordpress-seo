<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class Premium_Upsell_Admin_Block
 */
class Premium_Upsell_Admin_Block {
	/** @var string Hook to display the block on. */
	protected $hook;

	/** @var string Identifier to use in the dismissal functionality. */
	protected $identifier;

	/**
	 * Premium_Upsell_Admin_Block constructor.
	 *
	 * @param string $hook Hook to display the block on.
	 */
	public function __construct( $hook ) {
		$this->hook       = $hook;
		$this->identifier = 'premium_upsell_admin_block';

		if ( ! $this->hide() ) {
			add_action( $this->hook, array( $this, 'render' ) );
		}
	}

	/**
	 * Renders the upsell block
	 */
	public function render() {
		$url = WPSEO_Shortlinker::get( 'https://yoa.st/17h' );

		$class = 'yoast_' . $this->identifier;
		echo '<div class="' . $class . '">';
		echo '<a href="' . esc_url( add_query_arg( array( $this->get_query_variable_name() => 1 ) ) ) . '" style="" class="alignright ' . $class . '--close" aria-label="' . esc_attr( sprintf( __( 'Dismiss %s upgrade motivation', 'wordpress-seo' ), 'Yoast SEO Premium' ) ) . '">X</a>';

		echo '<div>';
		echo '<h2 class="' . $class . '--header">' . __( 'Go premium!', 'wordpress-seo' ) . '</h2>';

		echo
			'<ul class="' . $class . '--motivation">' .
			'<li><div class="' . $class . '--argument"><strong>' . __( 'Multiple keywords', 'wordpress-seo' ) . '</strong>: ' . __( 'Increase your SEO reach', 'wordpress-seo' ) . '</div></li>' .
			'<li><div class="' . $class . '--argument"><strong>' . __( 'No more dead links', 'wordpress-seo' ) . '</strong>: ' . __( 'Easy redirect manager', 'wordpress-seo' ) . '</div></li>' .
			'<li><div class="' . $class . '--argument"><strong>' . __( 'Superfast internal linking suggestions', 'wordpress-seo' ) . '</strong></div></li>' .
			'<li><div class="' . $class . '--argument"><strong>' . __( 'Social media preview', 'wordpress-seo' ) . '</strong>: ' . esc_html__( 'Facebook & Twitter', 'wordpress-seo' ) . '</div></li>' .
			'<li><div class="' . $class . '--argument"><strong>' . __( '24/7 support', 'wordpress-seo' ) . '</strong></div></li>' .
			'<li><div class="' . $class . '--argument"><strong>' . __( 'No ads!', 'wordpress-seo' ) . '</strong></div></li>' .
			'</ul>';

		echo '<p><a href="' . esc_url( $url ) . '" target="_blank">' . sprintf( __( 'Find out why you should upgrade to %s &raquo;', 'wordpress-seo' ), 'Yoast SEO Premium' ) . '</a><br />';
		echo '<small>' . __( 'Prices start as low as 69,- for one site', 'wordpress-seo' ) . '</small></p>';
		echo '</div>';

		echo '</div>';
	}

	/**
	 * Checks if the block should be shown or not.
	 *
	 * @return bool
	 */
	protected function hide() {
		$transient_name = $this->get_option_name();

		$hide = (bool) get_user_option( $transient_name );
		if ( ! $hide ) {
			$query_variable_name = $this->get_query_variable_name();
			if ( filter_input( INPUT_GET, $query_variable_name, FILTER_VALIDATE_INT ) === 1 ) {
				// No expiration time, so this would normally not expire, but it wouldn't be copied to other sites etc.
				update_user_option( get_current_user_id(), $transient_name, true );
				$hide = true;
			}
		}

		return $hide;
	}

	/**
	 * Retrieves the option name to use.
	 *
	 * @return string The name of the option to save the data in.
	 */
	protected function get_option_name() {
		return 'yoast_promo_hide_' . $this->identifier;
	}

	/**
	 * Retrieves the query variable to use for dismissing the block.
	 *
	 * @return string The name of the query variable to use.
	 */
	protected function get_query_variable_name() {
		return 'yoast_promo_hide_' . $this->identifier;
	}
}

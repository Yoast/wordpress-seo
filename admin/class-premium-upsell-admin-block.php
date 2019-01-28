<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Premium_Upsell_Admin_Block
 */
class WPSEO_Premium_Upsell_Admin_Block {

	/**
	 * Hook to display the block on.
	 *
	 * @var string
	 */
	protected $hook;

	/**
	 * Identifier to use in the dismissal functionality.
	 *
	 * @var string
	 */
	protected $identifier = 'premium_upsell_admin_block';

	/**
	 * Registers which hook the block will be displayed on.
	 *
	 * @param string $hook Hook to display the block on.
	 */
	public function __construct( $hook ) {
		$this->hook = $hook;
	}

	/**
	 * Registers WordPress hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! $this->is_hidden() ) {
			add_action( $this->hook, array( $this, 'render' ) );
		}
	}

	/**
	 * Renders the upsell block.
	 *
	 * @return void
	 */
	public function render() {
		$url = WPSEO_Shortlinker::get( 'https://yoa.st/17h' );

		$arguments = array(
			'<strong>' . esc_html__( 'Multiple keyphrases', 'wordpress-seo' ) . '</strong>: ' . esc_html__( 'Increase your SEO reach', 'wordpress-seo' ),
			'<strong>' . esc_html__( 'No more dead links', 'wordpress-seo' ) . '</strong>: ' . esc_html__( 'Easy redirect manager', 'wordpress-seo' ),
			'<strong>' . esc_html__( 'Superfast internal linking suggestions', 'wordpress-seo' ) . '</strong>',
			'<strong>' . esc_html__( 'Social media preview', 'wordpress-seo' ) . '</strong>: ' . esc_html__( 'Facebook & Twitter', 'wordpress-seo' ),
			'<strong>' . esc_html__( '24/7 support', 'wordpress-seo' ) . '</strong>',
			'<strong>' . esc_html__( 'No ads!', 'wordpress-seo' ) . '</strong>',
		);

		$arguments_html = implode( '', array_map( array( $this, 'get_argument_html' ), $arguments ) );

		$class = $this->get_html_class();

		/* translators: %s expands to "Yoast SEO Premium". */
		$dismiss_msg = sprintf( __( 'Dismiss %s upgrade notice', 'wordpress-seo' ), 'Yoast SEO Premium' );

		/* translators: %s expands to Yoast SEO Premium */
		$button_text  = esc_html( sprintf( __( 'Get %s', 'wordpress-seo' ), 'Yoast SEO Premium' ) );
		$button_text .= '<span class="screen-reader-text">' . esc_html__( '(Opens in a new browser tab)', 'wordpress-seo' ) . '</span>' .
			'<span aria-hidden="true" class="yoast-button-upsell__caret"></span>';

		$upgrade_button = sprintf(
			'<a id="wpseo-%1$s-popup-button" class="yoast-button-upsell" href="%2$s" target="_blank">%3$s</a>',
			$this->identifier,
			esc_url( $url ),
			$button_text
		);

		echo '<div class="' . esc_attr( $class ) . '">';
		printf(
			'<a href="%1$s" style="" class="alignright button %2$s" aria-label="%3$s"><span class="dashicons dashicons-no-alt"></span></a>',
			esc_url( add_query_arg( array( $this->get_query_variable_name() => 1 ) ) ),
			esc_attr( $class . '--close' ),
			esc_attr( $dismiss_msg )
		);

		echo '<div>';
		echo '<h2 class="' . esc_attr( $class . '--header' ) . '">' .
			sprintf(
				/* translators: %s expands to Yoast SEO Premium */
				esc_html__( 'Upgrade to %s', 'wordpress-seo' ),
				'Yoast SEO Premium'
			) .
		'</h2>';
		echo '<ul class="' . esc_attr( $class . '--motivation' ) . '">' . $arguments_html . '</ul>';

		echo '<p>' . $upgrade_button . '</p>';
		echo '</div>';

		echo '</div>';
	}

	/**
	 * Formats the argument to a HTML list item.
	 *
	 * @param string $argument The argument to format.
	 *
	 * @return string Formatted argument in HTML.
	 */
	protected function get_argument_html( $argument ) {
		$class = $this->get_html_class();

		return sprintf(
			'<li><div class="%1$s">%2$s</div></li>',
			esc_attr( $class . '--argument' ),
			$argument
		);
	}

	/**
	 * Checks if the block is hidden by the user.
	 *
	 * @return bool False when it should be shown, True if it should be hidden.
	 */
	protected function is_hidden() {
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

	/**
	 * Returns the HTML base class to use.
	 *
	 * @return string The HTML base class.
	 */
	protected function get_html_class() {
		return 'yoast_' . $this->identifier;
	}
}

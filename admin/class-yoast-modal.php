<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class to implement a React modal.
 */
class Yoast_Modal {

	/** @var array The modal configuration. */
	private static $config = array();

	/**
	 * Class constructor.
	 */
	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_footer', array( $this, 'print_localized_config' ) );
	}

	/**
	 * Enqueues the assets needed for the modal.
	 */
	public function enqueue_assets() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'yoast-modal' );
	}

	/**
	 * Prints the modals configuration.
	 */
	public function print_localized_config() {
		$config = self::$config;
		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'yoast-modal', 'yoastModalConfig', $config );
	}

	/**
	 * Adds a single modal configuration to the modals configuration.
	 *
	 * @param array $args The modal configuration arguments.
	 */
	public static function add( $args ) {
		$defaults       = self::get_defaults();
		$single         = array_replace_recursive( $defaults, $args );
		self::$config[] = $single;
	}

	/**
	 * Gets the modals configuration.
	 */
	public function get_config() {
		return self::$config;
	}

	/**
	 * Gets the default configuration for a modal.
	 *
	 * @return array {
	 *     The modal default configuration.
	 *
	 *     @type string $mountHook      Any CSS query selector to target an element that will be replaced
	 *                                  by the modal open button.
	 *     @type string $appElement     Element the modal will hide with `aria-hidden`. For better
	 *                                  accessibility, set it to the most general wrapper and don't use body.
	 *     @type string $openButtonIcon Optional. Icon for the open button.
	 *     @type array  $intl           Locale and labels for the modal main elements. If omitted, the related
	 *                                  elements will not be used. Only exception is `modalAriaLabel` which is
	 *                                  required by the React modal component.
	 *     @type array  $classes        Optional. CSS classes for the modal buttons.
	 *     @type string $content        The name of the React component to use as the modal content.
	 * }
	 */
	public static function get_defaults() {
		$config = array(
			'mountHook'      => '',
			'appElement'     => '#wpwrap',
			'openButtonIcon' => '',
			'intl'           => array(
				'locale'          => WPSEO_Utils::get_user_locale(),
				'open'            => __( 'Open', 'wordpress-seo' ),
				'modalAriaLabel'  => null,
				'heading'         => null,
				'closeIconButton' => __( 'Close', 'wordpress-seo' ),
				'closeButton'     => null,
			),
			'classes'        => array(
				'openButton'      => '',
				'closeIconButton' => '',
				'closeButton'     => '',
			),
			'content'        => null,
		);

		return $config;
	}
}

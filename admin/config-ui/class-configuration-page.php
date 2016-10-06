<?php
/**
 * @package WPSEO\Admin
 */

/**
 * @class WPSEO_Configuration_Wizard Loads the Yoast configuration wizard.
 */
class WPSEO_Configuration_Page {

	const PAGE_IDENTIFIER = 'wpseo_configurator';

	/**
	 * WPSEO_Configuration_Wizard constructor.
	 */
	public function __construct() {

		if ( $this->should_add_notification() ) {
			$this->add_notification();
		}

		if ( filter_input( INPUT_GET, 'page' ) !== self::PAGE_IDENTIFIER ) {
			return;
		}

		// Register the page for the wizard.
		add_action( 'admin_menu', array( $this, 'add_wizard_page' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_init', array( $this, 'render_wizard_page' ) );
	}

	/**
	 * Check if the configuration is finished. If so, just remove the notification.
	 */
	public function catch_configuration_request() {
		$configuration_page = filter_input( INPUT_GET, 'configuration' );
		$page          = filter_input( INPUT_GET, 'page' );

		if ( ! ( $configuration_page === 'finished' && ( $page === WPSEO_Admin::PAGE_IDENTIFIER ) ) ) {
			return;
		}

		$this->remove_notification();
		$this->remove_notification_option();

		wp_redirect( admin_url( 'admin.php?page=' . WPSEO_Admin::PAGE_IDENTIFIER ) );
		exit;
	}


	/**
	 *  Registers the page for the wizard.
	 */
	public function add_wizard_page() {
		add_dashboard_page( '', '', 'manage_options', self::PAGE_IDENTIFIER, '' );
	}

	/**
	 * Renders the wizard page and exits to prevent the wordpress UI from loading.
	 */
	public function render_wizard_page() {
		$this->show_wizard();
		exit;
	}

	/**
	 * Enqueues the assets needed for the wizard.
	 */
	public function enqueue_assets() {
		wp_enqueue_media();

		/*
		 * Print the `forms.css` WP stylesheet before any Yoast style, this way
		 * it's easier to override selectors with the same specificity later.
		 */
		wp_enqueue_style( 'forms' );
		$assetManager = new WPSEO_Admin_Asset_Manager();
		$assetManager->register_assets();
		$assetManager->enqueue_script( 'configuration-wizard' );
		$assetManager->enqueue_style( 'yoast-components' );

		$config = $this->get_config();

		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'configuration-wizard', 'yoastWizardConfig', $config );
	}

	/**
	 * Setup Wizard Header.
	 */
	public function show_wizard() {
		$this->enqueue_assets();
		$dashboard_url = admin_url( '/admin.php?page=wpseo_dashboard' );
		?>
		<!DOCTYPE html>
		<!--[if IE 9]>
		<html class="ie9" <?php language_attributes(); ?> >
		<![endif]-->
		<!--[if !(IE 9) ]><!-->
		<html <?php language_attributes(); ?>>
		<!--<![endif]-->
		<head>
			<meta name="viewport" content="width=device-width"/>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
			<title><?php _e( 'Yoast SEO &rsaquo; Configuration Wizard', 'wordpress-seo' ); ?></title>
			<?php
				do_action( 'admin_print_styles' );
				do_action( 'admin_print_scripts' );
				do_action( 'admin_head' );
			?>
		</head>
		<body class="wp-admin">
		<div id="wizard"></div>
		<a class="yoast-wizard-return-link" href="<?php echo $dashboard_url ?>">
			<?php _e( 'Go back to the Yoast SEO dashboard.', 'wordpress-seo' ); ?>
		</a>
		<footer>
			<?php
			do_action( 'admin_print_footer_scripts' );
			do_action( 'admin_footer' );
			wp_print_scripts( 'yoast-seo-configuration-wizard' );
			?>
		</footer>
		</body>
		</html>
		<?php

	}

	/**
	 * Get the API config for the wizard.
	 *
	 * @return array The API endpoint config.
	 */
	public function get_config() {
		$translations = $this->get_translations();
		$service = new WPSEO_GSC_Service();
		$config  = array(
			'namespace'         => WPSEO_Configuration_Endpoint::REST_NAMESPACE,
			'endpoint_retrieve' => WPSEO_Configuration_Endpoint::ENDPOINT_RETRIEVE,
			'endpoint_store'    => WPSEO_Configuration_Endpoint::ENDPOINT_STORE,
			'nonce'             => wp_create_nonce( 'wp_rest' ),
			'root'              => esc_url_raw( rest_url() ),
			'ajaxurl'           => admin_url( 'admin-ajax.php' ),
			'finishUrl'         => admin_url( 'admin.php?page=wpseo_dashboard&configuration=finished' ),
			'gscAuthURL'        => $service->get_client()->createAuthUrl(),
			'gscProfiles'       => $service->get_sites(),
			'gscNonce'          => wp_create_nonce( 'wpseo-gsc-ajax-security' ),
			'translations'      => $translations,
		);

		return $config;
	}

	/**
	 * Returns the translations necessary for the configuration wizard.
	 *
	 * @returns array The translations for the configuration wizard.
	 */
	public function get_translations() {
		$file = plugin_dir_path( WPSEO_FILE ) . 'languages/yoast-components-' . get_locale() . '.json';
		if ( file_exists( $file ) && $file = file_get_contents( $file ) ) {
			return json_decode( $file, true );
		}

		return array();
	}

	/**
	 * Adds a notification to the notification center.
	 */
	private function add_notification() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->add_notification( self::get_notification() );
	}

	/**
	 * Removes the notification from the notification center.
	 */
	private function remove_notification() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->remove_notification( self::get_notification() );
	}

	/**
	 * Gets the notification.
	 *
	 * @return Yoast_Notification
	 */
	private static function get_notification() {
		$message = sprintf(
			__( 'Since you are new to %1$s you can configure the %2$splugin%3$s', 'wordpress-seo' ),
			'Yoast SEO',
			'<a href="' . admin_url( '?page=' . self::PAGE_IDENTIFIER ) . '">',
			'</a>'
		);

		$notification = new Yoast_Notification(
			$message,
			array(
				'type'         => Yoast_Notification::WARNING,
				'id'           => 'wpseo-dismiss-onboarding-notice',
				'capabilities' => 'manage_options',
				'priority'     => 0.8,
			)
		);

		return $notification;
	}

	/**
	 * When the notice should be shown.
	 *
	 * @return bool
	 */
	private function should_add_notification() {
		$options = $this->get_options();

		return $options['show_onboarding_notice'] === true;
	}

	/**
	 * Remove the options that triggers the notice for the configuration wizard.
	 */
	private function remove_notification_option() {
		$options = $this->get_options();

		$options['show_onboarding_notice'] = false;

		update_option( 'wpseo', $options );
	}

	/**
	 * Returns the set options
	 *
	 * @return mixed|void
	 */
	private function get_options() {
		return get_option( 'wpseo' );
	}
}

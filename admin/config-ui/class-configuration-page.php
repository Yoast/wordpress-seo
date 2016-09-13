<?php
/**
 * @package WPSEO\Admin
 */

/**
 * @class WPSEO_Configuration_Wizard Loads the Yoast onboarding wizard.
 */
class WPSEO_Configuration_Page {

	/**
	 * WPSEO_Configuration_Wizard constructor.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_wizard_page' ) );
		if ( filter_input( INPUT_GET, 'page' ) !== 'wpseo_configurator' ) {
			return;
		}

		// Register the page for the wizard.
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_init', array( $this, 'render_wizard_page' ) );
	}

	/**
	 *  Registers the page for the wizard.
	 */
	public function add_wizard_page() {
		add_dashboard_page( '', '', 'manage_options', 'wpseo_configurator', '' );
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
		<head>
			<meta name="viewport" content="width=device-width"/>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
			<title><?php _e( 'Yoast SEO &rsaquo; Setup Wizard', 'wordpress-seo' ); ?></title>
			<?php
				do_action( 'admin_print_styles' );
				do_action( 'admin_head' );
			?>
		</head>
		<body>
		<div id="wizard"></div>
		<a class="yoast-wizard-return-link" href="<?php echo $dashboard_url; ?>">Go back to the Yoast SEO
			dashboard.</a>
		<footer>
			<?php wp_print_scripts( 'yoast-seo-configuration-wizard' ); ?>
		</footer>
		</body>
		<?php

	}

	/**
	 * Get the API config for the wizard.
	 *
	 * @return array The API endpoint config.
	 */
	public function get_config() {
		$service = new WPSEO_GSC_Service();
		$config  = array(
			'namespace'         => WPSEO_Configuration_Endpoint::REST_NAMESPACE,
			'endpoint_retrieve' => WPSEO_Configuration_Endpoint::ENDPOINT_RETRIEVE,
			'endpoint_store'    => WPSEO_Configuration_Endpoint::ENDPOINT_STORE,
			'nonce'             => wp_create_nonce( 'wp_rest' ),
			'root'              => esc_url_raw( rest_url() ),
			'ajaxurl'           => admin_url( 'admin-ajax.php' ),
			'gscAuthURL'        => $service->get_client()->createAuthUrl(),
			'gscProfiles'       => $service->get_sites(),
			'gscNonce'          => wp_create_nonce( 'wpseo-gsc-ajax-security' ),
		);

		return $config;
	}

	/**
	 * Adds a notification to the notification center.
	 */
	public static function add_notification() {

		$message = sprintf(
			__( 'Since you are new to %1$s you can configure the %2$splugin%3$s', 'wordpress-seo' ),
			'Yoast SEO',
			'<a href="' . admin_url( '?page=wpseo_configurator' ) . '">',
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

		$notification_center = Yoast_Notification_Center::get();
		$notification_center->add_notification( $notification );
	}
}

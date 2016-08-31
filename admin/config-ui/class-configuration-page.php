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
	function __construct() {
		add_action( 'admin_menu', array( $this, 'add_wizard_page' ) );
		if ( empty( $_GET['page'] ) || 'wpseo_configurator' !== $_GET['page'] ) {
			return;
		}
		// Register the page for the wizard.
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_init', array( $this, 'render_wizard_page' ) );
	}

	/**
	 *  Registers the page for the wizard.
	 */
	function add_wizard_page() {
		add_dashboard_page( '', '', 'manage_options', 'wpseo_configurator', '' );
	}

	function render_wizard_page() {
		$this->setup_wizard();
		exit;
	}

	function enqueue_assets() {
		$assetManager = new WPSEO_Admin_Asset_Manager();
		$assetManager->register_assets();
		$assetManager->enqueue_script( 'configuration-wizard' );
		$assetManager->enqueue_style( 'yoast-components' );

		$config = array(
			'namespace'         => WPSEO_Configuration_Endpoint::REST_NAMESPACE,
			'endpoint_retrieve' => WPSEO_Configuration_Endpoint::ENDPOINT_RETRIEVE,
			'endpoint_store'    => WPSEO_Configuration_Endpoint::ENDPOINT_STORE,
			'nonce'             => wp_create_nonce( 'wp_rest' ),
			'root'              => esc_url_raw( rest_url() ),
		);

		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'configuration-wizard', 'yoastWizardConfig', $config );
	}

	/**
	 * Setup Wizard Header.
	 */
	public function setup_wizard() {
		$this->enqueue_assets();
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
		<body class="wc-setup wp-core-ui">
		<div id="wizard"></div>
		<footer>
			<?php wp_print_scripts( 'yoast-seo-configuration-wizard' ); ?>
		</footer>
		</body>
		<?php

	}
}

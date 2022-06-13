<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Old_Configuration_Integration class
 */
class Old_Configuration_Integration implements Integration_Interface {

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_filter( 'admin_menu', [ $this, 'add_submenu_page' ], 11 );
		\add_action( 'admin_init', [ $this, 'redirect_to_new_configuration' ] );
	}

	/**
	 * Adds the old configuration submenu page.
	 *
	 * @param array $submenu_pages The Yoast SEO submenu pages.
	 *
	 * @return array the filtered submenu pages.
	 */
	public function add_submenu_page( $submenu_pages ) {
		\add_submenu_page(
			null,
			\__( 'Old Configuration Wizard', 'wordpress-seo' ),
			null,
			'manage_options',
			'wpseo_configurator',
			[ $this, 'render_page' ]
		);

		return $submenu_pages;
	}

	/**
	 * Renders the old configuration page.
	 */
	public function render_page() {
		// This page is never to be displayed.
	}

	/**
	 * Redirects from the old configuration page to the new configuration page.
	 */
	public function redirect_to_new_configuration() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Data is not processed or saved.
		if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'wpseo_configurator' ) {
			return;
		}
		\wp_safe_redirect( \admin_url( 'admin.php?page=wpseo_dashboard#top#first-time-configuration' ), 302, 'Yoast SEO' );
		exit;
	}
}

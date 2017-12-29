<?php

namespace Yoast\YoastSEO\Config;

use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\WordPress\Integration_Group;
use Model;
use ORM;

class Plugin implements Integration {
	protected $integrations = array();

	/**
	 * @param Integration $integration
	 */
	public function add_integration( Integration $integration ) {
		$this->integrations[] = $integration;
	}

	/**
	 *
	 */
	public function initialize() {
		ORM::configure( 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME );
		ORM::configure( 'username', DB_USER );
		ORM::configure( 'password', DB_PASSWORD );

		Model::$auto_prefix_models = '\\Yoast\\YoastSEO\\Models\\';

		$migration = new Migrations( $GLOBALS['wpdb'] );
		$migration->initialize();
	}

	/**
	 *
	 */
	public function register_hooks() {
		if ( is_admin() ) {
			$this->add_integration( new Admin() );
		}

		if ( ! is_admin() ) {
			$this->add_integration( new Frontend() );
		}

		do_action( 'wpseo_load_integrations', $this );

		$integration_group = new Integration_Group( $this->integrations );
		$integration_group->register_hooks();
	}
}

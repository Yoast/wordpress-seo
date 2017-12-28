<?php

namespace Yoast;

use Yoast\WordPress\Integration;
use Yoast\WordPress\Integration_Group;

class Bootstrap implements Integration {
	protected $integrations = array();

	/**
	 * @param Integration $integration
	 */
	public function add_integration( Integration $integration ) {
		$this->integrations[] = $integration;
	}

	/**
	 * Loads integrations.
	 */
	public function load_integrations() {
		$yoast_seo_integrations = new YoastSEO\Bootstrap();

		do_action( 'wpseo_load_integrations', $this );

		$this->add_integration( $yoast_seo_integrations );
	}

	/**
	 * @return Integration[] List of registered services.
	 */
	protected function get_integrations() {
		return $this->integrations;
	}


	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 */
	public function add_hooks() {
		$integration_group = new Integration_Group( $this->integrations );
		$integration_group->add_hooks();
	}
}

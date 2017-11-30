<?php

namespace Yoast;

use Yoast\WordPress\Integration;
use Yoast\WordPress\Integration_Group;

class Bootstrap extends Integration_Group {
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
}

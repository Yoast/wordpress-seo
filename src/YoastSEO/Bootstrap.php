<?php

namespace Yoast\YoastSEO;

use Yoast\WordPress\Integration;

class Bootstrap implements Integration {

	/** @var array Services */
	protected $services = array();

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		$services = $this->get_services();

		array_map(
			function( Integration $service ) {
				$service->register_hooks();
			},
			$services
		);
	}

	/**
	 * Loads services.
	 */
	public function load_services() {
		$this->add_service( new Meta_Service() );
	}

	/**
	 * @param Integration $service
	 */
	public function add_service( Integration $service ) {
		$this->services[] = $service;
	}

	/**
	 * @return Integration[] List of registered services.
	 */
	protected function get_services() {
		return $this->services;
	}
}

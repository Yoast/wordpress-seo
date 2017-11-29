<?php

namespace Yoast\YoastSEO;

use Yoast\WordPress\Integration;
use Yoast\YoastSEO\Services\Idiorm_Database;
use Yoast\YoastSEO\Services\Indexable;
use Yoast\YoastSEO\Services\PHPMig_Migration;

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
		$this->add_service( new Indexable() );
		$this->add_service( new Idiorm_Database( new PHPMig_Migration()) );
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

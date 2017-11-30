<?php

namespace Yoast\YoastSEO;

use Yoast\WordPress\Integration;
use Yoast\YoastSEO\Services\Idiorm_Database;
use Yoast\YoastSEO\Services\Indexable;
use Yoast\YoastSEO\Services\Migration;

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
		$indexable_service = new Indexable();
		$indexable_service->add_watcher( new Watchers\Post() );
		$indexable_service->add_watcher( new Watchers\Term() );
		$indexable_service->add_watcher( new Watchers\Author() );

		$this->add_service( $indexable_service );
		$this->add_service( new Idiorm_Database( new Migration()) );
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

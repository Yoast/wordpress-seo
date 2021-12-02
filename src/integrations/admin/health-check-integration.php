<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Services\Health_Check\Health_Check;

class Health_Check_Integration implements Integration_Interface {
	
	/**
	 * Contains all the health check implementations.
	 *
	 * @var Health_Check[]
	 */
	private $health_checks = [];
	
	/**
	 * Uses the dependency injection container to obtain all available implementations of the Health_Check interface.
	 *
	 * @param  mixed $health_checks The available health checks implementations.
	 * @return void
	 */
	public function __construct(Health_Check ...$health_checks) {
		$this->health_checks = $health_checks;
	}
	
	/**
	 * Initializes the health checks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		foreach($this->health_checks as $health_check) {
			$this->register_health_check($health_check);
		}
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * In this case: only when on an admin page.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}
	
	/**
	 * register_health_check
	 *
	 * @param  Health_Check $health_check
	 * @return void
	 */
	private function register_health_check($health_check) {
		$direct_status_test = [
			''
		];
		add_filter('site_status_tests');
	}

}
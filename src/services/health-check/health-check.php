<?php

namespace Yoast\WP\SEO\Services\Health_Check;

/**
 * Abstract class for all health checks. Provides a uniform interface for the Health_Check_Integration.
 */
abstract class Health_Check {
	
	/**
	 * runner
	 *
	 * @var mixed
	 */
	private $runner;
	
	/**
	 * Constructor to be called from a health check implementation.
	 *
	 * @param  Health_Check_Runner_Interface $runner The actual health check runner
	 * @return void
	 */
	public function __construct($runner) {
		$this->runner = $runner;
	}
	
	/**
	 * Gets the identifier string from the health check implementation. WordPress needs this to manage the health check (https://developer.wordpress.org/reference/hooks/site_status_tests/).
	 *
	 * @return string
	 */
	abstract public function get_test_name();
	
	/**
	 * Runs the health check, and returns its result in the format that WordPress requires to show the results to the user (https://developer.wordpress.org/reference/hooks/site_status_test_result/).
	 *
	 * @return string[]
	 */
	public function run_and_get_result() {
		$this->runner->run();
		return $this->get_result();
	}
	
	/**
	 * Gets the result from the health check implementation.
	 *
	 * @return void
	 */
	abstract protected function get_result();
}
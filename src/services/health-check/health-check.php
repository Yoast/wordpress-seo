<?php

namespace Yoast\WP\SEO\Services\Health_Check;

/**
 * Abstract class for all health checks. Provides a uniform interface for the Health_Check_Integration.
 */
abstract class Health_Check {
	
	/**
	 * runner
	 *
	 * @var Health_Check_Runner_Interface
	 */
	private $runner;
	
	/**
	 * The health check implementation sets the runner so this class can start a health check.
	 *
	 * @param  Health_Check_Runner_Interface $runner The health check runner
	 * @return void
	 */
	protected function set_runner($runner) {
		$this->runner = $runner;
	}
	
	/**
	 * Returns the identifier of health check implementation. WordPress needs this to manage the health check (https://developer.wordpress.org/reference/hooks/site_status_tests/).
	 *
	 * @return string
	 */
	public function get_test_identifier() {
		$label = $this->get_test_label();
	}
	
	/**
	 * Returns the name of health check implementation that the user can see. WordPress needs this to manage the health check (https://developer.wordpress.org/reference/hooks/site_status_tests/).
	 *
	 * @return string
	 */
	abstract public function get_test_label();
	
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
	 * @return string[]
	 */
	abstract protected function get_result();
}
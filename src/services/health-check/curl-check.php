<?php

namespace Yoast\WP\SEO\Services\Health_Check;

/**
 * Passes if the health check can reach the MyYoast API using a recent enough cURL version.
 */
class Curl_Check extends Health_Check {

	/**
	 * Runs the health check.
	 *
	 * @var Curl_Runner
	 */
	private $runner;

	/**
	 * Generates WordPress-friendly health check results.
	 *
	 * @var Curl_Reports
	 */
	private $reports;

	/**
	 * Constructor.
	 *
	 * @param Curl_Runner  $runner The object that implements the actual health check.
	 * @param Curl_Reports $reports The object that generates WordPress-friendly results.
	 * @return void
	 */
	public function __construct(
		Curl_Runner $runner,
		Curl_Reports $reports
	) {
		$this->runner  = $runner;
		$this->reports = $reports;
		$this->reports->set_test_identifier( $this->get_test_identifier() );

		$this->set_runner( $this->runner );
	}

	/**
	 * Returns a human-readable label for this health check.
	 *
	 * @return string The human-readable label.
	 */
	public function get_test_label() {
		return __( 'cURL', 'wordpress-seo' );
	}

	/**
	 * Returns the WordPress-friendly health check result.
	 *
	 * @return string[] The WordPress-friendly health check result.
	 */
	protected function get_result() {
		if ( ! $this->runner->has_premium_plugins_installed() ) {
			return [];
		}

		if ( $this->runner->is_successful() ) {
			return $this->reports->get_success_result();
		}

		if ( ! $this->runner->has_recent_curl_version_installed() ) {
			return $this->reports->get_no_recent_curl_version_installed_result();
		}

		if ( ! $this->runner->can_reach_my_yoast_api() ) {
			return $this->reports->get_my_yoast_api_not_reachable_result();
		}

		return [];
	}
}

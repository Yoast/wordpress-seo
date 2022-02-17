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
	 * @var Curl_Report_Builder
	 */
	private $report_builder;

	/**
	 * Constructor.
	 *
	 * @param Curl_Runner         $runner The object that implements the actual health check.
	 * @param Curl_Report_Builder $report_builder The object that generates WordPress-friendly results.
	 * @return void
	 */
	public function __construct(
		Curl_Runner $runner,
		Curl_Report_Builder $report_builder
	) {
		$this->runner         = $runner;
		$this->report_builder = $report_builder;
		$this->report_builder->set_test_identifier( $this->get_test_identifier() );

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
		if ( $this->runner->is_successful() ) {
			return $this->report_builder->get_success_result();
		}

		if ( ! $this->runner->has_premium_plugins_installed() ) {
			return [];
		}

		if ( ! $this->runner->has_recent_curl_version_installed() ) {
			return $this->report_builder->get_no_recent_curl_version_installed_result();
		}

		if ( ! $this->runner->can_reach_my_yoast_api() ) {
			return $this->report_builder->get_my_yoast_api_not_reachable_result();
		}

		return [];
	}
}

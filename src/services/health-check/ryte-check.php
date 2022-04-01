<?php

namespace Yoast\WP\SEO\Services\Health_Check;

/**
 * Passes if the health check determines that the site is indexable using Ryte.
 */
class Ryte_Check extends Health_Check {

	/**
	 * Runs the health check.
	 *
	 * @var Ryte_Runner
	 */
	private $runner;

	/**
	 * Generates WordPress-friendly health check results.
	 *
	 * @var Ryte_Reports
	 */
	private $reports;

	/**
	 * Constructor.
	 *
	 * @param Ryte_Runner  $runner The object that implements the actual health check.
	 * @param Ryte_Reports $reports The object that generates WordPress-friendly results.
	 * @return void
	 */
	public function __construct(
		Ryte_Runner $runner,
		Ryte_Reports $reports
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
		return __( 'Ryte', 'wordpress-seo' );
	}

	/**
	 * Returns the WordPress-friendly health check result.
	 *
	 * @return string[] The WordPress-friendly health check result.
	 */
	protected function get_result() {
		if ( ! $this->runner->should_run() ) {
			return [];
		}

		if ( $this->runner->got_response_error() ) {
			$error_response = $this->runner->get_error_response();

			if ( $error_response === null ) {
				return $this->reports->get_unknown_indexability_result();
			}

			return $this->reports->get_response_error_result( $error_response );
		}

		if ( $this->runner->has_unknown_indexability() ) {
			return $this->reports->get_unknown_indexability_result();
		}

		if ( ! $this->runner->is_successful() ) {
			return $this->reports->get_not_indexable_result();
		}

		return $this->reports->get_success_result();
	}
}

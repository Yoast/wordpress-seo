<?php

namespace Yoast\WP\SEO\Services\Health_Check;

/**
 * Paasses when permalinks are set to contain the post name.
 */
class Postname_Permalink_Check extends Health_Check {

	/**
	 * Runs the health check.
	 *
	 * @var Postname_Permalink_Runner
	 */
	private $runner;

	/**
	 * Generates WordPress-friendly health check results.
	 *
	 * @var Postname_Permalink_Reports
	 */
	private $reports;

	/**
	 * Constructor.
	 *
	 * @param  Postname_Permalink_Runner  $runner The object that implements the actual health check.
	 * @param  Postname_Permalink_Reports $reports The object that generates WordPress-friendly results.
	 * @return void
	 */
	public function __construct(
		Postname_Permalink_Runner $runner,
		Postname_Permalink_Reports $reports
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
		return __( 'Postname permalink', 'wordpress-seo' );
	}

	/**
	 * Returns the WordPress-friendly health check result.
	 *
	 * @return string[] The WordPress-friendly health check result.
	 */
	protected function get_result() {
		if ( $this->runner->is_successful() ) {
			return $this->reports->get_success_result();
		}

		return $this->reports->get_has_no_postname_in_permalink_result();
	}
}

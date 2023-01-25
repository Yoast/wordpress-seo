<?php

namespace Yoast\WP\SEO\Services\Health_Check;

/**
 * Passes when the links table is accessible.
 */
class Links_Table_Check extends Health_Check {

	/**
	 * Runs the health check.
	 *
	 * @var Links_Table_Runner
	 */
	private $runner;

	/**
	 * Generates WordPress-friendly health check results.
	 *
	 * @var Links_Table_Reports
	 */
	private $reports;

	/**
	 * Constructor.
	 *
	 * @param Links_Table_Runner  $runner  The object that implements the actual health check.
	 * @param Links_Table_Reports $reports The object that generates WordPress-friendly results.
	 */
	public function __construct(
		Links_Table_Runner $runner,
		Links_Table_Reports $reports
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
		return \__( 'Links table', 'wordpress-seo' );
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

		if ( $this->runner->is_successful() ) {
			return $this->reports->get_success_result();
		}

		return $this->reports->get_links_table_not_accessible_result();
	}
}

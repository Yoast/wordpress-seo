<?php

namespace Yoast\WP\SEO\Services\Health_Check;

/**
 * Paasses when comments are set to be on a single page.
 */
class Page_Comments_Check extends Health_Check {

	/**
	 * Runs the health check.
	 *
	 * @var Page_Comments_Runner
	 */
	private $runner;

	/**
	 * Generates WordPress-friendly health check results.
	 *
	 * @var Page_Comments_Reports
	 */
	private $reports;

	/**
	 * Constructor.
	 *
	 * @param  Page_Comments_Runner  $runner  The object that implements the actual health check.
	 * @param  Page_Comments_Reports $reports The object that generates WordPress-friendly results.
	 * @return void
	 */
	public function __construct(
		Page_Comments_Runner $runner,
		Page_Comments_Reports $reports
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
		return \__( 'Page comments', 'wordpress-seo' );
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

		return $this->reports->get_has_comments_on_multiple_pages_result();
	}
}

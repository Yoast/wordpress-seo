<?php

namespace Yoast\WP\SEO\Services\Health_Check;

/**
 * Passes when the tagline is set to something other than the WordPress default tagline.
 */
class Default_Tagline_Check extends Health_Check {

	/**
	 * Runs the health check.
	 *
	 * @var Default_Tagline_Runner
	 */
	private $runner;

	/**
	 * Generates WordPress-friendly health check results.
	 *
	 * @var Default_Tagline_Report_Builder
	 */
	private $report_builder;

	/**
	 * Constructor.
	 *
	 * @param  Default_Tagline_Runner         $runner         The object that implements the actual health check.
	 * @param  Default_Tagline_Report_Builder $report_builder The object that generates WordPress-friendly results.
	 * @return void
	 */
	public function __construct(
		Default_Tagline_Runner $runner,
		Default_Tagline_Report_Builder $report_builder
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
		return __( 'Default tagline', 'wordpress-seo' );
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

		return $this->report_builder->get_has_default_tagline_result();
	}
}

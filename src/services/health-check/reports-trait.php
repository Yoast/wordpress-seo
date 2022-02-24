<?php

namespace Yoast\WP\SEO\Services\Health_Check;

/**
 * Used by classes that use a health check Report_Builder.
 */
trait Reports_Trait {

	/**
	 * The builder object that generates WordPress-friendly test results.
	 *
	 * @var Report_Builder
	 */
	private $report_builder;

	/**
	 * Sets the name that WordPress uses to identify this health check.
	 *
	 * @param  string $test_identifier The identifier.
	 * @return void
	 */
	public function set_test_identifier( $test_identifier ) {
		$this->report_builder->set_test_identifier( $test_identifier );
	}
}

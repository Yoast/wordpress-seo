<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Services\Health_Check;

use Yoast\WP\SEO\Services\Health_Check\Report_Builder_Factory;
use Yoast\WP\SEO\Services\Health_Check\Reports_Trait;

/**
 * Used for testing the implementation of Reports_Trait.
 */
class Reports_Trait_Double {
	use Reports_Trait;

	public function __construct( Report_Builder_Factory $report_builder_factory ) {
		$this->report_builder_factory = $report_builder_factory;
	}

	public function get_test_identifier() {
		return $this->test_identifier;
	}

	public function get_report_builder_public() {
		return $this->get_report_builder();
	}
}

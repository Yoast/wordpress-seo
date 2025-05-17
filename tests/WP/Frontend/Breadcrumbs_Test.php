<?php

namespace Yoast\WP\SEO\Tests\WP\Frontend;

use WPSEO_Breadcrumbs;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class Breadcrumbs_Test extends TestCase {

	/**
	 * Placeholder test to prevent PHPUnit from throwing errors.
	 *
	 * @covers WPSEO_Breadcrumbs::breadcrumb
	 *
	 * @return void
	 */
	public function test_breadcrumb_before() {

		// Test before argument.
		$output   = WPSEO_Breadcrumbs::breadcrumb( 'before', '', false );
		$expected = 'before';
		$this->assertStringStartsWith( $expected, $output );

		// @todo Test actual breadcrumb output.
	}

	/**
	 * Placeholder test to prevent PHPUnit from throwing errors.
	 *
	 * @covers WPSEO_Breadcrumbs::breadcrumb
	 *
	 * @return void
	 */
	public function test_breadcrumb_after() {

		// Test after argument.
		$output   = WPSEO_Breadcrumbs::breadcrumb( '', 'after', false );
		$expected = 'after';
		$this->assertStringEndsWith( $expected, $output );

		// @todo Test actual breadcrumb output.
	}
}

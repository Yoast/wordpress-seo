<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_Breadcrumbs_Test extends WPSEO_UnitTestCase {

	/**
	 * Placeholder test to prevent PHPUnit from throwing errors.
	 *
	 * @covers WPSEO_Breadcrumbs::breadcrumb
	 */
	/*public function test_breadcrumb_home() {

		// Test for home breadcrumb.
		$expected = '<span prefix="v: http://rdf.data-vocabulary.org/#">
			<span typeof="v:Breadcrumb"><span class="breadcrumb_last" property="v:title">Home</span></span>
		</span>';
		$output = WPSEO_Breadcrumbs::breadcrumb( '', '', false );
		$this->assertSame( $expected, trim( $output ) );

		// @todo Test actual breadcrumb output.
	}*/

	/**
	 * Placeholder test to prevent PHPUnit from throwing errors.
	 *
	 * @covers WPSEO_Breadcrumbs::breadcrumb
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
	 */
	public function test_breadcrumb_after() {

		// Test after argument.
		$output   = WPSEO_Breadcrumbs::breadcrumb( '', 'after', false );
		$expected = 'after';
		$this->assertStringEndsWith( $expected, $output );

		// @todo Test actual breadcrumb output.
	}
}

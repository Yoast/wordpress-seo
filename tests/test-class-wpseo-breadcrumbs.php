<?php

class WPSEO_Breadcrumbs_Test extends WPSEO_UnitTestCase {

	/**
	 * Placeholder test to prevent PHPUnit from throwing errors
	 */
	public function test_breadcrumb() {

		// test for empty breadcrumb
		$output = WPSEO_Breadcrumbs::breadcrumb( '', '', false );
		$this->assertEmpty( $output );

		// test before argument
		$output = WPSEO_Breadcrumbs::breadcrumb( 'before', '', false );
		$expected = 'before';
		$this->assertStringStartsWith( $expected, $output );

		// test after argument
		$output = WPSEO_Breadcrumbs::breadcrumb( '', 'after', false );
		$expected = 'after';
		$this->assertStringEndsWith( $expected, $output );

		// todo test actual breadcrumb output..
	}


}
<?php

class WPSEO_Breadcrumbs_Test extends WPSEO_UnitTestCase {

	/**
	 * Placeholder test to prevent PHPUnit from throwing errors
	 */
	public function test_breadcrumb_home() {

		// test for home breadcrumb
		$expected = '<span prefix="v: http://rdf.data-vocabulary.org/#">
			<span typeof="v:Breadcrumb"><span class="breadcrumb_last" property="v:title">Home</span></span>
		</span>';
		$output = WPSEO_Breadcrumbs::breadcrumb( '', '', false );
		$this->assertSame( $expected, trim( $output ) );

		// todo test actual breadcrumb output..
	}


	/**
	 * Placeholder test to prevent PHPUnit from throwing errors
	 */
	public function test_breadcrumb_before() {

		// test before argument
		$output   = WPSEO_Breadcrumbs::breadcrumb( 'before', '', false );
		$expected = 'before';
		$this->assertStringStartsWith( $expected, $output );

		// todo test actual breadcrumb output..
	}

	/**
	 * Placeholder test to prevent PHPUnit from throwing errors
	 */
	public function test_breadcrumb_after() {

		// test after argument
		$output   = WPSEO_Breadcrumbs::breadcrumb( '', 'after', false );
		$expected = 'after';
		$this->assertStringEndsWith( $expected, $output );

		// todo test actual breadcrumb output..
	}

}
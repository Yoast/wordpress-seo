<?php

/**
 * @package WPSEO\Unittests
 */
class WPSEO_Breadcrumbs_Test extends WPSEO_UnitTestCase {

	/**
	 * Placeholder test to prevent PHPUnit from throwing errors
	 */
	/*public function test_breadcrumb_home() {

		// test for home breadcrumb
		$expected = '<span prefix="v: http://rdf.data-vocabulary.org/#">
			<span typeof="v:Breadcrumb"><span class="breadcrumb_last" property="v:title">Home</span></span>
		</span>';
		$output = WPSEO_Breadcrumbs::breadcrumb( '', '', false );
		$this->assertSame( $expected, trim( $output ) );

		// todo test actual breadcrumb output..
	}*/


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

	/**
	 * Tests the default standard for the breadcrumbs
	 */
	public function test_breadcrumb_default_standard() {

		$default_standard = 'schema';
		$standard         = WPSEO_Breadcrumbs::get_instance()->get_breadcrumb_standard();
		$this->assertEquals( $default_standard, $standard );
	}

	/**
	 * Tests the changing from the breadcrumb generation standard.
	 */
	public function test_breadcrumb_change_standard() {
		$standard = 'data-vocabulary';
		add_theme_support( 'yoast-seo-breadcrumbs', array( 'standard' => $standard ) );

		// Test via current_theme_supports.
		$configured_standard = WPSEO_Breadcrumbs::get_instance()->get_breadcrumb_standard();

		$this->assertEquals( $standard, $configured_standard );
	}

	/**
	 * Tests the default breadcrumb html output.
	 */
	public function test_data_vocabulary_standard() {
		$expected_html = '<span vocab="http://schema.org/" typeof="BreadcrumbList"><span property="itemListElement" typeof="ListItem"><a property="item" typeof="WebPage" href="http://example.org/"><span property="name">Home</span><meta property="position" content="1"></a></span></span>';

		$this->expectOutput( $expected_html, WPSEO_Breadcrumbs::breadcrumb() );
	}
}
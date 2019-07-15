<?php

namespace Yoast\WP\Free\Tests\Admin\Metabox;

use Yoast\WP\Free\Tests\TestCase;
use WPSEO_Metabox_Section_Additional;
use Brain\Monkey;

/**
 * Unit Test Class.
 *
 * @group Metabox
 */
class Metabox_Section_Additional extends TestCase {

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		Monkey\Functions\expect( 'wp_parse_args' )
			->once()
			->andReturnUsing( function( $settings, $defaults ) {
				return \array_merge( $defaults, $settings );
			} );
	}

	/**
	 * Tests the output of \WPSEO_Metabox_Section_Additional::display_content.
	 *
	 * @covers WPSEO_Metabox_Section_Additional::__construct
	 * @covers WPSEO_Metabox_Section_Additional::display_content
	 * @covers WPSEO_Metabox_Section_Additional::display_link
	 */
	public function test_display_content() {
		$section = new WPSEO_Metabox_Section_Additional( 'additional-tab', 'Additional Tab', 'Additional Content' );

		$section->display_content();

		$this->expectOutputContains( [
			'Additional Content',
			'id="wpseo-meta-section-additional-tab"',
			'aria-labelledby="wpseo-meta-tab-additional-tab"'
		] );
	}

	/**
	 * Tests the output of \WPSEO_Metabox_Section_Additional::display_link.
	 *
	 * @covers WPSEO_Metabox_Section_Additional::__construct
	 * @covers WPSEO_Metabox_Section_Additional::display_content
	 * @covers WPSEO_Metabox_Section_Additional::display_link
	 */
	public function test_display_link() {
		$section = new WPSEO_Metabox_Section_Additional( 'additional-tab', 'Additional Tab', 'Additional Content', [ 'link_class' => 'additional-class', 'link_aria_label' => 'additional-aria' ] );

		$section->display_link();

		$this->expectOutputContains( [
			'Additional Tab',
			'id="wpseo-meta-tab-additional-tab"',
			'href="#wpseo-meta-section-additional-tab"',
			'aria-controls="wpseo-meta-section-additional-tab"',
			'additional-class',
			'aria-label="additional-aria"'
		] );
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Metabox;

use WPSEO_Metabox_Section_Additional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group Metabox
 */
final class Metabox_Section_Additional_Test extends TestCase {

	/**
	 * Set up function stubs.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
	}

	/**
	 * Tests the output of \WPSEO_Metabox_Section_Additional::display_content.
	 *
	 * @dataProvider data_display_content
	 *
	 * @covers WPSEO_Metabox_Section_Additional::__construct
	 * @covers WPSEO_Metabox_Section_Additional::display_content
	 *
	 * @param string $expected Substring expected to be found in the actual output.
	 *
	 * @return void
	 */
	public function test_display_content( $expected ) {
		$section = new WPSEO_Metabox_Section_Additional( 'additional-tab', 'Additional Tab', 'Additional Content' );

		$section->display_content();

		$this->expectOutputContains( $expected );
	}

	/**
	 * Data provider for the `test_display_content()` test.
	 *
	 * @return array
	 */
	public static function data_display_content() {
		return [
			[ 'Additional Content' ],
			[ 'id="wpseo-meta-section-additional-tab"' ],
			[ 'aria-labelledby="wpseo-meta-tab-additional-tab"' ],
		];
	}

	/**
	 * Tests the output of \WPSEO_Metabox_Section_Additional::display_link.
	 *
	 * @dataProvider data_display_link
	 *
	 * @covers WPSEO_Metabox_Section_Additional::__construct
	 * @covers WPSEO_Metabox_Section_Additional::display_content
	 * @covers WPSEO_Metabox_Section_Additional::display_link
	 *
	 * @param string $expected Substring expected to be found in the actual output.
	 *
	 * @return void
	 */
	public function test_display_link( $expected ) {
		$section = new WPSEO_Metabox_Section_Additional(
			'additional-tab',
			'Additional Tab',
			'Additional Content',
			[
				'link_class'      => 'additional-class',
				'link_aria_label' => 'additional-aria',
			]
		);

		$section->display_link();

		$this->expectOutputContains( $expected );
	}

	/**
	 * Data provider for the `test_display_link()` test.
	 *
	 * @return array
	 */
	public static function data_display_link() {
		return [
			[ 'Additional Tab' ],
			[ 'id="wpseo-meta-tab-additional-tab"' ],
			[ 'href="#wpseo-meta-section-additional-tab"' ],
			[ 'aria-controls="wpseo-meta-section-additional-tab"' ],
			[ 'additional-class' ],
			[ 'aria-label="additional-aria"' ],
		];
	}

	/**
	 * Tests the output of \WPSEO_Metabox_Section_Additional::display_link.
	 *
	 * @covers WPSEO_Metabox_Section_Additional::__construct
	 * @covers WPSEO_Metabox_Section_Additional::display_link
	 *
	 * @return void
	 */
	public function test_display_link_no_aria_label() {
		$section = new WPSEO_Metabox_Section_Additional(
			'additional-tab',
			'Additional Tab',
			'Additional Content',
			[ 'link_class' => 'additional-class' ]
		);

		$section->display_link();

		$this->expectOutputContains( 'href="#wpseo-meta-section-additional-tab"' );

		$this->assertStringNotContainsString( 'aria-label', $this->getActualOutput() );
	}
}

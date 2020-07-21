<?php

namespace Yoast\WP\SEO\Tests\Admin\Metabox;

use WPSEO_Metabox_Section_Additional;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @group Metabox
 */
class Metabox_Section_Additional_Test extends TestCase {

	/**
	 * Tests the output of \WPSEO_Metabox_Section_Additional::display_content.
	 *
	 * @covers WPSEO_Metabox_Section_Additional::__construct
	 * @covers WPSEO_Metabox_Section_Additional::display_content
	 */
	public function test_display_content() {
		$section = new WPSEO_Metabox_Section_Additional( 'additional-tab', 'Additional Tab', 'Additional Content' );

		$section->display_content();

		$this->expectOutputContains(
			[
				'Additional Content',
				'id="wpseo-meta-section-additional-tab"',
				'aria-labelledby="wpseo-meta-tab-additional-tab"',
			]
		);
	}

	/**
	 * Tests the output of \WPSEO_Metabox_Section_Additional::display_link.
	 *
	 * @covers WPSEO_Metabox_Section_Additional::__construct
	 * @covers WPSEO_Metabox_Section_Additional::display_content
	 * @covers WPSEO_Metabox_Section_Additional::display_link
	 */
	public function test_display_link() {
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

		$this->expectOutputContains(
			[
				'Additional Tab',
				'id="wpseo-meta-tab-additional-tab"',
				'href="#wpseo-meta-section-additional-tab"',
				'aria-controls="wpseo-meta-section-additional-tab"',
				'additional-class',
				'aria-label="additional-aria"',
			]
		);
	}

	/**
	 * Tests the output of \WPSEO_Metabox_Section_Additional::display_link.
	 *
	 * @covers WPSEO_Metabox_Section_Additional::__construct
	 * @covers WPSEO_Metabox_Section_Additional::display_link
	 */
	public function test_display_link_no_aria_label() {
		$section = new WPSEO_Metabox_Section_Additional( 'additional-tab', 'Additional Tab', 'Additional Content', [ 'link_class' => 'additional-class' ] );

		$section->display_link();

		$this->expectOutputNotContains( [ 'aria-label' ] );
	}
}

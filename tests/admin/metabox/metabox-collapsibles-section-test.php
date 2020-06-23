<?php

namespace Yoast\WP\SEO\Tests\Admin\Metabox;

use Brain\Monkey;
use WPSEO_Metabox_Collapsible;
use WPSEO_Metabox_Collapsibles_Sections;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @group Metabox
 */
class Metabox_Collapsibles_Section_Test extends TestCase {

	/**
	 * Tests the output of \WPSEO_Metabox_Collapsibles_Section::display_content.
	 *
	 * @covers WPSEO_Metabox_Collapsibles_Sections::__construct
	 * @covers WPSEO_Metabox_Collapsibles_Sections::display_content
	 * @covers WPSEO_Metabox_Collapsibles_Sections::has_sections
	 * @covers WPSEO_Abstract_Metabox_Tab_With_Sections::__construct
	 * @covers WPSEO_Metabox_Collapsible::__construct
	 * @covers WPSEO_Metabox_Collapsible::content
	 * @covers WPSEO_Metabox_Collapsible::link
	 */
	public function test_display_content_with_collapsible() {
		Monkey\Functions\stubs( [ 'esc_attr_e' ] );

		$collapsibles = [];

		$collapsibles[] = new WPSEO_Metabox_Collapsible(
			'collapsible-1',
			'Collapsible 1 content',
			'Collapsible 1 label'
		);

		$section = new WPSEO_Metabox_Collapsibles_Sections(
			'collapsibles-tab',
			'Metabox Tab Title',
			$collapsibles
		);

		$section->display_content();

		$this->expectOutputContains(
			[
				'Collapsible 1 label',
				'Collapsible 1 content',
				'wpseo-meta-section-collapsibles-tab',
			]
		);
	}

	/**
	 * Tests the output of \WPSEO_Metabox_Collapsibles_Section::display_link.
	 *
	 * @covers WPSEO_Metabox_Collapsibles_Sections::__construct
	 * @covers WPSEO_Metabox_Collapsibles_Sections::display_content
	 * @covers WPSEO_Metabox_Collapsibles_Sections::has_sections
	 * @covers WPSEO_Abstract_Metabox_Tab_With_Sections::__construct
	 * @covers WPSEO_Abstract_Metabox_Tab_With_Sections::display_link
	 * @covers WPSEO_Metabox_Collapsible::__construct
	 * @covers WPSEO_Metabox_Collapsible::content
	 * @covers WPSEO_Metabox_Collapsible::link
	 */
	public function test_display_link_with_collapsible() {
		$collapsibles = [];

		$collapsibles[] = new WPSEO_Metabox_Collapsible(
			'collapsible-1',
			'Collapsible 1 content',
			'Collapsible 1 label'
		);

		$section = new WPSEO_Metabox_Collapsibles_Sections(
			'collapsibles-tab',
			'Metabox Tab Title',
			$collapsibles
		);

		$section->display_link();

		$this->expectOutputContains( [ 'Metabox Tab Title' ] );
	}
}

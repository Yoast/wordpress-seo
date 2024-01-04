<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Metabox;

use WPSEO_Metabox_Collapsible;
use WPSEO_Metabox_Collapsibles_Sections;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group Metabox
 */
final class Metabox_Collapsibles_Sections_Test extends TestCase {

	/**
	 * Set up function stubs.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();
	}

	/**
	 * Tests the output of \WPSEO_Metabox_Collapsibles_Section::display_content.
	 *
	 * @dataProvider data_display_content_with_collapsible
	 *
	 * @covers WPSEO_Metabox_Collapsibles_Sections::__construct
	 * @covers WPSEO_Metabox_Collapsibles_Sections::display_content
	 * @covers WPSEO_Metabox_Collapsibles_Sections::has_sections
	 * @covers WPSEO_Abstract_Metabox_Tab_With_Sections::__construct
	 * @covers WPSEO_Metabox_Collapsible::__construct
	 * @covers WPSEO_Metabox_Collapsible::content
	 * @covers WPSEO_Metabox_Collapsible::link
	 *
	 * @param string $expected Substring expected to be found in the actual output.
	 *
	 * @return void
	 */
	public function test_display_content_with_collapsible( $expected ) {
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

		$this->expectOutputContains( $expected );
	}

	/**
	 * Data provider for the `test_display_content_with_collapsible()` test.
	 *
	 * @return array
	 */
	public static function data_display_content_with_collapsible() {
		return [
			[ 'Collapsible 1 label' ],
			[ 'Collapsible 1 content' ],
			[ 'wpseo-meta-section-collapsibles-tab' ],
		];
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
	 *
	 * @return void
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

		$this->expectOutputContains( 'Metabox Tab Title' );
	}
}

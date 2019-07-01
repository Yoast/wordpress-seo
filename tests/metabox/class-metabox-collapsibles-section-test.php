<?php

namespace Yoast\WP\Free\Tests\Admin\Metabox;

use Yoast\WP\Free\Tests\TestCase;
use \WPSEO_Metabox_Collapsibles_Section;
use \WPSEO_Metabox_Collapsible;
use Brain\Monkey;

/**
 * Unit Test Class.
 */
class WPSEO_Metabox_Collapsibles_Section_Test extends TestCase {

	/**
	 * Tests the output of \WPSEO_Metabox_Collapsibles_Section::display_content.
	 *
	 * @covers WPSEO_Metabox_Collapsibles_Section::display_content
	 * @covers WPSEO_Metabox_Collapsibles_Section::has_sections
	 * @covers WPSEO_Metabox_Collapsible::content
	 * @covers WPSEO_Metabox_Collapsible::link
	 */
	public function test_display_content_with_collapsible() {
		Monkey\Functions\expect( 'wp_parse_args' )
			->once()
			->andReturnUsing( function( $settings, $defaults ) {
				return array_merge( $defaults, $settings );
			} );

		$collapsibles = [];

		$collapsibles[] = new WPSEO_Metabox_Collapsible(
			'collapsible-1',
			'Collapsible 1 content',
			'Collapsible 1 label'
		);

		$section = new WPSEO_Metabox_Collapsibles_Section(
			'collapsibles-tab',
			'Metabox Tab Title',
			$collapsibles
		);

		$section->display_content();

		$this->expectOutputContains( [
			'Collapsible 1 label',
			'Collapsible 1 content',
			'wpseo-meta-section-collapsibles-tab'
		] );
	}
}

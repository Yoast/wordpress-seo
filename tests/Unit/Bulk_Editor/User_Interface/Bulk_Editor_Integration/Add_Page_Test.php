<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

use Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

/**
 * Tests adding the bulk editor page.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::add_page
 */
final class Add_Page_Test extends Abstract_Bulk_Editor_Integration_Test {

	/**
	 * Tests adding the bulk editor page.
	 *
	 * @return void
	 */
	public function test_add_page() {
		$this->stubTranslationFunctions();

		$this->assertEquals(
			[
				'wpseo_tools',
				[
					'wpseo_dashboard',
					'',
					'Bulk editor',
					'wpseo_manage_options',
					Bulk_Editor_Integration::PAGE,
					[ $this->instance, 'display_page' ],
				],
			],
			$this->instance->add_page( [ 'wpseo_tools' ] ),
		);
	}
}

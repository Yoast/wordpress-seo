<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

/**
 * Tests displaying the bulk editor page.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::display_page
 */
final class Display_Page_Test extends Abstract_Bulk_Editor_Integration_Test {

	/**
	 * Tests displaying the bulk editor page.
	 *
	 * @return void
	 */
	public function test_display_page() {
		\ob_start();
		$this->instance->display_page();
		$output = \ob_get_clean();

		$this->assertSame( '<div id="yoast-seo-bulk-editor"></div>', $output );
	}
}

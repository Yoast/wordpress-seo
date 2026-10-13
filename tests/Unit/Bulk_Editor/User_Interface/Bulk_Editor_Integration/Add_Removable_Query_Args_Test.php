<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

use Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

/**
 * Tests registering the carried-over selection parameters as removable.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::add_removable_query_args
 */
final class Add_Removable_Query_Args_Test extends Abstract_Test {

	/**
	 * Tests that the selection parameters are added to the removable query args.
	 *
	 * @return void
	 */
	public function test_add_removable_query_args() {
		$this->assertSame(
			[
				'settings-updated',
				Bulk_Editor_Integration::POST_IDS_PARAM,
				Bulk_Editor_Integration::SELECTED_COUNT_PARAM,
			],
			$this->instance->add_removable_query_args( [ 'settings-updated' ] ),
		);
	}
}

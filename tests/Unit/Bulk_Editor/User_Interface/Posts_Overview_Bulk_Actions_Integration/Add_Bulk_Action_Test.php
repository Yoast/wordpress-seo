<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Posts_Overview_Bulk_Actions_Integration;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Overview_Bulk_Actions_Integration;

/**
 * Tests adding the entry to the bulk-actions dropdown.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Overview_Bulk_Actions_Integration::add_bulk_action
 */
final class Add_Bulk_Action_Test extends Abstract_Posts_Overview_Bulk_Actions_Integration_Test {

	/**
	 * Tests that the entry is added to the dropdown, grouped under a "Yoast SEO" optgroup
	 * after the default actions, with the navigation arrow in text presentation.
	 *
	 * @return void
	 */
	public function test_adds_the_bulk_action() {
		$this->stubTranslationFunctions();
		Functions\when( 'is_rtl' )->justReturn( false );
		$this->current_page_helper->expects( 'is_trash_overview' )->once()->andReturn( false );

		$actions = [ 'edit' => 'Edit' ];

		$this->assertSame(
			[
				'edit'      => 'Edit',
				'Yoast SEO' => [
					Posts_Overview_Bulk_Actions_Integration::BULK_ACTION => "Bulk edit \u{2197}\u{FE0E}",
				],
			],
			$this->instance->add_bulk_action( $actions ),
		);
	}

	/**
	 * Tests that the navigation arrow is mirrored on RTL admins.
	 *
	 * @return void
	 */
	public function test_mirrors_the_arrow_on_rtl() {
		$this->stubTranslationFunctions();
		Functions\when( 'is_rtl' )->justReturn( true );
		$this->current_page_helper->expects( 'is_trash_overview' )->once()->andReturn( false );

		$actions = $this->instance->add_bulk_action( [] );

		$this->assertSame(
			"Bulk edit \u{2196}\u{FE0E}",
			$actions['Yoast SEO'][ Posts_Overview_Bulk_Actions_Integration::BULK_ACTION ],
		);
	}

	/**
	 * Tests that the entry is not added on the trash view.
	 *
	 * @return void
	 */
	public function test_does_not_add_the_bulk_action_on_the_trash_view() {
		$this->current_page_helper->expects( 'is_trash_overview' )->once()->andReturn( true );

		$actions = [ 'untrash' => 'Restore' ];

		$this->assertSame( $actions, $this->instance->add_bulk_action( $actions ) );
	}
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Batch_Limit;

/**
 * Test class for validate_items.
 *
 * @group Bulk_Editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Abstract_Bulk_Update_Route::validate_items
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Search_Bulk_Update_Route_Validate_Items_Test extends Abstract_Search_Bulk_Update_Route_Test {

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		// Defines the WP_Error class, which is not available in the unit test context.
		Mockery::mock( WP_Error::class );
	}

	/**
	 * Tests valid items pass validation.
	 *
	 * @return void
	 */
	public function test_validate_items_valid() {
		$items = [
			[
				'id'        => 1,
				'seo_title' => 'The title',
			],
			[
				'id'               => 2,
				'meta_description' => '',
			],
		];

		$this->assertTrue( $this->instance->validate_items( $items ) );
	}

	/**
	 * Tests an item carrying only a focus keyphrase passes validation.
	 *
	 * @return void
	 */
	public function test_validate_items_focus_keyphrase_only() {
		$items = [
			[
				'id'              => 1,
				'focus_keyphrase' => 'The keyphrase',
			],
		];

		$this->assertTrue( $this->instance->validate_items( $items ) );
	}

	/**
	 * Tests an item with a non-string focus keyphrase fails validation.
	 *
	 * @return void
	 */
	public function test_validate_items_non_string_focus_keyphrase() {
		$items = [
			[
				'id'              => 1,
				'focus_keyphrase' => 123,
			],
		];

		$this->assertInstanceOf( WP_Error::class, $this->instance->validate_items( $items ) );
	}

	/**
	 * Tests a non-array value fails validation.
	 *
	 * @return void
	 */
	public function test_validate_items_not_an_array() {
		$this->assertInstanceOf( WP_Error::class, $this->instance->validate_items( 'not-an-array' ) );
	}

	/**
	 * Tests an empty batch fails validation.
	 *
	 * @return void
	 */
	public function test_validate_items_empty() {
		$this->assertInstanceOf( WP_Error::class, $this->instance->validate_items( [] ) );
	}

	/**
	 * Tests an item without an id fails validation.
	 *
	 * @return void
	 */
	public function test_validate_items_missing_id() {
		$items = [
			[ 'seo_title' => 'The title' ],
		];

		$this->assertInstanceOf( WP_Error::class, $this->instance->validate_items( $items ) );
	}

	/**
	 * Tests an item with a non-integer id fails validation.
	 *
	 * @return void
	 */
	public function test_validate_items_non_integer_id() {
		$items = [
			[
				'id'        => '1',
				'seo_title' => 'The title',
			],
		];

		$this->assertInstanceOf( WP_Error::class, $this->instance->validate_items( $items ) );
	}

	/**
	 * Tests a batch over the limit fails validation.
	 *
	 * @return void
	 */
	public function test_validate_items_too_many() {
		$items = \array_fill(
			0,
			( Batch_Limit::MAX_ITEMS + 1 ),
			[
				'id'        => 1,
				'seo_title' => 'The title',
			],
		);

		$this->assertInstanceOf( WP_Error::class, $this->instance->validate_items( $items ) );
	}

	/**
	 * Tests an item without any field to update fails validation.
	 *
	 * @return void
	 */
	public function test_validate_items_no_fields() {
		$items = [
			[
				'id'        => 1,
				'seo_title' => 'The title',
			],
			[ 'id' => 2 ],
		];

		$this->assertInstanceOf( WP_Error::class, $this->instance->validate_items( $items ) );
	}
}

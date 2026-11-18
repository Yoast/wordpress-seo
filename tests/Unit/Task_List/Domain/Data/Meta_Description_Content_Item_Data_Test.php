<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Domain\Data;

use Yoast\WP\SEO\Task_List\Domain\Data\Meta_Description_Content_Item_Data;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Meta_Description_Content_Item_Data value object.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Domain\Data\Meta_Description_Content_Item_Data
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Meta_Description_Content_Item_Data_Test extends TestCase {

	/**
	 * Tests that get_content_id returns the content ID passed to the constructor.
	 *
	 * @return void
	 */
	public function test_get_content_id() {
		$instance = new Meta_Description_Content_Item_Data( 42, 'Test Title', false );

		$this->assertSame( 42, $instance->get_content_id() );
	}

	/**
	 * Tests that get_title returns the title passed to the constructor.
	 *
	 * @return void
	 */
	public function test_get_title() {
		$instance = new Meta_Description_Content_Item_Data( 42, 'Test Title', false );

		$this->assertSame( 'Test Title', $instance->get_title() );
	}

	/**
	 * Tests that get_content_id returns the correct ID with a different value.
	 *
	 * @return void
	 */
	public function test_get_content_id_with_different_value() {
		$instance = new Meta_Description_Content_Item_Data( 999, 'Another Title', false );

		$this->assertSame( 999, $instance->get_content_id() );
	}

	/**
	 * Tests that get_title returns the correct title with a different value.
	 *
	 * @return void
	 */
	public function test_get_title_with_different_value() {
		$instance = new Meta_Description_Content_Item_Data( 1, 'A Different Post Title', false );

		$this->assertSame( 'A Different Post Title', $instance->get_title() );
	}

	/**
	 * Tests that get_title returns an empty string when constructed with an empty title.
	 *
	 * @return void
	 */
	public function test_get_title_with_empty_string() {
		$instance = new Meta_Description_Content_Item_Data( 1, '', false );

		$this->assertSame( '', $instance->get_title() );
	}

	/**
	 * Tests that has_description returns true when constructed with true.
	 *
	 * @return void
	 */
	public function test_has_description_returns_true() {
		$instance = new Meta_Description_Content_Item_Data( 42, 'Test Title', true );

		$this->assertTrue( $instance->has_description() );
	}

	/**
	 * Tests that has_description returns false when constructed with false.
	 *
	 * @return void
	 */
	public function test_has_description_returns_false() {
		$instance = new Meta_Description_Content_Item_Data( 42, 'Test Title', false );

		$this->assertFalse( $instance->has_description() );
	}
}

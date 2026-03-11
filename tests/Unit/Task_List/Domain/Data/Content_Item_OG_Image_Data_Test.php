<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Domain\Data;

use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_OG_Image_Data;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Content_Item_OG_Image_Data value object.
 *
 * @group task-list
 *
 * @covers \Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_OG_Image_Data
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Content_Item_OG_Image_Data_Test extends TestCase {

	/**
	 * Tests the getters return the correct values.
	 *
	 * @return void
	 */
	public function test_getters() {
		$instance = new Content_Item_OG_Image_Data(
			123,
			'Test Post',
			'https://example.com/image.jpg',
			'post',
		);

		$this->assertSame( 123, $instance->get_content_id() );
		$this->assertSame( 'Test Post', $instance->get_title() );
		$this->assertSame( 'https://example.com/image.jpg', $instance->get_open_graph_image() );
		$this->assertSame( 'post', $instance->get_content_type() );
	}

	/**
	 * Tests has_og_image returns true when an image is set.
	 *
	 * @return void
	 */
	public function test_has_og_image_returns_true_when_image_is_set() {
		$instance = new Content_Item_OG_Image_Data(
			123,
			'Test Post',
			'https://example.com/image.jpg',
			'post',
		);

		$this->assertTrue( $instance->has_og_image() );
	}

	/**
	 * Tests has_og_image returns false when image is null.
	 *
	 * @return void
	 */
	public function test_has_og_image_returns_false_when_image_is_null() {
		$instance = new Content_Item_OG_Image_Data(
			123,
			'Test Post',
			null,
			'post',
		);

		$this->assertFalse( $instance->has_og_image() );
	}

	/**
	 * Tests has_og_image returns false when image is empty string.
	 *
	 * @return void
	 */
	public function test_has_og_image_returns_false_when_image_is_empty_string() {
		$instance = new Content_Item_OG_Image_Data(
			123,
			'Test Post',
			'',
			'post',
		);

		$this->assertFalse( $instance->has_og_image() );
	}
}

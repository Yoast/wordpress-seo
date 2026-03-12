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
			'set-by-user',
			'post',
		);

		$this->assertSame( 123, $instance->get_content_id() );
		$this->assertSame( 'Test Post', $instance->get_title() );
		$this->assertSame( 'set-by-user', $instance->get_open_graph_image_source() );
		$this->assertSame( 'post', $instance->get_content_type() );
	}

	/**
	 * Tests has_og_image returns true when source is set-by-user.
	 *
	 * @return void
	 */
	public function test_has_og_image_returns_true_when_set_by_user() {
		$instance = new Content_Item_OG_Image_Data( 123, 'Test Post', 'set-by-user', 'post' );

		$this->assertTrue( $instance->has_og_image() );
	}

	/**
	 * Tests has_og_image returns true when source is featured-image.
	 *
	 * @return void
	 */
	public function test_has_og_image_returns_true_when_featured_image() {
		$instance = new Content_Item_OG_Image_Data( 123, 'Test Post', 'featured-image', 'post' );

		$this->assertTrue( $instance->has_og_image() );
	}

	/**
	 * Tests has_og_image returns false when source is null.
	 *
	 * @return void
	 */
	public function test_has_og_image_returns_false_when_source_is_null() {
		$instance = new Content_Item_OG_Image_Data( 123, 'Test Post', null, 'post' );

		$this->assertFalse( $instance->has_og_image() );
	}

	/**
	 * Tests has_og_image returns false when source is first-content-image.
	 *
	 * @return void
	 */
	public function test_has_og_image_returns_false_when_first_content_image() {
		$instance = new Content_Item_OG_Image_Data( 123, 'Test Post', 'first-content-image', 'post' );

		$this->assertFalse( $instance->has_og_image() );
	}

	/**
	 * Tests has_og_image returns false when source is gallery-image.
	 *
	 * @return void
	 */
	public function test_has_og_image_returns_false_when_gallery_image() {
		$instance = new Content_Item_OG_Image_Data( 123, 'Test Post', 'gallery-image', 'post' );

		$this->assertFalse( $instance->has_og_image() );
	}
}

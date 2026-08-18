<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Post_Images_Trait;

use Brain\Monkey\Filters;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Images_Trait;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests get_post_images.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Images_Trait::get_post_images
 */
final class Get_Post_Images_Test extends TestCase {

	use Post_Images_Trait;

	/**
	 * Tests that the post and its content type are offered to the filter and that its images are returned.
	 *
	 * @return void
	 */
	public function test_returns_the_filtered_images() {
		$images = [
			'thumbnail' => 'https://example.com/product.jpg',
			'count'     => 3,
		];

		Filters\expectApplied( 'wpseo_bulk_editor_post_images' )
			->once()
			->with( [], 7, 'product' )
			->andReturn( $images );

		$this->assertSame( $images, $this->get_post_images( 7, 'product' ) );
	}

	/**
	 * Tests that no images are returned when the filter returns a non-array.
	 *
	 * @return void
	 */
	public function test_falls_back_to_no_images_when_the_filter_returns_a_non_array() {
		Filters\expectApplied( 'wpseo_bulk_editor_post_images' )
			->once()
			->andReturn( 'not-an-array' );

		$this->assertSame( [], $this->get_post_images( 7, 'product' ) );
	}

	/**
	 * Tests that no images are returned when no add-on hooks into the filter.
	 *
	 * @return void
	 */
	public function test_returns_no_images_by_default() {
		$this->assertSame( [], $this->get_post_images( 7, 'post' ) );
	}
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Indexables;

use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_OG_Image_Data;

/**
 * Tests the get_recent_content_with_og_image method.
 *
 * @group task-list
 *
 * @covers \Yoast\WP\SEO\Task_List\Infrastructure\Indexables\Recent_Content_Indexable_Collector::get_recent_content_with_og_image
 * @covers \Yoast\WP\SEO\Task_List\Infrastructure\Indexables\Recent_Content_Indexable_Collector::map_to_og_image_data
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Recent_Content_Indexable_Collector_Get_Recent_Content_With_OG_Image_Test extends Abstract_Recent_Content_Indexable_Collector_Test {

	/**
	 * Creates a raw OG image result array as returned by the indexable repository.
	 *
	 * @param int         $object_id               The object ID.
	 * @param string      $title                   The breadcrumb title.
	 * @param string|null $open_graph_image_source The OpenGraph image source.
	 *
	 * @return array<string, int|string|null> The raw result.
	 */
	private function create_raw_og_image_result( int $object_id, string $title, ?string $open_graph_image_source ): array {
		return [
			'object_id'                => $object_id,
			'breadcrumb_title'         => $title,
			'open_graph_image_source'  => $open_graph_image_source,
		];
	}

	/**
	 * Tests getting recent content with OG image data.
	 *
	 * @return void
	 */
	public function test_get_recent_content_with_og_image() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';
		$limit      = 10;

		$raw_results = [
			$this->create_raw_og_image_result( 1, 'First Post', 'set-by-user' ),
			$this->create_raw_og_image_result( 2, 'Second Post', null ),
		];

		$this->indexable_repository
			->expects( 'get_recent_posts_with_og_image_for_post_type' )
			->once()
			->with( $post_type, $limit, $date_limit )
			->andReturn( $raw_results );

		$results = $this->instance->get_recent_content_with_og_image( $post_type, $date_limit, $limit );

		$this->assertCount( 2, $results );
		$this->assertContainsOnlyInstancesOf( Content_Item_OG_Image_Data::class, $results );
	}

	/**
	 * Tests that the returned Content_Item_OG_Image_Data objects have correct data.
	 *
	 * @return void
	 */
	public function test_content_items_have_correct_data() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';

		$raw_results = [
			$this->create_raw_og_image_result( 123, 'Test Title', 'set-by-user' ),
		];

		$this->indexable_repository
			->expects( 'get_recent_posts_with_og_image_for_post_type' )
			->once()
			->with( $post_type, null, $date_limit )
			->andReturn( $raw_results );

		$results = $this->instance->get_recent_content_with_og_image( $post_type, $date_limit );

		$this->assertCount( 1, $results );

		$content_item = $results[0];
		$this->assertSame( 123, $content_item->get_content_id() );
		$this->assertSame( 'Test Title', $content_item->get_title() );
		$this->assertSame( 'set-by-user', $content_item->get_open_graph_image_source() );
		$this->assertSame( 'post', $content_item->get_content_type() );
		$this->assertTrue( $content_item->has_og_image() );
	}

	/**
	 * Tests content item without OG image has correct has_og_image result.
	 *
	 * @return void
	 */
	public function test_content_item_without_og_image() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';

		$raw_results = [
			$this->create_raw_og_image_result( 456, 'No Image Post', null ),
		];

		$this->indexable_repository
			->expects( 'get_recent_posts_with_og_image_for_post_type' )
			->once()
			->with( $post_type, null, $date_limit )
			->andReturn( $raw_results );

		$results = $this->instance->get_recent_content_with_og_image( $post_type, $date_limit );

		$this->assertCount( 1, $results );
		$this->assertNull( $results[0]->get_open_graph_image_source() );
		$this->assertFalse( $results[0]->has_og_image() );
	}

	/**
	 * Tests getting recent content returns empty array when no results.
	 *
	 * @return void
	 */
	public function test_get_recent_content_returns_empty_array_when_no_results() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';

		$this->indexable_repository
			->expects( 'get_recent_posts_with_og_image_for_post_type' )
			->once()
			->with( $post_type, null, $date_limit )
			->andReturn( [] );

		$results = $this->instance->get_recent_content_with_og_image( $post_type, $date_limit );

		$this->assertSame( [], $results );
	}

	/**
	 * Tests that the limit is passed to the repository.
	 *
	 * @return void
	 */
	public function test_get_recent_content_passes_limit_to_repository() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';
		$limit      = 5;

		$this->indexable_repository
			->expects( 'get_recent_posts_with_og_image_for_post_type' )
			->once()
			->with( $post_type, $limit, $date_limit )
			->andReturn( [] );

		$this->instance->get_recent_content_with_og_image( $post_type, $date_limit, $limit );
	}

	/**
	 * Tests that results maintain order.
	 *
	 * @return void
	 */
	public function test_results_maintain_order() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';

		$raw_results = [
			$this->create_raw_og_image_result( 1, 'First', 'set-by-user' ),
			$this->create_raw_og_image_result( 2, 'Second', null ),
			$this->create_raw_og_image_result( 3, 'Third', 'featured-image' ),
		];

		$this->indexable_repository
			->expects( 'get_recent_posts_with_og_image_for_post_type' )
			->once()
			->andReturn( $raw_results );

		$results = $this->instance->get_recent_content_with_og_image( $post_type, $date_limit );

		$this->assertSame( 1, $results[0]->get_content_id() );
		$this->assertSame( 2, $results[1]->get_content_id() );
		$this->assertSame( 3, $results[2]->get_content_id() );
	}
}

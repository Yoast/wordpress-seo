<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Indexables;

use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_SEO_Data;

/**
 * Tests the get_recent_content_with_seo_scores method.
 *
 * @group task-list
 *
 * @covers \Yoast\WP\SEO\Task_List\Infrastructure\Indexables\Recent_Content_Indexable_Collector::get_recent_content_with_seo_scores
 * @covers \Yoast\WP\SEO\Task_List\Infrastructure\Indexables\Recent_Content_Indexable_Collector::map_to_content_item_seo_data
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Recent_Content_Indexable_Collector_Get_Recent_Content_Test extends Abstract_Recent_Content_Indexable_Collector_Test {

	/**
	 * Tests getting recent content with SEO scores.
	 *
	 * @return void
	 */
	public function test_get_recent_content_with_seo_scores() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';
		$limit      = 10;

		$raw_results = [
			$this->create_raw_result( 1, 'First Post', 50 ),
			$this->create_raw_result( 2, 'Second Post', 75 ),
		];

		$this->indexable_repository
			->expects( 'get_recent_posts_with_keywords_for_post_type' )
			->once()
			->with( $post_type, $limit, $date_limit )
			->andReturn( $raw_results );

		$this->expect_score_group( 50, 'ok' );
		$this->expect_score_group( 75, 'good' );

		$results = $this->instance->get_recent_content_with_seo_scores( $post_type, $date_limit, $limit );

		$this->assertCount( 2, $results );
		$this->assertContainsOnlyInstancesOf( Content_Item_SEO_Data::class, $results );
	}

	/**
	 * Tests that the returned Content_Item_SEO_Data objects have correct data.
	 *
	 * @return void
	 */
	public function test_content_items_have_correct_data() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';

		$raw_results = [
			$this->create_raw_result( 123, 'Test Title', 65 ),
		];

		$this->indexable_repository
			->expects( 'get_recent_posts_with_keywords_for_post_type' )
			->once()
			->with( $post_type, null, $date_limit )
			->andReturn( $raw_results );

		$this->expect_score_group( 65, 'ok' );

		$results = $this->instance->get_recent_content_with_seo_scores( $post_type, $date_limit );

		$this->assertCount( 1, $results );

		$content_item = $results[0];
		$this->assertSame( 123, $content_item->get_content_id() );
		$this->assertSame( 'Test Title', $content_item->get_title() );
		$this->assertSame( 'ok', $content_item->get_seo_score() );
		$this->assertSame( 'post', $content_item->get_content_type() );
	}

	/**
	 * Tests getting recent content with a different post type.
	 *
	 * @return void
	 */
	public function test_get_recent_content_for_page_post_type() {
		$post_type  = 'page';
		$date_limit = '2024-06-01';

		$raw_results = [
			$this->create_raw_result( 456, 'About Us Page', 85 ),
		];

		$this->indexable_repository
			->expects( 'get_recent_posts_with_keywords_for_post_type' )
			->once()
			->with( $post_type, null, $date_limit )
			->andReturn( $raw_results );

		$this->expect_score_group( 85, 'good' );

		$results = $this->instance->get_recent_content_with_seo_scores( $post_type, $date_limit );

		$this->assertCount( 1, $results );
		$this->assertSame( 'page', $results[0]->get_content_type() );
	}

	/**
	 * Tests getting recent content when no results are found.
	 *
	 * @return void
	 */
	public function test_get_recent_content_returns_empty_array_when_no_results() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';

		$this->indexable_repository
			->expects( 'get_recent_posts_with_keywords_for_post_type' )
			->once()
			->with( $post_type, null, $date_limit )
			->andReturn( [] );

		$results = $this->instance->get_recent_content_with_seo_scores( $post_type, $date_limit );

		$this->assertSame( [], $results );
	}

	/**
	 * Tests getting recent content with a limit.
	 *
	 * @return void
	 */
	public function test_get_recent_content_passes_limit_to_repository() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';
		$limit      = 5;

		$this->indexable_repository
			->expects( 'get_recent_posts_with_keywords_for_post_type' )
			->once()
			->with( $post_type, $limit, $date_limit )
			->andReturn( [] );

		$this->instance->get_recent_content_with_seo_scores( $post_type, $date_limit, $limit );
	}

	/**
	 * Tests getting recent content with null limit.
	 *
	 * @return void
	 */
	public function test_get_recent_content_with_null_limit() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';

		$this->indexable_repository
			->expects( 'get_recent_posts_with_keywords_for_post_type' )
			->once()
			->with( $post_type, null, $date_limit )
			->andReturn( [] );

		$this->instance->get_recent_content_with_seo_scores( $post_type, $date_limit, null );
	}

	/**
	 * Tests that multiple results maintain order.
	 *
	 * @return void
	 */
	public function test_results_maintain_order() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';

		$raw_results = [
			$this->create_raw_result( 1, 'First', 10 ),
			$this->create_raw_result( 2, 'Second', 20 ),
			$this->create_raw_result( 3, 'Third', 30 ),
		];

		$this->indexable_repository
			->expects( 'get_recent_posts_with_keywords_for_post_type' )
			->once()
			->andReturn( $raw_results );

		$this->expect_score_group( 10, 'bad' );
		$this->expect_score_group( 20, 'bad' );
		$this->expect_score_group( 30, 'bad' );

		$results = $this->instance->get_recent_content_with_seo_scores( $post_type, $date_limit );

		$this->assertSame( 1, $results[0]->get_content_id() );
		$this->assertSame( 2, $results[1]->get_content_id() );
		$this->assertSame( 3, $results[2]->get_content_id() );
	}
}

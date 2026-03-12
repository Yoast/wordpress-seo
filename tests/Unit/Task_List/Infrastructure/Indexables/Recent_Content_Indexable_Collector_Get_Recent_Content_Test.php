<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Indexables;

use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_Score_Data;
use Yoast\WP\SEO\Task_List\Domain\Data\Meta_Description_Content_Item_Data;

/**
 * Tests the get_recent_content_with_seo_scores and get_recent_content_without_description methods.
 *
 * @group task-list
 *
 * @covers \Yoast\WP\SEO\Task_List\Infrastructure\Indexables\Recent_Content_Indexable_Collector::get_recent_content_with_seo_scores
 * @covers \Yoast\WP\SEO\Task_List\Infrastructure\Indexables\Recent_Content_Indexable_Collector::get_recent_content_without_description
 * @covers \Yoast\WP\SEO\Task_List\Infrastructure\Indexables\Recent_Content_Indexable_Collector::map_to_seo_score_data
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
		$this->assertContainsOnlyInstancesOf( Content_Item_Score_Data::class, $results );
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
		$this->assertSame( 'ok', $content_item->get_score() );
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

	/**
	 * Tests getting recent content without description returns correct instances.
	 *
	 * @return void
	 */
	public function test_get_recent_content_without_description() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';
		$limit      = 10;

		$raw_results = [
			[
				'object_id'        => 1,
				'breadcrumb_title' => 'First Post',
			],
			[
				'object_id'        => 2,
				'breadcrumb_title' => 'Second Post',
			],
		];

		$this->indexable_repository
			->expects( 'get_recent_posts_without_description_for_post_type' )
			->once()
			->with( $post_type, $limit, $date_limit )
			->andReturn( $raw_results );

		$results = $this->instance->get_recent_content_without_description( $post_type, $date_limit, $limit );

		$this->assertCount( 2, $results );
		$this->assertContainsOnlyInstancesOf( Meta_Description_Content_Item_Data::class, $results );
	}

	/**
	 * Tests that the returned Meta_Description_Content_Item_Data objects have correct data.
	 *
	 * @return void
	 */
	public function test_without_description_content_items_have_correct_data() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';

		$raw_results = [
			[
				'object_id'        => 123,
				'breadcrumb_title' => 'Test Title',
			],
		];

		$this->indexable_repository
			->expects( 'get_recent_posts_without_description_for_post_type' )
			->once()
			->with( $post_type, null, $date_limit )
			->andReturn( $raw_results );

		$results = $this->instance->get_recent_content_without_description( $post_type, $date_limit );

		$this->assertCount( 1, $results );

		$content_item = $results[0];
		$this->assertSame( 123, $content_item->get_content_id() );
		$this->assertSame( 'Test Title', $content_item->get_title() );
	}

	/**
	 * Tests that object_id is cast to int.
	 *
	 * @return void
	 */
	public function test_without_description_object_id_is_cast_to_int() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';

		$raw_results = [
			[
				'object_id'        => '456',
				'breadcrumb_title' => 'String ID Post',
			],
		];

		$this->indexable_repository
			->expects( 'get_recent_posts_without_description_for_post_type' )
			->once()
			->with( $post_type, null, $date_limit )
			->andReturn( $raw_results );

		$results = $this->instance->get_recent_content_without_description( $post_type, $date_limit );

		$this->assertSame( 456, $results[0]->get_content_id() );
	}

	/**
	 * Tests getting recent content without description when no results are found.
	 *
	 * @return void
	 */
	public function test_without_description_returns_empty_array_when_no_results() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';

		$this->indexable_repository
			->expects( 'get_recent_posts_without_description_for_post_type' )
			->once()
			->with( $post_type, null, $date_limit )
			->andReturn( [] );

		$results = $this->instance->get_recent_content_without_description( $post_type, $date_limit );

		$this->assertSame( [], $results );
	}

	/**
	 * Tests that a non-array result from the repository returns an empty array.
	 *
	 * @return void
	 */
	public function test_without_description_returns_empty_array_when_repository_returns_non_array() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';

		$this->indexable_repository
			->expects( 'get_recent_posts_without_description_for_post_type' )
			->once()
			->with( $post_type, null, $date_limit )
			->andReturn( false );

		$results = $this->instance->get_recent_content_without_description( $post_type, $date_limit );

		$this->assertSame( [], $results );
	}

	/**
	 * Tests that a null result from the repository returns an empty array.
	 *
	 * @return void
	 */
	public function test_without_description_returns_empty_array_when_repository_returns_null() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';

		$this->indexable_repository
			->expects( 'get_recent_posts_without_description_for_post_type' )
			->once()
			->with( $post_type, null, $date_limit )
			->andReturn( null );

		$results = $this->instance->get_recent_content_without_description( $post_type, $date_limit );

		$this->assertSame( [], $results );
	}

	/**
	 * Tests getting recent content without description with a limit.
	 *
	 * @return void
	 */
	public function test_without_description_passes_limit_to_repository() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';
		$limit      = 5;

		$this->indexable_repository
			->expects( 'get_recent_posts_without_description_for_post_type' )
			->once()
			->with( $post_type, $limit, $date_limit )
			->andReturn( [] );

		$this->instance->get_recent_content_without_description( $post_type, $date_limit, $limit );
	}

	/**
	 * Tests getting recent content without description with null limit.
	 *
	 * @return void
	 */
	public function test_without_description_with_null_limit() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';

		$this->indexable_repository
			->expects( 'get_recent_posts_without_description_for_post_type' )
			->once()
			->with( $post_type, null, $date_limit )
			->andReturn( [] );

		$this->instance->get_recent_content_without_description( $post_type, $date_limit, null );
	}

	/**
	 * Tests that multiple results without description maintain order.
	 *
	 * @return void
	 */
	public function test_without_description_results_maintain_order() {
		$post_type  = 'post';
		$date_limit = '2024-01-01';

		$raw_results = [
			[
				'object_id'        => 1,
				'breadcrumb_title' => 'First',
			],
			[
				'object_id'        => 2,
				'breadcrumb_title' => 'Second',
			],
			[
				'object_id'        => 3,
				'breadcrumb_title' => 'Third',
			],
		];

		$this->indexable_repository
			->expects( 'get_recent_posts_without_description_for_post_type' )
			->once()
			->andReturn( $raw_results );

		$results = $this->instance->get_recent_content_without_description( $post_type, $date_limit );

		$this->assertSame( 1, $results[0]->get_content_id() );
		$this->assertSame( 'First', $results[0]->get_title() );
		$this->assertSame( 2, $results[1]->get_content_id() );
		$this->assertSame( 'Second', $results[1]->get_title() );
		$this->assertSame( 3, $results[2]->get_content_id() );
		$this->assertSame( 'Third', $results[2]->get_title() );
	}

	/**
	 * Tests getting recent content without description for a different post type.
	 *
	 * @return void
	 */
	public function test_without_description_for_page_post_type() {
		$post_type  = 'page';
		$date_limit = '2024-06-01';

		$raw_results = [
			[
				'object_id'        => 456,
				'breadcrumb_title' => 'About Us Page',
			],
		];

		$this->indexable_repository
			->expects( 'get_recent_posts_without_description_for_post_type' )
			->once()
			->with( $post_type, null, $date_limit )
			->andReturn( $raw_results );

		$results = $this->instance->get_recent_content_without_description( $post_type, $date_limit );

		$this->assertCount( 1, $results );
		$this->assertSame( 456, $results[0]->get_content_id() );
		$this->assertSame( 'About Us Page', $results[0]->get_title() );
	}
}

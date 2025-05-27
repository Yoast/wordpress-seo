<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Infrastructure\Content_Types_Collector;

use Brain\Monkey;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List;

/**
 * Tests get_content_types_lists.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Content_Types_Collector::get_content_types_lists
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Content_Types_Collector::get_relevant_posts
 */
final class Get_Content_Types_Lists_Test extends Abstract_Content_Types_Collector_Test {

	/**
	 * Tests the get_content_types_lists method.
	 *
	 * @param array<object>                               $indexable_post_type_objects The indexable post type objects.
	 * @param int                                         $is_indexable_times          The number of times is_indexable should be called.
	 * @param array<bool>                                 $is_indexable                The return values for is_indexable.
	 * @param array<array<string, array<string, string>>> $get_posts_args              The arguments for get_posts.
	 * @param int                                         $get_posts_times             The number of times get_posts should be called.
	 * @param array<object>                               $posts                       The posts returned by get_posts.
	 * @param int                                         $get_permalink_times         The number of times get_permalink should be called.
	 * @param int                                         $number_of_lists             The expected number of lists returned.
	 *
	 * @dataProvider data_get_content_types_lists
	 *
	 * @return void
	 */
	public function test_get_content_types_lists(
		array $indexable_post_type_objects,
		int $is_indexable_times,
		array $is_indexable,
		array $get_posts_args,
		int $get_posts_times,
		array $posts,
		int $get_permalink_times,
		int $number_of_lists
	) {
		$this->post_type_helper
			->expects( 'get_indexable_post_type_objects' )
			->once()
			->andReturn( $indexable_post_type_objects );

		$this->post_type_helper
			->expects( 'is_indexable' )
			->times( $is_indexable_times )
			->andReturn( ...$is_indexable );

		Monkey\Functions\expect( 'get_posts' )
			->with( $get_posts_args )
			->times( $get_posts_times )
			->andReturn( $posts );

		Monkey\Functions\expect( 'get_permalink' )
			->with( ...$posts )
			->times( $get_permalink_times )
			->andReturn( 'https://example.com/permalink' );

		$lists = $this->instance->get_content_types_lists();
		$this->assertSame( $number_of_lists, \count( $lists ) );

		foreach ( $lists as $list ) {
			$this->assertInstanceOf( Link_List::class, $list );
		}
	}

	/**
	 * Data provider for test_get_content_types_lists.
	 *
	 * @return Generator
	 */
	public static function data_get_content_types_lists() {
		yield '1 indexable post type with 1 post' => [
			'indexable_post_type_objects' => [
				(object) [
					'name'  => 'post',
					'label' => 'Posts',
				],
			],
			'is_indexable_times'          => 1,
			'is_indexable'                => [ true ],
			'get_posts_args'              => [
				[
					'post_type'      => 'post',
					'posts_per_page' => 5,
					'post_status'    => 'publish',
					'orderby'        => 'modified',
					'order'          => 'DESC',
					'has_password'   => false,
					'date_query'     => [
						[
							'after' => '12 months ago',
						],
					],
				],
			],
			'get_posts_times'             => 1,
			'posts'                       => [
				(object) [
					'ID'         => 1,
					'post_title' => 'Post 1',
				],
			],
			'get_permalink_times'         => 1,
			'number_of_lists'             => 1,
		];
		yield '2 post types with 3 posts each and one non-indexable post type' => [
			'indexable_post_type_objects' => [
				(object) [
					'name'  => 'post',
					'label' => 'Posts',
				],
				(object) [
					'name'  => 'page',
					'label' => 'Pages',
				],
				(object) [
					'name'  => 'page',
					'label' => 'Custom Post Type',
				],
			],
			'is_indexable_times'          => 3,
			'is_indexable'                => [ true, true, false ],
			'get_posts_args'              => [
				[
					'post_type'      => 'post',
					'posts_per_page' => 5,
					'post_status'    => 'publish',
					'orderby'        => 'modified',
					'order'          => 'DESC',
					'has_password'   => false,
					'date_query'     => [
						[
							'after' => '12 months ago',
						],
					],
				],
				[
					'post_type'      => 'page',
					'posts_per_page' => 5,
					'post_status'    => 'publish',
					'orderby'        => 'modified',
					'order'          => 'DESC',
					'has_password'   => false,
				],
			],
			'get_posts_times'             => 2,
			'posts'                       => [
				(object) [
					'ID'         => 1,
					'post_title' => 'Post 1',
				],
				(object) [
					'ID'         => 2,
					'post_title' => 'Post 2',
				],
				(object) [
					'ID'         => 3,
					'post_title' => 'Page 3',
				],
			],
			'get_permalink_times'         => 6,
			'number_of_lists'             => 2,
		];
		yield '1 non-indexable post type' => [
			'indexable_post_type_objects' => [
				(object) [
					'name'  => 'post',
					'label' => 'Posts',
				],
			],
			'is_indexable_times'          => 1,
			'is_indexable'                => [ false ],
			'get_posts_args'              => [
				[
					'post_type' => 'irrelevant',
				],
			],
			'get_posts_times'             => 0,
			'posts'                       => [
				(object) [],
			],
			'get_permalink_times'         => 0,
			'number_of_lists'             => 0,
		];
		yield 'no post types' => [
			'indexable_post_type_objects' => [],
			'is_indexable_times'          => 0,
			'is_indexable'                => [ 'irrelevant' ],
			'get_posts_args'              => [
				[
					'post_type' => 'irrelevant',
				],
			],
			'get_posts_times'             => 0,
			'posts'                       => [
				(object) [],
			],
			'get_permalink_times'         => 0,
			'number_of_lists'             => 0,
		];
	}
}

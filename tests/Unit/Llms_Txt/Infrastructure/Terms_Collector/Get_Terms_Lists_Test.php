<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Infrastructure\Terms_Collector;

use Brain\Monkey;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List;

/**
 * Tests get_terms_lists.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Terms_Collector::get_terms_lists
 */
final class Get_Terms_Lists_Test extends Abstract_Test {

	/**
	 * Options covered by the shared test mock.
	 *
	 * @var string[]
	 */
	protected $mocked_options = [ 'wpseo', 'wpseo_titles', 'wpseo_social', 'wpseo_ms', 'wpseo_llmstxt', 'wpseo_tracking_only' ];

	/**
	 * Tests the get_terms_lists method.
	 *
	 * @param array<object>                               $indexable_taxonomy_objects The indexable taxonomy objects.
	 * @param int                                         $is_indexable_times         The number of times is_indexable should be called.
	 * @param array<bool>                                 $is_indexable               The return values for is_indexable.
	 * @param array<array<string, array<string, string>>> $get_categories_args        The arguments for get_categories.
	 * @param int                                         $get_categories_times       The number of times get_categories should be called.
	 * @param array<object>                               $categories                 The categories returned by get_categories.
	 * @param int                                         $get_term_link_times        The number of times get_term_link should be called.
	 * @param int                                         $number_of_lists            The expected number of lists returned.
	 *
	 * @dataProvider data_get_terms_lists
	 *
	 * @return void
	 */
	public function test_get_terms_lists(
		array $indexable_taxonomy_objects,
		int $is_indexable_times,
		array $is_indexable,
		array $get_categories_args,
		int $get_categories_times,
		array $categories,
		int $get_term_link_times,
		int $number_of_lists
	) {
		$this->taxonomy_helper
			->expects( 'get_indexable_taxonomy_objects' )
			->once()
			->andReturn( $indexable_taxonomy_objects );

		$this->taxonomy_helper
			->expects( 'is_indexable' )
			->times( $is_indexable_times )
			->andReturn( ...$is_indexable );

		Monkey\Functions\expect( 'get_option' )->with( 'wpseo_taxonomy_meta' )->zeroOrMoreTimes()->andReturn( [] );

		Monkey\Functions\expect( 'get_categories' )
			->with( $get_categories_args )
			->times( $get_categories_times )
			->andReturn( $categories );

		Monkey\Functions\expect( 'get_term_link' )
			->with( ...$categories )
			->times( $get_term_link_times )
			->andReturn( 'https://example.com/permalink' );

		$lists = $this->instance->get_terms_lists();
		$this->assertSame( $number_of_lists, \count( $lists ) );

		foreach ( $lists as $list ) {
			$this->assertInstanceOf( Link_List::class, $list );
		}
	}

	/**
	 * Tests that individually noindexed terms are excluded.
	 *
	 * @return void
	 */
	public function test_excludes_individually_noindexed_terms() {
		$this->taxonomy_helper->expects( 'get_indexable_taxonomy_objects' )->once()->andReturn(
			[
				(object) [
					'name'  => 'category',
					'label' => 'Categories',
				],
			],
		);
		$this->taxonomy_helper->expects( 'is_indexable' )->once()->with( 'category' )->andReturn( true );

		Monkey\Functions\expect( 'get_option' )->with( 'wpseo_taxonomy_meta' )->zeroOrMoreTimes()->andReturn(
			[
				'category' => [
					1 => [ 'wpseo_noindex' => 'noindex' ],
					2 => [ 'wpseo_noindex' => 'index' ],
				],
			],
		);
		$public_category = (object) [
			'term_id' => 2,
			'name'    => 'Public Category',
		];
		Monkey\Functions\expect( 'get_categories' )->once()->with(
			[
				'taxonomy' => 'category',
				'number'   => 5,
				'orderby'  => 'count',
				'order'    => 'DESC',
				'exclude'  => [ 1 ],
			],
		)->andReturn( [ $public_category ] );
		Monkey\Functions\expect( 'get_term_link' )->once()->with( $public_category, 'category' )->andReturn( 'https://example.com/2' );

		$lists = $this->instance->get_terms_lists();
		$this->assertSame( 'Categories' . \PHP_EOL . '- [Public Category](https://example.com/2)', $lists[0]->render() );
	}

	/**
	 * Data provider for test_get_terms_lists.
	 *
	 * @return Generator
	 */
	public static function data_get_terms_lists() {
		yield '1 indexable taxonomy with 1 term' => [
			'indexable_taxonomy_objects'  => [
				(object) [
					'name'  => 'category',
					'label' => 'Categories',
				],
			],
			'is_indexable_times'          => 1,
			'is_indexable'                => [ true ],
			'get_categories_args'         => [
				[
					'taxonomy' => 'category',
					'number'   => 5,
					'orderby'  => 'count',
					'order'    => 'DESC',
					'exclude'  => [],
				],
			],
			'get_categories_times'        => 1,
			'categories'                  => [
				(object) [
					'ID'   => 1,
					'name' => 'Term 1',
				],
			],
			'get_term_link_times'         => 1,
			'number_of_lists'             => 1,
		];
		yield '2 indexable taxonomies with 3 term each and one non-indexable one' => [
			'indexable_taxonomy_objects'  => [
				(object) [
					'name'  => 'category',
					'label' => 'Categories',
				],
				(object) [
					'name'  => 'tags',
					'label' => 'Tags',
				],
				(object) [
					'name'  => 'private_tags',
					'label' => 'Private Tags',
				],
			],
			'is_indexable_times'          => 3,
			'is_indexable'                => [ true, true, false ],
			'get_categories_args'         => [
				[
					'taxonomy' => 'category',
					'number'   => 5,
					'orderby'  => 'count',
					'order'    => 'DESC',
					'exclude'  => [],
				],
				[
					'taxonomy' => 'tags',
					'number'   => 5,
					'orderby'  => 'count',
					'order'    => 'DESC',
					'exclude'  => [],
				],
			],
			'get_categories_times'        => 2,
			'categories'                  => [
				(object) [
					'ID'   => 1,
					'name' => 'Term 1',
				],
				(object) [
					'ID'   => 2,
					'name' => 'Term 2',
				],
				(object) [
					'ID'   => 3,
					'name' => 'Term 3',
				],
			],
			'get_term_link_times'         => 6,
			'number_of_lists'             => 2,
		];
		yield '1 non-indexable taxonomy' => [
			'indexable_taxonomy_objects'  => [
				(object) [
					'name'  => 'category',
					'label' => 'Categories',
				],
			],
			'is_indexable_times'          => 1,
			'is_indexable'                => [ false ],
			'get_categories_args'         => [
				[
					'post_type' => 'irrelevant',
				],
			],
			'get_categories_times'        => 0,
			'categories'                  => [
				(object) [],
			],
			'get_term_link_times'         => 0,
			'number_of_lists'             => 0,
		];
		yield 'No taxonomies' => [
			'indexable_taxonomy_objects'  => [],
			'is_indexable_times'          => 0,
			'is_indexable'                => [ 'irrelevant' ],
			'get_categories_args'         => [
				[
					'post_type' => 'irrelevant',
				],
			],
			'get_categories_times'        => 0,
			'categories'                  => [
				(object) [],
			],
			'get_term_link_times'         => 0,
			'number_of_lists'             => 0,
		];
	}
}

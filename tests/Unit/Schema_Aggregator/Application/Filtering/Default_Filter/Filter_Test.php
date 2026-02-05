<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Filtering\Default_Filter;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection;

/**
 * Tests the Default_Filter class.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Default_Filter::filter
 *
 * @group schema-aggregator
 */
final class Filter_Test extends Abstract_Default_Filter_Test {

	/**
	 * Tests the filter method of Default_Filter.
	 *
	 * @dataProvider filter_data
	 *
	 * @param array<string, array<string>>          $elements_context_map       The elements context map.
	 * @param array<array<string, string|int|bool>> $schema_pieces_data         The schema pieces data.
	 * @param array<string|array<string>>           $schema_pieces_types        The types for each schema piece.
	 * @param array<array<string, string|int|bool>> $expected_data              The expected filtered data.
	 * @param int                                   $expected_wp_function_calls The expected number of WordPress function calls.
	 *
	 * @return void
	 */
	public function test_schema_pieces_filter( array $elements_context_map, array $schema_pieces_data, array $schema_pieces_types, array $expected_data, int $expected_wp_function_calls ): void {
		$this->elements_context_map_repository
			->shouldReceive( 'get_map' )
			->andReturn( $elements_context_map );

		$schema_pieces = [];
		foreach ( $schema_pieces_data as $index => $data ) {
			$type            = ( $schema_pieces_types[ $index ] ?? $data['@type'] );
			$schema_pieces[] = new Schema_Piece( $data, $type );
		}
		$schema = new Schema_Piece_Collection( $schema_pieces );

		Functions\expect( 'get_current_blog_id' )
			->times( $expected_wp_function_calls )
			->andReturn( 1 );
		Functions\expect( 'get_home_url' )
			->times( $expected_wp_function_calls )
			->with( 1 )
			->andReturn( 'https://example.com' );
		Functions\expect( 'trailingslashit' )
			->times( $expected_wp_function_calls )
			->andReturnFirstArg();

		$result      = $this->instance->filter( $schema );
		$result_data = \array_map(
			static function ( $piece ) {
				return $piece->get_data();
			},
			$result->to_array()
		);

		$this->assertSame( $expected_data, $result_data );
	}

	/**
	 * Tests that specific property filters are used when available.
	 *
	 * @dataProvider schema_piece_properties_filter_data
	 *
	 * @param array<string, array<string>>         $elements_context_map The elements context map.
	 * @param array<string, string|int|bool|array> $schema_piece_data    The schema piece data.
	 * @param array<string, string|int|bool|array> $expected_data        The expected filtered data.
	 *
	 * @return void
	 */
	public function test_schema_piece_properties_filter( array $elements_context_map, array $schema_piece_data, array $expected_data ): void {
		$this->elements_context_map_repository
			->shouldReceive( 'get_map' )
			->andReturn( $elements_context_map );

		$schema_piece = new Schema_Piece( $schema_piece_data, $schema_piece_data['@type'] );
		$schema       = new Schema_Piece_Collection( [ $schema_piece ] );

		$result      = $this->instance->filter( $schema );
		$result_data = \array_map(
			static function ( $piece ) {
				return $piece->get_data();
			},
			$result->to_array()
		);

		$this->assertCount( 1, $result_data );
		$this->assertSame( $expected_data, $result_data[0] );
	}

	/**
	 * Data provider for test_schema_piece_properties_filter.
	 *
	 * @return array<string, array<array<string, array<string>>, array<string, string|int|bool|array>, array<string, string|int|bool|array>>>
	 */
	public function schema_piece_properties_filter_data(): array {
		return [
			'WebPage with specific property filter (removes breadcrumb and base properties)' => [
				[
					'action'       => [],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[
					'@type'               => 'WebPage',
					'name'                => 'Test Page',
					'breadcrumb'          => [ '@type' => 'BreadcrumbList' ],
					'potentialAction'     => [ '@type' => 'ReadAction' ],
					'isPartOf'            => [ '@id' => 'https://example.com/#website' ],
					'mainEntityOfPage'    => [ '@id' => 'https://example.com/page' ],
					'primaryImageOfPage'  => [ '@id' => 'https://example.com/image.jpg' ],
					'url'                 => 'https://example.com/page',
					'description'         => 'Page description',
				],
				[
					'@type'            => 'WebPage',
					'name'             => 'Test Page',
					'isPartOf'         => [ '@id' => 'https://example.com/#website' ],
					'mainEntityOfPage' => [ '@id' => 'https://example.com/page' ],
					'url'              => 'https://example.com/page',
					'description'      => 'Page description',
				],
			],
			'Article with base property filter only (removes base properties, no specific filter)' => [
				[
					'action'       => [],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[
					'@type'               => 'Article',
					'headline'            => 'Test Article',
					'potentialAction'     => [ '@type' => 'ReadAction' ],
					'isPartOf'            => [ '@id' => 'https://example.com/#website' ],
					'mainEntityOfPage'    => [ '@id' => 'https://example.com/page' ],
					'primaryImageOfPage'  => [ '@id' => 'https://example.com/image.jpg' ],
					'author'              => 'John Doe',
					'datePublished'       => '2023-01-01',
				],
				[
					'@type'            => 'Article',
					'headline'         => 'Test Article',
					'isPartOf'         => [ '@id' => 'https://example.com/#website' ],
					'mainEntityOfPage' => [ '@id' => 'https://example.com/page' ],
					'author'           => 'John Doe',
					'datePublished'    => '2023-01-01',
				],
			],
			'Person with no properties to filter (no specific or base filters needed)' => [
				[
					'action'       => [],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[
					'@type'    => 'Person',
					'name'     => 'Jane Smith',
					'jobTitle' => 'Writer',
					'email'    => 'jane@example.com',
				],
				[
					'@type'    => 'Person',
					'name'     => 'Jane Smith',
					'jobTitle' => 'Writer',
					'email'    => 'jane@example.com',
				],
			],
		];
	}

	/**
	 * Data provider for test_filter.
	 *
	 * @return array<string, array<array<string, array<string>>, array<array<string, string|int|bool>>, array<string|array<string>>, array<array<string, string|int|bool>>, int>>
	 */
	public function filter_data(): array {
		return [
			'Schema pieces with no filterable categories' => [
				[
					'action'       => [],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[
					[
						'@type'    => 'Article',
						'headline' => 'Test Article',
						'author'   => 'John Doe',
					],
					[
						'@type' => 'Person',
						'name'  => 'Jane Smith',
					],
				],
				[
					'Article',
					'Person',
				],
				[
					[
						'@type'    => 'Article',
						'headline' => 'Test Article',
						'author'   => 'John Doe',
					],
					[
						'@type' => 'Person',
						'name'  => 'Jane Smith',
					],
				],
				0,
			],
			'Schema pieces with filterable categories but no existing filters' => [
				[
					'action'       => [ 'ReadAction' ],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[
					[
						'@type'  => 'ReadAction',
						'target' => 'https://example.com',
					],
					[
						'@type'    => 'Article',
						'headline' => 'Test Article',
					],
				],
				[
					'ReadAction',
					'Article',
				],
				[
					[
						'@type'    => 'Article',
						'headline' => 'Test Article',
					],
				],
				0,
			],
			'Schema pieces with properties to be filtered' => [
				[
					'action'       => [],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[
					[
						'@type'           => 'Article',
						'headline'        => 'Test Article',
						'potentialAction' => [ '@type' => 'ReadAction' ],
						'isPartOf'        => [ '@id' => 'https://example.com/#website' ],
						'author'          => 'John Doe',
					],
					[
						'@type'      => 'WebPage',
						'name'       => 'Test Page',
						'breadcrumb' => [ '@type' => 'BreadcrumbList' ],
						'url'        => 'https://example.com/page',
					],
				],
				[
					'Article',
					'WebPage',
				],
				[
					[
						'@type'    => 'Article',
						'headline' => 'Test Article',
						'isPartOf' => [ '@id' => 'https://example.com/#website' ],
						'author'   => 'John Doe',
					],
					[
						'@type' => 'WebPage',
						'name'  => 'Test Page',
						'url'   => 'https://example.com/page',
					],
				],
				0,
			],
			'Mixed schema pieces with both node and property filtering' => [
				[
					'action'       => [ 'ReadAction' ],
					'enumeration'  => [],
					'meta'         => [ 'MetaTags' ],
					'website-meta' => [],
				],
				[
					[
						'@type'  => 'ReadAction',
						'target' => 'https://example.com',
					],
					[
						'@type'           => 'Article',
						'headline'        => 'Test Article',
						'potentialAction' => [ '@type' => 'ReadAction' ],
						'author'          => 'John Doe',
					],
					[
						'@type'   => 'MetaTags',
						'content' => 'Meta content',
					],
					[
						'@type' => 'Person',
						'name'  => 'Jane Smith',
					],
				],
				[
					'ReadAction',
					'Article',
					'MetaTags',
					'Person',
				],
				[
					[
						'@type'    => 'Article',
						'headline' => 'Test Article',
						'author'   => 'John Doe',
					],
					[
						'@type' => 'Person',
						'name'  => 'Jane Smith',
					],
				],
				0,
			],
			'Empty schema collection' => [
				[
					'action'       => [],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[],
				[],
				[],
				0,
			],
			'Schema piece with array type - all types allowed' => [
				[
					'action'       => [],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[
					[
						'@type'    => [ 'Article', 'NewsArticle' ],
						'headline' => 'Test News Article',
						'author'   => 'John Doe',
					],
				],
				[
					[ 'Article', 'NewsArticle' ],
				],
				[
					[
						'@type'    => [ 'Article', 'NewsArticle' ],
						'headline' => 'Test News Article',
						'author'   => 'John Doe',
					],
				],
				0,
			],
			'Schema piece with array type - kept if one type allowed' => [
				[
					'action'       => [ 'ReadAction' ],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[
					[
						'@type'    => [ 'Article', 'ReadAction' ],
						'headline' => 'Test Article',
					],
					[
						'@type' => 'Person',
						'name'  => 'Jane Smith',
					],
				],
				[
					[ 'Article', 'ReadAction' ],
					'Person',
				],
				[
					[
						'@type'    => [ 'Article', 'ReadAction' ],
						'headline' => 'Test Article',
					],
					[
						'@type' => 'Person',
						'name'  => 'Jane Smith',
					],
				],
				0,
			],
			'Schema piece with array type - filtered if all types filtered' => [
				[
					'action'       => [ 'ReadAction', 'WriteAction' ],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[
					[
						'@type'  => [ 'ReadAction', 'WriteAction' ],
						'target' => 'https://example.com',
					],
					[
						'@type' => 'Person',
						'name'  => 'Jane Smith',
					],
				],
				[
					[ 'ReadAction', 'WriteAction' ],
					'Person',
				],
				[
					[
						'@type' => 'Person',
						'name'  => 'Jane Smith',
					],
				],
				0,
			],
			'Schema piece with array type - applies first matching property filter' => [
				[
					'action'       => [],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[
					[
						'@type'      => [ 'WebPage', 'AboutPage' ],
						'name'       => 'About Us',
						'breadcrumb' => [ '@type' => 'BreadcrumbList' ],
						'url'        => 'https://example.com/about',
					],
				],
				[
					[ 'WebPage', 'AboutPage' ],
				],
				[
					[
						'@type' => [ 'WebPage', 'AboutPage' ],
						'name'  => 'About Us',
						'url'   => 'https://example.com/about',
					],
				],
				0,
			],
			'Schema piece with array type - mixed with single type pieces' => [
				[
					'action'       => [ 'ReadAction' ],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[
					[
						'@type'    => [ 'Article', 'BlogPosting' ],
						'headline' => 'Blog Post',
						'author'   => 'Jane Doe',
					],
					[
						'@type'  => 'ReadAction',
						'target' => 'https://example.com',
					],
					[
						'@type' => 'Person',
						'name'  => 'John Smith',
					],
				],
				[
					[ 'Article', 'BlogPosting' ],
					'ReadAction',
					'Person',
				],
				[
					[
						'@type'    => [ 'Article', 'BlogPosting' ],
						'headline' => 'Blog Post',
						'author'   => 'Jane Doe',
					],
					[
						'@type' => 'Person',
						'name'  => 'John Smith',
					],
				],
				0,
			],
			'Schema piece with WebPage and FAQPage array type - kept because FAQPage is allowed' => [
				[
					'action'       => [],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[
					[
						'@type'      => [ 'WebPage', 'FAQPage' ],
						'name'       => 'FAQ',
						'breadcrumb' => [ '@type' => 'BreadcrumbList' ],
						'url'        => 'https://example.com/faq',
					],
				],
				[
					[ 'WebPage', 'FAQPage' ],
				],
				[
					[
						'@type' => [ 'WebPage', 'FAQPage' ],
						'name'  => 'FAQ',
						'url'   => 'https://example.com/faq',
					],
				],
				0,
			],
			'Schema piece with WebPage and ItemPage array type - kept because ItemPage is allowed' => [
				[
					'action'       => [],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[
					[
						'@type'      => [ 'WebPage', 'ItemPage' ],
						'name'       => 'Product Page',
						'breadcrumb' => [ '@type' => 'BreadcrumbList' ],
						'url'        => 'https://example.com/product',
					],
				],
				[
					[ 'WebPage', 'ItemPage' ],
				],
				[
					[
						'@type' => [ 'WebPage', 'ItemPage' ],
						'name'  => 'Product Page',
						'url'   => 'https://example.com/product',
					],
				],
				0,
			],
			'Schema piece with array type - property filter found in second type' => [
				[
					'action'       => [],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[
					[
						'@type'      => [ 'FAQPage', 'WebPage' ],
						'name'       => 'FAQ',
						'breadcrumb' => [ '@type' => 'BreadcrumbList' ],
						'url'        => 'https://example.com/faq',
					],
				],
				[
					[ 'FAQPage', 'WebPage' ],
				],
				[
					[
						'@type' => [ 'FAQPage', 'WebPage' ],
						'name'  => 'FAQ',
						'url'   => 'https://example.com/faq',
					],
				],
				0,
			],
			'Schema piece with single type not in any filter category' => [
				[
					'action'       => [ 'ReadAction' ],
					'enumeration'  => [ 'StatusType' ],
					'meta'         => [ 'MetaTags' ],
					'website-meta' => [],
				],
				[
					[
						'@type' => 'Product',
						'name'  => 'Test Product',
						'price' => 99.99,
					],
				],
				[
					'Product',
				],
				[
					[
						'@type' => 'Product',
						'name'  => 'Test Product',
						'price' => 99.99,
					],
				],
				0,
			],
			'Schema piece with array of 3+ types - kept if at least one allowed' => [
				[
					'action'       => [ 'ReadAction' ],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[
					[
						'@type'      => [ 'WebPage', 'CollectionPage', 'FAQPage' ],
						'name'       => 'FAQ Collection',
						'breadcrumb' => [ '@type' => 'BreadcrumbList' ],
						'url'        => 'https://example.com/faq',
					],
				],
				[
					[ 'WebPage', 'CollectionPage', 'FAQPage' ],
				],
				[
					[
						'@type' => [ 'WebPage', 'CollectionPage', 'FAQPage' ],
						'name'  => 'FAQ Collection',
						'url'   => 'https://example.com/faq',
					],
				],
				0,
			],
			'Schema piece with types in different filter categories - kept if one category allows' => [
				[
					'action'       => [ 'ReadAction' ],
					'enumeration'  => [],
					'meta'         => [],
					'website-meta' => [],
				],
				[
					[
						'@type' => [ 'ReadAction', 'Article' ],
						'name'  => 'Mixed Types',
						'url'   => 'https://example.com',
					],
				],
				[
					[ 'ReadAction', 'Article' ],
				],
				[
					[
						'@type' => [ 'ReadAction', 'Article' ],
						'name'  => 'Mixed Types',
						'url'   => 'https://example.com',
					],
				],
				0,
			],
		];
	}
}

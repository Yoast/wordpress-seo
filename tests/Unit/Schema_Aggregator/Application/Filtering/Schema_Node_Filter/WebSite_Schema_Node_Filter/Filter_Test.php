<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Filtering\Schema_Node_Filter\WebSite_Schema_Node_Filter;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection;

/**
 * Tests the WebSite_Schema_Node_Filter class.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Filter\WebSite_Schema_Node_Filter::filter
 *
 * @group schema-aggregator
 */
final class Filter_Test extends Abstract_WebSite_Schema_Node_Filter_Test {

	/**
	 * Tests the filter method.
	 *
	 * @dataProvider filter_data
	 *
	 * @param array<array<string, string>> $schema_data       The full schema data.
	 * @param array<string, string>        $schema_piece_data The schema piece data to be filtered.
	 * @param bool                         $expected          Expected result.
	 *
	 * @return void
	 */
	public function test_filter( array $schema_data, array $schema_piece_data, bool $expected ): void {
		$schema_piece = new Schema_Piece( $schema_piece_data, $schema_piece_data['@type'] );
		$schema       = new Schema_Piece_Collection();
		foreach ( $schema_data as $data ) {
			$schema->add( new Schema_Piece( $data, $data['@type'] ) );
		}

		Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );
		Functions\expect( 'get_home_url' )
			->once()
			->with( 1 )
			->andReturn( 'https://example.com' );
		Functions\expect( 'trailingslashit' )
			->once()
			->andReturnFirstArg();

		$result = $this->instance->filter( $schema, $schema_piece );

		$this->assertSame( $expected, $result );
	}

	/**
	 * Data provider for test_filter.
	 *
	 * @return array<string, array<array<array<string, string>>, array<string, string>, bool>>
	 */
	public function filter_data(): array {
		return [
			'WebSite with matching current site URL' => [
				[
					[
						'@type' => 'WebSite',
						'@id'   => 'https://example.com/#website',
						'url'   => 'https://example.com',
					],
				],
				[
					'@type' => 'WebSite',
					'@id'   => 'https://example.com/#website',
					'url'   => 'https://example.com',
				],
				false,
			],
			'WebSite with different URL than current site' => [
				[
					[
						'@type' => 'WebSite',
						'@id'   => 'https://other.com/#website',
						'url'   => 'https://other.com',
					],
				],
				[
					'@type' => 'WebSite',
					'@id'   => 'https://other.com/#website',
					'url'   => 'https://other.com',
				],
				true,
			],
			'WebSite with current site URL as subdirectory' => [
				[],
				[
					'@type' => 'WebSite',
					'@id'   => 'https://example.com/blog/#website',
					'url'   => 'https://example.com/blog',
				],
				true,
			],
		];
	}
}

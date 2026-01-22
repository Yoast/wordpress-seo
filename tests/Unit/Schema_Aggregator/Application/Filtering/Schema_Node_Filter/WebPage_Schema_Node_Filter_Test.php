<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Filtering\Schema_Node_Filter;

use Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Filter\WebPage_Schema_Node_Filter;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the WebPage_Schema_Node_Filter class.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Filter\WebPage_Schema_Node_Filter::filter
 *
 * @group schema-aggregator
 */
final class WebPage_Schema_Node_Filter_Test extends TestCase {

	/**
	 * The instance of WebPage_Schema_Node_Filter being tested.
	 *
	 * @var WebPage_Schema_Node_Filter
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$this->instance = new WebPage_Schema_Node_Filter();
	}

	/**
	 * Tests the should_filter method of WebPage_Schema_Node_Filter.
	 *
	 * @dataProvider should_filter_data
	 *
	 *                                   @param array<array<string, string>> $schema_data       The full schema data.
	 *                                                        @param array<string, string>        $schema_piece_data The schema piece data to be filtered.
	 *                                                         @param bool                         $expected          Expected result.
	 *
	 * @return void
	 */
	public function test_should_filter( array $schema_data, array $schema_piece_data, bool $expected ): void {
		$schema_piece = new Schema_Piece( $schema_piece_data, $schema_piece_data['@type'] );
		$schema       = new Schema_Piece_Collection();
		foreach ( $schema_data as $data ) {
			$schema->add( new Schema_Piece( $data, $data['@type'] ) );
		}
		$result = $this->instance->should_filter( $schema, $schema_piece );

		$this->assertSame( $expected, $result );
	}

	/**
	 * Data provider for test_should_filter.
	 *
	 * @return array<string, array<array<array<string, string>>, array<string, string>, bool>>
	 */
	public function should_filter_data(): array {
		return [
			'WebPage without Article references' => [
				[
					[
						'@type' => 'WebPage',
						'@id'   => 'https://example.com/#webpage',
					],
					[
						'@type' => 'Article',
						'@id'   => 'https://example.com/#article',
					],
				],
				[
					'@type' => 'WebPage',
					'@id'   => 'https://example.com/#webpage',
				],
				true,
			],
			'WebPage with Article reference' => [
				[
					[
						'@type' => 'WebPage',
						'@id'   => 'https://example.com/#webpage',
					],
					[
						'@type' => 'Article',
						'@id'   => 'https://example.com/#article',
					],
					[
						'@type' => 'Article',
						'@id'   => 'https://example.com/#webpage-article',
					],
				],
				[
					'@type' => 'WebPage',
					'@id'   => 'https://example.com/#webpage-article',
				],
				false,
			],
		];
	}
}

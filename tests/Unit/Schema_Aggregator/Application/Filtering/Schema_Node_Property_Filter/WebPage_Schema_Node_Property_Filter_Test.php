<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Filtering\Schema_Node_Property_Filter;

use Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Property_Filter\WebPage_Schema_Node_Property_Filter;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the WebPage_Schema_Node_Property_Filter class.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Property_Filter\WebPage_Schema_Node_Property_Filter::filter_properties
 *
 * @group schema-aggregator
 */
final class WebPage_Schema_Node_Property_Filter_Test extends TestCase {

	/**
	 * The instance of WebPage_Schema_Node_Property_Filter being tested.
	 *
	 * @var WebPage_Schema_Node_Property_Filter
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$this->instance = new WebPage_Schema_Node_Property_Filter();
	}

	/**
	 * Tests the filter_properties method of WebPage_Schema_Node_Property_Filter.
	 *
	 * @dataProvider filter_properties_data
	 *
	 * @param array<string, string|int|bool|float|array> $schema_piece_data The schema piece data to be filtered.
	 * @param array<string, string|int|bool|float|array> $expected_data     The expected filtered schema piece data.
	 *
	 * @return void
	 */
	public function test_filter_properties( array $schema_piece_data, array $expected_data ): void {
		$schema_piece = new Schema_Piece( $schema_piece_data, $schema_piece_data['@type'] );

		$result = $this->instance->filter_properties( $schema_piece );
		$this->assertSame( $expected_data, $result->get_data() );
	}

	/**
	 * Data provider for test_filter_properties.
	 *
	 * @return array<string, array<array<string, string|int|bool|float|array>, array<string, string|int|bool|float|array>>>
	 */
	public function filter_properties_data(): array {
		return [
			'WebPage with all properties to be removed' => [
				[
					'@type'               => 'WebPage',
					'name'                => 'Example Page',
					'potentialAction'     => [ '@type' => 'ReadAction' ],
					'isPartOf'            => [ '@id' => 'https://example.com/#website' ],
					'mainEntityOfPage'    => [ '@id' => 'https://example.com/page' ],
					'primaryImageOfPage'  => [ '@id' => 'https://example.com/image.jpg' ],
					'breadcrumb'          => [ '@type' => 'BreadcrumbList' ],
					'url'                 => 'https://example.com/page',
				],
				[
					'@type' => 'WebPage',
					'name'  => 'Example Page',
					'url'   => 'https://example.com/page',
				],
			],
			'WebPage with some base properties and breadcrumb to be removed' => [
				[
					'@type'           => 'WebPage',
					'name'            => 'Sample Page',
					'potentialAction' => [ '@type' => 'ReadAction' ],
					'description'     => 'A sample page',
					'breadcrumb'      => [ '@type' => 'BreadcrumbList' ],
					'url'             => 'https://example.com/sample',
				],
				[
					'@type'       => 'WebPage',
					'name'        => 'Sample Page',
					'description' => 'A sample page',
					'url'         => 'https://example.com/sample',
				],
			],
			'WebPage with only breadcrumb to be removed' => [
				[
					'@type'       => 'WebPage',
					'name'        => 'Page with Breadcrumb',
					'breadcrumb'  => [
						'@type'           => 'BreadcrumbList',
						'itemListElement' => [],
					],
					'description' => 'Page description',
				],
				[
					'@type'       => 'WebPage',
					'name'        => 'Page with Breadcrumb',
					'description' => 'Page description',
				],
			],
			'WebPage with only base properties to be removed' => [
				[
					'@type'            => 'WebPage',
					'name'             => 'Another Page',
					'isPartOf'         => [ '@id' => 'https://example.com/#website' ],
					'mainEntityOfPage' => [ '@id' => 'https://example.com/another' ],
					'datePublished'    => '2023-01-01',
				],
				[
					'@type'         => 'WebPage',
					'name'          => 'Another Page',
					'datePublished' => '2023-01-01',
				],
			],
			'WebPage without properties to be removed' => [
				[
					'@type'         => 'WebPage',
					'name'          => 'Clean Page',
					'description'   => 'No properties to remove',
					'url'           => 'https://example.com/clean',
					'datePublished' => '2023-01-01',
				],
				[
					'@type'         => 'WebPage',
					'name'          => 'Clean Page',
					'description'   => 'No properties to remove',
					'url'           => 'https://example.com/clean',
					'datePublished' => '2023-01-01',
				],
			],
			'WebPage with null breadcrumb' => [
				[
					'@type'      => 'WebPage',
					'name'       => 'Page with Null Breadcrumb',
					'breadcrumb' => null,
					'url'        => 'https://example.com/null-breadcrumb',
				],
				[
					'@type' => 'WebPage',
					'name'  => 'Page with Null Breadcrumb',
					'url'   => 'https://example.com/null-breadcrumb',
				],
			],
			'WebPage with empty breadcrumb array' => [
				[
					'@type'       => 'WebPage',
					'name'        => 'Page with Empty Breadcrumb',
					'breadcrumb'  => [],
					'description' => 'Page description',
				],
				[
					'@type'       => 'WebPage',
					'name'        => 'Page with Empty Breadcrumb',
					'description' => 'Page description',
				],
			],
			'Empty WebPage except @type' => [
				[
					'@type' => 'WebPage',
				],
				[
					'@type' => 'WebPage',
				],
			],
		];
	}
}

<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Filtering\Schema_Node_Property_Filter;

use Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Property_Filter\Base_Schema_Node_Property_Filter;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Base_Schema_Node_Property_Filter class.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Property_Filter\Base_Schema_Node_Property_Filter::filter_properties
 *
 * @group schema-aggregator
 */
final class Base_Schema_Node_Property_Filter_Test extends TestCase {

	/**
	 * The instance of Base_Schema_Node_Property_Filter being tested.
	 *
	 * @var Base_Schema_Node_Property_Filter
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$this->instance = new Base_Schema_Node_Property_Filter();
	}

	/**
	 * Tests the filter_properties method of Base_Schema_Node_Property_Filter.
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
			'Schema piece with all properties to be removed' => [
				[
					'@type'               => 'Article',
					'headline'            => 'An example headline',
					'potentialAction'     => [ '@type' => 'ReadAction' ],
					'isPartOf'            => [ '@id' => 'https://example.com/#website' ],
					'mainEntityOfPage'    => [ '@id' => 'https://example.com/page' ],
					'primaryImageOfPage'  => [ '@id' => 'https://example.com/image.jpg' ],
					'author'              => 'John Doe',
				],
				[
					'@type'    => 'Article',
					'headline' => 'An example headline',
					'author'   => 'John Doe',
				],
			],
			'Schema piece with some properties to be removed' => [
				[
					'@type'           => 'WebPage',
					'name'            => 'Example Page',
					'potentialAction' => [ '@type' => 'ReadAction' ],
					'description'     => 'A sample page',
					'isPartOf'        => [ '@id' => 'https://example.com/#website' ],
					'url'             => 'https://example.com/page',
				],
				[
					'@type'       => 'WebPage',
					'name'        => 'Example Page',
					'description' => 'A sample page',
					'url'         => 'https://example.com/page',
				],
			],
			'Schema piece without properties to be removed' => [
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
			'Empty schema piece except @type' => [
				[
					'@type' => 'Organization',
				],
				[
					'@type' => 'Organization',
				],
			],
			'Schema piece with null values for avoided properties' => [
				[
					'@type'              => 'Article',
					'headline'           => 'Test Article',
					'potentialAction'    => null,
					'mainEntityOfPage'   => null,
					'author'             => 'Test Author',
				],
				[
					'@type'    => 'Article',
					'headline' => 'Test Article',
					'author'   => 'Test Author',
				],
			],
			'Schema piece with empty arrays for avoided properties' => [
				[
					'@type'               => 'WebSite',
					'name'                => 'Example Site',
					'potentialAction'     => [],
					'isPartOf'            => [],
					'primaryImageOfPage'  => [],
					'url'                 => 'https://example.com',
				],
				[
					'@type' => 'WebSite',
					'name'  => 'Example Site',
					'url'   => 'https://example.com',
				],
			],
			'Schema piece with mixed data types for avoided properties' => [
				[
					'@type'            => 'Product',
					'name'             => 'Test Product',
					'potentialAction'  => 'string value',
					'price'            => 99.99,
					'isPartOf'         => 123,
					'inStock'          => true,
					'mainEntityOfPage' => false,
				],
				[
					'@type'   => 'Product',
					'name'    => 'Test Product',
					'price'   => 99.99,
					'inStock' => true,
				],
			],
			'Schema piece with only one avoided property' => [
				[
					'@type'         => 'BlogPosting',
					'headline'      => 'Blog Post',
					'isPartOf'      => [ '@type' => 'Blog' ],
					'datePublished' => '2023-01-01',
				],
				[
					'@type'         => 'BlogPosting',
					'headline'      => 'Blog Post',
					'datePublished' => '2023-01-01',
				],
			],
		];
	}
}

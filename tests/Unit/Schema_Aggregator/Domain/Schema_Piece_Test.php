<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Domain;

use Generator;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Schema_Piece domain object.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece::__construct
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece::get_type
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece::get_data
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece::get_id
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece::to_json_ld_graph
 */
final class Schema_Piece_Test extends TestCase {

	/**
	 * Tests if the constructor sets properties correctly with string type.
	 *
	 * @return void
	 */
	public function test_constructor_with_string_type() {
		$data     = [ 'name' => 'Test', 'value' => 123 ];
		$type     = 'Article';
		$instance = new Schema_Piece( $data, $type );

		$this->assertSame(
			$data,
			$this->getPropertyValue( $instance, 'data' )
		);
		$this->assertSame(
			$type,
			$this->getPropertyValue( $instance, 'type' )
		);
	}

	/**
	 * Tests if the constructor sets properties correctly with array type.
	 *
	 * @return void
	 */
	public function test_constructor_with_array_type() {
		$data     = [ 'name' => 'Test' ];
		$type     = [ 'Article', 'NewsArticle' ];
		$instance = new Schema_Piece( $data, $type );

		$this->assertSame(
			$data,
			$this->getPropertyValue( $instance, 'data' )
		);
		$this->assertSame(
			$type,
			$this->getPropertyValue( $instance, 'type' )
		);
	}

	/**
	 * Tests the get_type method with various type values.
	 *
	 * @param string|array<string> $type     The type value to test.
	 * @param string|array<string> $expected The expected type value.
	 *
	 * @dataProvider type_data_provider
	 *
	 * @return void
	 */
	public function test_get_type( $type, $expected ) {
		$instance = new Schema_Piece( [ 'name' => 'Test' ], $type );

		$this->assertSame( $expected, $instance->get_type() );
	}

	/**
	 * Data provider for test_get_type.
	 *
	 * @return Generator
	 */
	public static function type_data_provider() {
		yield 'Single type as string' => [
			'type'     => 'Article',
			'expected' => 'Article',
		];
		yield 'Organization type' => [
			'type'     => 'Organization',
			'expected' => 'Organization',
		];
		yield 'Multiple types as array' => [
			'type'     => [ 'Article', 'NewsArticle' ],
			'expected' => [ 'Article', 'NewsArticle' ],
		];
		yield 'Single type in array' => [
			'type'     => [ 'Person' ],
			'expected' => [ 'Person' ],
		];
	}

	/**
	 * Tests the get_data method with various data arrays.
	 *
	 * @param array<string, string|int|bool> $data     The data to test.
	 * @param array<string, string|int|bool> $expected The expected data.
	 *
	 * @dataProvider data_data_provider
	 *
	 * @return void
	 */
	public function test_get_data( $data, $expected ) {
		$instance = new Schema_Piece( $data, 'Article' );

		$this->assertSame( $expected, $instance->get_data() );
	}

	/**
	 * Data provider for test_get_data.
	 *
	 * @return Generator
	 */
	public static function data_data_provider() {
		yield 'Simple data' => [
			'data'     => [ 'name' => 'Test' ],
			'expected' => [ 'name' => 'Test' ],
		];
		yield 'Data with multiple properties' => [
			'data'     => [
				'name'        => 'Article Name',
				'description' => 'Article Description',
				'published'   => true,
			],
			'expected' => [
				'name'        => 'Article Name',
				'description' => 'Article Description',
				'published'   => true,
			],
		];
		yield 'Data with numeric values' => [
			'data'     => [
				'count' => 42,
				'views' => 1000,
			],
			'expected' => [
				'count' => 42,
				'views' => 1000,
			],
		];
		yield 'Data with boolean values' => [
			'data'     => [
				'active'  => true,
				'deleted' => false,
			],
			'expected' => [
				'active'  => true,
				'deleted' => false,
			],
		];
		yield 'Empty data array' => [
			'data'     => [],
			'expected' => [],
		];
	}

	/**
	 * Tests the get_id method when @id is present in data.
	 *
	 * @return void
	 */
	public function test_get_id_with_id_present() {
		$data = [
			'@id'  => 'https://example.com/#article',
			'name' => 'Test',
		];
		$instance = new Schema_Piece( $data, 'Article' );

		$this->assertSame( 'https://example.com/#article', $instance->get_id() );
	}

	/**
	 * Tests the get_id method when @id is not present in data.
	 *
	 * @return void
	 */
	public function test_get_id_without_id_present() {
		$data     = [ 'name' => 'Test' ];
		$instance = new Schema_Piece( $data, 'Article' );

		$this->assertNull( $instance->get_id() );
	}

	/**
	 * Tests the get_id method with various @id values.
	 *
	 * @param array<string, string|int|bool> $data              The data containing @id.
	 * @param string|null                    $expected_id       The expected ID value.
	 *
	 * @dataProvider id_data_provider
	 *
	 * @return void
	 */
	public function test_get_id_with_various_values( $data, $expected_id ) {
		$instance = new Schema_Piece( $data, 'Article' );

		$this->assertSame( $expected_id, $instance->get_id() );
	}

	/**
	 * Data provider for test_get_id_with_various_values.
	 *
	 * @return Generator
	 */
	public static function id_data_provider() {
		yield 'ID with hash fragment' => [
			'data'        => [ '@id' => 'https://example.com/#article' ],
			'expected_id' => 'https://example.com/#article',
		];
		yield 'ID with simple path' => [
			'data'        => [ '@id' => 'https://example.com/article/1' ],
			'expected_id' => 'https://example.com/article/1',
		];
		yield 'No ID present' => [
			'data'        => [ 'name' => 'Test' ],
			'expected_id' => null,
		];
		yield 'Empty data' => [
			'data'        => [],
			'expected_id' => null,
		];
		yield 'ID with other properties' => [
			'data'        => [
				'@id'  => 'https://example.com/#organization',
				'name' => 'Company',
			],
			'expected_id' => 'https://example.com/#organization',
		];
	}

	/**
	 * Tests the to_json_ld_graph method.
	 *
	 * @return void
	 */
	public function test_to_json_ld_graph() {
		$data = [
			'@id'  => 'https://example.com/#article',
			'name' => 'Test Article',
		];
		$instance = new Schema_Piece( $data, 'Article' );

		$result = $instance->to_json_ld_graph();

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( '@graph', $result );
		$this->assertSame( $data, $result['@graph'] );
	}

	/**
	 * Tests the to_json_ld_graph method with various data.
	 *
	 * @param array<string, string|int|bool>  $data          The data to test.
	 * @param array<string, mixed>            $expected      The expected graph structure.
	 *
	 * @dataProvider json_ld_graph_data_provider
	 *
	 * @return void
	 */
	public function test_to_json_ld_graph_with_various_data( $data, $expected ) {
		$instance = new Schema_Piece( $data, 'Article' );

		$this->assertSame( $expected, $instance->to_json_ld_graph() );
	}

	/**
	 * Data provider for test_to_json_ld_graph_with_various_data.
	 *
	 * @return Generator
	 */
	public static function json_ld_graph_data_provider() {
		yield 'Simple data' => [
			'data'     => [ 'name' => 'Test' ],
			'expected' => [ '@graph' => [ 'name' => 'Test' ] ],
		];
		yield 'Data with @id' => [
			'data'     => [
				'@id'  => 'https://example.com/#article',
				'name' => 'Article',
			],
			'expected' => [
				'@graph' => [
					'@id'  => 'https://example.com/#article',
					'name' => 'Article',
				],
			],
		];
		yield 'Complex data' => [
			'data'     => [
				'@id'         => 'https://example.com/#organization',
				'name'        => 'Company',
				'description' => 'A great company',
				'employee_count' => 100,
			],
			'expected' => [
				'@graph' => [
					'@id'            => 'https://example.com/#organization',
					'name'           => 'Company',
					'description'    => 'A great company',
					'employee_count' => 100,
				],
			],
		];
		yield 'Empty data' => [
			'data'     => [],
			'expected' => [ '@graph' => [] ],
		];
	}

	/**
	 * Tests that getters return the exact values passed to the constructor.
	 *
	 * @param array<string, string|int|bool> $data The data value.
	 * @param string|array<string>           $type The type value.
	 *
	 * @dataProvider constructor_values_data_provider
	 *
	 * @return void
	 */
	public function test_getters_return_constructor_values( $data, $type ) {
		$instance = new Schema_Piece( $data, $type );

		$this->assertSame( $data, $instance->get_data() );
		$this->assertSame( $type, $instance->get_type() );
	}

	/**
	 * Data provider for test_getters_return_constructor_values.
	 *
	 * @return Generator
	 */
	public static function constructor_values_data_provider() {
		yield 'Article with string type' => [
			'data' => [ 'name' => 'Article Name' ],
			'type' => 'Article',
		];
		yield 'Organization with array type' => [
			'data' => [ 'name' => 'Company' ],
			'type' => [ 'Organization', 'LocalBusiness' ],
		];
		yield 'Complex data with single type' => [
			'data' => [
				'@id'         => 'https://example.com/#page',
				'name'        => 'Page',
				'description' => 'A page description',
				'published'   => true,
			],
			'type' => 'WebPage',
		];
		yield 'Empty data with type' => [
			'data' => [],
			'type' => 'Thing',
		];
	}
}

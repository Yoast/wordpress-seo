<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Domain;

use Generator;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Indexable_Count domain object.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count::__construct
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count::get_count
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count::get_post_type
 */
final class Indexable_Count_Test extends TestCase {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$instance = new Indexable_Count( 'post', 42 );

		$this->assertSame(
			'post',
			$this->getPropertyValue( $instance, 'post_type' )
		);
		$this->assertSame(
			42,
			$this->getPropertyValue( $instance, 'count' )
		);
	}

	/**
	 * Tests the get_count method with various count values.
	 *
	 * @param int $count    The count value to test.
	 * @param int $expected The expected count value.
	 *
	 * @dataProvider count_data_provider
	 *
	 * @return void
	 */
	public function test_get_count( $count, $expected ) {
		$instance = new Indexable_Count( 'post', $count );

		$this->assertSame( $expected, $instance->get_count() );
	}

	/**
	 * Data provider for test_get_count.
	 *
	 * @return Generator
	 */
	public static function count_data_provider() {
		yield 'Normal positive count' => [
			'count'    => 42,
			'expected' => 42,
		];
		yield 'Zero count' => [
			'count'    => 0,
			'expected' => 0,
		];
		yield 'Large count' => [
			'count'    => 999999,
			'expected' => 999999,
		];
		yield 'Small count' => [
			'count'    => 1,
			'expected' => 1,
		];
		yield 'Negative count' => [
			'count'    => -5,
			'expected' => -5,
		];
	}

	/**
	 * Tests the get_post_type method with various post type values.
	 *
	 * @param string $post_type The post type value to test.
	 * @param string $expected  The expected post type value.
	 *
	 * @dataProvider post_type_data_provider
	 *
	 * @return void
	 */
	public function test_get_post_type( $post_type, $expected ) {
		$instance = new Indexable_Count( $post_type, 10 );

		$this->assertSame( $expected, $instance->get_post_type() );
	}

	/**
	 * Data provider for test_get_post_type.
	 *
	 * @return Generator
	 */
	public static function post_type_data_provider() {
		yield 'Standard post type' => [
			'post_type' => 'post',
			'expected'  => 'post',
		];
		yield 'Custom post type' => [
			'post_type' => 'product',
			'expected'  => 'product',
		];
		yield 'Post type with underscore' => [
			'post_type' => 'custom_type',
			'expected'  => 'custom_type',
		];
		yield 'Post type with hyphen' => [
			'post_type' => 'my-custom-type',
			'expected'  => 'my-custom-type',
		];
		yield 'Short post type' => [
			'post_type' => 'p',
			'expected'  => 'p',
		];
		yield 'Longer post type name' => [
			'post_type' => 'very_long_custom_post_type_name',
			'expected'  => 'very_long_custom_post_type_name',
		];
	}

	/**
	 * Tests that getters return the exact values passed to the constructor.
	 *
	 * @param string $post_type The post type value.
	 * @param int    $count     The count value.
	 *
	 * @dataProvider constructor_values_data_provider
	 *
	 * @return void
	 */
	public function test_getters_return_constructor_values( $post_type, $count ) {
		$instance = new Indexable_Count( $post_type, $count );

		$this->assertSame( $post_type, $instance->get_post_type() );
		$this->assertSame( $count, $instance->get_count() );
	}

	/**
	 * Data provider for test_getters_return_constructor_values.
	 *
	 * @return Generator
	 */
	public static function constructor_values_data_provider() {
		yield 'Standard post with count' => [
			'post_type' => 'post',
			'count'     => 42,
		];
		yield 'Page with zero count' => [
			'post_type' => 'page',
			'count'     => 0,
		];
		yield 'Custom post type with large count' => [
			'post_type' => 'product',
			'count'     => 500000,
		];
		yield 'Post type with underscore and count' => [
			'post_type' => 'custom_type',
			'count'     => 123,
		];
		yield 'Post type with hyphen and small count' => [
			'post_type' => 'my-custom-type',
			'count'     => 1,
		];
		yield 'Attachment post type' => [
			'post_type' => 'attachment',
			'count'     => 999,
		];
	}
}

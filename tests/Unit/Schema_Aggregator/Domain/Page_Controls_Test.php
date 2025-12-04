<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Domain;

use Generator;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Page_Controls;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Page_Controls domain object.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Page_Controls::__construct
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Page_Controls::get_page
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Page_Controls::get_page_size
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Page_Controls::get_post_type
 */
final class Page_Controls_Test extends TestCase {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$instance = new Page_Controls( 1, 20, 'post' );

		$this->assertSame(
			1,
			$this->getPropertyValue( $instance, 'page' )
		);
		$this->assertSame(
			20,
			$this->getPropertyValue( $instance, 'page_size' )
		);
		$this->assertSame(
			'post',
			$this->getPropertyValue( $instance, 'post_type' )
		);
	}

	/**
	 * Tests the get_page method with various page values.
	 *
	 * @param int $page     The page value to test.
	 * @param int $expected The expected page value.
	 *
	 * @dataProvider page_data_provider
	 *
	 * @return void
	 */
	public function test_get_page( $page, $expected ) {
		$instance = new Page_Controls( $page, 10, 'post' );

		$this->assertSame( $expected, $instance->get_page() );
	}

	/**
	 * Data provider for test_get_page.
	 *
	 * @return Generator
	 */
	public static function page_data_provider() {
		yield 'First page' => [
			'page'     => 1,
			'expected' => 1,
		];
		yield 'Second page' => [
			'page'     => 2,
			'expected' => 2,
		];
		yield 'Large page number' => [
			'page'     => 100,
			'expected' => 100,
		];
		yield 'Zero page' => [
			'page'     => 0,
			'expected' => 0,
		];
	}

	/**
	 * Tests the get_page_size method with various page size values.
	 *
	 * @param int $page_size The page size value to test.
	 * @param int $expected  The expected page size value.
	 *
	 * @dataProvider page_size_data_provider
	 *
	 * @return void
	 */
	public function test_get_page_size( $page_size, $expected ) {
		$instance = new Page_Controls( 1, $page_size, 'post' );

		$this->assertSame( $expected, $instance->get_page_size() );
	}

	/**
	 * Data provider for test_get_page_size.
	 *
	 * @return Generator
	 */
	public static function page_size_data_provider() {
		yield 'Standard page size' => [
			'page_size' => 10,
			'expected'  => 10,
		];
		yield 'Small page size' => [
			'page_size' => 5,
			'expected'  => 5,
		];
		yield 'Large page size' => [
			'page_size' => 100,
			'expected'  => 100,
		];
		yield 'Single item per page' => [
			'page_size' => 1,
			'expected'  => 1,
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
		$instance = new Page_Controls( 1, 10, $post_type );

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
		yield 'Page post type' => [
			'post_type' => 'page',
			'expected'  => 'page',
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
	}

	/**
	 * Tests that all getters return the exact values passed to the constructor.
	 *
	 * @param int    $page      The page value.
	 * @param int    $page_size The page size value.
	 * @param string $post_type The post type value.
	 *
	 * @dataProvider constructor_values_data_provider
	 *
	 * @return void
	 */
	public function test_getters_return_constructor_values( $page, $page_size, $post_type ) {
		$instance = new Page_Controls( $page, $page_size, $post_type );

		$this->assertSame( $page, $instance->get_page() );
		$this->assertSame( $page_size, $instance->get_page_size() );
		$this->assertSame( $post_type, $instance->get_post_type() );
	}

	/**
	 * Data provider for test_getters_return_constructor_values.
	 *
	 * @return Generator
	 */
	public static function constructor_values_data_provider() {
		yield 'Standard pagination' => [
			'page'      => 1,
			'page_size' => 10,
			'post_type' => 'post',
		];
		yield 'Second page with larger page size' => [
			'page'      => 2,
			'page_size' => 50,
			'post_type' => 'page',
		];
		yield 'Large page number' => [
			'page'      => 100,
			'page_size' => 25,
			'post_type' => 'product',
		];
		yield 'Custom post type with small page size' => [
			'page'      => 5,
			'page_size' => 5,
			'post_type' => 'custom_type',
		];
		yield 'First page with single item' => [
			'page'      => 1,
			'page_size' => 1,
			'post_type' => 'attachment',
		];
	}
}

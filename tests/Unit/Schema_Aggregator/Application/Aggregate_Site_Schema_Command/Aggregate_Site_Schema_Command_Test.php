<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Aggregate_Site_Schema_Command;

use Generator;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Command;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Page_Controls;

/**
 * Tests the Aggregate_Site_Schema_Command constructor.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Command::__construct
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Command::get_page_controls
 */
final class Aggregate_Site_Schema_Command_Test extends Abstract_Aggregate_Site_Schema_Command_Test {

	/**
	 * Tests constructor creates Page_Controls correctly.
	 *
	 * @return void
	 */
	public function test_constructor_creates_page_controls() {
		$command = new Aggregate_Site_Schema_Command( 1, 50, 'post' );

		$page_controls = $command->get_page_controls();

		$this->assertInstanceOf( Page_Controls::class, $page_controls );
		$this->assertSame( 1, $page_controls->get_page() );
		$this->assertSame( 50, $page_controls->get_page_size() );
		$this->assertSame( 'post', $page_controls->get_post_type() );
	}

	/**
	 * Tests constructor with various parameters.
	 *
	 * @dataProvider page_controls_data_provider
	 *
	 * @param int    $page      The page number.
	 * @param int    $per_page  The items per page.
	 * @param string $post_type The post type.
	 *
	 * @return void
	 */
	public function test_constructor_with_various_parameters( int $page, int $per_page, string $post_type ) {
		$command = new Aggregate_Site_Schema_Command( $page, $per_page, $post_type );

		$page_controls = $command->get_page_controls();

		$this->assertSame( $page, $page_controls->get_page() );
		$this->assertSame( $per_page, $page_controls->get_page_size() );
		$this->assertSame( $post_type, $page_controls->get_post_type() );
	}

	/**
	 * Data provider for page controls tests.
	 *
	 * @return Generator
	 */
	public static function page_controls_data_provider() {
		yield 'First page of posts' => [
			'page'      => 1,
			'per_page'  => 50,
			'post_type' => 'post',
		];

		yield 'Second page of pages' => [
			'page'      => 2,
			'per_page'  => 100,
			'post_type' => 'page',
		];

		yield 'Custom post type' => [
			'page'      => 3,
			'per_page'  => 25,
			'post_type' => 'product',
		];

		yield 'Large page number' => [
			'page'      => 100,
			'per_page'  => 10,
			'post_type' => 'post',
		];
	}
}

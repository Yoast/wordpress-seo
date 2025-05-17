<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Application;

use Yoast\WP\SEO\Tests\Unit\Doubles\Introductions\Current_Page_Trait_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the current page trait.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\Application\Current_Page_Trait
 */
final class Current_Page_Trait_Test extends TestCase {

	/**
	 * Holds the test instance.
	 *
	 * @var Current_Page_Trait_Double
	 */
	private $instance;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->instance = new Current_Page_Trait_Double();
	}

	/**
	 * Tests the on an installation page.
	 *
	 * @covers ::is_on_installation_page
	 * @covers ::is_on_yoast_page
	 * @covers ::get_page
	 *
	 * @dataProvider is_on_installation_page_get_data
	 *
	 * @param mixed $page     The page.
	 * @param bool  $expected The expected result.
	 *
	 * @return void
	 */
	public function test_is_on_installation_page( $page, $expected ) {
		if ( $page ) {
			$_GET['page'] = $page;
		}
		$this->assertSame( $expected, $this->instance->is_on_installation_page() );
	}

	/**
	 * Data provider for the `test_is_on_installation_page()` test.
	 *
	 * @return array
	 */
	public static function is_on_installation_page_get_data() {
		return [
			'no page'                   => [
				'page'     => '',
				'expected' => false,
			],
			'free installation page'    => [
				'page'     => 'wpseo_installation_successful_free',
				'expected' => true,
			],
			'premium installation page' => [
				'page'     => 'wpseo_installation_successful',
				'expected' => true,
			],
			'other page'                => [
				'page'     => 'wpseo_dashboard',
				'expected' => false,
			],
			'non-string page'           => [
				'page'     => true,
				'expected' => false,
			],
		];
	}
}

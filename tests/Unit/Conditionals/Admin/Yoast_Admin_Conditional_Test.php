<?php // phpcs:ignore Yoast.Files.FileName.InvalidClassFileName -- Reason: this explicitly concerns the Yoast admin.

namespace Yoast\WP\SEO\Tests\Unit\Conditionals\Admin;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin\Yoast_Admin_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Yoast admin conditional.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Admin\Yoast_Admin_Conditional
 */
final class Yoast_Admin_Conditional_Test extends TestCase {

	/**
	 * Holds the test instance.
	 *
	 * @var Yoast_Admin_Conditional
	 */
	private $instance;

	/**
	 * Holds the current page helper.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->instance            = new Yoast_Admin_Conditional( $this->current_page_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Current_Page_Helper::class,
			$this->getPropertyValue( $this->instance, 'current_page_helper' )
		);
	}

	/**
	 * Tests the conditional `is_met`.
	 *
	 * @covers ::is_met
	 *
	 * @dataProvider is_met_data
	 *
	 * @param bool $is_admin          Whether on the admin.
	 * @param bool $is_yoast_seo_page Whether on a Yoast SEO page.
	 * @param bool $expected          The expected result.
	 *
	 * @return void
	 */
	public function test_is_met( $is_admin, $is_yoast_seo_page, $expected ) {
		Functions\when( 'is_admin' )->justReturn( $is_admin );
		$this->current_page_helper->expects( 'is_yoast_seo_page' )
			->times( ( $is_admin ) ? 1 : 0 )
			->withNoArgs()
			->andReturn( $is_yoast_seo_page );

		$this->assertSame( $expected, $this->instance->is_met() );
	}

	/**
	 * Provides the data for `test_is_met`.
	 *
	 * @return array The data.
	 */
	public static function is_met_data() {
		return [
			'on a Yoast admin page'     => [
				'is_admin'          => true,
				'is_yoast_seo_page' => true,
				'expected'          => true,
			],
			'not on an admin page'      => [
				'is_admin'          => false,
				'is_yoast_seo_page' => true,
				'expected'          => false,
			],
			'not on a Yoast admin page' => [
				'is_admin'          => true,
				'is_yoast_seo_page' => false,
				'expected'          => false,
			],
		];
	}
}

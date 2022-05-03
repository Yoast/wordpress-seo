<?php
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Presenters\Admin\Indexing_Failed_Notification_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Failed_Notification_Presenter_Test
 *
 * @covers \Yoast\WP\SEO\Presenters\Admin\Indexing_Failed_Notification_Presenter
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Indexing_Failed_Notification_Presenter
 */
class Indexing_Failed_Notification_Presenter_Test extends TestCase {

	/**
	 * Set up function stubs.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
	}

	/**
	 * Tests the present method when not in Premium.
	 *
	 * @covers ::__construct
	 * @covers ::present
	 */
	public function test_present_not_premium() {
		$product_helper = Mockery::mock( Product_Helper::class );
		$product_helper
			->expects( 'is_premium' )
			->andReturnFalse();

		$instance = new Indexing_Failed_Notification_Presenter( $product_helper, null, null );

		Monkey\Functions\expect( 'get_admin_url' )
			->with( null, 'admin.php?page=wpseo_tools' )
			->andReturn( 'https://example.org/wp-admin/admin.php?page=wpseo_tools' );

		$expected = '<p>Something has gone wrong and we couldn\'t complete the optimization of your SEO data. ' .
			'Please <a href="https://example.org/wp-admin/admin.php?page=wpseo_tools">re-start the process</a>.</p>';

		$this->assertSame( $expected, $instance->present() );
	}

	/**
	 * Tests the present method when in Premium.
	 *
	 * @covers ::__construct
	 * @covers ::present
	 */
	public function test_present_premium_no_license() {
		$product_helper = Mockery::mock( Product_Helper::class );
		$product_helper
			->expects( 'is_premium' )
			->andReturnTrue();

		$license_manager = Mockery::mock( WPSEO_Addon_Manager::class );
		$license_manager
			->expects( 'has_valid_subscription' )
			->andReturnFalse();

		$short_link_helper = Mockery::mock( Short_Link_Helper::class );
		$short_link_helper
			->expects( 'get' )
			->andReturn( 'https://yoa.st/3wv' );

		$instance = new Indexing_Failed_Notification_Presenter( $product_helper, $short_link_helper, $license_manager );

		Monkey\Functions\expect( 'get_admin_url' )
			->with( null, 'admin.php?page=wpseo_tools' )
			->andReturn( 'https://example.org/wp-admin/admin.php?page=wpseo_tools' );
		Monkey\Functions\expect( 'esc_url' )
			->with( null, 'admin.php?page=wpseo_tools' )
			->andReturn( 'https://example.org/wp-admin/admin.php?page=wpseo_tools' );

		$expected = '<p>Oops, something has gone wrong and we couldn\'t complete the optimization of your SEO data. ' .
			'Please make sure to activate your subscription in MyYoast by completing ' .
			'<a href="https://example.org/wp-admin/admin.php?page=wpseo_tools">these steps</a>.</p>';

		$this->assertSame( $expected, $instance->present() );
	}

	/**
	 * Tests the present method when in Premium.
	 *
	 * @covers ::__construct
	 * @covers ::present
	 */
	public function test_present_premium_with_license() {
		$product_helper = Mockery::mock( Product_Helper::class );
		$product_helper
			->expects( 'is_premium' )
			->andReturnTrue();

		$addon_manager = Mockery::mock( WPSEO_Addon_Manager::class );
		$addon_manager
			->expects( 'has_valid_subscription' )
			->andReturnTrue();

		$instance = new Indexing_Failed_Notification_Presenter( $product_helper, null, $addon_manager );

		Monkey\Functions\expect( 'get_admin_url' )
			->with( null, 'admin.php?page=wpseo_tools' )
			->andReturn( 'https://example.org/wp-admin/admin.php?page=wpseo_tools' );

		$expected = '<p>Something has gone wrong and we couldn\'t complete the optimization of your SEO data. Please <a href="https://example.org/wp-admin/admin.php?page=wpseo_tools">re-start the process</a>. If the problem persists, please contact support.</p>';

		$this->assertSame( $expected, $instance->present() );
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Presenters\Admin\Auto_Update_Notification_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Auto_Update_Notification_Presenter_Test.
 *
 * @covers \Yoast\WP\SEO\Presenters\Admin\Auto_Update_Notification_Presenter
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Auto_Update_Notification_Presenter
 *
 * @group presenters
 */
class Auto_Update_Notification_Presenter_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Auto_Update_Notification_Presenter
	 */
	protected $instance;

	/**
	 * The mocked product helper.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	protected $product_helper;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->product_helper = Mockery::mock( Product_Helper::class );

		$this->instance = new Auto_Update_Notification_Presenter( $this->product_helper );
	}

	/**
	 * Tests returning the notification as an HTML string.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		Monkey\Functions\expect( 'get_admin_url' )
			->with( null, 'plugins.php' )
			->andReturn( 'http://basic.wordpress.test/wp-admin/plugins.php' );

		Monkey\Functions\expect( 'esc_url' )
			->once()
			->andReturn( 'http://basic.wordpress.test/wp-admin/plugins.php' );

		$this->product_helper
			->expects( 'get_product_name' )
			->andReturns( 'Yoast SEO' );

		$expected = '<p>We see that you enabled automatic updates for WordPress. We recommend that you do this for Yoast SEO as well. This way we can guarantee that WordPress and Yoast SEO will continue to run smoothly together. <a href="http://basic.wordpress.test/wp-admin/plugins.php">Go to your plugins overview to enable auto-updates for Yoast SEO.</a></p>';

		$this->assertSame( $expected, $this->instance->present() );
	}
}

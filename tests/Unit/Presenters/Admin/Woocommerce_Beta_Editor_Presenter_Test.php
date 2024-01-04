<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Presenters\Admin\Woocommerce_Beta_Editor_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Search_Engines_Discouraged_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Woocommerce_Beta_Editor_Presenter
 *
 * @group presenters
 */
final class Woocommerce_Beta_Editor_Presenter_Test extends TestCase {

	/**
	 * The short link helper.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * The instance to test.
	 *
	 * @var Woocommerce_Beta_Editor_Presenter
	 */
	protected $instance;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
		$this->short_link_helper = Mockery::mock( Short_Link_Helper::class );
		$this->instance          = new Woocommerce_Beta_Editor_Presenter( $this->short_link_helper );
	}

	/**
	 * Tests returning the notification as an HTML string.
	 *
	 * @covers ::present
	 * @covers ::get_message
	 *
	 * @return void
	 */
	public function test_present() {

		Monkey\Functions\expect( 'esc_url' )
			->once()
			->with( 'https://yoa.st/learn-how-disable-beta-woocommerce-product-editor' )
			->andReturn( 'https://yoa.st/learn-how-disable-beta-woocommerce-product-editor' );

		$this->short_link_helper
			->expects( 'get' )
			->once()
			->with( 'https://yoa.st/learn-how-disable-beta-woocommerce-product-editor' )
			->andReturn( 'https://yoa.st/learn-how-disable-beta-woocommerce-product-editor' );

		$expected = '<p><strong>Compatibility issue: Yoast SEO is incompatible with the beta WooCommerce product editor.</strong> The Yoast SEO interface is currently unavailable in the beta WooCommerce product editor. To resolve any issues, please disable the beta editor. <a href="https://yoa.st/learn-how-disable-beta-woocommerce-product-editor" target="_blank">Learn how to disable the beta WooCommerce product editor.</a></p>';

		$this->assertSame( $expected, $this->instance->present() );
	}
}

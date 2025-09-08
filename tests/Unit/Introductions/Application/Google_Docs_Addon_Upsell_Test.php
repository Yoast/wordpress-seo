<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Application;

use Mockery;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Introductions\Application\Google_Docs_Addon_Upsell;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Google Docs Addon upsell.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\Application\Google_Docs_Addon_Upsell
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Google_Docs_Addon_Upsell_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Google_Docs_Addon_Upsell
	 */
	private $instance;

	/**
	 * Holds the user helper.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	private $user_helper;

	/**
	 * Holds the product helper.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	private $product_helper;

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
	protected function set_up() {
		parent::set_up();

		$this->user_helper         = Mockery::mock( User_Helper::class );
		$this->product_helper      = Mockery::mock( Product_Helper::class );
		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );

		$this->instance = new Google_Docs_Addon_Upsell( $this->user_helper, $this->product_helper, $this->current_page_helper );
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
			Product_Helper::class,
			$this->getPropertyValue( $this->instance, 'product_helper' )
		);

		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' )
		);

		$this->assertInstanceOf(
			Current_Page_Helper::class,
			$this->getPropertyValue( $this->instance, 'current_page_helper' )
		);
	}

	/**
	 * Tests getting the ID.
	 *
	 * @covers ::get_id
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'google-docs-addon-upsell', $this->instance->get_id() );
	}

	/**
	 * Tests getting the priority.
	 *
	 * @covers ::get_priority
	 *
	 * @return void
	 */
	public function test_get_priority() {
		$this->assertSame( 20, $this->instance->get_priority() );
	}

	/**
	 * Tests the conditional `should_show`.
	 *
	 * @covers ::should_show
	 *
	 * @return void
	 */
	public function test_should_show() {
		$this->assertSame( false, $this->instance->should_show() );
	}
}

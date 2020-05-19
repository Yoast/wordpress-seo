<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Integrations\Third_Party
 */

namespace Yoast\WP\SEO\Tests\Integrations\Third_Party;

use Mockery;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Third_Party\BbPress;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\BbPress
 * @covers ::<!public>
 *
 * @group integrations
 * @group third-party
 */
class BbPress_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var BbPress
	 */
	protected $instance;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->options  = Mockery::mock( Options_Helper::class );
		$this->instance = new BbPress( $this->options );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class ],
			BbPress::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks with breadcrumbs disabled.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_with_breadcrumbs_disabled() {
		$this->options
			->expects( 'get' )
			->once()
			->with( 'breadcrumbs-enable' )
			->andReturnFalse();

		$this->instance->register_hooks();

		$this->assertFalse( \has_filter( 'bbp_get_breadcrumb', '__return_false' ) );
	}

	/**
	 * Tests the registration of the hooks with breadcrumbs disabled..
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_with_breadcrumbs_enabled() {
		$this->options
			->expects( 'get' )
			->once()
			->with( 'breadcrumbs-enable' )
			->andReturnTrue();

		$this->instance->register_hooks();

		$this->assertTrue( \has_filter( 'bbp_get_breadcrumb', '__return_false' ) );
	}
}

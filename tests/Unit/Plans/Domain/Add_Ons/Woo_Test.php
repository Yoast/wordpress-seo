<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Plans\Domain\Add_Ons;

use Mockery;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Plans\Domain\Add_Ons\Woo;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Woo add-on.
 *
 * @group plans
 *
 * @coversDefaultClass \Yoast\WP\SEO\Plans\Domain\Add_Ons\Woo
 */
final class Woo_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Woo
	 */
	private $instance;

	/**
	 * Holds the WPSEO_Addon_Manager mock.
	 *
	 * @var Mockery\MockInterface|WPSEO_Addon_Manager
	 */
	private $addon_manager;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();

		$this->addon_manager = Mockery::mock( WPSEO_Addon_Manager::class );

		$this->instance = new Woo( $this->addon_manager );
	}

	/**
	 * Tests the get_id method.
	 *
	 * @covers ::get_id
	 *
	 * @return void
	 */
	public function test_get_id(): void {
		$this->assertSame( 'woo', $this->instance->get_id() );
	}

	/**
	 * Tests the get_ctb_action method.
	 *
	 * @covers ::get_ctb_action
	 *
	 * @return void
	 */
	public function test_get_ctb_action(): void {
		$this->assertSame( 'load-nfd-woo-ctb', $this->instance->get_ctb_action() );
	}

	/**
	 * Tests the get_ctb_id method.
	 *
	 * @covers ::get_ctb_id
	 *
	 * @return void
	 */
	public function test_get_ctb_id(): void {
		$this->assertSame( '5b32250e-e6f0-44ae-ad74-3cefc8e427f9', $this->instance->get_ctb_id() );
	}

	/**
	 * Tests the is_active method.
	 *
	 * @covers ::is_active
	 *
	 * @return void
	 */
	public function test_is_active(): void {
		$this->addon_manager->expects( 'is_installed' )
			->twice()
			->with( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG )
			->andReturn( true, false );

		$this->assertTrue( $this->instance->is_active() );
		$this->assertFalse( $this->instance->is_active() );
	}

	/**
	 * Tests the has_license method.
	 *
	 * @covers ::has_license
	 *
	 * @return void
	 */
	public function test_has_license(): void {
		$this->addon_manager->expects( 'has_valid_subscription' )
			->twice()
			->with( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG )
			->andReturn( true, false );

		$this->assertTrue( $this->instance->has_license() );
		$this->assertFalse( $this->instance->has_license() );
	}
}

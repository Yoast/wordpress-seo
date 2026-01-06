<?php

namespace Yoast\WP\SEO\Tests\Unit\Plans\Application;

use Mockery;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Plans\Application\Add_Ons_Collector;
use Yoast\WP\SEO\Plans\Domain\Add_Ons\Premium;
use Yoast\WP\SEO\Plans\Domain\Add_Ons\Woo;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the add-ons collector.
 *
 * @group plans
 *
 * @coversDefaultClass \Yoast\WP\SEO\Plans\Application\Add_Ons_Collector
 */
final class Add_Ons_Collector_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Add_Ons_Collector
	 */
	private $instance;

	/**
	 * Holds the WPSEO_Addon_Manager mock.
	 *
	 * @var Mockery\MockInterface|WPSEO_Addon_Manager
	 */
	private $addon_manager;

	/**
	 * Holds the Yoast Premium SEO add-on.
	 *
	 * @var Premium
	 */
	private $premium;

	/**
	 * Holds the Yoast WooCommerce SEO add-on.
	 *
	 * @var Woo
	 */
	private $woo;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->addon_manager = Mockery::mock( WPSEO_Addon_Manager::class );

		$this->premium = new Premium( $this->addon_manager );
		$this->woo     = new Woo( $this->addon_manager );

		$this->instance = new Add_Ons_Collector( $this->addon_manager, $this->premium, $this->woo );
	}

	/**
	 * Tests constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertIsArray( $this->getPropertyValue( $this->instance, 'add_ons' ) );
	}

	/**
	 * Tests get.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get() {
		$this->assertSame(
			[
				$this->premium,
				$this->woo,
			],
			$this->instance->get()
		);
	}

	/**
	 * Data provider for hasLicense and isActive.
	 *
	 * @return array<string, array<string, bool>> The has_license and is_active combinations.
	 */
	public function has_license_and_is_active_provider() {
		return [
			'has license and is active' => [
				'has_license' => true,
				'is_active'   => true,
			],
			'has license and is not active' => [
				'has_license' => true,
				'is_active'   => false,
			],
			'no license and is active' => [
				'has_license' => false,
				'is_active'   => true,
			],
			'no license and is not active' => [
				'has_license' => false,
				'is_active'   => false,
			],
		];
	}

	/**
	 * Tests to_array.
	 *
	 * @dataProvider has_license_and_is_active_provider
	 *
	 * @covers ::to_array
	 *
	 * @param bool $has_license Whether the add-on has a license.
	 * @param bool $is_active   Whether the add.
	 * @return void
	 */
	public function test_to_array( $has_license, $is_active ) {
		$this->addon_manager->expects( 'has_active_addons' )
			->once()
			->andReturn( true );

		$this->addon_manager->expects( 'is_installed' )
			->once()
			->with( WPSEO_Addon_Manager::PREMIUM_SLUG )
			->andReturn( $is_active );
		$this->addon_manager->expects( 'has_valid_subscription' )
			->once()
			->with( WPSEO_Addon_Manager::PREMIUM_SLUG )
			->andReturn( $has_license );
		$this->addon_manager->expects( 'is_installed' )
			->once()
			->with( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG )
			->andReturn( $is_active );
		$this->addon_manager->expects( 'has_valid_subscription' )
			->once()
			->with( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG )
			->andReturn( $has_license );
		$expected = [
			$this->premium->get_id() => [
				'id'          => $this->premium->get_id(),
				'isActive'    => $is_active,
				'hasLicense'  => $has_license,
				'ctb'         => [
					'action' => $this->premium->get_ctb_action(),
					'id'     => $this->premium->get_ctb_id(),
				],
			],
			$this->woo->get_id() => [
				'id'          => $this->woo->get_id(),
				'isActive'    => $is_active,
				'hasLicense'  => $has_license,
				'ctb'         => [
					'action' => $this->woo->get_ctb_action(),
					'id'     => $this->woo->get_ctb_id(),
				],
			],
		];

		$this->assertSame( $expected, $this->instance->to_array() );
	}

	/**
	 * Tests to_array.
	 *
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_to_array_without_active_addons() {
		$this->addon_manager->expects( 'has_active_addons' )
			->once()
			->andReturn( false );

		$this->addon_manager->expects( 'is_installed' )
			->once()
			->with( WPSEO_Addon_Manager::PREMIUM_SLUG )
			->andReturn( false );

		$this->addon_manager->expects( 'is_installed' )
			->once()
			->with( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG )
			->andReturn( false );

		$expected = [
			$this->premium->get_id() => [
				'id'         => $this->premium->get_id(),
				'isActive'   => false,
				'hasLicense' => false,
				'ctb'        => [
					'action' => $this->premium->get_ctb_action(),
					'id'     => $this->premium->get_ctb_id(),
				],
			],
			$this->woo->get_id() => [
				'id'         => $this->woo->get_id(),
				'isActive'   => false,
				'hasLicense' => false,
				'ctb'        => [
					'action' => $this->woo->get_ctb_action(),
					'id'     => $this->woo->get_ctb_id(),
				],
			],
		];

		$this->assertSame( $expected, $this->instance->to_array() );
	}
}

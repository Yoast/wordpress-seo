<?php

namespace Yoast\WP\SEO\Tests\Unit\Plans\Application;

use Mockery;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Plans\Application\Add_Ons_Collector;
use Yoast\WP\SEO\Plans\Domain\Add_Ons\DuplicatePost;
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
	 * Holds the Yoast Duplicate Post add-on.
	 *
	 * @var DuplicatePost
	 */
	private $duplicatePost;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->addon_manager = Mockery::mock( WPSEO_Addon_Manager::class );

		$this->premium       = new Premium( $this->addon_manager );
		$this->woo           = new Woo( $this->addon_manager );
		$this->duplicatePost = new DuplicatePost( $this->addon_manager );

		$this->instance = new Add_Ons_Collector( $this->premium, $this->woo, $this->duplicatePost );
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
				$this->duplicatePost,
			],
			$this->instance->get()
		);
	}

	/**
	 * Tests to_array.
	 *
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_to_array() {
		$this->addon_manager->expects( 'is_installed' )
			->twice()
			->with( WPSEO_Addon_Manager::PREMIUM_SLUG )
			->andReturn( true, false );
		$this->addon_manager->expects( 'has_valid_subscription' )
			->twice()
			->with( WPSEO_Addon_Manager::PREMIUM_SLUG )
			->andReturn( true, false );

		$this->addon_manager->expects( 'is_installed' )
			->twice()
			->with( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG )
			->andReturn( true, false );
		$this->addon_manager->expects( 'has_valid_subscription' )
			->twice()
			->with( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG )
			->andReturn( true, false );

		$this->addon_manager->expects( 'is_installed' )
			->twice()
			->with( WPSEO_Addon_Manager::DUPLICATE_POST_SLUG )
			->andReturn( true, false );

		$this->addon_manager->expects( 'has_valid_subscription' )
			->twice()
			->with( WPSEO_Addon_Manager::DUPLICATE_POST_SLUG )
			->andReturn( false, false );

		$expected = [
			$this->premium->get_id() => [
				'id'         => $this->premium->get_id(),
				'isActive'   => true,
				'hasLicense' => true,
				'ctb'        => [
					'action' => $this->premium->get_ctb_action(),
					'id'     => $this->premium->get_ctb_id(),
				],
			],
			$this->woo->get_id()     => [
				'id'         => $this->woo->get_id(),
				'isActive'   => true,
				'hasLicense' => true,
				'ctb'        => [
					'action' => $this->woo->get_ctb_action(),
					'id'     => $this->woo->get_ctb_id(),
				],
			],
			$this->duplicatePost->get_id()     => [
				'id'         => $this->duplicatePost->get_id(),
				'isActive'   => true,
				'hasLicense' => false,
				'ctb'        => [
					'action' => $this->duplicatePost->get_ctb_action(),
					'id'     => $this->duplicatePost->get_ctb_id(),
				],
			],
		];

		$this->assertSame( $expected, $this->instance->to_array() );

		$expected[ $this->premium->get_id() ]['isActive']         = false;
		$expected[ $this->premium->get_id() ]['hasLicense']       = false;
		$expected[ $this->woo->get_id() ]['isActive']             = false;
		$expected[ $this->woo->get_id() ]['hasLicense']           = false;
		$expected[ $this->duplicatePost->get_id() ]['isActive']   = false;
		$expected[ $this->duplicatePost->get_id() ]['hasLicense'] = false;

		$this->assertSame( $expected, $this->instance->to_array() );
	}
}

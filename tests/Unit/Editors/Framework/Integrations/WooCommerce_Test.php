<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework\Integrations;

use Mockery;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Editors\Framework\Integrations\WooCommerce;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class WooCommerce_Test
 *
 * @group editors
 *
 * @covers \Yoast\WP\SEO\Editors\Framework\Integrations\WooCommerce
 */
final class WooCommerce_Test extends TestCase {

	/**
	 * Holds the WooCommerce conditional mock.
	 *
	 * @var Mockery\MockInterface|WooCommerce_Conditional
	 */
	protected $woocommerce_conditional;

	/**
	 * The WooCommerce feature.
	 *
	 * @var WooCommerce
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->woocommerce_conditional = Mockery::mock( WooCommerce_Conditional::class );
		$this->instance                = new WooCommerce( $this->woocommerce_conditional );
	}

	/**
	 * Tests the is_enabled method.
	 *
	 * @dataProvider data_provider_is_enabled
	 *
	 * @param bool $woocommerce_enabled If the woocommerce plugin is enabled.
	 * @param bool $expected            The expected outcome.
	 *
	 * @return void
	 */
	public function test_is_enabled(
		bool $woocommerce_enabled,
		bool $expected
	) {

		$this->woocommerce_conditional
			->expects( 'is_met' )
			->times( 3 )
			->andReturn( $woocommerce_enabled );

		$this->assertSame( $expected, $this->instance->is_enabled() );
		$this->assertSame( [ 'isWooCommerceActive' => $this->instance->is_enabled() ], $this->instance->to_legacy_array() );
	}

	/**
	 * Tests the to_array method.
	 *
	 * @dataProvider data_provider_is_enabled
	 *
	 * @param bool $woocommerce_enabled If the woocommerce plugin is enabled.
	 * @param bool $expected            The expected outcome.
	 *
	 * @return void
	 */
	public function test_to_array(
		bool $woocommerce_enabled,
		bool $expected
	) {

		$this->woocommerce_conditional
			->expects( 'is_met' )
			->times( 3 )
			->andReturn( $woocommerce_enabled );

		$this->assertSame( $expected, $this->instance->is_enabled() );
		$this->assertSame( [ 'isWooCommerceActive' => $this->instance->is_enabled() ], $this->instance->to_array() );
	}

	/**
	 * Data provider for test_is_enabled.
	 *
	 * @return array<array<string|bool>>
	 */
	public static function data_provider_is_enabled() {
		return [
			'Enabled' => [
				'woocommerce_enabled' => true,
				'expected'            => true,
			],
			'Disabled' => [
				'woocommerce_enabled' => false,
				'expected'            => false,
			],
		];
	}
}

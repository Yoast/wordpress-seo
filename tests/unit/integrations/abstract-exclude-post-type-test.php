<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Integrations\Abstract_Exclude_Post_Type;
use Yoast\WP\SEO\Integrations\Exclude_Oembed_Cache_Post_Type;
use Yoast\WP\SEO\Integrations\Third_Party\Exclude_Elementor_Post_Types;
use Yoast\WP\SEO\Integrations\Third_Party\Exclude_WooCommerce_Post_Types;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Abstract_Exclude_Post_Type_Test.
 *
 * @group integrations
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Abstract_Exclude_Post_Type
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Abstract_Exclude_Post_Type_Test extends TestCase {

	/**
	 * The child instance of Elementor exclusion under test.
	 *
	 * @var Exclude_Elementor_Post_Types
	 */
	protected $elementor_exclusion_instance;

	/**
	 * The child instance of WooCommerce exclusion under test.
	 *
	 * @var Exclude_WooCommerce_Post_Types
	 */
	protected $woocommerce_exclusion_instance;

	/**
	 * The child instance of Oembed Cache exclusion under test.
	 *
	 * @var Exclude_Oembed_Cache_Post_Type
	 */
	protected $oembed_exclusion_instance;

	/**
	 * Sets up the child classes under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();

		$this->elementor_exclusion_instance   = new Exclude_Elementor_Post_Types();
		$this->woocommerce_exclusion_instance = new Exclude_WooCommerce_Post_Types();
		$this->oembed_exclusion_instance      = new Exclude_Oembed_Cache_Post_Type();
	}

	/**
	 * Tests that the right hooks are being registered
	 * for the integrations to work.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Filters\expectAdded( 'wpseo_indexable_excluded_post_types' )
			->once()
			->with( [ $this->elementor_exclusion_instance, 'exclude_post_types' ] );

		$this->elementor_exclusion_instance->register_hooks();

		Monkey\Filters\expectAdded( 'wpseo_indexable_excluded_post_types' )
			->once()
			->with( [ $this->woocommerce_exclusion_instance, 'exclude_post_types' ] );

		$this->woocommerce_exclusion_instance->register_hooks();

		Monkey\Filters\expectAdded( 'wpseo_indexable_excluded_post_types' )
			->once()
			->with( [ $this->oembed_exclusion_instance, 'exclude_post_types' ] );

		$this->oembed_exclusion_instance->register_hooks();
	}

	/**
	 * Tests the abstract method to get conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [], Abstract_Exclude_Post_Type::get_conditionals() );
	}

	/**
	 * Tests the addition to exclusions.
	 *
	 * @covers ::exclude_post_types
	 */
	public function test_exclude_post_types() {
		$instance = Mockery::mock( Abstract_Exclude_Post_Type::class )->makePartial();
		$instance
			->expects( 'get_post_type' )
			->once()
			->andReturn( [ 'the value to add to exclusions' ] );

		$result = $instance->exclude_post_types( [] );

		$this->assertSame( [ 'the value to add to exclusions' ], $result );
	}
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Schema\Application\Configuration;

use Brain\Monkey;
use Mockery;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Conditionals\Schema_Disabled_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Woocommerce_Helper;
use Yoast\WP\SEO\Schema\Application\Configuration\Schema_Configuration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Schema_Configuration class.
 *
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Schema\Application\Configuration\Schema_Configuration
 */
final class Schema_Configuration_Test extends TestCase {

	/**
	 * The conditional that is met when Schema output is turned off in the settings.
	 *
	 * @var Mockery\MockInterface|Schema_Disabled_Conditional
	 */
	private $schema_disabled_conditional;

	/**
	 * The instance under test.
	 *
	 * @var Schema_Configuration
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->schema_disabled_conditional = Mockery::mock( Schema_Disabled_Conditional::class );
		$this->instance                    = new Schema_Configuration(
			Mockery::mock( Woocommerce_Helper::class ),
			Mockery::mock( Product_Helper::class ),
			Mockery::mock( WPSEO_Addon_Manager::class ),
			Mockery::mock( Options_Helper::class ),
			$this->schema_disabled_conditional,
		);
	}

	/**
	 * Tests that Schema output counts as turned off when it is turned off in the settings or by the
	 * `wpseo_json_ld_output` filter.
	 *
	 * @dataProvider provider_is_schema_output_disabled
	 *
	 * @covers ::__construct
	 * @covers ::is_schema_output_disabled
	 * @covers ::is_schema_disabled_programmatically
	 *
	 * @param bool                       $disabled_in_settings Whether Schema output is turned off in the settings.
	 * @param array<string, string>|bool $filtered             The value the `wpseo_json_ld_output` filter returns.
	 * @param bool                       $expected             Whether Schema output is expected to count as turned off.
	 *
	 * @return void
	 */
	public function test_is_schema_output_disabled( $disabled_in_settings, $filtered, $expected ) {
		$this->schema_disabled_conditional->expects( 'is_met' )->once()->andReturn( $disabled_in_settings );

		Monkey\Filters\expectApplied( 'wpseo_json_ld_output' )
			->times( ( $disabled_in_settings ) ? 0 : 1 )
			->andReturn( $filtered );

		$this->assertSame( $expected, $this->instance->is_schema_output_disabled() );
	}

	/**
	 * Data provider for test_is_schema_output_disabled.
	 *
	 * @return array<string, array<string, array<string, string>|bool>>
	 */
	public static function provider_is_schema_output_disabled() {
		$untouched = [ '_deprecated' => 'Please use the "wpseo_schema_*" filters to extend the Yoast SEO schema data - see the WPSEO_Schema class.' ];

		return [
			'turned on' => [
				'disabled_in_settings' => false,
				'filtered'             => $untouched,
				'expected'             => false,
			],
			'turned off in the settings' => [
				'disabled_in_settings' => true,
				'filtered'             => $untouched,
				'expected'             => true,
			],
			'turned off by the filter' => [
				'disabled_in_settings' => false,
				'filtered'             => false,
				'expected'             => true,
			],
			'emptied by the filter' => [
				'disabled_in_settings' => false,
				'filtered'             => [],
				'expected'             => true,
			],
		];
	}
}

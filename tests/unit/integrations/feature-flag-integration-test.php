<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Feature_Flag_Conditional;
use Yoast\WP\SEO\Conditionals\Schema_Blocks_Conditional;
use Yoast\WP\SEO\Integrations\Feature_Flag_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Feature_Flag_Integration_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Feature_Flag_Integration
 *
 * @group integrations
 */
class Feature_Flag_Integration_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Feature_Flag_Integration
	 */
	protected $instance;

	/**
	 * The mocked asset manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * The mocked feature flag conditionals.
	 *
	 * @var Mockery\MockInterface[]|Feature_Flag_Conditional[]
	 */
	protected $feature_flag_conditionals;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();

		$this->asset_manager             = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->feature_flag_conditionals = [
			Mockery::mock( Feature_Flag_Conditional::class ),
		];

		$this->instance = new Feature_Flag_Integration( $this->asset_manager, ...$this->feature_flag_conditionals );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		self::assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			self::getPropertyValue( $this->instance, 'asset_manager' )
		);
		self::assertIsArray(
			self::getPropertyValue( $this->instance, 'feature_flags' )
		);
		self::assertInstanceOf(
			Feature_Flag_Conditional::class,
			self::getPropertyValue( $this->instance, 'feature_flags' )[0]
		);
	}

	/**
	 * Tests whether the integration is loaded when the right conditionals are met.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		self::assertEquals( [ Admin_Conditional::class ], Feature_Flag_Integration::get_conditionals() );
	}

	/**
	 * Tests the registration of the appropriate hooks needed for the integration to work.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		self::assertNotFalse( \has_action( 'admin_init', [ $this->instance, 'add_feature_flags' ] ), 'Does not have expected admin_init action' );
	}

	/**
	 * Tests the 'happy path' of the add_feature_flags method.
	 *
	 * @covers ::add_feature_flags
	 * @covers ::get_enabled_features
	 * @covers ::filter_enabled_features
	 */
	public function test_add_feature_flags() {
		$expected_enabled_feature_flags = [ 'SCHEMA_BLOCKS' ];

		$this->asset_manager
			->expects( 'localize_script' )
			->with( 'feature-flag-package', 'wpseoFeaturesL10n', $expected_enabled_feature_flags );
		$this->asset_manager
			->expects( 'localize_script' )
			->with( 'feature-flag-package', 'wpseoFeatureFlags', $expected_enabled_feature_flags );

		// Mock a feature flag, in this case the Schema_Blocks_Conditional, to be set.
		$schema_blocks_conditional = Mockery::mock( Schema_Blocks_Conditional::class );

		$schema_blocks_conditional
			->expects( 'get_feature_name' )
			->andReturn( 'SCHEMA_BLOCKS' );

		$schema_blocks_conditional
			->expects( 'is_met' )
			->andReturn( true );

		// We expect the filter to be called.
		Monkey\Filters\expectApplied( 'wpseo_enable_feature' )
			->with( $expected_enabled_feature_flags )
			->andReturn( $expected_enabled_feature_flags );

		$this->instance = new Feature_Flag_Integration( $this->asset_manager, $schema_blocks_conditional );

		$this->instance->add_feature_flags();
	}

	/**
	 * Tests the add_feature_flags method when a feature flag is not met.
	 *
	 * @covers ::add_feature_flags
	 * @covers ::get_enabled_features
	 * @covers ::filter_enabled_features
	 */
	public function test_add_feature_flags_not_met() {
		$expected_enabled_feature_flags = [ 'FEATURE_1' ];

		$this->asset_manager
			->expects( 'localize_script' )
			->with( 'feature-flag-package', 'wpseoFeaturesL10n', $expected_enabled_feature_flags );
		$this->asset_manager
			->expects( 'localize_script' )
			->with( 'feature-flag-package', 'wpseoFeatureFlags', $expected_enabled_feature_flags );

		// Mock a feature flag to be set.
		$feature_flag_1 = Mockery::mock( Feature_Flag_Conditional::class );

		$feature_flag_1
			->expects( 'get_feature_name' )
			->andReturn( 'FEATURE_1' );

		$feature_flag_1
			->expects( 'is_met' )
			->andReturn( true );

		// Mock a feature flag to NOT be set.
		$feature_flag_2 = Mockery::mock( Feature_Flag_Conditional::class );

		$feature_flag_2
			->expects( 'is_met' )
			->andReturn( false );

		// We expect the filter to be called.
		Monkey\Filters\expectApplied( 'wpseo_enable_feature' )
			->with( $expected_enabled_feature_flags )
			->andReturn( $expected_enabled_feature_flags );

		$this->instance = new Feature_Flag_Integration( $this->asset_manager, $feature_flag_1, $feature_flag_2 );

		$this->instance->add_feature_flags();
	}

	/**
	 * Tests the filter to enable/disable feature flags.
	 *
	 * @covers ::add_feature_flags
	 * @covers ::get_enabled_features
	 * @covers ::filter_enabled_features
	 */
	public function test_add_feature_flags_filter() {
		$currently_enabled_feature_flags = [ 'FEATURE_1' ];
		$expected_enabled_feature_flags  = [ 'FEATURE_1', 'FEATURE_2' ];

		$this->asset_manager
			->expects( 'localize_script' )
			->with( 'feature-flag-package', 'wpseoFeaturesL10n', $expected_enabled_feature_flags );
		$this->asset_manager
			->expects( 'localize_script' )
			->with( 'feature-flag-package', 'wpseoFeatureFlags', $expected_enabled_feature_flags );

		// Mock a feature flag to be set.
		$feature_flag_1 = Mockery::mock( Feature_Flag_Conditional::class );

		$feature_flag_1
			->expects( 'get_feature_name' )
			->andReturn( 'FEATURE_1' );

		$feature_flag_1
			->expects( 'is_met' )
			->andReturn( true );

		// Mock a feature flag to NOT be set.
		$feature_flag_2 = Mockery::mock( Feature_Flag_Conditional::class );

		$feature_flag_2
			->expects( 'is_met' )
			->andReturn( false );

		// We expect the filter to be called.
		Monkey\Filters\expectApplied( 'wpseo_enable_feature' )
			->with( $currently_enabled_feature_flags )
			->andReturn( $expected_enabled_feature_flags );

		$this->instance = new Feature_Flag_Integration( $this->asset_manager, $feature_flag_1, $feature_flag_2 );

		$this->instance->add_feature_flags();
	}

	/**
	 * Tests the filter that enables/disables feature flags when a feature flag
	 * is removed.
	 *
	 * @covers ::add_feature_flags
	 * @covers ::get_enabled_features
	 * @covers ::filter_enabled_features
	 */
	public function test_add_feature_flags_filter_removes_flags() {
		$currently_enabled_feature_flags = [ 'FEATURE_1' ];
		$expected_enabled_feature_flags  = [];

		$this->asset_manager
			->expects( 'localize_script' )
			->with( 'feature-flag-package', 'wpseoFeaturesL10n', $expected_enabled_feature_flags );
		$this->asset_manager
			->expects( 'localize_script' )
			->with( 'feature-flag-package', 'wpseoFeatureFlags', $expected_enabled_feature_flags );

		// Mock a feature flag to be set.
		$feature_flag_1 = Mockery::mock( Feature_Flag_Conditional::class );

		$feature_flag_1
			->expects( 'get_feature_name' )
			->andReturn( 'FEATURE_1' );

		$feature_flag_1
			->expects( 'is_met' )
			->andReturn( true );

		// Mock a feature flag to NOT be set.
		$feature_flag_2 = Mockery::mock( Feature_Flag_Conditional::class );

		$feature_flag_2
			->expects( 'is_met' )
			->andReturn( false );

		// We expect the filter to be called.
		Monkey\Filters\expectApplied( 'wpseo_enable_feature' )
			->with( $currently_enabled_feature_flags )
			->andReturn( $expected_enabled_feature_flags );

		$this->instance = new Feature_Flag_Integration( $this->asset_manager, $feature_flag_1, $feature_flag_2 );

		$this->instance->add_feature_flags();
	}

	/**
	 * Tests the filter that enables/disables feature flags when a feature flag
	 * is removed.
	 *
	 * @covers ::add_feature_flags
	 * @covers ::get_enabled_features
	 * @covers ::filter_enabled_features
	 */
	public function test_add_feature_flags_filter_invalid_array() {
		$currently_enabled_feature_flags = [ 'FEATURE_1' ];
		$invalid_filter_return           = 'FEATURE_2';
		$expected_enabled_feature_flags  = [ 'FEATURE_1' ];

		$this->asset_manager
			->expects( 'localize_script' )
			->with( 'feature-flag-package', 'wpseoFeaturesL10n', $expected_enabled_feature_flags );
		$this->asset_manager
			->expects( 'localize_script' )
			->with( 'feature-flag-package', 'wpseoFeatureFlags', $expected_enabled_feature_flags );

		// Mock a feature flag to be set.
		$feature_flag_1 = Mockery::mock( Feature_Flag_Conditional::class );

		$feature_flag_1
			->expects( 'get_feature_name' )
			->andReturn( 'FEATURE_1' );

		$feature_flag_1
			->expects( 'is_met' )
			->andReturn( true );

		// Mock a feature flag to NOT be set.
		$feature_flag_2 = Mockery::mock( Feature_Flag_Conditional::class );

		$feature_flag_2
			->expects( 'is_met' )
			->andReturn( false );

		// We expect the filter to be called.
		Monkey\Filters\expectApplied( 'wpseo_enable_feature' )
			->with( $currently_enabled_feature_flags )
			->andReturn( $invalid_filter_return );

		$this->instance = new Feature_Flag_Integration( $this->asset_manager, $feature_flag_1, $feature_flag_2 );

		$this->instance->add_feature_flags();
	}

	/**
	 * Tests the add_feature_flags method when no feature flags are available.
	 *
	 * @covers ::add_feature_flags
	 * @covers ::get_enabled_features
	 * @covers ::filter_enabled_features
	 */
	public function test_add_feature_flags_non_available() {
		$expected_enabled_feature_flags = [];

		$this->asset_manager
			->expects( 'localize_script' )
			->with( 'feature-flag-package', 'wpseoFeaturesL10n', $expected_enabled_feature_flags );
		$this->asset_manager
			->expects( 'localize_script' )
			->with( 'feature-flag-package', 'wpseoFeatureFlags', $expected_enabled_feature_flags );

		// We expect the filter to be called.
		Monkey\Filters\expectApplied( 'wpseo_enable_feature' )
			->with( $expected_enabled_feature_flags )
			->andReturn( $expected_enabled_feature_flags );

		$this->instance = new Feature_Flag_Integration( $this->asset_manager );

		$this->instance->add_feature_flags();
	}
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Feature_Status_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Features\Schema_Framework_Feature;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Set_Schema_Framework_Status_Ability;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Set_Schema_Framework_Status_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Set_Schema_Framework_Status_Ability
 */
final class Set_Schema_Framework_Status_Ability_Test extends TestCase {

	/**
	 * The capability helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The feature status updater mock.
	 *
	 * @var Mockery\MockInterface|Feature_Status_Updater
	 */
	private $feature_status_updater;

	/**
	 * The Schema Framework feature mock.
	 *
	 * @var Mockery\MockInterface|Schema_Framework_Feature
	 */
	private $schema_framework_feature;

	/**
	 * The instance under test.
	 *
	 * @var Set_Schema_Framework_Status_Ability
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->capability_helper        = Mockery::mock( Capability_Helper::class );
		$this->feature_status_updater   = Mockery::mock( Feature_Status_Updater::class );
		$this->schema_framework_feature = Mockery::mock( Schema_Framework_Feature::class );

		$this->instance = new Set_Schema_Framework_Status_Ability(
			$this->capability_helper,
			$this->feature_status_updater,
			$this->schema_framework_feature,
		);
	}

	/**
	 * Data provider for the boolean outcome tests.
	 *
	 * @return array<string, array<bool>> The outcomes.
	 */
	public static function provide_boolean_outcomes(): array {
		return [
			'true'  => [ true ],
			'false' => [ false ],
		];
	}

	/**
	 * Tests that get_name returns the prefixed ability name.
	 *
	 * @covers ::get_slug
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::get_name
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'yoast-seo/set-schema-framework-status', $this->instance->get_name() );
	}

	/**
	 * Tests that is_available always returns true, as the feature has no network-level restriction.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::is_available
	 *
	 * @return void
	 */
	public function test_is_available() {
		$this->assertTrue( $this->instance->is_available() );
	}

	/**
	 * Tests that can_manage_seo checks the management capability and returns its result.
	 *
	 * @covers ::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Option_Status_Ability::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::can_manage_seo
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $allowed Whether the capability is granted.
	 *
	 * @return void
	 */
	public function test_can_manage_seo( bool $allowed ) {
		$this->capability_helper
			->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( $allowed );

		$this->assertSame( $allowed, $this->instance->can_manage_seo() );
	}

	/**
	 * Expects the Schema Framework option to be written once with the given input.
	 *
	 * @param bool                         $enabled The requested status.
	 * @param array<string, bool>|WP_Error $result  What the feature status updater returns.
	 *
	 * @return void
	 */
	private function expect_status_write( bool $enabled, $result ): void {
		$this->feature_status_updater
			->expects( 'set_status' )
			->once()
			->with( 'enable_schema', [ 'enabled' => $enabled ] )
			->andReturn( $result );
	}

	/**
	 * Tests that execute returns the enabled status without a warning when no code turns the graph off.
	 *
	 * @covers ::execute
	 * @covers ::get_option_name
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Option_Status_Ability::execute
	 *
	 * @return void
	 */
	public function test_execute_enable() {
		$this->expect_status_write( true, [ 'enabled' => true ] );
		$this->schema_framework_feature
			->expects( 'is_disabled_programmatically' )
			->once()
			->andReturnFalse();

		$this->assertSame( [ 'enabled' => true ], $this->instance->execute( [ 'enabled' => true ] ) );
	}

	/**
	 * Tests that execute returns the enabled status with a warning when code turns the graph off.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute_enable_when_disabled_programmatically() {
		$this->expect_status_write( true, [ 'enabled' => true ] );
		$this->schema_framework_feature
			->expects( 'is_disabled_programmatically' )
			->once()
			->andReturnTrue();

		$this->assertSame(
			[
				'enabled' => true,
				'warning' => 'The Schema Framework feature is enabled, but code on the site, like a filter, turns the structured data graph off, so the graph is not output until that code is removed.',
			],
			$this->instance->execute( [ 'enabled' => true ] ),
		);
	}

	/**
	 * Tests that execute returns the disabled status without checking whether code turns the graph off, as the
	 * warning is only relevant while the feature is enabled.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute_disable() {
		$this->expect_status_write( false, [ 'enabled' => false ] );
		$this->schema_framework_feature->expects( 'is_disabled_programmatically' )->never();

		$this->assertSame( [ 'enabled' => false ], $this->instance->execute( [ 'enabled' => false ] ) );
	}

	/**
	 * Tests that execute passes an error from the feature status updater through without checking whether code
	 * turns the graph off.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute_passes_errors_through() {
		$error = Mockery::mock( WP_Error::class );

		$this->expect_status_write( true, $error );
		$this->schema_framework_feature->expects( 'is_disabled_programmatically' )->never();

		$this->assertSame( $error, $this->instance->execute( [ 'enabled' => true ] ) );
	}

	/**
	 * Tests that get_args returns the expected registration arguments.
	 *
	 * @covers ::get_feature_name
	 * @covers ::get_label
	 * @covers ::get_description
	 * @covers ::get_additional_output_properties
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::get_args
	 *
	 * @return void
	 */
	public function test_get_args() {
		$this->assertSame(
			[
				'label'               => 'Set Schema Framework Status',
				'description'         => 'Enable or disable Yoast SEO\'s Schema Framework feature. Enabling it outputs a single structured data graph (JSON-LD) on the site\'s pages, so search engines and language models can consistently read every person, product, organization, and piece of content; disabling it stops outputting the graph. If code on the site, like a filter, turns the graph off, enabling it has no effect until that code is removed.',
				'category'            => 'yoast-seo',
				'input_schema'        => [
					'type'                 => 'object',
					'additionalProperties' => false,
					'required'             => [ 'enabled' ],
					'properties'           => [
						'enabled' => [
							'type'        => 'boolean',
							'description' => 'Whether Yoast SEO\'s Schema Framework feature should be enabled. true enables it; false disables it.',
						],
					],
				],
				'output_schema'       => [
					'type'       => 'object',
					'properties' => [
						'enabled' => [
							'type'        => 'boolean',
							'description' => 'Whether Yoast SEO\'s Schema Framework feature is enabled.',
						],
						'warning' => [
							'type'        => 'string',
							'description' => 'Only present when the feature is enabled but code on the site turns the structured data graph off. Meant to be relayed to the user.',
						],
					],
				],
				'permission_callback' => [ $this->instance, 'can_manage_seo' ],
				'execute_callback'    => [ $this->instance, 'execute' ],
				'meta'                => [
					'show_in_rest' => true,
					'annotations'  => [
						'readonly'    => false,
						'destructive' => null,
						'idempotent'  => true,
					],
					'mcp'          => [
						'public' => true,
					],
				],
			],
			$this->instance->get_args(),
		);
	}
}

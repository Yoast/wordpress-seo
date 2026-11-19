<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use Yoast\WP\SEO\Abilities\Application\Feature_Status_Updater;
use Yoast\WP\SEO\Abilities\Domain\Feature_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Features\Feature_Repository;
use Yoast\WP\SEO\Abilities\Infrastructure\Features\Open_Graph_Feature;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Set_Open_Graph_Status_Ability;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Set_Open_Graph_Status_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Set_Open_Graph_Status_Ability
 */
final class Set_Open_Graph_Status_Ability_Test extends TestCase {

	/**
	 * The capability helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The feature repository mock.
	 *
	 * @var Mockery\MockInterface|Feature_Repository
	 */
	private $feature_repository;

	/**
	 * The feature status updater mock.
	 *
	 * @var Mockery\MockInterface|Feature_Status_Updater
	 */
	private $feature_status_updater;

	/**
	 * The instance under test.
	 *
	 * @var Set_Open_Graph_Status_Ability
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

		$this->capability_helper      = Mockery::mock( Capability_Helper::class );
		$this->feature_repository     = Mockery::mock( Feature_Repository::class );
		$this->feature_status_updater = Mockery::mock( Feature_Status_Updater::class );

		$this->instance = new Set_Open_Graph_Status_Ability(
			$this->capability_helper,
			$this->feature_repository,
			$this->feature_status_updater,
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
		$this->assertSame( 'yoast-seo/set-open-graph-status', $this->instance->get_name() );
	}

	/**
	 * Tests that is_available follows whether the feature can be changed on the site.
	 *
	 * @covers ::get_feature_key
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::get_feature
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::is_available
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $available Whether the feature can be changed on the site.
	 *
	 * @return void
	 */
	public function test_is_available( bool $available ) {
		$this->feature_repository
			->expects( 'get' )
			->once()
			->with( Open_Graph_Feature::KEY )
			->andReturn( Mockery::mock( Feature_Interface::class, [ 'is_available' => $available ] ) );

		$this->assertSame( $available, $this->instance->is_available() );
	}

	/**
	 * Tests that is_available returns false when the feature is not registered, instead of failing.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::get_feature
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::is_available
	 *
	 * @return void
	 */
	public function test_is_available_without_registered_feature() {
		$this->feature_repository
			->expects( 'get' )
			->once()
			->with( Open_Graph_Feature::KEY )
			->andReturnNull();

		$this->assertFalse( $this->instance->is_available() );
	}

	/**
	 * Tests that can_manage_seo checks the management capability and returns its result.
	 *
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
	 * Tests that execute delegates to the updater with the Open Graph data option and returns its result.
	 *
	 * @covers ::get_feature_key
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::get_feature
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Option_Status_Ability::execute
	 *
	 * @return void
	 */
	public function test_execute() {
		$this->feature_repository
			->expects( 'get' )
			->once()
			->with( Open_Graph_Feature::KEY )
			->andReturn(
				Mockery::mock(
					Feature_Interface::class,
					[
						'get_key'         => 'open_graph',
						'get_option_name' => 'opengraph',
						'get_name'        => 'Open Graph data',
					],
				),
			);

		$this->feature_status_updater
			->expects( 'set_status' )
			->once()
			->with( 'opengraph', [ 'enabled' => true ] )
			->andReturn( [ 'enabled' => true ] );

		$this->assertSame( [ 'enabled' => true ], $this->instance->execute( [ 'enabled' => true ] ) );
	}

	/**
	 * Tests that get_args returns the expected registration arguments.
	 *
	 * @covers ::get_feature_key
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::get_feature
	 * @covers ::get_label
	 * @covers ::get_description
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::get_args
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::get_additional_output_properties
	 *
	 * @return void
	 */
	public function test_get_args() {
		$this->feature_repository
			->expects( 'get' )
			->once()
			->with( Open_Graph_Feature::KEY )
			->andReturn(
				Mockery::mock(
					Feature_Interface::class,
					[
						'get_key'         => 'open_graph',
						'get_option_name' => 'opengraph',
						'get_name'        => 'Open Graph data',
					],
				),
			);

		$this->assertSame(
			[
				'label'               => 'Set Open Graph Data Status',
				'description'         => 'Enable or disable Yoast SEO\'s Open Graph data feature. Enabling it outputs Open Graph meta tags on the site\'s pages, so Facebook and other social media can display a preview with an image and a text excerpt when a link to the site is shared; disabling it stops outputting the tags.',
				'category'            => 'yoast-seo',
				'input_schema'        => [
					'type'                 => 'object',
					'additionalProperties' => false,
					'required'             => [ 'enabled' ],
					'properties'           => [
						'enabled' => [
							'type'        => 'boolean',
							'description' => 'Whether Yoast SEO\'s Open Graph data feature should be enabled. true enables it; false disables it.',
						],
					],
				],
				'output_schema'       => [
					'type'       => 'object',
					'properties' => [
						'enabled' => [
							'type'        => 'boolean',
							'description' => 'Whether Yoast SEO\'s Open Graph data feature is enabled.',
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

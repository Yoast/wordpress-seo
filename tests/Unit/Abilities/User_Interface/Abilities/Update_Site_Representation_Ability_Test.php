<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use Yoast\WP\SEO\Abilities\Application\Site_Representation_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Update_Site_Representation_Ability;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Update_Site_Representation_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Update_Site_Representation_Ability
 */
final class Update_Site_Representation_Ability_Test extends TestCase {

	/**
	 * The capability helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The site representation field map mock.
	 *
	 * @var Mockery\MockInterface|Site_Representation_Field_Map
	 */
	private $field_map;

	/**
	 * The site representation updater mock.
	 *
	 * @var Mockery\MockInterface|Site_Representation_Updater
	 */
	private $site_representation_updater;

	/**
	 * The instance under test.
	 *
	 * @var Update_Site_Representation_Ability
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

		$this->capability_helper           = Mockery::mock( Capability_Helper::class );
		$this->field_map                   = Mockery::mock( Site_Representation_Field_Map::class );
		$this->site_representation_updater = Mockery::mock( Site_Representation_Updater::class );

		$this->instance = new Update_Site_Representation_Ability(
			$this->capability_helper,
			$this->field_map,
			$this->site_representation_updater,
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
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'yoast-seo/update-site-representation', $this->instance->get_name() );
	}

	/**
	 * Tests that the ability is always available.
	 *
	 * @covers ::is_available
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
	 * @covers ::can_manage_seo
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $can Whether the current user can manage Yoast SEO.
	 *
	 * @return void
	 */
	public function test_can_manage_seo( bool $can ) {
		$this->capability_helper
			->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( $can );

		$this->assertSame( $can, $this->instance->can_manage_seo() );
	}

	/**
	 * Tests that execute delegates to the updater and returns its result.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute() {
		$input  = [ 'company_name' => 'Yoast' ];
		$result = [ 'company_name' => 'Yoast' ];

		$this->site_representation_updater
			->expects( 'update' )
			->once()
			->with( $input )
			->andReturn( $result );

		$this->assertSame( $result, $this->instance->execute( $input ) );
	}

	/**
	 * Tests that get_args builds the input schema from the field map and reduces it to the output schema,
	 * which also describes the warning.
	 *
	 * @covers ::get_args
	 * @covers ::to_output_schema
	 *
	 * @return void
	 */
	public function test_get_args() {
		$this->field_map->expects( 'get_fields' )->once()->andReturn(
			[
				'company_or_person' => [
					'type'        => 'string',
					'enum'        => [ 'company', 'person' ],
					'description' => 'Organization or person.',
				],
				'company_logo_id'   => [
					'type'        => 'integer',
					'minimum'     => 0,
					'description' => 'The logo ID.',
				],
			],
		);

		$this->assertSame(
			[
				'label'               => 'Update Site Representation',
				'description'         => 'Update Yoast SEO\'s site representation settings, which tell search engines whether the site represents an organization or a person, and provide its name, logo, social profiles and, depending on the active add-ons, other details for the site\'s organization schema. Only the settings you provide are changed; a provided empty value (an empty string, 0 or an empty array) clears that setting, and a provided list replaces the current one. These settings are public facts about who owns the site: only use values the user provided or that come from the site itself, never guessed or found elsewhere, and confirm them with the user before saving.',
				'category'            => 'yoast-seo',
				'input_schema'        => [
					'type'                 => 'object',
					'additionalProperties' => false,
					'minProperties'        => 1,
					'properties'           => [
						'company_or_person' => [
							'type'        => 'string',
							'enum'        => [ 'company', 'person' ],
							'description' => 'Organization or person.',
						],
						'company_logo_id'   => [
							'type'        => 'integer',
							'minimum'     => 0,
							'description' => 'The logo ID.',
						],
					],
				],
				'output_schema'       => [
					'type'       => 'object',
					'properties' => [
						'company_or_person' => [
							'type'        => 'string',
							'description' => 'Organization or person.',
						],
						'company_logo_id'   => [
							'type'        => 'integer',
							'description' => 'The logo ID.',
						],
						'warning'           => [
							'type'        => 'string',
							'description' => 'Only present when a requested setting could not be applied or saved, for example when Yoast Local SEO requires the site to represent an organization or when the user to represent does not exist. Meant to be relayed to the user.',
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

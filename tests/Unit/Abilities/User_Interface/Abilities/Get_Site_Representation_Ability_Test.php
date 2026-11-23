<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use stdClass;
use Yoast\WP\SEO\Abilities\Application\Site_Representation_Collector;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Site_Representation_Ability;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Get_Site_Representation_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Site_Representation_Ability
 */
final class Get_Site_Representation_Ability_Test extends TestCase {

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
	 * The site representation collector mock.
	 *
	 * @var Mockery\MockInterface|Site_Representation_Collector
	 */
	private $collector;

	/**
	 * The instance under test.
	 *
	 * @var Get_Site_Representation_Ability
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

		$this->capability_helper = Mockery::mock( Capability_Helper::class );
		$this->field_map         = Mockery::mock( Site_Representation_Field_Map::class );
		$this->collector         = Mockery::mock( Site_Representation_Collector::class );

		$this->instance = new Get_Site_Representation_Ability( $this->capability_helper, $this->field_map, $this->collector );
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
		$this->assertSame( 'yoast-seo/get-site-representation', $this->instance->get_name() );
	}

	/**
	 * Tests that the ability is always available.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Site_Representation_Ability::is_available
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
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Site_Representation_Ability::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Site_Representation_Ability::can_manage_seo
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
	 * Tests that execute returns the settings of the collector.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute() {
		$settings = [ 'company_name' => 'Yoast' ];

		$this->collector->expects( 'get' )->once()->andReturn( $settings );

		$this->assertSame( $settings, $this->instance->execute() );
	}

	/**
	 * Tests that get_args accepts no input and reduces the schema of the field map to the output schema.
	 *
	 * @covers ::get_args
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Site_Representation_Ability::get_settings_output_schema
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Site_Representation_Ability::to_output_schema
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

		// The default input is a new object, so it can only be compared by value.
		$this->assertEquals(
			[
				'label'               => 'Get Site Representation',
				'description'         => 'Get Yoast SEO\'s site representation settings, which tell search engines whether the site represents an organization or a person, and provide its name, logo, social profiles and, depending on the active add-ons, other details for the site\'s organization schema. The settings are returned as stored, so an empty value means the setting is not set, and the site falls back to what the description of that setting says.',
				'category'            => 'yoast-seo',
				'input_schema'        => [
					'type'                 => 'object',
					'additionalProperties' => false,
					'default'              => new stdClass(),
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
					],
				],
				'permission_callback' => [ $this->instance, 'can_manage_seo' ],
				'execute_callback'    => [ $this->instance, 'execute' ],
				'meta'                => [
					'show_in_rest' => true,
					'annotations'  => [
						'readonly'    => true,
						'destructive' => false,
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

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Abilities\Application\Author_Schema_Collector;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Schema_Field_Map;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Author_Schema_Ability;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Get_Author_Schema_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Author_Schema_Ability
 */
final class Get_Author_Schema_Ability_Test extends TestCase {

	/**
	 * The author schema field map mock.
	 *
	 * @var Mockery\MockInterface|Author_Schema_Field_Map
	 */
	private $field_map;

	/**
	 * The author schema collector mock.
	 *
	 * @var Mockery\MockInterface|Author_Schema_Collector
	 */
	private $collector;

	/**
	 * The instance under test.
	 *
	 * @var Get_Author_Schema_Ability
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

		$this->field_map = Mockery::mock( Author_Schema_Field_Map::class );
		$this->collector = Mockery::mock( Author_Schema_Collector::class );

		$this->instance = new Get_Author_Schema_Ability( $this->field_map, $this->collector );
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
		$this->assertSame( 'yoast-seo/get-author-schema', $this->instance->get_name() );
	}

	/**
	 * Tests that the ability is always available.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Author_Schema_Ability::is_available
	 *
	 * @return void
	 */
	public function test_is_available() {
		$this->assertTrue( $this->instance->is_available() );
	}

	/**
	 * Tests that can_edit_user checks whether the current user can edit the user in the input.
	 *
	 * @covers ::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Author_Schema_Ability::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Author_Schema_Ability::can_edit_user
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $can Whether the current user can edit the user.
	 *
	 * @return void
	 */
	public function test_can_edit_user( bool $can ) {
		Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_user', 7 )
			->andReturn( $can );

		$this->assertSame( $can, $this->instance->can_edit_user( [ 'user_id' => 7 ] ) );
	}

	/**
	 * Tests that execute returns the settings the collector reads for the user in the input.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute() {
		$settings = [
			'user_id'  => 7,
			'facebook' => 'https://facebook.com/yoast',
		];

		$this->collector->expects( 'get' )->once()->with( 7 )->andReturn( $settings );

		$this->assertSame( $settings, $this->instance->execute( [ 'user_id' => 7 ] ) );
	}

	/**
	 * Tests that get_args only accepts the user ID and reduces the schema of the user ID and the field map to the
	 * output schema.
	 *
	 * @covers ::get_args
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Author_Schema_Ability::get_user_id_schema
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Author_Schema_Ability::get_settings_output_schema
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Author_Schema_Ability::to_output_schema
	 *
	 * @return void
	 */
	public function test_get_args() {
		$this->field_map->expects( 'get_fields' )->once()->andReturn(
			[
				'wpseo_pronouns' => [
					'type'              => 'string',
					'description'       => 'The pronouns.',
					'validate_callback' => 'is_string',
				],
				'facebook'       => [
					'type'        => 'string',
					'description' => 'The Facebook profile.',
				],
			],
		);

		$this->assertSame(
			[
				'label'               => 'Get Author Schema',
				'description'         => 'Get Yoast SEO\'s author schema settings of a user, which provide their pronouns, social profiles and, depending on the active add-ons, other details for the user\'s Person schema. That schema describes the user as the author of their posts, on their author archive, and as the site itself when the site represents this user. The settings are returned as stored, so an empty value means the setting is not set.',
				'category'            => 'yoast-seo',
				'input_schema'        => [
					'type'                 => 'object',
					'additionalProperties' => false,
					'required'             => [ 'user_id' ],
					'properties'           => [
						'user_id' => [
							'type'        => 'integer',
							'minimum'     => 1,
							'description' => 'The ID of the user whose settings to get.',
						],
					],
				],
				'output_schema'       => [
					'type'       => 'object',
					'properties' => [
						'user_id'        => [
							'type'        => 'integer',
							'description' => 'The ID of the user whose settings to get.',
						],
						'wpseo_pronouns' => [
							'type'        => 'string',
							'description' => 'The pronouns.',
						],
						'facebook'       => [
							'type'        => 'string',
							'description' => 'The Facebook profile.',
						],
					],
				],
				'permission_callback' => [ $this->instance, 'can_edit_user' ],
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

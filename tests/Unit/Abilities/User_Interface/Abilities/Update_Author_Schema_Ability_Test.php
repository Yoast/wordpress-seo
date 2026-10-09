<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Abilities\Application\Author_Schema_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Schema_Field_Map;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Update_Author_Schema_Ability;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Update_Author_Schema_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Update_Author_Schema_Ability
 */
final class Update_Author_Schema_Ability_Test extends TestCase {

	/**
	 * The author schema field map mock.
	 *
	 * @var Mockery\MockInterface|Author_Schema_Field_Map
	 */
	private $field_map;

	/**
	 * The author schema updater mock.
	 *
	 * @var Mockery\MockInterface|Author_Schema_Updater
	 */
	private $author_schema_updater;

	/**
	 * The instance under test.
	 *
	 * @var Update_Author_Schema_Ability
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

		$this->field_map             = Mockery::mock( Author_Schema_Field_Map::class );
		$this->author_schema_updater = Mockery::mock( Author_Schema_Updater::class );

		$this->instance = new Update_Author_Schema_Ability(
			$this->field_map,
			$this->author_schema_updater,
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
		$this->assertSame( 'yoast-seo/update-author-schema', $this->instance->get_name() );
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
	 * Tests that can_edit_user checks whether the current user can edit the user in the input.
	 *
	 * @covers ::__construct
	 * @covers ::can_edit_user
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
	 * Tests that execute delegates to the updater with the user ID and returns its result.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute() {
		$input  = [
			'user_id'  => 7,
			'facebook' => 'https://facebook.com/yoast',
		];
		$result = [
			'user_id'  => 7,
			'facebook' => 'https://facebook.com/yoast',
		];

		$this->author_schema_updater
			->expects( 'update' )
			->once()
			->with( 7, $input )
			->andReturn( $result );

		$this->assertSame( $result, $this->instance->execute( $input ) );
	}

	/**
	 * Tests that get_args builds the input schema from the user ID and the field map, and reduces it to the
	 * output schema, which also describes the warning.
	 *
	 * @covers ::get_args
	 * @covers ::to_output_schema
	 *
	 * @return void
	 */
	public function test_get_args() {
		$this->field_map->expects( 'get_fields' )->once()->andReturn(
			[
				'wpseo_pronouns' => [
					'type'        => 'string',
					'description' => 'The pronouns.',
				],
				'facebook'       => [
					'type'        => 'string',
					'description' => 'The Facebook profile.',
				],
			],
		);

		$this->assertSame(
			[
				'label'               => 'Update Author Schema',
				'description'         => 'Update Yoast SEO\'s author schema settings of a user, which provide their pronouns, social profiles and, depending on the active add-ons, other details for the user\'s Person schema. That schema describes the user as the author of their posts, on their author archive, and as the site itself when the site represents this user. Only the settings you provide are changed; a provided empty string clears that setting. Provide only the user ID to read the current settings without changing anything.',
				'category'            => 'yoast-seo',
				'input_schema'        => [
					'type'                 => 'object',
					'additionalProperties' => false,
					'required'             => [ 'user_id' ],
					'properties'           => [
						'user_id'        => [
							'type'        => 'integer',
							'minimum'     => 1,
							'description' => 'The ID of the user whose settings to update or read.',
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
				'output_schema'       => [
					'type'       => 'object',
					'properties' => [
						'user_id'        => [
							'type'        => 'integer',
							'description' => 'The ID of the user whose settings to update or read.',
						],
						'wpseo_pronouns' => [
							'type'        => 'string',
							'description' => 'The pronouns.',
						],
						'facebook'       => [
							'type'        => 'string',
							'description' => 'The Facebook profile.',
						],
						'warning'        => [
							'type'        => 'string',
							'description' => 'Only present when a requested setting could not be applied or saved, for example when a social profile is not a valid URL. Meant to be relayed to the user.',
						],
					],
				],
				'permission_callback' => [ $this->instance, 'can_edit_user' ],
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

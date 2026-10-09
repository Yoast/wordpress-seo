<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Author_Schema_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Schema_Field_Map;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Sanitization_Helper;
use Yoast\WP\SEO\Helpers\Social_Profiles_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Author_Schema_Updater class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Author_Schema_Updater
 */
final class Author_Schema_Updater_Test extends TestCase {

	/**
	 * The ID of the user whose settings are updated.
	 *
	 * @var int
	 */
	private const USER_ID = 7;

	/**
	 * The fields the field map returns.
	 *
	 * @var array<string, array<string, string>>
	 */
	private const FIELDS = [
		'wpseo_pronouns' => [ 'type' => 'string' ],
		'facebook'       => [ 'type' => 'string' ],
		'twitter'        => [ 'type' => 'string' ],
	];

	/**
	 * The user helper mock.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	private $user_helper;

	/**
	 * The author schema field map mock.
	 *
	 * @var Mockery\MockInterface|Author_Schema_Field_Map
	 */
	private $field_map;

	/**
	 * The social profiles helper mock.
	 *
	 * @var Mockery\MockInterface|Social_Profiles_Helper
	 */
	private $social_profiles_helper;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The sanitization helper mock.
	 *
	 * @var Mockery\MockInterface|Sanitization_Helper
	 */
	private $sanitization_helper;

	/**
	 * The validators the field map returns.
	 *
	 * @var array<string, callable>
	 */
	private $validators = [];

	/**
	 * The instance under test.
	 *
	 * @var Author_Schema_Updater
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

		$this->user_helper            = Mockery::mock( User_Helper::class );
		$this->field_map              = Mockery::mock( Author_Schema_Field_Map::class );
		$this->social_profiles_helper = Mockery::mock( Social_Profiles_Helper::class );
		$this->options_helper         = Mockery::mock( Options_Helper::class );
		$this->sanitization_helper    = Mockery::mock( Sanitization_Helper::class );

		$this->user_helper->allows( 'user_exists' )->with( self::USER_ID )->andReturnTrue();
		$this->field_map->allows( 'get_fields' )->andReturn( self::FIELDS );
		$this->field_map->allows( 'get_validators' )->andReturnUsing(
			function () {
				return $this->validators;
			},
		);
		$this->social_profiles_helper->allows( 'get_person_social_profile_fields' )->andReturn(
			[
				'facebook' => 'get_non_valid_url',
				'twitter'  => 'get_non_valid_twitter',
			],
		);
		$this->sanitization_helper->allows( 'sanitize_text_field' )->andReturnUsing( 'trim' );

		$this->instance = new Author_Schema_Updater(
			$this->user_helper,
			$this->field_map,
			$this->social_profiles_helper,
			$this->options_helper,
			$this->sanitization_helper,
		);
	}

	/**
	 * Expects the given settings to be read back once.
	 *
	 * @param array<string, string> $values The stored value of each field.
	 *
	 * @return void
	 */
	private function expect_settings_read( array $values ): void {
		foreach ( $values as $field_name => $value ) {
			$this->user_helper->expects( 'get_meta' )->once()->with( self::USER_ID, $field_name, true )->andReturn( $value );
		}
	}

	/**
	 * Tests that update saves the provided settings only, saves the social profiles through the social profiles
	 * helper and returns all settings along with the user ID.
	 *
	 * @covers ::__construct
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::validate_field
	 * @covers ::save_field
	 * @covers ::get_settings
	 *
	 * @return void
	 */
	public function test_update() {
		$this->user_helper->expects( 'update_meta' )->once()->with( self::USER_ID, 'wpseo_pronouns', 'they/them' );
		$this->user_helper->expects( 'get_meta' )->once()->with( self::USER_ID, 'wpseo_pronouns', true )->andReturn( 'they/them' );
		$this->social_profiles_helper->expects( 'set_person_social_profiles' )->once()->with( self::USER_ID, [ 'facebook' => 'https://facebook.com/yoast' ] )->andReturn( [] );

		$this->expect_settings_read(
			[
				'wpseo_pronouns' => 'they/them',
				'facebook'       => 'https://facebook.com/yoast',
				'twitter'        => '',
			],
		);

		$this->assertSame(
			[
				'user_id'        => self::USER_ID,
				'wpseo_pronouns' => 'they/them',
				'facebook'       => 'https://facebook.com/yoast',
				'twitter'        => '',
			],
			$this->instance->update(
				self::USER_ID,
				[
					'user_id'        => self::USER_ID,
					'wpseo_pronouns' => 'they/them',
					'facebook'       => 'https://facebook.com/yoast',
				],
			),
		);
	}

	/**
	 * Tests that update only reads the settings when the input has no fields to change.
	 *
	 * @covers ::update
	 * @covers ::get_settings
	 *
	 * @return void
	 */
	public function test_update_read_only() {
		$this->user_helper->expects( 'update_meta' )->never();
		$this->social_profiles_helper->expects( 'set_person_social_profiles' )->never();

		$this->expect_settings_read(
			[
				'wpseo_pronouns' => '',
				'facebook'       => 'https://facebook.com/yoast',
				'twitter'        => 'yoast',
			],
		);

		$this->assertSame(
			[
				'user_id'        => self::USER_ID,
				'wpseo_pronouns' => '',
				'facebook'       => 'https://facebook.com/yoast',
				'twitter'        => 'yoast',
			],
			$this->instance->update( self::USER_ID, [ 'user_id' => self::USER_ID ] ),
		);
	}

	/**
	 * Tests that update returns an error without saving or reading anything when the user does not exist.
	 *
	 * @covers ::update
	 *
	 * @return void
	 */
	public function test_update_user_not_found() {
		$this->user_helper->expects( 'user_exists' )->once()->with( 99 )->andReturnFalse();
		$this->user_helper->expects( 'update_meta' )->never();
		$this->user_helper->expects( 'get_meta' )->never();
		$this->social_profiles_helper->expects( 'set_person_social_profiles' )->never();

		$result = $this->instance->update( 99, [ 'facebook' => 'https://facebook.com/yoast' ] );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'yoast_seo_user_not_found', $result->get_error_code() );
		$this->assertSame( [ 'status' => 404 ], $result->get_error_data() );
	}

	/**
	 * Data provider for test_update_x_username.
	 *
	 * @return array<string, array<string, string|bool>>
	 */
	public static function data_update_x_username() {
		return [
			'Profile URL is saved as the username' => [
				'value'      => 'https://x.com/yoast',
				'x_username' => 'yoast',
				'expected'   => 'yoast',
			],
			'Username is saved as provided'        => [
				'value'      => 'yoast',
				'x_username' => 'yoast',
				'expected'   => 'yoast',
			],
			'Invalid value is left to the helper'  => [
				'value'      => 'not a valid handle!!',
				'x_username' => false,
				'expected'   => 'not a valid handle!!',
			],
		];
	}

	/**
	 * Tests that update saves the X username instead of an X profile URL, and leaves invalid values to the social
	 * profiles helper to reject.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::save_field
	 * @covers ::get_x_username
	 *
	 * @dataProvider data_update_x_username
	 *
	 * @param string       $value      The provided X username or profile URL.
	 * @param string|false $x_username The username the options helper extracts from the value.
	 * @param string       $expected   The value passed to the social profiles helper.
	 *
	 * @return void
	 */
	public function test_update_x_username( $value, $x_username, $expected ) {
		$this->options_helper->expects( 'get_twitter_id' )->once()->with( $value )->andReturn( $x_username );
		$this->social_profiles_helper->expects( 'set_person_social_profiles' )->once()->with( self::USER_ID, [ 'twitter' => $expected ] )->andReturn( [] );

		$this->user_helper->allows( 'get_meta' )->andReturn( '' );

		$result = $this->instance->update( self::USER_ID, [ 'twitter' => $value ] );

		$this->assertArrayNotHasKey( 'warning', $result );
	}

	/**
	 * Tests that update clears the X username without looking it up.
	 *
	 * @covers ::update
	 * @covers ::save_field
	 * @covers ::get_x_username
	 *
	 * @return void
	 */
	public function test_update_clear_x_username() {
		$this->options_helper->expects( 'get_twitter_id' )->never();
		$this->social_profiles_helper->expects( 'set_person_social_profiles' )->once()->with( self::USER_ID, [ 'twitter' => '' ] )->andReturn( [] );

		$this->user_helper->allows( 'get_meta' )->andReturn( '' );

		$result = $this->instance->update( self::USER_ID, [ 'twitter' => '' ] );

		$this->assertArrayNotHasKey( 'warning', $result );
	}

	/**
	 * Tests that update reports a social profile the social profiles helper could not validate in a warning,
	 * while still saving the other settings.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::save_field
	 *
	 * @return void
	 */
	public function test_update_social_profile_not_saved() {
		$this->social_profiles_helper->expects( 'set_person_social_profiles' )->once()->with( self::USER_ID, [ 'facebook' => 'not-a-url' ] )->andReturn( [ 'facebook' ] );
		$this->user_helper->expects( 'update_meta' )->once()->with( self::USER_ID, 'wpseo_pronouns', 'they/them' );

		$this->user_helper->allows( 'get_meta' )->andReturn( 'they/them' );

		$result = $this->instance->update(
			self::USER_ID,
			[
				'facebook'       => 'not-a-url',
				'wpseo_pronouns' => 'they/them',
			],
		);

		$this->assertSame(
			'The facebook setting could not be saved as provided, so its current value is returned. The other settings were saved.',
			$result['warning'],
		);
	}

	/**
	 * Tests that update sanitizes the settings that are not social profiles, and reports a value that got
	 * sanitized into something else in a warning.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::save_field
	 *
	 * @return void
	 */
	public function test_update_sanitized() {
		$this->user_helper->expects( 'update_meta' )->once()->with( self::USER_ID, 'wpseo_pronouns', 'they/them' );

		$this->user_helper->allows( 'get_meta' )->andReturn( 'they/them' );

		$result = $this->instance->update( self::USER_ID, [ 'wpseo_pronouns' => ' they/them ' ] );

		$this->assertSame(
			'The wpseo_pronouns setting could not be saved as provided, so its current value is returned. No other settings were saved.',
			$result['warning'],
		);
	}

	/**
	 * Tests that update skips a field whose validator returns a warning, saves the other settings and
	 * returns that warning.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::validate_field
	 *
	 * @return void
	 */
	public function test_update_validator_warning() {
		$received = [];

		$this->validators['wpseo_pronouns'] = static function ( $value, $field_name ) use ( &$received ) {
			$received = [ $value, $field_name ];

			return 'The wpseo_pronouns setting was not changed.';
		};

		$this->user_helper->expects( 'update_meta' )->never();
		$this->social_profiles_helper->expects( 'set_person_social_profiles' )->once()->with( self::USER_ID, [ 'facebook' => 'https://facebook.com/yoast' ] )->andReturn( [] );

		$this->user_helper->allows( 'get_meta' )->andReturn( '' );

		$result = $this->instance->update(
			self::USER_ID,
			[
				'wpseo_pronouns' => 'they/them',
				'facebook'       => 'https://facebook.com/yoast',
			],
		);

		$this->assertSame( [ 'they/them', 'wpseo_pronouns' ], $received );
		$this->assertSame( 'The wpseo_pronouns setting was not changed. The other settings were saved.', $result['warning'] );
	}

	/**
	 * Data provider for test_update_validator_no_warning.
	 *
	 * @return array<string, array<string, string|bool|array<string>|null>>
	 */
	public static function data_update_validator_no_warning() {
		return [
			'Null'         => [ 'warning' => null ],
			'Empty string' => [ 'warning' => '' ],
			'Boolean'      => [ 'warning' => true ],
			'Array'        => [ 'warning' => [ 'The wpseo_pronouns setting was not changed.' ] ],
		];
	}

	/**
	 * Tests that update saves a field when its validator returns something other than a non-empty string.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::validate_field
	 *
	 * @dataProvider data_update_validator_no_warning
	 *
	 * @param string|bool|array<string>|null $warning The warning the validator returns.
	 *
	 * @return void
	 */
	public function test_update_validator_no_warning( $warning ) {
		$this->validators['wpseo_pronouns'] = static function () use ( $warning ) {
			return $warning;
		};

		$this->user_helper->expects( 'update_meta' )->once()->with( self::USER_ID, 'wpseo_pronouns', 'they/them' );

		$this->user_helper->allows( 'get_meta' )->andReturn( 'they/them' );

		$result = $this->instance->update( self::USER_ID, [ 'wpseo_pronouns' => 'they/them' ] );

		$this->assertArrayNotHasKey( 'warning', $result );
	}
}

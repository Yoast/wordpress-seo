<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Mockery;
use Yoast\WP\SEO\Abilities\Application\Site_Representation_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Social_Profiles_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Site_Representation_Updater class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Site_Representation_Updater
 */
final class Site_Representation_Updater_Test extends TestCase {

	/**
	 * The fields the field map returns.
	 *
	 * @var array<string, array<string, string>>
	 */
	private const FIELDS = [
		'company_or_person'         => [ 'type' => 'string' ],
		'company_name'              => [ 'type' => 'string' ],
		'company_logo_id'           => [ 'type' => 'integer' ],
		'company_or_person_user_id' => [ 'type' => 'integer' ],
		'facebook_site'             => [ 'type' => 'string' ],
	];

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The site representation field map mock.
	 *
	 * @var Mockery\MockInterface|Site_Representation_Field_Map
	 */
	private $field_map;

	/**
	 * The image helper mock.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	private $image_helper;

	/**
	 * The social profiles helper mock.
	 *
	 * @var Mockery\MockInterface|Social_Profiles_Helper
	 */
	private $social_profiles_helper;

	/**
	 * The validators the field map returns.
	 *
	 * @var array<string, callable>
	 */
	private $validators = [];

	/**
	 * The instance under test.
	 *
	 * @var Site_Representation_Updater
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

		$this->options_helper         = Mockery::mock( Options_Helper::class );
		$this->field_map              = Mockery::mock( Site_Representation_Field_Map::class );
		$this->image_helper           = Mockery::mock( Image_Helper::class );
		$this->social_profiles_helper = Mockery::mock( Social_Profiles_Helper::class );

		$this->field_map->allows( 'get_fields' )->andReturn( self::FIELDS );
		$this->field_map->allows( 'get_validators' )->andReturnUsing(
			function () {
				return $this->validators;
			},
		);
		$this->social_profiles_helper->allows( 'get_organization_social_profile_fields' )->andReturn(
			[
				'facebook_site'     => 'get_non_valid_url',
				'twitter_site'      => 'get_non_valid_twitter',
				'other_social_urls' => 'get_non_valid_url_array',
			],
		);

		$this->instance = new Site_Representation_Updater(
			$this->options_helper,
			$this->field_map,
			$this->image_helper,
			$this->social_profiles_helper,
		);
	}

	/**
	 * Expects the given settings to be read back once.
	 *
	 * @param array<string, string|int|bool> $values The stored value of each field.
	 *
	 * @return void
	 */
	private function expect_settings_read( array $values ): void {
		foreach ( $values as $field_name => $value ) {
			$this->options_helper->expects( 'get' )->once()->with( $field_name )->andReturn( $value );
		}
	}

	/**
	 * Tests that update saves the provided settings only, saves the URL of the changed logo along with its ID,
	 * clears its cached meta and returns all settings cast to their type.
	 *
	 * @covers ::__construct
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::validate_field
	 * @covers ::save_field
	 * @covers ::save_logo
	 * @covers ::get_settings
	 *
	 * @return void
	 */
	public function test_update() {
		$this->image_helper->expects( 'get_attachment_image_url' )->once()->with( 12, 'full' )->andReturn( 'https://example.com/logo.png' );

		$this->options_helper->expects( 'set' )->once()->with( 'company_or_person', 'company' )->andReturnTrue();
		$this->social_profiles_helper->expects( 'set_organization_social_profiles' )->once()->with( [ 'facebook_site' => 'https://facebook.com/yoast' ] )->andReturn( [] );
		$this->options_helper->expects( 'set' )->once()->with( 'company_name', 'Yoast' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_id', 12 )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo', 'https://example.com/logo.png' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_meta', false )->andReturnTrue();
		$this->options_helper->expects( 'set' )->never()->with( 'person_logo_meta', false );

		$this->expect_settings_read(
			[
				'company_or_person'         => 'company',
				'company_name'              => 'Yoast',
				'company_logo_id'           => 12,
				'company_or_person_user_id' => false,
				'facebook_site'             => 'https://facebook.com/yoast',
			],
		);

		$this->assertSame(
			[
				'company_or_person'         => 'company',
				'company_name'              => 'Yoast',
				'company_logo_id'           => 12,
				'company_or_person_user_id' => 0,
				'facebook_site'             => 'https://facebook.com/yoast',
			],
			$this->instance->update(
				[
					'company_or_person' => 'company',
					'company_name'      => 'Yoast',
					'company_logo_id'   => 12,
					'facebook_site'     => 'https://facebook.com/yoast',
				],
			),
		);
	}

	/**
	 * Tests that update combines the warnings of all the settings it skipped, and says no other settings
	 * were saved when none were.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::validate_field
	 *
	 * @return void
	 */
	public function test_update_multiple_warnings() {
		$this->validators['company_or_person']         = static function () {
			return 'The company_or_person setting was not changed.';
		};
		$this->validators['company_or_person_user_id'] = static function () {
			return 'The company_or_person_user_id setting was not changed.';
		};

		$this->options_helper->expects( 'set' )->never();
		$this->options_helper->allows( 'get' )->andReturn( '' );

		$result = $this->instance->update(
			[
				'company_or_person'         => 'person',
				'company_or_person_user_id' => 99,
			],
		);

		$this->assertSame(
			'The company_or_person setting was not changed. The company_or_person_user_id setting was not changed. No other settings were saved.',
			$result['warning'],
		);
	}

	/**
	 * Tests that update reports the settings that could not be saved in a warning, while still saving the
	 * others and clearing the cached meta of the changed logo.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::save_logo
	 *
	 * @return void
	 */
	public function test_update_not_saved() {
		$this->image_helper->expects( 'get_attachment_image_url' )->once()->with( 12, 'full' )->andReturn( 'https://example.com/logo.png' );

		$this->options_helper->expects( 'set' )->once()->with( 'company_or_person', 'company' )->andReturnFalse();
		$this->options_helper->expects( 'set' )->once()->with( 'company_name', 'Yoast' )->andReturnFalse();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_id', 12 )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo', 'https://example.com/logo.png' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_meta', false )->andReturnTrue();

		$this->options_helper->allows( 'get' )->andReturn( '' );

		$result = $this->instance->update(
			[
				'company_or_person' => 'company',
				'company_name'      => 'Yoast',
				'company_logo_id'   => 12,
			],
		);

		$this->assertSame(
			'The company_or_person setting could not be saved as provided, so its current value is returned. The company_name setting could not be saved as provided, so its current value is returned. The other settings were saved.',
			$result['warning'],
		);
	}

	/**
	 * Tests that update clears the URL of a logo whose ID is cleared, without looking it up.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::save_logo
	 *
	 * @return void
	 */
	public function test_update_clear_logo() {
		$this->image_helper->expects( 'get_attachment_image_url' )->never();

		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_id', 0 )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo', '' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_meta', false )->andReturnTrue();

		$this->options_helper->allows( 'get' )->andReturn( 0 );

		$result = $this->instance->update( [ 'company_logo_id' => 0 ] );

		$this->assertArrayNotHasKey( 'warning', $result );
	}

	/**
	 * Tests that update ignores a provided logo URL, so it cannot point to another image than the ID.
	 *
	 * @covers ::update
	 *
	 * @return void
	 */
	public function test_update_logo_url_ignored() {
		$this->image_helper->expects( 'get_attachment_image_url' )->never();

		$this->options_helper->expects( 'set' )->never();
		$this->options_helper->allows( 'get' )->andReturn( '' );

		$result = $this->instance->update( [ 'company_logo' => 'https://example.com/logo.png' ] );

		$this->assertArrayNotHasKey( 'company_logo', $result );
	}

	/**
	 * Tests that update does not save the URL of a logo whose ID could not be saved, so the two keep pointing
	 * to the same image.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::save_logo
	 *
	 * @return void
	 */
	public function test_update_logo_not_saved() {
		$this->image_helper->expects( 'get_attachment_image_url' )->never();

		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_id', 12 )->andReturnFalse();
		$this->options_helper->expects( 'set' )->never()->with( 'company_logo', Mockery::any() );
		$this->options_helper->expects( 'set' )->never()->with( 'company_logo_meta', false );

		$this->options_helper->allows( 'get' )->andReturn( 0 );

		$result = $this->instance->update( [ 'company_logo_id' => 12 ] );

		$this->assertSame(
			'The company_logo_id setting could not be saved as provided, so its current value is returned. No other settings were saved.',
			$result['warning'],
		);
	}

	/**
	 * Tests that update reports a social profile the social profiles helper could not validate or save in a
	 * warning, while still saving the other settings.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::save_field
	 *
	 * @return void
	 */
	public function test_update_social_profile_not_saved() {
		$this->social_profiles_helper->expects( 'set_organization_social_profiles' )->once()->with( [ 'facebook_site' => 'not-a-url' ] )->andReturn( [ 'facebook_site' ] );

		$this->options_helper->expects( 'set' )->never()->with( 'facebook_site', 'not-a-url' );
		$this->options_helper->expects( 'set' )->once()->with( 'company_name', 'Yoast' )->andReturnTrue();

		$this->options_helper->allows( 'get' )->andReturn( '' );

		$result = $this->instance->update(
			[
				'facebook_site' => 'not-a-url',
				'company_name'  => 'Yoast',
			],
		);

		$this->assertSame(
			'The facebook_site setting could not be saved as provided, so its current value is returned. The other settings were saved.',
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

		$this->validators['company_name'] = static function ( $value, $field_name ) use ( &$received ) {
			$received = [ $value, $field_name ];

			return 'The company_name setting was not changed.';
		};

		$this->options_helper->expects( 'set' )->never()->with( 'company_name', 'Yoast' );
		$this->social_profiles_helper->expects( 'set_organization_social_profiles' )->once()->with( [ 'facebook_site' => 'https://facebook.com/yoast' ] )->andReturn( [] );

		$this->options_helper->allows( 'get' )->andReturn( '' );

		$result = $this->instance->update(
			[
				'company_name'  => 'Yoast',
				'facebook_site' => 'https://facebook.com/yoast',
			],
		);

		$this->assertSame( [ 'Yoast', 'company_name' ], $received );
		$this->assertSame( 'The company_name setting was not changed. The other settings were saved.', $result['warning'] );
	}

	/**
	 * Data provider for test_update_validator_no_warning.
	 *
	 * @return array<string, array<string, string|bool|array<string>|null>>
	 */
	public static function data_update_add_on_validator_no_warning() {
		return [
			'Null'         => [ 'warning' => null ],
			'Empty string' => [ 'warning' => '' ],
			'Boolean'      => [ 'warning' => true ],
			'Array'        => [ 'warning' => [ 'The company_name setting was not changed.' ] ],
		];
	}

	/**
	 * Tests that update saves a field when its validator returns something other than a non-empty string.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::validate_field
	 *
	 * @dataProvider data_update_add_on_validator_no_warning
	 *
	 * @param string|bool|array<string>|null $warning The warning the validator returns.
	 *
	 * @return void
	 */
	public function test_update_validator_no_warning( $warning ) {
		$this->validators['company_name'] = static function () use ( $warning ) {
			return $warning;
		};

		$this->options_helper->expects( 'set' )->once()->with( 'company_name', 'Yoast' )->andReturnTrue();

		$this->options_helper->allows( 'get' )->andReturn( '' );

		$result = $this->instance->update( [ 'company_name' => 'Yoast' ] );

		$this->assertArrayNotHasKey( 'warning', $result );
	}
}

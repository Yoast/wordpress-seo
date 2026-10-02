<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Brain\Monkey;
use Exception;
use Mockery;
use Yoast\WP\SEO\Abilities\Application\Site_Representation_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map;
use Yoast\WP\SEO\Conditionals\Local_SEO_Active_Conditional;
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
		'company_logo'              => [ 'type' => 'string' ],
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
	 * The Local SEO active conditional mock.
	 *
	 * @var Mockery\MockInterface|Local_SEO_Active_Conditional
	 */
	private $local_seo_active_conditional;

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

		$this->options_helper               = Mockery::mock( Options_Helper::class );
		$this->field_map                    = Mockery::mock( Site_Representation_Field_Map::class );
		$this->local_seo_active_conditional = Mockery::mock( Local_SEO_Active_Conditional::class );
		$this->image_helper                 = Mockery::mock( Image_Helper::class );
		$this->social_profiles_helper       = Mockery::mock( Social_Profiles_Helper::class );

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
			$this->local_seo_active_conditional,
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
	 * Tests that update saves the provided settings only, saves the ID of the changed logo along with it,
	 * clears its cached meta and returns all settings cast to their type.
	 *
	 * @covers ::__construct
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::validate_field
	 * @covers ::save_field
	 * @covers ::get_logo_id
	 * @covers ::validate_company_or_person
	 * @covers ::validate_logo
	 * @covers ::get_settings
	 *
	 * @return void
	 */
	public function test_update() {
		$this->local_seo_active_conditional->expects( 'is_met' )->never();

		$this->image_helper->expects( 'get_attachment_by_url' )->twice()->with( 'https://example.com/logo.png' )->andReturn( 12 );
		$this->image_helper->expects( 'is_valid_attachment' )->once()->with( 12 )->andReturnTrue();

		$this->options_helper->expects( 'set' )->once()->with( 'company_or_person', 'company' )->andReturnTrue();
		$this->social_profiles_helper->expects( 'set_organization_social_profiles' )->once()->with( [ 'facebook_site' => 'https://facebook.com/yoast' ] )->andReturn( [] );
		$this->options_helper->expects( 'set' )->once()->with( 'company_name', 'Yoast' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo', 'https://example.com/logo.png' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_id', 12 )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_meta', false )->andReturnTrue();
		$this->options_helper->expects( 'set' )->never()->with( 'person_logo_meta', false );

		$this->expect_settings_read(
			[
				'company_or_person'         => 'company',
				'company_name'              => 'Yoast',
				'company_logo'              => 'https://example.com/logo.png',
				'company_or_person_user_id' => false,
				'facebook_site'             => 'https://facebook.com/yoast',
			],
		);

		$this->assertSame(
			[
				'company_or_person'         => 'company',
				'company_name'              => 'Yoast',
				'company_logo'              => 'https://example.com/logo.png',
				'company_or_person_user_id' => 0,
				'facebook_site'             => 'https://facebook.com/yoast',
			],
			$this->instance->update(
				[
					'company_or_person' => 'company',
					'company_name'      => 'Yoast',
					'company_logo'      => 'https://example.com/logo.png',
					'facebook_site'     => 'https://facebook.com/yoast',
				],
			),
		);
	}

	/**
	 * Tests that update sets the site to represent an existing person when Local SEO is not active.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::validate_company_or_person
	 * @covers ::validate_user_id
	 *
	 * @return void
	 */
	public function test_update_person() {
		$this->local_seo_active_conditional->expects( 'is_met' )->once()->andReturnFalse();

		Monkey\Functions\expect( 'get_userdata' )->once()->with( 3 )->andReturn( (object) [ 'ID' => 3 ] );

		$this->options_helper->expects( 'set' )->once()->with( 'company_or_person', 'person' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_or_person_user_id', 3 )->andReturnTrue();

		$this->options_helper->allows( 'get' )->andReturn( '' );

		$result = $this->instance->update(
			[
				'company_or_person'         => 'person',
				'company_or_person_user_id' => 3,
			],
		);

		$this->assertArrayNotHasKey( 'warning', $result );
	}

	/**
	 * Tests that update skips representing a person when Local SEO is active, saves the other settings and
	 * returns a warning.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::validate_company_or_person
	 *
	 * @return void
	 */
	public function test_update_person_with_local_seo() {
		$this->local_seo_active_conditional->expects( 'is_met' )->once()->andReturnTrue();

		$this->validators['company_or_person'] = static function () {
			throw new Exception( 'The validator of an add-on should not run once Yoast SEO skipped the field.' );
		};

		$this->options_helper->expects( 'set' )->never()->with( 'company_or_person', 'person' );
		$this->options_helper->expects( 'set' )->once()->with( 'company_name', 'Yoast' )->andReturnTrue();

		$this->options_helper->allows( 'get' )->andReturn( '' );

		$result = $this->instance->update(
			[
				'company_or_person' => 'person',
				'company_name'      => 'Yoast',
			],
		);

		$this->assertSame(
			'The site was not set to represent a person, because Yoast Local SEO is active and requires the site to represent an organization. The other settings were saved.',
			$result['warning'],
		);
	}

	/**
	 * Tests that update skips the user to represent when it does not exist, saves the other settings and
	 * returns a warning.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::validate_user_id
	 *
	 * @return void
	 */
	public function test_update_invalid_user() {
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 99 )->andReturnFalse();

		$this->social_profiles_helper->expects( 'set_organization_social_profiles' )->once()->with( [ 'facebook_site' => 'https://facebook.com/yoast' ] )->andReturn( [] );

		$this->options_helper->allows( 'get' )->andReturn( '' );

		$result = $this->instance->update(
			[
				'company_or_person_user_id' => 99,
				'facebook_site'             => 'https://facebook.com/yoast',
			],
		);

		$this->assertSame(
			'The user to represent was not changed, because no user exists with the given ID. The other settings were saved.',
			$result['warning'],
		);
	}

	/**
	 * Tests that update combines the warnings of all the settings it skipped, and says no other settings
	 * were saved when none were.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::validate_company_or_person
	 * @covers ::validate_user_id
	 *
	 * @return void
	 */
	public function test_update_multiple_warnings() {
		$this->local_seo_active_conditional->expects( 'is_met' )->once()->andReturnTrue();

		Monkey\Functions\expect( 'get_userdata' )->once()->with( 99 )->andReturnFalse();

		$this->options_helper->expects( 'set' )->never();
		$this->options_helper->allows( 'get' )->andReturn( '' );

		$result = $this->instance->update(
			[
				'company_or_person'         => 'person',
				'company_or_person_user_id' => 99,
			],
		);

		$this->assertSame(
			'The site was not set to represent a person, because Yoast Local SEO is active and requires the site to represent an organization. The user to represent was not changed, because no user exists with the given ID. No other settings were saved.',
			$result['warning'],
		);
	}

	/**
	 * Tests that update reports the settings that could not be saved in a warning, while still saving the
	 * others and clearing the cached meta of the changed logo.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::get_logo_id
	 *
	 * @return void
	 */
	public function test_update_not_saved() {
		$this->image_helper->expects( 'get_attachment_by_url' )->twice()->with( 'https://example.com/logo.png' )->andReturn( 12 );
		$this->image_helper->expects( 'is_valid_attachment' )->once()->with( 12 )->andReturnTrue();

		$this->options_helper->expects( 'set' )->once()->with( 'company_or_person', 'company' )->andReturnFalse();
		$this->options_helper->expects( 'set' )->once()->with( 'company_name', 'Yoast' )->andReturnFalse();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo', 'https://example.com/logo.png' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_id', 12 )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_meta', false )->andReturnTrue();

		$this->options_helper->allows( 'get' )->andReturn( '' );

		$result = $this->instance->update(
			[
				'company_or_person' => 'company',
				'company_name'      => 'Yoast',
				'company_logo'      => 'https://example.com/logo.png',
			],
		);

		$this->assertSame(
			'The company_or_person setting could not be saved as provided, so its current value is returned. The company_name setting could not be saved as provided, so its current value is returned. The other settings were saved.',
			$result['warning'],
		);
	}

	/**
	 * Tests that update clears the ID of a logo whose URL is cleared, without looking it up.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::get_logo_id
	 * @covers ::validate_logo
	 *
	 * @return void
	 */
	public function test_update_clear_logo() {
		$this->image_helper->expects( 'get_attachment_by_url' )->never();

		$this->options_helper->expects( 'set' )->once()->with( 'company_logo', '' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_id', 0 )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_meta', false )->andReturnTrue();

		$this->options_helper->allows( 'get' )->andReturn( '' );

		$result = $this->instance->update( [ 'company_logo' => '' ] );

		$this->assertArrayNotHasKey( 'warning', $result );
	}

	/**
	 * Tests that update ignores a provided logo ID, so it cannot point to another image than the URL.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::get_logo_id
	 * @covers ::validate_logo
	 *
	 * @return void
	 */
	public function test_update_logo_id_ignored() {
		$this->image_helper->expects( 'get_attachment_by_url' )->twice()->with( 'https://example.com/logo.png' )->andReturn( 12 );
		$this->image_helper->expects( 'is_valid_attachment' )->once()->with( 12 )->andReturnTrue();

		$this->options_helper->expects( 'set' )->once()->with( 'company_logo', 'https://example.com/logo.png' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_id', 12 )->andReturnTrue();
		$this->options_helper->expects( 'set' )->never()->with( 'company_logo_id', 13 );
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_meta', false )->andReturnTrue();

		$this->options_helper->allows( 'get' )->andReturn( '' );

		$result = $this->instance->update(
			[
				'company_logo'    => 'https://example.com/logo.png',
				'company_logo_id' => 13,
			],
		);

		$this->assertArrayNotHasKey( 'warning', $result );
	}

	/**
	 * Tests that update does not save the ID of a logo whose URL could not be saved, so the two keep pointing
	 * to the same image.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::get_logo_id
	 *
	 * @return void
	 */
	public function test_update_logo_url_not_saved() {
		$this->image_helper->expects( 'get_attachment_by_url' )->once()->with( 'https://example.com/logo.png' )->andReturn( 12 );
		$this->image_helper->expects( 'is_valid_attachment' )->once()->with( 12 )->andReturnTrue();

		$this->options_helper->expects( 'set' )->once()->with( 'company_logo', 'https://example.com/logo.png' )->andReturnFalse();
		$this->options_helper->expects( 'set' )->never()->with( 'company_logo_id', 12 );
		$this->options_helper->expects( 'set' )->never()->with( 'company_logo_meta', false );

		$this->options_helper->allows( 'get' )->andReturn( '' );

		$result = $this->instance->update( [ 'company_logo' => 'https://example.com/logo.png' ] );

		$this->assertSame(
			'The company_logo setting could not be saved as provided, so its current value is returned. No other settings were saved.',
			$result['warning'],
		);
	}

	/**
	 * Data provider for test_update_logo_url_not_an_image.
	 *
	 * @return array<string, array<string, int|bool|null>>
	 */
	public static function data_update_logo_url_not_an_image() {
		return [
			'Not in the media library' => [
				'attachment_id' => 0,
				'is_valid'      => null,
			],
			'Not an image'             => [
				'attachment_id' => 12,
				'is_valid'      => false,
			],
		];
	}

	/**
	 * Tests that update skips a logo URL that is not an image in the media library, saves the other settings
	 * and returns a warning.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::get_logo_id
	 * @covers ::validate_logo
	 *
	 * @dataProvider data_update_logo_url_not_an_image
	 *
	 * @param int       $attachment_id The attachment ID found for the URL.
	 * @param bool|null $is_valid      Whether the attachment is a valid image, null when it is not checked.
	 *
	 * @return void
	 */
	public function test_update_logo_url_not_an_image( int $attachment_id, ?bool $is_valid ) {
		$this->image_helper->expects( 'get_attachment_by_url' )->once()->with( 'https://example.com/logo.pdf' )->andReturn( $attachment_id );

		if ( $is_valid === null ) {
			$this->image_helper->expects( 'is_valid_attachment' )->never();
		}
		else {
			$this->image_helper->expects( 'is_valid_attachment' )->once()->with( $attachment_id )->andReturn( $is_valid );
		}

		$this->options_helper->expects( 'set' )->once()->with( 'company_name', 'Yoast' )->andReturnTrue();

		$this->options_helper->allows( 'get' )->andReturn( '' );

		$result = $this->instance->update(
			[
				'company_logo' => 'https://example.com/logo.pdf',
				'company_name' => 'Yoast',
			],
		);

		$this->assertSame(
			'The company_logo setting was not changed, because it is not the URL of an image in the media library. The other settings were saved.',
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
	 * Tests that update skips a field whose add-on validator returns a warning, saves the other settings and
	 * returns that warning.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::validate_field
	 *
	 * @return void
	 */
	public function test_update_add_on_validator_warning() {
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
	 * Data provider for test_update_add_on_validator_no_warning.
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
	 * Tests that update saves a field when its add-on validator returns something other than a non-empty string.
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
	public function test_update_add_on_validator_no_warning( $warning ) {
		$this->validators['company_name'] = static function () use ( $warning ) {
			return $warning;
		};

		$this->options_helper->expects( 'set' )->once()->with( 'company_name', 'Yoast' )->andReturnTrue();

		$this->options_helper->allows( 'get' )->andReturn( '' );

		$result = $this->instance->update( [ 'company_name' => 'Yoast' ] );

		$this->assertArrayNotHasKey( 'warning', $result );
	}
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Application\Site_Representation_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map;
use Yoast\WP\SEO\Conditionals\Local_SEO_Active_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
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
	 * The Local SEO active conditional mock.
	 *
	 * @var Mockery\MockInterface|Local_SEO_Active_Conditional
	 */
	private $local_seo_active_conditional;

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

		$this->field_map->allows( 'get_fields' )->andReturn( self::FIELDS );

		$this->instance = new Site_Representation_Updater(
			$this->options_helper,
			$this->field_map,
			$this->local_seo_active_conditional,
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
	 * Tests that update saves the provided settings only, clears the cached meta of the changed logo and
	 * returns all settings cast to their type.
	 *
	 * @covers ::__construct
	 * @covers ::update
	 * @covers ::get_settings
	 *
	 * @return void
	 */
	public function test_update() {
		$this->local_seo_active_conditional->expects( 'is_met' )->never();

		$this->options_helper->expects( 'set' )->once()->with( 'company_or_person', 'company' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'facebook_site', 'https://facebook.com/yoast' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_name', 'Yoast' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_id', 12 )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo_meta', false )->andReturnTrue();
		$this->options_helper->expects( 'set' )->never()->with( 'person_logo_meta', false );

		$this->expect_settings_read(
			[
				'company_or_person'         => 'company',
				'company_name'              => 'Yoast',
				'company_logo'              => 'https://example.com/logo.png',
				'company_logo_id'           => '12',
				'company_or_person_user_id' => false,
				'facebook_site'             => 'https://facebook.com/yoast',
			],
		);

		$this->assertSame(
			[
				'company_or_person'         => 'company',
				'company_name'              => 'Yoast',
				'company_logo'              => 'https://example.com/logo.png',
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
	 * Tests that update sets the site to represent an existing person when Local SEO is not active.
	 *
	 * @covers ::update
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
	 *
	 * @return void
	 */
	public function test_update_person_with_local_seo() {
		$this->local_seo_active_conditional->expects( 'is_met' )->once()->andReturnTrue();

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
	 *
	 * @return void
	 */
	public function test_update_invalid_user() {
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 99 )->andReturnFalse();

		$this->options_helper->expects( 'set' )->once()->with( 'facebook_site', 'https://facebook.com/yoast' )->andReturnTrue();

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
	 *
	 * @return void
	 */
	public function test_update_not_saved() {
		$this->options_helper->expects( 'set' )->once()->with( 'company_or_person', 'company' )->andReturnFalse();
		$this->options_helper->expects( 'set' )->once()->with( 'company_name', 'Yoast' )->andReturnFalse();
		$this->options_helper->expects( 'set' )->once()->with( 'company_logo', 'https://example.com/logo.png' )->andReturnTrue();
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
}

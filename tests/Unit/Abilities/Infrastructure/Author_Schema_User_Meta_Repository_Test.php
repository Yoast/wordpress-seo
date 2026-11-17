<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Schema_User_Meta_Repository;
use Yoast\WP\SEO\Helpers\Sanitization_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Author_Schema_User_Meta_Repository class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Author_Schema_User_Meta_Repository
 */
final class Author_Schema_User_Meta_Repository_Test extends TestCase {

	/**
	 * The ID of the user whose settings are stored.
	 *
	 * @var int
	 */
	private const USER_ID = 7;

	/**
	 * The user helper mock.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	private $user_helper;

	/**
	 * The sanitization helper mock.
	 *
	 * @var Mockery\MockInterface|Sanitization_Helper
	 */
	private $sanitization_helper;

	/**
	 * The instance under test.
	 *
	 * @var Author_Schema_User_Meta_Repository
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->user_helper         = Mockery::mock( User_Helper::class );
		$this->sanitization_helper = Mockery::mock( Sanitization_Helper::class );

		$this->sanitization_helper->allows( 'sanitize_text_field' )->andReturnUsing( 'trim' );

		$this->instance = new Author_Schema_User_Meta_Repository( $this->user_helper, $this->sanitization_helper );
	}

	/**
	 * Tests that get reads the single user meta value keyed by the name of the setting.
	 *
	 * @covers ::__construct
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get() {
		$this->user_helper->expects( 'get_meta' )->once()->with( self::USER_ID, 'wpseo_pronouns', true )->andReturn( 'they/them' );

		$this->assertSame( 'they/them', $this->instance->get( self::USER_ID, 'wpseo_pronouns' ) );
	}

	/**
	 * Data provider for test_save.
	 *
	 * @return array<string, array<string, string|bool>>
	 */
	public static function data_save() {
		return [
			'Saved as provided'      => [
				'value'     => 'they/them',
				'sanitized' => 'they/them',
				'expected'  => true,
			],
			'Sanitized into another' => [
				'value'     => ' they/them ',
				'sanitized' => 'they/them',
				'expected'  => false,
			],
		];
	}

	/**
	 * Tests that save sanitizes and saves the value, and reports whether it was saved as provided.
	 *
	 * @covers ::save
	 * @covers ::get
	 *
	 * @dataProvider data_save
	 *
	 * @param string $value     The value to save.
	 * @param string $sanitized The sanitized value.
	 * @param bool   $expected  Whether the value is saved as provided.
	 *
	 * @return void
	 */
	public function test_save( $value, $sanitized, $expected ) {
		$this->user_helper->expects( 'update_meta' )->once()->with( self::USER_ID, 'wpseo_pronouns', $sanitized );
		$this->user_helper->expects( 'get_meta' )->once()->with( self::USER_ID, 'wpseo_pronouns', true )->andReturn( $sanitized );

		$this->assertSame( $expected, $this->instance->save( self::USER_ID, 'wpseo_pronouns', $value ) );
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Application;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\Doubles\Introductions\User_Allowed_Trait_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the user allowed trait.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\Application\User_Allowed_Trait
 */
final class User_Allowed_Trait_Test extends TestCase {

	/**
	 * Holds the test instance.
	 *
	 * @var User_Allowed_Trait_Double
	 */
	private $instance;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->instance = new User_Allowed_Trait_Double();
	}

	/**
	 * Tests the is user allowed.
	 *
	 * @covers ::is_user_allowed
	 *
	 * @dataProvider is_user_allowed_get_data
	 *
	 * @param array $capabilities     The capabilities to check.
	 * @param array $current_user_can The WP response, per capability. As that is mocked.
	 * @param bool  $expected         The expected result.
	 *
	 * @return void
	 */
	public function test_is_user_allowed( $capabilities, $current_user_can, $expected ) {
		if ( $capabilities ) {
			foreach ( $current_user_can as $capability => $can ) {
				Monkey\Functions\expect( 'current_user_can' )
					->once()
					->with( $capability )
					->andReturn( $can );
			}
		}
		$this->assertSame( $expected, $this->instance->is_user_allowed( $capabilities ) );
	}

	/**
	 * Data provider for the `test_is_user_allowed()` test.
	 *
	 * @return array
	 */
	public static function is_user_allowed_get_data() {
		return [
			'no capabilities'                                => [
				'capabilities'     => [],
				'current_user_can' => [],
				'expected'         => true,
			],
			'can edit_posts'                                 => [
				'capabilities'     => [ 'edit_posts' ],
				'current_user_can' => [
					'edit_posts' => true,
				],
				'expected'         => true,
			],
			'can edit_posts but cannot wpseo_manage_options' => [
				'capabilities'     => [ 'edit_posts', 'wpseo_manage_options' ],
				'current_user_can' => [
					'edit_posts'           => true,
					'wpseo_manage_options' => false,
				],
				'expected'         => false,
			],
		];
	}
}

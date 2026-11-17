<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin;

use Brain\Monkey;
use Mockery;
use RuntimeException;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Tests access to the notification list AJAX handler.
 *
 * @coversDefaultClass Yoast_Notification_Center
 */
final class Notification_Center_Ajax_Test extends TestCase {

	/**
	 * Clears the request data.
	 *
	 * @return void
	 */
	protected function tear_down() {
		unset( $_POST['version'] );

		parent::tear_down();
	}

	/**
	 * Tests that invalid nonces cannot read or consume notifications.
	 *
	 * @covers ::ajax_get_notifications
	 *
	 * @return void
	 */
	public function test_invalid_nonce() {
		$instance = Mockery::mock( Yoast_Notification_Center::class )->makePartial();
		$instance->expects( 'display_notifications' )->never();

		Monkey\Functions\expect( 'check_ajax_referer' )
			->once()
			->with( 'yoast-get-notifications', 'nonce' )
			->andThrow( new RuntimeException( 'Invalid nonce.' ) );
		Monkey\Functions\expect( 'current_user_can' )->never();

		$this->expectException( RuntimeException::class );
		$this->expectExceptionMessage( 'Invalid nonce.' );

		$instance->ajax_get_notifications();
	}

	/**
	 * Tests the access rules for settings managers and content editors.
	 *
	 * @dataProvider provider_capabilities
	 * @covers ::ajax_get_notifications
	 * @covers ::current_user_can_get_notifications
	 *
	 * @param string $capability The user's editing capability, if any.
	 * @param bool   $allowed    Whether the user is allowed to fetch notifications.
	 * @param string $version    Requested response format.
	 *
	 * @return void
	 */
	public function test_capabilities( $capability, $allowed, $version ) {
		$_POST['version'] = $version;

		$instance = Mockery::mock( Yoast_Notification_Center::class )->makePartial();
		$instance->expects( 'display_notifications' )->times( (int) $allowed )->with( $version === '2' );

		Monkey\Functions\expect( 'check_ajax_referer' )->once()->with( 'yoast-get-notifications', 'nonce' )->andReturn( 1 );
		Monkey\Functions\when( 'current_user_can' )->alias(
			static function ( $requested ) use ( $capability ) {
				return $requested === $capability;
			},
		);
		Monkey\Functions\when( 'get_post_types' )->justReturn(
			[
				(object) [ 'cap' => (object) [ 'edit_posts' => 'edit_posts' ] ],
				(object) [ 'cap' => (object) [ 'edit_posts' => 'edit_pages' ] ],
				(object) [ 'cap' => (object) [ 'edit_posts' => 'edit_books' ] ],
			],
		);
		Monkey\Functions\when( 'get_taxonomies' )->justReturn(
			[
				(object) [ 'cap' => (object) [ 'edit_terms' => 'manage_categories' ] ],
				(object) [ 'cap' => (object) [ 'edit_terms' => 'edit_genres' ] ],
			],
		);

		if ( $allowed ) {
			Monkey\Functions\expect( 'wp_die' )->once()->withNoArgs();
		}
		else {
			Monkey\Functions\expect( 'wp_die' )->once()->with( '-1', 403 );
		}

		$instance->ajax_get_notifications();
	}

	/**
	 * Provides settings, standard editor, custom editor and denied roles.
	 *
	 * @return array<string, array{string, bool, string}> The test cases.
	 */
	public static function provider_capabilities() {
		return [
			'settings manager'       => [ 'wpseo_manage_options', true, '2' ],
			'post editor'            => [ 'edit_posts', true, '2' ],
			'page-only editor'       => [ 'edit_pages', true, '2' ],
			'custom post editor'     => [ 'edit_books', true, '2' ],
			'taxonomy editor'        => [ 'manage_categories', true, '2' ],
			'custom taxonomy editor' => [ 'edit_genres', true, '2' ],
			'subscriber'             => [ 'read', false, '2' ],
			'legacy HTML response'   => [ 'edit_posts', true, '1' ],
		];
	}
}

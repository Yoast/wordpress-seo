<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Hold_Back_Premium_Update_Conditional;
use Yoast\WP\SEO\Integrations\Hold_Back_Premium_Update;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit test class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Hold_Back_Premium_Update
 *
 * @group integrations
 */
final class Hold_Back_Premium_Update_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Hold_Back_Premium_Update
	 */
	protected $instance;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Hold_Back_Premium_Update();
	}

	/**
	 * Tests the conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		self::assertEquals(
			[ Hold_Back_Premium_Update_Conditional::class ],
			Hold_Back_Premium_Update::get_conditionals(),
		);
	}

	/**
	 * Tests the hook registration.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Filters\expectAdded( 'pre_set_site_transient_update_plugins' )
			->with( [ $this->instance, 'hold_back_premium_update' ], 11 )
			->once();

		$this->instance->register_hooks();
	}

	/**
	 * Tests that the Premium update is held back only when it is ahead of the available Yoast SEO version.
	 *
	 * @dataProvider hold_back_provider
	 *
	 * @covers ::hold_back_premium_update
	 * @covers ::get_latest_free_version
	 * @covers ::is_ahead_of_free
	 * @covers ::get_major_minor
	 *
	 * @param mixed       $data         The update_plugins transient value.
	 * @param string|null $premium_file The Premium plugin file key, or null when the input is not an object.
	 * @param string      $expected     Where the Premium entry should end up: 'response', 'no_update', or 'unchanged'.
	 * @param string      $message      Message to show when the test fails.
	 *
	 * @return void
	 */
	public function test_hold_back_premium_update( $data, $premium_file, $expected, $message ) {
		$result = $this->instance->hold_back_premium_update( $data );

		if ( $premium_file === null ) {
			self::assertSame( $data, $result, $message );

			return;
		}

		if ( $expected === 'no_update' ) {
			self::assertArrayHasKey( $premium_file, $result->no_update, $message );
			self::assertArrayNotHasKey( $premium_file, $result->response, $message );

			return;
		}

		self::assertArrayHasKey( $premium_file, $result->response, $message );
		self::assertArrayNotHasKey( $premium_file, $result->no_update, $message );
	}

	/**
	 * Provides data for the hold-back test.
	 *
	 * @return array<string, array<string, mixed>> The test data.
	 */
	public static function hold_back_provider() {
		$premium_file = 'wordpress-seo-premium/wp-seo-premium.php';

		$premium = static function ( $version ) use ( $premium_file ) {
			return [
				$premium_file => (object) [
					'slug'        => 'yoast-seo-wordpress-premium',
					'new_version' => $version,
				],
			];
		};
		$free    = static function ( $version ) {
			return [
				\WPSEO_BASENAME => (object) [
					'slug'        => 'wordpress-seo',
					'new_version' => $version,
				],
			];
		};

		return [
			'Premium ahead of Free is moved to no_update' => [
				'data'         => (object) [
					'response'  => $premium( '27.8' ),
					'no_update' => $free( '27.7' ),
				],
				'premium_file' => $premium_file,
				'expected'     => 'no_update',
				'message'      => 'Premium 27.8 must be hidden while the site only sees Free 27.7.',
			],
			'Premium matching Free stays in response' => [
				'data'         => (object) [
					'response'  => $premium( '27.8' ),
					'no_update' => $free( '27.8' ),
				],
				'premium_file' => $premium_file,
				'expected'     => 'response',
				'message'      => 'Premium 27.8 must be shown when Free 27.8 is available.',
			],
			'Premium patch within Free minor stays in response' => [
				'data'         => (object) [
					'response'  => $premium( '27.8.1' ),
					'no_update' => $free( '27.8' ),
				],
				'premium_file' => $premium_file,
				'expected'     => 'response',
				'message'      => 'Premium patch 27.8.1 must be shown when Free 27.8 is available.',
			],
			'Premium shown when Free update of same minor is available' => [
				'data'         => (object) [
					'response'  => \array_merge( $premium( '27.8' ), $free( '27.8' ) ),
					'no_update' => [],
				],
				'premium_file' => $premium_file,
				'expected'     => 'response',
				'message'      => 'Premium 27.8 must be shown when Free 27.8 is itself an available update.',
			],
			'Unknown Free version leaves Premium untouched' => [
				'data'         => (object) [
					'response'  => $premium( '27.8' ),
					'no_update' => [],
				],
				'premium_file' => $premium_file,
				'expected'     => 'response',
				'message'      => 'Without a known Free version the update must not be hidden.',
			],
			'Non-object transient is returned unchanged' => [
				'data'         => false,
				'premium_file' => null,
				'expected'     => 'unchanged',
				'message'      => 'A non-object transient must be returned as-is.',
			],
		];
	}
}

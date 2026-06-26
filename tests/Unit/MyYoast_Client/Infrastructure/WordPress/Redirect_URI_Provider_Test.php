<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\WordPress;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;
use Yoast\WP\SEO\MyYoast_Client\Domain\Resource_Indicator;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\WordPress\Redirect_URI_Provider;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Redirect_URI_Provider class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Infrastructure\WordPress\Redirect_URI_Provider
 */
final class Redirect_URI_Provider_Test extends TestCase {

	/**
	 * The canonical admin callback URL the provider builds.
	 *
	 * @var string
	 */
	private const CANONICAL = 'https://example.com/wp-admin/admin.php?page=wpseo_dashboard&yoast_myyoast_oauth_callback=1';

	/**
	 * The test instance.
	 *
	 * @var Redirect_URI_Provider
	 */
	private $instance;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Redirect_URI_Provider();

		Functions\stubs(
			[
				'get_admin_url' => static function ( $blog_id, $path ) {
					return 'https://example.com/wp-admin/' . $path;
				},
			],
		);
	}

	/**
	 * Tests that get_redirect_uris returns the canonical URL when the filter does not change it.
	 *
	 * @covers ::get_redirect_uris
	 *
	 * @return void
	 */
	public function test_get_redirect_uris_returns_canonical() {
		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_myyoast_redirect_uris', [ self::CANONICAL ] )
			->andReturnFirstArg();

		$this->assertSame( [ self::CANONICAL ], $this->instance->get_redirect_uris() );
	}

	/**
	 * Tests that get_redirect_uris honors a filter that adds a URI, dropping empties and duplicates.
	 *
	 * @covers ::get_redirect_uris
	 *
	 * @return void
	 */
	public function test_get_redirect_uris_honors_filter_additions() {
		Functions\expect( 'apply_filters' )
			->once()
			->andReturn( [ self::CANONICAL, 'https://proxy.example/cb', '', self::CANONICAL ] );

		// Empty strings and duplicates are dropped; first-seen order is preserved.
		$this->assertSame(
			[ self::CANONICAL, 'https://proxy.example/cb' ],
			$this->instance->get_redirect_uris(),
		);
	}

	/**
	 * Tests that get_redirect_uris trims surrounding whitespace and drops whitespace-only URIs.
	 *
	 * @covers ::get_redirect_uris
	 *
	 * @return void
	 */
	public function test_get_redirect_uris_trims_and_drops_blank_uris() {
		Functions\expect( 'apply_filters' )
			->once()
			->andReturn(
				[
					'  https://proxy.example/cb  ',
					'   ',
				],
			);

		$this->assertSame(
			[ 'https://proxy.example/cb' ],
			$this->instance->get_redirect_uris(),
		);
	}

	/**
	 * Tests that get_redirect_uris collapses duplicate URIs returned by the filter into a set.
	 *
	 * @covers ::get_redirect_uris
	 *
	 * @return void
	 */
	public function test_get_redirect_uris_deduplicates() {
		Functions\expect( 'apply_filters' )
			->once()
			->andReturn(
				[
					'https://proxy.example/cb',
					'https://proxy.example/cb',
					'https://other.example/cb',
				],
			);

		$this->assertSame(
			[ 'https://proxy.example/cb', 'https://other.example/cb' ],
			$this->instance->get_redirect_uris(),
		);
	}

	/**
	 * Tests that get_redirect_uris lets the filter remove and replace the canonical URL entirely.
	 *
	 * @covers ::get_redirect_uris
	 *
	 * @return void
	 */
	public function test_get_redirect_uris_allows_replacing_canonical() {
		Functions\expect( 'apply_filters' )
			->once()
			->andReturn( [ 'https://custom.example/cb' ] );

		$this->assertSame(
			[ 'https://custom.example/cb' ],
			$this->instance->get_redirect_uris(),
		);
	}

	/**
	 * Tests that get_redirect_uris falls back to the canonical URL when the filter empties the set,
	 * since at least one redirect URI is required to register.
	 *
	 * @covers ::get_redirect_uris
	 *
	 * @return void
	 */
	public function test_get_redirect_uris_falls_back_to_canonical_when_filter_empties_set() {
		Functions\expect( 'apply_filters' )
			->once()
			->andReturn( [] );

		$this->assertSame( [ self::CANONICAL ], $this->instance->get_redirect_uris() );
	}

	/**
	 * Tests that get_authorization_redirect_uri returns the canonical URL when it is registered.
	 *
	 * @covers ::get_authorization_redirect_uri
	 *
	 * @return void
	 */
	public function test_get_authorization_redirect_uri_prefers_canonical() {
		$client = $this->make_client( [ self::CANONICAL, 'https://proxy.example/cb' ] );

		Functions\expect( 'apply_filters' )
			->once()
			->andReturnFirstArg();

		$result = $this->instance->get_authorization_redirect_uri( $client, 1, [ 'profile' ], Resource_Indicator::default() );

		$this->assertSame( self::CANONICAL, $result );
	}

	/**
	 * Tests that get_authorization_redirect_uri falls back to the first registered URI when the
	 * canonical URL is not registered.
	 *
	 * @covers ::get_authorization_redirect_uri
	 *
	 * @return void
	 */
	public function test_get_authorization_redirect_uri_falls_back_to_first_registered() {
		$client = $this->make_client( [ 'https://proxy.example/cb', 'https://other.example/cb' ] );

		Functions\expect( 'apply_filters' )
			->once()
			->andReturnFirstArg();

		$result = $this->instance->get_authorization_redirect_uri( $client, 1, [ 'profile' ], Resource_Indicator::default() );

		$this->assertSame( 'https://proxy.example/cb', $result );
	}

	/**
	 * Tests that get_authorization_redirect_uri ignores a filtered value that is not registered,
	 * keeping the computed default to avoid an OAuth redirect_uri mismatch.
	 *
	 * @covers ::get_authorization_redirect_uri
	 *
	 * @return void
	 */
	public function test_get_authorization_redirect_uri_ignores_unregistered_filter_value() {
		$client = $this->make_client( [ self::CANONICAL, 'https://proxy.example/cb' ] );

		Functions\expect( 'apply_filters' )
			->once()
			->andReturn( 'https://evil.example/cb' );

		$result = $this->instance->get_authorization_redirect_uri( $client, 1, [ 'profile' ], Resource_Indicator::default() );

		$this->assertSame( self::CANONICAL, $result );
	}

	/**
	 * Tests that get_authorization_redirect_uri honors a filtered value that is registered.
	 *
	 * @covers ::get_authorization_redirect_uri
	 *
	 * @return void
	 */
	public function test_get_authorization_redirect_uri_honors_registered_filter_value() {
		$client = $this->make_client( [ self::CANONICAL, 'https://proxy.example/cb' ] );

		Functions\expect( 'apply_filters' )
			->once()
			->andReturn( 'https://proxy.example/cb' );

		$result = $this->instance->get_authorization_redirect_uri( $client, 1, [ 'profile' ], Resource_Indicator::default() );

		$this->assertSame( 'https://proxy.example/cb', $result );
	}

	/**
	 * Tests that get_authorization_redirect_uri defaults to the canonical URL when the client has
	 * no registered redirect URIs at all.
	 *
	 * @covers ::get_authorization_redirect_uri
	 *
	 * @return void
	 */
	public function test_get_authorization_redirect_uri_defaults_to_canonical_when_none_registered() {
		$client = $this->make_client( [] );

		Functions\expect( 'apply_filters' )
			->once()
			->andReturnFirstArg();

		$result = $this->instance->get_authorization_redirect_uri( $client, 1, [ 'profile' ], Resource_Indicator::default() );

		$this->assertSame( self::CANONICAL, $result );
	}

	/**
	 * Builds a Registered_Client with the given registered redirect URIs.
	 *
	 * @param string[] $redirect_uris The registered redirect URIs.
	 *
	 * @return Registered_Client
	 */
	private function make_client( array $redirect_uris ): Registered_Client {
		return new Registered_Client(
			'cid',
			'rat',
			'https://my.yoast.com/api/oauth/reg/cid',
			[ 'redirect_uris' => $redirect_uris ],
		);
	}
}

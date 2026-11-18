<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Redirect_URI_Provider_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Status_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Status_Presenter class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\User_Interface\Status_Presenter
 */
final class Status_Presenter_Test extends TestCase {

	private const CURRENT_REDIRECT_URI = 'https://example.com/wp-admin/admin.php?page=wpseo_dashboard&yoast_myyoast_oauth_callback=1';

	/**
	 * The client registration mock.
	 *
	 * @var Client_Registration_Interface|Mockery\MockInterface
	 */
	private $client_registration;

	/**
	 * The issuer config mock.
	 *
	 * @var Issuer_Config|Mockery\MockInterface
	 */
	private $issuer_config;

	/**
	 * The redirect URI provider mock.
	 *
	 * @var Redirect_URI_Provider_Interface|Mockery\MockInterface
	 */
	private $redirect_uri_provider;

	/**
	 * The instance under test.
	 *
	 * @var Status_Presenter
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->client_registration   = Mockery::mock( Client_Registration_Interface::class );
		$this->issuer_config         = Mockery::mock( Issuer_Config::class );
		$this->redirect_uri_provider = Mockery::mock( Redirect_URI_Provider_Interface::class );

		$this->instance = new Status_Presenter(
			$this->client_registration,
			$this->issuer_config,
			$this->redirect_uri_provider,
		);

		Monkey\Functions\stubs(
			[
				'wp_parse_url' => static function ( $url ) {
					return \parse_url( $url );
				},
			],
		);
	}

	/**
	 * Tests the not-provisioned, not-registered branch.
	 *
	 * @covers ::__construct
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present_when_not_provisioned() {
		$this->issuer_config->shouldReceive( 'get_software_statement' )->andReturn( '' );
		$this->issuer_config->shouldReceive( 'get_initial_access_token' )->andReturn( '' );
		$this->client_registration->shouldReceive( 'get_registered_client' )->andReturn( null );

		$result = $this->instance->present();

		$this->assertFalse( $result['is_provisioned'] );
		$this->assertFalse( $result['is_registered'] );
		$this->assertNull( $result['registered_at'] );
		$this->assertNull( $result['registered_at_iso'] );
		$this->assertSame( [], $result['redirect_uris'] );
		$this->assertTrue( $result['redirect_uris_match'] );
	}

	/**
	 * Tests the provisioned but not-yet-registered branch.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present_when_provisioned_but_not_registered() {
		$this->issuer_config->shouldReceive( 'get_software_statement' )->andReturn( 'jwt' );
		$this->issuer_config->shouldReceive( 'get_initial_access_token' )->andReturn( 'iat' );
		$this->client_registration->shouldReceive( 'get_registered_client' )->andReturn( null );

		$result = $this->instance->present();

		$this->assertTrue( $result['is_provisioned'] );
		$this->assertFalse( $result['is_registered'] );
		$this->assertNull( $result['registered_at'] );
		$this->assertSame( [], $result['redirect_uris'] );
		$this->assertTrue( $result['redirect_uris_match'] );
	}

	/**
	 * Tests the registered branch where the stored redirect URIs include the
	 * currently-computed one — redirect_uris_match should be true.
	 *
	 * @covers ::present
	 * @covers ::extract_registered_at
	 * @covers ::extract_redirect_uris
	 * @covers ::extract_origin
	 * @covers ::redirect_uris_match
	 *
	 * @return void
	 */
	public function test_present_when_registered_with_matching_uri() {
		$this->issuer_config->shouldReceive( 'get_software_statement' )->andReturn( 'jwt' );
		$this->issuer_config->shouldReceive( 'get_initial_access_token' )->andReturn( 'iat' );

		$staging_uri = 'https://staging.example.com/wp-admin/admin.php?page=wpseo_dashboard';
		$this->redirect_uri_provider
			->shouldReceive( 'get_redirect_uris' )
			->andReturn( [ self::CURRENT_REDIRECT_URI, $staging_uri ] );

		// The current URI has completed an authorization-code flow; the staging one has not.
		$registered_client = new Registered_Client(
			'client-123',
			'rat',
			'https://my.yoast.com/clients/client-123',
			[
				'client_id_issued_at' => 1_731_369_600,
				'redirect_uris'       => [
					self::CURRENT_REDIRECT_URI,
					$staging_uri,
				],
			],
			[ self::CURRENT_REDIRECT_URI ],
		);

		$this->client_registration->shouldReceive( 'get_registered_client' )->andReturn( $registered_client );

		$result = $this->instance->present();

		$this->assertTrue( $result['is_provisioned'] );
		$this->assertTrue( $result['is_registered'] );
		$this->assertSame( 1_731_369_600, $result['registered_at'] );
		$this->assertIsString( $result['registered_at_iso'] );
		$this->assertSame(
			[
				[
					'uri'         => self::CURRENT_REDIRECT_URI,
					'origin'      => 'https://example.com',
					'is_verified' => true,
				],
				[
					'uri'         => $staging_uri,
					'origin'      => 'https://staging.example.com',
					'is_verified' => false,
				],
			],
			$result['redirect_uris'],
		);
		$this->assertTrue( $result['redirect_uris_match'] );
	}

	/**
	 * Tests the registered branch where the site URL has drifted (the
	 * currently-computed redirect URI is no longer in the stored list).
	 *
	 * @covers ::present
	 * @covers ::redirect_uris_match
	 *
	 * @return void
	 */
	public function test_present_when_registered_with_drifted_uri() {
		$this->issuer_config->shouldReceive( 'get_software_statement' )->andReturn( 'jwt' );
		$this->issuer_config->shouldReceive( 'get_initial_access_token' )->andReturn( 'iat' );
		$this->redirect_uri_provider
			->shouldReceive( 'get_redirect_uris' )
			->andReturn( [ 'https://new-domain.example.com/wp-admin/admin.php?page=wpseo_dashboard&yoast_myyoast_oauth_callback=1' ] );

		$registered_client = new Registered_Client(
			'client-123',
			'rat',
			'https://my.yoast.com/clients/client-123',
			[
				'redirect_uris' => [ self::CURRENT_REDIRECT_URI ],
			],
		);

		$this->client_registration->shouldReceive( 'get_registered_client' )->andReturn( $registered_client );

		$result = $this->instance->present();

		$this->assertTrue( $result['is_registered'] );
		$this->assertFalse( $result['redirect_uris_match'] );
	}

	/**
	 * Tests that absent `client_id_issued_at` falls back to null.
	 *
	 * @covers ::extract_registered_at
	 *
	 * @return void
	 */
	public function test_present_when_registered_without_issued_at() {
		$this->issuer_config->shouldReceive( 'get_software_statement' )->andReturn( 'jwt' );
		$this->issuer_config->shouldReceive( 'get_initial_access_token' )->andReturn( 'iat' );
		$this->redirect_uri_provider
			->shouldReceive( 'get_redirect_uris' )
			->andReturn( [ self::CURRENT_REDIRECT_URI ] );

		$registered_client = new Registered_Client(
			'client-123',
			'rat',
			'https://my.yoast.com/clients/client-123',
			[
				'redirect_uris' => [ self::CURRENT_REDIRECT_URI ],
			],
		);

		$this->client_registration->shouldReceive( 'get_registered_client' )->andReturn( $registered_client );

		$result = $this->instance->present();

		$this->assertNull( $result['registered_at'] );
		$this->assertNull( $result['registered_at_iso'] );
	}
}

<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\Tests\Oauth
 */

namespace Yoast\Tests\UnitTests\Oauth;

use Yoast\WP\Free\Oauth\Client;
use YoastSEO_Vendor\League\OAuth2\Client\Provider\GenericProvider;
use YoastSEO_Vendor\League\OAuth2\Client\Token\AccessToken;

/**
 * Class Oauth_Test
 *
 * @group oauth
 */
class Oauth_Test extends \PHPUnit_Framework_TestCase {

	/**
	 * @var Client
	 */
	protected $class_instance;

	/**
	 * Sets up the test instance.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = new Client();
	}


	/**
	 * Resets the config on tearDown.
	 *
	 * @return void
	 */
	public function tearDown() {
		parent::tearDown();

		$this->class_instance->save_configuration(
			[
				'clientId' => null,
				'secret'   => null,
			]
		);
	}

	/**
	 * @dataProvider save_configuration_provider
	 *
	 * @param array  $config          The config to save.
	 * @param array  $expected_config The expected config.
	 * @param string $message         The message to show when test fails.
	 *
	 * @covers \Yoast\WP\Free\Oauth\Client::save_configuration
	 * @covers \Yoast\WP\Free\Oauth\Client::get_configuration
	 */
	public function test_save_configuration( array $config, array $expected_config, $message ) {
		$this->class_instance->save_configuration( $config );

		$this->assertEquals(
			$expected_config,
			$this->class_instance->get_configuration(),
			$message
		);
	}

	/**
	 * Tests if configuration is set correctly without setting the config before.
	 *
	 * @covers \Yoast\WP\Free\Oauth\Client::has_configuration
	 */
	public function test_has_configuration_with_no_config_being_set() {
		$this->assertFalse( $this->class_instance->has_configuration() );
	}

	/**
	 * Tests if configuration is set correctly with only have set the clientId before.
	 *
	 * @covers \Yoast\WP\Free\Oauth\Client::has_configuration
	 */
	public function test_has_configuration_with_clientId_only_set() {
		$this->class_instance->save_configuration( [ 'clientId' => 123456789 ] );

		$this->assertFalse( $this->class_instance->has_configuration() );
	}

	/**
	 * Tests if configuration is set correctly with only have set the secret before.
	 *
	 * @covers \Yoast\WP\Free\Oauth\Client::has_configuration
	 */
	public function test_has_configuration_with_secret_only_set() {
		$this->class_instance->save_configuration( [ 'secret' => 's3cr31' ] );

		$this->assertFalse( $this->class_instance->has_configuration() );
	}

	/**
	 * Tests if configuration is set correctly with having set the clientId and secret before.
	 *
	 * @covers \Yoast\WP\Free\Oauth\Client::has_configuration
	 */
	public function test_has_configuration_with_config_set_correctly() {
		$this->class_instance->save_configuration( [ 'clientId' => 123456789 , 'secret' => 's3cr31' ] );

		$this->assertTrue( $this->class_instance->has_configuration() );
	}

	/**
	 * Tests retrieval of the access token when no token was saved before.
	 *
	 * @covers \Yoast\WP\Free\Oauth\Client::get_access_token
	 */
	public function test_get_access_token_with_no_set_access_tokens() {
		$this->assertFalse( $this->class_instance->get_access_token() );
	}

	/**
	 * Tests retrieval of the access token when a token has been set.
	 *
	 * @covers \Yoast\WP\Free\Oauth\Client::get_access_token
	 * @covers \Yoast\WP\Free\Oauth\Client::save_access_token
	 */
	public function test_get_access_token_with_set_access_tokens() {
		$this->class_instance->save_access_token( 1, new AccessToken( [ 'access_token' => 'this-is-a-token' ] ) );

		$this->assertEquals( 'this-is-a-token', $this->class_instance->get_access_token() );
	}

	/**
	 * Tests retrieval of the access token for a specific user.
	 *
	 * @covers \Yoast\WP\Free\Oauth\Client::get_access_token
	 * @covers \Yoast\WP\Free\Oauth\Client::save_access_token
	 */
	public function test_get_access_token_for_user() {
		$this->class_instance->save_access_token( 1, new AccessToken( [ 'access_token' => 't0k3n' ] ) );

		$this->assertEquals( 't0k3n', $this->class_instance->get_access_token( 1 ) );

	}

	/**
	 * Tests retrieval of the access token for a user that isn't set.
	 *
	 * @covers \Yoast\WP\Free\Oauth\Client::get_access_token
	 */
	public function test_get_access_token_for_unexisting_user() {
		$this->assertFalse( $this->class_instance->get_access_token( 3 ) );
	}

	/**
	 * Tests retrieval of the provider.
	 *
	 * @covers \Yoast\WP\Free\Oauth\Client::get_provider
	 */
	public function test_get_provider() {
		$this->class_instance->save_configuration( [ 'clientId' => 123456789 , 'secret' => 's3cr31' ] );

		$this->assertInstanceOf(
			GenericProvider::class,
			$this->class_instance->get_provider()
		);
	}

	/**
	 * Provider for the save_configuration tests.
	 *
	 * @return array The data to use.
	 */
	public function save_configuration_provider() {
		return [
			[
				'configuration' => [ 'clientId' => 123456789 ],
				'expected'      => [ 'clientId' => 123456789, 'secret' => null ],
				'message'       => 'Tests saving the clientId only.',
			],
			[
				'configuration' => [ 'secret' => 's3cRe1' ],
				'expected'      => [ 'clientId' => null, 'secret' => 's3cRe1' ],
				'message'       => 'Tests saving the secret only.',
			],
			[
				'configuration' => [ 'these' => 'fields', 'are' => 'wrong', 'without a key' ],
				'expected'      => [ 'clientId' => null, 'secret' => null ],
				'message'       => 'Tests saving config with unwanted fields.',
			],
			[
				'configuration' => [ 'keyless', 'clientId' => 123456789 ],
				'expected'      => [ 'clientId' => 123456789, 'secret' => null ],
				'message'       => 'Tests saving config with unwanted fields.',
			],
		];
	}
}

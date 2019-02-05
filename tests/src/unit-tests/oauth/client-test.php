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

		$this->class_instance =  new Client();
	}

	/**
	 * Resets the config on tearDown.
	 *
	 * @return void
	 */
	public function tearDown() {
		parent::tearDown();

		$this->class_instance->clear_configuration();
	}

	/**
	 * Tests the formatting of the access token.
	 *
	 * @covers \Yoast\WP\Free\Oauth\Client::format_access_tokens
	 */
	public function test_format_access_tokens() {
		$class_instance = new \Yoast\Tests\Doubles\Oauth\Client();

		$access_tokens = [
			1 => [ 'access_token' => 'this-is-a-token' ],
		];

		$this->assertEquals(
			[
				1 => new AccessToken( [ 'access_token' => 'this-is-a-token' ] ),
			],
			$class_instance->format_access_tokens( $access_tokens )
		);
	}

	/**
	 * Tests the formatting of the access token with an non array argument given.
	 *
	 * @covers \Yoast\WP\Free\Oauth\Client::format_access_tokens
	 */
	public function test_format_access_tokens_with_invalid_argument() {
		$class_instance = new \Yoast\Tests\Doubles\Oauth\Client();

		$this->assertEquals( [], $class_instance->format_access_tokens( false ) );
	}

	/**
	 * Tests the formatting of the access token with an empty array given as argument.
	 *
	 * @covers \Yoast\WP\Free\Oauth\Client::format_access_tokens
	 */
	public function test_format_access_tokens_with_empty_array_as_argument() {
		$class_instance = new \Yoast\Tests\Doubles\Oauth\Client();

		$this->assertEquals( [], $class_instance->format_access_tokens( [] ) );
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
	 * Tests if the configation has been cleared correctly.
	 *
	 * @covers \Yoast\WP\Free\Oauth\Client::clear_configuration
	 */
	public function test_clear_configuration() {
		$this->class_instance->save_configuration( [ 'clientId' => 123456789 , 'secret' => 's3cr31' ] );
		$this->assertTrue( $this->class_instance->has_configuration() );

		$this->class_instance->clear_configuration();
		$this->assertFalse( $this->class_instance->has_configuration() );
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
	 * Tests retrieval of the access token for a user that isn't set.
	 *
	 * @covers \Yoast\WP\Free\Oauth\Client::remove_access_token
	 */
	public function test_remove_access_token_for_non_existing_user_id() {
		$class_instance = $this
			->getMockBuilder( Client::class )
			->setMethods( [ 'update_option' ] )
			->enableOriginalConstructor()
			->getMock();

		$class_instance
			->expects( $this->never() )
			->method( 'update_option' );

		$class_instance->remove_access_token( 100 );
	}

	/**
	 * Tests retrieval of the access token for a user that isn't set.
	 *
	 * @covers \Yoast\WP\Free\Oauth\Client::remove_access_token
	 */
	public function test_remove_access_token_for_user_id() {
		$class_instance = $this
			->getMockBuilder( Client::class )
			->setMethods( [ 'update_option' ] )
			->enableOriginalConstructor()
			->getMock();

		$class_instance
			->expects( $this->exactly( 2 ) )
			->method( 'update_option' );

		$class_instance->save_access_token( 2, new AccessToken( [ 'access_token' => 't0k3n' ] ) );
		$class_instance->remove_access_token( 2 );
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

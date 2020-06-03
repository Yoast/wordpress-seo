<?php

namespace Yoast\WP\SEO\Tests\Config;

use League\OAuth2\Client\Token\AccessTokenInterface;
use Mockery;
use Yoast\WP\SEO\Config\SEMrush_Token_Manager;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class SEMrush_Token_Manager_Test.
 *
 * @group semrush
 *
 * @coversDefaultClass \Yoast\WP\SEO\Config\SEMrush_Token_Manager
 */
class SEMrush_Token_Manager_Test extends TestCase {

	/**
	 * @var AccessTokenInterface|Mockery\LegacyMockInterface|Mockery\MockInterface
	 */
	private $oauth_response;

	/**
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->oauth_response = Mockery::mock( AccessTokenInterface::class );
		$this->options_helper = Mockery::mock( Options_Helper::class );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->oauth_response->allows( [
			'getToken'        => '000000',
			'getRefreshToken' => '000001',
			'getExpires'      => 604800,
			'hasExpired'      => false,
		] );

		$new_instance = new SEMrush_Token_Manager( $this->oauth_response, $this->options_helper );

		$this->assertEquals( '000000', $new_instance->get_access_token() );
		$this->assertEquals( '000001', $new_instance->get_refresh_token() );
		$this->assertEquals( 604800, $new_instance->get_expires() );
		$this->assertEquals( false, $new_instance->has_expired() );

		$this->assertInstanceOf( AccessTokenInterface::class, $new_instance->get_original_response() );
	}

	/**
	 * Tests that the constructor throws an exception if the token turns out to have expired.
	 *
	 * @covers ::__construct
	 * @expectedException Yoast\WP\SEO\Exceptions\OAuth\OAuth_Expired_Token_Exception
	 */
	public function test_constructor_with_expired_token() {
		$this->oauth_response->allows( [
			'getToken'        => '000000',
			'getRefreshToken' => '000001',
			'getExpires'      => 604800,
			'hasExpired'      => true,
		] );

		$new_instance = new SEMrush_Token_Manager( $this->oauth_response, $this->options_helper );
	}

	/**
	 * Tests that the storing of a token is successful.
	 *
	 * @covers ::store
	 */
	public function test_successful_token_store() {
		$this->oauth_response->allows( [
			'getToken'        => '000000',
			'getRefreshToken' => '000001',
			'getExpires'      => 604800,
			'hasExpired'      => false,
		] );

		$this->options_helper
			->expects( 'set' )
			->with( 'yst_semrush_tokens', [
				'access_token'  => '000000',
				'refresh_token' => '000001',
				'expires'       => '604800',
				'has_expired'   => false,
			] )->andReturn( true );

		$new_instance = new SEMrush_Token_Manager( $this->oauth_response, $this->options_helper );

		$this->assertTrue( $new_instance->store() );
	}

	/**
	 * Tests that the storing of a token is unsuccessful.
	 *
	 * @covers ::store
	 * @expectedException Yoast\WP\SEO\Exceptions\OAuth\OAuth_Failed_Token_Storage_Exception
	 */
	public function test_unsuccessful_token_store() {
		$this->oauth_response->allows( [
			'getToken'        => '000000',
			'getRefreshToken' => '000001',
			'getExpires'      => 604800,
			'hasExpired'      => false,
		] );

		$this->options_helper
			->expects( 'set' )
			->with( 'yst_semrush_tokens', [
				'access_token'  => '000000',
				'refresh_token' => '000001',
				'expires'       => '604800',
				'has_expired'   => false,
			] )->andReturn( null );

		$new_instance = new SEMrush_Token_Manager( $this->oauth_response, $this->options_helper );

		$this->assertFalse( $new_instance->store() );
	}

	/**
	 * Tests that the retrieval of a token is successful.
	 *
	 * @covers ::get_from_storage
	 */
	public function test_successful_token_retrieval() {
		$this->oauth_response->allows( [
			'getToken'        => '000000',
			'getRefreshToken' => '000001',
			'getExpires'      => 604800,
			'hasExpired'      => false,
		] );

		$this->options_helper
			->expects( 'get' )
			->with( 'yst_semrush_tokens' )
			->andReturn( [
				'access_token'  => '000000',
				'refresh_token' => '000001',
				'expires'       => '604800',
				'has_expired'   => false,
			] );

		// Existing instance
		$new_instance = new SEMrush_Token_Manager( $this->oauth_response, $this->options_helper );

		$this->assertEquals( [
			'access_token'  => '000000',
			'refresh_token' => '000001',
			'expires'       => '604800',
			'has_expired'   => false,
		], $new_instance->get_from_storage() );
	}

	/**
	 * Tests that the retrieval of a token is unsuccessful, which means that no value is set, resulting in an empty array.
	 *
	 * @covers ::get_from_storage
	 */
	public function test_unsuccessful_token_retrieval_returns_empty_array() {
		$this->oauth_response->allows( [
			'getToken'        => '000000',
			'getRefreshToken' => '000001',
			'getExpires'      => 604800,
			'hasExpired'      => false,
		] );

		$this->options_helper
			->expects( 'get' )
			->with( 'yst_semrush_tokens' )
			->andReturn( null );

		// Existing instance
		$new_instance = new SEMrush_Token_Manager( $this->oauth_response, $this->options_helper );

		$this->assertEquals( [], $new_instance->get_from_storage() );
	}
}

<?php

/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc
 */

/**
 * Unit Test Class.
 *
 * @group test
 */
class WPSEO_Addon_Manager_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests retrieval of site information that will return the defaults.
	 *
	 * @covers WPSEO_Addon_Manager::get_site_information
	 */
	public function test_get_site_information_return_defaults() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'request_current_sites' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'request_current_sites' )
			->will( $this->returnValue( false ) );

		$this->assertEquals(
			(object) array(
				'url'           => WPSEO_Utils::get_home_url(),
				'subscriptions' => array(),
			),
			$instance->get_site_information()
		);
	}

	/**
	 * Tests retrieval of the site information that will return the api request value.
	 *
	 * @covers WPSEO_Addon_Manager::get_site_information
	 */
	public function test_get_site_information_return_api_request_value() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'request_current_sites' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'request_current_sites' )
			->will( $this->returnValue(
				(object) array(
					'url'           => 'https://example.org',
					'subscriptions' => array( 'subscription' ),
				)
			) );

		$this->assertEquals(
			(object) array(
				'url'           => 'https://example.org',
				'subscriptions' => array( 'subscription' ),
			),
			$instance->get_site_information()
		);
	}

	/**
	 * @covers WPSEO_Addon_Manager::get_site_information
	 */
	public function test_get_site_information_return_transient_value() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_site_information_transient' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_site_information_transient' )
			->will( $this->returnValue(
				(object) array(
					'url'           => 'https://example.org',
					'subscriptions' => array( 'subscription' ),
				)
			) );

		$this->assertEquals(
			(object) array(
				'url'           => 'https://example.org',
				'subscriptions' => array( 'subscription' ),
			),
			$instance->get_site_information()
		);
	}

	/**
	 * @covers WPSEO_Addon_Manager::get_subscriptions
	 */
	public function test_get_subscriptions() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_site_information' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_site_information' )
			->will( $this->returnValue(
				(object) array(
					'url'           => 'https://example.org',
					'subscriptions' => array( 'subscription' ),
				)
			) );

		$this->assertEquals(
			array( 'subscription' ),
			$instance->get_subscriptions()
		);
	}

	/**
	 * @covers WPSEO_Addon_Manager::get_subscription
	 */
	public function test_get_subscription() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_subscriptions' ) )
			->getMock();

		$subscription = (object) array(
			'product' => (object) array(
				'slug' => 'wordpress-seo',
			),
		);

		$instance
			->expects( $this->once() )
			->method( 'get_subscriptions' )
			->will( $this->returnValue(
				(object) array(
					'wordpress-seo' => $subscription,
				)
			) );

		$this->assertEquals(
			$subscription,
			$instance->get_subscription( 'wordpress-seo' )
		);
	}

	/**
	 * @covers WPSEO_Addon_Manager::get_subscription
	 */
	public function test_get_subscription_not_found() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_subscriptions' ) )
			->getMock();

		$subscription = (object) array(
			'product' => (object) array(
				'slug' => 'wordpress-seo',
			),
		);

		$instance
			->expects( $this->once() )
			->method( 'get_subscriptions' )
			->will( $this->returnValue(
				(object) array(
					'wordpress-seo' => $subscription,
				)
			) );

		$this->assertEquals(
			new stdClass(),
			$instance->get_subscription( 'wordpress-seo-extra' )
		);
	}




}
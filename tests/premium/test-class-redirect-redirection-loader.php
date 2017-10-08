<?php
/**
 * @package WPSEO\Tests\Premium
 */

class WPSEO_RedirectionDatabaseMock {
	public $prefix = 'bamboozled';

	private $results;

	public function __construct( $results ) {
		$this->results = $results;
	}

	public function get_results( $query ) {
		return $this->results;
	}
}

/**
 * Test class for the redirection loader.
 *
 * @covers WPSEO_Redirect_Redirection_Loader
 */
class WPSEO_Redirect_Redirection_Loader_Test extends WPSEO_UnitTestCase {
	/**
	 * Tests loading Redirection redirects without regexes.
	 */
	public function test_simple_load() {
		$db = new WPSEO_RedirectionDatabaseMock( array(
			(object) array(
				'url'         => '/origin1',
				'action_data' => '/target1',
				'regex'       => 0,
				'action_code' => 301,
			),
			(object) array(
				'url'         => '/origin2',
				'action_data' => '/target2',
				'regex'       => 0,
				'action_code' => 301,
			),
		) );

		$instance = new WPSEO_Redirect_Redirection_Loader( $db );
		$redirects = $instance->load();

		$this->assertCount( 2, $redirects );

		foreach ( $redirects as $redirect ) {
			$this->assertInstanceOf( 'WPSEO_Redirect', $redirect );
			$this->assertEquals( WPSEO_Redirect::PERMANENT, $redirect->get_type() );
			$this->assertEquals( WPSEO_Redirect::FORMAT_PLAIN, $redirect->get_format() );
		}
		$this->assertEquals( 'origin1', $redirects[0]->get_origin() );
		$this->assertEquals( 'target1', $redirects[0]->get_target() );

		$this->assertEquals( 'origin2', $redirects[1]->get_origin() );
		$this->assertEquals( 'target2', $redirects[1]->get_target() );
	}

	/**
	 * Tests loading Redirection redirects with regexes.
	 */
	public function test_regex_load() {
		$db = new WPSEO_RedirectionDatabaseMock( array(
			(object) array(
				'url'         => '/origin',
				'action_data' => '/target',
				'regex'       => 0,
				'action_code' => 301,
			),
			(object) array(
				'url'         => '/origin(\d+)',
				'action_data' => '/target',
				'regex'       => 1,
				'action_code' => 301,
			),
		) );

		$instance = new WPSEO_Redirect_Redirection_Loader( $db );
		$redirects = $instance->load();

		$this->assertCount( 2, $redirects );

		foreach ( $redirects as $redirect ) {
			$this->assertInstanceOf( 'WPSEO_Redirect', $redirect );
			$this->assertEquals( WPSEO_Redirect::PERMANENT, $redirect->get_type() );
		}
		$this->assertEquals( 'origin', $redirects[0]->get_origin() );
		$this->assertEquals( 'target', $redirects[0]->get_target() );
		$this->assertEquals( WPSEO_Redirect::FORMAT_PLAIN, $redirects[0]->get_format() );

		$this->assertEquals( '/origin(\d+)', $redirects[1]->get_origin() );
		$this->assertEquals( 'target', $redirects[1]->get_target() );
		$this->assertEquals( WPSEO_Redirect::FORMAT_REGEX, $redirects[1]->get_format() );
	}

	/**
	 * Tests loading Redirection redirects with bad status codes.
	 */
	public function test_bad_status_code_load() {
		$db = new WPSEO_RedirectionDatabaseMock( array(
			(object) array(
				'url'         => '/origin1',
				'action_data' => '/target1',
				'regex'       => 0,
				'action_code' => 301,
			),
			(object) array(
				'url'         => '/origin2',
				'action_data' => '/target2',
				'regex'       => 0,
				'action_code' => 9000,
			),
		) );

		$instance = new WPSEO_Redirect_Redirection_Loader( $db );
		$redirects = $instance->load();

		$this->assertCount( 1, $redirects );
	}
}

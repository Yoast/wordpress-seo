<?php
/**
 * @package WPSEO\Unittests
 */

class WPSEO_OnPage_Request_Double extends WPSEO_OnPage_Request {

	/**
	 * Overwrite the get_remote method, because this is a dependency.
	 *
	 * @param string $target_url
	 * @param array  $parameters
	 *
	 * @return array
	 */
	protected function get_remote( $target_url, $parameters = array() ) {
		$remote_data = array(
			'is_indexable'    => '0',
			'passes_juice_to' => '',
		);

		switch ( $target_url ) {
			case home_url() :
				$remote_data['is_indexable'] = '1';
				break;

			case 'http:://will-be-redirected.wp' :
				$remote_data = array(
					'is_indexable'    => '0',
					'passes_juice_to' => 'http://is-redirected.wp',
				);
				break;

			case 'http://is-redirected.wp' :
				$remote_data['is_indexable'] = '1';
				break;

			case 'http://not_indexable.wp' :
				// Do noting.
				break;
		}

		return $remote_data;

	}

}

class WPSEO_OnPage_Request_Test extends WPSEO_UnitTestCase {

	/**
	 * Test if there is a response
	 *
	 * @covers WPSEO_OnPage_Request::get_response
	 */
	public function test_get_response() {
		$request = new WPSEO_OnPage_Request_Double();

		$this->assertEquals( $request->do_request( home_url() ), array( 'is_indexable' => '1', 'passes_juice_to' => '' ) );
	}

	/**
	 * Test if there is a response for an url that will be redirected
	 *
	 * @covers WPSEO_OnPage_Request::get_response
	 */
	public function test_get_response_redirected() {
		$request = new WPSEO_OnPage_Request_Double();

		$this->assertEquals( $request->do_request( 'http:://will-be-redirected.wp' ), array( 'is_indexable' => '1', 'passes_juice_to' => '' ) );
	}

	/**
	 * Test if there is a response for a domain that isn't 'indexable'
	 *
	 * @covers WPSEO_OnPage_Request::get_response
	 */
	public function test_get_response_not_indexable() {
		$request = new WPSEO_OnPage_Request_Double();

		$this->assertEquals( $request->do_request( 'http://not_indexable.wp' ), array( 'is_indexable' => '0', 'passes_juice_to' => '' ) );
	}

}

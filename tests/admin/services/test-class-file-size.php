<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit Test Class.
 */
class WPSEO_File_Size_Service_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the retrieval of the file size for external hosted file.
	 *
	 * @covers WPSEO_File_Size_Service::get
	 */
	public function test_get_for_externally_hosted_file() {
		$request = new WP_REST_Request();
		$request->set_param( 'url', 'external.file' );

		$instance = $this
			->getMockBuilder( 'WPSEO_File_Size_Service' )
			->setMethods( array( 'is_externally_hosted' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'is_externally_hosted' )
			->will( $this->returnValue( true ) );

		$response = $instance->get( $request );

		$this->assertEquals( 'failure', $response->data['type'] );
		$this->assertEquals( 'Cannot get the size of external.file because it is hosted externally.', $response->data['response'] );
	}

	/**
	 * Tests the retrieval of the file size when unknown error occurs.
	 *
	 * @covers WPSEO_File_Size_Service::get
	 */
	public function test_get_with_unknown_failure() {
		$instance = $this
			->getMockBuilder( 'WPSEO_File_Size_Service' )
			->setMethods( array( 'get_file_url', 'calculate_file_size' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_file_url' )
			->will( $this->returnValue( 'unknown.file' ) );

		$instance
			->expects( $this->once() )
			->method( 'calculate_file_size' )
			->will( $this->returnValue( false ) );

		$response = $instance->get( new WP_REST_Request() );

		$this->assertEquals( 'failure', $response->data['type'] );
		$this->assertEquals( 'Cannot get the size of unknown.file because of unknown reasons.', $response->data['response'] );
	}

	/**
	 * Tests the retrieval of the file size is successful.
	 *
	 * @covers WPSEO_File_Size_Service::get
	 */
	public function test_get_on_success() {
		$instance = $this
			->getMockBuilder( 'WPSEO_File_Size_Service' )
			->setMethods( array( 'get_file_url', 'get_file_size' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_file_url' )
			->will( $this->returnValue( 'local.file' ) );

		$instance
			->expects( $this->once() )
			->method( 'get_file_size' )
			->will( $this->returnValue( 2048 ) );

		$response = $instance->get( new WP_REST_Request() );

		$this->assertEquals( 'success', $response->data['type'] );
		$this->assertEquals( 2048, $response->data['size_in_bytes'] );
	}

	/**
	 * Tests the retrieval of the file url for external hosted file.
	 *
	 * @covers WPSEO_File_Size_Service::get
	 * @covers WPSEO_File_Size_Service::get_file_url
	 */
	public function test_get_file_url_for_externally_hosted_file() {
		$request = new WP_REST_Request();
		$request->set_param( 'url', 'https://extern.al/external.file' );

		$instance = $this
			->getMockBuilder( 'WPSEO_File_Size_Service' )
			->setMethods( array( 'is_externally_hosted' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'is_externally_hosted' )
			->will( $this->returnValue( true ) );

		$response = $instance->get( $request );

		$this->assertEquals( 'failure', $response->data['type'] );
		$this->assertEquals( 'Cannot get the size of https://extern.al/external.file because it is hosted externally.', $response->data['response'] );
	}

	/**
	 * Tests the retrieval of the file url for external hosted file.
	 *
	 * @covers WPSEO_File_Size_Service::get
	 * @covers WPSEO_File_Size_Service::get_file_url
	 */
	public function test_get_file_url_for_local_file() {
		$request = new WP_REST_Request();
		$request->set_param( 'url', 'local.file' );

		$instance = $this
			->getMockBuilder( 'WPSEO_File_Size_Service' )
			->setMethods( array( 'is_externally_hosted', 'get_file_size' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'is_externally_hosted' )
			->will( $this->returnValue( false ) );

		$instance
			->expects( $this->once() )
			->method( 'get_file_size' )
			->will( $this->returnValue( 2048 ) );

		$response = $instance->get( $request );

		$this->assertEquals( 'success', $response->data['type'] );
		$this->assertEquals( 2048, $response->data['size_in_bytes'] );
	}
}

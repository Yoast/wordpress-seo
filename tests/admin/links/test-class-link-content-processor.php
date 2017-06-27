<?php

class WPSEO_Link_Content_Processor_Test extends WPSEO_UnitTestCase {

	public function test_process() {
		/** @var WPSEO_Link_Content_Processor $processor */
		$processor = $this
			->getMockBuilder( 'WPSEO_Link_Content_Processor' )
			->setConstructorArgs( array( new WPSEO_Link_Storage( 'test_' ) ) )
			->setMethods( array( 'store_links' ) )
			->getMock();

		$processor
			->expects( $this->once() )
			->method( 'store_links' )
			->with(
				1,
				array( new WPSEO_Link( 'http://example.org/post', 0, 'internal' ) )
			);

		$processor->process( 1, "<a href='http://example.org/post'>example post</a>" );
	}

	public function test_store_links() {
		/** @var WPSEO_Link_Storage $storage */
		$storage = $this
			->getMockBuilder( 'WPSEO_Link_Storage' )
			->setMethods( array( 'cleanup', 'save_links' ) )
			->getMock();

		$storage
			->expects( $this->once() )
			->method( 'cleanup' )
			->with( 1 );

		$storage
			->expects( $this->once() )
			->method( 'save_links' )
			->with(
				1,
				array( new WPSEO_Link( 'http://example.org/post', 0, 'internal' ) )
			);

		$processor = new WPSEO_Link_Content_Processor( $storage );
		$processor->process( 1, "<a href='http://example.org/post'>example post</a>" );
	}

}
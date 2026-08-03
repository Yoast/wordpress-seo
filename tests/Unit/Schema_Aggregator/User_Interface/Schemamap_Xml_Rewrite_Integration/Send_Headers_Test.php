<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration;

use Brain\Monkey;
use ReflectionMethod;

/**
 * Tests the Schemamap_Xml_Rewrite_Integration send_headers method.
 *
 * @group schema-aggregator
 * @group Schemamap_Xml_Rewrite_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration::send_headers
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Send_Headers_Test extends Abstract_Schemamap_Xml_Rewrite_Integration_Test {

	/**
	 * Tests that the schema map response headers are sent.
	 *
	 * @return void
	 */
	public function test_send_headers() {
		Monkey\Functions\expect( 'status_header' )->once()->with( 200 );

		$this->redirect_helper->expects( 'set_header' )->once()->with( 'X-Robots-Tag: noindex, follow' );
		$this->redirect_helper->expects( 'set_header' )->once()->with( 'Content-Type: application/xml; charset=UTF-8' );
		$this->redirect_helper->expects( 'set_header' )->once()->with( 'Cache-Control: public, max-age=300' );

		/*
		 * WP::send_headers() pairs its no-cache Cache-Control with an Expires date in the past for
		 * logged-in users. Replacing Cache-Control alone would leave the two contradicting.
		 */
		$this->redirect_helper->expects( 'remove_header' )->once()->with( 'Expires' );

		$send_headers = new ReflectionMethod( $this->instance, 'send_headers' );
		$send_headers->setAccessible( true );
		$send_headers->invoke( $this->instance );
	}
}

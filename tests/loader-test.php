<?php

namespace Yoast\WP\Free\Tests;

use Yoast\WP\Free\Loader;
use Yoast\WP\Free\Tests\Doubles\Integration_Double;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

class Loader_Test extends TestCase {
	public function test_loading_unconditional_integration() {
		$integration = new Integration_Double();
		$container   = $this->createMock( ContainerInterface::class );
		$container->expects( $this->once() )->method( 'get' )->with( Integration_Double::class )->willReturn( $integration );

		$loader = new Loader( $container );
		$loader->register_integration( Integration_Double::class );
		$loader->load();

		$this->assertTrue( $integration->is_registered() );
	}
}

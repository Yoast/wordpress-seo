<?php

namespace Yoast\WP\SEO\Tests\Unit\Surfaces;

use stdClass;
use Yoast\WP\SEO\Surfaces\Classes_Surface;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\Exception\ServiceNotFoundException;

/**
 * Class Meta_Surface_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Surfaces\Classes_Surface
 *
 * @group surfaces
 */
final class Classes_Surface_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Classes_Surface
	 */
	protected $instance;

	/**
	 * An example instance that can be retrieved from the DI container with the Yoast\WP\SEO\Example id.
	 *
	 * @var stdClass
	 */
	private $example_service_instance;

	/**
	 * Sets up the test instance.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->example_service_instance = new stdClass();
		$container                      = $this->create_container_with( [ 'Yoast\WP\SEO\Example' => $this->example_service_instance ] );

		$this->instance = new Classes_Surface( $container );
	}

	/**
	 * Tests the get function.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get() {
		$actual = $this->instance->get( 'Yoast\WP\SEO\Example' );

		$this->assertSame( $this->example_service_instance, $actual );
	}

	/**
	 * The get method should rethrow exceptions from the container.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_invalid_service() {
		$this->expectException( ServiceNotFoundException::class );

		$this->instance->get( 'Yoast\WP\SEO\Example_Does_Not_Exist' );
	}
}

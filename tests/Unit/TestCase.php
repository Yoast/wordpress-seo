<?php

namespace Yoast\WP\SEO\Tests\Unit;

use Brain\Monkey;
use WPSEO_Options;
use Yoast\WP\SEO\Surfaces\Classes_Surface;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;
use Yoast\WP\SEO\Surfaces\Open_Graph_Helpers_Surface;
use Yoast\WP\SEO\Surfaces\Schema_Helpers_Surface;
use Yoast\WP\SEO\Surfaces\Twitter_Helpers_Surface;
use Yoast\WPTestUtils\BrainMonkey\YoastTestCase;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\Container;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * TestCase base class.
 */
abstract class TestCase extends YoastTestCase {

	/**
	 * Options being mocked.
	 *
	 * @var array
	 */
	protected $mocked_options = [ 'wpseo', 'wpseo_titles', 'wpseo_taxonomy_meta', 'wpseo_social', 'wpseo_ms' ];

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		Monkey\Functions\stubs(
			[
				// Null makes it so the function returns its first argument.
				'is_admin' => false,
			]
		);

		Monkey\Functions\expect( 'get_option' )
			->zeroOrMoreTimes()
			->with( \call_user_func_array( 'Mockery::anyOf', $this->mocked_options ) )
			->andReturn( [] );

		Monkey\Functions\expect( 'get_site_option' )
			->zeroOrMoreTimes()
			->with( \call_user_func_array( 'Mockery::anyOf', $this->mocked_options ) )
			->andReturn( [] );

		// This is required to ensure backfill and other statics are set.
		WPSEO_Options::get_instance();
	}

	/**
	 * Create a container.
	 *
	 * @param array $services The services to make available in the container as key-value pairs. The key of this should
	 *                        be the classname of the service to expose or an identifier used in rare cases. The value is
	 *                        the instance that you want to make available for the key in the DI container.
	 *
	 * @return ContainerInterface
	 */
	protected function create_container_with( $services = [] ) {
		$container = new Container();
		foreach ( $services as $classname_or_id => $service ) {
			$container->set( $classname_or_id, $service );
		}

		return $container;
	}

	/**
	 * Constructs a helper_surface that accepts a (mocked) containerInterface.
	 * This exists, so you don't have to mock the surface (which is part of our system),
	 * but allows for easily changing the services within the surfaces by mocking the container
	 * (which is not part of our system) instead.
	 *
	 * @param ContainerInterface $container The container to use in the surface and its children.
	 *
	 * @return Helpers_Surface The helpers surface instance.
	 */
	protected function create_helper_surface( ContainerInterface $container ) {
		return new Helpers_Surface(
			$container,
			new Open_Graph_Helpers_Surface( $container ),
			new Schema_Helpers_Surface( $container ),
			new Twitter_Helpers_Surface( $container )
		);
	}

	/**
	 * Constructs a classes_surface that accepts a (mocked) containerInterface.
	 * This exists, so you don't have to mock the surface (which is part of our system),
	 * but allows for easily changing the services within the surfaces by mocking the container
	 * (which is not part of our system) instead.
	 *
	 * @param ContainerInterface $container The container to use in the surface and its children.
	 *
	 * @return Classes_Surface The helpers surface instance.
	 */
	protected function create_classes_surface( ContainerInterface $container ) {
		return new Classes_Surface( $container );
	}
}

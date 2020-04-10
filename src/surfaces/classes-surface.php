<?php
/**
 * Surface for the indexables.
 *
 * @package Yoast\YoastSEO\Surfaces
 */

namespace Yoast\WP\SEO\Surfaces;

use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Classes_Surface
 */
class Classes_Surface {

	/**
	 * Loader constructor.
	 *
	 * @param ContainerInterface $container The dependency injection container.
	 */
	public function __construct( ContainerInterface $container ) {
		$this->container = $container;
	}

	/**
	 * Returns the instance of a class. Handy for unhooking things.
	 *
	 * @param string $class The class to get the instance of.
	 *
	 * @return mixed The instance of the class.
	 */
	public function get( $class ) {
		return $this->container->get( $class );
	}
}

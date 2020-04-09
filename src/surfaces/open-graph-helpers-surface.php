<?php
/**
 * Surface for the indexables.
 *
 * @package Yoast\YoastSEO\Surfaces
 */

namespace Yoast\WP\SEO\Surfaces;

use Yoast\WP\SEO\Helpers\Open_Graph;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Open_Graph_Helpers_Surface
 *
 * @property Open_Graph\Image_Helper $image
 */
class Open_Graph_Helpers_Surface {

	/**
	 * The DI container.
	 *
	 * @var ContainerInterface
	 */
	private $container;

	/**
	 * Loader constructor.
	 *
	 * @param ContainerInterface $container The dependency injection container.
	 */
	public function __construct( ContainerInterface $container ) {
		$this->container = $container;
	}

	/**
	 * Magic getter for getting helper classes.
	 *
	 * @param string $helper The helper to get.
	 *
	 * @return mixed The helper class.
	 */
	public function __get( $helper ) {
		$helper = implode( '_', array_map( 'ucfirst', explode( '_', $helper ) ) );
		$class  = "Yoast\WP\SEO\Helpers\Open_Graph\\{$helper}_Helper";
		return $this->container->get( $class );
	}
}

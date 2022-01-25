<?php

namespace Yoast\WP\SEO\Surfaces;

use Yoast\WP\SEO\Helpers\Twitter;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Twitter_Helpers_Surface.
 *
 * Surface for the indexables.
 *
 * @property Twitter\Image_Helper $image
 */
class Twitter_Helpers_Surface {

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
		return $this->container->get( $this->get_helper_class( $helper ) );
	}

	/**
	 * Magic isset for ensuring helper exists.
	 *
	 * @param string $helper The helper to get.
	 *
	 * @return bool The helper class.
	 */
	public function __isset( $helper ) {
		return $this->container->has( $this->get_helper_class( $helper ) );
	}

	/**
	 * Get the class name from a helper slug
	 *
	 * @param string $helper
	 * @return string
	 */
	protected function get_helper_class( $helper ) {
		$helper = \implode( '_', \array_map( 'ucfirst', \explode( '_', $helper ) ) );
		return "Yoast\WP\SEO\Helpers\Twitter\\{$helper}_Helper";
	}
}

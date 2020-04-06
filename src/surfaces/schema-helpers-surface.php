<?php
/**
 * Surface for the indexables.
 *
 * @package Yoast\YoastSEO\Surfaces
 */

namespace Yoast\WP\SEO\Surfaces;

use Yoast\WP\SEO\Helpers\Schema;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Schema_Helpers_Surface
 *
 * @property Schema\Article_Helper $article
 * @property Schema\HTML_Helper $html
 * @property Schema\ID_Helper $id
 * @property Schema\Image_Helper $image
 * @property Schema\Language_Helper $language
 */
class Schema_Helpers_Surface {

	/**
	 * The DI container.
	 *
	 * @var ContainerInterface
	 */
	private $container;

	/**
	 * Helpers that should be fully capitalized.
	 *
	 * @var array
	 */
	private $capitalized_helpers = [ 'html', 'id' ];

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
		if ( \in_array( $helper, $this->capitalized_helpers, true ) ) {
			$helper = strtoupper( $helper );
		}
		$helper = implode( '_', array_map( 'ucfirst', explode( '_', $helper ) ) );
		$class  = "Yoast\WP\SEO\Helpers\Schema\\{$helper}_Helper";
		return $this->container->get( $class );
	}
}

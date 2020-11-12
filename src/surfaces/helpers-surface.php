<?php

namespace Yoast\WP\SEO\Surfaces;

use Yoast\WP\SEO\Helpers;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Helpers_Surface.
 *
 * Surface for the indexables.
 *
 * @property Helpers\Author_Archive_Helper $author_archive
 * @property Helpers\Blocks_Helper         $blocks
 * @property Helpers\Current_Page_Helper   $current_page
 * @property Helpers\Date_Helper           $date
 * @property Helpers\Environment_Helper    $environment
 * @property Helpers\Home_Url_Helper       $home_url
 * @property Helpers\Image_Helper          $image
 * @property Helpers\Indexable_Helper      $indexable
 * @property Helpers\Indexing_Helper       $indexing
 * @property Helpers\Language_Helper       $language
 * @property Helpers\Meta_Helper           $meta
 * @property Helpers\Notification_Helper   $notification
 * @property Helpers\Options_Helper        $options
 * @property Helpers\Pagination_Helper     $pagination
 * @property Helpers\Post_Helper           $post
 * @property Helpers\Post_Type_Helper      $post_type
 * @property Helpers\Primary_Term_Helper   $primary_term
 * @property Helpers\Product_Helper        $product
 * @property Helpers\Redirect_Helper       $redirect
 * @property Helpers\Robots_Helper         $robots
 * @property Helpers\Site_Helper           $site
 * @property Helpers\String_Helper         $string
 * @property Helpers\Taxonomy_Helper       $taxonomy
 * @property Helpers\Url_Helper            $url
 * @property Helpers\User_Helper           $user
 * @property Helpers\Woocommerce_Helper    $woocommerce
 */
class Helpers_Surface {

	/**
	 * The DI container.
	 *
	 * @var ContainerInterface
	 */
	private $container;

	/**
	 * The open_graph helper namespace
	 *
	 * @var Open_Graph_Helpers_Surface
	 */
	public $open_graph;

	/**
	 * The schema helper namespace
	 *
	 * @var Schema_Helpers_Surface
	 */
	public $schema;

	/**
	 * The twitter helper namespace
	 *
	 * @var Twitter_Helpers_Surface
	 */
	public $twitter;

	/**
	 * Loader constructor.
	 *
	 * @param ContainerInterface         $container  The dependency injection container.
	 * @param Open_Graph_Helpers_Surface $open_graph The OpenGraph helpers surface.
	 * @param Schema_Helpers_Surface     $schema     The Schema helpers surface.
	 * @param Twitter_Helpers_Surface    $twitter    The Twitter helpers surface.
	 */
	public function __construct(
		ContainerInterface $container,
		Open_Graph_Helpers_Surface $open_graph,
		Schema_Helpers_Surface $schema,
		Twitter_Helpers_Surface $twitter
	) {
		$this->container  = $container;
		$this->open_graph = $open_graph;
		$this->schema     = $schema;
		$this->twitter    = $twitter;
	}

	/**
	 * Magic getter for getting helper classes.
	 *
	 * @param string $helper The helper to get.
	 *
	 * @return mixed The helper class.
	 */
	public function __get( $helper ) {
		$helper = \implode( '_', \array_map( 'ucfirst', \explode( '_', $helper ) ) );
		$class  = "Yoast\WP\SEO\Helpers\\{$helper}_Helper";
		return $this->container->get( $class );
	}
}

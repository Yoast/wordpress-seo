<?php
/**
 * Meta value object.
 *
 * @package Yoast\YoastSEO\Surfaces\Values
 */

namespace Yoast\WP\Free\Surfaces\Values;

use Exception;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Integrations\Front_End_Integration;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;


/**
 * Class Meta
 *
 * @property string $title
 * @property string $meta_description
 * @property array  $robots
 * @property array  $googlebot
 * @property string $canonical
 * @property string $rel_next
 * @property string $rel_prev
 * @property string $open_graph_type
 * @property string $open_graph_title
 * @property string $open_graph_description
 * @property array  $open_graph_images
 * @property string $open_graph_url
 * @property string $open_graph_site_name
 * @property string $open_graph_article_publisher
 * @property string $open_graph_article_author
 * @property string $open_graph_article_published_time
 * @property string $open_graph_article_modified_time
 * @property string $open_graph_locale
 * @property string $open_graph_fb_app_id
 * @property array  $schema
 * @property string $twitter_card
 * @property string $twitter_title
 * @property string $twitter_description
 * @property string $twitter_image
 * @property string $twitter_creator
 * @property string $twitter_site
 * @property array  $source
 * @property array  $breadcrumbs
 */
class Meta {

	/**
	 * @var ContainerInterface
	 */
	protected $container;

	/**
	 * The meta tags context.
	 *
	 * @var Meta_Tags_Context
	 */
	protected $context;

	/**
	 * The front end integration.
	 *
	 * @var Front_End_Integration
	 */
	protected $front_end;

	/**
	 * The helpers surface.
	 *
	 * @var Helpers_Surface
	 */
	protected $helpers;

	/**
	 * The replace vars helper
	 *
	 * @var WPSEO_Replace_Vars
	 */
	protected $replace_vars;

	/**
	 * Create a meta value object.
	 *
	 * @param Meta_Tags_Context  $context   The indexable presentation.
	 * @param ContainerInterface $container The DI container.
	 */
	public function __construct(
		Meta_Tags_Context $context,
		ContainerInterface $container
	) {
		$this->container = $container;
		$this->context   = $context;

		$this->helpers      = $this->container->get( Helpers_Surface::class );
		$this->replace_vars = $this->container->get( WPSEO_Replace_Vars::class );
		$this->front_end    = $this->container->get( Front_End_Integration::class );
	}

	/**
	 * Returns the output as would be presented in the head.
	 *
	 * @return string The HTML output of the head.
	 */
	public function get_head() {
		$presenters = $this->front_end->get_presenters( $this->context->page_type );

		$output = '';

		foreach ( $presenters as $presenter ) {
			$presenter->presentation = $this->context->presentation;
			$presenter->helpers      = $this->helpers;
			$presenter->replace_vars = $this->replace_vars;
			$presenter_output = $presenter->present();
			if ( ! empty( $presenter_output ) ) {
				$output .= $presenter_output . PHP_EOL;
			}
		}

		return \trim( $output );
	}

	/**
	 * Magic getter for presenting values through the appropriate presenter, if it exists.
	 *
	 * @param string $name The property to get.
	 *
	 * @return mixed The value, as presented by teh appropriate presenter.
	 *
	 * @throws Exception If an invalid property is accessed.
	 */
	public function __get( $name ) {
		if ( ! isset( $this->context->presentation->{$name} ) ) {
			throw new Exception( "Property $name has does not exist." );
		}

		$presenter_namespace = 'Yoast\WP\SEO\Presenters\\';
		$parts = explode( '_', $name );
		if ( $parts[0] === 'twitter' ) {
			$presenter_namespace .= 'Twitter\\';
			$parts = \array_slice( $parts, 1 );
		}
		elseif ( $parts[0] === 'open' && $parts[1] === 'graph' ) {
			$presenter_namespace .= 'Open_Graph\\';
			$parts = \array_slice( $parts, 2 );
		}
		$presenter_class = $presenter_namespace . implode( '_', array_map( 'ucfirst', $parts ) ) . '_Presenter';


		if ( \class_exists( $presenter_class ) ) {
			/**
			 * @var Abstract_Indexable_Presenter
			 */
			$presenter               = new $presenter_class();
			$presenter->presentation = $this->context->presentation;
			$presenter->helpers      = $this->helpers;
			$presenter->replace_vars = $this->replace_vars;
			$value                   = $presenter->get();
		}
		else {
			$value = $this->context->presentation->{$name};
		}

		$this->{$name} = $value;
		return $this->{$name};
	}

	/**
	 * Magic isset for ensuring properties on the presentation are recognised.
	 *
	 * @param string $name The property to get.
	 *
	 * @return bool Whether or not the requested property exists.
	 */
	public function __isset( $name ) {
		return isset( $this->context->presentation->{$name} );
	}
}

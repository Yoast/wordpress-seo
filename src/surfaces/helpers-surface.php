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
class Helpers_Surface {

    /**
     * The DI container.
     *
     * @var ContainerInterface
     */
    private $container;

    /**
     * The namespace to find helpers in.
     *
     * @var string
     */
    protected $namespace;

    /**
     * The open_graph helper namespace
     *
     * @var self
     */
    public $open_graph;

    /**
     * The schema helper namespace
     *
     * @var self
     */
    public $schema;

    /**
     * The twitter helper namespace
     *
     * @var self
     */
    public $twitter;

	/**
	 * Loader constructor.
	 *
	 * @param ContainerInterface $container The dependency injection container.
	 */
	public function __construct( ContainerInterface $container ) {
        $this->container = $container;
    }

    /**
     * Correctly sets all namespace variables
     *
     * @required
     */
    public function set_namespaces() {
        $this->namespace = 'Yoast\WP\SEO\Helpers';

        $this->open_graph = new self( $this->container );
        $this->open_graph->namespace = 'Yoast\WP\SEO\Helpers\Open_Graph';

        $this->schema = new self( $this->container );
        $this->schema->namespace = 'Yoast\WP\SEO\Helpers\Schema';

        $this->twitter = new self( $this->container );
        $this->twitter->namespace = 'Yoast\WP\SEO\Helpers\Twitter';
    }

    /**
     * Magic getter for getting helper classes.
     *
     * @param string $helper The helper to get.
     *
     * @return mixed The helper class.
     */
	public function __get( $helper ) {
        $helper = ucfirst( $helper );
        $class  = "$this->namespace\\{$helper}_Helper";
		return $this->container->get( $class );
	}
}

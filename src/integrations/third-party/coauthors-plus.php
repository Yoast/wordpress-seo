<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Third_Party\CoAuthors_Plus_Activated_Conditional;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Generators\Schema\Third_Party\CoAuthor;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;

/**
 * Integrates the multiple authors capability from Co Authors Plus into Yoast SEO schema.
 */
class CoAuthors_Plus implements Integration_Interface {

	/**
	 * The helpers surface.
	 *
	 * @var Helpers_Surface
	 */
	protected $helpers;

	/**
	 * Initializes the integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_schema_graph', [ $this, 'filter_graph' ], 11, 2 );
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ CoAuthors_Plus_Activated_Conditional::class ];
	}

	/**
	 * CoAuthors_Plus constructor.
	 *
	 * @codeCoverageIgnore It only sets dependencies.
	 *
	 * @param Helpers_Surface $helpers The helper surface.
	 */
	public function __construct( Helpers_Surface $helpers ) {
		$this->helpers = $helpers;
	}

	/**
	 * Filters the graph output to add authors.
	 *
	 * @param array             $data    The schema graph.
	 * @param Meta_Tags_Context $context Context object.
	 *
	 * @return array The (potentially altered) schema graph.
	 */
	public function filter_graph( $data, $context ) {
		if ( ! is_singular() ) {
			return $data;
		}

		/**
		 * Contains the authors from the CoAuthors Plus plugin.
		 *
		 * @var \WP_User[] $author_objects
		 */
		$author_objects = \get_coauthors( $context->post->ID );
		if ( count( $author_objects ) <= 1 ) {
			return $data;
		}

		$ids = [];

		// Add the authors to the schema.
		foreach ( $author_objects as $author ) {
			if ( $author->ID === (int) $context->post->post_author || $author->ID === $context->site_user_id ) {
				continue;
			}
			$author_generator          = new CoAuthor();
			$author_generator->context = $context;
			$author_generator->helpers = $this->helpers;
			$author_data               = $author_generator->generate_from_user_id( $author->ID );
			if ( ! empty( $author_data ) ) {
				$data[] = $author_data;
				$ids[]  = [ '@id' => $author_data['@id'] ];
			}
		}

		// Change the author reference to reference our multiple authors.
		foreach ( $data as $key => $piece ) {
			if ( $piece['@type'] === 'Article' ) {
				$data[ $key ]['author'] = array_merge( [ $piece['author'] ], $ids );
				break;
			}
		}

		return $data;
	}
}

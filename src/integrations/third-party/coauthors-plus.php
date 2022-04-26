<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Conditionals\Third_Party\CoAuthors_Plus_Activated_Conditional;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Generators\Schema\Third_Party\CoAuthor;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;

/**
 * Integrates the multiple authors capability from CoAuthors Plus into Yoast SEO schema.
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
		\add_filter( 'wpseo_schema_author', [ $this, 'filter_author_graph' ], 11, 4 );
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
	 * @param array                   $data                   The schema graph.
	 * @param Meta_Tags_Context       $context                The context object.
	 * @param Abstract_Schema_Piece   $graph_piece_generator  The graph piece generator.
	 * @param Abstract_Schema_Piece[] $graph_piece_generators The graph piece generators.
	 *
	 * @return array The (potentially altered) schema graph.
	 */
	public function filter_author_graph( $data, $context, $graph_piece_generator, $graph_piece_generators ) {
		if ( ! isset( $data['image']['url'] ) ) {
			return $data;
		}

		if ( isset( $data['image']['@id'] ) ) {
			$data['image']['@id'] .= \md5( $data['image']['url'] );
		}

		if ( isset( $data['logo']['@id'] ) ) {
			$data['logo']['@id'] .= \md5( $data['image']['url'] );
		}

		return $data;
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
		if ( ! \is_singular() ) {
			return $data;
		}

		if ( ! \function_exists( '\get_coauthors' ) ) {
			return $data;
		}

		/**
		 * Contains the authors from the CoAuthors Plus plugin.
		 *
		 * @var \WP_User[] $author_objects
		 */
		$author_objects = \get_coauthors( $context->post->ID );
		if ( \count( $author_objects ) <= 1 ) {
			return $data;
		}

		$ids = [];

		// Add the authors to the schema.
		foreach ( $author_objects as $author ) {
			if ( $author->ID === (int) $context->post->post_author ) {
				continue;
			}
			$author_generator          = new CoAuthor();
			$author_generator->context = $context;
			$author_generator->helpers = $this->helpers;
			$author_data               = $author_generator->generate_from_user_id( $author->ID );
			if ( ! empty( $author_data ) ) {
				$ids[] = [ '@id' => $author_data['@id'] ];
			}
		}

		$schema_types  = new Schema_Types();
		$article_types = $schema_types->get_article_type_options_values();

		// Change the author reference to reference our multiple authors.
		$add_to_graph = false;
		foreach ( $data as $key => $piece ) {
			if ( \in_array( $piece['@type'], $article_types, true ) ) {
				$data[ $key ]['author'] = \array_merge( [ $piece['author'] ], $ids );
				$add_to_graph           = true;
				break;
			}
		}

		if ( $add_to_graph ) {
			if ( ! empty( $author_data ) ) {
				if ( $context->site_represents !== 'person' || $author->ID !== $context->site_user_id ) {
					$data[] = $author_data;
				}
			}
		}

		return $data;
	}
}

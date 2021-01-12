<?php

namespace Yoast\WP\SEO\Generators;

use WP_Block_Parser_Block;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Generators\Schema\Abstract_Schema_Piece;
use Yoast\WP\SEO\Helpers\Schema\Replace_Vars_Helper;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;

/**
 * Class Schema_Generator.
 */
class Schema_Generator implements Generator_Interface {

	/**
	 * The helpers surface.
	 *
	 * @var Helpers_Surface
	 */
	protected $helpers;

	/**
	 * The Schema replace vars helper.
	 *
	 * @var Replace_Vars_Helper
	 */
	protected $schema_replace_vars_helper;

	/**
	 * Generator constructor.
	 *
	 * @param Helpers_Surface     $helpers                    The helpers surface.
	 * @param Replace_Vars_Helper $schema_replace_vars_helper The replace vars helper.
	 */
	public function __construct(
		Helpers_Surface $helpers,
		Replace_Vars_Helper $schema_replace_vars_helper
	) {
		$this->helpers                    = $helpers;
		$this->schema_replace_vars_helper = $schema_replace_vars_helper;
	}

	/**
	 * Returns a Schema graph array.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return array The graph.
	 */
	public function generate( Meta_Tags_Context $context ) {
		$pieces = $this->get_graph_pieces( $context );

		$this->schema_replace_vars_helper->register_replace_vars( $context );

		foreach ( \array_keys( $context->blocks ) as $block_type ) {
			/**
			 * Filter: 'wpseo_pre_schema_block_type_<block-type>' - Allows hooking things to change graph output based on the blocks on the page.
			 *
			 * @param string                  $block_type The block type.
			 * @param WP_Block_Parser_Block[] $blocks     All the blocks of this block type.
			 * @param Meta_Tags_Context       $context    A value object with context variables.
			 */
			\do_action( 'wpseo_pre_schema_block_type_' . $block_type, $context->blocks[ $block_type ], $context );
		}

		// Do a loop before everything else to inject the context and helpers.
		foreach ( $pieces as $piece ) {
			if ( \is_a( $piece, Abstract_Schema_Piece::class ) ) {
				$piece->context = $context;
				$piece->helpers = $this->helpers;
			}
		}

		$pieces_to_generate = $this->filter_graph_pieces_to_generate( $pieces );
		$graph              = $this->generate_graph( $pieces_to_generate, $context );
		$graph              = $this->add_schema_blocks_graph_pieces( $graph, $context );

		return [
			'@context' => 'https://schema.org',
			'@graph'   => $graph,
		];
	}

	/**
	 * Filters out any graph pieces that should not be generated.
	 * (Using the `wpseo_schema_needs_<graph_piece_identifier>` series of filters).
	 *
	 * @param array $graph_pieces The current list of graph pieces that we want to generate.
	 *
	 * @return array The graph pieces to generate.
	 */
	protected function filter_graph_pieces_to_generate( $graph_pieces ) {
		$pieces_to_generate = [];
		foreach ( $graph_pieces as $piece ) {
			$identifier = \strtolower( \str_replace( 'Yoast\WP\SEO\Generators\Schema\\', '', \get_class( $piece ) ) );
			if ( \property_exists( $piece, 'identifier' ) ) {
				$identifier = $piece->identifier;
			}

			/**
			 * Filter: 'wpseo_schema_needs_<identifier>' - Allows changing which graph pieces we output.
			 *
			 * @api bool $is_needed Whether or not to show a graph piece.
			 */
			$is_needed = \apply_filters( 'wpseo_schema_needs_' . $identifier, $piece->is_needed() );
			if ( ! $is_needed ) {
				continue;
			}

			$pieces_to_generate[ $identifier ] = $piece;
		}

		return $pieces_to_generate;
	}

	/**
	 * Generates the schema graph.
	 *
	 * @param array             $pieces_to_generate The schema graph pieces to generate.
	 * @param Meta_Tags_Context $context            The meta tags context to use.
	 *
	 * @return array The generated schema graph.
	 */
	protected function generate_graph( $pieces_to_generate, $context ) {
		$graph = [];
		foreach ( $pieces_to_generate as $identifier => $piece ) {
			$graph_pieces = $piece->generate();
			// If only a single graph piece was returned.
			if ( $graph_pieces !== false && \array_key_exists( '@type', $graph_pieces ) ) {
				$graph_pieces = [ $graph_pieces ];
			}

			if ( ! \is_array( $graph_pieces ) ) {
				continue;
			}

			foreach ( $graph_pieces as $graph_piece ) {
				/**
				 * Filter: 'wpseo_schema_<identifier>' - Allows changing graph piece output.
				 *
				 * @api array $graph_piece The graph piece to filter.
				 *
				 * @param Meta_Tags_Context $context A value object with context variables.
				 */
				$graph_piece = \apply_filters( 'wpseo_schema_' . $identifier, $graph_piece, $context );
				$graph_piece = $this->type_filter( $graph_piece, $identifier, $context );
				$graph_piece = $this->validate_type( $graph_piece );

				if ( \is_array( $graph_piece ) ) {
					$graph[] = $graph_piece;
				}
			}
		}

		return $graph;
	}

	/**
	 * Adds schema graph pieces from Gutenberg blocks on the current page to
	 * the given schema graph.
	 *
	 * Think of blocks like the Yoast FAQ block or the How To block.
	 *
	 * @param array             $graph   The current schema graph.
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return array The graph with the schema blocks graph pieces added.
	 */
	protected function add_schema_blocks_graph_pieces( $graph, $context ) {
		foreach ( $context->blocks as $block_type => $blocks ) {
			foreach ( $blocks as $block ) {
				/**
				 * Filter: 'wpseo_schema_block_<block-type>' - Allows filtering graph output per block.
				 *
				 * @api array $graph Our Schema output.
				 *
				 * @param WP_Block_Parser_Block $block   The block.
				 * @param Meta_Tags_Context     $context A value object with context variables.
				 */
				$block_type = \strtolower( $block['blockName'] );
				$graph      = \apply_filters( 'wpseo_schema_block_' . $block_type, $graph, $block, $context );

				if ( isset( $block['attrs']['yoast-schema'] ) ) {
					$graph[] = $this->schema_replace_vars_helper->replace( $block['attrs']['yoast-schema'], $context->presentation );
				}
			}
		}

		return $graph;
	}

	/**
	 * Adapts the WebPage graph piece for password-protected posts.
	 *
	 * It should only have certain whitelisted properties.
	 * The type should always be WebPage.
	 *
	 * @param array $graph_piece The WebPage graph piece that should be adapted for password-protected posts.
	 *
	 * @return array The WebPage graph piece that has been adapted for password-protected posts.
	 */
	public function protected_webpage_schema( $graph_piece ) {
		$properties_to_show = \array_flip(
			[
				'@type',
				'@id',
				'url',
				'name',
				'isPartOf',
				'inLanguage',
				'datePublished',
				'dateModified',
				'breadcrumb',
			]
		);

		$graph_piece          = \array_intersect_key( $graph_piece, $properties_to_show );
		$graph_piece['@type'] = 'WebPage';

		return $graph_piece;
	}

	/**
	 * Gets all the graph pieces we need.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return Abstract_Schema_Piece[] A filtered array of graph pieces.
	 */
	protected function get_graph_pieces( $context ) {
		if ( \is_single() && \post_password_required() ) {
			$schema_pieces = [
				new Schema\Organization(),
				new Schema\Website(),
				new Schema\WebPage(),
			];

			\add_filter( 'wpseo_schema_webpage', [ $this, 'protected_webpage_schema' ], 1 );
		}
		else {
			$schema_pieces = [
				new Schema\Organization(),
				new Schema\Person(),
				new Schema\Website(),
				new Schema\Main_Image(),
				new Schema\WebPage(),
				new Schema\Breadcrumb(),
				new Schema\Article(),
				new Schema\Author(),
				new Schema\FAQ(),
				new Schema\HowTo(),
			];
		}

		/**
		 * Filter: 'wpseo_schema_graph_pieces' - Allows adding pieces to the graph.
		 *
		 * @param Meta_Tags_Context $context An object with context variables.
		 *
		 * @api array $pieces The schema pieces.
		 */
		return \apply_filters( 'wpseo_schema_graph_pieces', $schema_pieces, $context );
	}

	/**
	 * Allows filtering the graph piece by its schema type.
	 *
	 * @param array             $graph_piece The graph piece we're filtering.
	 * @param string            $identifier  The identifier of the graph piece that is being filtered.
	 * @param Meta_Tags_Context $context     The meta tags context.
	 *
	 * @return array The filtered graph piece.
	 */
	private function type_filter( $graph_piece, $identifier, Meta_Tags_Context $context ) {
		$types = $this->get_type_from_piece( $graph_piece );
		foreach ( $types as $type ) {
			$type = \strtolower( $type );

			// Prevent running the same filter twice. This makes sure we run f/i. for 'author' and for 'person'.
			if ( $type && $type !== $identifier ) {
				/**
				 * Filter: 'wpseo_schema_<type>' - Allows changing graph piece output by @type.
				 *
				 * @api array $graph_piece The graph piece to filter.
				 *
				 * @param Meta_Tags_Context $context A value object with context variables.
				 */
				$graph_piece = \apply_filters( 'wpseo_schema_' . $type, $graph_piece, $context );
			}
		}

		return $graph_piece;
	}

	/**
	 * Retrieves the type from a graph piece.
	 *
	 * @param array $piece The graph piece.
	 *
	 * @return array An array of the piece's types.
	 */
	private function get_type_from_piece( $piece ) {
		if ( isset( $piece['@type'] ) ) {
			if ( \is_array( $piece['@type'] ) ) {
				return $piece['@type'];
			}

			return [ $piece['@type'] ];
		}

		return [];
	}

	/**
	 * Validates a graph piece's type.
	 *
	 * When the type is an array:
	 *   - Ensure the values are unique.
	 *   - Only 1 value? Use that value without the array wrapping.
	 *
	 * @param array $piece The graph piece.
	 *
	 * @return array The graph piece.
	 */
	private function validate_type( $piece ) {
		if ( ! isset( $piece['@type'] ) ) {
			// No type to validate.
			return $piece;
		}

		// If it is not an array, we can return immediately.
		if ( ! \is_array( $piece['@type'] ) ) {
			return $piece;
		}

		/*
		 * Ensure the types are unique.
		 * Use array_values to reset the indices (e.g. no 0, 2 because 1 was a duplicate).
		 */
		$piece['@type'] = \array_values( \array_unique( $piece['@type'] ) );

		// Use the first value if there is only 1 type.
		if ( \count( $piece['@type'] ) === 1 ) {
			$piece['@type'] = \reset( $piece['@type'] );
		}

		return $piece;
	}
}

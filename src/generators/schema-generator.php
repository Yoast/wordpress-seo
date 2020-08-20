<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Generators
 */

namespace Yoast\WP\SEO\Generators;

use WP_Block_Parser_Block;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Generators\Schema\Abstract_Schema_Piece;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;

/**
 * Class Schema_Generator
 */
class Schema_Generator implements Generator_Interface {

	/**
	 * The helpers surface.
	 *
	 * @var Helpers_Surface
	 */
	private $helpers;

	/**
	 * Generator constructor.
	 *
	 * @param Helpers_Surface $helpers The helpers surface.
	 */
	public function __construct( Helpers_Surface $helpers ) {
		$this->helpers = $helpers;
	}

	/**
	 * Returns a Schema graph array.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return array The graph.
	 */
	public function generate( Meta_Tags_Context $context ) {
		$graph = [];

		$pieces = $this->get_graph_pieces( $context );

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

		$pieces_to_generate = [];
		foreach ( $pieces as $piece ) {
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

		foreach ( $pieces_to_generate as $identifier => $piece ) {
			$graph_pieces = $piece->generate();
			// If only a single graph piece was returned.
			if ( isset( $graph_pieces['@type'] ) ) {
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

		foreach ( $context->blocks as $block_type => $blocks ) {
			foreach ( $blocks as $block ) {
				/**
				 * Filter: 'wpseo_schema_block_<block-type>' - Allows filtering graph output per block.
				 *
				 * @param WP_Block_Parser_Block $block   The block.
				 * @param Meta_Tags_Context     $context A value object with context variables.
				 *
				 * @api array $graph Our Schema output.
				 */
				$block_type = \strtolower( $block['blockName'] );
				$graph      = \apply_filters( 'wpseo_schema_block_' . $block_type, $graph, $block, $context );
			}
		}

		return [
			'@context' => 'https://schema.org',
			'@graph'   => $graph,
		];
	}

	/**
	 * Allow filtering the graph piece by its schema type.
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

	/**
	 * Gets all the graph pieces we need.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return Abstract_Schema_Piece[] A filtered array of graph pieces.
	 */
	protected function get_graph_pieces( $context ) {
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

		/**
		 * Filter: 'wpseo_schema_graph_pieces' - Allows adding pieces to the graph.
		 *
		 * @param Meta_Tags_Context $context An object with context variables.
		 *
		 * @api array $pieces The schema pieces.
		 */
		return \apply_filters( 'wpseo_schema_graph_pieces', $schema_pieces, $context );
	}
}

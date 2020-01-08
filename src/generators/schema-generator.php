<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Presentations\Generators
 */

namespace Yoast\WP\SEO\Presentations\Generators;

use WP_Block_Parser_Block;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Presentations\Generators\Schema\Abstract_Schema_Piece;

/**
 * Class Schema_Generator
 *
 * @package Yoast\WP\SEO\Presentations\Generators
 */
class Schema_Generator implements Generator_Interface {

	/**
	 * @var Current_Page_Helper
	 */
	private $current_page;

	/**
	 * @var ID_Helper
	 */
	private $id_helper;

	/**
	 * @var Generator_Interface[]
	 */
	private $generators;

	/**
	 * Generator constructor.
	 *
	 * @param ID_Helper           $id_helper              A helper to retrieve Schema ID's.
	 * @param Current_Page_Helper $current_page_helper    A helper to determine current page.
	 * @param Schema\Organization $organization_generator The organization generator.
	 * @param Schema\Person       $person_generator       The person generator.
	 * @param Schema\Website      $website_generator      The website generator.
	 * @param Schema\Main_Image   $main_image_generator   The main image generator.
	 * @param Schema\WebPage      $web_page_generator     The web page generator.
	 * @param Schema\Breadcrumb   $breadcrumb_generator   The breadcrumb generator.
	 * @param Schema\Article      $article_generator      The article generator.
	 * @param Schema\Author       $author_generator       The author generator.
	 * @param Schema\FAQ          $faq_generator          The FAQ generator.
	 * @param Schema\HowTo        $how_to_generator       The how to generator.
	 */
	public function __construct(
		ID_Helper $id_helper,
		Current_Page_Helper $current_page_helper,
		Schema\Organization $organization_generator,
		Schema\Person $person_generator,
		Schema\Website $website_generator,
		Schema\Main_Image $main_image_generator,
		Schema\WebPage $web_page_generator,
		Schema\Breadcrumb $breadcrumb_generator,
		Schema\Article $article_generator,
		Schema\Author $author_generator,
		Schema\FAQ $faq_generator,
		Schema\HowTo $how_to_generator
	) {
		$this->id_helper    = $id_helper;
		$this->current_page = $current_page_helper;

		$this->generators = [
			$organization_generator,
			$person_generator,
			$website_generator,
			$main_image_generator,
			$web_page_generator,
			$breadcrumb_generator,
			$article_generator,
			$author_generator,
			$faq_generator,
			$how_to_generator,
		];
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

		foreach ( $pieces as $piece ) {

			$identifier = \strtolower( \str_replace( 'Yoast\WP\SEO\Presentations\Generators\Schema\\', '', \get_class( $piece ) ) );
			if ( property_exists( $piece, 'identifier' ) ) {
				$identifier = $piece->identifier;
			}

			/**
			 * Filter: 'wpseo_schema_needs_<identifier>' - Allows changing which graph pieces we output.
			 *
			 * @api bool $is_needed Whether or not to show a graph piece.
			 */
			$is_needed = \apply_filters( 'wpseo_schema_needs_' . $identifier, $piece->is_needed( $context ) );
			if ( ! $is_needed ) {
				continue;
			}

			$graph_pieces = $piece->generate( $context );
			// If only a single graph piece was returned.
			if ( isset( $graph_pieces['@type'] ) ) {
				$graph_pieces = [ $graph_pieces ];
			}

			foreach ( $graph_pieces as $graph_piece ) {
				/**
				 * Filter: 'wpseo_schema_<identifier>' - Allows changing graph piece output.
				 *
				 * @api array               $graph_piece The graph piece to filter.
				 * @param Meta_Tags_Context $context     A value object with context variables.
				 */
				$graph_piece = \apply_filters( 'wpseo_schema_' . $identifier, $graph_piece, $context );
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

		return $graph;
	}

	/**
	 * Gets all the graph pieces we need.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return Abstract_Schema_Piece[] A filtered array of graph pieces.
	 */
	private function get_graph_pieces( $context ) {
		/**
		 * Filter: 'wpseo_schema_graph_pieces' - Allows adding pieces to the graph.
		 *
		 * @param Meta_Tags_Context $context An object with context variables.
		 *
		 * @api array $pieces The schema pieces.
		 */
		return \apply_filters( 'wpseo_schema_graph_pieces', $this->generators, $context );
	}
}

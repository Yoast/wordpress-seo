<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Presentations\Generators
 */

namespace Yoast\WP\Free\Presentations\Generators;

use WP_Block_Type;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Schema\Context_Helper;
use Yoast\WP\Free\Helpers\Schema\ID_Helper;
use Yoast\WP\Free\Models\Indexable;

class Schema_Generator implements Generator_Interface {

	/**
	 * @var Indexable
	 */
	private $model;

	/**
	 * @var Context_Helper
	 */
	private $context;

	/**
	 * @var WP_Block_Type[]
	 */
	private $parsed_blocks;

	/**
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * @var ID_Helper
	 */
	private $id_helper;

	/**
	 * Schema_Generator constructor.
	 *
	 * @param Indexable           $model
	 * @param ID_Helper           $id_helper
	 * @param Current_Page_Helper $current_page_helper
	 */
	public function __construct(
		Indexable $model,
		ID_Helper $id_helper,
		Current_Page_Helper $current_page_helper
	) {
		$this->model   = $model;
		$this->id_helper = $id_helper;
		$this->current_page_helper = $current_page_helper;

		$this->context = new Context_Helper( $this->model, $this->id_helper );
	}

	/**
	 * Returns a Schema graph array.
	 *
	 * @return array
	 */
	public function generate() {
		$graph = array();

		$pieces = $this->get_graph_pieces();

		// Parse the Gutenberg blocks so we know whether to show pieces for those.
		$this->parse_blocks();

		foreach ( $pieces as $piece ) {

			$class = \strtolower( \str_replace( 'Yoast\WP\Free\Presentations\Generators\Schema\\', '', \get_class( $piece ) ) );

			/**
			 * Filter: 'wpseo_schema_needs_<class name>' - Allows changing which graph pieces we output.
			 *
			 * @api bool $is_needed Whether or not to show a graph piece.
			 */
			$is_needed = \apply_filters( 'wpseo_schema_needs_' . $class, $piece->is_needed() );
			if ( ! $is_needed ) {
				continue;
			}

			$graph_piece = $piece->generate();

			/**
			 * Filter: 'wpseo_schema_<class name>' - Allows changing graph piece output.
			 *
			 * @api array $graph_piece The graph piece to filter.
			 */
			$graph_piece = \apply_filters( 'wpseo_schema_' . $class, $graph_piece );
			if ( \is_array( $graph_piece ) ) {
				$graph[] = $graph_piece;
			}
		}

		foreach ( $this->parsed_blocks as $block_type => $blocks ) {
			foreach ( $blocks as $block ) {
				/**
				 * Filter: 'wpseo_schema_block_<block-type>' - Allows filtering graph output per block.
				 *
				 * @param \WP_Block_Parser_Block $block   The block.
				 * @param Context_Helper         $context A value object with context variables.
				 *
				 * @api array $graph Our Schema output.
				 */
				$block_type = \strtolower( $block['blockName'] );
				$graph      = \apply_filters( 'wpseo_schema_block_' . $block_type, $graph, $block, $this->context );
			}
		}

		return $graph;
	}

	/**
	 * Gets all the graph pieces we need.
	 *
	 * @return array A filtered array of graph pieces.
	 */
	private function get_graph_pieces() {
		$pieces = array(
			new Schema\Organization( $this->context, $this->id_helper, $this->current_page_helper ),
			new Schema\Person( $this->context, $this->id_helper, $this->current_page_helper ),
			new Schema\Website( $this->context, $this->id_helper, $this->current_page_helper ),
			new Schema\MainImage( $this->context, $this->id_helper, $this->current_page_helper ),
			new Schema\WebPage( $this->context, $this->id_helper, $this->current_page_helper ),
			new Schema\Breadcrumb( $this->context, $this->id_helper, $this->current_page_helper ),
			new Schema\Article( $this->context, $this->id_helper, $this->current_page_helper ),
			new Schema\Author( $this->context, $this->id_helper, $this->current_page_helper ),
			new Schema\FAQ( $this->context, $this->id_helper, $this->current_page_helper ),
			new Schema\HowTo( $this->context, $this->id_helper, $this->current_page_helper ),
		);

		/**
		 * Filter: 'wpseo_schema_graph_pieces' - Allows adding pieces to the graph.
		 *
		 * @param Context_Helper $context An object with context variables.
		 *
		 * @api array $pieces The schema pieces.
		 */
		return \apply_filters( 'wpseo_schema_graph_pieces', $pieces, $this->context );
	}

	/**
	 * Parse the blocks and pass them on to our head.
	 */
	private function parse_blocks() {
		if ( ! \function_exists( 'parse_blocks' ) ) {
			return;
		}

		if ( ! \is_singular() ) {
			return;
		}

		$this->get_parsed_blocks();
		foreach ( \array_keys( $this->parsed_blocks ) as $block_type ) {
			/**
			 * Filter: 'wpseo_pre_schema_block_type_<block-type>' - Allows hooking things to change graph output based on the blocks on the page.
			 *
			 * @param string         $block_type The block type.
			 * @param array          $blocks     All the blocks of this block type.
			 * @param Context_Helper $context    A value object with context variables.
			 */
			\do_action( 'wpseo_pre_schema_block_type_' . $block_type, $this->parsed_blocks[ $block_type ], $this->context );
		}
	}

	/**
	 * Parse the blocks and loop through them.
	 */
	private function get_parsed_blocks() {
		$post          = \get_post( $this->model->object_id );
		$parsed_blocks = \parse_blocks( $post->post_content );

		foreach ( $parsed_blocks as $block ) {
			if ( ! isset( $this->parsed_blocks[ $block['blockName'] ] ) || ! \is_array( $this->parsed_blocks[ $block['blockName'] ] ) ) {
				$this->parsed_blocks[ $block['blockName'] ] = array();
			}
			$this->parsed_blocks[ $block['blockName'] ][] = $block;
		}
	}
}

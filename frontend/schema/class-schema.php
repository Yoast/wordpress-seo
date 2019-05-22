<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Class WPSEO_Schema
 *
 * Outputs schema code specific for Google's JSON LD stuff.
 *
 * @since 1.8
 */
class WPSEO_Schema implements WPSEO_WordPress_Integration {
	/**
	 * Holds the parsed blocks for the current page.
	 *
	 * @var array
	 */
	private $parsed_blocks = array();

	/**
	 * Holds context variables about the current page and site.
	 *
	 * @var WPSEO_Schema_Context
	 */
	private $context;

	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		add_action( 'wpseo_head', array( $this, 'json_ld' ), 91 );
		add_action( 'wpseo_json_ld', array( $this, 'generate' ), 1 );
		add_action( 'wpseo_head', array( $this, 'parse_blocks' ), 0 );

		// This AMP hook is only used in Reader (formerly Classic) mode.
		add_action( 'amp_post_template_head', array( $this, 'json_ld' ), 9 );
	}

	/**
	 * Parse the blocks and pass them on to our head.
	 */
	public function parse_blocks() {
		$this->context = new WPSEO_Schema_Context();

		if ( ! is_singular() ) {
			return;
		}

		$post          = get_post();
		$parsed_blocks = parse_blocks( $post->post_content );

		foreach ( $parsed_blocks as $block ) {
			if ( ! is_array( $this->parsed_blocks[ $block['blockName'] ] ) ) {
				$this->parsed_blocks[ $block['blockName'] ] = array();
			}
			$this->parsed_blocks[ $block['blockName'] ][] = $block;
		}

		foreach ( array_keys( $this->parsed_blocks ) as $block_type ) {
			/**
			 * Filter: 'yoast/pre-schema/block-type/<block-type>' - Allows filtering graph output based on the blocks on the page.
			 *
			 * @param string               $block_type The block type.
			 * @param WPSEO_Schema_Context $context    A value object with context variables.
			 */
			do_action( 'yoast/pre-schema/block-type/' . $block_type, $this->context );
		}
	}

	/**
	 * JSON LD output function that the functions for specific code can hook into.
	 *
	 * @since 1.8
	 */
	public function json_ld() {
		$deprecated_data = array(
			'_deprecated' => 'Please use the "wpseo_schema_*" filters to extend the Yoast SEO schema data - see the WPSEO_Schema class.',
		);

		/**
		 * Filter: 'wpseo_json_ld_output' - Allows disabling Yoast's schema output entirely.
		 *
		 * @api mixed If false or an empty array is returned, disable our output.
		 */
		$return = apply_filters( 'wpseo_json_ld_output', $deprecated_data, '' );
		if ( $return === array() || $return === false ) {
			return;
		}

		// Remove the AMP hook that also outputs Schema metadata on AMP pages.
		remove_action( 'amp_post_template_head', 'amp_print_schemaorg_metadata' );
		do_action( 'wpseo_json_ld' );
	}

	/**
	 * Outputs the JSON LD code in a valid JSON+LD wrapper.
	 *
	 * @since 10.2
	 *
	 * @return void
	 */
	public function generate() {
		$graph = array();

		foreach ( $this->get_graph_pieces() as $piece ) {
			$class = str_replace( 'wpseo_schema_', '', strtolower( get_class( $piece ) ) );

			/**
			 * Filter: 'wpseo_schema_needs_<class name>' - Allows changing which graph pieces we output.
			 *
			 * @api bool $is_needed Whether or not to show a graph piece.
			 */
			$is_needed = apply_filters( 'wpseo_schema_needs_' . $class, $piece->is_needed() );
			if ( ! $is_needed ) {
				continue;
			}

			$graph_piece = $piece->generate();

			/**
			 * Filter: 'wpseo_schema_<class name>' - Allows changing graph piece output.
			 *
			 * @api array $graph_piece The graph piece to filter.
			 */
			$graph_piece = apply_filters( 'wpseo_schema_' . $class, $graph_piece );
			if ( is_array( $graph_piece ) ) {
				$graph[] = $graph_piece;
			}
		}

		foreach ( $this->parsed_blocks as $block_type => $blocks ) {
			/**
			 * Filter: 'yoast/schema/block-type/<block-type>' - Allows filtering graph output based on all the blocks of a certain type.
			 *
			 * @param WP_Block_Parser_Block $blocks  All the blocks of this type.
			 * @param WPSEO_Schema_Context  $context A value object with context variables.
			 *
			 * @api array $graph Our Schema output.
			 */
			$graph = apply_filters( 'yoast/schema/block-type/' . $block_type, $graph, $blocks, $this->context );

			foreach ( $blocks as $block ) {
				/**
				 * Filter: 'yoast/schema/blocks/<block-type>' - Allows filtering graph output per block.
				 *
				 * @param WP_Block_Parser_Block $block   The block.
				 * @param WPSEO_Schema_Context  $context A value object with context variables.
				 *
				 * @api array $graph Our Schema output.
				 */
				$graph = apply_filters( 'yoast/schema/block/' . $block['blockName'], $graph, $block, $this->context );
			}
		}

		WPSEO_Utils::schema_output( $graph, 'yoast-schema-graph yoast-schema-graph--main' );
	}

	/**
	 * Gets all the graph pieces we need.
	 *
	 * @return array A filtered array of graph pieces.
	 */
	private function get_graph_pieces() {
		$pieces = array(
			new WPSEO_Schema_Organization( $this->context ),
			new WPSEO_Schema_Person( $this->context ),
			new WPSEO_Schema_Website( $this->context ),
			new WPSEO_Schema_WebPage( $this->context ),
			new WPSEO_Schema_Breadcrumb( $this->context ),
			new WPSEO_Schema_Article( $this->context ),
			new WPSEO_Schema_Author( $this->context ),
		);

		/**
		 * Filter: 'wpseo_schema_graph_pieces' - Allows adding pieces to the graph.
		 *
		 * @param WPSEO_Schema_Context $context An object with context variables.
		 *
		 * @api array $pieces The schema pieces.
		 */
		return apply_filters( 'wpseo_schema_graph_pieces', $pieces, $this->context );
	}
}

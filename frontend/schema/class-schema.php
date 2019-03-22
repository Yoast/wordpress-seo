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
	 * Registers the hooks.
	 */
	public function register_hooks() {
		add_action( 'wpseo_head', array( $this, 'json_ld' ), 91 );
		add_action( 'wpseo_json_ld', array( $this, 'output' ), 1 );
	}

	/**
	 * JSON LD output function that the functions for specific code can hook into.
	 *
	 * @since 1.8
	 */
	public function json_ld() {
		do_action( 'wpseo_json_ld' );
	}

	/**
	 * Outputs the JSON LD code in a valid JSON+LD wrapper.
	 *
	 * @since 10.2
	 *
	 * @return void
	 */
	public function output() {
		$graph = array();

		foreach ( $this->get_graph_pieces() as $piece ) {
			if ( ! $piece->is_needed() ) {
				continue;
			}

			$graph_piece = $piece->generate();
			if ( is_array( $graph_piece ) ) {
				$graph[] = $graph_piece;
			}
		}

		if ( is_array( $graph ) && ! empty( $graph ) ) {
			$output = array(
				'@context' => 'https://schema.org',
				'@graph'   => $graph,
			);

			echo "<script type='application/ld+json'>", $this->format_data( $output ), '</script>', "\n";
		}
	}

	/**
	 * Prepares the data for outputting.
	 *
	 * @param array $data The data to format.
	 *
	 * @return false|string The prepared string.
	 */
	public function format_data( $data ) {
		$flags = 0;
		if ( version_compare( PHP_VERSION, '5.4', '>=' ) ) {
			$flags = $flags | JSON_UNESCAPED_SLASHES;
		}
		if ( defined( 'WPSEO_DEBUG' ) && WPSEO_DEBUG ) {
			$flags = $flags | JSON_PRETTY_PRINT;
		}

		return wp_json_encode( $data, $flags );
	}

	/**
	 * Gets all the graph pieces we need.
	 *
	 * @return array A filtered array of graph pieces.
	 */
	private function get_graph_pieces() {
		$context = new WPSEO_Schema_Context();

		$pieces = array(
			new WPSEO_Schema_Organization( $context ),
			new WPSEO_Schema_Person( $context ),
			new WPSEO_Schema_Website( $context ),
			new WPSEO_Schema_WebPage( $context ),
			new WPSEO_Schema_Breadcrumb( $context ),
			new WPSEO_Schema_Article( $context ),
		);

		/**
		 * Filter: 'wpseo_schema_graph_pieces' - Allows adding pieces to the graph.
		 *
		 * @api array $pieces The schema pieces.
		 */
		return apply_filters( 'wpseo_schema_graph_pieces', $pieces );
	}
}

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

if ( ! interface_exists( 'WPSEO_Graph_Piece' ) ) {
	/**
	 * An interface for registering Schema Graph Pieces.
	 *
	 * @since 10.2
	 */
	interface WPSEO_Graph_Piece {
		/**
		 * WPSEO_Graph_Piece constructor.
		 *
		 * @param WPSEO_Schema_Context $context A value object with context variables.
		 */
		public function __construct( WPSEO_Schema_Context $context );

		/**
		 * Add your piece of the graph.
		 *
		 * @return array|bool $graph A graph piece on success, false on failure.
		 */
		public function generate();

		/**
		 * Determines whether or not a piece should be added to the graph.
		 *
		 * @return bool
		 */
		public function is_needed();
	}
}

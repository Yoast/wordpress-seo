<?php

namespace Yoast\WP\SEO\Surfaces;

use Exception;

class Schema_Surface {

	private $generators = [];

	private $modifiers = [];

	public function add_piece( $generator ) {
		if ( ! \is_callable( $generator ) ) {
			return false;
		}

		if ( ! \has_filter( 'wpseo_schema_graph', [ $this, 'filter_pieces' ] ) ) {
			\add_filter( 'wpseo_schema_graph', [ $this, 'filter_pieces' ], 10, 2 );
		}

		$this->generators[] = $generator;
		return true;
	}

	public function modify_piece( $type, $modifier ) {
		if ( ! \is_callable( $modifier ) ) {
			return false;
		}

		if ( ! \has_filter( 'wpseo_schema_graph', [ $this, 'filter_pieces' ] ) ) {
			\add_filter( 'wpseo_schema_graph', [ $this, 'filter_pieces' ], 10, 2 );
		}

		$this->modifiers[ $type ] = $modifier;
		return true;
	}

	public function filter_pieces( $graph, $context ) {
		foreach ( $this->generators as $generator ) {
			try {
				$piece = $generator( $context );
			} catch ( Exception $e ) {
				continue;
			}
			if ( \is_array( $piece ) && isset( $piece['@type'] ) ) {
				$graph[] = $piece;
			}
		}

		foreach ( $graph as $index => $piece ) {
			if ( ! isset( $piece['@type'] ) ) {
				continue;
			}
			$type = $piece['@type'];
			if ( ! isset( $this->modifiers[ $type ] ) ) {
				continue;
			}
			foreach ( $this->modifiers[ $type ] as $modifier ) {
				try {
					$modified_piece = $modifier( $piece, $context );
				} catch ( Exception $e ) {
					continue;
				}
				if ( \is_array( $modified_piece ) && isset( $modified_piece['@type'] ) ) {
					$piece = $modified_piece;
				}
			}
			$graph[ $index ] = $piece;
		}


		return $graph;
	}
}

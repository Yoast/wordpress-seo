<?php

namespace Yoast\YoastSEO;

class Prefix_Dependencies {
	/** @var string Prefix to use. */
	protected $prefix;

	/**
	 * Prefix_Dependencies constructor.
	 *
	 * @param $prefix
	 */
	public function __construct( $prefix ) {
		$this->prefix = $prefix;
	}

	/**
	 * @param array $classes
	 */
	public function prefix( array $classes ) {
		foreach ($classes as $class) {
			$this->ensure_alias( $class, '\\' . $this->prefix . '\\' . $class );
		}
	}

	/**
	 * @param $base_class
	 * @param $alias
	 */
	public function ensure_alias( $base_class, $alias ) {
		if ( class_exists( $alias ) || interface_exists( $alias ) ) {
			return;
		}

		class_alias( $base_class, $alias );
	}
}

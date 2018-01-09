<?php

namespace Yoast\YoastSEO;

class Prefix_Dependencies {
	/** @var string Prefix to use. */
	protected $prefix;

	/**
	 * Constructs a new instance.
	 *
	 * @param string $prefix Prefix to use when creating an alias.
	 */
	public function __construct( $prefix ) {
		$this->prefix = $prefix;
	}

	/**
	 * Prefixes a list of classes.
	 *
	 * @param array $classes List of classes which need to be prefixed.
	 *
	 * @return void
	 */
	public function prefix( array $classes ) {
		foreach ( $classes as $class ) {
			$this->ensure_alias( $class, '\\' . $this->prefix . '\\' . $class );
		}
	}

	/**
	 * Ensures the alias can be used.
	 *
	 * @param string $base_class Base class to create the alias from.
	 * @param string $alias      Alias to create.
	 *
	 * @return void
	 */
	public function ensure_alias( $base_class, $alias ) {
		if ( ! $this->needs_alias( $alias ) ) {
			return;
		}

		$this->create_class_alias( $base_class, $alias );
	}

	/**
	 * Checks whether the class needs an alias or already exists.
	 *
	 * @param string $alias Class to check for.
	 *
	 * @return bool True if the class does not exist and needs an alias.
	 */
	protected function needs_alias( $alias ) {
		return ! class_exists( $alias ) && ! interface_exists( $alias );
	}

	/**
	 * Creates a class or interface alias.
	 *
	 * @param string $base_class Class to alias.
	 * @param string $alias      Alias to create.
	 *
	 * @return void
	 */
	protected function create_class_alias( $base_class, $alias ) {
		class_alias( $base_class, $alias );
	}
}

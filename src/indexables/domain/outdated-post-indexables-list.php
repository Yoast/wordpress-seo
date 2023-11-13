<?php

namespace Yoast\WP\SEO\Indexables\Domain;

use Yoast\WP\SEO\Models\Indexable;

/**
 * The Outdated_Post_Indexables_List class.
 */
class Outdated_Post_Indexables_List implements \Iterator, \Countable {

	/**
	 * The post indexables list.
	 *
	 * @var array<Indexable> $post_indexables_list
	 */
	private $post_indexables_list;

	/**
	 * The current array position.
	 *
	 * @var int
	 */
	private $position = 0;

	/**
	 * The constructor.
	 */
	public function __construct() {
		$this->post_indexables_list = [];
	}

	/**
	 * Add an indexable to the list.
	 *
	 * @param Indexable $post The indexable.
	 *
	 * @return void
	 */
	public function add_post_indexable( Indexable $post ) {
		$this->post_indexables_list[] = $post;
	}

	/**
	 * Rewinds the array position.
	 *
	 * @return void
	 */
	public function rewind(): void {
		$this->position = 0;
	}

	/**
	 * The current item selected.
	 *
	 * @return Indexable
	 */
	public function current(): Indexable {

		return $this->post_indexables_list[ $this->position ];
	}

	/**
	 * The current key.
	 *
	 * @return int
	 */
	public function key(): int {
		return $this->position;
	}

	/**
	 * Go to the next position.
	 *
	 * @return void
	 */
	public function next(): void {
		++$this->position;
	}

	/**
	 * Is the current position valid.
	 *
	 * @return bool
	 */
	public function valid(): bool {
		return isset( $this->post_indexables_list[ $this->position ] );
	}

	/**
	 * Returns the size of the array.
	 *
	 * @return int
	 */
	public function count(): int {
		return \count( $this->post_indexables_list );
	}
}

<?php

namespace Yoast\WP\SEO\Indexables\Domain;

use WP_Post;
use Yoast\WP\SEO\Models\Indexable;

class Outdated_Post_Indexables_List implements \Iterator, \Countable {

	/**
	 * @var array<Indexable> $post_indexables_list
	 */
	private $post_indexables_list;

	private $position = 0;

	public function __construct() {
		$this->post_indexables_list = [];
	}

	public function add_post_indexable( Indexable $post ) {
		$this->post_indexables_list[] = $post;
	}

	public function rewind(): void {
		$this->position = 0;
	}

	public function current(): Indexable {

		return $this->post_indexables_list[ $this->position ];
	}

	public function key(): int {
		return $this->position;
	}

	public function next(): void {
		++$this->position;
	}

	public function valid(): bool {
		return isset( $this->post_indexables_list[ $this->position ] );
	}

	public function count():int {
		return \count( $this->post_indexables_list );
	}
}

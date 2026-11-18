<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Domain\Updates;

/**
 * This class describes a collection of post updates.
 */
class Post_Update_Collection {

	/**
	 * The post updates.
	 *
	 * @var array<Post_Update>
	 */
	private $updates = [];

	/**
	 * Adds a post update to the collection.
	 *
	 * @param Post_Update $update The post update to add.
	 *
	 * @return void
	 */
	public function add( Post_Update $update ): void {
		$this->updates[] = $update;
	}

	/**
	 * Returns the post updates in the collection.
	 *
	 * @return array<Post_Update> The post updates in the collection.
	 */
	public function get(): array {
		return $this->updates;
	}
}

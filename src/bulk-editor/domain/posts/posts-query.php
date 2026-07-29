<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Domain\Posts;

/**
 * Describes a request for a page of bulk editor posts.
 *
 * Carries every parameter the collectors need so new filters (status, quality) can be added
 * to this object instead of growing the collector method signatures.
 */
class Posts_Query {

	/**
	 * The content type to get posts for.
	 *
	 * @var string
	 */
	private $content_type;

	/**
	 * The page of results to get, starting at 1.
	 *
	 * @var int
	 */
	private $page;

	/**
	 * The number of posts per page.
	 *
	 * @var int
	 */
	private $per_page;

	/**
	 * The search term to filter posts by, or an empty string for no search.
	 *
	 * @var string
	 */
	private $search;

	/**
	 * The post statuses to include.
	 *
	 * @var array<string>
	 */
	private $statuses;

	/**
	 * The author to limit posts to, or null for no author restriction.
	 *
	 * @var int|null
	 */
	private $author_id;

	/**
	 * The constructor.
	 *
	 * @param string        $content_type The content type to get posts for.
	 * @param int           $page         The page of results to get, starting at 1.
	 * @param int           $per_page     The number of posts per page.
	 * @param string        $search       The search term, or an empty string for no search.
	 * @param array<string> $statuses     The post statuses to include.
	 * @param int|null      $author_id    The author to limit posts to, or null for no author restriction.
	 */
	public function __construct(
		string $content_type,
		int $page,
		int $per_page,
		string $search,
		array $statuses,
		?int $author_id = null
	) {
		$this->content_type = $content_type;
		$this->page         = $page;
		$this->per_page     = $per_page;
		$this->search       = $search;
		$this->statuses     = $statuses;
		$this->author_id    = $author_id;
	}

	/**
	 * Returns the content type to get posts for.
	 *
	 * @return string The content type.
	 */
	public function get_content_type(): string {
		return $this->content_type;
	}

	/**
	 * Returns the page of results to get.
	 *
	 * @return int The page, starting at 1.
	 */
	public function get_page(): int {
		return $this->page;
	}

	/**
	 * Returns the number of posts per page.
	 *
	 * @return int The number of posts per page.
	 */
	public function get_per_page(): int {
		return $this->per_page;
	}

	/**
	 * Returns the search term.
	 *
	 * @return string The search term, or an empty string for no search.
	 */
	public function get_search(): string {
		return $this->search;
	}

	/**
	 * Returns whether a search term is set.
	 *
	 * @return bool Whether a search term is set.
	 */
	public function has_search(): bool {
		return $this->search !== '';
	}

	/**
	 * Returns the post statuses to include.
	 *
	 * @return array<string> The post statuses.
	 */
	public function get_statuses(): array {
		return $this->statuses;
	}

	/**
	 * Returns the author to limit posts to.
	 *
	 * @return int|null The author ID, or null for no author restriction.
	 */
	public function get_author_id(): ?int {
		return $this->author_id;
	}

	/**
	 * Returns whether posts are limited to a single author.
	 *
	 * @return bool Whether an author restriction is set.
	 */
	public function has_author_filter(): bool {
		return $this->author_id !== null;
	}

	/**
	 * Returns the zero-based offset of the requested page.
	 *
	 * @return int The offset.
	 */
	public function get_offset(): int {
		return ( ( $this->page - 1 ) * $this->per_page );
	}
}

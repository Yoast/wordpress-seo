<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Llms_Txt\Domain\Content_Types;

/**
 * This class describes a Content Type Entry.
 */
class Content_Type_Entry {

	/**
	 * The ID of the content type entry.
	 *
	 * @var int
	 */
	private $id;

	/**
	 * The title of the content type entry.
	 *
	 * @var string
	 */
	private $title;

	/**
	 * The URL of the content type entry.
	 *
	 * @var string
	 */
	private $url;

	/**
	 * The description of the content type entry.
	 *
	 * @var string
	 */
	private $description;

	/**
	 * The constructor.
	 *
	 * @param int    $id          The ID of the content type entry.
	 * @param string $title       The title of the content type entry.
	 * @param string $url         The URL of the content type entry.
	 * @param string $description The description of the content type entry.
	 */
	public function __construct( int $id, ?string $title = null, ?string $url = null, ?string $description = null ) {
		$this->id          = $id;
		$this->title       = $title;
		$this->url         = $url;
		$this->description = $description;
	}

	/**
	 * Gets the ID of the content type entry.
	 *
	 * @return int The ID of the content type entry.
	 */
	public function get_id(): int {
		return $this->id;
	}

	/**
	 * Gets the title of the content type entry.
	 *
	 * @return string The title of the content type entry.
	 */
	public function get_title(): string {
		return $this->title;
	}

	/**
	 * Gets the URL of the content type entry.
	 *
	 * @return string The URL of the content type entry.
	 */
	public function get_url(): string {
		return $this->url;
	}

	/**
	 * Gets the description of the content type entry.
	 *
	 * @return string The description of the content type entry.
	 */
	public function get_description(): string {
		return $this->description;
	}
}

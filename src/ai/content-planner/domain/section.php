<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\Content_Planner\Domain;

/**
 * Value object for a content outline section.
 */
class Section {

	/**
	 * The subheading text.
	 *
	 * @var string|null
	 */
	private $subheading_text;

	/**
	 * The content notes.
	 *
	 * @var array<string>
	 */
	private $content_notes;

	/**
	 * The constructor.
	 *
	 * @param array<string> $content_notes   The content notes.
	 * @param string|null   $subheading_text The subheading text.
	 */
	public function __construct( array $content_notes, ?string $subheading_text ) {
		$this->subheading_text = $subheading_text;
		$this->content_notes   = $content_notes;
	}

	/**
	 * Returns the subheading text.
	 *
	 * @return string|null The subheading text.
	 */
	public function get_subheading_text(): ?string {
		return $this->subheading_text;
	}

	/**
	 * Returns the content notes.
	 *
	 * @return array<string> The content notes.
	 */
	public function get_content_notes(): array {
		return $this->content_notes;
	}

	/**
	 * Returns this object in array format.
	 *
	 * @return array<string, string|array<string>|null> The section as an array.
	 */
	public function to_array(): array {
		return [
			'subheading_text' => $this->subheading_text,
			'content_notes'   => $this->content_notes,
		];
	}
}

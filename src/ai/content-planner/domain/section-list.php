<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\Content_Planner\Domain;

/**
 * List of content outline sections.
 */
class Section_List {

	/**
	 * The sections.
	 *
	 * @var array<Section>
	 */
	private $sections = [];

	/**
	 * Adds a section to the list.
	 *
	 * @param Section $section A section.
	 *
	 * @return void
	 */
	public function add( Section $section ): void {
		$this->sections[] = $section;
	}

	/**
	 * Returns this object in array format.
	 *
	 * @return array<string, array<array<string, string|array<string>|null>>> The sections as an array.
	 */
	public function to_array(): array {
		$result = [];
		foreach ( $this->sections as $section ) {
			$result[] = $section->to_array();
		}

		return [ 'outline' => $result ];
	}
}

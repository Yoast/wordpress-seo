<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\Content_Planner\Domain;

/**
 * List of content suggestions.
 */
class Content_Suggestion_List {

	/**
	 * The suggestions.
	 *
	 * @var array<Content_Suggestion>
	 */
	private $content_suggestions = [];

	/**
	 * Adds a content suggestion to the list.
	 *
	 * @param Content_Suggestion $content_suggestion A content suggestion.
	 *
	 * @return void
	 */
	public function add( Content_Suggestion $content_suggestion ): void {
		$this->content_suggestions[] = $content_suggestion;
	}

	/**
	 * Returns this object in array format.
	 *
	 * @return array<array<string, string|bool|array<string, int>>> The suggestions as an array.
	 */
	public function to_array(): array {
		$result = [];
		foreach ( $this->content_suggestions as $suggestion ) {
			$result[] = $suggestion->to_array();
		}

		return [ 'suggestions' => $result ];
	}
}

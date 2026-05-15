<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\Content_Planner\Domain;

/**
 * The response to a content suggestion request, bundling suggestions with the recent content used to generate them.
 */
class Content_Suggestion_Response {

	/**
	 * The content suggestions.
	 *
	 * @var Content_Suggestion_List
	 */
	private $suggestions;

	/**
	 * The recent content used to generate the suggestions.
	 *
	 * @var Post_List
	 */
	private $recent_content;

	/**
	 * The constructor.
	 *
	 * @param Content_Suggestion_List $suggestions    The content suggestions.
	 * @param Post_List               $recent_content The recent content.
	 */
	public function __construct( Content_Suggestion_List $suggestions, Post_List $recent_content ) {
		$this->suggestions    = $suggestions;
		$this->recent_content = $recent_content;
	}

	/**
	 * Returns the content suggestions.
	 *
	 * @return Content_Suggestion_List The content suggestions.
	 */
	public function get_suggestions(): Content_Suggestion_List {
		return $this->suggestions;
	}

	/**
	 * Returns the recent content.
	 *
	 * @return Post_List The recent content.
	 */
	public function get_recent_content(): Post_List {
		return $this->recent_content;
	}

	/**
	 * Returns this object in array format.
	 *
	 * @return array<string, mixed> The response as an array.
	 */
	public function to_array(): array {
		$result                   = $this->suggestions->to_array();
		$result['recent_content'] = $this->recent_content->to_array();
		return $result;
	}
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Components;

/**
 * This class describes a set of copy.
 */
class Copy_Set {

	/**
	 * The title copy.
	 *
	 * @var string
	 */
	private $title;

	/**
	 * The about copy paragraphs.
	 *
	 * @var array<string>
	 */
	private $about;

	/**
	 * The constructor.
	 *
	 * @param string        $title The title copy.
	 * @param array<string> $about The about copy paragraphs. Each element can contain HTML markup.
	 */
	public function __construct(
		string $title,
		array $about = []
	) {
		$this->title = $title;
		$this->about = $about;
	}

	/**
	 * Returns an array representation of the copy set data.
	 *
	 * @return array<string, string|array<string>> Returns in an array format.
	 */
	public function to_array(): array {
		return [
			'title' => $this->title,
			'about' => $this->about,
		];
	}
}

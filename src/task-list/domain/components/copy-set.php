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
	 * The about copy.
	 *
	 * @var string
	 */
	private $about;

	/**
	 * The constructor.
	 *
	 * @param string $title The title copy.
	 * @param string $about The about copy. Can contain HTML markup like <strong> and <p>.
	 */
	public function __construct(
		string $title,
		string $about = ''
	) {
		$this->title = $title;
		$this->about = $about;
	}

	/**
	 * Returns the copy set's about.
	 *
	 * @return string
	 */
	public function get_about(): string {
		return $this->about;
	}

	/**
	 * Returns an array representation of the copy set data.
	 *
	 * @return array<string, string> Returns in an array format.
	 */
	public function to_array(): array {
		return [
			'title' => $this->title,
			'about' => $this->about,
		];
	}
}

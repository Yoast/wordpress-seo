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
	private $title_copy;

	/**
	 * The why copy.
	 *
	 * @var string
	 */
	private $why_copy;

	/**
	 * The how to copy.
	 *
	 * @var string
	 */
	private $how_to_copy;

	/**
	 * The constructor.
	 *
	 * @param string $title_copy  The title copy.
	 * @param string $why_copy    The why copy.
	 * @param string $how_to_copy The how to copy.
	 */
	public function __construct(
		string $title_copy,
		string $why_copy,
		string $how_to_copy
	) {
		$this->title_copy  = $title_copy;
		$this->why_copy    = $why_copy;
		$this->how_to_copy = $how_to_copy;
	}

	/**
	 * Returns an array representation of the copy set data.
	 *
	 * @return array<string, string|bool> Returns in an array format.
	 */
	public function to_array(): array {
		return [
			'title_copy'  => $this->title_copy,
			'why_copy'    => $this->why_copy,
			'how_to_copy' => $this->how_to_copy,
		];
	}
}

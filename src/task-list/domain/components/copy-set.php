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
	 * The why copy.
	 *
	 * @var string
	 */
	private $why;

	/**
	 * The how copy.
	 *
	 * @var string
	 */
	private $how;

	/**
	 * The constructor.
	 *
	 * @param string $title The title copy.
	 * @param string $why   The why copy.
	 * @param string $how   The how copy.
	 */
	public function __construct(
		string $title,
		string $why,
		?string $how = null
	) {
		$this->title = $title;
		$this->why   = $why;
		$this->how   = $how;
	}

	/**
	 * Returns an array representation of the copy set data.
	 *
	 * @return array<string, string|bool> Returns in an array format.
	 */
	public function to_array(): array {
		return [
			'title' => $this->title,
			'why'   => $this->why,
			'how'   => $this->how,
		];
	}
}

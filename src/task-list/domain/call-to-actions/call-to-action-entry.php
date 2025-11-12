<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Call_To_Actions;

use InvalidArgumentException;
/**
 * This class describes a Call To Action Entry.
 */
class Call_To_Action_Entry {

	/**
	 * Allowed variants for the call to action.
	 *
	 * @var string[]
	 */
	private const ALLOWED_VARIANTS = [
		'default',
		'link',
		'add',
		'delete',
	];

	/**
	 * The title of the call to action.
	 *
	 * @var string
	 */
	private $title;

	/**
	 * The variant of the call to action.
	 *
	 * @var string
	 */
	private $variant;

	/**
	 * The link of the call to action.
	 *
	 * @var string
	 */
	private $link;

	/**
	 * The constructor.
	 *
	 * @param string $title   The title of the content type entry.
	 * @param string $variant The variant of the content type entry.
	 * @param string $link    The link of the content type entry.
	 *
	 * @throws InvalidArgumentException If the variant is invalid.
	 */
	public function __construct(
		string $title,
		string $variant,
		?string $link = null
	) {
		if ( ! \in_array( $variant, self::ALLOWED_VARIANTS, true ) ) {
			throw new InvalidArgumentException( 'Invalid variant for call to action' );
		}

		$this->title   = $title;
		$this->variant = $variant;
		$this->link    = $link;
	}

	/**
	 * Returns an array representation of the task data.
	 *
	 * @return array<string, string|bool> Returns in an array format.
	 */
	public function to_array(): array {
		return [
			'title'   => $this->title,
			'variant' => $this->variant,
			'link'    => $this->link,
		];
	}
}

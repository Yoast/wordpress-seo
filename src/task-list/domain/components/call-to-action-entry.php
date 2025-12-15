<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Components;

use InvalidArgumentException;
/**
 * This class describes a Call To Action Entry.
 */
class Call_To_Action_Entry {

	/**
	 * Allowed types for the call to action.
	 *
	 * @var string[]
	 */
	private const ALLOWED_TYPES = [
		'default',
		'link',
		'add',
		'delete',
	];

	/**
	 * The label of the call to action.
	 *
	 * @var string
	 */
	private $label;

	/**
	 * The type of the call to action.
	 *
	 * @var string
	 */
	private $type;

	/**
	 * The href of the call to action.
	 *
	 * @var string
	 */
	private $href;

	/**
	 * The constructor.
	 *
	 * @param string $label The label of the content type entry.
	 * @param string $type  The type of the content type entry.
	 * @param string $href  The href of the content type entry.
	 *
	 * @throws InvalidArgumentException If the type is invalid.
	 */
	public function __construct(
		string $label,
		string $type,
		?string $href = null
	) {
		if ( ! \in_array( $type, self::ALLOWED_TYPES, true ) ) {
			throw new InvalidArgumentException( 'Invalid type for call to action' );
		}

		$this->label = $label;
		$this->type  = $type;
		$this->href  = $href;
	}

	/**
	 * Returns an array representation of the call to action data.
	 *
	 * @return array<string, string|bool> Returns in an array format.
	 */
	public function to_array(): array {
		return [
			'label' => $this->label,
			'type'  => $this->type,
			'href'  => $this->href,
		];
	}
}

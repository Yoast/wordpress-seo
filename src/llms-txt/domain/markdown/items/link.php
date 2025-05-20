<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items;

/**
 * Represents a link markdown item.
 */
class Link implements Item_Interface {

	/**
	 * The description that is part of this link.
	 *
	 * @var string|null
	 */
	protected $description;

	/**
	 * The link text.
	 *
	 * @var string
	 */
	private $text;

	/**
	 * The anchor text.
	 *
	 * @var string
	 */
	private $anchor;

	/**
	 * Class constructor.
	 *
	 * @param string      $text        The link text.
	 * @param string      $anchor      The anchor text.
	 * @param string|null $description The description.
	 */
	public function __construct( string $text, string $anchor, ?string $description = null ) {
		$this->text    = $text;
		$this->anchor  = $anchor;
		$this->description = $description;
	}

	/**
	 * Renders the link item.
	 *
	 * @return string
	 */
	public function render(): string {
		return "[$this->text]($this->anchor)" . ( $this->description !== null ) ? ": $this->description" : '';
	}
}

<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items;

use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Escaper;

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
		$this->text        = $text;
		$this->anchor      = $anchor;
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

	/**
	 * Escapes the markdown content.
	 *
	 * @param param Markdown_Escaper $markdown_escaper The markdown escaper.
	 *
	 * @return void
	 */
	public function markdown_escape( Markdown_Escaper $markdown_escaper ): void {
		$this->text        = $markdown_escaper->markdown_content_escape( $this->text );
		$this->description = $markdown_escaper->markdown_content_escape( $this->description );
		$this->anchor      = $markdown_escaper->markdown_url_escape( $this->anchor );
	}
}

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Menu
 */

/**
 * Renders a replacement variable editor.
 */
class WPSEO_Replacevar_Editor {
	/**
	 * @var Yoast_Form Yoast Forms instance.
	 */
	private $yform;

	/**
	 * @var string The id for the hidden title field.
	 */
	private $title;

	/**
	 * @var string The id for the hidden description field.
	 */
	private $description;

	/**
	 * @var string The page type for context.
	 */
	private $page_type;

	/**
	 * @var bool Whether the editor has paper style.
	 */
	private $paper_style;

	/**
	 * Constructs the object.
	 *
	 * @param Yoast_Form $yform       Yoast forms.
	 * @param string     $title       The title field id.
	 * @param string     $description The description field id.
	 * @param string     $page_type   The page type for context.
	 * @param bool       $paper_style Whether the editor has paper style.
	 */
	public function __construct( Yoast_Form $yform, $title, $description, $page_type, $paper_style = true ) {
		$this->yform       = $yform;
		$this->title       = (string) $title;
		$this->description = (string) $description;
		$this->page_type   = (string) $page_type;
		$this->paper_style = (bool) $paper_style;
	}

	/**
	 * Renders a div for the react application to mount to, and hidden inputs where
	 * the app should store it's value so they will be properly saved when the form
	 * is submitted.
	 *
	 * @return void
	 */
	public function render() {
		$this->yform->hidden( $this->title, $this->title );
		$this->yform->hidden( $this->description, $this->description );

		printf( '<div
				data-react-replacevar-editor
				data-react-replacevar-title-field-id="%1$s"
				data-react-replacevar-metadesc-field-id="%2$s"
				data-react-replacevar-page-type="%3$s"
				data-react-replacevar-paper-style="%4$s"></div>',
			esc_attr( $this->title ),
			esc_attr( $this->description ),
			esc_attr( $this->page_type ),
			esc_attr( $this->paper_style )
		);
	}
}

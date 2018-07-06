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
	 * @var array {
	 *      The arguments required for the div to render.
	 *
	 *      @type string $title                 The title field id.
	 *      @type string $description           The description field id.
	 *      @type string $page_type_recommended The page type for the context of the recommended replace vars.
	 *      @type string $page_type_specific    The page type for the context of the editor specific replace vars.
	 *      @type bool   $paper_style           Optional. Whether the editor has paper style.
	 * }
	 */
	private $arguments;

	/**
	 * Constructs the object.
	 *
	 * @param Yoast_Form $yform                 Yoast forms.
	 * @param array      $arguments {
	 *      The arguments that can be given.
	 *
	 *      @type string $title                 The title field id.
	 *      @type string $description           The description field id.
	 *      @type string $page_type_recommended The page type for the context of the recommended replace vars.
	 *      @type string $page_type_specific    The page type for the context of the editor specific replace vars.
	 *      @type bool   $paper_style           Optional. Whether the editor has paper style.
	 * }
	 */
	public function __construct( Yoast_Form $yform, $arguments ) {
		$arguments = wp_parse_args(
			$arguments,
			array(
				'paper_style' => true,
			)
		);

		$this->validate_arguments( $arguments );

		$this->yform     = $yform;
		$this->arguments = array(
			'title'                 => (string) $arguments['title'],
			'description'           => (string) $arguments['description'],
			'page_type_recommended' => (string) $arguments['page_type_recommended'],
			'page_type_specific'    => (string) $arguments['page_type_specific'],
			'paper_style'           => (bool) $arguments['paper_style'],
		);
	}

	/**
	 * Renders a div for the react application to mount to, and hidden inputs where
	 * the app should store it's value so they will be properly saved when the form
	 * is submitted.
	 *
	 * @return void
	 */
	public function render() {
		$this->yform->hidden( $this->arguments['title'], $this->arguments['title'] );
		$this->yform->hidden( $this->arguments['description'], $this->arguments['description'] );

		printf( '<div
				data-react-replacevar-editor
				data-react-replacevar-title-field-id="%1$s"
				data-react-replacevar-metadesc-field-id="%2$s"
				data-react-replacevar-page-type-recommended="%3$s"
				data-react-replacevar-page-type-specific="%4$s"
				data-react-replacevar-paper-style="%5$s"></div>',
			esc_attr( $this->arguments['title'] ),
			esc_attr( $this->arguments['description'] ),
			esc_attr( $this->arguments['page_type_recommended'] ),
			esc_attr( $this->arguments['page_type_specific'] ),
			esc_attr( $this->arguments['paper_style'] )
		);
	}

	/**
	 * @param array $arguments The arguments to validate.
	 *
	 * @throws InvalidArgumentException Thrown when not all required arguments are present.
	 */
	protected function validate_arguments( array $arguments ) {
		$required_arguments = array(
			'title',
			'description',
			'page_type_recommended',
			'page_type_specific',
			'paper_style',
		);

		foreach ( $required_arguments as $field_name ) {
			if ( ! array_key_exists( $field_name, $arguments ) ) {
				throw new InvalidArgumentException(
					sprintf(
						/* translators: %1$s expands to the missing field name.  */
						__( 'Not all required fields are given. Missing field %1$s', 'wordpress-seo' ),
						$field_name
					)
				);
			}
		}
	}
}

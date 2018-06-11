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
	 * @var Yoast_Form  Yoast Forms instance.
	 */
	private $yform;
	/**
	 * @var string      The id for the hidden title field.
	 */
	private $title;
	/**
	 * @var string|null The id for the hidden description field.
	 */
	private $description;

	/**
	 * WPSEO_Replacevar_Editor constructor.
	 *
	 * @param Yoast_Form $yform       Yoast forms.
	 * @param string     $title       The title field id.
	 * @param string     $description The description field id.
	 */
	public function __construct( $yform, $title, $description = null ) {
		$this->yform = $yform;
		$this->title = $title;
		$this->description = $description;
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
		if ( ! is_null( $this->description ) ) {
			$this->yform->hidden( $this->description, $this->description );
		}
		?>
			<div
				data-react-replacevar
				data-react-replacevar-title="<?php echo esc_attr( $this->title ) ?>"
				data-react-replacevar-metadesc="<?php echo esc_attr( $this->description ) ?>"
			></div>
		<?php
	}
}

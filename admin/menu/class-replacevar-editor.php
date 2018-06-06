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
	 * @var Yoast_Form
	 */
	private $yform;
	/**
	 * @var string
	 */
	private $title;
	/**
	 * @var string|null
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
	 * Renders a div with custom data attributes for the React search appearance editors.
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

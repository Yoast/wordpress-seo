<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Menu
 */

/**
 * Renders a single replacement variable field.
 */
class WPSEO_Replacevar_Field {
	/**
	 * @var Yoast_Form  Yoast Forms instance.
	 */
	private $yform;
	/**
	 * @var string      The id for the hidden field.
	 */
	private $field_id;
	/**
	 * @var string      The label for the field.
	 */
	private $label;

	/**
	 * WPSEO_Replacevar_Editor constructor.
	 *
	 * @param Yoast_Form $yform       Yoast forms.
	 * @param string     $field_id    The field id.
	 * @param string     $label       The field label.
	 */
	public function __construct( $yform, $field_id, $label ) {
		$this->yform = $yform;
		$this->field_id = $field_id;
		$this->label = $label;
	}

	/**
	 * Renders a div for the react application to mount to, and hidden inputs where
	 * the app should store it's value so they will be properly saved when the form
	 * is submitted.
	 *
	 * @return void
	 */
	public function render() {
		$this->yform->hidden( $this->field_id, $this->field_id );
		?>
		<div
			data-react-replacevar-field
			data-react-replacevar-field-id="<?php echo esc_attr( $this->field_id ) ?>"
			data-react-replacevar-field-label="<?php echo esc_attr( $this->label ) ?>"
		></div>
		<?php
	}
}

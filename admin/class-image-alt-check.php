<?php
/**
 * @package WPSEO\Admin\ImageAltCheck
 */

/**
 * Class with functionality to check images for missing Alt Attribute Text
 */
class WPSEO_Alt_Image_Check {


	/**
	 * Construct Method.
	 */
	public function __construct() {
		add_action('admin_menu', array( $this,'check_image_alt_text_menu') );
	}

	/**
	 * Add SubMenu Page
	 */
	public function check_image_alt_text_menu() {
		add_submenu_page( 'wpseo_dashboard', 'Check Image Alt Text', 'Image Alt Text', 'manage_options', 'check_image_alt_text', array( $this,'check_image_alt_text_options') );
}

	/**
	 * Load Page
	 */
	public function check_image_alt_text_options() { ?>
	<?php
		$query_images_args = array(
		    'post_type' => 'attachment', 'post_mime_type' =>'image', 'post_status' => 'inherit', 'posts_per_page' => -1,
		);
		$query_images = new WP_Query($query_images_args);
		$images = array();
		foreach ( $query_images->posts as $image) {
			$altText = get_post_meta($image->ID, '_wp_attachment_image_alt', true);

			if(strlen($altText) === 0) {
				$imgObj = array(
					'id' => $image->ID,
					'url' => wp_get_attachment_thumb_url($image->ID)
				);

				$images[]= $imgObj;
			}
		}
	?>
	<div id="=check_image_alt_text_options" class="wrap">
		<h2><?php echo __('Images with no Alt Attribute', 'wordpress-seo'); ?></h2>
		<span>
		<?php echo __('The alt attribute provides alternative information for an image if a user for some reason cannot view it. The following images do not have alternative attribute text associated with them:', 'wordpress-seo'); ?>
		</span><br /><br />
		<table class="widefat">
			<thead>
				<tr>
					<th><?php echo __('Image ID', 'wordpress-seo'); ?></th>
					<th><?php echo __('Thumbnail', 'wordpress-seo'); ?></th>
					<th><?php echo __('Manage', 'wordpress-seo'); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php foreach($images as $key => $value) : ?>
					<tr <?php echo ($key % 2 === 0 ? 'class="alternate"' : ''); ?>>
						<td><?php echo $value['id']; ?></td>
						<td><img src="<?php echo $value['url']; ?>" alt="thumbnail of <?php echo $value['id']; ?>" /></td>
						<td><a href="<?php echo admin_url(); ?>upload.php?item=<?php echo $value['id']; ?>"><?php echo __('Manage', 'wordpress-seo'); ?></a></td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	</div>
<?php }

}


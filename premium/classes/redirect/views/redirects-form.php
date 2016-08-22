<?php
/**
 * @package WPSEO\Premium\Views
 *
 * @var array  $redirect_types
 * @var string $old_url
 * @var string $origin_label_value
 */

?>
<div class="redirect_form_row" id="row-wpseo_redirects_type">
	<label class='textinput' for='wpseo_redirects_type<?php echo $input_suffix; ?>'>
		<span class="title"><?php echo _x( 'Type', 'noun', 'wordpress-seo-premium' ); ?></span>
	</label>
	<select name='wpseo_redirects_type' id='wpseo_redirects_type<?php echo $input_suffix; ?>' class='select'>
		<?php
		// Loop through the redirect types.
		if ( count( $redirect_types ) > 0 ) {
			foreach ( $redirect_types as $type => $desc ) {
				echo '<option value="' . $type . '"' . sprintf( $values['type'], $type ) . '>' . $desc . '</option>' . PHP_EOL;
			}
		}
		?>
	</select>
</div>

<p class="label desc description wpseo-redirect-clear">
	<?php
	printf(
		/* translators: 1: opens a link to a related knowledge base article. 2: closes the link. */
		__( 'The redirect type is the HTTP response code sent to the browser telling the browser what type of redirect is served. %1$sLearn more about redirect types%2$s.', 'wordpress-seo-premium' ),
		'<a href="http://kb.yoast.com/article/121-redirect-types/#utm_source=wordpress-seo-premium-redirects&amp;utm_medium=inline-help&amp;utm_campaign=redirect-types" target="_blank">',
		'</a>'
	);
	?>
</p>

<div class='redirect_form_row' id="row-wpseo_redirects_origin">
	<label class='textinput' for='wpseo_redirects_origin<?php echo $input_suffix; ?>'>
		<span class="title"><?php echo $origin_label_value; ?></span>
	</label>
	<input type='text' class='textinput' name='wpseo_redirects_origin' id='wpseo_redirects_origin<?php echo $input_suffix; ?>' value='<?php echo $values['origin']; ?>' />
</div>
<br class='clear'/>

<div class="redirect_form_row wpseo_redirect_target_holder" id="row-wpseo_redirects_target">
	<label class='textinput' for='wpseo_redirects_target<?php echo $input_suffix; ?>'>
		<span class="title"><?php _e( 'URL', 'wordpress-seo-premium' ); ?></span>
	</label>
	<input type='text' class='textinput' name='wpseo_redirects_target' id='wpseo_redirects_target<?php echo $input_suffix; ?>' value='<?php echo $values['target']; ?>' />
</div>
<br class='clear'/>

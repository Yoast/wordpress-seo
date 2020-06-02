import classnames from "classnames";
import { IconButton } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import URLInput from "./url-input";

export default function LinkEditor( {
	autocompleteRef,
	className,
	onChangeInputValue,
	value,
	...props
} ) {
	return (
		<form
			className={ classnames(
				"block-editor-url-popover__link-editor",
				className
			) }
			{ ...props }
		>
			<URLInput
				value={ value }
				onChange={ onChangeInputValue }
				autocompleteRef={ autocompleteRef }
			/>
			<IconButton icon="editor-break" label={ __( "Apply", "wordpress-seo" ) } type="submit" />
		</form>
	);
}

import { Root, TextField } from "@yoast/ui-library";

/**
 * Renders the related keyphrase input field.
 *
 * Props that are not consumed by this component are forwarded to the underlying TextField.
 *
 * @param {Object} props The component props.
 * @param {string} props.id The id of the input.
 * @param {string} props.label The label of the input.
 * @param {Function} props.onChange The change handler. Receives the raw change event.
 * @param {import("react").ReactNode} [props.description=""] The description of the input.
 *
 * @returns {JSX.Element} The related keyphrase input field.
 */
const RelatedKeyphraseInputField = ( { id, label, description = "", onChange, ...inputProps } ) => (
	<Root>
		<TextField
			id={ id }
			label={ label }
			onChange={ onChange }
			autoComplete="off"
			description={ description }
			{ ...inputProps }
		/>
	</Root>
);

export default RelatedKeyphraseInputField;

import { useMemo } from "@wordpress/element";
import { SelectField, TextField, Alert } from "@yoast/ui-library";
import { FORMAT_PLAIN, REDIRECT_TYPE_OPTIONS } from "../constants";
import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { useSelectRedirects } from "../hooks";
import { FormikValueChangeField } from "../../shared-admin/components/form";
import FormikWithErrorField from "../../shared-admin/components/form/formik-with-error-field";

/**
 * FormAddRedirect component
 *
 * This component renders a form section for adding a new redirect.
 * It includes:
 * - A select input for choosing the HTTP redirect type (301, 302, etc.).
 * - A text input for the origin (old URL).
 * - A text input for the target (new URL).
 * @param {string} format - The format of the redirects being managed. Can be "plain" or "regex".
 * @param {string} error - The error from submit.
 *
 * @returns {JSX.Element} The rendered form section for adding a redirect.
*/
export const FormAddRedirect = ( { format = FORMAT_PLAIN, error = "" } ) => {
	const redirectsTypeLink = useSelectRedirects( "selectLink", [], "https://yoa.st/2jb" );

	const redirectTypeDescription = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening anchor tag.
			 * %2$s expands to a closing anchor tag.
			 */
			__( "The redirect type is the HTTP response code sent to the browser telling the browser what type of redirect is served. %1$sLearn more about redirect types%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ redirectsTypeLink } target="_blank" rel="noopener noreferrer" />,
		}
	), [] );

	return (
		<div className="lg:yst-mt-0 lg:yst-col-span-2 yst-space-y-8">
			{ error && <Alert variant="error">{ error }</Alert> }
			<div>
				<FormikValueChangeField
					as={ SelectField }
					type="select"
					name="type"
					id={ `yst-input-type-${format}` }
					label={ __( "Redirect Type", "wordpress-seo" ) }
					options={ REDIRECT_TYPE_OPTIONS }
					className="yst-max-w-sm"
				/>
				<div className="yst-text-field__description">
					{ redirectTypeDescription }
				</div>
			</div>

			<FormikWithErrorField
				as={ TextField }
				type="text"
				name="origin"
				id={ `yst-input-origin-${format}` }
				label={ __( "Old URL", "wordpress-seo" ) }
			/>
			<FormikWithErrorField
				as={ TextField }
				type="text"
				name="target"
				id={ `yst-input-target-${format}` }
				label={ __( "New URL", "wordpress-seo" ) }
			/>
		</div>
	);
};

import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import {
	FilterControls,
	ListRedirects,
	Notifications,
	RouteLayout,
} from "../components";
import { useSelectRedirects } from "../hooks";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { FORMAT_REGEX, initialRegexValues } from "../constants";
import { FieldsetLayout } from "../../shared-admin/components";
import { Form, Formik } from "formik";
import { createValidationSchema, handleCreateSubmit } from "../helpers";
import { FormAddRedirect } from "../components/form-add-redirect";

/**
 * @returns {JSX.Element} The redirects route.
 */
export const RegexRedirects = () => {
	const redirectsManagedLink = useSelectRedirects( "selectLink", [], "https://yoa.st/3lo" );

	const redirectsDescription = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening anchor tag.
			 * %2$s expands to a closing anchor tag.
			 */
			__( "Regular expression (regex) Redirects are extremely powerful redirects. You should only use them if you know what you are doing. %1$sLearn more about regex redirects on our help center%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ redirectsManagedLink } target="_blank" rel="noopener noreferrer" />,
		}
	), [] );


	return (
		<RouteLayout
			title={ __( "Regular Expressions redirects / Regex redirects - TBD title", "wordpress-seo" ) }
			description={ redirectsDescription }
		>
			<Formik
				initialValues={ initialRegexValues }
				validationSchema={ createValidationSchema( {} ) }
				onSubmit={ handleCreateSubmit }
			>
				{ ( { isSubmitting } ) => (
					<Form className="yst-max-w-5xl yst-p-8">
						<FieldsetLayout
							title={ __( "Title", "wordpress-seo" ) }
							description={ __( "Description needed", "wordpress-seo" ) }
							variant={ "xl" }
						>
							<FormAddRedirect />
							<Button
								id="yst-button-submit-settings"
								type="submit"
								isLoading={ isSubmitting }
								disabled={ isSubmitting }
							>
								{ __( "Add redirect", "wordpress-seo" ) }
							</Button>
						</FieldsetLayout>
						<Notifications />
					</Form>
				) }
			</Formik>
			<div className="yst-max-w-5xl yst-px-8 yst-pb-8">
				<hr className="yst-mb-8" />
				<FilterControls format={ FORMAT_REGEX } />
				<ListRedirects format={ FORMAT_REGEX } />
			</div>
		</RouteLayout>
	);
};

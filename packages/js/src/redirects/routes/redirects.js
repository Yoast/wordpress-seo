import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import {
	Notifications,
	RouteLayout,
} from "../components";
import { useSelectRedirects } from "../hooks";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { FieldsetLayout } from "../../shared-admin/components";
import { Form, Formik } from "formik";
import { FormAddRedirect } from "../components/form-add-redirect";

/**
 * Redirects component.
 *
 * This component renders the main interface for managing plain (non-regex) redirects
 * within the WordPress SEO admin panel. It provides a form to add new redirects, displays
 * a description with a help link, and includes filter controls and a list of existing redirects.
 *
 * @component
 *
 * @param {Object} [initialValues={}] - Initial values for the Formik form.
 * @param {Function} [createValidationSchema=() => {}] - A function that returns a Yup validation schema for validating the form.
 * @param {Function} [handleCreateSubmit=() => {}] - A function to handle form submission.
 * @param {JSX.Element} listRedirects - A component to display the list of redirects.
 * @param {JSX.Element} filterControls - A component to render the filter controls.
 *
 * @returns {JSX.Element} The rendered Redirects route.
 */
export const Redirects = ( {
	initialValues = {},
	createValidationSchema = () => {},
	handleCreateSubmit = () => {},
	listRedirects: ListRedirects,
	filterControls: FilterControls,
} ) => {
	const redirectsManagedLink = useSelectRedirects( "selectLink", [], "https://yoast.com/yoast-seo-redirect-manager" );

	const redirectsDescription = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening anchor tag.
			 * %2$s expands to a closing anchor tag.
			 */
			__( "Manage and monitor your redirects with ease. Create and edit plain redirects to ensure visitors and search engines reach the right pages. %1$sLearn more about redirects%2$s.", "wordpress-seo" ),
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
			title={ __( "Redirects", "wordpress-seo" ) }
			description={ redirectsDescription }
		>
			<Formik
				initialValues={ initialValues }
				validationSchema={ createValidationSchema( {} ) }
				onSubmit={ handleCreateSubmit }
			>
				{ ( { isSubmitting, status } ) => (
					<Form className="yst-max-w-5xl yst-p-8">
						<FieldsetLayout
							title={ __( "Plain redirects", "wordpress-seo" ) }
							description={ __( "Plain redirects automatically send visitors from one URL to another. Use them to fix broken links and improve your site's user experience.", "wordpress-seo" ) }
							variant={ "xl" }
						>
							<FormAddRedirect error={ status } />
							<Button
								id="yst-button-submit-redirect"
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
				<FilterControls />
				<ListRedirects />
			</div>
		</RouteLayout>
	);
};

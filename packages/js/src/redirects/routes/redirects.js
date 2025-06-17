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
import { initialValues } from "../constants";
import { FieldsetLayout } from "../../shared-admin/components";
import { Form, Formik } from "formik";
import { createValidationSchema, handleCreateSubmit } from "../helpers";
import { FormAddRedirect } from "../components/form-add-redirect";

/**
 * @returns {JSX.Element} The redirects route.
 */
export const Redirects = () => {
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
				{ ( { isSubmitting } ) => (
					<Form className="yst-max-w-5xl yst-p-8">
						<FieldsetLayout
							title={ __( "Plain redirects", "wordpress-seo" ) }
							description={ __( "Plain redirects automatically send visitors from one URL to another. Use them to fix broken links and improve your site's user experience.", "wordpress-seo" ) }
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
				<FilterControls />
				<ListRedirects />
			</div>
		</RouteLayout>
	);
};

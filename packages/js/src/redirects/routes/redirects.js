import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, SelectField, TextField } from "@yoast/ui-library";
import {
	FilterControls,
	ListRedirects,
	RouteLayout,
} from "../components";
import { useSelectRedirects } from "../hooks";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { REDIRECT_TYPE_OPTIONS } from "../constants";
import { FieldsetLayout } from "../../shared-admin/components";
import { FormikValueChangeField, FormikWithErrorField } from "../../shared-admin/components/form";
import { Form, useFormikContext } from "formik";

/**
 * @returns {JSX.Element} The redirects route.
 */
export const Redirects = () => {
	const redirectsTypeLink = useSelectRedirects( "selectLink", [], "https://yoa.st/2jb" );
	const redirectsManagedLink = useSelectRedirects( "selectLink", [], "https://yoast.com/yoast-seo-redirect-manager" );
	const { isSubmitting } = useFormikContext();

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

	const newUrlDescription = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening italics tag.
			 * %2$s expands to a closing italics tag.
			 */
			__( "Example: %1$shttps://example.com/new-page%2$s", "wordpress-seo" ),
			"<s>",
			"</s>"
		),
		{
			s: <span className="yst-font-medium" />,
		}
	), [] );

	const oldUrlDescription = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening italics tag.
			 * %2$s expands to a closing italics tag.
			 */
			__( "Example: %1$s/old-page%2$s", "wordpress-seo" ),
			"<s>",
			"</s>"
		),
		{
			s: <span className="yst-font-medium" />,
		}
	), [] );

	return (
		<RouteLayout
			title={ __( "Redirects", "wordpress-seo" ) }
			description={ redirectsDescription }
		>
			<Form className="yst-max-w-5xl yst-p-8	">
				<FieldsetLayout
					title={ __( "Plain redirects", "wordpress-seo" ) }
					description={ __( "Plain redirects automatically send visitors from one URL to another. Use them to fix broken links and improve your site's user experience.", "wordpress-seo" ) }
					variant={ "xl" }
				>
					<div className="lg:yst-mt-0 lg:yst-col-span-2 yst-space-y-8">
						<div>
							<FormikValueChangeField
								as={ SelectField }
								type="select"
								name="type"
								id="yst-input-type"
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
							id="input-origin"
							label={ __( "Old URL", "wordpress-seo" ) }
							description={ oldUrlDescription }
						/>
						<FormikWithErrorField
							as={ TextField }
							type="text"
							name="target"
							id="input-target"
							label={ __( "New URL", "wordpress-seo" ) }
							description={ newUrlDescription }
						/>
					</div>
					<Button
						id="button-submit-settings"
						type="submit"
						isLoading={ isSubmitting }
						disabled={ isSubmitting }
					>
						{ __( "Add redirect", "wordpress-seo" ) }
					</Button>
				</FieldsetLayout>

				<hr className="yst-my-8" />

				<FilterControls />
				<ListRedirects />
			</Form>
		</RouteLayout>
	);
};

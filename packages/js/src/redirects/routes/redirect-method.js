/* eslint-disable camelcase */
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Paper, Radio, RadioGroup, Spinner } from "@yoast/ui-library";
import { Notifications, RouteLayout } from "../components";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { useSelectRedirects, useGetRedirectsSettings } from "../hooks";
import { Field, Formik } from "formik";
import { FieldsetLayout } from "../../shared-admin/components";
import { FormLayout } from "../../shared-admin/components/form";
import { handleSettingsUpdateSubmit } from "../helpers";

/**
 * @returns {JSX.Element} The redirect method route.
 */
export const RedirectMethod = () => {
	const settings = useGetRedirectsSettings();
	const status = useSelectRedirects( "selectSettingsStatus" );

	const redirectsManagedLink = useSelectRedirects(
		"selectLink",
		[],
		"https://yoast.com/help/yoast-seo-premium-redirects-settings-video-explanation/"
	);

	const description = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening anchor tag.
			 * %2$s expands to a closing anchor tag.
			 */
			__( "Redirect tbd description. %1$sLearn more about redirect settings%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ redirectsManagedLink } target="_blank" rel="noopener noreferrer" />,
		}
	), [] );

	if ( status !== "success" ) {
		return (
			<div className="yst-flex yst-items-center yst-justify-center yst-mt-8">
				<Spinner size="8" />
			</div>
		);
	}

	return (
		<Formik
			initialValues={ {
				disable_php_redirect: settings?.disable_php_redirect,
				separate_file: settings?.separate_file,
			} }
			enableReinitialize={ true }
			onSubmit={ handleSettingsUpdateSubmit }
		>
			<Paper>
				<RouteLayout
					title={ __( "Redirect Method", "wordpress-seo" ) }
					description={ description }
				>
					<FormLayout>
						<div className="yst-max-w-5xl">
							<FieldsetLayout
								title={ __( "Redirect Method", "wordpress-seo" ) }
								description={ __(
									"Yoast SEO Premium can generate redirect files that can be included in your website web server configuration. If you choose this option the PHP redicrects will be disabled. Only check this option if you know what you are doing!",
									"wordpress-seo"
								) }
								variant={ "xl" }
							>
								<RadioGroup name="disable_php_redirect">
									<Field
										as={ Radio }
										type="radio"
										name="disable_php_redirect"
										id="yst-input-php-disable_php_redirect"
										label={ __( "PHP", "wordpress-seo" ) }
										value="on"
									/>
									<Field
										as={ Radio }
										type="radio"
										name="disable_php_redirect"
										id="yst-input-webserver-disable_php_redirect"
										label={ __( "Web Server", "wordpress-seo" ) }
										value="off"
									/>
								</RadioGroup>
							</FieldsetLayout>
							{ settings?.is_apache ? (
								<>
									<section className="yst-space-y-8" />
									<hr className="yst-my-8" />
									<FieldsetLayout
										title={ __( "Generate a separate redirect file", "wordpress-seo" ) }
										description={ __(
											"By default we write the redirects to your file, check this if you want the redirects written to a separate file. Only check this option if you know what you are doing!",
											"wordpress-seo"
										) }
										variant={ "xl" }
									>
										<RadioGroup name="separate_file">
											<Field
												as={ Radio }
												type="radio"
												name="separate_file"
												id="yst-input-separate_file-off"
												label={ __( "Enabled", "wordpress-seo" ) }
												value="on"
											/>
											<Field
												as={ Radio }
												type="radio"
												name="separate_file"
												id="yst-input-separate_file-on"
												label={ __( "Disabled", "wordpress-seo" ) }
												value="off"
											/>
										</RadioGroup>
									</FieldsetLayout>
								</>
							) : null }
						</div>
					</FormLayout>
					<Notifications />
				</RouteLayout>
			</Paper>
		</Formik>
	);
};

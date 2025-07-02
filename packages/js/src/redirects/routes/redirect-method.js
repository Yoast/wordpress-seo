/* eslint-disable camelcase */
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Paper, Radio, RadioGroup, Spinner } from "@yoast/ui-library";
import { ApacheSettings, Notifications, RouteLayout } from "../components";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { useSelectRedirects } from "../hooks";
import { Field, Formik } from "formik";
import { FieldsetLayout } from "../../shared-admin/components";
import { FormLayout } from "../../shared-admin/components/form";

/**
 * Redirect method configuration page component.
 *
 * This is a premium feature that provides advanced redirect management options
 * for users who want more control over how redirects are implemented.
 *
 * @param {Object} settings - Current redirect settings.
 * @param {string} settings.disable_php_redirect - Whether PHP redirects are disabled ("on"|"off").
 * @param {string} settings.separate_file - Whether to generate separate redirect files ("on"|"off").
 * @param {boolean} settings.is_apache - Whether the server is Apache.
 * @param {string} status - Loading status of settings ("success"|"loading"|"error").
 * @param {Function} [handleSettingsUpdateSubmit] - Callback for handling settings form submission.
 * @returns {JSX.Element} The redirect method configuration interface.
 */
export const RedirectMethod = ( { settings, status, handleSettingsUpdateSubmit = () => {} } ) => {
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
							<ApacheSettings isApache={ settings?.is_apache } />
						</div>
					</FormLayout>
					<Notifications />
				</RouteLayout>
			</Paper>
		</Formik>
	);
};

import classNames from "classnames";
import PropTypes from "prop-types";
import { Button, TextField } from "@yoast/ui-library";
import { safeCreateInterpolateElement } from "../../../helpers/i18n";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { noop } from "lodash";
import { __, sprintf } from "@wordpress/i18n";
import { STORE_NAME } from "../../constants";
import { select } from "@wordpress/data";

/**
 * Default alert item component.
 */
export const PingOtherAdminsAlertItem = ( { id, nonce, dismissed, message } ) => {
	return (
		<div
			className={ classNames(
				"yst-text-sm yst-text-slate-600 yst-grow",
				dismissed && "yst-opacity-50" ) }
		>
			<div
				dangerouslySetInnerHTML={ { __html: message } }
			/>
			<div className="yst-flex yst-items-end yst-gap-2 yst-mt-2">
				<TextField
					type="text"
					name={ id + "-input-field" }
					id={ id + "-input-field" }
					label=""
					onChange={ noop }
					placeholder={ __( 'E.g. example@email.com', 'wordpress-seo' ) }
					className="yst-flex-1"
				/>
				<Button
					variant="primary"
					size="large"
				>
					{ __( 'Send', 'wordpress-seo' ) }
					<div className="yst-ml-2 yst-w-4">
						<ArrowNarrowRightIcon className="yst-w-4 yst-text-white" />
					</div>
				</Button>
			</div>
			<p
				className="yst-text-slate-600 yst-text-xxs yst-leading-4 yst-mt-1"
			>
				{
					safeCreateInterpolateElement(
						sprintf(
							/**
							 * translators: %1$s and %2$s expand to opening and closing <a> tags.
							 */
							__( "Yoast respects your privacy. Read %1$sour privacy policy%2$s on how we handle your personal information.", "wordpress-seo" ),
							"<a>",
							"</a>"
						),
						{
							// eslint-disable-next-line jsx-a11y/anchor-has-content, react/jsx-no-target-blank
							a: <a href={ select( STORE_NAME ).selectLink( "https://yoa.st/gdpr-config-workout" ) } target="_blank" rel="noopener" />,
						}
					)
				}
			</p>
		</div>
	);
};

PingOtherAdminsAlertItem.propTypes = {
	id: PropTypes.string.isRequired,
	nonce: PropTypes.string.isRequired,
	dismissed: PropTypes.bool.isRequired,
	message: PropTypes.string.isRequired,
};
import { Button, Table, Title } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import { ExclamationIcon, RefreshIcon } from "@heroicons/react/outline";
import { useEffect } from "react";

/**
 * The GetTasksErrorRow component to display an error row when fetching tasks fails.
 *
 * @param {string} message The error message.
 * @returns {JSX.Element} The GetTasksErrorRow component.
 */
export const GetTasksErrorRow = ( { message } ) => {
	const handleReload = useCallback( () => {
		window.location.reload();
	}, [] );

	useEffect( () => {
		if ( message ) {
			console.error( "Error fetching tasks:", message );
		}
	}, [ message ] );

	return (
		<Table.Row>
			<Table.Cell colSpan={ 3 } className="yst-text-center lg:yst-py-[155px] yst-py-10">
				<div className="yst-flex yst-justify-center yst-items-center yst-flex-col yst-max-w-[300px] yst-m-auto">
					<div className="yst-rounded-full yst-bg-red-100 yst-p-2 yst-w-12 yst-h-12 yst-flex yst-items-center yst-justify-center yst-mb-4 yst-m-auto">
						<ExclamationIcon className="yst-h-7 yst-w-7 yst-text-red-600" />
					</div>

					<Title className="yst-mb-2" size="2" as="h3">
						{ __( "Oops! Something went wrong", "wordpress-seo" ) }
					</Title>
					<p>
						{ __( "Please refresh the page. If the issue continues, our support team is here to help!", "wordpress-seo" ) }

					</p>
					<Button
						className="yst-mt-6 yst-ps-2 yst-flex yst-items-center yst-gap-1.5"
						onClick={ handleReload }
					>
						<RefreshIcon className="yst-w-4 yst-h-4" />
						{ __( "Refresh Page", "wordpress-seo" ) }
					</Button>
				</div>
			</Table.Cell>
		</Table.Row>
	);
};

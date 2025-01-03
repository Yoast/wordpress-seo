import { ChevronDownIcon } from '@heroicons/react/solid';
import { __ } from '@wordpress/i18n';
import { Paper, Table, Title } from '@yoast/ui-library';


const FirstCell = ( { value, index } ) => (
	<span className="yst-whitespace-nowrap">
		{ index + 1 }
		<span className="yst-font-medium" >{ value }</span>
	</span>
);

const LastCell = ( { score } ) => (
	<div>
		{ score }
	</div>
	
);


/**
 * The Site Kit table component.
 * 
 * @param {string} title The component props.
 * @param {[string]} columnsNames The component props.
 * @param {[object]} data The component props.
 * 
 * @returns {JSX.Element} The element.
 */
export const SiteKitTable = ( { title, columnsNames, data } ) => {
	return (
		<Paper className="yst-@container yst-grow yst-max-w-screen-sm yst-p-8 yst-shadow-md">
			<Title as="h3" size="2" >
				{ title }
			</Title>
			<table >
				<Table.Head className="yst-bg-white yst-mt-2 yst-border-b-slate-300 yst-border-b yst-border-t-0" >
					<Table.Row>

						{ columnsNames.map( ( columnName ) => 
								<Table.Header
								key={ `${columnName}-${title}` }
								>
									<div className="yst-flex">
								{ columnName }
								{ columnName === __( "Clicks", "wordpress-seo") && <ChevronDownIcon className="yst-text-slate-400 yst-w-5" /> }
								</div>
								</Table.Header>
							 ) }
					</Table.Row>
				</Table.Head>

				<Table.Body>
					{ data.map( ( row, rowIndex ) => (
						<Table.Row key={ `row-${title}-${rowIndex}` }>
							{ row.map( ( cell, cellIndex ) => (
							<Table.Cell key={ `cell-${title}-${cellIndex}` } className="yst-whitespace-nowrap">
								{ cellIndex === 0 && <FirstCell value={ cell } index={ rowIndex } /> }

							</Table.Cell> ))}
					
						</Table.Row>
					) ) }
				</Table.Body>
			</table>
		</Paper>
	);
};

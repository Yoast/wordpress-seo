import React from "react";
import styled from "styled-components";

import { PrimaryCell, IconCell, responsiveHeaders } from "../../basic/Table/Cell";
import { Row, RowMobileCollapse } from "../../basic/Table/Row";
import { ListTable, ZebrafiedListTable } from "../../basic/Table/ListTable";

export const SnippetPreviewDiv = styled.div`
	height: 700px;
	width: 100%;
	background-color: white;
`;



let PrimaryCellResponsive = responsiveHeaders( PrimaryCell );
let rowProps = [];

/**
 * Returns the SnippetPreview component.
 *
 * @returns {ReactElement} The SnippetPreview component.
 */
export default function SnippetPreview() {
	return(
		<SnippetPreviewDiv>
			<br /><br /><br />
			<ListTable>
				<RowMobileCollapse { ...rowProps }>
					<PrimaryCell headerLabel="Test column">
						This is a text column
					</PrimaryCell>
					<PrimaryCell headerLabel="Test column2">
						This is a text column
					</PrimaryCell>
					<PrimaryCell headerLabel="Test column3">
						This is a text column
					</PrimaryCell>
					<PrimaryCell headerLabel="Test column4">
						This is a text column
					</PrimaryCell>
					<PrimaryCellResponsive headerLabel="responsiveHeaders">
						This is a primary cell with responsive headers
					</PrimaryCellResponsive>
					<IconCell headerLabel="IconCell">
						Icon
					</IconCell>
				</RowMobileCollapse>
			</ListTable>
			<br /><br /><br /><br /><br /><br />
			<ZebrafiedListTable>
				<Row { ...rowProps }>
					<PrimaryCell ellipsis={ true } headerLabel="Test column">
						This is a text column
					</PrimaryCell>
					<PrimaryCell ellipsis={ true } headerLabel="Test column2">
						This is a text column
					</PrimaryCell>
					<PrimaryCell ellipsis={ true } headerLabel="Test column3">
						This is a text column
					</PrimaryCell>
					<PrimaryCell ellipsis={ true } headerLabel="Test column4">
						This is a text column
					</PrimaryCell>
					<PrimaryCellResponsive ellipsis={ true } headerLabel="responsiveHeaders">
						This is a primary cell with responsive headers
					</PrimaryCellResponsive>
					<IconCell ellipsis={ true } headerLabel="IconCell">
						Icon
					</IconCell>
				</Row>
				<Row { ...rowProps }>
					<PrimaryCell ellipsis={ true } headerLabel="Test column">
						This is a text column
					</PrimaryCell>
					<PrimaryCell ellipsis={ true } headerLabel="Test column2">
						This is a text column
					</PrimaryCell>
					<PrimaryCell ellipsis={ true } headerLabel="Test column3">
						This is a text column
					</PrimaryCell>
					<PrimaryCell ellipsis={ true } headerLabel="Test column4">
						This is a text column
					</PrimaryCell>
					<PrimaryCellResponsive ellipsis={ true } headerLabel="responsiveHeaders">
						This is a primary cell with responsive headers
					</PrimaryCellResponsive>
					<IconCell ellipsis={ true } headerLabel="IconCell">
						Icon
					</IconCell>
				</Row>
			</ZebrafiedListTable>
		</SnippetPreviewDiv>
	);
}

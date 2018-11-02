import styled from "styled-components";

export const ColumnLeft = styled.div`
	flex: 1;
	@media (min-width: ${ props => props.minWidth }) {
		padding-right: 8px;
	}
`;

export const ColumnRight = styled.div`
	flex: 1;
	@media (min-width: ${ props => props.minWidth }) {
		padding-left: 8px;
	}
`;

export const Columns = styled.div`
	@media (min-width: ${ props => props.minWidth }) {
		display: flex;
		align-content: space-between;
	}
`;


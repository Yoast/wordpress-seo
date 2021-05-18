# Usage guidelines for Table components
## Cells
- CellPrimary is meant to be the main cell in a row. There should be just one CellPrimary in each row.
- The responsiveHeaders function is meant to be used in combination with RowResponsiveWrap. This function ensures cells are full width in the responsive view.
- For the time being, headers should always be short and never break to a second line because they have `line-height: 0;`.
- CellIcon should only contain an icon, and therefore never use ellipsis.


A widget to display the number of organic sessions that began on a website.

It needs the `dataProvider` API:

- `getLink` to get the `errorSupport` link as string
- `getEndpoint` to get the `timeBasedSeoMetrics` endpoint as string

It needs the `remoteDataProvider` API:

- `fetchJson` to fetch the data from the API, adding the following values to the query params under `options[widget]`:
  - `organicSessionsCompare`
  - `organicSessionsDaily`

It needs the `dataFormatter` API:

- `format` to format the data to be displayed in the widget:
  - `sessions` for the `organiceSessionsCompare` number of sessions.
  - `difference` for the `organicSessionsCompare` delta percentage.
  - `date` for the `organicSessionsDaily` date.

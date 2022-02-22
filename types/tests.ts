import { NextApiResponse } from 'next';

export interface TestAPIResponse extends NextApiResponse {
  _getJSONData: () => any;
  _getData: () => any;
}

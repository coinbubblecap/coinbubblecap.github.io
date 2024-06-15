import { gql } from "@apollo/client";

export const GET_TOKENS = gql`
  {
    tokenCreateds(first: 100, orderBy: blockNumber, orderDirection: desc) {
      id
      tokenAddress
      creator
      blockNumber
    }
  }
`;

import { useQuery } from "@apollo/client";
import BubbleChartComponent from "./BubbleChart";
import { GET_TOKENS } from "./queries";
import useTokenData from "./useTokenData";

const abi = [
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "maxSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "tokenPrice",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
];

const TokenList = () => {
  const { loading, error, data } = useQuery(GET_TOKENS);

  const tokenAddresses =
    data?.tokenCreateds.map((token) => token.tokenAddress) || [];
  const tokens = useTokenData(tokenAddresses, abi).map((token, index) => ({
    ...token,
    address: tokenAddresses[index], // Ensure address is included
  }));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="bubble-chart-container">
      <BubbleChartComponent tokens={tokens} />
    </div>
  );
};

export default TokenList;

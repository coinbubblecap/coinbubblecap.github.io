import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { scrollSepolia } from "wagmi/chains";

const useTokenData = (tokenAddresses, abi) => {
  const [tokens, setTokens] = useState([]);

  const client = createPublicClient({
    chain: scrollSepolia,
    transport: http(),
  });

  useEffect(() => {
    const fetchTokenData = async () => {
      const tokenDataPromises = tokenAddresses.map(async (address) => {
        const symbol = await client.readContract({
          address,
          abi,
          functionName: "symbol",
        });

        const maxSupply = await client.readContract({
          address,
          abi,
          functionName: "maxSupply",
        });

        const totalSupply = await client.readContract({
          address,
          abi,
          functionName: "totalSupply",
        });

        const tokenPrice = await client.readContract({
          address,
          abi,
          functionName: "tokenPrice",
        });

        return {
          address,
          symbol,
          maxSupply,
          totalSupply,
          tokenPrice,
          capitalization: (BigInt(totalSupply) * BigInt(tokenPrice)).toString(),
        };
      });

      const tokenData = await Promise.all(tokenDataPromises);
      setTokens(tokenData);
    };

    if (tokenAddresses.length > 0) {
      fetchTokenData();
    }
  }, [tokenAddresses, abi, client]);

  return tokens;
};

export default useTokenData;

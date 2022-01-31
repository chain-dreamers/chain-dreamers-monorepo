import React from "react";
import { useEthers } from "@usedapp/core";
import { useSdk } from "./useSdk";
import { ethers } from "ethers";
import { CandyList } from "../candies";
import { candyPrice } from "../config";
import { CandyQuantitiesContext } from "../contexts/CandyQuantitiesContext";
import { SnackbarErrorContext } from "../contexts/SnackbarErrorContext";

export const useCandyShopContract = () => {
  const { account } = useEthers();
  const sdk = useSdk();

  const [isWaitingForPayment, setIsWaitingForPayment] =
    React.useState<boolean>(false);
  const [isMinting, setIsMinting] = React.useState<boolean>(false);
  const { setError } = React.useContext(SnackbarErrorContext);

  const { candyQuantities, setCandyQuantities } = React.useContext(
    CandyQuantitiesContext
  );

  const totalQuantity = Object.values(candyQuantities).reduce(
    (res: number, q) => res + q,
    0
  );

  const fetchCandyQuantities = React.useCallback(async (): Promise<
    Record<CandyList, number>
  > => {
    if (sdk && account) {
      try {
        const balance = await sdk.CandyShop.balanceOfBatch(
          [account, account, account],
          [0, 1, 2]
        );

        const quantities = {
          [CandyList.ChainMeth]: balance[0]?.toNumber(),
          [CandyList.HeliumSpice]: balance[1]?.toNumber(),
          [CandyList.SomnusTears]: balance[2]?.toNumber(),
        };

        setCandyQuantities(quantities);

        return quantities;
      } catch (e) {
        setError((e as { error: Error }).error.message);
        return {
          [CandyList.ChainMeth]: 0,
          [CandyList.HeliumSpice]: 0,
          [CandyList.SomnusTears]: 0,
        };
      }
    }

    return {
      [CandyList.ChainMeth]: 0,
      [CandyList.HeliumSpice]: 0,
      [CandyList.SomnusTears]: 0,
    };
  }, [sdk, account, setCandyQuantities, setError]);

  React.useEffect(() => {
    fetchCandyQuantities();
  }, [account, fetchCandyQuantities]);

  const waitForCandyMint = React.useCallback(
    (
      currentCandyQuantity: Record<CandyList, number>,
      mintedCandyQuantity: Record<CandyList, number>
    ): Promise<void> => {
      if (sdk && account) {
        const expectedCandyQuantity = {
          [CandyList.ChainMeth]:
            currentCandyQuantity[CandyList.ChainMeth] +
            mintedCandyQuantity[CandyList.ChainMeth],
          [CandyList.HeliumSpice]:
            currentCandyQuantity[CandyList.HeliumSpice] +
            mintedCandyQuantity[CandyList.HeliumSpice],
          [CandyList.SomnusTears]:
            currentCandyQuantity[CandyList.SomnusTears] +
            mintedCandyQuantity[CandyList.SomnusTears],
        };

        return new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const quantity = await fetchCandyQuantities();

              if (
                quantity[CandyList.ChainMeth] ===
                  expectedCandyQuantity[CandyList.ChainMeth] &&
                quantity[CandyList.HeliumSpice] ===
                  expectedCandyQuantity[CandyList.HeliumSpice] &&
                quantity[CandyList.SomnusTears] ===
                  expectedCandyQuantity[CandyList.SomnusTears]
              ) {
                resolve();
              } else {
                await waitForCandyMint(
                  currentCandyQuantity,
                  mintedCandyQuantity
                );
                resolve();
              }
            } catch {
              await waitForCandyMint(currentCandyQuantity, mintedCandyQuantity);
              resolve();
            }
          }, 5000);
        });
      } else {
        return Promise.resolve();
      }
    },
    [sdk, account, fetchCandyQuantities]
  );

  const mint = React.useCallback(
    async (quantity: Record<CandyList, number>): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        if (sdk && account) {
          try {
            setIsWaitingForPayment(true);
            const price = candyPrice.times(
              Object.values(quantity).reduce((res, q) => res + q, 0)
            );

            await sdk.CandyShop.mintBatch(
              [0, 1, 2],
              [
                quantity[CandyList.ChainMeth],
                quantity[CandyList.HeliumSpice],
                quantity[CandyList.SomnusTears],
              ],
              {
                from: account,
                value: ethers.utils.parseEther(price.toString()),
              }
            );
            setIsWaitingForPayment(false);
            setIsMinting(true);

            await waitForCandyMint(candyQuantities, quantity);
            setIsMinting(false);
            resolve();
          } catch (e: unknown) {
            setIsWaitingForPayment(false);
            setIsMinting(false);
            setError((e as { error: Error }).error.message);
            reject(e);
          }
        } else {
          resolve();
        }
      });
    },
    [sdk, account, setError, candyQuantities, waitForCandyMint]
  );

  return {
    mint,
    candyQuantities,
    isWaitingForPayment,
    isMinting,
    totalQuantity,
    fetchCandyQuantities,
  };
};

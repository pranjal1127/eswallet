import * as React from "react";
import styled from "styled-components";
import Dropdown from "../components/Dropdown";
import { IChainData } from "../helpers/types";
import { ellipseAddress, getViewportDimensions } from "../helpers/utilities";
import { responsive } from "../styles";
import Input from "./Input";
import Blockie from "./Blockie";
import Button from "./Button";
import { getAppControllers } from "src/controllers";

const SSection = styled.div`
  width: 100%;
`;

const SBlockie = styled(Blockie)`
  margin-right: 5px;
  @media screen and (${responsive.xs.max}) {
    margin-right: 1vw;
  }
`;

const SAddressDropdownWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SInput = styled(Input)`
  width: 100%;
  margin: 10px;
  font-size: 14px;
  height: 40px;
`;

const SButton = styled(Button)`
  width: 25%;
  height: 40px;
  margin: 10px;
`;

interface IAccountDetailsProps {
  chains: IChainData[];
  updateAddress?: any;
  updateChain?: any;
  accounts: string[];
  activeIndex: number;
  address: string;
  chainId: number;
}

const AccountDetails = (props: IAccountDetailsProps) => {
  const { chains, chainId, address, activeIndex, accounts, updateAddress, updateChain } = props;
  const windowWidth = getViewportDimensions().x;
  const maxWidth = 468;
  const maxChar = 12;
  const [key,setKey] = React.useState<string>('');
  const ellipseLength =
    windowWidth > maxWidth ? maxChar : Math.floor(windowWidth * (maxChar / maxWidth));
  const accountsMap = accounts.map((addr: string, index: number) => ({
    index,
    display_address: ellipseAddress(addr, ellipseLength),
  }));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value );
  };
  const addWallet = async ()=>{
    await getAppControllers().wallet.updateWallet(key, chainId);
  }
  return (
    <React.Fragment>
      <SSection>
        <h6>{"Account"}</h6>
        <SInput value={key} onChange={handleChange} placeholder={"Paste private key"} />
        <SButton onClick={addWallet} >{`Add`}</SButton>
        <SAddressDropdownWrapper>
          <SBlockie size={40} address={address} />
          <Dropdown
            monospace
            selected={activeIndex}
            options={accountsMap}
            displayKey={"display_address"}
            targetKey={"index"}
            onChange={updateAddress}
          />
        </SAddressDropdownWrapper>
      </SSection>
      <SSection>
        <h6>{"Network"}</h6>
        <Dropdown
          selected={chainId}
          options={chains}
          displayKey={"name"}
          targetKey={"chain_id"}
          onChange={updateChain}
        />
      </SSection>
    </React.Fragment>
  );
};
export default AccountDetails;

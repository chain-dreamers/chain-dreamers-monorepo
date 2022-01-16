import React from "react";
import Box from "@mui/material/Box";
import PageTitle from "../PageTitle/PageTitle";
import TeamMember from "../TeamMember/TeamMember";
import photo from "./photo.png";
import { useMediaQuery } from "@mui/material";
import banner from "./banner.png";
import jaz from "./jaz.png";
import georges from "./georges.png";
import law from "./law.png";
import come from "./come.png";

function Team() {
  const isMobile = useMediaQuery("(max-width:915px)");

  return (
    <Box>
      <PageTitle label="Team" background={banner} />
      <Box
        sx={{
          marginTop: "96px",
          display: "flex",
          justifyContent: "center",
          padding: isMobile ? "0 16px" : 0,
        }}
      >
        <Box sx={{ maxWidth: "895px" }}>
          <TeamMember name="Jaz" image={jaz}>
            Proud holder of a Candy Shop on-chain, passionate web3 product guy
            off-chain.
          </TeamMember>
          <TeamMember name="Clément" image={photo}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum
            duis iaculis ultrices lectus elit, pharetra donec venenatis. Nulla
            risus lobortis congue a, tellus pharetra tempus tincidunt arcu.
            Vitae orci porta nulla scelerisque{" "}
          </TeamMember>
          <TeamMember name="Law" image={law}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum
            duis iaculis ultrices lectus elit, pharetra donec venenatis. Nulla
            risus lobortis congue a, tellus pharetra tempus tincidunt arcu.
            Vitae orci porta nulla scelerisque{" "}
          </TeamMember>
          <TeamMember name="Côme" image={come}>
            Product designer based in Paris, building the future of NFT mint
            experiences. Also a passionate fisherman.
          </TeamMember>
          <TeamMember name="Georges" image={georges}>
            Web developer based in Paris. Love to tell chain-stories that won’t
            be lost like tears in rain.
          </TeamMember>
        </Box>
      </Box>
    </Box>
  );
}

export default Team;

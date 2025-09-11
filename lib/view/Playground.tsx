import Box from "@mui/material/Box";
import * as React from "react";

type PlaygroundTileProps = {
  name: string;
};

export class PlaygroundTile extends React.Component<PlaygroundTileProps, {}> {
  constructor(props: PlaygroundTileProps) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <>
        <Box sx={{ width: 250 }} role="presentation"></Box>
      </>
    );
  }
}

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import * as React from "react";

type PlaygroundCardProps = {
  name: string;
  children: React.ReactNode;
};

export class PlaygroundCard extends React.Component<PlaygroundCardProps, {}> {
  constructor(props: PlaygroundCardProps) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <>
        <Card variant="outlined" sx={{ width: 345 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center", // Centers horizontally
              width: 345,
              height: 200,
            }}
          >
            {this.props.children}
          </Box>
          <Typography variant="h5" component="div" align="center">
            {this.props.name}
          </Typography>
        </Card>
      </>
    );
  }
}

import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";

type TrainiacAppBarProps = {
  appName: string;
};

type TrainiacAppBarState = {
  open: boolean;
};

export class TrainiacAppBar extends React.Component<
  TrainiacAppBarProps,
  TrainiacAppBarState
> {
  constructor(props: TrainiacAppBarProps) {
    super(props);
    this.state = { open: false };
  }

  render() {
    const toggleDrawer = (newOpen: boolean) => () => {
      this.setState({ open: newOpen });
    };

    const DrawerList = (
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleDrawer(false)}
      >
        <List>
          <ListItem key="About" disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="About"></ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    );

    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <div>{this.props.appName}</div>
          </Toolbar>
        </AppBar>
        <Drawer open={this.state.open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </Box>
    );
  }
}

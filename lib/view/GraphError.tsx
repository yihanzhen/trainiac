import Typography from "@mui/material/Typography";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface GraphErrorProps {
  children: ReactNode;
}

interface GraphErrorState {
  error?: Error;
}

export class GraphError extends Component<GraphErrorProps, GraphErrorState> {
  static getDerivedStateFromError(error: Error) {
    return { error: error };
  }

  componentDidCatch(error: Error, _: ErrorInfo) {
    this.setState({ error: error });
  }

  constructor(props: GraphErrorProps) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.state.error) {
      let errMsg = this.state.error.message;
      if (errMsg.length > 100) {
        errMsg = errMsg.substring(0, 100) + "...";
      }
      return <Typography>Error drawing the diagram: {errMsg}</Typography>;
    }
    return this.props.children;
  }
}

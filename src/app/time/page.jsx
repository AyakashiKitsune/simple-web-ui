"use client";

import { cn } from "@/lib/utils";
import { Component } from "react";

class TimeContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className={cn(
          this.props.className,
          "flex flex-1 justify-center",
          "min-h-16"
        )}
      >
        {this.props.children}
      </div>
    );
  }
}

class TimeGrid extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <div
          className={cn(
            "flex flex-row gap-2 justify-center items-center",
            "px-2 py-4",
            "rounded-lg border",
            this.props.children
          )}
        >
          {this.props.children}
        </div>
      </>
    );
  }
}

class TimeUnit extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, className } = this.props;
    return (
      <>
        <div
          className={cn(
            "font-bold",
            "min-h-9 min-w-8",
            "flex justify-center items-center",
            "border rounded-lg",
            className
          )}
        >
          {children}
        </div>
      </>
    );
  }
}

class TimeTracker extends Component {
  constructor(props) {
    super(props);
    const time = new Date();
    const hour = time.getHours();
    this.state = {
      hour: hour== 0 ? 12 : hour > 12 ? hour - 12 : hour,
      minute: time.getMinutes(),
      second: time.getSeconds(),
      cycle : hour > 12 ? "PM" : "AM"
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.updatetime();
    }, 1000);
  }

  updatetime = () => {
    this.time = new Date();
    const hour = this.time.getHours();
    this.setState({
      hour: hour == 0 ? 12 : hour > 12 ? hour - 12 : hour,
      minute: this.time.getMinutes(),
      second: this.time.getSeconds(),
      cycle : hour > 12 ? "PM" : "AM"
    });
  };

  render() {
    "use client";
    return (
      <>
        <TimeContainer className="absolute inset-1/2 scale-150 ">
          <TimeGrid>
            <TimeUnit>{this.state.hour}</TimeUnit> :
            <TimeUnit>{this.state.minute}</TimeUnit> :
            <TimeUnit>{this.state.second}</TimeUnit> 
            <TimeUnit>{this.state.cycle}</TimeUnit>
          </TimeGrid>
        </TimeContainer>
      </>
    );
  }
}

export default TimeTracker;

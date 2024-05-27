import React, { Component } from "react";
import { AppRegistry, StyleSheet, View } from "react-native";

import Confetti from "react-native-confetti";

class RNConfetti extends Component {
  componentDidMount() {
    if (this._confettiView) {
      this._confettiView.startConfetti();
    }
  }

  componentWillUnmount() {
    if (this._confettiView) {
      this._confettiView.stopConfetti();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Confetti
          ref={(node) => (this._confettiView = node)}
          duration={3000}
          confettiCount={500}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
    height: "100%",
  },
});

export default RNConfetti;

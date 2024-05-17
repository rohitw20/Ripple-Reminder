import { View, Text } from "react-native";
import React from "react";
import { useAtom } from "jotai";
import { footerScreen } from "../../store";
import { useFocusEffect } from "@react-navigation/native";

const Statistics = () => {
  const [footerScreenName, setFooterScreenName] = useAtom(footerScreen);
  useFocusEffect(() => setFooterScreenName("StatisticsScreen"));
  return (
    <View>
      <Text>Statistics</Text>
    </View>
  );
};

export default Statistics;

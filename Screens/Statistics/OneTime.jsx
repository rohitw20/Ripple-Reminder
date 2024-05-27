import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useAtom } from "jotai";
import { currentProgressScreen, showConfettiOneTime } from "../../store";
import { useFocusEffect } from "@react-navigation/native";
import PieChartComp from "../../Components/OneTime/PieChartComp";
import RNConfetti from "../../Components/Popper";
import BarChartComp from "../../Components/OneTime/BarChartComp";
import BezierChartComp from "../../Components/OneTime/BezierChartComp";

const OneTime = () => {
  const [curr, setCurr] = useAtom(currentProgressScreen);
  const [show, setShow] = useAtom(showConfettiOneTime);
  useFocusEffect(() => setCurr("OneTimeProgress"));
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: "white" }}
    >
      {show && <RNConfetti />}
      <PieChartComp />
      <BarChartComp />
      <BezierChartComp />
    </ScrollView>
  );
};

export default OneTime;

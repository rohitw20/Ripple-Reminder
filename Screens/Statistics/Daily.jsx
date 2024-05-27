import { View, Text, ScrollView } from "react-native";
import React from "react";
import PieChartComp from "../../Components/Daily/PieChartComp";
import BarChartComp from "../../Components/Daily/BarChartComp";
import { useAtom } from "jotai";
import { currentProgressScreen, showConfettiDaily } from "../../store";
import { useFocusEffect } from "@react-navigation/native";
import BezierChartComp from "../../Components/Daily/BezierChartComp";
import RNConfetti from "../../Components/Popper";

const Daily = () => {
  const [curr, setCurr] = useAtom(currentProgressScreen);
  const [show, setShow] = useAtom(showConfettiDaily);
  useFocusEffect(() => setCurr("DailyProgress"));
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

export default Daily;

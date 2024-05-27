import * as React from "react";
import {
  Easing,
  TextInput,
  Animated,
  Text,
  View,
  StyleSheet,
} from "react-native";
import Svg, { G, Circle, Rect } from "react-native-svg";
import tw from "tailwind-react-native-classnames";
import { useAtom } from "jotai";
import { useFocusEffect } from "@react-navigation/native";
import { colors, currentProgressScreen, showConfettiDaily } from "../../store";
import UnfinishedTasks from "../UnfinishedTasks";
import { getDatabase } from "../../database";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const PieChartComp = () => {
  const [percentage, setPercentage] = React.useState(0);
  const radius = 70;
  const strokeWidth = 15;
  const duration = 500;
  const color = colors.green;
  const delay = 0;
  const textColor = "white";
  const max = 100;
  const animated = React.useRef(new Animated.Value(0)).current;
  const circleRef = React.useRef();
  const inputRef = React.useRef();
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  const [curr, setCurr] = useAtom(currentProgressScreen);
  const [totalTasks, setTotalTasks] = React.useState(0);
  const [completedTasks, setCompletedTasks] = React.useState(0);
  const [show, setShow] = useAtom(showConfettiDaily);

  React.useEffect(() => {
    // get the percentage and then update it
    const calculatePercentage = async () => {
      const db = getDatabase();
      const allTasks = await db.getAllAsync(
        `SELECT taskid FROM RIPPLEREMINDER WHERE EXPIRY=DATE('NOW') AND ISDELETED=0`
      );

      const completedTasks = await db.getAllAsync(
        `SELECT taskid,status FROM RIPPLESTATUS WHERE EXPIRY=DATE('NOW')`
      );

      // console.log(allTasks, completedTasks);

      // const taskIdsInA = allTasks.map((item) => item.taskId);

      // const count = completedTasks.filter((item) =>
      //   taskIdsInA.includes(item.taskId)
      // ).length;

      const result =
        (completedTasks.length * 100) /
        (allTasks.length !== 0 ? allTasks.length : 1);

      setCompletedTasks(completedTasks.length);
      setTotalTasks(allTasks.length);

      setShow(result === 100);

      // console.log(allTasks, completedTasks);
      setPercentage(result);
    };
    calculatePercentage();
  }, []);

  React.useEffect(() => {
    const animation = Animated.timing(animated, {
      delay: 1000,
      toValue: percentage,
      duration,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    });

    animation.start();

    animated.addListener(
      (v) => {
        const maxPerc = (100 * v.value) / max;
        const strokeDashoffset =
          circumference - (circumference * maxPerc) / 100;
        if (inputRef?.current) {
          inputRef.current.setNativeProps({
            text: `${Math.round(v.value)}%`,
          });
        }
        if (circleRef?.current) {
          circleRef.current.setNativeProps({
            strokeDashoffset,
          });
        }
      },
      [max, percentage]
    );

    return () => {
      animated.removeAllListeners();
    };
  }, [animated, circumference, max, percentage, curr]);

  return (
    <View
      style={[
        tw`flex flex-row items-center shadow-2xl justify-around px-5 m-3 rounded-2xl`,
        { backgroundColor: colors.blue },
      ]}
    >
      <View style={[tw`flex`, { gap: 10 }]}>
        <View style={[tw`flex items-start`]}>
          <Text style={[tw`text-lg py-1 text-center font-bold text-white`]}>
            My Goal
          </Text>
          <Text
            style={[tw`text-base py-1 text-center font-semibold text-white`]}
          >
            For Today
          </Text>
        </View>
        <View>
          <Text style={[tw`text-base py-1 text-center text-white`]}>
            {completedTasks} of {totalTasks} completed
          </Text>
        </View>
      </View>
      <View style={[tw` flex justify-center items-center py-3`]}>
        <View style={{ width: radius * 2, height: radius * 2 }}>
          <Svg
            height={radius * 2}
            width={radius * 2}
            viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
          >
            <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
              <Circle
                ref={circleRef}
                cx="50%"
                cy="50%"
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDashoffset={circumference}
                strokeDasharray={circumference}
              />
              <Circle
                cx="50%"
                cy="50%"
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeOpacity=".3"
              />
            </G>
          </Svg>
          <AnimatedTextInput
            ref={inputRef}
            underlineColorAndroid="transparent"
            editable={false}
            defaultValue="0%"
            style={[
              StyleSheet.absoluteFillObject,
              { fontSize: radius / 2, color: textColor ?? color },
              styles.text,
            ]}
          />
        </View>
      </View>
      {/* <UnfinishedTasks /> */}
    </View>
  );
};

export default PieChartComp;
const styles = StyleSheet.create({
  text: { fontWeight: "600", textAlign: "center" },
});

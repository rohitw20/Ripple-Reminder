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
import { calculatePercentage, colors, currentProgressScreen } from "../store";
import tw from "tailwind-react-native-classnames";
import { useAtom } from "jotai";
import { useFocusEffect } from "@react-navigation/native";
import UnfinishedTasks from "./UnfinishedTasks";
import { getDatabase } from "../database";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const PieChartComp = () => {
  const [percentage, setPercentage] = React.useState(0);
  const radius = 100;
  const strokeWidth = 23;
  const duration = 500;
  const color = colors.green;
  const delay = 0;
  const textColor = colors.blue;
  const max = 100;
  const animated = React.useRef(new Animated.Value(0)).current;
  const circleRef = React.useRef();
  const inputRef = React.useRef();
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  const [curr, setCurr] = useAtom(currentProgressScreen);
  useFocusEffect(() => {
    setCurr("ProgressRing");
  });

  React.useEffect(() => {
    // get the percentage and then update it
    const calculatePercentage = async () => {
      const db = getDatabase();
      const allTasks = await db.getAllAsync(
        `SELECT taskid FROM RIPPLEREMINDER WHERE EXPIRY=DATE('NOW') AND TYPE='daily'`
      );

      const completedTasks = await db.getAllAsync(
        `SELECT taskid,status FROM RIPPLESTATUS WHERE EXPIRY=DATE('NOW')`
      );

      const taskIdsInA = allTasks.map((item) => item.taskId);

      const count = completedTasks.filter((item) =>
        taskIdsInA.includes(item.taskId)
      ).length;

      const result =
        (count * 100) / (allTasks.length !== 0 ? allTasks.length : 1);

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
    <View>
      <Text style={[tw`text-xl py-1 text-center`]}>Daily Task Progress</Text>
      <View
        style={[
          tw` flex justify-center items-center py-3 border-b-4 border-gray-200`,
        ]}
      >
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
                strokeOpacity=".1"
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
      <UnfinishedTasks />
    </View>
  );
};

export default PieChartComp;
const styles = StyleSheet.create({
  text: { fontWeight: "900", textAlign: "center" },
});

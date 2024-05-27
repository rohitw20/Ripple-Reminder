import { View, Text, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useFocusEffect } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { StackedBarChart } from "react-native-chart-kit";
import { getDatabase } from "../../database";
import { colors, currentProgressScreen, getPrevious7Days } from "../../store";

const calculatePercentage = async (date) => {
  const db = getDatabase();
  const allTasks = await db.getAllAsync(
    `SELECT taskid FROM RIPPLEREMINDER WHERE EXPIRY=DATE('NOW') AND ISDELETED=0`,
    date
  );

  const completedTasks = await db.getAllAsync(
    `SELECT taskid,status FROM RIPPLESTATUS WHERE EXPIRY=? AND STATUS<>'expired'`,
    date
  );
  // if (date === "2024-05-23") console.log(date, allTasks, completedTasks);

  // const taskIdsInA = allTasks.map((item) => item.taskId);

  // const count = completedTasks.filter((item) =>
  //   taskIdsInA.includes(item.taskId)
  // ).length;

  // const result = (count * 100) / (allTasks.length !== 0 ? allTasks.length : 1);
  const result =
    (completedTasks.length * 100) /
    (allTasks.length !== 0 ? allTasks.length : 1);

  // console.log(date, allTasks.length, count, result);
  return result;
};

const BarChartComp = () => {
  const [curr, setCurr] = useAtom(currentProgressScreen);
  const weekdays = getPrevious7Days();
  const [newData, setNewData] = useState([[], [], [], [], [], [], []]);

  // console.log(newData);

  useEffect(() => {
    const getRecords = async () => {
      let records = [];
      for (const item of weekdays) {
        let date = item.date.split("/");

        const perc = await calculatePercentage(
          `${date[2]}-${date[1]}-${date[0]}`
        );
        // console.log(perc);
        records.push([perc, 100 - perc]);
      }
      // console.log(records);
      setNewData(records);
    };
    getRecords();
  }, [curr]);
  return (
    <View style={[tw`m-3`]}>
      <Text style={[tw`text-lg py-1 text-center`]}>Weekly Progress</Text>
      <View
        style={[
          tw` flex justify-center items-center py-3 border-b-4 border-gray-200`,
        ]}
      >
        <StackedBarChart
          data={{
            labels: weekdays.map(
              (item) => `${item.date.split("/")[0]} ${item.day[0]}`
            ),
            legend: ["Completed", "Not Completed"],
            data: newData,
            barColors: [colors.green, colors.blue],
          }}
          width={Dimensions.get("window").width - 30}
          height={250}
          chartConfig={{
            backgroundGradientFrom: "white",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "white",
            backgroundGradientToOpacity: 0.5,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 10,
            barPercentage: 0.4,
            useShadowColorFromDataset: false, // optional
            decimalPlaces: 5,
            barRadius: 5,
          }}
          hideLegend
          decimalPlaces={0}
        />
        <View>
          <View style={[tw`flex flex-row items-center`, { gap: 3 }]}>
            <View
              style={[
                tw`w-3 h-3 rounded-full`,
                { backgroundColor: colors.green },
              ]}
            />
            <Text>Completed %</Text>
          </View>
          <View style={[tw`flex flex-row items-center`, { gap: 3 }]}>
            <View
              style={[
                tw`w-3 h-3 rounded-full`,
                { backgroundColor: colors.blue },
              ]}
            />
            <Text>Not Completed %</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BarChartComp;

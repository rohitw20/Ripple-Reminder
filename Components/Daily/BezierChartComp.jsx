import { View, Text, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { useAtom } from "jotai";
import { useFocusEffect } from "@react-navigation/native";
import { colors, currentProgressScreen, months, year } from "../../store";
import tw from "tailwind-react-native-classnames";
import { getDatabase } from "../../database";

const BezierChartComp = () => {
  const [curr, setCurr] = useAtom(currentProgressScreen);
  const [newDataPoints, setNewDataPoints] = useState([]);

  useEffect(() => {
    const getTotalTasksForEachMonth = async () => {
      const db = getDatabase();
      // const result =
      // for (let i = 0; i < months.length; i++) {
      const result = await db.getAllAsync(
        `
        -- Create a temporary table with all months of the current year
WITH months AS (
  SELECT '01' AS month UNION ALL
  SELECT '02' UNION ALL
  SELECT '03' UNION ALL
  SELECT '04' UNION ALL
  SELECT '05' UNION ALL
  SELECT '06' UNION ALL
  SELECT '07' UNION ALL
  SELECT '08' UNION ALL
  SELECT '09' UNION ALL
  SELECT '10' UNION ALL
  SELECT '11' UNION ALL
  SELECT '12'
),
-- Count the tasks for each month of the current year
task_counts AS (
  SELECT 
    strftime('%m', expiry) AS month,
    COUNT(*) AS task_count
  FROM ripplestatus
  WHERE strftime('%Y', expiry) = strftime('%Y', 'now')
  GROUP BY strftime('%m', expiry)
)
-- Left join the months table with the task counts
SELECT 
  months.month,
  COALESCE(task_counts.task_count, 0) AS task_count
FROM 
  months
LEFT JOIN 
  task_counts ON months.month = task_counts.month
ORDER BY 
  months.month;

      `
      );
      const filteredData = [];
      for (const item of result) {
        filteredData.push(item.task_count);
      }

      setNewDataPoints(filteredData);
      // }
    };
    getTotalTasksForEachMonth();
  }, []);
  return (
    <View style={[tw`m-3`]}>
      <Text style={[tw`text-xl py-1 text-center`]}>Monthly Progress</Text>
      <View style={[tw` flex justify-center items-center py-3 `]}>
        <LineChart
          data={{
            labels: months,
            datasets: [
              {
                data: newDataPoints,
              },
            ],
          }}
          withShadow={false}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            // backgroundColor: "#ff0000",
            backgroundGradientFrom: "white",
            backgroundGradientTo: "white",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "3",
              stroke: colors.blue,
            },
          }}
          bezier
          style={{
            marginVertical: 10,
            borderRadius: 16,
          }}
        />
        <View style={[tw`flex flex-row items-center mb-5`, { gap: 3 }]}>
          <View
            style={[
              tw`w-3 h-3 rounded-full `,
              {
                backgroundColor: "black",
                borderColor: colors.blue,
                padding: 6,
                borderWidth: 3,
              },
            ]}
          />
          <Text>Total Tasks Completed</Text>
        </View>
      </View>
    </View>
  );
};

export default BezierChartComp;

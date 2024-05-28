import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Agenda } from "react-native-calendars";
import { colors, taskId, todayDate } from "../../../../store";
import { getDatabase } from "../../../../database";
import { useAtom } from "jotai";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";

const groupTasksByDate = (tasks) => {
  return tasks.reduce((acc, task) => {
    if (!acc[task.expiry]) {
      acc[task.expiry] = [];
    }
    acc[task.expiry].push(task);
    return acc;
  }, {});
};

const Calender = () => {
  const [date, setDate] = useState(todayDate);
  const [data, setData] = useState({});
  const [id, setId] = useAtom(taskId);
  const navigation = useNavigation();

  useEffect(() => {
    const getData = async () => {
      const db = getDatabase();
      //   const dailytasks = await db.getAllAsync(
      //     `select taskId,taskHeading, taskDescription, expiry from ripplereminder`
      //   );
      const onetimetasks = await db.getAllAsync(
        `select taskId,taskHeading, taskDescription, expiry from onetime`
      );
      //   const alltasks = [...dailytasks, ...onetimetasks];
      const groupedTasks = groupTasksByDate(onetimetasks);
      setData(groupedTasks);
    };
    getData();
  }, [data]);
  return (
    <SafeAreaView style={[styles.container, tw`border-t border-gray-200`]}>
      <Agenda
        selected={date}
        theme={{
          agendaTodayColor: "black",
          agendaDayNumColor: "black",
          agendaDayTextColor: "black",
          selectedDayBackgroundColor: colors.green,
          todayTextColor: colors.green,
          dotColor: colors.blue,
          todayButtonFontWeight: "bold",
        }}
        hideExtraDays={true}
        showClosingKnob
        showOnlySelectedDayItems
        items={data}
        loadItemsForMonth={(day) => {
          return data || {};
        }}
        renderEmptyData={() => {
          return (
            <View style={styles.emptyDate}>
              <View
                style={[tw`flex items-center justify-center py-4 bg-gray-100`]}
              >
                <Icon
                  name="calendar-outline"
                  type="ionicon"
                  size={100}
                  color={"gray"}
                />
                <Text style={[tw`text-3xl`, { color: "gray" }]}>
                  No tasks present!
                </Text>
              </View>
            </View>
          );
        }}
        // endFillColor={"red"}
        renderItem={(item, isFirst) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              //   console.log(item);
              setId(item.taskId);
              navigation.navigate("ViewTaskScreen");
            }}
          >
            <Text style={[tw`text-white text-base`, { fontWeight: "500" }]}>
              {item.taskHeading}
            </Text>
            <Text style={[tw`text-white text-sm`, { fontWeight: "400" }]}>
              {item.taskDescription}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 2,
  },
  item: {
    backgroundColor: colors.blue,
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: "white",
    fontSize: 16,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
    display: "flex",
    alignItems: "center",
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: "green",
  },
  dayItem: {
    marginLeft: 34,
  },
});

export default Calender;

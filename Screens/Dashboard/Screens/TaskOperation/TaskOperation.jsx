import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import tw from "tailwind-react-native-classnames";
import { useAtom } from "jotai";
import {
  colors,
  currentScreen,
  footerScreen,
  tasks,
  today,
  todayDate,
} from "../../../../store";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import SelectDropdown from "react-native-select-dropdown";

import DatePicker from "react-native-neat-date-picker";
import { createNewTask, getAllTasks } from "../../../../queries";
import { getDatabase } from "../../../../database";

const options = [
  { title: "Daily", value: "daily" },
  { title: "Single Time", value: "oneTime" },
];

const TaskOperation = () => {
  const [footerScreenName, setFooterScreenName] = useAtom(footerScreen);
  const [topics, setTopics] = useAtom(tasks);
  const [screen, _] = useAtom(currentScreen);

  const navigation = useNavigation();

  const db = getDatabase();

  const [showDatePickerSingle, setShowDatePickerSingle] = useState(false);
  const openDatePickerSingle = () => setShowDatePickerSingle(true);
  const onCancelSingle = () => {
    setShowDatePickerSingle(false);
  };

  const onConfirmSingle = (output) => {
    setShowDatePickerSingle(false);

    setExpiry(output.dateString);
  };

  const [taskHeading, setTaskHeading] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [type, setType] = useState(
    screen === "DailyTasksScreen" ? options[0].value : options[1].value
  );
  const [expiry, setExpiry] = useState(todayDate);
  const [error, setError] = useState(false);
  const [errorDate, setErrorDate] = useState(false);

  const createTask = async () => {
    if (taskHeading === "") {
      setError(true);
      return;
    } else {
      setError(false);
    }

    if (
      type === "oneTime" &&
      (expiry === "" ||
        expiry === "{}" ||
        (Object.keys(expiry).length === 0 && expiry.constructor === Object))
    ) {
      setErrorDate(true);
      return;
    } else {
      setErrorDate(false);
    }

    const task = {
      id: Math.random() * 7 + Math.random() * 17,
      taskHeading,
      taskDescription,
      status: "incomplete",
      type,
      expiry,
    };

    if (db) {
      if (type === "daily") {
        await db.runAsync(createNewTask, [
          taskHeading,
          taskDescription,
          expiry,
        ]);
      } else {
        await db.runAsync(
          `INSERT INTO onetime (taskHeading, taskDescription, status, expiry) VALUES (?, ?, ?, ?)`,
          [taskHeading, taskDescription, "incomplete", expiry]
        );
      }
    }

    // setTopics([...topics, task]);

    setTaskHeading("");
    setTaskDescription("");
    setType("");
    setExpiry("");

    navigation.navigate("DashboardScreen");
  };

  useFocusEffect(() => setFooterScreenName("TaskOperationScreen"));
  return (
    <View style={tw`bg-white h-full `}>
      <View style={[tw`flex flex-row justify-between px-5`]}>
        <View style={[tw`py-2 flex flex-row items-center  `, { gap: 20 }]}>
          <TouchableOpacity
            style={tw`bg-white flex items-center justify-center`}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" type="ionicon" size={25} />
          </TouchableOpacity>
          <Text style={[tw`text-xl font-bold`]}>
            Add {screen === "DailyTasksScreen" ? "Daily" : "Scheduled"} Tik
          </Text>
        </View>
        <TouchableOpacity
          style={tw`bg-white flex items-center justify-center`}
          onPress={createTask}
        >
          {/* <Icon name="checkmark" type="ionicon" size={25} /> */}
        </TouchableOpacity>
      </View>

      <DatePicker
        isVisible={showDatePickerSingle}
        mode={"single"}
        onCancel={onCancelSingle}
        onConfirm={onConfirmSingle}
        dateStringFormat="yyyy-mm-dd"
        // minDate={today}
        colorOptions={{
          headerColor: colors.blue,
          selectedDateBackgroundColor: colors.green,
          weekDaysColor: colors.blue,
          confirmButtonColor: colors.blue,
          backgroundColor: "#fff",
        }}
      />

      <View>
        <TextInput
          style={{
            height: 50,
            margin: 12,
            padding: 5,
            borderBottomWidth: 1,
            fontSize: 20,
            fontWeight: "bold",
            borderBottomColor: error ? "red" : "gray",
          }}
          onChangeText={setTaskHeading}
          value={taskHeading}
          placeholder="Title *"
          editable
          placeholderTextColor={error ? "red" : "gray"}
        />
        {error && (
          <Text style={[tw`text-lg text-red-700`, { marginHorizontal: 12 }]}>
            Required*
          </Text>
        )}
      </View>

      <View>
        <TextInput
          style={{
            height: 50,
            margin: 12,
            padding: 5,
            borderBottomWidth: 1,
            fontSize: 17,
            borderBottomColor: "gray",
          }}
          onChangeText={setTaskDescription}
          value={taskDescription}
          placeholder="Description"
          editable
          multiline
          // numberOfLines={4}
          maxLength={500}
        />
      </View>

      {/* This is for selecting the type of task */}
      {/* <View style={[tw`flex `, { margin: 12 }]}>
        <Text style={[tw`text-xl text-center w-full `]}>Type of task</Text>
        <View style={[tw`flex flex-row justify-between mt-5 px-10`]}>
          <TouchableOpacity
            onPress={() => setType("daily")}
            style={[
              tw` border border-gray-200 py-4 px-10 rounded-lg`,
              {
                backgroundColor: type === "daily" ? colors.blue : "white",
              },
            ]}
          >
            <Text
              style={[
                tw`text-base font-semibold ${type === "daily" && "text-white"}`,
              ]}
            >
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setType("oneTime")}
            style={[
              tw`border border-gray-200 py-4 px-10 rounded-lg`,
              {
                backgroundColor: type === "oneTime" ? colors.blue : "white",
              },
            ]}
          >
            <Text
              style={[
                tw`text-base font-semibold ${
                  type === "oneTime" && "text-white"
                }`,
              ]}
            >
              One Time
            </Text>
          </TouchableOpacity>
        </View>
      </View> */}

      {type === "oneTime" && (
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            margin: 12,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TextInput
              editable={false}
              style={[
                {
                  width: "90%",
                  fontSize: 17,
                  borderBottomWidth: 1,
                  padding: 5,
                  color: "black",
                },
              ]}
              placeholder="Task End Date*"
              placeholderTextColor={errorDate ? "red" : "grey"}
              value={expiry}
            />
            <TouchableOpacity onPress={openDatePickerSingle}>
              <Icon
                name="calendar-outline"
                type="ionicon"
                size={30}
                color={colors.blue}
              />
            </TouchableOpacity>
          </View>
          {errorDate && (
            <Text style={[tw`text-lg text-red-700`, { marginHorizontal: 12 }]}>
              Required*
            </Text>
          )}
        </View>
      )}

      <TouchableOpacity
        onPress={createTask}
        style={[tw`flex items-center mt-10`]}
      >
        <Text
          style={[
            tw`py-3 px-5 text-2xl font-bold text-white rounded`,
            { backgroundColor: colors.blue },
          ]}
        >
          Create {screen === "DailyTasksScreen" ? "Daily" : "Scheduled"} Tik
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskOperation;

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: 250,
    height: 50,
    backgroundColor: colors.blue,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: colors.blue,
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});

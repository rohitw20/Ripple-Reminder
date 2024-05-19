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
import { colors, footerScreen, tasks } from "../../../../store";
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

  const navigation = useNavigation();

  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1);
  const year = today.getFullYear();

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
  const [type, setType] = useState(options[0].value);
  const [expiry, setExpiry] = useState(today);
  const [error, setError] = useState(false);
  const [errorDate, setErrorDate] = useState(false);

  const createTask = async () => {
    if (taskHeading === "") {
      setError(true);
      return;
    } else {
      setError(false);
    }

    if (type === "oneTime" && expiry === "") {
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
      const result = await db.runAsync(createNewTask, [
        taskHeading,
        taskDescription,
        "incomplete",
        type,
        expiry,
      ]);
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
      <View
        style={[
          tw`py-2 flex flex-row items-center justify-between px-5`,
          { width: "70%" },
        ]}
      >
        <TouchableOpacity
          style={tw`bg-white flex items-center justify-center p-2 rounded-full shadow-lg`}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" type="ionicon" size={30} />
        </TouchableOpacity>
        <Text style={[tw`text-2xl font-bold`]}>Add Task</Text>
      </View>

      <DatePicker
        isVisible={showDatePickerSingle}
        mode={"single"}
        onCancel={onCancelSingle}
        onConfirm={onConfirmSingle}
        dateStringFormat="dd/mm/yyyy"
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
          placeholder="Heading *"
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
            height: 140,
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
          numberOfLines={4}
          maxLength={500}
        />
      </View>

      <View
        style={[tw`flex flex-row justify-between items-center`, { margin: 12 }]}
      >
        <Text style={[tw`text-xl font-bold`]}>Type of task :</Text>
        <SelectDropdown
          data={options}
          onSelect={(selectedItem, index) => {
            setType(selectedItem.value);
          }}
          defaultValue={options[0]}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {(selectedItem && selectedItem.title) || "Type of task"}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: "#D2D9DF" }),
                }}
              >
                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </View>

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
            tw`py-2 px-5 text-2xl font-bold text-white rounded-md`,
            { backgroundColor: colors.blue },
          ]}
        >
          Create Task
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

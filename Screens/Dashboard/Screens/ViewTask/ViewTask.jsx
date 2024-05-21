import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { colors, taskId, tasks } from "../../../../store";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
import DatePicker from "react-native-neat-date-picker";
import { getDatabase } from "../../../../database";
import { getTaskById, updateCreatedTask } from "../../../../queries";

const ViewTask = () => {
  const [id, setId] = useAtom(taskId);
  const [data, setData] = useState([]);
  const [topics, setTopics] = useAtom(tasks);

  const db = getDatabase();

  const [view, setView] = useState(true);
  const [taskHeading, setTaskHeading] = useState(data?.taskHeading);
  const [taskDescription, setTaskDescription] = useState(data?.taskDescription);
  const [error, setError] = useState(false);
  const [expiry, setExpiry] = useState(data?.expiry);

  const navigation = useNavigation();

  const [showDatePickerSingle, setShowDatePickerSingle] = useState(false);
  const [errorDate, setErrorDate] = useState(false);
  const openDatePickerSingle = () => setShowDatePickerSingle(true);
  const onCancelSingle = () => {
    setShowDatePickerSingle(false);
  };

  const onConfirmSingle = (output) => {
    setShowDatePickerSingle(false);

    setExpiry(output.dateString);
  };

  const handleSave = async () => {
    if (taskHeading === "") {
      setError(true);
      return;
    } else {
      setError(false);
    }

    if (data.type === "oneTime" && expiry === "") {
      setErrorDate(true);
      return;
    } else {
      setErrorDate(false);
    }

    const updatedTask = {
      id,
      taskHeading,
      taskDescription,
      type: data.type,
      expiry,
    };

    if (db) {
      const result = await db.runAsync(updateCreatedTask, [
        taskHeading,
        taskDescription,
        data.type,
        expiry,
        id,
      ]);
      setData(updatedTask);
    }

    // setTopics((prevTasks) =>
    //   prevTasks.map((task) =>
    //     task.id === id ? { ...task, ...updatedTask } : task
    //   )
    // );

    setView(true);
  };

  useEffect(() => {
    const getTaskByUsingId = async () => {
      const taskData = await db.getFirstAsync(getTaskById, id);

      // const taskData = topics?.filter((item) => item.taskId === id);
      setData(taskData);
      setTaskHeading(taskData.taskHeading);
      setTaskDescription(taskData.taskDescription);
      setExpiry(taskData.expiry);
    };
    getTaskByUsingId();
  }, []);

  return (
    <View style={[tw`w-full bg-white h-full`, {}]}>
      <DatePicker
        isVisible={showDatePickerSingle}
        mode={"single"}
        onCancel={onCancelSingle}
        onConfirm={onConfirmSingle}
        dateStringFormat="yyyy-mm-dd"
        colorOptions={{
          headerColor: colors.blue,
          selectedDateBackgroundColor: colors.green,
          weekDaysColor: colors.blue,
          confirmButtonColor: colors.blue,
          backgroundColor: "#fff",
        }}
      />
      <View
        style={[
          tw`py-2 flex flex-row items-center justify-between px-5`,
          { width: "100%" },
        ]}
      >
        <TouchableOpacity
          style={tw`bg-white flex items-center justify-center p-2 rounded-full shadow-lg`}
          onPress={() => {
            setView(true);
            navigation.goBack();
          }}
        >
          <Icon name="close" type="ionicon" size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setView(false)}>
          {view && (
            <Text style={[tw`text-2xl font-bold `, { color: colors.blue }]}>
              Edit
            </Text>
          )}
        </TouchableOpacity>
      </View>
      {view ? (
        <View
          style={[
            tw` flex p-5 rounded-xl shadow-2xl`,
            {
              margin: 12,
              height: "60%",
              gap: 10,
              backgroundColor: colors.blue,
            },
          ]}
        >
          <Text style={[tw`text-3xl text-white font-bold`]}>
            {data?.taskHeading}
          </Text>
          <Text style={[tw`text-xl font-medium text-white italic`]}>
            {data?.taskDescription ? data?.taskDescription : "No Description"}
          </Text>
          <Text style={[tw`text-lg font-medium text-white italic`]}>
            Expiry: {data?.type === "oneTime" ? expiry : "Today"}
          </Text>
        </View>
      ) : (
        <View
          style={[
            tw` flex p-5 `,
            {
              margin: 12,
              height: "60%",
              gap: 10,
            },
          ]}
        >
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
              <Text
                style={[tw`text-lg text-red-700`, { marginHorizontal: 12 }]}
              >
                Required*
              </Text>
            )}
          </View>
          <View>
            <TextInput
              style={{
                height: 200,
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
          {data?.type === "oneTime" && (
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
                <Text
                  style={[tw`text-lg text-red-700`, { marginHorizontal: 12 }]}
                >
                  Required*
                </Text>
              )}
            </View>
          )}
          <View style={[tw` flex flex-row justify-between`, { margin: 12 }]}>
            <TouchableOpacity onPress={() => setView(true)}>
              <Text
                style={[
                  tw`text-xl text-white rounded-xl py-2 px-5`,
                  { backgroundColor: colors.blue },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
              <Text
                style={[
                  tw`text-xl text-white rounded-xl py-2 px-5`,
                  { backgroundColor: colors.green },
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default ViewTask;

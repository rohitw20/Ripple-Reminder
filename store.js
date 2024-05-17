import { atom } from "jotai";

export const colors = {
  blue: `#2D75BA`,
  green: `#45BC61`,
};

// export const task = {
//   id: "",
//   taskHeading: "",
//   taskDescription: "",
//   status: "",
//   type: "",
//   expiry: "",
// };

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const currentScreen = atom("DailyTasksScreen");
export const footerScreen = atom("DashboardScreen");
export const taskId = atom("");

// export const tasks = atom([]);

export const tasks = atom([]);

// [{
//   id: "1",
//   taskHeading: "Book Reading",
//   taskDescription:
//     "This task is to read at least 30 pages of a book every day, ensuring a mix of genres to broaden your perspective and understanding. After each reading session, write a brief summary and personal reflection on the key points and themes. Track your progress and reflections in a journal to review your insights and growth over time.",
//   status: "incomplete",
//   type: "daily",
//   expiry: "",
// },
// {
//   id: "2",
//   taskHeading: "Exercise",
//   taskDescription: "",
//   status: "incomplete",
//   type: "daily",
//   expiry: "",
// },
// {
//   id: "3",
//   taskHeading: "Driving",
//   taskDescription: "",
//   status: "complete",
//   type: "daily",
//   expiry: "",
// },
// {
//   id: "4",
//   taskHeading: "Swimming",
//   taskDescription: "",
//   status: "complete",
//   type: "daily",
//   expiry: "",
// },
// {
//   id: "5",
//   taskHeading: "Homework",
//   taskDescription: "",
//   status: "incomplete",
//   type: "daily",
//   expiry: "",
// },
// {
//   id: "6",
//   taskHeading: "Completing geometry topic",
//   taskDescription: "need to complete 2 chapters of geometry",
//   status: "incomplete",
//   type: "oneTime",
//   expiry: "16/05/2024",
// },
// {
//   id: "7",
//   taskHeading: "Buying groceries from",
//   taskDescription: "",
//   status: "incomplete",
//   type: "oneTime",
//   expiry: "18/05/2024",
// },
// {
//   id: "8",
//   taskHeading: "Throwing garbage",
//   taskDescription: "",
//   status: "incomplete",
//   type: "oneTime",
//   expiry: "20/05/2024",
// },
// {
//   id: "9",
//   taskHeading: "Meeting Friends",
//   taskDescription: "",
//   status: "incomplete",
//   type: "oneTime",
//   expiry: "23/05/2024",
// },]

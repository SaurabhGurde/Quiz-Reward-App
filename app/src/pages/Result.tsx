import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { questionType } from "../types";
import { useAppSelector } from "../redux/store";


const Result = () => {
  const answers = useAppSelector((state) => state.quizData);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results..</Text>
      <ScrollView style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.cellIndex]}>Q. No.</Text>
          <Text style={[styles.headerCell, styles.cellQuestion]}>Question</Text>
          <Text style={[styles.headerCell, styles.cellResult]}>Result</Text>
        </View>

        {/* Table Rows */}
        {answers &&
          answers.map((data) => (
            <View key={data.index} style={styles.tableRow}>
              <Text style={[styles.rowCell, styles.cellIndex]}>
                {data.index + 1}
              </Text>
              <Text style={[styles.rowCell, styles.cellQuestion]}>
                {data.title}
              </Text>
              <Text
                style={[
                  styles.rowCell,
                  styles.cellResult,
                  data.answer === "pass" ? styles.passText : styles.failText,
                ]}
              >
                {data.answer}
              </Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

export default Result;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F8E9", 
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#065F46", 
  },
  tableContainer: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#D1FAE5", 
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#065F46",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#A7F3D0", 
  },
  rowCell: {
    fontSize: 14,
    color: "#065F46",
  },
  cellIndex: {
    flex: 0.2,
    textAlign: "center",
  },
  cellQuestion: {
    flex: 0.6,
    paddingHorizontal: 5,
  },
  cellResult: {
    flex: 0.2,
    textAlign: "center",
  },
  passText: {
    color: "green",
  },
  failText: {
    color: "red",
  },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAppSelector } from "../redux/store";

const Profile = () => {
    const user = useAppSelector(state => state.user)
  return (
    <View style={styles.container}>
      {/* Header with Profile Icon */}
      <View style={styles.header}>
        <Icon name="account-circle" size={80} color="#2E7D32" />
      </View>

      {/* User Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}><Text style={styles.label}>First Name:</Text> {user.firstName}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Last Name:</Text> {user.lastName}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Email:</Text> {user.email}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Phone:</Text> {user.phone || "N/A"}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Reward Points:</Text> {user.reward || 0}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Date of Birth:</Text> {user.dob || "N/A"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F9E6", // Light green background
    alignItems: "center",
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  detailsContainer: {
    width: "100%",
    backgroundColor: "#A3D9A5",
    padding: 20,
    borderRadius: 10,
  },
  detailText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1B5E20",
  },
  label: {
    fontWeight: "bold",
    color: "#000",
  },
});

export default Profile;
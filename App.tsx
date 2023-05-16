import { useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import * as Y from "yjs";
import YMMKVProvider from "./provider";

const ydoc = new Y.Doc();
const provider = new YMMKVProvider(ydoc);

function getCount() {
  const yarray = ydoc.getArray("count");
  return yarray
    .toArray()
    .reduce(
      (a, b) => parseInt(a as string, 10) + parseInt(b as string, 10),
      [0]
    ) as number;
}

function incrementCount() {
  const yarray = ydoc.getArray("count");
  yarray.push([1]);
  return getCount();
}

function Counter() {
  const [count, setCount] = useState(getCount());

  // This is the observer function that will be called whenever the YArray changes
  const yObserver = useCallback(() => {
    console.log("new sum: " + getCount());
    setCount(getCount());
  }, [setCount]);

  // Observe changes in the YArray
  useEffect(() => {
    const yarray = ydoc.getArray("count");
    yarray.observe(yObserver);

    return () => {
      yarray.unobserve(yObserver);
    };
  }, [setCount]);

  // Also observe changes as reported by the persistence provider, for fun
  useEffect(() => {
    const subscription = provider.onSave(() => {
      console.log(`saved: ${getCount()}`);
    });

    return () => subscription.remove();
  }, []);

  return (
    <View>
      <Text style={{ fontSize: 20, textAlign: "center" }}>{count}</Text>
      <Button title="Increment" onPress={incrementCount} />
    </View>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <Counter />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

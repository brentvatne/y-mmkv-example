import { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as Y from 'yjs';

const ydoc = new Y.Doc()

function getCount() {
  const yarray = ydoc.getArray('count');
  return yarray.toArray().reduce((a, b) => parseInt(a, 10) + parseInt(b, 10), [0])
}

function incrementCount() {
  const yarray = ydoc.getArray('count');
  yarray.push([1]);
  return getCount();
}

function Counter() {
  const [count, setCount] = useState(getCount());

  const yObserver = useCallback((event) => {
    console.log('new sum: ' + getCount())
    setCount(getCount())
  }, [setCount])

  useEffect(() => {
    yarray = ydoc.getArray('count');
    yarray.observe(yObserver);

    return () => {
      yarray.unobserve(yObserver);
    }
  }, [setCount]);


  return (
    <View>
      <Text style={{ fontSize: 20, textAlign: 'center' }}>
        {count}
      </Text>
      <Button title="Increment" onPress={incrementCount} />
    </View>
  )
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

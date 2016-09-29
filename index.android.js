import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ListView
} from 'react-native';

import firebase from 'firebase';

class ReactNativeTodoApp extends Component {
  constructor(props) {
    super(props);
    let config = {
      apiKey: "AIzaSyDD42tUc3Vf4tOAXHR9vbDQXsKMNbp1XCs",
      authDomain: "used-mobile-finder.firebaseapp.com",
      databaseURL: "https://used-mobile-finder.firebaseio.com",
      storageBucket: "",
      messagingSenderId: "634054564176"
    };
    firebase.initializeApp(config);
    this.ref = firebase.database().ref();
    this.todosRef = this.ref.child('todos');
    this.state = {
      newTodo: '',
      todoSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })
    };
    this.items = [];
  }
  addTodo() {
    if (this.state.newTodo !== '') {
      this.todosRef.push({
        todo: this.state.newTodo
      });
      this.setState({
        newTodo: ''
      });
    }
  }
  removeTodo(rowData) {
    this.todosRef.child(rowData.id).remove();
  }
  componentDidMount() {
    this.todosRef.on('child_added', (dataSnapshot) => {
      this.items.push({ id: dataSnapshot.key, text: dataSnapshot.val() });
      this.setState({
        todoSource: this.state.todoSource.cloneWithRows(this.items)
      });
    });
    this.todosRef.on('child_removed', (dataSnapshot) => {
      this.items = this.items.filter((x) => x.id !== dataSnapshot.key);
      this.setState({
        todoSource: this.state.todoSource.cloneWithRows(this.items)
      });
    });
  }
  render() {
    return (
      <View style={styles.appContainer}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>
            React Native Todos App
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} onChangeText={(text) => this.setState({ newTodo: text }) } value={this.state.newTodo}/>
          <TouchableHighlight
            style={styles.button}
            onPress={() => this.addTodo() }
            underlayColor='#dddddd'>
            <Text style={styles.btnText}>Add!</Text>
          </TouchableHighlight>
        </View>
        <ListView
          dataSource={this.state.todoSource}
          renderRow={this.renderRow.bind(this) } />
      </View>
    );
  }
  renderRow(rowData) {
    return (
      <TouchableHighlight
        onPress={() => this.removeTodo(rowData) }
        underlayColor='#dddddd'>
        <View>
          <View style={styles.row}>
            <Text style={styles.todoText}>{rowData.text.todo}</Text>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1
  },
  titleView: {
    backgroundColor: '#48afdb',
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  titleText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 20,
  },
  inputContainer: {
    marginTop: 5,
    padding: 10,
    flexDirection: 'row'
  },
  button: {
    height: 36,
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#48afdb',
    justifyContent: 'center',
    // color: '#FFFFFF',
    borderRadius: 4,
  },
  btnText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 6,
  },
  input: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48afdb',
    borderRadius: 4,
    color: '#48BBEC'
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    height: 44
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  todoText: {
    flex: 1,
  }
});

AppRegistry.registerComponent('ReactNativeTodoApp', () => ReactNativeTodoApp);

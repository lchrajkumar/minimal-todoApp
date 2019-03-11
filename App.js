import React from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, Platform, ScrollView, AsyncStorage } from 'react-native';
//importing gradient view
import { LinearGradient, AppLoading } from 'expo';
//importing TodoList component
import TodoList from './components/TodoList';
//import uuid
import uuidv1 from 'uuid/v1';

//defining dimensions constant

const { height, width } = Dimensions.get('window');



export default class App extends React.Component {
  saveTodos = newToDos => {
    //const saveTodos = AsyncStorage.setItem('todos', newToDos);
    const saveTodos = AsyncStorage.setItem('todos', JSON.stringify(newToDos));
  };

  state = {
    newTodoItem: '',
    dataIsReady: false,
    todos: {}
  };
  newTodoItemController = textValue => {
    this.setState({
      newTodoItem: textValue
    });
  };
  componentDidMount = () => {
      this.loadTodos();
    };
    loadTodos = () => {
      this.setState({ dataIsReady: true });
    };

    // addition to below methods
      addTodo = () => {
        const { newTodoItem } = this.state;
       
        if (newTodoItem !== '') {
          this.setState(prevState => {
            const ID = uuidv1();
            const newToDoObject = {
              [ID]: {
                id: ID,
                isCompleted: false,
                textValue: newTodoItem,
                createdAt: Date.now()
              }
            };
            const newState = {
              ...prevState,
              newTodoItem: '',
              todos: {
                ...prevState.todos,
                ...newToDoObject
              }
            };
            this.saveTodos(newState.todos); // add this
            return { ...newState };
          });
        }
      };
       
      deleteTodo = (id) => {
        this.setState(prevState => {
          const todos = prevState.todos;
          delete todos[id];
          const newState = {
            ...prevState,
            ...todos
          };
          this.saveTodos(newState.todos); // add this
          return { ...newState };
        });
      };
       
      inCompleteTodo = (id) => {
        this.setState(prevState => {
          const newState = {
            ...prevState,
            todos: {
              ...prevState.todos,
              [id]: {
                ...prevState.todos[id],
                isCompleted: false
              }
            }
          };
          this.saveTodos(newState.todos); // add this
          return { ...newState };
        });
      };
       
      completeTodo = (id) => {
        this.setState(prevState => {
          const newState = {
            ...prevState,
            todos: {
              ...prevState.todos,
              [id]: {
                ...prevState.todos[id],
                isCompleted: true
              }
            }
          };
          this.saveTodos(newState.todos); // add this
          return { ...newState };
        });
      };
       
      updateTodo = (id, textValue) => {
        this.setState(prevState => {
          const newState = {
            ...prevState,
            todos: {
              ...prevState.todos,
              [id]: {
                ...prevState.todos[id],
                textValue: textValue
              }
            }
          };
          this.saveTodos(newState.todos); // add this
          return { ...newState };
        });
      };


    /*addTodo = () => {
        const { newTodoItem } = this.state;
       
        if (newTodoItem !== '') {
          this.setState(prevState => {
            const ID = uuidv1();
            const newToDoObject = {
              [ID]: {
                id: ID,
                isCompleted: false,
                textValue: newTodoItem,
                createdAt: Date.now()
              }
            };
            const newState = {
              ...prevState,
              newTodoItem: '',
              todos: {
                ...prevState.todos,
                ...newToDoObject
              }
            };
       
            return { ...newState };
          });
        }
      };
      deleteTodo = id => {
      this.setState(prevState => {
        const todos = prevState.todos;
        delete todos[id];
        const newState = {
          ...prevState,
          ...todos
        };
        return { ...newState };
      });
    };*/
    /*updateTodo = (id, textValue) => {
      this.setState(prevState => {
        const newState = {
          ...prevState,
          todos: {
            ...prevState.todos,
            [id]: {
              ...prevState.todos[id],
              textValue: textValue
            }
          }
        };
        return { ...newState };
      });
    };*/
    finishEditing = () => {
      const { todoValue } = this.state;
      const { id, updateTodo } = this.props;
      updateTodo(id, todoValue);
      this.setState({
        isEditing: false
      });
    };
    /*inCompleteTodo = id => {
      this.setState(prevState => {
        const newState = {
          ...prevState,
          todos: {
            ...prevState.todos,
            [id]: {
              ...prevState.todos[id],
              isCompleted: false
            }
          }
        };
        return { ...newState };
      });
    };*/
    /*completeTodo = id => {
      this.setState(prevState => {
        const newState = {
              ...prevState,
          todos: {
            ...prevState.todos,
            [id]: {
              ...prevState.todos[id],
              isCompleted: true
            }
          }
        };
        return { ...newState };
      });
    };*/
  render() {
    const { newTodoItem, dataIsReady, todos } = this.state;
    if (!dataIsReady) {
      return <AppLoading />;
    }
    return (
      <LinearGradient style={styles.container} colors={['#DA4453', '#89216B']}>
        <Text style={styles.appTitle}>Minimalist Todo App!</Text>
        <View style={styles.card}>
          <TextInput
              style={styles.input}
              placeholder={'Add an item!'}
              value={newTodoItem}
              onChangeText={this.newTodoItemController}
              placeholderTextColor={'#999'}
              returnKeyType={'done'}
              autoCorrect={false}
          />
          <ScrollView contentContainerStyle={styles.listContainer}>
              {/*<TodoList textValue= {'TodoItem'}/>*/}
              <TodoList key={todos.id} {...todos} deleteTodo={this.deleteTodo} />
              <TodoList
                key={todos.id}
                {...todos}
                deleteTodo={this.deleteTodo}
                inCompleteTodo={this.inCompleteTodo}
                completeTodo={this.completeTodo}
                updateTodo={this.updateTodo} // add this
              />
              {Object.values(todos).map(todo => <TodoList key={todo.id} {...todo} />)}
          </ScrollView>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f23657',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  appTitle:{
    color: '#fff',
    fontSize: 36,
    marginTop: 60,
    marginBottom: 30,
    fontWeight: '300'
  },
  card:{
    backgroundColor: '#fff',
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50,50,50)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 5
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 2,
    fontSize: 24
  },
  listContainer:{
    alignItems: 'center'
  }
});

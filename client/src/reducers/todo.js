import {
  TODO_LOADED, NEW_TODO, UPDATE_TODO_QUEUE, UPDATE_TODO, REMOVE_TODO
} from '../actions/types';

const initialState = {
  todo_queue: [],
  todo_list: {},
};

const addNewToDo = (state, todo_) => {
  let state_ = {...state};
  state_.todo_list[todo_.todo_item.exp] = [todo_.todo_item, ...state_.todo_list[todo_.todo_item.exp]];
  state_.todo_queue = todo_.todo_queue;
  return {...state_};
}

const updateToDo = (state, todo_) => {
  let state_ = {...state};

  for (let i=0; i<state_.todo_list[todo_.todo_item.exp].length; i++){
    const id = state_.todo_list[todo_.todo_item.exp][i]._id;
    const todo_item_id = todo_.todo_item._id;
    if (id === todo_item_id) {

      state_.todo_list[todo_.todo_item.exp][i] = todo_.todo_item;
    }
  }
  state_.todo_queue = todo_.todo_queue;

  return {...state_};
}

const removeToDo = (state, todo_) => {
  let state_ = {...state};
  state_.todo_list[todo_.todo_item.exp] = state_.todo_list[todo_.todo_item.exp].filter(
      todo_i => todo_i._id !== todo_.todo_item.id
  )

  state_.todo_queue = todo_.todo_queue;
  return {...state_};
}

export default function ToDoReducer(state = initialState, action) {
  const { type, payload } = action;

    switch (type) {
      case TODO_LOADED:
        return {
          todo_queue: payload.todo_queue,
          todo_list: payload.todo_list
        };
      case NEW_TODO:
        return addNewToDo(state, payload);
      case UPDATE_TODO:
        return updateToDo(state, payload);
      case REMOVE_TODO:
        return removeToDo(state, payload);
      case UPDATE_TODO_QUEUE:
        return {
          ...state,
          todo_queue: payload
        };

    default:
      return state;
  }
}

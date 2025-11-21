import { v4 as uuidv4 } from "uuid";

export default function Reducer(currentTodo, action) {
  switch (action.type) {
    case "added": {
      const newTodo = {
        title: action.payload.title,
        id: uuidv4(),
        details: action.payload.details,
        isCompleted: false,
      };
      const theUpdatedTodo = [...currentTodo, newTodo];
      return theUpdatedTodo;
    }
    case "deleted": {
      const filterdTodo = currentTodo.filter((t) => t.id !== action.payload.id);
      return filterdTodo;
    }
    case "edited": {
      const editedTodo = currentTodo.map((t) => {
        if (t.id === action.payload.id) {
          return {
            ...t,
            title: action.payload.title,
            details: action.payload.details,
          };
        } else {
          return t;
        }
      });
      return editedTodo;
    }
    case "done": {
      const updatedTodo = currentTodo.map((t) => {
        if (t.id === action.payload.id) {
          return { ...t, isCompleted: !t.isCompleted };
        } else {
          return t;
        }
      });
      return updatedTodo;
    }
    default: {
      throw Error("wrong action " + action.type);
    }
  }
}

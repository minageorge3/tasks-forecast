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
      localStorage.setItem("todos", JSON.stringify(theUpdatedTodo));
      return theUpdatedTodo;
    }
    case "deleted": {
      const filterdTodo = currentTodo.filter((t) => t.id !== action.payload.id);
      localStorage.setItem("todos", JSON.stringify(filterdTodo));
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
      localStorage.setItem("todos", JSON.stringify(editedTodo));
      return editedTodo;
    }
    case "done": {
      let completedStatus = false; //1
      const updatedTodo = currentTodo.map((t) => {
        if (t.id === action.payload.id) {
          // t.isCompleted = !t.isCompleted;
          completedStatus = !t.isCompleted; //2
          return { ...t, isCompleted: !t.isCompleted };
        } else {
          return t;
        }
      });
      localStorage.setItem("todos", JSON.stringify(updatedTodo));
      if (completedStatus) {
        action.payload.showNotification("success", "Task marked as done! 🎉");
      } else {
        action.payload.showNotification("info", "Task  moved to pending. 🖊️");
      }
      return updatedTodo;
    }

    case "getfromlocalstorage": {
      const storageTodos = JSON.parse(localStorage.getItem("todos")) || [];
      return storageTodos;
    }

    default: {
      throw Error("wrong action " + action.type);
    }
  }
}

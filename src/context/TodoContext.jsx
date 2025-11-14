import { createContext, useContext, useReducer } from "react";
import Reducer from "../Reducer/Reducer";
const TodoContext = createContext([]);
export default function TodoProvider({ children }) {
  const [todo, dispatch] = useReducer(Reducer, []);
  return (
    <TodoContext.Provider value={{ todo, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  return useContext(TodoContext);
}

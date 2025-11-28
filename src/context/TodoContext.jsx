import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  useMemo,
} from "react";
import Reducer from "../Reducer/Reducer";
import Notification from "../notifications";
const TodoContext = createContext([]);
const savedLocalStorage = () => {
  const savedTodo = localStorage.getItem("savedTodo");
  return savedTodo ? JSON.parse(savedTodo) : [];
};
// >>>
export default function TodoProvider({ children }) {
  const [todo, dispatch] = useReducer(Reducer, [], savedLocalStorage);

  // added notification +++++++++++++++++

  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const showNotification = (severity, message) => {
    setNotification({ open: true, severity, message });
  };

  const handleCloseNotification = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, open: false });
  };
  // added notification +++++++++++++++++
  const [yourname, setyourname] = useState(() => {
    const savedName = localStorage.getItem("myname");
    return savedName || "Guest";
  });
  const [selectedColor, setSelectedColor] = useState(() => {
    const savedColor = localStorage.getItem("todoBgColor");
    return savedColor || "#242424ff";
  });
  useEffect(() => {  
    localStorage.setItem("myname", yourname);
  }, [yourname]);
  useEffect(() => {
    localStorage.setItem("todoBgColor", selectedColor);
  }, [selectedColor]);
  useEffect(() => {
    localStorage.setItem("savedTodo", JSON.stringify(todo));
  }, [todo]);
  const contextValue = useMemo(
    () => ({
      todo,
      dispatch,
      showNotification,
      yourname,
      setyourname,
      selectedColor,
      setSelectedColor,
    }),
    [todo, yourname, selectedColor]
  );

  return (
    <TodoContext.Provider value={contextValue}>
      <Notification
        open={notification.open}
        onClose={handleCloseNotification}
        severity={notification.severity}
        message={notification.message}
      />
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  return useContext(TodoContext);
}

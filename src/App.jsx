import "./App.css";
import { TodoContext } from "./context/TodoContext";
import { useState } from "react";
import TodoList from "./TodoList";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "myfont",
  },
  palette: {
    primary: {
      main: "#0288d1",
    },
    secondary: {
      main: "#723ce6ff",
    },
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: "red",
        },
      },
    },
  },
});
const initialTodo = [];
function App() {
  const [todo, setTodo] = useState(initialTodo);

  return (
    <ThemeProvider theme={theme}>
      <TodoContext.Provider value={{ todo, setTodo }}>
        <div
          style={{
            marginTop: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100vw",
          }}
        >
          <TodoList />
        </div>
      </TodoContext.Provider>
    </ThemeProvider>
  );
}

export default App;

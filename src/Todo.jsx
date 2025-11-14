import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import { useTodo } from "./context/TodoContext";

export default function Todo({
  todos,
  showNotification,
  todoBgColor,
  HandleDeleteOpen,
  HandleEditOpen,
}) {
  const { todo, dispatch } = useTodo();

  // event handlers functions++++++++++
  function handleCheck() {
    dispatch({ type: "done", payload: { id: todos.id, showNotification } });
    
  }
  // Delete functions <><><><><><><><><>
  function handleDeleteOpen() {
    HandleDeleteOpen(todos);
  }
  // Delete functions <><><><><><><><><><><><
  // edit functions >>>>>>>>>>
  function handleEditOpen() {
    HandleEditOpen(todos);
  }
  // edit functions >>>>>>>>>>
  // event handlers functions++++++++++
  // notification +++++++++++++++++++++++++++++++

  return (
    <>
      <Card
        className="todoCard"
        sx={{
          minWidth: 275,
          margin: ".5rem",
          borderRadius: ".5rem",
          boxShadow: "0 0 5px #13a6eaff",
          backgroundColor: todos.isCompleted ? "#000000ff" : todoBgColor,
          opacity: todos.isCompleted ? 0.8 : 1,
        }}
      >
        <CardContent>
          <Grid
            container
            spacing={3}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >
            <Grid>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontSize: 24,
                  color: "#fff",
                  textDecoration: todos.isCompleted ? "line-through" : "none",
                }}
              >
                {todos.title}
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: 14, color: "#fff" }}
              >
                {todos.details}
              </Typography>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: ".5rem",
              }}
            >
              {/* ====== check button ============== */}
              <IconButton
                className="actionBtns"
                size="small"
                sx={{
                  border: "2px #17a3faff solid",
                  color: todos.isCompleted ? "#fff" : "#17a3faff",
                  backgroundColor: todos.isCompleted ? "#17a3faff" : "#fff",

                  outline: "none",
                }}
                onClick={() => {
                  handleCheck();
                }}
              >
                <CheckIcon />
              </IconButton>
              {/* ====== check button ============== */}
              <IconButton
                className="actionBtns"
                size="small"
                style={{
                  border: "2px #da850eff solid",
                  backgroundColor: "#fff",
                  outline: "none",
                  color: "#e66312ff",
                }}
                onClick={handleEditOpen}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                className="actionBtns"
                size="small"
                color="error"
                style={{
                  border: "2px #ba1722ff solid",
                  backgroundColor: "#fff",
                  outline: "none",
                }}
                onClick={handleDeleteOpen}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

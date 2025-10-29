import { useContext, useState } from "react";
import { TodoContext } from "./context/TodoContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
// alert popup
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

// alert popup
export default function Todo({ todos, showNotification, todoBgColor }) {
  const { todo, setTodo } = useContext(TodoContext);
  // dialogs appearing
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  // dialogs appearing
  // edit handling
  const [editAndUpdate, setEditAndUpdate] = useState({
    title: todos.title,
    details: todos.details,
  });
  // edit handling
  // event handlers functions++++++++++
  function handleCheck() {
    let completedStatus = false; //1
    const updatedTodo = todo.map((t) => {
      if (t.id === todos.id) {
        t.isCompleted = !t.isCompleted;
        completedStatus = t.isCompleted; //2
        showNotification("info", "Categories Updated successfully");
      }
      return t;
    });
    setTodo(updatedTodo);
    localStorage.setItem("todos", JSON.stringify(updatedTodo));
    // 3. Conditionally show the appropriate notification message
    if (completedStatus) {
      // Task is now complete (Added to "Done" list)
      showNotification("success", "Task marked as done! 🎉");
    } else {
      // Task is now not complete (Removed from "Done" list)
      showNotification("info", "Task  moved to pending. 🖊️");
    }
  }

  // Delete functions <><><><><><><><><>
  function handleDeleteOpen() {
    setDeleteDialog(true);
  }
  function handleDeleteClose() {
    setDeleteDialog(false);
  }
  function handleDelete() {
    showNotification("error", "Task deleted successfully");
    const filterdTodo = todo.filter((t) => t.id !== todos.id);
    setTodo(filterdTodo);
    localStorage.setItem("todos", JSON.stringify(filterdTodo));
    setDeleteDialog(false);
  }
  const handleKeyDownToDelete = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleDelete();
    }
  };
  // Delete functions <><><><><><><><><><><><
  // edit functions >>>>>>>>>>
  function handleEditOpen() {
    setEditDialog(true);
  }
  function handleEditClose() {
    setEditDialog(false);
  }
  function handleEdit() {
    const editedTodo = todo.map((t) => {
      if (t.id === todos.id) {
        return {
          ...t,
          title: editAndUpdate.title,
          details: editAndUpdate.details,
        };
      } else {
        return t;
      }
    });
    setTodo(editedTodo);
    setEditDialog(false);
    localStorage.setItem("todos", JSON.stringify(editedTodo));
    showNotification("warning", "Task updated successfully");
  }
  function handleKeyDownToEdit(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEdit();
    }
  }
  // edit functions >>>>>>>>>>
  // event handlers functions++++++++++
  // notification +++++++++++++++++++++++++++++++

  return (
    <>
      {/* alert popup when click delete button !!!!!!!!!!!!!*/}

      <Dialog
        open={deleteDialog}
        onClose={handleDeleteClose}
        onKeyDown={handleKeyDownToDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure to delete this task?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            you can't restore it
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>no, close</Button>
          <Button onClick={handleDelete}>
            <span style={{ color: "#da1f1fff" }}>yes, delete</span>
          </Button>
        </DialogActions>
      </Dialog>
      {/* alert popup when click delete button !!!!!!!!!!!!!!*/}
      {/* alert popup when click edit button !!!!edit edit edit edit*/}
      <Dialog
        open={editDialog}
        onClose={handleEditClose}
        onKeyDown={handleKeyDownToEdit}
      >
        <DialogTitle>Task Editing</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="email"
              label="Task Title"
              fullWidth
              variant="standard"
              value={editAndUpdate.title}
              onChange={(e) => {
                setEditAndUpdate({ ...editAndUpdate, title: e.target.value });
              }}
            />
            <TextField
              margin="dense"
              id="name"
              name="email"
              label="Task Details"
              fullWidth
              variant="standard"
              value={editAndUpdate.details}
              onChange={(e) => {
                setEditAndUpdate({ ...editAndUpdate, details: e.target.value });
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEdit}>
            <span style={{ color: "#f2650dff" }}>Save</span>
          </Button>
        </DialogActions>
      </Dialog>
      {/* alert popup when click edit button !!!!edit edit edit edit*/}
      <Card
        className="todoCard"
        sx={{
          minWidth: 275,
          margin: ".5rem",
          borderRadius: ".5rem",
          boxShadow: "0 0 5px #13a6eaff",
          backgroundColor: todos.isCompleted ? "#a1a1a1ff" : todoBgColor,

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
            <Grid item xs={12} md={8}>
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
              item
              xs={12}
              md={4}
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

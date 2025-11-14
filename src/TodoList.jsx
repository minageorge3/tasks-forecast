import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, Divider, Grid, Input } from "@mui/material";
// toggle button
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
// toggle button
import Todo from "./Todo";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState,  useEffect, useMemo } from "react";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import UpButton from "./upButton";
import Notification from "./notifications";
import { Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// alert popup
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTodo } from "./context/TodoContext";
// alert popup
export default function TodoList() {
  const [yourname, setyourname] = useState(() => {
    // Loads from storage, defaults to "Guest" if nothing is saved or the saved value is empty
    const savedName = localStorage.getItem("myname");
    return savedName || "Guest";
  });
  // The input field starts with the currently displayed name
  const [inputName, setInputName] = useState(yourname);
  const [displayTodoType, setDisplayTodoType] = useState("all");
  const [taskInput, setTaskInput] = useState("");
  const [detailsInput, setdetailsInput] = useState("");
  // const { todo1, setTodo } = useContext(TodoContext);
  // const [todo, dispatch] = useReducer(Reducer, []);
  const {todo, dispatch} = useTodo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [subjectInput, setSubjectInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [selectedColor, setSelectedColor] = useState(() => {
    const savedColor = localStorage.getItem("todoBgColor");
    return savedColor || "#afafafff";
  });
  const toggleDrawer = (newOpen) => () => {
    setIsMenuOpen(newOpen);
  };
  useEffect(() => {
    dispatch({
      type: "getfromlocalstorage",
    });
    
    const savedColor = localStorage.getItem("todoBgColor");
    if (savedColor) {
      setSelectedColor(savedColor);
    }
  }, []);
  useEffect(() => {
    // ✅ Always save the current state of 'yourname'
    localStorage.setItem("myname", yourname);
  }, [yourname]);
  useEffect(() => {
    localStorage.setItem("todoBgColor", selectedColor);
  }, [selectedColor]);
  const handleSaveName = () => {
    const trimmedName = inputName.trim();

    if (trimmedName) {
      // Set the display name to the trimmed value
      setyourname(trimmedName);
      showNotification("success", `Name updated to: ${trimmedName}`);
    } else {
      // If the input is empty or just spaces, set the display name to "Guest"
      setyourname("Guest");
      // Also ensure the input field is clear for visual confirmation
      setInputName("");
      showNotification("info", "Your name has been reset to Guest.");
    }
    // The useEffect in Step 2 will now save "Guest" or the new name.
  };
  // added notification +++++++++++++++++

  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const showNotification = (severity, message) => {
    setNotification({ open: true, severity, message });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  // added notification +++++++++++++++++
  // todo filtering::::::::::::::::::::::

  const completedTodo = useMemo(() => {
    return todo.filter((t) => {
      return t.isCompleted;
    });
  }, [todo]);
  const notCompletedTodo = useMemo(() => {
    return todo.filter((t) => {
      return !t.isCompleted;
    });
  }, [todo]);

  let baseList = todo;

  if (displayTodoType === "Completed") {
    baseList = completedTodo;
  } else if (displayTodoType === "Non-Completed") {
    baseList = notCompletedTodo;
  }
  let renderedTodo = baseList;
  if (displayTodoType === "all") {
    renderedTodo = [...baseList].sort((a, b) => {
      return a.isCompleted - b.isCompleted;
    });
  }
  // --- End NEW Logic ---
  function changeDisplaytodoType(e) {
    setDisplayTodoType(e.target.value);
  }
  // todo filtering::::::::::::::::::::::
  const todos = renderedTodo.map((t) => {
    return (
      <Todo
        key={t.id}
        todos={t}
        showNotification={showNotification}
        todoBgColor={selectedColor}
        HandleDeleteOpen={HandleDeleteOpen}
        HandleEditOpen={HandleEditOpen}
      />
    );
  });
  // handle submit >>>>>>>>>>>>
  function addTask() {
    dispatch({
      type: "added",
      payload: { title: taskInput, details: detailsInput },
    });
    setTaskInput("");
    setdetailsInput("");
  }
  // handle submit >>>>>>>>>>>>
  // slide menu ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  const handleSendMessage = () => {
    if (!subjectInput.trim() || !messageInput.trim()) {
      showNotification("error", "Subject and message are required.");
      return;
    }
    const subject = encodeURIComponent(subjectInput.trim());
    const body = encodeURIComponent(
      `Message from TodoList user:\n\n${messageInput.trim()}`
    );
    const mailtoLink = `mailto:white_lion_mina@yahoo.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    showNotification("info", "Opening your mail client to send the message.");
    setSubjectInput("");
    setMessageInput("");
    setIsMenuOpen(false);
  };
  // dialogs appearing
  const [toOpenDialogs, setToOpenDialogs] = useState({
    id: null,
    title: "",
    details: "",
  });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  // dialogs appearing
  // edit handling
  // edit handling
  // Delete functions <><><><><><><><><>
  function HandleDeleteOpen(todos) {
    setToOpenDialogs(todos);
    setDeleteDialog(true);
  }
  function handleDeleteClose() {
    setDeleteDialog(false);
  }
  function handleDelete() {
    dispatch({
      type: "deleted",
      payload: toOpenDialogs,
    });
    showNotification("error", "Task deleted successfully");
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
  function HandleEditOpen(todos) {
    setToOpenDialogs(todos);
    setEditDialog(true);
  }
  function handleEditClose() {
    setEditDialog(false);
  }
  function handleEdit() {
    dispatch({
      type: "edited",
      payload: toOpenDialogs,
    });
    setEditDialog(false);
    showNotification("warning", "Task updated successfully");
  }
  function handleKeyDownToEdit(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEdit();
    }
  }
  // edit functions >>>>>>>>>>
  const menuContent = (
    <Box
      sx={{
        // width: "100%",
        padding: 1,
        textAlign: "center",
      }}
      role="presentation"
      onClick={(event) => event.stopPropagation()}
    >
      {/* Close Button */}
      <IconButton
        onClick={toggleDrawer(false)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "#d32323ff",
        }}
      >
        <CloseIcon />
      </IconButton>
      {/* choose a color ????????????????????????????????????????? */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
        Select Todo Background Color:
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: 3,
        }}
      >
        {/* Red Button */}
        <Button
          onClick={() => setSelectedColor("#2469c3ff")}
          variant="contained"
          sx={{
            minWidth: 0,
            width: "1.5rem",
            height: "1.5rem",
            backgroundColor: "#2469c3ff",
            "&:hover": { backgroundColor: "#2469c3ff" },
            border:
              selectedColor === "#2469c3ff"
                ? "3px solid #b71fb4ff"
                : "1px solid #ccc",
            p: 0,
            borderRadius: "50%",
          }}
        />

        {/* Green Button */}
        <Button
          onClick={() => setSelectedColor("#4d724dff")}
          variant="contained"
          sx={{
            minWidth: 0,
            width: "1.5rem",
            height: "1.5rem",
            backgroundColor: "#4d724dff",
            "&:hover": { backgroundColor: "#4d724dff" },
            border:
              selectedColor === "#4d724dff"
                ? "3px solid #b71fb4ff"
                : "1px solid #ccc",
            p: 0,
            borderRadius: "50%",
          }}
        />

        {/* Blue Button */}
        <Button
          onClick={() => setSelectedColor("#5f5f89ff")}
          variant="contained"
          sx={{
            minWidth: 0,
            width: "1.5rem",
            height: "1.5rem",
            backgroundColor: "#5f5f89ff",
            "&:hover": { backgroundColor: "#5f5f89ff" },
            border:
              selectedColor === "#5f5f89ff"
                ? "3px solid #b71fb4ff"
                : "1px solid #ccc",
            p: 0,
            borderRadius: "50%",
          }}
        />
        {/* darkBlue Button */}
        <Button
          onClick={() => setSelectedColor("#16161dff")}
          variant="contained"
          sx={{
            minWidth: 0,
            width: "1.5rem",
            height: "1.5rem",
            backgroundColor: "#16161dff",
            "&:hover": { backgroundColor: "#16161dff" },
            border:
              selectedColor === "#16161dff"
                ? "3px solid #b71fb4ff"
                : "1px solid #ccc",
            p: 0,
            borderRadius: "50%",
          }}
        />
      </Box>
      {/* choose a color ????????????????????????????????????????? */}
      <Box
        sx={{
          my: 3,
          p: 2,
          borderTop: "1px solid #eee",
          borderBottom: "1px solid #eee",
        }}
      >
        <Typography variant="body1" sx={{ mb: 1 }}>
          Send a message to the Developer:
        </Typography>

        {/* Subject Input */}
        <TextField
          fullWidth
          label="Subject"
          variant="outlined"
          size="small"
          sx={{ mb: 1 }}
          value={subjectInput}
          onChange={(e) => setSubjectInput(e.target.value)}
        />
        <TextField
          fullWidth
          label="Your Message"
          variant="outlined"
          multiline
          rows={3}
          sx={{ mb: 1 }}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        {/* Send Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage} // Calls the new handler
          disabled={!subjectInput.trim() || !messageInput.trim()}
        >
          Send Message
        </Button>
      </Box>
      <Typography sx={{ mb: 2, color: "primary.main" }}>
        Designed by Mina_S_George
      </Typography>
      {/* 3. Copyright */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 2 }}
      >
        &copy; {new Date().getFullYear()} All Rights Reserved.
      </Typography>
    </Box>
  );

  // slide menu ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

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
              value={toOpenDialogs.title ?? ""}
              onChange={(e) => {
                setToOpenDialogs({ ...toOpenDialogs, title: e.target.value });
              }}
            />
            <TextField
              margin="dense"
              id="name"
              name="email"
              label="Task Details"
              fullWidth
              variant="standard"
              value={toOpenDialogs.details ?? ""}
              onChange={(e) => {
                setToOpenDialogs({ ...toOpenDialogs, details: e.target.value });
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
      <Container
        maxWidth="sm"
        sx={{
          overflowX: "hidden",
          p: 0,
        }}
      >
        <Card
          className="scroll"
          sx={{
            height: "90vh",
            overflowY: "auto",
            overflowX: "hidden",
            scrollBehavior: "smooth",
            position: "relative",
            width: "100%",
          }}
        >
          {/* slide menu ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
          <div>
            {/* Button to OPEN the menu */}
            <Button
              onClick={toggleDrawer(true)}
              variant="outlined"
              color="secondary"
              sx={{ m: 2, margin: ".5rem" }}
            >
              Open Menu
            </Button>
            {/*  Drawer component */}
            <Drawer
              anchor="left"
              open={isMenuOpen}
              onClose={toggleDrawer(false)}
              transitionDuration={800}
              slotProps={{
                paper: {
                  sx: {
                    overflow: "auto",
                    // width: "100%",
                    mb: { xs: 2, sm: 0 },
                  },
                },
              }}
            >
              <Card
                sx={{
                  backgroundColor: "#1a72de1a",
                  p: 1,
                  minHeight: { xs: "110px", md: "auto" },
                }}
              >
                <Grid
                  container
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: "8px", md: "8px" },
                  }}
                >
                  <Grid>
                    <Typography
                      variant="body1"
                      sx={{ textAlign: { xs: "center", md: "right" } }}
                    >
                      Welcome,
                    </Typography>
                  </Grid>
                  <Grid>
                    <TextField
                      placeholder="Type your name…"
                      variant="outlined"
                      size="small"
                      value={inputName ?? ""}
                      onChange={(e) => setInputName(e.target.value)}
                      fullWidth
                      sx={{
                        "& .MuiInputBase-input": { textAlign: "center" },
                      }}
                    />
                  </Grid>
                  <Grid>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={handleSaveName}
                      fullWidth
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Card>
              {menuContent}
            </Drawer>
          </div>
          {/* slide menu ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
          {/* added notification  ++++++++++++++++++++++++++++++++++ */}
          <Notification
            open={notification.open}
            onClose={handleCloseNotification}
            severity={notification.severity}
            message={notification.message}
          />

          {/* added notification  ++++++++++++++++++++++++++++++++++ */}
          <Card sx={{ backgroundColor: "#0f50f615" }}>
            <Grid
              // container
              spacing={1}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                height: "2rem",
              }}
            >
              <Grid>
                <p>Welcome, {inputName}</p>
              </Grid>
            </Grid>
          </Card>
          <CardContent
            style={{
              padding: "0 2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: ".5rem",
            }}
          >
            <Typography
              className="theheader"
              gutterBottom
              sx={{
                fontWeight: "700",
                marginTop: ".5rem",
                fontFamily: "myfont",
              }}
              color="primary"
              variant="h6"
            >
              My ToDo List
            </Typography>
            <NoteAltIcon color="secondary" />
          </CardContent>
          <Divider />
          {/* toogle button */}
          <ToggleButtonGroup
            exclusive
            aria-label="text alignment"
            style={{ margin: "1rem" }}
            value={displayTodoType}
            onChange={changeDisplaytodoType}
            color="primary"
          >
            <ToggleButton value="all" style={{ outline: "none" }}>
              All
            </ToggleButton>
            <ToggleButton value="Completed" style={{ outline: "none" }}>
              Completed
            </ToggleButton>
            <ToggleButton value="Non-Completed" style={{ outline: "none" }}>
              Non Completed
            </ToggleButton>
          </ToggleButtonGroup>
          {/* toogle button */}
          {/* =====================the todo ==========*/}
          {todos}
          {/* <Todo /> */}
          {/* =====================the todo ==========*/}
          <Grid container spacing={2} sx={{ margin: " 1rem .5rem " }}>
            <Grid size={12}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  id="outlined-basic"
                  label="Task Name"
                  required
                  variant="outlined"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  value={taskInput}
                  onChange={(e) => {
                    setTaskInput(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addTask();
                      showNotification("success", "Task Added successfully");
                    }
                  }}
                />
              </Box>

              <TextField
                id="outlined-basic"
                label="Task Details"
                variant="outlined"
                style={{
                  width: "100%",
                  height: "100%",
                }}
                value={detailsInput}
                onChange={(e) => {
                  setdetailsInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTask();
                    showNotification("success", "Task Added successfully");
                  }
                }}
              />
            </Grid>
            <Grid size={12}>
              <Button
                variant="contained"
                sx={{ width: "100%", height: "100%" }}
                onClick={() => {
                  addTask();
                  showNotification("success", "Task Added successfully");
                }}
                disabled={taskInput.length == 0}
              >
                add task
              </Button>
            </Grid>
          </Grid>
          <UpButton />
        </Card>
      </Container>
    </>
  );
}

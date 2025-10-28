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
import { v4 as uuidv4 } from "uuid";
import { useState, useContext, useEffect } from "react";
import { TodoContext } from "./context/TodoContext";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import UpButton from "./upButton";
import Notification from "./notifications";
import { Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
  const { todo, setTodo } = useContext(TodoContext);
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
    const storageTodos = JSON.parse(localStorage.getItem("todos")) || [];
    setTodo(storageTodos);

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
  const completedTodo = todo.filter((t) => {
    return t.isCompleted;
  });
  const notCompletedTodo = todo.filter((t) => {
    return !t.isCompleted;
  });
  let renderedTodo = todo;
  if (displayTodoType === "Completed") {
    renderedTodo = completedTodo;
  } else if (displayTodoType === "Non-Completed") {
    renderedTodo = notCompletedTodo;
  } else {
    renderedTodo = todo;
  }
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
      />
    );
  });
  // handle submit >>>>>>>>>>>>
  function addTask() {
    const newTodo = {
      title: taskInput,
      id: uuidv4(),
      details: detailsInput,
      isCompleted: false,
    };
    const theUpdatedTodo = [...todo, newTodo];
    setTodo(theUpdatedTodo);
    localStorage.setItem("todos", JSON.stringify(theUpdatedTodo));
    setTaskInput("");
    setdetailsInput("");
  }
  // handle submit >>>>>>>>>>>>
  // slide menu ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  const handleSendMessage = () => {
    // 1. Check if the required fields are filled
    if (!subjectInput.trim() || !messageInput.trim()) {
      showNotification("error", "Subject and message are required.");
      return;
    }

    // 2. Encode the subject and body for the mailto link
    const subject = encodeURIComponent(subjectInput.trim());
    const body = encodeURIComponent(
      `Message from TodoList user:\n\n${messageInput.trim()}`
    );

    // 3. Construct the mailto link (replace 'YOUR_EMAIL_ADDRESS' with your actual email)
    const mailtoLink = `mailto:white_lion_mina@yahoo.com?subject=${subject}&body=${body}`;

    // 4. Open the user's default email client
    window.location.href = mailtoLink;

    // 5. Provide feedback and clear inputs
    showNotification("info", "Opening your mail client to send the message.");
    setSubjectInput("");
    setMessageInput("");
    setIsMenuOpen(false);
  };

  const menuContent = (
    <Box
      sx={{
        width: "100%",
        padding: 3,
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

        {/* Message Input (will auto-adjust height) */}
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
          overflow: "auto",
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

          {/* The MUI Drawer component */}
          <Drawer
            anchor="top" // Slides from the top
            open={isMenuOpen} // Controlled by the state from Step 1
            onClose={toggleDrawer(false)} // Closes when clicking outside
            slotProps={{
              paper: {
                sx: {
                  maxHeight: "100%",
                  overflow: "auto",
                  width: "100%",
                },
              },
            }}
          >
            <Card
              sx={{ backgroundColor: "#f5f5f588", p: 1, minHeight: "35px" }}
            >
              <Grid
                container
                spacing={1}
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="body1"
                    sx={{ textAlign: { xs: "center", md: "right" } }}
                  >
                    Welcome, {yourname}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  {/* ⭐ Use TextField instead of Input for better scaling: */}
                  <TextField
                    placeholder="Type your name…"
                    variant="outlined"
                    size="small" // Use small size to save vertical space
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    fullWidth
                    sx={{
                      "& .MuiInputBase-input": { textAlign: "center" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={handleSaveName}
                    sx={{
                      width: "100%",
                      mt: { xs: 1, md: 0 },
                    }}
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
            <Grid item xs={12} md={4}>
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
  );
}

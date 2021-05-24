import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "../components/Modal";
import TopBar from "../components/TopBar";
import UserForm from "../components/forms/UserForm";
import useMe from "../hooks/use-me";
import User from "../models/User";
import dbConnect from "../utils/dbConnect";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Router, { useRouter } from "next/router";

const columns = [
  { id: "name", label: "Name", minWidth: 200, align: "center" },
  { id: "role", label: "Role", minWidth: 100, align: "center" },
  {
    id: "edit",
    label: "Edit",
    minWidth: 170,
    align: "center",
  },
  {
    id: "remove",
    label: "Delete",
    minWidth: 170,
    align: "center",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    padding: 8,
  },
  modalBody: {
    backgroundColor: "white",
    height: "calc(100vh - 120px)",
    width: "calc(100% - 400px)",
    margin: "auto",
    borderRadius: 10,
  },
  container: {
    maxHeight: 440,
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const Users = ({ users }) => {
  const classes = useStyles();
  const router = useRouter();
  const { data: res, mutate } = useMe();
  const [user, setUser] = React.useState();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState({
    isOpen: false,
    id: null,
  });
  const [userForm, setUserForm] = React.useState({});
  const [forNewUser, setForNewUser] = React.useState(false);

  React.useLayoutEffect(() => {
    if (!res || res.error) {
      Router.replace("/");
    }
    if (res && res.data) setUser(res.data.name);
  }, [res]);

  if (!res || res.error) {
    return null;
  }

  if (!res || !res.data) return <CircularProgress />;

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const createUser = () => {
    setUserForm({
      name: "",
      password: "",
      role: "",
    });
    setForNewUser(true);
    setIsModalOpen(true);
  };

  const editUser = (user) => {
    setUserForm({
      id: user._id,
      name: user.name,
      password: "",
      role: user.role,
    });
    setForNewUser(false);
    setIsModalOpen(true);
  };

  const deleteUser = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(res.status);
      }
      refreshData();
      return res;
    } catch (error) {
      setDeleteMessage("Failed to delete user");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <TopBar />
      <div style={{ padding: "40px 60px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Fab
            color="primary"
            aria-label="create-user"
            style={{ marginBottom: 30 }}
            onClick={() => createUser()}
          >
            <AddIcon />
          </Fab>
        </div>

        <Paper className={classes.root} style={{ borderRadius: 12 }}>
          <TableContainer
            className={classes.container}
            style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={user._id}
                      >
                        <TableCell align="center">{user.name}</TableCell>
                        <TableCell align="center">{user.role}</TableCell>
                        <TableCell align="center">
                          <Fab
                            size="small"
                            color="primary"
                            aria-label="edit-button"
                            onClick={() => editUser(user)}
                          >
                            <EditIcon />
                          </Fab>
                        </TableCell>
                        <TableCell align="center">
                          {confirmation.id !== user._id && (
                            <Fab
                              size="small"
                              color="secondary"
                              aria-label="delete-button"
                              disabled={user.role === "admin"}
                              onClick={() =>
                                setConfirmation({ open: true, id: user._id })
                              }
                            >
                              <DeleteIcon />
                            </Fab>
                          )}
                          {confirmation.open && confirmation.id === user._id && (
                            <>
                              <span>Are you sure?</span>
                              <div>
                                <IconButton
                                  className={classes.button}
                                  onClick={() =>
                                    setConfirmation({ open: false, id: null })
                                  }
                                >
                                  <HighlightOffIcon
                                    color="secondary"
                                    style={{ fontSize: 28 }}
                                  />
                                </IconButton>
                                <IconButton
                                  className={classes.button}
                                  onClick={() => {
                                    deleteUser(user._id);
                                    setConfirmation({ open: false, id: null });
                                  }}
                                >
                                  <CheckIcon
                                    color="primary"
                                    style={{ fontSize: 28 }}
                                  />
                                </IconButton>
                              </div>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      <Modal isOpen={isModalOpen} onModalClose={() => setIsModalOpen(false)}>
        <div className={classes.modalBody}>
          <UserForm
            userForm={userForm}
            forNewUser={forNewUser}
            onCompleted={() => {
              refreshData();
              setIsModalOpen(false);
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export async function getServerSideProps() {
  await dbConnect();

  const result = await User.find({});
  const users = result.map((doc) => {
    const user = doc.toObject();
    user._id = user._id.toString();
    return user;
  });

  return { props: { users: users } };
}

export default Users;

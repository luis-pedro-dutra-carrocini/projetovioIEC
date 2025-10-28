import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import api from "../axios/axios";
import { Button, IconButton, Alert, Snackbar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDelete from "../components/ConfirmDelete";

function listUsers() {
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const navigate = useNavigate();

  const [userToDelete, setUserToDelete] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Função para exibir o alerta
  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  // Fechar o alerta
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const openDeleteModal = (id, name) => {
    setUserToDelete({ id: id, name: name });
    setModalOpen(true);
  };

  async function getUsers() {
    try {
      const response = await api.getUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
      showAlert("error", "Erro ao buscar usuários");
    }
  }

  async function deleteUser() {
    try {
      await api.deleteUser(userToDelete.id);
      await getUsers();
      showAlert("success", "Usuário excluído com sucesso!");
      setModalOpen(false)
    } catch (error) {
      console.error("Erro ao deletar usuário", error);
      showAlert("error", error.response.data.error);
      setModalOpen(false)
    }
  }

  const listUsers = users.map((user) => (
    <TableRow key={user.id_usuario}>
      <TableCell align="center">{user.name}</TableCell>
      <TableCell align="center">{user.email}</TableCell>
      <TableCell align="center">{user.cpf}</TableCell>
      <TableCell align="center">
        <IconButton onClick={() => openDeleteModal(user.id_usuario,user.name)}>
          <DeleteIcon color="error" />
        </IconButton>
      </TableCell>
    </TableRow>
  ));

  function eventos() {
    //localStorage.removeItem("authenticated");
    navigate("/events");
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <ConfirmDelete
      open={modalOpen}
      userName={userToDelete.name}
      onConfirm={deleteUser}
      onClose={()=>setModalOpen(false)}
      />
      {users.length === 0 ? (
        <h1>Carregando usuários</h1>
      ) : (
        <div>
          <h5>Lista de usuários</h5>
          <TableContainer component={Paper} style={{ margin: "2px" }}>
            <Table size="small">
              <TableHead
                style={{ backgroundColor: "brown", borderStyle: "solid" }}
              >
                <TableRow>
                  <TableCell align="center">Nome</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">CPF</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{listUsers}</TableBody>
            </Table>
          </TableContainer>
          <Button fullWidth variant="contained" onClick={eventos}>
            Ir para eventos
          </Button>
        </div>
      )}
    </div>
  );
}
export default listUsers;

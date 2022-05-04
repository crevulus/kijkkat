import { useUserStore } from "../../data/store";
import { useNavigate, useLocation } from "react-router-dom";
import { NavigationRoutes } from "../../data/enums";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grow,
} from "@mui/material";

export const SignInDialog = ({ showAlert, setShowAlert, message }: any) => {
  const isSignedIn = useUserStore((state) => state.isSignedIn);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRedirect = () => {
    if (!isSignedIn) {
      navigate(NavigationRoutes.Account, {
        state: { path: location.pathname },
      });
    }
  };

  return (
    <Dialog
      open={showAlert}
      onClose={() => setShowAlert(false)}
      TransitionComponent={Grow}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Uh oh, you need to be signed in to do that...</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          You can {message} to your heart's content once we know who you are.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRedirect} variant="outlined">
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

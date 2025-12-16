import { useDispatch, useSelector } from "react-redux";
import { loginAsync, logoutAsync, registerAsync } from "../store/auth/authSlice";

export function useAuth() {
    const dispatch = useDispatch();

    const { user, status, error, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    return {
        user,
        isAuthenticated,
        status,
        error,
        login: (credentials) => dispatch(loginAsync(credentials)),
        register: (data) => dispatch(registerAsync(data)),
        logout: () => dispatch(logoutAsync()),
    };
}

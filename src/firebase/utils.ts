import firebase from "./admin-config";

export const createNewUserInFirebase = async (email: string, password: string): Promise<void> => {
    await firebase
        .auth()
        .createUser({ email, password });
}

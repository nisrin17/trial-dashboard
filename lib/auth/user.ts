import crypto from 'crypto';
import { findUsername } from "../../pages/api/auth/list";
import * as bcrypt from "bcryptjs";

/**
 * User methods. The example doesn't contain a DB, but for real applications you must use a
 * db here, such as MongoDB, Fauna, SQL, etc.
 */

interface IUser {
  username: string;
  name: string;
  password: string;
  accessId: number;
  role: string;
}

const users: any = []

// Here you should lookup for the user in your DB
export async function findUser({username}: {username: string}) {
    const findUser = await findUsername(username);
    if (findUser) {
        return {
            username: findUser.username,
            name: findUser.fullname,
            password: findUser.password,
            accessId: findUser.accessId,
            role: findUser.access?.description
        } as IUser
    }

  return null
}

// Compare the password of an already fetched user (using `findUser`) and compare the
// password for a potential match
export function validatePassword(user: IUser, inputPassword: string) {
   const passwordsMatch = bcrypt.compareSync(inputPassword, user.password)
  return passwordsMatch
}
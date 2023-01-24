import { UsersApi as UsersApiI } from './user/api';
import {
  PractitionersApi as PractitionersApiI,
  ProfilesApi as ProfileApiI,
} from './profile/api';
import 'dotenv/config';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import axios, { AxiosInstance } from 'axios';

export const axiosInstance: AxiosInstance = axios.create({});

axiosInstance.interceptors.request.use(async function (config) {
  const currentAccessToken =
    axiosInstance.defaults.headers.common['Authorization'];
  if (currentAccessToken) {
    const parsedToken: JwtPayload = jwtDecode(
      ('' + currentAccessToken).split(' ')[1],
    );
    // if token expires in more than one minute, return
    if (parsedToken.exp - Math.floor(Date.now() / 1000) > 60) {
      return config;
    }
  }
  const token = await getAccessToken();
  config.headers.authorization = 'Bearer ' + token;
  return config;
});

export const UsersApi = new UsersApiI(
  undefined,
  process.env.USER_API_BASE,
  axiosInstance,
);
export const PractitionersApi = new PractitionersApiI(
  undefined,
  process.env.PROFILE_API_BASE,
  axiosInstance,
);
export const ProfilesApi = new ProfileApiI(
  undefined,
  process.env.PROFILE_API_BASE,
  axiosInstance,
);

async function getAccessToken() {
  const data = new URLSearchParams();
  data.append('grant_type', 'password');
  data.append('client_id', process.env.KEYCLOAK_CLIENT);
  data.append('client_secret', process.env.KEYCLOAK_SECRET);
  data.append('username', process.env.KEYCLOAK_ADMIN_USER);
  data.append('password', process.env.KEYCLOAK_ADMIN_PASS);
  const requestData = await axios.post(
    `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
    data,
  );
  axiosInstance.defaults.headers.common['Authorization'] =
    'Bearer ' + requestData.data.access_token;

  return requestData.data.access_token as string;
}

import { OAuth2Client } from "google-auth-library";
import { config } from "./env";

const googleClient = new OAuth2Client(config.googleClientId);

export default googleClient;
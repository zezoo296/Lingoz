import { Resend } from "resend";
import { config } from "./env";

const resend = new Resend(config.resendApiKey);

export default resend;

import { DeepLClient } from "deepl-node";
import { config } from "./env";

const translator = new DeepLClient(config.deeplKey);

export default translator;

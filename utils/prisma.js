import { PrismaClient } from "@prisma/client";
import { logger } from "./logger.js";

export const prismaI = new PrismaClient();
logger.info('utils/prisma.js - create prisma client');

//export default prismaI;
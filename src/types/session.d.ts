import { SessionData } from 'express-session';
import { Request } from 'express';

declare module 'express-session' {
  interface SessionData {
    user?: { email: string; uid?: string; isAdmin?: boolean };
  }
}

declare module 'express' {
  interface Request {
    session: SessionData;
  }
}

import { Member } from '../members/schemas/member.schema';
import * as express from 'express';
declare global {
  namespace Express {
    interface Request {
      user?: Member; 
    }
  }
}
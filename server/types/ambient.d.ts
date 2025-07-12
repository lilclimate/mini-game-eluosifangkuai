declare module 'express';
declare module 'mongoose';
declare module 'body-parser';
declare module 'cors';

declare var process: {
    env: { [key: string]: string | undefined };
};

import PersonalNotes from './PersonalNotes';
const {
    ACCESS_KEY,
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USER,
    DATABASE_PASS,
    DATABASE_NAME,
} = process.env;
const app = new PersonalNotes(
    ACCESS_KEY,
    DATABASE_HOST,
    Number(DATABASE_PORT),
    DATABASE_USER,
    DATABASE_PASS,
    DATABASE_NAME
);

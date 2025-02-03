export const config = {
  PORT: 3000,
  MONGO_URL:
    'mongodb+srv://amdelavegalic:f88KnnpvGQQZO1nk@cluster-backend.skc6j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-backend',
  DB_NAME: 'backend2',
  SECRET: 'Coder123',
  GITHUB: {
    CALLBACK: 'http://localhost:3000/api/sessions/callbackGithub',
    CLIENT_ID: 'Iv23li6cIUxOdVuTMZBJ',
    CLIENT_SECRET: '2f6523975a3184e29a6a8601e12acf1eb7e4c55d',
  },
};

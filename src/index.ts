import { main } from './app'

const port = process.env.PORT || 8000;

const start = async () => {
  const server = await main();
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}


start()
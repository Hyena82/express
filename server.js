const app = require("./src/app");
const PORT = 8000;

const server = app.listen(PORT, () => {
  console.log(`Server started at: ${PORT}`);
});

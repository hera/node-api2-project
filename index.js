const express = require("express");
const postsRouter = require("./posts/postsRouter");

const PORT = 8000;
const ADDRESS = "127.0.0.1";


const server = express();


server.use("/api/posts", postsRouter);


server.listen(PORT, ADDRESS, () => console.log("Server is working..."));
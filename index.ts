import "expo-router/entry";
import { createServer, Response, Server } from "miragejs";

declare global {
  interface Window {
    server?: Server;
  }
}

if (__DEV__) {
  if (window.server) {
    window.server.shutdown();
  }

  window.server = createServer({
    routes() {
      this.post("/login", (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);

        if (username === "ooooohsu" && password === "password") {
          return {
            accessToken: "access-token",
            refreshToken: "refresh-token",
            user: {
              id: "ooooohsu",
            },
          };
        } else {
          return new Response(
            401,
            { "Content-Type": "application/json" },
            { message: "Invalid credentials" }
          );
        }
      });
    },
  });
}

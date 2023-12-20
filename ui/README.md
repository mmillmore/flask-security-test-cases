#Example Flask Security SPA

To run the app, do the following;

1. Create a file `./server/.env`
1. Add entries for GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, corresponding to your oauth server IDs
1. in ./server, run `poetry install` then `flask run -p5010`
1. in ./ui, run `npm install` then `npx vite --port 4000`
1. go to http://localhost:4000/


You will need to make sure your google oauth server has the correct redirect url set
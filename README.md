# rebel_client
[Rebel Coding Test - React Client](https://nelsonkim-rebel.netlify.app/)

## Implementation

This is a simple one page React app that connects to and displays the data from [https://github.com/accpi/rebel_server](rebel_server).

I decided to use [react-table](https://www.npmjs.com/package/react-table) to display the data, I haven't used this package before so it'd seemed to be an interesting thing to try; this package is very powerful and useful to display data. A lot of the functionality (sorting, filtering) is easily replicated by simple JavaScript functions, but this packages it all in one bundle, which was lovely (but also interesting since access fields + compution + custom rendering wasn't so easily found at first).

I planned to put in the functionality to do the whole CRUD suite, but I would want to put a delete option within an artist's detail page, so that isn't currently added. It could also be done in a modal, but that's a choice I made for this demo. The functionality displayed does demonstrate the ability of the API and using Postman to run a DELETE request will show that it's working.

This web app is minimally responsive, and the CSS is quite basic, no fancy libraries or SASS, but it works(-ish)!

This server is hosted on Heroku [https://rebel-server.herokuapp.com/](https://rebel-server.herokuapp.com/) and doesn't feature any sort of access security, which could easily be added by grabbing a login and recieving a token (like JWT) that would be sent and verified on every request through simple middleware.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app; open [http://localhost:3000](http://localhost:3000) to view it in the browser. This app connects to the Heroku API, but you can get the server to run and edit from [https://github.com/accpi/rebel_server](rebel_server).

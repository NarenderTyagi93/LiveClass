# Simple Live Class Environment Node Server

This is a Node/Express based rest API server.

## Installation

Use the package manager [npm](https://www.npmjs.com/) or [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) to install this server.

```bash
cp ./sampleEnv.txt ./.env
npm i/yarn
npm run start/yarn start
```

## tool used to test socket events

[Add local server url with userId in query](https://amritb.github.io/socketio-client-tool)

```
eg: socket.io server url : http://localhost:4000
socket.io options json : {"query":{"userId":"5fa2e71c676ded78cd943244"}}

Add listioning events and throw emit with data eg:
{"action":"join_room","roomId":"5fa2e71c676ded78cd943245"}
{"action":"start_class","roomId":"5fa2e71c676ded78cd943245"}
{"action":"leave_room","roomId":"5fa2e71c676ded78cd943245"}
{"action":"end_class","roomId":"5fa2e71c676ded78cd943245"}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

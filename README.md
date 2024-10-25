# C2 project 2024 PA1414

## description

The purpose of this project is to create a C2 application. The application allows administrators to monitor and interact with multiple endpoint devices, including retrieving device information, file transfer system and monitoring device status. 

## How to use

### Prerequisites

Have Ubuntu or another linux operating system 


### build

```py
# open a terminal
# Ensure Git is installed

#clone the repository
git clone https://github.com/SandyN19/c2.git

# Navigate to c2

cd c2

# This command chould download all the required packages in order to run this program.

Run npm install

```
### Run

#### Server

The server is run by `node app.js`

#### client

The client can be run with `pm2 'npx nw .' --name client`

Giving the client a name makes it possible to stop the client with `pm2 stop client` and also to restart it with `pm2 restart client`.

#### Command line enviroment

It is possible to run `node cli.js` to view information about the device and request to be readded to the watchlist if the device is not already on it. 

`sudo node cli.js` makes it possible for admins to view all devices, add/remove devices and view devices asking to be readded.

#### Web

Access upload/download as admin through `localhost:1337/admin`.
Login with admin and admin123.

To download a file from client `localhost:1337/download/:clientid`.

#### Test

besides testing by user I currently only implented 1 jest test.

It can be run by `npm test`.

## License

MIT License

Copyright (c) 2024 Sandy Nguyen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.